# Changelog

## 1.1.0

### Non-breaking additions

- **`intOrNull(n)` / `floatOrNull(n)`** — null-preserving variants of
  `int` / `float`. Return `null` for empty / whitespace / `null` /
  `undefined` / non-numeric input, instead of silently coercing to `0`.
  `intOrNull('0')` still returns `0`, so legitimate zero measurements
  stay distinguishable from "not available".
- **`transformOrNull(value, from, to)`** — null-short-circuiting unit
  conversion. Identical to `transform` for real input; returns `null`
  when `value` doesn't parse. Unsupported unit pairs still throw.
- **`magneticVariationOrNull(degrees, pole)`** — null-preserving
  magnetic variation. Returns `null` when degrees or pole is missing or
  unparseable (including lowercase / unknown pole letters), rather than
  throwing or returning `0`.

Motivation: IEC 61162-1 §7.2.3.4 defines a null NMEA field as "sensor
working, value not available" — distinct from a legitimate zero. Legacy
`int` / `float` collapse both into `0`, which has caused bugs like
SignalK/nmea0183-signalk#192 (magnetic variation reported as 0° from an
empty RMC field, causing a 13° error in one reporter's case). Use the
`*OrNull` family when passing through to Signal K, which maps `null` in
a delta value onto the same semantic.

Existing `int` / `float` / `transform` / `magneticVariation` are
unchanged for back-compat.

## 1.0.0

First stable release. The package is now authored in TypeScript with strict
mode enabled, ships type definitions, and drops a handful of legacy aliases.

### Breaking changes

- **Removed `magneticVariaton`** (long-standing typo). Use `magneticVariation`
  instead. Signature unchanged.
- **Removed `integer`** (alias for `int`). Use `int`.
- **Removed `double`** (alias for `float`). Use `float`.
- **`transform(value, from, to)`** — `from` and `to` are now typed as
  `UnitFormat` (the lowercase union of supported units). TypeScript callers
  that previously passed arbitrary strings get a compile error. The runtime
  `.toLowerCase()` coercion present in 0.x was removed, so a JS caller that
  passes `'KNOTS'` / `'MS'` / similar now throws
  `unsupported conversion: KNOTS -> MS` instead of silently succeeding.
- **`magneticVariation(degrees, pole)` / `coordinate(value, pole)`** —
  `pole` is now typed as `Pole` (`'N' | 'S' | 'E' | 'W'`, uppercase only,
  matching IEC 61162-1). The lowercase variants from the 0.x union are
  gone, and the runtime `.toUpperCase()` coercion was removed. Passing an
  unknown letter now throws `unsupported pole: <value>` instead of silently
  returning the wrong-sign result.
- **`zero(n)`** — only accepts `number`. Previously accepted `number | string`
  and coerced internally. Also now requires a finite integer: `zero(NaN)`,
  `zero(Infinity)`, and `zero(0.5)` throw `TypeError` rather than returning
  the nonsense strings `"NaN"`, `"Infinity"`, `"00.5"` they used to.
- **Year handling in `timestamp()`**. A 2-digit `YY` now follows the
  IEC 61162-1 convention: `YY < 80 → 20YY`, `YY >= 80 → 19YY`. Previously
  always computed `2000 + YY`, so archival logs from the 1980s and 1990s
  were stamped as 2080+. Live fixes in this millennium are unaffected
  (they always take the `20YY` branch).

### Migration

| Before                              | After                               |
| ----------------------------------- | ----------------------------------- |
| `utils.magneticVariaton(d, p)`      | `utils.magneticVariation(d, p)`     |
| `utils.integer(n)`                  | `utils.int(n)`                      |
| `utils.double(n)`                   | `utils.float(n)`                    |
| `utils.zero('5')`                   | `utils.zero(Number('5'))`           |
| `utils.transform(x, 'KNOTS', 'MS')` | `utils.transform(x, 'knots', 'ms')` |
| `utils.magneticVariation(d, 's')`   | `utils.magneticVariation(d, 'S')`   |
| `utils.coordinate(v, 'w')`          | `utils.coordinate(v, 'W')`          |

The in-org consumer `@signalk/nmea0183-signalk` uses `magneticVariaton` in
its RMC hook; update that import when bumping.

### Non-breaking additions

- TypeScript source in `src/index.ts`, compiled to `dist/` with `.d.ts`,
  `.d.ts.map`, `.js.map`. Strict mode with `noUncheckedIndexedAccess`.
- Default export aggregate so `import utils from '@signalk/nmea0183-utilities'`
  (ESM default-import) works. CJS `require()` is unchanged.
- `exports` conditional field for explicit type + runtime resolution.
- `sideEffects: false` for tree-shaking.
- `engines.node >= 22` (current active Node LTS). Node 18 is EOL; Node 20
  reaches EOL 2026-04-30. `signalk-server` already requires `>=22`, so
  the floor matches the primary consumer of this package.

## 0.12.0

- fix: preserve milliseconds in `timestamp()` (#36). NMEA time fields with
  a fractional tail (e.g. `173456.75` from a u-blox 10 Hz receiver) now
  round-trip through `timestamp()` with the hundredths preserved.

## 0.11.0

- chore: release cumulative work from v0.10.0.
- test: Stryker mutation testing added, 100% mutation score achieved.
- docs: scoped package name (`@signalk/nmea0183-utilities`) in README.

## 0.10.0

See git history.
