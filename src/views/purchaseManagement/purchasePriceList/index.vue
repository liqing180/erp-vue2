<template>
  <div class="app-container">
    <!-- <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('PURCHASE.product')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('menu.service')" name="2"></el-tab-pane>
      </el-tabs>
    </el-row> -->
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :topShowCount="1"
      v-show="showSearch"
      :key="searchFormKey"
      @updateSearchData="updateSearchData"
    />

    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['purchaseManagement:purchasePriceList:import']"
          v-if="false"
          >{{ $t('uiBtn.import') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-hasPermi="['purchaseManagement:purchasePriceList:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>
      <right-toolbar
        :saveKey="activeName"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columnsInit="curColumns"
        :columns="configCurColumn"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      class="mt10"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      :key="'tabs_' + activeName"
      @row-dblclick="handleUpdate"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
        align="center"
        v-if="checkPermi(['purchaseManagement:purchasePriceList:export'])"
      >
      </el-table-column>
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
          <el-switch
            v-if="item.prop === 'isActive'"
            v-model="scope.row.isActive"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <el-switch
            v-else-if="item.prop === 'isDefault'"
            v-model="scope.row.isDefault"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template v-else-if="item.prop === 'internalPartNo' && scope.row.isCustomProduct !== '1'">
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'businessPartnerName'">
            <!-- <span class="primary-link" @click="nav(scope.row, 'businessPartnerName')">
              {{ scope.row.businessPartnerName }}
            </span> -->
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="businessPartner"
              @click="nav(scope.row, 'businessPartnerName')"
            />
          </template>
          <template v-else-if="item.prop === 'purchaseQuotationNo'">
            <span class="primary-link" @click="nav(scope.row, 'purchaseQuotationNo')">{{
              scope.row.purchaseQuotationNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'documentNo'">
            <!-- <span class="primary-link" @click="nav(scope.row, 'documentNo')">{{
              scope.row.documentNo
            }}</span> -->
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="purchaseQuotation"
              @click="nav(scope.row, 'documentNo')"
              v-if="scope.row.priceType === '1'"
            />
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="purchaseContract"
              @click="nav(scope.row, 'documentNo')"
              v-if="scope.row.priceType === '2'"
            />
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="purchaseOrder"
              @click="nav(scope.row, 'documentNo')"
              v-if="scope.row.priceType === '3'"
            />
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            {{ $numberStr(scope.row.unitPrice, 2) }}
          </template>
          <template v-else-if="item.prop === 'purchaseQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseUom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'categoryNameShowStr'">
            <ToolTipShowCategory :list="scope.row.categoryNameList || []">
              <div class="flow1">{{ scope.row[item.prop] }}</div>
            </ToolTipShowCategory>
          </template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :saveKey="saveKey"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 导出 -->
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <!-- 导入 -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'

import { queryAllProductCategoryTreeList } from '@/api/productManagement/productCategory'
import {
  queryPurchasePriceListList,
  querySearchList
} from '@/api/purchaseManagement/purchasePriceList'
export default {
  name: 'PurchasePriceList',
  dicts: ['p_price_type', 'p_pq_quote_from'],
  mixins: [pageMixin],
  components: {},
  data() {
    const vm = this
    return {
      saveKey: '1',
      searchFormKey: Date.now(),
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      loading: false,
      columns: [],
      columns1: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.productCode'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'brand',
          label: vm.$t('PURCHASE.brand'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('PRODUCT.supplierName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        // {
        //   prop: 'paymentMethod',
        //   label: vm.$t('PURCHASE.paymentMethod'),
        //   minWidth: 160,
        //   visible: true,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
        {
          prop: 'incotermAbbreviation',
          label: vm.$t('PURCHASE.incoterm'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'paymentTermName',
          label: vm.$t('PURCHASE.paymentTerm'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'priceType',
          propBy: 'priceTypeStr',
          label: vm.$t('PURCHASE.priceType'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.purchaseQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.priceSource'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.productCategory1'),
          visible: true,
          minWidth: 200
          // tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'receiveAddressName',
          label: vm.$t('PURCHASE.deliveryAddress'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'validity',
          label: vm.$t('PURCHASE.validityDays'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'quoteFrom',
          propBy: 'quoteFromStr',
          label: vm.$t('PURCHASE.quoteFrom'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 170,
          sortable: 'custom',
          visible: true
        }
      ],
      columns2: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.productCode'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('PRODUCT.supplierName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        // {
        //   prop: 'paymentMethod',
        //   label: vm.$t('PURCHASE.paymentMethod'),
        //   minWidth: 160,
        //   visible: true,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
        {
          prop: 'incotermAbbreviation',
          label: vm.$t('PURCHASE.incoterm'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'paymentTermName',
          label: vm.$t('PURCHASE.paymentTerm'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'priceType',
          propBy: 'priceTypeStr',
          label: vm.$t('PURCHASE.priceType'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.purchaseQTY'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.priceSource'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.productCategory1'),
          visible: true,
          minWidth: 200
          // tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'receiveAddressName',
          label: vm.$t('PURCHASE.deliveryAddress'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'validity',
          label: vm.$t('PURCHASE.validityDays'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'quoteFrom',
          propBy: 'quoteFromStr',
          label: vm.$t('PURCHASE.quoteFrom'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 170,
          sortable: 'custom',
          visible: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      searchData: [],
      searchData1: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${this.$t('ui.productSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            // { label: this.$t('PURCHASE.requestForQuotationNo'), value: 'conditionForRFQ' },
            { label: this.$t('PURCHASE.PQNo'), value: 'conditionForPQ' },
            { label: this.$t('PURCHASE.PCNo'), value: 'conditionForPC' },
            { label: this.$t('PURCHASE.PONo1'), value: 'conditionForPO' }
          ],
          selectName: 'selectId',
          inputName: 'inputVal',
          selectId: '',
          inputVal: '',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }, */
        {
          name: 'productCategoryId',
          label: this.$t('PRODUCT.productCategory1'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'id',
          mapLabel: 'categoryName',
          checkStrictly: true,
          multiple: true,
          selectData: []
        },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('PRODUCT.supplierName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        },
        {
          name: 'incotermIdList',
          label: vm.$t('PURCHASE.incoterm'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'incotermId',
          selectLabel: 'incotermAbbreviation',
          selectData: []
        },
        {
          name: 'priceTypeIdList',
          label: vm.$t('PURCHASE.priceType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'p_price_type',
          selectData: []
        },
        {
          name: 'brandList',
          label: vm.$t('PURCHASE.brand'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'brand',
          selectLabel: 'brand',
          selectData: []
        },
        {
          name: 'paymentTermIdList',
          label: vm.$t('PURCHASE.paymentTerm'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'paymentTermId',
          selectLabel: 'paymentTermName',
          selectData: []
        }
      ],
      searchData2: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${this.$t('ui.productSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            // { label: this.$t('PURCHASE.requestForQuotationNo'), value: 'conditionForRFQ' },
            { label: this.$t('PURCHASE.PQNo'), value: 'conditionForPQ' },
            // { label: this.$t('PURCHASE.PCNo'), value: 'conditionForPC' },
            { label: this.$t('PURCHASE.PONo1'), value: 'conditionForPO' }
          ],
          selectName: 'selectId',
          inputName: 'inputVal',
          selectId: '',
          inputVal: '',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }, */
        {
          name: 'incotermIdList',
          label: vm.$t('PURCHASE.incoterm'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'incotermId',
          selectLabel: 'incotermAbbreviation',
          selectData: []
        },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('PRODUCT.supplierName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'priceTypeIdList',
          label: vm.$t('PURCHASE.priceType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'paymentTermIdList',
          label: vm.$t('PURCHASE.paymentTerm'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'paymentTermId',
          selectLabel: 'paymentTermName',
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      conditionForPQList: [],
      conditionForPCList: [],
      conditionForPOList: [],
      importOptions: {
        // 下载模板
        downFileUrl: '/system/productSheet/importTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/system/productSheet/checkImportData',
        // 提交导入
        importUrl: '/system/productSheet/importData',
        // 下载文件名
        fileName: 'productInformationSheet'
      },
      activeName: '1'
    }
  },
  watch: {},
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['organization:role:edit'])
    },
    columnsData() {
      return {
        1: this.columns1,
        2: this.columns2
      }
    },
    curColumns() {
      return this.columnsData[this.activeName] || []
    },
    configCurColumn() {
      let arr = [...this.curColumns]
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
      let arr = this.curColumns.filter((column) => column.visible === true)
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
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible('1', this.columns1)
    this.$$initColumnVisible('2', this.columns2)
    this.searchData = this.searchData1
    this.getList()
    this.queryAllProductCategoryTreeList()
    this.initQueryParams()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
    this.queryAllProductCategoryTreeList()
  },
  methods: {
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/purchaseManagement/viewPurchasePriceList',
        query: {
          id: row.productId,
          timeId: Date.now()
        }
      })
    },
    handleTabClick() {
      if (this.activeName === '1') {
        this.searchData = this.searchData1
      } else {
        this.searchData = this.searchData2
      }
      this.initQueryParams(false)
      this.getList()
    },
    initQueryParams(isResetDate = true) {
      const { pageSize, dateRange, startDateCreatedTime, endDateCreatedTime } = this.queryParams
      this.queryParams = {
        pageNum: 1,
        pageSize,
        dateRange,
        startDateCreatedTime,
        endDateCreatedTime
      }
      if (isResetDate) {
        const end = this.appointTime(Date.now(), '23:59:59')
        const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
        this.$set(this.queryParams, 'dateRange', [startTimer, end])
        this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
        this.$set(this.queryParams, 'endDateCreatedTime', end)
      }
      this.searchData[1].selectId = 'conditionForPQ'
      this.queryParams.selectId = 'conditionForPQ'
      this.searchData[1].inputVal = ''
      this.searchFormKey = Date.now()
    },
    getList() {
      this.querySearchList()
      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      // if (this.queryParams.productCategoryId && this.queryParams.productCategoryId.length > 0) {
      //   param.productCategoryId =
      //     this.queryParams.productCategoryId[this.queryParams.productCategoryId.length - 1]
      // } else {
      //   param.productCategoryId = undefined
      // }

      if (param.productCategoryId && param.productCategoryId.length > 0) {
        param.productCategoryIdList = param.productCategoryId.map((item) => item[item.length - 1])
      } else {
        param.productCategoryIdList = undefined
      }
      delete param.productCategoryId

      if (param.inputVal && param.selectId) {
        param[param.selectId] = param.inputVal
      }
      param = this.$trimOfObj(param)
      if (this.activeName === '1') {
        param.productTypeList = ['1', '3', '4']
      } else {
        param.productType = this.activeName
      }
      this.loading = true
      queryPurchasePriceListList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.validity = this.parseTime(item.validity, this.fmtForYmd)
            item.priceTypeStr = this.selectDictLabel(this.dict.type.p_price_type, item.priceType)
            item.quoteFromStr = this.selectDictLabel(this.dict.type.p_pq_quote_from, item.quoteFrom)
          })
          this.tableList = rows
          this.loading = false
          this.total = response.total
          this.$$getColumnContentMaxWidth(this.curColumns, this.tableList)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 搜索下拉值
    querySearchList() {
      const param = {}
      if (this.activeName === '1') {
        param.productTypeList = ['1', '3', '4']
      } else {
        param.productType = this.activeName
      }
      querySearchList(param).then((res) => {
        const data = res.data || {}
        const { vendorList, paymentTermList, incotermList, brandList } = res.data

        this.conditionForPQList = (data.conditionForPQList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForPCList = (data.conditionForPCList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForPOList = (data.conditionForPOList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })

        this.searchData.forEach((x, i) => {
          if (x.name === 'businessPartnerIdList') {
            this.$set(this.searchData[i], 'selectData', vendorList)
          }
          if (x.name === 'paymentTermIdList') {
            this.$set(this.searchData[i], 'selectData', paymentTermList)
          }
          if (x.name === 'incotermIdList') {
            this.$set(this.searchData[i], 'selectData', incotermList)
          }
          if (x.name === 'brandList') {
            this.$set(this.searchData[i], 'selectData', brandList)
          }
        })
        this.setFuzzyData()
      })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.priceTypeStr = this.selectDictLabel(this.dict.type.p_price_type, item.priceType)
        item.quoteFromStr = this.selectDictLabel(this.dict.type.p_pq_quote_from, item.quoteFrom)
      })
      this.searchData2.forEach((item) => {
        if (item.name === 'priceTypeIdList') {
          item.selectData = this.dict.type.p_price_type.filter((i) => i.value !== '2')
        }
      })
      this.$$getColumnContentMaxWidth(this.curColumns, this.tableList)
    },
    queryAllProductCategoryTreeList() {
      queryAllProductCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.searchData1.forEach((x, i) => {
          if (x.name === 'productCategoryId') {
            this.$set(x, 'selectData', arr)
          }
        })
      })
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          if (x.child && x.child.length > 0) {
            x.children = x.child
            this.handle(x.child)
          }
        })
      }
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.purchasePriceId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    nav(row, type) {
      if (type === 'businessPartnerName') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.businessPartnerId,
            timeId: Date.now()
          }
        })
      } else if (type === 'internalPartNo') {
        this.$router.push({
          path: '/productManagement/viewExtendedProductInfo',
          query: {
            id: row.productId,
            timeId: Date.now()
          }
        })
      } else if (type === 'purchaseQuotationNo') {
        console.log('object')
      } else if (type === 'documentNo') {
        switch (row.priceType) {
          case '1': // PQ
            this.$router.push({
              path: '/purchaseManagement/viewPurchaseQuotation',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '2': // PC
            this.$router.push({
              path: '/purchaseManagement/viewPurchaseContract',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '3': // PO
            this.$router.push({
              path: '/purchaseManagement/viewPurchaseOrder',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
        }
      }
    },
    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/productManagement/editProductRelationship',
        query: { id: row.id, timeId: +new Date() }
      })
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      this.initQueryParams()
      this.searchFormKey = Date.now()
      this.$refs.tables.clearSort()
      this.getList()
    },
    updateSearchData(e) {
      const item = this.searchData[e.index]
      if (item.name === 'selectAnInputName') {
        if (e.childType === 'all') {
          item.selectId = ''
          item.inputVal = ''
          this.setFuzzyData()
        } else if (e.childType === 'select') {
          item.selectId = e.value
          item.inputVal = ''
          this.setFuzzyData()
        } else {
          item.inputVal = e.value || ''
        }
      }
    },
    setFuzzyData() {
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          if (item.selectId === 'conditionForPO') {
            this.$set(item, 'fuzzyData', this.conditionForPOList)
          } else if (item.selectId === 'conditionForPC') {
            this.$set(item, 'fuzzyData', this.conditionForPCList)
          } else if (item.selectId === 'conditionForPQ') {
            this.$set(item, 'fuzzyData', this.conditionForPQList)
          } else {
            this.$set(item, 'fuzzyData', [])
          }
        }
      })
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.purchasePriceId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    settingHandleCommand(command) {
      switch (command) {
        case 'active':
          this.handleChangeUsersStatus('active')
          break
        case 'inactive':
          this.handleChangeUsersStatus('inactive')
          break
        default:
          break
      }
    },
    /** 导出按钮操作 */
    openExport() {
      this.$refs.ExportDlgRef.open()
    },
    handleExport(data) {
      const vm = this
      const { exportType } = data
      let params = this.addDateRange(this.queryParams, this.dateRange)
      params = JSON.parse(JSON.stringify(params))
      params = this.$trimOfObj(params)
      // params.productType = this.activeName
      if (this.activeName === '1') {
        params.productTypeList = ['1', '3', '4']
      } else {
        params.productType = this.activeName
      }
      params.exportType = exportType
      // if (params.productCategoryId && params.productCategoryId.length > 0) {
      //   params.productCategoryId = params.productCategoryId[params.productCategoryId.length - 1]
      // } else {
      //   params.productCategoryId = undefined
      // }

      if (params.productCategoryId && params.productCategoryId.length > 0) {
        params.productCategoryIdList = params.productCategoryId.map((item) => item[item.length - 1])
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryId

      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.purchasePriceId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleCurColumns)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/purchase/purchasePriceList/export',
        params,
        `${this.getFileNameDate('Purchase Price List')}.xlsx`
      )
        .then((res) => {
          vm.exportLoading = false
          vm.$refs.ExportDlgRef.hide()
          vm.$modal.msgSuccess(vm.$t('ui.exportSuccess'))
        })
        .catch(() => {
          vm.exportLoading = false
        })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
    }
  }
}
</script>

<style scoped></style>
