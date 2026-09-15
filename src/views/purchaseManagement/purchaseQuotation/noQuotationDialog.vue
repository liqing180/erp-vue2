<template>
  <el-dialog
    v-dialogDrag
    :title="$t('ui.reason')"
    :visible.sync="visible"
    width="700px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.reason')}`" prop="remarks">
            <MyInput
              type="textarea"
              v-model="form.remarks"
              :autosize="{ minRows: 3, maxRows: 6 }"
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
import { submitNoQuotation } from '@/api/purchaseManagement/purchaseQuotation'
export default {
  components: {},
  props: {
    taskId: {
      type: String,
      default: ''
    },
    /* 后端使用 业务审批或正常审批:1, 管理员审批: 3 */
    fromType: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      visible: false,
      fullscreenLoading: false,
      form: {},
      rules: {
        remarks: [
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
    handleOpen(ids) {
      this.reset()
      this.form.purchaseQuotationIdList = ids
      this.visible = true
    },
    reset() {
      this.form = {
        remarks: ''
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          const vm = this
          const param = {
            ...vm.form
          }
          vm.fullscreenLoading = true
          submitNoQuotation(param)
            .then((res) => {
              if (res.code === 200) {
                this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
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
