import request from '@/utils/request'

// 下拉搜索值: system/projectTemplate/querySearchList
export function querySearchList(data) {
  return request({
    url: '/system/projectTemplate/querySearchList',
    method: 'post',
    data: data
  })
}
// 主页面查询: system/projectTemplate/queryProjectTemplateList
export function queryProjectTemplateList(data) {
  return request({
    url: '/system/projectTemplate/queryProjectTemplateList',
    method: 'post',
    data: data
  })
}
// 查询可以选择的Bom列表: system/bom/queryCanSelectBomList
export function queryCanSelectBomList(data) {
  return request({
    url: '/system/bom/queryCanSelectBomList',
    method: 'post',
    data: data
  })
}
// 为Bom增加项目模板所需使用的信息: system/projectTemplate/addBomMsgFromProjectTemplate (bomIdList)
export function addBomMsgFromProjectTemplate(data) {
  return request({
    url: '/system/projectTemplate/addBomMsgFromProjectTemplate',
    method: 'post',
    data: data
  })
}
// 计算项目模板: system/projectTemplate/calculateProjectTemplate
export function calculateProjectTemplate(data) {
  return request({
    url: '/system/projectTemplate/calculateProjectTemplate',
    method: 'post',
    data: data
  })
}

// 查询具体项目模板: system/projectTemplate/queryProjectTemplateById (projectTemplateId)
export function queryProjectTemplateById(data) {
  return request({
    url: '/system/projectTemplate/queryProjectTemplateById',
    method: 'post',
    data: data
  })
}
// 项目模板保存草稿: system/projectTemplate/saveDraftProjectTemplate (权限标识isCanSaveDraft)
export function saveDraftProjectTemplate(data) {
  return request({
    url: '/system/projectTemplate/saveDraftProjectTemplate',
    method: 'post',
    data: data
  })
}
// 项目模板提交数据: system/projectTemplate/saveProjectTemplate (权限标识isCanUpdate)
export function saveProjectTemplate(data) {
  return request({
    url: '/system/projectTemplate/saveProjectTemplate',
    method: 'post',
    data: data
  })
}
// 撤回项目模板数据: system/projectTemplate/withdrawProjectTemplate (projectTemplateId, 权限标识isCanWithdraw)
export function withdrawProjectTemplate(data) {
  return request({
    url: '/system/projectTemplate/withdrawProjectTemplate',
    method: 'post',
    data: data
  })
}

// 重新报价: system/projectTemplate/reQuote (projectTemplateId, projectTemplateContentIdList)
export function reQuote(data) {
  return request({
    url: '/system/projectTemplate/reQuote',
    method: 'post',
    data: data
  })
}

// 更新成本: system/projectTemplate/updateUnitCost (projectTemplateId, 权限标识isCanUpdateUnitCost)
export function updateUnitCost(data) {
  return request({
    url: '/system/projectTemplate/updateUnitCost',
    method: 'post',
    data: data
  })
}

// 批量修改项目模板活跃状态: system/projectTemplate/batchUpdateIsActive(isActive, projectTemplateIdList)
export function batchUpdateIsActive(data) {
  return request({
    url: '/system/projectTemplate/batchUpdateIsActive',
    method: 'post',
    data: data
  })
}

// 预览PDF
export function preview(data) {
  return request({
    url: '/system/projectTemplate/preview',
    method: 'post',
    data: data
  })
}
