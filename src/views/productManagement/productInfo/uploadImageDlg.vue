<template>
  <el-dialog
    v-dialogDrag
    :title="$t('menu.uploadImage')"
    :visible.sync="visible"
    width="1000px"
    :close-on-click-modal="false"
  >
    <el-row>
      <el-col :span="24">
        <myUpload
          ref="uploadRef"
          :accept="['.jpg', '.jpeg', '.png', '.bmp', '.webp']"
          :disabled="false"
          :limit="15"
        />
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
import { batchAssignImagesToProducts } from '@/api/productManagement/productInfo'

export default {
  components: {},
  props: {
    /* 后端使用 业务审批或正常审批:1, 管理员审批: 3 */
    fromType: {
      type: String,
      default: '1'
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
      },
      ids: []
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
      this.ids = ids || []
      this.reset()
      this.visible = true
    },
    reset() {
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
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
      const param = {}
      const fileIds = this.$refs.uploadRef.getFileIds({
        required: true,
        requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
      })
      if (fileIds === false) {
        vm.fullscreenLoading = false
        return
      }
      param.commonFileList = fileIds
      param.productMainIdList = this.ids
      batchAssignImagesToProducts(param)
        .then((res) => {
          setTimeout(() => {
            vm.fullscreenLoading = false
          }, 500)
          /* const data = res.data
          if (data.isSuccess === '0') {
            vm.$modal.msgError(data.errorMsg)
            const list = data.noFindProductFileList || []
            this.$refs.uploadRef && this.$refs.uploadRef.initFileList(list)
            return
          } */
          this.back()
          vm.$emit('onSuccess')
          this.$modal.msgSuccess(this.$t('PRODUCT.imageUploadedSuccessfully'))
        })
        .catch(() => {
          vm.fullscreenLoading = false
        })
    }
  }
}
</script>
