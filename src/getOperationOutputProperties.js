'use strict'

const getComponentByPath = require('./getComponentByPath')
const getSpecOperationService = require('./getSpecOperationService')


const getOperationOutputProperties = (operation, shouldIgnoreNotFound = false) => {
  const [ spec, operationId, service ] = getSpecOperationService(operation)

  const outputComponentName = `${operationId}Output`
  const outputComponent = spec.definitions[outputComponentName]

  if (!outputComponent) {
    if (shouldIgnoreNotFound) {
      return null
    }

    throw new Error(`
      Component "${outputComponentName}" is not found.
      Check specification for service "${service}".
    `)
  }

  let component = outputComponent.properties.data
  const { $ref: componentPath } = component

  if (componentPath) {
    component = getComponentByPath(operation, componentPath)
  }

  const { properties, required = []  } = component

  for (const key of required) {
    properties[key].isRequired = true
  }

  return properties
}

module.exports = getOperationOutputProperties
