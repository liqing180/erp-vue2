<template>
  <FormPageLayout>
    <template v-slot:btn>
      <div class="w100" style="padding-right: 20px">
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
      <div style="display: flex; gap: 10px" v-loading="topChartLoading">
        <div
          class="chart--top-card flex-1"
          @click="$emit('goToNextPage', { dateRange: form.topDateRange })"
        >
          <div class="title">{{ $t('GBO.purchaseExpenses') }}</div>
          <div class="num">
            {{ topMsgData.currencySymbol }} {{ $numberStr(topMsgData.purchaseExpenses, 2) }}
          </div>
          <div class="content">
            <div class="yearOnYear">
              <span>{{ $t('GBO.yearOnYear') }}</span>
              <span>
                <span
                  style="font-weight: bold; margin-left: 10px; margin-right: 4px"
                  :style="`color: ${getColor(topMsgData.purchaseExpensesForOverYearForRate)}`"
                  >{{ topMsgData.purchaseExpensesForOverYearForRate }}%</span
                >
                <span>
                  <svg-icon
                    v-if="topMsgData.purchaseExpensesForOverYearForRate > 0"
                    icon-class="up1"
                  />
                  <svg-icon
                    v-if="topMsgData.purchaseExpensesForOverYearForRate < 0"
                    icon-class="down-red"
                  />
                </span>
              </span>
            </div>
            <div class="monthOnMonth">
              <span>{{ $t('GBO.monthOnMonth') }}</span>
              <span>
                <span
                  style="font-weight: bold; margin-left: 10px; margin-right: 4px"
                  :style="`color: ${getColor(topMsgData.purchaseExpensesForOverMonthForRate)}`"
                  >{{ topMsgData.purchaseExpensesForOverMonthForRate }}%</span
                >
                <span>
                  <svg-icon
                    v-if="topMsgData.purchaseExpensesForOverMonthForRate > 0"
                    icon-class="up1"
                  />
                  <svg-icon
                    v-if="topMsgData.purchaseExpensesForOverMonthForRate < 0"
                    icon-class="down-red"
                  />
                </span>
              </span>
            </div>
          </div>
        </div>

        <div
          class="chart--top-card flex-1"
          @click="$emit('goToNextPage', { dateRange: form.topDateRange })"
        >
          <div class="title">{{ $t('GBO.salesRevenue') }}</div>
          <div class="num">
            {{ topMsgData.currencySymbol }} {{ $numberStr(topMsgData.salesRevenue, 2) }}
          </div>
          <div class="content">
            <div class="yearOnYear">
              <span>{{ $t('GBO.yearOnYear') }}</span>
              <span>
                <span
                  style="font-weight: bold; margin-left: 10px; margin-right: 4px"
                  :style="`color: ${getColor(topMsgData.salesRevenueForOverYearForRate)}`"
                  >{{ topMsgData.salesRevenueForOverYearForRate }}%</span
                >
                <span>
                  <svg-icon v-if="topMsgData.salesRevenueForOverYearForRate > 0" icon-class="up1" />
                  <svg-icon
                    v-if="topMsgData.salesRevenueForOverYearForRate < 0"
                    icon-class="down-red"
                  />
                </span>
              </span>
            </div>
            <div class="monthOnMonth">
              <span>{{ $t('GBO.monthOnMonth') }}</span>
              <span>
                <span
                  style="font-weight: bold; margin-left: 10px; margin-right: 4px"
                  :style="`color: ${getColor(topMsgData.salesRevenueForOverMonthForRate)}`"
                  >{{ topMsgData.salesRevenueForOverMonthForRate }}%</span
                >
                <span>
                  <svg-icon
                    v-if="topMsgData.salesRevenueForOverMonthForRate > 0"
                    icon-class="up1"
                  />
                  <svg-icon
                    v-if="topMsgData.salesRevenueForOverMonthForRate < 0"
                    icon-class="down-red"
                  />
                </span>
              </span>
            </div>
          </div>
        </div>

        <div
          class="chart--top-card flex-1"
          @click="$emit('goToNextPage', { dateRange: form.topDateRange })"
        >
          <div class="title">{{ $t('GBO.profit') }}</div>
          <div class="num">
            {{ topMsgData.currencySymbol }} {{ $numberStr(topMsgData.profit, 2) }}
          </div>
          <div class="content">
            <div class="yearOnYear">
              <span>{{ $t('GBO.yearOnYear') }}</span>
              <span>
                <span
                  style="font-weight: bold; margin-left: 10px; margin-right: 4px"
                  :style="`color: ${getColor(topMsgData.profitForOverYearForRate)}`"
                  >{{ topMsgData.profitForOverYearForRate }}%</span
                >
                <span>
                  <svg-icon v-if="topMsgData.profitForOverYearForRate > 0" icon-class="up1" />
                  <svg-icon v-if="topMsgData.profitForOverYearForRate < 0" icon-class="down-red" />
                </span>
              </span>
            </div>
            <div class="monthOnMonth">
              <span>{{ $t('GBO.monthOnMonth') }}</span>
              <span>
                <span
                  style="font-weight: bold; margin-left: 10px; margin-right: 4px"
                  :style="`color: ${getColor(topMsgData.profitForOverMonthForRate)}`"
                  >{{ topMsgData.profitForOverMonthForRate }}%</span
                >
                <span>
                  <svg-icon v-if="topMsgData.profitForOverMonthForRate > 0" icon-class="up1" />
                  <svg-icon v-if="topMsgData.profitForOverMonthForRate < 0" icon-class="down-red" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card mt20" v-loading="chart1Loading">
        <div class="select-warp">
          <el-select
            style="width: 140px"
            size="small"
            v-model="form.chart1YearType"
            :clearable="false"
            @change="changeChart1YearType"
          >
            <el-option
              v-for="child in yearSelectData"
              :key="child.value + '11'"
              :label="child.label"
              :value="child.value"
            >
            </el-option>
          </el-select>
          <span class="right-text ml10">{{ getDateShowStr(form.chart1DateRange) }}</span>
        </div>
        <Echart
          @clickBar="chart1BarClick"
          @clickGrid="chart1GridClick"
          :chart-data="chartData1"
          div-resize
        />
        <!-- <el-empty v-else style="height: 300px" :description="$t('ui.noData')" /> -->
      </div>

      <div class="chart-card mt20" v-loading="chart2Loading">
        <div class="select-warp">
          <el-select
            style="width: 140px"
            size="small"
            v-model="form.chart2YearType"
            :clearable="false"
            @change="changeChart2YearType"
          >
            <el-option
              v-for="child in yearSelectData"
              :key="child.value + '11'"
              :label="child.label"
              :value="child.value"
            >
            </el-option>
          </el-select>
          <span class="right-text ml10">{{ getDateShowStr(form.chart2DateRange) }}</span>
        </div>
        <Echart
          @clickBar="chart2BarClick"
          @clickGrid="chart2GridClick"
          :chart-data="chartData2"
          div-resize
        />
        <!-- <el-empty v-else style="height: 300px" :description="$t('ui.noData')" /> -->
      </div>
    </template>
  </FormPageLayout>
</template>

<script>
import Echart from '@/components/Common/Echarts/Echart'
import { queryExpensesRevenueProfitTrend, queryTopMsg } from '@/api/groupBusinessOverview/index'
export default {
  components: {
    Echart
  },
  props: {
    formData: Object
  },
  data() {
    const vm = this
    return {
      form: this.formData || {},
      saveKey: '1',
      topChartLoading: false,
      topMsgData: {},

      chart1Loading: false,
      chartData1: {},

      chart2Loading: false,
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
      yearSelectData: [
        {
          value: '1',
          label: vm.$t('GBO.thePastYear')
        },
        {
          value: '2',
          label: vm.$t('GBO.thePastTwoYears')
        },
        {
          value: '3',
          label: vm.$t('GBO.thePastThreeYears')
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
    this.queryData({})
  },
  methods: {
    getColor(value) {
      if (value < 0) {
        return '#ed606d'
      }
      if (value > 0) {
        return '#00c297'
      }
      return '#666'
    },
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
    // 获取年月showStr
    getDateShowStr(dateRange) {
      if (dateRange && dateRange.length === 2) {
        const start = this.parseTime(dateRange[0], this.fmtForYm)
        const end = this.parseTime(dateRange[1], this.fmtForYm)
        return `${start} - ${end}`
      }
      return ''
    },

    // 自动刷新
    autoRefresh() {
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      this.queryData({ noLoading: true })
    },
    // 刷新
    resetSearch() {
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      this.queryData({})
    },
    queryData({ noLoading }) {
      this.queryTopChartData(noLoading)
      this.queryChart1Data(noLoading)
      this.queryChart2Data(noLoading)
    },

    queryTopChartData(noLoading) {
      if (noLoading) {
        this.topChartLoading = false
      } else {
        this.topChartLoading = true
      }
      const timer = Date.now()
      this.queryTopChartTimer = timer
      queryTopMsg({
        startDate: this.getMonthStartTimer(this.form.topDateRange[0]),
        endDate: this.getMonthEndTimer(this.form.topDateRange[1])
      })
        .then((res) => {
          if (this.queryTopChartTimer !== timer) return
          this.topChartLoading = false
          this.topMsgData = res.data || {}
        })
        .catch(() => {
          this.topChartLoading = false
        })
    },
    // 顶部日期范围修改
    topDateRangeChange(value) {
      this.$nextTick(() => {
        this.queryTopChartData()
      })
    },

    changeChart1YearType(value) {
      const end = new Date()
      const start = new Date()
      switch (value) {
        case '1':
          start.setMonth(start.getMonth() - 11)
          this.form.chart1DateRange = [start.getTime(), end.getTime()]
          break
        case '2':
          start.setMonth(start.getMonth() - 23)
          this.form.chart1DateRange = [start.getTime(), end.getTime()]
          break
        case '3':
          start.setMonth(start.getMonth() - 35)
          this.form.chart1DateRange = [start.getTime(), end.getTime()]
          break
      }
      this.queryChart1Data()
    },
    queryChart1Data(noLoading) {
      if (noLoading) {
        this.chart1Loading = false
      } else {
        this.chart1Loading = true
      }
      const timer = Date.now()
      this.queryChart1Timer = timer

      queryExpensesRevenueProfitTrend({
        startDate: this.getMonthStartTimer(this.form.chart1DateRange[0]),
        endDate: this.getMonthEndTimer(this.form.chart1DateRange[1])
      })
        .then((res) => {
          if (this.queryChart1Timer !== timer) return
          this.chart1Loading = false
          console.log('222', res)
          const data = res.data || {}
          const imageXList = data.imageXList || []
          const xAxisData = imageXList.map((item) => item.subShow)

          const imageLineList = data.imageLineList || []
          const profitLine = imageLineList.find((item) => item.type === 'profit') || {}
          const lineDatas = profitLine.lineDropList || []
          const barData1 = lineDatas.map((item) => {
            return {
              value: item.value,
              startDate: item.startDate,
              endDate: item.endDate,
              itemStyle: { color: item.value < 0 ? '#f53f3f' : null },
              // label: { position: item.value < 0 ? 'bottom' : null },
              showText: `${data.currencySymbol} ${this.$numberStr(item.value, 2)}`
            }
          })
          this.setOptions1({
            xAxisData,
            seriesData: barData1,
            currencySymbol: data.currencySymbol
          })
        })
        .catch(() => {
          this.chart1Loading = false
        })
    },
    setOptions1(params) {
      const vm = this
      const { xAxisData, seriesData, currencySymbol } = params
      const options = {
        title: {
          text: this.$t('GBO.profitTrend'),
          top: 10,
          left: 20
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (event) {
            const res0 = event[0]

            const data0 = res0.data || {}

            const result = `<table>
              <tr>
                <td style="text-align: right;">${vm.$t('GBO.time')} : </td>
                <td>${res0.name}</td>
              </tr>
              <tr>
                <td style="text-align: right;">${vm.$t('GBO.profit')} : </td>
                <td>${data0.showText}</td>
              </tr>
            </table>`
            return result
          }
        },
        grid: {
          left: '40',
          right: '40',
          bottom: '20',
          top: '80',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          show: true,

          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          name: currencySymbol,
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: [12, 5]
            }
          }
        },
        series: [
          {
            name: this.$t('GBO.profit'),
            data: seriesData,
            type: 'bar',
            barMinWidth: 30,
            barMaxWidth: 50,

            label: {
              show: false,
              fontSize: 12,
              position: 'top',
              fontWeight: 'bold',
              distance: 4,
              formatter(params) {
                const data = params.data || {}
                return `${data.value ? vm.$numberStr(data.value, 2) : ''}`
              }
            },
            itemStyle: {
              color: '#02a7f0'
            }
          }
        ]
        // graphic: [
        //   {
        //     type: 'group',
        //     left: 'center',
        //     top: 'center',
        //     children: [
        //       {
        //         type: 'text',
        //         z: 100,
        //         left: 'center',
        //         top: 'center',
        //         style: {
        //           fill: '#888',
        //           width: 220,
        //           overflow: 'break',
        //           text: params.isEmpty ? this.$t('REPORT.failed0') : '',
        //           font: 'bold 24px Microsoft YaHei'
        //         }
        //       }
        //     ]
        //   }
        // ]
      }
      if (xAxisData.length > 12) {
        options.dataZoom = [
          {
            type: 'slider',
            showDetail: false, // 拖拽时候显示详细数值信息
            start: 0, // 数据窗口范围的起始百分比
            end: (12 / xAxisData.length) * 100, // 数据窗口范围的结束百分比
            zoomLock: true, // 是否锁定选择区域, 只能平移，不能缩放
            handleIcon: 'null',
            height: 30,
            brushSelect: false, // 是否开启刷选功能
            bottom: 20
          }
        ]
        options.grid.bottom = '60'
      }
      this.chartData1 = options
    },
    chart1BarClick() {},
    chart1GridClick(params, xIndex) {
      // console.log('1Grid', params, xIndex)
      const item = this.chartData1.series[0].data[xIndex]
      console.log(this.parseTime(item.endDate - 1000))
      this.$emit('goToNextPage', { dateRange: [item.startDate, item.endDate - 1000] })
    },

    queryChart2Data(noLoading) {
      if (noLoading) {
        this.chart2Loading = false
      } else {
        this.chart2Loading = true
      }
      const timer = Date.now()
      this.queryChart2Timer = timer
      queryExpensesRevenueProfitTrend({
        startDate: this.getMonthStartTimer(this.form.chart2DateRange[0]),
        endDate: this.getMonthEndTimer(this.form.chart2DateRange[1])
      })
        .then((res) => {
          if (this.queryChart2Timer !== timer) return
          this.chart2Loading = false
          const data = res.data || {}
          const imageXList = data.imageXList || []
          const xAxisData = imageXList.map((item) => item.subShow)

          const imageLineList = data.imageLineList || []
          const purchaseExpenses =
            imageLineList.find((item) => item.type === 'purchaseExpenses') || {}
          const line1 = purchaseExpenses.lineDropList || []
          const line1Data = line1.map((item) => {
            return {
              value: item.value,
              startDate: item.startDate,
              endDate: item.endDate,
              showText: `${data.currencySymbol} ${this.$numberStr(item.value, 2)}`
            }
          })
          const salesRevenue = imageLineList.find((item) => item.type === 'salesRevenue') || {}
          const line2 = salesRevenue.lineDropList || []
          const line2Data = line2.map((item) => {
            return {
              value: item.value,
              showText: `${data.currencySymbol} ${this.$numberStr(item.value, 2)}`
            }
          })

          this.setOptions2({
            xAxisData,
            seriesLine1: line1Data,
            seriesLine2: line2Data,
            currencySymbol: data.currencySymbol
          })
        })
        .catch(() => {
          this.chart2Loading = false
        })
    },
    changeChart2YearType(value) {
      console.log(value)
      const end = new Date()
      const start = new Date()
      switch (value) {
        case '1':
          start.setMonth(start.getMonth() - 11)
          this.form.chart2DateRange = [start.getTime(), end.getTime()]
          break
        case '2':
          start.setMonth(start.getMonth() - 23)
          this.form.chart2DateRange = [start.getTime(), end.getTime()]
          break
        case '3':
          start.setMonth(start.getMonth() - 35)
          this.form.chart2DateRange = [start.getTime(), end.getTime()]
          break
      }
      this.queryChart2Data()
    },
    chart2BarClick(params) {},
    chart2GridClick(params, xIndex) {
      // console.log('2Grid', params, xIndex)
      const item = this.chartData2.series[0].data[xIndex]
      this.$emit('goToNextPage', { dateRange: [item.startDate, item.endDate - 1000] })
    },
    setOptions2(params) {
      const vm = this
      const { xAxisData, seriesLine1, seriesLine2, currencySymbol } = params
      const options = {
        title: {
          text: this.$t('GBO.expensesAndRevenueTrend'),
          top: 10,
          left: 20
        },
        legend: {
          // left: '20%',
          top: 30
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (event) {
            const res0 = event[0]
            const res1 = event[1]

            const data0 = res0.data || {}
            const data1 = res1.data || {}

            const result = `<table>
              <tr>
                <td style="text-align: right;">${vm.$t('GBO.time')} : </td>
                <td>${res0.name}</td>
              </tr>
              <tr>
                <td style="text-align: right;">${vm.$t('GBO.expenses')} : </td>
                <td>${data0.showText}</td>
              </tr>
              <tr>
                <td style="text-align: right;">${vm.$t('GBO.revenue')} : </td>
                <td>${data1.showText}</td>
              </tr>
            </table>`

            return result
          }
        },

        grid: {
          left: '40',
          right: '40',
          bottom: '20',
          top: '80',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          show: true,
          triggerEvent: true,

          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          name: currencySymbol,
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: [12, 5]
            }
          }
        },
        series: [
          {
            name: this.$t('GBO.expenses'),
            data: seriesLine1,
            type: 'line',
            itemStyle: {
              color: '#15c9c9'
            },
            areaStyle: {
              opacity: 0.1
              // color: ""
            }
          },
          {
            name: this.$t('GBO.revenue'),
            data: seriesLine2,
            type: 'line',
            label: {
              show: false,
              fontSize: 14,
              position: 'top',
              distance: 15
              // align: 'left', // 左对齐
            },
            itemStyle: {
              color: '#165DFF'
            },
            areaStyle: {
              opacity: 0.1
              // color: ""
            }
          }
        ]
      }
      if (xAxisData.length > 12) {
        options.dataZoom = [
          {
            type: 'slider',
            showDetail: false, // 拖拽时候显示详细数值信息
            start: 0, // 数据窗口范围的起始百分比
            end: (12 / xAxisData.length) * 100, // 数据窗口范围的结束百分比
            zoomLock: true, // 是否锁定选择区域, 只能平移，不能缩放
            handleIcon: 'null',
            height: 30,
            brushSelect: false, // 是否开启刷选功能
            bottom: 20
          }
        ]
        options.grid.bottom = '60'
      }
      this.chartData2 = options
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
  height: 420px;
  .select-warp {
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: 999;
    .right-text {
      font-size: 14px;
      color: #666;
    }
  }
  .select-warp ::v-deep .el-select .el-input .el-input__inner {
    border: 0;
    border-bottom: 1px solid #dcdfe6;
  }
}
.chart--top-card {
  position: relative;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 5px #ccc;
  padding: 20px;
  min-height: 140px;
  .title {
    font-weight: bold;
    color: #7d7d7d;
  }
  .num {
    margin-top: 20px;
    color: #333;
    font-weight: bold;
    font-size: 20px;
  }
  .content {
    margin-top: 20px;
    display: flex;
    align-content: center;
    justify-content: space-around;
    gap: 20px;
    .yearOnYear {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      & > span {
        white-space: nowrap;
      }
    }
    .monthOnMonth {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      & > span {
        white-space: nowrap;
      }
    }
  }
}
</style>
