<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <!-- <right-toolbar
        :saveKey="saveKey"
        :savePath="savePath"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar> -->
    </el-row>

    <el-table
      border
      ref="tables"
      :data="tableList"
      @sort-change="handleSortChange"
      :max-height="600"
      style="cursor: pointer"
    >
      <!-- <el-table-column type="index" :label="$t('ui.sn')" width="80" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column> -->
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
          <template v-else-if="item.prop === 'projectProgress'">
            <div v-if="$resultOfBoolean(scope.row[item.prop])">
              {{ $numberStr(scope.row[item.prop], 2) }}%
            </div>
          </template>
          <template v-else-if="item.prop === 'profit'">
            <div v-if="$resultOfBoolean(scope.row[item.prop])">
              {{ $numberStr(scope.row[item.prop], 2) }}
            </div>
          </template>
          <template v-else-if="item.prop === 'profitLoss'">
            <div v-if="$resultOfBoolean(scope.row.profit)">
              {{ scope.row.profit >= 0 ? $t('PRODUCT.profit1') : $t('PRODUCT.loss') }}
            </div>
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
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import { queryCostProjectInventoryList } from '@/api/projectManagement/project'

export default {
  mixins: [pageMixin],
  components: {},
  props: {
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    rowId: {
      type: String,
      default: ''
    }
  },
  watch: {},
  data() {
    const vm = this
    return {
      saveKey: '1234',
      savePath: 'projectSummaryTable',
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
          prop: 'actualCostNew',
          label: vm.$t('PRODUCT.actualCost'),
          visible: true,
          minWidth: 200,
          padding: 50,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'salesAmount',
          label: vm.$t('PRODUCT.salesAmount'),
          visible: true,
          minWidth: 200,
          padding: 50,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'receivedAmount',
          label: vm.$t('SALES.receivedAmount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          align: 'right'
        },
        /* {
          prop: 'profitLoss',
          label: vm.$t('PRODUCT.profitLoss'),
          visible: true,
          minWidth: 150,
          tooltip: true
        }, */
        {
          prop: 'profit',
          label: vm.$t('PRODUCT.amount'),
          visible: true,
          minWidth: 150,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'projectProgress',
          label: vm.$t('SALES.collectionProgress'),
          minWidth: 170,
          visible: true,
          tooltip: true
        }
      ],
      rowIdKey: 'costProjectInventoryId'
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
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    init(data = []) {
      // this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      // this.getList()
      const rows = data || []
      rows.forEach((item) => {
        item.actualCostNew = this.$numberStr(item.actualCostNew, 2)
        item.salesAmount = this.$numberStr(item.salesAmount, 2)
        item.receivedAmount = this.$numberStr(item.receivedAmount, 2)
        // item.profit = this.$numberStr(item.profit, 2)
        item.profitMargin = this.$numberStr(item.profitMargin, 2)
      })
      this.tableList = rows
    },
    getList() {
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      param.costProjectId = this.rowId
      this.loading = true
      queryCostProjectInventoryList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.inventoryUnitPriceAllWarehouse = this.$numberStr(
              item.inventoryUnitPriceAllWarehouse,
              2
            )
            item.purchaseAmount = this.$numberStr(item.purchaseAmount, 2)
            item.inventoryAmount = this.$numberStr(item.inventoryAmount, 2)
            item.accumulatedProjectCost = this.$numberStr(item.accumulatedProjectCost, 2)
          })

          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.purchaseAmount = this.$numberStr(summary.purchaseAmount, 2)
            summary.inventoryAmount = this.$numberStr(summary.inventoryAmount, 2)
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
