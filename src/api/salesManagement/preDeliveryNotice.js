import request from '@/utils/request'

// 各个页签数据数量查询
export function queryLabelCount(data) {
  return request({
    url: '/sales/preDeliveryNotice/queryLabelCount',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询
export function querySearchList(data) {
  return request({
    url: '/sales/preDeliveryNotice/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询业务单据列表
export function queryPreDeliveryNoticeList(data) {
  return request({
    url: '/sales/preDeliveryNotice/queryPreDeliveryNoticeList',
    method: 'post',
    data: data
  })
}
// 查询可以选择的销售订单列表
export function queryCanSelectSalesOrderList(data) {
  return request({
    url: '/sales/preDeliveryNotice/queryCanSelectSalesOrderList',
    method: 'post',
    data: data
  })
}
// 查询单号下拉 conditionForSalesOrderNoList
export function queryCanSelectSalesOrderSearchList(data) {
  return request({
    url: '/sales/preDeliveryNotice/queryCanSelectSalesOrderSearchList',
    method: 'post',
    data: data
  })
}
// 查询可以选择的销售退货单列表 (参数: conditionForSalesGoodsReturnNo)
export function queryCanSelectSalesGoodsReturnList(data) {
  return request({
    url: '/sales/preDeliveryNotice/queryCanSelectSalesGoodsReturnList',
    method: 'post',
    data: data
  })
}
// 查询单号下拉 conditionForSalesGoodsReturnNoList
export function queryCanSelectSalesGoodsReturnSearchList(data) {
  return request({
    url: '/sales/preDeliveryNotice/queryCanSelectSalesGoodsReturnSearchList',
    method: 'post',
    data: data
  })
}

// 根据销售订单ID 查询单据信息
export function getPreDeliveryNoticeFromSalesOrder(data) {
  return request({
    url: '/sales/preDeliveryNotice/getPreDeliveryNoticeFromSalesOrder',
    method: 'post',
    data: data
  })
}
// 根据销售退货单ID 查询单据信息
export function getPreDeliveryNoticeFromSalesGoodsReturn(data) {
  return request({
    url: '/sales/preDeliveryNotice/getPreDeliveryNoticeFromSalesGoodsReturn',
    method: 'post',
    data: data
  })
}

// 保存草稿:
export function saveDraftPreDeliveryNotice(data) {
  return request({
    url: '/sales/preDeliveryNotice/saveDraftPreDeliveryNotice',
    method: 'post',
    data: data
  })
}
// 查询具体发货通知:
export function queryPreDeliveryNoticeById(data) {
  return request({
    url: '/sales/preDeliveryNotice/queryPreDeliveryNoticeById',
    method: 'post',
    data: data
  })
}
// 分配任务弹窗 查询可以选择的产品列表:
// 参数: salesOrderId, shipWarehouseId, preDeliveryNoticeId
export function queryPreDeliveryNoticeSelectDeliveryProductListFromSalesOrder(data) {
  return request({
    url: '/sales/preDeliveryNotice/queryPreDeliveryNoticeSelectDeliveryProductListFromSalesOrder',
    method: 'post',
    data: data
  })
}
// 分配任务弹窗 查询发货通知指派发货可以选择的产品列表,销售退货单
// (参数: salesGoodsReturnId, preDeliveryNoticeType, shipWarehouseId, preDeliveryNoticeId)
export function queryPreDeliveryNoticeSelectDeliveryProductListFromSalesGoodsReturn(data) {
  return request({
    url: '/sales/preDeliveryNotice/queryPreDeliveryNoticeSelectDeliveryProductListFromSalesGoodsReturn',
    method: 'post',
    data: data
  })
}

// 分配任务弹窗 指派仓库的提交
// 参数: salesOrderId, shipWarehouseId, shipWarehouseName, preDeliveryNoticeId, preDeliveryNoticeProductList
export function submitAssignTask(data) {
  return request({
    url: '/sales/preDeliveryNotice/submitAssignTask',
    method: 'post',
    data: data
  })
}
/* 撤回发货通知单 */
export function withdrawPreDeliveryNotice(data) {
  return request({
    url: '/sales/preDeliveryNotice/withdrawPreDeliveryNotice',
    method: 'post',
    data: data
  })
}

/* 取消发货通知单 */
export function cancelledPreDeliveryNotice(data) {
  return request({
    url: '/sales/preDeliveryNotice/cancelledPreDeliveryNotice',
    method: 'post',
    data: data
  })
}

// 查询发货通知单可以选择的采购订单列表: purchase/purchaseOrder/queryPurchaseOrderListFromPreDeliveryNotice
export function queryPurchaseOrderListFromPreDeliveryNotice(data) {
  return request({
    url: '/purchase/purchaseOrder/queryPurchaseOrderListFromPreDeliveryNotice',
    method: 'post',
    data: data
  })
}

// 给发货通知单赋值采购订单对应的采购数量: purchase/purchaseOrder/setPurchaseQtyForPre
// 参数: purchaseOrderId, preDeliveryNoticeProductList
export function setPurchaseQtyForPre(data) {
  return request({
    url: '/purchase/purchaseOrder/setPurchaseQtyForPre',
    method: 'post',
    data: data
  })
}

// sales/preDeliveryNotice/submitFinishedGoodPreDeliveryNotice
export function submitFinishedGoodPreDeliveryNotice(data) {
  return request({
    url: '/sales/preDeliveryNotice/submitFinishedGoodPreDeliveryNotice',
    method: 'post',
    data: data
  })
}

// sales/preDeliveryNotice/dealDataFromUpdateWarehouse
export function dealDataFromUpdateWarehouse(data) {
  return request({
    url: '/sales/preDeliveryNotice/dealDataFromUpdateWarehouse',
    method: 'post',
    data: data
  })
}
