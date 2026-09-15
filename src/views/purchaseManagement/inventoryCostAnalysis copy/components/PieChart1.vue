<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts' // echarts theme
import resize from '@/views/dashboard/mixins/resize'
require('echarts/theme/macarons')

export default {
  dicts: ['i_stock_certificate_document_type'],
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
    typeDicts: {
      type: Array,
      default: () => []
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
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
      const vm = this
      const { imageXList, purchaseCostList, currencySymbol } = data
      const xAxisData = (imageXList || []).map((x) => x.subShow)
      const yData = (purchaseCostList || []).map((x) => x.inventoryUnitPriceAllWarehouse)
      const options = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.8)',
          textStyle: {
            color: '#333333'
          },
          formatter: function (params) {
            const { dataIndex } = params[0]
            const { documentType, stockOutInNoteNo, createdTime, inventoryUnitPriceAllWarehouse } =
              purchaseCostList[dataIndex]
            const documentTypeStr = vm.selectDictLabel(vm.typeDicts, documentType)
            const res = `<table>
                <tr>
                  <td style="text-align: right;">${vm.$t('INVENTORY.stockOutStockInNote')} : </td>
                  <td>${stockOutInNoteNo}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('INVENTORY.documentType')} : </td>
                  <td>${documentTypeStr}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.updatedTime')} : </td>
                  <td>${vm.parseTime(createdTime, vm.fmtForYmdhms)}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('PURCHASE.purchaseCost')} : </td>
                  <td>${vm.$numberStr(inventoryUnitPriceAllWarehouse, 2)}</td>
                </tr>
              </table>`
            return res
          }
        },
        grid: {
          left: 50,
          right: 70,
          bottom: '3%',
          containLabel: true
        },

        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true
          },
          name: '',
          data: xAxisData || []
        },
        yAxis: {
          name: currencySymbol,
          type: 'value'
        },
        series: [
          {
            type: 'line',
            data: yData
          }
        ]
      }
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }

      // this.setOptions()

      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption(options)
    },
    setOptions() {
      const data1 = [3, 4, 5, 6, 7]
      const data2 = [7, 6, 5, 4, 3]
      const obj1 = {
        name: '柱1',
        type: 'bar',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        stack: '1',
        itemStyle: {
          normal: { color: '#409EFF' }
        },
        data: data1
      }
      const obj2 = {
        name: '柱2',
        type: 'bar',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        stack: '1',
        itemStyle: {
          normal: { color: '#67C23A' }
        },
        label: {
          normal: {
            show: true,
            position: 'center',
            formatter: function (params) {
              const { dataIndex } = params
              const utilized = data1[dataIndex] || 0
              const unused = data2[dataIndex] || 0
              return utilized + unused
            }, // 显示的总数
            textStyle: { color: '#000' }
          }
        },
        data: data2
      }
      const line1 = {
        name: 'per',
        type: 'line',
        // yAxisIndex: 2,
        symbolSize: 10,
        smooth: true,
        data: [5, 6, 7, 8, 9],
        connectNulls: true
      }
      const seriesData = []
      seriesData.push(obj1)
      seriesData.push(obj2)
      seriesData.push(line1)
      const options = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: 50,
          right: 70,
          bottom: '3%',
          containLabel: true
        },

        xAxis: {
          name: 'x',
          axisTick: {
            alignWithLabel: true
          },
          data: [1, 2, 3, 4, 5]
        },
        yAxis: [
          {
            name: 'per',
            type: 'value',
            splitNumber: 5,
            axisLine: {
              show: false
            }
          },
          {
            name: 'y',
            type: 'value',
            splitNumber: 5,
            show: false,
            axisLine: {
              show: false
            }
          }
        ],
        series: seriesData
      }

      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption(options)
    }
  }
}
</script>
