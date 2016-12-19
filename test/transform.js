var chai    = require("chai");
var expect  = chai.expect;
var utils   = require('../index');

describe('Transform', function() {
  it('KM -> NM', function(done) {
    var value = utils.transform(1, 'km', 'nm');
    expect(value).to.be.a('number');
    expect(value).to.equal(0.5399568034557235);
    done();
  });

  it('NM -> KM', function(done) {
    var value = utils.transform(1, 'nm', 'km');
    expect(value).to.be.a('number');
    expect(value).to.equal(1.852000001563088);
    done();
  });

  // KTS
  it('KTS -> KPH', function(done) {
    var value = utils.transform(1, 'knots', 'kph');
    expect(value).to.be.a('number');
    expect(value).to.equal(1.8519993258722454);
    done();
  });

  it('KTS -> MS', function(done) {
    var value = utils.transform(1, 'knots', 'ms');
    expect(value).to.be.a('number');
    expect(value).to.equal(0.5144445747704034);
    done();
  });

  it('KTS -> MPH', function(done) {
    var value = utils.transform(1, 'knots', 'mph');
    expect(value).to.be.a('number');
    expect(value).to.equal(1.1507797683710483);
    done();
  });

  // KPH
  it('KPH -> KNOTS', function(done) {
    var value = utils.transform(1, 'kph', 'knots');
    expect(value).to.be.a('number');
    expect(value).to.equal(0.5399568034557235);
    done();
  });

  it('KPH -> MS', function(done) {
    var value = utils.transform(1, 'kph', 'ms');
    expect(value).to.be.a('number');
    expect(value).to.equal(0.2777777777777778);
    done();
  });

  it('KPH -> MPH', function(done) {
    var value = utils.transform(1, 'kph', 'mph');
    expect(value).to.be.a('number');
    expect(value).to.equal(0.621371192237334);
    done();
  });

  // MPH
  it('MPH -> KTS', function(done) {
    var value = utils.transform(1, 'mph', 'knots');
    expect(value).to.be.a('number');
    expect(value).to.equal(0.8689765802121867);
    done();
  });

  it('MPH -> KPH', function(done) {
    var value = utils.transform(1, 'mph', 'kph');
    expect(value).to.be.a('number');
    expect(value).to.equal(1.6093444978925633);
    done();
  });

  it('MPH -> MS', function(done) {
    var value = utils.transform(1, 'mph', 'ms');
    expect(value).to.be.a('number');
    expect(value).to.equal(0.44704005836555);
    done();
  });

  // MS
  it('MS -> KTS', function(done) {
    var value = utils.transform(1, 'ms', 'knots');
    expect(value).to.be.a('number');
    expect(value).to.equal(1.9438461717893492);
    done();
  });

  it('MS -> KPH', function(done) {
    var value = utils.transform(1, 'ms', 'kph');
    expect(value).to.be.a('number');
    expect(value).to.equal(3.5999971200023038);
    done();
  });

  it('MS -> MPH', function(done) {
    var value = utils.transform(1, 'ms', 'mph');
    expect(value).to.be.a('number');
    expect(value).to.equal(2.2369362920544025);
    done();
  });

  it('DEG -> RAD', function(done) {
    var value = utils.transform(1, 'deg', 'rad');
    expect(value).to.be.a('number');
    expect(value).to.equal(0.0174532925239284);
    done();
  });

  it('RAD -> DEG', function(done) {
    var value = utils.transform(1, 'rad', 'deg');
    expect(value).to.be.a('number');
    expect(value).to.equal(57.295779578552306);
    done();
  });
it('CELCIUS -> KELVIN', function(done) {
    var value = utils.transform(0, 'c', 'k');
    expect(value).to.be.a('number');
    expect(value).to.equal(273.15);
    done();
it('KELVIN -> CELCIUS', function(done) {
    var value = utils.transform(0, 'k', 'c');
    expect(value).to.be.a('number');
    expect(value).to.equal(-273.15);
    done()
  });
});
