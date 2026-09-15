import request from '@/utils/request'

// 下拉搜索查询(供应商-产品-订单): purchase/report/supplierSummary/querySearchListForSupplierProductOrder
export function querySearchListForSupplierProductOrder(data) {
  return request({
    url: '/purchase/report/supplierSummary/querySearchListForSupplierProductOrder',
    method: 'post',
    data: data
  })
}

// 列表查询(供应商-产品-订单): purchase/report/supplierSummary/queryListForSupplierProductOrder
export function queryListForSupplierProductOrder(data) {
  return request({
    url: '/purchase/report/supplierSummary/queryListForSupplierProductOrder',
    method: 'post',
    data: data
  })
}

// 列表查询(供应商-产品): purchase/report/supplierSummary/queryListForSupplierProduct
export function queryListForSupplierProduct(data) {
  return request({
    url: '/purchase/report/supplierSummary/queryListForSupplierProduct',
    method: 'post',
    data: data
  })
}

// 列表查询(供应商-产品): purchase/report/supplierSummary/queryListForSupplier
export function queryListForSupplier(data) {
  return request({
    url: '/purchase/report/supplierSummary/queryListForSupplier',
    method: 'post',
    data: data
  })
}

// 图表分析查询(供应商):  purchase/report/supplierSummary/queryImageForSupplier
export function queryImageForSupplier(data) {
  return request({
    url: '/purchase/report/supplierSummary/queryImageForSupplier',
    method: 'post',
    data: data
  })
}
// 图表分析查询(供应商-产品): purchase/report/supplierSummary/queryImageForSupplierProduct
export function queryImageForSupplierProduct(data) {
  return request({
    url: '/purchase/report/supplierSummary/queryImageForSupplierProduct',
    method: 'post',
    data: data
  })
}

// 下拉搜索查询(供应商-产品分析): purchase/report/supplierSummary/querySearchListForSupplierProduct
export function querySearchListForSupplierProduct(data) {
  return request({
    url: '/purchase/report/supplierSummary/querySearchListForSupplierProduct',
    method: 'post',
    data: data
  })
}
