
import request from '@/utils/request'

// 主列表搜索条件查询
export function querySearchList(data) {
  return request({
    url: '/purchase/report/purchaseDetails/querySearchList',
    method: 'post',
    data: data
  })
}

// 主列表查询
export function queryPurchaseDetailsList(data) {
  return request({
    url: '/purchase/report/purchaseDetails/queryPurchaseDetailsList',
    method: 'post',
    data: data
  })
}

// 供应商
export function queryCanSelectVendorListForPurchaseDetails(data) {
  return request({
    url: '/purchase/report/purchaseDetails/queryCanSelectVendorListForPurchaseDetails',
    method: 'post',
    data: data
  })
}

// 产品
export function queryCanSelectProductListForPurchaseDetails(data) {
  return request({
    url: '/purchase/report/purchaseDetails/queryCanSelectProductListForPurchaseDetails',
    method: 'post',
    data: data
  })
}
