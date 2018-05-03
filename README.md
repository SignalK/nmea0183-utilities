NMEA0183-utilities
------------------

[![Build Status](https://travis-ci.org/SignalK/nmea0183-utilities.svg)](https://travis-ci.org/SignalK/nmea0183-utilities)

Various utilities for transforming NMEA0183 units into SI units for use in Signal K.


Installation
============

`npm install nmea0183-utilities`


Some examples
=============

```javascript
var utils = require('nmea0183-utilities');

// Transform 3 knots into m/s. Uses [convert-units](https://github.com/ben-ng/convert-units) internally.
var ms = utils.transform(3, 'knots', 'ms');

// Generate a source object for SignalK from a sentence
var source = utils.source('VDM');

// Generate a timestamp from a NMEA0183 time and date field
var source = utils.source('220104', '171089');
```
