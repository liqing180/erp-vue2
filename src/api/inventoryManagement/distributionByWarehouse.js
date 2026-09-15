import request from '@/utils/request'

// 库存成本分析(产品仓库维度): inventory/inventoryCostProductWarehouse

// 下拉搜索值查询(查询库存成本分析(产品仓库维度) 产品 列表): queryInventoryCostProductWarehouseSearchList
export function queryInventoryCostProductWarehouseSearchList(data) {
  return request({
    url: '/inventory/inventoryCostProductWarehouse/queryInventoryCostProductWarehouseSearchList',
    method: 'post',
    data: data
  })
}
// 查询库存成本分析(产品仓库维度) 产品 列表: queryInventoryCostProductWarehouseList
export function queryInventoryCostProductWarehouseList(data) {
  return request({
    url: '/inventory/inventoryCostProductWarehouse/queryInventoryCostProductWarehouseList',
    method: 'post',
    data: data
  })
}
// 导出数据列表(查询库存成本分析(产品仓库维度) 产品 列表): exportInventoryCostProductWarehouseList
export function exportInventoryCostProductWarehouseList(data) {
  return request({
    url: '/inventory/inventoryCostProductWarehouse/exportInventoryCostProductWarehouseList',
    method: 'post',
    data: data
  })
}
// 查询库存成本分析(产品仓库维度) 产品+单据 列表: queryInventoryCostProductWarehouseDocumentList
export function queryInventoryCostProductWarehouseDocumentList(data) {
  return request({
    url: '/inventory/inventoryCostProductWarehouse/queryInventoryCostProductWarehouseDocumentList',
    method: 'post',
    data: data
  })
}
// 查询库存成本分析(产品仓库维度) 产品+单据+物流单 列表: queryInventoryCostProductWarehouseDocumentLogisticsList
export function queryInventoryCostProductWarehouseDocumentLogisticsList(data) {
  return request({
    url: '/inventory/inventoryCostProductWarehouse/queryInventoryCostProductWarehouseDocumentLogisticsList',
    method: 'post',
    data: data
  })
}
// 查询库存成本分析(产品仓库维度) 产品+单据+物流单+变更记录 列表: queryInventoryCostProductWarehouseDocumentLogisticsRevisedList
export function queryInventoryCostProductWarehouseDocumentLogisticsRevisedList(data) {
  return request({
    url: '/inventory/inventoryCostProductWarehouse/queryInventoryCostProductWarehouseDocumentLogisticsRevisedList',
    method: 'post',
    data: data
  })
}
// 查询汇总数据(根据产品): querySummaryListByProduct
export function querySummaryListByProduct(data) {
  return request({
    url: '/inventory/inventoryCostProductWarehouse/querySummaryListByProduct',
    method: 'post',
    data: data
  })
}
// 查询汇总数据(根据产品+关联单): querySummaryListByProductDocument
export function querySummaryListByProductDocument(data) {
  return request({
    url: '/inventory/inventoryCostProductWarehouse/querySummaryListByProductDocument',
    method: 'post',
    data: data
  })
}
// 查询产品的费用项明细: queryProductInventoryCostSettingsMsg
export function queryProductInventoryCostSettingsMsg(data) {
  return request({
    url: '/inventory/inventoryCostProductWarehouse/queryProductInventoryCostSettingsMsg',
    method: 'post',
    data: data
  })
}
