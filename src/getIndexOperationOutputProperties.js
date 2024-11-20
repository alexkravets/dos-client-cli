'use strict'

const getComponentByPath = require('./getComponentByPath')
const getSpecOperationService = require('./getSpecOperationService')


const getIndexOperationOutputProperties = operation => {
  const [ spec, operationId, service ] = getSpecOperationService(operation)

  const outputComponentName = `${operationId}Output`
  const outputComponent = spec.definitions[outputComponentName]

  if (!outputComponent) {
    throw new Error(`
      Operation "${operationId}" is not found.
      Check specification for service "${service}".
    `)
  }

  const itemComponentPath = outputComponent.properties.data.items.$ref
  const itemComponent = getComponentByPath(operation, itemComponentPath)

  const { properties, required = []  } = itemComponent

  for (const key of required) {
    properties[key].isRequired = true
  }

  return properties
}

module.exports = getIndexOperationOutputProperties
