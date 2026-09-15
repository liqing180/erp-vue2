import request from '@/utils/request'

/* 库存日志 */
// 查询 库存日志 主列表： /inventory/stockLog/queryStockLogList
export function queryStockLogList(data) {
  return request({
    url: '/inventory/stockLog/queryStockLogList',
    method: 'post',
    data: data
  })
}

// 库存日志管理,下拉搜索值查询： /inventory/stockLog/querySearchList
export function querySearchList(data) {
  return request({
    url: '/inventory/stockLog/querySearchList',
    method: 'post',
    data: data
  })
}
