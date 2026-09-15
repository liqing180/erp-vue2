import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/ruoyi'

// GET /role/getById/{id} 根据id查询角色信息
export function getRoleInfoById(id) {
  return request({
    url: '/system/role/getById/' + praseStrEmpty(id),
    method: 'get'
  })
}

// GET /role/queryUserList 查询用户列表
export function queryUserList(id) {
  return request({
    url: '/system/role/queryUserList/',
    method: 'get'
  })
}

// GET /role/getUserAndResourceListByRoleId/{id} 查询用户和资源列表
export function getUserAndResourceListByRoleId(id) {
  return request({
    url: '/system/role/getUserAndResourceListByRoleId/' + praseStrEmpty(id),
    method: 'get'
  })
}

// POST /role/updateRole 修改角色
export function updateNewRole(data) {
  return request({
    url: 'system/roleNew/updateRole',
    method: 'post',
    data: data
  })
}

// POST /role/saveRole 新增角色
export function saveRole(data) {
  return request({
    url: 'system/roleNew/saveRole',
    method: 'post',
    data: data
  })
}

// POST /role/queryRoleList 查询角色列表
export function queryRoleList(data) {
  return request({
    url: 'system/roleNew/queryRoleList',
    method: 'post',
    data: data
  })
}

// POST /role/assignUserToRole 分配用户到角色
export function assignUserToRole(data) {
  return request({
    url: '/system/role/assignUserToRole',
    method: 'post',
    data: data
  })
}

// POST /role/assignResourceToRole 分配菜单资源到角色
export function assignResourceToRole(data) {
  return request({
    url: '/system/role/assignResourceToRole',
    method: 'post',
    data: data
  })
}

// POST /role/queryRoleTreeList 查询角色树列表
export function queryRoleTreeList(data) {
  return request({
    url: '/system/role/queryRoleTreeList',
    method: 'post',
    data: data
  })
}

// GET /role/queryOperatingUnitTreeList/{id} 查询业务实体树列表
export function queryOperatingUnitTreeList(id) {
  return request({
    url: '/system/role/queryOperatingUnitTreeList/' + praseStrEmpty(id),
    method: 'get'
  })
}

// POST /role/assignCorporateToRole 分配本公司到角色
export function assignCorporateToRole(data) {
  return request({
    url: '/system/role/assignCorporateToRole',
    method: 'post',
    data: data
  })
}

// POST /role/queryAllRoles 查询系统角色列表
export function queryAllRoles(data) {
  return request({
    url: '/system/role/queryAllRoles',
    method: 'post',
    data: data
  })
}

// GET /res/queryResourceTreeList 查询菜单资源树结构
export function queryResourceTreeList(data) {
  return request({
    url: '/system/menu/roleMenuTreeselect',
    method: 'post',
    data: data
  })
}

export function getRole(id) {
  return request({
    url: '/system/roleNew/queryRoleById/' + id,
    method: 'get'
  })
}

// 修改功能权限
export function updateRole(data) {
  return request({
    url: '/system/roleNew/updateRoleFunctionalPermissions',
    method: 'post',
    data: data
  })
}

// 指派用户列表
export function getCanSelectUser(data) {
  return request({
    url: '/system/roleNew/getCanSelectPost',
    method: 'post',
    data: data
  })
}

// 指派用户修改
export function updateRoleUserList(data) {
  return request({
    url: '/system/roleNew/updateRolePostList',
    method: 'post',
    data
  })
}

// 查询角色的数据权限类型信息
export function getRoleDataPermissionsType(id) {
  return request({
    url: '/system/dataPermissions/getRoleDataPermissionsType/' + id,
    method: 'get'
  })
}

// 查询已经拥有权限的Vendor列表
export function queryAlreadyHaveVendorListNoPage(data) {
  return request({
    url: '/system/dataPermissions/queryAlreadyHaveVendorListNoPage',
    method: 'post',
    data
  })
}

// 查询可以添加的Vendor列表
export function queryCanAddVendorList(data) {
  return request({
    url: '/system/dataPermissions/queryCanAddVendorList',
    method: 'post',
    data
  })
}

// 修改角色的Vendor数据权限类型
export function updateRoleDpTypeVendor(data) {
  return request({
    url: '/system/dataPermissions/updateRoleDpTypeVendor',
    method: 'post',
    data
  })
}

// 增加Vendor数据权限
export function addVendorDataPermissions(data) {
  return request({
    url: '/system/dataPermissions/addVendorDataPermissions',
    method: 'post',
    data
  })
}

// 删除Vendor数据权限
export function deleteVendorDataPermissions(data) {
  return request({
    url: '/system/dataPermissions/deleteVendorDataPermissions',
    method: 'post',
    data
  })
}

// 更新角色的仓库数据权限
export function updateRoleDpForWarehouse(data) {
  return request({
    url: '/system/dataPermissions/updateRoleDpForWarehouse',
    method: 'post',
    data
  })
}

// 查询角色的仓库数据权限
export function getRoleDpForWarehouse(data) {
  return request({
    url: '/system/dataPermissions/getRoleDpForWarehouse',
    method: 'post',
    data
  })
}

// 查询数据权限
export function getAccessPermissions(data) {
  return request({
    url: '/system/dataPermissions/getAccessPermissions',
    method: 'post',
    data
  })
}

// 更新数据权限
export function updateRoleAccessPermissions(data) {
  return request({
    url: '/system/dataPermissions/updateRoleAccessPermissions',
    method: 'post',
    data
  })
}

// 获取角色可以选择分配的用户列表: system/dataPermissions/getCanAssignUserList (POST, 参数:roleId)
export function getCanAssignUserList(data) {
  return request({
    url: '/system/dataPermissions/getCanAssignUserList',
    method: 'post',
    data
  })
}

// 查询可以添加的客户列表：system/dataPermissions/queryCanAddCustomerList
export function queryCanAddCustomerList(data) {
  return request({
    url: '/system/dataPermissions/queryCanAddCustomerList',
    method: 'post',
    data
  })
}
// 查询可以添加的付款条款列表：system/dataPermissions/queryCanAddPaymentTermList
export function queryCanAddPaymentTermList(data) {
  return request({
    url: '/system/dataPermissions/queryCanAddPaymentTermList',
    method: 'post',
    data
  })
}

// 查询法人下的分公司列表集合: system/dataPermissions/getBranchCompanyList
export function getBranchCompanyList() {
  return request({
    url: '/system/dataPermissions/getBranchCompanyList',
    method: 'get'
  })
}
