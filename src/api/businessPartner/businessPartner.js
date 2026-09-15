import request from '@/utils/request'

// 查询用户当前可以选择的部门列表
export function queryUserDepartment(data) {
  return request({
    url: '/system/userNew/queryUserDepartment',
    method: 'post',
    data: data
  })
}
// BP主页面查询: system/businessPartner/queryBusinessPartnerList
export function queryBusinessPartnerList(data) {
  return request({
    url: '/system/businessPartner/queryBusinessPartnerList',
    method: 'post',
    data: data
  })
}
// BP主页下拉搜索: system/businessPartner/querySearchList
export function querySearchList(data) {
  return request({
    url: '/system/businessPartner/querySearchList',
    method: 'post',
    data: data
  })
}
// BP具体单据查询: system/businessPartner/queryBusinessPartnerById/{businessPartnerMainId}
export function queryBusinessPartnerById(id, taskId) {
  return request({
    url: '/system/businessPartner/queryBusinessPartnerById/' + id + (taskId ? `/${taskId}` : ''),
    method: 'get'
  })
}
// BP草稿保存: system/businessPartner/saveDraftBusinessPartner
export function saveDraftBusinessPartner(data) {
  return request({
    url: '/system/businessPartner/saveDraftBusinessPartner',
    method: 'post',
    data: data
  })
}
// BP的提交: system/businessPartner/saveDraftBusinessPartner
export function saveBusinessPartner(data) {
  return request({
    url: '/system/businessPartner/saveBusinessPartner',
    method: 'post',
    data: data
  })
}

// Revise BP: system/businessPartner/reviseBusinessPartner
export function reviseBusinessPartner(data) {
  return request({
    url: '/system/businessPartner/reviseBusinessPartner',
    method: 'post',
    data: data
  })
}
// 审批同意BP: system/businessPartner/approvedBusinessPartner
export function approvedBusinessPartner(data) {
  return request({
    url: '/system/businessPartner/approvedBusinessPartner',
    method: 'post',
    data: data
  })
}
// 审批拒绝BP: system/businessPartner/rejectedBusinessPartner
export function rejectedBusinessPartner(data) {
  return request({
    url: '/system/businessPartner/rejectedBusinessPartner',
    method: 'post',
    data: data
  })
}

// 撤回重新修改
export function withdrawApproved(data) {
  return request({
    url: '/system/businessPartner/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 批量修改BP是否活跃: system/businessPartner/changeBPIsActive (参数: isActive businessPartnerMainIdList)
// 批量角色修改 status
export function changeBPIsActive(ids, isActive) {
  const data = {
    businessPartnerMainIdList: ids,
    isActive
  }
  return request({
    url: '/system/businessPartner/changeBPIsActive',
    method: 'post',
    data: data
  })
}

// 查询BP单据和上一次的修订对比: system/businessPartner/queryUpdateMsgBP  (参数: businessPartnerMainId)
export function queryUpdateMsgBP(data) {
  return request({
    url: '/system/businessPartner/queryUpdateMsgBP',
    method: 'post',
    data: data
  })
}
/* 查询BP历史的联系人职位 */
export function queryPositionList() {
  return request({
    url: '/system/businessPartner/queryPositionList',
    method: 'get'
  })
}

// 查询BP的历史版本下拉: system/businessPartner/queryBPHistoryVersion
export function queryBPHistoryVersion(data) {
  return request({
    url: '/system/businessPartner/queryBPHistoryVersion',
    method: 'post',
    data: data
  })
}

// 导入
export function importData(data) {
  return request({
    url: '/system/businessPartner/importData?updateSupport=0',
    method: 'post',
    data: data.formData
  })
}

// mdm/project/queryProjectCanAddMixDesignSalesPriceList
export function queryProjectCanAddMixDesignSalesPriceList(data) {
  return request({
    url: '/system/mdm/project/queryProjectCanAddMixDesignSalesPriceList',
    method: 'post',
    data: data
  })
}

// /system/businessPartner/customerAddress/checkInRange
export function checkInRange(data) {
  return request({
    url: '/system/businessPartner/customerAddress/checkInRange',
    method: 'post',
    data: data
  })
}

// 分页获取车辆列表:system/cds/queryTruckList
export function queryTruckList(data) {
  return request({
    url: '/system/cds/queryTruckList',
    method: 'post',
    data: data
  })
}
// 获取区域下的搅拌站:system/cds/queryTruckPlantForZoneId
export function queryTruckPlantForZoneId(data) {
  return request({
    url: '/system/cds/queryTruckPlantForZoneId',
    method: 'post',
    data: data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/system/businessPartner/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/system/businessPartner/revisionDiff',
    method: 'post',
    data
  })
}
