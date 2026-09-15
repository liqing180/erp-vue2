<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.detailsOfExpenses')"
    :visible.sync="visible"
    width="1200px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div class="right-title">
      <span class="mr20" :title="form.internalPartNo">
        {{ $t('PRODUCT.internalPartNo') }}：{{ form.internalPartNo }}
      </span>
      <span class="mr20" :title="form.productName">
        {{ $t('PRODUCT.productName') }}：{{ form.productName }}
      </span>
      <span class="mr20" :title="showUomLabel(form.uom)">
        {{ $t('PRODUCT.uom1') }}：{{ form.uom }}
      </span>
      <span class="mr20" v-show="form.purchaseCost" :title="form.purchaseCost">
        {{ $t('PURCHASE.purchaseCost') }}：{{ $numberStr(form.purchaseCost, 2) }}
      </span>
      <span class="mr20" v-show="form.inventoryCost" :title="form.inventoryCost">
        {{ $t('PURCHASE.inventoryCost') }}：{{ $numberStr(form.inventoryCost, 2) }}
      </span>
    </div>

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
import { queryInventoryCostDocumentMsg } from '@/api/purchaseManagement/purchaseCostAnalysisOrder'
import locale from '@/views/inventoryManagement/lang/index'
import chartDlg from './chartDlg'

export default {
  dicts: [],
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
          prop: 'expenseItemName',
          label: vm.$t('PURCHASE.expenseItem1'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'expenseItemType',
          propBy: 'expenseItemTypeStr',
          label: vm.$t('ui.type'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'expenseProportion',
          label: vm.$t('PURCHASE.expenseProportion'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'expenseAmount',
          label: vm.$t('PURCHASE.expenseAmount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'expenseCost',
          label: vm.$t('PURCHASE.inventoryCost'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          align: 'right'
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      form: {},
      typeDicts: [],
      productId: '',
      documentId: ''
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
      // this.form = row || {}
      this.productId = row.productId
      this.documentId = row.documentId
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    openChart() {
      this.$refs.chartDlg.openChart(this.productId, this.documentId)
    },
    getList() {
      const vm = this
      this.loading = true
      const param = this.queryParams
      param.productId = this.productId
      param.documentId = this.documentId
      this.$trimOfObj(param)
      queryInventoryCostDocumentMsg(param)
        .then((response) => {
          this.form = response.data
          const { inventoryCostSettingsList } = response.data
          const rows = inventoryCostSettingsList || []
          rows.forEach((item) => {
            item.expenseCost = this.$numberStr(item.expenseCost, 2)
            item.expenseAmount = this.$numberStr(item.expenseAmount, 2)
            item.expenseItemTypeStr =
              item.expenseItemType === '1'
                ? this.$t('SALES.expenseProportion6')
                : this.$t('SALES.amount6')
          })
          this.tableList = rows
          this.loading = false
          // this.total = response.total
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
