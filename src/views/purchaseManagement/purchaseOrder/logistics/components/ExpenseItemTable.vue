<template>
  <div class="pb20">
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
      :data="comTableList"
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
          <span v-if="['expenseItemName', 'documentNo', 'amount'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'expenseItemName' && !scope.row.isTotal">
            <el-input
              v-if="!comDisFrom"
              style="width: 98%"
              :title="scope.row.expenseItemName"
              v-model="scope.row.expenseItemName"
              :maxlength="200"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'documentNo' && !scope.row.isTotal">
            <el-input
              v-if="!comDisFrom"
              style="width: 98%"
              :title="scope.row.documentNo"
              v-model="scope.row.documentNo"
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
                  :min="1"
                  :max="999999999"
                  @change="amountChange(scope.row)"
                />
              </template>
              <template v-else>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</template>
            </template>
            <template v-else>{{ $numberStr(comAmount, 6, false, 2) }}</template>
          </template>
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
              class="el-icon-connection pointer mr5"
              style="font-size: 22px; color: #0094ff"
              @click="handleRowAssign(scope.$index, scope.row)"
            ></i>
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

    <selectProductTable :formData="formData" ref="selectProductTable" @onSuccess="updateTable" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from './selectProductTable'
import { calculateOneDetailForLogisticsExpense } from '@/api/purchaseManagement/purchaseOrder'

export default {
  mixins: [pageMixin],
  components: {
    selectProductTable
  },
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
    'formData.logisticsExpenseList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.logisticsExpenseList
        this.changeTableList()
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
          prop: 'expenseItemName',
          label: vm.$t('PURCHASE.expenseItem'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.documentNo2'),
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
          case 'expenseItemName':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
          case 'documentNo':
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
      this.tableList.push({ logisticsExpenseDetailList: [] })
    },
    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
      })
    },
    amountChange(row) {
      this.calculateOneDetail(row)
    },
    calculateOneDetail(row) {
      const timer = Date.now()
      row.queryTime = timer
      calculateOneDetailForLogisticsExpense(row).then((res) => {
        if (timer !== row.queryTime) return
        const data = res.data || {}
        const logisticsExpenseDetailList = data.logisticsExpenseDetailList
        this.$set(row, 'logisticsExpenseDetailList', logisticsExpenseDetailList)
      })
    },

    handleRowAssign(index, row) {
      this.assignIndex = index
      const logisticsExpenseDetailList = row.logisticsExpenseDetailList || []
      const alreadySelectIdList = logisticsExpenseDetailList.map((item) => item.documentDetailId)
      this.$refs.selectProductTable.handleAdd(alreadySelectIdList)
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        rows.forEach((item) => {
          item.salesInquiryProductType = '1'
          item.remarks = ''
        })
        const editItem = this.tableList[this.assignIndex]
        if (editItem) {
          const childList = editItem.logisticsExpenseDetailList || []
          childList.push(...rows)
          this.$set(editItem, 'logisticsExpenseDetailList', childList)
          this.calculateOneDetail(editItem)
        }
      }
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
