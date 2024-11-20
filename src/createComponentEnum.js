'use strict'

const fs = require('fs')

const getComponentByPath = require('./getComponentByPath')


const createComponentEnum = (componentName, { service, operation, shapesMap, servicesPath }) => {
  const key = `${service}/shapes/${componentName}Enum.js`
  const isExist = !!shapesMap[key]

  if (isExist) {
    return
  }

  const componentPath = `#/definitions/${componentName}`
  const component = getComponentByPath(operation, componentPath)
  const { enum: _enum } = component

  const constants = _enum.map(value => `export const ${value} = "${value}"`)
  const values = _enum.map(value => `  [${value}]: ${value}`)

  const path = `${servicesPath}/${key}`
  const content = `import { capitalize } from "lodash"

${constants.sort().join('\n')}

const ${componentName}Enum = {
${values.sort().join(',\n')}
}

const ${componentName}EnumKeys = Object.keys(${componentName}Enum)

const ${componentName}EnumOptions = ${componentName}EnumKeys
  .map(value => ({
    label: capitalize(value),
    value
  }))

export {
  ${componentName}EnumKeys,
  ${componentName}EnumOptions
}

export default ${componentName}Enum
`

  const folderPath = `${servicesPath}/${service}/shapes`
  fs.mkdirSync(folderPath, { recursive: true })
  fs.writeFileSync(path, content)

  shapesMap[key] = true
}

module.exports = createComponentEnum
