<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.productDetail')"
    :visible.sync="visible"
    width="1200px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div class="right-title">
      <div class="mr20" :title="form.productName">
        <span style="font-weight: 700">{{ $t('PRODUCT.productName') }}：</span>
        {{ form.productName }}
      </div>
      <div class="mr20" :title="form.internalPartNo">
        <span style="font-weight: 700">{{ $t('PRODUCT.internalPartNo') }}：</span>
        {{ form.internalPartNo }}
      </div>
      <div class="mr20" v-show="form.brand" :title="form.brand">
        <span style="font-weight: 700">{{ $t('PURCHASE.brand') }}：</span>
        {{ form.brand }}
      </div>
      <div class="mr20" v-show="form.basicUom" :title="showUomLabel(form.basicUom)">
        <span style="font-weight: 700">{{ $t('PURCHASE.uom') }}：</span>
        {{ form.basicUom }}
      </div>
    </div>

    <el-row type="flex" justify="space-between" class="mt20">
      <el-col>
        <el-button type="primary" size="mini" @click="detailsSummary">{{
          $t('PURCHASE.detailsSummary')
        }}</el-button>
      </el-col>
      <el-col>
        <right-toolbar
          :saveKey="saveKey"
          :savePath="savePath"
          :showRefreshBtn="true"
          @queryTable="queryTable"
          :columns="configCurColumn"
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
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'lockedStatus'">
            <el-tag v-if="scope.row.lockedStatus === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.lockedStatus === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="80"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <svg-icon
              icon-class="list2"
              class="primary-pointer"
              style="font-size: 20px"
              @click="handleDetail(scope.row)"
            />
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
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>

    <productDetailChartDlg ref="productDetailChartDlg" />
    <!-- 明细汇总 -->
    <inventoryDetailsSummaryDlg ref="inventoryDetailsSummaryDlg" />
    <!-- 明细 -->
    <inventoryProductDetailDetail ref="inventoryProductDetailDetail" />
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryInventoryCostProductWarehouseDocumentList } from '@/api/inventoryManagement/distributionByWarehouse'
import locale from '@/views/inventoryManagement/lang/index'
import productDetailChartDlg from './productDetailChartDlg'
import inventoryDetailsSummaryDlg from './inventoryDetailsSummaryDlg'
import inventoryProductDetailDetail from './inventoryProductDetailDetail'

export default {
  mixins: [pageMixin],
  components: { productDetailChartDlg, inventoryDetailsSummaryDlg, inventoryProductDetailDetail },
  data() {
    const vm = this
    return {
      saveKey: '121',
      savePath: 'inventoryProductDetail',
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
          prop: 'documentNo',
          label: vm.$t('PURCHASE.documentNo'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        // {
        //   prop: 'costProjectCode',
        //   label: vm.$t('PURCHASE.projectCode'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'warehouseName',
          label: vm.$t('PURCHASE.warehouse2'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'documentType',
          propBy: 'documentTypeShowStr',
          label: vm.$t('INVENTORY.documentType'),
          visible: true,
          sortable: 'custom',
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.supplierName'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'purchaseAmount',
          label: vm.$t('PURCHASE.purchaseDepositAmount'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PURCHASE.qTYOnHand'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'unqualifiedQty',
          label: vm.$t('PURCHASE.unqualifiedQTY'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'purchaseCost',
          label: vm.$t('PURCHASE.purchaseCost'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'expenseProportion',
          label: vm.$t('PURCHASE.expenseProportion'),
          visible: true,
          sortable: 'custom',
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'expenseAmount',
          label: vm.$t('PURCHASE.expenseAmount'),
          visible: true,
          sortable: 'custom',
          minWidth: 160,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'inventoryCost',
          label: vm.$t('PURCHASE.inventoryCost'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'inventoryAmount',
          label: vm.$t('PURCHASE.inventoryCost1'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('PURCHASE.updatedTime'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      form: {},
      warehouseId: ''
    }
  },
  computed: {
    configCurColumn() {
      let arr = [...this.columns]
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectName')
      } else {
        const flag = this.tableList.some((x) => x.costProjectName)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectName')
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
        arr = arr.filter((x) => x.prop !== 'costProjectName')
      } else {
        const flag = this.tableList.some((x) => x.costProjectName)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectName')
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
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    async handleOpen(row) {
      this.form = row || {}
      this.productId = row.productId
      this.warehouseId = row.warehouseId
      this.visible = true
      this.resetSearchForm()
    },
    getList() {
      const vm = this
      this.loading = true
      const param = this.queryParams
      this.$trimOfObj(param)
      param.productId = this.productId
      param.warehouseId = this.warehouseId
      queryInventoryCostProductWarehouseDocumentList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.qtyOnHand = this.$numberStr(item.qtyOnHand, this.$getDecNum(item.decimalNum))
            item.unqualifiedQty = this.$numberStr(
              item.unqualifiedQty,
              this.$getDecNum(item.decimalNum)
            )

            item.purchaseAmount = this.$numberStr(item.purchaseAmount, 2)
            item.purchaseCost = this.$numberStr(item.purchaseCost, 2)
            item.expenseProportion = this.$numberStr(item.expenseProportion, 2)
            item.expenseAmount = this.$numberStr(item.expenseAmount, 2)
            item.inventoryCost = this.$numberStr(item.inventoryCost, 2)
            item.inventoryAmount = this.$numberStr(item.inventoryAmount, 2)
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
    detailsSummary() {
      this.$refs.inventoryDetailsSummaryDlg.handleOpen(this.productId, this.warehouseId)
    },
    handleDetail(row) {
      this.$refs.inventoryProductDetailDetail.handleOpen(row)
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
  font-size: 12px;
  div {
    display: inline-block;
    max-width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  div:first-child {
    max-width: 50%;
  }
}
</style>
