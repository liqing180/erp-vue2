<template>
  <div>
    <div class="file-box">
      <!-- <div style="text-align: left; height: 40px" class="flexStart" v-if="fileList.length <= 0">
        <el-button
          size="mini"
          :disabled="uploadDisabled"
          v-if="!disabled"
          @click="handleUpload"
          icon="el-icon-upload2"
          >{{ $t('uiBtn.upload') }}</el-button
        >
      </div> -->
      <div v-for="file in fileList" :key="file.uid" class="file-icon-item">
        <i v-if="!disabled && !file.disCancel" class="file-del-icon" @click="delFile(file)"></i>
        <template v-if="file.status === 'success'">
          <div class="file-icon-box" v-if="file.fileType === 'img'">
            <el-image
              style="width: 32px; height: 32px"
              :src="file.onlineUrl"
              fit="contain"
              :preview-src-list="[file.onlineUrl]"
            >
            </el-image>
          </div>
          <div class="file-icon-box" v-else>
            <img
              class="file-img"
              v-if="file.fileType === 'mp3'"
              src="./image/mp3.png"
              @click="handlePreviewFile(file)"
            />
            <img
              class="file-img"
              v-else-if="file.fileType === 'video'"
              src="./image/mp4.png"
              @click="handlePreviewVideo(file)"
            />
            <img
              class="file-img"
              v-else-if="file.fileType === 'pdf'"
              src="./image/pdf.png"
              @click="handlePreviewFile(file)"
            />
            <img
              class="file-img"
              v-else-if="file.fileType === 'ppt'"
              src="./image/ppt.png"
              @click="handlePreviewFile(file)"
            />
            <img
              class="file-img"
              v-else-if="file.fileType === 'txt'"
              src="./image/txt.png"
              @click="handlePreviewFile(file)"
            />
            <img
              class="file-img"
              v-else-if="file.fileType === 'word'"
              src="./image/word.png"
              @click="handlePreviewFile(file)"
            />
            <img
              class="file-img"
              v-else-if="file.fileType === 'excel'"
              src="./image/excel.png"
              @click="handlePreviewFile(file)"
            />
            <img
              class="file-img"
              v-else
              src="./image/noneFile.png"
              @click="handlePreviewFile(file)"
            />
          </div>
        </template>
        <div v-else class="file-icon-box">
          <i class="el-icon-loading"></i>
        </div>
      </div>
      <div v-if="fileList.length < limit && !disabled" class="file-icon-item">
        <div
          class="file-icon-box"
          style="cursor: pointer"
          @click="handleUpload"
          :title="$t('uiBtn.upload')"
        >
          <i class="el-icon-upload2" style="font-size: 16px"></i>
        </div>
      </div>
    </div>

    <div>
      <el-form>
        <el-upload
          v-show="false"
          ref="myUpload"
          :disabled="uploadDisabled"
          :class="fileList.length > 0 || uploadDisabled ? 'is-upload-disabled' : ''"
          style="width: 100%"
          :accept="comAccept"
          drag
          multiple
          :action="uploadUrl"
          name="files"
          :show-file-list="true"
          list-type="text"
          :on-remove="handleRemove"
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadFaile"
          :file-list="fileListCache"
          :headers="{ Authorization: isToken ? access_token : null }"
        >
          <i class="el-icon-plus"></i>
          <div class="el-upload__text" ref="uploadText">{{ $t('ui.clickUploadTip') }}</div>
        </el-upload>
      </el-form>

      <el-image-viewer
        v-if="showviewer"
        :on-close="closeviewer"
        :url-list="urlList"
        :zIndex="imageViewerIndex"
        style="width: 100%; height: 100%; margin-left: 0%; margin-top: 0%"
      />

      <div v-if="previewVideoSrc && dialogVisible">
        <el-dialog
          :close-on-click-modal="false"
          v-dialogDrag
          width="1140px"
          append-to-body
          :visible.sync="dialogVisible"
        >
          <video
            class="dlg-video"
            autoplay="autoplay"
            controls="controls"
            :src="previewVideoSrc"
            :show-fullscreen-btn="true"
          ></video>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
// import draggable from 'vuedraggable'
import { multiFileUpload, downloadFile, multiFileUpload2 } from '@/api/basic/basic'
import downFile from '@/utils/downFile.js'
import { debounce } from 'lodash'

import { mapState } from 'vuex'

import elImageViewer from 'element-ui/packages/image/src/image-viewer'
import { PopupManager } from 'element-ui/lib/utils/popup'
import calculateMD5 from './calculateMD5'

export default {
  components: {
    // draggable,
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
      imageViewerIndex: 3000,
      urlList: []
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
      immediate: false,
      deep: false,
      handler: function (value) {
        this.updateFileList(value)
      }
    }
  },

  methods: {
    changeDefault(row) {
      if (row.isDefault === '1') {
        this.fileList.forEach((item) => {
          if (row.uid !== item.uid) {
            this.$set(item, 'isDefault', '0')
          }
        })
      }
    },
    closeviewer() {
      this.showviewer = false
      this.urlList = []
    },
    handlePreview(file) {
      if (!file.onlineUrl) return
      const fileType = this.getFileType(file)
      switch (fileType) {
        case 'video':
          this.handlePreviewVideo(file)
          break

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

      if (/.(avi|mpeg|saf|mp4|asf|wmf|wmv|rm|3gq|mp4|vob|mkv|wmv|mpg|rmvb|mov)$/i.test(item.name)) {
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
      downFile('post', url, param, { fileName: file.name })
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
      // const url = window.btoa(file.onlineUrl)
      const url = `${file.onlineUrl}?fullfilename=${encodeURIComponent(file.name)}`
      // const http = 'https://file.img-sz.top/preview/onlinePreview?url='
      const http = this.online_preview_url
      const myUrl = `${http}${window.btoa(url)}`
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
          // list.splice(index, 1)
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
    }, 500),
    showFileLimitNumReq: debounce(function () {
      const vm = this
      vm.$modal.msgError(vm.$t('ui.fileLimitNumReq').replace('$1', vm.sys_file_max_size))
    }, 500),
    showUploadTypeErrorReq: debounce(function () {
      const vm = this
      const str = vm.accept.join('/')
      vm.$modal.msgError(vm.$t('ui.uploadTypeErrorReq').replace('$1', str))
    }, 500),
    showRepeatFile: debounce(function () {
      const vm = this
      vm.$modal.msgError(vm.$t('ui.repeatFile'))
    }, 500),
    async handleBeforeUpload(file) {
      await calculateMD5(file)
        .then((md5) => {
          file.fileMd5 = md5
        })
        .catch((error) => {
          console.error(error)
        })
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

      const totalSize = vm.fileList.reduce((total, item) => {
        return total + Number(item.size)
      }, Number(file.size))
      const isLt50M = totalSize / 1024 / 1024 > vm.sys_file_max_size
      if (isLt50M) {
        vm.showFileLimitNumReq()
      }

      const isContain = vm.fileList.some((_file) => file.fileMd5 && file.fileMd5 === _file.fileMd5)
      if (isContain) {
        vm.showRepeatFile()
      }
      if (isLt50M || isContain) {
        vm.fullscreenLoading = false
      }
      if (!isContain && !isLt50M) {
        file.uploading = true
        if (this.fileList.length <= 0) {
          file.isDefault = '1'
        }
        this.fileList.push({ ...file })
        return true
      } else {
        return false
      }
    },
    // eslint-disable-next-line no-unused-vars
    handleUploadFaile(errdata, file) {
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
        file.onlineUrl = data.url
        file.createTime = data.createTime
        file.creatorName = data.creatorName
        file.size = data.size
        file.fileType = this.getFileType(file)
        file.fileMd5 = data.fileMd5
        if (file.fileType === 'video') {
          this.getVideoDuration(file)
        }
        this.fileList.forEach((item, index) => {
          if (item.uid === file.uid) {
            this.$set(file, 'isDefault', item.isDefault)
            this.$set(file, 'remarks', item.remarks)
            this.fileList.splice(index, 1, file)
          }
        })
        // this.fileList.push(file)
      } else {
        this.delFile(file)

        // this.fileListCache = JSON.parse(JSON.stringify(this.fileList))
        this.$modal.msgError({
          message: msg,
          duration: 0
        })
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
.file-box {
  display: flex;
  flex-wrap: wrap;
  width: 205px;
}
.file-icon-item {
  width: 36px;
  height: 36px;
  padding: 2px;
  position: relative;

  .file-del-icon {
    width: 12px;
    height: 12px;
    background-image: url('./image/del.png');
    background-color: #fff;
    background-size: cover;
    border-radius: 50%;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
    cursor: pointer;
  }
}
.file-icon-box {
  width: 32px;
  height: 32px;
  position: relative;
  box-shadow: inset 0 0 1px 1px #e3e3e3;
  display: flex;
  align-items: center;
  justify-content: center;

  .file-img {
    width: 32px;
    height: 32px;
  }
}

.dlg-video {
  width: 100%;
  height: 600px;
}
</style>
