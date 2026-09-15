import request from '@/utils/request'

// 查询 供应商合同 列表：/supplierContract/querySupplierContractList
export function querySupplierContractList(data) {
  return request({
    url: '/purchase/supplierContract/querySupplierContractList',
    method: 'post',
    data: data
  })
}
// 查询具体 供应商合同：/supplierContract/querySupplierContractById （supplierContractId）
export function querySupplierContractById(data) {
  return request({
    url: '/purchase/supplierContract/querySupplierContractById',
    method: 'post',
    data: data
  })
}

// 查询供应商合同可以选择的采购订单列表：/supplierContract/queryCanSelectPurchaseOrderList
export function queryCanSelectPurchaseOrderList(data) {
  return request({
    url: '/purchase/supplierContract/queryCanSelectPurchaseOrderList',
    method: 'post',
    data: data
  })
}
// 保存草稿：/supplierContract/saveDraftSupplierContract
export function saveDraftSupplierContract(data) {
  return request({
    url: '/purchase/supplierContract/saveDraftSupplierContract',
    method: 'post',
    data: data
  })
}
// 提交 供应商合同：/supplierContract/saveSupplierContract
export function saveSupplierContract(data) {
  return request({
    url: '/purchase/supplierContract/saveSupplierContract',
    method: 'post',
    data: data
  })
}
