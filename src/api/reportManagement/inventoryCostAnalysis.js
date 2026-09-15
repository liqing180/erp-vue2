import request from '@/utils/request'

export function querySearchList(data) {
  return request({
    url: '/inventory/purchaseCost/querySearchList',
    method: 'post',
    data: data
  })
}

// 主列表查询
export function queryInventoryCostAnalysisList(data) {
  return request({
    url: '/inventory/purchaseCost/queryPurchaseCostList',
    method: 'post',
    data: data
  })
}

// 查询具体产品出入库明细
export function queryProductIOMsgList(data) {
  return request({
    url: '/inventory/purchaseCost/queryProductIOMsgList',
    method: 'post',
    data: data
  })
}

// 查询具体产品出入库明细(图表): inventory/report/inventoryCostAnalysis/queryProductIOMsgListForImage
export function queryProductIOMsgListForImage(data) {
  return request({
    url: '/inventory/purchaseCost/queryProductIOMsgListForImage',
    method: 'post',
    data: data
  })
}

/** 库存成本设置 */

// 下拉搜索值查询: inventory/inventoryCostSettings/querySearchList
export function costSettingsQuerySearchList(data) {
  return request({
    url: '/inventory/inventoryCostSettings/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询库存成本设置列表: inventory/inventoryCostSettings/queryInventoryCostSettingsList
export function queryInventoryCostSettingsList(data) {
  return request({
    url: '/inventory/inventoryCostSettings/queryInventoryCostSettingsList',
    method: 'post',
    data: data
  })
}

// 查询具体库存成本设置: inventory/inventoryCostSettings/queryInventoryCostSettingsById (inventoryCostSettingsId)
export function queryInventoryCostSettingsById(data) {
  return request({
    url: '/inventory/inventoryCostSettings/queryInventoryCostSettingsById',
    method: 'post',
    data: data
  })
}
// 保存库存成本设置: inventory/inventoryCostSettings/saveInventoryCostSettings
export function saveInventoryCostSettings(data) {
  return request({
    url: '/inventory/inventoryCostSettings/saveInventoryCostSettings',
    method: 'post',
    data: data
  })
}
// 修改库存成本设置: inventory/inventoryCostSettings/updateInventoryCostSettings
export function updateInventoryCostSettings(data) {
  return request({
    url: '/inventory/inventoryCostSettings/updateInventoryCostSettings',
    method: 'post',
    data: data
  })
}

// 查询库存成本设置可以选择的产品列表: system/product/queryProductListFromInventoryCostSettings
export function queryProductListFromInventoryCostSettings(data) {
  return request({
    url: '/system/product/queryProductListFromInventoryCostSettings',
    method: 'post',
    data: data
  })
}

// 查询库存成本设置可以选择的产品列表-无分页
export function queryProductListFromInventoryCostSettingsNoPage(data) {
  return request({
    url: '/system/product/queryProductListFromInventoryCostSettingsNoPage',
    method: 'post',
    data: data
  })
}

// 库存成本,下拉搜索值查询: inventory/inventoryCost/querySearchList
export function inventoryCostQuerySearchList(data) {
  return request({
    url: '/inventory/inventoryCost/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询库存成本列表: inventory/inventoryCost/queryInventoryCostList
export function queryInventoryCostList(data) {
  return request({
    url: '/inventory/inventoryCost/queryInventoryCostList',
    method: 'post',
    data: data
  })
}

// 查询产品的费用项明细: inventory/inventoryCost/queryInventoryCostMsg (productId)
export function queryInventoryCostMsg(data) {
  return request({
    url: '/inventory/inventoryCost/queryInventoryCostMsg',
    method: 'post',
    data: data
  })
}

// 查询具体产品库存成本明细(图表): inventory/inventoryCost/queryImageForInventoryCost (productId, startDate, endDate)
export function queryImageForInventoryCost(data) {
  return request({
    url: '/inventory/inventoryCost/queryImageForInventoryCost',
    method: 'post',
    data: data
  })
}

export function queryImageForPurchaseCost(data) {
  return request({
    url: '/inventory/purchaseCost/queryImageForPurchaseCost',
    method: 'post',
    data: data
  })
}
/** 采购成本分析 */
// 一级页面:
// 下拉搜索值查询(查询采购成本分析产品列表): inventory/purchaseCostProduct/queryPurchaseCostProductSearchList
export function queryPurchaseCostProductSearchList(data) {
  return request({
    url: '/inventory/purchaseCostProduct/queryPurchaseCostProductSearchList',
    method: 'post',
    data: data
  })
}
// 查询采购成本分析产品列表: inventory/purchaseCostProduct/queryPurchaseCostProductList (brand, startDate, endDate, condition)
export function queryPurchaseCostProductList(data) {
  return request({
    url: '/inventory/purchaseCostProduct/queryPurchaseCostProductList',
    method: 'post',
    data: data
  })
}
// 导出数据列表(查询采购成本分析产品列表): inventory/purchaseCostProduct/exportPurchaseCostProductList (exportType, exportIdList, exportFields)
export function exportPurchaseCostProductList(data) {
  return request({
    url: '/inventory/purchaseCostProduct/exportPurchaseCostProductList',
    method: 'post',
    data: data
  })
}

// 二级页面:
// 下拉搜索值查询(查询采购成本分析 产品+单据 列表): inventory/purchaseCostProduct/queryPurchaseCostProductDocumentSearchList (productId)
export function queryPurchaseCostProductDocumentSearchList(data) {
  return request({
    url: '/inventory/purchaseCostProduct/queryPurchaseCostProductDocumentSearchList',
    method: 'post',
    data: data
  })
}
// 查询采购成本分析 产品+单据 列表: inventory/purchaseCostProduct/queryPurchaseCostProductDocumentList (productId, businessPartnerId, countryId, startDate, endDate)
export function queryPurchaseCostProductDocumentList(data) {
  return request({
    url: '/inventory/purchaseCostProduct/queryPurchaseCostProductDocumentList',
    method: 'post',
    data: data
  })
}
// 图表查询(查询采购成本分析 产品+单据 列表): inventory/purchaseCostProduct/queryImageForProductDocument (productId, businessPartnerId, countryId, startDate, endDate)
export function queryImageForProductDocument(data) {
  return request({
    url: '/inventory/purchaseCostProduct/queryImageForProductDocument',
    method: 'post',
    data: data
  })
}
// 查询汇总数据(根据产品): inventory/purchaseCostProduct/querySummaryListByProduct (productId)
export function querySummaryListByProduct(data) {
  return request({
    url: '/inventory/purchaseCostProduct/querySummaryListByProduct',
    method: 'post',
    data: data
  })
}

// 三级页面:
// 查询采购成本分析 产品+单据+物流单 列表: inventory/purchaseCostProduct/queryPurchaseCostProductDocumentLogisticsList(productId, documentId)
export function queryPurchaseCostProductDocumentLogisticsList(data) {
  return request({
    url: '/inventory/purchaseCostProduct/queryPurchaseCostProductDocumentLogisticsList',
    method: 'post',
    data: data
  })
}

// 图表查询(查询采购成本分析 产品+单据+物流单 列表): inventory/purchaseCostProduct/queryImageForProductDocumentLogistics (productId, documentId)
export function queryImageForProductDocumentLogistics(data) {
  return request({
    url: '/inventory/purchaseCostProduct/queryImageForProductDocumentLogistics',
    method: 'post',
    data: data
  })
}
// 查询汇总数据(根据产品+关联单): inventory/purchaseCostProduct/querySummaryListByProductDocument (productId, documentId)
export function querySummaryListByProductDocument(data) {
  return request({
    url: '/inventory/purchaseCostProduct/querySummaryListByProductDocument',
    method: 'post',
    data: data
  })
}
// 四级页面:
// 查询采购成本分析 产品+单据+物流单+变更记录 列表: inventory/purchaseCostProduct/queryPurchaseCostProductDocumentLogisticsRevisedList (purchaseCostProductDocumentLogisticsId)
export function queryPurchaseCostProductDocumentLogisticsRevisedList(data) {
  return request({
    url: '/inventory/purchaseCostProduct/queryPurchaseCostProductDocumentLogisticsRevisedList',
    method: 'post',
    data: data
  })
}

/** 库存成本分析 */
// 一级页面:
// 下拉搜索值查询(查询库存成本分析产品列表): inventory/inventoryCostProduct/queryInventoryCostProductSearchList
export function queryInventoryCostProductSearchList(data) {
  return request({
    url: '/inventory/inventoryCostProduct/queryInventoryCostProductSearchList',
    method: 'post',
    data: data
  })
}
// 查询库存成本分析产品列表: inventory/inventoryCostProduct/queryInventoryCostProductList (brand, startDate, endDate, condition)
export function queryInventoryCostProductList(data) {
  return request({
    url: '/inventory/inventoryCostProduct/queryInventoryCostProductList',
    method: 'post',
    data: data
  })
}
// 查询产品的费用项明细: inventory/inventoryCostProduct/queryProductInventoryCostSettingsMsg(productId)
export function queryProductInventoryCostSettingsMsg(data) {
  return request({
    url: '/inventory/inventoryCostProduct/queryProductInventoryCostSettingsMsg',
    method: 'post',
    data: data
  })
}
// 导出数据列表(查询库存成本分析产品列表): inventory/inventoryCostProduct/exportInventoryCostProductList (exportType, exportIdList, exportFields)

// 二级页面:
// 查询库存成本分析 产品+单据 列表: inventory/inventoryCostProduct/queryInventoryCostProductDocumentList (productId, businessPartnerId, countryId, startDate, endDate)
export function queryInventoryCostProductDocumentList(data) {
  return request({
    url: '/inventory/inventoryCostProduct/queryInventoryCostProductDocumentList',
    method: 'post',
    data: data
  })
}
// 查询汇总数据(根据产品): inventory/inventoryCostProduct/querySummaryListByProduct (productId)
export function inventoryQuerySummaryListByProduct(data) {
  return request({
    url: '/inventory/inventoryCostProduct/querySummaryListByProduct',
    method: 'post',
    data: data
  })
}
// 三级页面:
// 查询库存成本分析 产品+单据+物流单 列表: inventory/inventoryCostProduct/queryInventoryCostProductDocumentLogisticsList (productId, documentId)
export function queryInventoryCostProductDocumentLogisticsList(data) {
  return request({
    url: '/inventory/inventoryCostProduct/queryInventoryCostProductDocumentLogisticsList',
    method: 'post',
    data: data
  })
}
// 查询汇总数据(根据产品+关联单): inventory/inventoryCostProduct/querySummaryListByProductDocument (productId, documentId)
export function inventoryQuerySummaryListByProductDocument(data) {
  return request({
    url: '/inventory/inventoryCostProduct/querySummaryListByProductDocument',
    method: 'post',
    data: data
  })
}
// 四级页面:
// 查询库存成本分析 产品+单据+物流单+变更记录 列表: inventory/inventoryCostProduct/queryInventoryCostProductDocumentLogisticsRevisedList (inventoryCostProductDocumentLogisticsId)
export function queryInventoryCostProductDocumentLogisticsRevisedList(data) {
  return request({
    url: '/inventory/inventoryCostProduct/queryInventoryCostProductDocumentLogisticsRevisedList',
    method: 'post',
    data: data
  })
}
