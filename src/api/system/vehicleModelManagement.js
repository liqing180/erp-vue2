import request from '@/utils/request'

// 查询车型列表: system/vehicleModel/queryVehicleModelList (powerTypeList, createdIdList, startDateCreatedTime, endDateCreatedTime
export function queryVehicleModelList(data) {
  return request({
    url: '/system/vehicleModel/queryVehicleModelList',
    method: 'post',
    data: data
  })
}

//  下拉搜索值查询: querySearchList
export function querySearchList(data) {
  return request({
    url: '/system/vehicleModel/querySearchList',
    method: 'post',
    data: data
  })
}

//   查询具体车型: system/vehicleModel/queryVehicleModelById (vehicleModelId
export function queryVehicleModelById(data) {
  return request({
    url: '/system/vehicleModel/queryVehicleModelById',
    method: 'post',
    data
  })
}
//   保存车型: system/vehicleModel/saveVehicleModel
export function saveVehicleModel(data) {
  return request({
    url: '/system/vehicleModel/saveVehicleModel',
    method: 'post',
    data: data
  })
}
//   修改车型: system/vehicleModel/updateVehicleModel
export function updateVehicleModel(data) {
  return request({
    url: '/system/vehicleModel/updateVehicleModel',
    method: 'post',
    data: data
  })
}

//   删除车型 deleteVehicleModel vehicleModelId
export function deleteVehicleModel(data) {
  return request({
    url: '/system/vehicleModel/deleteVehicleModel',
    method: 'post',
    data: data
  })
}
