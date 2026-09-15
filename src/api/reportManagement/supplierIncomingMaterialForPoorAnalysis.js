import request from '@/utils/request'

/** 明细 */
// 下拉搜索查询(供应商-产品-订单): purchase/report/incomingAnalysis/querySearchListForBusinessProductOrder
export function querySearchListForBusinessProductOrder(data) {
  return request({
    url: '/purchase/report/incomingAnalysis/querySearchListForBusinessProductOrder',
    method: 'post',
    data: data
  })
}

// 列表查询(供应商-产品-订单): purchase/report/incomingAnalysis/queryListForBusinessProductOrder
export function queryListForBusinessProductOrder(data) {
  return request({
    url: '/purchase/report/incomingAnalysis/queryListForBusinessProductOrder',
    method: 'post',
    data: data
  })
}

/** 分析 */
// 列表查询(供应商-产品): purchase/report/incomingAnalysis/queryListForBusinessProduct
export function queryListForBusinessProduct(data) {
  return request({
    url: '/purchase/report/incomingAnalysis/queryListForBusinessProduct',
    method: 'post',
    data: data
  })
}

/** 主页面 */
// 参数: conditionForBusiness, startDate, endDate
// 列表查询(供应商): purchase/report/incomingAnalysis/queryListForBusiness
export function queryListForBusiness(data) {
  return request({
    url: '/purchase/report/incomingAnalysis/queryListForBusiness',
    method: 'post',
    data: data
  })
}

// 供应商IQC不良率Top图: purchase/report/incomingAnalysis/queryImageForBusinessDefectiveRateTrend (needCount)
export function queryImageForBusinessDefectiveRateTrend(data) {
  return request({
    url: '/purchase/report/incomingAnalysis/queryImageForBusinessDefectiveRateTrend',
    method: 'post',
    data: data
  })
}

// 导出数据(供应商): purchase/report/incomingAnalysis/exportForBusiness
