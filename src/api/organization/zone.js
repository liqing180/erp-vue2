import request from '@/utils/request'

// 主页面查询:system/zone/queryZoneList
export function queryZoneList(data) {
  return request({
    url: 'system/zone/queryZoneList',
    method: 'post',
    data: data
  })
}

// 具体业务单据查询:system/zone/queryZoneById/{zoneId}
export function queryZoneById(id) {
  return request({
    url: '/system/zone/queryZoneById/' + id,
    method: 'get'
  })
}

// 新增数据:system/zone/saveZone
export function saveZone(data) {
  return request({
    url: 'system/zone/saveZone',
    method: 'post',
    data: data
  })
}

// 修改数据:system/zone/updateZone
export function updateZone(data) {
  return request({
    url: 'system/zone/updateZone',
    method: 'post',
    data: data
  })
}

// 获取法人下的全部的区域列表信息：/system/zone/getAllZoneList
export function getAllZoneList() {
  return request({
    url: 'system/zone/getAllZoneList',
    method: 'get'
  })
}

// 获取法人下的全部的区域列表信息：/system/zone/getAllZoneList
export function queryAllZoneListByLegalEntityId(data) {
  return request({
    url: 'system/zone/queryAllZoneListByLegalEntityId',
    method: 'post',
    data: data
  })
}
