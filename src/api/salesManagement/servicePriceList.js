
import request from '@/utils/request'

// 服务价格策略管理,下拉搜索值查询
export function querySearchList(data) {
  return request({
    url: '/sales/servicePriceStrategy/querySearchList',
    method: 'post',
    data: data
  })
}

// 查询 服务价格策略 列表
export function queryServicePriceStrategyList(data) {
  return request({
    url: '/sales/servicePriceStrategy/queryServicePriceStrategyList',
    method: 'post',
    data: data
  })
}
// 查询具体服务价格策略
export function queryServicePriceStrategyById(data) {
  return request({
    url: '/sales/servicePriceStrategy/queryServicePriceStrategyById',
    method: 'post',
    data: data
  })
}
// 提交服务价格策略:
export function saveServicePriceStrategy(data) {
  return request({
    url: '/sales/servicePriceStrategy/saveServicePriceStrategy',
    method: 'post',
    data: data
  })
}
