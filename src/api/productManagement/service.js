import request from '@/utils/request'

// 获取集团默认货币信息:
export function queryBusinessGroupCurrency() {
  return request({
    url: '/system/corporate/queryBusinessGroupCurrency',
    method: 'get'
  })
}
// 查询服务列表:
export function queryServiceList(data) {
  return request({
    url: '/system/service/queryServiceList',
    method: 'post',
    data
  })
}

// 查询服务的历史版本下拉
export function queryServiceHistoryVersion(data) {
  return request({
    url: '/system/service/queryServiceHistoryVersion',
    method: 'post',
    data
  })
}
// 查询具体服务
export function queryServiceById(data) {
  return request({
    url: '/system/service/queryServiceById',
    method: 'post',
    data
  })
}
// 保存草稿:
export function saveDraftService(data) {
  return request({
    url: '/system/service/saveDraftService',
    method: 'post',
    data
  })
}
// 提交服务
export function saveService(data) {
  return request({
    url: '/system/service/saveService',
    method: 'post',
    data
  })
}
// 审批同意服务
export function approvedService(data) {
  return request({
    url: '/system/service/approvedService',
    method: 'post',
    data
  })
}
// 审批拒绝服务
export function rejectedService(data) {
  return request({
    url: '/system/service/rejectedService',
    method: 'post',
    data
  })
}

// 批量修改服务是否活跃
export function changeServiceIsActive(data) {
  return request({
    url: '/system/service/changeServiceIsActive',
    method: 'post',
    data
  })
}
// Revise服务
export function reviseService(data) {
  return request({
    url: '/system/service/reviseService',
    method: 'post',
    data
  })
}

// 查询单据和上一次的修订对比
export function queryUpdateMsgService(data) {
  return request({
    url: '/system/service/queryUpdateMsgService',
    method: 'post',
    data
  })
}
