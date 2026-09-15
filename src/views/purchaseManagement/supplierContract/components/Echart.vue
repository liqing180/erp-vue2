<template>
  <div style="height: 100%">
    <div v-if="divResize" v-resize="divResizeFn" style="width: 100%; height: 100%">
      <div ref="echart" style="height: 100%">echart</div>
    </div>
    <div v-else ref="echart" style="height: 100%">echart</div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import resize from '@/directive/resize'
export default {
  directives: {
    resize
  },
  props: {
    chartData: {
      type: Object,
      default: () => ({})
    },
    windowResize: {
      type: Boolean,
      default: false
    },
    // 例 :el-dialog 弹窗中, 弹窗的宽高变化并不能通过 window 的 resize 事件监听
    divResize: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      echart: null,
      resizeFn: () => {}
    }
  },
  watch: {
    chartData() {
      const vm = this
      vm.initChart()
    }
  },
  created() {
    const vm = this
    if (vm.divResize) {
      vm.resizeFn = vm.JieLiu(vm.resizeChart, 100)
    }
  },
  mounted() {
    const vm = this
    vm.initChart()
    if (vm.windowResize) {
      vm.resizeFn = vm.JieLiu(vm.resizeChart, 100)
      window.addEventListener('resize', vm.resizeFn)
      vm.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', vm.resizeFn)
      })
    }
  },
  methods: {
    divResizeFn() {
      this.resizeFn()
    },
    initChart() {
      const vm = this
      if (vm.echart) {
        // setOption(vm.chartData, notMerge) 不与之前的 option 合并，避免数据串联混乱
        vm.echart.setOption(vm.chartData, true)
      } else {
        vm.echart = echarts.init(vm.$refs.echart)
        vm.echart.setOption(vm.chartData)
      }
    },
    resizeChart() {
      this.echart.resize()
    },
    // 节流函数
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
    }
  }
}
</script>
<style lang="less" scoped></style>
