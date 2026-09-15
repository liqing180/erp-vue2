<template>
  <el-dialog
    v-dialogDrag
    :title="$t('invalidate.dialogTitle')"
    :visible.sync="visible"
    width="900px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('invalidate.invalidatedBy')}`" prop="invalidatedBy">
            <el-input
              v-model="form.invalidatedBy"
              :title="!form.invalidatedBy"
              type="text"
              disabled
              class="form-wd"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label="`${$t('ui.reason')}`" prop="invalidateReason">
            <MyInput
              type="textarea"
              v-model="form.invalidateReason"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="200"
            ></MyInput>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item :label="`${$t('ui.attachment')}`" prop="fileIds">
            <myUpload ref="uploadRef" :disabled="false" :limit="9" />
          </el-form-item>
        </el-col> -->
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
import locale from './locale'
import optionsTitleFmt from '@/directive/optionsTitleFmt'
import { invalidatePO } from '@/api/purchaseManagement/purchaseOrder'

export default {
  directives: { optionsTitleFmt },
  components: {},
  props: {},
  data() {
    const vm = this
    return {
      visible: false,
      fullscreenLoading: false,
      form: {},
      rules: {
        invalidateReason: [
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
    handleOpen(row) {
      this.reset()
      if (row) {
        this.form.purchaseOrderId = row.purchaseOrderId
        this.form.purchaseOrderNo = row.purchaseOrderNo
      }
      this.visible = true
    },
    reset() {
      this.form = {
        invalidateReason: '',
        invalidatedBy: this.$store.state.user.nickName
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          const vm = this
          vm.fullscreenLoading = true
          const param = {
            purchaseOrderId: vm.form.purchaseOrderId,
            invalidateReason: vm.form.invalidateReason
          }
          // const fileIds = this.$refs.uploadRef.getFileIds()
          // if (fileIds === false) {
          //   vm.fullscreenLoading = false
          //   return
          // }
          // param.commonFileList = fileIds
          invalidatePO(param)
            .then((res) => {
              vm.$message.success(
                `${vm.$t('invalidate.cancelSubmit').replace('$1', vm.form.purchaseOrderNo)}`
              )
              this.back()
              vm.$emit('submitSuccess')
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
