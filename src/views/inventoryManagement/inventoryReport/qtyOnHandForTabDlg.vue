<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('INVENTORY.inventoryDetail')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div>
      <div class="right-title">
        <span class="mr20" :title="curRow.productName">
          {{ $t('INVENTORY.productName') }}：{{ curRow.productName }}
        </span>
        <span class="mr20" :title="curRow.internalPartNo">
          {{ $t('INVENTORY.internalPartNo') }}：{{ curRow.internalPartNo }}
        </span>
        <span> {{ $t('INVENTORY.uom1') }}：{{ curRow.uom }} </span>
      </div>
      <div class="mt10">
        <el-row type="flex" style="height: 50px; overflow: hidden">
          <el-col>
            <el-tabs v-model="tabActiveName" type="card" @tab-click="handleTabClick">
              <el-tab-pane :label="$t('INVENTORY.inventoryProducts')" name="1"> </el-tab-pane>
              <el-tab-pane :label="$t('INVENTORY.projectProducts')" name="2"> </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col v-show="tabActiveName === '2'">
            <div>
              <div>
                <div class="fr">
                  <el-form :inline="true">
                    <el-form-item :label="$t('INVENTORY.project')" style="margin-right: 0">
                      <el-select
                        v-model="costProjectIdList"
                        @change="changeFrom"
                        style="width: 200px"
                        clearable
                        size="small"
                        placeholder=""
                        multiple
                        collapse-tags
                        class="log-msg-ellipsis"
                      >
                        <el-option
                          v-for="dict in costProjectList"
                          :key="dict.costProjectId"
                          :label="dict.costProjectCode"
                          :value="dict.costProjectId"
                        />
                      </el-select>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-table
        border
        ref="tables"
        :data="tableList"
        :max-height="tableMaxHeight"
        v-loading="loading"
      >
        <el-table-column type="index" :label="$t('ui.sn')" width="80" fixed="left" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isSubTotal !== '1'">{{ scope.$index + 1 }}</span>
            <span v-else>{{ $t('PRODUCT.subTotal') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in visibleCurColumns"
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
            <template v-if="item.prop === 'stockInTime'">
              {{ parseTime(scope.row.stockInTime) }}
            </template>
            <template v-else-if="item.prop === 'balanceInTransitQty'">
              <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
            </template>
            <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :saveKey="saveKey"
        :savePath="savePath"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryNoCostProjectLabelDetailList,
  queryWarehouseProductCostProjectList,
  queryWarehouseProductCostProjectQtyDetails
} from '@/api/inventoryManagement/inventoryReport'

export default {
  mixins: [pageMixin],
  props: {},
  dicts: ['i_label_status'],
  data() {
    const vm = this
    return {
      saveKey: '7',
      savePath: 'IMTable',
      loading: false,
      btnLoading: false,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'productId',
      curRow: {},
      visible: false,
      columns: [
        {
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'goodsReceivedNoteNo',
          label: vm.$t('INVENTORY.goodsReceivedNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'sourceDocumentNo',
          label: vm.$t('INVENTORY.docNo'),
          minWidth: 140,
          colMinWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'warehouseStructureCode',
          label: vm.$t('INVENTORY.locationCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'labelNo',
          label: vm.$t('INVENTORY.labelNo'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },

        {
          prop: 'labelStatus',
          propBy: 'labelStatusStr',
          label: vm.$t('INVENTORY.status'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'leadTime',
          label: vm.$t('INVENTORY.batchNo'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('INVENTORY.qty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'stockInTime',
          label: vm.$t('INVENTORY.stockInTime'),
          minWidth: 140,
          colMinWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      costProjectList: [],
      costProjectIdList: [],
      // 请求的时间戳
      queryTime: undefined,
      tabActiveName: '1'
    }
  },
  computed: {
    configCurColumn() {
      let arr = [...this.columns]
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    visibleCurColumns() {
      let arr = this.columns.filter((column) => column.visible === true)
      const flag = this.tableList.some((x) => x.costProjectCode)
      if (!flag) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      }
      const flag11 = this.tableList.some((x) => x.goodsReceivedNoteNo)
      if (!flag11) {
        arr = arr.filter((x) => x.prop !== 'goodsReceivedNoteNo')
      }
      const flag2 = this.tableList.some((x) => x.sourceDocumentNo)
      if (!flag2) {
        arr = arr.filter((x) => x.prop !== 'sourceDocumentNo')
      }
      const flag3 = this.tableList.some((x) => x.warehouseStructureCode)
      if (!flag3) {
        arr = arr.filter((x) => x.prop !== 'warehouseStructureCode')
      }
      const flag4 = this.tableList.some((x) => x.labelNo)
      if (!flag4) {
        arr = arr.filter((x) => x.prop !== 'labelNo')
      }
      const flag5 = this.tableList.some((x) => x.labelStatus)
      if (!flag5) {
        arr = arr.filter((x) => x.prop !== 'labelStatus')
      }
      const flag6 = this.tableList.some((x) => x.remarks)
      if (!flag6) {
        arr = arr.filter((x) => x.prop !== 'remarks')
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
  },
  updated() {},
  methods: {
    handleOpen(row) {
      this.tabActiveName = '1'
      this.curRow = JSON.parse(JSON.stringify(row))
      this.visible = true
      this.getList('init')
      this.queryWarehouseProductCostProjectList()
    },
    handleTabClick() {
      this.tableList = []
      this.costProjectIdList = []
      this.getList('tab-click')
      if (this.tabActiveName === '2') {
        this.queryWarehouseProductCostProjectList()
      }
    },
    changeFrom() {
      this.getList('change-from')
    },
    queryWarehouseProductCostProjectList() {
      const param = {}
      param.productId = this.curRow.productId
      param.warehouseId = this.curRow.warehouseId
      queryWarehouseProductCostProjectList(param).then((res) => {
        const data = res.data || {}
        this.costProjectList = data.costProjectList
      })
    },
    getList() {
      this.loading = true
      const param = { ...this.queryParams }
      this.$trimOfObj(param)
      param.productId = this.curRow.productId
      param.warehouseId = this.curRow.warehouseId
      if (this.curRow.batchNo) {
        param.leadTime = this.curRow.batchNo
      }

      let queryFN
      if (this.tabActiveName === '1') {
        queryFN = queryNoCostProjectLabelDetailList
      } else {
        queryFN = queryWarehouseProductCostProjectQtyDetails
        param.costProjectIdList = this.costProjectIdList
      }
      const timer = Date.now()
      this.queryTimer = timer
      queryFN(param)
        .then((res) => {
          if (this.queryTimer !== timer) return
          const rows = res.rows || []
          rows.forEach((item) => {
            item.labelStatusStr = this.selectDictLabel(
              this.dict.type.i_label_status,
              item.labelStatus
            )
            item.qty = this.$numberStr(item.qty, item.decimalNum)
          })
          if (rows.length > 0 && res.summary) {
            const { summary } = res
            const topRow = rows[0]
            summary.qty = this.$numberStr(summary.qty, topRow.decimalNum)
            summary.isSubTotal = '1'
            rows.push(summary)
          }
          this.tableList = rows
          this.total = res.total
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
          this.loading = false
        })
        .catch(() => {
          if (this.queryTimer !== timer) return
          this.tableList = []
          this.loading = false
        })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.labelStatusStr = this.selectDictLabel(this.dict.type.i_label_status, item.labelStatus)
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.curRow = {}
      this.tableList = []
      this.costProjectIdList = []
      this.costProjectList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.info-item {
  display: inline-block;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right-title {
  flex: 1;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  span {
    display: inline-block;
    max-width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
