import request from '@/utils/request'

export function querySICCanSelectProductList(data) {
  return request({
    url: '/system/product/querySICCanSelectProductList',
    method: 'post',
    data: data
  })
}
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/inventory/storeIssueChit/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 页签数量查询
export function queryLabelCount(data) {
  return request({
    url: '/inventory/storeIssueChit/queryLabelCount',
    method: 'post',
    data: data
  })
}
// 借货单下拉搜索值查询:  inventory/storeIssueChit/querySearchList
export function querySearchList(data) {
  return request({
    url: '/inventory/storeIssueChit/querySearchList',
    method: 'post',
    data: data
  })
}
// 借货单查询业务单据列表:  inventory/storeIssueChit/queryStoreIssueChitList
export function queryStoreIssueChitList(data) {
  return request({
    url: '/inventory/storeIssueChit/queryStoreIssueChitList',
    method: 'post',
    data: data
  })
}

// 借货单查询具体发货通知: inventory/storeIssueChit/queryStoreIssueChitById
export function queryStoreIssueChitById(data) {
  return request({
    url: '/inventory/storeIssueChit/queryStoreIssueChitById',
    method: 'post',
    data: data
  })
}

// 提交单据:inventory/storeIssueChit/saveStoreIssueChit
export function saveStoreIssueChit(data) {
  return request({
    url: '/inventory/storeIssueChit/saveStoreIssueChit',
    method: 'post',
    data: data
  })
}

// 更新SIC 产品:inventory/storeIssueChit/updateStoreIssueChitProduct
export function updateStoreIssueChitProduct(data) {
  return request({
    url: '/inventory/storeIssueChit/updateStoreIssueChitProduct',
    method: 'post',
    data: data
  })
}

// 更新SIC 产品
export function checkStoreIssueChitProductHaveChange(data) {
  return request({
    url: '/inventory/storeIssueChit/checkStoreIssueChitProductHaveChange',
    method: 'post',
    data: data
  })
}

// 审批同意:inventory/storeIssueChit/approvedStoreIssueChit
export function approvedStoreIssueChit(data) {
  return request({
    url: '/inventory/storeIssueChit/approvedStoreIssueChit',
    method: 'post',
    data: data
  })
}

// 审批拒绝:inventory/storeIssueChit/rejectedStoreIssueChit
export function rejectedStoreIssueChit(data) {
  return request({
    url: '/inventory/storeIssueChit/rejectedStoreIssueChit',
    method: 'post',
    data: data
  })
}

// 取消借货单:inventory/storeIssueChit/cancelledStoreIssueChit
export function cancelledStoreIssueChit(data) {
  return request({
    url: '/inventory/storeIssueChit/cancelledStoreIssueChit',
    method: 'post',
    data: data
  })
}

// 查询单据和上一次的修订对比 :inventory/storeIssueChit/queryUpdateMsgStoreIssueChit
export function queryUpdateMsgStoreIssueChit(data) {
  return request({
    url: '/inventory/storeIssueChit/queryUpdateMsgStoreIssueChit',
    method: 'post',
    data: data
  })
}

// 关闭借货单:inventory/storeIssueChit/closedStoreIssueChit
export function closedStoreIssueChit(data) {
  return request({
    url: '/inventory/storeIssueChit/closedStoreIssueChit',
    method: 'post',
    data: data
  })
}

// 归还借货单:inventory/storeIssueChit/returnStoreIssueChit
export function returnStoreIssueChit(data) {
  return request({
    url: '/inventory/storeIssueChit/returnStoreIssueChit',
    method: 'post',
    data: data
  })
}

// 获取系统设置信息： system/setup/getSystemSetup
export function getSystemSetup(data) {
  return request({
    url: '/system/setup/getSystemSetup',
    method: 'get'
  })
}

// 查询法人的部门列表: system/corporate/queryLegalEntityDepartmentList (POST,无参数)
export function queryLegalEntityDepartmentList(data) {
  return request({
    url: '/system/corporate/queryLegalEntityDepartmentList',
    method: 'post',
    data: data
  })
}

// 查询仓库产品的占用详情 参数: warehouseId, productId
export function queryWarehouseProductReservedDetails(data) {
  return request({
    url: '/inventory/inventoryReport/queryWarehouseProductReservedDetails',
    method: 'post',
    data: data
  })
}

// 查询可以选择的司机列表: /system/driver/queryCanSelectDriverList
export function queryCanSelectDriverList(data) {
  return request({
    url: '/system/driver/queryCanSelectDriverList',
    method: 'post',
    data: data
  })
}
// 查询可以选择的车辆列表: /system/vehicle/queryCanSelectVehicleList
export function queryCanSelectVehicleList(data) {
  return request({
    url: '/system/vehicle/queryCanSelectVehicleList',
    method: 'post',
    data: data
  })
}

// 借货单,检查占用抢占影响: inventory/storeIssueChit/checkStoreIssueChitPreemptRisk （warehouseId，productId，qty）
export function checkStoreIssueChitPreemptRisk(data) {
  return request({
    url: '/inventory/storeIssueChit/checkStoreIssueChitPreemptRisk',
    method: 'post',
    data: data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/inventory/storeIssueChit/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/inventory/storeIssueChit/revisionDiff',
    method: 'post',
    data
  })
}
