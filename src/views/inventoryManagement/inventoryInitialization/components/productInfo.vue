<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleAddBtn"
          :disabled="!formData.warehouseId"
          v-if="addBtnShow"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          :disabled="!formData.warehouseId"
          v-if="addBtnShow"
          >{{ $t('uiBtn.import') }}</el-button
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
      :key="tableKey + '-' + modifyHighlight"
      border
      ref="tables"
      max-height="600px"
      :data="tableList"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      v-table-tab
    >
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
          <span v-if="['unitPrice'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'stockInQty'">
            <!-- <template v-if="!comDisFrom && scope.row.nonInventoryItem === '1'">
              <el-input-number
                style="width: 98%"
                v-model="scope.row.stockInQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="scope.row.includeDecimal === '1' ? 99999999.999 : 99999999"
              />
            </template> -->
            <template>
              <span v-if="scope.row.isPhantom === '1'"> - </span>
              <span v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
            </template>
          </template>
          <template v-else-if="item.prop === 'qty'">
            <template v-if="!comDisFrom">
              <el-input-number
                style="width: 98%"
                v-model="scope.row.qty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="scope.row.includeDecimal === '1' ? 99999.999 : 99999"
                :disabled="scope.row.isPhantom === '1' && scope.row.nonInventoryItem === '1'"
              />
              <!-- :min="0" -->
              <!-- :min="scope.row.includeDecimal === '1' ? 0.001 : 1" -->
            </template>
            <template v-else>
              <span v-if="scope.row.isPhantom === '1'"> - </span>
              <span v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
            </template>
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            <!-- && !scope.row.purchaseCost -->
            <template v-if="!comDisFrom">
              <el-input-number
                style="width: 98%"
                v-model="scope.row.unitPrice"
                controls-position="right"
                :precision="2"
                v-thousandSplit="{ precision: 2 }"
                :min="0.01"
                :max="999999999999.99"
                @change="unitPriceChange(scope.row)"
              />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'landedCost'">
            <!-- && !scope.row.purchaseCost -->
            <template v-if="!comDisFrom">
              <el-input-number
                style="width: 98%"
                v-model="scope.row.landedCost"
                controls-position="right"
                :precision="2"
                v-thousandSplit="{ precision: 2 }"
                :min="scope.row.unitPrice || 0.01"
                :max="999999999999.99"
              />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
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
    <ImportDlg
      ref="importDlg"
      :formData="formData"
      :importOptions="importOptions"
      @onSuccess="importSuccess"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from './selectProductTable'
import ImportDlg from './importDlg.vue'
export default {
  components: { selectProductTable, ImportDlg },
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
    modifyHighlight: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'formData.inventoryInitializationProductList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.inventoryInitializationProductList
        this.changeTableList()
      }
    }
  },
  data() {
    const vm = this
    return {
      tableKey: Date.now(),
      saveKey: '1',
      savePath: 'productInfo',
      // 总条数
      total: 0,
      /* 表格部分 */
      columns: [
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 160,
          tooltip: false
        },
        {
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 160,
        //   tooltip: true
        // },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'stockInQty',
          label: vm.$t('PURCHASE.stockInQty'),
          visible: true,
          fixedWidth: 160,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          fixedWidth: 160,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('INVENTORY.purchasePrice'),
          visible: true,
          fixedWidth: 160,
          tooltip: true
        },
        {
          prop: 'landedCost',
          label: vm.$t('INVENTORY.landedCost'),
          visible: true,
          fixedWidth: 160,
          tooltip: true
        }
      ],
      tableList: [],
      importOptions: {
        // 下载模板
        // downFileUrl: '/inventory/inventoryInitialization/downTemplate',
        downFileUrl: '/inventory/inventoryInitialization/exportData',
        // 上传校验
        uploadUrl:
          process.env.VUE_APP_BASE_API + '/inventory/inventoryInitialization/checkImportData',
        // 提交导入
        importUrl: '/inventory/inventoryInitialization/importData',
        // 下载文件名
        fileName: 'Inventory Initialization'
      },
      rowIdKey: 'productId',
      purchaseAmount: '',
      costOfGoods: '',
      depositAmount: ''
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    addBtnShow() {
      if (this.comDisFrom) {
        return false
      }
      return true
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    tableRowClassName({ row }) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (row.updateType === '2') {
        return 'new-add-row'
      }
      if (row.updateType === '3') {
        return 'cancel-row'
      }
      return ''
    },
    tableCellClassName({ row, column }) {
      if (
        this.modifyHighlight &&
        row.updateType === '1' &&
        (row.updateMsgList || []).some((item) => item.name === column.property)
      ) {
        return 'edit-table-cell'
      }
      return ''
    },
    unitPriceChange(row) {
      const { unitPrice, landedCost } = row
      if (landedCost && unitPrice && landedCost < unitPrice) {
        row.landedCost = unitPrice
      }
    },
    handleAddBtn() {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      const tableList = JSON.parse(JSON.stringify(this.tableList))
      this.$refs.selectProductTable.handleAdd(tableList)
    },
    updateTable(list) {
      // if (list.length > 0) {
      const rows = JSON.parse(JSON.stringify(list))
      this.tableList.length = 0
      this.tableList.push(...rows)
      this.changeTableList()
      // }
    },
    handleDelRow(index, row) {
      // this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
      this.tableList.splice(index, 1)
      // })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
    },
    importSuccess(res) {
      const data = res.data || []
      data.forEach((newItem) => {
        const existingIndex = this.tableList.findIndex(
          (item) => item.productId === newItem.productId
        )
        if (existingIndex !== -1) {
          // 如果存在，则替换已有数据
          this.tableList.splice(existingIndex, 1, newItem)
        } else {
          // 如果不存在，则新增数据
          this.tableList.push(newItem)
        }
      })
      this.changeTableList()
    },
    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-content {
  float: right;
  display: flex;
  justify-content: center;
  margin-right: 20px;
  // height: 40px;
  line-height: 28px;
  font-weight: 600;
  color: #606266;
  font-size: 12px;
}
</style>
