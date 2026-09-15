import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/ruoyi'

// 查询用户详细
export function getUser(id) {
  return request({
    url: '/system/user/' + praseStrEmpty(id),
    method: 'get'
  })
}
// POST /corporate/queryCorporateList 查询本公司列表
export function queryCorporateList(data) {
  return request({
    url: '/system/corporate/queryCorporateList',
    method: 'post',
    data: data
  })
}

// POST /corporate/saveBusinessGroup 添加集团组织
export function saveBusinessGroup(data) {
  return request({
    url: '/system/corporate/saveBusinessGroup',
    method: 'post',
    data: data
  })
}

// GET /corporate/queryBusinessGroupById/{id} 根据id查询集团组织
export function queryBusinessGroupById(id) {
  return request({
    url: '/system/corporate/queryBusinessGroupById/' + praseStrEmpty(id),
    method: 'get'
  })
}

// POST /corporate/updateBusinessGroup 修改集团组织
export function updateBusinessGroup(data) {
  return request({
    url: '/system/corporate/updateBusinessGroup',
    method: 'post',
    data: data
  })
}

// POST /corporate/queryBusinessGroupListByLegal 法人实体查询集团组织列表
export function queryBusinessGroupListByLegal(data) {
  return request({
    url: '/system/corporate/queryBusinessGroupListByLegal',
    method: 'post',
    data: data
  })
}

// POST /corporate/saveLegalEntity 添加法人实体
export function saveLegalEntity(data) {
  return request({
    url: '/system/corporate/saveLegalEntity',
    method: 'post',
    data: data
  })
}

// GET /corporate/queryLegalEntityById/{id} 根据id查询法人实体
export function queryLegalEntityById(id) {
  return request({
    url: '/system/corporate/queryLegalEntityById/' + praseStrEmpty(id),
    method: 'get'
  })
}

// POST /corporate/updateLegalEntity 修改法人实体
export function updateLegalEntity(data) {
  return request({
    url: '/system/corporate/updateLegalEntity',
    method: 'post',
    data: data
  })
}

// GET /corporate/queryLegalEntityListByOperating 业务实体查询法人实体列表
export function queryLegalEntityListByOperating(id) {
  return request({
    url: '/system/corporate/queryLegalEntityListByOperating',
    method: 'get'
  })
}

// POST /corporate/saveOperatingUnit 添加业务实体
export function saveOperatingUnit(data) {
  return request({
    url: '/system/corporate/saveOperatingUnit',
    method: 'post',
    data: data
  })
}

// GET /corporate/queryOperatingUnitById/{id} 根据id查询业务实体
export function queryOperatingUnitById(id) {
  return request({
    url: '/system/corporate/queryOperatingUnitById/' + praseStrEmpty(id),
    method: 'get'
  })
}

// POST /corporate/updateOperatingUnit 修改业务实体
export function updateOperatingUnit(data) {
  return request({
    url: '/system/corporate/updateOperatingUnit',
    method: 'post',
    data: data
  })
}

// GET /corporate/queryOperatingUnitListByInventory 库存组织查询业务实体列表
export function queryOperatingUnitListByInventory(id) {
  return request({
    url: '/system/corporate/queryOperatingUnitListByInventory',
    method: 'get'
  })
}

// POST /corporate/saveInventoryOrganization 添加库存组织
export function saveInventoryOrganization(data) {
  return request({
    url: '/system/corporate/saveInventoryOrganization',
    method: 'post',
    data: data
  })
}

// GET /corporate/queryInventoryOrganizationById/{id} 根据id查询库存组织
export function queryInventoryOrganizationById(id) {
  return request({
    url: '/system/corporate/queryInventoryOrganizationById/' + praseStrEmpty(id),
    method: 'get'
  })
}

// GET /corporate/queryCorporateSummary/{id} 查询公司统计图
export function queryCorporateSummary(id) {
  return request({
    url: '/system/corporate/queryCorporateSummary/' + praseStrEmpty(id),
    method: 'get'
  })
}

// POST /corporate/updateInventoryOrganization 修改库存组织
export function updateInventoryOrganization(data) {
  return request({
    url: '/system/corporate/updateInventoryOrganization',
    method: 'post',
    data: data
  })
}

// GET /sys/corporate/queryCurrentOperatingUnit 查询当前用户所在的业务实体
export function queryCurrentOperatingUnit(id) {
  return request({
    url: '/system/corporate/queryCurrentOperatingUnit',
    method: 'get'
  })
}

// POST /corporate/queryCurrentOperatingUnitCurrency 查询当前用户所在的业务实体货币列表
export function queryCurrentOperatingUnitCurrency(data) {
  return request({
    url: '/system/corporate/queryCurrentOperatingUnitCurrency',
    method: 'post',
    data: data
  })
}

// POST /corporate/queryInventoryOrganizationAddressList 查询库存组织的地址列表
export function queryInventoryOrganizationAddressList(data) {
  return request({
    url: '/system/corporate/queryInventoryOrganizationAddressList',
    method: 'post',
    data: data
  })
}

// POST /corporate/existsInventoryPurchaseOrganization 库存采购组织是否存在
export function existsInventoryPurchaseOrganization(data) {
  return request({
    url: '/system/corporate/existsInventoryPurchaseOrganization',
    method: 'post',
    data: data
  })
}

// POST /corporate/existsInventorySalesOrganization 库存销售组织是否存在
export function existsInventorySalesOrganization(data) {
  return request({
    url: '/system/corporate/existsInventorySalesOrganization',
    method: 'post',
    data: data
  })
}

// GET /corporate/queryBusinessGroupList 查询集团组织列表
export function queryBusinessGroupList(id) {
  return request({
    url: '/system/corporate/queryBusinessGroupList',
    method: 'get'
  })
}

// POST /corporate/queryUsers 查询PIC用户接口
export function queryUsers(data) {
  return request({
    url: '/system/userNew/queryUsers',
    method: 'post',
    data: data
  })
}
// POST /corporate/queryUsers 查询PIC用户接口-无分页
export function queryUsersNoPage(data) {
  return request({
    url: '/system/userNew/queryUsersNoPage',
    method: 'post',
    data: data
  })
}

// POST /corporate/queryUsersNeedSameLegalEntity 查询PIC用户接口
export function queryUsersNeedSameLegalEntity(data) {
  return request({
    url: '/system/userNew/queryUsersNeedSameLegalEntity',
    method: 'post',
    data: data
  })
}

// POST /corporate/saveDepartment 部门数据保存
export function saveDepartment(data) {
  return request({
    url: '/system/corporate/saveDepartment',
    method: 'post',
    data: data
  })
}

// POST /corporate/updateDepartment 部门数据修改
export function updateDepartment(data) {
  return request({
    url: '/system/corporate/updateDepartment',
    method: 'post',
    data: data
  })
}

// GET /corporate/queryDepartmentById 部门数据查询
export function queryDepartmentById(id) {
  return request({
    url: `/system/corporate/queryDepartmentById/${id}`,
    method: 'get'
  })
}

// POST /corporate/updateDepartment 查询可以添加的供应商分页弹窗
export function queryCanAddBPList(data) {
  return request({
    url: '/system/corporate/queryCanAddBPList',
    method: 'post',
    data: data
  })
}

// POST /dataPermissions/queryAlreadyHaveBPList 查询已经拥有权限的BP列表
export function queryAlreadyHaveBPList(data) {
  return request({
    url: '/system/dataPermissions/queryAlreadyHaveBPList',
    method: 'post',
    data: data
  })
}

// POST /dataPermissions/updateRoleDpTypeBp 修改角色的BP数据权限类型
export function updateRoleDpTypeBp(data) {
  return request({
    url: '/system/dataPermissions/updateRoleDpTypeBp',
    method: 'post',
    data: data
  })
}

// POST /dataPermissions/queryCurrencyList 货币列表
export function queryCurrencyList(data) {
  return request({
    url: '/system/country/queryCurrencyList',
    method: 'post',
    data: data
  })
}

// GET /system/post/queryAllSysPost 查询职位
export function queryAllSysPost() {
  return request({
    url: '/system/post/queryAllSysPost',
    method: 'get'
  })
}

// 添加分公司 : system/corporate/saveBranchCompany
export function saveBranchCompany(data) {
  return request({
    url: '/system/corporate/saveBranchCompany',
    method: 'post',
    data: data
  })
}

// 修改分公司 : system/corporate/updateBranchCompany
export function updateBranchCompany(data) {
  return request({
    url: '/system/corporate/updateBranchCompany',
    method: 'post',
    data: data
  })
}

// 根据id查询分公司 : system/corporate/queryBranchCompanyById/{id}
export function queryBranchCompanyById(id) {
  return request({
    url: `/system/corporate/queryBranchCompanyById/${id}`,
    method: 'get'
  })
}
// POST /corporate/queryUserList 查询部门下的用户列表
export function queryUserList(data) {
  return request({
    url: '/system/corporate/queryUserList',
    method: 'post',
    data: data
  })
}

// 删除部门 接口:
export function deleteDepartment(data) {
  return request({
    url: '/system/corporate/deleteDepartment',
    method: 'post',
    data: data
  })
}
// 产品信息 查询法人列表
export function queryLegalEntityList(data) {
  return request({
    url: '/system/corporate/queryLegalEntityList',
    method: 'post',
    data: data
  })
}
