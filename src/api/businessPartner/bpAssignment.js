import request from '@/utils/request'
// BP指派管理,各个页签数据数量查询
export function queryCountList(data) {
  return request({
    url: '/system/bpAssignment/queryCountList',
    method: 'post',
    data: data
  })
}
// BP指派管理,下拉搜索值查询
export function queryUnAssignmentSearchList(data) {
  return request({
    url: '/system/bpAssignment/queryUnAssignmentSearchList',
    method: 'post',
    data: data
  })
}
// BP指派管理,已分配页签 下拉搜索值查询
export function queryAssignmentSearchList(data) {
  return request({
    url: '/system/bpAssignment/queryAssignmentSearchList',
    method: 'post',
    data: data
  })
}
// BP指派管理,查询未分配列表 参数类型: businessPartnerType（0 Customer，1 Vendor 供应商）
export function queryUnAssignmentList(data) {
  return request({
    url: '/system/bpAssignment/queryUnAssignmentList',
    method: 'post',
    data: data
  })
}
// BP指派管理,查询已分配列表 参数类型:
export function queryAssignmentList(data) {
  return request({
    url: '/system/bpAssignment/queryAssignmentList',
    method: 'post',
    data: data
  })
}
// BP指派管理,查询本公司列表
export function queryCorporateList(data) {
  return request({
    url: '/system/bpAssignment/queryCorporateList',
    method: 'post',
    data: data
  })
}
// 编辑，查询BP对应的本公司列表
export function queryCorporateListByBpId(data) {
  return request({
    url: '/system/bpAssignment/queryCorporateListByBpId',
    method: 'post',
    data: data
  })
}

// BP指派管理,保存指派:/system/bpAssignment/saveAssignment
export function saveAssignment(data) {
  return request({
    url: '/system/bpAssignment/saveAssignment',
    method: 'post',
    data: data
  })
}
// BP指派管理,修改指派:/system/bpAssignment/updateAssignment
export function updateAssignment(data) {
  return request({
    url: '/system/bpAssignment/updateAssignment',
    method: 'post',
    data: data
  })
}

// 导入
export function importData(data) {
  return request({
    url: '/system/bpAssignment/importData?updateSupport=0',
    method: 'post',
    data: data.formData
  })
}

// 查询具体BP指派
export function queryAssignmentById(id) {
  return request({
    url: '/system/bpAssignment/queryAssignmentById/' + id,
    method: 'get'
  })
}
