import { expect } from 'chai'
import utils, * as named from '../src/index'

// Asserts the default export aggregate is shape-complete and that every
// key is the same reference as the corresponding named export. Without
// this test Stryker can wipe `export default { ... }` to `export default {}`
// and no other test notices.
describe('default export', function () {
  it('exposes every named function', function (done) {
    expect(utils.valid).to.equal(named.valid)
    expect(utils.appendChecksum).to.equal(named.appendChecksum)
    expect(utils.source).to.equal(named.source)
    expect(utils.transform).to.equal(named.transform)
    expect(utils.magneticVariation).to.equal(named.magneticVariation)
    expect(utils.timestamp).to.equal(named.timestamp)
    expect(utils.coordinate).to.equal(named.coordinate)
    expect(utils.isValidPosition).to.equal(named.isValidPosition)
    expect(utils.zero).to.equal(named.zero)
    expect(utils.int).to.equal(named.int)
    expect(utils.float).to.equal(named.float)
    expect(utils.intOrNull).to.equal(named.intOrNull)
    expect(utils.floatOrNull).to.equal(named.floatOrNull)
    expect(utils.transformOrNull).to.equal(named.transformOrNull)
    expect(utils.magneticVariationOrNull).to.equal(
      named.magneticVariationOrNull
    )
    done()
  })

  it('exposes the RATIOS table', function (done) {
    expect(utils.RATIOS).to.equal(named.RATIOS)
    expect(utils.RATIOS.NM_IN_KM).to.equal(1.852)
    done()
  })

  it('callable through the default export', function (done) {
    expect(utils.transform(1, 'km', 'nm')).to.equal(
      named.transform(1, 'km', 'nm')
    )
    expect(
      utils.valid(
        '!GPGGA,000000.00,5253.164,N,00539.655,E,0,00,99.9,,M,,M,,*6F'
      )
    ).to.equal(true)
    done()
  })
})
