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
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-if="isAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
        :showSearchBtn="false"
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
      class="mt10"
      @row-dblclick="handleEdit"
      style="cursor: pointer"
    >
      <el-table-column
        v-if="false"
        type="selection"
        key="column1"
        width="50"
        align="center"
        :selectable="selectable"
      />
      <el-table-column
        type="index"
        key="column2"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
      >
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
        :align="item.align || 'center'"
      >
        <template slot-scope="scope">
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'roleIds'">
            {{ handler(roleList, scope.row.roleIds) }}
          </template>
          <template v-else-if="item.prop === 'reportIds'">
            {{ handler(reportList, scope.row.reportIds) }}
          </template>
          <template v-else-if="item.prop === 'createdTime'">
            {{ parseTime(scope.row.createdTime, fmtForYmdhms) }}
          </template>
          <template v-else-if="item.prop === 'modifiedTime'">
            {{ parseTime(scope.row.modifiedTime, fmtForYmdhms) }}
          </template>

          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="120"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelete(scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      :saveKey="'1'"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <salesReportDlg
      :reportList="reportList"
      :roleList="roleList"
      ref="salesReportDlg"
      @onSuccess="getList"
    />
    <settingDlg ref="settingDlg" />
  </div>
</template>

<script>
import {
  queryViewReportDict,
  queryReportGroupList,
  delReportGroup,
  queryReportGroupListForSearchList,
  queryRoleSearchList
} from '@/api/reportManagement/dashboard'

import salesReportDlg from '@/views/reportManagement/dashboardSetup/salesReportDlg.vue'
import settingDlg from '@/views/reportManagement/dashboardSetup/settingDlg.vue'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/reportManagement/dashboard/lang/index'

const queryParams = {
  pageNum: 1,
  pageSize: 25
}
export default {
  name: 'DashboardSetup',
  mixins: [pageMixin],
  components: {
    salesReportDlg,
    settingDlg
  },
  data() {
    const vm = this
    return {
      saveKey: '1',
      activeName: '1',
      // 选中数组
      ids: [],
      selectList: [],
      // 非单个禁用
      single: true,
      // 遮罩层
      loading: true,
      // 非多个禁用
      multiple: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      tableList: [],
      // 请求参数
      queryParams: { ...queryParams },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('DASHBOARD.reportGroup')}`
        },
        {
          name: 'reportIdList',
          label: vm.$t('DASHBOARD.report'),
          type: 'MultipleSelectEle',
          width: '230px',
          selectValue: 'id',
          selectLabel: 'name',
          selectData: []
        },
        {
          name: 'roleIdList',
          label: vm.$t('ui.role'),
          type: 'MultipleSelectEle',
          width: '230px',
          selectValue: 'roleId',
          selectLabel: 'roleName',
          selectData: []
        },
        {
          name: 'isActive',
          label: vm.$t('ui.isActive'),
          type: 'SelectEle',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: vm.$t('uiBtn.active'), value: '1' },
            { label: vm.$t('uiBtn.inactive'), value: '0' }
          ]
        }
      ],
      columns: [
        {
          prop: 'groupName',
          label: vm.$t('DASHBOARD.reportGroup'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'reportType',
          label: vm.$t('DASHBOARD.system'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'reportIds',
          label: vm.$t('DASHBOARD.report'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'roleIds',
          label: vm.$t('ui.role'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },

        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 180,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 180,
          visible: true,
          tooltip: true
        }
      ],
      // 角色
      roleList: [],
      // 报表
      reportList: []
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
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.queryRoleSearchList()
    this.queryViewReportDict()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    async tabClickHandler(value) {
      this.getList()
    },
    isAdd() {
      this.checkPermi(['reportManagement:dashboardSetup:add'])
    },
    isDelete() {
      return this.checkPermi(['reportManagement:dashboardSetup:delete'])
    },
    handler(data, ids, type) {
      if (!data || data.length <= 0) return ''
      if (!ids) return ''
      const idList = ids.split(',')
      return (
        data
          .filter((x) => idList.indexOf(x.dictValue) !== -1)
          .map((k) => k.dictLabel)
          .join(',') || ''
      )
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true
      queryReportGroupListForSearchList({}).then((res) => {
        const data = res.data || {}
        this.searchData.forEach((item) => {
          if (item.name === 'reportIdList') {
            item.selectData = data.reports || []
          }
          if (item.name === 'roleIdList') {
            item.selectData = data.roles || []
          }
        })
      })
      queryReportGroupList(this.queryParams).then((response) => {
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
    resetSearchForm(isGetList = true) {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables && this.$refs.tables.clearSort()
      if (isGetList) {
        this.getList()
      }
    },
    updateSearchData(e) {
      if (e.childType === 'select') {
        this.searchData[e.index].selectId = e.value
        this.searchData[e.index].date = []
      } else {
        this.searchData[e.index].date = e.value
      }
    },
    // 角色列表
    async queryRoleSearchList() {
      const { data } = await queryRoleSearchList()
      this.roleList = data || []
    },
    // 报表列表
    async queryViewReportDict() {
      const { data } = await queryViewReportDict()
      this.reportList = data || []
      /* if (this.reportList.length <= 0) {
        this.reportList = [
          {
            dictLabel: '报表1',
            dictValue: '1111'
          },
          {
            dictLabel: '报表2',
            dictValue: '2222'
          }
        ]
      } */
    },
    /** 搜索 */
    resetQuery() {
      this.getList()
    },
    // 选中行背景色
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.id) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    // eslint-disable-next-line no-unused-vars
    selectable(row, rowIndex) {
      if (row.status === '4') {
        return false // 禁用
      } else {
        return true // 不禁用
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleEdit(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$refs.salesReportDlg.handleUpdate(row)
    },
    handleDelete(row) {
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          return delReportGroup(row.reportGroupId)
        })
        .then(() => {
          this.$modal.msgSuccess(this.$t('ui.deleteSuccess'))
          this.getList()
        })
        .catch(() => {})
    },
    handleAdd() {
      this.$refs.salesReportDlg.handleAdd()
    },
    handleHomeReports() {
      this.$refs.settingDlg.handleOpen({})
    }
  }
}
</script>
