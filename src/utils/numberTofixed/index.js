/**
 * 解决数字toFixed精度问题
 */
import Big from 'big.js/big.mjs'
import TypeJudge from '@/utils/jsType/index'
import store from '@/store'

/* 只有印度尼西亚国家使用类型2 */
export const getSplitType = () => {
  const legalEntityInfo = store.state.user.legalEntityInfo || {}
  const countryId = legalEntityInfo.countryId
  if (countryId === '96') {
    return '2'
  }
  return '1'
}
export const getToFixedType = () => {
  // 0:上舍入， 1：下舍入 4: 四舍五入
  // 向上取整：Math.ceil(x)
  // 向下取整：Math.floor(x)
  const toFixedType = store.state.user.toFixedType
  return toFixedType
}
export const numberStr = function (
  numData,
  toFixed,
  isShowStr,
  keepDec = true,
  minPrecision
) {
  if (TypeJudge.isNull(numData) || TypeJudge.isUndefined(numData)) {
    return ''
  }

  if (Number.isNaN(numData) || Number.isNaN(Number(numData))) {
    return ''
  }
  if (numData === '') {
    return ''
  }

  const big = new Big(numData)

  let rs = ''
  const toFixedType = getToFixedType()
  if (!toFixed) {
    if (toFixedType === '0') {
      rs = Math.ceil(big.toNumber()).toString()
    } else if (toFixedType === '1') {
      rs = Math.floor(big.toNumber()).toString()
    } else {
      rs = big.toFixed(0).toString()
    }
  } else {
    const num = Math.pow(10, toFixed)

    if (toFixedType === '0') {
      const value1 = Math.ceil(big.times(num)) / num
      rs = new Big(value1).toFixed(toFixed).toString()
    } else if (toFixedType === '1') {
      const value2 = Math.floor(big.times(num)) / num
      rs = new Big(value2).toFixed(toFixed).toString()
    } else {
      rs = big.toFixed(toFixed).toString()
    }
  }
  /* 新增功能 去除小数位后面多余的零 */
  if (!keepDec) {
    rs = rs.replace(/(\.[\d]*?)0+$/, '$1')
  }
  if (minPrecision !== undefined) {
    const decimalIndex = rs.indexOf('.')
    const decimalLength = decimalIndex === -1 ? 0 : rs.length - decimalIndex - 1
    if (decimalLength < minPrecision) {
      if (decimalIndex === -1) {
        rs += '.'
      }
      rs += '0'.repeat(minPrecision - decimalLength)
    }
  }
  if (isShowStr) {
    const splitType = getSplitType()
    if (splitType === '2') {
      rs = rs.replace('.', ',')
      let [integerPart, decimalPart] = rs.split(',')
      integerPart = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      if (decimalPart) {
        rs = integerPart + ',' + decimalPart
      } else {
        rs = integerPart
      }
    } else {
      let [integerPart, decimalPart] = rs.split('.')
      integerPart = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      if (decimalPart) {
        rs = integerPart + '.' + decimalPart
      } else {
        rs = integerPart
      }
    }
  }

  return rs
}
export default {
  install: function (vm) {
    // 返回字符串
    // keepDec 是否保留小数后面的零，minPrecision 去尾零后最少显示的小数位
    vm.prototype.$numberStr = function (numData, toFixed, keepDec, minPrecision) {
      return numberStr(numData, toFixed, true, keepDec, minPrecision)
    }

    // 返回数值
    vm.prototype.$num = function (numData, toFixed) {
      return Number(numberStr(numData, toFixed))
    }
  }
}
