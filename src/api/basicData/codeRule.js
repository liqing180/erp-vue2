import request from '@/utils/request'
// 新增
export function saveCodeRule(data) {
  return request({
    url: '/mdm/codeRule/saveCodeRule',
    method: 'post',
    data: data
  })
}
// 查询主列表
export function queryCodeRuleList(data) {
  return request({
    url: '/mdm/codeRule/queryCodeRuleList',
    method: 'post',
    data: data
  })
}
// 查询 ByID
export function queryCodeRuleById(ruleCodeId) {
  return request({
    url: '/mdm/codeRule/queryCodeRuleById/' + ruleCodeId,
    method: 'get'
  })
}

// 修改
export function updateCodeRule(data) {
  return request({
    url: '/mdm/codeRule/updateCodeRule',
    method: 'post',
    data: data
  })
}

// 删除 mdm/codeRule/{deleteIds}
export function delCodeRule(codeRuleIds) {
  return request({
    url: '/mdm/codeRule/' + codeRuleIds,
    method: 'delete'
  })
}

// 导出
export function exportCodeRule(query) {
  return request({
    url: '/mdm/codeRule/export',
    method: 'get',
    params: query
  })
}

// 下载橘色导入模板
export function importTemplate() {
  return request({
    url: '/mdm/codeRule/importTemplate',
    method: 'get'
  })
}
