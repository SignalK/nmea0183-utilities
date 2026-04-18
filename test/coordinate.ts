import { expect } from 'chai'
import * as utils from '../src/index'
import type { Pole } from '../src/index'

describe('Coordinate', function () {
  const N = utils.coordinate('5222.3277', 'N')
  const W = utils.coordinate('454.5824', 'W')

  it('Should be a string', function (done) {
    expect(N).to.be.a('number')
    expect(W).to.be.a('number')
    done()
  })

  it('N should equal 52.372128333333336', function (done) {
    expect(N).to.equal(52.372128333333336)
    done()
  })

  it('W should equal -4.909706666666667', function (done) {
    expect(W).to.equal(-4.909706666666667)
    done()
  })

  // Single-digit-degree latitude: "454.5824" is 4°54.5824' E.
  it('single-digit degree latitude is parsed correctly', function (done) {
    expect(utils.coordinate('454.5824', 'E')).to.equal(4.909706666666667)
    done()
  })

  // Null Island: both lat and lon are 0.
  it('handles zero coordinates (Null Island)', function (done) {
    expect(utils.coordinate('0.0', 'N')).to.equal(0)
    expect(utils.coordinate('0.0', 'E')).to.equal(0)
    done()
  })

  // Equatorial non-zero longitude.
  it('E near equator: 10000.0000 -> 100°00.0000', function (done) {
    expect(utils.coordinate('10000.0000', 'E')).to.equal(100)
    done()
  })

  // Southern hemisphere produces a negative value.
  it('S pole flips sign', function (done) {
    expect(utils.coordinate('5222.3277', 'S')).to.equal(-52.372128333333336)
    done()
  })

  // Lowercase and bogus pole letters throw (see magnetic_variation.ts
  // for the 1.0 rationale — silent wrong-sign results are worse than
  // a loud failure).
  it('throws on lowercase pole letters', function (done) {
    expect(function () {
      utils.coordinate('5222.3277', 's' as Pole)
    }).to.throw(/unsupported pole: s/)
    done()
  })

  it('throws on unknown pole letters', function (done) {
    expect(function () {
      utils.coordinate('5222.3277', 'X' as Pole)
    }).to.throw(/unsupported pole: X/)
    done()
  })
})
