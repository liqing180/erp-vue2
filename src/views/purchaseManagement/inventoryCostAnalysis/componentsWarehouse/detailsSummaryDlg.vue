<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.detailsSummary')"
    :visible.sync="visible"
    width="1200px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-row type="flex" justify="space-between">
      <el-col>
        <right-toolbar
          :saveKey="saveKey"
          :savePath="savePath"
          :showRefreshBtn="true"
          @queryTable="queryTable"
          :columns="configColumn"
          :columnsInit="columns"
        ></right-toolbar>
      </el-col>
    </el-row>

    <el-table
      border
      ref="tables"
      class="mt10"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      :max-height="tableMaxHeight"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
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
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
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

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { querySummaryListByProductWarehouse } from '@/api/purchaseManagement/distributionByWarehouse'

export default {
  dicts: ['i_stock_certificate_document_type', 'i_inventory_type'],
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      saveKey: '5',
      savePath: 'detailsSummaryDlg',
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      tableList: [],
      rowIdKey: 'businessPartnerMainId',
      visible: false,
      columns: [
        {
          prop: 'revisedDocumentNo',
          label: vm.$t('PURCHASE.documentNo'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'warehouseName',
          label: vm.$t('PURCHASE.warehouse2'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'inventoryType',
          propBy: 'inventoryTypeShowStr',
          label: vm.$t('INVENTORY.inventoryType'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'revisedQty',
          propBy: 'revisedQtyShowStr',
          label: vm.$t('INVENTORY.revisedQty'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'revisedAmount',
          propBy: 'revisedAmountShowStr',
          label: vm.$t('PURCHASE.revisedAmount'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'purchaseCostForProduct',
          label: vm.$t('PURCHASE.purchaseCost'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'qtyForProduct',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchaseAmountForProduct',
          label: vm.$t('PURCHASE.purchaseAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('PURCHASE.updatedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      typeDicts: [],
      productId: '',
      warehouseId: ''
    }
  },
  computed: {},

  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    async handleOpen(id, warehouseId) {
      this.productId = id
      this.warehouseId = warehouseId
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },

    getList() {
      const vm = this
      this.loading = true
      const params = { ...this.queryParams }
      params.productId = this.productId
      params.warehouseId = this.warehouseId
      this.$trimOfObj(params)
      querySummaryListByProductWarehouse(params)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.purchaseAmountForProduct = this.$numberStr(item.purchaseAmountForProduct, 2)
            item.purchaseCostForProduct = this.$numberStr(item.purchaseCostForProduct, 2)
            item.qtyForProduct = this.$numberStr(
              item.qtyForProduct,
              this.$getDecNum(item.decimalNum)
            )
            item.inventoryTypeStr = this.selectDictLabel(
              this.dict.type.i_inventory_type,
              item.inventoryType
            )
          })
          this.tableList = rows
          this.loading = false
          this.total = response.total
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          vm.table_loading = false
          window.console.error(err)
        })
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.tableList = []
    }
  }
}
</script>

<style lang="scss" scoped>
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
