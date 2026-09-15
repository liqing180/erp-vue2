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
      const imageLineList = data.imageLineList || []
      let imageXList = data.imageXList || []
      imageXList = imageXList.map((x) => x.subShow)
      // const unqualifiedAmountForBasicList = imageLineList.map((x) => x.unqualifiedAmountForBasic)
      const unqualifiedAmountForBasicList = imageLineList.map((x) => x.unqualifiedQtyForBasic)
      const unqualifiedRateList = imageLineList.map((x) => x.unqualifiedRate)
      const endPercent = (5 / imageXList.length) * 100

      const vm = this
      const options = {
        title: {
          text: vm.$t('PURCHASE.iqcDefectiveRateTrendTop')
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
            const res = `
              <table>
                <tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.supplierName')} : </td>
                  <td>${e.businessPartnerName}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.purchaseStockInQty')} : </td>
                  <td>${vm.$numberStr(e.stockInQtyForBasic, 3)}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.iqcBadMoney')} : </td>
                  <td>${vm.$numberStr(e.unqualifiedAmountForBasic, 2)}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.iqcBadRate')} : </td>
                  <td>${e.unqualifiedRateShowStr}</td>
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
            name: vm.$t('PURCHASE.badNumber'),
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: vm.$t('PURCHASE.badRate'),
            alignTicks: true,
            axisLabel: {
              formatter: function (value) {
                return `${vm.$num(value, 2)}%`
              }
            }
          }
        ],
        series: [
          {
            name: vm.$t('PURCHASE.badNumber'),
            type: 'bar',
            barMaxWidth: 50,
            data: unqualifiedAmountForBasicList
          },

          {
            name: vm.$t('PURCHASE.badRate'),
            type: 'line',
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
