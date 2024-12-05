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

  const titlizeEnumValue = value =>
    value.split('_').map(word => capitalize(word)).join(' ')

  const options = enumValues.map(value => ({
    label: titlizeEnumValue(value),
    value
  }))

  return options
}

module.exports = getInputOptions
