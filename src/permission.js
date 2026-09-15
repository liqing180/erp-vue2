import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { msgErrorClass } from '@/plugins/modal'
// import { formDirtyClass } from '@/mixins/formDirtyClass'

NProgress.configure({ showSpinner: false })

const whiteList = [
  '/login',
  '/auth-redirect',
  '/bind',
  '/register',
  '/order/transfer',
  '/appH5/order/index',
  '/appH5/order/orderDetail',
  '/appH5/order/waybillDetail',
  '/appH5/verification/index',
  '/appH5/verification/verification',
  '/appH5/verification/signature',
  '/settingNewPassword',
  '/customerQuestionnaire',
  '/externalPQ',
  '/externalPQSuccess',
  '/authLogin'
]

router.beforeEach(async (to, from, next) => {
  msgErrorClass.closeAll()
  /* const msg = await formDirtyClass.showNotify(from.name)
  if (msg === 'save') {
    const pageItem = formDirtyClass.routeStatusData[from.name]
    pageItem.saveOrSubmitFn && pageItem.saveOrSubmitFn()
    return
  } else if (msg === 'stop') {
    next(false)
    NProgress.done()
    return
  } */

  router.prevRoute = from
  NProgress.start()
  if (whiteList.indexOf(to.path) !== -1) {
    // 在免登录白名单，直接进入
    next()
  } else if (getToken()) {
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    /* has token */
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch('GetInfo')
          .then(() => {
            store.dispatch('GenerateRoutes').then((accessRoutes) => {
              // 根据roles权限生成可访问的路由表
              router.addRoutes(accessRoutes) // 动态添加可访问路由表
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            })
          })
          .catch((err) => {
            store.dispatch('LogOut').then(() => {
              Message.error(err)
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      if (to.path === '/bpm/history') {
        next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
      } else {
        const type = sessionStorage.getItem('type') || ''
        if (type && type !== 'undefined') {
          next('/login?redirect=/index&type=' + type) // 否则全部重定向到登录页
        } else {
          next('/login?redirect=/index') // 否则全部重定向到登录页
        }
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
