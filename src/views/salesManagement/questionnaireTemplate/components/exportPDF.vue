<template>
  <div class="dialog" v-if="open">
    <div class="pdf" id="pdfExpoer">
      <div class="header">
        <img :src="require('@/assets/logo/logo_01.png')" class="logo" alt="" />
        <div style="margin: 0 300px">
          <div class="title">
            {{ previewForm.questionnaireTemplateName }}
          </div>
        </div>
      </div>
      <div class="desc mt10" v-if="previewForm.description">
        {{ previewForm.description }}
      </div>
      <paper ref="paper" class="mt20" :isDisabled="true" path="export" />
    </div>
  </div>
</template>

<script>
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import paper from '@/views/salesManagement/questionnaireTemplate/components/paper.vue'
export default {
  components: { paper },
  props: {
    isCancel: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: false,
      previewForm: {}
    }
  },

  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    showCancel() {
      if (this.isCancel) {
        const { buttonAuthMsg } = this.previewForm
        if (buttonAuthMsg && buttonAuthMsg.isCanCancelled === '1') {
          return true
        }
      }
      return false
    }
  },
  methods: {
    getPdf() {
      // 获取页面标题，作为文件名称，也可以使用时间戳生成不重复的文件名使用
      const title = this.previewForm.questionnaireTemplateName
      html2Canvas(document.querySelector('#pdfExpoer'), {
        allowTaint: true,
        // 防止页面过宽导致右侧出现黑灰色背景区域
        scale: window.devicePixelRatio * 8
      })
        .then(function (canvas) {
          const contentWidth = canvas.width
          const contentHeight = canvas.height
          // A4纸张标准宽高进行转换
          const pageHeight = (contentWidth / 592.28) * 841.89
          let leftHeight = contentHeight
          let position = 0
          const imgWidth = 595.28
          const imgHeight = (592.28 / contentWidth) * contentHeight
          const pageData = canvas.toDataURL('image/jpeg', 1.0)
          const PDF = new JsPDF('', 'pt', 'a4')
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= 841.89
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }
          // 文件导出生成
          PDF.save(title + '.pdf')
          this.open = false
          setTimeout(() => {
            this.$emit('exportSuccess')
          }, 200)
        })
        .catch(() => {
          this.open = false
          this.$emit('exportSuccess')
        })
    },
    outPutPdfFn() {
      const A4_WIDTH = 592.28
      const A4_HEIGHT = 841.89
      // $myLoading 自定义等待动画组件，实现导出事件的异步等待交互
      // this.$myLoading('正在导出pdf，请稍候。。。', true)
      // dom的id。
      const target = document.getElementById('pdfExpoer')
      const pageHeight = (target.scrollWidth / A4_WIDTH) * A4_HEIGHT
      // 获取分割dom，此处为class类名为item的dom
      const lableListID = document.getElementsByClassName('custom-item')
      // 进行分割操作，当dom内容已超出a4的高度，则将该dom前插入一个空dom，把他挤下去，分割
      for (let i = 0; i < lableListID.length; i++) {
        const multiple = Math.ceil(
          (lableListID[i].offsetTop + lableListID[i].offsetHeight) / pageHeight
        )
        if (this.isSplit(lableListID, i, multiple * pageHeight)) {
          const divParent = lableListID[i].parentNode // 获取该div的父节点
          const newNode = document.createElement('div')
          newNode.className = 'emptyDiv'
          newNode.style.background = '#ffffff'
          const _H =
            multiple * pageHeight - (lableListID[i].offsetTop + lableListID[i].offsetHeight)
          newNode.style.height = _H + 30 + 'px'
          newNode.style.width = '100%'
          const next = lableListID[i].nextSibling // 获取div的下一个兄弟节点
          // 判断兄弟节点是否存在
          if (next) {
            // 存在则将新节点插入到div的下一个兄弟节点之前，即div之后
            divParent.insertBefore(newNode, next)
          } else {
            // 不存在则直接添加到最后,appendChild默认添加到divParent的最后
            divParent.appendChild(newNode)
          }
        }
      }
      // 传入title和dom标签，此处是 #content
      this.getPdf()
    },
    isSplit(nodes, index, pageHeight) {
      // 计算当前这块dom是否跨越了a4大小，以此分割
      if (
        nodes[index].offsetTop + nodes[index].offsetHeight < pageHeight &&
        nodes[index + 1] &&
        nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight
      ) {
        return true
      }
      return false
    },
    handleOpen(form = {}) {
      this.open = true
      this.previewForm = JSON.parse(JSON.stringify(form))
      const { categoryList } = form
      categoryList.forEach((x) => {
        x.questionsList &&
          x.questionsList.forEach((k) => {
            this.$set(k, 'customResult', k.explanationAnswer || undefined)
            // this.$set(k, 'explanationAnswer', undefined)
            if (k.answersCategory === '1') {
              this.$set(k, 'customResult', k.explanationAnswer || undefined)
            } else if (k.answersCategory === '2') {
              const arr = k.optionList.filter((x) => x.isSelect === '1')
              if (arr && arr.length > 0) {
                this.$set(k, 'customResult', arr[0].optionName)
              } else {
                this.$set(k, 'customResult', undefined)
              }
            } else if (k.answersCategory === '3') {
              const arr = k.optionList.filter((x) => x.isSelect === '1')
              if (arr && arr.length > 0) {
                this.$set(
                  k,
                  'customResult',
                  arr.map((k) => k.optionName)
                )
              } else {
                this.$set(k, 'customResult', [])
              }
            } else if (k.answersCategory === '4') {
              this.$set(k, 'customResult', k.fixedTime || undefined)
            } else if (k.answersCategory === '5') {
              if (k.startTime && k.endTime) {
                this.$set(k, 'customResult', [k.startTime, k.endTime - 86399000] || undefined)
              } else {
                this.$set(k, 'customResult', undefined)
              }
            }
          })
      })
      this.$nextTick(() => {
        this.$refs.paper.init(categoryList)
      })
      setTimeout(() => {
        // this.getPdf()
        this.outPutPdfFn()
      }, 200)
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog {
  position: absolute;
  top: -9999px;
  right: -9999px;
  background-color: #fff;
  .pdf {
    width: 900px;
    padding: 20px 30px;
    background-color: #fff;
    box-sizing: border-box;
  }
}
.header {
  position: relative;
  text-align: center;
  word-break: break-word;
  min-height: 60px;
  .logo {
    position: absolute;
    top: -10px;
    left: -20px;
    width: 300px;
    height: 75px;
  }
  .title {
    font-size: 15px;
    font-weight: 700;
  }
}
</style>
