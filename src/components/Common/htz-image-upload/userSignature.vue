<template>
  <div>
    <!-- :accept="'.jpg,.jpeg,.png'" -->
    <div v-show="!!signatureUrl">
      <div class="upload-preview flex" v-if="signatureUrl">
        <div class="imgBox">
          <img :src="signatureUrl" />
        </div>
        <div class="btn-box">
          <i class="el-icon-view" @click="handlePreviewImg()"></i>
          <i v-if="!disabled" class="el-icon-delete mt10" @click="removeFile()"></i>
        </div>
      </div>
    </div>
    <div
      v-show="!signatureUrl"
      class="upload-container"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="handleClick"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
      :class="{ 'upload-active': (isActive || isHover) && !disabled }"
    >
      <div v-if="!disabled" style="text-align: center; padding: 20px">
        <div class="upload-icon">
          <i class="el-icon-upload"></i>
        </div>
        <p class="upload-tip">{{ $t('ui.dragClickUpload') }}</p>
        <p class="upload-support">{{ $t('ui.supportsFileType') }}</p>
        <div v-if="error" class="upload-error">{{ error }}</div>
      </div>
      <div v-else style="text-align: center; padding: 20px 0">
        {{ $t('ui.unsignedImage') }}
      </div>
      <input
        ref="fileInput"
        type="file"
        :accept="comAccept"
        class="file-input"
        @change="handleFileChange"
      />
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('ui.adjustYourSignature')"
      v-dialogDrag
      :visible.sync="open"
      width="680px"
      append-to-body
      @opened="modalOpened"
      @close="closeDialog()"
    >
      <el-row>
        <el-col :span="24" :style="{ height: '350px', overflow: 'hidden' }">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            mode="contain"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixed="options.fixed"
            :fixedBox="options.fixedBox"
            :original="options.original"
            :centerBox="options.centerBox"
            :enlarge="options.enlarge"
            @realTime="realTime"
            outputType="png"
            fillColor="#fff"
            v-if="visible"
          />
        </el-col>
      </el-row>
      <el-row class="mt10 mb10">
        <el-col :span="12">
          <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
          <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
          <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
          <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="info" plain size="small" @click="open = false">
            {{ $t('uiBtn.cancel') }}
          </el-button>
          <el-button type="primary" :loading="uploadImgLoading" size="small" @click="uploadImg()">
            {{ $t('ui.confirmSignature') }}
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>

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
import { VueCropper } from 'vue-cropper'
import { uploadCompanySealFn, downloadFile } from '@/api/basic/basic'
// import imageCompression from 'browser-image-compression'
import { PopupManager } from 'element-ui/lib/utils/popup'
import elImageViewer from 'element-ui/packages/image/src/image-viewer'

import downFile from '@/utils/downFile.js'
export default {
  components: { VueCropper, elImageViewer },
  props: {
    signatureUrl: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDownload: {
      type: Boolean,
      default: true
    },
    dlgTitle: {
      type: String
    },
    commonFileList: {
      type: Array,
      default: () => []
    },
    documentName: {
      type: String,
      default: ''
    },
    accept: {
      type: [Array],
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 是否显示cropper
      visible: false,

      options: {
        img: '', // 裁剪图片的地址
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 640, // 默认生成截图框宽度
        autoCropHeight: 350, // 默认生成截图框高度
        original: false, // 图片是按原始宽高显示 (针对大图 可以铺满)
        enlarge: 4, // 裁剪图片根据截图框输出比例倍数 (高清输出)
        centerBox: true, // 截图框是否限制在图片里
        fixed: false, // 是否开启截图框宽高固定比例
        fixedBox: false, // 固定截图框大小
        fixedNumber: [3, 1] // 截图框的宽高比例, 开启fixed生效
      },
      uploadImgLoading: false,
      previews: {},
      error: '',
      isHover: false,
      isActive: false,
      showviewer: false,
      urlList: [],
      imageViewerIndex: 3000
    }
  },
  computed: {
    imgTrick() {
      const img = new Image()
      img.src = this.options.img
      img.crossOrigin = 'anonymous'
      return img
    },
    comAccept() {
      if (this.accept && this.accept.length > 0) {
        return this.accept.join(',')
      }
      return 'image/*'
    }
  },
  watch: {
    signatureUrl: {
      handler(val) {
        if (val) {
          this.uploadImgLoading = false
          this.error = ''
        }
      },
      immediate: true
    }
  },

  methods: {
    handlePreviewImg() {
      const zIndex = PopupManager.nextZIndex()
      this.imageViewerIndex = zIndex + 20
      this.urlList.push(this.signatureUrl)
      this.showviewer = true
    },
    closeviewer() {
      this.showviewer = false
      this.urlList = []
    },
    handleClick() {
      if (this.disabled) {
        return
      }
      this.$refs.fileInput.click()
    },
    handleDragOver() {
      // 拖拽文件进入时激活高亮状态
      this.isActive = true
    },
    handleDragLeave() {
      // 拖拽文件离开时取消高亮状态
      this.isActive = false
    },
    handleDrop(e) {
      e.preventDefault()
      if (this.disabled) {
        return
      }
      // 拖拽完成后取消高亮状态
      this.isActive = false
      const files = e.dataTransfer.files
      if (files.length) {
        this.handleFile(files[0])
      }
    },
    handleFileChange(e) {
      const file = e.target.files[0]
      if (file) {
        this.handleFile(file)
      }
    },
    async compressImage(file) {
      /* const options = {
        maxSizeMB: 20, // 最大文件大小为1MB
        maxWidthOrHeight: 1920, // 最大宽度或高度为1920px
        useWebWorker: true, // 使用Web Worker进行压缩，避免阻塞UI线程
        initialQuality: 0.8 // 初始质量为0.8，然后根据需要调整大小以匹配maxSizeMB或maxWidthOrHeight限制。
      } */
      /* imageCompression(file, options).then((res) => {
        console.log('111', res)
        this.options.img = URL.createObjectURL(res)
        this.editCropper()
      }) */
    },
    handleFile(file) {
      // 检查文件类型
      if (this.accept && this.accept.length > 0) {
        const findItem = this.accept.find((item) => {
          const extension = file.name.indexOf('.') > -1 ? '.' + file.name.split('.').pop() : ''
          return extension.toLowerCase().includes(item.toLowerCase())
        })
        if (!findItem) {
          this.error = this.$t('ui.fileTypeNotSupported')
          return
        }
      }

      // 检查文件大小
      if (file.size > 30 * 1024 * 1024) {
        this.error = this.$t('ui.imageSizeExceeds')
        return
        // const newFile = this.compressImage(file)
      }
      this.error = ''
      this.$refs.fileInput.value = ''
      this.options.img = URL.createObjectURL(file)
      this.editCropper()
    },
    removeFile() {
      this.$emit('change', {})
    },
    handleDownFile() {
      const url = downloadFile
      const file = this.commonFileList[0]
      const param = { id: file.id }

      const fileName = this.documentName || file.fileName
      this.$set(file, 'downLoading', true)
      downFile('post', url, param, { fileName: fileName + file.fileExtension }, (type) => {
        this.$set(file, 'downLoading', false)
      })
    },
    // 编辑头像
    editCropper() {
      if (this.disabled) return
      this.open = true
    },
    // 打开弹出层结束时的回调
    modalOpened() {
      this.visible = true
    },
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 上传图片
    uploadImg() {
      this.uploadImgLoading = true
      this.$refs.cropper.getCropBlob((data) => {
        // const file = new File([data], 'User Signature.png', { type: data.type });
        const formData = new FormData()
        formData.append('files', data)
        formData.append('isCrop', '0')
        uploadCompanySealFn(formData)
          .then((response) => {
            this.open = false
            this.$emit('change', response.data)
            this.options.img = ''

            this.visible = false
            this.uploadImgLoading = false
          })
          .catch(() => {
            this.uploadImgLoading = false
          })
      })
    },
    delFile() {
      this.$emit('change', {})
    },

    // 实时预览
    realTime(data) {
      this.previews = data
    },
    // 关闭窗口
    closeDialog() {
      this.$set(this.options, 'img', '')
      this.visible = false
    }
  }
}
</script>
<style scoped lang="scss">
.upload-container {
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  /* padding-top: 20px; */
  cursor: pointer;
  width: 500px;
  /* height: 140px; */
}
/* 高亮状态样式 */
.upload-active {
  border-color: #409eff; /* 高亮边框颜色 */
  background-color: rgba(64, 158, 255, 0.05); /* 轻微背景色变化 */
}

.upload-icon {
  font-size: 40px;
  color: #999;
  margin-bottom: 10px;
}
.upload-tip {
  margin-bottom: 5px;
}
.upload-support {
  color: #999;
  font-size: 12px;
  margin-bottom: 10px;
}
.file-input {
  display: none;
}
.upload-error {
  color: red;
  font-size: 12px;
  margin-top: 10px;
}
.upload-preview {
  display: flex;
  border: 1px dashed #d1d5db;
  width: 380px;
  border-radius: 4px;
  padding: 10px;
}
.upload-preview .imgBox {
  width: 300px;
  height: 100px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.imgBox img {
  width: 300px;
  height: 100px;
  object-fit: contain;
}

.upload-preview .btn-box {
  padding-left: 20px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  i {
    cursor: pointer;
    color: #6b7280;
  }
  .el-icon-view:hover {
    color: #1890ff;
  }
  .el-icon-delete:hover {
    color: #ff4949;
  }
}
</style>
