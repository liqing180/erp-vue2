import i18n from '@/lang' // 国际化语言包
export default {
  getErrorCode(code) {
    if (code === 401) {
      return i18n.t('errorCode.401')
    }
    if (code === 403) {
      return i18n.t('errorCode.403')
    }
    if (code === 404) {
      return i18n.t('errorCode.404')
    }
    return null
  },
  getErrorDefault() {
    return i18n.t('errorCode.default')
  },
  getErrorTimeout() {
    return i18n.t('errorCode.timeout')
  }
}

// {
//   401: i18n.t('errorCode.401'),
//   403: i18n.t('errorCode.403'),
//   404: i18n.t('errorCode.404'),
//   // The server is currently not available, please try again later.
//   default: i18n.t('errorCode.default')
// }
