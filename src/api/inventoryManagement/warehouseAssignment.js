import request from '@/utils/request'

// 查询仓库指派列表: /inventory/warehouseAssignment/queryAssignmentList
export function queryAssignmentList(data) {
  return request({
    url: '/inventory/warehouseAssignment/queryAssignmentList',
    method: 'post',
    data: data
  })
}

// 删除仓库指派信息:/inventory/warehouseAssignment/deleteAssignment
export function deleteAssignment(data) {
  return request({
    url: '/inventory/warehouseAssignment/deleteAssignment',
    method: 'post',
    data: data
  })
}

// 选择产品：/system/product/queryAssignmentCanSelectProductList
export function queryAssignmentCanSelectProductList(data) {
  return request({
    url: '/system/product/queryAssignmentCanSelectProductList',
    method: 'post',
    data: data
  })
}

// 查询活跃的仓库列表:/inventory/warehouse/queryActiveWarehouseList
export function queryActiveWarehouseList(data) {
  return request({
    url: '/inventory/warehouse/queryActiveWarehouseList',
    method: 'post',
    data: data
  })
}

// 指派仓库: /inventory/warehouseAssignment/save
export function save(data) {
  return request({
    url: '/inventory/warehouseAssignment/save',
    method: 'post',
    data: data
  })
}
// 根据仓库ID查询指派过的产品ID
export function queryAssignmentByWarehouseId(data) {
  return request({
    url: '/inventory/warehouseAssignment/queryAssignmentByWarehouseId',
    method: 'post',
    data: data
  })
}
