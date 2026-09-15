import request from '@/utils/request'

// 主列表查询
export function queryFileRecordList(data) {
  return request({
    url: '/system/oss/queryFileRecordList',
    method: 'post',
    data: data
  })
}
// 根据id查询文件信息
export function queryFileRecordById(id) {
  return request({
    url: '/system/oss/queryFileRecordById/' + id,
    method: 'get'
  })
}
