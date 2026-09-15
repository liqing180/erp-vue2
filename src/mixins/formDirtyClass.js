import i18n from '@/lang' // 国际化语言包
import { isEqual, union } from 'lodash'
/**
 * 表单页面刷新关闭提示是否保存
 */
import { MessageBox } from 'element-ui'
class FormDirty {
  constructor() {
    this.routeStatusData = {}
  }
  /*
    formDirtyClass.routeStatusData.addPurchaseRequisition = {
      $vm: this,
      saveShow: true,
      submitShow: true,
      isChange: true,
      isSaveSuccess: false,
      saveOrSubmitFn: und
    }
  */

  // 1.
  updatedInitFormJsonProp(pageKey, params) {
    const pageItem = this.routeStatusData[pageKey]
    if (!pageItem) return
    const initFormJson = pageItem.initFormJson
    if (!initFormJson) return
    const initFormJsonObj = JSON.parse(initFormJson)
    Object.keys(params).forEach((key) => {
      initFormJsonObj[key] = params[key]
    })
    pageItem.initFormJson = JSON.stringify(initFormJsonObj)
  }

  showConfirm() {
    return new Promise((resolve) => {
      MessageBox.confirm(i18n.t('ui.unsavedChangesTip'), i18n.t('ui.unsavedChanges'), {
        distinguishCancelAndClose: true,
        confirmButtonText: i18n.t('uiBtn.save'),
        cancelButtonText: i18n.t('uiBtn.doNotSave'),
        customClass: 'fd-custom-class'
      })
        .then(() => {
          resolve('save')
        })
        .catch((action) => {
          console.log(action)

          action === 'cancel' ? resolve('doNotSave') : resolve('stop')
        })
    })
  }

  // 2. 弹出通知
  async showNotify(pageKey) {
    if (!this.checkIsNoSave(pageKey)) return 'doNotSave'
    const hasAuth = await this.showConfirm()
    const pageItem = this.routeStatusData[pageKey]
    pageItem.confirmTimer = Date.now()
    return hasAuth
  }

  checkIsChange(pageItem) {
    if (!pageItem.initFormJson) {
      return true
    }
    if (!pageItem.getFormJson) {
      return true
    }
    try {
      const initFormObj = JSON.parse(pageItem.initFormJson)
      const formObj = JSON.parse(pageItem.getFormJson())
      // 递归清洗：删除对象中值为 '' / undefined 的属性；递归清洗元素
      function cleanEmptyProps(obj) {
        if (Array.isArray(obj)) {
          return obj
            .map((item) => cleanEmptyProps(item))
            .filter((item) => item !== '' && item !== undefined)
        }

        if (obj && typeof obj === 'object') {
          return Object.keys(obj).reduce((result, key) => {
            const value = cleanEmptyProps(obj[key])

            // 删除空字符串和 undefined
            if (value !== '' && value !== undefined) {
              result[key] = value
            }

            return result
          }, {})
        }

        return obj
      }
      const initFormObjClean = cleanEmptyProps(initFormObj)
      const formObjClean = cleanEmptyProps(formObj)
      console.groupCollapsed('对比数据')
      // console.log('initJson', JSON.stringify(initFormObjClean))
      // console.log('formJson', JSON.stringify(formObjClean))
      console.log('initObj', initFormObjClean)
      console.log('formObj', formObjClean)
      const allKeys = union(Object.keys(initFormObjClean), Object.keys(formObjClean))
      const changedItem = []
      allKeys.forEach((key) => {
        const initValue = initFormObjClean[key]
        const formValue = formObjClean[key]
        if (!isEqual(initValue, formValue)) {
          changedItem.push({
            key,
            initValue,
            formValue
          })
          console.log(key, initValue, formValue)
        }
      })
      console.log('changedItem', changedItem)

      console.groupEnd()

      return !isEqual(initFormObjClean, formObjClean)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  checkIsNoSave(pageKey) {
    const pageItem = this.routeStatusData[pageKey]
    if (!pageItem) return false
    if (pageItem.confirmTimer && Date.now() - pageItem.confirmTimer < 200) return false
    if (pageItem.$vm._isDestroyed) {
      return false
    }
    /* pageItem.submitShow 目前先做保存按钮，没有保存按钮，页面关闭不会有提醒 */
    if (pageItem.saveShow && !pageItem.isSaveSuccess && this.checkIsChange(pageItem)) {
      return true
    }
    return false
  }

  checkIsNoSaveForAll() {
    const keys = Object.keys(this.routeStatusData)
    const noSavePageKey = keys.find((pageKey) => {
      return this.checkIsNoSave(pageKey)
    })
    return {
      isNoSave: !!noSavePageKey,
      noSaveItem: noSavePageKey ? this.routeStatusData[noSavePageKey] : undefined
    }
    // const isNoSave =
  }
}
// 全局单例导出
const formDirtyClass = new FormDirty()

export { formDirtyClass }
