import request from '@/utils/request'
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/purchase/consignmentOrder/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 各个页签数据数量查询
export function queryCountList(data) {
  return request({
    url: '/purchase/consignmentOrder/queryCountList',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询
export function querySearchList(data) {
  return request({
    url: '/purchase/consignmentOrder/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询主列表
export function queryConsignmentOrderList(data) {
  return request({
    url: '/purchase/consignmentOrder/queryConsignmentOrderList',
    method: 'post',
    data: data
  })
}
// 查询具体单据
export function queryConsignmentOrderById(data) {
  return request({
    url: '/purchase/consignmentOrder/queryConsignmentOrderById',
    method: 'post',
    data: data
  })
}
// 查询操作日志
export function queryOperationLog(data) {
  return request({
    url: '/purchase/consignmentOrder/queryOperationLog',
    method: 'post',
    data: data
  })
}
// 审批同意
export function approvedConsignmentOrder(data) {
  return request({
    url: '/purchase/consignmentOrder/approvedConsignmentOrder',
    method: 'post',
    data: data
  })
}
// 审批拒绝
export function rejectedConsignmentOrder(data) {
  return request({
    url: '/purchase/consignmentOrder/rejectedConsignmentOrder',
    method: 'post',
    data: data
  })
}
// 取消
export function cancelledConsignmentOrder(data) {
  return request({
    url: '/purchase/consignmentOrder/cancelledConsignmentOrder',
    method: 'post',
    data: data
  })
}
// 关闭
export function closedConsignmentOrder(data) {
  return request({
    url: '/purchase/consignmentOrder/closedConsignmentOrder',
    method: 'post',
    data: data
  })
}
// 保存草稿
export function saveDraftConsignmentOrder(data) {
  return request({
    url: '/purchase/consignmentOrder/saveDraftConsignmentOrder',
    method: 'post',
    data: data
  })
}
// 提交
export function saveConsignmentOrder(data) {
  return request({
    url: '/purchase/consignmentOrder/saveConsignmentOrder',
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
    url: '/purchase/consignmentOrder/queryCanSelectProductList',
    method: 'post',
    data: data
  })
}

// PO进行计算
export function calculate(data) {
  return request({
    url: '/purchase/consignmentOrder/calculate',
    method: 'post',
    data: data
  })
}

// PO进行单行计算
export function calculateOneDetail(data) {
  return request({
    url: '/purchase/consignmentOrder/calculateOneDetail',
    method: 'post',
    data: data
  })
}

// 查询 PO 单据和上一次的修订对比
export function queryUpdateMsgConsignmentOrder(data) {
  return request({
    url: '/purchase/consignmentOrder/queryUpdateMsgConsignmentOrder',
    method: 'post',
    data: data
  })
}

// 预览PDF
export function preview(data) {
  return request({
    url: '/purchase/consignmentOrder/preview',
    method: 'post',
    data: data
  })
}

// send 发货
export function sendConsignmentOrder(data) {
  return request({
    url: '/purchase/consignmentOrder/sendConsignmentOrder',
    method: 'post',
    data: data
  })
}
// 查询send 详情
export function queryConsignmentOrderSendMsg(data) {
  return request({
    url: '/purchase/consignmentOrder/queryConsignmentOrderSendMsg',
    method: 'post',
    data: data
  })
}
// send 获取可以下拉的PO
export function queryCanSendConsignmentOrderList(data) {
  return request({
    url: '/purchase/consignmentOrder/queryCanSendConsignmentOrderList',
    method: 'post',
    data: data
  })
}

// 给寄售订单绑定新附件: purchase/consignmentOrder/addFileToConsignmentOrder
export function addFileToConsignmentOrder(data) {
  return request({
    url: '/purchase/consignmentOrder/addFileToConsignmentOrder',
    method: 'post',
    data: data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/purchase/consignmentOrder/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/purchase/consignmentOrder/revisionDiff',
    method: 'post',
    data
  })
}
