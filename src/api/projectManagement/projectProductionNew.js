import request from '@/utils/request'

// 下拉搜索值查询: system/projectProduction/v2/querySearchList
export function querySearchList(data) {
  return request({
    url: '/system/projectProduction/v2/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询项目生产(新)列表: system/projectProduction/v2/queryProjectProductionList
export function queryProjectProductionList(data) {
  return request({
    url: '/system/projectProduction/v2/queryProjectProductionList',
    method: 'post',
    data: data
  })
}
// 查询具体项目生产(新): system/projectProduction/v2/queryProjectProductionById
export function queryProjectProductionById(data) {
  return request({
    url: '/system/projectProduction/v2/queryProjectProductionById',
    method: 'post',
    data: data
  })
}
// 项目生产(新)保存草稿: system/projectProduction/v2/saveDraftProjectProduction (isCanSaveDraft)
export function saveDraftProjectProduction(data) {
  return request({
    url: '/system/projectProduction/v2/saveDraftProjectProduction',
    method: 'post',
    data: data
  })
}
// 项目生产(新)提交数据: system/projectProduction/v2/submitProjectProduction (isCanSubmit)
export function submitProjectProduction(data) {
  return request({
    url: '/system/projectProduction/v2/submitProjectProduction',
    method: 'post',
    data: data
  })
}
// 撤回项目生产(新): system/projectProduction/v2/withdrawProjectProduction (isCanWithdraw)
export function withdrawProjectProduction(data) {
  return request({
    url: '/system/projectProduction/v2/withdrawProjectProduction',
    method: 'post',
    data: data
  })
}
// 取消项目生产(新): system/projectProduction/v2/cancelledProjectProduction (isCanCancelled)
export function cancelledProjectProduction(data) {
  return request({
    url: '/system/projectProduction/v2/cancelledProjectProduction',
    method: 'post',
    data: data
  })
}

// 查询可以选择的产品列表
export function queryCanSelectProductList(data) {
  return request({
    // url: '/system/product/queryCanSelectProductList',
    url: '/system/product/queryCanSelectProductListFromProjectProduction',
    method: 'post',
    data: data
  })
}
