import request from '@/utils/request'

// 保存仓库产品库龄设置: inventory/storageDuration/saveStorageDurationSetting (构建对象,放入集合: storageDurationSettingList)
export function saveStorageDurationSetting(data) {
  return request({
    url: '/inventory/storageDuration/saveStorageDurationSetting',
    method: 'post',
    data: data
  })
}
// 查询仓库产品库龄设置: inventory/storageDuration/queryStorageDurationSetting
export function queryStorageDurationSetting(data) {
  return request({
    url: '/inventory/storageDuration/queryStorageDurationSetting',
    method: 'post',
    data: data
  })
}
// 下拉搜索值查询: inventory/storageDuration/querySearchListForStorageDurationAnalysis
export function querySearchListForStorageDurationAnalysis(data) {
  return request({
    url: '/inventory/storageDuration/querySearchListForStorageDurationAnalysis',
    method: 'post',
    data: data
  })
}
// 查询仓库产品库龄分析列表: inventory/storageDuration/queryStorageDurationAnalysisList (conditionForWarehouseName)
export function queryStorageDurationAnalysisList(data) {
  return request({
    url: '/inventory/storageDuration/queryStorageDurationAnalysisList',
    method: 'post',
    data: data
  })
}

// inventory/storageDuration/queryImageForStorageDurationAnalysis
export function queryImageForStorageDurationAnalysis(data) {
  return request({
    url: '/inventory/storageDuration/queryImageForStorageDurationAnalysis',
    method: 'post',
    data: data
  })
}
