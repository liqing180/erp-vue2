import request from '@/utils/request'
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/purchase/requestForQuotation/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 查询数量:
export function queryCountList(data) {
  return request({
    url: '/purchase/requestForQuotation/queryCountList',
    method: 'post',
    data: data
  })
}
// 下拉查询:
export function querySearchList(data) {
  return request({
    url: '/purchase/requestForQuotation/querySearchList',
    method: 'post',
    data: data
  })
}

// RFQ 主列表查询:
export function queryRFQDetailList(data) {
  return request({
    url: '/purchase/requestForQuotation/queryRFQList',
    method: 'post',
    data: data
  })
}
// 勾选多行数据点击询价按钮: (参数: rfqDetailIdList)
export function initRFQFromPR(data) {
  return request({
    url: '/purchase/requestForQuotation/initRFQFromPR',
    method: 'post',
    data: data
  })
}

// 查询具体 RFQ
export function queryRFQById(data) {
  return request({
    url: '/purchase/requestForQuotation/queryRFQById',
    method: 'post',
    data: data
  })
}

// 查询RFQ可以选择的仓库列表
export function queryRFQCanSelectWarehouseList(data) {
  return request({
    url: '/inventory/warehouse/queryRFQCanSelectWarehouseList',
    method: 'post',
    data: data
  })
}

// 查询无PR的RFQ可以选择的产品列表
export function queryRFQCanSelectProductList(data) {
  return request({
    url: '/system/product/queryRFQCanSelectProductList',
    method: 'post',
    data: data
  })
}

export function querySalesCanSelectProductList(data) {
  return request({
    url: '/system/product/querySalesCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 查询RFQ可以选择的供应商列表  参数(productIdList, supplierGroupList)
// 有和产品的对应关系
export function queryRFQCanSelectVendorListForHaveSheet(data) {
  return request({
    url: '/system/businessPartner/queryRFQCanSelectVendorListForHaveSheet',
    method: 'post',
    data: data
  })
}
// 没有和产品的对应关系
export function queryRFQCanSelectVendorListForNoSheet(data) {
  return request({
    url: '/system/businessPartner/queryRFQCanSelectVendorListForNoSheet',
    method: 'post',
    data: data
  })
}

// 获取合并以后产品行数据:
export function mergeRFQDetail(data) {
  return request({
    url: '/purchase/requestForQuotation/mergeRFQDetail',
    method: 'post',
    data: data
  })
}

// 页面提交
export function saveRFQ(data) {
  return request({
    url: '/purchase/requestForQuotation/saveRFQ',
    method: 'post',
    data: data
  })
}

// 取消RFQ
export function cancelledRFQ(data) {
  return request({
    url: '/purchase/requestForQuotation/cancelledRFQ',
    method: 'post',
    data: data
  })
}

// /purchase/requestForQuotation/preview
export function preview(data) {
  return request({
    url: '/purchase/requestForQuotation/preview',
    method: 'post',
    data: data
  })
}

// 查询PPL列表: purchase/requestForQuotation/queryPPLList
// (参数: productId, businessPartnerIdList, businessPartnerIdForSearchList, isLastTime)
export function queryPPLList(data) {
  return request({
    url: '/purchase/requestForQuotation/queryPPLList',
    method: 'post',
    data: data
  })
}
// 根据产品ID 查询采购报价列表的下拉搜索条件
export function querySearchListForPPL(data) {
  return request({
    url: '/purchase/requestForQuotation/querySearchListForPPL',
    method: 'post',
    data: data
  })
}

// 提交 提交RFQ进入审批流: purchase/requestForQuotation/submitRFQ (按钮权限, isCanUpdate)
export function submitRFQ(data) {
  return request({
    url: '/purchase/requestForQuotation/submitRFQ',
    method: 'post',
    data: data
  })
}

// 审批同意: purchase/requestForQuotation/approvedRFQ
export function approvedRFQ(data) {
  return request({
    url: '/purchase/requestForQuotation/approvedRFQ',
    method: 'post',
    data: data
  })
}
// 审批拒绝: purchase/requestForQuotation/rejectedRFQ
export function rejectedRFQ(data) {
  return request({
    url: '/purchase/requestForQuotation/rejectedRFQ',
    method: 'post',
    data: data
  })
}

// 撤回接口: purchase/requestForQuotation/withdrawRFQ (参数: rfqId)
export function withdrawRFQ(data) {
  return request({
    url: '/purchase/requestForQuotation/withdrawRFQ',
    method: 'post',
    data: data
  })
}

// 待报价、已报价页签的询价单可临时添加供应商询价 (rfqId, rfqVendorList)
export function sendNewBusinessPartner(data) {
  return request({
    url: '/purchase/requestForQuotation/sendNewBusinessPartner',
    method: 'post',
    data: data
  })
}

// 获取 RFQ 所选供应商对应的进行中 PQ
export function queryIngPQList(data) {
  return request({
    url: '/purchase/requestForQuotation/queryIngPQList',
    method: 'post',
    data
  })
}

// 页面保存
export function saveDraftRFQ(data) {
  return request({
    url: '/purchase/requestForQuotation/saveDraftRFQ',
    method: 'post',
    data: data
  })
}

// 验证产品是否已经存在于另一份询价单: purchase/requestForQuotation/checkProductIsAlreadyRFQ (rfqDetailList, rfqId)
export function checkProductIsAlreadyRFQ(data) {
  return request({
    url: '/purchase/requestForQuotation/checkProductIsAlreadyRFQ',
    method: 'post',
    data: data
  })
}

// 下拉搜索: purchase/purchaseOrder/queryASLPendingOrderProductListForSearch
export function queryASLPendingOrderProductListForSearch(data) {
  return request({
    url: '/purchase/purchaseOrder/queryASLPendingOrderProductListForSearch',
    method: 'post',
    data: data
  })
}
// 查询列表: purchase/purchaseOrder/queryASLPendingOrderProductList
//                (dropShipping, productIdList, businessPartnerIdList, condition, conditionForPR)
export function queryASLPendingOrderProductList(data) {
  return request({
    url: '/purchase/purchaseOrder/queryASLPendingOrderProductList',
    method: 'post',
    data: data
  })
}

export function importRFQProductImportTemplate(data) {
  return request({
    url: '/purchase/requestForQuotation/importRFQProductImportTemplate',
    method: 'post',
    data: data.formData
  })
}

// inventory/warehouse/queryCanSelectWarehouseListNoPage
export function queryCanSelectWarehouseListNoPage(data) {
  return request({
    url: '/inventory/warehouse/queryCanSelectWarehouseListNoPage',
    method: 'post',
    data: data
  })
}

// 批量PR选择固定地址构建询价信息:
//  purchase/requestForQuotation/initRFQFromPRSelectAddress
// (rfqDetailIdList, dropShipping, receiveAddressName, warehouseId, warehouseName)
export function initRFQFromPRSelectAddress(data) {
  return request({
    url: '/purchase/requestForQuotation/initRFQFromPRSelectAddress',
    method: 'post',
    data: data
  })
}
// 查询待询价产品列表:
export function queryPendInquiryProductList(data) {
  return request({
    url: '/purchase/requestForQuotation/queryPendInquiryProductList',
    method: 'post',
    data: data
  })
}

// 查询未审批通过的临时产品名称集合：system/product/queryUnapprovedAdhocProductNameList (productIdList)
export function queryUnapprovedAdhocProductNameList(data) {
  return request({
    url: '/system/product/queryUnapprovedAdhocProductNameList',
    method: 'post',
    data: data
  })
}
