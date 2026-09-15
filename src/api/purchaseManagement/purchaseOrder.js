import request from '@/utils/request'
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/purchase/purchaseOrder/withdrawApproved',
    method: 'post',
    data: data
  })
}

// 各个页签数据数量查询
export function queryCountList(data) {
  return request({
    url: '/purchase/purchaseOrder/queryCountList',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询
export function querySearchList(data) {
  return request({
    url: '/purchase/purchaseOrder/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询 PO 列表
export function queryPurchaseOrderList(data) {
  return request({
    url: '/purchase/purchaseOrder/queryPurchaseOrderList',
    method: 'post',
    data: data
  })
}
// 查询具体 PO
export function queryPurchaseOrderById(data) {
  return request({
    url: '/purchase/purchaseOrder/queryPurchaseOrderById',
    method: 'post',
    data: data
  })
}
// 查询 PO 的操作日志
export function queryPOOperationLog(data) {
  return request({
    url: '/purchase/purchaseOrder/queryPOOperationLog',
    method: 'post',
    data: data
  })
}
// 审批同意
export function approvedPurchaseOrder(data) {
  return request({
    url: '/purchase/purchaseOrder/approvedPurchaseOrder',
    method: 'post',
    data: data
  })
}
// 审批拒绝
export function rejectedPurchaseOrder(data) {
  return request({
    url: '/purchase/purchaseOrder/rejectedPurchaseOrder',
    method: 'post',
    data: data
  })
}
// 取消
export function cancelledPO(data) {
  return request({
    url: '/purchase/purchaseOrder/cancelledPO',
    method: 'post',
    data: data
  })
}
// 关闭
export function closedPO(data) {
  return request({
    url: '/purchase/purchaseOrder/closedPO',
    method: 'post',
    data: data
  })
}
// 保存草稿
export function saveDraftPurchaseOrder(data) {
  return request({
    url: '/purchase/purchaseOrder/saveDraftPurchaseOrder',
    method: 'post',
    data: data
  })
}
// 提交 PO
export function savePurchaseOrder(data) {
  return request({
    url: '/purchase/purchaseOrder/savePurchaseOrder',
    method: 'post',
    data: data
  })
}
// revise单据
export function revisePurchaseOrder(data) {
  return request({
    url: '/purchase/purchaseOrder/revisePurchaseOrder',
    method: 'post',
    data: data
  })
}
// 查询PO可以选择的供应商列表
export function queryBusinessCanSelectVendorList(data) {
  return request({
    url: '/system/businessPartner/queryBusinessCanSelectVendorList',
    method: 'post',
    data: data
  })
}
// 查询PO可以选择的供应商列表--过滤没有PQ的供应商
export function queryPurchaseOrderCanSelectBusinessPartnerList(data) {
  return request({
    url: '/system/businessPartner/queryPurchaseOrderCanSelectBusinessPartnerList',
    method: 'post',
    data: data
  })
}
// 查询ASL PO可以选择的供应商列表
export function queryPurchaseOrderCanSelectBusinessPartnerListForASL(data) {
  return request({
    url: '/system/businessPartner/queryPurchaseOrderCanSelectBusinessPartnerListForASL',
    method: 'post',
    data: data
  })
}
// 查询PO可以选择的仓库列表
export function queryPOCanSelectWarehouseList(data) {
  return request({
    url: '/inventory/warehouse/queryPOCanSelectWarehouseList',
    method: 'post',
    data: data
  })
}

// PO查询可以选择的PR列表
export function queryPOCanSelectProductListForPR(data) {
  return request({
    url: '/purchase/purchaseOrder/queryPOCanSelectProductListForPR',
    method: 'post',
    data: data
  })
}
// PO查询可以选择的PR列表的搜索条件
export function querySearchListForPOCanSelectProductListForPR(data) {
  return request({
    url: '/purchase/purchaseOrder/querySearchListForPOCanSelectProductListForPR',
    method: 'post',
    data: data
  })
}

// PO查询可以选择的产品列表
export function queryPOCanSelectProductListForProduct(data) {
  return request({
    url: '/purchase/purchaseOrder/queryPOCanSelectProductListForProduct',
    method: 'post',
    data: data
  })
}
// 选择以后进行数据合并:(参数: poSelectProductList)
export function mergePOSelectProductList(data) {
  return request({
    url: '/purchase/purchaseOrder/mergePOSelectProductList',
    method: 'post',
    data: data
  })
}

// PO进行计算
export function calculate(data) {
  return request({
    url: '/purchase/purchaseOrder/calculate',
    method: 'post',
    data: data
  })
}

// PO进行单行计算
export function calculateOneDetail(data) {
  return request({
    url: '/purchase/purchaseOrder/calculateOneDetail',
    method: 'post',
    data: data
  })
}

// 查询可以选择的运费税: /{countryId} (GET)
export function queryAllFreightTaxForPurchase(id) {
  return request({
    url: '/system/taxCode/queryAllFreightTaxForPurchase/' + id,
    method: 'GET'
  })
}

// 运费税计算 (POST) (参数: freight, taxNo)
export function calculateFreightTaxAmount(data) {
  return request({
    url: '/system/taxCode/calculateFreightTaxAmount',
    method: 'post',
    data: data
  })
}

// 查询 PO 单据和上一次的修订对比
export function queryUpdateMsgPO(data) {
  return request({
    url: '/purchase/purchaseOrder/queryUpdateMsgPO',
    method: 'post',
    data: data
  })
}

// 查询单据历史版本
export function queryPurchaseOrderHistoryVersion(data) {
  return request({
    url: '/purchase/purchaseOrder/queryPurchaseOrderHistoryVersion',
    method: 'post',
    data: data
  })
}

// 根据业务主键查询采购订单历史快照版本（V2）
export function queryPurchaseOrderRevisionVersions(businessId) {
  return request({
    url: `/purchase/purchaseOrder/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

// 按前端详情 Schema 对比采购订单的任意两个历史快照版本
export function comparePurchaseOrderRevisionDiff(data) {
  return request({
    url: '/purchase/purchaseOrder/revisionDiff',
    method: 'post',
    data: data
  })
}

// 预览PDF
export function preview(data) {
  return request({
    url: '/purchase/purchaseOrder/preview',
    method: 'post',
    data: data
  })
}

// PO send 发货
export function sendPO(data) {
  return request({
    url: '/purchase/purchaseOrder/sendPO',
    method: 'post',
    data: data
  })
}
// PO 查询send 详情
export function queryPOSendMsg(data) {
  return request({
    url: '/purchase/purchaseOrder/queryPOSendMsg',
    method: 'post',
    data: data
  })
}
// send 获取可以下拉的PO
export function queryCanSendPOList(data) {
  return request({
    url: '/purchase/purchaseOrder/queryCanSendPOList',
    method: 'post',
    data: data
  })
}
// 通过RFQ PPL创建PO
export function getPOFromPPL(data) {
  return request({
    url: '/purchase/purchaseOrder/getPOFromPPL',
    method: 'post',
    data: data
  })
}

// 确认PO的服务产品
export function acknowledgedServiceProduct(data) {
  return request({
    url: '/purchase/purchaseOrder/acknowledgedServiceProduct',
    method: 'post',
    data: data
  })
}

// 查询PO服务产品的确认信息: purchaseOrderDetailId
export function queryServiceProductAcknowledgedMsg(data) {
  return request({
    url: '/purchase/purchaseOrder/queryServiceProductAcknowledgedMsg',
    method: 'post',
    data: data
  })
}

// 寄卖仓库进行入库操作:
export function inWarehousePO(data) {
  return request({
    url: '/purchase/purchaseOrder/inWarehousePO',
    method: 'post',
    data: data
  })
}
// 查询寄卖仓库入库信息:  (purchaseOrderId)
export function queryInWarehousePOMsg(data) {
  return request({
    url: '/purchase/purchaseOrder/queryInWarehousePOMsg',
    method: 'post',
    data: data
  })
}

// 产品对应供应商上10次的采购单价 (参数: businessPartnerId, productId, currencyId, purchaseOrderDetailId)
export function queryProductHistoryPriceImage(data) {
  return request({
    url: '/purchase/purchaseOrder/queryProductHistoryPriceImage',
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
// 查询物流费用可以选择的采购订单产品列表: conditionForPurchaseOrder, condition, documentDetailIdList
export function queryPurchaseOrderListFromLogisticsExpense(data) {
  return request({
    url: '/purchase/purchaseOrder/queryPurchaseOrderListFromLogisticsExpense',
    method: 'post',
    data: data
  })
}

// 物流费用进行单行计算
export function calculateOneDetailForLogisticsExpense(data) {
  return request({
    url: '/purchase/purchaseOrder/calculateOneDetailForLogisticsExpense',
    method: 'post',
    data: data
  })
}

// 下拉搜索值查询:  businessPartnerId
export function querySearchListFromCanSelectPurchaseQuotationList(data) {
  return request({
    url: '/purchase/purchaseOrder/querySearchListFromCanSelectPurchaseQuotationList',
    method: 'post',
    data: data
  })
}
// 查询PO可以选择的PQ列表:
// (businessPartnerId, conditionForPurchaseQuotationNo, conditionForSupplierQuoteNo, condition)
export function queryCanSelectPurchaseQuotationList(data) {
  return request({
    url: '/purchase/purchaseOrder/queryCanSelectPurchaseQuotationList',
    method: 'post',
    data: data
  })
}

// 增加PQ的默认信息到PO当中
export function addPQDefaultMsgToPO(data) {
  return request({
    url: '/purchase/purchaseOrder/addPQDefaultMsgToPO',
    method: 'post',
    data: data
  })
}

// 货币价格进行转换: (oldCurrencyId, currencyId, purchaseOrderDetailList)
export function conversionCurrencyUnitPrice(data) {
  return request({
    url: '/purchase/purchaseOrder/conversionCurrencyUnitPrice',
    method: 'post',
    data: data
  })
}

// 直运PO可以选择的销售订单 下拉搜索
export function querySearchListFromPurchaseDropShipping(data) {
  return request({
    url: '/sales/salesOrder/querySearchListFromPurchaseDropShipping',
    method: 'post',
    data: data
  })
}

// 直运PO可以选择的销售订单 分页接口:
export function queryCanSelectSalesOrderListFromPurchaseDropShipping(data) {
  return request({
    url: '/sales/salesOrder/queryCanSelectSalesOrderListFromPurchaseDropShipping',
    method: 'post',
    data: data
  })
}

// 获取条件字段变量格式化后的值
export function getFormattedVarContent(data) {
  return request({
    url: '/purchase/purchaseOrder/getFormattedVarContent',
    method: 'post',
    data: data
  })
}

// 费用项计算参考金额
export function calculateDetailsOfExpenses(data) {
  return request({
    url: '/purchase/purchaseOrder/calculateDetailsOfExpenses',
    method: 'post',
    data: data
  })
}

// 通过PQ ID 创建PO
export function addPQDefaultMsgToPOFromRFQ(data) {
  return request({
    url: '/purchase/purchaseOrder/addPQDefaultMsgToPOFromRFQ',
    method: 'post',
    data: data
  })
}

// 查询可以登记补发的产品列表: (purchaseOrderId, condition)
export function queryPendReplacementList(data) {
  return request({
    url: '/purchase/purchaseOrder/queryPendReplacementList',
    method: 'post',
    data: data
  })
}

// 产品进行登记补发: purchaseOrderId purchaseOrderDetailList(purchaseOrderDetailId, qty)
export function replacementProduct(data) {
  return request({
    url: '/purchase/purchaseOrder/replacementProduct',
    method: 'post',
    data: data
  })
}

/* ASL PO 接口 Start */
// 选择PR弹窗 下拉搜索
export function querySearchListFromASLPRList(data) {
  return request({
    url: '/purchase/purchaseOrder/querySearchListFromASLPRList',
    method: 'post',
    data: data
  })
}
// 选择PR弹窗 弹窗列表 (purchaseOrderId, businessPartnerId, conditionForPurchaseRequisiteNo, condition)
export function queryASLPurchaseOrderCanSelectPurchaseRequisiteList(data) {
  return request({
    url: '/purchase/purchaseOrder/queryASLPurchaseOrderCanSelectPurchaseRequisiteList',
    method: 'post',
    data: data
  })
}
// 构建PO:  (businessPartnerId, purchaseRequisiteIdList)
export function buildASLPurchaseOrderFromBPAndPR(data) {
  return request({
    url: '/purchase/purchaseOrder/buildASLPurchaseOrderFromBPAndPR',
    method: 'post',
    data: data
  })
}
// 查询产品: (businessPartnerId, purchaseRequisiteIdList)
export function queryASLCanSelectProductList(data) {
  return request({
    url: '/purchase/purchaseOrder/queryASLCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 查询产品: (businessPartnerId, purchaseRequisiteIdList)
export function queryASLCanSelectProductListForEGR(data) {
  return request({
    url: '/purchase/purchaseOrder/queryASLCanSelectProductListForEGR',
    method: 'post',
    data: data
  })
}

// 查询产品下拉搜索:  (businessPartnerId, purchaseRequisiteIdList)
export function queryASLCanSelectProductListForSearch(data) {
  return request({
    url: '/purchase/purchaseOrder/queryASLCanSelectProductListForSearch',
    method: 'post',
    data: data
  })
}
// 产品合并: (businessPartnerId, poSelectProductList, currencyId, currencyCode)
export function mergeASLSelectProductList(data) {
  return request({
    url: '/purchase/purchaseOrder/mergeASLSelectProductList',
    method: 'post',
    data: data
  })
}

// 构建PO-RFQ ASL弹窗跳转后调用:  (pendingOrderProductIdList, purchaseRequisiteDetailIdList)
export function buildASLPurchaseOrderFromAssign(data) {
  return request({
    url: '/purchase/purchaseOrder/buildASLPurchaseOrderFromAssign',
    method: 'post',
    data: data
  })
}
/* ASL PO 接口 End */

// 查询产品历史价格列表: purchase/purchaseOrder/queryProductEffectivePriceList (productId)
export function queryProductEffectivePriceList(data) {
  return request({
    url: '/purchase/purchaseOrder/queryProductEffectivePriceList',
    method: 'post',
    data: data
  })
}

// 验证PQ对应的RFQ是否供应商报价数量达标: purchase/purchaseOrder/checkPQFromRFQForBPCount (purchaseQuotationId)
export function checkPQFromRFQForBPCount(data) {
  return request({
    url: '/purchase/purchaseOrder/checkPQFromRFQForBPCount',
    method: 'post',
    data: data
  })
}

// 点击Revise按钮的时候: purchase/purchaseOrder/checkIsCanReviseForButton
export function checkIsCanReviseForButton(data) {
  return request({
    url: '/purchase/purchaseOrder/checkIsCanReviseForButton',
    method: 'post',
    data: data
  })
}
// 提交的时候: purchase/purchaseOrder/checkIsCanReviseForSubmit
export function checkIsCanReviseForSubmit(data) {
  return request({
    url: '/purchase/purchaseOrder/checkIsCanReviseForSubmit',
    method: 'post',
    data: data
  })
}

export function queryCanConfirmDeliveryMsg(data) {
  return request({
    url: '/purchase/purchaseOrder/queryCanConfirmDeliveryMsg',
    method: 'post',
    data: data
  })
}

export function confirmDeliverySubmit(data) {
  return request({
    url: '/purchase/purchaseOrder/confirmDeliverySubmit',
    method: 'post',
    data: data
  })
}
// PO 作废 (purchaseOrderId, invalidateReason)
export function invalidatePO(data) {
  return request({
    url: '/purchase/purchaseOrder/invalidatePO',
    method: 'post',
    data: data
  })
}

// 查询当前货币与登录法人货币的汇率描述: system/common/queryExchangeRateDesc (currencyCode)
export function queryExchangeRateDesc(data) {
  return request({
    url: '/system/common/queryExchangeRateDesc',
    method: 'post',
    data: data
  })
}

// purchase/purchaseOrder/queryASLPurchaseOrderCanSelectPurchaseRequisiteListForEGR
export function queryASLPurchaseOrderCanSelectPurchaseRequisiteListForEGR(data) {
  return request({
    url: '/purchase/purchaseOrder/queryASLPurchaseOrderCanSelectPurchaseRequisiteListForEGR',
    method: 'post',
    data: data
  })
}

// 紧急收货单构建
export function buildASLPurchaseOrderFromBPAndPRForEGR(data) {
  return request({
    url: '/purchase/purchaseOrder/buildASLPurchaseOrderFromBPAndPRForEGR',
    method: 'post',
    data: data
  })
}

// 紧急收货单产品合并
export function mergeASLSelectProductListForEGR(data) {
  return request({
    url: '/purchase/purchaseOrder/mergeASLSelectProductListForEGR',
    method: 'post',
    data: data
  })
}
