<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.product')"
    :visible.sync="visible"
    width="1100px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-row v-if="false">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('PURCHASE.purchaseRequisition')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('PURCHASE.productList')" name="2"></el-tab-pane>
      </el-tabs>
    </el-row>
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :showMenu="false"
      v-show="showSearch"
    >
      <right-toolbar
        :saveKey="activeName"
        :savePath="savePath"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columns="configCurColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </search-form>

    <div class="mt10">
      <el-table
        border
        ref="tables"
        :data="tableList"
        v-loading="loading"
        :max-height="tableMaxHeight"
        @sort-change="handleSortChange"
        @row-click="handleRowClick"
        :row-class-name="'pointer'"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
        :header-cell-class-name="cellClass"
        class="table"
      >
        <el-table-column type="selection" width="55" :selectable="selectable" align="center" />
        <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in visibleCurColumns"
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
            <template v-if="item.prop === 'documentNo'">
              <el-select
                style="width: 98%"
                v-model="scope.row.documentNo"
                placeholder=""
                v-if="selectIds.includes(scope.row[rowIdKey]) && formData.createType !== '2'"
                size="mini"
                @change="documentNoChange(scope.row)"
              >
                <el-option
                  v-for="item in scope.row.pplList || []"
                  :key="item.documentNo"
                  :label="item.documentNo"
                  :value="item.documentNo"
                >
                </el-option>
              </el-select>
              <template v-else>{{
                formData.createType === '2' ? 'ASL' : scope.row.documentNo
              }}</template>
            </template>
            <template v-else-if="item.prop === 'purchaseQty'">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                size="mini"
                v-if="selectIds.includes(scope.row[rowIdKey]) && scope.row.isCustomProduct !== '1'"
                v-model="scope.row.purchaseQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999999999"
                @change="purchaseQtyChange(scope.row)"
              />
              <template v-else>{{
                $numberStr(scope.row[item.prop], scope.row.decimalNum)
              }}</template>
            </template>
            <template v-else-if="item.prop === 'productType'">
              <!-- <span v-if="scope.row.productType === '1'">{{ $t('PURCHASE.product') }}</span> -->
              <!-- <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
              <span>{{ selectDictLabel(dict.type.product_type, scope.row.productType) }}</span>
            </template>
            <template v-else-if="item.prop === 'unitPrice'">
              <template>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</template>
            </template>
            <template v-else-if="item.prop === 'lineTotal'">
              <template>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</template>
            </template>
            <template v-else-if="item.prop === 'productName'">
              <commonProductAndPicture :row="scope.row" />
            </template>
            <template v-else-if="item.prop === 'picture'">
              <div v-if="scope.row.defaultImageUrl" style="line-height: 0; height: 30px">
                <el-image
                  style="height: 100%"
                  :src="scope.row.defaultImageUrl"
                  :preview-src-list="[scope.row.defaultImageUrl]"
                />
              </div>
            </template>
            <template v-else-if="item.prop === 'prBalanceQty'">
              <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
            </template>
            <template v-else-if="item.prop === 'prBalancePurchaseQty'">
              <el-tooltip
                :content="`${scope.row.prBalanceBasicQty} ${scope.row.basicUom} ÷ ${
                  scope.row.purchaseUomCoefficient
                } = ${scope.row[item.prop]} ${scope.row.purchaseUom}`"
                :disabled="!scope.row.purchaseQty"
                placement="top"
                effect="light"
              >
                <div class="ellipsis-text">
                  <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
                </div>
              </el-tooltip>
            </template>
            <template v-else-if="item.prop === 'pqQty'">
              <el-tooltip
                :content="`1 ${scope.row.purchaseUom} = ${scope.row.purchaseUomCoefficient} ${scope.row.basicUom}`"
                placement="top"
                effect="light"
              >
                <div class="ellipsis-text">
                  <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
                </div>
              </el-tooltip>
            </template>

            <template v-else-if="item.prop === 'qtyOnHand'">
              <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

              <template v-else>{{
                $numberStr(scope.row[item.prop], scope.row.decimalNum)
              }}</template>
            </template>
            <template v-else-if="item.prop === 'availableQty'">
              <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

              <template v-else>{{
                $numberStr(scope.row[item.prop], scope.row.decimalNum)
              }}</template>
            </template>
            <template v-else-if="item.prop === 'reservedQty'">
              <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

              <template v-else>{{
                $numberStr(scope.row[item.prop], scope.row.decimalNum)
              }}</template>
            </template>
            <template v-else-if="item.prop === 'inTransitQty'">
              <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

              <template v-else>{{
                $numberStr(scope.row[item.prop], scope.row.decimalNum)
              }}</template>
            </template>
            <template v-else-if="item.prop === 'prUom'">
              <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :selectedNum="
          $$getFilteredSelectedNum(
            filteredSelectedList,
            tableList,
            activeName === '1' ? selectList1 : selectList2,
            rowIdKey
          )
        "
        :saveKey="saveKey"
        :savePath="savePath"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button
        type="primary"
        :loading="btnLoading"
        :disabled="selectList1.length <= 0"
        @click="submit"
        >{{ $t('uiBtn.save') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryPOCanSelectProductListForProduct,
  queryPOCanSelectProductListForPR,
  querySearchListForPOCanSelectProductListForPR,
  mergePOSelectProductList,
  queryASLCanSelectProductList,
  queryASLCanSelectProductListForSearch,
  mergeASLSelectProductList,
  queryASLCanSelectProductListForEGR,
  mergeASLSelectProductListForEGR
} from '@/api/purchaseManagement/purchaseOrder'
export default {
  directives: {
    // transferDom
  },
  dicts: ['product_type'],
  mixins: [pageMixin],
  props: {
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    businessPartnerId: {
      type: String,
      default: ''
    },
    purchaseQuotationId: {
      type: String,
      default: ''
    },
    currencyId: {
      type: String,
      default: ''
    },
    purchaseOrderId: {
      type: String,
      default: ''
    },
    warehouseId: {
      type: String,
      default: ''
    },
    dropShipping: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '13',
      savePath: 'purchaseMTable',
      activeName: '1',
      searchFormKey: Date.now(),
      loading: false,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'productId',
      tableList: [],
      filteredSelectedList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList1: [],
      selectList2: [],
      visible: false,
      columns: [],
      columns1: [
        {
          prop: 'purchaseRequisiteNo',
          label: vm.$t('PURCHASE.PRNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true,
          fixed: true
        },
        {
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productType',
          label: vm.$t('PURCHASE.productClass'),
          visible: true,
          width: 150,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          padding: 70,
          tooltip: false
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'brand',
          label: vm.$t('PURCHASE.brand'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PURCHASE.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   sortable: 'custom',
        //   tooltip: true
        // },
        {
          prop: 'prUom',
          label: vm.$t('PURCHASE.uomPR'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'prBalanceQty',
          label: vm.$t('PURCHASE.qtyPR'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'prBalancePurchaseQty',
          label: vm.$t('PURCHASE.convertedQtyPQ'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'documentNo',
        //   label: vm.$t('PURCHASE.PQorPCNo'),
        //   visible: true,
        //   minWidth: 200,
        //   fixedWidth: 180,
        //   tooltip: true
        // },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.uomPQ'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'pqQty',
          label: vm.$t('PURCHASE.qtyPQ'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          minWidth: 200,
          fixedWidth: 160,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 70,
          align: 'right'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('PURCHASE.lineTotal'),
          visible: true,
          minWidth: 140,
          fixedWidth: 180,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
        // {
        //   prop: 'picture',
        //   label: vm.$t('ui.picture'),
        //   visible: true,
        //   width: 120
        // }
      ],
      columns2: [
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true,
          padding: 70,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'brand',
          label: vm.$t('PURCHASE.brand'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PURCHASE.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   sortable: 'custom',
        //   tooltip: true
        // },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'documentNo',
        //   label: vm.$t('PURCHASE.PQorPCNo'),
        //   visible: true,
        //   minWidth: 200,
        //   fixedWidth: 180,
        //   tooltip: true
        // },
        {
          prop: 'pqQty',
          label: vm.$t('PURCHASE.qtyPQ'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 70,
          align: 'right'
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          minWidth: 200,
          fixedWidth: 160,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'lineTotal',
          label: vm.$t('PURCHASE.lineTotal'),
          visible: true,
          minWidth: 140,
          fixedWidth: 180,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PRODUCT.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PRODUCT.availableQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'reservedQty',
          label: vm.$t('PRODUCT.reservedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        /* {
          prop: 'unqualifiedQTY',
          label: vm.$t('PRODUCT.unqualifiedQTY'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }, */
        {
          prop: 'inTransitQty',
          label: vm.$t('PRODUCT.inTransitQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        }
        // {
        //   prop: 'picture',
        //   label: vm.$t('ui.picture'),
        //   visible: true,
        //   width: 120
        // }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: '',
        conditionForPR: ''
      },
      searchData: [],
      searchData1: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        }
        // {
        //   name: 'conditionForPR',
        //   label: this.$t('PURCHASE.PRNo'),
        //   type: 'AutocompleteEle',
        //   fuzzyData: [],
        //   defaultProps: {
        //     value: 'value',
        //     label: 'label'
        //   }
        // }
      ],
      searchData2: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        }
      ],
      // 请求的时间戳
      queryTime: undefined
    }
  },
  computed: {
    selectIds() {
      if (this.activeName === '1') {
        return this.selectIds1
      } else {
        return this.selectIds2
      }
    },
    selectIds1() {
      return this.selectList1.map((item) => item[this.rowIdKey])
    },
    selectIds2() {
      return this.selectList2.map((item) => item[this.rowIdKey])
    },
    configCurColumn() {
      let arr = [...this.columns]
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    visibleCurColumns() {
      let arr = this.columns.filter((column) => column.visible === true)
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    }
  },
  watch: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible('1', this.columns1)
    this.$$initColumnVisible('2', this.columns2)
  },
  updated() {},
  methods: {
    cellClass(row) {
      if (this.activeName === '1' && row.columnIndex === 0) {
        return 'cell-class'
      }
    },
    handleTabClick() {
      this.resetSearchForm(false)
      if (this.activeName === '1') {
        this.columns = this.columns1
        this.searchData = this.searchData1
        this.rowIdKey = 'purchaseRequisiteDetailId'
      } else {
        this.columns = this.columns2
        this.searchData = this.searchData2
        this.rowIdKey = 'productId'
      }
      this.searchFormKey = Date.now()
      this.getList()
    },
    handleAdd(select1, select2) {
      this.selectList1 = JSON.parse(JSON.stringify(select1 || []))
      this.selectList2 = JSON.parse(JSON.stringify(select2 || []))

      this.visible = true
      this.activeName = '1'
      this.rowIdKey = 'purchaseRequisiteDetailId'
      this.resetSearchForm()
      this.columns = this.columns1
      this.searchData = this.searchData1
      this.searchFormKey = Date.now()
      // this.querySearchListForPOCanSelectProductListForPR()
    },
    querySearchListForPOCanSelectProductListForPR() {
      const param = {}
      param.businessPartnerId = this.businessPartnerId
      param.purchaseQuotationId = this.purchaseQuotationId
      param.currencyId = this.currencyId
      param.purchaseOrderId = this.purchaseOrderId
      if (this.dropShipping !== '1') {
        param.warehouseId = this.warehouseId
      }
      let queryFN = querySearchListForPOCanSelectProductListForPR
      if (this.formData.createType === '2') {
        param.purchaseRequisiteIdList = this.formData.purchaseRequisiteIdList
        queryFN = queryASLCanSelectProductListForSearch
      }
      queryFN(param).then((res) => {
        const data = res.data || {}
        const conditionForPRList = (data.conditionForPRList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.searchData1[1].fuzzyData = conditionForPRList
      })
    },
    getList() {
      const timer = Date.now()
      this.queryTime = timer
      const vm = this
      const param = this.queryParams
      param.businessPartnerId = this.businessPartnerId
      param.purchaseQuotationId = this.purchaseQuotationId
      param.currencyId = this.currencyId
      param.purchaseOrderId = this.purchaseOrderId
      param.selectedIdList = this.$$getSelectedIdList(this.selectIds, this.rowIdKey)

      this.$trimOfObj(param)
      this.loading = true
      let queryFn
      if (this.activeName === '1') {
        queryFn = queryPOCanSelectProductListForPR
      } else {
        queryFn = queryPOCanSelectProductListForProduct
      }
      if (this.formData.createType === '2') {
        param.purchaseRequisiteIdList = this.formData.purchaseRequisiteIdList
        // queryFn = queryASLCanSelectProductList
        if (this.formData.isEmergencyGoodsReceipt === '1') {
          queryFn = queryASLCanSelectProductListForEGR
        } else {
          queryFn = queryASLCanSelectProductList
        }
      }
      param.dropShipping = this.dropShipping
      if (param.dropShipping !== '1') {
        param.warehouseId = this.warehouseId
      }
      queryFn(param)
        .then((response) => {
          if (timer !== this.queryTime) return
          this.loading = false
          this.total = response.total
          this.filteredSelectedList = this.$$getFilteredSelectedList(response)
          this.tableList = response.rows
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
          if (this.activeName === '1') {
            this.$nextTick(() => {
              this.selectList1.forEach((row) => {
                this.tableList.forEach((item, index) => {
                  if (row[this.rowIdKey] === item[this.rowIdKey]) {
                    row.prBalanceQty = item.prBalanceQty
                    row.pplList = item.pplList
                    item.purchaseQty = row.purchaseQty
                    // this.tableList[index] = row
                    this.$refs.tables.toggleRowSelection(this.tableList[index], true)
                  }
                })
              })
            })
          } else {
            this.$nextTick(() => {
              this.selectList2.forEach((row) => {
                this.tableList.forEach((item, index) => {
                  if (row[this.rowIdKey] === item[this.rowIdKey]) {
                    row.prBalanceQty = item.prBalanceQty
                    row.pplList = item.pplList
                    // this.tableList[index] = row
                    this.$refs.tables.toggleRowSelection(this.tableList[index], true)
                  }
                })
              })
            })
          }
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    documentNoChange(row) {
      const selectRow = (row.pplList || []).find((item) => item.documentNo === row.documentNo)
      this.documentNoChangeUpdateAllSelect(selectRow)
    },
    /* 行ppl修改后, 同步到所有选中的行 */
    documentNoChangeUpdateAllSelect(selectRow) {
      this.selectList1.forEach((item) => {
        if (item.productId === selectRow.productId) {
          this.$set(item, 'documentNo', selectRow.documentNo)
          this.$set(item, 'documentId', selectRow.documentId)
          this.$set(item, 'moq', selectRow.moq)
          this.$set(item, 'purchasePriceId', selectRow.purchasePriceId)
          this.$set(item, 'priceType', selectRow.priceType)
          this.$set(item, 'unitPrice', selectRow.unitPrice)
          this.getLineTotal(item)
        }
      })
      this.selectList2.forEach((item, index) => {
        if (item.productId === selectRow.productId) {
          this.$set(item, 'documentNo', selectRow.documentNo)
          this.$set(item, 'documentId', selectRow.documentId)
          this.$set(item, 'moq', selectRow.moq)
          this.$set(item, 'purchasePriceId', selectRow.purchasePriceId)
          this.$set(item, 'priceType', selectRow.priceType)
          this.$set(item, 'unitPrice', selectRow.unitPrice)
          this.getLineTotal(item)
        }
      })
    },
    /* 新选中的行, 将ppl 设置为 已选中行的ppl */
    selectSetDocumentNo(newRow) {
      const selectAll = [...this.selectList1, ...this.selectList2]
      const findRow = selectAll.find((item) => item.productId === newRow.productId)
      if (findRow) {
        this.$set(newRow, 'documentNo', findRow.documentNo)
        this.$set(newRow, 'documentId', findRow.documentId)
        this.$set(newRow, 'moq', findRow.moq)
        this.$set(newRow, 'purchasePriceId', findRow.purchasePriceId)
        this.$set(newRow, 'priceType', findRow.priceType)
        this.$set(newRow, 'unitPrice', findRow.unitPrice)
        this.getLineTotal(newRow)
      }
    },
    purchaseQtyChange(row) {
      this.getLineTotal(row)
    },
    getLineTotal(row) {
      if (row.unitPrice && row.purchaseQty) {
        const lineTotal = row.unitPrice * row.purchaseQty
        this.$set(row, 'lineTotal', lineTotal)
      } else {
        this.$set(row, 'lineTotal', undefined)
      }
      const findItem = this.selectList1.find((item) => row[this.rowIdKey] === item[this.rowIdKey])
      if (findItem) {
        this.$set(findItem, 'purchaseQty', row.purchaseQty)
        this.$set(findItem, 'lineTotal', row.lineTotal)
      }
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.productCategoryId = data.id
      this.getList()
    },
    selectable(row, rowIndex) {
      if (this.activeName === '1') {
        /* const arr = this.selectList1.filter((x) => x.purchaseRequisiteNo)
        if (arr.length > 0) {
          return row.purchaseRequisiteNo === arr[0].purchaseRequisiteNo
        } */
        return true
      }
      return true // 不禁用
    },
    handleSelectAll(selection) {
      const vm = this
      if (this.activeName === '1') {
        if (selection.length) {
          // 去重添加
          const curSelectedIds = this.selectList1.map((d) => d[this.rowIdKey])
          selection.forEach((item) => {
            if (!curSelectedIds.includes(item[this.rowIdKey])) {
              this.selectSetDocumentNo(item)
              vm.selectList1.push(item)
            }
          })
        } else {
          // 删除table中在selection 中缓存的内容
          const delArr = this.tableList.map((item) => item[this.rowIdKey])
          vm.selectList1 = vm.selectList1.filter((item) => !delArr.includes(item[this.rowIdKey]))
        }
      }
      if (this.activeName === '2') {
        if (selection.length) {
          // 去重添加
          const curSelectedIds = this.selectList2.map((d) => d[this.rowIdKey])
          selection.forEach((item) => {
            if (!curSelectedIds.includes(item[this.rowIdKey])) {
              this.selectSetDocumentNo(item)
              vm.selectList2.push(item)
            }
          })
        } else {
          // 删除table中在selection 中缓存的内容
          const delArr = this.tableList.map((item) => item[this.rowIdKey])
          vm.selectList2 = vm.selectList2.filter((item) => !delArr.includes(item[this.rowIdKey]))
        }
      }
    },
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this
      if (this.activeName === '1') {
        for (let i = 0; i < vm.selectList1.length; i++) {
          if (vm.selectList1[i][this.rowIdKey] === row[this.rowIdKey]) {
            return vm.selectList1.splice(i, 1)
          }
        }
        this.selectSetDocumentNo(row)
        vm.selectList1.push(row)
      }
      if (this.activeName === '2') {
        for (let i = 0; i < vm.selectList2.length; i++) {
          if (vm.selectList2[i][this.rowIdKey] === row[this.rowIdKey]) {
            return vm.selectList2.splice(i, 1)
          }
        }
        this.selectSetDocumentNo(row)
        vm.selectList2.push(row)
      }
    },
    handleRowClick(row, col) {
      if (col && col.property === 'picture') {
        return
      }

      if (this.activeName === '1') {
        /* const arr = this.selectList1.filter((x) => x.purchaseRequisiteNo)
        if (arr.length > 0) {
          if (row.purchaseRequisiteNo !== arr[0].purchaseRequisiteNo) {
            return
          }
        } */
        const index = this.selectList1.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        const isSelected = index > -1
        if (col.property === 'documentNo' || col.property === 'purchaseQty') {
          if (isSelected) return
        }
        if (isSelected) {
          this.selectList1.splice(index, 1)
        } else {
          this.selectList1.push(row)
        }
        this.$refs.tables.toggleRowSelection(row, !isSelected)
      }
      if (this.activeName === '2') {
        const index = this.selectList2.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        const isSelected = index > -1
        if (col.property === 'documentNo' || col.property === 'purchaseQty') {
          if (isSelected) return
        }
        if (isSelected) {
          this.selectList2.splice(index, 1)
        } else {
          this.selectList2.push(row)
        }
        this.$refs.tables.toggleRowSelection(row, !isSelected)
      }
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm(isGetList = true) {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables && this.$refs.tables.clearSort()
      if (isGetList) {
        this.getList()
      }
    },
    closed() {
      this.selectList1 = []
      this.selectList2 = []
      this.tableList = []
      this.$refs.tables.clearSelection()
    },
    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      const poSelectProductList = [...this.selectList1, ...this.selectList2]

      if (poSelectProductList.length <= 0) {
        this.btnLoading = false
        const params = {
          productList: [],
          commonFileList: []
        }
        this.$emit('onSuccess', params)

        this.visible = false
        return
      }
      let queryFn
      if (this.formData.createType === '2') {
        // queryFn = mergeASLSelectProductList
        if (this.formData.isEmergencyGoodsReceipt === '1') {
          queryFn = mergeASLSelectProductListForEGR
        } else {
          queryFn = mergeASLSelectProductList
        }
      } else {
        queryFn = mergePOSelectProductList
      }
      queryFn({
        poSelectProductList,
        businessPartnerId: this.businessPartnerId,
        purchaseQuotationId: this.purchaseQuotationId,
        purchaseRequisiteIdList: this.formData.purchaseRequisiteIdList,
        currencyId: this.currencyId,
        dropShipping: this.dropShipping
      })
        .then((res) => {
          this.btnLoading = false
          const data = res.data || {}

          const params = {
            productList: data.purchaseOrderDetailList || [],
            commonFileList: data.commonFileList || []
          }

          this.$emit('onSuccess', params)
          this.visible = false
        })
        .catch(() => {
          this.btnLoading = false
        })
      /* this.$emit('onSuccess', this.selectList1, this.selectList2)
      this.visible = false */
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  /deep/ .cell-class .cell .el-checkbox__inner {
    display: none;
    position: relative;
  }
}
.table {
  /deep/ .cell-class .cell:before {
    content: '';
    position: absolute;
  }
}
</style>
