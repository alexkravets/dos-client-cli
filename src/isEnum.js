'use strict'

const getComponentByPath = require('./getComponentByPath')


const isEnum = (operation, componentPath) => {
  if (!componentPath) {
    return false
  }

  const component = getComponentByPath(operation, componentPath)

  const { enum: _enum } = component
  const hasEnum = !!_enum

  return hasEnum
}

module.exports = isEnum
