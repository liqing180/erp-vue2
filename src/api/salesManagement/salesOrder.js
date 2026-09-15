import request from '@/utils/request'

// 各个页签数据数量查询
export function queryLabelCount(data) {
  return request({
    url: '/sales/salesOrder/queryLabelCount',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询
export function querySearchList(data) {
  return request({
    url: '/sales/salesOrder/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询业务单据列表
export function querySalesOrderList(data) {
  return request({
    url: '/sales/salesOrder/querySalesOrderList',
    method: 'post',
    data: data
  })
}
// 查询具体销售订单
export function querySalesOrderById(data) {
  return request({
    url: '/sales/salesOrder/querySalesOrderById',
    method: 'post',
    data: data
  })
}
// 查询销售订单的操作日志
export function querySalesOrderOperationLog(data) {
  return request({
    url: '/sales/salesOrder/querySalesOrderOperationLog',
    method: 'post',
    data: data
  })
}

// 预览PDF
export function preview(data) {
  return request({
    url: '/sales/salesOrder/preview',
    method: 'post',
    data: data
  })
}

// SO查询可以选择的仓库列表: (参数: needSelectWarehouseId)
export function queryCanSelectWarehouseListHaveDataPermissionsNoPage(data) {
  return request({
    url: '/inventory/warehouse/queryCanSelectWarehouseListHaveDataPermissionsNoPage',
    method: 'post',
    data: data
  })
}

// 查询销售订单指派发货可以选择的产品列表 (参数: salesOrderId, warehouseId)
export function querySOSelectProductListFromDelivery(data) {
  return request({
    url: '/sales/salesOrder/querySOSelectProductListFromDelivery',
    method: 'post',
    data: data
  })
}

export function dealAddProductMsg(data) {
  return request({
    url: '/sales/salesOrder/dealAddProductMsg',
    method: 'post',
    data: data
  })
}
/* 代发货数量弹窗接口 */
export function querySalesOrderProductOtherMsg(data) {
  return request({
    url: '/sales/salesOrder/querySalesOrderProductOtherMsg',
    method: 'post',
    data: data
  })
}

// sales/salesOrder/selectTransportationStrategy
export function selectTransportationStrategy(data) {
  return request({
    url: '/sales/salesOrder/selectTransportationStrategy',
    method: 'post',
    data: data
  })
}

// 取消接口: sales/salesOrder/cancelledSalesOrder (businessId, reason, commonFileList)
export function cancelledSalesOrder(data) {
  return request({
    url: '/sales/salesOrder/cancelledSalesOrder',
    method: 'post',
    data: data
  })
}

// 取消接口: sales/salesOrder/cancelledSalesOrderDetail (salesOrderProductIdList, reason, commonFileList)
export function cancelledSalesOrderDetail(data) {
  return request({
    url: '/sales/salesOrder/cancelledSalesOrderDetail',
    method: 'post',
    data: data
  })
}

// 查询寄卖可以新增的产品列表
export function queryConsignmentCanAddProductList(data) {
  return request({
    url: '/sales/salesOrder/queryConsignmentCanAddProductList',
    method: 'post',
    data: data
  })
}

// 寄卖新增产品选择调拨: (salesOrderId, salesOrderProductList)
export function consignmentAddProductToTO(data) {
  return request({
    url: '/sales/salesOrder/consignmentAddProductToTO',
    method: 'post',
    data: data
  })
}
// 寄卖新增产品选择采购:
export function consignmentAddProductToPO(data) {
  return request({
    url: '/sales/salesOrder/consignmentAddProductToPO',
    method: 'post',
    data: data
  })
}

// 关闭销售订单: sales/salesOrder/closeSalesOrder (salesOrderId)
export function closeSalesOrder(data) {
  return request({
    url: '/sales/salesOrder/closeSalesOrder',
    method: 'post',
    data: data
  })
}

// 配合比列表： 重测提交接口:  (salesOrderMixDesignId)
export function retestMixDesignTrialMix(data) {
  return request({
    url: '/sales/salesOrder/retestMixDesignTrialMix',
    method: 'post',
    data: data
  })
}

// 拒绝:sales/salesOrder/rejectedSalesOrder
export function rejectedSalesOrder(data) {
  return request({
    url: '/sales/salesOrder/rejectedSalesOrder',
    method: 'post',
    data: data
  })
}

// 撤回:sales/salesOrder/withdrawApproved
export function withdrawApproved(data) {
  return request({
    url: '/sales/salesOrder/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 同意:sales/salesOrder/approvedSalesOrder
export function approvedSalesOrder(data) {
  return request({
    url: '/sales/salesOrder/approvedSalesOrder',
    method: 'post',
    data: data
  })
}

//  查询发货计划行数据列表: (deliveryScheduleId / salesOrderId)
export function queryDeliveryScheduleDetailList(data) {
  return request({
    url: '/sales/deliverySchedule/queryDeliveryScheduleDetailList',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询: (deliveryScheduleId / salesOrderId)
export function queryDeliveryScheduleDetailListForSearch(data) {
  return request({
    url: '/sales/deliverySchedule/queryDeliveryScheduleDetailListForSearch',
    method: 'post',
    data: data
  })
}
//  查询具体发货计划: (deliveryScheduleId / salesOrderId)
export function queryDeliveryScheduleById(data) {
  return request({
    url: '/sales/deliverySchedule/queryDeliveryScheduleById',
    method: 'post',
    data: data
  })
}
// 查询可以选择的产品列表:  (salesOrderId)
export function queryCanSelectProductList(data) {
  return request({
    url: '/sales/deliverySchedule/queryCanSelectProductList',
    method: 'post',
    data: data
  })
}
// 查询发货计划产品额外信息: (salesOrderId, productId)
export function queryProductOtherMsg(data) {
  return request({
    url: '/sales/deliverySchedule/queryProductOtherMsg',
    method: 'post',
    data: data
  })
}
// 新增发货计划: salesOrderId, deliveryScheduleDetailList
export function submitDeliverySchedule(data) {
  return request({
    url: '/sales/deliverySchedule/submitDeliverySchedule',
    method: 'post',
    data: data
  })
}
// 取消发货计划:
export function cancelledDeliverySchedule(data) {
  return request({
    url: '/sales/deliverySchedule/cancelledDeliverySchedule',
    method: 'post',
    data: data
  })
}
// 关闭发货计划:
export function closeDeliverySchedule(data) {
  return request({
    url: '/sales/deliverySchedule/closeDeliverySchedule',
    method: 'post',
    data: data
  })
}

// 查询发货计划行编辑弹窗: (deliveryScheduleDetailId)
export function queryDeliveryScheduleDetailMsg(data) {
  return request({
    url: '/sales/deliverySchedule/queryDeliveryScheduleDetailMsg',
    method: 'post',
    data: data
  })
}
// 发货计划行数据编辑: (deliveryScheduleDetailId)
export function updateDeliveryScheduleDetail(data) {
  return request({
    url: '/sales/deliverySchedule/updateDeliveryScheduleDetail',
    method: 'post',
    data: data
  })
}
// 发货计划行数据删除:
export function deleteDeliveryScheduleDetail(data) {
  return request({
    url: '/sales/deliverySchedule/deleteDeliveryScheduleDetail',
    method: 'post',
    data: data
  })
}

// sales/salesOrder/updateRequestedReceiptDate
// (requestedReceiptDate, salesOrderId,
// salesOrderProductId/salesOrderServiceId)
export function updateRequestedReceiptDate(data) {
  return request({
    url: '/sales/salesOrder/updateRequestedReceiptDate',
    method: 'post',
    data: data
  })
}

// 计算发货时间:sales/deliverySchedule/calculateShippedDate(deliveryScheduleDetail)
export function calculateShippedDate(data) {
  return request({
    url: '/sales/deliverySchedule/calculateShippedDate',
    method: 'post',
    data: data
  })
}

// 按销售订单查询付款计划:
// /sales/paymentPlan/queryBySalesOrderId (salesOrderId)
export function queryBySalesOrderId(data) {
  return request({
    url: '/sales/paymentPlan/queryBySalesOrderId',
    method: 'post',
    data: data
  })
}

// 导出付款计划PI明细:
// /sales/paymentPlan/exportPiBreakdown (salesOrderId)
export function exportPiBreakdown(data) {
  return request({
    url: '/sales/paymentPlan/exportPiBreakdown',
    method: 'post',
    data: data
  })
}

// sales/paymentPlan/autoCompletePI （salesOrderId，paymentPlanDetailId）
export function autoCompletePI(data) {
  return request({
    url: '/sales/paymentPlan/autoCompletePI',
    method: 'post',
    data: data
  })
}
