import request from '@/utils/request'
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/sales/projectCost/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询: /sales/projectCost/querySearchList
export function querySearchList(data) {
  return request({
    url: '/sales/projectCost/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询 项目任务 列表: /sales/projectCost/queryProjectCostList
export function queryProjectCostList(data) {
  return request({
    url: '/sales/projectCost/queryProjectCostList',
    method: 'post',
    data: data
  })
}

// 查询具体 项目任务: /sales/projectCost/queryProjectCostById
export function queryProjectCostById(data) {
  return request({
    url: '/sales/projectCost/queryProjectCostById',
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

// 保存草稿: /sales/projectCost/saveDraftProjectCost
export function saveDraftProjectCost(data) {
  return request({
    url: '/sales/projectCost/saveDraftProjectCost',
    method: 'post',
    data: data
  })
}

// 提交单据: /sales/projectCost/saveProjectCost
export function saveProjectCost(data) {
  return request({
    url: '/sales/projectCost/saveProjectCost',
    method: 'post',
    data: data
  })
}

// 查询项目任务的操作日志: /sales/projectCost/queryProjectCostOperationLog
export function queryProjectCostOperationLog(data) {
  return request({
    url: '/sales/projectCost/queryProjectCostOperationLog',
    method: 'post',
    data: data
  })
}

// 查询项目任务单据和上一次的修订对比: /sales/projectCost/queryUpdateMsgProjectCost
export function queryUpdateMsgProjectCost(data) {
  return request({
    url: '/sales/projectCost/queryUpdateMsgProjectCost',
    method: 'post',
    data: data
  })
}

// 审批同意项目任务：/sales/projectCost/approvedProjectCost
export function approvedProjectCost(data) {
  return request({
    url: '/sales/projectCost/approvedProjectCost',
    method: 'post',
    data: data
  })
}

// 审批拒绝项目任务：/sales/projectCost/rejectedProjectCost
export function rejectedProjectCost(data) {
  return request({
    url: '/sales/projectCost/rejectedProjectCost',
    method: 'post',
    data: data
  })
}
