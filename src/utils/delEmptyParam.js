/**
 * 这个封装解决向后台传参数的时候，当参数是空字符串的时候，不传输这个空字符。传空字符后台不能查找出结果。
 */
export default {
  install: function (vm) {
    vm.prototype.$delEmptyParam = function (params) {
      if (typeof params === 'object' && !Array.isArray(params)) {
        const obj = {}

        for (const item in params) {
          if (typeof params[item] === 'string' && params[item] === '') {
            delete params[item]
          } else if (typeof params[item] === 'object' && params[item] === null) {
            delete params[item]
          } else if (typeof params[item] === 'undefined') {
            delete params[item]
          } else {
            obj[item] = params[item]
          }
        }

        return obj
      } else {
        return params
      }
    }
  }
}
