import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    url: 'system/post/queryPostList',
    method: 'post',
    data: query
  })
}

// 查询岗位列表
export function queryPostTreeList(query) {
  return request({
    url: 'system/post/queryPostTreeList',
    method: 'post',
    data: query
  })
}

/* 查询职位下拉 */
export function queryPositionOptions() {
  return request({
    url: '/system/post/optionselect',
    method: 'get'
  })
}

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/system/post/queryPostById/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: 'system/post/savePost',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/system/post/updatePost',
    method: 'post',
    data: data
  })
}

// 删除岗位
export function delPost(postId) {
  return request({
    url: '/system/post/' + postId,
    method: 'delete'
  })
}

// 导出岗位
export function exportPost(query) {
  return request({
    url: '/system/post/export',
    method: 'get',
    params: query
  })
}

// 查询岗位可以选择的部门级联列表: system/post/queryPostCanSelectDepartment
export function queryPostCanSelectDepartment(data) {
  return request({
    url: '/system/post/queryPostCanSelectDepartment',
    method: 'post',
    data: data
  })
}

/* 查询职位下拉 */
export function queryDepartmentPost(id) {
  return request({
    url: '/system/post/queryDepartmentPost/' + id,
    method: 'get'
  })
}

// 查询职位架构图: system/post/queryPostFrameworkImage (POST)
export function queryPostFrameworkImage(data) {
  return request({
    url: '/system/post/queryPostFrameworkImage',
    method: 'post',
    data
  })
}

// 查询职位架构的用户列表: system/post/queryUserList (id, type)
export function queryUserList(data) {
  return request({
    url: '/system/post/queryUserList',
    method: 'post',
    data
  })
}
