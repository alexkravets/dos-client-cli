'use strict'

const fs = require('fs')

const config = require('./config')
const cleanup = require('./cleanup')
const { API_PATH } = require('./constants')
const updateOperations = require('./updateOperations')
const updateFormInputs = require('./updateFormInputs')
const updateHttpMethods = require('./updateHttpMethods')
const updateOutputShapes = require('./updateOutputShapes')
const updateIndexItemSchemas = require('./updateIndexItemSchemas')


const updateClient = async () => {
  fs.mkdirSync(API_PATH, { recursive: true })

  await cleanup(API_PATH)

  updateHttpMethods()
  const servicesMap = updateOutputShapes(API_PATH)
  updateOperations(API_PATH, servicesMap)

  const [ importSchemas1, exportSchemas1 ] = updateFormInputs(API_PATH)
  const [ importSchemas2, exportSchemas2 ] = updateIndexItemSchemas(API_PATH)

  const importSchemas = [
    ...importSchemas1,
    ...importSchemas2
  ].sort()

  const exportSchemas = [
    ...exportSchemas1,
    ...exportSchemas2
  ].sort()

  const { services } = config
  const serviceNames = Object.keys(services)

  for (const serviceName of serviceNames) {
    const serviceKey = serviceName.toUpperCase()
    const serviceImportSchemas = importSchemas.filter(line => line.startsWith(`import ${serviceKey}_`) )
    const serviceExportSchemas = exportSchemas.filter(line => line.startsWith(`  ${serviceKey}_`) )

    const hasSchemas = serviceImportSchemas.length > 0

    if (!hasSchemas) {
      continue
    }

    const servicesIndexContent = `${serviceImportSchemas.join('\n')}

const components = {
${serviceExportSchemas.join(',\n')}
}

export default components
`

    const servicesIndexPath = `${API_PATH}/${serviceName}/schemas/index.js`

    const folderPath = `${API_PATH}/${serviceName}/schemas`
    fs.mkdirSync(folderPath, { recursive: true })
    fs.writeFileSync(servicesIndexPath, servicesIndexContent)
  }
}

module.exports = updateClient
