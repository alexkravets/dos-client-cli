'use strict'

const fs = require('fs')
const { uniq } = require('lodash')

const { operations } = require('./config')


const updateOperations = (servicesPath, servicesMap) => {
  const services = uniq(
    operations
      .map(operation => operation.split('/')[0])
  )

  for (const service of services) {
    const serviceOperations = operations
      .filter(operation => operation.split('/')[0] === service)

    const { importSchemas, exportSchemas } = servicesMap[service]

    const exportOperations = serviceOperations
      .map(operation => {
        const [ , operationId ] = operation.split('/')
        const operationName = operationId.charAt(0).toLowerCase() + operationId.slice(1)
        const exportOperation = `export const ${operationName}Operation = getOperation(httpMethods, schemasMap, "${operation}")`

        return exportOperation
      })

    const serviceIndexPath = `${servicesPath}/${service}/index.js`
    const serviceIndexContent = `import { getOperation } from "dos-client"

import schemasMap from "./schemas"
import httpMethods from "./httpMethods"

${importSchemas.join('\n')}

export {
${exportSchemas.join(',\n')}
}

${exportOperations.join('\n')}
`

    const folderPath = `${servicesPath}/${service}`
    fs.mkdirSync(folderPath, { recursive: true })
    fs.writeFileSync(serviceIndexPath, serviceIndexContent)
  }
}

module.exports = updateOperations
