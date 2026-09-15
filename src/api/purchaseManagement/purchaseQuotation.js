import request from '@/utils/request'

// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/purchase/purchaseQuotation/withdrawApproved',
    method: 'post',
    data: data
  })
}

// 查询数量:
export function queryCountList(data) {
  return request({
    url: '/purchase/purchaseQuotation/queryCountList',
    method: 'post',
    data: data
  })
}
// 下拉查询:
export function querySearchList(data) {
  return request({
    url: '/purchase/purchaseQuotation/querySearchList',
    method: 'post',
    data: data
  })
}

// PQ 主列表查询:
export function queryPurchaseQuotationList(data) {
  return request({
    url: '/purchase/purchaseQuotation/queryPurchaseQuotationList',
    method: 'post',
    data: data
  })
}

// 查询具体 PQ
export function queryPurchaseQuotationById(data) {
  return request({
    url: '/purchase/purchaseQuotation/queryPurchaseQuotationById',
    method: 'post',
    data: data
  })
}
// 查询PQ可以选择的供应商列表
export function queryPQCanSelectVendorList(data) {
  return request({
    url: '/system/businessPartner/queryPQCanSelectVendorList',
    method: 'post',
    data: data
  })
}
// 查询RFQ可以选择的仓库列表
export function queryPQCanSelectWarehouseList(data) {
  return request({
    url: '/inventory/warehouse/queryPQCanSelectWarehouseList',
    method: 'post',
    data: data
  })
}

// 查询产品列表
export function queryPQCanSelectProductList(data) {
  return request({
    url: '/system/product/queryPQCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 页面提交
export function savePurchaseQuotation(data) {
  return request({
    url: '/purchase/purchaseQuotation/savePurchaseQuotation',
    method: 'post',
    data: data
  })
}

// 页面保存
export function saveDraftPurchaseQuotation(data) {
  return request({
    url: '/purchase/purchaseQuotation/saveDraftPurchaseQuotation',
    method: 'post',
    data: data
  })
}

// revise 提交接口
export function revisePurchaseQuotation(data) {
  return request({
    url: '/purchase/purchaseQuotation/revisePurchaseQuotation',
    method: 'post',
    data: data
  })
}

// 取消PQ
export function cancelledPurchaseQuotation(data) {
  return request({
    url: '/purchase/purchaseQuotation/cancelledPQ',
    method: 'post',
    data: data
  })
}

// 审批同意
export function approvedPurchaseQuotation(data) {
  return request({
    url: '/purchase/purchaseQuotation/approvedPurchaseQuotation',
    method: 'post',
    data: data
  })
}
// 审批拒绝
export function rejectedPurchaseQuotation(data) {
  return request({
    url: '/purchase/purchaseQuotation/rejectedPurchaseQuotation',
    method: 'post',
    data: data
  })
}

// 查询单据和上一次的修订对比
export function queryUpdateMsgPQ(data) {
  return request({
    url: '/purchase/purchaseQuotation/queryUpdateMsgPQ',
    method: 'post',
    data: data
  })
}

// 查询操作日志
export function queryPQOperationLog(data) {
  return request({
    url: '/purchase/purchaseQuotation/queryPQOperationLog',
    method: 'post',
    data: data
  })
}

// 税计算 : 参数:(productId, unitPrice, qty, taxNo)
export function calculateTaxAmount(data) {
  return request({
    url: '/system/taxCode/calculateTaxAmount',
    method: 'post',
    data: data
  })
}

// PQ进行计算
export function calculate(data) {
  return request({
    url: '/purchase/purchaseQuotation/calculate',
    method: 'post',
    data: data
  })
}

// 获取税的下拉列表 : 参数:(countryId, productId)
export function queryAllTaxForPurchase(data) {
  return request({
    url: '/system/taxCode/queryAllTaxForPurchase',
    method: 'post',
    data: data
  })
}

// 提交无报价:
export function submitNoQuotation(data) {
  return request({
    url: '/purchase/purchaseQuotation/submitNoQuotation',
    method: 'post',
    data: data
  })
}

// 查询上次报价:
export function addLastPurchaseQuotationMsg(data) {
  return request({
    url: '/purchase/purchaseQuotation/addLastPurchaseQuotationMsg',
    method: 'post',
    data: data
  })
}

// 查询历史报价记录图表 (currencyId, purchaseQuotationDetailId, purchaseUomCoefficient)
export function queryHistoryPurchaseQuotationUnitPriceImage(data) {
  return request({
    url: '/purchase/purchaseQuotation/queryHistoryPurchaseQuotationUnitPriceImage',
    method: 'post',
    data: data
  })
}
// 付款条款 近五次的历史记录 businessPartnerId
export function queryHistoryPaymentTermName(data) {
  return request({
    url: '/purchase/purchaseQuotation/queryHistoryPaymentTermName',
    method: 'post',
    data: data
  })
}

// 查询历史报价记录-搜索条件 productId
export function queryHistoryQuotationRecordsImageSearch(data) {
  return request({
    url: '/purchase/purchaseQuotation/queryHistoryQuotationRecordsImageSearch',
    method: 'post',
    data: data
  })
}
// 查询历史报价记录: (productId, currencyId, purchaseUomCoefficient, businessPartnerIdList)
export function queryHistoryQuotationRecordsImage(data) {
  return request({
    url: '/purchase/purchaseQuotation/queryHistoryQuotationRecordsImage',
    method: 'post',
    data: data
  })
}

// 导入PQ单据产品列表数据
export function importPurchaseQuotationProduct(data) {
  return request({
    url: '/purchase/purchaseQuotation/importPQImportTemplate',
    method: 'post',
    data: data.formData
  })
}

// purchase/purchaseQuotation/queryCanSelectProductList (rfqId,purchaseQuotationId)
export function queryCanSelectProductList(data) {
  return request({
    url: '/purchase/purchaseQuotation/queryCanSelectProductList',
    method: 'post',
    data: data
  })
}
// 延期
export function extendValidityPurchaseQuotation(data) {
  return request({
    url: '/purchase/purchaseQuotation/extendValidityPurchaseQuotation',
    method: 'post',
    data: data
  })
}
