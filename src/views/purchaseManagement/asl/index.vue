<template>
  <div class="app-container">
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :isBtn="true"
      :topShowCount="1"
      @updateSearchData="updateSearchData"
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-if="addAuth"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-dropdown
          @command="(command) => seetingHandleCommand(command)"
          v-if="editAuth"
          trigger="click"
          size="small"
        >
          <el-button size="mini" type="primary" :disabled="multiple">
            {{ $t('ui.action') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="suspend" icon="el-icon-turn-off"
              >{{ $t('menu.suspend') }}
            </el-dropdown-item>
            <el-dropdown-item command="resume" icon="el-icon-open"
              >{{ $t('menu.resume') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['purchaseManagement:asl:import']"
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
          v-if="exportAuth"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>

      <right-toolbar
        ref="rightToolbar"
        :saveKey="curSaveKey"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columnsInit="curColumns"
        :columns="configCurColumn"
        @autoRefresh="autoRefresh"
        :refreshTimeSaveKey="'1'"
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
      max-height="500"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
        v-if="exportAuth || editAuth"
        :selectable="selectable"
      />
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in visibleCurColumns"
        :key="item.prop + item.colSortIndex + activeName"
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
          <template v-if="item.prop === 'documentNoListShowStr'">
            <div @mouseenter="showPop($event, scope.row)" @mouseleave="hidePop($event, scope.row)">
              <div class="primary ellipsis-text">{{ scope.row.documentNoListShowStr }}</div>
            </div>
          </template>
          <template
            v-else-if="['documentNo', 'salesOrderNo', 'businessPartnerName'].includes(item.prop)"
          >
            <span class="primary-link" @click="nav(scope.row, item.prop)">{{
              scope.row[item.prop]
            }}</span>
          </template>
          <template v-else-if="item.prop === 'dropShipping'">
            <el-tag v-if="scope.row.dropShipping === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.dropShipping === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            {{ scope.row.unitPriceShowStr }}
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="100"
        fixed="right"
        class-name="small-padding fixed-width"
        v-if="false"
      >
        <template slot-scope="scope">
          <svg-icon
            icon-class="list2"
            class="primary-pointer"
            style="font-size: 20px"
            @click="handleOperationLog(scope.row)"
          />
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
    <systemOperationLogTableDlg ref="systemOperationLogTableDlg" />

    <ToolTipShowListForFN ref="ToolTipShowList" @clickItem="documentClick" />
    <suspendResumeDialog ref="suspendResumeDialog" @submitSuccess="getList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import tableDataMixin from './tableDataMixin'
import locale from '@/views/salesManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
import {
  querySearchList,
  queryApprovedSupplierList,
  querySalesQuotationOperationLog
} from '@/api/purchaseManagement/asl'
import { queryAllCategoryTreeList } from '@/api/productManagement/productCategory'
import suspendResumeDialog from './suspendResumeDialog.vue'

import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'
export default {
  name: 'Asl',
  mixins: [pageMixin, tableDataMixin],
  components: { systemOperationLogTableDlg, ToolTipShowListForFN, suspendResumeDialog },
  data() {
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined
      },
      statusDicts: [],
      approvedStatusDicts: [],
      // 请求的时间戳
      queryTime: undefined,
      // 导入
      importOptions: {
        // 下载模板
        downFileUrl: '/purchase/approvedSupplier/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/purchase/approvedSupplier/checkImportData',
        // 提交导入
        importUrl: '/purchase/approvedSupplier/importData',
        // 下载文件名
        fileName: 'ALS'
      }
    }
  },
  computed: {
    addAuth() {
      return this.checkPermi(['purchaseManagement:asl:add'])
    },

    exportAuth() {
      return this.checkPermi(['purchaseManagement:asl:export'])
    },
    editAuth() {
      return this.checkPermi(['purchaseManagement:asl:edit'])
    },
    curColumns() {
      return this.columnsData[this.activeName] || []
    },
    curSaveKey() {
      return this.columnsSaveKeys[this.activeName] || []
    },
    configCurColumn() {
      const arr = [...this.curColumns]
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
      const arr = this.curColumns.filter((column) => column.visible === true)
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
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  async created() {
    this.createdInitTimer = Date.now()
    this.queryAllCategoryTreeList()

    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    // $$initColumnVisible 在 ./tableDataMixin.js 调用了
    const a = this.MyDictDataClass.getDictFn('p_approved_supplier_status')
    const b = this.MyDictDataClass.getDictFn('approved_status')
    await Promise.all([a, b]).then((res) => {
      const res1 = res[0] || {}
      const res2 = res[1] || {}
      this.statusDicts = (res1 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.approvedStatusDicts = (res2 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
    })

    this.searchData.forEach((item) => {
      if (item.name === 'approvedSupplierStatusList') {
        item.selectData = this.statusDicts
      } else if (item.name === 'approvedStatusList') {
        item.selectData = this.approvedStatusDicts
      }
    })

    this.initQueryParams()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
    this.queryAllCategoryTreeList()
  },
  methods: {
    // 更多操作触发
    seetingHandleCommand(command) {
      if (this.selectList.length <= 0) return
      if (command === 'suspend') {
        const err = this.selectList.find((item) => item.approvedSupplierStatus !== '3')
        if (err) {
          this.$modal.msgError(this.$t('PURCHASE.suspendStatusErr'))
          return
        }
        // PURCHASE.suspendStatusErr
        this.$refs.suspendResumeDialog.handleOpen({
          list: JSON.parse(JSON.stringify(this.selectList)),
          ids: JSON.parse(JSON.stringify(this.ids)),
          isActive: '0'
        })
      }
      if (command === 'resume') {
        const err = this.selectList.find((item) => item.approvedSupplierStatus !== '4')
        if (err) {
          this.$modal.msgError(this.$t('PURCHASE.resumeStatusErr'))
          return
        }
        this.$refs.suspendResumeDialog.handleOpen({
          list: JSON.parse(JSON.stringify(this.selectList)),
          ids: JSON.parse(JSON.stringify(this.ids)),
          isActive: '1'
        })
      }
    },
    showPop(e, row) {
      const list = row.documentMsgList || []
      const params = {
        popoverTitle: this.$t('PURCHASE.DocNo'),
        labelKey: 'documentNo',
        itemClass: 'primary-pointer',
        list
      }
      if (list.length > 0 && this.$refs.ToolTipShowList) {
        this.$refs.ToolTipShowList.showPop(e, params)
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    documentClick(item) {
      console.log(item)
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      if (item.priceType === '0') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseRequisition',
          query: {
            id: item.documentId,
            timeId: Date.now()
          }
        })
      } else if (item.priceType === '1') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseQuotation',
          query: {
            id: item.documentId,
            timeId: Date.now()
          }
        })
      } else if (item.priceType === '2') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseContract',
          query: {
            id: item.documentId,
            timeId: Date.now()
          }
        })
      }
    },
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      // const end = this.appointTime(Date.now(), '23:59:59')
      // const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      // this.$set(this.queryParams, 'dateRange', [startTimer, end])
      // this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
      // this.$set(this.queryParams, 'endDateCreatedTime', end)
    },

    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.approvedSupplierMainId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }

      return color
    },
    // eslint-disable-next-line no-unused-vars
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    autoRefresh() {
      this.getList({ noLoading: true })
    },
    /** 查询用户列表 */
    getList(query) {
      const timer = Date.now()
      this.queryTime = timer
      this.querySearchList()
      this.loading = true
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      let params = { ...this.queryParams }

      params = this.$trimOfObj(params)

      if (params.productCategoryIds && params.productCategoryIds.length > 0) {
        params.productCategoryIdList = params.productCategoryIds.map((x) => x.value)
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryIds
      // params.labelType = this.activeName
      if (params.orderByColumn === 'unitPriceShowStr') {
        params.orderByColumn = 'unitPrice'
      }
      queryApprovedSupplierList(params).then((response) => {
        if (timer !== this.queryTime) return
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          item.effectiveDate = this.parseTime(item.effectiveDate, this.fmtForYmd)
          item.expiryDate = this.parseTime(item.expiryDate, this.fmtForYmd)
          if (!item.unitPriceShowStr) {
            item.unitPriceShowStr = `${this.$numberStr(item.unitPrice, 2)}`
          }

          item.approvedSupplierStatusStr = this.selectDictLabel(
            this.statusDicts,
            item.approvedSupplierStatus
          )
          item.approvedStatusStr = this.selectDictLabel(
            this.approvedStatusDicts,
            item.approvedStatus
          )
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.curColumns, this.tableList)
      })
    },
    querySearchList() {
      // { labelType: this.activeName }
      querySearchList({}).then((res) => {
        const data = res.data || {}
        /* const categoryTree = data.categoryTree || []
        this.handle(categoryTree) */
        this.searchData.forEach((item) => {
          if (item.name === 'createdIdList') {
            this.$set(item, 'selectData', data.createdList || [])
          } else if (item.name === 'businessPartnerIdList') {
            this.$set(item, 'selectData', data.businessPartnerList || [])
          } /*  else if (item.name === 'productCategoryIds') {
            this.$set(item, 'selectData', categoryTree)
          } */
        })
      })
    },
    queryAllCategoryTreeList() {
      queryAllCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.searchData.forEach((item) => {
          if (item.name === 'productCategoryIds') {
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

    /** 搜索 */
    handleSearchForm() {
      // const param = this.$trimOfObj(query)
      // this.queryParams = { ...param }
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      this.initQueryParams()

      // this.searchFormKey = Date.now()
      this.$refs.tables.clearSort()
      this.getList()
    },
    updateSearchData() {},

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.approvedSupplierMainId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/purchaseManagement/addAsl',
        query: {
          timeId: Date.now()
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/purchaseManagement/editAsl',
        query: {
          id: row.approvedSupplierMainId,
          timeId: Date.now()
        }
      })
    },

    nav(row, type) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      if (type === 'documentNo') {
        if (row.documentType === 'SalesInquiry') {
          this.$router.push({
            path: '/salesManagement/viewSalesInquiry',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }
      }
      if (type === 'businessPartnerName') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.businessPartnerId,
            timeId: Date.now()
          }
        })
      }
    },

    /* 查看操作日志 */
    handleOperationLog(row) {
      this.$refs.systemOperationLogTableDlg.handleOpen(querySalesQuotationOperationLog, {
        approvedSupplierMainId: row.approvedSupplierMainId
      })
    },
    /** 导出按钮操作 */
    /** 导出按钮操作 */
    openExport() {
      this.$refs.ExportDlgRef.open()
    },
    handleExport(data) {
      const vm = this
      const { exportType } = data
      let params = { ...this.queryParams }
      params = JSON.parse(JSON.stringify(params))

      params = this.$trimOfObj(params)

      if (params.productCategoryIds && params.productCategoryIds.length > 0) {
        params.productCategoryIdList = params.productCategoryIds.map((x) => x.value)
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryIds

      // params.labelType = this.activeName
      params.exportType = exportType

      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.approvedSupplierMainId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.curColumns.map((item) => item.prop)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/purchase/approvedSupplier/export',
        params,
        `${this.getFileNameDate('ASL')}.xlsx`
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
.flexSb {
  display: flex;
  justify-content: space-between;
}
.flexCen {
  display: flex;
  justify-content: center;
}
</style>
