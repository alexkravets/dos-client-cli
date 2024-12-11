'use strict'

const { capitalize, startCase } = require('lodash')

const isEnum = require('./isEnum')
const getInputType = require('./getInputType')
const getInputOptions = require('./getInputOptions')
const getComponentInputs = require('./getComponentInputs')
const getInputPlaceholder = require('./getInputPlaceholder')

const TYPE_OBJECT = 'object'


const getInput = (operation, {
  default: initialValue,
  name,
  type,
  $ref,
  items,
  format,
  example,
  pattern,
  maxLength,
  minLength,
  minimum,
  maximum,
  isRequired,
}) => {
  const required = isRequired || false

  const isStringEnum = !!$ref && isEnum(operation, $ref)
  const isArrayOfEnums = !!items && isEnum(operation, items.$ref)
  const isNestedObject = !!$ref && !isStringEnum
  const isArrayOfObjects = !!items && items.$ref && !isArrayOfEnums

  if (isNestedObject) {
    type = TYPE_OBJECT
    const schema = getComponentInputs(getInput, operation, $ref)

    return {
      required,
      name,
      type,
      schema
    }
  }

  const label = capitalize(startCase(name).toLowerCase())
  const placeholder = getInputPlaceholder(example)

  type = getInputType({
    name,
    type,
    items,
    format,
    pattern,
    maxLength,
    isStringEnum,
    isArrayOfEnums
  })

  const options = getInputOptions({
    operation,
    $ref,
    items,
    isStringEnum,
    isArrayOfEnums
  })

  const input = {
    required,
    name,
    type,
    label,
    options,
    placeholder,
    initialValue,
    maxLength,
    minLength,
    minimum,
    maximum,
  }

  if (isArrayOfObjects) {
    input.schema = getComponentInputs(getInput, operation, items.$ref)
  }

  return input
}

module.exports = getInput
