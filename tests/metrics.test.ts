import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatPercent, percent, percentParts, share, statusBreakdown } from '../src/lib/metrics.ts'
import type { CollectionLog, LogStatus } from '../src/types/domain.ts'

const log = (status: LogStatus, i = 0): CollectionLog => ({ id: `L${i}`, address: 'a', sector: 'A', status, createdAt: 0 })

test('share: undefined (null) when there is nothing to divide or the input is invalid', () => {
  assert.equal(share(0, 0), null)
  assert.equal(share(3, 0), null)
  assert.equal(share(NaN, 10), null)
  assert.equal(share(1, Infinity), null)
  assert.equal(share(-1, 10), null)
  assert.equal(share(1, -10), null)
})

test('share: a genuine zero stays zero', () => {
  assert.equal(share(0, 10), 0)
  assert.equal(percent(0, 10), 0)
})

test('share: capped at 1 when the part exceeds the total', () => {
  assert.equal(share(12, 10), 1)
})

test('percent: rounds half up to a whole number', () => {
  assert.equal(percent(8, 13), 62) // 61.54
  assert.equal(percent(1, 8), 13) // 12.5
  assert.equal(percent(1, 3), 33)
})

test('percentParts: whole percentages always sum to 100', () => {
  assert.deepEqual(percentParts([8, 3, 2]), [62, 23, 15])
  assert.deepEqual(percentParts([1, 1, 1]), [34, 33, 33])
  assert.deepEqual(percentParts([2, 2, 2, 1]), [29, 29, 28, 14])
  for (const parts of [[1, 1, 1], [7, 0, 6], [1, 2, 3, 4, 5, 6, 7], [999, 1, 0]]) {
    assert.equal(percentParts(parts)!.reduce((a, b) => a + b, 0), 100)
  }
})

test('percentParts: null for empty, all-zero or invalid input', () => {
  assert.equal(percentParts([]), null)
  assert.equal(percentParts([0, 0, 0]), null)
  assert.equal(percentParts([1, NaN, 2]), null)
  assert.equal(percentParts([1, -1, 2]), null)
})

test('percentParts: zero parts stay at 0 %', () => {
  assert.deepEqual(percentParts([5, 0, 0]), [100, 0, 0])
})

test('formatPercent: unknown shows a dash, never 0 %', () => {
  assert.equal(formatPercent(null), '–')
  assert.equal(formatPercent(0), '0%')
  assert.equal(formatPercent(62), '62%')
})

test('statusBreakdown: counts and percentages over all logs in the set', () => {
  const logs = [...Array(8)].map((_, i) => log('completed', i)).concat([log('pending', 8), log('pending', 9), log('pending', 10), log('missed', 11), log('missed', 12)])
  const b = statusBreakdown(logs)
  assert.equal(b.total, 13)
  assert.deepEqual(b.counts, { completed: 8, pending: 3, missed: 2 })
  assert.deepEqual(b.percents, { completed: 62, pending: 23, missed: 15 })
})

test('statusBreakdown: no logs means no percentages', () => {
  const b = statusBreakdown([])
  assert.equal(b.total, 0)
  assert.equal(b.percents, null)
})

test('statusBreakdown: an unknown status is not counted', () => {
  const b = statusBreakdown([log('completed'), { ...log('completed', 1), status: 'lost' as LogStatus }])
  assert.equal(b.total, 1)
  assert.deepEqual(b.percents, { completed: 100, pending: 0, missed: 0 })
})
