import request from '@/utils/request'
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/sales/salesInquiry/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 各个页签数据数量查询
export function queryLabelCount(data) {
  return request({
    url: '/sales/salesInquiry/queryLabelCount',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询
export function querySearchList(data) {
  return request({
    url: '/sales/salesInquiry/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询业务单据列表
export function querySalesInquiryList(data) {
  return request({
    url: '/sales/salesInquiry/querySalesInquiryList',
    method: 'post',
    data: data
  })
}
// 查询销售需求的操作日志
export function querySalesInquiryOperationLog(data) {
  return request({
    url: '/sales/salesInquiry/querySalesInquiryOperationLog',
    method: 'post',
    data: data
  })
}

// 查询可以选择的客户列表
export function queryCanSelectCustomerListHavePage(data) {
  return request({
    url: '/system/businessPartner/queryCanSelectCustomerListHavePage',
    method: 'post',
    data: data
  })
}
// 查询可以选择的客户列表 搜索条件
export function queryCanSelectCustomerSearchList(data) {
  return request({
    url: '/system/businessPartner/queryCanSelectCustomerSearchList',
    method: 'post',
    data: data
  })
}

// 查询客户可以选择的客户问卷
export function queryBPCustomerQuestionnaireListNoPage(data) {
  return request({
    url: '/system/customerQuestionnaire/queryBPCustomerQuestionnaireListNoPage',
    method: 'post',
    data: data
  })
}

// 查询可以选择的仓库列表
export function queryCanSelectWarehouseListNoDataPermissions(data) {
  return request({
    url: '/inventory/warehouse/queryCanSelectWarehouseListNoDataPermissions',
    method: 'post',
    data: data
  })
}
// 查询可以选择的仓库列表
export function queryCanSelectWarehouseListHaveDataPermissions(data) {
  return request({
    url: '/inventory/warehouse/queryCanSelectWarehouseListHaveDataPermissions',
    method: 'post',
    data: data
  })
}
// 查询销售需求可以选择的产品列表
export function querySalesInquiryCanSelectProductList(data) {
  return request({
    url: '/sales/salesInquiry/querySalesInquiryCanSelectProductList',
    method: 'post',
    data: data
  })
}
// 寄卖类数据, 查询产品接口
export function querySalesCanSelectProductList(data) {
  return request({
    url: '/system/product/querySalesCanSelectProductList',
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
    url: '/sales/salesInquiry/dealAddProductMsg',
    method: 'post',
    data: data
  })
}
// 产品行数据二次处理接口
export function dealAddProductMsg2(data) {
  return request({
    url: '/sales/salesInquiry/dealAddProductMsg2',
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

// 重新报价: (参数: salesInquiryId, batchIdList)
export function reQuote(data) {
  return request({
    url: '/sales/salesInquiry/reQuote',
    method: 'post',
    data: data
  })
}

// 销售需求进行计算
export function calculate(data) {
  return request({
    url: '/sales/salesInquiry/calculate',
    method: 'post',
    data: data
  })
}
// 销售需求切换价格类型后，进行计算
export function dealAddProductMsgAndCalculate(data) {
  return request({
    url: '/sales/salesInquiry/dealAddProductMsgAndCalculate',
    method: 'post',
    data: data
  })
}

// 销售需求产品进行单行计算
export function calculateOneDetail(data) {
  return request({
    url: '/sales/salesInquiry/calculateOneDetail',
    method: 'post',
    data: data
  })
}
// 销售需求服务进行单行计算
export function calculateOneService(data) {
  return request({
    url: '/sales/salesInquiry/calculateOneService',
    method: 'post',
    data: data
  })
}

// 查询销售需求单据和上一次的修订对比
export function queryUpdateMsgSalesInquiry(data) {
  return request({
    url: '/sales/salesInquiry/queryUpdateMsgSalesInquiry',
    method: 'post',
    data: data
  })
}

// 保存草稿
export function saveDraftSalesInquiry(data) {
  return request({
    url: '/sales/salesInquiry/saveDraftSalesInquiry',
    method: 'post',
    data: data
  })
}
// 提交单据
export function saveSalesInquiry(data) {
  return request({
    url: '/sales/salesInquiry/saveSalesInquiry',
    method: 'post',
    data: data
  })
}

// 查询具体销售需求
export function querySalesInquiryById(data) {
  return request({
    url: '/sales/salesInquiry/querySalesInquiryById',
    method: 'post',
    data: data
  })
}

// 审批同意
export function approvedSalesInquiry(data) {
  return request({
    url: '/sales/salesInquiry/approvedSalesInquiry',
    method: 'post',
    data: data
  })
}
// 审批拒绝
export function rejectedSalesInquiry(data) {
  return request({
    url: '/sales/salesInquiry/rejectedSalesInquiry',
    method: 'post',
    data: data
  })
}
// 取消销售需求
export function cancelledSalesInquiry(data) {
  return request({
    url: '/sales/salesInquiry/cancelledSalesInquiry',
    method: 'post',
    data: data
  })
}
// 撤回销售需求
export function withdrawSalesInquiry(data) {
  return request({
    url: '/sales/salesInquiry/withdrawSalesInquiry',
    method: 'post',
    data: data
  })
}

// 回退用料清单: (参数: salesInquiryId)
export function returnMaterialList(data) {
  return request({
    url: '/sales/salesInquiry/returnMaterialList',
    method: 'post',
    data: data
  })
}
// 回退项目任务
export function returnProjectTask(data) {
  return request({
    url: '/sales/salesInquiry/returnProjectTask',
    method: 'post',
    data: data
  })
}
// 回退项目报价:
export function returnProjectCost(data) {
  return request({
    url: '/sales/salesInquiry/returnProjectCost',
    method: 'post',
    data: data
  })
}
// 生成报价
export function generateSalesQuotation(data) {
  return request({
    url: '/sales/salesInquiry/generateSalesQuotation',
    method: 'post',
    data: data
  })
}
// 销售需求: 查询客户的付款条款 参数businessPartnerId
export function getBPLastPaymentTermName(data) {
  return request({
    url: '/sales/salesInquiry/getBPLastPaymentTermName',
    method: 'post',
    data: data
  })
}

// 查询可以选择的服务列表
export function queryCanSelectServiceListFromSalesInquiry(data) {
  return request({
    url: '/system/product/queryCanSelectServiceListFromSalesInquiry',
    method: 'post',
    data: data
  })
}

// 查询根据货币转换金额
export function conversionCurrencyUnitPrice(data) {
  return request({
    url: '/sales/salesInquiry/conversionCurrencyUnitPrice',
    method: 'post',
    data: data
  })
}

// 查询BP可以选择的价格类型: (businessPartnerId,customerGroup)
export function queryCustomerPriceTypeList(data) {
  return request({
    url: '/system/businessPartner/queryCustomerPriceTypeList',
    method: 'post',
    data: data
  })
}

// 查询可以选择的产品 and 服务 列表
export function querySalesInquiryCanSelectProductOrServiceList(data) {
  return request({
    url: '/sales/salesInquiry/querySalesInquiryCanSelectProductOrServiceList',
    method: 'post',
    data: data
  })
}
// 提交按钮显示判断:
export function submitButtonJudgmentDisplay(data) {
  return request({
    url: '/sales/salesInquiry/submitButtonJudgmentDisplay',
    method: 'post',
    data: data
  })
}

// 查询销售需求类型 = 项目 可以选择的产品列表 system/product/queryCanSelectProductList
export function queryCanSelectProductList(data) {
  return request({
    url: '/system/product/queryCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/sales/salesInquiry/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/sales/salesInquiry/revisionDiff',
    method: 'post',
    data
  })
}
