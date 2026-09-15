<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('ui.attachment')"
    :visible.sync="open"
    width="1100px"
    append-to-body
    @closed="closed"
  >
    <el-form @submit.native.prevent label-width="140px" v-loading="loading">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.attachment')}`" required>
            <myUpload ref="uploadRef" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" @click="submitForm" :loading="btnLoading"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  addFileToConsignmentOrder,
  queryConsignmentOrderById
} from '@/api/purchaseManagement/consignmentOrder'
export default {
  name: 'UploadDlg',
  props: {
    zoneForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: true,
      btnLoading: false,
      open: false,
      title: '',
      form: {},
      // 表单校验
      rules: {},
      consignmentOrderId: ''
    }
  },
  created() {},
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  methods: {
    reset() {
      this.form = {}
      this.resetForm('form')
      setTimeout(() => {
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      }, 100)
    },
    handleOpen(row) {
      this.reset()
      this.consignmentOrderId = row.consignmentOrderId
      this.getPoById()
      this.open = true
    },
    getPoById() {
      this.loading = true
      queryConsignmentOrderById({ consignmentOrderId: this.consignmentOrderId })
        .then((res) => {
          const data = res.data || {}
          this.loading = false
          setTimeout(() => {
            this.$refs.uploadRef && this.$refs.uploadRef.initFileList(data.commonFileList || [])
          }, 100)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.btnLoading = false
      this.reset()
    },
    /** 提交按钮 */
    async submitForm() {
      const myFileIds1 = this.$refs.uploadRef.getFileIds({
        required: true,
        requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
      })
      if (myFileIds1 === false) {
        return
      }
      const params = {
        consignmentOrderId: this.consignmentOrderId,
        commonFileList: myFileIds1
      }
      if (this.btnLoading) return
      this.btnLoading = true
      this.$modal
        .confirm(this.$t('ui.submitPageConfirm'))
        .then(() => {
          return addFileToConsignmentOrder(params)
        })
        .then((response) => {
          this.$emit('onSuccess')
          this.$message.success(this.$t('ui.submitPageSuccess'))
          this.btnLoading = false
          this.open = false
        })
        .catch(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
  }
  .con-right {
    margin-left: 10px;
    line-height: 0;
  }
}
</style>
