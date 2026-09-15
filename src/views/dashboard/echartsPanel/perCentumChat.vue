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
    textColor: {
      type: String,
      default: '#0ff'
    },
    total: {
      type: Number,
      default: 0
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
    total: function (newVal, oldVal) {
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
        title: {
          text: this.title,
          x: 'center',
          bottom: '0',
          textStyle: {
            fontSize: '12',
            color: this.textColor,
            fontWeight: 'bold'
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['60%', '65%'],
            center: ['50%', '45%'],
            // 是否开启 hover(鼠标停留) 在扇区上的放大动画效果
            hoverAnimation: false,
            labelLine: {
              show: false
            },
            label: {
              normal: {
                show: true,
                position: 'center',
                formatter: `{total|${this.total}}`,
                rich: {
                  total: {
                    fontSize: 16,
                    color: this.textColor
                  }
                }
              },
              emphasis: {
                // 中间文字显示
                show: true
              }
            },
            data: [{ value: this.total, name: '', itemStyle: { color: this.textColor } }]
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
