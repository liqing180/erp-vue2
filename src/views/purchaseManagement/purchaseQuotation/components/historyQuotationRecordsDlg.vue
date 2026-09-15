<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.purchaseQuotationRecord')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
  >
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item :label="$t('PURCHASE.supplier')">
        <CommonMultipleSelect
          style="width: 300px"
          :ids="queryParams.businessPartnerIdList"
          :labels="queryParams.businessPartnerNameList"
          idKey="businessPartnerId"
          labelKey="businessPartnerName"
          :options="supplierOptions"
          @change="supplierChange"
        />
      </el-form-item>
    </el-form>
    <div class="price-chart-box" v-loading="loading">
      <Echart
        ref="chartLine"
        :chart-data="chartOptions"
        div-resize
        isLegendSelectChanged
        @legendSelectChanged="legendSelectChanged"
      />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  queryHistoryQuotationRecordsImageSearch,
  queryHistoryQuotationRecordsImage
} from '@/api/purchaseManagement/purchaseQuotation'
import Echart from '@/views/purchaseManagement/purchaseContract/components/Echart'
export default {
  components: { Echart },
  props: {
    warehouseId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      visible: false,
      queryParams: {
        businessPartnerIdList: [],
        businessPartnerNameList: []
      },
      chartOptions: {},
      params: {},
      supplierOptions: [],
      legendSelect: undefined
    }
  },
  computed: {},
  created() {},
  methods: {
    supplierChange(ids, labels) {
      this.$set(this.queryParams, 'businessPartnerIdList', ids)
      this.$set(this.queryParams, 'businessPartnerNameList', labels)
      this.queryList()
    },
    handleOpen(params) {
      this.queryParams = {
        ...params,
        businessPartnerIdList: [],
        businessPartnerNameList: []
      }
      console.log(this.queryParams, '==============75')
      this.supplierOptions = []
      /* const params = {
        productId: row.productId,
        currencyId: row.currencyId,
        purchaseUomCoefficient: row.purchaseUomCoefficient,
        businessPartnerIdList: []
      } */
      const searchParams = {
        productId: params.productId
      }
      if (params.purchaseQuotationDetail) {
        searchParams.purchaseQuotationDetail = params.purchaseQuotationDetail
      }
      queryHistoryQuotationRecordsImageSearch(searchParams).then((res) => {
        const data = res.data || {}
        const businessPartnerList = data.businessPartnerList || []
        this.supplierOptions = businessPartnerList
        if (params.businessPartnerIdList && params.businessPartnerIdList.length > 0) {
          const defaultList = businessPartnerList.filter((item) =>
            params.businessPartnerIdList.includes(item.businessPartnerId)
          )

          if (defaultList.length > 0) {
            const ids = defaultList.map((item) => item.businessPartnerId)
            const names = defaultList.map((item) => item.businessPartnerName)
            this.$set(this.queryParams, 'businessPartnerIdList', ids)
            this.$set(this.queryParams, 'businessPartnerNameList', names)
          }
        }
        this.queryList()
      })

      this.visible = true
    },
    legendSelectChanged(data = {}) {
      this.legendSelect = data
    },
    queryList() {
      const vm = this
      const queryTime = Date.now()
      this.queryTime = queryTime
      const params = { ...this.queryParams }
      delete params.businessPartnerNameList
      this.loading = true
      queryHistoryQuotationRecordsImage({ ...params })
        .then((res) => {
          if (queryTime !== this.queryTime) {
            return
          }
          const data = res.data || []
          const imageLineList = data.imageLineList || []

          const options = {
            tooltip: {
              // trigger: 'axis',
              trigger: 'item',
              appendToBody: false,
              enterable: true,
              hideDelay: 200,
              backgroundColor: 'rgba(255, 255, 255, 1)',
              textStyle: {
                color: '#333'
              },
              borderWidth: 0,
              position: function (pos, params, dom, rect, size) {
                const obj = {}
                const chartWidth = size.viewSize[0]
                const mouseX = pos[0]

                // 设置一个缓冲比例，比如左右各 40% 的区域
                const threshold = chartWidth * 0.4

                if (mouseX < threshold) {
                  // 鼠标在左侧 40% 区域
                  obj.left = 10
                } else if (mouseX > chartWidth - threshold) {
                  // 鼠标在右侧 40% 区域
                  obj.right = 10
                } else {
                  // 鼠标在中间 20% 区域，可以让 tooltip 居中，或者固定靠右
                  obj.left = (chartWidth - size.contentSize[0]) / 2
                }
                obj.top = pos[1] - size.contentSize[1] / 2 - 60

                return obj
              },

              formatter: function (params) {
                console.log(params, '==============146')

                const { dataIndex, value } = params
                let list = imageLineList.filter(
                  (x) => !vm.legendSelect || vm.legendSelect[x.reportName]
                )
                list = list
                  .map((item) => {
                    if (item.lineDropList && item.lineDropList[dataIndex]) {
                      const { unitPrice, purchasePriceListList } = item.lineDropList[dataIndex]
                      if (unitPrice === value) {
                        return {
                          reportName: item.reportName,
                          purchasePriceListList
                        }
                      }
                    }
                    // 补全返回值，避免返回 undefined
                    return null
                  })
                  .filter((x) => x !== null)
                console.log(list, '==============153')

                let res = ''
                const commonStyle = 'padding: 5px 10px;text-align: center;font-weight: 400'
                res += `
                      <div style="max-height: 600px; overflow-y: auto;">
                      <table style="font-size: 12px;" border="1" bordercolor="#e0e0e0" cellspacing="0" cellpadding="0">
                        <tr style="background: #f8f8f9">
                          <th style="${commonStyle}">${vm.$t('PURCHASE.supplierName')}</th>
                          <th style="${commonStyle}">${vm.$t('PURCHASE.qty')}</th>
                          <th style="${commonStyle}">${vm.$t('PURCHASE.unitPrice')}(${
                  data.currencyCode
                })</th>
                          <th style="${commonStyle}">${vm.$t('PURCHASE.incoterm')}</th>
                          <th style="${commonStyle}">${vm.$t('PURCHASE.leadTimeDays')}</th>
                          <th style="${commonStyle}">${vm.$t('PURCHASE.paymentTerm')}</th>
                          <th style="${commonStyle}">${vm.$t('PURCHASE.date')}</th>
                        </tr>
                    `
                list.forEach((item) => {
                  const { purchasePriceListList, reportName } = item
                  for (let i = 0; i < purchasePriceListList.length; i++) {
                    const row = purchasePriceListList[i]
                    res += `
                      <tr>
                        <td style="${commonStyle}">${reportName || ''}</td>
                        <td style="${commonStyle}">${vm.$numberStr(
                      row.basicQty,
                      row.decimalNum
                    )}</td>
                        <td style="${commonStyle}">${vm.$numberStr(row.unitPrice, 6, false, 2)}</td>
                        <td style="${commonStyle}">${row.incotermAbbreviation || ''}</td>
                        <td style="${commonStyle}">${row.leadTime || ''}</td>
                        <td style="${commonStyle}">${row.paymentTermName || ''}</td>
                        <td style="${commonStyle}">${vm.parseTime(
                      row.createdTime,
                      vm.fmtForYmdhms
                    )}</td>
                      </tr>`
                  }
                })
                res += '</table></div>'
                return res

                // return ''
                // const list = (params || []).filter((x) => vm.$resultOfBoolean(x.value))
                // let res = ''
                // list.forEach((item) => {
                //   const { seriesIndex, dataIndex } = item
                //   const { unitPrice } = item.data || {}
                //   const series = imageLineList[seriesIndex].lineDropList
                //   const { purchasePriceListList } = series[dataIndex]

                //   const commonStyle = 'padding: 0 10px;text-align: center;font-weight: 400'
                //   res += `
                //     <div style="max-height: 300px; overflow-y: auto;">
                //       <div style="position: sticky;top: 0;background: #fff;height: 30px;padding: 0 10px; font-size: 14px;font-weight: 700">${
                //         item.seriesName
                //       }  ${data.currencyCode}${unitPrice}</div>
                //       <table style="font-size: 12px;">
                //         <tr style="position: sticky;top: 30px;background: #fff">
                //           <th style="${commonStyle}">${vm.$t('PURCHASE.qty')}(${
                //     purchasePriceListList[0].basicUom
                //   })</th>
                //           <th style="${commonStyle}">${vm.$t('PURCHASE.unitPrice')}(${
                //     data.currencyCode
                //   })</th>
                //           <th style="${commonStyle}">${vm.$t('PURCHASE.incoterm')}</th>
                //           <th style="${commonStyle}">${vm.$t('PURCHASE.leadTimeDays')}</th>
                //           <th style="${commonStyle}">${vm.$t('PURCHASE.paymentTerm')}</th>
                //           <th style="${commonStyle}">${vm.$t('PURCHASE.date')}</th>
                //         </tr>

                //     `
                //   for (let i = 0; i < purchasePriceListList.length; i++) {
                //     const row = purchasePriceListList[i]
                //     res += `<tr>
                //         <td style="${commonStyle}">${vm.$numberStr(
                //       row.basicQty,
                //       row.decimalNum
                //     )}</td>
                //         <td style="${commonStyle}">${vm.$numberStr(item.value, 2)}</td>
                //         <td style="${commonStyle}">${row.incotermAbbreviation || ''}</td>
                //         <td style="${commonStyle}">${row.leadTime || ''}</td>
                //         <td style="${commonStyle}">${row.paymentTermName || ''}</td>
                //         <td style="${commonStyle}">${vm.parseTime(
                //       row.createdTime,
                //       vm.fmtForYmdhms
                //     )}</td>
                //       </tr>`
                //   }
                //   res += '</table></div>'
                // })
                // return res
              }
            },
            legend: {},
            grid: {
              top: '15%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },

            xAxis: {
              type: 'category',
              boundaryGap: true,
              axisTick: {
                alignWithLabel: true
              },
              data: [
                // '10-10-2013',
                // '11-10-2013',
                // '12-10-2013',
                // '13-10-2013',
                // '13-10-2013',
                // '13-10-2013',
                // '14-10-2013',
                // '15-10-2013',
                // '16-10-2013',
                // '18-10-2013'
              ]
            },
            yAxis: {
              name: '',
              type: 'value'
            },
            series: [],
            title: {
              show: false,
              text: this.$t('ui.noData'),
              left: 'center',
              top: 'center',
              textStyle: {
                color: '#999',
                fontSize: 20
              }
            }
          }
          this.chartOptions = {}

          const imageXList = data.imageXList || []
          options.legend.data = imageLineList.map((item) => item.businessPartnerName)
          options.yAxis.name = imageLineList && imageLineList.length > 0 ? data.currencyCode : ''
          options.xAxis.data = imageXList.map((item) => item.subShow)
          options.series = imageLineList.map((item) => {
            const lineDropList = item.lineDropList || []
            return {
              name: item.businessPartnerName,
              type: 'line',
              connectNulls: true,
              symbolSize: 10,
              data: lineDropList.map((item) => {
                if (this.$resultOfBoolean(item.unitPrice)) {
                  return {
                    ...item,
                    value: item.unitPrice
                  }
                } else {
                  return undefined
                }
              }),
              label: {
                show: false,
                formatter(params) {
                  return vm.$numberStr(params.value, 6, false, 2)
                }
              }
            }
          })
          options.title.show = imageXList.length === 0
          options.xAxis.show = imageXList.length > 0
          this.chartOptions = options

          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    handleBack() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.price-chart-box {
  width: 100%;
  height: 500px;
}
</style>
