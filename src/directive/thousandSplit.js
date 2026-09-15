/**
 * 使用说明
 * v-thousandSplit="{ precision: 2 }"
 * @param {number} precision 小数位, 默认 2
 * @param {number} minPrecision 最少显示的小数位
 */
import { numberStr, getSplitType } from '@/utils/numberTofixed/index.js'
const formatNumStr = (num, params) => {
  const precision = params.precision || 0
  /* keepDec 是否保留小数后面的零 */
  const keepDec = params.keepDec
  const minPrecision = params.minPrecision

  num = numberStr(num, precision, true, keepDec, minPrecision)
  return num
}

const directive = {
  inserted: function (el, binding) {
    const params = binding.value || {}
    // debugger
    // 获取input节点
    if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
      el = el.getElementsByTagName('input')[0]
    }
    // 千分位格式化
    el.value = formatNumStr(el.value, params)

    // 聚焦转化为数字格式（去除千分位）
    el.onfocus = (e) => {
      let a = el.value || ''
      const splitType = getSplitType()
      if (splitType === '2') {
        a = a.replace(/\./g, '') // 去除千分号的'.'
        a = a.replace(',', '.') // 小数符号 , 换成 .
      } else {
        a = a.replace(/,/g, '') // 去除千分号的','
      }
      el.value = a
    }
    // 失去焦点重新格式化
    el.onblur = (e) => {
      setTimeout(() => {
        // 格式化为千分位
        /* 这个可以拿到输入的值 */
        const num = el.getAttribute('aria-valuenow')
        if (num && num !== 'undefined') {
          el.value = formatNumStr(num, params)
        }
      }, 0)
    }
  },
  update: function (el, binding) {
    const params = binding.value || {}
    // debugger
    // 获取input节点
    if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
      el = el.getElementsByTagName('input')[0]
    }
    setTimeout(() => {
      // 去除千分位
      let a = el.value || ''
      const splitType = getSplitType()

      if (splitType === '2') {
        a = a.replace(/\./g, '') // 去除千分号的'.'
        a = a.replace(',', '.') // 小数符号 , 换成 .
      } else {
        a = a.replace(/,/g, '') // 去除千分号的','
      }
      // const valueWithoutComma = el.value.replace(/,/g, '') // 去除千分号的','
      // 转换为浮点数
      if (a) {
        el.value = formatNumStr(a, params)
      }
    }, 100)
  }
}

export default directive
