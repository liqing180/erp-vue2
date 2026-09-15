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
      this.chart && this.chart.clear()
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
            let res = `
              <table>
                <tr>
                  <td style="text-align: right;">${vm.$t('SALES.companyName')} : </td>
                  <td>${data.branchCompanyName || ''}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('SALES.salesDepartment')} : </td>
                  <td>${data.departmentName}</td>
                </tr>`
            if (data.salesPersonBy) {
              res += `<tr>
                  <td style="text-align: right;">${vm.$t('SALES.salesPerson')} : </td>
                  <td>${data.salesPersonBy}</td>
                </tr>`
            }
            if (data.customTotalAmount) {
              res += `<tr>
                  <td style="text-align: right;">${vm.$t('SALES.totalAmount')} : </td>
                  <td>${vm.$numberStr(data.customTotalAmount, 2)}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('SALES.amount')} : </td>
                  <td>${vm.$numberStr(params.value, 2)}</td>
                </tr>`
            } else if (data.customTotalCount) {
              res += `<tr>
                  <td style="text-align: right;">${vm.$t('SALES.totalCount')} : </td>
                  <td>${vm.$numberStr(data.customTotalCount, 0)}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('SALES.count')} : </td>
                  <td>${vm.$numberStr(params.value, 0)}</td>
                </tr>`
            }

            res += `<tr>
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
          left: '55%',
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
            radius: '55%',
            center: ['32%', '50%'],
            data,
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
