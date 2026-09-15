<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('INVENTORY.inTransitDetails')"
    :visible.sync="visible"
    width="800px"
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
            <template v-else-if="item.prop === 'balanceInTransitQty'">
              <template>{{
                $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
              }}</template>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
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
import { queryWarehouseProductInTransitDetails } from '@/api/inventoryManagement/inventoryReport'

export default {
  mixins: [pageMixin],
  props: {},
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
          prop: 'documentNo',
          label: vm.$t('INVENTORY.docNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'balanceInTransitQty',
          label: vm.$t('PRODUCT.inTransitQTY'),
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
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      // 请求的时间戳
      queryTime: undefined
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
      queryWarehouseProductInTransitDetails(param)
        .then((res) => {
          this.tableList = res.rows || []
          this.total = res.total
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
          this.loading = false
        })
        .catch(() => {
          this.tableList = []
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
