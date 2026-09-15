import request from '@/utils/request'

/** 库存凭证 */
// 查询 库存凭证 主列表： /inventory/stockCertificate/queryStockCertificateList
export function queryStockCertificateList(data) {
  return request({
    url: '/inventory/stockCertificate/queryStockCertificateList',
    method: 'post',
    data: data
  })
}
// 查询 库存凭证基础信息： /inventory/stockCertificate/queryStockCertificateById
export function queryStockCertificateById(data) {
  return request({
    url: '/inventory/stockCertificate/queryStockCertificateById',
    method: 'post',
    data: data
  })
}
// 查询库存凭证产品信息：/inventory/stockCertificate/queryStockCertificateDetailById   参数:stockCertificateId
export function queryStockCertificateDetailById(data) {
  return request({
    url: '/inventory/stockCertificate/queryStockCertificateDetailById',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询： /inventory/stockCertificate/querySearchList
export function querySearchList(data) {
  return request({
    url: '/inventory/stockCertificate/querySearchList',
    method: 'post',
    data: data
  })
}
