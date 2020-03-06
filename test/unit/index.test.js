const {
  filters,
  getUnitText,
  default: defaultFullText,
} = require('../../src')
const Formatter = require('../../src/core/instance').default
test('getUnitText 18 ', () => {
  //12+4+2
  expect(getUnitText(18)).toBe('百万兆')
})

test('getUnitText -1 ', () => {

  expect(getUnitText(-1)).toBe('')
})

test('getUnitText 42 ', () => {
  //12+12+12+4+2
  expect(getUnitText(42)).toBe('百万兆兆兆')
})




test('create a default instance ', () => {
  const formatter = new Formatter()
  expect(formatter.getUnitText(18)).toBe('百万兆')
})

test('number test  4545765.874500006', () => {
  expect(defaultFullText(4545765.874500006)).toBe('4545765.87')
})

test('number test  45452765.874500006', () => {
  expect(defaultFullText(45452765.874500006)).toBe('4545.28万')
})

test('number test 4545232765.874500006 ', () => {
  expect(defaultFullText(4545232765.874500006)).toBe('45.45亿')
})

test('string number test 4545232765.874500006 ', () => {
  expect(defaultFullText('4545232765.874500006')).toBe('45.45亿')
})
