/**
 * 表格大于10行的时候出现滚动条。
 */
function rowHeight(el, value) {
  try {
    const thRow = el.querySelector('.el-table__header-wrapper')

    const domTableBodyWrapper = el.querySelector('.el-table__body-wrapper')
    const domTable = domTableBodyWrapper.querySelector('table')

    const domTableBody = domTable.querySelector('tbody')

    const domTr = domTableBody.querySelector('tr')

    if (domTr) {
      const rowHeight = domTr.offsetHeight
      const thHeight = thRow.offsetHeight

      if (typeof value === 'function') {
        value(rowHeight, thHeight)
      }
    }
  } catch (error) {
    console.warn(error)
    if (typeof value === 'function') {
      value()
    }
  }
}
const directive = {
  componentUpdated(el, { value }, { context }) {
    const id = setTimeout(() => {
      rowHeight(el, value)
    })

    context.$once('hook:beforeDestroy', function() {
      if (id) {
        clearTimeout(id)
      }
    })
  }
}

export default directive
