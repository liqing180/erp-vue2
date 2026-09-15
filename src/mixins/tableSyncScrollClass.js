/**
 * 双表格滚动同步器
 * 适用于 Element UI el-table 上下对比场景，支持多组实例独立运行
 */
export default class TableSyncScrollClass {
  constructor() {
    // 容器缓存
    this.beforeWrapper = undefined
    this.beforeHeaderWrapper = undefined
    this.afterWrapper = undefined
    this.afterHeaderWrapper = undefined
    this.scrollType = undefined
    this.timer = undefined
    this.getMinWidth = undefined

    // 绑定this，确保removeEventListener能精准移除
    this._handleBeforeScroll = this._handleBeforeScroll.bind(this)
    this._handleAfterScroll = this._handleAfterScroll.bind(this)
  }

  // 初始化：版本对比弹窗，表格同步滚动
  initAsyncScroll({ beforeTableRef, afterTableRef, columns, afterDetailList, getMinWidth }) {
    /**
     * @param {ref} beforeTableRef  上表体滚动容器
     * @param {ref} afterTableRef   下表体滚动容器
     */
    if (this.beforeWrapper || this.afterWrapper) {
      this.destroy()
    }
    if (beforeTableRef) {
      beforeTableRef.doLayout()
      this.beforeWrapper = beforeTableRef.bodyWrapper
      this.beforeHeaderWrapper = beforeTableRef.$el.querySelector('.el-table__header-wrapper')
    }
    if (afterTableRef) {
      afterTableRef.doLayout()
      this.afterWrapper = afterTableRef.bodyWrapper
      this.afterHeaderWrapper = afterTableRef.$el.querySelector('.el-table__header-wrapper')
    }
    if (this.beforeWrapper && this.afterWrapper) {
      this.beforeWrapper.addEventListener('scroll', this._handleBeforeScroll)
      this.afterWrapper.addEventListener('scroll', this._handleAfterScroll)
    }
    if (afterDetailList && afterDetailList.length > 0) {
      this.scrollFirstChangeCell(columns, afterDetailList, this.afterWrapper, getMinWidth)
    }
  }

  // 上表滚动 → 同步下表
  _handleBeforeScroll() {
    if (this.scrollType === 'after') return
    this.scrollType = 'before'
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.scrollType = undefined
    }, 200)
    requestAnimationFrame(() => {
      this.afterWrapper.scrollLeft = this.beforeWrapper.scrollLeft
      this.afterHeaderWrapper.scrollLeft = this.beforeWrapper.scrollLeft
    })
    // console.log('Before scrollLeft:', this.beforeWrapper.scrollLeft)
  }

  // 下表滚动 → 同步上表
  _handleAfterScroll() {
    if (this.scrollType === 'before') return
    this.scrollType = 'after'
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.scrollType = undefined
    }, 200)
    requestAnimationFrame(() => {
      this.beforeWrapper.scrollLeft = this.afterWrapper.scrollLeft
      this.beforeHeaderWrapper.scrollLeft = this.afterWrapper.scrollLeft
    })
    // console.log('after scrollLeft:', this.afterWrapper.scrollLeft)
  }

  // 滚动到第一个修改的单元格
  scrollFirstChangeCell(columns, afterDetailList, afterWrapper, getMinWidth) {
    // if (afterDetailList.find((x) => x.updateType === '2')) return
    let changeCellLeft = 0
    const changeCell = columns.find((x) => {
      const change = afterDetailList.find((p) => {
        if (p.updateMsgList && p.updateMsgList.length > 0) {
          if (p.updateMsgList.find((u) => u.name === x.prop)) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
      if (change) {
        return true
      } else {
        if (!x.fixed && x.visible) {
          changeCellLeft += getMinWidth(x)
        }
        return false
      }
    })
    if (!changeCell) return
    if (changeCell.fixed) return
    afterWrapper.scrollLeft = changeCellLeft
  }

  // 销毁实例：移除事件监听，清空引用
  destroy() {
    if (this.beforeWrapper) {
      this.beforeWrapper.removeEventListener('scroll', this._handleBeforeScroll)
    }
    if (this.afterWrapper) {
      this.afterWrapper.removeEventListener('scroll', this._handleAfterScroll)
    }
    this.beforeWrapper = null
    this.afterWrapper = null
    this.beforeHeaderWrapper = null
    this.afterHeaderWrapper = null
  }
}
