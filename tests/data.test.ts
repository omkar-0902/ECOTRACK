import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeCollectors, normalizeLogs, toTimestamp } from '../src/data/normalize.ts'
import { daysBefore, startOfDay, statusSeries } from '../src/lib/series.ts'
import type { CollectionLog } from '../src/types/domain.ts'

test('toTimestamp: epoch ms or ISO strings; anything else is null', () => {
  assert.equal(toTimestamp(1_700_000_000_000), 1_700_000_000_000)
  assert.equal(toTimestamp('2026-10-31T09:00:00Z'), Date.parse('2026-10-31T09:00:00Z'))
  assert.equal(toTimestamp('not a date'), null)
  assert.equal(toTimestamp(null), null)
  assert.equal(toTimestamp(NaN), null)
  assert.equal(toTimestamp(''), null)
})

test('normalizeLogs: keeps valid records, drops invalid ones and counts them', () => {
  const { logs, report } = normalizeLogs([
    { id: 'LOG-1', address: '1 Main St', sector: 'A', status: 'completed', createdAt: 1000 },
    { id: 'LOG-2', address: '2 Main St', sector: 'B', status: 'pending', createdAt: '2026-10-31T09:00:00Z' },
    { id: 'LOG-3', address: '3 Main St', sector: 'A', status: 'lost', createdAt: 1000 }, // unknown status
    { id: 'LOG-4', address: '4 Main St', sector: 'A', status: 'missed', createdAt: null }, // no time
    { address: 'no id', status: 'completed', createdAt: 1000 },
    'garbage',
    null,
  ])
  assert.deepEqual(
    logs.map((l) => l.id),
    ['LOG-1', 'LOG-2'],
  )
  assert.equal(logs[1].createdAt, Date.parse('2026-10-31T09:00:00Z'))
  assert.deepEqual(report, { accepted: 2, rejected: 5, duplicates: 0 })
})

test('normalizeLogs: a later record with the same id replaces the earlier one', () => {
  const { logs, report } = normalizeLogs([
    { id: 'LOG-1', address: 'x', sector: 'A', status: 'pending', createdAt: 1000 },
    { id: 'LOG-1', address: 'x', sector: 'A', status: 'completed', createdAt: 1000 },
  ])
  assert.equal(logs.length, 1)
  assert.equal(logs[0].status, 'completed')
  assert.equal(report.duplicates, 1)
})

test('normalizeLogs: non-array input gives an empty list, not an error', () => {
  assert.deepEqual(normalizeLogs(undefined).logs, [])
  assert.deepEqual(normalizeLogs({}).logs, [])
})

test('normalizeCollectors: online only when explicitly true; invalid positions become null', () => {
  const { collectors, report } = normalizeCollectors([
    { id: 'ECO-C-1', name: 'A', phone: '+1', registeredAt: 1, online: true, position: { lat: 5.6, lng: -0.2 } },
    { id: 'ECO-C-2', name: 'B', phone: '+2', registeredAt: 1, online: 'yes', position: { lat: 200, lng: 0 } },
    { id: 'ECO-C-3', name: '', registeredAt: 1 }, // no name
  ])
  assert.equal(collectors.length, 2)
  assert.equal(collectors[0].online, true)
  assert.deepEqual(collectors[0].position, { lat: 5.6, lng: -0.2 })
  assert.equal(collectors[1].online, false)
  assert.equal(collectors[1].position, null)
  assert.equal(report.rejected, 1)
})

const L = (status: CollectionLog['status'], createdAt: number, i = 0): CollectionLog => ({ id: `L${i}${createdAt}`, address: 'a', sector: 'A', status, createdAt })
const now = new Date(2026, 9, 31, 17, 20).getTime()

test('statusSeries 7d: seven calendar days, counts stacked by status, zero days kept', () => {
  const s = statusSeries([L('completed', now - 3600_000), L('missed', now - 3600_000, 1), L('pending', daysBefore(now, 2) + 3600_000)], '7d', now)
  assert.equal(s.length, 7)
  assert.equal(s[6].key, startOfDay(now))
  assert.deepEqual([s[6].completed, s[6].pending, s[6].missed], [1, 0, 1])
  assert.equal(s[4].pending, 1)
  assert.equal(s.slice(0, 4).every((b) => b.completed + b.pending + b.missed === 0), true)
})

test('statusSeries today: one bucket per hour up to now; future timestamps are not guessed into a bucket', () => {
  const s = statusSeries([L('completed', now - 60_000), L('pending', now + 2 * 3600_000)], 'today', now)
  assert.equal(s.length, 18) // 00:00 to 17:00
  assert.equal(s[17].completed, 1)
  assert.equal(s.reduce((a, b) => a + b.pending, 0), 0)
})

test('statusSeries all: from the earliest log day to today', () => {
  const s = statusSeries([L('completed', daysBefore(now, 9) + 1000)], 'all', now)
  assert.equal(s.length, 10)
  assert.equal(s[0].completed, 1)
})

test('statusSeries: no logs gives empty buckets for the range (the chart shows its empty state)', () => {
  assert.equal(statusSeries([], '30d', now).length, 30)
  assert.equal(statusSeries([], 'all', now).length, 1)
})
