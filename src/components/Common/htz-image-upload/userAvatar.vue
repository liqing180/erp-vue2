<template>
  <div>
    <div
      class="user-info-head"
      :class="{ 'head-hover': !disabled }"
      @click="editCropper()"
      style="margin-top: 8px"
    >
      <i v-if="photoUrl && !disabled" class="del-icon" @click.stop="delFile"></i>
      <img v-if="photoUrl" :src="photoUrl" class="img-circle img-lg" />
      <div v-else class="img-circle img-lg"></div>

      <i
        v-if="commonFileList.length > 0 && isDownload"
        class="el-icon-download pointer down-icon"
        @click.stop="handleDownFile"
      ></i>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="dlgTitle || $t('ui.modifyAvatar')"
      v-dialogDrag
      :visible.sync="open"
      width="500px"
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
        <el-col v-if="false" :xs="24" :md="12" :style="{ height: '350px' }">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :span="4">
          <el-upload
            action="#"
            :accept="'.jpg,.jpeg,.png'"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <el-button size="small">
              {{ $t('uiBtn.upload') }}
              <!-- <i class="el-icon-upload el-icon--right"></i> -->
            </el-button>
          </el-upload>
        </el-col>
        <el-col :span="3">
          <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
        </el-col>
        <el-col :span="3">
          <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
        </el-col>
        <el-col :span="3">
          <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
        </el-col>
        <el-col :span="3">
          <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>
        </el-col>
        <el-col :span="2" :offset="3">
          <el-button type="primary" size="small" @click="uploadImg()">
            {{ $t('uiBtn.submit') }}
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { multiFileUploadFn, uploadCompanySealFn, downloadFile } from '@/api/basic/basic'

import downFile from '@/utils/downFile.js'
export default {
  components: { VueCropper },
  props: {
    photoUrl: {
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
    isDelBG: {
      type: Boolean,
      default: false
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
        autoCropWidth: 500, // 默认生成截图框宽度
        autoCropHeight: 500, // 默认生成截图框高度
        original: false, // 图片是按原始宽高显示 (针对大图 可以铺满)
        enlarge: 4, // 裁剪图片根据截图框输出比例倍数 (高清输出)
        centerBox: true, // 截图框是否限制在图片里
        fixed: false, // 是否开启截图框宽高固定比例
        fixedBox: false, // 固定截图框大小
        fixedNumber: [1, 1] // 截图框的宽高比例, 开启fixed生效
      },
      previews: {}
    }
  },
  computed: {
    imgTrick() {
      const img = new Image()
      img.src = this.options.img
      img.crossOrigin = 'anonymous'
      return img
    }
  },
  watch: {
    photoUrl: {
      handler(val) {
        // console.log(val)
        this.$set(this.options, 'img', val)
      },
      immediate: true
    }
  },

  methods: {
    handleDownFile() {
      const url = downloadFile
      const file = this.commonFileList[0]
      const param = { id: file.id }

      const fileName = this.documentName || file.fileName
      this.$set(file, 'downLoading', true)
      downFile('post', url, param, { fileName: fileName + file.fileExtension }, (type) => {
        // console.log(type)
        this.$set(file, 'downLoading', false)
      })
    },
    getBase64(img) {
      function getBase64Image(img, width, height) {
        const canvas = document.createElement('canvas')
        canvas.width = width || img.width
        canvas.height = height || img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const dataURL = canvas.toDataURL()
        return dataURL
      }
      const image = new Image()
      image.crossOrigin = ''
      image.src = img
      return new Promise((resolve, reject) => {
        image.onload = function () {
          resolve(getBase64Image(image)) // 将base64传给done上传处理
        }
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
      this.$nextTick(() => {
        document.removeEventListener('paste', this.handlePasteAvatar)
        document.addEventListener('paste', this.handlePasteAvatar)
      })
    },
    // 粘贴头像
    handlePasteAvatar(e) {
      // 只有弹窗打开状态才处理
      if (!this.open) return
      const clipboardData = e.clipboardData || window.clipboardData
      // console.log('粘贴', clipboardData)
      if (!clipboardData || !clipboardData.items) {
        return
      }
      let hasImage = false
      Array.from(clipboardData.items).find((item) => {
        // 校验是否图片
        if (item.type.indexOf('image/') !== -1) {
          hasImage = true

          const file = item.getAsFile()

          if (file) {
            this.beforeUpload(file)
          }
          return true
        }
        return false
      })
      // 剪贴板存在内容，但不是图片
      if (!hasImage) {
        this.$modal.msgError(this.$t('ui.imageError'))
      }
    },
    // 覆盖默认的上传行为
    requestUpload() {},
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
    // 上传预处理
    beforeUpload(file) {
      if (file.type.indexOf('image/') === -1) {
        this.$modal.msgError(this.$t('ui.imageError'))
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          this.options.img = reader.result
        }
      }
    },
    // 上传图片
    uploadImg() {
      this.$refs.cropper.getCropBlob((data) => {
        const formData = new FormData()
        formData.append('files', data)
        const FN = this.isDelBG ? uploadCompanySealFn : multiFileUploadFn
        FN(formData).then((response) => {
          this.open = false
          this.$emit('change', response.data)
          this.options.img = response.data.url

          this.visible = false
        })
      })
    },
    delFile() {
      this.$emit('change', {})
    },

    // 实时预览
    realTime(data) {
      // console.log(data)

      this.previews = data
    },
    // 关闭窗口
    closeDialog() {
      document.removeEventListener('paste', this.handlePasteAvatar)
      this.$set(this.options, 'img', this.photoUrl)
      this.visible = false
    }
  }
}
</script>
<style scoped lang="scss">
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
.user-info-head {
  position: relative;
  display: inline-block;
  height: 148px;
  width: 148px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.img-circle {
  border-radius: 50%;
  border: 1px solid #eee;
}

.img-lg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.head-hover:hover:after {
  content: '+';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 140px;
  border-radius: 50%;
}
.down-icon {
  display: none;
}
.user-info-head:hover .down-icon {
  font-size: 28px;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: initial;
}
</style>
