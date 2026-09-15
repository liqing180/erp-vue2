import request from '@/utils/request'

// 主列表查询
export function queryProductPricingManagementList(data) {
  return request({
    url: '/inventory/productPricingManagement/queryProductPricingManagementList',
    method: 'post',
    data: data
  })
}
