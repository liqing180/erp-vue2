import request from '@/utils/request'

// 列表查询(供应商): /report/supplierReturn/queryListForSupplier
export function queryListForSupplier(data) {
  return request({
    url: '/purchase/report/supplierReturn/queryListForSupplier',
    method: 'post',
    data: data
  })
}

// 下拉搜索值查询(供应商-产品): /report/supplierReturn/querySearchListForSupplierProduct
export function querySearchListForSupplierProduct(data) {
  return request({
    url: '/purchase/report/supplierReturn/querySearchListForSupplierProduct',
    method: 'post',
    data: data
  })
}

// 列表查询(供应商-产品): /report/supplierReturn/queryListForSupplierProduct
export function queryListForSupplierProduct(data) {
  return request({
    url: '/purchase/report/supplierReturn/queryListForSupplierProduct',
    method: 'post',
    data: data
  })
}

// 下拉搜索查询(供应商-产品-订单): /report/supplierReturn/querySearchListForSupplierProductOrder
export function querySearchListForSupplierProductOrder(data) {
  return request({
    url: '/purchase/report/supplierReturn/querySearchListForSupplierProductOrder',
    method: 'post',
    data: data
  })
}
// 列表查询(供应商-产品-订单): /report/supplierReturn/queryListForSupplierProductOrder
export function queryListForSupplierProductOrder(data) {
  return request({
    url: '/purchase/report/supplierReturn/queryListForSupplierProductOrder',
    method: 'post',
    data: data
  })
}

// 查询退货原因集合: purchase/report/supplierReturn/queryReturnReasonList (businessPartnerId, productId)
export function queryReturnReasonList(data) {
  return request({
    url: '/purchase/report/supplierReturn/queryReturnReasonList',
    method: 'post',
    data: data
  })
}

// purchase/report/supplierReturn/queryImageForSupplier
export function queryImageForSupplier(data) {
  return request({
    url: '/purchase/report/supplierReturn/queryImageForSupplier',
    method: 'post',
    data: data
  })
}

// purchase/report/supplierReturn/queryImageForSupplierProduct
export function queryImageForSupplierProduct(data) {
  return request({
    url: '/purchase/report/supplierReturn/queryImageForSupplierProduct',
    method: 'post',
    data: data
  })
}
