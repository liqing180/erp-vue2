import request from '@/utils/request'
// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/inventory/inventoryAudit/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 查询用户最后选择的仓库 (GET无需参数)
export function getLastWarehouseMsg() {
  return request({
    url: '/inventory/warehouse/getLastWarehouseMsg',
    method: 'get'
  })
}
// 下拉搜索值查询:
export function querySearchListForERP(data) {
  return request({
    url: '/inventory/inventoryAudit/querySearchListForERP',
    method: 'post',
    data: data
  })
}
// 查询业务单据列表
export function queryInventoryAuditListForERP(data) {
  return request({
    url: '/inventory/inventoryAudit/queryInventoryAuditListForERP',
    method: 'post',
    data: data
  })
}
// 查询盘点单可以选择的销售订单列表:  (参数: warehouseId , conditionForSO)
export function queryCanSelectSalesOrderListFromInventoryAudit(data) {
  return request({
    url: '/sales/salesOrder/queryCanSelectSalesOrderListFromInventoryAudit',
    method: 'post',
    data: data
  })
}
// 查询可以选择的仓库结构: (参数: warehouseId)
export function queryActiveWarehouseStructureTreeList(data) {
  return request({
    url: '/inventory/warehouseStructure/queryActiveWarehouseStructureTreeList',
    method: 'post',
    data: data
  })
}
// 查询可以选择的产品分类:  (参数: warehouseId, warehouseStructureIdList)
export function queryAuditCategoryTreeList(data) {
  return request({
    url: '/inventory/inventoryAudit/queryAuditCategoryTreeList',
    method: 'post',
    data: data
  })
}
// 查询可以选择的用户列表:
export function queryUsersNeedSameDepartment(data) {
  return request({
    url: '/system/userNew/queryUsersNeedSameDepartment',
    method: 'post',
    data: data
  })
}

// WMS查询盘点对应的产品列表:  (参数: warehouseId, warehouseStructureIdList, productCategoryIdList)
export function queryAuditCanSelectProductListForERP(data) {
  return request({
    url: '/inventory/inventoryAudit/queryAuditCanSelectProductListForERP',
    method: 'post',
    data: data
  })
}

// 提交单据:
export function saveInventoryAudit(data) {
  return request({
    url: '/inventory/inventoryAudit/saveInventoryAudit',
    method: 'post',
    data: data
  })
}
// 查询具体业务单据
export function queryInventoryAuditByIdForERP(data) {
  return request({
    url: '/inventory/inventoryAudit/queryInventoryAuditByIdForERP',
    method: 'post',
    data: data
  })
}
// 查询库存盘点的操作日志
export function queryOperationLogList(data) {
  return request({
    url: '/inventory/inventoryAudit/queryOperationLogList',
    method: 'post',
    data: data
  })
}
// 开始盘点
export function startAudit(data) {
  return request({
    url: '/inventory/inventoryAudit/startAudit',
    method: 'post',
    data: data
  })
}
// 结束盘点:
export function endAudit(data) {
  return request({
    url: '/inventory/inventoryAudit/endAudit',
    method: 'post',
    data: data
  })
}
/* *********** */
// 审批同意
export function approvedInventoryAudit(data) {
  return request({
    url: '/inventory/inventoryAudit/approvedInventoryAudit',
    method: 'post',
    data: data
  })
}
// 审批拒绝
export function rejectedInventoryAudit(data) {
  return request({
    url: '/inventory/inventoryAudit/rejectedInventoryAudit',
    method: 'post',
    data: data
  })
}
// 取消调拨单
export function cancelledInventoryAudit(data) {
  return request({
    url: '/inventory/inventoryAudit/cancelledInventoryAudit',
    method: 'post',
    data: data
  })
}
// 查询单据和上一次的修订对比
export function queryUpdateMsgInventoryAuditForERP(data) {
  return request({
    url: '/inventory/inventoryAudit/queryUpdateMsgInventoryAuditForERP',
    method: 'post',
    data: data
  })
}
// 导入盘点的产品数据: //(POST, 参数: inventoryAuditId)
export function importInventoryAuditProduct(data) {
  return request({
    url: '/inventory/inventoryAudit/importInventoryAuditProduct?updateSupport=0',
    method: 'post',
    data: data.formData
  })
}

// 调整: WMS查询调整可以选择对应的产品列表 (参数: warehouseId, alreadySelectLabelDetailIdList)
export function queryAdjustmentCanSelectProductListForWMS(data) {
  return request({
    url: '/inventory/inventoryAudit/queryAdjustmentCanSelectProductListForWMS',
    method: 'post',
    data: data
  })
}

// 导入盘点的产品数据: //(POST, 参数: inventoryAuditId)
export function importInventoryAdjustmentProduct(data) {
  return request({
    url: '/inventory/inventoryAudit/importInventoryAdjustmentProduct?updateSupport=0',
    method: 'post',
    data: data.formData
  })
}

/* 调整: 导出需要调整的产品数据: inventory/inventoryAudit/exportInventoryAdjustmentProduct
调整: 调整的产品数据导入正确性验证: inventory/inventoryAudit/checkImportInventoryAdjustmentProduct
调整: 导入调整的产品数据: inventory/inventoryAudit/importInventoryAdjustmentProduct */
