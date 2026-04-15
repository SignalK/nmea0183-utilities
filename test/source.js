var chai = require('chai')
var expect = chai.expect
var utils = require('../index')

describe('Source', function () {
  it('Should be an object', function (done) {
    expect(utils.source('VDM')).to.be.an('object')
    done()
  })

  it('Should have keys "type", "label" and "sentence"', function (done) {
    expect(utils.source('VDM')).to.have.a.property('type')
    expect(utils.source('VDM')).to.have.a.property('label')
    expect(utils.source('VDM')).to.have.a.property('sentence')
    done()
  })

  it('Sentence should equal "VDM"', function (done) {
    expect(utils.source('VDM').sentence).to.equal('VDM')
    done()
  })

  // Pin the literal type and label values — these feed downstream
  // signal-k source metadata and must not be silently mutated.
  it('type should equal "NMEA0183"', function (done) {
    expect(utils.source('VDM').type).to.equal('NMEA0183')
    done()
  })

  it('label should equal "signalk-parser-nmea0183"', function (done) {
    expect(utils.source('VDM').label).to.equal('signalk-parser-nmea0183')
    done()
  })

  // sentence defaults to empty string when the argument is missing.
  it('sentence defaults to empty string when argument is omitted', function (done) {
    expect(utils.source().sentence).to.equal('')
    expect(utils.source(undefined).sentence).to.equal('')
    expect(utils.source(null).sentence).to.equal('')
    done()
  })
})
