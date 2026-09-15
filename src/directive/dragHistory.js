import router from '@/router/index'
import cache from '@/plugins/cache'
import Vue from 'vue'

// const drawTiming = null
Vue.directive('dragHistory', {
  update: function (el, binding) {
    const left = el.parentNode
    const { collapse } = el.dataset
    if (collapse === 'true') {
      left.style.width = '63px'
      return
    }
    const routeName = router.app._route.name
    const treeBoxWidthObj = cache.local.getJSON('treeBoxWidthObj') || {}
    if (JSON.stringify(treeBoxWidthObj) === '{}' || !treeBoxWidthObj[routeName]) {
      treeBoxWidthObj[routeName] = 300
      cache.local.setJSON('treeBoxWidthObj', treeBoxWidthObj)
    }
    left.style.width = treeBoxWidthObj[routeName] + 'px'
    // 鼠标按下事件
    el.onmousedown = (e) => {
      const startX = e.clientX
      const elOffsetLeft = el.offsetLeft
      let moveLen
      const { collapse } = el.dataset
      if (collapse === 'true') {
        left.style.width = '63px'
        return
      }
      // 鼠标拖拽事件
      document.onmousemove = function (e) {
        const endX = e.clientX
        moveLen = elOffsetLeft + (endX - startX)
        if (moveLen >= 600) moveLen = 600
        if (moveLen <= 150) moveLen = 150
        el.style.left = moveLen
        left.style.width = moveLen + 'px'

        // clearTimeout(drawTiming)
        // drawTiming = setTimeout(() => {
        //   left.style.width = moveLen + 'px'
        // }, 100)
      }
      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
        // left.style.width = moveLen + 'px'
        treeBoxWidthObj[routeName] = moveLen
        cache.local.setJSON('treeBoxWidthObj', treeBoxWidthObj)
        el.releaseCapture && el.releaseCapture()
      }
      el.setCapture && el.setCapture()
      return false
    }
  }
})
