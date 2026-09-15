import request from '@/utils/request'
// 选择PQ弹窗：
export function querySearchListFromCanSelectPurchaseQuotationList(data) {
  return request({
    url: '/purchase/approvedSupplier/querySearchListFromCanSelectPurchaseQuotationList',
    method: 'post',
    data: data
  })
}
export function queryCanSelectPurchaseQuotationList(data) {
  return request({
    url: '/purchase/approvedSupplier/queryCanSelectPurchaseQuotationList',
    method: 'post',
    data: data
  })
}

// 增加PQ的默认信息到ASL当中
export function addPQDefaultMsgToASL(data) {
  return request({
    url: '/purchase/approvedSupplier/addPQDefaultMsgToASL',
    method: 'post',
    data: data
  })
}
// 切换货币计算金额
export function conversionCurrencyUnitPrice(data) {
  return request({
    url: '/purchase/approvedSupplier/conversionCurrencyUnitPrice',
    method: 'post',
    data: data
  })
}

// 查询可以选择的产品列表：
export function queryCanSelectProductList(data) {
  return request({
    url: '/purchase/approvedSupplier/queryCanSelectProductList',
    method: 'post',
    data: data
  })
}
// 新增页面提交
export function saveApprovedSupplier(data) {
  return request({
    url: '/purchase/approvedSupplier/saveApprovedSupplier',
    method: 'post',
    data: data
  })
}
// 新增页面提交
export function checkProductExistInASL(data) {
  return request({
    url: '/purchase/approvedSupplier/checkProductExistInASL',
    method: 'post',
    data: data
  })
}

// 主列表查询
export function queryApprovedSupplierList(data) {
  return request({
    url: '/purchase/approvedSupplier/queryApprovedSupplierList',
    method: 'post',
    data: data
  })
}
export function querySearchList(data) {
  return request({
    url: '/purchase/approvedSupplier/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询具体合格供应商:
export function queryApprovedSupplierById(data) {
  return request({
    url: '/purchase/approvedSupplier/queryApprovedSupplierById',
    method: 'post',
    data: data
  })
}

export function approvedApprovedSupplier(data) {
  return request({
    url: '/purchase/approvedSupplier/approvedApprovedSupplier',
    method: 'post',
    data: data
  })
}
export function rejectedApprovedSupplier(data) {
  return request({
    url: '/purchase/approvedSupplier/rejectedApprovedSupplier',
    method: 'post',
    data: data
  })
}
export function cancelledApprovedSupplier(data) {
  return request({
    url: '/purchase/approvedSupplier/cancelledApprovedSupplier',
    method: 'post',
    data: data
  })
}
export function withdrawApproved(data) {
  return request({
    url: '/purchase/approvedSupplier/withdrawApproved',
    method: 'post',
    data: data
  })
}

export function reviseApprovedSupplier(data) {
  return request({
    url: '/purchase/approvedSupplier/reviseApprovedSupplier',
    method: 'post',
    data: data
  })
}

// 冻结合格供应商
export function suspendApprovedSupplier(data) {
  return request({
    url: '/purchase/approvedSupplier/suspendApprovedSupplier',
    method: 'post',
    data: data
  })
}
// 恢复合格供应商
export function resumeApprovedSupplier(data) {
  return request({
    url: '/purchase/approvedSupplier/resumeApprovedSupplier',
    method: 'post',
    data: data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/purchase/approvedSupplier/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/purchase/approvedSupplier/revisionDiff',
    method: 'post',
    data
  })
}
