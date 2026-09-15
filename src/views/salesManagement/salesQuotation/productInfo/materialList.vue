<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          @click="handleAddBtn"
          v-if="addBtnShow"
          :disabled="!businessPartnerId || !formData.currencyId"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="addAdhocEntryAuth">
        <el-button
          @click="handleSddAdhocEntry"
          :disabled="!businessPartnerId || !formData.currencyId"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('menu.addAdhocEntry') }}</el-button
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
      ref="tables"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      :data="tableList"
      :row-key="rowIdKey"
      lazy
      :default-expand-all="true"
      :tree-props="{
        children: 'childProjectTemplateContentList',
        hasChildren: 'hasChildren'
      }"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
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
          <span v-if="[].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="scope.row.bomAccessoriesType !== '2'">
            <template v-if="item.prop === 'productType'">
              <!-- <span v-if="scope.row.productType === '1'">{{ $t('PRODUCT.product') }}</span> -->
              <!-- <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
              <span>{{ selectDictLabel(dict.type.product_type, scope.row.productType) }}</span>
            </template>
            <template v-else-if="item.prop === 'unitCost'">
              <span>{{ $numberStr(scope.row[item.prop], 2) }}</span>
            </template>
            <template v-else-if="item.prop === 'totalCost'">{{
              $numberStr(scope.row[item.prop], 2)
            }}</template>
            <template v-else-if="item.prop === 'referenceAmount'">{{
              $numberStr(scope.row[item.prop], 2)
            }}</template>
            <template v-else-if="item.prop === 'unitPrice'">
              <div class="flexSb">
                <div class="flow1" :title="$numberStr(scope.row[item.prop], 2)">
                  {{ $numberStr(scope.row[item.prop], 2) }}
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
            <template v-else-if="item.prop === 'lineTotal'">{{
              $numberStr(scope.row[item.prop], 2)
            }}</template>
            <template v-else-if="item.prop === 'salesProfit'">{{
              $numberStr(scope.row[item.prop], 2)
            }}</template>
            <template v-else-if="item.prop === 'qty'">
              {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
            </template>
            <template v-else-if="item.prop === 'description'">
              <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else>
            <template v-if="item.prop === 'productType'">
              <!-- <span v-if="scope.row.productType === '1'">{{ $t('PRODUCT.product') }}</span> -->
              <!-- <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
              <span>{{ selectDictLabel(dict.type.product_type, scope.row.productType) }}</span>
            </template>
            <template v-else-if="item.prop === 'description'">
              <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <selectProductTable :formData="formData" ref="selectProductTable" @onSuccess="updateTable" />

    <priceControlNoticeDlg
      ref="priceControlNoticeDlg"
      :formData="formData"
      pageType="salesQuotation"
      @updatePriceControlNotice="updatePriceControlNotice"
      @closePriceControlNotice="closePriceControlNotice"
    />

    <priceControlNoticeDlgNoSubmit
      ref="priceControlNoticeDlgNoSubmit"
      :formData="formData"
      @closePriceControlNotice="closePriceControlNotice"
    />

    <totalPriceControlNoticeDlgNoSubmit
      ref="totalPriceControlNoticeDlgNoSubmit"
      :formData="formData"
      @closePriceControlNotice="closePriceControlNotice"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from '../components/selectProductTable'
import { queryAllUomList } from '@/api/system/uom'
import {
  calculateOneDetail,
  queryCanSelectPPLListNoPage,
  calculate
} from '@/api/salesManagement/salesQuotation'
import priceControlNoticeDlg from '@/views/salesManagement/salesInquiry/productInfo/priceControlNoticeDlg'
import priceControlNoticeDlgNoSubmit from '@/views/salesManagement/salesInquiry/productInfo/priceControlNoticeDlgNoSubmit'
import totalPriceControlNoticeDlgNoSubmit from '@/views/salesManagement/salesInquiry/productInfo/totalPriceControlNoticeDlgNoSubmit'

export default {
  mixins: [pageMixin],
  dicts: ['sales_inquiry_product_type', 'product_type'],
  components: {
    selectProductTable,
    priceControlNoticeDlg,
    priceControlNoticeDlgNoSubmit,
    totalPriceControlNoticeDlgNoSubmit
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
    // 'formData.salesQuotationProjectContentList': {
    'formData.salesQuotationProductList': {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        console.log(newVal, '===')
        if (newVal && newVal.length > 0) {
          this.tableList = newVal || []
          this.tableList = this.traverseTree(this.tableList)
        } else {
          this.tableList = []
        }
        if (this.tableListCopy.length <= 0) {
          this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
        }
        this.tableList.forEach((item) => {
          this.$set(item, 'exchangeRateDesc', this.formData.exchangeRateDesc)
        })
        this.changeTableList()
      }
    }
    // 'formData.salesQuotationProjectList': {
    //   deep: true,
    //   immediate: true,
    //   handler: function (newVal) {
    //     if (newVal && newVal.length > 0) {
    //       const { projectTemplateContentList } = newVal[0]
    //       this.tableList = projectTemplateContentList || []
    //       this.tableList = this.traverseTree(this.tableList)
    //     } else {
    //       this.tableList = []
    //     }
    //     this.changeTableList()
    //   }
    // }
    // comDisFrom: {
    //   immediate: true,
    //   handler: function (params) {
    //     this.initColumnWidth()
    //   }
    // },
    // 'formData.documentType': {
    //   immediate: true,
    //   handler: function (params) {
    //     this.initColumnWidth()
    //   }
    // }
  },
  data() {
    const vm = this
    return {
      saveKey: '50',
      savePath: 'salesMTable',
      activeName: '1',
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70,
          fixed: true
        },
        {
          prop: 'productType',
          label: vm.$t('PRODUCT.productClass'),
          visible: true,
          width: 150,
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
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('PRODUCT.qty'),
          visible: true,
          minWidth: 200,
          padding: 50,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('SALES.unitPrice'),
          visible: true,
          minWidth: 200,
          padding: 70,
          align: 'right',
          tooltip: false
        },
        {
          prop: 'lineTotal',
          label: vm.$t('SALES.subTotal1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          align: 'right',
          tooltip: true
        },
        {
          prop: 'exchangeRateDesc',
          label: vm.$t('menu.exchangeRate'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'salesProfit',
          label: vm.$t('SALES.salesProfit'),
          visible: true,
          minWidth: 200,
          padding: 60,
          align: 'right',
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      totalForm: {},
      tableList: [],
      tableListCopy: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'fullId',
      reQuoteLoading: false,
      popoverData: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: [],
      allUomList: []
    }
  },
  computed: {
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      if (!this.salesCostAuth) {
        arr = arr.filter((item) => {
          const is = item.prop !== 'salesCost' && item.prop !== 'salesProfit'
          return is
        })
      }
      if (this.formData.salesQuotationType === 'Project') {
        arr = arr.filter((item) => {
          const is = item.prop !== 'warranty' && item.prop !== 'deliveryDateForDay'
          return is
        })
      }
      return arr
    },
    salesCostAuth() {
      return this.checkPermi(['salesManagement:salesQuotation:salesCostProfit'])
    },
    comSalesCost() {
      const salesCostList = this.tableList.map((item) => item.salesCost)
      let total = 0
      salesCostList.forEach((cost) => {
        if (cost) {
          total += cost
        }
      })
      return total
    },
    comSalesProfit() {
      const salesProfitList = this.tableList.map((item) => item.salesProfit)
      let total = 0
      salesProfitList.forEach((cost) => {
        if (cost) {
          total += cost
        }
      })
      return total
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    isServiceOrderCreated() {
      return this.formData.documentType === 'ServiceOrder'
    },
    isSelfCreated() {
      return this.formData.documentType === 'SelfCreated'
    },
    addBtnShow() {
      /* 项目类型的销售需求, 没有新增按钮 */
      if (this.comDisFrom) {
        return false
      }
      if (this.isSelfCreated) {
        return true
      }
      return false
    },
    addAdhocEntryAuth() {
      if (this.comDisFrom) {
        return false
      }
      if (this.isSelfCreated) {
        return this.checkPermi(['salesManagement:salesQuotation:addAdhocEntry'])
      }
      return false
    },
    freeOfChargeProductAuth() {
      return this.checkPermi(['salesManagement:salesQuotation:freeOfChargeProduct'])
    },
    disInQuotation() {
      return this.formData.salesQuotationStatus === '4'
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.createdInitTimer = Date.now()
    // this.queryAllUomList()
  },
  activated() {
    // if (Date.now() - this.createdInitTimer < 1000) return
    // this.queryAllUomList()
  },
  methods: {
    traverseTree(nodes, parentId = '') {
      return nodes.map((node) => {
        // 使用父级ID和当前节点ID拼接生成fullId
        let fullId = parentId ? `${parentId}-${node.bomAccessoriesId}` : node.bomAccessoriesId
        if (!parentId && node.bomAccessoriesType === '2') {
          fullId = +new Date()
        }
        // 如果当前节点有子节点，递归调用traverseTree处理子节点
        const childProjectTemplateContentList = node.childProjectTemplateContentList
          ? this.traverseTree(node.childProjectTemplateContentList, fullId)
          : []
        // 返回新的节点对象，包含原有属性及新的fullId属性
        return {
          ...node,
          fullId,
          childProjectTemplateContentList: childProjectTemplateContentList.length
            ? childProjectTemplateContentList
            : undefined // 移除空数组的children属性
        }
      })
    },
    queryAllUomList() {
      queryAllUomList().then((res) => {
        this.allUomList = res.data || []
      })
    },
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'salesQuotationProductType':
            item.colMinWidth =
              !vm.comDisFrom && (vm.isServiceOrderCreated || vm.isSelfCreated) ? 160 : undefined
            break
          case 'salesPartNo':
            item.colMinWidth = !vm.comDisFrom && vm.isServiceOrderCreated ? 120 : undefined
            break
          case 'priceType':
            item.colMinWidth =
              !vm.comDisFrom && (vm.isServiceOrderCreated || vm.isSelfCreated) ? 160 : undefined
            break
          case 'unitPrice':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'qty':
            item.colMinWidth = !vm.comDisFrom && vm.isSelfCreated ? 120 : undefined
            break
          case 'partNo':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'brand':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'uom':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'uomCoefficient':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'discount':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'warranty':
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
    salesInquiryProductTypeChange(row) {
      if (row.salesQuotationProductType === '2') {
        this.$set(row, 'taxAmount', undefined)
        this.$set(row, 'taxAmountProcess', undefined)
        this.$set(row, 'taxNo', undefined)
        this.$set(row, 'discount', undefined)
      } else {
        this.$set(row, 'discount', undefined)
      }
      this.getLineTotal(row)
    },
    salesPartNoChange(selectRow, row) {
      this.$set(row, 'salesPriceStrategyDetails', selectRow.salesPriceStrategyDetailList || [])
      this.$set(row, 'salesPartNo', selectRow.salesPartNo)
      this.$set(row, 'salesPartId', selectRow.salesPartId)
      const defaultRow = row.salesPriceStrategyDetails.find((item) => item.isDefault) || {}
      this.$set(row, 'priceType', defaultRow.priceType)
      this.$set(row, 'priceTypeShowStr', defaultRow.priceTypeShowStr)
      this.$set(row, 'unitPrice', defaultRow.canUseUnitPrice)
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

    priceTypeChange(selectRow, row) {
      this.$set(row, 'priceType', selectRow.priceType)
      this.$set(row, 'priceTypeShowStr', selectRow.priceTypeShowStr)
      /* costOfGoods 与库存成本取max */
      this.$set(row, 'unitPrice', selectRow.canUseUnitPrice)
      this.getLineTotal(row)
    },

    rowUomChange(row) {
      const selectItem = row.uomDataList.find((item) => item.uomName === row.uom)
      this.$set(row, 'uomCoefficient', selectItem.uomCoefficient)
      this.queryRowTaxAmount(row)
    },
    uomCoefficientChange(row) {
      this.queryRowTaxAmount(row)
    },

    qtyChange(row) {
      this.getLineTotal(row)
    },
    discountChange(row) {
      this.getLineTotal(row, 'isCalculate')
    },
    getLineTotal(row, type) {
      this.$nextTick(() => {
        if (this.$resultOfBoolean(row.qty) && this.$resultOfBoolean(row.unitPrice)) {
          const lineTotal = row.unitPrice * row.qty
          if (row.salesQuotationProductType === '2') {
            row.discount = lineTotal
          } else if (row.discount > lineTotal) {
            row.discount = lineTotal
          }
          this.$set(row, 'lineTotal', lineTotal - (row.discount || 0))
        } else {
          this.$set(row, 'lineTotal', undefined)
        }
        this.queryRowTaxAmount(row, type)
      })
    },
    queryRowTaxAmount(row, type) {
      //  && row.uomCoefficient
      if (this.$resultOfBoolean(row.qty) && this.$resultOfBoolean(row.unitPrice)) {
        const timer = Date.now()
        row.queryTime = timer
        row.currencyId = this.formData.currencyId

        const params = {
          ...this.totalForm,
          salesQuotationProductList: this.totalForm.salesQuotationProductList.filter(
            (x) => this.$resultOfBoolean(x.qty) && this.$resultOfBoolean(x.unitPrice)
          ),
          salesQuotationServiceList: this.totalForm.salesQuotationServiceList.filter(
            (x) => this.$resultOfBoolean(x.qty) && this.$resultOfBoolean(x.unitPrice)
          )
        }

        calculate(params)
          .then((res) => {
            if (row.queryTime === timer) {
              const { salesQuotationProductList } = res.data
              const data = salesQuotationProductList.find((x) => x.productId === row.productId)
              // isNeedTips 1:最大  2:最小
              const { isNeedTips } = data
              this.$set(row, 'unitPrice', data.unitPrice)
              this.$set(row, 'lineTotal', data.lineTotal)
              this.$set(row, 'taxAmount', data.taxAmount)
              this.$set(row, 'taxAmountProcess', data.taxAmountProcess)
              this.$set(row, 'salesCost', data.salesCost)
              this.$set(row, 'salesProfit', data.salesProfit)
              this.$set(row, 'pplUnitPrice', data.pplUnitPrice)

              const totalForm = JSON.parse(JSON.stringify(res.data))
              // (type === 'isCalculate' || !this.checkPermi(['salesManagement:salesQuotation:AllowSellingBelowCost']))
              if (isNeedTips && ['1', '2'].indexOf(isNeedTips) !== -1 && type === 'isCalculate') {
                this.$refs.priceControlNoticeDlg.open(data, row, totalForm)
              } else {
                this.$set(row, 'isNeedTips', data.isNeedTips)
                this.$set(row, 'maxPrice', data.maxPrice)
                this.$set(row, 'minPrice', data.minPrice)
                this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
                this.$emit('updatePriceControlNotice', totalForm, 'totalForm')
              }
              this.changeTableList()
            }
            // this.calculateOneDetailRow(row, type)
          })
          .catch(() => {
            this.closePriceControlNotice(row)
          })
      } else {
        this.$set(row, 'discount', undefined)
        this.$set(row, 'lineTotal', undefined)
        this.$set(row, 'taxAmount', undefined)
        this.$set(row, 'taxAmountProcess', undefined)
        this.$set(row, 'salesCost', undefined)
        this.$set(row, 'salesProfit', undefined)
      }
    },
    calculateOneDetailRow(row, type) {
      const timer = Date.now()
      row.queryTime = timer

      calculateOneDetail(row).then((res) => {
        if (row.queryTime === timer) {
          const data = res.data || {}
          // isNeedTips 1:最大  2:最小
          const { isNeedTips } = data
          this.$set(row, 'unitPrice', data.unitPrice)
          this.$set(row, 'lineTotal', data.lineTotal)
          this.$set(row, 'taxAmount', data.taxAmount)
          this.$set(row, 'taxAmountProcess', data.taxAmountProcess)
          this.$set(row, 'salesCost', data.salesCost)
          this.$set(row, 'salesProfit', data.salesProfit)
          this.$set(row, 'pplUnitPrice', data.pplUnitPrice)

          if (
            isNeedTips &&
            ['1', '2'].indexOf(isNeedTips) !== -1 &&
            (type === 'isCalculate' ||
              !this.checkPermi(['salesManagement:salesQuotation:AllowSellingBelowCost']))
          ) {
            this.$refs.priceControlNoticeDlg.open(data, row)
          } else {
            this.$set(row, 'isNeedTips', data.isNeedTips)
            this.$set(row, 'maxPrice', data.maxPrice)
            this.$set(row, 'minPrice', data.minPrice)
            this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
          }
          this.changeTableList()
        }
      })
    },
    updatePriceControlNotice(data, row, totalForm) {
      this.$set(row, 'isNeedTips', data.isNeedTips)
      this.$set(row, 'maxPrice', data.maxPrice)
      this.$set(row, 'minPrice', data.minPrice)
      this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
      // 更新外层总金额
      this.$emit('updatePriceControlNotice', totalForm, 'totalForm')
    },
    closePriceControlNotice(row) {
      const list = this.tableListCopy.filter((x) => x.productId === row.productId)
      if (list.length > 0) {
        const oldRow = list[0]
        if (!oldRow.discount) {
          this.$set(oldRow, 'discount', undefined)
        }
        if (!oldRow.discountPer) {
          this.$set(oldRow, 'discountPer', undefined)
        }
        Object.keys(oldRow).forEach((key) => {
          this.$set(row, key, oldRow[key])
        })
      }
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
      const expectedDeliveryDateList2 = this.formData.salesQuotationServiceList.map(
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

    handleSddAdhocEntry() {
      this.tableList.push({
        isAdhocEntry: '1',
        salesQuotationProductType: '1',
        includeDecimal: '1',
        decimalNum: 3
      })
    },
    handleAddBtn() {
      const alreadySelectIdList = this.tableList
        .filter((item) => item[this.rowIdKey])
        .map((item) => item[this.rowIdKey])
      this.$refs.selectProductTable.handleAdd(alreadySelectIdList)
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        rows.forEach((item) => {
          item.salesQuotationProductType = '1'
          item.remarks = ''
        })
        this.tableList.push(...rows)
        this.changeTableList()
      }
    },
    changeTableList() {
      function flattenCascadingData(data) {
        const result = []
        ;(function flatten(nodes) {
          nodes.forEach((node) => {
            result.push(node)
            if (
              node.childProjectTemplateContentList &&
              node.childProjectTemplateContentList.length
            ) {
              flatten(node.childProjectTemplateContentList)
            }
          })
        })(data)
        return result
      }
      const flattenList = flattenCascadingData(this.tableList)
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, flattenList)
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
