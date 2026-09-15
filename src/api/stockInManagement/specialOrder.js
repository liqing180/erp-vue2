import request from '@/utils/request'

// 特采订单管理,查询具体 特采
export function querySpecialOrderById(data) {
  return request({
    url: '/inventory/specialOrder/querySpecialOrderById',
    method: 'post',
    data: data
  })
}

// 审批同意
export function approvedSpecialOrder(data) {
  return request({
    url: '/inventory/specialOrder/approvedSpecialOrder',
    method: 'post',
    data: data
  })
}
// 审批拒绝
export function rejectedSpecialOrder(data) {
  return request({
    url: '/inventory/specialOrder/rejectedSpecialOrder',
    method: 'post',
    data: data
  })
}
