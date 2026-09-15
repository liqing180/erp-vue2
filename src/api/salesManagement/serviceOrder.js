import request from '@/utils/request'

// 下拉搜索值查询: /sales/serviceOrder/querySearchList
export function querySearchList(data) {
  return request({
    url: '/sales/serviceOrder/querySearchList',
    method: 'post',
    data: data
  })
}

// 服务订单管理,查询 服务订单 列表: /sales/serviceOrder/queryServiceOrderList
export function queryServiceOrderList(data) {
  return request({
    url: '/sales/serviceOrder/queryServiceOrderList',
    method: 'post',
    data: data
  })
}

// 服务订单管理,查询具体 服务订单:  /sales/serviceOrder/queryServiceOrderById
export function queryServiceOrderById(data) {
  return request({
    url: '/sales/serviceOrder/queryServiceOrderById',
    method: 'post',
    data: data
  })
}

// 服务订单管理,服务订单,修改: /sales/serviceOrder/updateServiceOrder
export function updateServiceOrder(data) {
  return request({
    url: '/sales/serviceOrder/updateServiceOrder',
    method: 'post',
    data: data
  })
}

// 服务订单管理,服务订单,保存单据: /sales/serviceOrder/saveServiceOrder
export function saveServiceOrder(data) {
  return request({
    url: '/sales/serviceOrder/saveServiceOrder',
    method: 'post',
    data: data
  })
}

// 服务订单管理,服务订单,查询服务订单的操作日志: /sales/serviceOrder/queryServiceOrderOperationLog
export function queryServiceOrderOperationLog(data) {
  return request({
    url: '/sales/serviceOrder/queryServiceOrderOperationLog',
    method: 'post',
    data: data
  })
}

// 弹窗选借货单主列表：inventory/storeIssueChit/queryStoreIssueChitListFromServiceOrder
export function queryStoreIssueChitListFromServiceOrder(data) {
  return request({
    url: '/inventory/storeIssueChit/queryStoreIssueChitListFromServiceOrder',
    method: 'post',
    data: data
  })
}

// 弹窗选虚拟产品：
export function queryCanSelectProductListFromServiceOrder(data) {
  return request({
    url: '/system/product/queryCanSelectProductListFromServiceOrder',
    method: 'post',
    data: data
  })
}
