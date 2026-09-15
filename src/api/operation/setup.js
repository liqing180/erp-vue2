import request from '@/utils/request'

// 查询所有设置列的模块列表
export function queryModuleDic(id) {
  return request({
    url: '/mdm/setupField/queryModuleDic/' + id,
    method: 'get'
  })
}
// 具体业务单据查询
export function querySetupFieldById(id) {
  return request({
    url: '/mdm/setupField/querySetupFieldById/' + id,
    method: 'get'
  })
}

// 具体业务单据查询 - 特殊返回文件信息
export function querySetupFieldFileById(id) {
  return request({
    url: '/mdm/setupField/querySetupFieldFileById/' + id,
    method: 'get'
  })
}

// 根据模块ID查询具体业务单据数据
export function querySetupFieldByModuleId(id) {
  return request({
    url: '/mdm/setupField/querySetupFieldByModuleId/' + id,
    method: 'get'
  })
}
// 主页面查询
export function querySetupFieldList(data) {
  return request({
    url: '/mdm/setupField/querySetupFieldList',
    method: 'post',
    data: data
  })
}
// 修改数据
export function updateSetupField(data) {
  return request({
    url: '/mdm/setupField/updateSetupField',
    method: 'post',
    data: data
  })
}

// 报表下拉数据
export function queryViewReportDict(data) {
  return request({
    url: '/mdm/reportGroup/queryViewReportDict',
    method: 'post',
    data: data
  })
}

// 报表管理-设置-报表文件夹列表
export function queryReportGroupList(data) {
  return request({
    url: '/mdm/reportGroup/queryReportGroupList',
    method: 'post',
    data: data
  })
}

// 报表管理-设置-新增报表文件夹
export function saveReportGroup(data) {
  return request({
    url: '/mdm/reportGroup/saveReportGroup',
    method: 'post',
    data: data
  })
}

// 报表管理-设置-查询报表文件夹
export function queryReportGroupById(id) {
  return request({
    url: '/mdm/reportGroup/queryReportGroupById/' + id,
    method: 'get'
  })
}

// 报表管理-设置-修改报表文件夹
export function updateReportGroup(data) {
  return request({
    url: '/mdm/reportGroup/updateReportGroup',
    method: 'post',
    data: data
  })
}

// 报表管理-设置-删除报表文件夹
export function delReportGroup(id) {
  return request({
    url: '/mdm/reportGroup/' + id,
    method: 'delete'
  })
}

// 报表管理-设置-查询搜索条件
export function queryReportGroupListForSearchList(data) {
  return request({
    url: '/mdm/reportGroup/queryReportGroupListForSearchList',
    method: 'post',
    data: data
  })
}
// 报表管理-设置首页报表弹窗, 查询报表级联下拉数据
export function queryAdminSetReportGroup(data) {
  return request({
    url: '/mdm/reportGroup/queryAdminSetReportGroup',
    method: 'post',
    data: data
  })
}
// 报表管理-设置-管理员编辑设置系统默认
export function saveDefaultReport(data) {
  return request({
    url: '/mdm/reportGroup/saveDefaultReport',
    method: 'post',
    data: data
  })
}

// 仪表盘 - 查询报表级联下拉数据
export function queryReportGroupForDashboard(data) {
  return request({
    url: '/mdm/reportGroup/queryReportGroupForDashboard',
    method: 'post',
    data: data
  })
}

// 仪表盘 - 设置首页报表弹窗 - 保存首页默认报表
export function saveUserDefaultReport(data) {
  return request({
    url: '/mdm/reportGroup/saveUserDefaultReport',
    method: 'post',
    data: data
  })
}
// 4. 仪表盘 - 查询用户首页默认报表
export function queryUserDefaultReport(data) {
  return request({
    url: '/mdm/reportGroup/queryUserDefaultReport',
    method: 'post',
    data: data
  })
}
// 拒收原因列表
export function queryRejectReasons() {
  return request({
    url: '/mdm/setupField/queryRejectReasons',
    method: 'get'
  })
}
// 新增拒收原因
export function addRejectReasons(data) {
  return request({
    url: '/mdm/setupField/addRejectReasons',
    method: 'post',
    data: data
  })
}
// 修改拒收原因
export function editRejectReasons(data) {
  return request({
    url: '/mdm/setupField/editRejectReasons',
    method: 'post',
    data: data
  })
}
