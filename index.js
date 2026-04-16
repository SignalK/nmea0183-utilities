'use strict'

const utils = {}

utils.RATIOS = {
  // DISTANCE
  NM_IN_KM: 1.852,
  KM_IN_NM: 0.539956803,
  // SPEED
  // Knots
  KNOTS_IN_MS: 0.514444,
  KNOTS_IN_MPH: 1.150779,
  KNOTS_IN_KPH: 1.852,
  // MPH
  MPH_IN_MS: 0.44704,
  MPH_IN_KPH: 1.609344,
  MPH_IN_KNOTS: 0.868976,
  // KPH
  KPH_IN_MS: 0.277778,
  KPH_IN_MPH: 0.621371,
  KPH_IN_KNOTS: 0.539957,
  // MS
  MS_IN_KPH: 3.6,
  MS_IN_MPH: 2.236936,
  MS_IN_KNOTS: 1.943844,
  // DEGREE
  DEG_IN_RAD: 0.0174532925,
  RAD_IN_DEG: 57.2957795,
  // TEMPERATURES
  // Celsius
  CELSIUS_IN_KELVIN: 273.15,
  // Length
  METER_IN_FEET: 3.2808,
  METER_IN_FATHOM: 0.5468
}

function checksum(sentencePart) {
  let check = 0
  for (let i = 1; i < sentencePart.length; i++) {
    check = check ^ sentencePart.charCodeAt(i)
  }
  return check
}

exports.valid = function (sentence, validateChecksum) {
  // An empty string has charAt(0) === '', which neither equals '$' nor
  // '!', so the prefix check below rejects it without a dedicated
  // early return.
  sentence = String(sentence).trim()

  const shouldValidate =
    typeof validateChecksum === 'undefined' || validateChecksum

  if (
    (sentence.charAt(0) === '$' || sentence.charAt(0) === '!') &&
    (shouldValidate === false || sentence.charAt(sentence.length - 3) === '*')
  ) {
    if (shouldValidate) {
      const split = sentence.split('*')
      return parseInt(split[1], 16) === checksum(split[0])
    }
    return true
  }
  return false
}

exports.appendChecksum = function (sentence) {
  const split = String(sentence).trim().split('*')
  if (split.length === 1) {
    if (split[0].charAt(0) === '$' || split[0].charAt(0) === '!') {
      return split[0]
        .concat('*')
        .concat(checksum(split[0]).toString(16).padStart(2, '0').toUpperCase())
    }
  }
  return sentence
}

exports.source = function (sentence) {
  return {
    type: 'NMEA0183',
    label: 'signalk-parser-nmea0183',
    sentence: sentence || ''
  }
}

// Dispatch table: key = 'from:to', value = converter fn.
// Kept as a single source of truth so adding a new unit pair is
// one line here and a new test.
const CONVERSIONS = {
  // Distance
  'km:nm': (v) => v / utils.RATIOS.NM_IN_KM,
  'km:m': (v) => v * 1000,
  'nm:km': (v) => v / utils.RATIOS.KM_IN_NM,
  'nm:m': (v) => (v * 1000) / utils.RATIOS.KM_IN_NM,
  'm:km': (v) => v / 1000,
  'm:nm': (v) => (v / 1000) * utils.RATIOS.KM_IN_NM,
  'm:ft': (v) => v * utils.RATIOS.METER_IN_FEET,
  'm:fa': (v) => v * utils.RATIOS.METER_IN_FATHOM,
  'ft:m': (v) => v / utils.RATIOS.METER_IN_FEET,
  'fa:m': (v) => v / utils.RATIOS.METER_IN_FATHOM,

  // Speed
  'knots:kph': (v) => v / utils.RATIOS.KPH_IN_KNOTS,
  'knots:ms': (v) => v / utils.RATIOS.MS_IN_KNOTS,
  'knots:mph': (v) => v / utils.RATIOS.MPH_IN_KNOTS,
  'kph:knots': (v) => v / utils.RATIOS.KNOTS_IN_KPH,
  'kph:ms': (v) => v / utils.RATIOS.MS_IN_KPH,
  'kph:mph': (v) => v / utils.RATIOS.MPH_IN_KPH,
  'mph:knots': (v) => v / utils.RATIOS.KNOTS_IN_MPH,
  'mph:ms': (v) => v / utils.RATIOS.MS_IN_MPH,
  'mph:kph': (v) => v / utils.RATIOS.KPH_IN_MPH,
  'ms:knots': (v) => v / utils.RATIOS.KNOTS_IN_MS,
  'ms:mph': (v) => v / utils.RATIOS.MPH_IN_MS,
  'ms:kph': (v) => v / utils.RATIOS.KPH_IN_MS,

  // Angle
  'deg:rad': (v) => v / utils.RATIOS.RAD_IN_DEG,
  'rad:deg': (v) => v / utils.RATIOS.DEG_IN_RAD,

  // Temperature
  'c:k': (v) => v + utils.RATIOS.CELSIUS_IN_KELVIN,
  'c:f': (v) => v * 1.8 + 32,
  'k:c': (v) => v - utils.RATIOS.CELSIUS_IN_KELVIN,
  'k:f': (v) => (v - utils.RATIOS.CELSIUS_IN_KELVIN) * 1.8 + 32,
  'f:c': (v) => (v - 32) / 1.8,
  'f:k': (v) => (v - 32) / 1.8 + utils.RATIOS.CELSIUS_IN_KELVIN
}

exports.transform = function (value, inputFormat, outputFormat) {
  value = exports.float(value)
  inputFormat = inputFormat.toLowerCase()
  outputFormat = outputFormat.toLowerCase()

  if (inputFormat === outputFormat) {
    return value
  }

  const converter = CONVERSIONS[inputFormat + ':' + outputFormat]
  if (!converter) {
    throw new Error(
      'unsupported conversion: ' + inputFormat + ' -> ' + outputFormat
    )
  }
  return converter(value)
}

exports.magneticVariaton = function (degrees, pole) {
  pole = pole.toUpperCase()
  degrees = exports.float(degrees)

  if (pole === 'S' || pole === 'W') {
    degrees *= -1
  }

  return degrees
}

// Canonical spelling. `magneticVariaton` is a long-standing typo kept
// for backcompat; new code should prefer `magneticVariation`.
exports.magneticVariation = exports.magneticVariaton

exports.timestamp = function (time, date) {
  /* TIME (UTC) */
  let hours, minutes, seconds, milliseconds, year, month, day

  if (time) {
    hours = exports.int(time.slice(0, 2))
    minutes = exports.int(time.slice(2, 4))
    seconds = exports.int(time.slice(4, 6))
    // NMEA time may carry a fractional tail (e.g. u-blox 10 Hz fixes arrive
    // as '173456.75'). Capture up to 3 digits after the dot, right-padded,
    // so '.2' -> 200, '.25' -> 250, '.2567' -> 256. Missing or non-digit
    // tails degrade to 0 ms (keeps malformed-sentence handling unchanged).
    const fraction = /\.(\d+)/.exec(time)
    milliseconds = fraction
      ? parseInt((fraction[1] + '000').slice(0, 3), 10)
      : 0
  } else {
    const dt = new Date()
    hours = dt.getUTCHours()
    minutes = dt.getUTCMinutes()
    seconds = dt.getUTCSeconds()
    milliseconds = 0
  }

  /* DATE (UTC) */
  if (date) {
    day = exports.int(date.slice(0, 2))
    month = exports.int(date.slice(2, 4)) // this will be a value 1-12
    year = 2000 + exports.int(date.slice(4, 6))
  } else {
    const dt = new Date()
    year = dt.getUTCFullYear()
    month = dt.getUTCMonth() + 1 // getUTCMonth() returns 0-11
    day = dt.getUTCDate()
  }

  /* construct */
  const d = new Date(
    Date.UTC(year, month - 1, day, hours, minutes, seconds, milliseconds)
  ) // month is expected to be 0-11
  return d.toISOString()
}

exports.coordinate = function (value, pole) {
  // N 5222.3277 should be read as 52°22.3277'
  // E 454.5824 should be read as 4°54.5824'
  //
  // 1. split at .
  // 2. last two characters of split[0] (.slice(-2)) + everything after . (split[1]) are the minutes
  // 3. degrees: split[0][a]
  // 4. minutes: split[0][b] + '.' + split[1]
  //
  // 52°22'19.662'' N -> 52.372128333
  // 4°54'34.944'' E -> 4.909706667
  // S & W should be negative.

  pole = pole.toUpperCase()

  const split = value.split('.')
  const degrees = exports.float(split[0].slice(0, -2))
  const minsec = exports.float(split[0].slice(-2) + '.' + split[1])
  let decimal = degrees + minsec / 60

  if (pole === 'S' || pole === 'W') {
    decimal *= -1
  }

  return decimal
}

exports.isValidPosition = function (latitude, longitude) {
  // Number.isFinite rejects NaN and +/-Infinity. `typeof NaN === 'number'`
  // is true, so the old `typeof` + Math.abs guard let NaN fall through.
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    return false
  }
  return true
}

exports.zero = function (n) {
  const num = exports.float(n)
  if (num < 0) {
    return '-' + exports.zero(-num)
  }
  if (num < 10) {
    return '0' + n
  }
  return '' + n
}

exports.int = function (n) {
  // parseInt('') and parseInt('  ') both return NaN, so the NaN guard
  // below subsumes the previous empty-string fast path.
  const parsed = parseInt(n, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

exports.integer = function (n) {
  return exports.int(n)
}

exports.float = function (n) {
  const parsed = parseFloat(n)
  return Number.isNaN(parsed) ? 0.0 : parsed
}

exports.double = function (n) {
  return exports.float(n)
}
