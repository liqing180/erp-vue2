import request from '@/utils/request'

export function queryScrapById(data) {
  return request({
    url: '/inventory/scrap/queryScrapById',
    method: 'post',
    data: data
  })
}

// 获取编号类型:  (labelNo)
export function getLabelNoType(data) {
  return request({
    url: '/inventory/picked/getLabelNoType',
    method: 'post',
    data: data
  })
}

// 标签号查询详情信息
export function queryLabelDetailByNo(data) {
  return request({
    url: '/inventory/scrap/queryLabelDetailByNo',
    method: 'post',
    data: data
  })
}
// 提交 报废
export function saveScrap(data) {
  return request({
    url: '/inventory/scrap/saveScrap',
    method: 'post',
    data: data
  })
}
// 撤回审批：
export function withdrawApproved(data) {
  return request({
    url: '/inventory/scrap/withdrawApproved',
    method: 'post',
    data: data
  })
}
// 审批同意 EGR:
export function approvedScrap(data) {
  return request({
    url: '/inventory/scrap/approvedScrap',
    method: 'post',
    data: data
  })
}
// 审批拒绝 EGR：
export function rejectedScrap(data) {
  return request({
    url: '/inventory/scrap/rejectedScrap',
    method: 'post',
    data: data
  })
}
// 审批取消：
export function cancelledScrap(data) {
  return request({
    url: '/inventory/scrap/cancelledScrap',
    method: 'post',
    data: data
  })
}

// 报废校验位置代码：
export function checkLocationCodeForScrap(data) {
  return request({
    url: '/inventory/scrap/checkLocationCodeForScrap',
    method: 'post',
    data: data
  })
}

// 报废校验标签位置库存:
export function checkLabelInventoryForScrap(data) {
  return request({
    url: '/inventory/scrap/checkLabelInventoryForScrap',
    method: 'post',
    data: data
  })
}

// 报废查询位置可选无码产品:
export function queryNonLabelProductListForScrap(data) {
  return request({
    url: '/inventory/scrap/queryNonLabelProductListForScrap',
    method: 'post',
    data: data
  })
}

// 同一主键的修改快照版本（包含 CURRENT）。
export function queryRevisionVersions(businessId) {
  return request({
    url: `/inventory/scrap/${encodeURIComponent(businessId)}/revisionVersions`,
    method: 'get'
  })
}

export function compareRevisionDiff(data) {
  return request({
    url: '/inventory/scrap/revisionDiff',
    method: 'post',
    data
  })
}
