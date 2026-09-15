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

      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption(options)
    }
  }
}
</script>
