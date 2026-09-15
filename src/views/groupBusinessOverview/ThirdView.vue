<template>
  <FormPageLayout>
    <template v-slot:btn>
      <div class="w100" style="padding-right: 20px">
        <i
          class="el-icon-arrow-left mr40 pointer"
          style="font-size: 20px; font-weight: bold"
          @click="backTop"
        ></i>
        <el-date-picker
          style="width: 240px"
          v-model="form.topDateRange"
          @change="topDateRangeChange"
          type="monthrange"
          align="right"
          :value-format="'timestamp'"
          unlink-panels
          :clearable="false"
          range-separator="-"
          start-placeholder=""
          end-placeholder=""
          :format="fmtForYm"
          :picker-options="pickerOptions"
          popper-class="overviewDate"
        >
        </el-date-picker>
        <right-toolbar
          ref="rightToolbar"
          :saveKey="saveKey"
          :refreshTimeSaveKey="saveKey"
          @autoRefresh="autoRefresh"
          @queryTable="resetSearch"
        >
        </right-toolbar>
      </div>
    </template>
    <template v-slot:content>
      <div class="flex">
        <div class="chart-card flex-1 mr10" style="min-width: 0" v-loading="chart1Loading">
          <div class="title w100">
            {{ $t('GBO.expenseAnalysis') }}
          </div>
          <div class="flex-1" style="max-width: 800px; width: 100%; min-width: 0">
            <Echart :chart-data="chartData1" div-resize />
          </div>
        </div>
        <div class="chart-card flex-1" style="min-width: 0" v-loading="chart1Loading">
          <div class="title w100">
            {{ $t('GBO.revenueAnalysis') }}
          </div>
          <div class="flex-1" style="max-width: 800px; width: 100%; min-width: 0">
            <Echart :chart-data="chartData2" div-resize />
          </div>
        </div>
      </div>
      <div class="chart-table-card mt20">
        <el-table
          class="w100"
          border
          ref="tables"
          v-loading="chart1Loading"
          :data="tableList"
          @sort-change="handleSortChange"
        >
          <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
            <template slot-scope="scope">
              <span v-if="!scope.row.isTotal">{{
                scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in visibleColumn"
            :key="item.prop + item.colSortIndex"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="getMinWidth(item)"
            :show-overflow-tooltip="item.tooltip"
            :fixed="item.fixed"
            :sortable="item.sortable"
            :align="item.align || 'left'"
            header-align="center"
          >
            <template slot-scope="scope">
              <template>{{ scope.row[item.propBy || item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          style="margin-bottom: 0"
          :saveKey="saveKey"
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </template>
  </FormPageLayout>
</template>

<script>
import Echart from '@/components/Common/Echarts/Echart'
import pageMixin from '@/mixins/tableMinx'
import { queryListForExpensesRevenueAnalysis } from '@/api/groupBusinessOverview/index'

export default {
  components: {
    Echart
  },
  props: {
    formData: Object
  },
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      form: this.formData || {},
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      saveKey: '1',
      chartData1: {},

      chartData2: {},

      pickerOptions: {
        shortcuts: [
          {
            text: vm.$t('GBO.thePastYear'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 11)
              picker.$emit('pick', [start.getTime(), end.getTime()])
            }
          },
          {
            text: vm.$t('GBO.thePastTwoYears'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 23)
              picker.$emit('pick', [start.getTime(), end.getTime()])
            }
          },
          {
            text: vm.$t('GBO.thePastThreeYears'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 35)
              picker.$emit('pick', [start.getTime(), end.getTime()])
            }
          }
        ]
      },
      chart1Loading: false,
      tableList: [],
      total: 0,
      // 列信息
      columns: [
        {
          prop: 'businessPartnerNo',
          label: vm.$t('GBO.businessPartnerCode'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('GBO.businessPartnerName'),
          visible: true,
          minWidth: 200,
          padding: 70,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'country',
          label: vm.$t('GBO.country'),
          visible: true,
          minWidth: 200,
          padding: 70,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'currency',
          label: vm.$t('GBO.currency'),
          visible: true,
          minWidth: 200,
          padding: 70,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'expenses',
          label: vm.$t('GBO.expenses'),
          visible: true,
          minWidth: 200,
          padding: 70,
          tooltip: true,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'revenue',
          label: vm.$t('GBO.revenue'),
          visible: true,
          minWidth: 200,
          padding: 70,
          tooltip: true,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'profit',
          label: vm.$t('GBO.profit'),
          visible: true,
          minWidth: 200,
          padding: 70,
          tooltip: true,
          align: 'right',
          sortable: 'custom'
        }
      ]
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYm() {
      return this.fmtForYmd.replace(/-dd|dd-|\/dd|dd\//g, '')
    }
  },

  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible('1', this.columns)

    this.queryData({})
  },
  methods: {
    // 获取时间戳对应月初的时间戳
    getMonthStartTimer(timer) {
      const date = new Date(timer)
      date.setDate(1)
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    },
    // 获取时间戳对应月初的时间戳
    getMonthEndTimer(timer) {
      const date = new Date(timer)
      // 将日期设置为 1 号
      date.setDate(1)
      date.setMonth(date.getMonth() + 1)
      // 将时间设置为该月 1 号 0 点 0 分 0 秒
      date.setHours(0, 0, 0, 0)
      // 减去 1 秒，得到上一个月的最后一秒
      date.setSeconds(date.getSeconds() - 1)
      return date.getTime()
    },
    backTop() {
      this.$emit('backTop', { dateRange: this.queryParams.topDateRange })
    },
    // 获取年月showStr
    getDateShowStr(dateRange) {
      if (dateRange && dateRange.length === 2) {
        const start = this.parseTime(dateRange[0], this.fmtForYm)
        const end = this.parseTime(dateRange[1], this.fmtForYm)
        return `${start} - ${end}`
      }
      return ''
    },
    // 顶部日期范围修改
    topDateRangeChange(value) {
      this.$nextTick(() => {
        this.queryData({})
      })
    },
    // 自动刷新
    autoRefresh() {
      this.queryData({ noLoading: true })
    },
    // 刷新
    resetSearch() {
      this.queryParams.pageNum = 1
      this.queryData({})
    },
    queryData({ noLoading }) {
      this.getList(noLoading)
    },

    setOptions1(params) {
      const vm = this
      const { seriesPie1, totalStr } = params
      const options = {
        title: {
          text: seriesPie1.length ? totalStr : vm.$t('ui.noData'),
          left: 'center', // 水平居中
          top: 'center', // 垂直居中
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#555'
          }
        },
        tooltip: {
          formatter: function (event) {
            const data0 = event.data || {}

            const result = `<table>
                <tr>
                  <td style="text-align: right;">${vm.$t('GBO.businessPartner')} : </td>
                  <td>${data0.name}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('GBO.purchaseAmount')} : </td>
                  <td>${data0.amountStr}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">% : </td>
                  <td>${vm.$numberStr(event.percent, 2)}</td>
                </tr>
              </table>`
            return result
          }
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 10,
          top: 10
        },
        series: [
          {
            left: 20,
            top: 0,
            right: 20,
            bottom: 0,
            startAngle: 0,
            minAngle: 5,
            type: 'pie',
            radius: ['50%', '70%'],
            // left: 'center',
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              fontSize: 12,
              alignTo: 'edge',
              formatter(params) {
                const data = params.data || {}
                return `${data.amountStr} | {proportion|${vm.$numberStr(params.percent, 2)}%} \n ${
                  data.name
                }`
              },
              rich: {
                proportion: {
                  fontSize: 12,
                  color: '#999'
                }
              },
              // width: 200,
              edgeDistance: 1,
              lineHeight: 18
            },
            labelLine: {
              length: 15,
              length2: 0,
              maxSurfaceAngle: 80
            },
            labelLayout: function (params) {
              const isLeft = params.align === 'left'
              // const isLeft = params.labelRect.x < myChart.getWidth() / 2
              const points = params.labelLinePoints
              // Update the end point.
              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width
              return {
                labelLinePoints: points
              }
            },
            data: seriesPie1
          }
        ]
      }
      this.chartData1 = options
    },

    setOptions2(params) {
      const vm = this
      const { seriesPie1, totalStr } = params

      const options = {
        title: {
          show: true,
          text: seriesPie1.length ? totalStr : vm.$t('ui.noData'),
          left: 'center', // 水平居中
          top: 'center', // 垂直居中
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#555'
          }
        },
        tooltip: {
          formatter: function (event) {
            const data0 = event.data || {}

            const result = `<table>
                <tr>
                  <td style="text-align: right;">${vm.$t('GBO.businessPartner')} : </td>
                  <td>${data0.name}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">${vm.$t('GBO.salesAmount')} : </td>
                  <td>${data0.amountStr}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">% : </td>
                  <td>${vm.$numberStr(event.percent, 2)}</td>
                </tr>
              </table>`
            return result
          }
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 1,
          top: 1
        },
        series: [
          {
            left: 20,
            top: 0,
            right: 20,
            bottom: 0,
            startAngle: 0,
            minAngle: 5,
            type: 'pie',
            radius: ['50%', '70%'],
            // left: 'center',
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              fontSize: 12,
              alignTo: 'edge',
              formatter(params) {
                const data = params.data || {}
                return `${data.amountStr} | {proportion|${vm.$numberStr(params.percent, 2)}%} \n ${
                  data.name
                }`
              },
              rich: {
                proportion: {
                  fontSize: 12,
                  color: '#999'
                }
              },

              // width: 200,
              // minMargin: 5,
              edgeDistance: 1,
              lineHeight: 18
            },
            labelLine: {
              length: 15,
              length2: 0,
              maxSurfaceAngle: 80
            },
            labelLayout: function (params) {
              const isLeft = params.align === 'left'
              // const isLeft = params.labelRect.x < myChart.getWidth() / 2
              const points = params.labelLinePoints
              // Update the end point.
              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width
              return {
                labelLinePoints: points
              }
            },
            data: seriesPie1
          }
        ]
      }
      this.chartData2 = options
    },

    getList(noLoading) {
      console.log('queryParams', this.queryParams)

      if (noLoading) {
        this.chart1Loading = false
      } else {
        this.chart1Loading = true
      }
      const timer = Date.now()
      this.queryChart1Timer = timer
      const params = {
        ...this.queryParams,
        legalEntityId: this.form.legalEntityId,
        startDate: this.getMonthStartTimer(this.form.topDateRange[0]),
        endDate: this.getMonthEndTimer(this.form.topDateRange[1])
      }
      this.$trimOfObj(params)

      queryListForExpensesRevenueAnalysis(params)
        .then((res) => {
          if (this.queryChart1Timer !== timer) return
          this.chart1Loading = false
          console.log('222', res)
          this.total = res.total
          const rows = res.rows || []
          const summary = res.summary || {}
          rows.forEach((item) => {
            item.expenses = this.$numberStr(item.expenses, 2)
            item.revenue = this.$numberStr(item.revenue, 2)
            item.profit = this.$numberStr(item.profit, 2)
          })
          if (rows.length > 0) {
            summary.isTotal = true
            summary.expenses = this.$numberStr(summary.totalExpenses, 2)
            summary.revenue = this.$numberStr(summary.totalRevenue, 2)
            summary.profit = this.$numberStr(summary.totalProfit, 2)
            rows.push(summary)
          }
          this.tableList = rows

          /* 设置饼图1数据 */
          const expensesAnalysis = summary.expensesAnalysis || []
          const seriesPie1 = expensesAnalysis.map((item) => {
            return {
              name: item.businessPartnerName,
              value: item.expenses,
              amountStr: `${summary.currencySymbol} ${this.$numberStr(item.expenses, 2)}`
            }
          })
          this.setOptions1({
            seriesPie1,
            totalStr: `${summary.currencySymbol || ''} ${this.$numberStr(summary.totalExpenses, 2)}`
          })

          /* 设置饼图2数据 */
          const revenueAnalysisList = summary.revenueAnalysisList || []
          const seriesPie2 = revenueAnalysisList.map((item) => {
            return {
              name: item.businessPartnerName,
              value: item.revenue,
              amountStr: `${summary.currencySymbol} ${this.$numberStr(item.revenue, 2)}`
            }
          })
          this.setOptions2({
            seriesPie1: seriesPie2,
            totalStr: `${summary.currencySymbol || ''} ${this.$numberStr(summary.totalRevenue, 2)}`
          })
        })
        .catch(() => {
          this.chart1Loading = false
        })
    }
  }
}
</script>
<style></style>
<style lang="scss" scoped>
.chart-card {
  position: relative;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 5px #ccc;
  height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-top: 10px;
    font-weight: bold;
    color: '#333';
    font-family: 'sans-serif';
    font-size: 18px;
  }
}
.chart-table-card {
  position: relative;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 5px #ccc;
  padding: 20px;
}
</style>
