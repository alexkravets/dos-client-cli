'use strict'

const isEnum = require('./isEnum')
const getComponentByPath = require('./getComponentByPath')


const getSchema = (operation, property) => {
  const { type, format, $ref, isRequired, items } = property

  const schema = { type }

  if (items) {
    schema.items = items
  }

  if (isRequired) {
    schema.required = true
  }

  if (format) {
    schema.format = format
  }

  if (!$ref) {
    return schema
  }

  const isEnumProperty = isEnum(operation, $ref)
  const isObjectProperty = !isEnumProperty

  if (isObjectProperty) {
    schema.type = 'object'
    schema.$ref = $ref

    return schema
  }

  const { enum: values } = getComponentByPath(operation, $ref)

  schema.type = 'string'
  schema.enum = values
  schema.$ref = $ref

  return schema
}

module.exports = getSchema
