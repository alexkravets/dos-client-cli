'use strict'

const getSpecOperationService = require('./getSpecOperationService')


const isMutation = operation => {
  const [ spec, operationId ] = getSpecOperationService(operation)

  const operationSpec = spec.paths[`/${operationId}`]

  return !operationSpec.get && !operationSpec.delete
}

module.exports = isMutation
