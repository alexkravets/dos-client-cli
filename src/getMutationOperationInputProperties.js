'use strict'

const hasBody = require('./hasBody')
const getSpecOperationService = require('./getSpecOperationService')


const getMutationOperationInputProperties = operation => {
  const [ spec, operationId, service ] = getSpecOperationService(operation)

  const shouldSkip = !hasBody(spec, operationId)

  if (shouldSkip) {
    return {}
  }

  const outputComponentName = `${operationId}InputMutation`
  const outputComponent = spec.definitions[outputComponentName]

  if (!outputComponent) {
    throw new Error(`
      Component "${outputComponentName}" is not found.
      Check specification for service "${service}".
    `)
  }

  const { properties, required = [] } = outputComponent

  for (const key of required) {
    properties[key].isRequired = true
  }

  return properties
}

module.exports = getMutationOperationInputProperties
