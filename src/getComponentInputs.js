'use strict'

const { keyBy } = require('lodash')

const getComponentByPath = require('./getComponentByPath')


const getComponentInputs = (getInput, operation, componentPath, inputs = []) => {
  const { properties: propertiesMap, required = [] } = getComponentByPath(operation, componentPath)

  for (const key of required) {
    propertiesMap[key].isRequired = true
  }

  const properties = []
  for (const key of Object.keys(propertiesMap)) {
    properties.push({ ...propertiesMap[key], name: key })
  }

  const schema = properties.map(property => getInput(operation, property))

  const hasInputs = inputs.length > 0

  if (!hasInputs) {
    return schema
  }

  const defaultSchemaMap = keyBy(schema, 'name')

  /* td: for object inputs make sure merge to happen gracefully */
  const schemaOverridden = inputs.map(input => ({
    ...defaultSchemaMap[input.name],
    ...input
  }))

  return schemaOverridden
}

module.exports = getComponentInputs

