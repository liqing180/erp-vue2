
export default {
  install: function(vm) {
    // 0,-0返回true,空对象为false，空数组为false
    vm.prototype.$resultOfBoolean = function(curVal) {
      const rsStr = Object.prototype.toString.call(curVal)

      let rs = false

      switch (rsStr.toLowerCase()) {
        case '[object object]':
          if (Object.keys(curVal).length > 0) {
            rs = true
          } else {
            rs = false
          }
          break
        case '[object array]':
          if (curVal.length > 0) {
            rs = true
          } else {
            rs = false
          }
          break
        case '[object null]':
          rs = false
          break
        case '[object undefined]':
          rs = false
          break
        case '[object number]':
          if (isNaN(Number(curVal))) {
            rs = false
          } else {
            rs = true
          }
          break

        default:
          rs = !!curVal
          break
      }

      return rs
    }
  }
}
