import request from '@/utils/request'
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/inventory/transferOrder/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询:
export function querySearchList(data) {
  return request({
    url: '/inventory/transferOrder/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询业务单据列表
export function queryTransferOrderList(data) {
  return request({
    url: '/inventory/transferOrder/queryTransferOrderList',
    method: 'post',
    data: data
  })
}

// 查询调拨单可以选择的销售订单列表 (参数: warehouseType, salesOrderStatusList, conditionForSO)
export function queryCanSelectSalesOrderListFromTransferOrder(data) {
  return request({
    url: '/sales/salesOrder/queryCanSelectSalesOrderListFromTransferOrder',
    method: 'post',
    data: data
  })
}
// 查询可以选择的调出仓库
export function queryFromWarehouseList(data) {
  return request({
    url: '/inventory/transferOrder/queryFromWarehouseList',
    method: 'post',
    data: data
  })
}
// 查询可以选择的目的仓库:
export function queryToWarehouseList(data) {
  return request({
    url: '/inventory/transferOrder/queryToWarehouseList',
    method: 'post',
    data: data
  })
}
// 查询调拨单可以选择的产品列表
// (参数: fromWarehouseId, toWarehouseId, transferOrderId, alreadySelectProductIdList)
export function queryProductListFromTransferOrder(data) {
  return request({
    url: '/inventory/transferOrder/queryProductListFromTransferOrder',
    method: 'post',
    data: data
  })
}

// 查询调拨单可以选择的产品列表,有关联销售订单的时候
// 参数: fromWarehouseId, toWarehouseId, transferOrderId, salesOrderId, salesOrderTransferOrderType
export function queryProductListFromTransferOrderHaveSalesOrder(data) {
  return request({
    url: '/inventory/transferOrder/queryProductListFromTransferOrderHaveSalesOrder',
    method: 'post',
    data: data
  })
}

// 提交单据:
export function saveTransferOrder(data) {
  return request({
    url: '/inventory/transferOrder/saveTransferOrder',
    method: 'post',
    data: data
  })
}
// BY ID
export function queryTransferOrderById(data) {
  return request({
    url: '/inventory/transferOrder/queryTransferOrderById',
    method: 'post',
    data: data
  })
}
// 审批同意
export function approvedTransferOrder(data) {
  return request({
    url: '/inventory/transferOrder/approvedTransferOrder',
    method: 'post',
    data: data
  })
}
// 审批拒绝
export function rejectedTransferOrder(data) {
  return request({
    url: '/inventory/transferOrder/rejectedTransferOrder',
    method: 'post',
    data: data
  })
}
// 取消调拨单
export function cancelledTransferOrder(data) {
  return request({
    url: '/inventory/transferOrder/cancelledTransferOrder',
    method: 'post',
    data: data
  })
}
// 查询单据和上一次的修订对比
export function queryUpdateMsgTransferOrder(data) {
  return request({
    url: '/inventory/transferOrder/queryUpdateMsgTransferOrder',
    method: 'post',
    data: data
  })
}

// 查询业务单据列表
export function queryOperationLogList(data) {
  return request({
    url: '/inventory/transferOrder/queryOperationLogList',
    method: 'post',
    data: data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/inventory/transferOrder/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/inventory/transferOrder/revisionDiff',
    method: 'post',
    data
  })
}
