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
      v-show="showSearch"
    />

    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          v-hasPermi="['salesManagement:servicePriceList:edit']"
          @click="handleAdd"
          >{{ $t('uiBtn.edit') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['salesManagement:servicePriceList:import']"
          >{{ $t('uiBtn.import') }}</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="false">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-hasPermi="['salesManagement:servicePriceList:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>
      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
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
      @row-dblclick="handleDblclick"
      @selection-change="handleSelectionChange"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
        align="center"
        v-if="
          checkPermi([
            'salesManagement:servicePriceList:edit',
            'salesManagement:servicePriceList:export'
          ])
        "
      >
      </el-table-column>
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
          <template v-else-if="item.prop === 'isDefault'">
            <el-tag v-if="scope.row.isDefault === '1'">{{ $t('ui.y') }}</el-tag>
            <el-tag v-if="scope.row.isDefault === '0'" type="danger">{{ $t('ui.n') }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'internalPartNo'">
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'businessPartnerNo'">
            <span class="primary-link" @click="nav(scope.row, 'businessPartnerNo')">{{
              scope.row.businessPartnerNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'categoryNameShowStr'">
            <ToolTipShowCategory :list="scope.row.categoryNameList || []">
              <div class="flow1">{{ scope.row[item.prop] }}</div>
            </ToolTipShowCategory>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <!-- <el-table-column
        :label="$t('ui.action')"
        align="center"
        min-width="120"
        class-name="small-padding fixed-width"
        fixed="right"
        v-if="checkPermi(['salesManagement:servicePriceList:edit'])"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate(scope.row)">
            <span v-if="scope.row.isActive === '0'">{{ $t('uiBtn.activeBtn') }}</span>
            <span v-else style="color: #ff4949">{{ $t('uiBtn.inactiveBtn') }}</span>
          </el-button>
        </template>
      </el-table-column> -->
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
import locale from '@/views/salesManagement/lang/index'
import {
  queryServicePriceStrategyList,
  querySearchList
} from '@/api/salesManagement/servicePriceList'
export default {
  name: 'ServicePriceList',
  dicts: ['bp_supplier_type', 'bp_supplier_group'],
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
      selectList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      loading: false,
      columns: [
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
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.productCategory'),
          visible: true,
          minWidth: 200
          // tooltip: true
        },
        {
          prop: 'pricingUnit',
          label: vm.$t('SALES.pricingUnit'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('SALES.unitPrice'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },

        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
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
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('ui.productSearch')}`
        },
        {
          name: 'modifiedIdList',
          label: vm.$t('ui.modifiedBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'modifiedId',
          selectLabel: 'modifiedBy',
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
      importOptions: {
        // 下载模板
        downFileUrl: '/sales/servicePriceStrategy/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/sales/servicePriceStrategy/checkImportData',
        // 提交导入
        importUrl: '/sales/servicePriceStrategy/importData',
        // 下载文件名
        fileName: 'Service Price List'
      }
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        if (route.params.isGetList && route.name === 'ServicePriceList') {
          this.resetSearchForm(false)
          const params = route.params || {}
          this.$set(this.queryParams, 'jumpToIds', params.ids)
          this.createdInitTimer = Date.now()
          this.getList()
        }
      },
      immediate: true
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['organization:role:edit'])
    }
  },

  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)

    if (this.createdInitTimer && Date.now() - (this.createdInitTimer || 0) < 2000) return
    this.createdInitTimer = Date.now()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 2000) return
    this.getList()
  },
  methods: {
    getList() {
      this.querySearchList()
      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)

      this.loading = true
      queryServicePriceStrategyList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.unitPrice = this.$numberStr(item.unitPrice, 2)
          })
          this.tableList = rows
          this.loading = false
          this.total = response.total

          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.loading = false
        })
    },
    querySearchList() {
      querySearchList({ labelType: this.activeName }).then((res) => {
        const data = res.data || {}
        const modifiedList = data.modifiedList || []
        this.searchData.forEach((item) => {
          if (item.name === 'modifiedIdList') {
            this.$set(item, 'selectData', modifiedList)
          }
        })
      })
    },
    /*  onDictReady() {
      this.tableList.forEach((item) => {

      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    }, */

    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.productMainId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    nav(row, type) {
      if (type === 'businessPartnerNo') {
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
      }
    },
    handleAdd(row) {
      this.$router.push({
        path: '/salesManagement/editServicePriceList',
        query: { id: this.ids.join(','), timeId: +new Date() }
      })
    },

    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/salesManagement/editServicePriceList',
        query: { id: row.productMainId, timeId: +new Date() }
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.productMainId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
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
        params.exportIdList = vm.tableList.map((item) => item.productMainId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/system/servicePriceStrategy/export',
        params,
        `${this.getFileNameDate('Service Price List')}.xlsx`
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
