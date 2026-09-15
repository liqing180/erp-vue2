import request from '@/utils/request'
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/sales/materialList/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询: /sales/materialList/querySearchList
export function querySearchList(data) {
  return request({
    url: '/sales/materialList/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询 项目任务 列表: /sales/materialList/queryMaterialListList
export function queryMaterialListList(data) {
  return request({
    url: '/sales/materialList/queryMaterialListList',
    method: 'post',
    data: data
  })
}

// 查询具体 项目任务: /sales/materialList/queryMaterialListById
export function queryMaterialListById(data) {
  return request({
    url: '/sales/materialList/queryMaterialListById',
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

// 保存草稿: /sales/materialList/saveDraftMaterialList
export function saveDraftMaterialList(data) {
  return request({
    url: '/sales/materialList/saveDraftMaterialList',
    method: 'post',
    data: data
  })
}

// 提交单据: /sales/materialList/saveMaterialList
export function saveMaterialList(data) {
  return request({
    url: '/sales/materialList/saveMaterialList',
    method: 'post',
    data: data
  })
}

// 查询项目任务的操作日志: /sales/materialList/queryMaterialListOperationLog
export function queryMaterialListOperationLog(data) {
  return request({
    url: '/sales/materialList/queryMaterialListOperationLog',
    method: 'post',
    data: data
  })
}

// 查询项目任务单据和上一次的修订对比: /sales/materialList/queryUpdateMsgMaterialList
export function queryUpdateMsgMaterialList(data) {
  return request({
    url: '/sales/materialList/queryUpdateMsgMaterialList',
    method: 'post',
    data: data
  })
}

// 审批同意项目任务：/sales/materialList/approvedMaterialList
export function approvedMaterialList(data) {
  return request({
    url: '/sales/materialList/approvedMaterialList',
    method: 'post',
    data: data
  })
}

// 审批拒绝项目任务：/sales/materialList/rejectedMaterialList
export function rejectedMaterialList(data) {
  return request({
    url: '/sales/materialList/rejectedMaterialList',
    method: 'post',
    data: data
  })
}
