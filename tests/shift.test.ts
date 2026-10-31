import { test } from 'node:test'
import assert from 'node:assert/strict'
import { format12, formatDuration, isOvernight, shiftDuration, shiftProblem, shiftWindow, toMinutes } from '../src/lib/shift.ts'

const at = (h: number, m = 0) => new Date(2026, 9, 31, h, m).getTime()

test('toMinutes: only valid 24-hour HH:MM', () => {
  assert.equal(toMinutes('06:00'), 360)
  assert.equal(toMinutes('23:59'), 1439)
  assert.equal(toMinutes('24:00'), null)
  assert.equal(toMinutes('6:00'), null)
  assert.equal(toMinutes(''), null)
})

test('shiftProblem: same rules as setShiftTiming', () => {
  assert.equal(shiftProblem({ start: '06:00', end: '18:00' }), null)
  assert.equal(shiftProblem({ start: '06:00', end: '06:00' }), 'same')
  assert.equal(shiftProblem({ start: '', end: '18:00' }), 'format')
  assert.equal(shiftProblem({ start: '22:00', end: '06:00' }), null) // overnight is allowed
})

test('shiftDuration: day and overnight shifts', () => {
  assert.equal(shiftDuration({ start: '06:00', end: '18:00' }), 720)
  assert.equal(shiftDuration({ start: '22:00', end: '06:00' }), 480)
  assert.equal(shiftDuration({ start: '07:15', end: '15:45' }), 510)
  assert.equal(shiftDuration({ start: '06:00', end: '06:00' }), null)
})

test('isOvernight', () => {
  assert.equal(isOvernight({ start: '22:00', end: '06:00' }), true)
  assert.equal(isOvernight({ start: '06:00', end: '18:00' }), false)
  assert.equal(isOvernight({ start: '06:00', end: '06:00' }), false)
})

test('shiftWindow: day shift', () => {
  const s = { start: '06:00', end: '18:00' }
  assert.deepEqual(shiftWindow(s, at(5, 30)), { state: 'outside', startsIn: 30 })
  assert.deepEqual(shiftWindow(s, at(6, 0)), { state: 'within', endsIn: 720 })
  assert.deepEqual(shiftWindow(s, at(17, 59)), { state: 'within', endsIn: 1 })
  assert.deepEqual(shiftWindow(s, at(18, 0)), { state: 'outside', startsIn: 720 })
})

test('shiftWindow: overnight shift spans midnight', () => {
  const s = { start: '22:00', end: '06:00' }
  assert.deepEqual(shiftWindow(s, at(23, 0)), { state: 'within', endsIn: 420 })
  assert.deepEqual(shiftWindow(s, at(2, 0)), { state: 'within', endsIn: 240 })
  assert.deepEqual(shiftWindow(s, at(12, 0)), { state: 'outside', startsIn: 600 })
})

test('shiftWindow: invalid timing', () => {
  assert.deepEqual(shiftWindow({ start: '06:00', end: '06:00' }, at(9)), { state: 'invalid' })
})

test('formatDuration and format12', () => {
  assert.equal(formatDuration(720), '12 h')
  assert.equal(formatDuration(510), '8 h 30 min')
  assert.equal(formatDuration(45), '45 min')
  assert.equal(format12('06:00'), '06:00 AM')
  assert.equal(format12('18:00'), '06:00 PM')
  assert.equal(format12('00:05'), '12:05 AM')
  assert.equal(format12('12:00'), '12:00 PM')
  assert.equal(format12('bad'), 'bad')
})
