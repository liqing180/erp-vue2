import request from '@/utils/request'

// 下拉搜索
export function querySearchList(data) {
  return request({
    url: '/system/questionnaireTemplate/querySearchList',
    method: 'post',
    data: data
  })
}

// 主列表
export function queryQuestionnaireTemplateList(data) {
  return request({
    url: '/system/questionnaireTemplate/queryQuestionnaireTemplateList',
    method: 'post',
    data: data
  })
}

// 查询
export function queryQuestionnaireTemplateById(data) {
  return request({
    url: '/system/questionnaireTemplate/queryQuestionnaireTemplateById',
    method: 'post',
    data: data
  })
}

// 查询模板可以选择的分类: system/productCategory/queryActiveProductCategoryTreeList
export function queryActiveProductCategoryTreeList() {
  return request({
    url: '/system/productCategory/queryActiveProductCategoryTreeList',
    method: 'get'
  })
}

// 查询分类对应的产品信息: system/product/queryProductListNeedQty (参数: productCategoryId)
export function queryProductListNeedQty(data) {
  return request({
    url: '/system/product/queryProductListNeedQty',
    method: 'post',
    data: data
  })
}

// 查询问卷模板可以选择的客户列表: system/businessPartner/queryCanSelectCustomerListNoPage
export function queryCanSelectCustomerListNoPage(data) {
  return request({
    url: '/system/businessPartner/queryCanSelectCustomerListNoPage',
    method: 'post',
    data: data
  })
}

// 保存问卷模板: system/questionnaireTemplate/saveQuestionnaireTemplate
export function saveQuestionnaireTemplate(data) {
  return request({
    url: '/system/questionnaireTemplate/saveQuestionnaireTemplate',
    method: 'post',
    data: data
  })
}

// 修改问卷模板: system/questionnaireTemplate/updateQuestionnaireTemplate
export function updateQuestionnaireTemplate(data) {
  return request({
    url: '/system/questionnaireTemplate/updateQuestionnaireTemplate',
    method: 'post',
    data: data
  })
}

// 通过问卷模板,新增客户问卷: system/customerQuestionnaire/saveCustomerQuestionnaireFromTemplate
export function saveCustomerQuestionnaireFromTemplate(data) {
  return request({
    url: '/system/customerQuestionnaire/saveCustomerQuestionnaireFromTemplate',
    method: 'post',
    data: data
  })
}
