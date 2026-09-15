<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('menu.assignRole')"
    :visible.sync="dialogTableVisible"
    width="1000px"
    top="5vh"
    @closed="closed"
  >
    <el-row class="transfer-style">
      <el-transfer
        :key="transferKey"
        style="text-align: left; display: inline-block"
        :height="'600px'"
        filterable
        filter-placeholder=" "
        v-model="transferValue"
        :data="transferData"
        :titles="[$t('uiBtn.inactive'), $t('uiBtn.active')]"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
      >
        <!--
        :titles="[' ', ' ']"
        :format="{
          noChecked: ' ',
          hasChecked: ' '
        }"
       -->
      </el-transfer>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="dialogTableVisible = false">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" @click="handleSave" :loading="submitLoading">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryUserRoleList, updateUserRoleList } from '@/api/system/user'
export default {
  data() {
    return {
      dialogTableVisible: false,
      transferData: [],
      userRow: {},
      transferValue: [],
      submitLoading: false,
      transferKey: Date.now()
    }
  },
  methods: {
    closed() {
      this.$nextTick(() => {
        this.transferKey = this.transferKey + 1
      })
      this.transferValue = []
      this.transferData = []
      this.userRow = {}
    },
    handleQueryRole(row) {
      const vm = this
      vm.dialogTableVisible = true
      vm.userRow = { ...row }
      vm.queryUserRoleList()
    },
    queryUserRoleList() {
      const vm = this
      const param = {
        userId: vm.userRow.userId
      }
      vm.submitLoading = true
      queryUserRoleList(param).then((res) => {
        const { data } = res
        vm.submitLoading = false
        const selectIds = []
        const list = data || []
        list.forEach((item) => {
          item.key = item.roleId
          item.label = item.roleName
          if (item.isSelect === '1') {
            selectIds.push(item.roleId)
          }
        })
        this.transferValue = selectIds
        this.transferData = list
      })
    },
    handleSave() {
      const vm = this
      this.$modal.confirm(this.$t('ui.assignRoleConfirm')).then(() => {
        return vm.updateData()
      })
    },
    updateData() {
      const params = {
        userId: this.userRow.userId,
        selectIdList: this.transferValue
      }

      this.submitLoading = true
      updateUserRoleList(params)
        .then((res) => {
          this.submitLoading = false
          if (res.code === 200) {
            this.dialogTableVisible = false
            this.$message.success(`${this.$t('ui.assignRoleSuccess')}`)
          }
        })
        .catch(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
.transfer-style {
  text-align: center;
  .el-transfer-panel {
    width: 300px;
    .el-transfer-panel__body {
      height: 500px !important;
      .el-transfer-panel__list.is-filterable {
        height: calc(500px - 62px) !important;
      }
    }
  }
  .el-transfer__buttons {
    display: inline-flex;
    flex-direction: column;
    padding: 0 30px;
    .el-transfer__button:nth-child(2) {
      margin: 0;
    }
  }

  .el-transfer__buttons .el-transfer__button {
    width: 80px !important;
  }
}
</style>
