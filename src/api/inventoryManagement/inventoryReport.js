import request from '@/utils/request'

// 产品分类下拉： /system/productCategory/queryAllProductCategoryTreeList
export function queryAllProductCategoryTreeList(data) {
  return request({
    url: '/system/productCategory/queryAllProductCategoryTreeList',
    method: 'get'
  })
}

// 活跃仓库下拉: inventory/warehouse/queryActiveWarehouseList
export function queryActiveWarehouseList(data) {
  return request({
    url: '/inventory/warehouse/queryActiveWarehouseList',
    method: 'post',
    data: data
  })
}

// 产品列表主页面查询: inventory/warehouse/queryWarehouseProductList
export function queryWarehouseProductList(data) {
  return request({
    url: '/inventory/inventoryReport/queryWarehouseProductList',
    method: 'post',
    data: data
  })
}

// 批次查询: /inventory/inventoryReport/queryWarehouseBatchList
export function queryWarehouseBatchList(data) {
  return request({
    url: '/inventory/inventoryReport/queryWarehouseBatchList',
    method: 'post',
    data: data
  })
}

// 查询仓库产品的占用详情 参数: warehouseId, productId
export function queryWarehouseProductReservedDetails(data) {
  return request({
    url: '/inventory/inventoryReport/queryWarehouseProductReservedDetails',
    method: 'post',
    data: data
  })
}

// 调整仓库产品占用详情排序 参数: warehouseProductReservedList
export function updateWarehouseProductSort(data) {
  return request({
    url: '/inventory/inventoryReport/updateWarehouseProductSort',
    method: 'post',
    data: data
  })
}

// 查询在途 参数: warehouseId, productId
export function queryWarehouseProductInTransitDetails(data) {
  return request({
    url: '/inventory/inventoryReport/queryWarehouseProductInTransitDetails',
    method: 'post',
    data: data
  })
}

// 借货列表 inventory/inventoryReport/querySicQtyMsg: warehouseId, productId
export function querySicQtyMsg(data) {
  return request({
    url: '/inventory/inventoryReport/querySicQtyMsg',
    method: 'post',
    data: data
  })
}

// ERP库存报表:inventory/inventoryReport/queryLabelDetailList
export function queryLabelDetailList(data) {
  return request({
    url: '/inventory/inventoryReport/queryLabelDetailList',
    method: 'post',
    data: data
  })
}

// 查询仓库产品的锁定详情: /inventoryReport/queryWarehouseProductLockedDetails (warehouseId,productId)
export function queryWarehouseProductLockedDetails(data) {
  return request({
    url: '/inventory/inventoryReport/queryWarehouseProductLockedDetails',
    method: 'post',
    data: data
  })
}

// 解锁:  /inventoryReport/unlocked  (id)
export function unlocked(data) {
  return request({
    url: '/inventory/inventoryReport/unlocked',
    method: 'post',
    data: data
  })
}

// 查询仓库产品无成本项目的标签详情列表: (warehouseId,productId)
export function queryNoCostProjectLabelDetailList(data) {
  return request({
    url: '/inventory/inventoryReport/queryNoCostProjectLabelDetailList',
    method: 'post',
    data: data
  })
}

// 查询仓库产品的成本项目列表: (warehouseId,productId)
export function queryWarehouseProductCostProjectList(data) {
  return request({
    url: '/inventory/inventoryReport/queryWarehouseProductCostProjectList',
    method: 'post',
    data: data
  })
}

// 查询成本项目仓库产品的数量详情数据: (warehouseId,productId,costProjectIdList)
export function queryWarehouseProductCostProjectQtyDetails(data) {
  return request({
    url: '/inventory/inventoryReport/queryWarehouseProductCostProjectQtyDetails',
    method: 'post',
    data: data
  })
}
