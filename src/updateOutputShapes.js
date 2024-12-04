'use strict'

const fs = require('fs')
const { uniq } = require('lodash')

const isEnum = require('./isEnum')
const config = require('./config')
const getSchema = require('./getSchema')
const getOutputSchema = require('./getOutputSchema')
const getComponentByPath = require('./getComponentByPath')
const createComponentEnum = require('./createComponentEnum')

const TYPES_MAP = {
  string: 'string',
  number: 'number',
  object: 'shape()',
  boolean: 'bool',
  integer: 'number',
  'array:string': 'arrayOf(PropTypes.string)',
  'array:number': 'arrayOf(PropTypes.string)',
  'array:object': 'arrayOf(PropTypes.shape())',
}


const createComponentShape = (componentName, { service, operation, shapesMap, servicesPath }) => {
  const key = `${service}/shapes/${componentName}Shape.js`
  const isExist = !!shapesMap[key]

  if (isExist) {
    return
  }

  const componentPath = `#/definitions/${componentName}`
  const component = getComponentByPath(operation, componentPath)

  const { properties: propertiesMap, required = []  } = component

  for (const propertyKey of required) {
    propertiesMap[propertyKey].isRequired = true
  }

  const schema = {}

  for (const propertyKey of Object.keys(propertiesMap)) {
    const property = propertiesMap[propertyKey]
    schema[propertyKey] = getSchema(operation, property)
  }

  const path = `${servicesPath}/${key}`
  const content = getShape(componentName, schema, { service, operation, shapesMap, servicesPath })

  const folderPath = `${servicesPath}/${service}/shapes`
  fs.mkdirSync(folderPath, { recursive: true })
  fs.writeFileSync(path, content)

  shapesMap[key] = true
}

const getShape = (name, schema, options = {}, importPrefix = './') => {
  const imports = []
  const attributes = []

  const keys = Object.keys(schema)

  for (const key of keys) {
    const {
      $ref,
      type,
      items = {},
      required: isRequired
    } = schema[key]

    const isArray = type === 'array'
    const isObject = type === 'object'
    const isString = type === 'string'
    const isStringEnum = isString && !!$ref
    const isArrayOfStrings = isArray && items.type === 'string'
    const isArrayOfNumbers = isArray && ['number', 'integer'].includes(items.type)
    const isArrayOfObjects = isArray && !isArrayOfStrings && !isArrayOfNumbers

    let propTypeKey = type

    if (isArrayOfStrings) {
      propTypeKey = 'array:string'
    }

    if (isArrayOfNumbers) {
      propTypeKey = 'array:number'
    }

    if (isArrayOfObjects) {
      propTypeKey = 'array:object'
    }

    const propType = TYPES_MAP[propTypeKey]

    if (!propType) {
      const { operation } = options
      throw new Error(`No type mapped for ${key}:${type} defined in ${operation}`)
    }

    let attribute = isRequired
      ? `  ${key}: PropTypes.${propType}.isRequired`
      : `  ${key}: PropTypes.${propType}`

    if (isArrayOfObjects) {
      const { operation } = options
      const isEnumComponent = isEnum(operation, items.$ref)

      const componentName = items.$ref.replace('#/definitions/', '')

      const componentShapeName = isEnumComponent
        ? `${componentName}Enum`
        : `${componentName}Shape`

      imports.push(`import ${componentShapeName} from "${importPrefix}${componentShapeName}"`)

      attribute = isEnumComponent
        ? attribute.replace('PropTypes.shape()', `PropTypes.oneOf(Object.keys(${componentShapeName}))`)
        : attribute.replace('PropTypes.shape()', componentShapeName)

      isEnumComponent
        ? createComponentEnum(componentName, options)
        : createComponentShape(componentName, options)
    }

    if (isStringEnum) {
      const componentName = $ref.replace('#/definitions/', '')
      const componentEnumName = `${componentName}Enum`

      imports.push(`import { ${componentEnumName}Keys } from "${importPrefix}${componentEnumName}"`)

      attribute = attribute
        .replace('.string', `.oneOf(${componentEnumName}Keys)`)

      createComponentEnum(componentName, options)
    }

    if (isObject) {
      const componentName = $ref.replace('#/definitions/', '')
      const componentShapeName = `${componentName}Shape`

      imports.push(`import ${componentShapeName} from "${importPrefix}${componentShapeName}"`)

      attribute = attribute
        .replace('PropTypes.shape()', componentShapeName)

      createComponentShape(componentName, options)
    }

    attributes.push(attribute)
  }

  const content = `${['import PropTypes from "prop-types"\n', ...uniq(imports).sort()].join('\n')}

const properties = {
${attributes.join(',\n')}
}

const ${name} = PropTypes.exact(properties)

export default ${name}
export { properties }
`

  return content
}

const updateOutputShapes = (servicesPath) => {
  const { operations } = config
  const shapesMap = {}

  const services = uniq(
    operations
      .filter(operation => getOutputSchema(operation))
      .map(operation => operation.split('/')[0])
  )

  const servicesMap = {}

  for (const service of services) {
    const serviceOperations = operations
      .filter(operation => operation.split('/')[0] === service)
      .filter(operation => getOutputSchema(operation))

    const importSchemas = []
    const exportSchemas = []

    for (const operation of serviceOperations) {
      const schema = getOutputSchema(operation)

      const [ serviceName, operationId ] = operation.split('/')
      const name = `${operationId}OutputShape`

      const options = {
        service,
        operation,
        shapesMap,
        servicesPath
      }

      const importPrefix = './shapes/'
      const content = getShape(name, schema, options, importPrefix)
      const path = `${servicesPath}/${operation}OutputShape.js`

      const folderPath = `${servicesPath}/${serviceName}`
      fs.mkdirSync(folderPath, { recursive: true })
      fs.writeFileSync(path, content)

      const shapeName = `${operationId}OutputShape`

      importSchemas.push(`import ${shapeName} from "./${operationId}OutputShape"`)
      exportSchemas.push(`  ${shapeName}`)
    }

    servicesMap[service] = {
      importSchemas: importSchemas.sort(),
      exportSchemas: exportSchemas.sort(),
    }
  }

  return servicesMap
}

module.exports = updateOutputShapes
