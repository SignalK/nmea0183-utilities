'use strict';

const { int, float } = require('./number')
const { transform } = require('./units')


exports.valid = function(sentence, validateChecksum) {
  sentence = String(sentence).trim();

  if (sentence === "") {
    return false;
  }

  var validateChecksum = typeof validateChecksum === 'undefined' || validateChecksum

  if ((sentence.charAt(0) == '$' || sentence.charAt(0) == '!') && (validateChecksum == false || sentence.charAt(sentence.length - 3) == '*')) {
    if ( validateChecksum ) {
      var check = 0;
      var split = sentence.split('*');

      for (var i = 1; i < split[0].length; i++) {
        check = check ^ split[0].charCodeAt(i);
      };

      return (parseInt(split[1], 16) == check);
    } else {
      return true
    }
  }

  return false;
};

exports.source = function(sentence) {
  return {
    type: 'NMEA0183',
    label: 'signalk-parser-nmea0183',
    sentence: sentence || ''
  };
};

exports.transform = transform

exports.magneticVariaton = function(degrees, pole) {
  pole = pole.toUpperCase();
  degrees = this.float(degrees);

  if(pole == "S" || pole == "W") {
    degrees *= -1;
  }

  return degrees;
};

exports.timestamp = function(time, date) {
  /* TIME (UTC) */
  var hours, minutes, seconds, year, month, day;

  if(time) {
    hours = this.int(time.slice(0, 2), true);
    minutes = this.int(time.slice(2, 4), true);
    seconds = this.int(time.slice(4, 6), true);
  } else {
    var dt = new Date();
    hours = dt.getUTCHours();
    minutes = dt.getUTCMinutes();
    seconds = dt.getUTCSeconds();
  }

  /* DATE (UTC) */
  if(date) {
    var year, month, day;
    day = this.int(date.slice(0, 2), true);
    month = this.int(date.slice(2, 4), true);
    year = this.int(date.slice(-2));

    // HACK copied from jamesp/node-nmea
    if(year < 73) {
      year = this.int("20" + year);
    } else {
      year = this.int("19" + year);
    }
  } else {
    var dt = new Date();
    year = dt.getUTCFullYear();
    month = dt.getUTCMonth();
    day = dt.getUTCDate();
  }

  /* construct */
  var d = new Date(Date.UTC(year, (month - 1), day, hours, minutes, seconds));
  return d.toISOString();
};

exports.coordinate = function(value, pole) {
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

  pole = pole.toUpperCase();

  var split   = value.split('.');
  var degrees = this.float(split[0].slice(0, -2));
  var minsec  = this.float(split[0].slice(-2) + '.' + split[1]);
  var decimal = this.float(degrees + (minsec / 60));

  if (pole == "S" || pole == "W") {
    decimal *= -1;
  }

  return exports.float(decimal);
};

exports.zero = function(n) {
  if(this.float(n) < 10) {
    return "0" + n;
  } else {
    return "" + n;
  }
};

exports.int = int
exports.integer = int

exports.float = float
exports.double = float
