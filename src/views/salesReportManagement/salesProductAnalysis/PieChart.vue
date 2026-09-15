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
            /* <div
              style='display: inline-block;
              width:  12px;
              height: 20px;
              color: ${params.color}'
              >●</div> */
            const data = params.data || {}
            // const res = `
            //     <div>
            //         <span>${data.topLabel} : ${data.showName}</span></br>
            //         <span>${vm.$t('SALES.totalAmount')} : ${data.totalAmount}</span></br>
            //         <span>${vm.$t('SALES.amount')} : ${params.value}</span></br>
            //         <span>% : ${params.percent}</span>
            //       </div>
            //       `
            const res = `
              <table>
                <tr>
                  <td style="text-align: right;">${data.topLabel} : </td>
                  <td>${data.showName}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('SALES.totalAmount')} : </td>
                  <td>${vm.$numberStr(data.totalAmount, 2)}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('SALES.amount')} : </td>
                  <td>${vm.$numberStr(params.value, 2)}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">% : </td>
                  <td>${params.percent}</td>
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
