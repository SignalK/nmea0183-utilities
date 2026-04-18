import { expect } from 'chai'
import * as utils from '../src/index'
import type { Pole } from '../src/index'

describe('Magnetic Variation', function () {
  const N = utils.magneticVariation(1, 'N')
  const S = utils.magneticVariation(1, 'S')
  const E = utils.magneticVariation(1, 'E')
  const W = utils.magneticVariation(1, 'W')

  it('N should be a positive number', function (done) {
    expect(N).to.be.a('number')
    expect(N).to.be.above(0)
    done()
  })

  it('S should be a negative number', function (done) {
    expect(S).to.be.a('number')
    expect(S).to.be.below(0)
    done()
  })

  it('E should be a positive number', function (done) {
    expect(E).to.be.a('number')
    expect(E).to.be.above(0)
    done()
  })

  it('W should be a negative number', function (done) {
    expect(W).to.be.a('number')
    expect(W).to.be.below(0)
    done()
  })

  // Lowercase and other bogus pole letters throw. 1.0 dropped the runtime
  // `.toUpperCase()` that used to paper over JS callers violating the
  // `Pole` type; the failure mode for a southern-hemisphere sentence
  // passed as `'s'` would be a silent wrong-sign result.
  it('throws on lowercase pole letters', function (done) {
    expect(function () {
      utils.magneticVariation(1, 's' as Pole)
    }).to.throw(/unsupported pole: s/)
    done()
  })

  it('throws on unknown pole letters', function (done) {
    expect(function () {
      utils.magneticVariation(1, 'X' as Pole)
    }).to.throw(/unsupported pole: X/)
    done()
  })
})
