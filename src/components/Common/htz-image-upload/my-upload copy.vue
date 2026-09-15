<template>
  <div class="my-upload-file-warp">
    <el-form>
      <div class="mb5" v-if="!singleFile">
        <el-button
          size="mini"
          v-if="!disabled"
          @click="handleUpload"
          :disabled="uploadDisabled"
          icon="el-icon-upload2"
          >{{ $t('ui.uploadFile') }}</el-button
        >
        <el-button
          size="mini"
          v-if="fileList.length > 0"
          icon="el-icon-download"
          @click="downloadAll"
          >{{ $t('ui.downloadAll') }}</el-button
        >
      </div>
      <el-upload
        ref="myUpload"
        :disabled="uploadDisabled"
        :class="[
          fileList.length > 0 || uploadDisabled ? 'is-upload-disabled' : '',
          singleFile ? 'single-file' : ''
        ]"
        style="width: 100%"
        :accept="comAccept"
        drag
        multiple
        :action="uploadUrl"
        name="files"
        :show-file-list="false"
        list-type="text"
        :on-remove="handleRemove"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadFaile"
        :file-list="fileListCache"
        :headers="{ Authorization: isToken ? access_token : null }"
      >
        <i class="el-icon-plus" v-if="!singleFile"></i>
        <div class="el-upload__text" ref="uploadText">
          {{ $t('ui.clickUploadTip') }},
          {{ $t('ui.fileMaxSize').replace('$1', sys_file_max_size) }}
        </div>
        <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <div
        v-for="file in fileList"
        :key="file.uid"
        class="file-item"
        :class="{ curAction: file.uid === curObj.uid }"
      >
        <div class="item-left">
          <span class="fileName" @click="handlePreview(file)" :title="file.name">
            <i
              style="font-size: 16px; vertical-align: text-top"
              class="el-icon-link"
              v-if="file.status === 'success'"
            ></i>
            <i class="el-icon-loading" v-else></i>
            {{ getfileNameAndSuffixShow(file).name }}</span
          >
          <span class="fs-0">{{ getfileNameAndSuffixShow(file).suffix }}</span>

          <span class="fs-0" style="color: #999">{{
            `(${$numberStr(file.size / 1024, 2)}KB)`
          }}</span>
          <span
            class="primary-pointer ml10 fs-0"
            type="text"
            v-show="file.status !== 'success'"
            @click="delFile(file)"
            >{{ $t('ui.cancelUpload') }}</span
          >
          <span class="fs-0 ml10 item-left-btn" v-show="file.status === 'success'">
            <span class="primary-pointer ml10" @click="handlePreview(file)">{{
              $t('ui.preview')
            }}</span>
            <span v-if="file.downLoading" class="ml10">
              <i class="el-icon-loading"></i>
              {{ $t('ui.downloading') }}
            </span>
            <span class="primary-pointer ml10" v-else type="text" @click="handleDownFile(file)">{{
              $t('ui.download')
            }}</span>

            <span
              class="primary-pointer ml10"
              type="text"
              :ref="'btn' + file.uid"
              v-if="!disabled"
              @click="showPop($event, file, 'changeName')"
              >{{ $t('ui.rename') }}
            </span>
            <span
              class="primary-pointer ml10"
              v-if="!disabled && !file.disCancel"
              type="text"
              @click="delFile(file)"
              >{{ $t('uiBtn.delete') }}
            </span>
          </span>
        </div>
        <div class="item-right" v-show="file.status === 'success'">
          <span v-if="fomType" class="mr20 fs-0">{{ file.fromType || fomType }}</span>
          <span class="uploadBy mr20 fs-0" :title="file.creatorName">{{ file.creatorName }}</span>
          <span class="mr20 fs-0">{{ parseTime(file.createTime, fmtForYmdhm) }}</span>
          <span
            v-show="!disabled || file.remarks"
            class="fs-0"
            style="font-weight: bold"
            :class="disabled ? '' : 'primary-pointer'"
            type="text"
            @click="showPop($event, file, 'changeRemarks')"
            >{{ $t('ui.remarks') }}<span v-show="disabled">:</span></span
          >
          <span class="fileRemarks" :title="file.remarks">{{ file.remarks }}</span>
        </div>
      </div>
    </el-form>

    <div class="noAttachment" v-if="disabled && fileList.length <= 0">
      {{ $t('ui.noAttachment') }}
    </div>

    <popover-svc ref="pop1" trigger="manual" placement="top" width="320">
      <div class="mb10">
        <el-input
          ref="myInput1"
          v-show="curObj.changeType === 'changeName'"
          style="width: 100%"
          v-model="curObj.name"
          :maxlength="50"
          @keyup.enter.native="hidePop('comFirm')"
        ></el-input>
        <el-input
          ref="myInput2"
          v-show="curObj.changeType === 'changeRemarks'"
          style="width: 100%"
          v-model="curObj.remarks"
          :maxlength="100"
          @keyup.enter.native="hidePop('comFirm')"
        ></el-input>
      </div>
      <div style="text-align: center; margin: 0">
        <el-button size="mini" @click="hidePop('cancel')">{{ $t('menu.cancel') }}</el-button>
        <el-button
          type="primary"
          size="mini"
          :disabled="!curObj.name"
          @click="hidePop('comFirm')"
          >{{ $t('uiBtn.confirm1') }}</el-button
        >
      </div>
    </popover-svc>

    <el-image-viewer
      v-if="showviewer"
      :on-close="closeviewer"
      :url-list="urlList"
      style="width: 100%; height: 100%; margin-left: 0%; margin-top: 0%"
      :zIndex="imageViewerIndex"
    />
  </div>
</template>

<script>
// import draggable from 'vuedraggable'
import { multiFileUpload, downloadFile, multiFileUpload2 } from '@/api/basic/basic'
import downFile from '@/utils/downFile.js'
import { debounce } from 'lodash'

import { mapState } from 'vuex'

import { Popover } from 'element-ui'
import elImageViewer from 'element-ui/packages/image/src/image-viewer'
import { PopupManager } from 'element-ui/lib/utils/popup'
const popoverSvc = {
  extends: Popover,
  methods: {
    popBy(el) {
      // 先隐藏并销毁之前显示的
      this.close()
      this.doDestroy(true)
      this.$nextTick(() => {
        // 显示新的
        this.referenceElm = this.$refs.reference = el
        this.showPopper = true
        this.$emit('input', true)
      })
    },
    close() {
      this.showPopper = false
      this.$emit('input', false)
    }
  }
}
export default {
  components: {
    // draggable,
    popoverSvc,
    elImageViewer
  },
  props: {
    disabled: {
      type: [Boolean],
      default: false
    },
    fomType: {
      type: [String],
      default: ''
    },
    limit: {
      type: [Number],
      default: 0
    },
    allFileSize: {
      type: [Number],
      default: 0
    },
    accept: {
      type: [Array],
      default: () => {
        return []
      }
    },
    filterOthersFileList: {
      type: [Array],
      default: () => {
        return []
      }
    },
    // 是否需要token
    isToken: {
      type: Boolean,
      default: true
    },
    updateFileList: {
      type: Function,
      default() {
        return () => {}
      }
    },
    singleFile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      fileList: [
        // {
        //   name: 'food.jpeg',
        //   uid: '6107357109157888',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // },
        // {
        //   name: 'food2.jpeg',
        //   uid: '6107357109157882',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ],
      fileListCache: [
        // { name: 'food.jpeg',
        //   uid: '6107357109157888',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // },
        // { name: 'food2.jpeg',
        //   uid: '6107357109157882',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ],
      fullscreenLoading: false,
      dialogVisible: false,
      previewVideoSrc: '',
      reference: undefined,
      curObj: {},
      showviewer: false,
      urlList: [],
      imageViewerIndex: 3000
    }
  },

  computed: {
    ...mapState({
      access_token: (state) => state.user.token
    }),
    uploadDisabled() {
      return this.disabled || this.fileList.length >= this.sys_file_max_count
    },
    showDownload() {
      return this.fileList.filter((item) => !item.uploading).length > 0
    },
    uploadUrl() {
      return this.isToken ? multiFileUpload : multiFileUpload2
    },
    hideFileFolding() {
      return this.disabled || this.fileList.length > 0
    },
    sys_file_max_size() {
      if (this.allFileSize) {
        return this.allFileSize
      }
      if (this.$store.state.user.sys_file_max_size) {
        return this.$store.state.user.sys_file_max_size
      }
      return 500
    },
    sys_file_max_count() {
      if (this.limit) {
        return this.limit
      }
      if (this.$store.state.user.sys_file_max_count) {
        return this.$store.state.user.sys_file_max_count
      }
      return 9
    },
    online_preview_url() {
      if (this.$store.state.user.online_preview_url) {
        return this.$store.state.user.online_preview_url
      }
      return ''
    },
    comAccept() {
      if (this.accept && this.accept.length > 0) {
        return this.accept.join(',')
      }
      return 'image/*,video/*, .ai, .bmp, .ps, .psd, .svg, .tif, .tiff, .key, .odp, .pps, .ppt, .pptx, .ods, .xlr, .xls, .xlsx, .doc, .docx, .odt, .pdf, .rtf, .tex, .txt, .wks, .wps, .wpd'
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhm() {
      return this.$store.getters.fmtForYmdhm
    }
  },
  watch: {
    fileList: {
      immediate: true,
      handler: function (value) {
        this.updateFileList(value)
      }
    }
  },

  methods: {
    closeviewer() {
      this.showviewer = false
      this.urlList = []
    },
    getfileNameAndSuffixShow(file) {
      const name = file.name.substring(0, file.name.lastIndexOf('.') - 1)
      const suffix = file.name.substring(file.name.lastIndexOf('.') - 1)
      return {
        name,
        suffix
      }
    },
    getfileNameAndSuffix(file) {
      const name = file.name.substring(0, file.name.lastIndexOf('.'))
      const suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
      return {
        name,
        suffix
      }
    },
    showPop(e, file, type) {
      if (this.disabled) return
      this.$set(this.curObj, 'changeType', type)
      const data = this.getfileNameAndSuffix(file)
      this.$set(this.curObj, 'name', data.name)
      this.$set(this.curObj, 'suffix', data.suffix)
      this.$set(this.curObj, 'remarks', file.remarks)
      this.$set(this.curObj, 'uid', file.uid)
      this.$set(this.curObj, 'hide', false)
      this.$refs.pop1.popBy(e.target)
      setTimeout(() => {
        if (type === 'changeName') {
          this.$refs.myInput1.focus()
        } else if (type === 'changeRemarks') {
          this.$refs.myInput2.focus()
        }
      }, 200)
    },
    hidePop(type) {
      if (type === 'comFirm') {
        const name = `${this.curObj.name}.${this.curObj.suffix}`
        const remarks = this.curObj.remarks
        const list = this.$refs.myUpload.uploadFiles

        if (this.curObj.changeType === 'changeName') {
          const isRepeat = this.fileList.find(
            (item) => item.uid !== this.curObj.uid && item.name === name
          )
          if (isRepeat) {
            this.$modal.msgError(this.$t('ui.uploadRepeatErr'))
            return
          }
          this.fileList.forEach((item, index) => {
            if (item.uid === this.curObj.uid) {
              this.$set(item, 'name', name)
            }
          })

          list.forEach((item, index) => {
            if (item.uid === this.curObj.uid) {
              this.$set(item, 'name', name)
            }
          })
          this.updateFileList(this.fileList)
        }
        if (this.curObj.changeType === 'changeRemarks') {
          this.fileList.forEach((item, index) => {
            if (item.uid === this.curObj.uid) {
              this.$set(item, 'remarks', remarks)
            }
          })

          list.forEach((item, index) => {
            if (item.uid === this.curObj.uid) {
              this.$set(item, 'remarks', remarks)
            }
          })
        }
      }

      this.curObj = {}
      if (this.curObj) {
        this.curObj.hide = true
      }

      setTimeout(() => {
        this.curObj.hide && this.$refs.pop1.close()
      }, 0)
    },
    handlePreview(file) {
      if (!file.onlineUrl) return
      const fileType = this.getFileType(file)
      switch (fileType) {
        /* case 'video':
          this.handlePreviewVideo(file)
          break */

        case 'img':
          this.handlePreviewImg(file)
          break

        default:
          this.handlePreviewFile(file)
          break
      }
    },
    handleUpload() {
      this.$refs.uploadText.click()
    },
    format(percentage) {
      return percentage === 100 ? 'Uploading...' : `${percentage}%`
    },

    previewDownFile() {
      this.$refs.myUploadDown.initFileList(this.fileList.filter((item) => !item.uploading))
    },
    PadZero(str) {
      // 补零
      // return new RegExp(/^\d$/g).test(str) ? `0${str}` : str
      return /^\d$/g.test(str) ? `0${str}` : str
    },
    formatTime(_seconds) {
      _seconds = parseInt(_seconds)
      // let hours, mins, seconds
      let result = ''
      const seconds = parseInt(_seconds % 60)
      const mins = parseInt((_seconds % 3600) / 60)
      const hours = parseInt(_seconds / 3600)

      if (hours) {
        result = `${this.PadZero(hours)} : ${this.PadZero(mins)} : ${this.PadZero(seconds)}`
      } else {
        result = `${this.PadZero(mins)} : ${this.PadZero(seconds)}`
      }
      return result
    },
    getVideoDuration(file) {
      const audioElement = new Audio(file.url)
      const self = this
      let result
      audioElement.addEventListener('loadedmetadata', function () {
        // 视频时长值的获取要等到这个匿名函数执行完毕才产生
        result = audioElement.duration // 得到时长为秒，小数，182.36
        result = parseInt(result) // 转为int值
        self.$set(file, 'times', self.formatTime(result || 0))
      })
    },
    initFileList(files) {
      if (!files) {
        return
      }
      const list = []
      files.forEach((item) => {
        const rowData = {
          ...item,
          fileId: item.id,
          name: item.fileName,
          onlineUrl: item.url,
          uid: item.id,
          status: 'success'
        }
        rowData.fileType = this.getFileType(rowData)
        if (rowData.fileType === 'video') {
          this.getVideoDuration(rowData)
        }
        list.push(rowData)
      })
      this.fileListCache = JSON.parse(JSON.stringify(list))
      this.fileList = list
    },
    getFileList() {
      return this.fileList
    },
    getFileIds(option) {
      if (option && option.required && this.fileList.length === 0) {
        if (option.requiredMsg) {
          this.$modal.msgError(option.requiredMsg)
        } else {
          this.$modal.msgError(this.$t('ui.uploadReq'))
        }
        return false
      }
      let uploading = false
      const fileIds = this.fileList.map((item) => {
        if (item.uploading) {
          uploading = true
        }
        item.id = item.fileId
        item.fileName = item.name
        return item
      })
      if (uploading) {
        this.$modal.msgError(this.$t('ui.uploading'))

        return false
      } else {
        return fileIds
      }
    },
    getFileType(item) {
      if (/.(mp3)$/i.test(item.name)) {
        return 'mp3'
      }
      if (/.(pdf)$/i.test(item.name)) {
        return 'pdf'
      }
      if (/.(txt)$/i.test(item.name)) {
        return 'txt'
      }
      if (/.(gif|jpg|jpeg|png|bmp|webp|svg|ico|avif)$/i.test(item.name)) {
        return 'img'
      }

      if (/.(avi|mpeg|saf|mp4|asf|wmf|wmv|rm|3gq|vob|mkv|wmv|mpg|rmvb|mov)$/i.test(item.name)) {
        return 'video'
      }

      if (/.(dot|doc|docx|wps|ett|rtf)$/i.test(item.name)) {
        return 'word'
      }
      if (/.(xls|xlt|xlsx|csv|et|eet)$/i.test(item.name)) {
        return 'excel'
      }
      if (/.(ppt|pps|pptx|ppsx|pot|ppa|pub)$/i.test(item.name)) {
        return 'ppt'
      }
      return 'other'
    },
    downloadAll() {
      this.fileList.forEach((file) => {
        if (file.onlineUrl) {
          this.handleDownFile(file)
        }
      })
    },
    handleDownFile(file) {
      const url = downloadFile
      const param = { id: file.fileId }
      this.$set(file, 'downLoading', true)
      downFile('post', url, param, { fileName: file.name }, (type) => {
        console.log(type)
        this.$set(file, 'downLoading', false)
      })
    },
    parsePercentage(val) {
      return parseInt(val, 10)
    },
    onStart() {},
    onEnd() {},
    handlePreviewVideo(file) {
      this.previewVideoSrc = file.onlineUrl
      this.dialogVisible = true
    },
    handlePreviewImg(file) {
      const zIndex = PopupManager.nextZIndex()
      this.imageViewerIndex = zIndex + 20
      this.urlList.push(file.onlineUrl)
      this.showviewer = true
    },
    handlePreviewFile(file) {
      if (!this.online_preview_url) {
        return
      }
      const url = window.btoa(file.onlineUrl)
      // let http = 'https://file.keking.cn/onlinePreview?url='
      const http = this.online_preview_url
      const myUrl = `${http}${url}`
      window.open(myUrl, '_blank')
    },
    delFile(file) {
      this.fileList.forEach((item, index) => {
        if (item.uid === file.uid) {
          this.fileList.splice(index, 1)
        }
      })

      const list = this.$refs.myUpload.uploadFiles
      list.forEach((item) => {
        if (item.uid === file.uid) {
          this.$refs.myUpload.handleRemove(item)
        }
      })
    },
    /* 此方法用于表单中途新增已上传成功的文件 */
    addFileForUnshift(item) {
      const rowData = {
        ...item,
        fileId: item.id,
        name: item.fileName,
        onlineUrl: item.url,
        uid: item.id,
        status: 'success'
      }
      this.fileList.unshift(rowData)
      this.$refs.myUpload.uploadFiles.unshift(rowData)
    },
    // eslint-disable-next-line no-unused-vars
    handleRemove(file, fileList) {
      this.fileList.forEach((item, index) => {
        if (item.uid === file.uid) {
          this.fileList.splice(index, 1)
        }
      })
      // console.log('handleRemove', file, fileList)
      //   this.fileList = fileList
    },
    showFileMaxReq: debounce(function () {
      const vm = this
      vm.$modal.msgError(vm.$t('ui.fileMaxReq').replace('$1', vm.sys_file_max_count))
    }, 100),
    showFileLimitNumReq: debounce(function () {
      const vm = this
      vm.$modal.msgError(vm.$t('ui.fileLimitNumReq').replace('$1', vm.sys_file_max_size))
    }, 100),
    showUploadTypeErrorReq: debounce(function () {
      const vm = this
      const str = vm.accept.join('/')
      vm.$modal.msgError(vm.$t('ui.uploadTypeErrorReq').replace('$1', str))
    }, 100),
    showRepeatFile: debounce(function () {
      const vm = this
      vm.$modal.msgError(vm.$t('ui.repeatFile'))
    }, 100),
    handleBeforeUpload(file) {
      const vm = this
      vm.fullscreenLoading = true
      if (this.accept && this.accept.length > 0) {
        const findItem = this.accept.find((item) => {
          const extension = file.name.indexOf('.') > -1 ? '.' + file.name.split('.').pop() : ''
          return extension.toLowerCase().includes(item.toLowerCase())
        })
        if (!findItem) {
          this.showUploadTypeErrorReq()
          return Promise.reject(new Error('error'))
        }
      }
      if (vm.fileList.length >= vm.sys_file_max_count) {
        vm.showFileMaxReq()
        return Promise.reject(new Error('error'))
      }
      const isLt50M = file.size / 1024 / 1024 > vm.sys_file_max_size
      if (isLt50M) {
        vm.showFileLimitNumReq()
      }

      const isContain1 = vm.fileList.some((_file) => _file.name === file.name)
      const isContain2 = vm.filterOthersFileList.some((_file) => {
        console.log(_file)
        return _file.name === file.name
      })
      console.log(vm.filterOthersFileList, isContain2, file.name)

      const isContain = isContain1 || isContain2
      if (isContain) {
        vm.showRepeatFile()
      }
      if (isLt50M || isContain) {
        vm.fullscreenLoading = false
      }
      if (!isContain && !isLt50M) {
        file.uploading = true
        this.fileList.push(file)
        return true
      } else {
        return false
      }
    },
    // eslint-disable-next-line no-unused-vars
    handleUploadFaile(errdata, file) {
      console.log(file)
      this.fullscreenLoading = false
      this.fileList.forEach((item, index) => {
        if (item.uid === file.uid) {
          this.fileList.splice(index, 1)
        }
      })
      // this.$modal.msgError('上传失败')
    },
    handleUploadSuccess(results, file, fileList) {
      const { data, code, msg } = results
      if (code === 200) {
        file.fileId = data.id
        file.url = data.url
        file.onlineUrl = data.url
        file.createTime = data.createTime
        file.creatorName = data.creatorName
        file.size = data.size
        file.fileType = this.getFileType(file)
        if (file.fileType === 'video') {
          this.getVideoDuration(file)
        }
        this.fileList.forEach((item, index) => {
          if (item.uid === file.uid) {
            this.fileList.splice(index, 1, file)
          }
        })
        // this.fileList.push(file)
      } else {
        this.delFile(file)

        // this.fileListCache = JSON.parse(JSON.stringify(this.fileList))
        this.$modal.msgError(msg)
      }

      const obj = fileList.find((item) => {
        return item.status === 'uploading'
      })

      if (obj) {
        this.fullscreenLoading = true
      } else {
        this.fullscreenLoading = false
      }
    }
  }
}
</script>
<style lang="scss">
.is-upload-disabled .el-upload {
  display: none;
}
.single-file .el-upload-dragger {
  padding: 0 !important;
}
.my-upload-file-warp {
  color: #606266;
  line-height: 0;
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      line-height: 30px;
      width: 100%;
      height: auto;
      padding: 10px 0;
      .el-icon-plus {
        font-size: 20px;
      }
      .el-upload__text {
        color: #999;
      }
    }
  }
  .file-item {
    // display: flex;
    // align-items: center;
    height: 32px;
    line-height: 32px;
    padding-left: 10px;
    transition: background-color 0.3s;
    border-radius: 4px;
    font-size: 14px;
    // vertical-align: text-top;
    .item-left {
      display: inline-flex;
      width: 60%;
      flex-wrap: nowrap;
      align-items: center;
      align-items: baseline;
      .el-button + .el-button {
        margin-left: 6px;
      }
      .item-left-btn {
        display: none;
      }

      .fileName {
        overflow: hidden;
        white-space: nowrap; //让内容只显示为一行
        text-overflow: ellipsis; //内容超出后显示为省略号
        cursor: pointer;
      }
    }
    .item-right {
      padding-left: 20px;
      display: inline-flex;
      align-items: baseline;
      width: 40%;
      .uploadBy {
        max-width: 100px;
        overflow: hidden;
        white-space: nowrap; //让内容只显示为一行
        text-overflow: ellipsis; //内容超出后显示为省略号
      }
      .fileRemarks {
        margin-left: 10px;
        overflow: hidden;
        white-space: nowrap; //让内容只显示为一行
        text-overflow: ellipsis; //内容超出后显示为省略号
      }
    }
    &:hover {
      background-color: #eee;
      .item-left {
        .item-left-btn {
          display: initial;
        }
      }
    }
  }
  .el-upload-list__item {
    transition: none !important;
    .el-progress__text {
      font-size: 12px !important;
    }
  }
  .curAction {
    .item-left {
      .item-left-btn {
        display: initial;
      }
    }
    background-color: #eee;
  }
}

.noAttachment {
  background-color: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>
