import request from '@/utils/request'

// 竞品信息管理,下拉搜索值查询 :/sales/competitor/querySearchList
export function querySearchList(data) {
  return request({
    url: '/sales/competitor/querySearchList',
    method: 'post',
    data: data
  })
}

// 竞品信息管理,查询 竞品信息 列表 :/sales/competitor/queryCompetitorList
export function queryCompetitorList(data) {
  return request({
    url: '/sales/competitor/queryCompetitorList',
    method: 'post',
    data: data
  })
}

// 查询具体竞品信息 :/sales/competitor/queryCompetitorById
export function queryCompetitorById(data) {
  return request({
    url: '/sales/competitor/queryCompetitorById',
    method: 'post',
    data: data
  })
}

// 提交竞品信息:/sales/competitor/saveCompetitor
export function saveCompetitor(data) {
  return request({
    url: '/sales/competitor/saveCompetitor',
    method: 'post',
    data: data
  })
}

// 查询产品历史采购单价(图表):/sales/competitor/queryProductHistoryPriceImage
export function queryProductHistoryPriceImage(data) {
  return request({
    url: '/sales/competitor/queryProductHistoryPriceImage',
    method: 'post',
    data: data
  })
}

// 查询产品集合的建议售价跟货币:/sales/competitor/queryProductRecommendedRetailPrice
export function queryProductRecommendedRetailPrice(data) {
  return request({
    url: '/sales/competitor/queryProductRecommendedRetailPrice',
    method: 'post',
    data: data
  })
}
