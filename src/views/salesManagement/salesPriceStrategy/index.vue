<template>
  <div class="app-container">
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :topShowCount="1"
      @updateSearchData="updateSearchData"
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['salesManagement:salesPriceStrategy:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          v-hasPermi="['salesManagement:servicePriceList:edit']"
          @click="handleEdit"
          >{{ $t('uiBtn.edit') }}</el-button
        >
      </el-col>

      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      style="cursor: pointer"
    >
      <el-table-column
        v-if="checkPermi(['salesManagement:servicePriceList:edit'])"
        type="selection"
        width="50"
        align="center"
        :selectable="selectable"
      />
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
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
        <template slot-scope="scope">
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'internalPartNo'">
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'categoryNameShowStr'">
            <ToolTipShowCategory :list="scope.row.categoryNameList || []">
              <div class="flow1">{{ scope.row[item.prop] }}</div>
            </ToolTipShowCategory>
          </template>
          <template v-else-if="item.prop === 'salesUom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
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
    <!-- 导入 -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
  </div>
</template>

<script>
import {
  querySalesPriceStrategyList,
  querySearchList,
  queryCanSelectCustomerListNoPage
} from '@/api/salesManagement/salesPriceStrategy'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import { queryAllProductCategoryTreeList } from '@/api/productManagement/productCategory'
export default {
  name: 'SalesPriceStrategy',
  mixins: [pageMixin],
  data() {
    const vm = this

    return {
      saveKey: '1',
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      selectList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      tableList: [],
      // 日期范围
      dateRange: [],
      // 导入
      importOptions: {
        // 下载模板
        downFileUrl: '/sales/salesPriceStrategy/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/sales/salesPriceStrategy/checkImportData',
        // 提交导入
        importUrl: '/sales/salesPriceStrategy/importData',
        // 下载文件名
        fileName: 'salesPriceStrategy'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('ui.productSearch')}`
        },
        // {
        //   name: 'productCategoryIds',
        //   label: this.$t('PRODUCT.productCategory1'),
        //   type: 'ElcascaderEle',
        //   width: '230px',
        //   mapValue: 'id',
        //   mapLabel: 'categoryName',
        //   checkStrictly: true,
        //   multiple: true,
        //   selectData: []
        // },
        {
          name: 'productCategoryIds',
          label: this.$t('PRODUCT.productCategory1'),
          type: 'ATreeSelectCustom',
          width: '230px',
          mapValue: 'id',
          mapLabel: 'categoryName',
          checkStrictly: false,
          emitPath: false,
          multiple: true,
          selectData: []
        },
        {
          name: 'modifiedIdList',
          label: vm.$t('ui.modifiedBy'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'modifiedId',
          selectLabel: 'modifiedBy',
          filterable: true,
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.modifiedTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateModifiedTime',
          endDate: 'endDateModifiedTime'
        }
      ],
      // 列信息
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.productCategory'),
          visible: true,
          minWidth: 200
          // tooltip: true
          // sortable: 'custom' // 不能排序
        },
        {
          prop: 'salesUom',
          label: vm.$t('SALES.pricingUnit'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }
      ]
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        if (route.params.isGetList && route.name === 'SalesPriceStrategy') {
          this.resetSearchForm(false)
          const params = route.params || {}
          console.log(params)
          this.$set(this.queryParams, 'jumpToIds', params.ids)
          this.createdInitTimer = Date.now()
          this.getList()
        }
      },
      immediate: true
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.queryAllProductCategoryTreeList()

    if (this.createdInitTimer && Date.now() - (this.createdInitTimer || 0) < 2000) return
    this.createdInitTimer = Date.now()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
    this.queryAllProductCategoryTreeList()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.productId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    // eslint-disable-next-line no-unused-vars
    selectable(row, rowIndex) {
      if (row.adminFlag === 1) {
        return false // 禁用
      } else {
        return true // 不禁用
      }
    },
    /** 查询用户列表 */
    getList() {
      this.querySearchList()
      this.loading = true
      // const params = this.$trimOfObj(this.queryParams)
      let params = { ...this.queryParams }
      // if (params.productCategoryIds && params.productCategoryIds.length > 0) {
      //   params.productCategoryId = params.productCategoryIds[params.productCategoryIds.length - 1]
      // } else {
      //   params.productCategoryId = undefined
      // }

      // if (params.productCategoryIds && params.productCategoryIds.length > 0) {
      //   params.productCategoryIdList = params.productCategoryIds.map(
      //     (item) => item[item.length - 1]
      //   )
      // } else {
      //   params.productCategoryIdList = undefined
      // }
      if (params.productCategoryIds && params.productCategoryIds.length > 0) {
        params.productCategoryIdList = params.productCategoryIds.map((x) => x.value)
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryIds
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (params.businessPartnerIdList && params.businessPartnerIdList.length > 0) {
        const selectBP = this.businessPartnerList.filter((item) =>
          params.businessPartnerIdList.includes(item.businessPartnerId)
        )
        params.customerGroupList = selectBP.map((item) => {
          if (this.$resultOfBoolean(item.customerGroup)) {
            return item.customerGroup
          } else {
            return '3'
          }
        })
        params.customerGroupList = Array.from(new Set(params.customerGroupList))
      }
      params = this.$trimOfObj(params)
      querySalesPriceStrategyList(params).then((response) => {
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    onDictReady() {
      // this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    querySearchList() {
      querySearchList({ labelType: this.activeName }).then((res) => {
        const data = res.data || {}
        this.searchData.forEach((item) => {
          if (item.name === 'modifiedIdList') {
            this.$set(item, 'selectData', data.modifiedList || [])
          }
        })
      })
    },
    queryAllProductCategoryTreeList() {
      queryAllProductCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.searchData.forEach((item) => {
          if (item.name === 'productCategoryIds') {
            this.$set(item, 'selectData', arr)
          }
        })
      })
      queryCanSelectCustomerListNoPage({}).then((res) => {
        const arr = res.data || []
        this.businessPartnerList = arr
        this.searchData.forEach((item) => {
          if (item.name === 'businessPartnerIdList') {
            this.$set(item, 'selectData', arr)
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
          } else {
            x.children = undefined
          }
        })
      }
    },
    nav(row) {
      this.$router.push({
        path: '/productManagement/viewExtendedProductInfo',
        query: {
          id: row.productId,
          timeId: Date.now()
        }
      })
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
    updateSearchData(e) {
      const item = this.searchData[e.index]
      if (item.name === 'SelectAnMultipleSelectName') {
        if (e.childType === 'all') {
          item.selectId = ''
          item.inputVal = []
        } else if (e.childType === 'select') {
          item.selectId = e.value
          item.inputVal = []
        } else {
          item.inputVal = e.value || []
        }
      }
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.productId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/salesManagement/addSalesPriceStrategy',
        query: {
          timeId: Date.now()
        }
      })
    },
    handleEdit(row) {
      if (this.ids.length === 1) {
        this.$router.push({
          path: '/salesManagement/editSalesPriceStrategy',
          query: {
            id: this.ids[0],
            timeId: Date.now()
          }
        })
      }
      if (this.ids.length > 1) {
        this.$router.push({
          path: '/salesManagement/batchEditSalesPriceStrategy',
          query: {
            id: this.ids.join(','),
            timeId: Date.now()
          }
        })
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/salesManagement/editSalesPriceStrategy',
        query: {
          id: row.productId,
          timeId: Date.now()
        }
      })
    },
    /* batchEditSalesPriceStrategy */

    /** 导出按钮操作 */
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
      params.exportType = exportType

      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.productId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      // if (params.productCategoryIds && params.productCategoryIds.length > 0) {
      //   params.productCategoryIdList = params.productCategoryIds.map(
      //     (item) => item[item.length - 1]
      //   )
      // } else {
      //   params.productCategoryIdList = undefined
      // }
      if (params.productCategoryIds && params.productCategoryIds.length > 0) {
        params.productCategoryIdList = params.productCategoryIds.map((x) => x.value)
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryIds
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/sales/salesPriceStrategy/export',
        params,
        `${this.getFileNameDate('Sales Price Strategy')}.xlsx`
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

<style lang="scss" scoped>
.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
    margin-right: 10px;
  }
}
.dept-select {
  /deep/ .vue-treeselect--disabled .vue-treeselect__control {
    background-color: #f5f7fa;
  }
  /deep/ .vue-treeselect__single-value {
    color: #c0c4cc;
  }
}
</style>
