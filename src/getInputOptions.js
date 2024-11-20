'use strict'

const { capitalize } = require('lodash')

const getComponentByPath = require('./getComponentByPath')


const getInputOptions = ({
  items = {},
  operation,
  $ref,
  isStringEnum,
  isArrayOfEnums
}) => {
  const hasOptions = isStringEnum || isArrayOfEnums

  if (!hasOptions) {
    return
  }

  const componentPath = items.$ref || $ref
  const { enum: enumValues } = getComponentByPath(operation, componentPath)

  const options = enumValues.map(value => ({
    label: capitalize(value),
    value
  }))

  return options
}

module.exports = getInputOptions
