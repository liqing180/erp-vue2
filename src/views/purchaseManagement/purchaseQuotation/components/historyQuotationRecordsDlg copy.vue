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
      <Echart ref="chartLine" :chart-data="chartOptions" div-resize />
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
      supplierOptions: []
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

          const options = {
            tooltip: {
              trigger: 'item',
              appendToBody: false,
              enterable: true,
              hideDelay: 200,
              backgroundColor: 'rgba(255, 255, 255, 1)',
              textStyle: {
                color: '#333'
              },
              borderWidth: 0,

              formatter: function (params) {
                // const result = `
                //     <table>
                //       <tr>${params[0].name}</tr>
                //       $1
                //       </table>
                // `
                // let trMsg = ''
                // params.forEach(function (item) {
                //   if (item.value !== null && item.value !== undefined) {
                //     trMsg += `<tr>
                //         <td style="text-align: left;">${item.marker} ${item.seriesName} </td>
                //         <td style="font-weight: 600;padding-left: 20px">${
                //           data.currencySymbol
                //         } ${vm.$numberStr(item.value, 2)} </td>
                //       </tr>`
                //   }
                // })
                // return result.replace('$1', trMsg)
                // console.log(params, '==============146')
                const { seriesIndex, dataIndex } = params
                const { isMoreData, unitPrice } = params.data
                const series = imageLineList[seriesIndex].lineDropList
                if (isMoreData !== '1') {
                  const { purchasePriceListList } = series[dataIndex]
                  if (!purchasePriceListList || purchasePriceListList.length <= 0) {
                    return undefined
                  }
                  const row = purchasePriceListList[0]
                  const res = `
                    <table>
                      <tr>
                        <td style="text-align: left;">${vm.$t('PURCHASE.supplierName')} : </td>
                        <td>${params.seriesName}</td>
                      </tr>
                      <tr>
                        <td style="text-align: left;">${vm.$t('PURCHASE.qty')}(${
                    row.basicUom
                  }) : </td>
                        <td>${vm.$numberStr(row.basicQty, row.decimalNum)}</td>
                      </tr>
                      <tr>
                        <td style="text-align: left;">${vm.$t('PURCHASE.unitPrice')}(${
                    data.currencyCode
                  }) : </td>
                        <td>${vm.$numberStr(params.value, 2)}</td>
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
                        <td>${vm.parseTime(row.createdTime, vm.fmtForYmdhms)}</td>
                      </tr>
                    </table>
                  `
                  return res
                } else {
                  const { purchasePriceListList } = series[dataIndex]

                  const commonStyle = 'padding: 0 10px;text-align: center;font-weight: 400'
                  let res = `
                    <div style="max-height: 300px; overflow-y: auto;">
                      <div style="position: sticky;top: 0;background: #fff;height: 30px;padding: 0 10px; font-size: 14px;font-weight: 700">${
                        params.seriesName
                      }  ${data.currencyCode}${unitPrice}</div>
                      <table style="font-size: 12px;">
                        <tr style="position: sticky;top: 30px;background: #fff">
                          <th style="${commonStyle}">${vm.$t('PURCHASE.qty')}(${
                    purchasePriceListList[0].basicUom
                  })</th>
                          <th style="${commonStyle}">${vm.$t('PURCHASE.unitPrice')}(${
                    data.currencyCode
                  })</th>
                          <th style="${commonStyle}">${vm.$t('PURCHASE.incoterm')}</th>
                          <th style="${commonStyle}">${vm.$t('PURCHASE.leadTimeDays')}</th>
                          <th style="${commonStyle}">${vm.$t('PURCHASE.paymentTerm')}</th>
                          <th style="${commonStyle}">${vm.$t('PURCHASE.date')}</th>
                        </tr>
                        
                    `
                  for (let i = 0; i < purchasePriceListList.length; i++) {
                    const row = purchasePriceListList[i]
                    res += `<tr>
                        <td style="${commonStyle}">${vm.$numberStr(
                      row.basicQty,
                      row.decimalNum
                    )}</td>
                        <td style="${commonStyle}">${vm.$numberStr(params.value, 2)}</td>
                        <td style="${commonStyle}">${row.incotermAbbreviation || ''}</td>
                        <td style="${commonStyle}">${row.leadTime || ''}</td>
                        <td style="${commonStyle}">${row.paymentTermName || ''}</td>
                        <td style="${commonStyle}">${vm.parseTime(
                      row.createdTime,
                      vm.fmtForYmdhms
                    )}</td>
                      </tr>`
                  }
                  res += '</table></div>'
                  return res
                }
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
          const imageLineList = data.imageLineList || []
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
                  return vm.$numberStr(params.value, 2)
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
