<template>
  <el-popover placement="bottom" title="" trigger="hover">
    <div style="text-align: center; margin-bottom: 20px">{{ $t('QRcodeMsg.title') }}</div>
    <div class="qr-warp">
      <div class="qr-item" style="margin-right: 30px">
        <div>
          <svg-icon icon-class="android" style="font-size: 20px" /> {{ $t('QRcodeMsg.android') }}
        </div>

        <div>
          <img :src="path_android" class="img-lg" />
        </div>
      </div>
      <div class="qr-item">
        <div><svg-icon icon-class="IOS" style="font-size: 20px" /> {{ $t('QRcodeMsg.IOS') }}</div>
        <div>
          <img :src="path_ios" class="img-lg" />
        </div>
      </div>
    </div>
    <div slot="reference">
      <svg-icon icon-class="QRcode" />
    </div>
  </el-popover>
</template>

<script>
import { queryDownLoadImage } from '@/api/appUtils'
export default {
  data() {
    return {
      path_android: '',
      path_ios: '',
      src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.xjishu.com%2Fimg%2Fzl%2F2017%2F10%2F212257159687020.gif&refer=http%3A%2F%2Fimg.xjishu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644722070&t=7794e189afd512a843c831ce27481283'
    }
  },
  beforeCreate() {
    const locale = {
      zh: {
        QRcodeMsg: {
          title: 'App下载',
          android: '安卓',
          IOS: '苹果'
        }
      },
      en: {
        QRcodeMsg: {
          title: 'App Download',
          android: 'Android',
          IOS: 'IOS'
        }
      }
    }
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    queryDownLoadImage(1).then((res) => {
      if (res.code === 200 && res.msg) {
        this.path_android = 'data:image/jpg;base64,' + res.msg
      }
    })
    queryDownLoadImage(2).then((res) => {
      // this.codeUrl = 'data:image/gif;base64,' + res.img
      if (res.code === 200 && res.msg) {
        this.path_ios = 'data:image/jpg;base64,' + res.msg
      }
      // console.log(res)
      // const blob = new Blob([res])
      // console.log(blob)
      // console.log(this.path_android)
    })
    // this.getConfigKey('app_down_load_image_path_android').then((response) => {
    //   if (response.code === 200 && response.msg) {
    //     this.path_android = response.msg
    //   }
    // })
    // this.getConfigKey('app_down_load_image_path_ios').then((response) => {
    //   if (response.code === 200 && response.msg) {
    //     this.path_ios = response.msg
    //   }
    // })
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.qr-warp {
  // width: 600px;
  display: flex;
  .qr-item {
    text-align: center;
  }
}
</style>
