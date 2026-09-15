<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleAddBtn"
          v-if="addBtnShow"
          :disabled="!businessPartnerId || !formData.currencyId"
          :loading="formData.tableLoading"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="addCustomBtnShow">
        <el-button
          @click="handleAddCustom"
          :disabled="!businessPartnerId || !formData.currencyId"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('PRODUCT.addCustom') }}</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="reQuoteBtnShow && !comDisFrom">
        <el-button
          :disabled="selected.length <= 0"
          :loading="reQuoteLoading"
          @click="handleReQuote"
          type="primary"
          size="mini"
          >{{ $t('menu.reQuote') }}</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="returnBtnShow">
        <el-button @click="handleReturn" type="primary" size="mini">{{
          $t('menu.return')
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
      <!-- <div class="footer-content">
        <div>{{ $t('SALES.productQTY') }} / {{ $t('SALES.quoted') }}</div>
        ：
        <div>
          {{ tableList.length }} / {{ tableList.filter((o) => o.purchaseQuotationNo).length }}
        </div>
      </div> -->
      <div class="footer-content">
        <el-form
          label-width="180px"
          class="mr20"
          v-if="['Trading', 'Service'].indexOf(totalForm.salesInquiryType) !== -1"
        >
          <el-form-item :label="`${$t('SALES.priceTbd')}`" style="margin-bottom: 0">
            <el-switch
              v-model="totalForm.priceTbd"
              active-value="1"
              inactive-value="0"
              @change="priceTbdChange"
              :disabled="comDisFrom"
            ></el-switch>
            <el-tooltip placement="top">
              <div slot="content">
                <div v-html="$t('switchTip.priceTbdTip')"></div>
              </div>
              <i class="el-icon-info ml10"></i>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
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
      v-table-tab
    >
      <el-table-column
        v-if="reQuoteBtnShow"
        :selectable="selectable"
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
        v-for="item in comVisibleColumn"
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
            v-if="
              [
                disInQuotation ? 'purchaseQuotationNo' : '',
                'qty',
                'unitPrice',
                'deliveryDateForDay'
              ].includes(item.prop)
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'purchaseQuotationNo' && !scope.row.isTotal">
            <el-select
              style="width: 98%"
              v-model="scope.row.purchaseQuotationNo"
              placeholder=""
              v-if="!comDisFrom && disInQuotation && scope.row.serviceType === 'External'"
              size="mini"
              clearable
              @change="purchaseQuotationNoChange(scope.row)"
              :loading="scope.row.PQNoLoading"
              @visible-change="
                (value) => {
                  PQNoVisible(value, scope.row)
                }
              "
            >
              <el-option
                v-for="item in scope.row.pplList || []"
                :key="item.purchaseQuotationNo"
                :label="item.purchaseQuotationNo"
                :value="item.purchaseQuotationNo"
              >
              </el-option>
            </el-select>
            <template v-else>{{ scope.row.purchaseQuotationNo }}</template>
          </template>
          <template v-else-if="item.prop === 'productName'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else-if="item.prop === 'dateQuoted'">
            {{ parseTime(scope.row.dateQuoted, fmtForYmdhms) }}
          </template>
          <template v-else-if="item.prop === 'qty' && !scope.row.isTotal">
            <template v-if="!comDisFrom && !disInQuotation">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                v-model="scope.row.qty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999"
                @change="qtyChange(scope.row)"
              />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'unitPrice' && !scope.row.isTotal">
            <div class="flexSb">
              <div class="flow1">
                <el-input-number
                  v-thousandSplit="{ precision: 2 }"
                  style="width: 98%"
                  v-model="scope.row.unitPrice"
                  controls-position="right"
                  :precision="2"
                  :min="0"
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
          <template v-else-if="item.prop === 'discount' && !scope.row.isTotal">
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

          <template v-else-if="item.prop === 'deliveryDateForDay' && !scope.row.isTotal">
            <el-input-number
              v-thousandSplit="{ precision: 0 }"
              v-if="!comDisFrom"
              style="width: 98%"
              v-model="scope.row.deliveryDateForDay"
              controls-position="right"
              :precision="0"
              :min="1"
              :max="999"
              @change="changeExpectedDeliveryDate(scope.$index)"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>

          <template v-else-if="item.prop === 'remarks' && !scope.row.isTotal">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
            />
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
              class="el-icon-edit pointer mr10"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.edit')"
              v-if="scope.row.isTemp === '1'"
              @click="handleEditRow(scope.row)"
            ></i>
            <i
              v-if="!scope.row.isTotal"
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

    <addCustomDlg ref="addCustomDlg" :comDisFrom="comDisFrom" @onSuccess="updateCustomTable" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectServiceProductTable from '../components/selectServiceProductTable'
import { queryCanSelectPPLListNoPage, reQuote } from '@/api/salesManagement/salesInquiry'
import addCustomDlg from '@/views/salesManagement/serviceOrder/components/addCustomDlg.vue'

export default {
  mixins: [pageMixin],
  dicts: [],
  components: {
    selectServiceProductTable,
    addCustomDlg
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
    'formData.salesInquiryServiceList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.salesInquiryServiceList
        this.tableList.forEach((item) => {
          item.isOldSelect = '1'
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
      savePath: 'salesMTable',
      activeName: '1',
      columns: [
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
          tooltip: false
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'purchaseQuotationNo',
          label: vm.$t('SALES.purchaseQuotationNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'dateQuoted',
          label: vm.$t('SALES.dateQuoted'),
          visible: true,
          minWidth: 160,
          fixedWidth: 160,
          tooltip: true
        },
        {
          prop: 'pplUnitPrice',
          label: vm.$t('SALES.purchasePrice'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right',
          padding: 50
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
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },

        {
          prop: 'deliveryDateForDay',
          label: vm.$t('SALES.leadTimeDays2'),
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
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      if (this.formData.salesInquiryType === 'Project') {
        arr = arr.filter((item) => {
          const is = item.prop !== 'deliveryDateForDay'
          return is
        })
      }
      if (this.formData.salesInquiryStatus === '1' || !this.formData.salesInquiryStatus) {
        arr = arr.filter((item) => {
          const is = !['unitPrice', 'discount', 'lineTotal'].includes(item.prop)
          return is
        })
      }
      return arr
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    addBtnShow() {
      /* 项目类型的销售需求, 没有新增按钮 */
      if (this.comDisFrom) {
        return false
      }
      if (this.formData.salesInquiryType === 'Project') {
        return false
      }
      if (this.disInQuotation) {
        return false
      }
      return true
    },
    addCustomBtnShow() {
      /* 项目类型的销售需求, 没有新增按钮 */
      if (this.comDisFrom) {
        return false
      }
      if (this.formData.salesInquiryType === 'Project') {
        return false
      }
      if (this.disInQuotation) {
        return false
      }
      return true
    },
    reQuoteBtnShow() {
      if (!this.checkPermi(['salesManagement:salesInquiry:reQuote'])) {
        return false
      }
      return this.disInQuotation
    },
    returnBtnShow() {
      if (!this.checkPermi(['salesManagement:salesInquiry:return'])) {
        return false
      }
      const buttonAuthMsg = this.formData.buttonAuthMsg || {}
      return buttonAuthMsg.isCanReturnProjectTask === '1'
    },
    disInQuotation() {
      return this.formData.salesInquiryStatus === '4'
    },
    disType() {
      let dis = false
      if (
        this.formData.salesInquiryStatus === '4' &&
        this.formData.salesInquiryType !== 'Project'
      ) {
        dis = true
      }
      return dis
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    priceTbdChange() {
      this.$nextTick(() => {
        this.$set(this.totalForm, 'isUpdateAmount', '0')
        this.$emit('handleCalculate')
      })
    },
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'purchaseQuotationNo':
            item.colMinWidth = !vm.comDisFrom && vm.disInQuotation ? 120 : undefined
            break
          case 'qty':
            item.colMinWidth = vm.comDisFrom || vm.disInQuotation ? undefined : 120
            break
          case 'unitPrice':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'discount':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'deliveryDateForDay':
            item.colMinWidth = vm.comDisFrom ? undefined : 160
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

    PQNoVisible(value, row) {
      const vm = this
      if (value) {
        const params = {
          currencyId: vm.formData.currencyId,
          productId: row.productId
        }
        if (!params.currencyId) {
          return
        }
        this.$set(row, 'PQNoLoading', true)
        queryCanSelectPPLListNoPage(params)
          .then((res) => {
            const list = res.data || []
            this.$set(row, 'pplList', list)
            this.$set(row, 'PQNoLoading', false)
          })
          .catch((err) => {
            this.$set(row, 'pplList', [])
            this.$set(row, 'PQNoLoading', false)
            window.console.error(err)
          })
      }
    },
    purchaseQuotationNoChange(row) {
      const selectRow =
        (row.pplList || []).find((item) => item.purchaseQuotationNo === row.purchaseQuotationNo) ||
        {}
      this.$set(row, 'purchaseQuotationNo', selectRow.purchaseQuotationNo)
      this.$set(row, 'purchaseQuotationId', selectRow.purchaseQuotationId)
      this.$set(row, 'purchaseQuotationUnitPrice', selectRow.purchaseQuotationUnitPrice)
      this.$set(row, 'pplUnitPrice', selectRow.pplUnitPrice)
      this.$set(row, 'purchasePriceId', selectRow.purchasePriceId)
      this.$set(row, 'dateQuoted', selectRow.dateQuoted)
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
    changeExpectedDeliveryDate(index) {
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.deliveryDateForDay) {
          const oldExpectedDeliveryDate = this.tableList.find(
            (item, index) => index > 0 && item.deliveryDateForDay
          )
          if (oldExpectedDeliveryDate) {
            const msg = topRow.deliveryDateForDay
            this.$modal
              .confirm(this.$t('SALES.expectedDateForDayConfirm').replace('$1', msg))
              .then(() => {
                this.tableList.forEach((row) => {
                  this.$set(row, 'deliveryDateForDay', topRow.deliveryDateForDay)
                })
                this.setMaxExpectedDeliveryDate()
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'deliveryDateForDay', topRow.deliveryDateForDay)
            })
          }
        }
      }
      this.setMaxExpectedDeliveryDate()
    },
    setMaxExpectedDeliveryDate() {
      const expectedDeliveryDateList1 = this.tableList.map((item) => item.deliveryDateForDay || 0)
      const expectedDeliveryDateList2 = this.formData.salesInquiryProductList.map(
        (item) => item.deliveryDateForDay || 0
      )
      const max = Math.max(0, ...expectedDeliveryDateList1, ...expectedDeliveryDateList2)
      if (max > 0) {
        this.$set(this.totalForm, 'deliveryDateForDay', max)
        this.$emit('deliveryDateForDayChange')
      } else {
        if (this.tableList.length > 0) {
          this.$set(this.totalForm, 'deliveryDateForDay', undefined)
        } else {
          this.$set(this.totalForm, 'deliveryDateForDay', undefined)
        }
      }
    },
    handleAddBtn() {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      const tableList = JSON.parse(JSON.stringify(this.tableList))
      this.$refs.selectServiceProductTable.handleAdd(tableList)
    },
    handleAddCustom() {
      this.$refs.addCustomDlg.handleAdd()
    },
    handleEditRow(row) {
      this.$refs.addCustomDlg.handleEdit(row)
    },
    updateCustomTable(row) {
      if (row) {
        const newRow = JSON.parse(JSON.stringify(row))
        const findIndex = this.tableList.findIndex((item) => item.customId === row.customId)
        if (findIndex !== -1) {
          this.$set(this.tableList, findIndex, newRow)
          this.qtyChange(newRow)
        } else {
          this.tableList.push(newRow)
        }
        this.changeTableList()
      }
    },
    updateTable(list) {
      // if (list.length > 0) {
      const rows = JSON.parse(JSON.stringify(list))
      rows.forEach((item) => {
        if (item.isOldSelect !== '1') {
          this.$set(item, 'discount', undefined)
          item.remarks = ''
        }
        item.isOldSelect = '1'
      })
      this.tableList.length = 0
      this.tableList.push(...rows)
      this.changeTableList()
      // }
    },
    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.comTableList)
      })
    },
    // 选中多个重新报价
    handleReQuote() {
      this.$modal
        .confirm(this.$t('SALES.reQuoteConfirm'))
        .then(() => {
          this.reQuoteLoading = true
          return reQuote({
            salesInquiryId: this.formData.salesInquiryId,
            batchIdList: this.selected.map((item) => item.salesInquiryServiceId)
          })
        })
        .then((response) => {
          this.reQuoteLoading = false
          this.$modal.msgSuccess(this.$t('SALES.reQuoteSuccess'))
          this.selected = []
          this.$refs.tables.clearSelection()
        })
        .catch(() => {
          this.reQuoteLoading = false
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
        } else if (row.updateType === '3') {
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
