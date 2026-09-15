import Cookies from 'js-cookie'
import cache from '@/plugins/cache'
const getInitLanguage = () => {
  const initLang = Cookies.get('language')
  if (!initLang) {
    Cookies.set('language', 'en')
    cache.local.set('language', 'en')
  }
  return initLang || 'en'
}
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'mini', // default
  language: getInitLanguage(),
  confirmDlg401: false,
  confirmDlg410: false,
  operatingFloorFullScreen: false
}

const mutations = {
  SET_CONFIRM_401: (state, boolean) => {
    state.confirmDlg401 = boolean
  },
  SET_CONFIRM_410: (state, boolean) => {
    state.confirmDlg410 = boolean
  },
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
    cache.local.set('language', language)
  },
  // 工作台全屏
  SET_OPERATING_FLOOR_FULLSCREEN: (state, data) => {
    state.operatingFloorFullScreen = data
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
