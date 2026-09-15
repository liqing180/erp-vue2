<template>
  <el-dialog
    v-dialogDrag
    :title="$t('ui.approvalReason')"
    :visible.sync="approvedVisible"
    width="1000px"
    append-to-body
    :close-on-click-modal="false"
    @closed="closeCb"
  >
    <el-form ref="approveForm" :model="approveForm" :rules="approveFormRules" label-width="140px">
      <el-col :span="24">
        <el-form-item :label="`${$t('ui.approvedBy')}`" prop="approvedName">
          <el-input
            v-model="approveForm.approvedName"
            :title="!approveForm.approvedName ? '' : approveForm.approvedName"
            type="text"
            disabled
          />
        </el-form-item>
      </el-col>
      <!-- <el-col :span="12">
        <el-form-item :label="`${$t('ui.approvedTime')}`" prop="approvedTime">
          <el-date-picker
            v-model="approveForm.approvedTime"
            :style="{ width: '100%' }"
            type="date"
            placeholder
            :editable="false"
            disabled
            :format="fmtForYmdhms"
            value-format="timestamp"
          />
        </el-form-item>
      </el-col> -->
      <el-col :span="24">
        <el-form-item :label="`${$t('ui.reason')}`" prop="approvedReason">
          <MyInput
            type="textarea"
            v-model="approveForm.approvedReason"
            :autosize="{ minRows: 1, maxRows: 4 }"
            resize="none"
            show-word-limit
            :maxlength="200"
          ></MyInput>
        </el-form-item>
      </el-col>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="handleApprovedDlg">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    aplVisible: {
      type: Boolean,
      default: false
    },
    aplApiUrl: {
      type: Function,
      default: null
    },
    // eslint-disable-next-line vue/require-default-prop
    backCb: {
      type: Function
    },
    taskId: {
      type: String,
      default: ''
    },
    /* 后端使用 业务审批或正常审批:1, 管理员审批: 3 */
    fromType: {
      type: String,
      default: '1'
    },
    id: {
      type: String,
      default: ''
    },
    formData: {
      type: Object
    },
    formDataKey: {
      type: String,
      default: ''
    }
  },

  data() {
    // let vm = this
    return {
      approveForm: {},
      approveFormRules: {
        // approvedReason: [
        //   {
        //     required: true,
        //     pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
        //     message: vm.$t('ui.reasonReq'),
        //     trigger: ['change', 'blur']
        //   }
        // ]
      },
      btnLoading: false
    }
  },

  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    approvedVisible: {
      get: function () {
        return this.aplVisible
      },
      set: function () {
        this.$emit('aplVisibleChange', false)
      }
    }
  },

  created() {
    const vm = this
    vm.$set(vm.approveForm, 'approvedName', this.$store.state.user.nickName)
  },
  methods: {
    handleApprovedDlg() {
      const vm = this
      vm.approvedDlgValidate((valid) => {
        if (valid) {
          vm.approvedSubmit()
        }
      })
    },
    approvedDlgValidate(callback) {
      this.$refs.approveForm.validate((valid) => {
        callback && callback(valid)
      })
    },
    approvedSubmit() {
      const vm = this
      if (this.btnLoading) return
      this.btnLoading = true
      const param = {
        businessId: this.id,
        taskId: this.taskId,
        fromType: this.fromType,
        reason: vm.approveForm.approvedReason
      }
      if (this.formData && this.formDataKey) {
        param[this.formDataKey] = this.formData
      }
      if (vm.aplApiUrl) {
        vm.aplApiUrl(param)
          .then((res) => {
            if (res.code === 200) {
              vm.$emit('submitSuccess')
            }
            vm.btnLoading = false
          })
          .catch(() => {
            vm.btnLoading = false
          })
      }
    },
    handleBack() {
      const vm = this
      vm.$set(vm.approveForm, 'approvedReason', '')
      if (vm.$refs.approveForm) {
        vm.$refs.approveForm.clearValidate()
      }
      if (typeof vm.backCb === 'function') {
        vm.backCb()
      }
      vm.$emit('aplVisibleChange', false)
    },
    closeCb() {
      const vm = this
      vm.$set(vm.approveForm, 'approvedReason', '')
      if (vm.$refs.approveForm) {
        vm.$refs.approveForm.clearValidate()
      }
      this.$emit('aplVisibleChange', false)
    }
  }
}
</script>
