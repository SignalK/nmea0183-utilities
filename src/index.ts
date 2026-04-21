/**
 * NMEA 0183 utilities: checksum, unit conversion, coordinate parsing,
 * timestamp assembly, and numeric parsing helpers.
 *
 * All transforms output SI units so downstream Signal K consumers do not
 * need to carry unit metadata.
 */

// Conversion ratios. Kept exported because downstream parsers reference
// specific ratios directly when formatting output.
export const RATIOS = {
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
} as const

export type UnitFormat =
  | 'km'
  | 'nm'
  | 'm'
  | 'ft'
  | 'fa'
  | 'knots'
  | 'kph'
  | 'ms'
  | 'mph'
  | 'deg'
  | 'rad'
  | 'c'
  | 'k'
  | 'f'

// NMEA 0183 cardinal direction letter. Uppercase only, per IEC 61162-1.
export type Pole = 'N' | 'S' | 'E' | 'W'

export interface SignalKSource {
  type: 'NMEA0183'
  label: 'signalk-parser-nmea0183'
  sentence: string
}

function checksum(sentencePart: string): number {
  // NMEA 0183 XOR checksum over every byte after the leading `$` or `!`.
  // `for...of` avoids an explicit numeric bound so the loop can't be
  // mutated into an off-by-one that reads NaN (which XORs as 0 and leaves
  // the checksum unchanged — equivalent to the original, unkillable by a
  // test). NMEA is ASCII, so iterating code points ≡ iterating code units.
  let check = 0
  for (const char of sentencePart.slice(1)) {
    check ^= char.charCodeAt(0)
  }
  return check
}

export function valid(sentence: unknown, validateChecksum?: boolean): boolean {
  // An empty string has charAt(0) === '', which neither equals '$' nor
  // '!', so the prefix check below rejects it without a dedicated
  // early return.
  const s = String(sentence).trim()

  const shouldValidate =
    typeof validateChecksum === 'undefined' || validateChecksum

  if (
    (s.charAt(0) === '$' || s.charAt(0) === '!') &&
    (shouldValidate === false || s.charAt(s.length - 3) === '*')
  ) {
    if (shouldValidate) {
      const split = s.split('*')
      return parseInt(split[1]!, 16) === checksum(split[0]!)
    }
    return true
  }
  return false
}

export function appendChecksum(sentence: string): string {
  const split = String(sentence).trim().split('*')
  if (split.length === 1) {
    const part = split[0]!
    if (part.charAt(0) === '$' || part.charAt(0) === '!') {
      return part
        .concat('*')
        .concat(checksum(part).toString(16).padStart(2, '0').toUpperCase())
    }
  }
  return sentence
}

export function source(sentence?: string): SignalKSource {
  return {
    type: 'NMEA0183',
    label: 'signalk-parser-nmea0183',
    sentence: sentence || ''
  }
}

type Converter = (value: number) => number

// Dispatch table: key = 'from:to', value = converter fn.
// Kept as a single source of truth so adding a new unit pair is
// one line here and a new test.
const CONVERSIONS: Record<string, Converter> = {
  // Distance
  'km:nm': (v) => v / RATIOS.NM_IN_KM,
  'km:m': (v) => v * 1000,
  'nm:km': (v) => v / RATIOS.KM_IN_NM,
  'nm:m': (v) => (v * 1000) / RATIOS.KM_IN_NM,
  'm:km': (v) => v / 1000,
  'm:nm': (v) => (v / 1000) * RATIOS.KM_IN_NM,
  'm:ft': (v) => v * RATIOS.METER_IN_FEET,
  'm:fa': (v) => v * RATIOS.METER_IN_FATHOM,
  'ft:m': (v) => v / RATIOS.METER_IN_FEET,
  'fa:m': (v) => v / RATIOS.METER_IN_FATHOM,

  // Speed
  'knots:kph': (v) => v / RATIOS.KPH_IN_KNOTS,
  'knots:ms': (v) => v / RATIOS.MS_IN_KNOTS,
  'knots:mph': (v) => v / RATIOS.MPH_IN_KNOTS,
  'kph:knots': (v) => v / RATIOS.KNOTS_IN_KPH,
  'kph:ms': (v) => v / RATIOS.MS_IN_KPH,
  'kph:mph': (v) => v / RATIOS.MPH_IN_KPH,
  'mph:knots': (v) => v / RATIOS.KNOTS_IN_MPH,
  'mph:ms': (v) => v / RATIOS.MS_IN_MPH,
  'mph:kph': (v) => v / RATIOS.KPH_IN_MPH,
  'ms:knots': (v) => v / RATIOS.KNOTS_IN_MS,
  'ms:mph': (v) => v / RATIOS.MPH_IN_MS,
  'ms:kph': (v) => v / RATIOS.KPH_IN_MS,

  // Angle
  'deg:rad': (v) => v / RATIOS.RAD_IN_DEG,
  'rad:deg': (v) => v / RATIOS.DEG_IN_RAD,

  // Temperature
  'c:k': (v) => v + RATIOS.CELSIUS_IN_KELVIN,
  'c:f': (v) => v * 1.8 + 32,
  'k:c': (v) => v - RATIOS.CELSIUS_IN_KELVIN,
  'k:f': (v) => (v - RATIOS.CELSIUS_IN_KELVIN) * 1.8 + 32,
  'f:c': (v) => (v - 32) / 1.8,
  'f:k': (v) => (v - 32) / 1.8 + RATIOS.CELSIUS_IN_KELVIN
}

export function transform(
  value: number | string,
  inputFormat: UnitFormat,
  outputFormat: UnitFormat
): number {
  const numeric = float(value)

  if (inputFormat === outputFormat) {
    return numeric
  }

  const converter = CONVERSIONS[inputFormat + ':' + outputFormat]
  if (!converter) {
    throw new Error(
      'unsupported conversion: ' + inputFormat + ' -> ' + outputFormat
    )
  }
  return converter(numeric)
}

export function magneticVariation(
  degrees: number | string,
  pole: Pole
): number {
  const deg = float(degrees)

  // Exhaustive switch: the `default` branch is unreachable under the
  // `Pole` type, but exists as a runtime safety net for JS callers
  // passing a bogus string (which would otherwise silently no-op and
  // return the wrong-sign result). Unary `-deg` avoids Stryker's
  // `*= → /=` equivalent mutant.
  switch (pole) {
    case 'S':
    case 'W':
      return -deg
    case 'N':
    case 'E':
      return deg
    default: {
      const exhaustive: never = pole
      throw new Error(`unsupported pole: ${String(exhaustive)}`)
    }
  }
}

export function timestamp(time?: string, date?: string): string {
  /* TIME (UTC) */
  let hours: number
  let minutes: number
  let seconds: number
  let milliseconds: number
  let year: number
  let month: number
  let day: number

  if (time) {
    hours = int(time.slice(0, 2))
    minutes = int(time.slice(2, 4))
    seconds = int(time.slice(4, 6))
    // NMEA time may carry a fractional tail (e.g. u-blox 10 Hz fixes arrive
    // as '173456.75'). Capture up to 3 digits after the dot, right-padded,
    // so '.2' -> 200, '.25' -> 250, '.2567' -> 256. Missing or non-digit
    // tails degrade to 0 ms (keeps malformed-sentence handling unchanged).
    const fraction = /\.(\d+)/.exec(time)
    milliseconds = fraction
      ? parseInt((fraction[1]! + '000').slice(0, 3), 10)
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
    day = int(date.slice(0, 2))
    month = int(date.slice(2, 4)) // this will be a value 1-12
    // NMEA 0183 carries a 2-digit year. Per IEC 61162-1 convention,
    // YY < 80 is 20YY and YY >= 80 is 19YY. Matters only for log
    // replay; live fixes in this millennium always take the 20YY
    // branch. `nmea0183-utilities` 0.x always computed 20YY and so
    // stamped year 2080+ onto 198x/199x sentences from archival logs.
    const yy = int(date.slice(4, 6))
    year = yy < 80 ? 2000 + yy : 1900 + yy
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

export function coordinate(value: string, pole: Pole): number {
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

  const split = value.split('.')
  const degrees = float(split[0]!.slice(0, -2))
  const minsec = float(split[0]!.slice(-2) + '.' + split[1])
  const decimal = degrees + minsec / 60

  // Exhaustive switch (see `magneticVariation` for the rationale).
  switch (pole) {
    case 'S':
    case 'W':
      return -decimal
    case 'N':
    case 'E':
      return decimal
    default: {
      const exhaustive: never = pole
      throw new Error(`unsupported pole: ${String(exhaustive)}`)
    }
  }
}

export function isValidPosition(
  latitude: unknown,
  longitude: unknown
): boolean {
  // Number.isFinite rejects NaN and +/-Infinity. `typeof NaN === 'number'`
  // is true, so the old `typeof` + Math.abs guard let NaN fall through.
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude as number) > 90 ||
    Math.abs(longitude as number) > 180
  ) {
    return false
  }
  return true
}

export function zero(n: number): string {
  // Width-2 left-pad for integer date/time components. Non-integer or
  // non-finite input produced nonsense strings in 0.x (`"NaN"`,
  // `"Infinity"`, `"00.5"`) that silently corrupted downstream output;
  // reject them loudly instead.
  if (!Number.isInteger(n)) {
    throw new TypeError(`zero() expects an integer, got ${n}`)
  }
  if (n < 0) {
    return '-' + zero(-n)
  }
  if (n < 10) {
    return '0' + n
  }
  return '' + n
}

export function int(n: unknown): number {
  // parseInt('') and parseInt('  ') both return NaN, so the NaN guard
  // below subsumes the previous empty-string fast path.
  const parsed = parseInt(n as string, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function float(n: unknown): number {
  const parsed = parseFloat(n as string)
  return Number.isNaN(parsed) ? 0.0 : parsed
}

// Null-preserving numeric parsers. An NMEA 0183 null field (IEC 61162-1
// §7.2.3.4) signals "sensor working, value not available" and must not be
// conflated with a legitimate zero. `int`/`float` above coerce to 0 for
// back-compat; prefer these when the caller wants to preserve the
// not-available semantic end-to-end.
//
//   intOrNull('')    -> null
//   intOrNull('42')  -> 42
//   intOrNull('abc') -> null
export function intOrNull(n: unknown): number | null {
  const parsed = parseInt(n as string, 10)
  return Number.isNaN(parsed) ? null : parsed
}

export function floatOrNull(n: unknown): number | null {
  const parsed = parseFloat(n as string)
  return Number.isNaN(parsed) ? null : parsed
}

// Null-short-circuiting unit conversion. Lets callers write
//   transformOrNull(parts[8], 'deg', 'rad')
// for an optional NMEA field without a surrounding emptiness check.
// Unsupported conversion pairs still throw (same contract as `transform`).
export function transformOrNull(
  value: unknown,
  inputFormat: UnitFormat,
  outputFormat: UnitFormat
): number | null {
  const numeric = floatOrNull(value)
  if (numeric === null) {
    return null
  }
  if (inputFormat === outputFormat) {
    return numeric
  }
  const converter = CONVERSIONS[inputFormat + ':' + outputFormat]
  if (!converter) {
    throw new Error(
      'unsupported conversion: ' + inputFormat + ' -> ' + outputFormat
    )
  }
  return converter(numeric)
}

// Null-preserving magnetic variation. Returns null when either the
// degrees field or the pole letter is missing or unparseable, rather
// than throwing or (via the old `float` path) silently returning 0.
// Valid pole letters still enforce the `Pole` contract; an unknown
// pole given alongside numeric degrees is treated as "not available"
// rather than fatal, matching how callers already treat the whole
// field as optional when the direction indicator is empty.
export function magneticVariationOrNull(
  degrees: unknown,
  pole: unknown
): number | null {
  const deg = floatOrNull(degrees)
  if (deg === null) {
    return null
  }
  if (pole === 'N' || pole === 'E') {
    return deg
  }
  if (pole === 'S' || pole === 'W') {
    return -deg
  }
  return null
}

// Default export aggregate so ESM consumers using
// `import utils from '@signalk/nmea0183-utilities'` get the same bag
// that `const utils = require(...)` returns in CJS.
export default {
  RATIOS,
  valid,
  appendChecksum,
  source,
  transform,
  magneticVariation,
  timestamp,
  coordinate,
  isValidPosition,
  zero,
  int,
  float,
  intOrNull,
  floatOrNull,
  transformOrNull,
  magneticVariationOrNull
}
