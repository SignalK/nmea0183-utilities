var chai    = require("chai");
var expect  = chai.expect;
var utils   = require('../');

describe('Magnetic Variation', function() {
  var N = utils.magneticVariaton(1, 'N');
  var S = utils.magneticVariaton(1, 'S');
  var E = utils.magneticVariaton(1, 'E');
  var W = utils.magneticVariaton(1, 'S');

  it('N should be a positive number', function(done) {
    expect(N).to.be.a('number');
    expect(N).to.be.above(0);
    done();
  });

  it('S should be a negative number', function(done) {
    expect(S).to.be.a('number');
    expect(S).to.be.below(0);
    done();
  });

  it('E should be a positive number', function(done) {
    expect(E).to.be.a('number');
    expect(E).to.be.above(0);
    done();
  });

  it('W should be a negative number', function(done) {
    expect(W).to.be.a('number');
    expect(W).to.be.below(0);
    done();
  });
});
