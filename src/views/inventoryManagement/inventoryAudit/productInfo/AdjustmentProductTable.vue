<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleImport"
          v-if="importExportShow"
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          >{{ $t('menu.importExport') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          @click="handleAddBtn"
          v-if="addBtnShow"
          :disabled="!formData.warehouseId"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('uiBtn.add') }}</el-button
        >
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
      :cell-class-name="tableCellClassName"
      :data="tableList"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      :max-height="390"
      v-table-tab
      :key="'table' + modifyHighlight"
    >
      <!-- <el-table-column
        :selectable="selectable"
        type="selection"
        key="selection"
        align="center"
        width="55"
      ></el-table-column> -->
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
        <template slot="header" slot-scope="{ column }">
          <span v-if="['auditQty'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'auditQty'">
            <template v-if="!comDisFrom">
              <el-input-number
                style="width: 98%"
                v-model="scope.row.auditQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                :min="0"
                :max="99999999"
                @change="auditQtyChange(scope.row)"
              />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'qtyOnHand'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'qtyTolerance'">
            <span v-if="scope.row.auditResult === '1'" class="text-green">{{
              $numberStr(scope.row[item.prop], scope.row.decimalNum)
            }}</span>
            <span v-else-if="scope.row.auditResult === '2'" class="text-red">{{
              $numberStr(scope.row[item.prop], scope.row.decimalNum)
            }}</span>
            <span v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
          </template>
          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
            />
          </template>

          <template v-else-if="item.prop === 'costOfGoods'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'amountTolerance'">
            <span v-if="scope.row.auditResult === '1'" class="text-green">{{
              $numberStr(scope.row[item.prop], 2)
            }}</span>
            <span v-else-if="scope.row.auditResult === '2'" class="text-red">{{
              $numberStr(scope.row[item.prop], 2)
            }}</span>
            <span v-else>{{ $numberStr(scope.row[item.prop], 2) }}</span>
          </template>
          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
        fixed="right"
        v-if="addBtnShow"
      >
        <template slot-scope="scope">
          <div class="flexCen">
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
    <importExcelDlgForAdjustment
      ref="importExcelDlgForAdjustment"
      :warehouseId="formData.warehouseId"
      @onSuccess="importSuccess"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from '../components/selectProductTable'
import importExcelDlgForAdjustment from '../importExcelDlgForAdjustment.vue'

export default {
  mixins: [pageMixin],
  dicts: ['inventory_audit_result', 'inventory_control_mode'],
  components: {
    selectProductTable,
    importExcelDlgForAdjustment
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
    productList: {
      type: Array,
      default() {
        return []
      }
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
    basicUpdateProps: {
      type: Array,
      default() {
        return []
      }
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
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.totalForm = newValue || {}
      }
    },
    'formData.productList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.productList
        this.tableList.forEach((item) => {
          item.inventoryControlModeStr = this.selectDictLabel(
            this.dict.type.inventory_control_mode,
            item.inventoryControlMode
          )
        })
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
      saveKey: '4',
      savePath: 'IMTable',
      activeName: '1',
      columns: [
        {
          prop: 'productName',
          label: vm.$t('INVENTORY.productName'),
          visible: true,
          minWidth: 200,
          fixed: true,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('INVENTORY.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'inventoryControlMode',
          propBy: 'inventoryControlModeStr',
          label: vm.$t('INVENTORY.inventoryControlMode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('INVENTORY.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('INVENTORY.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'consignorName',
          label: vm.$t('INVENTORY.consignor'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'leadTime',
          label: vm.$t('INVENTORY.batchNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('INVENTORY.uom'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'costOfGoods',
          label: vm.$t('INVENTORY.inventoryCost'),
          visible: true,
          minWidth: 140,
          padding: 50,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('INVENTORY.qtyOnHand'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'auditQty',
          label: vm.$t('INVENTORY.auditQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qtyTolerance',
          label: vm.$t('INVENTORY.qtyTolerance'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'amountTolerance',
          label: vm.$t('INVENTORY.amountTolerance'),
          visible: true,
          minWidth: 140,
          padding: 50,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'auditResultShowStr',
          label: vm.$t('INVENTORY.result'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 140,
          tooltip: false
        }
      ],
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      totalForm: {},
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'labelDetailId',
      reQuoteLoading: false,
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
    addBtnShow() {
      if (this.comDisFrom) {
        return false
      }
      return true
    },
    editAuth() {
      return this.checkPermi(['inventoryManagement:inventoryAudit:edit'])
    },
    importExportShow() {
      if (this.isEditPage) {
        const buttonAuthMsg = this.formData.buttonAuthMsg || {}
        return this.editAuth && buttonAuthMsg.isCanImport === '1'
      } else {
        return true
      }
    },
    isEditPage() {
      return !!this.formData.inventoryAuditId
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
          case 'auditQty':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    getList() {
      return this.tableList
    },

    handleAddBtn() {
      const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      this.$refs.selectProductTable.handleAdd(alreadySelectIdList)
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        rows.forEach((item) => {
          item.salesInquiryProductType = '1'
          item.remarks = ''
        })
        this.tableList.push(...rows)
        this.changeTableList()
      }
    },
    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    auditQtyChange(row) {
      const req1 = this.$resultOfBoolean(row.auditQty)
      if (req1) {
        const qtyTolerance = row.auditQty - row.qtyOnHand
        this.$set(row, 'qtyTolerance', qtyTolerance)
        if (qtyTolerance > 0) {
          this.$set(row, 'auditResult', '1')
        } else if (qtyTolerance < 0) {
          this.$set(row, 'auditResult', '2')
        } else {
          this.$set(row, 'auditResult', '3')
        }
        const auditResultShowStr = this.selectDictLabel(
          this.dict.type.inventory_audit_result,
          row.auditResult
        )
        this.$set(row, 'auditResultShowStr', auditResultShowStr)
      } else {
        this.$set(row, 'qtyTolerance', undefined)
        this.$set(row, 'auditResult', undefined)
        this.$set(row, 'auditResultShowStr', undefined)
      }
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
      })
    },
    // 表格全选
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selected.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selected.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[this.rowIdKey])
        vm.selected = vm.selected.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    // 行单个选择
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selected.length; i++) {
        if (vm.selected[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selected.splice(i, 1)
        }
      }
      vm.selected.push(row)
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
      const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'table-SelectedRow-bgcolor'
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
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },

    handleImport() {
      this.$refs.importExcelDlgForAdjustment.show()
    },
    importSuccess(list) {
      this.tableList.length = 0
      this.tableList.push(...list)
    }
  }
}
</script>

<style lang="scss" scoped>
.text-red {
  color: #ff0000;
}
.text-green {
  color: #00cc00;
}
</style>
