
import request from '@/utils/request'

// 主页面查询: purchase/purchaseStockIn/queryPurchaseStockInList
export function queryPurchaseStockInList(data) {
  return request({
    url: '/purchase/purchaseStockIn/queryPurchaseStockInList',
    method: 'post',
    data: data
  })
}

// 下拉搜索值: purchase/purchaseStockIn/querySearchList
export function querySearchList(data) {
  return request({
    url: '/purchase/purchaseStockIn/querySearchList',
    method: 'post',
    data: data
  })
}

// 具体单据查: purchase/purchaseStockIn/queryPurchaseStockInById
export function queryPurchaseStockInById(data) {
  return request({
    url: '/purchase/purchaseStockIn/queryPurchaseStockInById',
    method: 'post',
    data: data
  })
}
