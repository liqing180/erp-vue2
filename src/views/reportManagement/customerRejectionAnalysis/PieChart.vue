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
    chartTitle: {
      type: String,
      default: ''
    },
    analysis: {
      type: Boolean,
      default: false
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
      const imageLineList = data.imageLineList || []
      let imageXList = data.imageXList || []
      imageXList = imageXList.map((x) => x.subShow)

      let unqualifiedAmountForBasicList = imageLineList.map((x) => x.rejectedOrderQTY)
      if (this.analysis) {
        unqualifiedAmountForBasicList = imageLineList.map((x) => x.shippedQty)
      }
      const unqualifiedRateList = imageLineList.map((x) => x.rejectionRate)
      const endPercent = (5 / imageXList.length) * 100

      const vm = this
      const options = {
        title: {
          text: vm.chartTitle || vm.$t('PURCHASE.rejectedTop')
          // top: 0
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            /* <div
              style='display: inline-block;
              width:  12px;
              height: 20px;
              color: ${params.color}'
              >●</div> */
            const dataIndex = params.dataIndex
            const e = imageLineList[dataIndex]
            let res = `
              <table>
                <tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.customerName')} : </td>
                  <td>${e.businessPartnerName}</td>
                </tr>`

            if (vm.analysis) {
              res += `<tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.productName')} : </td>
                  <td>${e.productName}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.shippedQty')} : </td>
                  <td>${vm.$numberStr(e.shippedQty, 3)}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.rejectedQty')} : </td>
                  <td>${vm.$numberStr(e.rejectedQty, 3)}</td>
                </tr>
                `
            } else {
              res += `<tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.salesOrderQTY')} : </td>
                  <td>${e.salesOrderQTY}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.rejectedOrderQTY')} : </td>
                  <td>${e.rejectedOrderQTY}</td>
                </tr>`
            }

            res += `<tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.rejectionRate')} : </td>
                  <td>${e.rejectionRateShowStr}</td>
                </tr>
              </table>
            `
            return res
          }
        },
        legend: {},
        xAxis: [
          {
            type: 'category',
            data: imageXList,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: vm.$t('PURCHASE.rejectedQty2'),
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: vm.$t('PURCHASE.rejectionRate'),
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: vm.$t('PURCHASE.rejectedQty2'),
            type: 'bar',
            barMaxWidth: 50,
            data: unqualifiedAmountForBasicList
          },

          {
            name: vm.$t('PURCHASE.rejectionRate'),
            type: 'line',
            smooth: false,
            yAxisIndex: 1,
            data: unqualifiedRateList
          }
        ],
        dataZoom: [
          {
            type: 'inside', // 鼠标可拖动
            show: false,
            start: 0, // 滚动条开始位置
            end: endPercent, // 滚动条结束位置
            handleSize: 2
          },
          {
            type: 'slider',
            show: true,
            start: 0,
            end: endPercent,
            showDetail: false,
            handleSize: 2
          }
        ]
      }
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption(options)
    }
  }
}
</script>
