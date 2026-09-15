import request from '@/utils/request'

// 下拉搜索值查询(客户): sales/report/salesReturnAnalysis/querySearchListForCustomer
export function querySearchListForCustomer(data) {
  return request({
    url: '/sales/report/salesReturnAnalysis/querySearchListForCustomer',
    method: 'post',
    data: data
  })
}
// 列表查询(客户): sales/report/salesReturnAnalysis/queryListForCustomer
export function queryListForCustomer(data) {
  return request({
    url: '/sales/report/salesReturnAnalysis/queryListForCustomer',
    method: 'post',
    data: data
  })
}
// 导出数据(客户): sales/report/salesReturnAnalysis/exportForCustomer

// 下拉搜索值查询(客户-产品): sales/report/salesReturnAnalysis/querySearchListForCustomerProduct
export function querySearchListForCustomerProduct(data) {
  return request({
    url: '/sales/report/salesReturnAnalysis/querySearchListForCustomerProduct',
    method: 'post',
    data: data
  })
}
// 列表查询(客户-产品): sales/report/salesReturnAnalysis/queryListForCustomerProduct
export function queryListForCustomerProduct(data) {
  return request({
    url: '/sales/report/salesReturnAnalysis/queryListForCustomerProduct',
    method: 'post',
    data: data
  })
}
// 导出数据(客户-产品): sales/report/salesReturnAnalysis/exportForCustomerProduct

// 下拉搜索值查询(客户-产品-订单): sales/report/salesReturnAnalysis/querySearchListForCustomerProductOrder
export function querySearchListForCustomerProductOrder(data) {
  return request({
    url: '/sales/report/salesReturnAnalysis/querySearchListForCustomerProductOrder',
    method: 'post',
    data: data
  })
}
// 列表查询(客户-产品-订单): sales/report/salesReturnAnalysis/queryListForCustomerProductOrder
export function queryListForCustomerProductOrder(data) {
  return request({
    url: '/sales/report/salesReturnAnalysis/queryListForCustomerProductOrder',
    method: 'post',
    data: data
  })
}
// 导出数据(客户-产品-订单): sales/report/salesReturnAnalysis/exportForCustomerProductOrder
