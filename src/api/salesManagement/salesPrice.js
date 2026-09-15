import request from '@/utils/request'
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/sales/salesPrice/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 查询销售可以选择的产品列表: system/product/querySalesCanSelectProductList
export function querySalesCanSelectProductList(data) {
  return request({
    url: '/system/product/querySalesCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 查询销售可以选择的产品列表-无分页
export function querySalesCanSelectProductListNoPage(data) {
  return request({
    url: '/system/product/querySalesCanSelectProductListNoPage',
    method: 'post',
    data: data
  })
}

// 处理新选择的产品数据: sales/salesPrice/dealAddProductMsg (正常对象构建,传递集合 salesPriceProductList)
export function dealAddProductMsg(data) {
  return request({
    url: '/sales/salesPrice/dealAddProductMsg',
    method: 'post',
    data: data
  })
}

// 下拉搜索值查询: sales/salesPrice/querySearchList
export function querySearchList(data) {
  return request({
    url: '/sales/salesPrice/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询业务单据列表: sales/salesPrice/querySalesPriceList
export function querySalesPriceList(data) {
  return request({
    url: '/sales/salesPrice/querySalesPriceList',
    method: 'post',
    data: data
  })
}

// 保存草稿: sales/salesPrice/saveDraftSalesPrice
export function saveDraftSalesPrice(data) {
  return request({
    url: '/sales/salesPrice/saveDraftSalesPrice',
    method: 'post',
    data: data
  })
}

// 提交单据: sales/salesPrice/saveSalesPrice
export function saveSalesPrice(data) {
  return request({
    url: '/sales/salesPrice/saveSalesPrice',
    method: 'post',
    data: data
  })
}

// 查询具体销售定价: sales/salesPrice/querySalesPriceById
export function querySalesPriceById(data) {
  return request({
    url: '/sales/salesPrice/querySalesPriceById',
    method: 'post',
    data: data
  })
}

// 查询销售定价的操作日志: sales/salesPrice/querySalesPriceOperationLog
export function querySalesPriceOperationLog(data) {
  return request({
    url: '/sales/salesPrice/querySalesPriceOperationLog',
    method: 'post',
    data: data
  })
}

// 查询销售定价单据和上一次的修订对比: sales/salesPrice/queryUpdateMsgSalesPrice
export function queryUpdateMsgSalesPrice(data) {
  return request({
    url: '/sales/salesPrice/queryUpdateMsgSalesPrice',
    method: 'post',
    data: data
  })
}

// 审批同意销售定价: sales/salesPrice/approvedSalesPrice (modelKey = 'salesPriceKey')
export function approvedSalesPrice(data) {
  return request({
    url: '/sales/salesPrice/approvedSalesPrice',
    method: 'post',
    data: data
  })
}

// 审批拒绝销售定价: sales/salesPrice/rejectedSalesPrice
export function rejectedSalesPrice(data) {
  return request({
    url: '/sales/salesPrice/rejectedSalesPrice',
    method: 'post',
    data: data
  })
}

// 取消销售定价: sales/salesPrice/cancelledSalesPrice
export function cancelledSalesPrice(data) {
  return request({
    url: '/sales/salesPrice/cancelledSalesPrice',
    method: 'post',
    data: data
  })
}

// 查询法人下的分公司列表集合:system/dataPermissions/getBranchCompanyList
export function getBranchCompanyList(data) {
  return request({
    url: '/system/dataPermissions/getBranchCompanyList',
    method: 'get'
  })
}

// 查询销售定价可以选择的产品列表：sales/salesPrice/querySalesPriceCanSelectProductList
export function querySalesPriceCanSelectProductList(data) {
  return request({
    url: '/sales/salesPrice/querySalesPriceCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 查询销售定价可以选择的产品列表：sales/salesPrice/querySalesPriceCanSelectProductListNoPage
export function querySalesPriceCanSelectProductListNoPage(data) {
  return request({
    url: '/sales/salesPrice/querySalesPriceCanSelectProductListNoPage',
    method: 'post',
    data: data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/sales/salesPrice/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/sales/salesPrice/revisionDiff',
    method: 'post',
    data
  })
}
