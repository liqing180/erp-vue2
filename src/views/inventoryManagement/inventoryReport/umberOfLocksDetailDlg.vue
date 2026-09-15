<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('INVENTORY.locksDetail')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div>
      <div class="right-title" v-if="tableList.length > 0">
        <span class="mr20" :title="form.productName">
          {{ $t('INVENTORY.productName') }}：{{ tableList[0].productName }}
        </span>
        <span class="mr20" :title="form.internalPartNo">
          {{ $t('INVENTORY.internalPartNo') }}：{{ tableList[0].internalPartNo }}
        </span>
        <span> {{ $t('INVENTORY.uom1') }}：{{ tableList[0].uom }} </span>
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
        <el-table-column
          :label="$t('ui.action')"
          align="center"
          width="120"
          fixed="right"
          class-name="small-padding fixed-width"
          v-if="false"
        >
          <template slot-scope="scope">
            <div class="flexCen" v-if="['1', '4'].indexOf(scope.row.lockedStatus) !== -1">
              <div :title="$t('INVENTORY.unchain')">
                <svg-icon
                  class="primary-pointer mr5"
                  icon-class="lock"
                  style="font-size: 20px"
                  @click.stop="lock(scope.row)"
                />
              </div>
            </div>
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
  queryWarehouseProductLockedDetails,
  unlocked
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
          prop: 'lockedAvailableQty',
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      // 请求的时间戳
      queryTime: undefined,
      form: {}
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
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
  },
  updated() {},
  methods: {
    handleOpen(row) {
      this.curRow = JSON.parse(JSON.stringify(row))
      this.visible = true
      this.getList()
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
      queryWarehouseProductLockedDetails(param)
        .then((res) => {
          const rows = res.rows || []
          rows.forEach((item) => {
            item.labelStatusStr = this.selectDictLabel(
              this.dict.type.i_label_status,
              item.labelStatus
            )
          })
          this.tableList = rows
          this.total = res.total
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
          this.loading = false
        })
        .catch(() => {
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
    lock(row) {
      this.$modal
        .confirm(this.$t('INVENTORY.unlockedConfirm'))
        .then(() => {
          this.loading = true
          return unlocked({ id: row.id })
        })
        .then((response) => {
          this.$message.success(this.$t('INVENTORY.unlockedSuccess'))
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.curRow = {}
      this.tableList = []
      this.$emit('onSuccess')
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
