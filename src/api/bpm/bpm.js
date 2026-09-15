import request from '@/utils/request'

// 查询业务单据悬浮信息 (businessId, moduleKey)
export function queryBusinessOtherMsg(data) {
  return request({
    url: '/system/activiti/superAdmin/queryBusinessOtherMsg',
    method: 'post',
    data: data
  })
}

// 我的任务 代办任务主列表
export function queryMyTodoTaskList(data) {
  return request({
    url: '/system/activiti/myTask/queryMyTodoTaskList',
    method: 'post',
    data: data
  })
}
// 管理员操作 系统代办任务主列表
export function getSystemTodoTaskList(data) {
  return request({
    url: '/system/activiti/superAdmin/getSystemTodoTaskList',
    method: 'post',
    data: data
  })
}
// 查询可以跳审的节点(GET)
export function getSkipOverNodeMsgList(id, taskId) {
  return request({
    url: '/system/activiti/superAdmin/getSkipOverNodeMsgList/' + id + '/' + taskId,
    method: 'get'
  })
}
// 查询可以回退的节点(GET)
export function getReturnNodeMsgList(id) {
  return request({
    url: '/system/activiti/superAdmin/getReturnNodeMsgList/' + id,
    method: 'get'
  })
}

// 进行跳审
export function skipOverProcessToNode(data) {
  return request({
    url: '/system/activiti/superAdmin/skipOverProcessToNode',
    method: 'post',
    data: data
  })
}

// 进行回退
export function returnProcessToNode(data) {
  return request({
    url: '/system/activiti/superAdmin/returnProcessToNode',
    method: 'post',
    data: data
  })
}

// 催办列表
export function queryReminderMessageList(data) {
  return request({
    url: '/system/activiti/processManagement/queryReminderMessageList',
    method: 'post',
    data: data
  })
}

// 催办提交
export function reminder(data) {
  return request({
    url: '/system/activiti/processManagement/reminder',
    method: 'post',
    data: data
  })
}

// 转审
export function approvalTransfer(data) {
  return request({
    url: '/system/activiti/superAdmin/approvalTransfer',
    method: 'post',
    data: data
  })
}

// 取消任务
export function cancelleActivitiTask(data) {
  return request({
    url: '/system/activiti/superAdmin/cancelleActiviti',
    method: 'post',
    data: data
  })
}

// 取消流程
export function cancelleActivitiProcess(data) {
  return request({
    url: '/system/activiti/processManagement/cancelleActiviti',
    method: 'post',
    data: data
  })
}

// 批量取消
export function batchCancelledBusiness(data) {
  return request({
    url: '/system/activiti/superAdmin/batchCancelledBusiness',
    method: 'post',
    data: data,
    // 超时时间 5分钟
    timeout: 300000
  })
}
// 批量撤回
export function batchWithdrawToRestart(data) {
  return request({
    url: '/system/activiti/superAdmin/batchWithdrawToRestart',
    method: 'post',
    data: data,
    // 超时时间 5分钟
    timeout: 300000
  })
}
// 批量审批:
export function batchApprovedBusiness(data) {
  return request({
    url: '/system/activiti/superAdmin/batchApprovedBusiness',
    method: 'post',
    data: data,
    // 超时时间 5分钟
    timeout: 300000
  })
}
// 批量驳回:
export function batchRejectedBusiness(data) {
  return request({
    url: '/system/activiti/superAdmin/batchRejectedBusiness',
    method: 'post',
    data: data,
    // 超时时间 5分钟
    timeout: 300000
  })
}
// 批量跳审:
export function batchSkipOverProcessToNextNode(data) {
  return request({
    url: '/system/activiti/superAdmin/batchSkipOverProcessToNextNode',
    method: 'post',
    data: data,
    // 超时时间 5分钟
    timeout: 300000
  })
}

// 我的待办下拉搜索
export function querySearchListForMyTodoTask(data) {
  return request({
    url: '/system/activiti/myTask/querySearchListForMyTodoTask',
    method: 'post',
    data: data
  })
}

// 我的已办下拉搜索
export function querySearchListForMyHandleTask(data) {
  return request({
    url: '/system/activiti/myTask/querySearchListForMyHandleTask',
    method: 'post',
    data: data
  })
}

// 我的已办主列表
export function queryMyHandleTaskList(data) {
  return request({
    url: '/system/activiti/myTask/queryMyHandleTaskList',
    method: 'post',
    data: data
  })
}

// 查询超管待办下拉搜索
export function querySearchListForSystemTodoTaskList(data) {
  return request({
    url: '/system/activiti/superAdmin/querySearchListForSystemTodoTaskList',
    method: 'post',
    data: data
  })
}

// 查询超管超时待办下拉搜索
export function querySearchListForSystemTodoTaskListForTimeOut(data) {
  return request({
    url: '/system/activiti/superAdmin/querySearchListForSystemTodoTaskListForTimeOut',
    method: 'post',
    data: data
  })
}

// 查询超管超时待办主页面
export function getSystemTodoTaskListForTimeOut(data) {
  return request({
    url: '/system/activiti/superAdmin/getSystemTodoTaskListForTimeOut',
    method: 'post',
    data: data
  })
}

// 查询我发起的流程下拉搜索
export function querySearchListForInitiatedProcess(data) {
  return request({
    url: '/system/activiti/processManagement/querySearchListForInitiatedProcess',
    method: 'post',
    data: data
  })
}

// 查询我发起的流程主页面
export function queryInitiatedProcess(data) {
  return request({
    url: '/system/activiti/processManagement/queryInitiatedProcess',
    method: 'post',
    data: data
  })
}

// 查询我参与的流程下拉搜索
export function querySearchListForParticipatedProcess(data) {
  return request({
    url: '/system/activiti/processManagement/querySearchListForParticipatedProcess',
    method: 'post',
    data: data
  })
}

// 查询我参与的流程主页面
export function queryParticipatedProcess(data) {
  return request({
    url: '/system/activiti/processManagement/queryParticipatedProcess',
    method: 'post',
    data: data
  })
}

// Flow Chart 获取流程图
export function getProcessImgByProcessInstance(id) {
  return request({
    url: '/system/history/getProcessImgByProcessInstance/' + id,
    method: 'get',
    responseType: 'blob'
  })
}
// Flow Chart 获取流程单据信息
export function queryBizProcessManagementById(id) {
  return request({
    url: '/system/activiti/processManagement/queryBizProcessManagementById/' + id,
    method: 'get'
  })
}
// Flow Chart 获取流程历史记录
export function getBizTaskHistoryByInstanceIdForEnd(data) {
  return request({
    url: '/system/history/getBizTaskHistoryByInstanceIdForEnd',
    method: 'post',
    data: data
  })
}
// Task Detail 查询的步骤内容
export function getTaskDetailByInstanceId(id) {
  return request({
    url: '/system/history/getTaskDetailByInstanceId/' + id,
    method: 'get'
  })
}
// Task Detail 获取 History 审批记录
export function getBizTaskHistoryShowByInstanceId(id) {
  return request({
    url: '/system/history/getBizTaskHistoryShowByInstanceId/' + id,
    method: 'get'
  })
}
// Task Detail 获取 Completion Chart
export function getProcessStatusByInstanceId(id) {
  return request({
    url: '/system/history/getProcessStatusByInstanceId/' + id,
    method: 'get'
  })
}

// 显示当前账号待办单据的总和,用红色统计
export function queryTodoTaskCount(data) {
  return request({
    url: '/system/activiti/myTask/queryTodoTaskCount',
    method: 'post',
    data: data
  })
}

// 库存,聚合查询所有待处理数量
/*
storeIssueChitPendingCount: 借货单的
 */
export function getInventoryAllPendingCounts(data) {
  return request({
    url: '/inventory/statistics/getAllPendingCountsForErp',
    method: 'post',
    data: data
  })
}

export function getSalesAllPendingCounts(data) {
  return request({
    url: '/sales/statistics/getAllPendingCounts',
    method: 'post',
    data: data
  })
}

export function getPurchaseAllPendingCounts(data) {
  return request({
    url: '/purchase/statistics/getAllPendingCounts',
    method: 'post',
    data: data
  })
}
