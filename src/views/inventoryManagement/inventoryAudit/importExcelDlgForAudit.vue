<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    :visible.sync="open"
    width="600px"
    style="padding-top: 20vh"
    top="5vh"
    append-to-body
    @closed="closed"
  >
    <div slot="title" style="font-weight: 700">{{ $t('uiBtn.import') }}</div>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" class="mr20">
      <el-row>
        <el-form-item :label="$t('ui.uploadTemplate')">
          <el-button
            type="primary"
            icon="el-icon-download"
            style="width: 100%"
            :loading="downLoading"
            @click="downLoad"
            >{{ $t('ui.clickToDownload') }}</el-button
          >
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="$t('ui.uploadData')" prop="file">
          <el-upload
            ref="upload"
            :limit="2"
            accept=".xlsx, .xls"
            :headers="headers"
            :action="importOptions.url + '?updateSupport=' + updateSupport"
            :data="{ inventoryAuditId: inventoryAuditId }"
            :disabled="importOptions.isUploading"
            :on-progress="handleFileUploadProgress"
            :before-upload="handleBeforeUpload"
            :before-remove="beforeRemove"
            :on-success="handleFileSuccess"
            :auto-upload="true"
            :file-list="fileList"
            :on-change="handleChange"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text" style="padding: 0 20px; word-break: break-word">
              {{ $t('ui.uploadToast') }}
            </div>
          </el-upload>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button
        type="primary"
        @click="submitForm"
        :disabled="importOptions.isUploading"
        :loading="btnLoading"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { importInventoryAuditProduct } from '@/api/inventoryManagement/inventoryAudit'
import { getToken } from '@/utils/auth'
export default {
  props: {
    inventoryAuditId: undefined
  },
  data() {
    return {
      downLoading: false,
      btnLoading: false,
      open: false,
      form: {},
      // 表单校验
      rules: {
        file: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uploadData')),
            trigger: ['change', 'blur']
          }
        ]
      },
      // 导入
      importOptions: {
        isUploading: false,
        // 上传的地址
        url:
          process.env.VUE_APP_BASE_API +
          '/inventory/inventoryAudit/checkImportInventoryAuditProduct'
      },
      fileList: [],
      updateSupport: 0,
      headers: { Authorization: 'Bearer ' + getToken() },
      accept: ['.xlsx', '.xls']
    }
  },
  computed: {
    comAccept() {
      if (this.accept && this.accept.length > 0) {
        return this.accept.join(',')
      }
      return '.xlsx, .xls'
    }
  },
  methods: {
    reset() {
      this.form = {
        fail: undefined
      }
      this.$refs.upload.clearFiles()
      this.$set(this.importOptions, 'isUploading', false)
      this.resetForm('form')
    },
    /** 修改按钮操作 */
    show() {
      this.open = true
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.reset()
    },
    // 下载
    downLoad() {
      this.downLoading = true
      this.$importOrExportDownFile(
        '/inventory/inventoryAudit/exportInventoryAuditProduct',
        {
          inventoryAuditId: this.inventoryAuditId
        },
        `${this.getFileNameDate('Inventory Audit')}.xlsx`
      )
        .then((res) => {
          this.downLoading = false
        })
        .catch(() => {
          this.downLoading = false
        })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.$set(this.importOptions, 'isUploading', true)
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    handleBeforeUpload(file) {
      const vm = this
      vm.fullscreenLoading = true
      if (this.accept && this.accept.length > 0) {
        const findItem = this.accept.find((item) => {
          const extension = file.name.indexOf('.') > -1 ? '.' + file.name.split('.').pop() : ''
          return extension.toLowerCase().includes(item.toLowerCase())
        })
        if (!findItem) {
          const vm = this
          const str = vm.accept.join('/')
          vm.$modal.msgError(vm.$t('ui.uploadTypeErrorReq').replace('$1', str))
          setTimeout(() => {
            vm.$refs.upload.clearFiles()
          }, 0)
          return false
        }
      }
      return true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (!this.open) return
      this.$set(this.importOptions, 'isUploading', false)
      if (response.code !== 200) {
        this.$set(this.form, 'file', undefined)
        this.$refs.upload.clearFiles()
        this.$alert(response.msg, '', { dangerouslyUseHTMLString: true })
      } else {
        this.$set(this.form, 'file', file.raw)
        this.$refs.form.clearValidate('file')
      }
    },
    beforeRemove() {
      this.$set(this.form, 'file', undefined)
      this.$refs.form.validateField('file')
    },
    /** 提交按钮 */
    /** 提交按钮 */
    submitForm: function () {
      const vm = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          vm.form.file
            .arrayBuffer()
            .then((res) => {
              vm.$modal
                .confirm(vm.$t('ui.submitPageConfirm'))
                .then(() => {
                  vm.btnLoading = true
                  const formData = new FormData()

                  formData.append('file', vm.form.file)
                  formData.append('inventoryAuditId', vm.inventoryAuditId)
                  return importInventoryAuditProduct({ formData })
                })
                .then((response) => {
                  vm.btnLoading = false
                  vm.$modal.msgSuccess(vm.$t('ui.submitPageSuccess'))
                  vm.cancel()
                  const list = response.data || []
                  this.$emit('onSuccess', list)
                })
                .catch((err) => {
                  vm.btnLoading = false
                  if (vm.$TypeJudge.isObject(err) && err.code === 701) {
                    vm.cancel()
                  }
                })
            })
            .catch(() => {
              this.$set(this.form, 'file', undefined)
              this.$refs.upload.clearFiles()
              vm.$modal.msgError(vm.$t('ui.fileModifiedTip'))
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
