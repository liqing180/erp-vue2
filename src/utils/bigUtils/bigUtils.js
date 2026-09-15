/*
 * @Date: 2019-09-04 18:02:04
 * @LastEditTime: 2019-09-05 14:05:57
 * @LastEditors: Jun Yang
 * @Description: It is util of the big.js.
 */
import Big from 'big.js/big.mjs'

class BigUtils {
  constructor() {
    this.Big = Big
  }

  /**
   * @description: get Big Object.
   * @param {type}
   * @return: Big
   */
  getBig() {
    return this.Big
  }

  /**
   * 获取Big对象
   * @param {String,Number} param
   */
  getBigObj(param) {
    const big = new (this.getBig())(param)

    return big
  }

  /**
   * @description: 执行Big中的函数。
   * @param {String} fnName,函数的名称
   * @param {Array} params,fnName参数的值
   * @param {Number} toFixed,保留的小数位
   */
  fnPMTD(fnName, params, toFixed) {
    try {
      if (!Array.isArray(params)) {
        return NaN
      }

      const len = params.length
      let rs = NaN

      for (let item = 0; item < len; item++) {
        if (item === 0) {
          rs = this.getBigObj(Number(params[item]))
        } else {
          rs = rs[fnName](Number(params[item]))
        }
      }

      // 是一个整数
      if (!Number.isNaN(parseInt(toFixed))) {
        rs = rs.toFixed(parseInt(toFixed)).toString()
      }

      return rs.toString()
    } catch (error) {
      window.console.error(error)
    }
  }

  /**
   * 参数相加。
   * @param {Array} params Big函数中的参数。
   * @param {Number} toFixed 结果保留小数的位数
   */
  add(params, toFixed) {
    return this.fnPMTD('add', params, toFixed)
  }

  /**
   * 参数相减。
   * @param {Array} params Big函数中的参数。
   * @param {Number} toFixed 结果保留小数的位数。
   */
  minus(params, toFixed) {
    return this.fnPMTD('minus', params, toFixed)
  }

  /**
   * 参数相乘
   * @param {Array} params Big函数中的参数。
   * @param {Number} toFixed 结果保留小数的位数。
   */
  times(params, toFixed) {
    return this.fnPMTD('times', params, toFixed)
  }

  /**
   * 参数相除
   * @param {Array} params Big函数中的参数
   * @param {Number} toFixed 结果保留小数的位数。
   */
  div(params, toFixed) {
    return this.fnPMTD('div', params, toFixed)
  }

  /**
   * 参数相加，结果保留2位小数
   * @param {Array} params 每一个数组项是Big函数中的参数。
   */
  addDecimalTwo(params) {
    this.add(params, 2)
  }

  /**
   * 参数相加，结果保留3位小数
   * @param {Array} params 每一个数组项是Big函数中的参数。
   */
  addDecimalThree(params) {
    this.add(params, 3)
  }

  /**
   * 参数相减,结果保留2位小数
   * @param {Array} params 每一个数组项是Big函数中的参数。
   */
  minusDecimalTwo(params) {
    this.minus(params, 2)
  }

  /**
   * 参数相减,结果保留3位小数
   * @param {Array} params 每一个数组项是Big函数中的参数。
   */
  minusDecimalThree(params) {
    this.minus(params, 3)
  }

  /**
   * 参数相乘,结果保留2位小数
   * @param {Array} params 每一个数组项是Big函数中的参数。
   */
  timesDecimalTwo(params) {
    this.times(params, 2)
  }

  /**
   * 参数相乘,结果保留3位小数
   * @param {Array} params 每一个数组项是Big函数中的参数。
   */
  timesDecimalThree(params) {
    this.times(params, 3)
  }

  /**
   * 参数相除,结果保留2位小数
   * @param {Array} params 每一个数组项是Big函数中的参数。
   */
  divDecimalTwo(params) {
    this.div(params, 2)
  }

  /**
   * 参数相除,结果保留3位小数
   * @param {Array} params 每一个数组项是Big函数中的参数。
   */
  divDecimalThree(params) {
    this.div(params, 3)
  }

  /**
   * 加
   */
  paramsAdd() {
    const params = [...arguments]
    return this.fnPMTD('add', params)
  }

  /**
   * 减
   */
  paramsMinus() {
    const params = [...arguments]
    return this.fnPMTD('minus', params)
  }

  /**
   * 乘
   */
  paramsTimes() {
    const params = [...arguments]
    return this.fnPMTD('times', params)
  }

  /**
   * 除以
   */
  paramsDiv() {
    const params = [...arguments]
    return this.fnPMTD('div', params)
  }

  /**
   * 加,2位小数
   */
  paramsAddTFDTwo() {
    const params = [...arguments]
    return this.fnPMTD('add', params, 2)
  }

  /**
   * 加,3位小数
   */
  paramsAddTFDThree() {
    const params = [...arguments]
    return this.fnPMTD('add', params, 3)
  }

  /**
   * 减,2位小数
   */
  paramsMinusTFDTwo() {
    const params = [...arguments]
    return this.fnPMTD('minus', params, 2)
  }

  /**
   * 减,3位小数
   */
  paramsMinusTFDThree() {
    const params = [...arguments]
    return this.fnPMTD('minus', params, 3)
  }

  /**
   * 乘,2位小数
   */
  paramsTimesTFDTwo() {
    const params = [...arguments]
    return this.fnPMTD('times', params, 2)
  }

  /**
   * 乘,3位小数
   */
  paramsTimesTFDThree() {
    const params = [...arguments]
    return this.fnPMTD('times', params, 3)
  }

  /**
   * 除以,2位小数
   */
  paramsDivTFDTwo() {
    const params = [...arguments]
    return this.fnPMTD('div', params, 2)
  }

  /**
   * 除以,3位小数
   */
  paramsDivTFDThree() {
    const params = [...arguments]
    return this.fnPMTD('div', params, 3)
  }
}

function getMultiplyDecimalPlaces(num1, num2) {
  try {
    // 1. 用 big.js 创建高精度实例（避免原生精度丢失）
    const bigNum1 = new Big(num1)
    const bigNum2 = new Big(num2)

    // 2. 精确乘法
    const product = bigNum1.times(bigNum2)

    // 3. 转换为字符串（获取完整小数部分）
    const productStr = product.toString()
    // 4. 判断是否有小数点，计算小数位数
    const dotIndex = productStr.indexOf('.')
    // 无小数点：小数位为0；有小数点：总长度 - 小数点索引 -1
    const decimalPlaces = dotIndex === -1 ? 0 : productStr.length - dotIndex - 1
    // 4. 结果保留6位小数（使用 big.js 的 toFixed，确保精度）
    const fixedResult = decimalPlaces > 6 ? product.toFixed(6) : productStr
    const formulaStr = `${bigNum1.toString()} * ${bigNum2.toString()} = ${fixedResult}`
    return {
      decimalPlaces,
      formulaStr
    }
  } catch (error) {
    console.error('输入非有效数字:', error)
    return {
      decimalPlaces: 0
    }
  }
}

export { getMultiplyDecimalPlaces }

export default BigUtils
