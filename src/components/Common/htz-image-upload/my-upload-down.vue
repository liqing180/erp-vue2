<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    width="1000px"
    append-to-body
    :visible.sync="warpVisible"
    :title="$t('ui.download')"
  >
    <el-checkbox
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
      >{{ $t('ui.selectAll') }}</el-checkbox
    >
    <div class="my-upload-warp">
      <!-- <div class="upload-top"> -->
      <!-- <div class="action-item">
          <i v-if="fileList.length > 0" class="el-icon-download download-icon"></i>
        </div> -->
      <!--<div class="action-item">
          <i v-if="showFileFolding" class="el-icon-d-arrow-right arrow-icon" :class="isShowAll?'is-reverse' : ''" @click="isShowAll = !isShowAll"></i>
        </div> -->
      <!-- </div> -->
      <div class="drag-warp">
        <draggable v-model="fileList" :disabled="true" @start="onStart" @end="onEnd">
          <transition-group>
            <div v-for="file in fileList" :key="file.uid" class="drag-item">
              <div class="drag-item-box">
                <div style="width: 130px; height: 114px">
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

                  <div class="del-icon">
                    <el-checkbox
                      v-model="file.isSelect"
                      @change="handleCheckedChange"
                    ></el-checkbox>
                  </div>
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
      <div class="my-upload" :style="`max-height: ${isShowAll ? '' : '516px'}`">
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
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="checkedCount <= 0" @click="downloadHandler">{{
        $t('ui.download')
      }}</el-button>
      <el-button @click="backHandle">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable'
import { multiUpload, downloadFile } from '@/api/basic/basic'
import downFile from '@/utils/downFile.js'
import { mapState } from 'vuex'
export default {
  components: {
    draggable
  },
  props: {
    disabled: {
      type: [Boolean],
      default: true
    },
    required: {
      type: [Boolean],
      default: false
    },
    limit: {
      type: [Number],
      default: 15
    },
    allFileSize: {
      type: [Number],
      default: 300
    }
  },
  data() {
    return {
      warpVisible: false,
      isShowAll: true,
      fileList: [],
      uploadUrl: multiUpload,
      fileListCache: [],
      contentForm: {
        fileIds: ''
      },
      fullscreenLoading: false,
      dialogVisible: false,
      previewVideoSrc: '',
      checkAll: false,
      isIndeterminate: false
    }
  },
  computed: {
    ...mapState({
      access_token: (state) => state.common.access_token
    }),

    uploadDisabled() {
      return this.disabled || this.fileList.length === this.limit
    },
    checkedCount() {
      const checkedCount = this.fileList.filter((item) => item.isSelect).length
      return checkedCount
    },

    showFileFolding() {
      const list = this.fileList.length
      if (this.uploadDisabled) {
        return list >= 15
      } else {
        return list >= 14
      }
    },
    online_preview_url() {
      if (this.$store.state.user.online_preview_url) {
        return this.$store.state.user.online_preview_url
      }
      return ''
    }
  },
  methods: {
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
    handleCheckAllChange(val) {
      this.fileList.forEach((item) => {
        item.isSelect = val
      })
      this.isIndeterminate = false
    },
    handleCheckedChange() {
      const checkedCount = this.fileList.filter((item) => item.isSelect).length
      this.checkAll = checkedCount === this.fileList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.fileList.length
    },
    downloadHandler() {
      this.fileList.forEach((file) => {
        if (file.isSelect) {
          this.handleDownFile(file)
        }
      })
      this.backHandle()
    },
    backHandle() {
      this.warpVisible = false
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
      //   var url = URL.createObjectURL(file.raw)
      //   console.log(url, file.url)
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
      this.warpVisible = true
      this.checkAll = false
      this.isIndeterminate = false
      const list = []
      files.forEach((item) => {
        const rowData = {
          ...item,
          isSelect: false
        }
        rowData.fileType = this.getFileType(rowData)

        list.push(rowData)
      })

      this.fileList = JSON.parse(JSON.stringify(list))
      this.fileListCache = JSON.parse(JSON.stringify(list))
    },
    getFileIds() {
      if (this.required && this.fileList.length === 0) {
        this.$modal.msgError(this.$t('ui.uploadReq'))
        return false
      }
      let uploading = false
      const fileIds = this.fileList.map((item) => {
        if (item.uploading) {
          uploading = true
        }
        return item.fileId
      })
      if (uploading) {
        this.$modal.msgError(this.$t('ui.uploading'))

        return false
      } else {
        return fileIds.join(',')
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
      console.log('delFile', file)
      this.fileList.splice(index, 1)
      //   this.$refs.myUpload.handleRemove(file)
      const list = this.$refs.myUpload.uploadFiles
      list.forEach((item, index) => {
        if (item.uid === file.uid) {
          list.splice(index, 1)
        }
      })
    },
    // eslint-disable-next-line no-unused-vars
    handleRemove(file, fileList) {
      console.log('handleRemove', file, fileList)
      //   this.fileList = fileList
    },
    handleBeforeUpload(file) {
      const vm = this
      vm.fullscreenLoading = true
      if (vm.fileList.length === vm.limit) {
        vm.$modal.msgError(vm.$t('ui.fileMaxReq').replace('$1', this.limit))
        return false
      }
      const isLt50M = file.size / 1024 / 1024 > vm.allFileSize
      const isLt500M = file.size / 1024 / 1024 > 500
      if (isLt50M) {
        vm.$modal.msgError(vm.$t('ui.fileLimitNumReq').replace('$1', vm.allFileSize))
      }
      if (isLt500M) {
        vm.$modal.msgError(vm.$t('ui.fileLimit500Req'))
      }
      //   const isContain = vm.fileList.some(_file => _file.name === file.name)
      const isContain = false

      // console.log(file, vm.fileListCache)
      if (isContain) {
        vm.$modal.msgError(vm.$t('ui.repeatFile'))
      }
      if (isLt50M || isLt500M || isContain) {
        vm.fullscreenLoading = false
      }
      if (!isLt500M && !isContain && !isLt50M) {
        file.uploading = true
        this.fileList.push(file)
        console.log('handleBeforeUpload', file)
        return true
      } else {
        return false
      }
    },
    // eslint-disable-next-line no-unused-vars
    handleUploadFaile(err, file, fileList) {
      this.fullscreenLoading = false
      this.$modal.msgError(err)
    },
    handleUploadSuccess(results, file, fileList) {
      console.log('handleUploadSuccess', file)
      const { msg, res } = results
      if (res === 0) {
        file.fileId = msg
        // file.onlineUrl
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
        fileList.pop()
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

<style lang="scss" scoped>
.dlg-video {
  width: 100%;
  height: 600px;
}
.drag-warp {
  display: inline-block;
  // position: absolute;
  // max-width: 780px;
  // height: 0;
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
      // background-image: url('./image/del.png');
      background-color: #888;
      background-size: cover;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 100;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
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

.my-upload-warp {
  position: relative;
  margin-top: 10px;
  .upload-action {
    position: absolute;
    top: 0;
    right: -36px;
    width: 30px;
    line-height: normal;
    // height: 145px;
    .action-item {
      background-color: #ddd;
      margin: 4px 0;
      text-align: center;
      border-radius: 4px;
    }
    .download-icon {
      font-size: 28px;
      color: #000;
    }
    .arrow-icon {
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
  margin-top: 2px;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  height: 28px;
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
.del-icon .el-checkbox__inner {
  width: 20px;
  height: 20px;
}
.del-icon .el-checkbox__inner::after {
  left: 7px;
  top: 4px;
}

.my-upload {
  // overflow-x: hidden;
  // overflow-y: hidden;
  position: relative;
  display: flex;
  .el-upload {
    width: 148px;
    height: 148px;
    border: 0;
  }
  .el-upload-dragger {
    width: 146px;
    height: 146px;
    position: relative;
    z-index: 300;
  }
}
.is-upload-disabled .el-upload.el-upload--picture-card {
  display: none;
}
.el-upload-list__item {
  transition: none !important;
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
