import request from '@/utils/request'

// 主列表查询
export function queryIssueList(data) {
  return request({
    url: '/system/issue/queryIssueList',
    method: 'post',
    data: data
  })
}
// 根据id查询文件信息
export function getById(id) {
  return request({
    url: '/system/issue/getById/' + id,
    method: 'get'
  })
}
// 新增问题:system/issue/saveIssue
export function saveIssue(data) {
  return request({
    url: '/system/issue/saveIssue',
    method: 'post',
    data: data
  })
}
// 修改问题:system/issue/updateIssue
export function updateIssue(data) {
  return request({
    url: '/system/issue/updateIssue',
    method: 'post',
    data: data
  })
}
// 问题处理:system/issue/actionIssue
export function actionIssue(data) {
  return request({
    url: '/system/issue/actionIssue',
    method: 'post',
    data: data
  })
}
