const rsType = function(val) {
  return Object.prototype.toString.call(val)
}

const isString = function(val) {
  return rsType(val) === '[object String]'
}

const isNull = function(val) {
  return rsType(val) === '[object Null]'
}

const isUndefined = function(val) {
  return rsType(val) === '[object Undefined]'
}

const isNumber = function(val) {
  return rsType(val) === '[object Number]'
}

const isArray = function(val) {
  return rsType(val) === '[object Array]'
}

const isObject = function(val) {
  return rsType(val) === '[object Object]'
}

const isFunction = function(val) {
  return rsType(val) === '[object Function]'
}

export default {
  isString,
  isNull,
  isUndefined,
  isNumber,
  isArray,
  isObject,
  isFunction
}
