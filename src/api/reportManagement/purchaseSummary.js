
import request from '@/utils/request'

// 主列表搜索条件查询
export function querySearchList(data) {
  return request({
    url: '/purchase/report/purchaseSummary/querySearchList',
    method: 'post',
    data: data
  })
}

// 主列表查询
export function queryPurchaseSummaryList(data) {
  return request({
    url: '/purchase/report/purchaseSummary/queryPurchaseSummaryList',
    method: 'post',
    data: data
  })
}

// 主列表搜索 -- 可选供应商
export function queryCanSelectVendorListForPurchaseSummary(data) {
  return request({
    url: '/purchase/report/purchaseSummary/queryCanSelectVendorListForPurchaseSummary',
    method: 'post',
    data: data
  })
}
