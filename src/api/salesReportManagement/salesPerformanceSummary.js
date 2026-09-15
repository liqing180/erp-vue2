import request from '@/utils/request'

// 查询 销售员业绩汇总 列表: /sales/salesPerformanceSummary/queryListForSalesPerson
export function queryListForSalesPerson(data) {
  return request({
    url: '/sales/salesPerformanceSummary/queryListForSalesPerson',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询(销售员): /sales/salesPerformanceSummary/querySearchListForSalesPerson
export function querySearchListForSalesPerson(data) {
  return request({
    url: '/sales/salesPerformanceSummary/querySearchListForSalesPerson',
    method: 'post',
    data: data
  })
}
// 图表分析查询(销售员业绩汇总): /sales/salesPerformanceSummary/queryImageForSalesPerson
export function queryImageForSalesPerson(data) {
  return request({
    url: '/sales/salesPerformanceSummary/queryImageForSalesPerson',
    method: 'post',
    data: data
  })
}

// 图表分析查询(销售员业绩趋势):
export function querySalesTrendCurveForSalesPerson(data) {
  return request({
    url: '/sales/salesPerformanceSummary/querySalesTrendCurveForSalesPerson',
    method: 'post',
    data: data
  })
}

// 销售客户汇总列表
export function queryListForCustomer(data) {
  return request({
    url: '/sales/salesPerformanceSummary/queryListForCustomer',
    method: 'post',
    data: data
  })
}
// 图表分析查询(销售客户业绩汇总)
export function queryImageForCustomer(data) {
  return request({
    url: '/sales/salesPerformanceSummary/queryImageForCustomer',
    method: 'post',
    data: data
  })
}
