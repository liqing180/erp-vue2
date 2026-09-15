<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.purchasePriceAnalysis')"
    :visible.sync="purchasePriceAnalysisVisible"
    width="1200px"
    :modal="true"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :showMenu="false"
      :topShowCount="2"
      v-show="showSearch"
    />

    <div
      v-if="purchasePriceAnalysisVisible"
      id="purchasePriceChart"
      ref="purchasePriceChart"
      style="width: 100%; height: 400px"
    >
      <Echart ref="chartLine" :chart-data="chartData" div-resize />
    </div>

    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <div class="mt10">
      <el-table ref="tables" v-loading="loading" :data="tableList" :max-height="tableMaxHeight">
        <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left">
          <template slot-scope="scope">
            <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
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
            <template v-if="item.prop === 'purchaseDate'">{{
              parseTime(scope.row.purchaseDate, fmtForYmd)
            }}</template>
            <template v-else-if="item.prop === 'qty'">
              <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
            </template>

            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :saveKey="saveKey"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <div slot="footer" class="dialog-footer" style="margin-top: 40px !important">
      <el-button type="ghost" @click="purchasePriceAnalysisVisible = false">{{
        $t('ui.back')
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import pageMixin from '@/mixins/tableMinx'
// import { queryPurchaseOrderDetailListByInternalPartNo } from '@/api/purchase/purchaseOrder'
import Echart from '@/views/purchaseManagement/purchaseContract/components/Echart'

export default {
  components: {
    Echart
  },
  mixins: [pageMixin],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    formData: {
      default: function () {
        return {}
      }
    },
    internalPartNo: {
      type: [String, Number],
      required: true,
      default: ''
    },
    showIcon: {
      type: [Boolean],
      default: false
    },
    currencyId: {
      type: [String, Number],
      default: ''
    },
    curPath: {
      type: [String],
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      purchasePriceAnalysisVisible: false,
      chartData: {},
      dataOptions: {},
      seriesData: [],
      maxPrice: 0,
      maxQty: 0,

      saveKey: '6',
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${vm.$t('PURCHASE.externalPartNo')}`,
          type: 'InputEle'
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      // 列信息
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'partNo',
          label: vm.$t('PRODUCT.partNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'purchaseOrderNo',
          label: vm.$t('PURCHASE.purchaseOrderNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'purchaseDate',
          label: vm.$t('PURCHASE.purchaseDate'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'averagePrice',
          label: vm.$t('PURCHASE.averagePrice'),
          visible: true,
          minWidth: 220,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'qty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          padding: 60,
          minWidth: 160,
          tooltip: true
        }
      ]
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  beforeCreate() {},
  methods: {
    handleOpen() {
      console.log('?')
      this.purchasePriceAnalysisVisible = true
      this.getList()
    },

    echart() {
      const vm = this

      // 指定图表的配置项和数据
      const option = {
        grid: {
          right: '140',
          left: '110'
        },
        color: ['#d87a80', '#5ab1ef'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            },
            label: {
              formatter: (param) => {
                if (isNaN(Number(param.value))) {
                  return param.value
                }
                return Number(param.value).toFixed(2)
              }
            }
          },
          // formatter: '{b}:<br/>{a0}: {c0}<br />{a1}: {c1}'
          formatter: (params) => {
            let str = ''
            if (Array.isArray(params)) {
              str += `
              ${params[0].axisValue}<br/>
              `
              params.forEach((item) => {
                // if (item['value'] !== '0.00') {
                if (vm.$resultOfBoolean(item.value)) {
                  str += `
                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>
                  ${item.seriesName}: ${item.value}<br/>
                  `
                }
              })
            } else {
              str = ''
            }
            return str
          }
        },
        toolbox: {
          feature: {
            restore: { show: true }
          },
          showTitle: false
        },
        legend: {
          data: this.seriesData.name
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
          },
          {
            type: 'slider',
            yAxisIndex: [0, 1],
            filterMode: 'empty'
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'empty'
          },
          {
            type: 'inside',
            yAxisIndex: [0, 1],
            filterMode: 'empty'
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: vm.dataOptions.dateData,
            axisPointer: {
              type: 'shadow'
            },
            axisTick: {
              alignWithLabel: true
            }
            // axisLabel: {
            //   rotate: 45
            // }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Unit Price',
            position: 'left',
            axisLabel: {
              // formatter: '{value}'
              formatter: function (value) {
                if (isNaN(Number(value))) {
                  return value
                }
                return Number(value).toFixed(2)
              }
            },
            min: 0,
            max: vm.maxPrice,
            splitNumber: 10,
            interval: vm.maxPrice / 10
            // gridIndex: 1
          },
          {
            type: 'value',
            name: 'QTY',
            position: 'right',
            axisLabel: {
              // formatter: '{value}'
              formatter: function (value) {
                if (isNaN(Number(value))) {
                  return value
                }
                return Number(value).toFixed(2)
              }
            },
            min: 0,
            max: vm.maxQty,
            splitNumber: 10,
            interval: vm.maxQty / 10
            // gridIndex: 1
          }
        ],
        series: [
          {
            // qty
            name: vm.dataOptions.lineDatas[0].name,
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 1,
            symbolSize: 10,
            data: vm.dataOptions.lineDatas[0].data,
            markLine: {
              data: [{ type: 'average', name: 'Average Price' }],
              label: {
                position: 'insideEndTop'
              },
              itemStyle: {
                normal: {
                  borderWidth: 1,
                  lineStyle: {
                    type: '',
                    color: 'red',
                    width: 1
                  }
                }
              }
            }
          },
          {
            // 单价
            name: vm.dataOptions.barDatas[0].name,
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            symbolSize: 10,
            barWidth: '30',
            barCategoryGap: '30',
            itemStyle: {
              color: 'rgb(0,175,239)'
            },
            data: vm.dataOptions.barDatas[0].data
          }
        ]
      }
      vm.chartData = option
    },

    getList() {
      const vm = this
      this.queryParams.internalPartNo = vm.internalPartNo
      this.queryParams.currencyId = vm.currencyId
      vm.loading = true

      // eslint-disable-next-line no-undef
      queryPurchaseOrderDetailListByInternalPartNo(this.queryParams)
        .then((res) => {
          const { data } = res
          vm.loading = false
          vm.pageSizeChange = false
          if (data.status === 200) {
            const results = data.msg

            // let { pageNum, pageSize, total, dataOptions, purchaseOrderDetailPage } = results
            const { dataOptions, purchaseOrderDetailPage } = results

            if (vm.$resultOfBoolean(dataOptions)) {
              if (dataOptions.lineDatas[0]) {
                if (Array.isArray(dataOptions.lineDatas[0].data)) {
                  vm.maxQty = Math.max(...dataOptions.lineDatas[0].data)
                  if (!isFinite(vm.maxQty)) {
                    vm.maxQty = 1
                  }
                }
              }
              if (dataOptions.barDatas[0]) {
                vm.maxPrice = Math.max(...dataOptions.barDatas[0].data)
                if (!isFinite(vm.maxPrice)) {
                  vm.maxPrice = 1
                }
              }
            }
            vm.curPage = purchaseOrderDetailPage.pageNum
            vm.totalPage = purchaseOrderDetailPage.total
            vm.pageSize = purchaseOrderDetailPage.pageSize
            vm.tableList = purchaseOrderDetailPage.list
            // eslint-disable-next-line array-callback-return
            vm.tableList.map((item) => {
              const { categoryType, isDecimal, qty } = item
              if (categoryType === 5) {
                item.qty = vm.$numberStr(qty, 3)
              } else {
                if (isDecimal === 1) {
                  item.qty = vm.$numberStr(qty, 3)
                } else {
                  item.qty = vm.$numberStr(qty, 0)
                }
              }
            })
            vm.dataOptions = dataOptions
            if (vm.purchasePriceAnalysisVisible) {
              vm.echart()
            }

            this.$$getColumnContentMaxWidth(this.columns, this.tableList)
          } else {
            vm.$modal.msgError(data.message)
          }
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables && this.$refs.tables.clearSort()
      this.getList()
    }
  }
}
</script>
<style scoped>
.resetBtn {
  right: 20px;
  top: 0;
  font-size: 20px;
  line-height: 40px;
  cursor: pointer;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-select: none;
  position: absolute;
}
.fs20 {
  font-size: 20px;
}
.searchWidth {
  width: 240px;
}
div.clearfix {
  height: 40px !important;
  line-height: 38px;
  margin-bottom: 16px;
  overflow: hidden;
  vertical-align: top;
}
</style>
