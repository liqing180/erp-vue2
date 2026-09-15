import request from '@/utils/request'

// 查询库存成本设置可以选择的产品列表: system/product/queryProductListFromSalesCostSettings
export function queryProductListFromSalesCostSettings(data) {
  return request({
    url: '/system/product/queryProductListFromSalesCostSettings',
    method: 'post',
    data: data
  })
}
// 查询库存成本设置可以选择的产品列表: 无分页
export function queryProductListFromSalesCostSettingsNoPage(data) {
  return request({
    url: '/system/product/queryProductListFromSalesCostSettingsNoPage',
    method: 'post',
    data: data
  })
}

// 下拉搜索值查询: sales/salesCostSettings/querySearchList
export function querySearchList(data) {
  return request({
    url: '/sales/salesCostSettings/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询库存成本设置列表: sales/salesCostSettings/querySalesCostSettingsList
export function querySalesCostSettingsList(data) {
  return request({
    url: '/sales/salesCostSettings/querySalesCostSettingsList',
    method: 'post',
    data: data
  })
}

// 查询具体库存成本设置: sales/salesCostSettings/querySalesCostSettingsById (salesCostSettingsId)
export function querySalesCostSettingsById(data) {
  return request({
    url: '/sales/salesCostSettings/querySalesCostSettingsById',
    method: 'post',
    data: data
  })
}
// 保存库存成本设置: sales/salesCostSettings/saveSalesCostSettings
export function saveSalesCostSettings(data) {
  return request({
    url: '/sales/salesCostSettings/saveSalesCostSettings',
    method: 'post',
    data: data
  })
}

// 修改库存成本设置: sales/salesCostSettings/updateSalesCostSettings
export function updateSalesCostSettings(data) {
  return request({
    url: '/sales/salesCostSettings/updateSalesCostSettings',
    method: 'post',
    data: data
  })
}

/** 销售成本 */
// 销售成本,下拉搜索值查询: inventory/salesCost/querySearchList
export function salesCostQuerySearchList(data) {
  return request({
    url: '/inventory/salesCostProduct/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询库存成本列表: inventory/salesCost/querySalesCostList
export function salesCostQuerySalesCostList(data) {
  return request({
    url: '/inventory/salesCostProduct/querySalesCostList',
    method: 'post',
    data: data
  })
}

// 查询产品的费用项明细: inventory/salesCost/querySalesCostMsg(productId)
export function salesCostQuerySalesCostMsg(data) {
  return request({
    url: '/inventory/salesCostProduct/querySalesCostMsg',
    method: 'post',
    data: data
  })
}
// 查询具体产品库存成本明细(图表): inventory/salesCost/queryImageForSalesCost(productId, startDate, endDate)
export function queryImageForSalesCost(data) {
  return request({
    url: '/inventory/salesCostProduct/queryImageForSalesCost',
    method: 'post',
    data: data
  })
}

// 更新利润率配置: inventory/recommendedPrice/updateProfitMarginSettings
export function updateProfitMarginSettings(data) {
  return request({
    url: '/inventory/recommendedPrice/updateProfitMarginSettings',
    method: 'post',
    data: data
  })
}

// 查询利润率配置: inventory/recommendedPrice/queryProfitMarginSettings
export function queryProfitMarginSettings(data) {
  return request({
    url: '/inventory/recommendedPrice/queryProfitMarginSettings',
    method: 'post',
    data: data
  })
}

// 下拉搜索值查询,建议售价: inventory/recommendedPrice/querySearchList
export function recommendedPriceQuerySearchList(data) {
  return request({
    url: '/inventory/recommendedPrice/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询建议售价列表: inventory/recommendedPrice/queryRecommendedPriceList
export function recommendedPriceQueryRecommendedPriceList(data) {
  return request({
    url: '/inventory/recommendedPrice/queryRecommendedPriceList',
    method: 'post',
    data: data
  })
}

// 查询具体产品建议售价明细(图表): inventory/recommendedPrice/queryImageForRecommendedPrice
export function queryImageForRecommendedPrice(data) {
  return request({
    url: '/inventory/recommendedPrice/queryImageForRecommendedPrice',
    method: 'post',
    data: data
  })
}
