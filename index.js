'use strict'
;(function () {
  var utils = {}

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
    sentence = String(sentence).trim()

    if (sentence === '') {
      return false
    }

    var validateChecksum =
      typeof validateChecksum === 'undefined' || validateChecksum

    if (
      (sentence.charAt(0) == '$' || sentence.charAt(0) == '!') &&
      (validateChecksum == false || sentence.charAt(sentence.length - 3) == '*')
    ) {
      if (validateChecksum) {
        let split = sentence.split('*')
        return parseInt(split[1], 16) == checksum(split[0])
      } else {
        return true
      }
    }
    return false
  }

  exports.appendChecksum = function (sentence) {
    let split = String(sentence).trim().split('*')
    if (split.length === 1) {
      if (split[0].charAt(0) == '$' || split[0].charAt(0) == '!') {
        return split[0]
          .concat('*')
          .concat(
            checksum(split[0]).toString(16).padStart(2, '0').toUpperCase()
          )
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
  var CONVERSIONS = {
    // Distance
    'km:nm': function (v) {
      return v / utils.RATIOS.NM_IN_KM
    },
    'km:m': function (v) {
      return v * 1000
    },
    'nm:km': function (v) {
      return v / utils.RATIOS.KM_IN_NM
    },
    'nm:m': function (v) {
      return (v * 1000) / utils.RATIOS.KM_IN_NM
    },
    'm:km': function (v) {
      return v / 1000
    },
    'm:nm': function (v) {
      return (v / 1000) * utils.RATIOS.KM_IN_NM
    },
    'm:ft': function (v) {
      return v * utils.RATIOS.METER_IN_FEET
    },
    'm:fa': function (v) {
      return v * utils.RATIOS.METER_IN_FATHOM
    },
    'ft:m': function (v) {
      return v / utils.RATIOS.METER_IN_FEET
    },
    'fa:m': function (v) {
      return v / utils.RATIOS.METER_IN_FATHOM
    },

    // Speed
    'knots:kph': function (v) {
      return v / utils.RATIOS.KPH_IN_KNOTS
    },
    'knots:ms': function (v) {
      return v / utils.RATIOS.MS_IN_KNOTS
    },
    'knots:mph': function (v) {
      return v / utils.RATIOS.MPH_IN_KNOTS
    },
    'kph:knots': function (v) {
      return v / utils.RATIOS.KNOTS_IN_KPH
    },
    'kph:ms': function (v) {
      return v / utils.RATIOS.MS_IN_KPH
    },
    'kph:mph': function (v) {
      return v / utils.RATIOS.MPH_IN_KPH
    },
    'mph:knots': function (v) {
      return v / utils.RATIOS.KNOTS_IN_MPH
    },
    'mph:ms': function (v) {
      return v / utils.RATIOS.MS_IN_MPH
    },
    'mph:kph': function (v) {
      return v / utils.RATIOS.KPH_IN_MPH
    },
    'ms:knots': function (v) {
      return v / utils.RATIOS.KNOTS_IN_MS
    },
    'ms:mph': function (v) {
      return v / utils.RATIOS.MPH_IN_MS
    },
    'ms:kph': function (v) {
      return v / utils.RATIOS.KPH_IN_MS
    },

    // Angle
    'deg:rad': function (v) {
      return v / utils.RATIOS.RAD_IN_DEG
    },
    'rad:deg': function (v) {
      return v / utils.RATIOS.DEG_IN_RAD
    },

    // Temperature
    'c:k': function (v) {
      return v + utils.RATIOS.CELSIUS_IN_KELVIN
    },
    'c:f': function (v) {
      return v * 1.8 + 32
    },
    'k:c': function (v) {
      return v - utils.RATIOS.CELSIUS_IN_KELVIN
    },
    'k:f': function (v) {
      return (v - utils.RATIOS.CELSIUS_IN_KELVIN) * 1.8 + 32
    },
    'f:c': function (v) {
      return (v - 32) / 1.8
    },
    'f:k': function (v) {
      return (v - 32) / 1.8 + utils.RATIOS.CELSIUS_IN_KELVIN
    }
  }

  exports.transform = function (value, inputFormat, outputFormat) {
    value = exports.float(value)
    inputFormat = inputFormat.toLowerCase()
    outputFormat = outputFormat.toLowerCase()

    if (inputFormat === outputFormat) {
      return value
    }

    var converter = CONVERSIONS[inputFormat + ':' + outputFormat]
    if (!converter) {
      throw new Error(
        'unsupported conversion: ' + inputFormat + ' -> ' + outputFormat
      )
    }
    return converter(value)
  }

  exports.magneticVariaton = function (degrees, pole) {
    pole = pole.toUpperCase()
    degrees = this.float(degrees)

    if (pole == 'S' || pole == 'W') {
      degrees *= -1
    }

    return degrees
  }

  exports.timestamp = function (time, date) {
    /* TIME (UTC) */
    var hours, minutes, seconds, year, month, day

    if (time) {
      hours = this.int(time.slice(0, 2), true)
      minutes = this.int(time.slice(2, 4), true)
      seconds = this.int(time.slice(4, 6), true)
    } else {
      var dt = new Date()
      hours = dt.getUTCHours()
      minutes = dt.getUTCMinutes()
      seconds = dt.getUTCSeconds()
    }

    /* DATE (UTC) */
    if (date) {
      var year, month, day
      day = this.int(date.slice(0, 2), true)
      month = this.int(date.slice(2, 4), true) // this will be a value 1-12
      year = this.int(date.slice(4, 6), true)
      year = 2000 + year
    } else {
      var dt = new Date()
      year = dt.getUTCFullYear()
      month = dt.getUTCMonth() + 1 // getUTCMonth() returns 0-11
      day = dt.getUTCDate()
    }

    /* construct */
    var d = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds)) // month is expected to be 0-11
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

    var split = value.split('.')
    var degrees = this.float(split[0].slice(0, -2))
    var minsec = this.float(split[0].slice(-2) + '.' + split[1])
    var decimal = this.float(degrees + minsec / 60)

    if (pole == 'S' || pole == 'W') {
      decimal *= -1
    }

    return exports.float(decimal)
  }

  exports.isValidPosition = function (latitude, longitude) {
    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      Math.abs(latitude) > 90 ||
      Math.abs(longitude) > 180
    ) {
      return false
    }
    return true
  }

  exports.zero = function (n) {
    if (this.float(n) < 10) {
      return '0' + n
    } else {
      return '' + n
    }
  }

  exports.int = function (n) {
    if (('' + n).trim() === '') {
      return 0
    } else {
      return parseInt(n, 10)
    }
  }

  exports.integer = function (n) {
    return exports.int(n)
  }

  exports.float = function (n) {
    if (('' + n).trim() === '') {
      return 0.0
    } else {
      return parseFloat(n)
    }
  }

  exports.double = function (n) {
    return exports.float(n)
  }
})()
