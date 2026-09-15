<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item :label="`${$t('ui.ipaddr')}`" prop="ipaddr">
        <el-input
          v-model="queryParams.ipaddr"
          clearable
          style="width: 240px"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="`${$t('ui.userName')}`" prop="userName">
        <el-input
          v-model="queryParams.userName"
          clearable
          style="width: 240px"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('ui.loginStatus')" prop="status">
        <el-select
          v-model="queryParams.status"
          clearable
          size="small"
          style="width: 240px"
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.sys_common_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('ui.loginTime')">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('ui.startDate')"
          :end-placeholder="$t('ui.endDate')"
          :format="fmtForYmd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
          >{{ $t('uiBtn.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >{{ $t('uiBtn.reset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:logininfor:remove']"
          >{{ $t('uiBtn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleClean"
          v-hasPermi="['system:logininfor:remove']"
          >{{ $t('uiBtn.clear') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-unlock"
          size="mini"
          :disabled="single"
          @click="handleUnlock"
          v-hasPermi="['system:logininfor:unlock']"
          >{{ $t('menu.accountUnlock') }}</el-button
        >
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="queryTable"></right-toolbar>
    </el-row>

    <el-table
      ref="tables"
      border
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
      :max-height="600"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="$t('ui.operId')" align="left" prop="infoId" :min-width="160" />
      <el-table-column
        :min-width="160"
        :label="$t('ui.userName')"
        align="left"
        prop="userName"
        :show-overflow-tooltip="true"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        :min-width="160"
        :label="$t('ui.ipaddr')"
        align="left"
        prop="ipaddr"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :min-width="160"
        :label="$t('ui.loginLocation')"
        align="left"
        prop="loginLocation"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :min-width="160"
        :label="$t('ui.browser')"
        align="left"
        prop="browser"
        :show-overflow-tooltip="true"
      />
      <el-table-column :label="$t('ui.operSystem')" align="left" prop="os" :min-width="160" />
      <el-table-column :label="$t('ui.loginStatus')" align="left" prop="status" :min-width="160">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_common_status" :value="scope.row.status" />
        </template>
      </el-table-column>

      <el-table-column :label="$t('ui.actionMsg')" align="left" prop="msg" :min-width="160">
        <template slot-scope="scope">
          <span v-if="language === 'zh'">{{ scope.row.msg }}</span>
          <span v-else>{{ scope.row.msgEn }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.operTime')"
        align="left"
        prop="accessTime"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
        :min-width="160"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.accessTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  list,
  delLogininfor,
  cleanLogininfor,
  exportLogininfor,
  unlockLogininfor
} from '@/api/monitor/logininfor'
import pageMixin from '@/mixins/tableMinx'
export default {
  name: 'Logininfor',
  dicts: ['sys_common_status'],
  mixins: [pageMixin],
  data() {
    return {
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
      // 选择用户名
      selectName: '',
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      tableList: [],
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: { prop: 'loginTime', order: 'descending' },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        ipaddr: undefined,
        userName: undefined,
        status: undefined
      }
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true
      let params = this.addDateRange(this.queryParams, this.dateRange)
      params = this.$trimOfObj(params)
      list(params).then((response) => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
      this.handleQuery()
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.infoId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      this.selectName = selection.map((item) => item.userName)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const infoIds = row.infoId || this.ids
      this.$modal
        .confirm(this.$t('ui.logininforDelConfirm').replace('$1', infoIds))
        .then(function () {
          return delLogininfor(infoIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('ui.deleteSuccess'))
        })
        .catch(() => {})
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$modal
        .confirm(this.$t('ui.logininforClearConfirm'))
        .then(function () {
          return cleanLogininfor()
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('ui.clearedSuccess'))
        })
        .catch(() => {})
    },
    /** 解锁按钮操作 */
    handleUnlock() {
      const username = this.selectName
      this.$modal
        .confirm('是否确认解锁用户"' + username + '"数据项?')
        .then(function () {
          return unlockLogininfor(username)
        })
        .then(() => {
          this.$modal.msgSuccess('用户解锁成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$modal
        .confirm(this.$t('ui.logininforExportConfirm'))
        .then(() => {
          this.exportLoading = true
          return exportLogininfor(queryParams)
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
