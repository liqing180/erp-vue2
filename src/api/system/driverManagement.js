import request from '@/utils/request'

// 查询车辆列表: system/driver/queryDriverList (powerTypeList, createdIdList, startDateCreatedTime, endDateCreatedTime
export function queryDriverList(data) {
  return request({
    url: '/system/driver/queryDriverList',
    method: 'post',
    data: data
  })
}

//  下拉搜索值查询: querySearchList
export function querySearchList(data) {
  return request({
    url: '/system/driver/querySearchList',
    method: 'post',
    data: data
  })
}

//   查询具体车辆: system/driver/queryDriverById (driverId
export function queryDriverById(data) {
  return request({
    url: '/system/driver/queryDriverById',
    method: 'post',
    data
  })
}
//   保存车辆: system/driver/saveDriver
export function saveDriver(data) {
  return request({
    url: '/system/driver/saveDriver',
    method: 'post',
    data: data
  })
}
//   修改车辆: system/driver/updateDriver
export function updateDriver(data) {
  return request({
    url: '/system/driver/updateDriver',
    method: 'post',
    data: data
  })
}

//   删除车辆 deleteDriver driverId
export function deleteDriver(data) {
  return request({
    url: '/system/driver/deleteDriver',
    method: 'post',
    data: data
  })
}

// 用户列表: system/driver/queryCanSelectUserList
export function queryCanSelectUserList(data) {
  return request({
    url: '/system/driver/queryCanSelectUserList',
    method: 'post',
    data: data
  })
}
