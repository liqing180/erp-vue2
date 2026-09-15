<!-- eslint-disable -->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="importOptions.title"
    :visible.sync="importOptions.open"
    width="400px"
    append-to-body
    @close="close"
  >
    <el-upload
      ref="upload"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="headers"
      :action="importOptions.url + '?updateSupport=' + updateSupport"
      :disabled="importOptions.isUploading"
      :on-progress="handleFileUploadProgress"
      :before-upload="handleBeforeUpload"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        {{ $t('ui.uploadTip1') }} <em>{{ $t('ui.uploadTip2') }}</em>
      </div>
      <div class="el-upload__tip text-center" slot="tip">
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="updateSupport" />{{ $t('ui.updateExisting') }}
        </div>
        <span>{{ $t('ui.uploadTip3').replace('$1', 'xls、xlsx') }} </span>
        <el-link
          type="primary"
          :underline="false"
          style="font-size: 12px; vertical-align: baseline"
          @click="importTemplate"
        >
          {{ $t('ui.downloadTemplate') }}</el-link
        >
      </div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('updateImport', 'open', false)">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" @click="submitFileForm">{{ $t('uiBtn.submit') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'fileImport',
  props: ['importOptions'],
  data() {
    return {
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
    // 下载模板
    importTemplate() {
      this.$emit('importTemplate')
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.$emit('updateImport', 'isUploading', true)
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
          return false
        }
      }
      return true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.$emit('updateImport', 'isUploading', false)
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '', { dangerouslyUseHTMLString: true })
      this.$emit('fileImportSuccess')
      this.$emit('updateImport', 'open', false)
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    close() {
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style lang="scss" scoped></style>
