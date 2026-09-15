<template>
  <!-- 授权用户 -->
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('ui.addUser')"
    :visible.sync="visible"
    width="900px"
    top="5vh"
    append-to-body
  >
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item :label="`${$t('ui.userName')}`" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('ui.mobilePhone')" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          clearable
          size="small"
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
    <el-row>
      <el-table
        border
        :row-class-name="tableRowClassName"
        @row-click="clickRow"
        ref="tables"
        :data="userList"
        @selection-change="handleSelectionChange"
        :max-height="tableMaxHeight"
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column
          :label="`${$t('ui.userId')}`"
          min-width="120px"
          prop="userName"
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
          prop="phonenumber"
          min-width="120px"
          :show-overflow-tooltip="true"
        />
        <el-table-column :label="$t('ui.isActive')" min-width="120px" align="center" prop="status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '0'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.status === '1'" type="danger">
              {{ $t('uiBtn.inactive') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('ui.createdTime')"
          align="center"
          prop="createdTime"
          min-width="180px"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createdTime) }}</span>
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
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" @click="handleSelectUser">{{ $t('uiBtn.submit') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { unallocatedUserList, authUserSelectAll } from '@/api/system/role'
import pageMixin from '@/mixins/tableMinx'
export default {
  mixins: [pageMixin],
  props: {
    // 角色编号
    roleId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      saveKey: '2',
      // 遮罩层
      visible: false,
      // 选中数组值
      userIds: [],
      // 总条数
      total: 0,
      // 未授权用户数据
      userList: [],
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
  methods: {
    tableRowClassName({ row, rowIndex }) {
      let color = 'pointer'
      for (const item of this.userIds.values()) {
        if (item === row.userId) {
          color = 'pointer table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    // 显示弹框
    show() {
      this.queryParams.roleId = this.roleId
      this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      this.getList()
      this.visible = true
    },
    clickRow(row) {
      this.$refs.tables.toggleRowSelection(row)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map((item) => item.userId)
    },
    // 查询表数据
    getList() {
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      unallocatedUserList(params).then((res) => {
        this.userList = res.rows
        this.total = res.total
      })
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
    /** 选择授权用户操作 */
    handleSelectUser() {
      const roleId = this.queryParams.roleId
      const userIds = this.userIds.join(',')
      authUserSelectAll({ roleId: roleId, userIds: userIds }).then((res) => {
        this.$modal.msgSuccess(this.$t('ui.authSuccess'))
        if (res.code === 200) {
          this.visible = false
          this.$emit('ok')
        }
      })
    }
  }
}
</script>
