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

  // Pin the current subsecond-truncation behavior. NMEA time fields carry
  // hundredths (e.g. "173456.75"), but `time.slice(4, 6)` only picks up
  // the integer seconds. The ISO output reports whole seconds with .000
  // milliseconds. If a future change starts preserving hundredths, this
  // test will fail and force a conscious decision.
  it('truncates fractional seconds (documents current behavior)', function (done) {
    const value = utils.timestamp('173456.75', '050426')
    expect(value).to.equal('2026-04-05T17:34:56.000Z')
    done()
  })

  it('passing only time uses todays UTC date', function (done) {
    const today = new Date().toISOString().slice(0, 10)
    const value = utils.timestamp('120000', null)
    expect(value.slice(0, 10)).to.equal(today)
    expect(value.slice(11, 19)).to.equal('12:00:00')
    done()
  })
})
