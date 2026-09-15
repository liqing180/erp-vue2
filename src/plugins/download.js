import { saveAs } from 'file-saver'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import i18n from '@/lang' // 国际化语言包
const baseURL = process.env.VUE_APP_BASE_API

export default {
  name(name, isDelete = true) {
    const url = baseURL + '/common/download?fileName=' + encodeURI(name) + '&delete=' + isDelete
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { Authorization: 'Bearer ' + getToken() }
    }).then(async (res) => {
      const isLogin = await this.blobValidate(res.data)
      if (isLogin) {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURI(res.headers['download-filename']))
      } else {
        Message.error(i18n.t('ui.invalidSession'))
      }
    })
  },
  resource(resource) {
    const url = baseURL + '/common/download/resource?resource=' + encodeURI(resource)
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { Authorization: 'Bearer ' + getToken() }
    }).then(async (res) => {
      const isLogin = await this.blobValidate(res.data)
      if (isLogin) {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURI(res.headers['download-filename']))
      } else {
        Message.error(i18n.t('ui.invalidSession'))
      }
    })
  },
  zip(url, name) {
    const urlStr = baseURL + url
    axios({
      method: 'get',
      url: urlStr,
      responseType: 'blob',
      headers: { Authorization: 'Bearer ' + getToken() }
    }).then(async (res) => {
      const isLogin = await this.blobValidate(res.data)
      if (isLogin) {
        const blob = new Blob([res.data], { type: 'application/zip' })
        this.saveAs(blob, name)
      } else {
        Message.error(i18n.t('ui.invalidSession'))
      }
    })
  },
  saveAs(text, name, opts) {
    saveAs(text, name, opts)
  },
  async blobValidate(data) {
    try {
      const text = await data.text()
      JSON.parse(text)
      return false
    } catch (error) {
      return true
    }
  }
}
