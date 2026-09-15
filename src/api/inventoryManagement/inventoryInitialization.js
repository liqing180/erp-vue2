import request from '@/utils/request'

// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/inventory/inventoryInitialization/withdrawApproved',
    method: 'post',
    data: data
  })
}

// 查询库存初始化列表:/inventory/inventoryInitialization/queryInventoryInitializationList
export function queryInventoryInitializationList(data) {
  return request({
    url: '/inventory/inventoryInitialization/queryInventoryInitializationList',
    method: 'post',
    data: data
  })
}

export function querySearchList(data) {
  return request({
    url: '/inventory/inventoryInitialization/querySearchList',
    method: 'post',
    data: data
  })
}

// 保存库存初始化:/inventory/inventoryInitialization/saveInventoryInitialization
export function saveInventoryInitialization(data) {
  return request({
    url: '/inventory/inventoryInitialization/saveInventoryInitialization',
    method: 'post',
    data: data
  })
}

// 保存库存初始化 草稿:
export function saveDraftInventoryInitialization(data) {
  return request({
    url: '/inventory/inventoryInitialization/saveDraftInventoryInitialization',
    method: 'post',
    data: data
  })
}

// 查询具体库存初始化:/inventory/inventoryInitialization/queryInventoryInitializationById (参数：inventoryInitializationId)
export function queryInventoryInitializationById(data) {
  return request({
    url: '/inventory/inventoryInitialization/queryInventoryInitializationById',
    method: 'post',
    data
  })
}

// 审批同意库存初始化
export function approvedInventoryInitialization(data) {
  return request({
    url: '/inventory/inventoryInitialization/approvedInventoryInitialization',
    method: 'post',
    data
  })
}
// 审批拒绝库存初始化:
export function rejectedInventoryInitialization(data) {
  return request({
    url: '/inventory/inventoryInitialization/rejectedInventoryInitialization',
    method: 'post',
    data
  })
}
// 取消库存初始化:
export function cancelledInventoryInitialization(data) {
  return request({
    url: '/inventory/inventoryInitialization/cancelledInventoryInitialization',
    method: 'post',
    data
  })
}

// 关闭按钮:/inventory/inventoryInitialization/closeInitialization
export function closeInitialization(data) {
  return request({
    url: '/inventory/inventoryInitialization/closeInitialization',
    method: 'post',
    data
  })
}
// 查询库存初始化可以选择的产品列表
export function queryProductListFromInventoryInitialization(data) {
  return request({
    url: '/system/product/queryProductListFromInventoryInitialization',
    method: 'post',
    data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/inventory/inventoryInitialization/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/inventory/inventoryInitialization/revisionDiff',
    method: 'post',
    data
  })
}
