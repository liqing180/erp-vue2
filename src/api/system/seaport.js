
import request from '@/utils/request'

// 下拉搜索值
export function querySearchList(data) {
  return request({
    url: '/system/worldSeaports/querySearchList',
    method: 'post',
    data: data
  })
}

// 主页面查询
export function queryWorldSeaportsList(data) {
  return request({
    url: '/system/worldSeaports/queryWorldSeaportsList',
    method: 'post',
    data: data
  })
}
// "新增
export function saveWorldSeaports(data) {
  return request({
    url: '/system/worldSeaports/saveWorldSeaports',
    method: 'post',
    data: data
  })
}
// 修改
export function updateWorldSeaports(data) {
  return request({
    url: '/system/worldSeaports/updateWorldSeaports',
    method: 'post',
    data: data
  })
}
// 查询:
export function queryWorldSeaportsById(data) {
  return request({
    url: '/system/worldSeaports/queryWorldSeaportsById',
    method: 'post',
    data: data
  })
}
