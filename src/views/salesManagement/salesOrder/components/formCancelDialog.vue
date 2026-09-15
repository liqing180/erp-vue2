<template>
  <el-dialog
    v-dialogDrag
    :title="$t('cancel.dialogTitle')"
    :visible.sync="visible"
    width="1140px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="195px">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.cancelledBy')}`" prop="cancelledBy">
            <el-input
              v-model="form.cancelledBy"
              :title="!form.cancelledBy"
              type="text"
              disabled
              class="form-wd"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="false">
          <el-form-item :label="`${$t('cancel.dateCancelled')}`" prop="dateCancelled">
            <el-date-picker
              :value="form.dateCancelled"
              :editable="false"
              disabled
              type="date"
              :format="fmtForYmdhms"
              :style="{ width: '100%' }"
              placeholder
            ></el-date-picker>
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
            <myUpload ref="uploadRef" :disabled="false" :limit="9" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="fullscreenLoading" @click="submitForm()">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    cancelApiUrl: {
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
    },
    ids: {
      type: Array,
      default: () => []
    },
    path: {
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
    const en = {
      cancel: {
        dialogTitle: 'Cancellation Reason',
        dateCancelled: 'Date Cancelled',
        cancelSubmit: 'Process [$1] was cancelled successfully.',
        submitConfirm:
          'Products [$1] have associated Purchase Orders (in progress/completed). Confirm cancelling the Sales Order?'
      }
    }
    const zh = {
      cancel: {
        dialogTitle: '取消原因',
        dateCancelled: '取消时间',
        cancelSubmit: '流程 [$1] 取消成功。',
        submitConfirm: '产品[$1]已关联采购订单（执行中/已完成），确认取消销售订单？'
      }
    }
    this.$i18n.mergeLocaleMessage('zh', zh)
    this.$i18n.mergeLocaleMessage('en', en)
  },
  methods: {
    handleOpen() {
      this.reset()
      this.visible = true
    },
    reset() {
      this.form = {
        reason: '',
        cancelledBy: this.$store.state.user.nickName
      }
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      this.resetForm('form')
    },
    back() {
      this.visible = false
    },
    submitForm(needContinue) {
      if (this.fullscreenLoading) {
        return
      }
      // console.log('this.taskId', this.taskId)

      this.$refs.form.validate((valid) => {
        if (valid) {
          const vm = this
          const param = {
            taskId: vm.taskId || undefined,
            fromType: this.fromType,
            reason: vm.form.reason,
            needContinue
          }
          if (this.path === 'salesOrder') {
            param.salesOrderProductIdList = vm.ids
          } else {
            param.businessId = vm.id
          }
          const fileIds = this.$refs.uploadRef.getFileIds()
          if (fileIds === false) {
            return
          }
          param.commonFileList = fileIds
          if (vm.cancelApiUrl) {
            vm.fullscreenLoading = true
            vm.cancelApiUrl(param)
              .then((res) => {
                vm.fullscreenLoading = false
                const data = res.data || {}
                const checkTipsVO = data.checkTipsVO || {}
                if (checkTipsVO.isNeedTips) {
                  vm.$modal
                    .confirm(vm.$t('cancel.submitConfirm').replace('$1', checkTipsVO.productNames))
                    .then(() => {
                      vm.submitForm('1')
                    })
                    .catch(() => {})
                } else {
                  vm.$emit('submitSuccess')
                  this.back()
                }
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
