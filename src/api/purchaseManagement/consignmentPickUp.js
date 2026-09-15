import request from '@/utils/request'

// 各个页签数据数量查询
export function queryCountList(data) {
  return request({
    url: '/purchase/consignmentPickup/queryCountList',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询
export function querySearchList(data) {
  return request({
    url: '/purchase/consignmentPickup/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询主列表
export function queryConsignmentPickupList(data) {
  return request({
    url: '/purchase/consignmentPickup/queryConsignmentPickupList',
    method: 'post',
    data: data
  })
}
// 查询具体单据
export function queryConsignmentPickupById(data) {
  return request({
    url: '/purchase/consignmentPickup/queryConsignmentPickupById',
    method: 'post',
    data: data
  })
}
// 查询操作日志
export function queryOperationLog(data) {
  return request({
    url: '/purchase/consignmentPickup/queryOperationLog',
    method: 'post',
    data: data
  })
}
// 审批同意
export function approvedConsignmentPickup(data) {
  return request({
    url: '/purchase/consignmentPickup/approvedConsignmentPickup',
    method: 'post',
    data: data
  })
}
// 审批拒绝
export function rejectedConsignmentPickup(data) {
  return request({
    url: '/purchase/consignmentPickup/rejectedConsignmentPickup',
    method: 'post',
    data: data
  })
}
// 取消
export function cancelledConsignmentPickup(data) {
  return request({
    url: '/purchase/consignmentPickup/cancelledConsignmentPickup',
    method: 'post',
    data: data
  })
}

// 保存草稿
export function saveDraftConsignmentPickup(data) {
  return request({
    url: '/purchase/consignmentPickup/saveDraftConsignmentPickup',
    method: 'post',
    data: data
  })
}
// 提交
export function saveConsignmentPickup(data) {
  return request({
    url: '/purchase/consignmentPickup/saveConsignmentPickup',
    method: 'post',
    data: data
  })
}
// 查询可以选择的供应商列表
export function queryBusinessCanSelectVendorList(data) {
  return request({
    url: '/system/businessPartner/queryBusinessCanSelectVendorList',
    method: 'post',
    data: data
  })
}
// 查询PO可以选择的仓库列表
export function queryCanSelectConsignmentWarehouseList(data) {
  return request({
    url: '/inventory/warehouse/queryCanSelectConsignmentWarehouseList',
    method: 'post',
    data: data
  })
}

// PO查询可以选择的产品列表
export function queryCanSelectProductList(data) {
  return request({
    url: '/purchase/consignmentPickup/queryCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 查询 PO 单据和上一次的修订对比
export function queryUpdateMsgConsignmentPickup(data) {
  return request({
    url: '/purchase/consignmentPickup/queryUpdateMsgConsignmentPickup',
    method: 'post',
    data: data
  })
}

// 预览PDF
export function preview(data) {
  return request({
    url: '/purchase/consignmentPickup/preview',
    method: 'post',
    data: data
  })
}
