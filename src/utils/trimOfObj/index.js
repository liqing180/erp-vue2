import DelSpacesOfObject from './DelSpacesOfObject'

export default {
  install: function (vm) {
    vm.prototype.$trimOfObj = function (pObj) {
      const { obj } = new DelSpacesOfObject(pObj)
      return obj
    }
  }
}
