import request from '@/utils/request'

// 下拉搜索值查询(查询项目成本-项目产品维度):
// inventory/costProject/queryCostProjectProductSearchList
export function queryCostProjectProductSearchList(data) {
  return request({
    url: '/inventory/costProject/queryCostProjectProductSearchList',
    method: 'post',
    data: data
  })
}

// 查询项目成本-项目产品维度
// inventory/costProject/queryCostProjectProductList
export function queryCostProjectProductList(data) {
  return request({
    url: '/inventory/costProject/queryCostProjectProductList',
    method: 'post',
    data: data
  })
}

// 导出项目成本-项目产品维度
// inventory/costProject/exportCostProjectProductList
export function exportCostProjectProductList(data) {
  return request({
    url: '/inventory/costProject/exportCostProjectProductList',
    method: 'post',
    data: data
  })
}

// inventory/costProject/queryCostProjectProductDocumentList
// (costProjectId, productId)
export function queryCostProjectProductDocumentList(data) {
  return request({
    url: '/inventory/costProject/queryCostProjectProductDocumentList',
    method: 'post',
    data: data
  })
}
