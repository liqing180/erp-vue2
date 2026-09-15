import request from '@/utils/request'

// POST /behaviour/save 保存/修改用户行为
// export const save = (param) => {
//   return axios.post(`${SYS}/behaviour/save`, param)
// }

// POST /behaviour/queryAllPage 保存/修改用户行为
// export const queryAllPage = (param) => {
//   return axios.post(`${SYS}/behaviour/queryAllPage`, param)
// }

// 新增参数配置
export function save(data) {
  return request({
    url: '/system/behaviour/save',
    method: 'post',
    data: data
  })
}
/* 消息通知单独使用, 获取设置 */
export function queryTaskNotifications(data) {
  return request({
    url: '/system/behaviour/queryTaskNotifications',
    method: 'post',
    data: data
  })
}
/* 工作台单独使用  获取保存的菜单 */
export function queryOperatingFloor(data) {
  return request({
    url: '/system/behaviour/queryOperatingFloor',
    method: 'post',
    data: data
  })
}
export function queryAllPage(data) {
  return request({
    url: '/system/behaviour/queryAllPage',
    method: 'post',
    data: data
  })
}
