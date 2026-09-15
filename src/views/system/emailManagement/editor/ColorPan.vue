<template>
  <div class="color-selector-pan">
    <div class="all-color-pan">
      <canvas
        ref="canvas"
        class="all-color-canvas"
        width="256"
        height="256"
        @click="canvasClick($event)"
        @mousedown="canvasMousedown($event)"
      ></canvas>
      <em ref="cur" class="cur"></em>
    </div>
    <div class="color-val-rs">
      <B>RGB:</B><span>{{ colorRs }}</span>
    </div>
    <div class="color-val-rs" style="text-align: center">
      <el-button size="mini" @click="saveHandle">{{ $t('uiBtn.confirm1') || `OK` }}</el-button>
      <el-button size="mini" @click="cancelHandle">{{ $t('uiBtn.cancel') || `Cancel` }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorPan',
  data() {
    return {
      colorRs: '',
      width: 256,
      can: null,
      cur: null,
      ctx: null,
      curColor: 'rgba(255,0,0,1)'
    }
  },
  mounted() {
    const vm = this
    vm.$nextTick(() => {
      vm.initInfo()
      vm.init()
    })
  },

  methods: {
    initInfo() {
      const vm = this

      const can = vm.$refs.canvas
      const cur = vm.$refs.cur

      if (can) {
        vm.can = can
        vm.ctx = can.getContext('2d')
      }

      if (cur) {
        vm.$data.cur = cur
      }

      const obj = { can, cur }
      return obj
    },

    colorBar() {
      const vm = this

      const gradientBar = vm.ctx.createLinearGradient(0, 0, 0, vm.width)
      gradientBar.addColorStop(0, '#f00')
      gradientBar.addColorStop(1 / 6, '#f0f')
      gradientBar.addColorStop(2 / 6, '#00f')
      gradientBar.addColorStop(3 / 6, '#0ff')
      gradientBar.addColorStop(4 / 6, '#0f0')
      gradientBar.addColorStop(5 / 6, '#ff0')
      gradientBar.addColorStop(1, '#f00')

      vm.ctx.fillStyle = gradientBar
      vm.ctx.fillRect(0, 0, 20, vm.width)
    },

    rgb2hex(rgb) {
      const aRgb = rgb instanceof Array ? rgb : rgb.split(',') || [0, 0, 0]
      let temp
      return [
        // eslint-disable-next-line eqeqeq
        (temp = Number(aRgb[0]).toString(16)).length == 1 ? '0' + temp : temp,
        // eslint-disable-next-line eqeqeq
        (temp = Number(aRgb[1]).toString(16)).length == 1 ? '0' + temp : temp,
        // eslint-disable-next-line eqeqeq
        (temp = Number(aRgb[2]).toString(16)).length == 1 ? '0' + temp : temp
      ].join('')
    },

    hex2rgb(hex) {
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      }
      return [
        parseInt(hex[0] + hex[1], 16),
        parseInt(hex[2] + hex[3], 16),
        parseInt(hex[4] + hex[5], 16)
      ].join()
    },

    putCurDom(color) {
      const vm = this

      if (/([0-9a-f]{3}|[0-9a-f]{6})/i.test(color)) {
        // hex
        color = vm.hex2rgb(color)
      } else if (color instanceof Array) {
        color = color.join(',')
        //   }
        //   else if (/\d{1,3}(\,\d{1,3}){2}/i.test(color)) {
        //     color = color
      }
    },

    colorBox(color) {
      const vm = this

      // 底色填充，也就是（举例红色）到白色
      const gradientBase = vm.ctx.createLinearGradient(30, 0, vm.width + 30, 0)
      gradientBase.addColorStop(1, color)
      gradientBase.addColorStop(0, 'rgba(255,255,255,1)')
      vm.ctx.fillStyle = gradientBase
      vm.ctx.fillRect(30, 0, vm.width, vm.width)
      // 第二次填充，黑色到透明
      // eslint-disable-next-line camelcase
      const my_gradient1 = vm.ctx.createLinearGradient(0, 0, 0, vm.width)
      my_gradient1.addColorStop(0, 'rgba(0,0,0,0)')
      my_gradient1.addColorStop(1, 'rgba(0,0,0,1)')
      // eslint-disable-next-line camelcase
      vm.ctx.fillStyle = my_gradient1
      vm.ctx.fillRect(30, 0, vm.width, vm.width)
    },

    outColor(rgb) {
      //   rgbValue.value = rgb
      //   hexValue.value = rgb2hex(rgb)
      //   colorShow.style.backgroundColor = 'rgb(' + rgb + ')'
      return 'rgb(' + rgb + ')'
    },

    getRgbaAtPoint(pos, area) {
      const vm = this

      let imgData
      if (area === 'bar') {
        imgData = vm.ctx.getImageData(0, 0, 20, vm.width)
      } else {
        imgData = vm.ctx.getImageData(0, 0, vm.can.width, vm.can.height)
      }

      const data = imgData.data
      const dataIndex = (pos.y * imgData.width + pos.x) * 4
      return [
        data[dataIndex],
        data[dataIndex + 1],
        data[dataIndex + 2],
        (data[dataIndex + 3] / 255).toFixed(2)
      ]
    },

    init() {
      const vm = this

      vm.colorBar()
      vm.colorBox(vm.curColor)
    },

    canvasClick(e) {
      const vm = this

      const ePos = {
        x: e.offsetX || e.layerX,
        y: e.offsetY || e.layerY
      }
      let rgbaStr = '#000'
      if (ePos.x >= 0 && ePos.x < 20 && ePos.y >= 0 && ePos.y < vm.width) {
        // in
        rgbaStr = vm.getRgbaAtPoint(ePos, 'bar')
        vm.colorBox('rgba(' + rgbaStr + ')')
      } else if (ePos.x >= 30 && ePos.x < 30 + vm.width && ePos.y >= 0 && ePos.y < vm.width) {
        rgbaStr = vm.getRgbaAtPoint(ePos, 'box')
      } else {
        return
      }
      const curColorStr = vm.outColor(rgbaStr.slice(0, 3).join())
      vm.colorRs = curColorStr
      vm.cur.style.left = ePos.x + 'px'
      vm.cur.style.top = ePos.y + 'px'
      vm.cur.style.outlineColor =
        rgbaStr[0] > 256 / 2 || rgbaStr[1] > 256 / 2 || rgbaStr[2] > 256 / 2 ? '#000' : '#fff'
    },

    canvasMousedown(e) {
      const vm = this
      const ePos = {
        x: e.layerX || e.offsetX,
        y: e.layerY || e.offsetY
      }
      if (ePos.x >= 30 && ePos.x < 30 + vm.width && ePos.y >= 0 && ePos.y < vm.width) {
        document.onmousemove = function (e) {
          const pos = {
            x: e.clientX,
            y: e.clientY
          }

          pos.x = pos.x < 30 ? 30 : pos.x && (pos.x > 30 + vm.width - 1 ? 30 + vm.width - 1 : pos.x)
          pos.y = pos.y < 0 ? 0 : pos.y && (pos.y > vm.width - 1 ? vm.width - 1 : pos.y)

          const rgbaStr = vm.getRgbaAtPoint(pos, 'box')
          vm.cur.style.left = pos.x + 'px'
          vm.cur.style.top = pos.y + 'px'
          vm.cur.style.outlineColor =
            rgbaStr[0] > 256 / 2 || rgbaStr[1] > 256 / 2 || rgbaStr[2] > 256 / 2 ? '#000' : '#fff'
          const curColorStr = vm.outColor(rgbaStr.slice(0, 3).join())
          vm.colorRs = curColorStr
        }
        document.onmouseup = function () {
          document.onmouseup = document.onmousemove = null
        }
      }
    },

    saveHandle(e) {
      const vm = this
      vm.$emit('colorChange', { event: e, rgb: vm.colorRs })
    },

    cancelHandle(e) {
      const vm = this
      vm.$emit('cancel', { event: e, rgb: vm.colorRs })
    }
  }
}
</script>

<style scoped lang="scss">
.color-selector-pan {
  margin: 0;
  padding: 0;
  width: 256px;
  // height:300px;
  background-color: #ffffff;

  .all-color-pan {
    margin: 0 auto;
    width: 256px;
    height: 256px;
    position: relative;
    left: 0;
    top: 0;
    right: 0;

    .all-color-canvas {
      width: 256px;
      height: 256px;
      cursor: crosshair;
    }

    .cur {
      width: 3px;
      height: 3px;
      outline: 2px solid #535353;
      margin-left: -1px;
      margin-top: -1px;
      position: absolute;
    }
  }

  .color-val-rs {
    margin: 0;
    padding: 0;
    height: 40px;
    line-height: 40px;
  }
}
</style>
