<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('ui.details')"
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
        @sort-change="handleSortChange"
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
import { queryReturnReasonList } from '@/api/reportManagement/supplierReturnSummary'

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
          prop: 'returnedReasonShowStr',
          label: vm.$t('PURCHASE.returnReason'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'returnQtyForBasic',
          label: vm.$t('PURCHASE.returnedQty'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'returnRateShowStr',
          label: vm.$t('PURCHASE.returnRate'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
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
      param.businessPartnerId = this.curRow.businessPartnerId
      param.productId = this.curRow.productId
      queryReturnReasonList(param)
        .then((res) => {
          const rows = res.data || []
          rows.forEach((item) => {
            item.returnQtyForBasic = this.$numberStr(item.returnQtyForBasic, 3)
          })
          this.tableList = rows
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
      this.queryParams.isAsc = this.queryParams.orderByColumn = undefined
      this.$refs.tables && this.$refs.tables.clearSort()
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
