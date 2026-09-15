import request from '@/utils/request'

// 查询列表: system/codeRule/queryCodeRuleList
export function queryCodeRuleList(data) {
  return request({
    url: '/system/codeRule/queryCodeRuleList',
    method: 'post',
    data
  })
}
//  下拉搜索值查询: system/codeRule/querySearchList
export function querySearchList(data) {
  return request({
    url: '/system/codeRule/querySearchList',
    method: 'post',
    data: data
  })
}
// 获取创建时所需的额外信息: system/codeRule/queryOtherMsg
export function queryOtherMsg(data) {
  return request({
    url: '/system/codeRule/queryOtherMsg',
    method: 'post',
    data
  })
}
// 保存条码规则: system/codeRule/saveCodeRule
export function saveCodeRule(data) {
  return request({
    url: '/system/codeRule/saveCodeRule',
    method: 'post',
    data
  })
}
// 修改条码规则: system/codeRule/updateCodeRule
export function updateCodeRule(data) {
  return request({
    url: '/system/codeRule/updateCodeRule',
    method: 'post',
    data
  })
}
// 查询具体条码规则:  system/codeRule/queryCodeRuleById
export function queryCodeRuleById(data) {
  return request({
    url: '/system/codeRule/queryCodeRuleById',
    method: 'post',
    data
  })
}
