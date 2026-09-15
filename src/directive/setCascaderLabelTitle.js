const getTextWidth = (text) => {
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  context.font = '14px Microsoft Yahei'
  const metrics = context.measureText(text)
  return metrics.width
}

function setCascaderLabelTitle(el, width) {
  const domWidth = getTextWidth(el.innerText)
  if (domWidth > width) {
    el.title = el.innerText
  }
}

const directive = {
  /**
       * 设置cascaber 级联的label, dom 宽度超过 arg, 设置title
       * @param {*} el
       * @param {*} arg: 宽度，超过这个宽度就添加 title 显示
       */
  inserted(el, { arg }) {
    setCascaderLabelTitle(el, arg)
  }
}

export default directive
