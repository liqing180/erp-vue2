import request from '@/utils/request'
// import { praseStrEmpty } from '@/utils/ruoyi'

//  查询物流单据表详情
export function getLogisticsCostById(id) {
  return request({
    url: `/purchase/pLogisticsDocument/${id}/detail`,
    method: 'get'
  })
}
export function queryLogisticsDocumentHistoryVersion(data) {
  return request({
    url: '/purchase/pLogisticsDocument/queryLogisticsDocumentHistoryVersion',
    method: 'post',
    data: data
  })
}

// 新增物流单据表
export function addLogisticsCost(data) {
  return request({
    url: '/purchase/pLogisticsDocument/add',
    method: 'post',
    data: data
  })
}
// 修正:
export function reviseLogisticsCost(data) {
  return request({
    url: '/purchase/pLogisticsDocument/revise',
    method: 'post',
    data: data
  })
}

// 查询物流单据列表
export function queryLogisticsCostList(data) {
  return request({
    url: '/purchase/pLogisticsDocument/page',
    method: 'post',
    data: data
  })
}
// 查询物流单据搜索下拉框
export function querySearchList(data) {
  return request({
    url: '/purchase/pLogisticsDocument/getLogisticsDocumentSearchValue',
    method: 'post',
    data: data
  })
}

// 导出物流单据列表
export function exportLogisticsCost(data) {
  return request({
    url: '/purchase/pLogisticsDocument/export',
    method: 'post',
    data: data
  })
}

// 查询物流费用可以选择的采购订单产品列表: conditionForPurchaseOrder, condition, documentDetailIdList
export function queryPurchaseOrderListFromLogisticsExpense(data) {
  return request({
    url: '/purchase/purchaseOrder/queryPurchaseOrderListFromLogisticsExpense',
    method: 'post',
    data: data
  })
}
// 查询物流费用可以选择的采购订单产品列表 下拉搜索值查询:
export function querySearchListFromLogisticsExpense(data) {
  return request({
    url: '/purchase/purchaseOrder/querySearchListFromLogisticsExpense',
    method: 'post',
    data: data
  })
}

// 物流费用项采购退货类型弹窗列表
export function queryPurchaseGoodsReturnListFromLogisticsExpense(data) {
  return request({
    url: '/purchase/purchaseReturn/queryPurchaseGoodsReturnListFromLogisticsExpense',
    method: 'post',
    data: data
  })
}
// 物流费用项采购退货类型弹窗列表可选择的下拉搜索
export function querySearchListFromLogisticsExpensePRO(data) {
  return request({
    url: '/purchase/purchaseReturn/querySearchListFromLogisticsExpense',
    method: 'post',
    data: data
  })
}

// 物流费用计算分摊金额
export function calculateDocumentExpense(data) {
  return request({
    url: '/purchase/logisticsDocumentExpense/calculateDocumentExpense',
    method: 'post',
    data: data
  })
}

// 物流费用项销售退货弹窗列表:
export function querySalesGoodsReturnListFromLogisticsExpense(data) {
  return request({
    url: '/sales/salesGoodsReturn/querySalesGoodsReturnListFromLogisticsExpense',
    method: 'post',
    data: data
  })
}

// 物流费用项销售退货单类型弹窗列表可选择的销售退货下拉搜索
export function querySearchListFromLogisticsExpenseSGR(data) {
  return request({
    url: '/sales/salesGoodsReturn/querySearchListFromLogisticsExpense',
    method: 'post',
    data: data
  })
}

// 物流费用项借货弹窗列表
export function queryStoreIssueChitListFromLogisticsExpense(data) {
  return request({
    url: '/inventory/storeIssueChit/queryStoreIssueChitListFromLogisticsExpense',
    method: 'post',
    data: data
  })
}
// 物流费用项借货弹窗列表下拉搜索）
export function querySearchListFromLogisticsExpenseSIC(data) {
  return request({
    url: '/inventory/storeIssueChit/querySearchListFromLogisticsExpense',
    method: 'post',
    data: data
  })
}

// 物流费用调拨弹窗列表
export function queryTransferOrderListFromLogisticsExpense(data) {
  return request({
    url: '/inventory/transferOrder/queryTransferOrderListFromLogisticsExpense',
    method: 'post',
    data: data
  })
}
// 物流费用项调拨弹窗列表下拉搜索
export function querySearchListFromLogisticsExpenseTO(data) {
  return request({
    url: '/inventory/transferOrder/querySearchListFromLogisticsExpense',
    method: 'post',
    data: data
  })
}

// 物流费用计算分摊金额 pLogisticsDocument/calculate
export function calculate(data) {
  return request({
    url: '/purchase/pLogisticsDocument/calculate',
    method: 'post',
    data: data
  })
}

// 采购,采购退货，销售退货，借货，调拨接口改成下面接口,用documentType区分:
// 获取收货单批次数据:inventory/goodsReceivedNote/queryLCReceivedNoteDetailBatchList(documentType,menuPerms)
export function queryLCReceivedNoteDetailBatchList(data) {
  return request({
    url: '/inventory/goodsReceivedNote/queryLCReceivedNoteDetailBatchList',
    method: 'post',
    data: data
  })
}

// 获取收货单批次数据搜索条件:inventory/goodsReceivedNote/querySearchFromLCReceivedNoteDetailBatchList(documentType,menuPerms)
export function querySearchFromLCReceivedNoteDetailBatchList(data) {
  return request({
    url: '/inventory/goodsReceivedNote/querySearchFromLCReceivedNoteDetailBatchList',
    method: 'post',
    data: data
  })
}
