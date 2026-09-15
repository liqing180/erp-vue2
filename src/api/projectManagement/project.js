import request from '@/utils/request'

// 查询可以选择的客户列表: system/businessPartner/queryCanSelectCustomerListHavePage
export function queryCanSelectCustomerListHavePage(data) {
  return request({
    url: '/system/businessPartner/queryCanSelectCustomerListHavePage',
    method: 'post',
    data: data
  })
}

// 下拉搜索值查询: inventory/costProject/querySearchList
export function querySearchList(data) {
  return request({
    url: '/inventory/costProject/querySearchList',
    method: 'post',
    data: data
  })
}
// 主页面查询: inventory/costProject/queryCostProjectList
export function queryCostProjectList(data) {
  return request({
    url: '/inventory/costProject/queryCostProjectList',
    method: 'post',
    data: data
  })
}
// 查询具体成本项目: inventory/costProject/queryCostProjectById
export function queryCostProjectById(data) {
  return request({
    url: '/inventory/costProject/queryCostProjectById',
    method: 'post',
    data: data
  })
}
// 提交成本项目: inventory/costProject/submitCostProject
export function submitCostProject(data) {
  return request({
    url: '/inventory/costProject/submitCostProject',
    method: 'post',
    data: data
  })
}
// 根据可以选择的成本项目(分页): inventory/costProject/queryCanSelectCostProjectListForPage
export function queryCanSelectCostProjectListForPage(data) {
  return request({
    url: '/inventory/costProject/queryCanSelectCostProjectListForPage',
    method: 'post',
    data: data
  })
}

// 根据可以选择的成本项目: inventory/costProject/queryCanSelectCostProjectList
export function queryCanSelectCostProjectList(data) {
  return request({
    url: '/inventory/costProject/queryCanSelectCostProjectList',
    method: 'post',
    data: data
  })
}

// 查询项目成本-销售(分页): inventory/costProject/queryCostProjectSalesList (costProjectId)
export function queryCostProjectSalesList(data) {
  return request({
    url: '/inventory/costProject/queryCostProjectSalesList',
    method: 'post',
    data: data
  })
}
// 查询项目成本-销售-产品(分页): inventory/costProject/queryCostProjectSalesProductList (costProjectSalesId)
export function queryCostProjectSalesProductList(data) {
  return request({
    url: '/inventory/costProject/queryCostProjectSalesProductList',
    method: 'post',
    data: data
  })
}

// 查询项目成本-库存(分页): inventory/costProject/queryCostProjectInventoryList (costProjectId)
export function queryCostProjectInventoryList(data) {
  return request({
    url: '/inventory/costProject/queryCostProjectInventoryList',
    method: 'post',
    data: data
  })
}

// 查询项目成本-库存-产品(分页): inventory/costProject/queryCostProjectInventoryProductList (costProjectInventoryId)
export function queryCostProjectInventoryProductList(data) {
  return request({
    url: '/inventory/costProject/queryCostProjectInventoryProductList',
    method: 'post',
    data: data
  })
}

// 完成成本项目: inventory/costProject/completeCostProject (costProjectId)
export function completeCostProject(data) {
  return request({
    url: '/inventory/costProject/completeCostProject',
    method: 'post',
    data: data
  })
}

// 弹窗, 按成本项目查询已完成项目生产产品列表:
// system/projectProduction/v2/queryProjectProductionProductListByCostProjectId (costProjectId)
export function queryProjectProductionProductListByCostProjectId(data) {
  return request({
    url: '/system/projectProduction/v2/queryProjectProductionProductListByCostProjectId',
    method: 'post',
    data: data
  })
}

// 完成，保存项目生产产品归还数据:
// system/projectProduction/v2/saveProjectProductionReturnedProductList
// 参数：{"costProjectId":"xxxxxxx","productList":[{xxxxx}]}
export function saveProjectProductionReturnedProductList(data) {
  return request({
    url: '/system/projectProduction/v2/saveProjectProductionReturnedProductList',
    method: 'post',
    data: data
  })
}
