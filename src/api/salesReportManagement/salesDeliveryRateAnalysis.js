
import request from '@/utils/request'

// "下拉搜索值查询(客户)
export function querySearchListForCustomer(data) {
  return request({
    url: '/sales/report/salesDeliveryRateAnalysis/querySearchListForCustomer',
    method: 'post',
    data: data
  })
}
// 列表查询(客户): sales/report/salesDeliveryRateAnalysis/queryListForCustomer
export function queryListForCustomer(data) {
  return request({
    url: '/sales/report/salesDeliveryRateAnalysis/queryListForCustomer',
    method: 'post',
    data: data
  })
}

// "下拉搜索值查询(客户-产品): sales/report/salesDeliveryRateAnalysis/querySearchListForCustomerProduct
export function querySearchListForCustomerProduct(data) {
  return request({
    url: '/sales/report/salesDeliveryRateAnalysis/querySearchListForCustomerProduct',
    method: 'post',
    data: data
  })
}
// 列表查询(客户-产品): sales/report/salesDeliveryRateAnalysis/queryListForCustomerProduct
export function queryListForCustomerProduct(data) {
  return request({
    url: '/sales/report/salesDeliveryRateAnalysis/queryListForCustomerProduct',
    method: 'post',
    data: data
  })
}

// "下拉搜索值查询(客户-产品-订单): sales/report/salesDeliveryRateAnalysis/querySearchListForCustomerProductOrder
export function querySearchListForCustomerProductOrder(data) {
  return request({
    url: '/sales/report/salesDeliveryRateAnalysis/querySearchListForCustomerProductOrder',
    method: 'post',
    data: data
  })
}
// 列表查询(客户-产品-订单): sales/report/salesDeliveryRateAnalysis/queryListForCustomerProductOrder
export function queryListForCustomerProductOrder(data) {
  return request({
    url: '/sales/report/salesDeliveryRateAnalysis/queryListForCustomerProductOrder',
    method: 'post',
    data: data
  })
}
// 导出数据(客户-产品-订单): sales/report/salesDeliveryRateAnalysis/exportForCustomerProductOrder"
