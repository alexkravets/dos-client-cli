'use strict'

const readYamlFile = require('read-yaml-file')

const CONFIG_PATH = './client.yaml'

const config = readYamlFile.sync(CONFIG_PATH)

// TODO: Make unique:

// const sortedOperations = operations
//   .sort()
//   .map(operation => ` "${operation}"`)

//   const operationsContent = `[
// ${sortedOperations.join(',\n')}
// ]
// `

// fs.writeFileSync(OPERATIONS_PATH, operationsContent)

module.exports = config
