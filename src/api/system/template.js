import request from '@/utils/request'

// 查询权限模板列表
export function queryTemplateList(data) {
  return request({
    url: '/system/template/queryTemplateList',
    method: 'post',
    data: data
  })
}
// 查询权限模板详细
export function queryTemplateById(id) {
  return request({
    url: '/system/template/queryTemplateById/' + id,
    method: 'get'
  })
}

// 新增权限模板
export function saveTemplate(data) {
  return request({
    url: '/system/template/saveTemplate',
    method: 'post',
    data: data
  })
}

// 修改权限模板
export function updateTemplate(data) {
  return request({
    url: '/system/template/updateTemplate',
    method: 'post',
    data: data
  })
}

// 删除权限模板
export function delTemplate(id) {
  return request({
    url: '/system/template/' + id,
    method: 'delete'
  })
}

// 导出权限模板
export function exportTemplate(query) {
  return request({
    url: '/system/template/export',
    method: 'get',
    params: query
  })
}
