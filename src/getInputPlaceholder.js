'use strict'


const getInputPlaceholder = example => {
  let placeholder = example ? `${example}` : ''
  placeholder = Array.isArray(example) ? `${example[0]}` : placeholder

  return placeholder
}

module.exports = getInputPlaceholder
