/**
 * WebSocket协议请求后台数据
 * @param {String} url WebSocket协议的api接口url
 * @param {Object} param 键值对对象
 * @param {Function} cb 服务器返回信息后的回调，不能是箭头函数
 */
// import store from '@/store/index.js'
import { getToken } from '@/utils/auth'
function webSocketClient(url, param, cb) {
  const strWebSocketInBrowser = 'WebSocket'

  if (strWebSocketInBrowser in window) {
    const WS = new WebSocket(url)

    if (WS) {
      WS.onopen = function () {
        // const token = store.state.common.access_token
        const token = getToken()

        if (param && typeof param === 'object') {
          param.token = token
        } else {
          param = {}
          param.token = token
        }

        param = JSON.stringify(param)

        WS.send(param)
      }
      WS.onmessage = function (evt) {
        if (typeof cb === 'function') {
          cb(evt)
        }
      }
      return WS
    }
  } else {
    window.console.log('Your browser does not support WebSocket!!')
  }
}

export default webSocketClient
