import request from '@/utils/request'
// 查询可以选择的销售订单列表
export function queryCanSelectSalesOrderList(data) {
  return request({
    url: '/sales/proformaInvoice/queryCanSelectSalesOrderList',
    method: 'post',
    data: data
  })
}

// 构建销售订单的形式发票:
export function buildProformaInvoiceForSalesOrder(data) {
  return request({
    url: '/sales/proformaInvoice/buildProformaInvoiceForSalesOrder',
    method: 'post',
    data: data
  })
}

// 查询具体形式发票:
export function queryProformaInvoiceById(data) {
  return request({
    url: '/sales/proformaInvoice/queryProformaInvoiceById',
    method: 'post',
    data: data
  })
}

// 计算:
export function calculate(data) {
  return request({
    url: '/sales/proformaInvoice/calculate',
    method: 'post',
    data: data
  })
}

// 校验提交时跳过的付款阶段:
export function findPreviousCanCreatePiStageList(data) {
  return request({
    url: '/sales/proformaInvoice/findPreviousCanCreatePiStageList',
    method: 'post',
    data: data
  })
}

// 保存:
export function submitProformaInvoice(data) {
  return request({
    url: '/sales/proformaInvoice/submitProformaInvoice',
    method: 'post',
    data: data
  })
}

// 保存草稿:
export function saveDraftProformaInvoice(data) {
  return request({
    url: '/sales/proformaInvoice/saveDraftProformaInvoice',
    method: 'post',
    data: data
  })
}

// 审批:
export function approvedProformaInvoice(data) {
  return request({
    url: '/sales/proformaInvoice/approvedProformaInvoice',
    method: 'post',
    data: data
  })
}
// 驳回:
export function rejectedProformaInvoice(data) {
  return request({
    url: '/sales/proformaInvoice/rejectedProformaInvoice',
    method: 'post',
    data: data
  })
}
// 撤回:
export function withdrawApproved(data) {
  return request({
    url: '/sales/proformaInvoice/withdrawApproved',
    method: 'post',
    data: data
  })
}

// 取消形式发票:
export function cancelledProformaInvoice(data) {
  return request({
    url: '/sales/proformaInvoice/cancelledProformaInvoice',
    method: 'post',
    data: data
  })
}

// Revise形式发票:
export function reviseProformaInvoice(data) {
  return request({
    url: '/sales/proformaInvoice/reviseProformaInvoice',
    method: 'post',
    data: data
  })
}

// 各个页签数据数量查询:
export function queryCountList(data) {
  return request({
    url: '/sales/proformaInvoice/queryCountList',
    method: 'post',
    data: data
  })
}

// 下拉搜索值查询:
export function querySearchList(data) {
  return request({
    url: '/sales/proformaInvoice/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询形式发票列表:
export function queryProformaInvoiceList(data) {
  return request({
    url: '/sales/proformaInvoice/queryProformaInvoiceList',
    method: 'post',
    data: data
  })
}

// 查询形式发票列表:
export function preview(data) {
  return request({
    url: '/sales/proformaInvoice/preview',
    method: 'post',
    data: data
  })
}
// 预览邮件 参数 ProformaInvoiceEmailSetting
export function previewEmail(data) {
  return request({
    url: '/sales/proformaInvoice/previewEmail',
    method: 'post',
    data: data
  })
}

// 复制PI 校验接口
export function copyProformaInvoiceForSalesOrder(data) {
  return request({
    url: '/sales/proformaInvoice/copyProformaInvoiceForSalesOrder',
    method: 'post',
    data: data
  })
}
// 发送邮件 proformaInvoiceId
export function sendEmail(data) {
  return request({
    url: '/sales/proformaInvoice/sendEmail',
    method: 'post',
    data: data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/sales/proformaInvoice/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/sales/proformaInvoice/revisionDiff',
    method: 'post',
    data
  })
}
