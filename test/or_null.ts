import { expect } from 'chai'
import * as utils from '../src/index'
import type { UnitFormat } from '../src/index'

// The `*OrNull` family preserves the IEC 61162-1 §7.2.3.4 "null field"
// semantic: an empty NMEA field means "sensor working, value not
// available" and must not be coerced to 0. Legacy `int`/`float` still
// coerce, so downstream consumers that want the distinction must opt
// in via these helpers.
describe('intOrNull / floatOrNull', function () {
  it('intOrNull("") returns null', function () {
    expect(utils.intOrNull('')).to.equal(null)
  })

  it('intOrNull("  ") returns null (whitespace)', function () {
    expect(utils.intOrNull('  ')).to.equal(null)
  })

  it('intOrNull(null) returns null', function () {
    expect(utils.intOrNull(null)).to.equal(null)
  })

  it('intOrNull(undefined) returns null', function () {
    expect(utils.intOrNull(undefined)).to.equal(null)
  })

  it('intOrNull("abc") returns null (non-numeric)', function () {
    expect(utils.intOrNull('abc')).to.equal(null)
  })

  it('intOrNull(NaN) returns null', function () {
    expect(utils.intOrNull(NaN)).to.equal(null)
  })

  it('intOrNull("0") returns 0 (legitimate zero, not null)', function () {
    expect(utils.intOrNull('0')).to.equal(0)
  })

  it('intOrNull("42") returns 42', function () {
    expect(utils.intOrNull('42')).to.equal(42)
  })

  it('intOrNull("-7") returns -7', function () {
    expect(utils.intOrNull('-7')).to.equal(-7)
  })

  // parseInt behaviour: leading digits parse, trailing garbage is ignored.
  // That's the same as `int`, so `intOrNull` stays consistent.
  it('intOrNull("12abc") returns 12 (parseInt leading-digits behaviour)', function () {
    expect(utils.intOrNull('12abc')).to.equal(12)
  })

  it('floatOrNull("") returns null', function () {
    expect(utils.floatOrNull('')).to.equal(null)
  })

  it('floatOrNull("  ") returns null', function () {
    expect(utils.floatOrNull('  ')).to.equal(null)
  })

  it('floatOrNull(null) returns null', function () {
    expect(utils.floatOrNull(null)).to.equal(null)
  })

  it('floatOrNull(undefined) returns null', function () {
    expect(utils.floatOrNull(undefined)).to.equal(null)
  })

  it('floatOrNull("abc") returns null', function () {
    expect(utils.floatOrNull('abc')).to.equal(null)
  })

  it('floatOrNull(NaN) returns null', function () {
    expect(utils.floatOrNull(NaN)).to.equal(null)
  })

  it('floatOrNull("0") returns 0 (legitimate zero)', function () {
    expect(utils.floatOrNull('0')).to.equal(0)
  })

  it('floatOrNull("0.0") returns 0', function () {
    expect(utils.floatOrNull('0.0')).to.equal(0)
  })

  it('floatOrNull("-0.5") returns -0.5', function () {
    expect(utils.floatOrNull('-0.5')).to.equal(-0.5)
  })

  it('floatOrNull("3.14") returns 3.14', function () {
    expect(utils.floatOrNull('3.14')).to.equal(3.14)
  })

  it('floatOrNull("1.5e2") returns 150 (scientific notation)', function () {
    expect(utils.floatOrNull('1.5e2')).to.equal(150)
  })

  // Distinguishing 0 from missing is the whole point of this family.
  it('0 is not confused with null (intOrNull)', function () {
    const v = utils.intOrNull('0')
    expect(v).to.equal(0)
    expect(v).to.not.equal(null)
  })

  it('0 is not confused with null (floatOrNull)', function () {
    const v = utils.floatOrNull('0')
    expect(v).to.equal(0)
    expect(v).to.not.equal(null)
  })
})

describe('transformOrNull', function () {
  it('short-circuits on empty input', function () {
    expect(utils.transformOrNull('', 'deg', 'rad')).to.equal(null)
  })

  it('short-circuits on null', function () {
    expect(utils.transformOrNull(null, 'knots', 'ms')).to.equal(null)
  })

  it('short-circuits on undefined', function () {
    expect(utils.transformOrNull(undefined, 'nm', 'm')).to.equal(null)
  })

  it('short-circuits on non-numeric', function () {
    expect(utils.transformOrNull('abc', 'deg', 'rad')).to.equal(null)
  })

  it('converts 0 (not confused with missing)', function () {
    expect(utils.transformOrNull('0', 'deg', 'rad')).to.equal(0)
  })

  it('DEG -> RAD matches transform() for real input', function () {
    expect(utils.transformOrNull(1, 'deg', 'rad')).to.equal(
      utils.transform(1, 'deg', 'rad')
    )
  })

  it('KNOTS -> MS matches transform() for real input', function () {
    expect(utils.transformOrNull('10.5', 'knots', 'ms')).to.equal(
      utils.transform('10.5', 'knots', 'ms')
    )
  })

  it('same-unit fast path returns the numeric value unchanged', function () {
    expect(utils.transformOrNull('42.5', 'ms', 'ms')).to.equal(42.5)
  })

  it('throws on unsupported conversion (same contract as transform)', function () {
    expect(function () {
      utils.transformOrNull(1, 'furlong' as UnitFormat, 'm')
    }).to.throw(/unsupported conversion/i)
  })

  it('null input does NOT probe the converter table', function () {
    // If the short-circuit were inverted, a null value with an unknown
    // unit pair would throw instead of returning null.
    expect(
      utils.transformOrNull(
        null,
        'furlong' as UnitFormat,
        'smoot' as UnitFormat
      )
    ).to.equal(null)
  })
})

describe('magneticVariationOrNull', function () {
  it('returns null on empty degrees', function () {
    expect(utils.magneticVariationOrNull('', 'E')).to.equal(null)
  })

  it('returns null on empty pole', function () {
    expect(utils.magneticVariationOrNull('3.1', '')).to.equal(null)
  })

  it('returns null on null degrees', function () {
    expect(utils.magneticVariationOrNull(null, 'W')).to.equal(null)
  })

  it('returns null on unknown pole letter (instead of throwing)', function () {
    // Unlike `magneticVariation`, the OrNull variant treats an unparseable
    // pole as "not available" rather than fatal, matching how parsers
    // already treat the whole variation field as optional.
    expect(utils.magneticVariationOrNull('3.1', 'X')).to.equal(null)
  })

  it('returns null on lowercase pole letter (strict casing)', function () {
    expect(utils.magneticVariationOrNull('3.1', 'e')).to.equal(null)
  })

  it('E returns positive degrees', function () {
    expect(utils.magneticVariationOrNull('3.1', 'E')).to.equal(3.1)
  })

  it('N returns positive degrees', function () {
    expect(utils.magneticVariationOrNull('3.1', 'N')).to.equal(3.1)
  })

  it('W negates degrees', function () {
    expect(utils.magneticVariationOrNull('3.1', 'W')).to.equal(-3.1)
  })

  it('S negates degrees', function () {
    expect(utils.magneticVariationOrNull('3.1', 'S')).to.equal(-3.1)
  })

  it('0 degrees with valid pole returns 0 (not null)', function () {
    const v = utils.magneticVariationOrNull('0', 'E')
    expect(v).to.equal(0)
    expect(v).to.not.equal(null)
  })
})
