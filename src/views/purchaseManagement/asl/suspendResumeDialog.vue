<template>
  <el-dialog
    v-dialogDrag
    :title="$t('ui.reason')"
    :visible.sync="visible"
    width="800px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="125px">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.reason')}`" prop="reason">
            <MyInput
              type="textarea"
              v-model="form.reason"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="200"
            ></MyInput>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="fullscreenLoading" @click="submitForm">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { suspendApprovedSupplier, resumeApprovedSupplier } from '@/api/purchaseManagement/asl'
export default {
  components: {},
  props: {},
  data() {
    const vm = this
    return {
      visible: false,
      fullscreenLoading: false,
      form: {},
      rules: {
        reason: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {},
  methods: {
    handleOpen({ list, ids, isActive }) {
      this.reset()
      this.list = list
      this.ids = ids
      this.isActive = isActive
      this.visible = true
    },
    reset() {
      this.form = {
        reason: ''
      }
      this.resetForm('form')
    },
    back() {
      this.visible = false
    },
    submitForm() {
      if (this.fullscreenLoading) {
        return
      }
      let bpNameList = this.list.map((i) => i.businessPartnerName)
      bpNameList = [...new Set(bpNameList)]
      this.$refs.form.validate((valid) => {
        if (valid) {
          const vm = this
          const param = {
            reason: vm.form.reason,
            idList: this.ids
          }
          let FN
          if (this.isActive === '1') {
            FN = resumeApprovedSupplier
          } else {
            FN = suspendApprovedSupplier
          }
          vm.fullscreenLoading = true
          FN(param)
            .then((res) => {
              if (res.code === 200) {
                if (this.isActive === '1') {
                  vm.$message.success(
                    `${vm.$t('PURCHASE.resumedSuccess')}`.replace('$1', bpNameList.join(', '))
                  )
                } else {
                  vm.$message.success(
                    `${vm.$t('PURCHASE.suspendSuccess')}`.replace('$1', bpNameList.join(', '))
                  )
                }
                vm.$emit('submitSuccess')
                this.back()
              }
              vm.fullscreenLoading = false
            })
            .catch(() => {
              vm.fullscreenLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.el-select-group__title .option-title-box {
  display: flex;
  flex-direction: row;
  // background-color: #aaaaaa;
  font-weight: bold;
  // color: #000000;
  color: #606266;
  font-size: 14px;
  margin-left: -20px;
  text-align: left;
  padding-left: 3px;
  padding-right: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .option-title-a {
    width: 85px;
  }
  .option-title-b {
    padding-left: 3px;
    padding-right: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 120px;
  }
  .option-title-c {
    width: 85px;
  }
}
</style>
<style scoped lang="scss">
.dialog-footer {
  margin-bottom: 20px;
}

.return-gp-box .el-select-dropdown__item {
  height: auto;
  white-space: wrap;
  overflow: auto;
  text-overflow: none;
}

.op-list {
  display: flex;
  flex-direction: row;
  text-align: left;
  margin-left: -20px;
  padding-left: 3px;
  padding-right: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .op-list-a {
    width: 85px;
  }
  .op-list-b {
    padding-left: 3px;
    padding-right: 3px;
    word-break: break-all;
    white-space: normal;
  }
  .op-list-c {
    width: 85px;
  }
}
</style>
