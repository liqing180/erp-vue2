<template>
  <div>
    <div class="user-info-head" @click="editCropper()">
      <img :src="options.img" class="img-circle img-lg" style="object-fit: scale-down" />
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
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
import store from '@/store'
import { VueCropper } from 'vue-cropper'
import { uploadAvatar } from '@/api/system/user'

export default {
  components: { VueCropper },
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 是否显示cropper
      visible: false,
      // 弹出层标题
      title: this.$t('ui.modifyAvatar'),
      options: {
        img: store.getters.avatar, // 裁剪图片的地址
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

  methods: {
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
        formData.append('avatarfile', data)
        uploadAvatar(formData).then((response) => {
          this.open = false
          this.options.img = response.imgUrl
          store.commit('SET_AVATAR', this.options.img)
          this.$modal.msgSuccess(this.$t('ui.modifiedSuccess'))
          this.visible = false
        })
      })
    },
    // 实时预览
    realTime(data) {
      this.previews = data
    },
    // 关闭窗口
    closeDialog() {
      document.removeEventListener('paste', this.handlePasteAvatar)
      this.options.img = store.getters.avatar
      this.visible = false
    }
  }
}
</script>
<style scoped lang="scss">
.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover:after {
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
  line-height: 110px;
  border-radius: 50%;
}
</style>
