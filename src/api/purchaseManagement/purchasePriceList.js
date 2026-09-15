
import request from '@/utils/request'

// 主列表 /purchasePriceList/queryPurchasePriceListList
export function queryPurchasePriceListList(data) {
  return request({
    url: '/purchase/purchasePriceList/queryPurchasePriceListList',
    method: 'post',
    data: data
  })
}

// 搜索 /purchasePriceList/querySearchList
export function querySearchList(data) {
  return request({
    url: '/purchase/purchasePriceList/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询：/purchasePriceList/getById/{productId}
export function getById(id) {
  return request({
    url: '/purchase/purchasePriceList/getById/' + id,
    method: 'get'
  })
}

// 饼图: /purchase/purchasePriceList/queryImageForSupplier（productId）
export function queryImageForSupplier(data) {
  return request({
    url: '/purchase/purchasePriceList/queryImageForSupplier',
    method: 'post',
    data: data
  })
}

// 采购单价分析查询(供应商)
// /purchase/purchasePriceList/queryUnitPriceAnalysisForSupplier
// (productId,type) type:查询类型（1.近10次;2.近6个月均价;3.近1年月均价
export function queryUnitPriceAnalysisForSupplier(data) {
  return request({
    url: '/purchase/purchasePriceList/queryUnitPriceAnalysisForSupplier',
    method: 'post',
    data: data
  })
}
