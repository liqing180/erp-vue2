import request from '@/utils/request'

// 查询用户当前可以选择的部门列表
export function queryUserDepartment(data) {
  return request({
    url: '/system/userNew/queryUserDepartment',
    method: 'post',
    data: data
  })
}
// 产品主页面查询
export function queryProductList(data) {
  return request({
    url: '/system/product/queryProductList',
    method: 'post',
    data: data
  })
}

// 具体单据查询
export function queryProductById(id, taskId) {
  return request({
    url: '/system/product/queryProductById/' + id + (taskId ? `/${taskId}` : ''),
    method: 'get'
  })
}
// 草稿保存
export function saveDraftProduct(data) {
  return request({
    url: '/system/product/saveDraftProduct',
    method: 'post',
    data: data
  })
}
// 草稿编辑页面提交, 与审批流过程中提交
export function saveProduct(data) {
  return request({
    url: '/system/product/saveProduct',
    method: 'post',
    data: data
  })
}

// Revise
export function reviseProduct(data) {
  return request({
    url: '/system/product/reviseProduct',
    method: 'post',
    data: data
  })
}
// 审批同意
export function approvedProduct(data) {
  return request({
    url: '/system/product/approvedProduct',
    method: 'post',
    data: data
  })
}
// 审批拒绝
export function rejectedProduct(data) {
  return request({
    url: '/system/product/rejectedProduct',
    method: 'post',
    data: data
  })
}
// 取消产品
export function cancelledProduct(data) {
  return request({
    url: '/system/product/cancelledProduct',
    method: 'post',
    data: data
  })
}

// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/system/product/withdrawApproved',
    method: 'post',
    data: data
  })
}

// 批量修改是否活跃
export function changeProductIsActive(ids, isActive) {
  const data = {
    productMainIdList: ids,
    isActive
  }
  return request({
    url: '/system/product/changeProductIsActive',
    method: 'post',
    data: data
  })
}

// 查询单据和上一次的修订对比
export function queryUpdateMsgProduct(data) {
  return request({
    url: '/system/product/queryUpdateMsgProduct',
    method: 'post',
    data: data
  })
}

// 查询历史版本下拉
export function queryProductHistoryVersion(data) {
  return request({
    url: '/system/product/queryProductHistoryVersion',
    method: 'post',
    data: data
  })
}

// 导入
export function importData(data) {
  return request({
    url: '/system/product/importData?updateSupport=0',
    method: 'post',
    data: data.formData
  })
}

// 根据产品名称查询对应的产品: system/product/queryProductByProductName (POST, 参数: productName)
export function queryProductByProductName(data) {
  return request({
    url: '/system/product/queryProductByProductName',
    method: 'post',
    data
  })
}

// 分配产品给法人公司 (productIdList, legalEntityIdList)
export function assignProductToLegalEntitys(data) {
  return request({
    url: '/system/product/assignProductToLegalEntitys',
    method: 'post',
    data
  })
}

// 修改法人产品
export function updateLegalEntityProduct(data) {
  return request({
    url: '/system/product/updateLegalEntityProduct',
    method: 'post',
    data
  })
}

// 查询套装组合可以选择的产品列表:
export function querySetCombinationCanSelectProductList(data) {
  return request({
    url: '/system/product/querySetCombinationCanSelectProductList',
    method: 'post',
    data
  })
}

// 批量分配图片给产品: (commonFileList)
export function batchImageToProduct(data) {
  return request({
    url: '/system/product/batchImageToProduct',
    method: 'post',
    data
  })
}
// productMainIdList commonFileList
export function batchAssignImagesToProducts(data) {
  return request({
    url: '/system/product/batchAssignImagesToProducts',
    method: 'post',
    data
  })
}

// /system/product/getTempInternalPartNo
export function getTempInternalPartNo(data) {
  return request({
    url: '/system/product/getTempInternalPartNo',
    method: 'post',
    data
  })
}

// system/product/queryAllBrandList 查询品牌列表
export function queryAllBrandList(data) {
  return request({
    url: '/system/product/queryAllBrandList',
    method: 'get',
    data
  })
}

// 检查库存单位: (productMainId,inventoryUom)
export function checkInventoryUom(data) {
  return request({
    url: '/system/product/checkInventoryUom',
    method: 'post',
    data
  })
}

// 校验产品是否可以取消：system/product/checkProductCanCancelled (businessId)返回值：1，可以被取消
export function checkProductCanCancelled(data) {
  return request({
    url: '/system/product/checkProductCanCancelled',
    method: 'post',
    data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/system/product/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/system/product/revisionDiff',
    method: 'post',
    data
  })
}
