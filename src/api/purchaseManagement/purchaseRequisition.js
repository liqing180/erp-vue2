import request from '@/utils/request'

// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/purchase/purchaseRequisite/withdrawApproved',
    method: 'post',
    data: data
  })
}

// 查询具体 PR
export function queryPurchaseRequisiteById(data) {
  return request({
    url: '/purchase/purchaseRequisite/queryPurchaseRequisiteById',
    method: 'post',
    data: data
  })
}
// 草稿保存
export function saveDraftPurchaseRequisite(data) {
  return request({
    url: '/purchase/purchaseRequisite/saveDraftPurchaseRequisite',
    method: 'post',
    data: data
  })
}
// 编辑页面提交, 与审批流过程中提交
export function savePurchaseRequisite(data) {
  return request({
    url: '/purchase/purchaseRequisite/savePurchaseRequisite',
    method: 'post',
    data: data
  })
}

// revise 页面提交
export function revisePurchaseRequisite(data) {
  return request({
    url: '/purchase/purchaseRequisite/revisePurchaseRequisite',
    method: 'post',
    data: data
  })
}

// 审批同意
export function approvedPurchaseRequisite(data) {
  return request({
    url: '/purchase/purchaseRequisite/approvedPurchaseRequisite',
    method: 'post',
    data: data
  })
}
// 审批拒绝
export function rejectedPurchaseRequisite(data) {
  return request({
    url: '/purchase/purchaseRequisite/rejectedPurchaseRequisite',
    method: 'post',
    data: data
  })
}
// 业务单据取消PR
export function cancelledPR(data) {
  return request({
    url: '/purchase/purchaseRequisite/cancelledPR',
    method: 'post',
    data: data
  })
}
// 业务单据关闭PR
export function closedPR(data) {
  return request({
    url: '/purchase/purchaseRequisite/closedPR',
    method: 'post',
    data: data
  })
}
// 查询仓库:
export function queryPRCanSelectWarehouseList(data) {
  return request({
    url: '/inventory/warehouse/queryPRCanSelectWarehouseList',
    method: 'post',
    data: data
  })
}
// 查询PR 可以选择的产品
export function queryPRCanSelectProductList(data) {
  return request({
    url: '/system/product/queryPRCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 查询数量:
export function queryCountList(data) {
  return request({
    url: '/purchase/purchaseRequisite/queryCountList',
    method: 'post',
    data: data
  })
}
// 下拉查询:
export function querySearchList(data) {
  return request({
    url: '/purchase/purchaseRequisite/querySearchList',
    method: 'post',
    data: data
  })
}

// 列表查询:
export function queryPurchaseRequisiteList(data) {
  return request({
    url: '/purchase/purchaseRequisite/queryPurchaseRequisiteList',
    method: 'post',
    data: data
  })
}
// 查询日志:
export function queryPROperationLog(data) {
  return request({
    url: '/purchase/purchaseRequisite/queryPROperationLog',
    method: 'post',
    data: data
  })
}
export function queryUpdateMsgPR(data) {
  return request({
    url: '/purchase/purchaseRequisite/queryUpdateMsgPR',
    method: 'post',
    data: data
  })
}
// 法人默认的本公司仓库
export function queryCanSelectWarehouseDefaultWarehouse(data) {
  return request({
    url: '/inventory/warehouse/queryCanSelectWarehouseDefaultWarehouse',
    method: 'post',
    data: data
  })
}

// 查询交期状态统计数量:  /purchase/purchaseRequisite/queryDeliveryStatusCount
export function queryDeliveryStatusCount(data) {
  return request({
    url: '/purchase/purchaseRequisite/queryDeliveryStatusCount',
    method: 'post',
    data: data
  })
}

// 直运地址历史记录查询
export function queryDropShippingAddressOptions() {
  return request({
    url: '/purchase/addressHistory/recent',
    method: 'get'
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/purchase/purchaseRequisite/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/purchase/purchaseRequisite/revisionDiff',
    method: 'post',
    data
  })
}
