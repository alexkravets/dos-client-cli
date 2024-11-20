const fs = require('fs')

const config = require('./config')
const { API_PATH } = require('./constants')
const getSpecOperationService = require('./getSpecOperationService')

const FILE_NAME = 'httpMethods.js'


const updateHttpMethods = () => {
  const { operations } = config

  const httpMethods = {}

  for (const operation of operations) {
    const [ spec, operationId, serviceName ] = getSpecOperationService(operation)
    httpMethods[serviceName] = httpMethods[serviceName] ? httpMethods[serviceName] : []

    const operationSpec = spec.paths[`/${operationId}`]

    if (!operationSpec) {
      throw new Error(`Operation "${operationId}" not defined for "${serviceName}" service.`)
    }

    const [ method ] = Object.keys(operationSpec)

    const httpMethod = method.toUpperCase()
    httpMethods[serviceName].push(`  "${operation}": "${httpMethod}"`)
  }

  const serviceNames = Object.keys(httpMethods)

  for (const serviceName of serviceNames) {
    const httpMethodsPath = `${API_PATH}/${serviceName}/${FILE_NAME}`
    const httpMethodsLines = httpMethods[serviceName]

    const httpMethodsContent = `const HTTP_METHODS = {
${httpMethodsLines.join(',\n')}
}

export default HTTP_METHODS
`

    const folderPath = `${API_PATH}/${serviceName}`
    fs.mkdirSync(folderPath, { recursive: true })
    fs.writeFileSync(httpMethodsPath, httpMethodsContent)
  }
}

module.exports = updateHttpMethods
