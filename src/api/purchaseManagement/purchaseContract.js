
import request from '@/utils/request'

// 查询PC可以选择的仓库列表：  /inventory/warehouse/queryPCCanSelectWarehouseList
export function queryPCCanSelectWarehouseList(data) {
  return request({
    url: '/inventory/warehouse/queryPCCanSelectWarehouseList',
    method: 'post',
    data: data
  })
}

// 查询PC的供应商列表： /system/businessPartner/queryPCCanSelectVendorListForNoSheet
export function queryPCCanSelectVendorListForNoSheet(data) {
  return request({
    url: '/system/businessPartner/queryPCCanSelectVendorListForNoSheet',
    method: 'post',
    data: data
  })
}

// 查询PC贸易形式： /system/common/queryIncotermList
export function queryIncotermList(data) {
  return request({
    url: '/system/common/queryIncotermList',
    method: 'post',
    data: data
  })
}

// 付款地址 /system/businessPartner/queryAddressByBusinessPartnerId
export function queryAddressByBusinessPartnerId(data) {
  return request({
    url: '/system/businessPartner/queryAddressByBusinessPartnerId',
    method: 'post',
    data: data
  })
}

// 地址 /system/businessPartner/queryAddressByBusinessPartnerIdFromProductSheet
export function queryAddressByBusinessPartnerIdFromProductSheet(data) {
  return request({
    url: '/system/businessPartner/queryAddressByBusinessPartnerIdFromProductSheet',
    method: 'post',
    data: data
  })
}

// 新增采购合同 /purchaseContract/savePurchaseContract
export function savePurchaseContract(data) {
  return request({
    url: '/purchase/purchaseContract/savePurchaseContract',
    method: 'post',
    data: data
  })
}

// 采购合同保存草稿 /purchaseContract/saveDraftPurchaseContract
export function saveDraftPurchaseContract(data) {
  return request({
    url: '/purchase/purchaseContract/saveDraftPurchaseContract',
    method: 'post',
    data: data
  })
}

// 主列表 /purchaseContract/queryPurchaseContractList
export function queryPurchaseContractList(data) {
  return request({
    url: '/purchase/purchaseContract/queryPurchaseContractList',
    method: 'post',
    data: data
  })
}

// 主页面下拉搜索 /purchaseContract/querySearchList
export function querySearchList(data) {
  return request({
    url: '/purchase/purchaseContract/querySearchList',
    method: 'post',
    data: data
  })
}

// 操作日志 /purchaseContract/queryPCOperationLog
export function queryPCOperationLog(data) {
  return request({
    url: '/purchase/purchaseContract/queryPCOperationLog',
    method: 'post',
    data: data
  })
}

// 合同详情 /purchaseContract/queryPurchaseContractById
export function queryPurchaseContractById(data) {
  return request({
    url: '/purchase/purchaseContract/queryPurchaseContractById',
    method: 'post',
    data: data
  })
}

// 审批同意 /purchaseContract/approvedPurchaseContract
export function approvedPurchaseContract(data) {
  return request({
    url: '/purchase/purchaseContract/approvedPurchaseContract',
    method: 'post',
    data: data
  })
}

// 审批拒绝 /purchaseContract/rejectedPurchaseContract
export function rejectedPurchaseContract(data) {
  return request({
    url: '/purchase/purchaseContract/rejectedPurchaseContract',
    method: 'post',
    data: data
  })
}

// 审批取消 /purchaseContract/cancelledPC
export function cancelledPC(data) {
  return request({
    url: '/purchase/purchaseContract/cancelledPC',
    method: 'post',
    data: data
  })
}

// 版本对比 /purchaseContract/queryUpdateMsgPC
export function queryUpdateMsgPC(data) {
  return request({
    url: '/purchase/purchaseContract/queryUpdateMsgPC',
    method: 'post',
    data: data
  })
}

// revise PC /purchaseContract/revisePurchaseContract
export function revisePurchaseContract(data) {
  return request({
    url: '/purchase/purchaseContract/revisePurchaseContract',
    method: 'post',
    data: data
  })
}

// 版本下拉 PC /purchaseContract/queryPurchaseContractHistoryVersion
export function queryPurchaseContractHistoryVersion(data) {
  return request({
    url: '/purchase/purchaseContract/queryPurchaseContractHistoryVersion',
    method: 'post',
    data: data
  })
}

// 库存单位 PC /system/product/calculateProductInventoryUnitPrice
export function calculateProductInventoryUnitPrice(data) {
  return request({
    url: '/system/product/calculateProductInventoryUnitPrice',
    method: 'post',
    data: data
  })
}
