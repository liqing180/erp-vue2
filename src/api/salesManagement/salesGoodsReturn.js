import request from '@/utils/request'
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/sales/salesGoodsReturn/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 各个页签数据数量查询
export function queryLabelCount(data) {
  return request({
    url: '/sales/salesGoodsReturn/queryLabelCount',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询
export function querySearchList(data) {
  return request({
    url: '/sales/salesGoodsReturn/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询业务单据列表
export function querySalesGoodsReturnList(data) {
  return request({
    url: '/sales/salesGoodsReturn/querySalesGoodsReturnList',
    method: 'post',
    data: data
  })
}
// 查询销售需求的操作日志
export function querySalesGoodsReturnOperationLog(data) {
  return request({
    url: '/sales/salesGoodsReturn/querySalesGoodsReturnOperationLog',
    method: 'post',
    data: data
  })
}

// 查询销售退货可以选择的运单列表(conditionForSalesOrderNo, conditionForSalesDeliveryNo)
export function querySGRCanSelectDeliveryOrderList(data) {
  return request({
    url: '/sales/salesGoodsReturn/querySGRCanSelectDeliveryOrderList',
    method: 'post',
    data: data
  })
}
// 查询可以选择的销售订单列表 (参数: conditionForSalesOrderNo, condition)
export function querySGRCanSelectSalesOrderList(data) {
  return request({
    url: '/sales/salesGoodsReturn/querySGRCanSelectSalesOrderList',
    method: 'post',
    data: data
  })
}
// 查询可以选择的仓库列表
export function queryCanSelectWarehouseListFromSGR(data) {
  return request({
    url: '/inventory/warehouse/queryCanSelectWarehouseListFromSGR',
    method: 'post',
    data: data
  })
}
// 查询可以选择的产品: (参数: salesOrderId, salesGoodsReturnId, alreadyProductIdList)
export function querySGRCanSelectSOProductList(data) {
  return request({
    url: '/sales/salesGoodsReturn/querySGRCanSelectSOProductList',
    method: 'post',
    data: data
  })
}

//
// 查询销售退货可以选择的产品列表 (deliveryOrderId, salesGoodsReturnId, alreadyProductIdList)
export function querySGRCanSelectDeliveryOrderProductList(data) {
  return request({
    url: '/sales/salesGoodsReturn/querySGRCanSelectDeliveryOrderProductList',
    method: 'post',
    data: data
  })
}
// 保存草稿
export function saveDraftSalesGoodsReturn(data) {
  return request({
    url: '/sales/salesGoodsReturn/saveDraftSalesGoodsReturn',
    method: 'post',
    data: data
  })
}
// 提交单据
export function saveSalesGoodsReturn(data) {
  return request({
    url: '/sales/salesGoodsReturn/saveSalesGoodsReturn',
    method: 'post',
    data: data
  })
}

// 查询具体销售退货
export function querySalesGoodsReturnById(data) {
  return request({
    url: '/sales/salesGoodsReturn/querySalesGoodsReturnById',
    method: 'post',
    data: data
  })
}

// 查询销售退货单据和上一次的修订对比:
export function queryUpdateMsgSalesGoodsReturn(data) {
  return request({
    url: '/sales/salesGoodsReturn/queryUpdateMsgSalesGoodsReturn',
    method: 'post',
    data: data
  })
}
// 审批同意销售退货
export function approvedSalesGoodsReturn(data) {
  return request({
    url: '/sales/salesGoodsReturn/approvedSalesGoodsReturn',
    method: 'post',
    data: data
  })
}
// 审批拒绝销售退货
export function rejectedSalesGoodsReturn(data) {
  return request({
    url: '/sales/salesGoodsReturn/rejectedSalesGoodsReturn',
    method: 'post',
    data: data
  })
}
// 取消销售退货
export function cancelledSalesGoodsReturn(data) {
  return request({
    url: '/sales/salesGoodsReturn/cancelledSalesGoodsReturn',
    method: 'post',
    data: data
  })
}

// 预览PDF
export function preview(data) {
  return request({
    url: '/sales/salesGoodsReturn/preview',
    method: 'post',
    data: data
  })
}

// POST:   /productCategory/queryBusinessSelectProductCategoryTreeList (productCategoryIdList)
export function queryBusinessSelectProductCategoryTreeList(data) {
  return request({
    url: '/system/productCategory/queryBusinessSelectProductCategoryTreeList',
    method: 'post',
    data: data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/sales/salesGoodsReturn/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/sales/salesGoodsReturn/revisionDiff',
    method: 'post',
    data
  })
}
