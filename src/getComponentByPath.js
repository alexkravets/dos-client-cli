'use strict'

const getSpecOperationService = require('./getSpecOperationService')


const getComponentByPath = (operation, path) => {
  const [ spec ] = getSpecOperationService(operation)

  if (!path) {
    throw new Error(`Path is not defined for operation ${operation}`)
  }

  const componentName = path.replace('#/definitions/', '')
  const component = spec.definitions[componentName]

  if (!component) {
    throw new Error(`
      Component "${componentName}" is not found at path "${path}".
      Check specification for operation "${operation}".
    `)
  }

  return component
}

module.exports = getComponentByPath
