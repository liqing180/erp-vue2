import request from '@/utils/request'
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/sales/salesQuotation/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 各个页签数据数量查询
export function queryLabelCount(data) {
  return request({
    url: '/sales/salesQuotation/queryLabelCount',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询
export function querySearchList(data) {
  return request({
    url: '/sales/salesQuotation/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询业务单据列表
export function querySalesQuotationList(data) {
  return request({
    url: '/sales/salesQuotation/querySalesQuotationList',
    method: 'post',
    data: data
  })
}
// 查询销售需求的操作日志
export function querySalesQuotationOperationLog(data) {
  return request({
    url: '/sales/salesQuotation/querySalesQuotationOperationLog',
    method: 'post',
    data: data
  })
}

// 查询销售需求可以选择的产品列表
export function querySalesInquiryCanSelectProductList(data) {
  return request({
    url: '/sales/salesQuotation/querySalesInquiryCanSelectProductList',
    method: 'post',
    data: data
  })
}
// 查询可以选择的服务列表
export function queryCanSelectServiceList(data) {
  return request({
    url: '/system/product/queryCanSelectServiceList',
    method: 'post',
    data: data
  })
}
// 产品行数据二次处理接口
export function dealAddProductMsg(data) {
  return request({
    url: '/sales/salesQuotation/dealAddProductMsg',
    method: 'post',
    data: data
  })
}
// 查询可以选择的PPL列表:  (参数: salesInquiryProductId, salesInquiryServiceId, currencyId)
export function queryCanSelectPPLListNoPage(data) {
  return request({
    url: '/purchase/purchasePriceList/queryCanSelectPPLListNoPage',
    method: 'post',
    data: data
  })
}

// 销售报价进行计算
export function calculate(data) {
  return request({
    url: '/sales/salesQuotation/calculate',
    method: 'post',
    data: data
  })
}
// 销售报价切换价格类型后，进行计算
export function dealAddProductMsgAndCalculate(data) {
  return request({
    url: '/sales/salesQuotation/dealAddProductMsgAndCalculate',
    method: 'post',
    data: data
  })
}

// 销售需求产品进行单行计算
export function calculateOneDetail(data) {
  return request({
    url: '/sales/salesQuotation/calculateOneDetail',
    method: 'post',
    data: data
  })
}
// 销售需求服务进行单行计算
export function calculateOneService(data) {
  return request({
    url: '/sales/salesQuotation/calculateOneService',
    method: 'post',
    data: data
  })
}

// 查询销售需求单据和上一次的修订对比
export function queryUpdateMsgSalesQuotation(data) {
  return request({
    url: '/sales/salesQuotation/queryUpdateMsgSalesQuotation',
    method: 'post',
    data: data
  })
}

// 查询销售需求的历史版本下拉
export function querySalesQuotationHistoryVersion(data) {
  return request({
    url: '/sales/salesQuotation/querySalesQuotationHistoryVersion',
    method: 'post',
    data: data
  })
}

// 检查销售报价产品的信息，是否存在库存不足：

export function checkSalesQuotationProductMsg(data) {
  return request({
    url: '/sales/salesQuotation/checkSalesQuotationProductMsg',
    method: 'post',
    data: data
  })
}
// 更新客户采购信息
export function updateSalesQuotationPurchase(data) {
  return request({
    url: '/sales/salesQuotation/updateSalesQuotationPurchase',
    method: 'post',
    data: data
  })
}
// 保存草稿
export function saveDraftSalesQuotation(data) {
  return request({
    url: '/sales/salesQuotation/saveDraftSalesQuotation',
    method: 'post',
    data: data
  })
}
// 提交单据
export function saveSalesQuotation(data) {
  return request({
    url: '/sales/salesQuotation/saveSalesQuotation',
    method: 'post',
    data: data
  })
}
// revise单据
export function reviseSalesQuotation(data) {
  return request({
    url: '/sales/salesQuotation/reviseSalesQuotation',
    method: 'post',
    data: data
  })
}

// 查询具体销售需求
export function querySalesQuotationById(data) {
  return request({
    url: '/sales/salesQuotation/querySalesQuotationById',
    method: 'post',
    data: data
  })
}

// 查询具体销售需求-revise 页面专用
export function querySalesQuotationReviseById(data) {
  return request({
    url: '/sales/salesQuotation/querySalesQuotationReviseById',
    method: 'post',
    data: data
  })
}

// 审批同意
export function approvedSalesQuotation(data) {
  return request({
    url: '/sales/salesQuotation/approvedSalesQuotation',
    method: 'post',
    data: data
  })
}
// 审批拒绝
export function rejectedSalesQuotation(data) {
  return request({
    url: '/sales/salesQuotation/rejectedSalesQuotation',
    method: 'post',
    data: data
  })
}

// 回退
export function returnSalesQuotation(data) {
  return request({
    url: '/sales/salesQuotation/returnSalesQuotation',
    method: 'post',
    data: data
  })
}

// 取消报价
export function cancelledSalesQuotation(data) {
  return request({
    url: '/sales/salesQuotation/cancelledSalesQuotation',
    method: 'post',
    data: data
  })
}

// 激活销售报价单:
export function activateSalesQuotation(data) {
  return request({
    url: '/sales/salesQuotation/activateSalesQuotation',
    method: 'post',
    data: data
  })
}

// 生成销售订单
export function generateSO(data) {
  return request({
    url: '/sales/salesQuotation/generateSO',
    method: 'post',
    data: data
  })
}

// 预览PDF
export function preview(data) {
  return request({
    url: '/sales/salesQuotation/preview',
    method: 'post',
    data: data
  })
}

// 销售报价: 查询客户的付款条款 参数businessPartnerId
export function getBPLastPaymentTermName(data) {
  return request({
    url: '/sales/salesQuotation/getBPLastPaymentTermName',
    method: 'post',
    data: data
  })
}

// 查询可以选择的项目模板列表,无分页: system/projectTemplate/queryCanSelectProjectTemplateListNoPage
export function queryCanSelectProjectTemplateListNoPage(data) {
  return request({
    url: '/system/projectTemplate/queryCanSelectProjectTemplateListNoPage',
    method: 'post',
    data: data
  })
}

// 查询根据货币转换金额
export function conversionCurrencyUnitPrice(data) {
  return request({
    url: '/sales/salesQuotation/conversionCurrencyUnitPrice',
    method: 'post',
    data: data
  })
}

// 查询可以选择的项目列表: system/businessPartner/queryCanSelectProjectList (businessPartnerId)
export function queryCanSelectProjectList(data) {
  return request({
    url: '/system/businessPartner/queryCanSelectProjectList',
    method: 'post',
    data: data
  })
}

// 查询可以选择的配合比列表: system/mixDesign/queryCanSelectMixDesignSalesPriceList (projectId)
export function queryCanSelectMixDesignSalesPriceList(data) {
  return request({
    url: '/system/mixDesign/queryCanSelectMixDesignSalesPriceList',
    method: 'post',
    data: data
  })
}
// 查询可以选择的配合比销售用的变体信息: system/mixDesign/queryMixDesignSalesVariation (mixDesignId)
export function queryMixDesignSalesVariation(data) {
  return request({
    url: '/system/mixDesign/queryMixDesignSalesVariation',
    method: 'post',
    data: data
  })
}

// 获取条件字段变量格式化后的值
export function getFormattedVarContent(data) {
  return request({
    url: '/sales/salesQuotation/getFormattedVarContent',
    method: 'post',
    data: data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/sales/salesQuotation/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/sales/salesQuotation/revisionDiff',
    method: 'post',
    data
  })
}
