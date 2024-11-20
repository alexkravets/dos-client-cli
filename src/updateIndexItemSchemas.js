'use strict'

const fs = require('fs')
const util = require('util')

const config = require('./config')
const isIndex = require('./isIndex')
const getOutputSchema = require('./getOutputSchema')

const SKIP_TYPES = [
  'object',
  'array'
]


const getItemSchema = schema => {
  const enumsMap = {}
  const itemSchema = {}

  for (const key of Object.keys(schema)) {
    const { type, format, $ref } = schema[key]

    const shouldSkip = SKIP_TYPES.includes(type)

    if (!shouldSkip) {
      const properties = {}

      const isString = type === 'string'
      const isEnum = !!$ref

      if (!isString) {
        properties.type = type
      }

      if (format) {
        properties.format = format
      }

      if (isEnum) {
        const componentName = $ref.replace('#/definitions/', '')
        const enumName = `${componentName}Enum`
        enumsMap[$ref] = enumName

        properties.enum = $ref
      }

      const hasProperties = Object.keys(properties).length > 0

      if (hasProperties) {
        itemSchema[key] = properties
      }
    }
  }

  return [ itemSchema, enumsMap ]
}

const updateIndexItemSchemas = (servicesPath) => {
  const { operations } = config

  const importSchemas = []
  const exportSchemas = []

  const indexOperations = operations
    .filter(isIndex)

  for (const operation of indexOperations) {
    const [ serviceName, operationId ] = operation.split('/')

    const schema = getOutputSchema(operation)
    const [ itemSchema, enumsMap ] = getItemSchema(schema)

    const schemaString = util.inspect(itemSchema, false, 2, false)

    const path = `${servicesPath}/${serviceName}/schemas/${operationId}ItemSchema.js`

    const imports = Object
      .values(enumsMap)
      .map(name => `import { ${name}Keys } from "../shapes/${name}"`)
      .sort()
      .join('\n')

    let content = `${imports}

const ${operationId}ItemSchema = ${schemaString}

export default ${operationId}ItemSchema
`
    const enumKeys = Object.keys(enumsMap)
    for (const enumKey of enumKeys) {
      const enumName = enumsMap[enumKey]
      content = content
        .replace(`'${enumKey}'`, `${enumName}Keys`)
    }

    const folderPath = `${servicesPath}/${serviceName}/schemas`
    fs.mkdirSync(folderPath, { recursive: true })
    fs.writeFileSync(path, content)

    const operationKey = operation.replace('/', '_').toUpperCase()
    const variableName = `${operationKey}_ITEM_SCHEMA`
    importSchemas.push(`import ${variableName} from "./${operationId}ItemSchema"`)
    exportSchemas.push(`  ${variableName}`)
  }

  return [ importSchemas, exportSchemas ]
}

module.exports = updateIndexItemSchemas
