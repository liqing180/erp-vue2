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
    per: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    per: function (newVal, oldVal) {
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
        series: [
          {
            type: 'gauge',
            radius: '90%',
            axisLine: {
              lineStyle: {
                width: 10,
                color: [
                  [
                    1,
                    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      {
                        offset: 0.1,
                        color: '#FFC600'
                      },
                      {
                        offset: 0.6,
                        color: '#30D27C'
                      },
                      {
                        offset: 1,
                        color: '#0B95FF'
                      }
                    ])
                  ]
                ]
              }
            },
            axisTick: {
              show: true
            },
            splitLine: {
              length: 7,
              lineStyle: {
                width: 5,
                color: '#f00'
              }
            },
            axisLabel: {
              show: false,
              distance: -30,
              fontSize: 12,
              color: '#fff',
              // formatter: function (value) {
              //   if (value === 10) {
              //     return 10
              //   } else if (value === 30) {
              //     return 30
              //   } else if (value === 50) {
              //     return 50
              //   } else if (value === 70) {
              //     return 70
              //   } else if (value === 90) {
              //     return 90
              //   }
              //   return ''
              // },
              textStyle: {
                color: '#fff'
              }
            },
            title: {
              offsetCenter: [0, 65],
              fontSize: 14,
              textStyle: {
                color: '#fff'
              }
            },
            detail: {
              valueAnimation: true,
              fontSize: 16,
              color: '#fff',
              offsetCenter: [0, 30],
              formatter: '{value}%'
            },
            data: [
              {
                value: this.per,
                name: this.title
              }
            ]
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
