<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :saveKey="saveKey"
        :savePath="savePath"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      :data="tableList"
      @sort-change="handleSortChange"
      :max-height="600"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="80" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.costProjectSalesProductId
              ? scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1
              : $t('PURCHASE.subTotal')
          }}</span>
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
          <template v-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'salesQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <!-- <template v-else-if="item.prop === 'receivedQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template> -->

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
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import locale1 from '@/views/productManagement/lang/index'

import { queryCostProjectSalesProductList } from '@/api/projectManagement/project'
export default {
  mixins: [pageMixin],
  components: {},
  props: {
    comDisFrom: {
      type: Boolean,
      default: false
    },
    pqProductList: {
      type: Array,
      default() {
        return []
      }
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    warehouseId: {
      type: String,
      default: ''
    },
    storeIssueChitId: {
      type: String,
      default: ''
    }
  },
  watch: {},
  data() {
    const vm = this
    return {
      saveKey: '16',
      savePath: 'salesAmountTableDetail',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      loading: false,
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      columns: [
        {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.DocNo'),
          visible: true,
          sortable: 'custom',
          minWidth: 160,
          tooltip: false
        },
        {
          prop: 'documentType',
          propBy: 'documentTypeShowStr',
          label: vm.$t('PURCHASE.documentType'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'deliveryNoticeNo',
        //   label: vm.$t('menu.deliveryNotice'),
        //   visible: true,
        //   sortable: 'custom',
        //   minWidth: 160,
        //   tooltip: true
        // },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          sortable: 'custom',
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          sortable: 'custom',
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PURCHASE.alias'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'salesQty',
        //   label: vm.$t('PURCHASE.qty'),
        //   visible: true,
        //   sortable: 'custom',
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'receivedQty',
          label: vm.$t('PURCHASE.qtyAck'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'salesAmount',
        //   label: vm.$t('PURCHASE.salesAmount'),
        //   visible: true,
        //   sortable: 'custom',
        //   minWidth: 160,
        //   tooltip: true,
        //   align: 'right'
        // },
        {
          prop: 'receivedAmount',
          label: vm.$t('PURCHASE.receivedAmount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          align: 'right',
          sortable: 'custom'
        }
      ],
      rowIdKey: 'costProjectSalesProductId',
      rowId: null
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    openReservedDetail(row) {
      this.$refs.reservedDetailsDlg.handleOpen(row)
    },
    init(id) {
      this.$refs.tables && this.$refs.tables.clearSort()
      this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      this.rowId = id
      this.getList()
    },
    getList() {
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      param.costProjectSalesId = this.rowId
      this.loading = true
      queryCostProjectSalesProductList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.inventoryUnitPriceAllWarehouse = this.$numberStr(
              item.inventoryUnitPriceAllWarehouse,
              2
            )
            item.salesAmount = this.$numberStr(item.salesAmount, 2)
            item.receivedAmount = this.$numberStr(item.receivedAmount, 2)
            item.receivedQty = this.$numberStr(item.receivedQty, 2)
          })

          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.salesAmount = this.$numberStr(summary.salesAmount, 2)
            summary.receivedAmount = this.$numberStr(summary.receivedAmount, 2)
            summary.receivedQty = this.$numberStr(summary.receivedQty, 2)
            rows.push(summary)
          }
          this.tableList = rows
          this.loading = false
          this.total = response.total
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.tableList = []
          this.loading = false
        })
    }
  }
}
</script>

<style></style>
