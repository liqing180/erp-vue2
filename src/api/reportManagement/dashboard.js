import request from '@/utils/request'

// 主列表搜索条件查询
export function queryReportGroupListForSearchList(data) {
  return request({
    url: '/system/reportGroup/queryReportGroupListForSearchList',
    method: 'post',
    data: data
  })
}

// 报表文件夹主列表查询
export function queryReportGroupList(data) {
  return request({
    url: '/system/reportGroup/queryReportGroupList',
    method: 'post',
    data: data
  })
}

// 报表管理-设置-删除报表文件夹
export function delReportGroup(reportGroupId) {
  return request({
    url: '/system/reportGroup/' + reportGroupId,
    method: 'delete'
  })
}

// 查询可以下拉的报表
export function queryViewReportDict() {
  return request({
    url: '/system/reportGroup/queryViewReportDict',
    method: 'get'
  })
}

// 报表文件夹By ID
export function queryReportGroupById(reportGroupId) {
  return request({
    url: '/system/reportGroup/queryReportGroupById/' + reportGroupId,
    method: 'get'
  })
}

// 报表文件夹新增
export function saveReportGroup(data) {
  return request({
    url: '/system/reportGroup/saveReportGroup',
    method: 'post',
    data: data
  })
}

// 报表文件夹新增
export function updateReportGroup(data) {
  return request({
    url: '/system/reportGroup/updateReportGroup',
    method: 'post',
    data: data
  })
}

/* 查询角色下拉 */
export function queryRoleSearchList() {
  return request({
    url: '/system/roleNew/queryRoleSearchList',
    method: 'get'
  })
}

// 查询任务中心统计:
export function queryTaskCenterStatistics(data) {
  return request({
    url: '/system/activiti/myTask/queryTaskCenterStatistics',
    method: 'post',
    data: data
  })
}
// 查询报表下拉文件夹:
export function queryReportGroupForDashboard(data) {
  return request({
    url: '/system/reportGroup/queryReportGroupForDashboard',
    method: 'post',
    data: data
  })
}

// 用户编辑设置系统默认:
export function saveUserDefaultReport(data) {
  return request({
    url: '/system/reportGroup/saveUserDefaultReport',
    method: 'post',
    data: data
  })
}

// 获取采购的今日数据:
export function queryTodayTransactionsPurchase(data) {
  return request({
    url: '/purchase/purchaseOrder/queryTodayTransactions',
    method: 'post',
    data: data
  })
}
// 获取销售的今日数据:
export function queryTodayTransactionsSales(data) {
  return request({
    url: '/sales/salesOrder/queryTodayTransactions',
    method: 'post',
    data: data
  })
}
// 获取库存的今日数据: inventory/deliveryNotice/queryTodayTransactions
// 获取全局的今日数据:
export function queryTodayTransactionsOverall(data) {
  return request({
    url: '/system/common/queryTodayTransactions',
    method: 'post',
    data: data
  })
}
