var chai = require('chai')
var expect = chai.expect
var utils = require('../index')

describe('Coordinate', function () {
  var N = utils.coordinate('5222.3277', 'N')
  var W = utils.coordinate('454.5824', 'W')

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
})
