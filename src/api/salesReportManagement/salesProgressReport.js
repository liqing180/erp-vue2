import request from '@/utils/request'

// 各个页签数据数量查询: sales/report/salesProcessView/queryCountList
export function queryCountList(data) {
  return request({
    url: '/sales/report/salesProcessView/queryCountList',
    method: 'post',
    data: data
  })
}

// 下拉搜索值查询:  sales/report/salesProcessView/querySearchList
export function querySearchList(data) {
  return request({
    url: '/sales/report/salesProcessView/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询采购进度视图记录列表: sales/report/salesProcessView/querySalesProcessViewList
export function querySalesProcessViewList(data) {
  return request({
    url: '/sales/report/salesProcessView/querySalesProcessViewList',
    method: 'post',
    data: data
  })
}
