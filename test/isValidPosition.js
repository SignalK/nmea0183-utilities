var chai = require('chai')
var expect = chai.expect
var utils = require('../index')

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
})

function testInvalidValue(invalidValue) {
  expect(utils.isValidPosition(invalidValue, 22)).to.be.false
  expect(utils.isValidPosition(11, invalidValue)).to.be.false
  expect(utils.isValidPosition(invalidValue, invalidValue)).to.be.false
}
