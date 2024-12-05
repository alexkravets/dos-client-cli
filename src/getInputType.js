'use strict'

const TYPE_SSN = 'ssn'
const TYPE_ENUM = 'enum'
const TYPE_DATE = 'date'
const TYPE_TEXT = 'text'
const TYPE_TIME = 'time'
const TYPE_EMAIL = 'email'
const TYPE_PHONE = 'phone'
const TYPE_ARRAY = 'array'
const TYPE_STRING = 'string'
const TYPE_COUNTRY = 'country'
const TYPE_ARRAY_ENUM = 'array_enum'

const FORMAT_TYPES_MAP = {
  ssn: TYPE_SSN,
  time: TYPE_TIME,
  date: TYPE_DATE,
  email: TYPE_EMAIL,
  phone: TYPE_PHONE,
}

const PATTERN_FORMAT_MAP = {
  '^[0-9]{9,9}$': 'ssn',
  '^[0-9]{0,20}$': 'phone',
}


const getInputType = ({
  name,
  type,
  items,
  format,
  pattern,
  maxLength,
  isStringEnum,
  isArrayOfEnums
}) => {
  format = format ? format : PATTERN_FORMAT_MAP[pattern]

  type = FORMAT_TYPES_MAP[format] || type || TYPE_STRING

  type = name.toLowerCase().includes(TYPE_COUNTRY)
    ? TYPE_COUNTRY
    : type

  type = items
    ? TYPE_ARRAY
    : type

  type = isStringEnum
    ? TYPE_ENUM
    : type

  type = isArrayOfEnums
    ? TYPE_ARRAY_ENUM
    : type

  type = maxLength && maxLength > 128
    ? TYPE_TEXT
    : type

  return type
}

module.exports = getInputType
