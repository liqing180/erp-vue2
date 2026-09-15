import request from '@/utils/request'

// 主列表查询
export function queryBomList(data) {
  return request({
    url: '/system/bom/queryBomList',
    method: 'post',
    data
  })
}

// 查询Bom成品可以选择的产品列表: system/bom/queryCanSelectProductListFromBomCombinationProduct (过滤: alreadyProductIdList)
export function queryCanSelectProductListFromBomCombinationProduct(data) {
  return request({
    url: '/system/bom/queryCanSelectProductListFromBomCombinationProduct',
    method: 'post',
    data
  })
}

// 查询Bom配件可以选择的产品列表: system/bom/queryCanSelectProductListFromBomAccessories (过滤: alreadyProductIdList)
export function queryCanSelectProductListFromBomAccessories(data) {
  return request({
    url: '/system/bom/queryCanSelectProductListFromBomAccessories',
    method: 'post',
    data
  })
}

// 查询Bom配件可以选择的服务列表: system/bom/queryCanSelectServiceListFromBomAccessories (过滤: alreadyProductIdList)
export function queryCanSelectServiceListFromBomAccessories(data) {
  return request({
    url: '/system/bom/queryCanSelectServiceListFromBomAccessories',
    method: 'post',
    data
  })
}

// 查询Bom配件可以选择的成品列表: system/bom/queryCanSelectAccessoriesList
export function queryCanSelectAccessoriesList(data) {
  return request({
    url: '/system/bom/queryCanSelectAccessoriesList',
    method: 'post',
    data
  })
}

// Bom保存草稿: system/bom/saveDraftBom
export function saveDraftBom(data) {
  return request({
    url: '/system/bom/saveDraftBom',
    method: 'post',
    data
  })
}

// Bom提交数据: system/bom/saveBom
export function saveBom(data) {
  return request({
    url: '/system/bom/saveBom',
    method: 'post',
    data
  })
}

// 查询具体Bom: system/bom/queryBomById (bomId)
export function queryBomById(data) {
  return request({
    url: '/system/bom/queryBomById',
    method: 'post',
    data
  })
}

// 查询BOM的历史版本下拉
export function queryBomHistoryVersion(data) {
  return request({
    url: '/system/bom/queryBomHistoryVersion',
    method: 'post',
    data
  })
}
// 审批同意BOM
export function approvedBom(data) {
  return request({
    url: '/system/bom/approvedBom',
    method: 'post',
    data
  })
}
// 审批拒绝BOM
export function rejectedBom(data) {
  return request({
    url: '/system/bom/rejectedBom',
    method: 'post',
    data
  })
}
// 撤回审批:
export function withdrawApproved(data) {
  return request({
    url: '/system/bom/withdrawApproved',
    method: 'post',
    data
  })
}
// ReviseBOM
export function reviseBom(data) {
  return request({
    url: '/system/bom/reviseBom',
    method: 'post',
    data
  })
}
