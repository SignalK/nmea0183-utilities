var chai    = require("chai");
var expect  = chai.expect;
var utils   = require('../index');

describe('Timestamp', function() {
  var value = utils.timestamp('220104', '171089');

  it('Should be a string', function(done) {
    expect(value).to.be.a('string');
    done();
  });

  it('Should equal 1989-10-17T22:01:04.000Z', function(done) {
    expect(value).to.equal('1989-10-17T22:01:04.000Z');
    done();
  });
});