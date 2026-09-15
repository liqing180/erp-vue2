import { mergeRecursive } from '@/utils/ruoyi'
import DictOptions from './DictOptions'

/**
 * @classdesc 字典元数据
 * @property {String} type 类型
 * @property {Function} request 请求
 * @property {String} label 标签字段
 * @property {String} value 值字段
 */
export default class DictMeta {
  constructor(options) {
    this.type = options.type
    this.request = options.request
    this.responseConverter = options.responseConverter
    this.labelField = options.labelField
    this.valueField = options.valueField
    this.lazy = options.lazy === true
  }
}

/**
 * 解析字典元数据
 * @param {Object} options
 * @returns {DictMeta}
 */
DictMeta.parse = function (options) {
  let opts = null
  if (typeof options === 'string') {
    opts = { ...(DictOptions.metas[options] || {}), type: options }
  } else if (typeof options === 'object') {
    opts = options
  }
  // 每次创建独立配置，避免单个字典的 lazy 等选项污染后续页面的默认值。
  opts = mergeRecursive(mergeRecursive({}, DictOptions.metas['*']), opts)
  return new DictMeta(opts)
}
