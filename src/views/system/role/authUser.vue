<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item :label="`${$t('ui.userName')}`" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('ui.mobilePhone')" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
          {{ $t('uiBtn.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          {{ $t('uiBtn.reset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="openSelectUser"
          v-hasPermi="['system:role:add']"
          >{{ $t('ui.addUser') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-circle-close"
          size="mini"
          :disabled="multiple"
          @click="cancelAuthUserAll"
          v-hasPermi="['system:role:remove']"
          >{{ $t('ui.batchCancelAuth') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-close" size="mini" @click="handleClose">
          {{ $t('uiBtn.back') }}
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      border
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      :max-height="600"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        :label="$t('ui.userId')"
        prop="userName"
        min-width="120px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('ui.userName')"
        prop="nickName"
        min-width="120px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('ui.email')"
        prop="email"
        min-width="120px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('ui.mobilePhone')"
        min-width="120px"
        prop="phonenumber"
        :show-overflow-tooltip="true"
      />
      <el-table-column :label="$t('ui.isActive')" min-width="120px" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '0'">{{ $t('uiBtn.active') }}</el-tag>
          <el-tag v-if="scope.row.status === '1'" type="danger">{{ $t('uiBtn.inactive') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.createdTime')"
        min-width="180px"
        align="center"
        prop="createdTime"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        min-width="100px"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="cancelAuthUser(scope.row)"
            v-hasPermi="['system:role:remove']"
          >
            {{ $t('ui.cancelAuth') }}</el-button
          >
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
    <select-user ref="select" :roleId="queryParams.roleId" @ok="handleQuery" />
  </div>
</template>

<script>
import { allocatedUserList, authUserCancel, authUserCancelAll } from '@/api/system/role'
import selectUser from './selectUser'
import pageMixin from '@/mixins/tableMinx'

export default {
  name: 'AuthUser',
  mixins: [pageMixin],
  components: { selectUser },
  data() {
    return {
      saveKey: '1',
      // 遮罩层
      loading: true,
      // 选中用户组
      userIds: [],
      selectList: [],
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
        roleId: undefined,
        nickName: undefined,
        phonenumber: undefined
      }
    }
  },
  created() {
    const roleId = this.$route.params && this.$route.params.roleId
    if (roleId) {
      this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      this.queryParams.roleId = roleId
      this.getList()
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.userIds.values()) {
        if (item === row.userId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    /** 查询授权用户列表 */
    getList() {
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      allocatedUserList(params).then((response) => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 返回按钮
    handleClose() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/system/role' })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map((item) => item.userId)
      this.selectList = [...selection]
      this.multiple = !selection.length
    },
    /** 打开授权用户表弹窗 */
    openSelectUser() {
      this.$refs.select.show()
    },
    /** 取消授权按钮操作 */
    cancelAuthUser(row) {
      const roleId = this.queryParams.roleId
      this.$modal
        .confirm(this.$t('ui.cancelAuthConfirm').replace('$1', row.userName))
        .then(function () {
          return authUserCancel({ userId: row.userId, roleId: roleId })
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('ui.cancelAuthSuccess'))
        })
        .catch(() => {})
    },
    /** 批量取消授权按钮操作 */
    cancelAuthUserAll(row) {
      const roleId = this.queryParams.roleId
      const userIds = this.userIds.join(',')
      const userNames = this.selectList.map((item) => item.userName).join(', ')
      this.$modal
        .confirm(this.$t('ui.cancelAuthConfirm').replace('$1', userNames))
        .then(function () {
          return authUserCancelAll({ roleId: roleId, userIds: userIds })
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('ui.cancelAuthSuccess'))
        })
        .catch(() => {})
    }
  }
}
</script>
