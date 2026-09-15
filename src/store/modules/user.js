import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, removeJSESSIONID } from '@/utils/auth'
import { queryAllPageList } from '@/mixins/tableMinx.js'
import { initSystemConfig } from '@/initSystemConfig/initSystemConfig.js'
import {
  queryTodoTaskCount,
  getInventoryAllPendingCounts,
  getSalesAllPendingCounts,
  getPurchaseAllPendingCounts
} from '@/api/bpm/bpm'
import { getConfigKey } from '@/api/system/config'

import cache from '@/plugins/cache'
const user = {
  state: {
    token: getToken(),
    name: '',
    nickName: '',
    corporateName: '',

    email: '',
    mobilePhone: '',
    mobileNum: '',
    mobileCode: '',

    userId: '',
    tenantType: '',
    avatar: '',
    roles: [],
    permissions: [],
    // 只处理时间中的年月日部分
    fmtForTime: null,
    // 文件大小
    sys_file_max_size: 300,
    // 文件数量
    sys_file_max_count: 9,
    online_preview_url: '',
    unReadNum: 0,
    searchMapAddressMiniMum: 4,
    // autoCode 1:自动生成编号 2:自动手动生成编号 3:手动生成编号
    autoCode: '2',
    // 法人信息
    legalEntityInfo: {},
    isAlreadySetPassword: '',
    // 0:上舍入， 1：下舍入 4: 四舍五入
    toFixedType: '4',
    // 单位
    commonUomList: [],
    bpmTaskCountData: {},
    /*
      stockInPendingCount：入库管理
      grnDetailPendingCount :预入库单
      grnPendingCount：收货入库
      receiptOrderPendingCount:收货单的待处理数量
      storeIssueChitPendingCount: 借货单的
      deliveryNoticePendingCount: 预出库单的
      putAwayPendingCount:待上架的
    */
    inventoryCountData: {},
    /*
      siPendingCount: 销售需求
      sqPendingCount: 销售报价
      soPendingCount: 销售订单
      pdnPendingCount ： 发货通知单
      sgrPendingCount: 销售退货
    */
    salesCountData: {},
    /*
      采购申请： prPendingCount
      询价台： rfqPendingCount
      报价单： pqPendingCount
      采购订单： poPendingCount
      采购退货单: purchaseReturnPendingCount
    */
    purchaseCountData: {},
    bpmTaskCountTimer: undefined,
    bpmTaskCountTimer2: undefined,
    bpmTaskCountTimer3: undefined,
    bpmTaskCountTimer4: undefined,
    legalEntityKey: 0,
    // 系统对接CDS true: 开 false: 关
    sysDockingSwitch: false,
    // 系统对接QC true: 开 false: 关
    sysDockingSwitchQC: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_User_Info: (state, data) => {
      state.email = data.email
      state.mobilePhone = data.mobilePhone
      state.mobileNum = data.mobileNum
      state.mobileCode = data.mobileCode
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_NICK_NAME: (state, nickName) => {
      state.nickName = nickName
    },
    SET_Corporate_Name: (state, name) => {
      state.corporateName = name
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    set_tenant_Type(state, tenantType) {
      state.tenantType = tenantType
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_FMTFORTIME(state, fmtForYMD) {
      state.fmtForTime = fmtForYMD
    },
    SET_ONLINE_PREVIEW_URL(state, url) {
      state.online_preview_url = url
    },
    set_search_map_address_minimum(state, num) {
      state.searchMapAddressMiniMum = num
    },
    setUnReadNum(state, unReadNum) {
      state.unReadNum = unReadNum
    },
    SET_AUTO_CODE(state, value) {
      state.autoCode = value
    },
    SET_LEGAL_ENTITY(state, value) {
      state.legalEntityInfo = value
    },
    SET_UOM_LIST(state, value) {
      state.commonUomList = value || []
    },
    SET_IS_ALREADY_SET_PASSWORD(state, value) {
      state.isAlreadySetPassword = value
    },
    SET_TO_FIXED_TYPE(state, value) {
      state.toFixedType = value
    },
    SET_TASK_COUNT(state, value) {
      state.bpmTaskCountData = value
    },
    SET_TASK_COUNT_TIMER(state, value) {
      if (state.bpmTaskCountTimer) {
        clearInterval(state.bpmTaskCountTimer)
      }
      state.bpmTaskCountTimer = value
    },
    setInventoryTaskCount(state, value) {
      state.inventoryCountData = value
    },
    SET_TASK_COUNT_TIMER2(state, value) {
      if (state.bpmTaskCountTimer2) {
        clearInterval(state.bpmTaskCountTimer2)
      }
      state.bpmTaskCountTimer2 = value
    },
    setSalesTaskCount(state, value) {
      state.salesCountData = value
    },
    SET_TASK_COUNT_TIMER3(state, value) {
      if (state.bpmTaskCountTimer3) {
        clearInterval(state.bpmTaskCountTimer3)
      }
      state.bpmTaskCountTimer3 = value
    },
    setPurchaseTaskCount(state, value) {
      state.purchaseCountData = value
    },
    SET_TASK_COUNT_TIMER4(state, value) {
      if (state.bpmTaskCountTimer4) {
        clearInterval(state.bpmTaskCountTimer4)
      }
      state.bpmTaskCountTimer4 = value
    },
    SET_LEGAL_ENTITY_KEY(state, value) {
      console.log('1')
      state.legalEntityKey = +new Date()
    },
    SET_DOCKING_SWITCH(state, value) {
      state.sysDockingSwitch = value
    },
    SET_DOCKING_SWITCH_QC(state, value) {
      state.sysDockingSwitchQC = value
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      const tenantCode = userInfo.tenantCode
      const tenantType = userInfo.tenantType
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid, tenantCode, tenantType)
          .then((res) => {
            console.log(res)
            const data = res.data || {}
            setToken(data.access_token)
            queryAllPageList()
            initSystemConfig()
            commit('SET_TOKEN', data.access_token)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const user = res.user
            const company = res.company || {}
            const avatar =
              // eslint-disable-next-line eqeqeq
              !user.avatar ? require('@/assets/images/profile2.png') : user.avatar
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', res.roles)
            } else {
              commit('SET_ROLES', ['ROLE_DEFAULT'])
            }
            commit('SET_PERMISSIONS', res.permissions || [])
            commit('SET_NAME', user.userName)
            commit('SET_User_Info', user)
            commit('SET_NICK_NAME', user.nickName)
            commit('SET_Corporate_Name', company.companyName)
            commit('SET_USER_ID', user.userId)
            commit('set_tenant_Type', user.tenantType)
            commit('SET_AVATAR', avatar)
            commit('SET_IS_ALREADY_SET_PASSWORD', user.isAlreadySetPassword)
            getConfigKey('sys.docking.cds.switch').then((response) => {
              if (response.code === 200 && response.msg) {
                const sysDockingSwitch = response.msg === 'true'
                commit('SET_DOCKING_SWITCH', sysDockingSwitch)
              }
            })
            getConfigKey('sys.docking.qc.switch').then((response) => {
              if (response.code === 200 && response.msg) {
                const sysDockingSwitchQC = response.msg === 'true'
                commit('SET_DOCKING_SWITCH_QC', sysDockingSwitchQC)
              }
            })
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_PERMISSIONS', [])
            commit('SET_TASK_COUNT_TIMER', undefined)
            commit('SET_TASK_COUNT_TIMER2', undefined)
            commit('SET_TASK_COUNT_TIMER3', undefined)
            commit('SET_TASK_COUNT_TIMER4', undefined)
            removeToken()
            removeJSESSIONID()
            resolve()
            cache.local.remove('pageSizeList')
            cache.local.remove('tableCellHideData')
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    getBPMTaskCount({ commit, state }) {
      // (返回值: myTodoTaskCount, systemTodoTaskCount, allTodoTaskCount)
      queryTodoTaskCount({}).then((res) => {
        const data = res.data || {}
        commit('SET_TASK_COUNT', data)
      })
      if (state.bpmTaskCountTimer) {
        clearInterval(state.bpmTaskCountTimer)
      }

      const timer = setInterval(() => {
        queryTodoTaskCount({}).then((res) => {
          const data = res.data || {}
          commit('SET_TASK_COUNT', data)
        })
      }, 30000)
      commit('SET_TASK_COUNT_TIMER', timer)
    },
    getInventoryTaskCount({ commit, state }) {
      getInventoryAllPendingCounts({}).then((res) => {
        const data = res.data || {}
        commit('setInventoryTaskCount', data)
      })
      if (state.bpmTaskCountTimer2) {
        clearInterval(state.bpmTaskCountTimer2)
      }

      const timer = setInterval(() => {
        getInventoryAllPendingCounts({}).then((res) => {
          const data = res.data || {}
          commit('setInventoryTaskCount', data)
        })
      }, 30000)
      commit('SET_TASK_COUNT_TIMER2', timer)
    },
    getSalesTaskCount({ commit, state }) {
      getSalesAllPendingCounts({}).then((res) => {
        const data = res.data || {}
        commit('setSalesTaskCount', data)
      })
      if (state.bpmTaskCountTimer3) {
        clearInterval(state.bpmTaskCountTimer3)
      }

      const timer = setInterval(() => {
        getSalesAllPendingCounts({}).then((res) => {
          const data = res.data || {}
          commit('setSalesTaskCount', data)
        })
      }, 30000)
      commit('SET_TASK_COUNT_TIMER3', timer)
    },
    getPurchaseTaskCount({ commit, state }) {
      getPurchaseAllPendingCounts({}).then((res) => {
        const data = res.data || {}
        commit('setPurchaseTaskCount', data)
      })
      if (state.bpmTaskCountTimer4) {
        clearInterval(state.bpmTaskCountTimer4)
      }

      const timer = setInterval(() => {
        getPurchaseAllPendingCounts({}).then((res) => {
          const data = res.data || {}
          commit('setPurchaseTaskCount', data)
        })
      }, 30000)
      commit('SET_TASK_COUNT_TIMER4', timer)
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        removeToken()
        removeJSESSIONID()
        resolve()
        commit('SET_TASK_COUNT_TIMER', undefined)
        commit('SET_TASK_COUNT_TIMER2', undefined)
        commit('SET_TASK_COUNT_TIMER3', undefined)
        commit('SET_TASK_COUNT_TIMER4', undefined)
        cache.local.remove('pageSizeList')
        cache.local.remove('tableCellHideData')
      })
    }
  }
}

export default user
