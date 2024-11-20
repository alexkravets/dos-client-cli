'use strict'

const isIndex = require('./isIndex')
const getSchema = require('./getSchema')
const getOperationOutputProperties = require('./getOperationOutputProperties')
const getIndexOperationOutputProperties = require('./getIndexOperationOutputProperties')


const getOutputSchema = operation => {
  const isIndexOperation = isIndex(operation)

  const propertiesMap = isIndexOperation
    ? getIndexOperationOutputProperties(operation)
    : getOperationOutputProperties(operation, true)

  if (!propertiesMap) {
    return null
  }

  const schema = {}

  for (const key of Object.keys(propertiesMap)) {
    const property = propertiesMap[key]
    schema[key] = getSchema(operation, property)
  }

  return schema
}

module.exports = getOutputSchema
