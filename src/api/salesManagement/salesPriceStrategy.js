import request from '@/utils/request'

// 主列表
export function querySalesPriceStrategyList(data) {
  return request({
    url: '/sales/salesPriceStrategy/querySalesPriceStrategyList',
    method: 'post',
    data: data
  })
}

// BY ID
export function querySalesPriceStrategyById(data) {
  return request({
    url: '/sales/salesPriceStrategy/querySalesPriceStrategyById',
    method: 'post',
    data: data
  })
}

export function approvedSalesPriceStrategy(data) {
  return request({
    url: '/sales/salesPriceStrategy/approvedSalesPriceStrategy',
    method: 'post',
    data: data
  })
}
export function withdrawSalesPriceStrategy(data) {
  return request({
    url: '/sales/salesPriceStrategy/withdrawSalesPriceStrategy',
    method: 'post',
    data: data
  })
}

export function querySearchList(data) {
  return request({
    url: '/sales/salesPriceStrategy/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询可以选择的客户列表,有权限控制：
export function queryCanSelectCustomerListNoPage(data) {
  return request({
    url: '/system/businessPartner/queryCanSelectCustomerListNoPage',
    method: 'post',
    data: data
  })
}

// 提交销售价格策略
export function saveSalesPriceList(data) {
  return request({
    url: '/sales/salesPriceStrategy/saveSalesPriceList',
    method: 'post',
    data: data
  })
}
// 修改销售价格策略
export function updateSalesPriceList(data) {
  return request({
    url: '/sales/salesPriceStrategy/updateSalesPriceList',
    method: 'post',
    data: data
  })
}
// 查询产品集合的建议售价跟货币,单位,销售编号
export function queryProductSalesPriceList(data) {
  return request({
    url: '/sales/salesPriceStrategy/queryProductSalesPriceList',
    method: 'post',
    data: data
  })
}

// 查询销售产品历史采购单价(图表)
export function queryProductHistoryPriceImage(data) {
  return request({
    url: '/sales/salesPriceStrategy/queryProductHistoryPriceImage',
    method: 'post',
    data: data
  })
}

// 查询产品集合的销售价格策略编号列表:  参数集合：  productMainId
export function querySalesPriceStrategyListForProductId(data) {
  return request({
    url: '/sales/salesPriceStrategy/querySalesPriceStrategyListForProductId',
    method: 'post',
    data: data
  })
}

// 修改销售价格策略集合
export function updateSalesPriceStrategyList(data) {
  return request({
    url: '/sales/salesPriceStrategy/updateSalesPriceStrategyList',
    method: 'post',
    data: data
  })
}

// 根据产品ID查询销售编号集合
export function querySalesPartNoByProductId(data) {
  return request({
    url: '/sales/salesPriceStrategy/querySalesPartNoByProductId',
    method: 'post',
    data
  })
}
