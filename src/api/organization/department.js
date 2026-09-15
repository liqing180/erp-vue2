import request from '@/utils/request'

// 查询部门列表:
export function queryDepartmentList(data) {
  return request({
    url: '/system/department/queryDepartmentList',
    method: 'post',
    data: data
  })
}

// POST  查询上一级级联下拉
export function queryNowLegalEntityCascade(data) {
  return request({
    url: '/system/corporate/queryNowLegalEntityCascade',
    method: 'post',
    data: data
  })
}

// POST  创建部门:
export function saveDepartment(data) {
  return request({
    url: '/system/department/saveDepartment',
    method: 'post',
    data: data
  })
}

// POST  查询部门:
export function queryDepartmentById(data) {
  return request({
    url: '/system/department/queryDepartmentById',
    method: 'post',
    data: data
  })
}

// POST  修改部门:
export function updateDepartment(data) {
  return request({
    url: '/system/department/updateDepartment',
    method: 'post',
    data: data
  })
}

// POST  删除部门:
export function deleteDepartment(data) {
  return request({
    url: '/system/department/deleteDepartment',
    method: 'post',
    data: data
  })
}
