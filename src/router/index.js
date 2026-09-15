import Vue from 'vue'
import Router from 'vue-router'
import organization from './organization'
import system from './system'
import bp from './bp'
import productManagement from './productManagement'
import purchaseManagement from './purchaseManagement'
import salesManagement from './salesManagement'
import inventoryManagement from './inventoryManagement'
import projectManagement from './projectManagement'
import reportManagement from './reportManagement'

/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/authLogin',
    component: (resolve) => require(['@/views/authLogin'], resolve),
    hidden: true
  },
  {
    path: '/register',
    component: (resolve) => require(['@/views/register'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '/settingNewPassword',
    component: (resolve) => require(['@/views/settingNewPassword'], resolve),
    hidden: true
  },
  {
    path: '/customerQuestionnaire',
    component: (resolve) => require(['@/views/customerQuestionnaire'], resolve),
    hidden: true
  },
  {
    path: '/externalPQ',
    component: (resolve) => require(['@/views/externalPQ'], resolve),
    hidden: true
  },
  {
    path: '/externalPQSuccess',
    component: (resolve) => require(['@/views/externalPQSuccess'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: 'Index',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: { title: 'userInfo' }
      },
      {
        path: 'addUser',
        component: (resolve) => require(['@/views/system/user/addUser'], resolve),
        name: 'AddUser',
        meta: { title: 'addUser', activeMenu: '/system/user' }
      },
      {
        path: 'editUser',
        component: (resolve) => require(['@/views/system/user/editUser'], resolve),
        name: 'EditUser',
        meta: { title: 'editUser', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: (resolve) => require(['@/views/system/role/authUser'], resolve),
        name: 'AuthUser',
        meta: { title: 'assignUser', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'DictData',
        meta: { title: 'dictData', activeMenu: '/system/systemConfiguration/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/monitor/job/log'], resolve),
        name: 'JobLog',
        meta: { title: 'jobLog', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'GenEdit',
        meta: { title: 'genEdit', activeMenu: '/tool/gen' }
      }
    ]
  },
  {
    path: '/bpm',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'history',
        component: (resolve) => require(['@/views/bpm/history/history'], resolve),
        name: 'History',
        meta: { title: 'history' }
      }
    ]
  },
  organization,
  system,
  bp,
  productManagement,
  purchaseManagement,
  salesManagement,
  inventoryManagement,
  projectManagement,
  reportManagement
]
export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
