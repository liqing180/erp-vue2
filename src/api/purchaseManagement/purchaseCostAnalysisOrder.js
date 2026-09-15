import request from '@/utils/request'
/** 采购成本 */
// 下拉搜索值: inventory/purchaseCostDocument/querySearchList
export function querySearchList(data) {
  return request({
    url: '/inventory/purchaseCostDocument/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询采购成本(单据维度)列表: inventory/purchaseCostDocument/queryPurchaseCostDocumentList
export function queryPurchaseCostDocumentList(data) {
  return request({
    url: '/inventory/purchaseCostDocument/queryPurchaseCostDocumentList',
    method: 'post',
    data: data
  })
}

// 查询具体产品(单据维度)出入库明细: inventory/purchaseCostDocument/queryProductDocumentIOMsgList (productId, documentId)
export function queryProductDocumentIOMsgList(data) {
  return request({
    url: '/inventory/purchaseCostDocument/queryProductDocumentIOMsgList',
    method: 'post',
    data: data
  })
}
// 查询具体产品(单据维度)出入库明细(图表): inventory/purchaseCostDocument/queryImageForPurchaseCostDocument(productId, documentId)
export function queryImageForPurchaseCostDocument(data) {
  return request({
    url: '/inventory/purchaseCostDocument/queryImageForPurchaseCostDocument',
    method: 'post',
    data: data
  })
}
/* 库存成本(单据维度) */
//  下拉搜索值: inventory/inventoryCostDocument/querySearchList
export function icQuerySearchList(data) {
  return request({
    url: '/inventory/inventoryCostDocument/querySearchList',
    method: 'post',
    data: data
  })
}
//  查询库存成本(单据维度)列表: inventory/inventoryCostDocument/queryInventoryCostDocumentList
export function queryInventoryCostDocumentList(data) {
  return request({
    url: '/inventory/inventoryCostDocument/queryInventoryCostDocumentList',
    method: 'post',
    data: data
  })
}

//  查询产品的费用项明细: inventory/inventoryCostDocument/queryInventoryCostDocumentMsg (productId, documentId)
export function queryInventoryCostDocumentMsg(data) {
  return request({
    url: '/inventory/inventoryCostDocument/queryInventoryCostDocumentMsg',
    method: 'post',
    data: data
  })
}
//  查询具体产品库存成本(单据维度)明细(图表): inventory/inventoryCostDocument/queryImageForInventoryCostDocument(productId, documentId)
export function queryImageForInventoryCostDocument(data) {
  return request({
    url: '/inventory/inventoryCostDocument/queryImageForInventoryCostDocument',
    method: 'post',
    data: data
  })
}
