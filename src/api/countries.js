import request from '@/utils/request'
// 查询所有国家
export function getCountriesList() {
  return request({
    url: '/system/country/list',
    method: 'get'
  })
}
// 查询省下的所有城市 statesName
export function queryCitiesByStatesName(data) {
  return request({
    url: '/system/country/queryCitiesByStatesName',
    method: 'post',
    data: data
  })
}

// 查询国家下的所有省份 countriesName
export function queryStatesByCountriesName(data) {
  return request({
    url: '/system/country/queryStatesByCountriesName',
    method: 'post',
    data: data
  })
}
// 查询国家名字是否维护在数据库 countriesName
export function queryCountriesName(data) {
  return request({
    url: '/system/country/queryCountriesName',
    method: 'post',
    data: data
  })
}
