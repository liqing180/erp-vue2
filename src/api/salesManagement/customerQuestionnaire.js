import request from '@/utils/request'

// 下拉搜索
export function querySearchList(data) {
  return request({
    url: '/system/customerQuestionnaire/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询客户问卷列表: system/customerQuestionnaire/queryCustomerQuestionnaireList
export function queryCustomerQuestionnaireList(data) {
  return request({
    url: '/system/customerQuestionnaire/queryCustomerQuestionnaireList',
    method: 'post',
    data: data
  })
}

// 查询具体客户问卷: system/customerQuestionnaire/queryCustomerQuestionnaireById
export function queryCustomerQuestionnaireById(data) {
  return request({
    url: '/system/customerQuestionnaire/queryCustomerQuestionnaireById',
    method: 'post',
    data: data
  })
}

// 查询可以选择的问卷模板列表: system/questionnaireTemplate/queryCanSelectQuestionnaireTemplateListNoPage
export function queryCanSelectQuestionnaireTemplateListNoPage(data) {
  return request({
    url: '/system/questionnaireTemplate/queryCanSelectQuestionnaireTemplateListNoPage',
    method: 'post',
    data: data
  })
}

// 查询可以选择的客户列表: system/businessPartner/queryCanSelectCustomerListHavePage
export function queryCanSelectCustomerListHavePage(data) {
  return request({
    url: '/system/businessPartner/queryCanSelectCustomerListHavePage',
    method: 'post',
    data: data
  })
}

// 发送客户问卷: system/customerQuestionnaire/sendCustomerQuestionnaire
export function sendCustomerQuestionnaire(data) {
  return request({
    url: '/system/customerQuestionnaire/sendCustomerQuestionnaire',
    method: 'post',
    data: data
  })
}

// 取消客户问卷: system/customerQuestionnaire/cancelledCustomerQuestionnaire
export function cancelledCustomerQuestionnaire(data) {
  return request({
    url: '/system/customerQuestionnaire/cancelledCustomerQuestionnaire',
    method: 'post',
    data: data
  })
}

// 完成客户问卷: system/customerQuestionnaire/completedCustomerQuestionnaire
export function completedCustomerQuestionnaire(data) {
  return request({
    url: '/system/customerQuestionnaire/completedCustomerQuestionnaire',
    method: 'post',
    data: data
  })
}

// 外链查询问卷: /system /external/common/queryCustomerQuestionnaireById
export function externalQueryCustomerQuestionnaireById(data) {
  return request({
    url: '/system/external/common/queryCustomerQuestionnaireById',
    method: 'post',
    data: data,
    headers: {
      isToken: false
    }
  })
}

// 外链完成问卷: /system /external/common/completedCustomerQuestionnaire
export function externalCompletedCustomerQuestionnaire(data) {
  return request({
    url: '/system/external/common/completedCustomerQuestionnaire',
    method: 'post',
    data: data,
    headers: {
      isToken: false
    }
  })
}

// system/customerQuestionnaire/updateCustomerQuestionnaire
export function updateCustomerQuestionnaire(data) {
  return request({
    url: '/system/customerQuestionnaire/updateCustomerQuestionnaire',
    method: 'post',
    data: data
  })
}

// 查询操作日志: system/customerQuestionnaire/queryOperationLogList (customerQuestionnaireId)
export function queryOperationLogList(data) {
  return request({
    url: '/system/customerQuestionnaire/queryOperationLogList',
    method: 'post',
    data: data
  })
}

// 校验同一问卷是否已被其他同类型单据占用
// questionnaireId:客户问卷Id
// targetType: 目标单据类型，SI 或 SQ
export function checkRelationAvailable(data) {
  return request({
    url: '/sales/salesInquiry/checkRelationAvailable',
    method: 'post',
    data: data
  })
}
