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
      <div class="chart-card" ref="chartBoxRef" v-loading="chart1Loading">
        <Echart
          @clickBar="chart1BarClick"
          @clickGrid="chart1GridClick"
          :chart-data="chartData1"
          div-resize
        />
        <!-- <el-empty v-else style="height: 300px" :description="$t('ui.noData')" /> -->
      </div>

      <div class="chart-card mt20" v-loading="chart1Loading">
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
import { queryExpensesRevenueProfitTrendGroupLegalEntity } from '@/api/groupBusinessOverview/index'

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
      chart1Loading: false,
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
  mounted() {
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
      date.setDate(1)
      date.setMonth(date.getMonth() + 1)
      // 将日期设置为 1 号
      // 将时间设置为该月 1 号 0 点 0 分 0 秒
      date.setHours(0, 0, 0, 0)
      // 减去 1 秒，得到上一个月的最后一秒
      date.setSeconds(date.getSeconds() - 1)
      return date.getTime()
    },
    backTop() {
      this.$emit('backTop', { dateRange: this.form.topDateRange })
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
      this.queryData({})
    },
    queryData({ noLoading }) {
      this.queryChart1Data(noLoading)
    },
    queryChart1Data(noLoading) {
      if (noLoading) {
        this.chart1Loading = false
      } else {
        this.chart1Loading = true
      }
      const timer = Date.now()
      this.queryChart1Timer = timer

      queryExpensesRevenueProfitTrendGroupLegalEntity({
        startDate: this.getMonthStartTimer(this.form.topDateRange[0]),
        endDate: this.getMonthEndTimer(this.form.topDateRange[1])
      })
        .then((res) => {
          if (this.queryChart1Timer !== timer) return
          this.chart1Loading = false
          const data = res.data || {}
          const imageColumnList = data.imageColumnList || []
          const xAxisData = imageColumnList.map((item) => item.legalEntityName)

          const barData1 = imageColumnList.map((item) => {
            return {
              legalEntityId: item.legalEntityId,
              value: item.profit,
              itemStyle: { color: item.profit < 0 ? '#f53f3f' : null },
              // label: { position: item.profit < 0 ? 'bottom' : null },
              showText: `${data.currencySymbol} ${this.$numberStr(item.profit, 2)}`
            }
          })
          this.setOptions1({
            xAxisData,
            seriesData: barData1,
            currencySymbol: data.currencySymbol
          })

          const seriesLine1 = imageColumnList.map((item) => {
            return {
              legalEntityId: item.legalEntityId,
              value: item.purchaseExpenses,
              expensesStr: `${data.currencySymbol} ${this.$numberStr(item.purchaseExpenses, 2)}`,
              revenueStr: `${data.currencySymbol} ${this.$numberStr(item.salesRevenue, 2)}`
            }
          })
          const seriesLine2 = imageColumnList.map((item) => {
            return {
              legalEntityId: item.legalEntityId,
              value: item.salesRevenue
            }
          })
          this.setOptions2({
            xAxisData,
            seriesLine1,
            seriesLine2,
            currencySymbol: data.currencySymbol
          })
        })
        .catch(() => {
          this.chart1Loading = false
        })
    },
    chart1BarClick() {},
    chart1GridClick(params, xIndex) {
      const item = this.chartData1.series[0].data[xIndex]
      this.$emit('goToNextPage', {
        dateRange: this.form.topDateRange,
        legalEntityId: item.legalEntityId
      })
    },
    setOptions1(params) {
      const vm = this
      const { xAxisData, seriesData, currencySymbol } = params
      const options = {
        title: {
          text: this.$t('GBO.corporateProfitComparison'),
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
                <td style="text-align: right;">${vm.$t('GBO.legalEntity')} : </td>
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
          axisLabel: {
            fontSize: 10,
            formatter(value) {
              // 这里可以对 value 进行处理，例如截断或添加省略号等
              return value.length > 20 ? value.slice(0, 20) + '...' : value
            }
          },
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
      const dom = this.$refs.chartBoxRef
      let zoomCount = Math.round(dom.clientWidth / 240)
      if (zoomCount < 4) {
        zoomCount = 4
      }

      if (xAxisData.length > zoomCount) {
        options.dataZoom = [
          {
            type: 'slider',
            showDetail: false, // 拖拽时候显示详细数值信息
            start: 0, // 数据窗口范围的起始百分比
            end: (zoomCount / xAxisData.length) * 100, // 数据窗口范围的结束百分比
            zoomLock: true, // 是否锁定选择区域, 只能平移，不能缩放
            handleIcon: 'null',
            height: 30,
            brushSelect: false, // 是否开启刷选功能
            bottom: 40
          }
        ]
        options.grid.bottom = '120'
      }

      this.chartData1 = options
    },

    changeChart2YearType(value) {
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
    },
    chart2BarClick(params) {},
    chart2GridClick(params, xIndex) {
      const item = this.chartData2.series[0].data[xIndex]
      this.$emit('goToNextPage', {
        dateRange: this.form.topDateRange,
        legalEntityId: item.legalEntityId
      })
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

            const data0 = res0.data || {}
            const result = `<table>
              <tr>
                <td style="text-align: right;">${vm.$t('GBO.legalEntity')} : </td>
                <td>${res0.name}</td>
              </tr>
              <tr>
                <td style="text-align: right;">${vm.$t('GBO.expenses')} : </td>
                <td>${data0.expensesStr}</td>
              </tr>
              <tr>
                <td style="text-align: right;">${vm.$t('GBO.revenue')} : </td>
                <td>${data0.revenueStr}</td>
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
          axisLabel: {
            fontSize: 10,
            formatter(value) {
              // 这里可以对 value 进行处理，例如截断或添加省略号等
              return value.length > 20 ? value.slice(0, 20) + '...' : value
            }
          },

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

      const dom = this.$refs.chartBoxRef
      let zoomCount = Math.round(dom.clientWidth / 240)
      if (zoomCount < 4) {
        zoomCount = 4
      }

      if (xAxisData.length > zoomCount) {
        options.dataZoom = [
          {
            type: 'slider',
            showDetail: false, // 拖拽时候显示详细数值信息
            start: 0, // 数据窗口范围的起始百分比
            end: (zoomCount / xAxisData.length) * 100, // 数据窗口范围的结束百分比
            zoomLock: true, // 是否锁定选择区域, 只能平移，不能缩放
            handleIcon: 'null',
            height: 30,
            brushSelect: false, // 是否开启刷选功能
            bottom: 40
          }
        ]
        options.grid.bottom = '120'
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
  }
}
</style>
