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
    list: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    list: function (newVal, oldVal) {
      this.initChart()
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
          trigger: 'item',
          appendToBody: false,
          // position: 'right',
          position: function (pos, params, dom, rect, size) {
            if (size.contentSize[0] > size.viewSize[0] / 2) {
              const obj = { top: pos[1] - size.contentSize[1] }
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
              return obj
            }
            return undefined
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
          }
        },
        legend: {
          bottom: 5,
          left: 'center',
          itemWidth: 7,
          itemHeight: 7,
          selectedMode: false,
          textStyle: {
            color: '#fff',
            fontSize: 10
          }
        },
        series: [
          {
            name: this.title,
            type: 'pie',
            radius: ['40%', '70%'],
            // 饼图位置
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            itemStyle: {
              borderRadius: 10,
              borderWidth: 0, // 设置border的宽度有多大
              borderColor: '#0B305C'
            },
            label: {
              show: false,
              position: 'center',
              normal: {
                show: true,
                position: 'inner', // 标签的位置
                textStyle: {
                  fontWeight: 300,
                  fontSize: 12 // 文字的字体大小
                },
                formatter: this.list.length > 1 ? '{d}%' : '100%'
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.list
          }
          // {
          //   name: '',
          //   type: 'pie',
          //   selectedMode: 'single',
          //   radius: [0, '30%'],
          //   // 饼图位置
          //   center: ['50%', '45%'],
          //   avoidLabelOverlap: false,
          //   hoverAnimation: false,
          //   label: {
          //     show: false,
          //     position: ''
          //   },
          //   emphasis: {
          //     label: {
          //       show: false,
          //       fontSize: '40',
          //       fontWeight: 'bold'
          //     }
          //   },
          //   labelLine: {
          //     show: false
          //   },
          //   tooltip: {
          //     show: false // 显示提示框
          //   },
          //   data: this.list
          // }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
