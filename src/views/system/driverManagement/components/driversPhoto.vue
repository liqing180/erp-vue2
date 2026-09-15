<template>
  <div class="my-upload-warp">
    <div class="upload-action">
      <!-- <div class="action-item">
        <i
          v-if="showDownload && isDown"
          class="el-icon-download download-icon"
          @click="previewDownFile"
        ></i>
      </div> -->
      <div class="action-item action-item-show">
        <i
          v-if="showFileFolding"
          class="el-icon-d-arrow-right arrow-icon"
          :class="isShowAll ? 'is-reverse' : ''"
          @click="isShowAll = !isShowAll"
        ></i>
      </div>
    </div>
    <div class="my-upload" :class="{ 'my-upload-scroll': !isShowAll && showFileFolding }">
      <div class="drag-warp">
        <draggable
          v-model="fileList"
          :disabled="fullscreenLoading || disabled"
          @start="onStart"
          @end="onEnd"
        >
          <transition-group>
            <div
              v-for="(file, index) in fileList"
              :key="file.uid"
              :class="{ hideFileName: hideFileName }"
              class="drag-item"
            >
              <div v-if="file.uploading" class="drag-item-box item-loading">
                <i v-if="!disabled" class="del-icon" @click.stop="delFile(index, file)"></i>
              </div>
              <div v-else class="drag-item-box">
                <div style="width: 130px; height: 114px" class="drag-item-img">
                  <div v-if="file.fileType === 'video'" class="item-video">
                    <video style="width: 100%; height: 100%" :src="file.url"></video>

                    <div class="video-cover">
                      <div class="play-icon" @click="handlePreviewVideo(file)">
                        <i></i>
                      </div>
                      <div class="play-time">{{ file.times }}</div>
                    </div>
                  </div>
                  <el-image
                    v-else-if="file.fileType === 'img'"
                    style="width: 100%; height: 100%"
                    :src="file.url"
                    fit="contain"
                    :preview-src-list="[file.url]"
                  >
                  </el-image>
                  <div v-else-if="file.fileType === 'mp3'" class="item-file-con">
                    <img src="./image/mp3.png" @click="handlePreviewFile(file)" />
                  </div>
                  <div v-else-if="file.fileType === 'pdf'" class="item-file-con">
                    <img src="./image/pdf.png" @click="handlePreviewFile(file)" />
                  </div>
                  <div v-else-if="file.fileType === 'ppt'" class="item-file-con">
                    <img src="./image/ppt.png" @click="handlePreviewFile(file)" />
                  </div>
                  <div v-else-if="file.fileType === 'txt'" class="item-file-con">
                    <img src="./image/txt.png" @click="handlePreviewFile(file)" />
                  </div>
                  <div v-else-if="file.fileType === 'word'" class="item-file-con">
                    <img src="./image/word.png" @click="handlePreviewFile(file)" />
                  </div>
                  <div v-else-if="file.fileType === 'excel'" class="item-file-con">
                    <img src="./image/excel.png" @click="handlePreviewFile(file)" />
                  </div>
                  <div v-else class="item-file-con">
                    <img src="./image/noneFile.png" @click="handlePreviewFile(file)" />
                  </div>

                  <i
                    v-if="!disabled && !file.disCancel"
                    class="del-icon"
                    @click="delFile(index, file)"
                  ></i>
                </div>
                <span
                  :title="file.name"
                  class="upload-file-name"
                  @dblclick="handleDownFile(file)"
                  >{{ file.name }}</span
                >
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>
      <el-upload
        ref="myUpload"
        :disabled="uploadDisabled"
        class="upload-warp"
        :class="uploadDisabled ? 'is-upload-disabled' : ''"
        style="width: 100%"
        :accept="comAccept"
        drag
        multiple
        :action="uploadUrl"
        name="files"
        :show-file-list="true"
        list-type="picture-card"
        :on-remove="handleRemove"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadFaile"
        :file-list="fileListCache"
        :headers="{ Authorization: isToken ? access_token : null }"
      >
        <div
          style="
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          "
          :title="addTip"
        >
          <i
            style="
              width: 100px;
              height: 100px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 60px;
            "
            class="el-icon-plus"
          ></i>
        </div>
        <div slot="file" slot-scope="{ file }">
          <el-progress
            v-if="file.status === 'uploading'"
            type="circle"
            :stroke-width="6"
            :format="format"
            color="#67c23a"
            :percentage="parsePercentage(file.percentage)"
          >
          </el-progress>
        </div>
      </el-upload>

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

    <myUploadDown ref="myUploadDown" :hideFileName="hideFileName" />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { multiFileUpload, downloadFile, multiFileUpload2 } from '@/api/basic/basic'
import downFile from '@/utils/downFile.js'
import myUploadDown from './my-upload-down'
import { debounce } from 'lodash'

import { mapState } from 'vuex'
export default {
  components: {
    draggable,
    myUploadDown
  },
  props: {
    uploadAPI: {
      type: [String],
      default: ''
    },
    disabled: {
      type: [Boolean],
      default: false
    },
    required: {
      type: [Boolean],
      default: false
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
    addTip: {
      type: [String],
      default: ''
    },
    // 是否需要token
    isToken: {
      type: Boolean,
      default: true
    },
    // 是否允许下载
    isDown: {
      type: Boolean,
      default: true
    },
    hideFileName: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowAll: false,
      fileList: [
        // { name: 'food.jpeg',
        //   uid: '6107357109157888',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // },
        // { name: 'food2.jpeg',
        //   uid: '6107357109157882',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ],
      // uploadUrl: multiFileUpload,
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
      contentForm: {
        fileIds: ''
      },
      fullscreenLoading: false,
      dialogVisible: false,
      previewVideoSrc: ''
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
      return this.isToken ? this.uploadAPI || multiFileUpload : multiFileUpload2
    },

    showFileFolding() {
      const list = this.fileList.length
      if (this.uploadDisabled) {
        return list > 15
      } else {
        return list > 14
      }
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
      return 10
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
    }
  },

  methods: {
    format(percentage) {
      return percentage === 100 ? 'Uploading...' : `${percentage}%`
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
          //   ...item,
          fileId: item.id,
          name: item.fileName,
          url: item.url,
          onlineUrl: item.url,
          uid: item.id,
          disCancel: item.disCancel
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
      return this.fileList.map((item) => {
        return {
          id: item.fileId,
          fileName: item.name,
          url: item.url
        }
      })
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
        // return item.fileId
      })
      if (uploading) {
        this.$modal.msgError(this.$t('ui.uploading'))

        return false
      } else {
        return fileIds
        // return fileIds.join(',')
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
      this.previewVideoSrc = file.url
      this.dialogVisible = true
    },
    delFile(index, file) {
      this.fileList.splice(index, 1)
      const list = this.$refs.myUpload.uploadFiles
      list.forEach((item) => {
        if (item.uid === file.uid) {
          this.$refs.myUpload.handleRemove(item)
          // list.splice(index, 1)
        }
      })
    },
    // eslint-disable-next-line no-unused-vars
    handleRemove(file, fileList) {
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

      const isContain = vm.fileList.some((_file) => _file.name === file.name)

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
        this.fileList.forEach((item, index) => {
          if (item.uid === file.uid) {
            this.fileList.splice(index, 1)
          }
        })
        this.fileListCache = JSON.parse(JSON.stringify(this.fileList))
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
<style lang="scss" scoped>
.hideFileName {
  .upload-file-name {
    display: none;
  }
  .drag-item-img {
    width: 146px !important;
    height: 146px !important;
  }
}

.dlg-video {
  width: 100%;
  height: 600px;
}
.drag-warp {
  display: inline-block;
  position: absolute;
  // max-width: 780px;
  height: 0;
  flex-wrap: wrap;
  z-index: 100;
  & > div {
    overflow: hidden;
  }
  .drag-item {
    overflow: hidden;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    line-height: 24px;
    display: inline-block;
    color: rgb(8, 17, 14);
  }
  .drag-item-box {
    background-color: #fff;
    position: relative;
    height: 100%;
    width: 100%;
    // padding-top: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .del-icon {
      width: 24px;
      height: 24px;
      background-image: url('./image/del.png');
      background-color: #fff;
      background-size: cover;
      border-radius: 50%;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 100;
      cursor: pointer;
    }
  }
  .item-loading {
    background-color: #0000;
  }
  .item-video {
    position: relative;
    height: 100%;
    .video-cover {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background-color: #0004;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding-top: 30px;
    }
    .play-time {
      color: #fff;
    }
    .play-icon {
      cursor: pointer;
      display: inline-block;
      width: 40px;
      height: 40px;
      position: relative;
      i {
        display: inline-block;
        width: 40px;
        height: 40px;
        background-image: url('./image/play.png');
        background-size: 100%;
        position: relative;
        z-index: 100;
      }
    }
    .play-icon:before {
      content: '';
      width: 20px;
      height: 20px;
      background-color: #fff;
      display: inline-block;
      // border-radius: 50%;
      vertical-align: middle;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
    }
  }
  .item-file-con {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      cursor: pointer;
      width: 90%;
      height: 90%;
    }
  }
}

.upload-warp {
  // border: 1px solid #000;
}

.my-upload-warp {
  line-height: 20px;
  position: relative;
  .upload-action {
    position: absolute;
    top: 0;
    right: -33px;
    width: 30px;
    height: 100%;
    z-index: 100;
    // background-color: #555;
    line-height: normal;
    // height: 145px;
    .action-item {
      background-color: #ddd;
      margin-top: 8px;
      text-align: center;
      border-radius: 4px;
    }
    .action-item-show {
      position: absolute;
      bottom: 10px;
      left: 0;
    }

    .download-icon {
      font-size: 28px;
      color: #000;
      cursor: pointer;
    }
    .arrow-icon {
      cursor: pointer;
      bottom: 0;
      left: 0;
      font-size: 28px;
      color: #000;
      transform: rotateZ(90deg);
      transition: transform 0.3s;
    }
    .is-reverse {
      transform: rotateZ(270deg);
    }
  }
}
.upload-file-name {
  cursor: pointer;
  margin-top: 0px;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  height: 30px;
  width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  word-wrap: break-word;
  /* background-color: #eee; */
}
</style>

<style lang="scss">
.my-upload {
  position: relative;
  padding-top: 8px;
  display: flex;
  .el-upload {
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    border: 0;
  }
  .el-upload-dragger {
    width: 146px;
    height: 146px;
    position: relative;
    z-index: 300;
  }
}
.my-upload-scroll {
  padding-top: 8px;
  max-height: 480px;
  overflow-x: hidden;
  overflow-y: auto;
}
.is-upload-disabled .el-upload.el-upload--picture-card {
  display: none;
}
.el-upload-list__item {
  transition: none !important;
  .el-progress__text {
    font-size: 12px !important;
  }
}

.my-upload::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: initial;
}

.my-upload::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(127, 135, 146, 0.5);
}

.my-upload::-webkit-scrollbar-track {
  width: 10px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
</style>
