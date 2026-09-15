<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('INVENTORY.reservedDetails')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div>
      <el-table
        border
        ref="tables"
        :data="tableList"
        :max-height="tableMaxHeight"
        v-loading="loading"
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
          key="action"
          align="center"
          width="120"
          class-name="small-padding fixed-width"
          fixed="right"
          v-if="false"
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

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryWarehouseProductReservedDetails } from '@/api/projectManagement/storeIssueChit'
import { updateWarehouseProductSort } from '@/api/inventoryManagement/inventoryReport'
export default {
  mixins: [pageMixin],
  props: {
    warehouseId: String,
    storeIssueChitId: String
  },
  data() {
    const vm = this
    return {
      saveKey: '8',
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
          prop: 'documentNo',
          label: vm.$t('INVENTORY.docNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'documentTypeShowStr',
          label: vm.$t('INVENTORY.documentType'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('PRODUCT.customer'),
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
          minWidth: 180,
          visible: true,
          tooltip: true
        }
      ],
      tableList: [],
      // 请求的时间戳
      queryTime: undefined
    }
  },
  computed: {},
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    bottomClick(row, index) {
      const arr = [...this.tableList]
      this.tableList.splice(index, 2, arr[index + 1], arr[index])
      // this.updateWarehouseProductSort(this.tableList)
    },
    topClick(row, index) {
      const arr = [...this.tableList]
      this.tableList.splice(index - 1, 2, arr[index], arr[index - 1])
      // this.updateWarehouseProductSort(this.tableList)
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
    handleOpen(row) {
      this.curRow = JSON.parse(JSON.stringify(row))
      this.visible = true
      if (this.storeIssueChitId && row.storeIssueChitProductId) {
        this.tableList = this.curRow.productReservedList
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      } else {
        this.getList()
      }
    },
    getList() {
      this.loading = true
      queryWarehouseProductReservedDetails({
        productId: this.curRow.productId,
        warehouseId: this.curRow.warehouseId,
        storeIssueChitId: this.storeIssueChitId
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
    handleUp() {},
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.curRow = {}
      this.tableList = []
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
