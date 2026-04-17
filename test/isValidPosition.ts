import { expect } from 'chai'
import * as utils from '../src/index'

describe('IsValidPosition', function () {
  it('Should return "true" for valid latitude and longitude', function (done) {
    expect(utils.isValidPosition(11, 22)).to.be.true
    expect(utils.isValidPosition(90, 1)).to.be.true
    expect(utils.isValidPosition(-90, 1)).to.be.true
    expect(utils.isValidPosition(1, 180)).to.be.true
    expect(utils.isValidPosition(1, -180)).to.be.true
    done()
  })

  it('Should return "false" for invalid latitude or longitude', function (done) {
    testInvalidValue(null)
    testInvalidValue(undefined)
    testInvalidValue('foo11')
    testInvalidValue('11')
    done()
  })

  it('Should return "false" for latitude out of range', function (done) {
    expect(utils.isValidPosition(91, 1)).to.be.false
    expect(utils.isValidPosition(-91, 1)).to.be.false
    done()
  })

  it('Should return "false" for longitude out of range', function (done) {
    expect(utils.isValidPosition(1, 181)).to.be.false
    expect(utils.isValidPosition(1, -181)).to.be.false
    done()
  })

  // `typeof NaN === 'number'` is true and `Math.abs(NaN) > 90` is false,
  // so the old guard let NaN positions through as valid.
  it('Should return "false" when latitude or longitude is NaN', function (done) {
    expect(utils.isValidPosition(NaN, 0)).to.be.false
    expect(utils.isValidPosition(0, NaN)).to.be.false
    expect(utils.isValidPosition(NaN, NaN)).to.be.false
    done()
  })

  it('Should return "false" when latitude or longitude is Infinity', function (done) {
    expect(utils.isValidPosition(Infinity, 0)).to.be.false
    expect(utils.isValidPosition(-Infinity, 0)).to.be.false
    expect(utils.isValidPosition(0, Infinity)).to.be.false
    expect(utils.isValidPosition(0, -Infinity)).to.be.false
    done()
  })
})

function testInvalidValue(invalidValue: unknown): void {
  expect(utils.isValidPosition(invalidValue, 22)).to.be.false
  expect(utils.isValidPosition(11, invalidValue)).to.be.false
  expect(utils.isValidPosition(invalidValue, invalidValue)).to.be.false
}
