import request from '@/utils/request'

/** 明细 */
// 下拉搜索查询(客户-产品-订单): sales/report/rejectionAnalysis/querySearchListForCustomerProductOrder
export function querySearchListForCustomerProductOrder(data) {
  return request({
    url: '/sales/report/rejectionAnalysis/querySearchListForCustomerProductOrder',
    method: 'post',
    data: data
  })
}

// 列表查询(客户-产品-订单): sales/report/rejectionAnalysis/queryListForCustomerProductOrder
//        参数: conditionForSalesOrderNo, conditionForDeliveryOrderNo, returnedReason, returnedReasonList, startDate, endDate
export function queryListForCustomerProductOrder(data) {
  return request({
    url: '/sales/report/rejectionAnalysis/queryListForCustomerProductOrder',
    method: 'post',
    data: data
  })
}

/** 分析 */
// 列表查询(客户-产品): sales/report/rejectionAnalysis/queryListForCustomerProduct
//        参数: conditionForCustomerProduct, startDate, endDate
export function queryListForCustomerProduct(data) {
  return request({
    url: '/sales/report/rejectionAnalysis/queryListForCustomerProduct',
    method: 'post',
    data: data
  })
}

// Top图查询客户产品: sales/report/rejectionAnalysis/queryTopImageForCustomerProduct(startDate, endDate, needCount)
export function queryTopImageForCustomerProduct(data) {
  return request({
    url: '/sales/report/rejectionAnalysis/queryTopImageForCustomerProduct',
    method: 'post',
    data: data
  })
}

// 拒收分析,列表查询(原因): sales/report/rejectionAnalysis/queryListForReturnedReason (startDate, endDate, businessPartnerId, productId)
export function queryListForReturnedReason(data) {
  return request({
    url: '/sales/report/rejectionAnalysis/queryListForReturnedReason',
    method: 'post',
    data: data
  })
}

/** 主列表 */
// 列表查询(客户): sales/report/rejectionAnalysis/queryListForCustomer
//        参数: conditionForCustomer, startDate, endDate
export function queryListForCustomer(data) {
  return request({
    url: '/sales/report/rejectionAnalysis/queryListForCustomer',
    method: 'post',
    data: data
  })
}

// Top图查询客户: sales/report/rejectionAnalysis/queryTopImageForCustomer (startDate, endDate, needCount)
export function queryTopImageForCustomer(data) {
  return request({
    url: '/sales/report/rejectionAnalysis/queryTopImageForCustomer',
    method: 'post',
    data: data
  })
}
