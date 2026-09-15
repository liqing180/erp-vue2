const directive = {

  bind(el, binding) {
    if (typeof ResizeObserver === 'function') {
      const divro = new ResizeObserver(entries => {
        // eslint-disable-next-line
        for (let entry of entries) {
          if (typeof binding.value === 'function') {
            binding.value()
          }
        }
      })
      // 观察一个或多个元素
      divro.observe(el)
      el.__divro__ = divro
    } else {
      let width = ''
      let height = ''
      const isReize = () => {
        const style = document.defaultView.getComputedStyle(el)
        if (width !== style.width || height !== style.height) {
          binding.value() // 关键
        }
        width = style.width
        height = style.height
      }
      // 若不支持js ResizeObserver API,则采用轮询的方式
      el.__vueSetInterval__ = setInterval(isReize, 500)
    }
  },
  unbind(el) {
    // 结束观察指定的Element
    if (el.__divro__) {
      el.__divro__.unobserve(el)
    }
    if (el.__vueSetInterval__) {
      clearInterval(el.__vueSetInterval__)
    }
  }
}
export default directive
