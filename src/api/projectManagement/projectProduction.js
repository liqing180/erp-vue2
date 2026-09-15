import request from '@/utils/request'

// 查询用户: system/userNew/queryUsers
export function queryUsers(data) {
  return request({
    url: '/system/userNew/queryUsers',
    method: 'post',
    data: data
  })
}
// 查询项目生产可以选择的销售订单列表: sales/salesOrder/queryCanSelectSalesOrderListFromProjectProduction
export function queryCanSelectSalesOrderListFromProjectProduction(data) {
  return request({
    url: '/sales/salesOrder/queryCanSelectSalesOrderListFromProjectProduction',
    method: 'post',
    data: data
  })
}

// 查询项目模板的配件信息: system/projectTemplate/queryProjectTemplateContentMsg (projectTemplateId)
export function queryProjectTemplateContentMsg(data) {
  return request({
    url: '/system/projectTemplate/queryProjectTemplateContentMsg',
    method: 'post',
    data: data
  })
}

// 查询可以选择的仓库列表,项目生产出库: inventory/warehouse/queryCanSelectWarehouseListFromProjectProductionOut
export function queryCanSelectWarehouseListFromProjectProductionOut(data) {
  return request({
    url: '/inventory/warehouse/queryCanSelectWarehouseListFromProjectProductionOut',
    method: 'post',
    data: data
  })
}
// 查询可以选择的仓库列表,项目生产入库: inventory/warehouse/queryCanSelectWarehouseListFromProjectProductionIn
export function queryCanSelectWarehouseListFromProjectProductionIn(data) {
  return request({
    url: '/inventory/warehouse/queryCanSelectWarehouseListFromProjectProductionIn',
    method: 'post',
    data: data
  })
}

// 项目生产保存草稿: system/projectProduction/saveDraftProjectProduction
export function saveDraftProjectProduction(data) {
  return request({
    url: '/system/projectProduction/saveDraftProjectProduction',
    method: 'post',
    data: data
  })
}

// 项目生产提交数据: system/projectProduction/saveProjectProduction
export function saveProjectProduction(data) {
  return request({
    url: '/system/projectProduction/saveProjectProduction',
    method: 'post',
    data: data
  })
}

// 下拉搜索值查询: system/projectProduction/querySearchList
export function querySearchList(data) {
  return request({
    url: '/system/projectProduction/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询项目生产列表: system/projectProduction/queryProjectProductionList
export function queryProjectProductionList(data) {
  return request({
    url: '/system/projectProduction/queryProjectProductionList',
    method: 'post',
    data: data
  })
}

// 查询具体项目生产: system/projectProduction/queryProjectProductionById
export function queryProjectProductionById(data) {
  return request({
    url: '/system/projectProduction/queryProjectProductionById',
    method: 'post',
    data: data
  })
}
// 审批同意项目生产: system/projectProduction/approvedProjectProduction
export function approvedProjectProduction(data) {
  return request({
    url: '/system/projectProduction/approvedProjectProduction',
    method: 'post',
    data: data
  })
}
// 审批拒绝项目生产: system/projectProduction/rejectedProjectProduction
export function rejectedProjectProduction(data) {
  return request({
    url: '/system/projectProduction/rejectedProjectProduction',
    method: 'post',
    data: data
  })
}
// 撤回审批项目生产: system/projectProduction/withdrawApproved
export function withdrawApproved(data) {
  return request({
    url: '/system/projectProduction/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 取消项目生产: system/projectProduction/cancelledProjectProduction
export function cancelledProjectProduction(data) {
  return request({
    url: '/system/projectProduction/cancelledProjectProduction',
    method: 'post',
    data: data
  })
}
// 查询项目生产单据和上一次的修订对比: system/projectProduction/queryUpdateMsgProjectProduction
export function queryUpdateMsgProjectProduction(data) {
  return request({
    url: '/system/projectProduction/queryUpdateMsgProjectProduction',
    method: 'post',
    data: data
  })
}
