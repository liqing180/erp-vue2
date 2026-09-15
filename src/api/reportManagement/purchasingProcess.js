
import request from '@/utils/request'

// 主列表搜索条件查询
export function querySearchList(data) {
  return request({
    url: '/purchase/report/purchaseProcess/querySearchList',
    method: 'post',
    data: data
  })
}

// 主列表查询
export function queryPurchaseProcessList(data) {
  return request({
    url: '/purchase/report/purchaseProcess/queryPurchaseProcessList',
    method: 'post',
    data: data
  })
}

// 产品弹窗列表查询
export function queryCanSelectProductListForPurchaseProcess(data) {
  return request({
    url: '/purchase/report/purchaseProcess/queryCanSelectProductListForPurchaseProcess',
    method: 'post',
    data: data
  })
}
