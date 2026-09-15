import { Message, MessageBox, Notification, Loading } from 'element-ui'
import i18n from '@/lang' // 国际化语言包
let loadingInstance
const getTypeStr = (data) => {
  return Object.prototype.toString.call(data)
}
class MsgErrorClass {
  constructor() {
    this.MsgErrorList = []
    this.closeAll = () => {
      this.MsgErrorList.forEach((item) => {
        if (item && typeof item.close === 'function') {
          item.close()
        }
      })
      this.MsgErrorList = []
    }
    this.closeForMsg = (message) => {
      this.MsgErrorList.forEach((item, index) => {
        if (message === item.message) {
          if (item && typeof item.close === 'function') {
            item.close()
          }
          this.MsgErrorList.splice(index, 1)
        }
      })
    }
    this.addMsgError = (instance) => {
      this.MsgErrorList.push(instance)
    }
  }
}
const msgErrorClass = new MsgErrorClass()
export default {
  // 消息提示
  msg(content) {
    Message.info(content)
  },
  // 错误消息
  msgError(content) {
    // console.log(getTypeStr('111')) [object String]
    // console.log(getTypeStr({ a: '1' })) [object Object]
    if (getTypeStr(content) === '[object Object]') {
      msgErrorClass.closeForMsg(content.message)
      const instance = Message.error({
        duration: 4000,
        ...content,
        showClose: true
      })
      msgErrorClass.addMsgError(instance)
    } else {
      msgErrorClass.closeForMsg(content)
      const instance = Message.error({
        duration: 4000,
        message: content,
        showClose: true
      })

      msgErrorClass.addMsgError(instance)
    }
  },
  // 成功消息
  msgSuccess(content) {
    Message.success(content)
  },
  // 警告消息
  msgWarning(content) {
    if (getTypeStr(content) === '[object Object]') {
      const instance = Message.warning({
        duration: 4000,
        ...content,
        showClose: true
      })
      msgErrorClass.addMsgError(instance)
    } else {
      const instance = Message.warning({
        duration: 4000,
        message: content,
        showClose: true
      })
      msgErrorClass.addMsgError(instance)
    }
  },
  // 弹出提示
  alert(content) {
    MessageBox.alert(content, '系统提示')
  },
  // 错误提示
  alertError(content) {
    MessageBox.alert(content, '系统提示', { type: 'error' })
  },
  // 成功提示
  alertSuccess(content) {
    MessageBox.alert(content, '系统提示', { type: 'success' })
  },
  // 警告提示
  alertWarning(content) {
    MessageBox.alert(content, '系统提示', { type: 'warning' })
  },
  // 通知提示
  notify(content) {
    Notification.info(content)
  },
  // 错误通知
  notifyError(content) {
    Notification.error(content)
  },
  // 成功通知
  notifySuccess(content) {
    Notification.success(content)
  },
  // 警告通知
  notifyWarning(content) {
    Notification.warning(content)
  },
  // 确认窗体
  confirm(content, title = '', type = 'warning') {
    return MessageBox.confirm(content, title, {
      confirmButtonText: i18n.t('uiBtn.yes'),
      cancelButtonText: i18n.t('uiBtn.no'),
      type: type
    })
  },
  // 打开遮罩层
  loading(content) {
    loadingInstance = Loading.service({
      lock: true,
      text: content,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  },
  // 关闭遮罩层
  closeLoading() {
    loadingInstance.close()
  }
}

export { msgErrorClass }
