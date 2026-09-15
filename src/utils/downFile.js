import { getToken } from '@/utils/auth'
function f(method, url, param, options = {}, backFN) {
  const xhr = new XMLHttpRequest()

  const data = []
  for (const key in param) {
    data.push(key + '=' + param[key])
  }
  const postData = data.join('&')
  xhr.open(method, method === 'GET' ? url + '?' + postData : url)

  if (!options.contentType) {
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  }
  if (!options.token) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + getToken())
  }
  // eslint-disable-next-line no-redeclare
  for (const key in options) {
    xhr.setRequestHeader(key, encodeURIComponent(options[key]))
  }
  xhr.responseType = 'blob'
  xhr.onload = function () {
    if (backFN) {
      backFN('onload')
    }
    if (this.status === 200 || this.status === 201) {
      // eslint-disable-next-line no-unused-vars
      const blob = this.response
      const fileName = fileNameFromHeader(xhr.getResponseHeader('Content-Disposition'))
      // console.log(fileName, '===========下载文件名=============')
      if (fileName === 'undefine_file') {
        // let flag = confirm('该文件不存在,是否下载错误日志')
        const flag = confirm('this file is undefined, do you want down error log')
        if (flag) {
          downloadFile(url, xhr.response)
        }
      } else {
        downloadFile(options.fileName || fileName, xhr.response)
      }
    } else {
      alert('下载失败')
    }
  }
  // eslint-disable-next-line no-unused-vars
  xhr.onerror = function (e) {
    if (backFN) {
      backFN('onerror')
    }
    alert('system error')
  }
  // eslint-disable-next-line no-unused-vars
  xhr.ontimeout = function (e) {
    if (backFN) {
      backFN('ontimeout')
    }
    alert('system time out')
  }
  xhr.send(method === 'GET' ? null : JSON.stringify(param))
  return xhr
}

function fileNameFromHeader(disposition) {
  let result = null
  if (disposition && /filename=.*/gi.test(disposition)) {
    result = disposition.match(/filename=.*/gi)
    return decodeURI(result[0].split('=')[1].replace(/"/g, ''))
  }
  return 'undefine_file'
}
function downloadFile(fileName, content) {
  const aLink = document.createElement('a')
  const blob = new Blob([content])
  const evt = document.createEvent('MouseEvents')
  evt.initEvent('click', true, true)
  if (fileName) {
    aLink.download = fileName
  }
  aLink.target = '_blank'
  aLink.href = URL.createObjectURL(blob)
  aLink.dispatchEvent(evt)
  URL.revokeObjectURL(aLink.href)
}

export default f
