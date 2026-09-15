<template>
  <el-dialog
    v-dialogDrag
    :title="$t('close.dialogTitle')"
    :visible.sync="visible"
    width="1140px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="195px">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.closedBy')}`" prop="closedBy">
            <el-input
              v-model="form.closedBy"
              :title="!form.closedBy"
              type="text"
              disabled
              class="form-wd"
            />
          </el-form-item>
        </el-col>

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
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.attachment')}`" prop="fileIds">
            <myUpload ref="uploadRef" :disabled="false" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :disabled="fullscreenLoading" @click="submitForm">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import locale from './locale'

export default {
  components: {},
  props: {
    closeApiUrl: {
      type: Function,
      default: null
    },
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
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    handleOpen() {
      this.reset()
      this.visible = true
    },
    reset() {
      this.form = {
        reason: '',
        closedBy: this.$store.state.user.nickName
      }
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
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
            taskId: vm.form.taskId,
            fromType: this.fromType,
            businessId: vm.id,
            reason: vm.form.reason
          }
          const fileIds = this.$refs.uploadRef.getFileIds()
          if (fileIds === false) {
            return
          }
          param.commonFileList = fileIds
          if (vm.closeApiUrl) {
            vm.fullscreenLoading = true
            vm.closeApiUrl(param)
              .then((res) => {
                if (res.code === 200) {
                  vm.$emit('submitSuccess')
                  this.back()
                }
                vm.fullscreenLoading = false
              })
              .catch(() => {
                vm.fullscreenLoading = false
              })
          }
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
