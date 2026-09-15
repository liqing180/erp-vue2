import request from '@/utils/request'

// 下拉搜索值查询
export function querySearchListSales(data) {
  return request({
    url: '/system/productExpansionSales/querySearchList',
    method: 'post',
    data
  })
}
// 查询销售扩展产品关系列表:
export function queryProductExpansionSalesList(data) {
  return request({
    url: '/system/productExpansionSales/queryProductExpansionSalesList',
    method: 'post',
    data
  })
}
// 根据id查询销售扩展信息
// /productCategory/queryProductCategoryById 获取产品分类信息
export function getByIdSales(id) {
  return request({
    url: '/system/productExpansionSales/getById/' + id,
    method: 'get'
  })
}
// 根据ids查询销售扩展信息
export function batchQueryProductExpansionSales(data) {
  return request({
    url: '/system/productExpansionSales/batchQueryProductExpansionSales',
    method: 'post',
    data
  })
}

// 添加销售扩展信息
export function saveSales(data) {
  return request({
    url: '/system/productExpansionSales/save',
    method: 'post',
    data
  })
}
// 修改销售扩展信息
export function updateSales(data) {
  return request({
    url: '/system/productExpansionSales/update',
    method: 'post',
    data
  })
}
// 修改销售扩展信息状态
export function updateActiveSales(data) {
  return request({
    url: '/system/productExpansionSales/updateActive',
    method: 'post',
    data
  })
}

// 根据产品ID查询销售编号集合
export function querySalesPartNoByProductId(data) {
  return request({
    url: '/system/productExpansionSales/querySalesPartNoByProductId',
    method: 'post',
    data
  })
}
/* 导入模板下载：/system/productExpansionSales/importTemplate
模板Excel导入正确性验证：/system/productExpansionSales/checkImportData
数据导入：/system/productExpansionSales/importData */

// 下拉搜索值查询:
export function querySearchListPurchase(data) {
  return request({
    url: '/system/productExpansionPurchase/querySearchList',
    method: 'post',
    data
  })
}
// 查询采购扩展产品关系列表
export function queryProductExpansionPurchaseList(data) {
  return request({
    url: '/system/productExpansionPurchase/queryProductExpansionPurchaseList',
    method: 'post',
    data
  })
}
// 根据id查询采购扩展信息
export function getByIdPurchase(id) {
  return request({
    url: '/system/productExpansionPurchase/getById/' + id,
    method: 'get'
  })
}
// 添加采购扩展信息
export function savePurchase(data) {
  return request({
    url: '/system/productExpansionPurchase/save',
    method: 'post',
    data
  })
}
// 修改采购扩展信息
export function updatePurchase(data) {
  return request({
    url: '/system/productExpansionPurchase/update',
    method: 'post',
    data
  })
}
// 修改采购扩展信息状态
export function updateActivePurchase(data) {
  return request({
    url: '/system/productExpansionPurchase/updateActive',
    method: 'post',
    data
  })
}

export function querySalesCanSelectProductList(data) {
  return request({
    url: '/system/product/querySalesCanSelectProductList',
    method: 'post',
    data
  })
}
// 导入模板下载：/system/productExpansionPurchase/importTemplate
// 模板Excel导入正确性验证：/system/productExpansionPurchase/checkImportData
// 数据导入：/system/productExpansionPurchase/importData
