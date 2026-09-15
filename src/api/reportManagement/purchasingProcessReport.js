import request from '@/utils/request'

// 各个页签数据数量查询: purchase/report/purchaseProcessView/queryCountList
export function queryCountList(data) {
  return request({
    url: '/purchase/report/purchaseProcessView/queryCountList',
    method: 'post',
    data: data
  })
}

// 下拉搜索值查询:  purchase/report/purchaseProcessView/querySearchList
export function querySearchList(data) {
  return request({
    url: '/purchase/report/purchaseProcessView/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询采购进度视图记录列表: purchase/report/purchaseProcessView/queryPurchaseProcessViewList
export function queryPurchaseProcessViewList(data) {
  return request({
    url: '/purchase/report/purchaseProcessView/queryPurchaseProcessViewList',
    method: 'post',
    data: data
  })
}
