import request from '@/utils/request'

const SYS = process.env.VUE_APP_BASE_API

// POST 上传印章特殊处理接口： 文件上传
export const uploadCompanySeal = `${SYS}/system/corporate/uploadCompanySeal`

// POST /oss/multiUpload 多个文件上传
export const multiUpload = `${SYS}/system/oss/multiUpload`

// POST /oss/multiFileUpload 多个文件上传,返回文件的id 跟 url
export const multiFileUpload = `${SYS}/system/oss/multiFileUpload`

// POST /oss/downloadFile 根据模块id下载文件
export const downloadFile = `${SYS}/system/oss/downloadFile`

// 首页注册上传 不需要token
export const multiFileUpload2 = `${SYS}/system/external/common/multiFileUpload`

// 用户头像上传
export function multiFileUploadFn(data) {
  return request({
    url: '/system/oss/multiFileUpload',
    method: 'post',
    data: data
  })
}

// 用户头像上传
export function uploadCompanySealFn(data) {
  return request({
    url: '/system/corporate/uploadCompanySeal',
    method: 'post',
    data: data,
    timeout: 1200000
  })
}

// GET /country/queryCountryList 下拉查询国家列表
export function queryCountryListBySelect() {
  return request({
    url: '/system/country/queryCountryListBySelect',
    method: 'get'
  })
}
// 查询货币列表
export function queryCurrencyListBySelect() {
  return request({
    url: '/system/country/queryCurrencyListBySelect',
    method: 'get'
  })
}

// 文件下载
export function downFile(url, data) {
  return request({
    url,
    data,
    method: 'post',
    responseType: 'blob',
    // 导出数据改超时时间 15分钟
    timeout: 900000
  })
}

// 文件下载
export function importData(url, data) {
  return request({
    url: url + '?updateSupport=0',
    data,
    method: 'post',
    // 导入数据改超时时间 15分钟
    timeout: 900000
  })
}
