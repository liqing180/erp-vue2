function setDownMenuList(el, value, arg) {
  let minVal = Math.min(Number(value), Number(arg))

  if (minVal <= 0) {
    minVal = 1
  }

  let curHeight = ''

  if (minVal <= 7) {
    curHeight = (minVal * 31 + 1) + 'px'
  } else {
    curHeight = '218px'
  }

  el.style.height = curHeight
}

const directive = {
  /**
     * 设置Scroll-Bar-Box组件的高度
     * @param {*} el
     * @param {*} value:最小列表项的个数，以这个个数设置滚动条高度；arg，列表项的总数。
     */
  update(el, { value, arg }) {
    setDownMenuList(el, value, arg)
  },

  inserted(el, { value, arg }) {
    setDownMenuList(el, value, arg)
  }
}

export default directive
