import { getConfigKey } from '@/api/system/config'
import store from '@/store/index.js'
// store.state.user.sys_file_max_size
export const initSystemConfig = () => {
  getConfigKey('google_map_service_key').then((response) => {
    if (response.msg) {
      InitMap(response.msg)
    }
  })
  getConfigKey('sys.file.onlinePreview').then((response) => {
    store.commit('SET_ONLINE_PREVIEW_URL', response.msg || '')
  })
  getConfigKey('mdm_search_map_address_minimum').then((response) => {
    store.commit('set_search_map_address_minimum', response.msg ? Number(response.msg) : 4)
  })
  getConfigKey('sys_is_auto_code').then((response) => {
    store.commit('SET_AUTO_CODE', response.msg || '2')
  })
  getConfigKey('rounding_mode').then((response) => {
    store.commit('SET_TO_FIXED_TYPE', response.msg || '4')
  })
}

export function InitMap(key) {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve()
      // 未载入谷歌地图API，则先载入API再初始化
    } else {
      // 载入谷歌地图和UI组件
      // AIzaSyDZAx7bjN6tzIR4rPxVNXVmTiaiG5a3IvY
      loadJs(
        'https://maps.googleapis.com/maps/api/js?key=' +
          key +
          '&libraries=drawing,places,visualization&v=3.62&language=en&callback=indexHtmlInitMap&loading=async'
      )
        .then(() => {
          resolve()
        })
        .catch((err) => {
          // ElementUI.Message.warning('地图资源未成功加载，请尝试检查网络或刷新浏览器')
          reject(err)
        })
    }
  })
}

function loadJs(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = () => {
      resolve()
    }
    script.onerror = (err) => {
      reject(err)
    }
    script.src = src
    document.getElementsByTagName('body')[0].appendChild(script)
  })
}
