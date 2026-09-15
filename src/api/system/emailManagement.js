import request from '@/utils/request'

// POST /sysEmailTemplate/querySysEmailTemplateList 查询邮件模板列表
export function querySysEmailTemplateList(data) {
  return request({
    url: '/system/sysEmailTemplate/querySysEmailTemplateList',
    method: 'post',
    data: data
  })
}

// GET /sysEmailTemplate/queryUserTemplateFor 查询当前用户,当前业务实体,数据库中拥有的TemplateFor
export function queryUserTemplateFor(id) {
  return request({
    url: '/system/sysEmailTemplate/queryUserTemplateFor',
    method: 'get'
  })
}

// GET /sysEmailTemplate/queryAllTemplateFor 查询出所有的TemplateFor
export function queryAllTemplateFor(id) {
  return request({
    url: '/system/sysEmailTemplate/queryAllTemplateFor',
    method: 'get'
  })
}

// GET /sysEmailTemplate/queryUserCanCreateTemplateFor 查询当前用户可以创建的TemplateFor
export function queryUserCanCreateTemplateFor(id) {
  return request({
    url: '/system/sysEmailTemplate/queryUserCanCreateTemplateFor',
    method: 'get'
  })
}

// POST /sysEmailTemplate/saveSysEmailTemplate 保存新的模板信息
export function saveSysEmailTemplate(data) {
  return request({
    url: '/system/sysEmailTemplate/saveSysEmailTemplate',
    method: 'post',
    data: data
  })
}

// POST /sysEmailTemplate/updateSysEmailTemplate 修改模板信息
export function updateSysEmailTemplate(data) {
  return request({
    url: '/system/sysEmailTemplate/updateSysEmailTemplate',
    method: 'post',
    data: data
  })
}

// GET /sysEmailTemplate/checkTemplateForIsHaveDefault 判断当前的TemplateFor是否已经有默认仓库
export function checkTemplateForIsHaveDefault(id) {
  return request({
    url: '/system/sysEmailTemplate/checkTemplateForIsHaveDefault/' + id,
    method: 'get'
  })
}

// GET /sysEmailTemplate/getSysEmailTemplateById/{id} 根据主Id,查询对应的模板信息
export function getSysEmailTemplateById(id) {
  return request({
    url: '/system/sysEmailTemplate/getSysEmailTemplateById/' + id,
    method: 'get'
  })
}

// GET /sysEmailTemplate/getDefaultSysEmailTemplateVoByTemplateFor/{templateFor} 获取当前的 templateFor 数据库中默认的对应的默认的 SysEmailTemplateVo
export function getDefaultSysEmailTemplateVoByTemplateFor(id) {
  return request({
    url: '/system/sysEmailTemplate/getDefaultSysEmailTemplateVoByTemplateFor/' + id,
    method: 'get'
  })
}

// POST /sentEmailHistory/querySentEmailHistoryList 查询历史邮件记录. 根据业务实体&用户角色权限隔离
export function querySentEmailHistoryList(data) {
  return request({
    url: '/system/sentEmailHistory/querySentEmailHistoryList',
    method: 'post',
    data: data
  })
}

// GET /sentEmailHistory/getSentEmailHistoryById/{id} 根据主Id,查询对应的历史邮件信息
export function getSentEmailHistoryById(id) {
  return request({
    url: '/system/sentEmailHistory/getSentEmailHistoryById/' + id,
    method: 'get'
  })
}

// GET /sentEmailHistory/queryUserTemplateFor 查询当前用户,当前业务实体,数据库中拥有已经发送的的TemplateFor
export function queryHistoryUserTemplateFor(id) {
  return request({
    url: '/system/sentEmailHistory/queryUserTemplateFor',
    method: 'get'
  })
}

// POST /pendingSendEmail/queryPendingSendEmailList 查询等待发送的邮件. 根据业务实体&用户角色权限隔离
export function queryPendingSendEmailList(data) {
  return request({
    url: '/system/pendingSendEmail/queryPendingSendEmailList',
    method: 'post',
    data: data
  })
}

// POST /pendingSendEmail/sendEmail 确认发送邮件
export function sendEmail(data) {
  return request({
    url: '/system/pendingSendEmail/sendEmail',
    method: 'post',
    data: data
  })
}

export function switchEmailForToTemplateNo(params) {
  return request({
    url: '/system/pendingSendEmail/switchEmailForToTemplateNo',
    method: 'get',
    params: params
  })
}

// GET /pendingSendEmail/queryUserTemplateFor 查询当前用户,当前业务实体,数据库中拥有等待发送的的TemplateFor
export function queryPendingSendUserTemplateFor(id) {
  return request({
    url: '/system/pendingSendEmail/queryUserTemplateFor',
    method: 'get'
  })
}

// GET /pendingSendEmail/getPendingSendEmailById/{id} 根据主Id,查询对应的待发送邮件信息
export function getPendingSendEmailById(id) {
  return request({
    url: '/system/pendingSendEmail/getPendingSendEmailById/' + id,
    method: 'get'
  })
}

// GET /pendingSendEmail/getTemplateNoByTemplateFor/{templateFor} 根据邮件当前类型,当前的业务实体Id. 查询其他同类型同业务实体的数据的No号
export function getTemplateNoByTemplateFor(id) {
  return request({
    url: '/system/pendingSendEmail/getTemplateNoByTemplateFor/' + id,
    method: 'get'
  })
}

// GET /sysEmailTemplate/querySysEmailTemplateVariableByTemplateFor/{templateFor} 获取当前的 templateFor 数据库中对应的所拥变量数据
export function querySysEmailTemplateVariableByTemplateFor(id) {
  return request({
    url: '/system/sysEmailTemplate/querySysEmailTemplateVariableByTemplateFor/' + id,
    method: 'get'
  })
}
