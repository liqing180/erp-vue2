/**
 * 浏览器桌面通知封装
 */
export default class BrowserNotify {
  constructor() {
    // 缓存权限状态
    this.permission = Notification.permission
    this.notifyComponent = {}
  }

  // 1. 请求用户授权通知权限
  requestAuth() {
    return new Promise((resolve) => {
      // 已授权直接返回
      if (this.permission === 'granted') {
        resolve(true)
        return
      }
      /* // 拒绝过不再重复请求
      if (this.permission === 'denied') {
        resolve(false)
        return
      } */
      // 发起授权弹窗
      Notification.requestPermission().then((res) => {
        this.permission = res
        resolve(res === 'granted')
      })
    })
  }

  /**
   * 判断当前页面是否失焦（不在当前窗口）
   * @returns {boolean} true=页面隐藏/切走，需要桌面通知；false=当前正在系统页面，无需桌面通知
   */
  isPageBlur() {
    // document.hidden：标签页被切换、最小化
    // !document.hasFocus()：浏览器窗口失去焦点
    return document.hidden
  }

  // 2. 弹出桌面通知
  async showNotify(options = {}) {
    if (!this.isPageBlur()) return false
    const hasAuth = await this.requestAuth()

    if (!hasAuth) return
    const { title, body, icon = '', onClick, notifyID } = options

    if (this.notifyComponent[notifyID]) {
      this.notifyComponent[notifyID].close()
      delete this.notifyComponent[notifyID]
    }

    const notify = new Notification(title, {
      body,
      icon,
      tag: notifyID, // 相同tag会覆盖旧通知，避免大量堆叠
      silent: false, // 通知弹出时是否发出提示音、震动, Firefox、Safari：不支持 silent，设置了也不生效
      requireInteraction: true // 禁止自动关闭
    })
    this.notifyComponent[notifyID] = notify
    // 点击通知回调：切回系统页面/打开对应任务
    notify.onclick = () => {
      // 激活当前浏览器窗口
      window.focus()
      // 自定义跳转逻辑
      if (typeof onClick === 'function') onClick()
      notify.close()
    }

    // 自动关闭通知
    // if (duration) setTimeout(() => notify.close(), duration)
  }

  // 3. 批量清除所有通知

  closeNotify(notifyID) {
    if (this.notifyComponent[notifyID]) {
      delete this.notifyComponent[notifyID]
    }
  }

  closeNotifyAll() {
    const data = this.notifyComponent
    Object.keys(data).forEach((key) => {
      data[key].close()
      delete data[key]
    })
  }
}

// 全局单例导出
export const browserNotify = new BrowserNotify()
