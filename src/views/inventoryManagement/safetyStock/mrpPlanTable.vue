<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        ref="rightToolbar"
        :saveKey="saveKey"
        :savePath="savePath"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>
    <el-table border ref="tables" max-height="600px" v-loading="loading" :data="tableList">
      <el-table-column
        type="index"
        key="index"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
      >
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
          <template v-if="item.prop === 'isActive'">
            <el-switch
              v-model="scope.row.isActive"
              :disabled="comDisFrom"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <el-button
              size="mini"
              :loading="scope.row.btnLoading"
              type="text"
              @click="handleCreatePR(scope.row)"
              v-if="scope.row.isCanCreatePR === '1'"
            >
              {{ $t('INVENTORY.createPR') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      :saveKey="saveKey"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import {
  querySafetyStockList,
  calculateMrpPlanList,
  mrpCreatePR
} from '@/api/inventoryManagement/safetyStock'

export default {
  dicts: ['calculation_method'],
  mixins: [pageMixin],
  props: {
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    warehouseId: {
      type: String,
      default: ''
    },
    mrpPlanList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    mrpPlanList: {
      deep: false,
      immediate: true,
      handler(newValue) {
        const tableList = JSON.parse(JSON.stringify(this.mrpPlanList))
        this.setListRowMsg(tableList)
        this.tableList = tableList
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      }
    }
  },
  data() {
    const vm = this
    return {
      loading: false,
      saveKey: '3',
      savePath: 'safetyStock',
      // 总条数
      total: 0,
      /* 表格部分 */
      columns: [
        {
          prop: 'forecastDate',
          label: vm.$t('INVENTORY.forecastDate'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'safetyStock',
          label: vm.$t('INVENTORY.safetyStock'),
          visible: true,
          colMinWidth: 120,
          tooltip: true
        },
        {
          prop: 'currentInventoryQty',
          label: vm.$t('INVENTORY.currentInventoryQTY'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'projectedDemandQtyCumulative',
          label: vm.$t('INVENTORY.projectedDemandQTY'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'plannedReceiptQtyCumulative',
          label: vm.$t('INVENTORY.plannedReceiptQTY'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'projectedEndingInventory',
          label: vm.$t('INVENTORY.projectedEndingInventory'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'netRequirementQuantity',
          label: vm.$t('INVENTORY.netRequirementQuantity'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'suggestedRequisitionDate',
          label: vm.$t('INVENTORY.suggestedRequisitionDate'),
          visible: true,
          minWidth: 170,
          tooltip: true
        }
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      // 显示搜索条件
      showSearch: true,
      tableList: []
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    /* if (this.rowId) {
      this.getList()
    } */
  },
  activated() {
    if (this.timeId !== this.$route.query.timeId) {
      this.timeId = this.$route.query.timeId
      this.rowId = this.$route.query.id
      this.queryParams.pageNum = 1
      /* if (this.rowId) {
        this.getList()
      } */
    }
  },
  methods: {
    queryTable() {
      // 重算MRP计划列表
      this.loading = true
      const timer = Date.now()
      this.queryTimer = timer
      calculateMrpPlanList({ safetyStockId: this.rowId })
        .then((res) => {
          if (this.queryTimer !== timer) return
          const data = res.data || []
          this.$emit('mrpPlanListChange', data)
          this.loading = false
        })
        .catch(() => {
          if (this.queryTimer !== timer) return
          this.loading = false
        })
    },
    getList() {
      this.loading = true
      let param = { ...this.queryParams }
      param.safetyStockId = this.rowId
      param = this.$trimOfObj(param)
      querySafetyStockList(param)
        .then((response) => {
          const rows = response.rows || []
          this.setListRowMsg(rows)
          this.tableList = rows
          this.total = response.total
          this.loading = false
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.loading = false
        })
    },
    setListRowMsg(rows) {
      rows.forEach((item) => {
        item.forecastDate = this.parseTime(item.forecastDate, this.fmtForYmd)
        item.suggestedRequisitionDate = this.parseTime(
          item.suggestedRequisitionDate,
          this.fmtForYmd
        )

        item.safetyStock = this.$numberStr(item.safetyStock, item.decimalNum)
        item.currentInventoryQty = this.$numberStr(item.currentInventoryQty, item.decimalNum)
        item.projectedDemandQtyCumulative = this.$numberStr(
          item.projectedDemandQtyCumulative,
          item.decimalNum
        )
        item.plannedReceiptQtyCumulative = this.$numberStr(
          item.plannedReceiptQtyCumulative,
          item.decimalNum
        )
        item.projectedEndingInventory = this.$numberStr(
          item.projectedEndingInventory,
          item.decimalNum
        )
        item.netRequirementQuantity = this.$numberStr(item.netRequirementQuantity, item.decimalNum)
      })
    },
    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    handleCreatePR(row) {
      this.$modal.confirm(this.$t('INVENTORY.prSubmitConfirm')).then(() => {
        this.$set(row, 'btnLoading', true)
        return mrpCreatePR({
          mrpPlanId: row.mrpPlanId,
          safetyStockId: row.safetyStockId
        })
          .then((response) => {
            this.$set(row, 'btnLoading', false)
            this.$modal.msgSuccess(this.$t('INVENTORY.prSubmitSuccess').replace('$1', response.msg))
            this.queryTable()
          })
          .catch(() => {
            this.$set(row, 'btnLoading', false)
            this.queryTable()
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
