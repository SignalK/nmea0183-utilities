var chai = require('chai')
var expect = chai.expect
var utils = require('../index')

describe('Transform', function () {
  it('KM -> NM', function (done) {
    var value = utils.transform(1, 'km', 'nm')
    expect(value).to.be.a('number')
    expect(value).to.equal(0.5399568034557235)
    done()
  })

  it('NM -> KM', function (done) {
    var value = utils.transform(1, 'nm', 'km')
    expect(value).to.be.a('number')
    expect(value).to.equal(1.852000001563088)
    done()
  })

  it('NM -> M', function (done) {
    var value = utils.transform(1, 'nm', 'm')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(1852, 1e-3)
    done()
  })

  // KTS
  it('KTS -> KPH', function (done) {
    var value = utils.transform(1, 'knots', 'kph')
    expect(value).to.be.a('number')
    expect(value).to.equal(1.8519993258722454)
    done()
  })

  it('KTS -> MS', function (done) {
    var value = utils.transform(1, 'knots', 'ms')
    expect(value).to.be.a('number')
    expect(value).to.equal(0.5144445747704034)
    done()
  })

  it('KTS -> MPH', function (done) {
    var value = utils.transform(1, 'knots', 'mph')
    expect(value).to.be.a('number')
    expect(value).to.equal(1.1507797683710483)
    done()
  })

  // KPH
  it('KPH -> KNOTS', function (done) {
    var value = utils.transform(1, 'kph', 'knots')
    expect(value).to.be.a('number')
    expect(value).to.equal(0.5399568034557235)
    done()
  })

  it('KPH -> MS', function (done) {
    var value = utils.transform(1, 'kph', 'ms')
    expect(value).to.be.a('number')
    expect(value).to.equal(0.2777777777777778)
    done()
  })

  it('KPH -> MPH', function (done) {
    var value = utils.transform(1, 'kph', 'mph')
    expect(value).to.be.a('number')
    expect(value).to.equal(0.621371192237334)
    done()
  })

  // MPH
  it('MPH -> KTS', function (done) {
    var value = utils.transform(1, 'mph', 'knots')
    expect(value).to.be.a('number')
    expect(value).to.equal(0.8689765802121867)
    done()
  })

  it('MPH -> KPH', function (done) {
    var value = utils.transform(1, 'mph', 'kph')
    expect(value).to.be.a('number')
    expect(value).to.equal(1.6093444978925633)
    done()
  })

  it('MPH -> MS', function (done) {
    var value = utils.transform(1, 'mph', 'ms')
    expect(value).to.be.a('number')
    expect(value).to.equal(0.44704005836555)
    done()
  })

  // MS
  it('MS -> KTS', function (done) {
    var value = utils.transform(1, 'ms', 'knots')
    expect(value).to.be.a('number')
    expect(value).to.equal(1.9438461717893492)
    done()
  })

  it('MS -> KPH', function (done) {
    var value = utils.transform(1, 'ms', 'kph')
    expect(value).to.be.a('number')
    expect(value).to.equal(3.5999971200023038)
    done()
  })

  it('MS -> MPH', function (done) {
    var value = utils.transform(1, 'ms', 'mph')
    expect(value).to.be.a('number')
    expect(value).to.equal(2.2369362920544025)
    done()
  })

  it('DEG -> RAD', function (done) {
    var value = utils.transform(1, 'deg', 'rad')
    expect(value).to.be.a('number')
    expect(value).to.equal(0.0174532925239284)
    done()
  })

  it('RAD -> DEG', function (done) {
    var value = utils.transform(1, 'rad', 'deg')
    expect(value).to.be.a('number')
    expect(value).to.equal(57.295779578552306)
    done()
  })

  // Celsius <-> Kelvin, using the three well-known fixed points:
  //   0 K       = -273.15 C  (absolute zero)
  //   273.15 K  =  0 C       (water freezes)
  //   373.15 K  =  100 C     (water boils at 1 atm)
  it('CELSIUS -> KELVIN (water freezing)', function (done) {
    var value = utils.transform(0, 'c', 'k')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(273.15, 1e-9)
    done()
  })

  it('CELSIUS -> KELVIN (water boiling)', function (done) {
    var value = utils.transform(100, 'c', 'k')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(373.15, 1e-9)
    done()
  })

  it('CELSIUS -> KELVIN (absolute zero)', function (done) {
    var value = utils.transform(-273.15, 'c', 'k')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(0, 1e-9)
    done()
  })

  it('KELVIN -> CELSIUS (water freezing)', function (done) {
    var value = utils.transform(273.15, 'k', 'c')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(0, 1e-9)
    done()
  })

  it('KELVIN -> CELSIUS (water boiling)', function (done) {
    var value = utils.transform(373.15, 'k', 'c')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(100, 1e-9)
    done()
  })

  it('KELVIN -> CELSIUS (absolute zero)', function (done) {
    var value = utils.transform(0, 'k', 'c')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(-273.15, 1e-9)
    done()
  })

  // Kelvin <-> Fahrenheit, using the three well-known fixed points so
  // the coefficient, offset, and direction are all pinned:
  //   0 K       = -459.67 F  (absolute zero)
  //   273.15 K  =  32 F      (water freezes)
  //   373.15 K  = 212 F      (water boils at 1 atm)
  it('KELVIN -> FAHRENHEIT (absolute zero)', function (done) {
    var value = utils.transform(0, 'k', 'f')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(-459.67, 1e-9)
    done()
  })

  it('KELVIN -> FAHRENHEIT (water freezing)', function (done) {
    var value = utils.transform(273.15, 'k', 'f')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(32, 1e-9)
    done()
  })

  it('KELVIN -> FAHRENHEIT (water boiling)', function (done) {
    var value = utils.transform(373.15, 'k', 'f')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(212, 1e-9)
    done()
  })

  it('FAHRENHEIT -> KELVIN (absolute zero)', function (done) {
    var value = utils.transform(-459.67, 'f', 'k')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(0, 1e-9)
    done()
  })

  it('FAHRENHEIT -> KELVIN (water freezing)', function (done) {
    var value = utils.transform(32, 'f', 'k')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(273.15, 1e-9)
    done()
  })

  it('FAHRENHEIT -> KELVIN (water boiling)', function (done) {
    var value = utils.transform(212, 'f', 'k')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(373.15, 1e-9)
    done()
  })

  it('FEET -> METERS', function (done) {
    var value = utils.transform(33, 'ft', 'm')
    expect(value).to.be.a('number')
    expect(value).to.equal(10.05852231163131)
    done()
  })

  it('FATHOMS -> METERS', function (done) {
    var value = utils.transform(10, 'fa', 'm')
    expect(value).to.be.a('number')
    expect(value).to.equal(18.288222384784202)
    done()
  })

  // Celsius <-> Fahrenheit (previously missing — transform silently
  // returned the input unchanged).
  it('CELSIUS -> FAHRENHEIT (water freezing)', function (done) {
    var value = utils.transform(0, 'c', 'f')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(32, 1e-9)
    done()
  })

  it('CELSIUS -> FAHRENHEIT (water boiling)', function (done) {
    var value = utils.transform(100, 'c', 'f')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(212, 1e-9)
    done()
  })

  it('FAHRENHEIT -> CELSIUS (water freezing)', function (done) {
    var value = utils.transform(32, 'f', 'c')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(0, 1e-9)
    done()
  })

  it('FAHRENHEIT -> CELSIUS (water boiling)', function (done) {
    var value = utils.transform(212, 'f', 'c')
    expect(value).to.be.a('number')
    expect(value).to.be.closeTo(100, 1e-9)
    done()
  })

  // Distance base-unit pairs that were missing.
  it('KM -> M', function (done) {
    expect(utils.transform(1, 'km', 'm')).to.equal(1000)
    done()
  })

  it('M -> KM', function (done) {
    expect(utils.transform(1000, 'm', 'km')).to.equal(1)
    done()
  })

  it('M -> NM', function (done) {
    var value = utils.transform(1852, 'm', 'nm')
    expect(value).to.be.closeTo(1, 1e-6)
    done()
  })

  // Length: the inverse of the existing ft -> m / fa -> m pairs.
  it('METERS -> FEET', function (done) {
    var value = utils.transform(1, 'm', 'ft')
    expect(value).to.be.closeTo(3.2808, 1e-4)
    done()
  })

  it('METERS -> FATHOMS', function (done) {
    var value = utils.transform(1, 'm', 'fa')
    expect(value).to.be.closeTo(0.5468, 1e-4)
    done()
  })

  // Unknown conversions must fail loudly. Previously transform silently
  // returned the input for any unrecognised pair, giving callers wrong
  // values with no signal.
  it('throws on unknown input unit', function (done) {
    expect(function () {
      utils.transform(1, 'furlong', 'm')
    }).to.throw(/unsupported conversion/i)
    done()
  })

  it('throws on unknown output unit', function (done) {
    expect(function () {
      utils.transform(1, 'm', 'furlong')
    }).to.throw(/unsupported conversion/i)
    done()
  })

  it('throws on typo (kmh instead of kph)', function (done) {
    expect(function () {
      utils.transform(10, 'knots', 'kmh')
    }).to.throw(/unsupported conversion/i)
    done()
  })

  // Same-unit fast path and mixed-case unit strings.
  it('same-unit fast path returns the numeric value unchanged', function (done) {
    expect(utils.transform(42, 'm', 'm')).to.equal(42)
    expect(utils.transform('42.5', 'knots', 'knots')).to.equal(42.5)
    done()
  })

  it('accepts uppercase unit strings', function (done) {
    expect(utils.transform(1, 'KNOTS', 'MS')).to.equal(
      utils.transform(1, 'knots', 'ms')
    )
    done()
  })

  // Pin the full error message format. A mutation that drops the
  // ` -> ` separator (producing `furlongsmoot`) would slip past the
  // looser regex assertions above.
  it('throw message includes both units separated by " -> "', function (done) {
    expect(function () {
      utils.transform(1, 'furlong', 'smoot')
    }).to.throw('unsupported conversion: furlong -> smoot')
    done()
  })
})
