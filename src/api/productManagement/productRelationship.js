import request from '@/utils/request'

// 查询供应商
export function querySupplierList(data) {
  return request({
    url: '/system/productSheet/querySupplierList',
    method: 'post',
    data
  })
}
// 查询供应商-分页
export function querySupplierListForPage(data) {
  return request({
    url: '/system/productSheet/querySupplierListForPage',
    method: 'post',
    data
  })
}

// 主列表搜索条件
export function querySearchList(data) {
  return request({
    url: '/system/productSheet/querySearchList',
    method: 'post',
    data
  })
}

// 查询产品列表
export function queryPurchaseCanSelectProductServiceList(data) {
  return request({
    url: '/system/product/queryPurchaseCanSelectProductList',
    method: 'post',
    data
  })
}
/* 查询产品以配置过的信息 productId & businessPartnerId */
//
export function getProductSheetList(data) {
  return request({
    url: '/system/productSheet/getProductSheetList',
    method: 'post',
    data
  })
}

// 查询产品对应关系列表: productSheet/queryProductSheetList
export function queryProductSheetList(data) {
  return request({
    url: '/system/productSheet/queryProductSheetList',
    method: 'post',
    data
  })
}

// 根据id查询产品对应关系信息  productSheet/getById/{id}
export function getById(id) {
  return request({
    url: '/system/productSheet/getById/' + id,
    method: 'get'
  })
}

// 批量编辑:  (productIdList)
export function batchQueryProductSheet(data) {
  return request({
    url: '/system/productSheet/batchQueryProductSheet',
    method: 'post',
    data
  })
}

// 保存产品对应： productSheet/save
export function save(data) {
  return request({
    url: '/system/productSheet/save',
    method: 'post',
    data
  })
}

// 修改产品对应： productSheet/update
export function update(data) {
  return request({
    url: '/system/productSheet/update',
    method: 'post',
    data
  })
}

// 修改产品对应关系状态：productSheet/updateActive
export function updateActive(data) {
  return request({
    url: '/system/productSheet/updateActive',
    method: 'post',
    data
  })
}
