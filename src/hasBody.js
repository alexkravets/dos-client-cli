'use strict'

const { get } = require('lodash')


const hasBody = (spec, operationId) => {
  const operationSpec = spec.paths[`/${operationId}`]
  const parameters = get(operationSpec, 'post.parameters') || get(operationSpec, 'patch.parameters') || []

  const isFound = parameters.find(parameter => parameter.in === 'body')

  return isFound
}

module.exports = hasBody
