import request from '@/utils/request'

// 各个页签数据数量查询
export function queryLabelCount(data) {
  return request({
    url: '/sales/deliveryOrder/queryLabelCount',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询:
export function querySearchList(data) {
  return request({
    url: '/sales/deliveryOrder/querySearchList',
    method: 'post',
    data: data
  })
}
// 查询业务单据列表
export function queryDeliveryOrderList(data) {
  return request({
    url: '/sales/deliveryOrder/queryDeliveryOrderList',
    method: 'post',
    data: data
  })
}
// 查询具体运单
export function queryDeliveryOrderById(data) {
  return request({
    url: '/sales/deliveryOrder/queryDeliveryOrderById',
    method: 'post',
    data: data
  })
}
// 进行签收
export function acknowledgeDeliveryOrder(data) {
  return request({
    url: '/sales/deliveryOrder/acknowledgeDeliveryOrder',
    method: 'post',
    data: data
  })
}

// 发送E-DO
export function sendEDo(data) {
  return request({
    url: '/sales/deliveryOrder/sendEDo',
    method: 'post',
    data: data
  })
}

// 查询产品行拒收信息: 参数 deliveryOrderProductId
export function queryDetailRejectedMsg(data) {
  return request({
    url: '/sales/deliveryOrder/queryDetailRejectedMsg',
    method: 'post',
    data: data
  })
}

// 选择发货通知单和选择调拨单, 分成两个页签
// 选择发货通知单: sales/deliveryOrder/queryCanAddDeliveryOrderPreDeliveryNoticeList (condition, conditionForPreDeliveryNoticeNo)
export function queryCanAddDeliveryOrderPreDeliveryNoticeList(data) {
  return request({
    url: '/sales/deliveryOrder/queryCanAddDeliveryOrderPreDeliveryNoticeList',
    method: 'post',
    data: data
  })
}
// 选择调拨单: inventory/transferOrder/queryCanAddDeliveryOrderTransferOrderList
// (额外处理: 创建调拨单的时候, 传参数 salesQuotationType)
export function queryCanAddDeliveryOrderTransferOrderList(data) {
  return request({
    url: '/inventory/transferOrder/queryCanAddDeliveryOrderTransferOrderList',
    method: 'post',
    data: data
  })
}
// 提交: sales/deliveryOrder/createDeliveryOrder (对象包集合 deliveryOrderDocumentList)
export function createDeliveryOrder(data) {
  return request({
    url: '/sales/deliveryOrder/createDeliveryOrder',
    method: 'post',
    data: data
  })
}

// sales/deliveryOrder/cancelledDeliveryOrder businessId
export function cancelledDeliveryOrder(data) {
  return request({
    url: '/sales/deliveryOrder/cancelledDeliveryOrder',
    method: 'post',
    data: data
  })
}

// 验证是否可以签收或拒收： deliveryOrderId
export function checkAcknowledgeOrRejectedIsTrue(data) {
  return request({
    url: '/sales/deliveryOrder/checkAcknowledgeOrRejectedIsTrue',
    method: 'post',
    data: data
  })
}
