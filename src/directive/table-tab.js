// directives/table-tab.js
export default {
  inserted(el, binding, vnode) {
    const options = binding.value || {}

    // 默认配置
    const defaultOptions = {
      // 是否支持Enter键切换焦点（类似Excel）
      enterToNext: false,
      // 自定义可聚焦元素选择器
      focusableSelector:
        'input:not([disabled]):not([tabindex="-1"]), ' +
        'select:not([disabled]):not([tabindex="-1"]), ' +
        'textarea:not([disabled]):not([tabindex="-1"])',
      // 自动滚动到聚焦元素
      autoScroll: true,
      // 是否严格过滤隐藏元素（推荐开启）
      strictVisibilityCheck: true,
      // 调试模式：在控制台打印焦点顺序
      debug: false
    }

    const config = { ...defaultOptions, ...options }

    // 键盘事件处理函数
    function handleKeydown(event) {
      // 处理Tab键和Enter键（如果开启）
      const isTabKey = event.key === 'Tab'
      const isEnterKey = config.enterToNext && event.key === 'Enter' && !event.shiftKey
      const isShiftEnterKey = config.enterToNext && event.key === 'Enter' && event.shiftKey

      if (!isTabKey && !isEnterKey && !isShiftEnterKey) {
        return
      }

      // 特殊处理：如果当前焦点在下拉框的选项列表中，不拦截Tab键
      if (document.querySelector('.el-select-dropdown.el-popper.is-visible')) {
        return
      }

      // 特殊处理：如果当前焦点在日期选择器的弹出层中，不拦截Tab键
      if (document.querySelector('.el-date-picker.el-picker-panel.is-visible')) {
        return
      }

      const isShiftPressed = event.shiftKey
      const currentFocusedElement = document.activeElement

      // 获取所有可见的可聚焦元素并按视觉顺序排列
      const allFocusableElements = getAllFocusableElementsInOrder(el, config)

      // 调试模式：打印焦点顺序
      if (config.debug) {
        console.log('焦点顺序:', allFocusableElements)
        console.log('当前焦点:', currentFocusedElement)
        console.log('当前索引:', allFocusableElements.indexOf(currentFocusedElement))
      }

      const currentIndex = allFocusableElements.indexOf(currentFocusedElement)

      if (currentIndex === -1) return

      let nextIndex

      if (isTabKey || isEnterKey || isShiftEnterKey) {
        // Tab/Enter：向右移动；Shift+Tab/Shift+Enter：向左移动
        nextIndex = isShiftPressed || isShiftEnterKey ? currentIndex - 1 : currentIndex + 1
      }

      // 边界处理
      if (nextIndex < 0) {
        nextIndex = allFocusableElements.length - 1
      }

      if (nextIndex >= allFocusableElements.length) {
        nextIndex = 0
      }

      event.preventDefault()
      // event.stopPropagation()
      // 关闭当前元素的下拉选项弹窗

      // 聚焦下一个元素
      const nextElement = allFocusableElements[nextIndex]
      // 自动滚动到可见区域
      if (config.autoScroll) {
        scrollElementIntoViewWithinTable(el, nextElement)
      }

      setTimeout(() => {
        nextElement.focus()
      }, 0)
    }

    // 绑定事件（使用捕获阶段，确保在Element UI内部事件之前执行）
    el.addEventListener('keydown', handleKeydown, true)

    // 保存事件处理函数以便解绑
    el._tableTabHandler = handleKeydown
  },

  // 指令解绑时移除事件监听
  unbind(el) {
    if (el._tableTabHandler) {
      el.removeEventListener('keydown', el._tableTabHandler, true)
      delete el._tableTabHandler
    }
  }
}

// 核心修复：正确获取三个表格的数据行并按视觉顺序排列
function getAllFocusableElementsInOrder(tableEl, config) {
  const focusableElements = []

  // 1. 正确获取三个表格的body-wrapper
  const mainBodyWrapper = tableEl.querySelector('.el-table__body-wrapper')
  const leftFixedBodyWrapper = tableEl.querySelector(
    '.el-table__fixed .el-table__fixed-body-wrapper'
  )
  const rightFixedBodyWrapper = tableEl.querySelector(
    '.el-table__fixed-right .el-table__fixed-body-wrapper'
  )

  if (!mainBodyWrapper) return []

  // 2. 从每个body-wrapper中获取可见的数据行
  const mainRows = Array.from(mainBodyWrapper.querySelectorAll('.el-table__row')).filter((row) =>
    isElementVisible(row, config.strictVisibilityCheck)
  )

  const leftFixedRows = leftFixedBodyWrapper
    ? Array.from(leftFixedBodyWrapper.querySelectorAll('.el-table__row')).filter((row) =>
        isElementVisible(row, config.strictVisibilityCheck)
      )
    : []

  const rightFixedRows = rightFixedBodyWrapper
    ? Array.from(rightFixedBodyWrapper.querySelectorAll('.el-table__row')).filter((row) =>
        isElementVisible(row, config.strictVisibilityCheck)
      )
    : []

  // 3. 按行遍历，每行按"左侧固定→主表格→右侧固定"的顺序收集可聚焦元素
  mainRows.forEach((mainRow, rowIndex) => {
    // 左侧固定列当前行
    if (leftFixedRows[rowIndex]) {
      const leftFocusable = Array.from(
        leftFixedRows[rowIndex].querySelectorAll(config.focusableSelector)
      ).filter((el) => isElementVisible(el, config.strictVisibilityCheck))
      focusableElements.push(...leftFocusable)
    }

    // 主表格当前行
    const mainFocusable = Array.from(mainRow.querySelectorAll(config.focusableSelector)).filter(
      (el) => isElementVisible(el, config.strictVisibilityCheck)
    )
    focusableElements.push(...mainFocusable)

    // 右侧固定列当前行
    if (rightFixedRows[rowIndex]) {
      const rightFocusable = Array.from(
        rightFixedRows[rowIndex].querySelectorAll(config.focusableSelector)
      ).filter((el) => isElementVisible(el, config.strictVisibilityCheck))
      focusableElements.push(...rightFocusable)
    }
  })

  return focusableElements
}

// 增强版：严格的元素可见性检查函数
function isElementVisible(el, strictCheck = true) {
  if (!el) return false

  // 基础检查：元素本身不可见
  if (el.style.display === 'none' || el.style.visibility === 'hidden' || el.hidden) {
    return false
  }

  // 新增：检查元素本身是否包含.is-hidden类
  if (el.classList.contains('is-hidden')) {
    return false
  }

  // 严格模式：检查所有祖先元素是否可见
  if (strictCheck) {
    let parent = el.parentElement
    while (parent) {
      if (
        parent.style.display === 'none' ||
        parent.style.visibility === 'hidden' ||
        parent.hidden ||
        parent.classList.contains('is-hidden')
      ) {
        return false
      }
      parent = parent.parentElement
    }
  }

  // 额外过滤：Element UI特有的隐藏元素
  if (el.classList.contains('el-table__empty-block')) return false
  if (el.classList.contains('el-table__column-resize-proxy')) return false
  if (el.classList.contains('el-table__fixed-right-patch')) return false
  if (el.classList.contains('el-table__expanded-cell')) return false // 排除展开行单元格
  if (el.closest('.el-table__header-wrapper')) return false // 排除所有表头
  if (el.closest('.el-table__footer-wrapper')) return false // 排除所有表尾

  return true
}

// ✅ 新增：正确实现表格内部滚动的函数
function scrollElementIntoViewWithinTable(tableEl, element) {
  const scrollWrapper = tableEl.querySelector('.el-table__body-wrapper')
  console.log(scrollWrapper)

  if (!scrollWrapper) return

  const wrapperVisibleWidth = scrollWrapper.clientWidth
  const currentScrollLeft = scrollWrapper.scrollLeft

  const cellRect = element.getBoundingClientRect()
  const wrapperRect = scrollWrapper.getBoundingClientRect()

  const cellRelativeLeft = cellRect.left - wrapperRect.left + currentScrollLeft
  const cellWidth = cellRect.width
  const cellCenter = cellRelativeLeft + cellWidth / 2
  const targetScrollLeft = cellCenter - wrapperVisibleWidth / 2

  // 垂直滚动
  // 3. 计算垂直方向滚动位置
  const relativeTop = cellRect.top - wrapperRect.top + scrollWrapper.scrollTop
  const relativeBottom = relativeTop + cellRect.height
  const containerVisibleHeight = scrollWrapper.clientHeight

  let targetScrollTop = scrollWrapper.scrollTop

  if (relativeTop < scrollWrapper.scrollTop) {
    // 元素顶部在可视区域上方 → 滚动到元素顶部
    targetScrollTop = relativeTop - 10
  } else if (relativeBottom > scrollWrapper.scrollTop + containerVisibleHeight) {
    // 元素底部在可视区域下方 → 滚动到元素底部对齐容器底部
    targetScrollTop = relativeBottom - containerVisibleHeight + 10
  }
  console.log('element', element)
  console.log('targetScrollTop', targetScrollTop, cellRect)
  tableEl.__vue__.bodyWrapper.scrollTop = targetScrollTop
  tableEl.__vue__.bodyWrapper.scrollLeft = Math.max(0, targetScrollLeft)
  /* scrollWrapper.scrollTo({
    top: targetScrollTop,
    left: Math.max(0, targetScrollLeft)
  }) */
}
