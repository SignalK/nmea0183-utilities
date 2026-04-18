import { expect } from 'chai'
import * as utils from '../src/index'

describe('Timestamp', function () {
  const value = utils.timestamp('220104', '171019')

  it('Should be a string', function (done) {
    expect(value).to.be.a('string')
    done()
  })

  it('Should equal 2019-10-17T22:01:04.000Z', function (done) {
    expect(value).to.equal('2019-10-17T22:01:04.000Z')
    done()
  })

  it('Returns current date and time when passing in null,null', function (done) {
    const v = utils.timestamp(undefined, undefined)
    const expected = `${new Date().toISOString().slice(0, 10)}T`
    expect(v).to.be.a('string')
    expect(v.startsWith(expected)).to.be.true
    done()
  })

  it('Should handle malformed dates to the best of its ability', function (done) {
    // $GPRMC,210735.00,A,1547\x0E70800,S,14506.50460,W,0.187,10.33,110925\f12.49,E,A*3E
    const v = utils.timestamp('210735.00', '110925\f12.49')
    const expected = '2025-09-11T21:07:35.000Z'
    expect(v).to.be.a('string')
    expect(v).to.equal(expected)
    done()
  })

  // NMEA time fields may carry a fractional tail (e.g. "173456.75" = 750 ms).
  // Fix for SignalK/nmea0183-utilities#36 — previously the tail was dropped
  // and output always ended in .000Z.
  it('preserves fractional seconds as milliseconds', function (done) {
    const v = utils.timestamp('173456.75', '050426')
    expect(v).to.equal('2026-04-05T17:34:56.750Z')
    done()
  })

  it('right-pads a single fractional digit (.2 -> 200 ms)', function (done) {
    const v = utils.timestamp('173456.2', '050426')
    expect(v).to.equal('2026-04-05T17:34:56.200Z')
    done()
  })

  it('truncates beyond millisecond precision (.2567 -> 256 ms)', function (done) {
    const v = utils.timestamp('173456.2567', '050426')
    expect(v).to.equal('2026-04-05T17:34:56.256Z')
    done()
  })

  it('treats a non-digit fractional tail as 0 ms', function (done) {
    const v = utils.timestamp('173456.abc', '050426')
    expect(v).to.equal('2026-04-05T17:34:56.000Z')
    done()
  })

  it('treats an empty fractional tail as 0 ms', function (done) {
    const v = utils.timestamp('173456.', '050426')
    expect(v).to.equal('2026-04-05T17:34:56.000Z')
    done()
  })

  it('passing only time uses todays UTC date', function (done) {
    const today = new Date().toISOString().slice(0, 10)
    const v = utils.timestamp('120000', undefined)
    expect(v.slice(0, 10)).to.equal(today)
    expect(v.slice(11, 19)).to.equal('12:00:00')
    done()
  })

  // 2-digit year interpretation per IEC 61162-1: YY<80 -> 20YY, YY>=80 -> 19YY.
  // 0.x always computed 20YY and so stamped year 2080+ onto archival logs.
  // The four fixed points below pin the boundary, both ends of each century,
  // and make any future off-by-one in the cutoff visible.

  it('YY=00 resolves to year 2000 (lower bound of the 20YY range)', function (done) {
    expect(utils.timestamp('000000', '010100')).to.equal(
      '2000-01-01T00:00:00.000Z'
    )
    done()
  })

  it('YY=79 resolves to year 2079 (upper bound of the 20YY range)', function (done) {
    expect(utils.timestamp('000000', '010179')).to.equal(
      '2079-01-01T00:00:00.000Z'
    )
    done()
  })

  it('YY=80 resolves to year 1980 (lower bound of the 19YY range)', function (done) {
    expect(utils.timestamp('000000', '010180')).to.equal(
      '1980-01-01T00:00:00.000Z'
    )
    done()
  })

  it('YY=99 resolves to year 1999 (upper bound of the 19YY range)', function (done) {
    expect(utils.timestamp('000000', '010199')).to.equal(
      '1999-01-01T00:00:00.000Z'
    )
    done()
  })
})
