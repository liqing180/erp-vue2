import request from '@/utils/request'

// 下拉搜索值查询: system/productExtended/querySearchList
export function querySearchList(data) {
  return request({
    url: '/system/productExtended/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询产品扩展列表: system/productExtended/queryProductExtendedList
export function queryProductExtendedList(data) {
  return request({
    url: '/system/productExtended/queryProductExtendedList',
    method: 'post',
    data: data
  })
}

// 查询产品扩展: system/productExtended/queryProductExtended
export function queryProductExtended(data) {
  return request({
    url: '/system/productExtended/queryProductExtended',
    method: 'post',
    data: data
  })
}

// 查询法人列表(扩展组织): system/corporate/queryLegalEntityList
export function queryLegalEntityList(data) {
  return request({
    url: '/system/corporate/queryLegalEntityList',
    method: 'post',
    data: data
  })
}

// 保存产品扩展草稿: system/productExtended/saveDraftProductExtended
export function saveDraftProductExtended(data) {
  return request({
    url: '/system/productExtended/saveDraftProductExtended',
    method: 'post',
    data: data
  })
}

// 提交产品扩展: system/productExtended/saveProductExtended
export function saveProductExtended(data) {
  return request({
    url: '/system/productExtended/saveProductExtended',
    method: 'post',
    data: data
  })
}

// 查询扩展可以选择的产品列表: system/productExtended/queryExtendedCanSelectProductList(legalEntityIdList)
export function queryExtendedCanSelectProductList(data) {
  return request({
    url: '/system/productExtended/queryExtendedCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 查询扩展可以选择的产品列表不分页: system/productExtended/queryExtendedCanSelectProductListNoPage(legalEntityIdList)
export function queryExtendedCanSelectProductListNoPage(data) {
  return request({
    url: '/system/productExtended/queryExtendedCanSelectProductListNoPage',
    method: 'post',
    data: data
  })
}

// 查询法人对应产品的单位信息: system/productExtended/queryLegalEntityProductUomList (productMainId, legalEntityIdList)
export function queryLegalEntityProductUomList(data) {
  return request({
    url: '/system/productExtended/queryLegalEntityProductUomList',
    method: 'post',
    data: data
  })
}

// 获取异常错误行: system/productExtended/queryErrorProductExtendedList (legalEntityIds, productExtendedList)
export function queryErrorProductExtendedList(data) {
  return request({
    url: '/system/productExtended/addOtherMsg',
    method: 'post',
    data: data
  })
}

// 批量新增产品扩展: system/productExtended/batchSubmitProductExtended (legalEntityIds, productExtendedList)
export function batchSubmitProductExtended(data) {
  return request({
    url: '/system/productExtended/batchSubmitProductExtended',
    method: 'post',
    data: data
  })
}

// 批量修改是否活跃
export function batchUpdateIsActive(ids, isActive) {
  const data = {
    productMainIdList: ids,
    isActive
  }
  return request({
    url: '/system/productExtended/batchUpdateIsActive',
    method: 'post',
    data: data
  })
}
