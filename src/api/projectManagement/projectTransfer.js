import request from '@/utils/request'

// 下拉搜索值查询
// inventory/costProjectTransfer/querySearchList
export function querySearchList(data) {
  return request({
    url: '/inventory/costProjectTransfer/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询成本项目转移列表
// inventory/costProjectTransfer/queryCostProjectTransferList
export function queryCostProjectTransferList(data) {
  return request({
    url: '/inventory/costProjectTransfer/queryCostProjectTransferList',
    method: 'post',
    data: data
  })
}

// 查询具体成本项目转移
// inventory/costProjectTransfer/queryCostProjectTransferById
export function queryCostProjectTransferById(data) {
  return request({
    url: '/inventory/costProjectTransfer/queryCostProjectTransferById',
    method: 'post',
    data: data
  })
}

// 提交成本项目转移
// inventory/costProjectTransfer/submitCostProjectTransfer
export function submitCostProjectTransfer(data) {
  return request({
    url: '/inventory/costProjectTransfer/submitCostProjectTransfer',
    method: 'post',
    data: data
  })
}

// 选择可以选择的项目
// inventory/costProject/queryCanSelectCostProjectListForPage // (alreadyId)
export function queryCanSelectCostProjectListForPage(data) {
  return request({
    url: '/inventory/costProject/queryCanSelectCostProjectListForPage',
    method: 'post',
    data: data
  })
}

// inventory/costProject/queryCanSelectCostProjectList (alreadyId)
export function queryCanSelectCostProjectList(data) {
  return request({
    url: '/inventory/costProject/queryCanSelectCostProjectList',
    method: 'post',
    data: data
  })
}

// 查询转移可以选择的项目生产产品列表
// system/projectProduction/v2/queryTransferCanSelectProductList (transferFromCostProjectId)
export function queryTransferCanSelectProductList(data) {
  return request({
    url: '/system/projectProduction/v2/queryTransferCanSelectProductList',
    method: 'post',
    data: data
  })
}
