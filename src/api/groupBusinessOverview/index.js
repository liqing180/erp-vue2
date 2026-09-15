import request from '@/utils/request'

// 仪表盘顶部信息查询: (startDate, endDate)
export function queryTopMsg(data) {
  return request({
    url: '/purchase/dashboard/queryTopMsg',
    method: 'post',
    data: data
  })
}
// 支出收入利润趋势查询: (startDate, endDate)
export function queryExpensesRevenueProfitTrend(data) {
  return request({
    url: '/purchase/dashboard/queryExpensesRevenueProfitTrend',
    method: 'post',
    data: data
  })
}

// 支出收入利润趋势查询(法人分组):
export function queryExpensesRevenueProfitTrendGroupLegalEntity(data) {
  return request({
    url: '/purchase/dashboard/queryExpensesRevenueProfitTrendGroupLegalEntity',
    method: 'post',
    data: data
  })
}

// 查询法人下的生意伙伴的支出收入列表:(legalEntityId,startDate,endDate)
export function queryListForExpensesRevenueAnalysis(data) {
  return request({
    url: '/purchase/dashboard/queryListForExpensesRevenueAnalysis',
    method: 'post',
    data: data
  })
}
