import request from '@/utils/request'

// 采购成本分析(产品仓库维度): inventory/purchaseCostProductWarehouse

// 下拉搜索值查询(查询采购成本分析(产品仓库维度) 产品 列表): queryPurchaseCostProductWarehouseSearchList
export function queryPurchaseCostProductWarehouseSearchList(data) {
  return request({
    url: '/inventory/purchaseCostProductWarehouse/queryPurchaseCostProductWarehouseSearchList',
    method: 'post',
    data: data
  })
}
// 查询采购成本分析(产品仓库维度) 产品 列表: queryPurchaseCostProductWarehouseList
export function queryPurchaseCostProductWarehouseList(data) {
  return request({
    url: '/inventory/purchaseCostProductWarehouse/queryPurchaseCostProductWarehouseList',
    method: 'post',
    data: data
  })
}
// 导出数据列表(查询采购成本分析(产品仓库维度) 产品 列表): exportPurchaseCostProductWarehouseList
export function exportPurchaseCostProductWarehouseList(data) {
  return request({
    url: '/inventory/purchaseCostProductWarehouse/exportPurchaseCostProductWarehouseList',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询(查询采购成本分析(产品仓库维度) 产品+单据 列表): queryPurchaseCostProductWarehouseDocumentSearchList
export function queryPurchaseCostProductWarehouseDocumentSearchList(data) {
  return request({
    url: '/inventory/purchaseCostProductWarehouse/queryPurchaseCostProductWarehouseDocumentSearchList',
    method: 'post',
    data: data
  })
}
// 查询采购成本分析(产品仓库维度) 产品+单据 列表: queryPurchaseCostProductWarehouseDocumentList
export function queryPurchaseCostProductWarehouseDocumentList(data) {
  return request({
    url: '/inventory/purchaseCostProductWarehouse/queryPurchaseCostProductWarehouseDocumentList',
    method: 'post',
    data: data
  })
}
// 图表查询(查询采购成本分析(产品仓库维度) 产品+单据 列表): queryImageForProductDocument
export function queryImageForProductDocument(data) {
  return request({
    url: '/inventory/purchaseCostProductWarehouse/queryImageForProductWarehouseDocument',
    method: 'post',
    data: data
  })
}
// 查询采购成本分析(产品仓库维度) 产品+单据+物流单 列表: queryPurchaseCostProductWarehouseDocumentLogisticsList
export function queryPurchaseCostProductWarehouseDocumentLogisticsList(data) {
  return request({
    url: '/inventory/purchaseCostProductWarehouse/queryPurchaseCostProductWarehouseDocumentLogisticsList',
    method: 'post',
    data: data
  })
}
// 图表查询(查询采购成本分析(产品仓库维度) 产品+单据+物流单 列表): queryImageForProductDocumentLogistics
export function queryImageForProductDocumentLogistics(data) {
  return request({
    url: '/inventory/purchaseCostProductWarehouse/queryImageForProductWarehouseDocumentLogistics',
    method: 'post',
    data: data
  })
}
// 查询采购成本分析(产品仓库维度) 产品+单据+物流单+变更记录 列表: queryPurchaseCostProductWarehouseDocumentLogisticsRevisedList
export function queryPurchaseCostProductWarehouseDocumentLogisticsRevisedList(data) {
  return request({
    url: '/inventory/purchaseCostProductWarehouse/queryPurchaseCostProductWarehouseDocumentLogisticsRevisedList',
    method: 'post',
    data: data
  })
}
// 查询汇总数据(根据产品仓库): querySummaryListByProductWarehouse (productId, warehouseId)
export function querySummaryListByProductWarehouse(data) {
  return request({
    url: '/inventory/purchaseCostProductWarehouse/querySummaryListByProductWarehouse',
    method: 'post',
    data: data
  })
}
// 查询汇总数据(根据产品仓库+关联单): querySummaryListByProductWarehouseDocument (productId, warehouseId, documentId)
export function querySummaryListByProductWarehouseDocument(data) {
  return request({
    url: '/inventory/purchaseCostProductWarehouse/querySummaryListByProductWarehouseDocument',
    method: 'post',
    data: data
  })
}
