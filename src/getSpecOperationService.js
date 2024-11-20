'use strict'

const fs = require('fs')
const path = require('path')

const { SPECS_PATH } = require('./constants')

const SPECS_MAP = {}


const getSpecOperationService = operation => {
  const [ serviceName, operationId ] = operation.split('/')

  let spec = SPECS_MAP[serviceName]

  if (!spec) {
    const specPath = path.join(SPECS_PATH, `${serviceName}.json`)
    spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))

    SPECS_MAP[serviceName] = spec
  }

  return [ spec, operationId, serviceName ]
}

module.exports = getSpecOperationService
