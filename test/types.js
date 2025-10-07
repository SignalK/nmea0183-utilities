var chai = require('chai')
var expect = chai.expect
var utils = require('../index')

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
})
