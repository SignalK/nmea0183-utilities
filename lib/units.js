const find = require('lodash/fp/find')
const flow = require('lodash/fp/flow')
const identity = require('lodash/fp/identity')
const over = require('lodash/fp/over')
const overArgs = require('lodash/fp/overArgs')
const toLower = require('lodash/fp/toLower')
const propertyOf = require('lodash/fp/propertyOf')
const convert = require('convert-units')
const { float } = require('./number')

const unitAlias = flow(
  toLower,
  propertyOf({
    c: 'C',
    f: 'F',
    k: 'K',
    knots: 'knot',
    kph: 'km/h',
    mph: 'm/h',
    ms: 'm/s',
    nm: 'nMi',
  })
)
const getFormat = flow(over([unitAlias, identity]), find(identity))

function transform (value, inputFormat, outputFormat) {
  console.log(value, inputFormat, outputFormat)
  if (inputFormat === outputFormat) return value
  return convert(value).from(inputFormat).to(outputFormat)
}

module.exports = {
  transform: overArgs(transform, [float, getFormat, getFormat]),
}
