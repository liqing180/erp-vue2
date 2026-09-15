/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */
import store from '@/store'
// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  // 'yyyy/MM/dd HH:mm:ss'
  const formatData = {
    yyyy: '{y}',
    MM: '{m}',
    dd: '{d}',
    HH: '{h}',
    mm: '{i}',
    ss: '{s}'
  }
  let format = pattern || store.getters.fmtForYmdhms
  // let formatStr
  let dateStr = ''
  let timerStr = ''
  format.split(' ').forEach((item) => {
    if (item === 'yyyy') {
      dateStr = formatData[item]
    }
    if (item.indexOf('/') !== -1) {
      dateStr = item
        .split('/')
        .map((dateItem) => {
          return formatData[dateItem]
        })
        .join('/')
    } else if (item.indexOf('-') !== -1) {
      dateStr = item
        .split('-')
        .map((dateItem) => {
          return formatData[dateItem]
        })
        .join('-')
    } else if (item.indexOf(':') !== -1) {
      timerStr = item
        .split(':')
        .map((dateItem) => {
          return formatData[dateItem]
        })
        .join(':')
    }
  })
  format = dateStr + (timerStr ? ' ' + timerStr : '')

  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time
        // eslint-disable-next-line prefer-regex-literals
        .replace(new RegExp(/-/gm), '/')
        .replace('T', ' ')
        // eslint-disable-next-line prefer-regex-literals
        .replace(new RegExp(/\.[\d]{3}/gm), '')
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

/**
 * 获取时间戳 的指定时分秒的时间戳
 * appointTime(timestamp, '00:00:00')
 * appointTime(timestamp, '23:59:59')
 */
export function appointTime(timestamp, time = '00:00:00') {
  const date = new Date(timestamp)
  let month = parseInt(date.getMonth() + 1)
  let day = date.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  const times = date.getFullYear() + '-' + month + '-' + day + ' ' + time
  const timeStampA = new Date(times).getTime()
  return timeStampA
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
  const search = params
  search.params =
    typeof search.params === 'object' && search.params !== null && !Array.isArray(search.params)
      ? search.params
      : {}
  dateRange = Array.isArray(dateRange) ? dateRange : []
  if (typeof propName === 'undefined') {
    search.params.beginTime = dateRange[0]
    search.params.endTime = dateRange[1]
  } else {
    search.params['begin' + propName] = dateRange[0]
    search.params['end' + propName] = dateRange[1]
  }
  return search
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  const actions = []

  // eslint-disable-next-line array-callback-return
  Object.keys(datas).some((key) => {
    // eslint-disable-next-line eqeqeq
    if (datas[key].value == '' + value) {
      actions.push(datas[key].label)
      return true
    }
  })
  return actions.join('')
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
  const actions = []
  const currentSeparator = undefined === separator ? ',' : separator
  const temp = value.split(currentSeparator)
  // eslint-disable-next-line array-callback-return
  Object.keys(value.split(currentSeparator)).some((val) => {
    // eslint-disable-next-line array-callback-return
    Object.keys(datas).some((key) => {
      // eslint-disable-next-line eqeqeq
      if (datas[key].value === '' + temp[val]) {
        actions.push(datas[key].label + currentSeparator)
      }
    })
  })
  return actions.join('').substring(0, actions.join('').length - 1)
}

// 字符串格式化(%s )
export function sprintf(str) {
  const args = arguments
  let flag = true
  let i = 1
  str = str.replace(/%s/g, function () {
    const arg = args[i++]
    if (typeof arg === 'undefined') {
      flag = false
      return ''
    }
    return arg
  })
  return flag ? str : ''
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  // eslint-disable-next-line eqeqeq
  if (!str || str == 'undefined' || str == 'null') {
    return ''
  }
  return str
}

// 数据合并
export function mergeRecursive(source, target) {
  for (const p in target) {
    try {
      // eslint-disable-next-line eqeqeq
      if (target[p].constructor == Object) {
        source[p] = mergeRecursive(source[p], target[p])
      } else {
        source[p] = target[p]
      }
    } catch (e) {
      source[p] = target[p]
    }
  }
  return source
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  }

  const childrenListMap = {}
  const nodeIds = {}
  const tree = []

  for (const d of data) {
    const parentId = d[config.parentId]
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = []
    }
    nodeIds[d[config.id]] = d
    childrenListMap[parentId].push(d)
  }

  for (const d of data) {
    const parentId = d[config.parentId]
    if (nodeIds[parentId] == null) {
      tree.push(d)
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]]
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c)
      }
    }
  }
  return tree
}

// 判断字符串是否包含某个字符
export function isContain(str, data) {
  if (!str) return true
  const text = str.toUpperCase()
  const list = data.filter(x => x && x.trim())
  return list.map(x => (x = x.toUpperCase())).some(k => k.indexOf(text) !== -1)
}

/**
* 参数处理
* @param {*} params  参数
*/
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof (value) !== 'undefined') {
      if (propName === 'exportIdList' && typeof value === 'object') {
        result += ''
      } else if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof (value[key]) !== 'undefined') {
            const params = propName + '[' + key + ']'
            const subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

// 验证是否为blob格式
export function blobValidate(data) {
  return data.type !== 'application/json'
}

// 回显单位描述
export function showUomLabel(value) {
  const commonUomList = store.getters.commonUomList || []
  const list = commonUomList.filter(x => x.uomName === value) || []
  if (list && list.length > 0) {
    const { description } = list[0]
    return description || ''
  }
  return ''
}
