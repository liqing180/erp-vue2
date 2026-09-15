import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'
import dialogDrag from './dialog/drag'
import dialogDragWidth from './dialog/dragWidth'
import dialogDragHeight from './dialog/dragHeight'
import tenRowsHeight from './tenRowsHeight'
import thousandSplit from './thousandSplit'
import tableTab from './table-tab'
const install = function (Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
  Vue.directive('dialogDrag', dialogDrag)
  Vue.directive('dialogDragWidth', dialogDragWidth)
  Vue.directive('dialogDragHeight', dialogDragHeight)
  Vue.directive('tenRowsHeight', tenRowsHeight)
  /* 数字千分符 */
  Vue.directive('thousandSplit', thousandSplit)
  Vue.directive('table-tab', tableTab)
}

if (window.Vue) {
  window.hasRole = hasRole
  window.hasPermi = hasPermi
  Vue.use(install) // eslint-disable-line
}

export default install
