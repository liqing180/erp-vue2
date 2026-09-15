import request from '@/utils/request'

// 获取强度等级下拉
export function queryCanSelectStrengthClass(data) {
  return request({
    url: '/system/mixDesign/queryCanSelectStrengthClass',
    method: 'post',
    data
  })
}

// 获取卸料公式下拉列表接口
export function queryDischargeFormulaSearchList(data) {
  return request({
    url: '/system/mixDesign/queryDischargeFormulaSearchList',
    method: 'post',
    data
  })
}
// 查询配方可以添加的材料列表
export function queryMixDesignCanAddMaterialList(data) {
  return request({
    url: '/system/mixDesign/queryMixDesignCanAddMaterialList',
    method: 'post',
    data
  })
}

// 新增配合比
export function saveMixDesign(data) {
  return request({
    url: '/system/mixDesign/saveMixDesign',
    method: 'post',
    data
  })
}

// 修改配合比
export function updateMixDesign(data) {
  return request({
    url: '/system/mixDesign/updateMixDesign',
    method: 'post',
    data
  })
}

// 配合比单据查询
export function queryMixDesignById(data) {
  return request({
    url: '/system/mixDesign/queryMixDesignById',
    method: 'post',
    data
  })
}

// 主页面查询
export function queryMixDesignList(data) {
  return request({
    url: '/system/mixDesign/queryMixDesignList',
    method: 'post',
    data: data
  })
}
export function querySearchList(data) {
  return request({
    url: '/system/mixDesign/querySearchList',
    method: 'post',
    data: data
  })
}

/* 撤回 */
export function withdrawMixDesign(data) {
  return request({
    url: '/system/mixDesign/withdrawMixDesign',
    method: 'post',
    data: data
  })
}
/* 更新 */
export function updateUnitCost(data) {
  return request({
    url: '/system/mixDesign/updateUnitCost',
    method: 'post',
    data: data
  })
}

// 添加变体后增加变体详情的信息:
/* export function addVariationMsgFromMixDesign(data) {
  return request({
    url: '/system/mixDesign/addVariationMsgFromMixDesign',
    method: 'post',
    data: data
  })
} */
// 重新报价:(mixDesignId ，variationMaterialIdList)
export function reQuote(data) {
  return request({
    url: '/system/mixDesign/reQuote',
    method: 'post',
    data: data
  })
}

// 报价中修改变体：
export function modifyVariationInTheQuotation(data) {
  return request({
    url: '/system/mixDesign/modifyVariationInTheQuotation',
    method: 'post',
    data: data
  })
}

// 查询配合比已有的生产线列表: (mixDesignId)
export function queryMixDesignProductionLineList(data) {
  return request({
    url: '/system/mixDesign/queryMixDesignProductionLineList',
    method: 'post',
    data: data
  })
}

// 查询配合比可以添加的生产线列表: (zoneId)
export function queryMixDesignCanAddProductionLineList(data) {
  return request({
    url: '/system/mixDesign/queryMixDesignCanAddProductionLineList',
    method: 'post',
    data: data
  })
}
// 增加生产线到配合比: (productionLineIdList, mixDesignIdList)
export function addProductionLineToMixDesign(data) {
  return request({
    url: '/system/mixDesign/addProductionLineToMixDesign',
    method: 'post',
    data: data
  })
}
// 从配合比移除生产线: (productionLineIdList, mixDesignId)
export function deleteMixDesignProductionLine(data) {
  return request({
    url: '/system/mixDesign/deleteMixDesignProductionLine',
    method: 'post',
    data: data
  })
}
// 变体PDF预览
export function preview(data) {
  return request({
    url: '/system/mixDesign/preview',
    method: 'post',
    data: data
  })
}
