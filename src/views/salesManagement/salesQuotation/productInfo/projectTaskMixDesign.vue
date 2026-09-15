<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleAddBtn"
          v-if="addBtnShow"
          :disabled="!formData.currencyId"
          :loading="formData.tableLoading"
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
      <!-- <div class="footer-content">
        <div>{{ $t('SALES.productQTY') }} / {{ $t('SALES.quoted') }}</div>
        ：
        <div>
          {{ tableList.length }} / {{ tableList.filter((o) => o.purchaseQuotationNo).length }}
        </div>
      </div> -->
    </el-row>
    <el-table
      border
      ref="tables"
      v-loading="formData.tableLoading"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      :data="comTableList"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
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
          <span v-if="['qty', 'unitPrice'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'qty'">
            <template v-if="!comDisFrom && !disInQuotation">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                v-model="scope.row.qty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999999999"
                @change="qtyChange(scope.row)"
              />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            <div class="flexSb">
              <div class="flow1">
                <el-input-number
                  v-thousandSplit="{ precision: 2 }"
                  style="width: 98%"
                  v-model="scope.row.unitPrice"
                  controls-position="right"
                  :precision="2"
                  :min="0.01"
                  :max="999999999999.99"
                  @change="qtyChange(scope.row)"
                  v-if="!comDisFrom"
                />
                <div :title="$numberStr(scope.row[item.prop], 2)" v-else>
                  {{ $numberStr(scope.row[item.prop], 2) }}
                </div>
              </div>
              <div
                class="fs-0"
                v-if="scope.row.isNeedTips && ['1', '2'].indexOf(scope.row.isNeedTips) !== -1"
              >
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    <div v-if="scope.row.isNeedTips === '1'">
                      {{
                        $t('SALES.unitPriceHigh').replace('$1', $numberStr(scope.row.maxPrice, 2))
                      }}
                    </div>
                    <div v-if="scope.row.isNeedTips === '2'">
                      {{
                        $t('SALES.unitPriceLow').replace('$1', $numberStr(scope.row.minPrice, 2))
                      }}
                    </div>
                    <div class="mt10">{{ $t('SALES.priceExceeds') }}</div>
                    <div class="mt10">{{ $t('SALES.compulsoryApproval') }}</div>
                  </div>
                  <svg-icon icon-class="warning" class="ml10" style="height: 20px; width: 20px" />
                </el-tooltip>
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'discount'">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-if="!comDisFrom"
              style="width: 98%"
              v-model="scope.row.discount"
              controls-position="right"
              :precision="2"
              :min="0"
              :max="999999999999.99"
              @change="discountChange(scope.row)"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'lineTotal'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'pplUnitPrice'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
            />
          </template>
          <template v-else-if="item.prop === 'serviceType'">
            {{ selectDictLabel(dict.type.service_type, scope.row.serviceType) }}
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
        :fixed="false"
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

    <selectServiceProductTable
      :formData="formData"
      ref="selectServiceProductTable"
      @onSuccess="updateTable"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectServiceProductTable from '@/views/salesManagement/salesInquiry/components/selectServiceProductTable'
export default {
  mixins: [pageMixin],
  dicts: ['service_type'],
  components: {
    selectServiceProductTable
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
    'formData.salesQuotationServiceList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.salesQuotationServiceList
        if (this.tableListCopy.length <= 0) {
          this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
        }
        this.tableList.forEach((item) => {
          this.$set(item, 'exchangeRateDesc', this.formData.exchangeRateDesc)
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
      saveKey: '24',
      savePath: 'projectTaskMixDesign',
      activeName: '1',
      columns: [
        {
          prop: 'serviceType',
          label: vm.$t('ui.type'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('SALES.salesQTY1'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },

        {
          prop: 'unitPrice',
          label: vm.$t('SALES.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: false,
          padding: 70,
          align: 'right'
        },
        {
          prop: 'discount',
          label: vm.$t('SALES.discount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('SALES.lineTotal'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'exchangeRateDesc',
          label: vm.$t('menu.exchangeRate'),
          visible: true,
          minWidth: 200,
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
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      totalForm: {},
      tableList: [],
      tableListCopy: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'productId',
      popoverData: {},
      reQuoteLoading: false,
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: []
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    comTableList() {
      return this.tableList
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    addBtnShow() {
      if (this.comDisFrom) {
        return false
      }
      return true
    },
    disInQuotation() {
      return this.formData.salesInquiryStatus === '4'
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
          case 'qty':
            item.colMinWidth = vm.comDisFrom || vm.disInQuotation ? undefined : 120
            break
          case 'unitPrice':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'discount':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'remarks':
            item.colMinWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    getList() {
      return this.tableList
    },
    qtyChange(row) {
      this.getLineTotal(row)
    },
    discountChange(row) {
      this.getLineTotal(row)
    },
    getLineTotal(row) {
      this.$nextTick(() => {
        if (this.$resultOfBoolean(row.qty) && this.$resultOfBoolean(row.unitPrice)) {
          const lineTotal = row.unitPrice * row.qty
          if (row.discount > lineTotal) {
            this.$set(row, 'discount', lineTotal)
          }
          this.$set(row, 'lineTotal', lineTotal - (row.discount || 0))
        } else {
          this.$set(row, 'lineTotal', undefined)
        }
        this.changeTableList()
      })
    },
    handleAddBtn() {
      const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      this.$refs.selectServiceProductTable.handleAdd(alreadySelectIdList)
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        rows.forEach((item) => {
          this.$set(item, 'discount', undefined)
          item.remarks = ''
        })
        this.tableList.push(...rows)
        this.changeTableList()
      }
    },
    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.comTableList)
      })
    },

    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.changeExpectedDeliveryDate()
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
      if (row.isTotal || row.serviceType === 'Internal') {
        return false
      }
      return true // 不禁用
    },
    handleReturn() {
      this.$emit('handleReturn', 'projectTask')
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
