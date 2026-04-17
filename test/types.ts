import { expect } from 'chai'
import * as utils from '../src/index'

describe('Types', function () {
  it('Exports.zero(2) should be a string and equal "02"', function (done) {
    expect(utils.zero(2)).to.be.a('string')
    expect(utils.zero(2)).to.be.equal('02')
    done()
  })

  it('Exports.int(2) should be a number and equal 2', function (done) {
    expect(utils.int(2)).to.be.a('number')
    expect(utils.int(2)).to.be.equal(2)
    done()
  })

  it('Exports.integer(2) should be a number and equal 2', function (done) {
    expect(utils.integer(2)).to.be.a('number')
    expect(utils.integer(2)).to.be.equal(2)
    done()
  })

  it('Exports.float(2.1) should be a number and equal 2.1', function (done) {
    expect(utils.float(2.1)).to.be.a('number')
    expect(utils.float(2.1)).to.be.equal(2.1)
    done()
  })

  it('Exports.double("2.2") should be a number and equal 2.2', function (done) {
    expect(utils.float('2.2')).to.be.a('number')
    expect(utils.float('2.2')).to.be.equal(2.2)
    done()
  })

  // zero() is a width-2 left-pad for non-negative numbers used by
  // timestamp formatting. Previous implementation tested `n < 10` and
  // blindly prefixed "0", which produced "0-5" for negatives.
  it('Exports.zero(0) should equal "00"', function (done) {
    expect(utils.zero(0)).to.equal('00')
    done()
  })

  it('Exports.zero(9) should equal "09"', function (done) {
    expect(utils.zero(9)).to.equal('09')
    done()
  })

  it('Exports.zero(10) should equal "10"', function (done) {
    expect(utils.zero(10)).to.equal('10')
    done()
  })

  it('Exports.zero(-5) should equal "-05"', function (done) {
    expect(utils.zero(-5)).to.equal('-05')
    done()
  })

  it('Exports.zero(-15) should equal "-15"', function (done) {
    expect(utils.zero(-15)).to.equal('-15')
    done()
  })

  // zero() handles the n >= 10 branch (no leading zero).
  it('Exports.zero(42) should return "42" without padding', function (done) {
    expect(utils.zero(42)).to.equal('42')
    done()
  })

  it('Exports.zero(100) should return "100" without padding', function (done) {
    expect(utils.zero(100)).to.equal('100')
    done()
  })

  // The empty-string / whitespace path in int/float — previously only
  // exercised through higher-level timestamp parsing.
  it('int returns 0 for empty string and whitespace', function (done) {
    expect(utils.int('')).to.equal(0)
    expect(utils.int('  ')).to.equal(0)
    done()
  })

  it('float returns 0 for empty string and whitespace', function (done) {
    expect(utils.float('')).to.equal(0)
    expect(utils.float('  ')).to.equal(0)
    done()
  })

  // Alias coverage: integer / double mirror int / float.
  it('integer is an alias for int', function (done) {
    expect(utils.integer('42')).to.equal(utils.int('42'))
    done()
  })

  it('double is an alias for float', function (done) {
    expect(utils.double('3.14')).to.equal(utils.float('3.14'))
    done()
  })

  // int/float should never return NaN. The existing empty-string branch
  // returns 0, but null/undefined/non-numeric input previously fell
  // through to parseInt/parseFloat and produced NaN, corrupting
  // downstream numeric fields with no signal.
  it('Exports.int(null) should return 0', function (done) {
    expect(utils.int(null)).to.equal(0)
    done()
  })

  it('Exports.int(undefined) should return 0', function (done) {
    expect(utils.int(undefined)).to.equal(0)
    done()
  })

  it('Exports.int("abc") should return 0', function (done) {
    expect(utils.int('abc')).to.equal(0)
    done()
  })

  it('Exports.int(NaN) should return 0', function (done) {
    expect(utils.int(NaN)).to.equal(0)
    done()
  })

  it('Exports.float(null) should return 0', function (done) {
    expect(utils.float(null)).to.equal(0)
    done()
  })

  it('Exports.float(undefined) should return 0', function (done) {
    expect(utils.float(undefined)).to.equal(0)
    done()
  })

  it('Exports.float("abc") should return 0', function (done) {
    expect(utils.float('abc')).to.equal(0)
    done()
  })

  it('Exports.float(NaN) should return 0', function (done) {
    expect(utils.float(NaN)).to.equal(0)
    done()
  })

  // Regression: valid numeric input must still round-trip.
  it('Exports.int("42") should return 42', function (done) {
    expect(utils.int('42')).to.equal(42)
    done()
  })

  it('Exports.float("3.14") should return 3.14', function (done) {
    expect(utils.float('3.14')).to.equal(3.14)
    done()
  })
})
