import request from '@/utils/request'

// 列表查询(供应商): /report/supplierDeliveryRateAnalysis/queryListForSupplier
export function queryListForSupplier(data) {
  return request({
    url: '/purchase/report/supplierDeliveryRateAnalysis/queryListForSupplier',
    method: 'post',
    data: data
  })
}

// 下拉搜索查询(供应商-产品-订单): /report/supplierDeliveryRateAnalysis/querySearchListForSupplierProductOrder
export function querySearchListForSupplierProductOrder(data) {
  return request({
    url: '/purchase/report/supplierDeliveryRateAnalysis/querySearchListForSupplierProductOrder',
    method: 'post',
    data: data
  })
}

// 下拉搜索值查询(供应商-产品): /report/supplierDeliveryRateAnalysis/querySearchListForSupplierProduct
export function querySearchListForSupplierProduct(data) {
  return request({
    url: '/purchase/report/supplierDeliveryRateAnalysis/querySearchListForSupplierProduct',
    method: 'post',
    data: data
  })
}
// 列表查询(供应商-产品): /report/supplierDeliveryRateAnalysis/queryListForSupplierProduct
export function queryListForSupplierProduct(data) {
  return request({
    url: '/purchase/report/supplierDeliveryRateAnalysis/queryListForSupplierProduct',
    method: 'post',
    data: data
  })
}

// 列表查询(供应商-产品-订单): /report/supplierDeliveryRateAnalysis/queryListForSupplierProductOrder
//        三级点击进去,锁死字段: businessPartnerId, productId
//        搜索字段: conditionForPurchaseOrderNo, conditionForGoodsReceiptNoteNo, purchasePersonIdList, businessPartnerIdForSearchList
//                        countryIdList, startDateSubmittedTime, endDateSubmittedTime, startDateStockInTime, endDateStockInTime
export function queryListForSupplierProductOrder(data) {
  return request({
    url: '/purchase/report/supplierDeliveryRateAnalysis/queryListForSupplierProductOrder',
    method: 'post',
    data: data
  })
}
