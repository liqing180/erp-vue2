<template>
  <el-dialog
    v-dialogDrag
    :title="confirmMsg"
    :visible.sync="visible"
    width="600px"
    :close-on-click-modal="false"
  >
    <div style="color: #888">{{ $t('ui.submissionNoteTip') }}</div>
    <el-row class="mt10">
      <el-col :span="24">{{ $t('ui.submissionNote') }}</el-col>
      <el-col :span="24" class="mt5">
        <MyInput
          type="textarea"
          v-model="form.rejectSubmitRemarks"
          :autosize="{ minRows: 3, maxRows: 8 }"
          resize="none"
          show-word-limit
          :maxlength="3000"
          :placeholder="$t('ui.submissionNotePlaceholder')"
        ></MyInput>
      </el-col>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="fullscreenLoading" @click="submitForm">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import locale from './locale'
import optionsTitleFmt from '@/directive/optionsTitleFmt'

export default {
  directives: { optionsTitleFmt },
  components: {},
  props: {},
  data() {
    return {
      visible: false,
      fullscreenLoading: false,
      form: {},
      rules: {},
      confirmMsg: undefined,
      successMsg: undefined,
      param: undefined,
      submitFn: undefined
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
    handleOpen({ confirmMsg, successMsg, param, submitFn }) {
      this.reset()
      this.confirmMsg = confirmMsg
      this.successMsg = successMsg
      this.param = param
      this.submitFn = submitFn
      this.visible = true
    },
    reset() {
      this.form = {
        rejectSubmitRemarks: ''
      }
      // this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      this.resetForm('form')
    },
    back() {
      this.visible = false
    },
    submitForm() {
      if (this.fullscreenLoading) {
        return
      }

      const vm = this
      vm.fullscreenLoading = true
      const param = {
        ...this.param,
        rejectSubmitRemarks: vm.form.rejectSubmitRemarks
      }
      this.submitFn(param)
        .then((response) => {
          this.$modal.msgSuccess(this.successMsg.replace('$1', response.msg))
          this.back()
          vm.$emit('submitSuccess')
          setTimeout(() => {
            vm.fullscreenLoading = false
          }, 2000)
        })
        .catch(() => {
          vm.fullscreenLoading = false
        })
    }
  }
}
</script>
