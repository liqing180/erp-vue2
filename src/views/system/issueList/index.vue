<template>
  <div class="app-container">
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      @updateSearchData="updateSearchData"
      v-show="showSearch"
      :topShowCount="1"
    />

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:issueList:add']"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleAction"
          v-hasPermi="['system:issueList:edit']"
          >{{ $t('ui.action') }}</el-button
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
      ref="tables"
      border
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        key="selection"
        align="center"
        width="55"
        v-if="editAuth"
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
        :min-width="item.minWidth"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot-scope="scope">
          <template v-if="item.prop === 'createdTime'">{{
            parseTime(scope.row[item.prop], fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'modifiedTime'">{{
            parseTime(scope.row[item.prop], fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'scheduledOptimizationDate'">{{
            parseTime(scope.row[item.prop], fmtForYmd)
          }}</template>
          <template v-else-if="item.prop === 'releaseDate'">{{
            parseTime(scope.row[item.prop], fmtForYmd)
          }}</template>
          <span v-else-if="item.prop === 'module'">{{
            moduleTitlesStr(scope.row[item.prop])
          }}</span>
          <template v-else-if="item.prop === 'status'">{{
            selectDictLabel(dict.type.issue_status, scope.row[item.prop])
          }}</template>
          <template v-else-if="item.prop === 'typeId'">{{
            selectDictLabel(dict.type.issue_type, scope.row[item.prop])
          }}</template>
          <template v-else-if="item.prop === 'priorityId'">{{
            selectDictLabel(dict.type.issue_priority, scope.row[item.prop])
          }}</template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        class-name="small-padding fixed-width"
        width="100"
        fixed="right"
        v-if="editAuth"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-edit pointer mr5"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.edit')"
              @click="handleUpdate(scope.row)"
            ></i>
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

    <actionDlg ref="actionDlg" @onSuccess="getList" />
  </div>
</template>

<script>
import { queryIssueList } from '@/api/system/issueList'
import pageMixin from '@/mixins/tableMinx'
import locale from './locale'
import actionDlg from './actionDlg.vue'

export default {
  name: 'IssueList',
  dicts: ['issue_type', 'issue_status', 'issue_priority'],
  mixins: [pageMixin],
  components: {
    actionDlg
  },
  data() {
    const vm = this
    return {
      saveKey: '1',
      btnLoading: false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      tableList: [],
      columns: [
        {
          prop: 'issueNo',
          label: vm.$t('issue.issueNo'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'module',
          label: vm.$t('issue.module'),
          minWidth: 240,
          visible: true,
          sortable: 'custom',
          tooltip: true,
          fixed: true
        },
        {
          prop: 'status',
          label: vm.$t('issue.status'),
          minWidth: 180,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          minWidth: 300,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'typeId',
          label: vm.$t('issue.issueType'),
          minWidth: 230,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'reason',
          label: vm.$t('issue.reason'),
          minWidth: 300,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          minWidth: 300,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'userName',
          label: vm.$t('issue.userName'),
          minWidth: 180,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        /* {
          prop: 'deptName',
          label: vm.$t('issue.dept'),
          minWidth: 120,
          visible: true,
          sortable: 'custom',
          tooltip: true
        }, */
        {
          prop: 'priorityId',
          label: vm.$t('issue.priority'),
          minWidth: 120,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'scheduledOptimizationDate',
          label: vm.$t('issue.scheduledOptimizationDate'),
          minWidth: 280,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'releasePerson',
          label: vm.$t('issue.releasePerson'),
          minWidth: 180,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'releaseDate',
          label: vm.$t('issue.releasedDate'),
          minWidth: 180,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 180,
          sortable: 'custom',
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 180,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 180,
          sortable: 'custom',
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 180,
          visible: true,
          sortable: 'custom',
          tooltip: true
        }
      ],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        typeId: undefined,
        status: undefined,
        priorityId: undefined,
        dateRange: []
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('issue.issueNo')} / ${vm.$t('ui.description')}`
        },
        {
          name: 'typeId',
          label: vm.$t('issue.issueType'),
          type: 'SelectEle',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'issue_type',
          selectData: []
        },
        {
          name: 'status',
          label: vm.$t('issue.status'),
          type: 'SelectEle',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'issue_status',
          selectData: []
        },
        {
          name: 'priorityId',
          label: vm.$t('issue.priority'),
          type: 'SelectEle',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'issue_priority',
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDate',
          endDate: 'endDate'
        }
      ]
    }
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },

    editAuth() {
      return this.checkPermi(['system:issueList:edit'])
    }
  },
  methods: {
    selectable(row) {
      // 状态是Published（已经解决），不能勾选
      if (row.status === '4') {
        return false // 禁用
      } else {
        return true // 不禁用
      }
    },
    moduleTitlesStr(moduleStr) {
      let str = ' '
      if (moduleStr) {
        str = moduleStr
          .split(',')
          .map((item) => {
            return this.getMenuTitle(item)
          })
          .join(' / ')
      }
      return str
    },
    /** 查询岗位列表 */
    getList() {
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      queryIssueList(params).then((response) => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables.clearSort()
      this.getList()
    },
    updateSearchData(e) {
      if (e.childType === 'select') {
        this.searchData[e.index].selectId = e.value
        this.searchData[e.index].date = []
      } else {
        this.searchData[e.index].date = e.value
      }
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/system/addIssue',
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
        path: '/system/editIssue',
        query: {
          timeId: Date.now(),
          id: row.id
        }
      })
    },
    handleAction(row) {
      const issueIds = row.id || this.ids
      this.$refs.actionDlg.handleAction(issueIds)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const postIds = row.id || this.ids
      this.$modal
        .confirm(this.$t('ui.delConfirm').replace('$1', postIds))
        .then(function () {
          // return delUom(postIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('ui.deleteSuccess'))
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      // const queryParams = this.queryParams
      this.$modal
        .confirm(this.$t('ui.exportUomConfirm'))
        .then(() => {
          this.exportLoading = true
          // return exportUom(queryParams)
        })
        .then((response) => {
          this.$download.name(response.msg)
          this.exportLoading = false
        })
        .catch(() => {})
    }
  }
}
</script>
