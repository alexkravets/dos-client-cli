'use strict'

const getInput = require('./getInput')
const getOperationOutputProperties = require('./getOperationOutputProperties')
const getMutationOperationInputProperties = require('./getMutationOperationInputProperties')


const getMutationSchema = operation => {
  // TODO: Investigate with additional services:
  const shouldConsiderOutput = true

  const propertiesMap = getMutationOperationInputProperties(operation)

  const properties = []
  for (const key of Object.keys(propertiesMap)) {
    properties.push({ ...propertiesMap[key], name: key })
  }

  const schema = properties.map(property => getInput(operation, property))

  if (shouldConsiderOutput) {
    const outputPropertiesMap = getOperationOutputProperties(operation, true) || {}

    for (const property of schema) {
      const { name: key } = property
      const outputProperty = outputPropertiesMap[key]

      property.required = outputProperty
        ? (outputProperty.isRequired || false)
        : property.required
    }
  }

  return schema
}

module.exports = getMutationSchema
