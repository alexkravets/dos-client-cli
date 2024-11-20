'use strict'

const fs = require('fs')

const config = require('./config')
const isMutation = require('./isMutation')
const getMutationSchema = require('./getMutationSchema')


const updateFormInputs = (servicesPath) => {
  const { operations } = config

  const importSchemas = []
  const exportSchemas = []

  const mutationOperations = operations
    .filter(isMutation)

  for (const operation of mutationOperations) {
    const [ serviceName, operationId ] = operation.split('/')

    const schema = getMutationSchema(operation)

    const path = `${servicesPath}/${serviceName}/schemas/${operationId}FormInputs.json`
    const content = JSON.stringify(schema, null, 2)

    const folderPath = `${servicesPath}/${serviceName}/schemas`
    fs.mkdirSync(folderPath, { recursive: true })
    fs.writeFileSync(path, content)

    const operationKey = operation.replace('/', '_').toUpperCase()
    const variableName = `${operationKey}_FORM_INPUTS`
    importSchemas.push(`import ${variableName} from "./${operationId}FormInputs.json"`)
    exportSchemas.push(`  ${variableName}`)
  }

  return [ importSchemas, exportSchemas ]
}

module.exports = updateFormInputs
