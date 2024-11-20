'use strict'

const fs = require('fs')
const https = require('https')

const config = require('./config')
const { SPECS_PATH } = require('./constants')


const fetchSpec = async (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      let data = ''
      response.on('data', chunk => data += chunk)
      response.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

const updateSpecs = async () => {
  fs.mkdirSync(SPECS_PATH, { recursive: true })

  const { host, services } = config
  const serviceNames = Object.keys(services)

  const promises = serviceNames
    .map(async (serviceName) => {
      try {
        const servicePath = services[serviceName]
        const url = `https://${host}${servicePath}/Spec`
        const specPath = `${SPECS_PATH}/${serviceName}.json`

        console.info(`${serviceName}: ${url}`)
        const data = await fetchSpec(url)
        fs.writeFileSync(specPath, data)
      } catch (error) {
        console.error(`Failed to update spec for ${serviceName}:`, error)
      }
    })

  await Promise.all(promises)
}

module.exports = updateSpecs
