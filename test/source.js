var chai    = require("chai");
var expect  = chai.expect;
var utils   = require('../index');

describe('Source', function() {
  it('Should be an object', function(done) {
    expect(utils.source('VDM')).to.be.an('object');
    done();
  });

  it('Should have keys "type", "label" and "sentence"', function(done) {
    expect(utils.source('VDM')).to.have.a.property('type');
    expect(utils.source('VDM')).to.have.a.property('label');
    expect(utils.source('VDM')).to.have.a.property('sentence');
    done();
  });

  it('Sentence should equal "VDM"', function(done) {
    expect(utils.source('VDM').sentence).to.equal('VDM');
    done();
  });
});