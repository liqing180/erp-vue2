<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts' // echarts theme
import resize from '@/views/dashboard/mixins/resize'
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
    height: {
      type: String,
      default: '300px'
    },
    title: {
      type: String,
      default: ''
    },
    precision: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.initChart()
    // })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(data) {
      const vm = this
      const options = {
        title: {
          text: this.title,
          left: 'center',
          bottom: 0
        },
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
          },
          formatter: function (params) {
            const data = params.data || {}
            const percent = params.percent.toFixed(2)
            const res = `
              <table>
                <tr>
                  <td style="text-align: right;">${data.topLabel} : </td>
                  <td>${data.showName}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.totalReturnOrderQTY')} : </td>
                  <td>${vm.$numberStr(data.totalAmount, vm.precision)}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.returnOrderQTY')} : </td>
                  <td>${vm.$numberStr(params.value, vm.precision)}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">% : </td>
                  <td>${percent}</td>
                </tr>
              </table>
            `
            return res
          }
        },
        legend: {
          orient: 'vertical',
          left: '70%',
          // 圆
          icon: 'circle',
          tooltip: {
            show: true,
            trigger: 'item',
            position: function (pos, params, dom, rect, size) {
              const obj = { top: pos[1] - size.contentSize[1] }
              // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
              obj.left = pos[0] - size.contentSize[0]
              return obj
            }
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '70%',
            data,
            // : [
            //   { value: 1048, name: 'Search Engine' },
            //   { value: 735, name: 'Direct' },
            //   { value: 580, name: 'Email' },
            //   { value: 484, name: 'Union Ads' },
            //   { value: 300, name: 'Video Ads' }
            // ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              normal: {
                position: 'inside',
                show: false,
                formatter: (d) => {
                  return d.percent + '%'
                }
              }
            }
          }
        ]
      }
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption(options)
    }
  }
}
</script>
