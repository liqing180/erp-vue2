import request from '@/utils/request'

/** 明细 */
// 下拉搜索查询(仓库-产品-订单): purchase/report/incomingAnalysis/querySearchListForWarehouseProductOrder
export function querySearchListForWarehouseProductOrder(data) {
  return request({
    url: '/purchase/report/incomingAnalysis/querySearchListForWarehouseProductOrder',
    method: 'post',
    data: data
  })
}

// 列表查询(仓库-产品-订单): purchase/report/incomingAnalysis/queryListForWarehouseProductOrder
export function queryListForWarehouseProductOrder(data) {
  return request({
    url: '/purchase/report/incomingAnalysis/queryListForWarehouseProductOrder',
    method: 'post',
    data: data
  })
}

/** 分析 */
// 参数: startDate, endDate, conditionForWarehouseProduct
// 列表查询(仓库-产品): purchase/report/incomingAnalysis/queryListForWarehouseProduct
export function queryListForWarehouseProduct(data) {
  return request({
    url: '/purchase/report/incomingAnalysis/queryListForWarehouseProduct',
    method: 'post',
    data: data
  })
}

/** 主页面 */
// 参数: startDate, endDate, conditionForWarehouse
// 列表查询(仓库): purchase/report/incomingAnalysis/queryListForWarehouse
export function queryListForWarehouse(data) {
  return request({
    url: '/purchase/report/incomingAnalysis/queryListForWarehouse',
    method: 'post',
    data: data
  })
}

// IQC不良率趋势图表: purchase/report/incomingAnalysis/queryImageForDefectiveRateTrend
export function queryImageForDefectiveRateTrend(data) {
  return request({
    url: '/purchase/report/incomingAnalysis/queryImageForDefectiveRateTrend',
    method: 'post',
    data: data
  })
}
