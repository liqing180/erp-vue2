<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-button @click="handleAddBtn" type="primary" icon="el-icon-plus" size="mini">{{
          $t('uiBtn.add')
        }}</el-button>
      </el-col>
      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>
    <el-table
      border
      ref="tables"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      :data="tableList"
      :max-height="390"
      v-table-tab
    >
      <el-table-column
        v-if="false"
        type="selection"
        key="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column
        type="index"
        key="index"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
        class-name="allowDrag"
      >
        <template slot-scope="scope">
          <span v-if="!scope.row.isTotal">{{ scope.$index + 1 }}</span>
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
        <template slot="header" slot-scope="{ column }">
          <span v-if="['expenseItem', 'amount'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <div v-else-if="['referenceAmount'].includes(item.prop)">
            <span>{{ column.label }}</span>
            <span v-if="legalEntityInfo.currencySymbol"
              >({{ legalEntityInfo.currencySymbol }})</span
            >
          </div>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'expenseItem' && !scope.row.isTotal">
            <el-input
              v-if="!comDisFrom"
              style="width: 98%"
              :title="scope.row.expenseItem"
              v-model="scope.row.expenseItem"
              :maxlength="50"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>

          <template v-else-if="item.prop === 'amount'">
            <template v-if="!scope.row.isTotal">
              <template v-if="!comDisFrom">
                <el-input-number
                  v-thousandSplit="{ precision: 6, minPrecision: 2, keepDec: false }"
                  style="width: 98%"
                  v-model="scope.row.amount"
                  controls-position="right"
                  :precision="6"
                  :min-precision="2"
                  :min="0.01"
                  :max="999999999.99"
                  @change="amountChange(scope.row)"
                />
              </template>
              <template v-else>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</template>
            </template>
            <template v-else>{{ $numberStr(comAmount, 6, false, 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'referenceAmount'">{{
            $numberStr(scope.row[item.prop], 6, false, 2)
          }}</template>
          <template v-else-if="item.prop === 'remarks' && !scope.row.isTotal">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="300"
              :disabled="comDisFrom"
            />
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
        v-if="!comDisFrom"
      >
        <template slot-scope="scope">
          <div class="flexCen" v-if="!scope.row.isTotal">
            <i
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.$index, scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { calculateDetailsOfExpenses } from '@/api/purchaseManagement/purchaseOrder'

export default {
  mixins: [pageMixin],
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false
    },

    comDisFrom: {
      type: Boolean,
      default: false
    },
    countryId: {
      type: String,
      default: ''
    },
    businessPartnerId: {
      type: String,
      default: ''
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  watch: {
    'formData.detailsOfExpensesList': {
      immediate: true,
      handler: function (selected) {
        if (!this.formData.detailsOfExpensesList) {
          this.$set(this.formData, 'detailsOfExpensesList', [])
        }
        this.tableList = this.formData.detailsOfExpensesList
        this.changeTableList()
      }
    },
    'formData.currencyId': {
      immediate: true,
      handler: function () {
        this.calculateOneDetail()
      }
    },
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '23',
      savePath: 'salesMTable',
      activeName: '1',
      columns: [
        {
          prop: 'expenseItem',
          label: vm.$t('PURCHASE.expenseItem'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'amount',
          label: vm.$t('PURCHASE.amount'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right',
          padding: 50
        },
        {
          prop: 'referenceAmount',
          label: vm.$t('PURCHASE.referenceAmount1'),
          visible: true,
          colMinWidth: 200,
          align: 'right',
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
      ],
      totalForm: {},
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'salesPartId',
      popoverData: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: []
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    comTableList() {
      if (this.tableList.length > 1) {
        return [...this.tableList, { isTotal: '1' }]
      } else {
        return this.tableList
      }
    },
    comAmount() {
      const amountList = this.tableList.map((item) => item.amount)
      let total = 0
      amountList.forEach((cost) => {
        if (cost) {
          total += cost || 0
        }
      })
      return total
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'expenseItem':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
          case 'amount':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
        }
      })
    },

    handleAddBtn() {
      this.tableList.push({
        whetherToTax: '1',
        timerId: Date.now().toString()
      })
    },
    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.$emit('changeDetailsOfExpenses')
      })
    },
    amountChange(row) {
      this.calculateOneDetail(row)
      this.$emit('changeDetailsOfExpenses')
    },
    calculateOneDetail(row) {
      const timer = Date.now()
      this.queryTime = timer
      this.tableList.forEach((item) => {
        // item.currencyId = this.formData.currencyId
        // item.currencyCode = this.formData.currencyCode
        if (!item.timerId) {
          item.timerId = item.detailsOfExpensesId
        }
      })

      calculateDetailsOfExpenses({
        currencyId: this.formData.currencyId,
        currencyCode: this.formData.currencyCode,
        detailsOfExpensesList: [...this.tableList]
      }).then((res) => {
        if (timer !== this.queryTime) return
        const data = res.data || {}
        const list = data.detailsOfExpensesList || []
        list.forEach((item) => {
          const findItem = this.tableList.find((i) => i.timerId === item.timerId)
          if (findItem) {
            this.$set(findItem, 'referenceAmount', item.referenceAmount)
            this.$set(findItem, 'referenceCurrencyCode', item.referenceCurrencyCode)
            this.$set(findItem, 'exchangeRate', item.exchangeRate)
          }
        })
      })
    },

    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        }
        if (row.updateType === '3') {
          color = 'cancel-row'
        }
      }
      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (this.modifyHighlight) {
        if (row.updateType === '1') {
          if ((row.updateMsgList || []).find((item) => item.name === column.property)) {
            cellClass = 'edit-table-cell'
          }
        }
      }
      return cellClass
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-box {
  max-width: 600px;
  max-height: 60vh;
  overflow-y: auto;
  // padding: 12px;
  box-sizing: border-box;
  background-color: #333;
  div {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
