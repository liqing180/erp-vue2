import request from '@/utils/request'

const IS_DEV_ENV = process.env.NODE_ENV === 'development'
const WS_BASE_URL = (() => {
  const { protocol, host } = window.location
  let serv = ''
  if (protocol === 'http:') {
    serv = `ws://${host}${process.env.VUE_APP_BASE_API}`
  } else {
    serv = `wss://${host}${process.env.VUE_APP_BASE_API}`
  }
  return IS_DEV_ENV ? process.env.VUE_APP_WSURL : process.env.VUE_APP_WSURL || serv
})()

// 何时去取未读的消息 /websocket/notice/{userId}
export const wsNotice = (userId) => {
  return `${WS_BASE_URL}/system/websocket/notice/${userId}/1`
}
// POST /notify/markRead 标记为已读状态
export function markRead(data) {
  return request({
    url: '/system/notify/markRead',
    method: 'post',
    data: data
  })
}

// POST /notify/queryMessage 消息通知查询
export function queryMessage(data) {
  return request({
    url: '/system/notify/queryMessage',
    method: 'post',
    data: data
  })
}

// POST 查询通知类型接口
export function queryTaskNotificationsType(data) {
  return request({
    url: '/system/notify/queryTaskNotificationsType',
    method: 'post',
    data: data
  })
}

// GET notify/unread 获取登录人未读数量
export function unread(query) {
  return request({
    url: '/system/notify/unread',
    method: 'get',
    params: query
  })
}

export function queryMessageContent(data) {
  return request({
    url: '/system/notify/queryMessageContent',
    method: 'post',
    data: data
  })
}
// messageIdList
export function queryMessageContentBatch(data) {
  return request({
    url: '/system/notify/queryMessageContentBatch',
    method: 'post',
    data: data
  })
}

export function buttonNoPunish(data) {
  return request({
    url: '/mdm/driverPunish/buttonNoPunish',
    method: 'post',
    data: data
  })
}
export function buttonAgreePunish(data) {
  return request({
    url: '/mdm/driverPunish/buttonAgreePunish',
    method: 'post',
    data: data
  })
}
