'use strict'

const getSpecOperationService = require('./getSpecOperationService')


const isIndex = operation => {
  const [ , operationId ] = getSpecOperationService(operation)

  const isIndexOperation =
    operationId.startsWith('Index') ||
    operationId.startsWith('List')

  return isIndexOperation
}

module.exports = isIndex
