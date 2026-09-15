<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.stockOutStockInDetails')"
    :visible.sync="visible"
    width="1200px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div class="right-title">
      <span class="mr20" :title="form.companyName">
        {{ $t('PURCHASE.company') }}：{{ form.companyName }}
      </span>
      <span class="mr20" :title="form.productName">
        {{ $t('PRODUCT.productName') }}：{{ form.productName }}
      </span>
      <span class="mr20" :title="form.internalPartNo">
        {{ $t('PRODUCT.internalPartNo') }}：{{ form.internalPartNo }}
      </span>
      <span class="mr20" v-show="form.brand" :title="form.brand">
        {{ $t('PURCHASE.brand') }}：{{ form.brand }}
      </span>
      <span class="mr20" v-show="form.uom" :title="showUomLabel(form.uom)">
        {{ $t('PURCHASE.uom') }}：{{ form.uom }}
      </span>
    </div>
    <el-row>
      <el-col>
        <right-toolbar
          :saveKey="saveKey"
          :savePath="savePath"
          :showRefreshBtn="true"
          @queryTable="queryTable"
          :columns="configColumn"
          :columnsInit="columns"
        ></right-toolbar>
        <div
          class="pointer"
          style="float: right; border: 1px solid #dcdfe6; border-radius: 50%; padding: 5px"
          @click="openChart"
        >
          <svg-icon icon-class="line" style="font-size: 16px; color: #333" />
        </div>
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

    <chartDlg ref="chartDlg" :typeDicts="typeDicts" />
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryProductIOMsgList } from '@/api/reportManagement/inventoryCostAnalysis'
import locale from '@/views/inventoryManagement/lang/index'
import chartDlg from './chartDlg1'

export default {
  dicts: ['i_stock_certificate_document_type', 'i_inventory_type'],
  mixins: [pageMixin],
  components: { chartDlg },
  data() {
    const vm = this
    return {
      saveKey: '2',
      savePath: 'reportMTable',
      loading: false,
      // 总条数
      total: 0,
      tableList: [],
      rowIdKey: 'businessPartnerMainId',
      visible: false,
      columns: [
        {
          prop: 'stockOutInNoteNo',
          label: vm.$t('INVENTORY.stockOutStockInNote'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'documentType',
          propBy: 'documentTypeStr',
          label: vm.$t('INVENTORY.documentType'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'inventoryType',
          propBy: 'inventoryTypeStr',
          label: vm.$t('INVENTORY.inventoryType'),
          visible: true,
          minWidth: 160,
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
          prop: 'revisedAmountAllWarehouse',
          propBy: 'revisedAmountAllWarehouseShowStr',
          label: vm.$t('PURCHASE.revisedAmount'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'inventoryUnitPriceAllWarehouse',
          label: vm.$t('PURCHASE.purchaseCost'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'afterQtyAllWarehouse',
          label: vm.$t('INVENTORY.actualStock'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'inventoryAmountAllWarehouse',
          label: vm.$t('PURCHASE.purchaseDepositAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'createdTime',
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
      form: {},
      typeDicts: []
    }
  },
  computed: {},
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
      this.queryParams.pageNum = 1
      this.visible = true
      const a = this.MyDictDataClass.getDictFn('i_stock_certificate_document_type')
      await Promise.all([a]).then((res) => {
        const res1 = res[0] || {}
        this.typeDicts = (res1 || []).map((item) => {
          return {
            label: item.dictLabel,
            value: item.dictValue
          }
        })
      })

      this.getList()
    },
    openChart() {
      this.$refs.chartDlg.openChart(this.productId)
    },
    getList() {
      const vm = this
      this.loading = true
      const param = this.queryParams
      param.productId = this.productId
      this.$trimOfObj(param)
      queryProductIOMsgList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.revisedAmountAllWarehouse = this.$numberStr(item.revisedAmountAllWarehouse, 2)
            item.inventoryUnitPriceAllWarehouse = this.$numberStr(
              item.inventoryUnitPriceAllWarehouse,
              2
            )
            item.revisedQtyShowStr = this.$numberStr(
              item.revisedQty,
              this.$getDecNum(item.decimalNum)
            )
            item.afterQtyAllWarehouse = this.$numberStr(
              item.afterQtyAllWarehouse,
              this.$getDecNum(item.decimalNum)
            )
            item.inventoryAmountAllWarehouse = this.$numberStr(item.inventoryAmountAllWarehouse, 2)
            item.documentTypeStr = this.selectDictLabel(this.typeDicts, item.documentType)
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
