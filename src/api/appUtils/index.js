import request from '@/utils/request'
// 获取APP下载链接生成的图片,type=1为安卓,type=2为ios
export function queryDownLoadImage(type) {
  return request({
    url: '/app/appUtils/queryDownLoadImage/' + type,
    method: 'get'
  })
}
