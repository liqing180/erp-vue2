<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="open"
    append-to-body
    @closed="closed"
    :fullscreen="true"
    class="diy-dialog"
    :show-close="false"
  >
    <div slot="title"></div>
    <div v-if="publicUrl" class="iframe-warp">
      <iframe
        :src="publicUrl"
        frameborder="0"
        width="100%"
        height="100%"
        allowtransparency
        id="printContent"
        ref="printContent"
      ></iframe>
      <div class="dialog-btn-diy">
        <el-button type="primary" @click="handlePrint" :loading="btnLoading" v-if="publicUrl">{{
          $t('uiBtn.print')
        }}</el-button>
        <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import printJS from 'print-js'

export default {
  props: {
    editAuth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btnLoading: false,
      open: false,
      title: '',
      row: {},
      publicUrl: ''
    }
  },
  computed: {
    comDisFrom() {
      return !this.editAuth
    }
  },
  created() {},

  mounted() {},
  methods: {
    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.reset()
    },
    // 表单重置
    reset() {
      this.row = {}
    },
    /** 修改按钮操作 */
    handleOpen(row) {
      this.open = true
      this.row = { ...row }
      this.publicUrl = row.publicUrl

      this.title = this.$t('uiBtn.edit')
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 2000)
      this.reset()
    },
    handlePrint() {
      if (this.btnLoading) {
        return
      }
      this.btnLoading = true
      const iframe = window.frames.printContent
      const Do = iframe.contentWindow || iframe.contentDocument
      const dom = Do.document.getElementById('root').getElementsByClassName('EmbedFrame')[0]
      console.log('Do', Do, dom)

      printJS({
        printable: dom,
        type: 'html',
        documentTitle: ' ',
        repeatTableHeader: false,
        maxWidth: 'auto',
        targetStyle: ['*'],
        targetStyles: ['*'],
        style: '@media print{@page {size:landscape}};@page{size:auto;margin: 0cm 1cm 0cm 1cm;}',
        onLoadingStart: this.onLoadingStart,
        onLoadingEnd: this.onLoadingEnd,
        honorMarginPadding: false
      })
    },
    onLoadingStart() {
      this.btnLoading = true
      console.log('开始加载1')
    },
    onLoadingEnd() {
      this.btnLoading = false
      console.log('加载完成1')
    }
  }
}
</script>

<style lang="scss" scoped>
.iframe-warp {
  position: relative;
  height: calc(100vh - 20px);
  min-height: 600px;
  .dialog-btn-diy {
    width: 400px;
    text-align: right;
    position: absolute;
    top: 10px;
    right: 30px;
  }
}
.diy-dialog {
  /deep/ .el-dialog__header {
    display: none;
  }
  /deep/ .el-dialog__body {
    padding: 10px 20px 10px 20px;
  }
}
</style>
