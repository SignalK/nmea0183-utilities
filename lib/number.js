const isNumber = require('lodash/fp/isNumber')
const trim = require('lodash/fp/trim')
const round = require('lodash/fp/round')

exports.int = function(num) {
  return isNumber(num) ? round(num) : parseInt(trim(num) || 0, 10)
}

exports.float = function(num) {
  return isNumber(num) ? num : parseFloat(trim(num) || 0)
}
