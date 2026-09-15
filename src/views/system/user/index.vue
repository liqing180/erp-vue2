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
    />

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['organization:user:add']"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="false">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['organization:user:import']"
          >{{ $t('uiBtn.import') }}</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"

          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-hasPermi="['organization:user:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-dropdown
          @command="(command) => seetingHandleCommand(command)"
          v-hasPermi="[
            'organization:user:remove',
            'organization:user:edit',
            'organization:user:resetPwd'
          ]"
          v-if="!multiple"
          trigger="click"
        >
          <el-button size="mini" type="primary" :disabled="multiple">
            {{ $t('ui.action') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="delete"
              icon="el-icon-delete"
              v-hasPermi="['organization:user:remove']"
              >{{ $t('uiBtn.delete') }}
            </el-dropdown-item>
            <el-dropdown-item
              command="handleResetPwd"
              icon="el-icon-key"
              v-hasPermi="['organization:user:resetPwd']"
              >{{ $t('uiBtn.resetPassword') }}
            </el-dropdown-item>
            <el-dropdown-item
              command="active"
              icon="el-icon-open"
              v-hasPermi="['organization:user:edit']"
              >{{ $t('uiBtn.activeBtn') }}
            </el-dropdown-item>
            <el-dropdown-item
              command="inactive"
              icon="el-icon-turn-off"
              v-hasPermi="['organization:user:edit']"
              >{{ $t('uiBtn.inactiveBtn') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
        v-if="
          checkPermi([
            'organization:user:remove',
            'organization:user:edit',
            'organization:user:resetPwd'
          ])
        "
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
          <dict-tag
            v-if="item.prop === 'status'"
            :options="dict.type.user_status"
            :value="scope.row[item.prop]"
          />
          <template v-else-if="item.prop === 'loginDate'">{{
            parseTime(scope.row.loginDate, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'createdTime'">{{
            parseTime(scope.row.createdTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'modifiedTime'">{{
            parseTime(scope.row.modifiedTime, fmtForYmdhms)
          }}</template>
          <dict-tag
            v-else-if="item.prop === 'sex'"
            :options="dict.type.sys_user_sex"
            :value="scope.row[item.prop]"
          />
          <template v-else>{{ scope.row[item.prop] }}</template>
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
          <div class="flexCen">
            <i
              class="el-icon-edit pointer mr5"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.edit')"
              v-hasPermi="['organization:user:edit']"
              @click="handleUpdate(scope.row)"
            ></i>
            <i
              v-hasPermi="['organization:user:remove']"
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelete(scope.row)"
            ></i>
            <el-dropdown
              size="mini"
              @command="(command) => handleCommand(command, scope.row)"
              v-hasPermi="['organization:user:resetPwd', 'organization:user:edit']"
              v-if="scope.row.adminFlag !== 1"
            >
              <span class="el-dropdown-link">
                <i class="el-icon-d-arrow-right el-icon--right"></i>{{ $t('uiBtn.more') }}
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  command="handleResetPwd"
                  icon="el-icon-key"
                  v-hasPermi="['organization:user:resetPwd']"
                  >{{ $t('uiBtn.resetPassword') }}</el-dropdown-item
                >
                <!-- <el-dropdown-item
                command="handleAuthRole"
                icon="el-icon-circle-check"
                v-hasPermi="['organization:user:edit']"
                >{{ $t('menu.assignRole') }}</el-dropdown-item
              > -->
              </el-dropdown-menu>
            </el-dropdown>
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
    <!-- 导入 -->
    <file-import
      :importOptions="importOptions"
      @updateImport="updateImport"
      @importTemplate="importTemplate"
      @fileImportSuccess="getList"
    ></file-import>

    <!-- query role -->
    <assignRoleDlg ref="assignRoleDlgRef" />

    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
  </div>
</template>

<script>
import {
  listUser,
  deleteUser,
  exportUser,
  changeStatusList,
  importTemplate,
  resetPassword
} from '@/api/system/user'
import pageMixin from '@/mixins/tableMinx'
import assignRoleDlg from './assignRoleDlg'
export default {
  // eslint-disable-next-line
  name: 'User',
  dicts: ['sys_user_sex', 'user_status', 'system_active'],
  mixins: [pageMixin],
  components: {
    assignRoleDlg
  },
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
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 导入
      importOptions: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: vm.$t('ui.userImport'),
        // 是否禁用上传
        isUploading: false,
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/user/importData'
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
          placeholder: `${vm.$t('ui.userId')} / ${vm.$t('ui.userName1')} / ${vm.$t(
            'ui.employeeNo'
          )}`
        },
        {
          name: 'status',
          label: vm.$t('ui.status'),
          type: 'SelectEle',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'user_status',
          selectData: []
        }
      ],
      // 列信息
      columns: [
        {
          prop: 'userName',
          label: vm.$t('ui.userId'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        },
        {
          prop: 'employeeNo',
          label: vm.$t('ui.employeeNo'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'nickName',
          label: vm.$t('ui.userName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'sex',
          label: vm.$t('ui.sex'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'mobilePhone',
          label: vm.$t('ui.mobilePhone'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'postName',
          label: vm.$t('ui.position'),
          minWidth: 140,
          visible: true,
          tooltip: true
          // sortable: 'custom'
        },

        {
          prop: 'email',
          label: vm.$t('ui.email'),
          minWidth: 180,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'status',
          label: vm.$t('ui.status'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'loginDate',
          label: vm.$t('ui.lastLoginDate'),
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
        }
        // {
        //   prop: 'modifiedBy',
        //   label: vm.$t('ui.modifiedBy'),
        //   minWidth: 160,
        //   visible: true,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
        // {
        //   prop: 'modifiedTime',
        //   label: vm.$t('ui.modifiedTime'),
        //   minWidth: 160,
        //   visible: true,
        //   tooltip: true,
        //   sortable: 'custom'
        // }
      ]
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['organization:user:edit'])
    }
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getList()
    this.getConfigKey('sys.user.initPassword').then((response) => {
      this.initPassword = response.msg
    })
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.userId) {
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
      this.loading = true
      // const params = this.$trimOfObj(this.queryParams)
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      listUser(params).then((response) => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
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
      this.ids = selection.map((item) => item.userId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    seetingHandleCommand(command) {
      switch (command) {
        case 'delete':
          this.handleDelete({})
          break
        case 'handleResetPwd':
          this.handleResetPwd({})
          break
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
    handleCommand(command, row) {
      switch (command) {
        case 'handleResetPwd':
          this.handleResetPwd(row)
          break
        case 'handleAuthRole':
          this.handleAuthRole(row)
          break
        default:
          break
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/user/addUser',
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
        path: '/user/editUser',
        query: {
          id: row.userId,
          timeId: Date.now()
        }
      })
    },

    /** 批量修改用户状态 */
    handleChangeUsersStatus(type) {
      const userNames = this.selectList.map((item) => item.userName).join(', ')
      const status = type === 'active' ? '0' : '1'
      let confirmMsg = this.$t('ui.changeUserInactive').replace('$1', userNames)
      if (type === 'active') {
        confirmMsg = this.$t('ui.changeUserActive').replace('$1', userNames)
      }
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          return changeStatusList(this.ids, status)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('ui.changeUserActiveSuccess'))
        })
        .catch(() => {})
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      const userNames = this.selectList.map((item) => item.userName).join(', ')
      // const initPassword = this.initPassword || '123456'
      const confirmMsg = this.$t('ui.resetPsdConfirm')
        .replace('$1', row.userName || userNames)
        .replace('$2', '******')
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          if (row.userId) {
            resetPassword({ selectIdList: [row.userId] }).then((response) => {
              this.$modal.msgSuccess(this.$t('ui.resetPsdSuccess').replace('$1', '******'))
            })
          } else {
            resetPassword({ selectIdList: this.ids }).then((response) => {
              this.$modal.msgSuccess(this.$t('ui.resetPsdSuccess').replace('$1', '******'))
            })
          }
        })
        .catch(() => {})
    },
    /** 分配角色操作 */
    handleAuthRole(row) {
      // const userId = row.userId
      // this.$router.push('/system/user-auth/role/' + userId)
      this.$refs.assignRoleDlgRef.handleQueryRole(row)
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId ? [row.userId] : this.ids
      const userNames = this.selectList.map((item) => item.userName).join(', ')

      this.$modal
        .confirm(this.$t('ui.delUserConfirm').replace('$1', row.userName || userNames))
        .then(function () {
          return deleteUser(userIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('ui.deleteSucceeded'))
        })
        .catch(() => {})
    },
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
        params.exportIdList = vm.tableList.map((item) => item.userId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      vm.exportLoading = true
      exportUser(params)
        .then((response) => {
          vm.$download.name(response.msg)
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
      this.importOptions.open = true
    },
    /** 更新导入字段 */
    updateImport(key, value) {
      this.importOptions[key] = value
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.$download.name(response.msg)
      })
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
