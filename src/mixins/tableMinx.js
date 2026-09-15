import { queryAllPage } from '@/api/system/behaviour.js'
import cache from '@/plugins/cache'
import getTextWidth from 'text-width'

export const queryAllPageList = () => {
  queryAllPage({})
    .then((res) => {
      if (res.code === 200) {
        const results = res.data || []
        const pageSizeData = {}
        const tableCellHideData = {}
        const tableCellFixedData = {}
        const tableCellSortData = {}
        const RefreshTimeData = {}
        results.forEach((item) => {
          const key = `${item.path}${item.activity}`
          const info = item.data ? JSON.parse(item.data) : {}
          const tableCellHide = item.tableCellHide ? JSON.parse(item.tableCellHide) : []
          const tableCellFixed = item.tableCellFixed ? JSON.parse(item.tableCellFixed) : null
          const CellSortObj = item.cellSortObj ? JSON.parse(item.cellSortObj) : null

          const pageSize = info.pageSize
          tableCellHideData[key] = tableCellHide
          tableCellFixedData[key] = tableCellFixed
          tableCellSortData[key] = CellSortObj
          pageSizeData[key] = pageSize
          RefreshTimeData[key] = item.autoRefreshTime
        })
        cache.local.setJSON('pageSizeList', pageSizeData)
        cache.local.setJSON('tableCellHideData', tableCellHideData)
        cache.local.setJSON('tableCellFixedData', tableCellFixedData)
        cache.local.setJSON('tableCellSortData', tableCellSortData)
        cache.local.setJSON('autoRefreshTimeData', RefreshTimeData)
      } else {
        // vm.$modal.msgError(data.message)
      }
    })
    .catch((err) => {
      window.console.error(err)
    })
}
export default {
  data() {
    return {
      tipVisible: false,
      columns: [],
      colTextMaxWidth: 300,
      tableMaxHeight: 390,
      tableScrollTop: undefined,
      tableKey: Date.now()
    }
  },
  computed: {
    configColumn() {
      const arr = [...this.columns]
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    visibleColumn() {
      const arr = [...this.columns.filter((column) => column.visible === true)]
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    size() {
      return this.$store.getters.size
    },
    thFontSize() {
      const sizeData = {
        default: 14,
        medium: 14,
        small: 13,
        mini: 12
      }
      return sizeData[this.size] || sizeData.default
    },
    cellFontSize() {
      const sizeData = {
        default: 14,
        medium: 14,
        small: 13,
        mini: 12
      }
      return sizeData[this.size] || sizeData.default
    }
  },
  created() {
    this.columns.forEach((element, index) => {
      this.$set(element, 'key', index)
    })
  },
  mounted() {
    this.windowResizeSetTableMaxHeight()
    this.setTableMaxHeight()
  },
  activated() {
    /* 进入缓存时恢复表格滚动条位置 */
    if (this.$refs.tables && this.tableScrollTop) {
      this.$refs.tables.bodyWrapper.scrollTop = this.tableScrollTop
    }
  },
  deactivated() {
    /* 引发操作：触发show-overflow-tooltip，然后切换页面，
    原先触发的show-overflow-tooltip并未被销毁，
    且未被display：none导致，未获取到位置，就定位到左上角 */
    setTimeout(() => {
      const list = document.getElementsByClassName('el-tooltip__popper')
      const list1 = document.getElementsByClassName('el-popover')
      // console.log('🚀 ~ file: index.vue ~ line 309 ~ deactivated ~ list', list)
      if (list.length > 0) {
        list[list.length - 1].style.display = 'none'
      }
      if (list1.length > 0) {
        list1[list1.length - 1].style.display = 'none'
      }
    }, 1000)
    /* 进入缓存时保存表格滚动条位置 */
    if (this.$refs.tables) {
      this.tableScrollTop = this.$refs.tables.bodyWrapper.scrollTop
    }
  },
  methods: {
    $$getSelectedIdList(selectedRows, rowIdKey) {
      const ids = (selectedRows || [])
        .map((item) => {
          if (item && typeof item === 'object') {
            return item[rowIdKey]
          }
          return item
        })
        .filter((id) => id !== undefined && id !== null && id !== '')
      return [...new Set(ids)]
    },
    $$getFilteredSelectedList(response) {
      const list = response && Array.isArray(response.filteredSelectedList)
        ? response.filteredSelectedList
        : []
      return list.filter((item) => item !== undefined && item !== null && item !== '')
    },
    $$getFilteredSelectedNum(filteredSelectedList, tableList, selectedRows, rowIdKey) {
      const filterableIds = new Set([
        ...this.$$getSelectedIdList(filteredSelectedList, rowIdKey),
        ...this.$$getSelectedIdList(tableList, rowIdKey)
      ])
      return this.$$getSelectedIdList(selectedRows, rowIdKey).filter((id) => filterableIds.has(id))
        .length
    },
    $$resetTableKey() {
      this.$nextTick(() => {
        this.tableKey++
      })
    },
    // @closed="closedTooltip"
    closedTooltip() {
      setTimeout(() => {
        const list = document.getElementsByClassName('el-tooltip__popper')
        const list1 = document.getElementsByClassName('el-popover')
        // console.log('🚀 ~ file: index.vue ~ line 309 ~ deactivated ~ list', list)
        if (list.length > 0) {
          list[list.length - 1].style.display = 'none'
        }
        if (list1.length > 0) {
          list1[list1.length - 1].style.display = 'none'
        }
      }, 500)
    },
    getCharWidth(text) {
      function getCharWidth(charCode) {
        if (charCode > 13300) {
          // 中文字符宽度设为 1.5
          return 12
        } else {
          // 数字字母宽度设为 1
          return 7
        }
      }
      let width = 0
      const special = {
        0: '7.04',
        1: '7.04',
        2: '7.04',
        3: '7.04',
        4: '7.04',
        5: '7.04',
        6: '7.04',
        7: '7.04',
        8: '7.04',
        9: '7.04',
        A: '8.44',
        B: '7.53',
        C: '8.03',
        D: '9.14',
        E: '6.60',
        F: '6.38',
        G: '8.92',
        H: '9.28',
        I: '3.53',
        J: '4.75',
        K: '7.62',
        L: '6.16',
        M: '11.72',
        N: '9.76',
        O: '9.78',
        P: '7.34',
        Q: '9.78',
        R: '7.83',
        S: '6.93',
        T: '6.88',
        U: '8.96',
        V: '8.12',
        W: '12.21',
        X: '7.74',
        Y: '7.24',
        Z: '7.44',
        a: '6.63',
        b: '7.66',
        c: '6.02',
        d: '7.68',
        e: '6.81',
        f: '4.16',
        g: '7.68',
        h: '7.39',
        i: '3.19',
        j: '3.21',
        k: '6.53',
        l: '3.19',
        m: '11.24',
        n: '7.39',
        o: '7.63',
        p: '7.66',
        q: '7.68',
        r: '4.58',
        s: '5.55',
        t: '4.47',
        u: '7.39',
        v: '6.30',
        w: '9.47',
        x: '6.08',
        y: '6.35',
        z: '5.90',
        '!': '3.75',
        '"': '5.23',
        '#': '7.66',
        $: '7.04',
        '%': '10.68',
        '&': '10.44',
        "'": '3.08',
        '(': '4.01',
        ')': '4.01',
        '*': '5.46',
        '+': '8.90',
        ',': '2.89',
        '-': '5.19',
        '.': '2.89',
        '/': '5.13',
        ':': '2.89',
        ';': '2.89',
        '<': '8.90',
        '=': '8.90',
        '>': '8.90',
        '?': '5.79',
        '@': '12.38',
        '[': '4.01',
        '\\': '4.99',
        ']': '4.01',
        '^': '8.90',
        _: '5.38',
        '`': '3.54',
        '{': '4.01',
        '|': '3.23',
        '}': '4.01',
        '~': '8.90',
        ' ': '3.55',
        '！': '12.00',
        '＂': '12.00',
        '＃': '12.00',
        '＄': '12.00',
        '％': '12.00',
        '＆': '12.00',
        '＇': '12.00',
        '（': '12.00',
        '）': '12.00',
        '＊': '12.00',
        '＋': '12.00',
        '，': '12.00',
        '－': '12.00',
        '．': '12.00',
        '／': '12.00',
        '：': '12.00',
        '；': '12.00',
        '＜': '12.00',
        '＝': '12.00',
        '＞': '12.00',
        '？': '12.00',
        '＠': '12.00',
        '［': '12.00',
        '＼': '12.00',
        '］': '12.00',
        '＾': '12.00',
        '＿': '12.00',
        '｀': '12.00',
        '｛': '12.00',
        '｜': '12.00',
        '｝': '12.00',
        '～': '12.00',
        '　': '12.00'
      }
      for (let i = 0; i < text.length; i++) {
        if (special[text[i]]) {
          width += Number(special[text[i]])
        } else {
          const charCode = text.charCodeAt(text[i])
          width += getCharWidth(charCode)
        }
      }
      return width
    },
    getMinWidth(column) {
      if (column.fixedWidth) {
        return column.fixedWidth
      }
      return Math.max(column.headerWidth || 0, column.colMinWidth || 0, column.colWidth || 0)
    },
    $$initColumnHeaderWidth(columnData) {
      const isInit = columnData.find((item) => item.initVisible)

      columnData.forEach((item) => {
        // initFixed 用于三件套重置字段初始状态用的
        if (!isInit) {
          item.initFixed = item.fixed
          item.initVisible = item.visible
        }
        /* if (item.fixedWidth || item.width) {
          return
        } */
        let width1 = getTextWidth(item.label, {
          family: 'Microsoft YaHei, Microsoft YaHei UI, sans-serif',
          size: this.thFontSize,
          weight: 'normal'
        })
        width1 += 24 // 表头左右padding
        if (item.sortable === 'custom') {
          width1 += 24 // 排序按钮
        }
        if (item.required) {
          width1 += 10 // 必填星号占位
        }
        this.$set(item, 'headerWidth', width1)
      })
    },
    $$getColumnContentMaxWidth(columnData, list) {
      columnData.forEach((item) => {
        if (item.fixedWidth || item.colMinWidth || item.width) {
          return
        }
        let maxColWidth = 0
        let maxStr = ''
        let maxStrWidth = 0
        if (list.length > 0) {
          list.findIndex((row) => {
            const str = String(row[item.propBy || item.prop] || '')
            if (str) {
              const result = str.replace(/\s+/g, ' ').replace(/\n+/g, ' ')
              if (result.length > 80) {
                maxStr = result
                return true
              }
              const resultStrWidth = this.getCharWidth(result)
              if (resultStrWidth > maxStrWidth) {
                maxStr = result
                maxStrWidth = resultStrWidth
                return false
              }
            }
            return false
          })
          maxColWidth = getTextWidth(maxStr, {
            family: 'Microsoft YaHei, Microsoft YaHei UI, sans-serif',
            size: this.cellFontSize
          })
          // if (item.prop === 'remarks') {
          //   console.log(maxColWidth, maxStr, maxStrWidth)
          // }
          maxColWidth += item.padding || 32 // 表头左右padding
          /* if (item.prop === 'siteAddressShowStr') {
            console.log(maxColWidth, item.maxWidth, this.colTextMaxWidth, maxStr, maxStrWidth)
          } */
          this.$set(item, 'colWidth', Math.min(maxColWidth, item.maxWidth || this.colTextMaxWidth))
        } else {
          this.$set(item, 'colWidth', undefined)
        }
      })
    },
    /** 排序触发事件 */
    handleSortChange({ prop, order }) {
      // if (!!prop && !!order && this.queryParams) {
      //   order = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
      //   this.queryParams.orderBy = `${prop.replace(/[A-Z]/g, (match) => {
      //     return `_${match.toLowerCase()}`
      //   })} ${order}`
      // } else {
      //   delete this.queryParams.orderBy
      // }
      if (!order) {
        this.queryParams.orderByColumn = this.queryParams.isAsc = undefined
      } else {
        this.queryParams.orderByColumn = prop
        this.queryParams.isAsc = order
      }
      if (this.getList) {
        this.getList()
      }
    },
    $$initPageSize(saveKey, savePath) {
      const path = savePath || this.savePath || this.$route.name
      const vm = this
      const pageSizeList = vm.$cache.local.getJSON('pageSizeList') || {}

      if (pageSizeList && pageSizeList[`${path}${saveKey}`]) {
        return pageSizeList[`${path}${saveKey}`]
        // vm.queryParams.pageSize =
      } else {
        return 25
        // vm.queryParams.pageSize = 10
        // vm.$$pageSizeSave(path, saveKey)
      }
    },
    $$initColumnVisible(saveKey, columnData, savePath) {
      const path = savePath || this.savePath || this.$route.name
      this.$$initColumnHeaderWidth(columnData)
      const hideCell = this.$cache.local.getJSON('tableCellHideData') || {}
      const fixedCell = this.$cache.local.getJSON('tableCellFixedData') || {}
      const sortCell = this.$cache.local.getJSON('tableCellSortData') || {}

      /* 因为有默认初始不显示的列，所以当三件套有保存过后，全部设置为显示 */
      const sortCellObj1 = sortCell[`${path}${saveKey}`] || {}
      if (Object.keys(sortCellObj1).length > 0) {
        columnData.forEach((item) => {
          item.visible = true
        })
      }

      const param = {
        activity: saveKey, // ActivityPool['purchaseRequisite'][0]['activity'],
        path: path // vm.$route.meta.srcPath
      }
      if (hideCell && hideCell[`${param.path}${param.activity}`]) {
        const hideCellList = hideCell[`${param.path}${param.activity}`]
        // console.log('hideCell', hideCellList)
        columnData.forEach((item) => {
          if (hideCellList.includes(item.prop)) {
            item.visible = false
          }
        })
      }
      if (fixedCell && fixedCell[`${param.path}${param.activity}`]) {
        const fixedCellList = fixedCell[`${param.path}${param.activity}`]
        columnData.forEach((item) => {
          if (fixedCellList.includes(item.prop)) {
            this.$set(item, 'fixed', true)
          } else {
            this.$set(item, 'fixed', false)
          }
        })
      }
      if (sortCell && sortCell[`${param.path}${param.activity}`]) {
        const sortCellObj = sortCell[`${param.path}${param.activity}`]
        columnData.forEach((item) => {
          this.$set(item, 'colSortIndex', sortCellObj[item.prop])
        })
      }
    },
    /** 清空排序 */
    queryTable() {
      this.queryParams.isAsc = this.queryParams.orderByColumn = undefined
      this.$refs.tables.clearSort()
      if (this.getList) {
        this.getList()
      }
    },
    // 分页切换时，表格滚动条重置到顶部
    paginationChange() {
      if (this.$refs.tables) {
        this.$refs.tables.bodyWrapper.scrollTop = 0
      }
      if (this.getList) {
        this.getList()
      }
    },

    /* 弹窗表格最大高度设置 */
    JieLiu(fn, time) {
      let isRun = false
      return function () {
        if (isRun) return
        isRun = true
        setTimeout(() => {
          isRun = false
          fn()
        }, time)
      }
    },
    windowResizeSetTableMaxHeight() {
      const vm = this
      vm.resizeFn = vm.JieLiu(vm.setTableMaxHeight, 100)
      window.addEventListener('resize', vm.resizeFn)
      vm.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', vm.resizeFn)
      })
    },
    setTableMaxHeight() {
      this.$nextTick(() => {
        const height = window.innerHeight * 0.88 - 260
        if (height >= 390) {
          this.tableMaxHeight = height
        } else {
          this.tableMaxHeight = 390
        }
      })
    },
    // 滚动定位到第一个未填项的列（支持水平和垂直居中滚动）
    scrollToErrorColumn() {
      const tableEl = this.$refs.tables && this.$refs.tables.$el
      if (!tableEl) return

      const scrollWrapper = tableEl.querySelector('.el-table__body-wrapper')
      if (!scrollWrapper) return

      const errorCell = tableEl.querySelector('.is-required-table-cell')
      if (!errorCell) return

      function getInViewInfo(container, element) {
        const containerRect = container.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        const inHoriz = elementRect.left >= containerRect.left && elementRect.right <= containerRect.right
        const inVert = elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom
        return { inHoriz, inVert, elementRect, containerRect }
      }

      const { inHoriz, inVert, elementRect: cellRect, containerRect: wrapperRect } =
        getInViewInfo(scrollWrapper, errorCell)

        console.log(inHoriz, inVert, '==================可视区域')
      // 如果水平方向和垂直方向都在可视区，则无需滚动
      if (inHoriz && inVert) return

      const wrapperVisibleWidth = scrollWrapper.clientWidth
      const wrapperVisibleHeight = scrollWrapper.clientHeight
      const currentScrollLeft = scrollWrapper.scrollLeft
      const currentScrollTop = scrollWrapper.scrollTop

      // 计算目标水平滚动（居中显示单元格）
      const cellRelativeLeft = cellRect.left - wrapperRect.left + currentScrollLeft
      const cellWidth = cellRect.width
      const cellCenter = cellRelativeLeft + cellWidth / 2
      const targetScrollLeft = Math.max(0, cellCenter - wrapperVisibleWidth / 2)

      // 计算目标垂直滚动（居中显示单元格）
      const cellRelativeTop = cellRect.top - wrapperRect.top + currentScrollTop
      const cellHeight = cellRect.height
      const cellCenterTop = cellRelativeTop + cellHeight / 2
      const targetScrollTop = Math.max(0, cellCenterTop - wrapperVisibleHeight / 2)

      // 同时滚动左右与上下
      try {
        setTimeout(() => {
          scrollWrapper.scrollTo({
            left: targetScrollLeft,
            top: targetScrollTop,
            behavior: 'smooth'
          })
        }, 100)
      } catch (e) {
        // 某些环境下 scrollTo 可能不支持 top，降级为分别设置
        scrollWrapper.scrollLeft = targetScrollLeft
        scrollWrapper.scrollTop = targetScrollTop
      }
    },
    // ...existing code...
    scrollToErrorColumn1() {
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          const tableEl = this.$refs.tables && this.$refs.tables.$el
          if (!tableEl) return

          const scrollWrapper = tableEl.querySelector('.el-table__body-wrapper')
          if (!scrollWrapper) return

          const errorCells = [...tableEl.querySelectorAll('.is-required-table-cell')]
          const wrapperRect = scrollWrapper.getBoundingClientRect()
          console.log(errorCells, '=============583')
          // 排除隐藏单元格、固定列重复单元格
          const errorCell = errorCells.find((cell) => {
            const rect = cell.getBoundingClientRect()
            return (
              rect.width > 0 &&
              rect.height > 0 &&
              rect.bottom > wrapperRect.top &&
              rect.top < wrapperRect.bottom
            )
          })

          if (!errorCell) return

          const cellRect = errorCell.getBoundingClientRect()

          const inVert =
            cellRect.top >= wrapperRect.top &&
            cellRect.bottom <= wrapperRect.bottom

          const inHoriz =
            cellRect.left >= wrapperRect.left &&
            cellRect.right <= wrapperRect.right

          if (inVert && inHoriz) return

          const targetTop =
            scrollWrapper.scrollTop +
            cellRect.top -
            wrapperRect.top -
            (scrollWrapper.clientHeight - cellRect.height) / 2

          const targetLeft =
            scrollWrapper.scrollLeft +
            cellRect.left -
            wrapperRect.left -
            (scrollWrapper.clientWidth - cellRect.width) / 2

          scrollWrapper.scrollTo({
            top: Math.max(0, targetTop),
            left: Math.max(0, targetLeft),
            behavior: 'smooth'
          })
        })
      })
    }
    // ...existing code...
  }
}
