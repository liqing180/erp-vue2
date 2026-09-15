import request from '@/utils/request'

// 主页查询接口
export function queryUomList(data) {
  return request({
    url: '/system/uom/queryUomList',
    method: 'post',
    data: data
  })
}

// 新增数据
export function addUom(data) {
  return request({
    url: '/system/uom/addUom',
    method: 'post',
    data: data
  })
}

// 修改数据
export function updateUom(data) {
  return request({
    url: '/system/uom/updateUom',
    method: 'post',
    data: data
  })
}

// 删除数据
export function delUom(data) {
  return request({
    url: '/system/uom/delUom',
    method: 'post',
    data: data
  })
}
// 导出数据
export function exportUom(data) {
  return request({
    url: '/system/uom/exportUom',
    method: 'post',
    data: data
  })
}

// GET 根据id查询UOM
export function queryUomById(id) {
  return request({
    url: '/system/uom/queryUomById/' + id,
    method: 'get'
  })
}

// system/uom/queryAllUomList
export function queryAllUomList(params) {
  return request({
    url: '/system/uom/queryAllUomList',
    method: 'get',
    params
  })
}
// system/uom/queryVolumeUomList
export function queryVolumeUomList() {
  return request({
    url: '/system/uom/queryVolumeUomList',
    method: 'get'
  })
}
// system/uom/queryWeightUomList
export function queryWeightUomList() {
  return request({
    url: '/system/uom/queryWeightUomList',
    method: 'get'
  })
}
// system/uom/queryLengthUomList
export function queryLengthUomList() {
  return request({
    url: '/system/uom/queryLengthUomList',
    method: 'get'
  })
}

// 查询英文的所有单位数据: system/uom/queryEnglishAllUomList
export function queryEnglishAllUomList(data) {
  return request({
    url: '/system/uom/queryEnglishAllUomList',
    method: 'post',
    data: data
  })
}

// /system/uom/queryAllUomListByLocalization
export function queryAllUomListByLocalization(data) {
  return request({
    url: '/system/uom/queryAllUomListByLocalization',
    method: 'post',
    data: data
  })
}
