<template>
  <div class="app-container">
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :topShowCount="0"
      :isBtn="true"
      v-show="showSearch"
      @updateSearchData="updateSearchData"
    />

    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-hasPermi="['inventoryManagement:stockCertificate:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>
      <right-toolbar
        ref="rightToolbar"
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
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @row-dblclick="handleDblclick"
      style="cursor: pointer"
    >
      <el-table-column type="selection" width="55" :selectable="selectable" align="center" />
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
          <template>{{ scope.row[item.propBy || item.prop] }}</template>
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
import locale from '@/views/inventoryManagement/lang/index'
import {
  queryStockCertificateList,
  querySearchList
} from '@/api/inventoryManagement/stockCertificate'

export default {
  name: 'StockCertificate',
  dicts: ['i_stock_certificate_document_type'],
  mixins: [pageMixin],
  components: {},
  data() {
    const vm = this
    return {
      saveKey: '1',
      loading: false,
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
      selectList: [],
      // 显示搜索条件
      showSearch: true,
      columns: [
        {
          prop: 'stockCertificateNo',
          label: vm.$t('INVENTORY.certificateNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true,
          fixed: true
        },
        {
          prop: 'warehouseName',
          label: vm.$t('INVENTORY.warehouseName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'documentType',
          propBy: 'documentTypeStr',
          label: vm.$t('INVENTORY.documentType'),
          visible: true,
          minWidth: 180,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'stockOutInNoteNo',
          label: vm.$t('INVENTORY.stockOutStockInNote'),
          visible: true,
          minWidth: 180,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'createdBy',
          label: vm.$t('INVENTORY.operator'),
          visible: true,
          minWidth: 180,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('INVENTORY.time'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      searchData: [
        // {
        //   name: 'condition',
        //   label: vm.$t('uiBtn.search'),
        //   type: 'InputEle',
        //   tooltip: vm.$t('ui.searchWords').replace('$1', `${vm.$t('INVENTORY.warehouseName')}`)
        // },
        {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            {
              label: this.$t('INVENTORY.certificateNo'),
              value: 'conditionForStockCertificateNo'
            },
            {
              label: this.$t('INVENTORY.stockOutStockInNote'),
              value: 'conditionForStockOutInNoteNo'
            }
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
        },
        {
          name: 'warehouseIdList',
          label: vm.$t('INVENTORY.warehouseName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'warehouseId',
          selectLabel: 'warehouseName',
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('INVENTORY.time'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        },
        {
          name: 'documentTypeList',
          label: this.$t('INVENTORY.documentType'),
          type: 'MultipleSelectEle',
          multiple: false,
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'i_stock_certificate_document_type',
          selectData: []
        },
        {
          name: 'createdIdList',
          label: this.$t('INVENTORY.operator'),
          type: 'MultipleSelectEle',
          filterable: true,
          multiple: false,
          selectValue: 'createdId',
          selectLabel: 'createdBy',
          selectData: []
        }
      ],
      importOptions: {
        // 下载模板
        downFileUrl: '/inventory/warehouseAssignment/importTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/inventory/warehouseAssignment/checkImportData',
        // 提交导入
        importUrl: '/inventory/warehouseAssignment/importData',
        // 下载文件名
        fileName: 'Warehouse Assignment'
      },
      conditionForBatchNoList: [],
      conditionForDocumentNoList: [],
      conditionForStockCertificateNoList: [],
      conditionForStockOutInNoteNoList: []
    }
  },
  watch: {},
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.initQueryParams()
    this.querySearchList()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.querySearchList()
    this.getList()
  },
  methods: {
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
      this.$set(this.queryParams, 'endDateCreatedTime', end)
      this.searchData[0].selectId = 'conditionForStockCertificateNo'
      this.queryParams.selectId = 'conditionForStockCertificateNo'
      this.searchData[0].inputVal = ''
    },
    querySearchList() {
      querySearchList({}).then((res) => {
        const {
          createdList,
          warehouseList,
          conditionForBatchNoList,
          conditionForDocumentNoList,
          conditionForStockCertificateNoList,
          conditionForStockOutInNoteNoList
        } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'createdIdList') {
            this.$set(x, 'selectData', createdList)
          } else if (x.name === 'warehouseIdList') {
            this.$set(x, 'selectData', warehouseList)
          }
        })
        this.conditionForBatchNoList = this.handle(conditionForBatchNoList)
        this.conditionForDocumentNoList = this.handle(conditionForDocumentNoList)
        this.conditionForStockCertificateNoList = this.handle(conditionForStockCertificateNoList)
        this.conditionForStockOutInNoteNoList = this.handle(conditionForStockOutInNoteNoList)
        this.setFuzzyData()
      })
    },
    handle(data = []) {
      if (!data || data.length <= 0) return []
      return data.map((item) => {
        return {
          value: item,
          label: item
        }
      })
    },
    getList(query) {
      let params = { ...this.queryParams }
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      params = this.$trimOfObj(params)

      queryStockCertificateList(params)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.documentTypeStr = this.selectDictLabel(
              this.dict.type.i_stock_certificate_document_type,
              item.documentType
            )
          })
          this.tableList = rows
          this.total = response.total
          this.loading = false
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.loading = false
        })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.documentTypeStr = this.selectDictLabel(
          this.dict.type.i_stock_certificate_document_type,
          item.documentType
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
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
      } else if (type === 'warehouseCode') {
        this.$router.push({
          path: '/inventoryManagement/warehouseManagement/viewWarehouse',
          query: { id: row.warehouseId, timeId: +new Date() }
        })
      }
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.stockCertificateId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleRowClick(row) {
      const index = this.selectList.findIndex(
        (item) => item.stockCertificateId === row.stockCertificateId
      )
      const isSelected = index > -1
      if (isSelected) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(row)
      }
      this.ids = this.selectList.map((item) => item.stockCertificateId)
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    handleAdd(row) {
      this.$refs.selectProductNameTable.handleOpen()
    },
    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/inventoryManagement/viewStockCertificate',
        query: { id: row.stockCertificateId, timeId: +new Date() }
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
      this.$refs.tables.clearSort()
      this.getList()
    },
    updateSearchData(e) {
      if (e.childType === 'all') {
        this.searchData[e.index].selectId = ''
        this.searchData[e.index].inputVal = ''
        this.setFuzzyData()
      } else if (e.childType === 'select') {
        this.searchData[e.index].selectId = e.value
        this.searchData[e.index].inputVal = ''
        this.setFuzzyData()
      } else {
        this.searchData[e.index].inputVal = e.value || ''
      }
    },
    setFuzzyData() {
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          if (item.selectId === 'conditionForBatchNo') {
            this.$set(item, 'fuzzyData', this.conditionForBatchNoList)
          } else if (item.selectId === 'conditionForDocumentNo') {
            this.$set(item, 'fuzzyData', this.conditionForDocumentNoList)
          } else if (item.selectId === 'conditionForStockCertificateNo') {
            this.$set(item, 'fuzzyData', this.conditionForStockCertificateNoList)
          } else if (item.selectId === 'conditionForStockOutInNoteNo') {
            this.$set(item, 'fuzzyData', this.conditionForStockOutInNoteNoList)
          }
        }
      })
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
      params.exportType = exportType
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.stockCertificateId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/inventory/stockCertificate/export',
        params,
        `${this.getFileNameDate('Stock Certificate')}.xlsx`
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
