import request from '@/utils/request'
// 查询字典类型列表
export function changeLanguage(query) {
  return request({
    url: '/system/common/language',
    method: 'get',
    params: query
  })
}

// 登录页语言切换
export function changeLoginLanguage(query) {
  return request({
    url: '/system/common/lang',
    headers: {
      isToken: false
    },
    method: 'get',
    params: query
  })
}

// 验证Token有效性
export function verifyToken(token) {
  return request({
    url: '/auth/verifyToken/' + token,
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

// 获取系统对应的域名信息
export function queryDomainName(query) {
  return request({
    url: '/external/common/queryDomainName',
    method: 'get'
  })
}

// 查询可以选择的Incoterm列表:
export function queryIncotermList(data) {
  return request({
    url: '/system/common/queryIncotermList',
    method: 'post',
    data: data
  })
}

// 查询可以选择的Port列表
export function queryCanSelectPortList(data) {
  return request({
    url: '/system/common/queryCanSelectPortList',
    method: 'post',
    data: data
  })
}

// 查询可以选择的Port国家列表
export function queryPortCountryList(data) {
  return request({
    url: '/system/common/queryPortCountryList',
    method: 'post',
    data: data
  })
}

// 查询当前日期开始的N个工作日后的日期时间戳, 参数: workingDays （工作日天数，不包含今天）
export function queryDateAfterWorkingDays(data) {
  return request({
    url: '/system/common/queryDateAfterWorkingDays',
    method: 'post',
    data: data
  })
}
