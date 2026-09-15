import request from '@/utils/request'
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/sales/projectTask/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询: /sales/projectTask/querySearchList
export function querySearchList(data) {
  return request({
    url: '/sales/projectTask/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询 项目任务 列表: /sales/projectTask/queryProjectTaskList
export function queryProjectTaskList(data) {
  return request({
    url: '/sales/projectTask/queryProjectTaskList',
    method: 'post',
    data: data
  })
}

// 查询具体 项目任务: /sales/projectTask/queryProjectTaskById
export function queryProjectTaskById(data) {
  return request({
    url: '/sales/projectTask/queryProjectTaskById',
    method: 'post',
    data: data
  })
}

// 产品: /system/product/queryPRCanSelectProductList
export function queryPRCanSelectProductList(data) {
  return request({
    url: '/system/product/queryPRCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 保存草稿: /sales/projectTask/saveDraftProjectTask
export function saveDraftProjectTask(data) {
  return request({
    url: '/sales/projectTask/saveDraftProjectTask',
    method: 'post',
    data: data
  })
}

// 提交单据: /sales/projectTask/saveProjectTask
export function saveProjectTask(data) {
  return request({
    url: '/sales/projectTask/saveProjectTask',
    method: 'post',
    data: data
  })
}

// 查询项目任务的操作日志: /sales/projectTask/queryProjectTaskOperationLog
export function queryProjectTaskOperationLog(data) {
  return request({
    url: '/sales/projectTask/queryProjectTaskOperationLog',
    method: 'post',
    data: data
  })
}

// 查询项目任务单据和上一次的修订对比: /sales/projectTask/queryUpdateMsgProjectTask
export function queryUpdateMsgProjectTask(data) {
  return request({
    url: '/sales/projectTask/queryUpdateMsgProjectTask',
    method: 'post',
    data: data
  })
}

// 审批同意项目任务：/sales/projectTask/approvedProjectTask
export function approvedProjectTask(data) {
  return request({
    url: '/sales/projectTask/approvedProjectTask',
    method: 'post',
    data: data
  })
}

// 审批拒绝项目任务：/sales/projectTask/rejectedProjectTask
export function rejectedProjectTask(data) {
  return request({
    url: '/sales/projectTask/rejectedProjectTask',
    method: 'post',
    data: data
  })
}

// 查询可以选择的服务列表: system/product/queryCanSelectServiceList
export function queryCanSelectServiceList(data) {
  return request({
    url: '/system/product/queryCanSelectServiceList',
    method: 'post',
    data: data
  })
}

// 采购申请模块 查询可以选择的服务列表: system/product/queryCanSelectServiceListFromPurchaseRequisite
export function queryCanSelectServiceListFromPurchaseRequisite(data) {
  return request({
    url: '/system/product/queryCanSelectServiceListFromPurchaseRequisite',
    method: 'post',
    data: data
  })
}

// 服务订单模块 查询可以选择的服务列表: system/product/queryCanSelectServiceListFromServiceOrder
export function queryCanSelectServiceListFromServiceOrder(data) {
  return request({
    url: '/system/product/queryCanSelectServiceListFromServiceOrder',
    method: 'post',
    data: data
  })
}
