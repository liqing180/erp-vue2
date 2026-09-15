<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item :label="$t('ui.ipaddr')" prop="ipaddr">
        <el-input
          v-model="queryParams.ipaddr"
          placeholder=" "
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="`${$t('ui.userName')}`" prop="userName">
        <el-input
          v-model="queryParams.userName"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{
          $t('uiBtn.search')
        }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{
          $t('uiBtn.reset')
        }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      v-loading="loading"
      :data="list.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
      style="width: 100%"
      :max-height="600"
    >
      <el-table-column :label="$t('ui.sn')" type="index" align="center">
        <template slot-scope="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.sessionNo')"
        align="center"
        prop="tokenId"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('ui.userId')"
        align="center"
        prop="userName"
        :show-overflow-tooltip="true"
      />
      <el-table-column :label="$t('ui.deptName')" align="center" prop="deptName" />
      <el-table-column
        :label="$t('ui.ipaddr')"
        align="center"
        prop="ipaddr"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('ui.loginLocation')"
        align="center"
        prop="loginLocation"
        :show-overflow-tooltip="true"
      />
      <el-table-column :label="$t('ui.browser')" align="center" prop="browser" />
      <el-table-column :label="$t('ui.operSystem')" align="center" prop="os" />
      <el-table-column :label="$t('ui.loginTime')" align="center" prop="loginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleForceLogout(scope.row)"
            v-hasPermi="['monitor:online:forceLogout']"
            >{{ $t('ui.forceLogout') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" />
  </div>
</template>

<script>
import { list, forceLogout } from '@/api/monitor/online'

export default {
  name: 'Online',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      pageNum: 1,
      pageSize: 25,
      // 查询参数
      queryParams: {
        ipaddr: undefined,
        userName: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      list(params).then((response) => {
        this.list = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 强退按钮操作 */
    handleForceLogout(row) {
      this.$modal
        .confirm('是否确认强退名称为"' + row.userName + '"的数据项？')
        .then(function () {
          return forceLogout(row.tokenId)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('强退成功')
        })
        .catch(() => {})
    }
  }
}
</script>
