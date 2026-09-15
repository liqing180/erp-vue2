import request from '@/utils/request'

// 图表分析查询(客户): sales/report/salesSummary/queryImageForCustomer
export function queryImageForCustomer(data) {
  return request({
    url: '/sales/report/salesSummary/queryImageForCustomer',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询(客户): sales/report/salesSummary/querySearchListForCustomer
export function querySearchListForCustomer(data) {
  return request({
    url: '/sales/report/salesSummary/querySearchListForCustomer',
    method: 'post',
    data: data
  })
}
// 列表查询(客户): sales/report/salesSummary/queryListForCustomer
export function queryListForCustomer(data) {
  return request({
    url: '/sales/report/salesSummary/queryListForCustomer',
    method: 'post',
    data: data
  })
}

// 图表分析查询(客户-产品): sales/report/salesSummary/queryImageForCustomerProduct
export function queryImageForCustomerProduct(data) {
  return request({
    url: '/sales/report/salesSummary/queryImageForCustomerProduct',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询(客户-产品): sales/report/salesSummary/querySearchListForCustomerProduct
export function querySearchListForCustomerProduct(data) {
  return request({
    url: '/sales/report/salesSummary/querySearchListForCustomerProduct',
    method: 'post',
    data: data
  })
}
// 列表查询(客户-产品): sales/report/salesSummary/queryListForCustomerProduct
export function queryListForCustomerProduct(data) {
  return request({
    url: '/sales/report/salesSummary/queryListForCustomerProduct',
    method: 'post',
    data: data
  })
}

// 下拉搜索值查询(客户-产品-订单): sales/report/salesSummary/querySearchListForCustomerProductOrder
export function querySearchListForCustomerProductOrder(data) {
  return request({
    url: '/sales/report/salesSummary/querySearchListForCustomerProductOrder',
    method: 'post',
    data: data
  })
}
// 列表查询(客户-产品-订单): sales/report/salesSummary/queryListForCustomerProductOrder
export function queryListForCustomerProductOrder(data) {
  return request({
    url: '/sales/report/salesSummary/queryListForCustomerProductOrder',
    method: 'post',
    data: data
  })
}
