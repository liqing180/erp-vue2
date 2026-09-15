import request from '@/utils/request'

// 查询初始化试拌申请
export function queryInitRequestTrial(data) {
  return request({
    url: '/sales/requestTrial/queryInitRequestTrial',
    method: 'post',
    data: data
  })
}
// 保存
export function saveRequestTrial(data) {
  return request({
    url: '/sales/requestTrial/saveRequestTrial',
    method: 'post',
    data: data
  })
}
// by id 接口
export function queryRequestTrialById(data) {
  return request({
    url: '/sales/requestTrial/queryRequestTrialById',
    method: 'post',
    data: data
  })
}
// 审批同意
export function approvedRequestTrial(data) {
  return request({
    url: '/sales/requestTrial/approvedRequestTrial',
    method: 'post',
    data: data
  })
}
// 审批拒绝
export function rejectedRequestTrial(data) {
  return request({
    url: '/sales/requestTrial/rejectedRequestTrial',
    method: 'post',
    data: data
  })
}
// 撤回重新修改
export function withdrawApprovedRequestTrial(data) {
  return request({
    url: '/sales/requestTrial/withdrawApproved',
    method: 'post',
    data: data
  })
}
