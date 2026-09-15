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
      :isBtn="true"
      v-show="showSearch"
      @updateSearchData="updateSearchData"
    />

    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-hasPermi="['salesManagement:questionnaireTemplate:add']"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-hasPermi="['salesManagement:questionnaireTemplate:export']"
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
      @selection-change="handleSelectionChange"
      @row-dblclick="handleDblclick"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
        align="center"
        v-if="checkPermi(['salesManagement:questionnaireTemplate:export'])"
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
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="80"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div
            class="flexCen"
            v-if="
              scope.row.isActive === '1' &&
              checkPermi(['salesManagement:questionnaireTemplate:write'])
            "
          >
            <svg-icon
              icon-class="write"
              class="primary-pointer"
              style="font-size: 20px"
              @click="handleEdit(scope.row)"
            />
          </div>
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
import locale from '@/views/salesManagement/lang/index'

import {
  queryQuestionnaireTemplateList,
  querySearchList
} from '@/api/salesManagement/questionnaireTemplate'

export default {
  name: 'QuestionnaireTemplate',
  dicts: ['p_purchase_order_detail_status'],
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
      columns: [
        {
          prop: 'questionnaireTemplateNo',
          label: vm.$t('SALES.questionnaireNo'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'questionnaireTemplateName',
          label: vm.$t('SALES.questionnaireName'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'productCategoryName',
          label: vm.$t('SALES.productCategory'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'questionsCount',
          label: vm.$t('SALES.numberOfQuestions'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
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
        {
          name: 'condition',
          placeholder: `${this.$t('SALES.questionnaireName')} / ${this.$t('SALES.no')}`,
          type: 'InputEle'
        },
        {
          name: 'isActiveList',
          label: vm.$t('ui.isActive'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'system_active',
          selectData: []
        },
        {
          name: 'productCategoryId',
          label: this.$t('SALES.productCategory'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'id',
          mapLabel: 'categoryName',
          checkStrictly: true,
          multiple: true,
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
      importOptions: {
        // 下载模板
        downFileUrl: '/system/productSheet/importTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/system/productSheet/checkImportData',
        // 提交导入
        importUrl: '/system/productSheet/importData',
        // 下载文件名
        fileName: 'productInformationSheet'
      }
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
      return this.checkPermi(['salesManagement:questionnaireTemplate:edit'])
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

    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
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
      param = this.$trimOfObj(param)
      this.loading = true
      queryQuestionnaireTemplateList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.purchaseOrderDetailStatusStr = this.selectDictLabel(
              this.dict.type.p_purchase_order_detail_status,
              item.purchaseOrderDetailStatus
            )
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
    onDictReady() {
      this.tableList.forEach((item) => {
        item.purchaseOrderDetailStatusStr = this.selectDictLabel(
          this.dict.type.p_purchase_order_detail_status,
          item.purchaseOrderDetailStatus
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    handler(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          if (x.child && x.child.length > 0) {
            x.children = x.child
            this.handler(x.child)
          }
        })
      }
    },
    // 搜索下拉值
    querySearchList() {
      querySearchList({}).then((res) => {
        const { productCategoryList } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'productCategoryId') {
            const arr = productCategoryList
            this.handler(arr)
            this.$set(x, 'selectData', arr)
          }
        })
      })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.questionnaireTemplateId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    handleAdd() {
      this.$router.push({
        path: '/salesManagement/addQuestionnaireTemplate',
        query: {
          timeId: Date.now()
        }
      })
    },
    handleEdit(row) {
      this.$router.push({
        path: '/salesManagement/writeQuestionnaireTemplate',
        query: {
          id: row.questionnaireTemplateId,
          timeId: Date.now()
        }
      })
    },
    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      if (this.editAuth) {
        this.$router.push({
          path: '/salesManagement/editQuestionnaireTemplate',
          query: {
            id: row.questionnaireTemplateId,
            timeId: Date.now()
          }
        })
      } else {
        this.$router.push({
          path: '/salesManagement/viewQuestionnaireTemplate',
          query: {
            id: row.questionnaireTemplateId,
            timeId: Date.now()
          }
        })
      }
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
          if (item.selectId === 'conditionForQN') {
            this.$set(item, 'fuzzyData', this.conditionForPOList)
          } else if (item.selectId === 'conditionForStockInNo') {
            this.$set(item, 'fuzzyData', this.conditionForStockInNoList)
          }
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.questionnaireTemplateId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.questionnaireTemplateId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/system/questionnaireTemplate/exportQuestionnaireTemplateList',
        params,
        `${this.getFileNameDate('Questionnaire Template')}.xlsx`
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
