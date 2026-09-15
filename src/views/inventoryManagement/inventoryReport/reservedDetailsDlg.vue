<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('INVENTORY.reservedDetails')"
    :visible.sync="visible"
    width="1000px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div>
      <div class="right-title" v-if="warehouseInventory.productName">
        <span class="mr20" :title="warehouseInventory.productName">
          {{ $t('INVENTORY.productName') }}：{{ warehouseInventory.productName || '' }}
        </span>
        <span class="mr20" :title="warehouseInventory.internalPartNo">
          {{ $t('INVENTORY.internalPartNo') }}：{{ warehouseInventory.internalPartNo || '' }}
        </span>
        <span>
          {{ $t('INVENTORY.qty') }}：{{
            `${$numberStr(warehouseInventory.occupiedQty, warehouseInventory.decimalNum)} (${
              warehouseInventory.uom
            })`
          }}
        </span>
      </div>
      <el-table
        border
        ref="tables"
        :data="tableList"
        :max-height="tableMaxHeight"
        v-loading="loading"
        class="mt20"
      >
        <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
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
            <template v-if="item.prop === 'createdTime'">
              {{ parseTime(scope.row.createdTime) }}
            </template>
            <template v-else-if="item.prop === 'balanceReservedQty'">
              <template>{{
                $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
              }}</template>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('INVENTORY.priority')"
          align="center"
          width="120"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="flexCen">
              <div style="font-size: 24px; width: 26px">
                <i
                  @click="bottomClick(scope.row, scope.$index)"
                  v-show="scope.$index + 1 < tableList.length"
                  class="el-icon-bottom primary-pointer"
                ></i>
              </div>
              <div style="font-size: 24px; width: 26px">
                <i
                  @click="topClick(scope.row, scope.$index)"
                  v-show="scope.$index > 0"
                  class="el-icon-top primary-pointer"
                ></i>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="mt20">
      <div style="font-size: 18px; color: #303133">{{ $t('INVENTORY.locksDetail') }}</div>
      <el-table
        border
        ref="tables"
        :data="lockTableList"
        :max-height="tableMaxHeight"
        v-loading="lockLoading"
        class="mt10"
      >
        <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
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
              <template>{{
                $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
              }}</template>
            </template>
            <template v-else-if="item.prop === 'qty'">
              <template>{{
                $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
              }}</template>
            </template>
            <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryWarehouseProductReservedDetails,
  queryWarehouseProductLockedDetails,
  updateWarehouseProductSort
} from '@/api/inventoryManagement/inventoryReport'

export default {
  mixins: [pageMixin],
  props: {},
  dicts: ['i_label_status'],
  data() {
    const vm = this
    return {
      saveKey: '8',
      savePath: 'IMTable',
      loading: false,
      lockLoading: false,
      btnLoading: false,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'productId',
      curRow: {},
      warehouseInventory: {},
      visible: false,
      columns: [
        {
          prop: 'documentNo',
          label: vm.$t('INVENTORY.docNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'balanceReservedQty',
          label: vm.$t('PURCHASE.reservedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 140,
          colMinWidth: 140,
          visible: true,
          tooltip: true
        }
      ],
      columnsForLock: [
        {
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
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
          colMinWidth: 140,
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
      lockTableList: [],
      // 请求的时间戳
      queryTime: undefined
    }
  },
  computed: {
    purchaseRequisitionAuth() {
      return this.checkPermi(['purchaseManagement:purchaseRequisition:list'])
    },
    visibleCurColumns() {
      let arr = this.columnsForLock.filter((column) => column.visible === true)
      if (this.lockTableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.lockTableList.some((x) => x.costProjectCode)
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
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.$$initColumnVisible('null', this.columnsForLock)
  },
  updated() {},
  methods: {
    bottomClick(row, index) {
      const arr = [...this.tableList]
      this.tableList.splice(index, 2, arr[index + 1], arr[index])
      this.updateWarehouseProductSort(this.tableList)
    },
    topClick(row, index) {
      const arr = [...this.tableList]
      this.tableList.splice(index - 1, 2, arr[index], arr[index - 1])
      this.updateWarehouseProductSort(this.tableList)
    },
    handleOpen(row) {
      this.curRow = JSON.parse(JSON.stringify(row))
      this.visible = true
      this.getList()
      this.getListForLock()
    },
    updateWarehouseProductSort(list) {
      updateWarehouseProductSort({
        warehouseProductReservedList: list
      })
        .then((res) => {
          this.getList()
        })
        .catch(() => {
          this.getList()
        })
    },
    getList() {
      this.loading = true
      queryWarehouseProductReservedDetails({
        productId: this.curRow.productId,
        warehouseId: this.curRow.warehouseId
      })
        .then((res) => {
          const data = res.data || []
          this.tableList = data
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
          this.loading = false
        })
        .catch(() => {
          this.tableList = []
          this.loading = false
        })
    },
    getListForLock() {
      this.lockLoading = true
      const param = { ...this.queryParams }
      this.$trimOfObj(param)
      param.productId = this.curRow.productId
      param.warehouseId = this.curRow.warehouseId
      if (this.curRow.batchNo) {
        param.leadTime = this.curRow.batchNo
      }
      queryWarehouseProductLockedDetails(param)
        .then((res) => {
          const summary = res.summary || {}
          this.warehouseInventory = summary.warehouseInventory || {}

          const rows = res.rows || []
          rows.forEach((item) => {
            item.labelStatusStr = this.selectDictLabel(
              this.dict.type.i_label_status,
              item.labelStatus
            )
          })
          this.lockTableList = rows
          this.total = res.total
          this.$$getColumnContentMaxWidth(this.columnsForLock, this.lockTableList)
          this.lockLoading = false
        })
        .catch(() => {
          this.lockTableList = []
          this.lockLoading = false
        })
    },
    onDictReady() {
      this.lockTableList.forEach((item) => {
        item.labelStatusStr = this.selectDictLabel(this.dict.type.i_label_status, item.labelStatus)
      })
      this.$$getColumnContentMaxWidth(this.columnsForLock, this.lockTableList)
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.warehouseInventory = {}
      this.curRow = {}
      this.tableList = []
      this.lockTableList = []
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
</style>
