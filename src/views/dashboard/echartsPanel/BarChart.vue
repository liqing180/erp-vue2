<template>
  <div :class="className" :style="{ width: width }" />
</template>

<script>
import * as echarts from 'echarts' // echarts theme
import resize from '../mixins/resize'
require('echarts/theme/macarons')

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    date: {
      type: Array,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    xName: {
      type: String,
      default: ''
    },
    yName: {
      type: String,
      default: ''
    }
  },
  watch: {
    date: function (newVal, oldVal) {
      this.initChart()
    },
    list: function (newVal, oldVal) {
      this.initChart()
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // this.chart = echarts.init(this.$el, 'macarons')
      this.chart = echarts.init(this.$el)
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          // 坐标轴轴线相关设置
          axisLine: {
            // x轴颜色、宽度
            lineStyle: {
              color: 'rgba(255, 255, 255)',
              width: 1
            }
          },
          axisLabel: {
            formatter: function (value) {
              let newArr = value.split('-')
              newArr = newArr.map((x) => {
                if (x.indexOf('0') !== -1 && x.indexOf('0') === 0) {
                  x = x.substring(1)
                }
                return x
              })
              return newArr[1] + '/' + newArr[0]
            },
            rotate: -45
          },
          name: this.xName,
          // x轴线刻度
          axisTick: {
            show: true
          },
          type: 'category',
          data: this.date
        },
        yAxis: {
          // 是否显示网格图
          splitLine: {
            show: false
          },
          minInterval: 1,
          type: 'value',
          // 坐标轴名称
          name: this.yName,
          // 坐标轴名称样式
          // nameTextStyle: {
          //   color: 'rgba(255, 255, 255)'
          // },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255)',
              width: 1
            }
          },
          axisTick: {
            show: true
          }
        },
        grid: {
          left: 10,
          right: 50,
          bottom: 10,
          top: 40,
          containLabel: true
        },
        series: [
          {
            data: this.list,
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#397BCF' },
                { offset: 1, color: '#54FBFC' }
              ]),
              barBorderRadius: [10, 10, 10, 10] // 圆角
            }
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
