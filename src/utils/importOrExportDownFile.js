import { downFile } from '@/api/basic/basic'
import { Message } from 'element-ui'

const resetMessage = (options) => {
  const doms = document.getElementsByClassName('el-message')
  let canShow = true
  for (let i = 0; i < doms.length; i++) {
    if (options.message === doms[i].getElementsByClassName('el-message__content')[0].innerHTML) {
      canShow = false
    }
  }
  if (doms.length === 0 || canShow) {
    Message(options)
  }
};
['error', 'success', 'info', 'warning'].forEach(type => {
  resetMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return resetMessage(options)
  }
})
function importOrExportDownFile(url, params, fileName) {
  return new Promise((resolve, reject) => {
    downFile(url, params).then(res => {
      if (res.type === 'application/json') {
        const reader = new FileReader()
        reader.readAsText(res, 'utf-8')
        reader.onload = function () {
          const _res = JSON.parse(reader.result)
          console.log(_res) // 此处为接口返回值
          resetMessage({
            message: _res.msg,
            type: 'error'
          })
          reject(_res)
        }
      } else {
        downloadFile(fileName, res)
        resolve(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
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

export default importOrExportDownFile
