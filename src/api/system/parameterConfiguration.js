import request from '@/utils/request'

// 主页查询接口: queryParameterConfigurationList
export const queryParameterConfigurationList = param => {
  return request({
    url: '/system/parameterConfiguration/queryParameterConfigurationList',
    method: 'post',
    data: param
  })
}

// Uom查询: /parameterConfiguration/queryUomList
export const queryUomList = param => {
  return request({
    url: '/system/parameterConfiguration/queryUomList',
    method: 'post',
    data: param
  })
}
// Uom更新: /parameterConfiguration/updateUomList
export const updateUomList = param => {
  return request({
    url: '/system/parameterConfiguration/updateUomList',
    method: 'post',
    data: param
  })
}

// Incoterm查询: /parameterConfiguration/queryIncotermList
export const queryIncotermList = param => {
  return request({
    url: '/system/parameterConfiguration/queryIncotermList',
    method: 'post',
    data: param
  })
}
// Incoterm更新: /parameterConfiguration/updateIncotermList
export const updateIncotermList = param => {
  return request({
    url: '/system/parameterConfiguration/updateIncotermList',
    method: 'post',
    data: param
  })
}

// Port查询: /parameterConfiguration/queryPortList
export const queryPortList = param => {
  return request({
    url: '/system/parameterConfiguration/queryPortList',
    method: 'post',
    data: param
  })
}
// Port更新: /parameterConfiguration/updatePortList
export const updatePortList = param => {
  return request({
    url: '/system/parameterConfiguration/updatePortList',
    method: 'post',
    data: param
  })
}

// Country查询: /parameterConfiguration/queryCountryList
export const queryCountryList = param => {
  return request({
    url: '/system/parameterConfiguration/queryCountryList',
    method: 'post',
    data: param
  })
}
// Country更新: /parameterConfiguration/updateCountryList
export const updateCountryList = param => {
  return request({
    url: '/system/parameterConfiguration/updateCountryList',
    method: 'post',
    data: param
  })
}

// Currency查询: /parameterConfiguration/queryCurrencyList
export const queryCurrencyList = param => {
  return request({
    url: '/system/parameterConfiguration/queryCurrencyList',
    method: 'post',
    data: param
  })
}
// Currency更新: /parameterConfiguration/updateCurrencyList
export const updateCurrencyList = param => {
  return request({
    url: '/system/parameterConfiguration/updateCurrencyList',
    method: 'post',
    data: param
  })
}

// MOBILE_CODE查询:  sys/parameterConfiguration/queryMobileCodeList
export const queryMobileCodeList1 = param => {
  return request({
    url: '/system/parameterConfiguration/queryMobileCodeList',
    method: 'post',
    data: param
  })
}
// MOBILE_CODE更新: sys/parameterConfiguration/updateMobileCodeList
export const updateMobileCodeList = param => {
  return request({
    url: '/system/parameterConfiguration/updateMobileCodeList',
    method: 'post',
    data: param
  })
}

// MOBILE_CODE其他地方查询数据接口
export const queryMobileCodeList = () => {
  return request({
    url: '/system/mobileCode/queryMobileCodeList',
    method: 'get'
  })
}
