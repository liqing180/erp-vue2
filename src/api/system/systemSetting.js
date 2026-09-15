import request from '@/utils/request'

// 获取系统设置信息 :   /system/setup/getSystemSetup
export function getSystemSetup(query) {
  return request({
    url: '/system/setup/getSystemSetup',
    method: 'get',
    params: query
  })
}

// 修改系统设置 : /system/setup/updateSystemSetup
export function updateSystemSetup(data) {
  return request({
    url: '/system/setup/updateSystemSetup',
    method: 'post',
    data: data
  })
}
// 获取产品列表
export function queryProductListFromStockOutStrategy(data) {
  return request({
    url: '/system/product/queryProductListFromStockOutStrategy',
    method: 'post',
    data: data
  })
}
