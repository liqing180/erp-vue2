import request from '@/utils/request'

// 查询 销售部门业绩汇总 列表: /sales/salesPerformanceSummary/queryListForSalesDepartment
export function queryListForSalesDepartment(data) {
  return request({
    url: '/sales/salesPerformanceSummary/queryListForSalesDepartment',
    method: 'post',
    data: data
  })
}
// 图表分析查询(销售部门业绩汇总): /sales/salesPerformanceSummary/queryImageForSalesDepartment
export function queryImageForSalesDepartment(data) {
  return request({
    url: '/sales/salesPerformanceSummary/queryImageForSalesDepartment',
    method: 'post',
    data: data
  })
}

// 下拉搜索值查询(销售部门): /sales/salesPerformanceSummary/querySearchListForSalesDepartment
export function querySearchListForSalesDepartment(data) {
  return request({
    url: '/sales/salesPerformanceSummary/querySearchListForSalesDepartment',
    method: 'post',
    data: data
  })
}

// 销售部门业绩趋势- 趋势曲线图:
export function querySalesTrendCurveForSalesDepartment(data) {
  return request({
    url: '/sales/salesPerformanceSummary/querySalesTrendCurveForSalesDepartment',
    method: 'post',
    data: data
  })
}
