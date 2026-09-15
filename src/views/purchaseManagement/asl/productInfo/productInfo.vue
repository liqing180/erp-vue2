<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleAddForPQ"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-if="!comDisFrom && formData.purchaseQuotationId"
          >{{ $t('PURCHASE.product') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          @click="handleAddBtn"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-if="!comDisFrom"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-if="!comDisFrom"
          >{{ $t('uiBtn.import') }}</el-button
        >
      </el-col> -->

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
      :tree-props="{ children: 'serviceSurchargeList', hasChildren: 'hasChildren' }"
      :indent="2"
      ref="tables"
      max-height="600px"
      :data="comTableList"
      default-expand-all
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      :row-key="rowIdKey"
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
          <span>{{ scope.row.snNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in getVisibleColumn(comVisibleColumn)"
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
          <span
            v-if="['effectiveDate', 'unitPrice', 'leadTime', 'productName'].includes(item.prop)"
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'productName' && !scope.row.productId">
            <selectExpenseItemName
              :value="scope.row.expenseItemName"
              :canSelectOptions="
                getServiceSurchargeListOptions(serviceSurchargeListOptions, scope.row)
              "
              :allOptions="serviceSurchargeListOptions"
              :style="`width:  calc(98% - ${item.isLeft === '1' ? 22 : 0}px)`"
              @change="productNameChange($event, scope.row)"
              v-if="!comDisFrom"
            />
            <template v-else>{{ scope.row.expenseItemName }}</template>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'externalPartNo' && scope.row.productId">
            <el-input
              v-if="!comDisFrom && !scope.row.purchaseQuotationDetailId"
              style="width: 98%"
              :title="scope.row.externalPartNo"
              v-model="scope.row.externalPartNo"
              :maxlength="200"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseUom'">
            <template v-if="!scope.row.productId">
              <template v-if="scope.row.isCustom === '1' && !comDisFrom">
                <el-select
                  style="width: 98%"
                  v-model="scope.row.unit"
                  filterable
                  :title="showUomLabel(scope.row.unit)"
                  placeholder=""
                  @change="adhocEntryChangePurchaseUom(scope.row)"
                >
                  <el-option v-for="item in allUomList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>
              <span v-else :title="showUomLabel(scope.row.unit)">{{ scope.row.unit }}</span>
            </template>
            <span v-else :title="showUomLabel(scope.row[item.prop])">{{
              scope.row[item.prop]
            }}</span>
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              style="width: 98%"
              v-model="scope.row.unitPrice"
              controls-position="right"
              :precision="2"
              :min="scope.row.serviceSurchargeId || !scope.row.productId ? -999999999999.99 : 0.0"
              :max="999999999999.99"
              @change="unitPriceChange(scope.row)"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'authorizedPrice' && scope.row.productId">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              style="width: 98%"
              v-model="scope.row.authorizedPrice"
              controls-position="right"
              :precision="2"
              :min="0.01"
              :max="99999999.99"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'moq' && scope.row.productId">
            <el-input-number
              v-thousandSplit="{ precision: scope.row.decimalNum }"
              style="width: 98%"
              v-model="scope.row.moq"
              controls-position="right"
              :precision="scope.row.decimalNum"
              :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
              :max="999999"
              @change="moqChange(scope.row)"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'leadTime' && scope.row.productId">
            <el-input-number
              v-thousandSplit="{ precision: 0 }"
              style="width: 98%"
              v-model="scope.row.leadTime"
              controls-position="right"
              :precision="0"
              :min="1"
              :max="999"
              @change="leadTimeChange(scope.row, scope.$index)"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'warranty' && scope.row.productId">
            <el-input-number
              v-thousandSplit="{ precision: 0 }"
              v-if="!comDisFrom"
              style="width: 98%"
              v-model="scope.row.warranty"
              controls-position="right"
              :precision="0"
              :min="0"
              :max="9999"
              :disabled="scope.row.isCanUpdate === '0'"
              @change="changeWarranty(scope.$index)"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseUomCoefficient' && scope.row.productId">
            <div class="flex">
              <el-input-number
                class="flex-1"
                :disabled="true"
                v-model="scope.row.purchaseUomCoefficient"
                controls-position="right"
                :precision="3"
                v-thousandSplit="{ precision: 3 }"
                :min="0.001"
                :max="99999.999"
              />
              <span class="fs-0 ml10" :title="showUomLabel(scope.row.basicUom)">{{
                scope.row.basicUom
              }}</span>
            </div>
          </template>

          <template v-else-if="item.prop === 'effectiveDate' && scope.row.productId">
            <el-date-picker
              v-model="scope.row.effectiveDate"
              @change="effectiveDateChange(scope.row, scope.$index)"
              :picker-options="getEffectiveDateOptions(scope.row.expiryDate)"
              :format="fmtForYmd"
              value-format="timestamp"
              style="width: 98%"
              placeholder=""
              clearable
              v-if="!comDisFrom"
            ></el-date-picker>
            <template v-else>{{ parseTime(scope.row.effectiveDate, fmtForYmd) }}</template>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'expiryDate' && scope.row.productId">
            <el-date-picker
              v-model="scope.row.expiryDate"
              @change="expiryDateChange(scope.row, scope.$index)"
              :picker-options="getExpiryDateOptions(scope.row.effectiveDate)"
              :format="fmtForYmd"
              value-format="timestamp"
              style="width: 98%"
              placeholder=""
              clearable
              v-if="!comDisFrom"
            ></el-date-picker>
            <template v-else>{{ parseTime(scope.row.expiryDate, fmtForYmd) }}</template>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>

          <template v-else-if="item.prop === 'remarks'">
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
        min-width="120"
        class-name="small-padding fixed-width"
        fixed="right"
        v-if="!comDisFrom"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <div style="width: 30px">
              <i
                class="el-icon-plus pointer mr10"
                style="font-size: 20px; color: #409eff"
                :title="$t('uiBtn.add')"
                v-if="scope.row.productId && (scope.row.serviceSurchargeList || []).length < 8"
                @click="handleAddChild(scope.row)"
              ></i>
            </div>
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

    <pagination
      :saveKey="saveKey"
      :savePath="savePath"
      v-show="comTotal > 0"
      :total="comTotal"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    />

    <selectProductTableForPQ
      ref="selectProductTableForPQ"
      :formData="formData"
      @onSuccess="updateTableForPQ"
    />

    <selectProductTable ref="selectProductTable" @onSuccess="updateTable" />

    <ImportExcelDlg
      ref="importDlg"
      :importOptions="importOptions"
      :formData="formData"
      :alreadyProductIdList="tableList.map((item) => item.productId)"
      @onSuccess="updateTableList"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTableForPQ from './selectProductTableForPQ'
import selectProductTable from './selectProductTable'
import ImportExcelDlg from './importDlg.vue'
import selectExpenseItemName from '@/views/purchaseManagement/purchaseQuotation/components/selectExpenseItemName'

export default {
  components: {
    selectProductTableForPQ,
    selectProductTable,
    ImportExcelDlg,
    selectExpenseItemName
  },
  mixins: [pageMixin],
  props: {
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    serviceSurchargeListOptions: {
      type: Array,
      default() {
        return []
      }
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    allUomList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    'formData.salesPriceProductList': {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.tableList = newValue || []
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
      saveKey: '5',
      savePath: 'aslTable',
      // 总条数
      total: 0,
      /* 表格部分 */
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          width: 240,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'externalPartNo',
          label: vm.$t('PURCHASE.externalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'purchaseUomCoefficient',
          label: vm.$t('PURCHASE.ratio'),
          visible: true,
          minWidth: 140,
          colMinWidth: 160,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.contractedPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'authorizedPrice',
          label: vm.$t('PURCHASE.authorizedPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'moq',
          label: vm.$t('PURCHASE.MOQ'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'leadTime',
          label: vm.$t('PURCHASE.leadTimeDays'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'warranty',
          label: vm.$t('PURCHASE.warrantyDays'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'effectiveDate',
          label: vm.$t('PURCHASE.effectiveDate'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'expiryDate',
          label: vm.$t('PURCHASE.expiryDate'),
          visible: true,
          minWidth: 140,
          tooltip: true
        }
      ],
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      tableList: [],

      rowIdKey: 'rowTimeId',
      // rowIdKey: 'productId',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined
      },
      collapseWarningForBasicInfo: false,
      supplierList: [],
      curInternalPartNo: '',
      detailPriceList: [],
      productInfoForm: {},
      // 导入
      importOptions: {
        // 下载模板
        // downFileUrl: '/sales/salesPrice/downTemplate',
        downFileUrl: 'sales/salesPrice/downTemplateAndData',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/sales/salesPrice/checkImportData',
        // 提交导入
        importUrl: '/sales/salesPrice/importData',
        // 下载文件名
        fileName: 'Sales Price'
      },
      uomLoading: false
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    comTotal() {
      return this.tableList.length
    },
    comTableList() {
      const pageNum = this.queryParams.pageNum
      const pageSize = this.queryParams.pageSize
      // const total = this.comTotal
      const startIndex = (pageNum - 1) * pageSize
      const endIndex = pageNum * pageSize
      return this.tableList.slice(startIndex, endIndex)
    },
    purchaseUomCoefficientIsHide() {
      return !this.tableList.find((x) => x.purchaseUom !== x.basicUom)
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      const filterProps1 = []
      if (this.purchaseUomCoefficientIsHide) {
        filterProps1.push('purchaseUomCoefficient')
      }
      arr = arr.filter((x) => !filterProps1.includes(x.prop))
      return arr
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    getVisibleColumn(VisibleColumn) {
      const fixedIndex = VisibleColumn.findIndex((item) => item.fixed)
      const firstIndex = fixedIndex >= 0 ? fixedIndex : 0
      return VisibleColumn.map((item, index) => {
        if (firstIndex === index) {
          return {
            ...item,
            colWidth: item.colWidth + 30,
            isLeft: '1'
          }
        }
        return item
      })
    },
    getEffectiveDateOptions(expiryDate) {
      const options = {
        disabledDate(time) {
          if (expiryDate) {
            return time.getTime() > expiryDate
          }
        }
      }
      return options
    },
    getExpiryDateOptions(effectiveDate) {
      const options = {
        disabledDate(time) {
          if (time.getTime() < Date.now() - 8.64e7) {
            return true
          }
          if (effectiveDate) {
            return time.getTime() < effectiveDate
          }
        }
      }
      return options
    },
    effectiveDateChange(row, index) {
      this.$set(row, 'effectiveDateError', false)
      if (index === 0) {
        this.$nextTick(() => {
          if (row.effectiveDate) {
            this.tableList.forEach((i) => {
              if (i.expiryDate) {
                if (i.expiryDate >= row.effectiveDate) {
                  this.$set(i, 'effectiveDate', row.effectiveDate)
                  this.$set(i, 'effectiveDateError', false)
                }
              } else {
                this.$set(i, 'effectiveDate', row.effectiveDate)
                this.$set(i, 'effectiveDateError', false)
              }
            })
          }
        })
      }
    },
    expiryDateChange(row, index) {
      this.$set(row, 'expiryDateError', false)
      if (index === 0) {
        this.$nextTick(() => {
          if (row.expiryDate) {
            this.tableList.forEach((p) => {
              if (p.effectiveDate) {
                if (row.expiryDate >= p.effectiveDate) {
                  this.$set(p, 'expiryDate', row.expiryDate)
                  this.$set(p, 'expiryDateError', false)
                }
              } else {
                this.$set(p, 'expiryDate', row.expiryDate)
                this.$set(p, 'expiryDateError', false)
              }
            })
          }
        })
      }
    },
    getServiceSurchargeListOptions(options, row, index) {
      const findItem = this.tableList.find((item) => {
        return (item.serviceSurchargeList || []).find(
          (child) => child[this.rowIdKey] === row[this.rowIdKey]
        )
      })
      const filterList = []
      const list = (findItem || {}).serviceSurchargeList || []
      list.forEach((item, i) => {
        if (item[this.rowIdKey] !== row[this.rowIdKey] && item.expenseItemName) {
          filterList.push(item.expenseItemName)
        }
      })
      return options.filter((item) => !filterList.includes(item.expenseItemName))
    },
    productNameChange(data, row) {
      if (data.expenseItemName === row.expenseItemName) return
      this.$set(row, 'expenseItemName', data.expenseItemName)
      this.$set(row, 'includeDecimal', data.includeDecimal || '1')
      this.$set(row, 'decimalNum', data.includeDecimal === '1' ? 3 : 0)
      if (!(row.isCustom === '1' && data.isCustom === '1')) {
        this.$set(row, 'unit', data.unit)
      }
      this.$set(row, 'qtyLimit', data.qtyLimit)
      this.$set(row, 'isCustom', data.isCustom)
      this.$set(row, 'productNameError', false)
      this.$set(row, 'purchaseUomError', false)
    },
    adhocEntryChangePurchaseUom(row) {
      this.$set(row, 'purchaseUomError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    unitPriceChange(row) {
      this.$set(row, 'unitPriceError', false)
    },
    moqChange(row) {
      this.$set(row, 'moqError', false)
    },
    leadTimeChange(row, index) {
      this.$set(row, 'leadTimeError', false)
      this.$set(row, 'ROW-ERROR', false)
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && this.$resultOfBoolean(topRow.leadTime)) {
          const oldLeadTime = this.tableList.find(
            (item, index) =>
              index > 0 && this.$resultOfBoolean(item.leadTime) && item.leadTime !== topRow.leadTime
          )
          if (oldLeadTime) {
            const msg = this.$numberStr(topRow.leadTime, 0)
            this.$modal.confirm(this.$t('PURCHASE.leadTimeConfirm').replace('$1', msg)).then(() => {
              this.tableList.forEach((row1) => {
                this.$set(row1, 'leadTime', topRow.leadTime)
                this.$set(row1, 'leadTimeError', false)
                this.$set(row1, 'ROW-ERROR', false)
              })
            })
          } else {
            this.tableList.forEach((row1) => {
              this.$set(row1, 'leadTime', topRow.leadTime)
              this.$set(row1, 'leadTimeError', false)
              this.$set(row1, 'ROW-ERROR', false)
            })
          }
        }
      }
    },
    changeWarranty(index) {
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && this.$resultOfBoolean(topRow.warranty)) {
          const oldDeliveryDate = this.tableList.find(
            (item, index) =>
              index > 0 && this.$resultOfBoolean(item.warranty) && item.warranty !== topRow.warranty
          )
          if (oldDeliveryDate) {
            const msg = this.$numberStr(topRow.warranty, 0)
            this.$modal
              .confirm(this.$t('PURCHASE.warrantyDaysConfirm').replace('$1', msg))
              .then(() => {
                this.tableList.forEach((row) => {
                  this.$set(row, 'warranty', topRow.warranty)
                })
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'warranty', topRow.warranty)
            })
          }
        }
      }
    },

    errorMessage(code) {
      this.tableList.forEach((item) => {
        if (!this.$resultOfBoolean(item[code])) {
          this.$set(item, code + 'Error', true)
        }
        /* 服务费用项必填校验 */
        if (['productName', 'unitPrice', 'purchaseUom'].includes(code)) {
          const childList = item.serviceSurchargeList || []
          childList.forEach((child) => {
            if (code === 'productName') {
              if (!this.$resultOfBoolean(child.expenseItemName)) {
                this.$set(child, code + 'Error', true)
              }
            } else if (code === 'purchaseUom') {
              if (!this.$resultOfBoolean(child.unit)) {
                this.$set(child, code + 'Error', true)
              }
            } else {
              if (!this.$resultOfBoolean(child[code])) {
                this.$set(child, code + 'Error', true)
              }
            }
          })
        }
      })
    },

    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'purchaseUom':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'salesRetailPrice':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'unitPrice':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'authorizedPrice':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'externalPartNo':
            item.colMinWidth = vm.comDisFrom ? undefined : 160
            break

          case 'moq':
            item.colMinWidth = vm.comDisFrom ? undefined : 100
            break
          case 'leadTime':
            item.colMinWidth = vm.comDisFrom ? undefined : 100
            break
          case 'warranty':
            item.colMinWidth = vm.comDisFrom ? undefined : 100
            break
          case 'effectiveDate':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
            break
          case 'expiryDate':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
            break

          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    handleAddForPQ(row) {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      const tableList = JSON.parse(JSON.stringify(this.tableList))
      const alreadyProductIdList = this.tableList
        .filter((i) => !i.purchaseQuotationDetailId)
        .map((p) => p.productId)
      this.$refs.selectProductTableForPQ.handleAdd(tableList, alreadyProductIdList)
    },
    updateTableForPQ(list) {
      // if (list.length > 0) {
      const rows = JSON.parse(JSON.stringify(list))
      rows.forEach((p) => {
        p[this.rowIdKey] = p.productId
      })
      this.tableList.length = 0
      this.tableList.push(...rows)
      // this.$set(this.tableList[0], 'inventoryCost', 100)
      this.changeTableList()
      this.initDate()
      this.resetSnNum(this.tableList)
    },
    handleAddBtn() {
      const tableList = JSON.parse(JSON.stringify(this.tableList))
      const alreadyProductIdList = this.tableList
        .filter((i) => !!i.purchaseQuotationDetailId)
        .map((p) => p.productId)
      this.$refs.selectProductTable.handleAdd(tableList, alreadyProductIdList)
    },
    updateTable(list) {
      const rows = JSON.parse(JSON.stringify(list))
      rows.forEach((p) => {
        if (!p.purchaseUomCoefficient) {
          p.purchaseUomCoefficient = 1
        }
        p[this.rowIdKey] = p.productId
        if (p.isPhantom === '1' && !p.serviceSurchargeList) {
          const defaultList = this.serviceSurchargeListOptions.filter((i) => i.isDefault === '1')
          p.serviceSurchargeList = defaultList.map((item, index) => {
            return {
              rowTimeId: Date.now() + index,
              expenseItemName: item.expenseItemName, // 费用项名称
              unit: item.unit,
              unitPrice: undefined,
              includeDecimal: item.includeDecimal,
              decimalNum: item.includeDecimal === '1' ? 3 : 0,
              qtyLimit: item.qtyLimit,
              qty: 1
            }
          })
        }
      })
      this.tableList.length = 0
      this.tableList.push(...rows)
      this.resetSnNum(this.tableList)
      this.initDate()
    },
    initDate() {
      const topRow = this.tableList[0]
      if (topRow && topRow.effectiveDate) {
        this.tableList.forEach((i) => {
          if (!i.effectiveDate) {
            if (i.expiryDate) {
              if (i.expiryDate >= topRow.effectiveDate) {
                this.$set(i, 'effectiveDate', topRow.effectiveDate)
                this.$set(i, 'effectiveDateError', false)
              }
            } else {
              this.$set(i, 'effectiveDate', topRow.effectiveDate)
              this.$set(i, 'effectiveDateError', false)
            }
          }
        })
      }
      if (topRow && topRow.expiryDate) {
        this.tableList.forEach((p) => {
          if (!p.expiryDate) {
            if (p.effectiveDate) {
              if (topRow.expiryDate >= p.effectiveDate) {
                this.$set(p, 'expiryDate', topRow.expiryDate)
                this.$set(p, 'expiryDateError', false)
              }
            } else {
              this.$set(p, 'expiryDate', topRow.expiryDate)
              this.$set(p, 'expiryDateError', false)
            }
          }
        })
      }
      if (topRow && topRow.leadTime) {
        this.tableList.forEach((p) => {
          if (!p.leadTime) {
            this.$set(p, 'leadTime', topRow.leadTime)
            this.$set(p, 'leadTimeError', false)
          }
        })
      }
      if (topRow && topRow.warranty) {
        this.tableList.forEach((p) => {
          if (!p.warranty) {
            this.$set(p, 'warranty', topRow.warranty)
            this.$set(p, 'leadTimeError', false)
          }
        })
      }
    },
    handleAddChild(row) {
      if (!row.serviceSurchargeList) {
        this.$set(row, 'serviceSurchargeList', [])
      }
      if (row.serviceSurchargeList) {
        const params = {
          rowTimeId: Date.now(),
          expenseItemName: '', // 费用项名称
          unit: undefined,
          unitPrice: undefined,
          includeDecimal: undefined,
          decimalNum: undefined,
          qtyLimit: undefined
        }
        const parentStage = row.snNum
        const curStage = (row.serviceSurchargeList || []).length + 1
        params.snNum = `${parentStage}.${curStage}`
        row.serviceSurchargeList.push(params)
      }
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    handleDelRow(index, row) {
      if (row.productId) {
        const findindex = this.tableList.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        this.tableList.splice(findindex, 1)
      } else {
        this.tableList.find((item) => {
          const findChildIndex = (item.serviceSurchargeList || []).findIndex(
            (child) => child[this.rowIdKey] === row[this.rowIdKey]
          )
          if (findChildIndex !== -1) {
            item.serviceSurchargeList.splice(findChildIndex, 1)
            return true
          }
          return false
        })
      }
      this.resetSnNum(this.tableList)

      this.changeTableList()
    },
    resetSnNum(list, plantStage) {
      list.forEach((item, index) => {
        item.snNum = plantStage ? `${plantStage}.${index + 1}` : `${index + 1}`
        // 如果当前节点有子节点，递归查找
        if (item.serviceSurchargeList && item.serviceSurchargeList.length > 0) {
          this.resetSnNum(item.serviceSurchargeList, item.snNum)
        }
      })
    },
    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        } else if (row.updateType === '3') {
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
      if (
        this.tableList.find((item) => !item[column.property] && item[column.property + 'Error'])
      ) {
        cellClass = 'is-required-table-cell'
      }
      return cellClass
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
    },
    updateTableList(e) {
      const { data } = e
      const newTableList = data
      this.tableList = newTableList
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    }
  }
}
</script>

<style lang="scss" scoped>
.tip-list-box {
  max-height: 500px;
  // overflow-x: hidden;
  // overflow-y: scroll;
  overflow: hidden auto;

  .tip-list-item:not(:last-child) {
    margin-bottom: 20px;
    line-height: 20px;
    vertical-align: middle;
  }

  .tip-list-title {
    display: inline-block;
    // min-width: 120px;
    text-align: left;
  }
}
</style>
