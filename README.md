## NMEA0183-utilities

[![CI](https://github.com/SignalK/nmea0183-utilities/actions/workflows/ci.yml/badge.svg)](https://github.com/SignalK/nmea0183-utilities/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@signalk/nmea0183-utilities.svg)](https://www.npmjs.com/package/@signalk/nmea0183-utilities)
[![License](https://img.shields.io/npm/l/@signalk/nmea0183-utilities.svg)](https://github.com/SignalK/nmea0183-utilities/blob/master/LICENSE)

Various utilities for transforming NMEA0183 units into SI units for use in Signal K.

# Installation

`npm install nmea0183-utilities`

# Some examples

```javascript
var utils = require('nmea0183-utilities')

// Transform 3 knots into m/s
var ms = utils.transform(3, 'knots', 'ms')

// Generate a source object for SignalK from a sentence
var source = utils.source('VDM')

// Generate a timestamp from a NMEA0183 time and date field
var source = utils.source('220104', '171089')
```
