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
      default: '400px'
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
    initChart(data, lineType) {
      const vm = this
      const { series, xaxis } = data
      const seriesData = []
      series.forEach((x) => {
        seriesData.push({
          name: x.name,
          type: 'line',
          data: x.data,
          symbolSize: 8,
          yAxisIndex: 0 // 关键：绑定第一个 Y 轴（左侧）
        })
        // seriesData.push({
        //   name: x.name,
        //   type: 'line',
        //   data: x.quantities,
        //   yAxisIndex: 1, // 关键：绑定第二个 Y 轴（右侧）
        //   lineStyle: { type: 'dashed' }
        // })
      })

      const options = {
        title: {
          text: this.title,
          left: 0,
          top: 0
        },
        tooltip: {
          trigger: 'item',
          appendToBody: false,
          // triggerOn: 'click',
          enterable: true,
          hideDelay: 200,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          textStyle: {
            color: '#333'
          },
          // position: 'right',
          // position: function (pos, params, dom, rect, size) {
          //   if (size.contentSize[0] > size.viewSize[0] / 2) {
          //     const obj = { top: pos[1] - size.contentSize[1] }
          //     obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
          //     return obj
          //   }
          //   return undefined
          // },
          formatter: function (params) {
            /* <div
              style='display: inline-block;
              width:  12px;
              height: 20px;
              color: ${params.color}'
              >●</div> */
            if (lineType === '1') {
              const { seriesIndex, dataIndex } = params
              const { tooltipData } = series[seriesIndex]
              const row = tooltipData[dataIndex].details[0]
              const res = `
              <table>
                <tr>
                  <td style="text-align: left;">${vm.$t('PURCHASE.supplierName')} : </td>
                  <td>${params.seriesName}</td>
                </tr>
                <tr>
                  <td style="text-align: left;">${vm.$t('PURCHASE.qty')}(${row.basicUom}) : </td>
                  <td>${vm.$numberStr(row.reallyPurchaseQtyForBasic, 3)}</td>
                </tr>
                <tr>
                  <td style="text-align: left;">${vm.$t('PURCHASE.unitPrice')}(${
                data.currencyCode
              }) : </td>
                  <td>${vm.$numberStr(row.legalEntityBasicUnitPrice, 2)}</td>
                </tr>
                <tr>
                  <td style="text-align: left;">${vm.$t('PURCHASE.incoterm')} : </td>
                  <td>${row.incotermAbbreviation || ''}</td>
                </tr>
                <tr>
                  <td style="text-align: left;">${vm.$t('PURCHASE.leadTimeDays')} : </td>
                  <td>${row.leadTime || ''}</td>
                </tr>
                <tr>
                  <td style="text-align: left;">${vm.$t('PURCHASE.paymentTerm')} : </td>
                  <td>${row.paymentTermName || ''}</td>
                </tr>
                <tr>
                  <td style="text-align: left;">${vm.$t('PURCHASE.date')} : </td>
                  <td>${vm.parseTime(row.approvedTime, vm.fmtForYmdhms)}</td>
                </tr>
              </table>
            `
              return res
            } else {
              const { seriesIndex, dataIndex } = params
              const { tooltipData } = series[seriesIndex]
              const { details, avgPrice } = tooltipData[dataIndex]
              const commonStyle = 'padding: 0 10px;text-align: center;font-weight: 400'
              let res = `
              <div style="max-height: 300px; overflow-y: auto;">
                <div style="position: sticky;top: 0;background: #fff;height: 30px;padding: 0 10px; font-size: 14px;font-weight: 700">${
                  params.seriesName
                }  ${data.currencySymbol}${avgPrice}</div>
                <table style="font-size: 12px;">
                  <tr style="position: sticky;top: 30px;background: #fff">
                    <th style="${commonStyle}">${vm.$t('PURCHASE.qty')}(${details[0].basicUom})</th>
                    <th style="${commonStyle}">${vm.$t('PURCHASE.unitPrice')}(${
                data.currencyCode
              })</th>
                    <th style="${commonStyle}">${vm.$t('PURCHASE.incoterm')}</th>
                    <th style="${commonStyle}">${vm.$t('PURCHASE.leadTimeDays')}</th>
                    <th style="${commonStyle}">${vm.$t('PURCHASE.paymentTerm')}</th>
                    <th style="${commonStyle}">${vm.$t('PURCHASE.date')}</th>
                  </tr>
                  
              `
              for (let i = 0; i < details.length; i++) {
                const row = details[i]
                res += `<tr>
                  <td style="${commonStyle}">${vm.$numberStr(row.reallyPurchaseQtyForBasic, 3)}</td>
                  <td style="${commonStyle}">${vm.$numberStr(row.legalEntityBasicUnitPrice, 2)}</td>
                  <td style="${commonStyle}">${row.incotermAbbreviation || ''}</td>
                  <td style="${commonStyle}">${row.leadTime || ''}</td>
                  <td style="${commonStyle}">${row.paymentTermName || ''}</td>
                  <td style="${commonStyle}">${vm.parseTime(row.approvedTime, vm.fmtForYmdhms)}</td>
                </tr>`
              }
              res += '</table></div>'
              return res
            }
          }
        },
        legend: {
          data: series.map((x) => x.name),
          left: 70,
          top: 20
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 80,
          containLabel: true
        },

        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true
          },
          data: xaxis || []
        },
        yAxis: [
          {
            name: data.currencyCode || '',
            type: 'value'
          }
          // {
          //   name: vm.$t('PURCHASE.purchaseQTY'),
          //   type: 'value'
          // }
        ],
        series: seriesData
      }
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }

      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption(options)
    }
  }
}
</script>
