import Vue from 'vue'

import Cookies from 'js-cookie'
import Element, { Tooltip, Table } from 'element-ui'

import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import UmyUi from 'umy-ui'
import 'umy-ui/lib/theme-chalk/index.css'// 引入样式
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import i18n from './lang' // 国际化语言包
import numberTofixed from '@/utils/numberTofixed/index' // 数字转小数
import resultOfBoolean from '@/utils/resultOfBoolean/index'
import trimOfObj from '@/utils/trimOfObj/index'
import TypeJudge from '@/utils/jsType/index'
import { queryAllPageList } from '@/mixins/tableMinx.js'
import { getToken } from '@/utils/auth'
import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from '@/api/system/dict/data'
/* 字典值扩展类,解决字典值重复请求 */
import MyDictDataClass from '@/utils/dict/myDictDataClass.js'

import { getConfigKey } from '@/api/system/config'
import { queryDomainName } from '@/api/common/common'
import { initSystemConfig } from '@/initSystemConfig/initSystemConfig.js'
import { download } from '@/utils/request'

import importOrExportDownFile from '@/utils/importOrExportDownFile'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import MyColorPicker from '@/components/color-picker/index.js'
import MyInput from '@/components/MyInput/index.js'
import CustomDateTime from '@/components/Common/customDateTime/customDateTime.vue'
import TablePropError from '@/components/Common/TablePropError'
import TableNonInventoryItem from '@/components/Common/TableNonInventoryItem'

// 隐藏el-select 多选时已选中值的删除小按钮
import '@/directive/tagCloseNone.js'
import '@/directive/dragTree.js'
// import 'swiper/swiper-bundle.min.css'
import 'swiper/css/swiper.css'

import {
  parseTime,
  appointTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  handleTree,
  isContain,
  showUomLabel
} from '@/utils/ruoyi'
import { checkPermi, checkRole } from '@/utils/permission'
// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 富文本组件
import Editor from '@/components/Editor'
// 文件上传组件
import FileUpload from '@/components/FileUpload'
// 图片上传组件
import ImageUpload from '@/components/ImageUpload'
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'
import myUpload from '@/components/Common/htz-image-upload/my-upload.vue'
// 文件导入组件
import FileImport from '@/components/Common/fileImport/fileImport.vue'
import ExportDlg from '@/components/Common/exportDlg/ExportDlg.vue'
import ImportDlg from '@/components/Common/importDlg/importDlg.vue'
import descriptionToolTipShow from '@/components/Common/descriptionToolTipShow/descriptionToolTipShow.vue'
import descriptionEditDlg from '@/components/Common/descriptionToolTipShow/descriptionEditDlg.vue'

import ToolTipShowCategory from '@/components/Common/ToolTipShowCategory'
import ToolTipShowList from '@/components/Common/ToolTipShowList'
import ToolTipShowObj from '@/components/Common/ToolTipShowObj'
import ElInputNumber from '@/components/Common/MyInputNumber'
import MyDatePicker from '@/components/Common/MyDatePicker/index.js'

import MapPointSelect from '@/components/Common/MapPointSelect'
import MobilePhoneInput from '@/components/Common/MobilePhoneInput/MobilePhoneInput.vue'
import SelectInput from '@/components/Common/SelectInput/SelectInput.vue'
import delEmptyParam from '@/utils/delEmptyParam'
import searchForm from '@/components/Common/searchFormNew/IndexFold.vue'
import commonProductAndPicture from '@/components/Common/commonProductAndPicture/index.vue'
import MapDrawingPolygon from '@/components/Common/MapDrawingPolygon'
import ToolTipPaymentTerm from '@/components/Common/ToolTipPaymentTerm'

/* 表单组件 */
import FormPageLayout from '@/components/formPageLayout/index.vue'
import FormCollapseItemTitle from '@/components/formCollapseItemTitle/index.vue'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import CommonSelect from '@/components/Common/commonSelect'
import CommonSelectGroup from '@/components/Common/commonSelect/commonSelectGroup.vue'
import CommonSelectAndList from '@/components/Common/commonSelect/CommonSelectAndList.vue'
import CommonMultipleSelect from '@/components/Common/commonMultipleSelect'
import FormSteps from '@/components/formSteps/index.vue'
import DocumentNoLink from '@/components/Common/documentNoLink'
/* 版本对比专用显示组件 */
import ComparisonInput from '@/components/Common/comparisonInput'

/* 系统通知类 */
import SysNotifyClass from '@/layout/components/notifications/sysNotify/sysNotify.js'
import bigUtils from '@/utils/bigUtils/index'
import { isEmail } from '@/utils/validate.js'
// vant
import {
  NavBar,
  Swipe,
  SwipeItem,
  Tab,
  Tabs,
  Step,
  Steps,
  Icon,
  Form,
  Field,
  Button,
  Picker,
  Popup
} from 'vant'
import Vue2OrgTree from 'vue-tree-color'

import 'ant-design-vue/dist/antd.css'
import { TreeSelect } from 'ant-design-vue' // 引入样式

Vue.prototype.download = download
Vue.prototype.isEmail = isEmail

Vue.prototype.$importOrExportDownFile = importOrExportDownFile
Vue.use(Vue2OrgTree)
Vue.use(delEmptyParam)
Vue.use(NavBar)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Icon)
Vue.use(NavBar)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Form)
Vue.use(Field)
Vue.use(Button)
Vue.use(Picker)
Vue.use(Popup)
Vue.use(bigUtils)
Vue.use(TreeSelect)
// if (getToken()) {
//   queryAllPageList()
//   initSystemConfig()
// }
// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.MyDictDataClass = MyDictDataClass
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.appointTime = appointTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.handleTree = handleTree
Vue.prototype.checkPermi = checkPermi
Vue.prototype.checkRole = checkRole
Vue.prototype.$isContain = isContain
Vue.prototype.$sysNotifyClass = SysNotifyClass
Vue.prototype.$TypeJudge = TypeJudge
Vue.prototype.showUomLabel = showUomLabel

Vue.prototype.getMenuTitle = (title) => {
  // return i18n.t('menu.testMenu')
  return i18n.t(`menu.${title}`)
}
Vue.prototype.getMenuTitleDelEdit = (title) => {
  // return i18n.t('menu.testMenu')
  const str = i18n.t(`menu.${title}`)
  return str.replace(/^(Create\s|add\s|edit\s|view\s|revise\s|创建|新增|编辑|查看|修正)/i, '')
}

Vue.prototype.getFileNameDate = (fileName) => {
  // return i18n.t('menu.testMenu')
  return `${fileName} ${parseTime(Date.now(), 'yyyy-MM-dd')}`
}
// 获取表头字段排序列表，固定列放前面
Vue.prototype.getTablePropListForSort = (configColumn) => {
  if (!configColumn) return undefined
  const fixedProps = []
  const props = []
  configColumn.forEach((item) => {
    if (item.fixed) {
      fixedProps.push(item.prop)
    } else {
      props.push(item.prop)
    }
  })
  return [...fixedProps, ...props]
}

/* Vue.prototype.backPrevRoute = () => {
  const currRoute = router.history.current
  const prevRoute = router.prevRoute || {}
  if (!prevRoute.path || prevRoute.path === currRoute.path) {
    store.dispatch('tagsView/delView', currRoute)
    router.push({ path: '/' })
  } else {
    store.dispatch('tagsView/delView', currRoute)
    router.back()
  }
} */

Vue.prototype.$EventBus = new Vue()
// 全局组件挂载
Vue.component('MapDrawingPolygon', MapDrawingPolygon)
Vue.component('searchForm', searchForm)
Vue.component('commonProductAndPicture', commonProductAndPicture)
Vue.component('DictTag', DictTag)
// eslint-disable-next-line vue/multi-word-component-names
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
// eslint-disable-next-line vue/multi-word-component-names
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('myUpload', myUpload)
Vue.component('FileImport', FileImport)
Vue.component('ExportDlg', ExportDlg)
Vue.component('ImportDlg', ImportDlg)

Vue.component('DescriptionToolTipShow', descriptionToolTipShow)
Vue.component('DescriptionEditDlg', descriptionEditDlg)

Vue.component('ToolTipShowCategory', ToolTipShowCategory)
Vue.component('ToolTipShowList', ToolTipShowList)
Vue.component('ToolTipShowObj', ToolTipShowObj)
/* 重写 el-input-number 组件 */
Vue.component('el-input-number', ElInputNumber)

Vue.component('ToolTipPaymentTerm', ToolTipPaymentTerm)

/* 地图选点组件 */
Vue.component('MapPointSelect', MapPointSelect)
// 电话号码输入组件
Vue.component('MobilePhoneInput', MobilePhoneInput)
// 虚拟下拉组件-用于 表单点击下拉框 弹出弹窗
Vue.component('SelectInput', SelectInput)
/* 表单公用组件 */
Vue.component('FormPageLayout', FormPageLayout)
Vue.component('FormCollapseItemTitle', FormCollapseItemTitle)
Vue.component('FormPageLayoutTabs', FormPageLayoutTabs)
Vue.component('CommonSelect', CommonSelect)
Vue.component('CommonSelectGroup', CommonSelectGroup)
Vue.component('CommonSelectAndList', CommonSelectAndList)
Vue.component('CommonMultipleSelect', CommonMultipleSelect)
Vue.component('FormSteps', FormSteps)
Vue.component('DocumentNoLink', DocumentNoLink)
/* 版本对比专用显示组件 */
Vue.component('ComparisonInput', ComparisonInput)

Vue.use(VueAwesomeSwiper)
Vue.use(MyColorPicker)
Vue.use(MyInput)
/* 重写 el-date-picker 组件 */
Vue.use(MyDatePicker)
Vue.component('CustomDateTime', CustomDateTime)
Vue.component('TablePropError', TablePropError)
Vue.component('TableNonInventoryItem', TableNonInventoryItem)

Vue.use(numberTofixed)
Vue.use(resultOfBoolean)
Vue.use(trimOfObj)
Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
Vue.use(UmyUi)

Tooltip.props.effect.default = 'light'
Table.props.tooltipEffect = {
  type: String,
  default: 'light'
}
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value),
  effect: 'light'
})

DictData.install()

Vue.prototype.$getDecNum = (num) => {
  if (Vue.prototype.$resultOfBoolean(num)) {
    return num
  }
  return 3
}

/* 此方法主要用于QTY因为转换系数导致的小数显示不正确 */
Vue.prototype.$qtyNumberStr = (num, decimalNum) => {
  function getDecimalPlaces(num1) {
    // 将数字转换为字符串
    const numStr = (num1 || 0).toString()
    // 查找小数点的位置
    const decimalIndex = numStr.indexOf('.')

    // 如果没有小数点，返回 0
    if (decimalIndex === -1) {
      return 0
    }
    const dNum = numStr.length - decimalIndex - 1
    // 最多精确到4位小数
    return dNum >= 4 ? 4 : dNum
  }
  if (decimalNum === 3) {
    return Vue.prototype.$numberStr(num, 3)
  } else {
    /* 根据数值后面的小数位数返回，最多精确到4位小数 */
    return Vue.prototype.$numberStr(num, getDecimalPlaces(num))
  }
}

// 用于传 menuPerms 给后端, 过滤数据权限
Vue.prototype.menuKey = {
  BP: 'businessPartner:businessPartner',
  productInfo: 'productManagement:productInfo',
  // 采购
  PR: 'purchaseManagement:purchaseRequisition',
  RFQ: 'purchaseManagement:requestForQuotation',
  PQ: 'purchaseManagement:purchaseQuotation',
  PO: 'purchaseManagement:purchaseOrder',
  purchaseReturnOrder: 'purchaseManagement:purchaseReturnOrder',
  consignmentOrder: 'purchaseManagement:consignmentOrder',
  logisticsCost: 'purchaseManagement:logisticsCost',
  supplierContract: 'purchaseManagement:supplierContract',
  ASL: 'purchaseManagement:asl',

  // 销售
  customerQuestionnaire: 'salesManagement:customerQuestionnaire',
  serviceOrder: 'salesManagement:serviceOrder',
  salesInquiry: 'salesManagement:salesInquiry',
  salesQuotation: 'salesManagement:salesQuotation',
  preDeliveryNotice: 'salesManagement:preDeliveryNotice',
  salesGoodsReturn: 'salesManagement:salesGoodsReturn',
  project: 'projectManagement:project',
  proformaInvoice: 'salesManagement:proformaInvoice',

  transferOrder: 'inventoryManagement:transferOrder',
  inventoryAudit: 'inventoryManagement:inventoryAudit',
  inventoryReport: 'inventoryManagement:inventoryReport',
  safetyStock: 'inventoryManagement:safetyStock',
  inventoryInitialization: 'inventoryManagement:inventoryInitialization',
  storeIssueChit: 'projectManagement:storeIssueChit',
  projectProduction: 'projectManagement:projectProduction',
  productRelationship: 'productManagement:productRelationship',
  emergencyGoodsReceipt: 'inventoryManagement:emergencyGoodsReceipt'
}

/*
menuPerms: this.menuKey.supplierContract
param.menuPerms = this.menuKey.supplierContract
*/

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
})

Vue.config.productionTip = false

window.addEventListener('visibilitychange', function () {
  // 这个方法是监测浏览器窗口发生变化的时候执行
  // const num = Number(sessionStorage.getItem('entryIdx')) || 0
  // let type
  // switch (num) {
  //   case 0:
  //     type = 'operation'
  //     break
  //   case 1:
  //     type = 'carrier'
  //     break
  //   case 2:
  //     type = 'consignor'
  //     break
  // }
  if (document.hidden === false && getToken() !== store.getters.token) {
    if (!getToken()) {
      // router.replace({ path: '/login?redirect=/index&type=' + type })
      router.replace({ path: '/login?redirect=/index' }).catch(() => {})
      location.reload()
      return
    }
    if (location.pathname === '/index') {
      location.reload()
    }

    router.replace({ path: '/index' })
  }
})

Vue.mixin({
  data() {
    return {
      $$route: undefined
    }
  },
  created() {
    this.$$route = this.$route
  },
  methods: {
    setRouteTitleView(isDisFrom) {
      const rt = { ...this.$$route }
      const title = rt.meta.title
      if (!isDisFrom) {
        rt.title = title.replace(/^view/, 'edit')
      } else {
        rt.title = title.replace(/^edit/, 'view')
      }
      this.$store.dispatch('tagsView/updateVisitedView', rt)
    }
  }
})

// 全局事件总线
// Vue.prototype.$bus = new Vue()

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: (h) => {
    SysNotifyClass.$createElement = h
    return h(App)
  },
  created() {
    SysNotifyClass.$vue = this
    SysNotifyClass.$router = router
    SysNotifyClass.$store = store
    // if (this.isMobile()) {
    //   this.queryDomainName()
    // }
    const pathname = window.location.pathname
    const list = ['/customerQuestionnaire', '/externalPQ', '/externalPQSuccess']
    if (getToken() && list.indexOf(pathname) === -1) {
      queryAllPageList()
      initSystemConfig()
    }
  },
  methods: {
    queryDomainName() {
      queryDomainName().then((res) => {
        const url = window.location.href
        const info = url.split('?')[1]
        const code = new URLSearchParams('?' + info)
        const type = code.get('type')
        if (type && type === 'customer') {
          window.location.href = res.data.domainCustomerH5
        } else {
          window.location.href = res.data.domainMerchantH5
        }
      })
    },
    isMobile() {
      const flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
      return flag
    }
  }
})
