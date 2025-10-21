var chai = require('chai')
var expect = chai.expect
var utils = require('../index')

describe('Timestamp', function () {
  var value = utils.timestamp('220104', '171019')

  it('Should be a string', function (done) {
    expect(value).to.be.a('string')
    done()
  })

  it('Should equal 2019-10-17T22:01:04.000Z', function (done) {
    expect(value).to.equal('2019-10-17T22:01:04.000Z')
    done()
  })

  it('Returns current date and time when passing in null,null', function (done) {
    const value = utils.timestamp(null, null)
    const expected = `${new Date().toISOString().slice(0, 10)}T`
    expect(value).to.be.a('string')
    expect(value.startsWith(expected)).to.be.true
    done()
  })

  it('Should handle malformed dates to the best of its ability', function (done) {
    // $GPRMC,210735.00,A,1547\x0E70800,S,14506.50460,W,0.187,10.33,110925\f12.49,E,A*3E
    const value = utils.timestamp('210735.00', '110925\f12.49')
    const expected = '2025-09-11T21:07:35.000Z'
    expect(value).to.be.a('string')
    expect(value).to.equal(expected)
    done()
  })
})
