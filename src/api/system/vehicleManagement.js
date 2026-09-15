import request from '@/utils/request'

// 查询车辆列表: system/vehicle/queryVehicleList (powerTypeList, createdIdList, startDateCreatedTime, endDateCreatedTime
export function queryVehicleList(data) {
  return request({
    url: '/system/vehicle/queryVehicleList',
    method: 'post',
    data: data
  })
}

//  下拉搜索值查询: querySearchList
export function querySearchList(data) {
  return request({
    url: '/system/vehicle/querySearchList',
    method: 'post',
    data: data
  })
}

//   查询具体车辆: system/vehicle/queryVehicleById (vehicleId
export function queryVehicleById(data) {
  return request({
    url: '/system/vehicle/queryVehicleById',
    method: 'post',
    data
  })
}
//   保存车辆: system/vehicle/saveVehicle
export function saveVehicle(data) {
  return request({
    url: '/system/vehicle/saveVehicle',
    method: 'post',
    data: data
  })
}
//   修改车辆: system/vehicle/updateVehicle
export function updateVehicle(data) {
  return request({
    url: '/system/vehicle/updateVehicle',
    method: 'post',
    data: data
  })
}

//   删除车辆 deleteVehicle vehicleId
export function deleteVehicle(data) {
  return request({
    url: '/system/vehicle/deleteVehicle',
    method: 'post',
    data: data
  })
}

// 查询可以选择的车型: system/vehicleModel/queryCanSelectVehicleModelList
export function queryCanSelectVehicleModelList(data) {
  return request({
    url: '/system/vehicleModel/queryCanSelectVehicleModelList',
    method: 'post',
    data: data
  })
}
