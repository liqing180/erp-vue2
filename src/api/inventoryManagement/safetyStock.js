import request from '@/utils/request'

// 查询安全库存列表
export function querySafetyStockList(data) {
  return request({
    url: '/inventory/safetyStock/querySafetyStockList',
    method: 'post',
    data: data
  })
}
export function querySearchList(data) {
  return request({
    url: '/inventory/safetyStock/querySearchList',
    method: 'post',
    data: data
  })
}

// 添加安全库存
export function saveSafetyStock(data) {
  return request({
    url: '/inventory/safetyStock/save',
    method: 'post',
    data: data
  })
}
// 修改安全库存
export function updateSafetyStock(data) {
  return request({
    url: '/inventory/safetyStock/updateSafetyStock',
    method: 'post',
    data: data
  })
}

// 查询具体安全仓库
export function querySafetyStockById(data) {
  return request({
    url: '/inventory/safetyStock/querySafetyStockById',
    method: 'post',
    data: data
  })
}

// 查询具体安全仓库
export function querySafetyStockCanSelectProductList(data) {
  return request({
    url: '/system/product/querySafetyStockCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 安全库存选品批量试算:
export function calculateProductBatch(data) {
  return request({
    url: '/inventory/safetyStock/calculateProductBatch',
    method: 'post',
    data: data
  })
}

// 安全库存单行试算:
export function calculateSingle(data) {
  return request({
    url: '/inventory/safetyStock/calculateSingle',
    method: 'post',
    data: data
  })
}

// 安全库存重算MRP计划列表: safetyStockId
export function calculateMrpPlanList(data) {
  return request({
    url: '/inventory/safetyStock/calculateMrpPlanList',
    method: 'post',
    data: data
  })
}

// 基于MRP创建PR: (mrpPlanId, safetyStockId)
export function mrpCreatePR(data) {
  return request({
    url: '/inventory/safetyStock/mrpCreatePR',
    method: 'post',
    data: data
  })
}
