import request from '@/utils/request'

// 通过产品ID查询对应的区域:system/zone/queryZoneListByProductIdList （productIdList）
export function queryZoneListByProductIdList(data) {
  return request({
    url: '/system/zone/queryZoneListByProductIdList',
    method: 'post',
    data: data
  })
}

// 各个页签数据数量查询:
export function queryCountList(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/queryCountList',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询:
export function querySearchList(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询 EGR 列表:
export function queryEmergencyGoodsReceiptList(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/queryEmergencyGoodsReceiptList',
    method: 'post',
    data: data
  })
}
// 查询具体 EGR:
export function queryEmergencyGoodsReceiptById(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/queryEmergencyGoodsReceiptById',
    method: 'post',
    data: data
  })
}
// 查询 EGR 的操作日志:
export function queryEGROperationLog(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/queryEGROperationLog',
    method: 'post',
    data: data
  })
}
// 保存草稿:
export function saveDraftEmergencyGoodsReceipt(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/saveDraftEmergencyGoodsReceipt',
    method: 'post',
    data: data
  })
}
// 提交 EGR :
export function saveEmergencyGoodsReceipt(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/saveEmergencyGoodsReceipt',
    method: 'post',
    data: data
  })
}
// 校验运单号是否已存在 (deliveryOrderNo, emergencyGoodsReceiptId)
export function queryEmergencyGoodsReceiptNoListByDeliveryOrderNo(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/queryEmergencyGoodsReceiptNoListByDeliveryOrderNo',
    method: 'post',
    data: data
  })
}

// 审批同意 EGR:
export function approvedEmergencyGoodsReceipt(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/approvedEmergencyGoodsReceipt',
    method: 'post',
    data: data
  })
}
// 审批拒绝 EGR：
export function rejectedEmergencyGoodsReceipt(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/rejectedEmergencyGoodsReceipt',
    method: 'post',
    data: data
  })
}
// 撤回审批：
export function withdrawApproved(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 撤回审批：
export function batchWithdrawApproved(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/batchWithdrawApproved',
    method: 'post',
    data: data
  })
}

// 查询 EGR 单据和上一次的修订对比：
export function queryUpdateMsgEGR(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/queryUpdateMsgEGR',
    method: 'post',
    data: data
  })
}
// 取消EGR：
export function cancelledEGR(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/cancelledEGR',
    method: 'post',
    data: data
  })
}

// 校验紧急收货单是否可以扩展取消：(businessId)
export function checkCanExtendedCancelled(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/checkCanExtendedCancelled',
    method: 'post',
    data: data
  })
}
// 审批通过后 扩展取消EGR：
export function extendedCancelledEGR(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/extendedCancelledEGR',
    method: 'post',
    data: data
  })
}

// 查询紧急收货单可以选择的供应商列表:
export function queryEGRCanSelectBusinessPartnerList(data) {
  return request({
    url: '/system/businessPartner/queryEGRCanSelectBusinessPartnerList',
    method: 'post',
    data: data
  })
}

// 查询EGR可以选择的产品列表: (warehouseId  & businessPartnerId)
export function queryEGRCanSelectProductList(data) {
  return request({
    url: '/system/product/queryEGRCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 打印：/inventory/emergencyGoodsReceipt/batchPrint
export function batchPrint(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/batchPrint',
    method: 'post',
    data: data
  })
}

// 查询 EGR 要打印的产品列表： /inventory/emergencyGoodsReceipt/queryPrintProductList（emergencyGoodsReceiptId）
export function queryPrintProductList(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/queryPrintProductList',
    method: 'post',
    data: data
  })
}

// /inventory/emergencyGoodsReceipt/calculateLabelPrintQty  返回对象里：printLabelQty （打印标签数量）
export function calculateLabelPrintQty(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/calculateLabelPrintQty',
    method: 'post',
    data: data
  })
}

// 直运地址历史记录查询
export function queryDropShippingAddressOptions(query) {
  return request({
    url: '/purchase/addressHistory/recent',
    method: 'get',
    params: query
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/inventory/emergencyGoodsReceipt/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/inventory/emergencyGoodsReceipt/revisionDiff',
    method: 'post',
    data
  })
}
