# @signalk/nmea0183-utilities

[![CI](https://github.com/SignalK/nmea0183-utilities/actions/workflows/ci.yml/badge.svg)](https://github.com/SignalK/nmea0183-utilities/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@signalk/nmea0183-utilities.svg)](https://www.npmjs.com/package/@signalk/nmea0183-utilities)
[![License](https://img.shields.io/npm/l/@signalk/nmea0183-utilities.svg)](https://github.com/SignalK/nmea0183-utilities/blob/master/LICENSE)

Small, strictly-typed TypeScript helpers for parsing NMEA 0183 sentences into
Signal K-flavoured SI units. Used under the hood by
[`@signalk/nmea0183-signalk`](https://github.com/SignalK/nmea0183-signalk) and
available standalone for plugin authors.

## Installation

```sh
npm install @signalk/nmea0183-utilities
```

Requires Node `>=22`.

## Quick tour

```ts
import utils from '@signalk/nmea0183-utilities'
// Or: const utils = require('@signalk/nmea0183-utilities')
// Or: import { valid, transform, coordinate } from '@signalk/nmea0183-utilities'

// 1. Validate a sentence and its *XX checksum
utils.valid('$GPBOD,045.,T,023.,M,DEST,START*01') // -> true
utils.valid('$GPBOD,045.,T,023.,M,DEST,START*AA') // -> false (bad checksum)
utils.valid('$GPBOD,045.,T,023.,M,DEST,START', false) // -> true (skip checksum)

// 2. Compute and append a *XX checksum
utils.appendChecksum('$GPBOD,045.,T,023.,M,DEST,START')
// -> '$GPBOD,045.,T,023.,M,DEST,START*01'

// 3. Convert between units (SI-first)
utils.transform(10, 'knots', 'ms') // -> 5.144... m/s
utils.transform(100, 'c', 'k') // -> 373.15 K
utils.transform(33, 'ft', 'm') // -> 10.058... m

// 4. Parse a latitude/longitude pair
utils.coordinate('5222.3277', 'N') // -> 52.372128... (decimal degrees)
utils.coordinate('00454.5824', 'W') // -> -4.909706... (W/S negative)

// 5. Sanity-check a position
utils.isValidPosition(52.37, -4.91) // -> true
utils.isValidPosition(NaN, 0) // -> false

// 6. Build an ISO-8601 timestamp from NMEA time (HHMMSS[.FFF]) + date (DDMMYY)
utils.timestamp('173456.75', '050426') // -> '2026-04-05T17:34:56.750Z'
utils.timestamp() // -> current UTC as ISO string

// 7. Decode a magnetic-variation field
utils.magneticVariation(3.5, 'E') // -> 3.5    (east positive)
utils.magneticVariation(3.5, 'W') // -> -3.5   (west negative)

// 8. Build the `source` object Signal K deltas expect
utils.source('GPGGA')
// -> { type: 'NMEA0183', label: 'signalk-parser-nmea0183', sentence: 'GPGGA' }
```

## API

All functions are named exports; a default export aggregates them so
`import utils from '@signalk/nmea0183-utilities'` works as well.

### Validation

#### `valid(sentence, validateChecksum?) => boolean`

Returns `true` if `sentence` looks like a well-formed NMEA 0183 frame.
Requires a `$` or `!` prefix and, when `validateChecksum` is `true` (the
default), a matching `*XX` checksum suffix. Pass `false` to accept
prefix-only frames.

#### `appendChecksum(sentence) => string`

Returns `sentence` with a computed `*XX` suffix appended, uppercase hex,
zero-padded. Returns the input unchanged if it already contains `*`,
doesn't start with `$`/`!`, or is an unsupported shape.

### Unit conversion

#### `transform(value, from, to) => number`

Converts `value` between the units below. `value` may be a number or a
numeric string (it's coerced via `float`). `from` and `to` are typed as
`UnitFormat` and are **case-sensitive** in TypeScript callers — pass an
unknown pair and it throws `unsupported conversion: <from> -> <to>`.

| Family      | Units                       |
| ----------- | --------------------------- |
| Distance    | `km`, `nm`, `m`, `ft`, `fa` |
| Speed       | `knots`, `kph`, `ms`, `mph` |
| Angle       | `deg`, `rad`                |
| Temperature | `c`, `k`, `f`               |

All combinations within each family are supported. Same-unit
`transform(x, 'm', 'm')` short-circuits.

#### `RATIOS`

The lookup table used internally — exported for downstream code that
needs the raw constants (e.g. `RATIOS.NM_IN_KM === 1.852`).

### Coordinates & position

#### `coordinate(value, pole) => number`

Parses an NMEA coordinate (`DDDMM.MMMM`, `DDMM.MMMM`) to decimal degrees.
`pole` is a `Pole` (`'N' | 'S' | 'E' | 'W'`, uppercase only per
IEC 61162-1). `'S'` and `'W'` flip the sign. Unknown pole letters throw
`unsupported pole: <value>`.

#### `isValidPosition(latitude, longitude) => boolean`

`true` iff both inputs are finite numbers within `[-90, 90]` /
`[-180, 180]`. Rejects `NaN` and `±Infinity`.

#### `magneticVariation(degrees, pole) => number`

`degrees` is the magnitude; `pole` is a `Pole`. East is positive, West
is negative; `'N' | 'E'` pass through, `'S' | 'W'` negate. Unknown pole
letters throw.

### Timestamp

#### `timestamp(time?, date?) => string`

Assembles an ISO-8601 UTC string from the two fields NMEA sentences
carry.

- `time` is `HHMMSS` with an optional fractional tail (`HHMMSS.sss`).
  The first three digits of the tail become milliseconds; extra digits
  are truncated, a missing or non-digit tail falls through to `.000Z`.
  When omitted, the current wall-clock time is used.
- `date` is `DDMMYY`. 2-digit years follow IEC 61162-1: `YY < 80` →
  `20YY`, `YY >= 80` → `19YY`. When omitted, today's UTC date is used.

### Sentence metadata

#### `source(sentence?) => SignalKSource`

Returns the `source` sub-object Signal K deltas expect:

```ts
{ type: 'NMEA0183', label: 'signalk-parser-nmea0183', sentence: <sentence> }
```

`sentence` defaults to `''` when the argument is falsy.

### Numeric parsing

#### `int(n) => number`

`parseInt(n, 10)` that returns `0` instead of `NaN` when the input
doesn't parse. Accepts `unknown` so `int(null)`, `int(undefined)`,
`int('abc')`, `int(NaN)` all return `0`.

#### `float(n) => number`

Same idea for `parseFloat`. Accepts numbers or numeric strings. Returns
`0.0` on parse failure.

#### `zero(n) => string`

Width-2 left-pad for integer date/time components. `zero(2) === '02'`,
`zero(42) === '42'`, `zero(-5) === '-05'`. Throws `TypeError` on
non-finite or non-integer input — feed it `Math.trunc(n)` if you have a
float.

## TypeScript

Full types ship in the package. The useful ones:

```ts
import type {
  UnitFormat, // 'km' | 'nm' | 'm' | 'ft' | 'fa' | 'knots' | ... | 'c' | 'k' | 'f'
  Pole, // 'N' | 'S' | 'E' | 'W'
  SignalKSource
} from '@signalk/nmea0183-utilities'
```

Both named and default imports are supported; the default is a plain
object whose keys are the named exports.

## License

Apache-2.0. See [LICENSE](LICENSE).
