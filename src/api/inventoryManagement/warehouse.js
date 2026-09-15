import request from '@/utils/request'

// 仓库主列表功能
export function queryWarehouseList(data) {
  return request({
    url: '/inventory/warehouse/queryWarehouseList',
    method: 'post',
    data: data
  })
}

// 查询默认仓库: /inventory/warehouse/queryDefaultWarehouse (无需参数)
export function queryDefaultWarehouse(data) {
  return request({
    url: '/inventory/warehouse/queryDefaultWarehouse',
    method: 'post',
    data: data
  })
}

// 保存仓库: /inventory/warehouse/saveWarehouse (收货人Id: userId) 仓库地址单独对象: warehouseAddress
export function saveWarehouse(data) {
  return request({
    url: '/inventory/warehouse/saveWarehouse',
    method: 'post',
    data: data
  })
}

// 查询具体仓库: /inventory/warehouse/queryWarehouseById (POST请求, 参数: warehouseId)
export function queryWarehouseById(data) {
  return request({
    url: '/inventory/warehouse/queryWarehouseById',
    method: 'post',
    data: data
  })
}

// 修改仓库: /inventory/warehouse/updateWarehouse
export function updateWarehouse(data) {
  return request({
    url: '/inventory/warehouse/updateWarehouse',
    method: 'post',
    data: data
  })
}

// 查询可以选择的仓库列表
export function queryCanSelectWarehouseListHaveDataPermissions(data) {
  return request({
    url: '/inventory/warehouse/queryCanSelectWarehouseListHaveDataPermissions',
    method: 'post',
    data: data
  })
}

// 获取法人下的全部的区域的搅拌站信息: system/zone/getAllPlantList
export function getAllPlantList() {
  return request({
    url: '/system/zone/getAllPlantList',
    method: 'get'
  })
}
