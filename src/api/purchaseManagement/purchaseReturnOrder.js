import request from '@/utils/request'
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/purchase/purchaseReturn/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 各个页签数据数量查询
export function queryCountList(data) {
  return request({
    url: '/purchase/purchaseReturn/queryCountList',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询
export function querySearchList(data) {
  return request({
    url: '/purchase/purchaseReturn/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询业务单据列表
export function queryPurchaseReturnList(data) {
  return request({
    url: '/purchase/purchaseReturn/queryPurchaseReturnList',
    method: 'post',
    data: data
  })
}

// 查询可以选择的销售订单列表 (参数: conditionForSalesOrderNo, condition)
export function queryCanSelectPurchaseOrderList(data) {
  return request({
    url: '/purchase/purchaseReturn/queryCanSelectPurchaseOrderList',
    method: 'post',
    data: data
  })
}
// 查询可以选择的仓库列表
export function queryPurchaseGoodsReturnCanSelectWarehouseList(data) {
  return request({
    url: '/inventory/warehouse/queryPurchaseGoodsReturnCanSelectWarehouseList',
    method: 'post',
    data: data
  })
}
// 查询BP联系人下拉不分页 (参数: businessPartnerMainId)
export function queryContactPersonByBusinessPartnerIdNoPage(data) {
  return request({
    url: '/system/businessPartner/queryContactPersonByBusinessPartnerIdNoPage',
    method: 'post',
    data: data
  })
}

// 查询可以选择的合格的产品列表 (参数: purchaseOrderId, purchaseReturnId, alreadyProductIdList)
export function queryProductListForPass(data) {
  return request({
    url: '/purchase/purchaseReturn/queryProductListForPass',
    method: 'post',
    data: data
  })
}
// 查看可以选择的不合格的产品列表 (参数: purchaseOrderId, purchaseReturnId, alreadyProductIdList)
export function queryProductListForFailed(data) {
  return request({
    url: '/purchase/purchaseReturn/queryProductListForFailed',
    method: 'post',
    data: data
  })
}
// 保存草稿
export function saveDraftPurchaseReturn(data) {
  return request({
    url: '/purchase/purchaseReturn/saveDraftPurchaseReturn',
    method: 'post',
    data: data
  })
}
// 提交单据
export function savePurchaseReturn(data) {
  return request({
    url: '/purchase/purchaseReturn/savePurchaseReturn',
    method: 'post',
    data: data
  })
}
// 处理采购退货的结果
export function dealPurchaseReturnResult(data) {
  return request({
    url: '/purchase/purchaseReturn/dealPurchaseReturnResult',
    method: 'post',
    data: data
  })
}

// 查询具体销售退货
export function queryPurchaseReturnById(data) {
  return request({
    url: '/purchase/purchaseReturn/queryPurchaseReturnById',
    method: 'post',
    data: data
  })
}

// 查询销售退货单据和上一次的修订对比:
export function queryUpdateMsgPurchaseReturn(data) {
  return request({
    url: '/purchase/purchaseReturn/queryUpdateMsgPurchaseReturn',
    method: 'post',
    data: data
  })
}
// 审批同意销售退货
export function approvedPurchaseReturn(data) {
  return request({
    url: '/purchase/purchaseReturn/approvedPurchaseReturn',
    method: 'post',
    data: data
  })
}
// 审批拒绝销售退货
export function rejectedPurchaseReturn(data) {
  return request({
    url: '/purchase/purchaseReturn/rejectedPurchaseReturn',
    method: 'post',
    data: data
  })
}
// 取消销售退货
export function cancelledPurchaseReturn(data) {
  return request({
    url: '/purchase/purchaseReturn/cancelledPurchaseReturn',
    method: 'post',
    data: data
  })
}

// 预览PDF
export function preview(data) {
  return request({
    url: '/purchase/purchaseReturn/preview',
    method: 'post',
    data: data
  })
}

// 查询采购退货可以选择的寄售订单列表: purchase/purchaseReturn/queryCanSelectConsignmentOrderList (搜索: conditionForConsignmentOrderNo)
export function queryCanSelectConsignmentOrderList(data) {
  return request({
    url: '/purchase/purchaseReturn/queryCanSelectConsignmentOrderList',
    method: 'post',
    data: data
  })
}

// 查询可以选择的寄售退货产品列表: purchase/purchaseReturn/queryProductListForConsignmentOrder(参数: consignmentOrderId, warehouseId, purchaseReturnId)
export function queryProductListForConsignmentOrder(data) {
  return request({
    url: '/purchase/purchaseReturn/queryProductListForConsignmentOrder',
    method: 'post',
    data: data
  })
}

// 查询直运退货选择订单列表
export function queryDropShippingCanSelectPurchaseOrderList(data) {
  return request({
    url: '/purchase/purchaseReturn/queryDropShippingCanSelectPurchaseOrderList ',
    method: 'post',
    data: data
  })
}

// 查询直运采购退货可以选择的产品列表
export function queryDropShippingCanSelectProductList(data) {
  return request({
    url: '/purchase/purchaseReturn/queryDropShippingCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 查询采购退货操作日志
export function queryPurchaseReturnOperationLog(data) {
  return request({
    url: '/purchase/purchaseReturn/queryOperationLogList',
    method: 'post',
    data: data
  })
}

// 查询对应的物流成本单: (purchaseOrderNo)
export function queryLogisticsDocumentList(data) {
  return request({
    url: '/purchase/purchaseReturn/queryLogisticsDocumentList',
    method: 'post',
    data: data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/purchase/purchaseReturn/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/purchase/purchaseReturn/revisionDiff',
    method: 'post',
    data
  })
}
