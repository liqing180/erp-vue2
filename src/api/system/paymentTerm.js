import request from '@/utils/request'

// 主页查询接口
export function queryPaymentTermList(data) {
  return request({
    url: '/system/paymentTerm/queryPaymentTermList',
    method: 'post',
    data: data
  })
}

// 新增数据
export function submitPaymentTerm(data) {
  return request({
    url: '/system/paymentTerm/submitPaymentTerm',
    method: 'post',
    data: data
  })
}
// 保存数据
export function savePaymentTerm(data) {
  return request({
    url: '/system/paymentTerm/savePaymentTerm',
    method: 'post',
    data: data
  })
}

// 修改数据
export function updatePaymentTerm(data) {
  return request({
    url: '/system/paymentTerm/updatePaymentTerm',
    method: 'post',
    data: data
  })
}

// GET 根据id查询
export function queryPaymentTermById(data) {
  return request({
    url: '/system/paymentTerm/queryPaymentTermById',
    method: 'post',
    data: data
  })
}

// 修改数据
export function queryDefaultPaymentTermByLegalEntity(data) {
  return request({
    url: '/system/paymentTerm/queryDefaultPaymentTermByLegalEntity',
    method: 'post',
    data: data
  })
}

// 下拉选择-根据类型查询付款条款 paymentTermType
export function queryPaymentTermListByPaymentTermPurpose(data) {
  return request({
    url: '/system/paymentTerm/queryPaymentTermListByPaymentTermPurpose',
    method: 'post',
    data: data
  })
}
// 查询付款条款对应的方法
export function queryPaymentMethodByTerm(termId) {
  return request({
    url: '/system/paymentTerm/queryPaymentMethodByTerm/' + termId,
    method: 'get'
  })
}

// 弹窗选择-根据类型查询付款条款 paymentTermType
export function queryPaymentTermListByPaymentTermPurposeForPage(data) {
  return request({
    url: '/system/paymentTerm/queryPaymentTermListByPaymentTermPurposeForPage',
    method: 'post',
    data: data
  })
}

// sales/preDeliveryNotice/queryProjectSalesOrderCanSelectPaymentTerm (salesOrderId)
export function queryProjectSalesOrderCanSelectPaymentTerm(data) {
  return request({
    url: '/sales/preDeliveryNotice/queryProjectSalesOrderCanSelectPaymentTerm',
    method: 'post',
    data: data
  })
}

// sales/preDeliveryNotice/queryCanSelectPaymentTerm (salesOrderId)
export function queryCanSelectPaymentTerm(data) {
  return request({
    url: '/sales/preDeliveryNotice/queryCanSelectPaymentTerm',
    method: 'post',
    data: data
  })
}
