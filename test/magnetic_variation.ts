import { expect } from 'chai'
import * as utils from '../src/index'

describe('Magnetic Variation', function () {
  const N = utils.magneticVariaton(1, 'N')
  const S = utils.magneticVariaton(1, 'S')
  const E = utils.magneticVariaton(1, 'E')
  const W = utils.magneticVariaton(1, 'S')

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

  // The original export name 'magneticVariaton' is a long-standing typo.
  // 'magneticVariation' is the canonical spelling; both should resolve
  // to the same implementation for the lifetime of the deprecation.
  it('magneticVariation is exported as an alias for magneticVariaton', function (done) {
    expect(utils.magneticVariation).to.be.a('function')
    expect(utils.magneticVariation).to.equal(utils.magneticVariaton)
    done()
  })

  it('magneticVariation(1, "N") returns a positive number', function (done) {
    const n = utils.magneticVariation(1, 'N')
    expect(n).to.be.a('number')
    expect(n).to.be.above(0)
    done()
  })

  it('magneticVariation(1, "W") returns a negative number', function (done) {
    const w = utils.magneticVariation(1, 'W')
    expect(w).to.be.a('number')
    expect(w).to.be.below(0)
    done()
  })
})
