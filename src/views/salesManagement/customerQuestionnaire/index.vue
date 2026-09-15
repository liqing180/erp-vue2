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
          size="mini"
          v-hasPermi="['salesManagement:customerQuestionnaire:send']"
          @click="handleSend"
          >{{ $t('menu.send') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-hasPermi="['salesManagement:customerQuestionnaire:export']"
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
        v-if="checkPermi(['salesManagement:customerQuestionnaire:export'])"
      >
      </el-table-column>
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
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
        width="180"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div @dblclick.stop>
            <el-popover :ref="'popover_' + scope.$index" placement="bottom">
              <!-- 1:"Pending",2:"Closed",3:"Cancelled" -->
              <dl class="pop-list-inrow">
                <dd @click.stop.prevent="actionHandle(scope.row, 'view', scope.$index)">
                  {{ $t('uiBtn.view') }}
                </dd>
                <dd
                  @click.stop.prevent="actionHandle(scope.row, 'edit', scope.$index)"
                  v-if="editAuth && scope.row.customerQuestionnaireStatus === '1'"
                >
                  {{ $t('uiBtn.edit') }}
                </dd>
                <dd
                  @click.stop.prevent="actionHandle(scope.row, 'createSI', scope.$index)"
                  v-if="createSIAuth && scope.row.isCanCreateSalesInquiry === '1'"
                >
                  {{ $t('SALES.createSI') }}
                </dd>
                <dd
                  @click.stop.prevent="actionHandle(scope.row, 'viewSI', scope.$index)"
                  v-if="createSIAuth && scope.row.isCanViewSalesInquiry === '1'"
                >
                  {{ $t('SALES.viewSI') }}
                </dd>
                <dd
                  @click.stop.prevent="actionHandle(scope.row, 'createSQ', scope.$index)"
                  v-if="createSQAuth && scope.row.isCanCreateSalesQuotation === '1'"
                >
                  {{ $t('SALES.createSQ') }}
                </dd>
                <dd
                  @click.stop.prevent="actionHandle(scope.row, 'viewSQ', scope.$index)"
                  v-if="createSIAuth && scope.row.isCanViewSalesQuotation === '1'"
                >
                  {{ $t('SALES.viewSQ') }}
                </dd>
              </dl>
              <el-button type="text" slot="reference">{{ $t('uiBtn.more') }}</el-button>
            </el-popover>
          </div>
        </template>
        <!--  <template slot-scope="scope" v-if="false">
          <el-button type="text" @click="handleView(scope.row, 'view')">{{
            $t('uiBtn.view')
          }}</el-button>
          <el-button
            type="text"
            @click="handleView(scope.row, 'edit')"
            v-if="editAuth && scope.row.customerQuestionnaireStatus === '1'"
            >{{ $t('uiBtn.edit') }}</el-button
          >
        </template> -->
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

    <!-- 发送 -->
    <sendDlg ref="sendDlg" @onSuccess="getList" />

    <!-- 预览 -->
    <previewQuestionnaireTemplateDlg
      ref="previewQuestionnaireTemplateDlg"
      :isCancel="true"
      @onSuccess="getList"
      :isDisabled="isDisabled"
    />
    <systemOperationLogTableDlg ref="systemOperationLogTableDlg" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import sendDlg from '@/views/salesManagement/customerQuestionnaire/components/sendDlg.vue'
import previewQuestionnaireTemplateDlg from '@/views/salesManagement/questionnaireTemplate/components/previewQuestionnaireTemplateDlg.vue'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'

import {
  queryCustomerQuestionnaireList,
  querySearchList,
  queryCustomerQuestionnaireById,
  queryOperationLogList,
  checkRelationAvailable
} from '@/api/salesManagement/customerQuestionnaire'

export default {
  name: 'CustomerQuestionnaire',
  dicts: ['sys_customer_questionnaire_status'],
  mixins: [pageMixin],
  components: { sendDlg, previewQuestionnaireTemplateDlg, systemOperationLogTableDlg },
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
          prop: 'customerQuestionnaireNo',
          label: vm.$t('SALES.customerQuestionnaireNo'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true,
          fixed: true
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
          prop: 'questionnaireTemplateNo',
          label: vm.$t('SALES.questionnaireNo'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('SALES.customerName'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'costProjectCode',
          label: vm.$t('SALES.projectCode'),
          visible: true,
          minWidth: 200,
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
          prop: 'customerQuestionnaireStatus',
          propBy: 'customerQuestionnaireStatusStr',
          label: vm.$t('ui.status'),
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
          prop: 'cancelledBy',
          label: vm.$t('ui.cancelledBy'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'cancelledTime',
          label: vm.$t('ui.cancelledTime'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'completeTime',
          label: vm.$t('ui.dateCompleted'),
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
          name: 'customerQuestionnaireStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'sys_customer_questionnaire_status',
          selectData: []
        },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('SALES.customerName'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'createdIdList',
          label: vm.$t('ui.createdBy'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'createdId',
          selectLabel: 'createdBy',
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
      },
      isDisabled: true
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
      return this.checkPermi(['salesManagement:customerQuestionnaire:edit'])
    },
    createSIAuth() {
      return this.checkPermi(['salesManagement:salesInquiry:add'])
    },
    createSQAuth() {
      return this.checkPermi(['salesManagement:salesQuotation:add'])
    },
    comVisibleColumn() {
      let arr = this.visibleColumn
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      }
      return arr
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
      if (this.queryParams.productCategoryId && this.queryParams.productCategoryId.length > 0) {
        param.productCategoryId =
          this.queryParams.productCategoryId[this.queryParams.productCategoryId.length - 1]
      } else {
        param.productCategoryId = undefined
      }
      param = this.$trimOfObj(param)
      this.loading = true
      queryCustomerQuestionnaireList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.cancelledTime = this.parseTime(item.cancelledTime, this.fmtForYmdhms)
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.completeTime = this.parseTime(item.completeTime, this.fmtForYmdhms)
            item.customerQuestionnaireStatusStr = this.selectDictLabel(
              this.dict.type.sys_customer_questionnaire_status,
              item.customerQuestionnaireStatus
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
        item.customerQuestionnaireStatusStr = this.selectDictLabel(
          this.dict.type.sys_customer_questionnaire_status,
          item.customerQuestionnaireStatus
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 搜索下拉值
    querySearchList() {
      querySearchList({}).then((res) => {
        const { createdList, customerList } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'createdIdList') {
            this.$set(x, 'selectData', createdList)
          } else if (x.name === 'businessPartnerIdList') {
            this.$set(x, 'selectData', customerList)
          }
        })
      })
    },
    actionHandle(row, type, index) {
      this.$refs[`popover_${index}`].doClose()
      if (type === 'view' || type === 'edit') {
        this.handleView(row, type)
      }
      if (type === 'createSI') {
        checkRelationAvailable({
          questionnaireId: row.customerQuestionnaireId,
          targetType: 'SI'
        })
          .then((res) => {
            this.$router.push({
              path: '/salesManagement/addSalesInquiry',
              query: {
                bpId: row.businessPartnerId,
                customerQuestionnaireId: row.customerQuestionnaireId,
                customerQuestionnaireNo: row.customerQuestionnaireNo,
                costProjectId: row.costProjectId,
                costProjectCode: row.costProjectCode,
                fromSrcPath: encodeURIComponent('/salesManagement/customerQuestionnaire'),
                timeId: Date.now()
              }
            })
          })
          .catch(() => {
            this.getList()
          })
      }
      if (type === 'createSQ') {
        checkRelationAvailable({
          questionnaireId: row.customerQuestionnaireId,
          targetType: 'SQ'
        })
          .then((res) => {
            this.$router.push({
              path: '/salesManagement/addSalesQuotation',
              query: {
                bpId: row.businessPartnerId,
                customerQuestionnaireId: row.customerQuestionnaireId,
                customerQuestionnaireNo: row.customerQuestionnaireNo,
                costProjectId: row.costProjectId,
                costProjectCode: row.costProjectCode,
                fromSrcPath: encodeURIComponent('/salesManagement/customerQuestionnaire'),
                timeId: Date.now()
              }
            })
          })
          .catch(() => {
            this.getList()
          })
      }
      if (type === 'viewSI') {
        this.$router.push({
          path: '/salesManagement/editSalesInquiry',
          query: {
            id: row.salesInquiryId,
            timeId: Date.now(),
            backType: '2'
          }
        })
      }
      if (type === 'viewSQ') {
        this.$router.push({
          path: '/salesManagement/editSalesQuotation',
          query: {
            id: row.salesQuotationMainId,
            timeId: Date.now(),
            backType: '2'
          }
        })
      }
    },
    /* 查看操作日志 */
    handleOperationLog(row) {
      this.$refs.systemOperationLogTableDlg.handleOpen(queryOperationLogList, {
        customerQuestionnaireId: row.customerQuestionnaireId
      })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.customerQuestionnaireId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    handleSend() {
      this.$refs.sendDlg.handleOpen()
    },
    handleView(row, type) {
      queryCustomerQuestionnaireById({ customerQuestionnaireId: row.customerQuestionnaireId })
        .then((res) => {
          if (type === 'view') {
            this.isDisabled = true
          } else {
            this.isDisabled = false
          }
          this.$refs.previewQuestionnaireTemplateDlg.handleOpen(res.data)
        })
        .catch(() => {})
    },
    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      if (this.editAuth && row.customerQuestionnaireStatus === '1') {
        this.handleView(row, 'edit')
      } else if (this.editAuth && row.customerQuestionnaireStatus === '2') {
        this.handleView(row, 'view')
        // this.$router.push({
        //   path: '/salesManagement/editQuestionnaireTemplate',
        //   query: {
        //     id: row.questionnaireTemplateId,
        //     fromSrcPath: '/salesManagement/customerQuestionnaire',
        //     timeId: Date.now()
        //   }
        // })
      } else {
        this.handleView(row, 'view')

        // this.$router.push({
        //   path: '/salesManagement/viewQuestionnaireTemplate',
        //   query: {
        //     id: row.questionnaireTemplateId,
        //     timeId: Date.now()
        //   }
        // })
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
      this.ids = selection.map((item) => item.customerQuestionnaireId)
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
      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.customerQuestionnaireId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.comVisibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/system/customerQuestionnaire/exportCustomerQuestionnaireList',
        params,
        `${this.getFileNameDate('Customer Questionnaire')}.xlsx`
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
.pop-list-inrow {
  margin: 0;
  padding: 0;
  line-height: 32px;
  border: 1px solid #efefef;
  border-radius: 4px;

  dd {
    cursor: pointer;
    border-top: 1px solid #efefef;
    padding: 0 12px;
    margin: 0;
    text-align: center;
  }
  dd:first-of-type {
    border-top: 0;
  }
}
</style>
