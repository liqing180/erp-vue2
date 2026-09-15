import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/ruoyi'

// 查询用户列表
export function listUser(data) {
  return request({
    url: '/system/userNew/queryUserList',
    method: 'post',
    data: data
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/userNew/queryUserById/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 查询用户列表
export function queryDepartmentList(data) {
  return request({
    url: '/system/corporate/queryDepartmentList',
    method: 'post',
    data: data
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/userNew/saveUser',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/userNew/updateUser',
    method: 'post',
    data: data
  })
}
// 查询实体公司列表
export function queryUserOfLegalEntityList() {
  return request({
    url: '/system/userNew/queryUserOfLegalEntityList',
    method: 'get'
  })
}
// 刷新当前选中的实体公司 legalEntityId
export function refreshLegalEntity(data) {
  return request({
    url: '/system/userNew/refreshLegalEntity',
    method: 'post',
    data: data
  })
}

// 删除用户
export function deleteUser(userIds) {
  const data = {
    selectIdList: userIds
  }
  return request({
    url: '/system/userNew/deleteUser',
    method: 'post',
    data
  })
}

// 导出用户
export function exportUser(data) {
  return request({
    url: '/system/user/export',
    method: 'post',
    data: data
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    selectIdList: [userId],
    password
  }
  return request({
    url: '/system/userNew/resetPwd',
    method: 'post',
    data: data
  })
}
// 批量用户密码重置
export function resetPwdList(userIds, password) {
  const data = {
    selectIdList: userIds,
    password
  }
  return request({
    url: '/system/userNew/resetPwd',
    method: 'post',
    data: data
  })
}

// 批量用户修改 status
export function changeStatusList(userIds, status) {
  const data = {
    selectIdList: userIds,
    status
  }
  return request({
    url: '/system/userNew/changerUserStatus',
    method: 'post',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}

// 查询角色列表
export function queryUserRoleList(data) {
  return request({
    url: '/system/userNew/queryUserRoleList',
    method: 'post',
    data: data
  })
}

// 保存授权角色
export function updateUserRoleList(data) {
  return request({
    url: '/system/userNew/updateUserRoleList',
    method: 'post',
    data: data
  })
}

// 查询用户当前可以选择的部门列表
export function queryUserDepartment(data) {
  return request({
    url: '/system/userNew/queryUserDepartment',
    method: 'post',
    data: data
  })
}

// 查询申请人:
export function queryUsersNeedSameLegalEntity(data) {
  return request({
    url: '/system/userNew/queryUsersNeedSameLegalEntity',
    method: 'post',
    data: data
  })
}

// 重置用户密码: system/userNew/resetPassword (参数: selectIdList)
export function resetPassword(data) {
  return request({
    url: '/system/userNew/resetPassword',
    method: 'post',
    data: data
  })
}

// 查询法人所有单位数据: system/uom/querySystemAllUomList
export function querySystemAllUomList(data) {
  return request({
    url: '/system/uom/querySystemAllUomList',
    method: 'post',
    data: data
  })
}

// 获取用户可以分配的角色列表: system/roleNew/queryRoleListNoPage
export function queryRoleListNoPage(data) {
  return request({
    url: '/system/roleNew/queryRoleListNoPage',
    method: 'post',
    data: data
  })
}
