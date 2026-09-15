<template>
  <div ref="editorBox" class="img-logicis-editor">
    <div v-if="cupIsShowToolBar" ref="toolbar" class="img-logics-toolbar">
      <template v-for="(item, index) in cupButtonsOption">
        <template v-if="item.componentName === 'BtnServTpl'">
          <component
            :is="item.componentName"
            v-if="item.isShow"
            :key="index"
            :title="item.title"
            :template-for="templateFor"
            @click="btnClick(item, $event)"
          ></component>
        </template>
        <template v-else>
          <component
            :is="item.componentName"
            v-if="item.isShow"
            :key="index"
            :title="item.title"
            @click="btnClick(item, $event)"
          ></component>
        </template>
      </template>
    </div>
    <div class="img-logics-main">
      <div
        ref="editorContent"
        class="img-logics-contents"
        contenteditable
        @paste="handlePaste"
        @input="editorInput"
        @keyup.delete="keypressBackspace"
      >
        <!-- <template v-html="contents"></template> -->
      </div>
      <div class="img-logics-txt">
        <textarea v-model="contents"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import locale from './locale'
import emitter from 'element-ui/src/mixins/emitter'

const path = require('path')
const files = require.context('@/views/system/emailManagement/editor/btns', false, /\.vue$/)

const modules = {}

files.keys().forEach((key) => {
  const name = path.basename(key, '.vue')
  modules[name] = files(key).default || files(key)
})

export default {
  name: 'ImglogicsEditor',
  components: {
    ...modules
  },
  mixins: [emitter],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    initContent: {
      type: [String],
      default: ''
    },
    value: {
      type: [String],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    templateFor: {
      type: [String],
      default: ''
    },
    config: {
      type: [Object],
      default: function () {
        return {
          width: 800, // px
          height: 230, // px
          buttonsOption: [], // config for buttons
          isShowToolBar: true, // is show toolbar
          contentReadOnly: false // doc is readonly or not.
        }
      }
    }
  },
  data() {
    const vm = this

    return {
      contents: vm.value || '',
      isTruncating: false,
      maxLength: 40000,
      buttonsOption: [
        {
          componentName: 'BtnHeader',
          title: vm.$t('imglogicsEditor.titleHeader'),
          cmd: {
            aCommandName: 'heading',
            aShowDefaultUI: false,
            aValueArgument: 'H1'
          },
          isShow: true
        },
        {
          componentName: 'BtnFontNameList',
          title: vm.$t('imglogicsEditor.titleFontName'),
          cmd: {
            aCommandName: 'fontName',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnFontSize',
          title: vm.$t('imglogicsEditor.titleFontSize'),
          cmd: {
            aCommandName: 'fontSize',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnBlod',
          title: vm.$t('imglogicsEditor.titleBold'),
          cmd: {
            aCommandName: 'bold',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnRemoveFormat',
          title: vm.$t('imglogicsEditor.titleRemoveFormat'),
          cmd: {
            aCommandName: 'removeFormat',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnItalic',
          title: vm.$t('imglogicsEditor.titleItalic'),
          cmd: {
            aCommandName: 'italic',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnUnderLine',
          title: vm.$t('imglogicsEditor.titleUnderline'),
          cmd: {
            aCommandName: 'underline',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnBackColor',
          title: vm.$t('imglogicsEditor.titleBackColor'),
          cmd: {
            aCommandName: 'backColor',
            aShowDefaultUI: false,
            aValueArgument: '#ff0000'
          },
          isShow: true
        },
        {
          componentName: 'BtnForeColor',
          title: vm.$t('imglogicsEditor.titleForeColor'),
          cmd: {
            aCommandName: 'foreColor',
            aShowDefaultUI: false,
            aValueArgument: '#ff0000'
          },
          isShow: true
        },
        {
          componentName: 'BtnUnorderList',
          title: vm.$t('imglogicsEditor.titleUnorderedList'),
          cmd: {
            aCommandName: 'insertUnorderedList',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnOrderList',
          title: vm.$t('imglogicsEditor.titleOrderedList'),
          cmd: {
            aCommandName: 'insertOrderedList',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnIndent',
          title: vm.$t('imglogicsEditor.titleIndent'),
          cmd: {
            aCommandName: 'indent',
            aShowDefaultUI: false,
            aValueArgument: '1'
          },
          isShow: true
        },
        {
          componentName: 'BtnOutdent',
          title: vm.$t('imglogicsEditor.titleOutdent'),
          cmd: {
            aCommandName: 'outdent',
            aShowDefaultUI: false,
            aValueArgument: '-1'
          },
          isShow: true
        },
        {
          componentName: 'BtnBlockquote',
          title: vm.$t('imglogicsEditor.titleBlockquote'),
          cmd: {
            aCommandName: 'formatBlock',
            aShowDefaultUI: false,
            aValueArgument: 'blockquote'
          },
          // 本系统可以用indent代替
          isShow: false
        },
        {
          componentName: 'BtnJustifyLeft',
          title: vm.$t('imglogicsEditor.titleJustifyLeft'),
          cmd: {
            aCommandName: 'justifyLeft',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnJustifyCenter',
          title: vm.$t('imglogicsEditor.titleJustifyCenter'),
          cmd: {
            aCommandName: 'justifyCenter',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnJustifyRight',
          title: vm.$t('imglogicsEditor.titleJustifyRight'),
          cmd: {
            aCommandName: 'justifyRight',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnCreateLink',
          title: vm.$t('imglogicsEditor.titleLink'),
          cmd: {
            aCommandName: 'createLink',
            aShowDefaultUI: false,
            aValueArgument: '#'
          },
          isShow: true
        },
        {
          componentName: 'BtnUnlink',
          title: vm.$t('imglogicsEditor.titleUnlink'),
          cmd: {
            aCommandName: 'Unlink',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnSuperscript',
          title: vm.$t('imglogicsEditor.titleSup'),
          cmd: {
            aCommandName: 'superscript',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnSubscript',
          title: vm.$t('imglogicsEditor.titleSub'),
          cmd: {
            aCommandName: 'subscript',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnStrikeThrough',
          title: vm.$t('imglogicsEditor.titleStrikeThrough'),
          cmd: {
            aCommandName: 'strikeThrough',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnDirLtr',
          title: vm.$t('imglogicsEditor.titleLTR'),
          cmd: {
            // fixme 自定义的命令
            aCommandName: 'dirLtr',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: false
        },
        {
          componentName: 'BtnDirRtl',
          title: vm.$t('imglogicsEditor.titleRTL'),
          cmd: {
            // fixme 自定义的命令
            aCommandName: 'dirRtl',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: false
        },
        {
          componentName: 'BtnServTpl',
          title: vm.$t('imglogicsEditor.titleServTpl'),
          cmd: {
            // fixme 自定义的命令
            aCommandName: 'servTpl',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
          // templateFor: vm.templateFor || ''
        },
        {
          componentName: 'BtnUndo',
          title: vm.$t('imglogicsEditor.titleUndo'),
          cmd: {
            aCommandName: 'undo',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        },
        {
          componentName: 'BtnRedo',
          title: vm.$t('imglogicsEditor.titleRedo'),
          cmd: {
            aCommandName: 'redo',
            aShowDefaultUI: false,
            aValueArgument: null
          },
          isShow: true
        }
      ]
    }
  },

  computed: {
    cupButtonsOption() {
      const vm = this

      const a1 = vm.arrayToObj(vm.config.buttonsOption)
      const a2 = vm.arrayToObj(vm.buttonsOption)
      // eslint-disable-next-line array-callback-return
      vm.buttonsOption.map((item) => {
        if (a1[item.componentName]) {
          if (typeof a1[item.componentName].title !== 'undefined') {
            a2[item.componentName].title = a1[item.componentName].title
          }

          if (typeof a1[item.componentName].isShow !== 'undefined') {
            a2[item.componentName].isShow = a1[item.componentName].isShow
          }

          if (typeof a1[item.componentName].cmd !== 'undefined') {
            if (a1[item.componentName].cmd.x !== 'undefined') {
              a2[item.componentName].cmd.undefined = a1[item.componentName].cmd.undefined
            }
          }
        }
      })

      const obj = a2
      const a = []

      for (const item in obj) {
        a.push(obj[item])
      }

      return a
    },
    cupIsShowToolBar() {
      if (!this.disabled) {
        if (this.config.isShowToolBar) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },

    cpuContentReadOnly() {
      if (this.config.contentReadOnly) {
        return true
      } else {
        return false
      }
    }
  },

  watch: {
    initContent: {
      handler: function (newVal, oldVal) {
        const vm = this
        if (newVal !== oldVal) {
          const contentRef = vm.$refs.editorContent

          const addDom = function () {
            if (contentRef) {
              vm.contents = newVal
              contentRef.innerHTML = newVal
              vm.$emit('input', newVal)
              vm.$emit('change', newVal)
              vm.dispatch('ElFormItem', 'el.form.input', newVal)
              vm.dispatch('ElFormItem', 'el.form.change', newVal)
            }
          }

          const fn = function () {
            if (contentRef) {
              addDom()
            } else {
              setTimeout(() => {
                fn()
              }, 20)
            }
          }
          fn()
        }
      },
      immediate: true,
      deep: true
    }
  },

  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },

  mounted() {
    const vm = this
    vm.$nextTick(() => {
      vm.initEditor()
      vm.setEditorWH()
    })
  },
  methods: {
    arrayToObj(arrayObj) {
      if (Array.isArray(arrayObj)) {
        const len = arrayObj.length
        if (len <= 0) {
          return {}
        }

        const obj = {}
        // eslint-disable-next-line array-callback-return
        arrayObj.map((item) => {
          const key = item.componentName
          obj[key] = item
        })

        return obj
      } else {
        return {}
      }
    },

    setEditorWH() {
      const vm = this

      const editorBox = vm.$refs.editorBox
      if (editorBox) {
        const styleObj = editorBox.style
        // styleObj.width = parseFloat(vm.config.width) + 'px'
        styleObj.width = '100%'
        styleObj.height = parseFloat(vm.config.height) + 'px'

        styleObj['min-width'] = parseFloat(vm.config.width) + 2 + 'px'

        const toolBarObj = vm.$refs.toolbar
        if (toolBarObj) {
          const curTBH = parseFloat(getComputedStyle(toolBarObj, null).height)
          styleObj.height = parseFloat(vm.config.height) + curTBH + 3 + 'px'
        }
      }

      const editorContent = vm.$refs.editorContent

      if (editorContent) {
        const styleObj = editorContent.style
        // styleObj.width = parseFloat(vm.config.width) + 'px'
        styleObj.width = '100%'
        styleObj.height = parseFloat(vm.config.height) + 'px'
      }
    },

    initEditor() {
      const vm = this
      //   queryCommandSupported是否支持某个命令。isSupported = document.queryCommandSupported(command);
      if (document.queryCommandSupported('styleWithCSS')) {
        document.execCommand('styleWithCSS', false, null)
      }

      if (document.queryCommandSupported('insertBrOnReturn')) {
        // chrome 不支持
        document.execCommand('insertBrOnReturn', false, false)
      }

      if (document.queryCommandSupported('contentReadOnly')) {
        if (!vm.disabled) {
          // chrome 不支持
          document.execCommand('contentReadOnly', false, vm.config.contentReadOnly)
          vm.$refs.editorContent.setAttribute('contenteditable', !vm.config.contentReadOnly)
        } else {
          document.execCommand('contentReadOnly', false, true)
          vm.$refs.editorContent.setAttribute('contenteditable', false)
        }
      } else {
        if (!vm.disabled) {
          vm.$refs.editorContent.setAttribute('contenteditable', !vm.config.contentReadOnly)
        } else {
          vm.$refs.editorContent.setAttribute('contenteditable', false)
        }
      }

      // 不同的浏览器有差异
      document.execCommand('defaultParagraphSeparator', false, 'br')

      // let contentRef = vm.$refs['editorContent']
      // if (contentRef) {
      //   contentRef.innerHTML = vm.contents
      // }
    },

    execCmd(name = null, ui = false, arg = null) {
      document.execCommand(name, ui, arg)
    },

    keypressBackspace(e) {
      const vm = this

      const targetObj = e.target
      const innerText = targetObj.innerText
      const len = innerText.length
      let assciiCode
      if (len === 1) {
        assciiCode = innerText.charCodeAt(0)
      }

      if (assciiCode === 10) {
        // 清空
        if (vm.$refs.editorContent) {
          vm.$refs.editorContent.innerHTML = ''
        }
        vm.contents = ''
        vm.$emit('input', vm.contents)
        vm.$emit('change', vm.contents)
        vm.dispatch('ElFormItem', 'el.form.input', vm.content)
        vm.dispatch('ElFormItem', 'el.form.change', vm.content)
      }
    },
    cleanWordHtml(html) {
      const splitIndex = html.indexOf('<!--StartFragment-->')
      const splitIndexEnd = html.indexOf('<!--EndFragment-->')
      if (splitIndex > -1) {
        const beforeLatentStyles = html.substring(splitIndex + 20, splitIndexEnd)
        return beforeLatentStyles
      } else {
        return html
      }
      // 移除 Microsoft Word 生成的注释和标签
      // return html.replace(/<w:.*?>.*?<\/w:.*?>/g, '')
    },
    handlePaste(event) {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items

      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          const blob = item.getAsFile()
          const reader = new FileReader()
          reader.onload = (event) => {
            const imageUrl = event.target
            // 执行你需要的操作，比如显示图片预览等
            document.execCommand('insertImage', false, imageUrl.result)
          }
          reader.readAsDataURL(blob)
        }
      }

      // 阻止默认粘贴行为，以便手动处理
      event.preventDefault()
      // 获取粘贴的文本
      let pastedHtml = (event.clipboardData || window.clipboardData).getData('text/html')
      if (!pastedHtml) {
        pastedHtml = (event.clipboardData || window.clipboardData).getData('text/plain')
      }
      // 过滤掉不需要的内容
      pastedHtml = this.cleanWordHtml(pastedHtml)

      // 将粘贴的 HTML 转换为 DOM 对象
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = pastedHtml

      // 去除所有 style 中的 font-family 和 class 类名
      this.removeFontFamilyAndClass(tempDiv)

      // pastedText = pastedText.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>')
      // 将粘贴的内容插入到光标位置
      document.execCommand('insertHtml', false, tempDiv.innerHTML)
    },
    removeFontFamilyAndClass(element) {
      // 移除所有 style 中的 font-family
      const elementsWithStyle = element.querySelectorAll('[style]')
      elementsWithStyle.forEach((el) => {
        const style = el.getAttribute('style')
        const cleanedStyle = style.replace(/font-family[^;]+;?/g, '')
        el.setAttribute('style', cleanedStyle)
      })

      // 移除所有 class 类名
      const elementsWithClass = element.querySelectorAll('[class]')
      elementsWithClass.forEach((el) => {
        el.removeAttribute('class')
      })
    },
    editorInput(event) {
      if (this.isTruncating) return // 防止递归触发
      const vm = this
      const text = event.target.innerText
      if (text.length > vm.maxLength) {
        // 记录光标位置（避免截断后光标跳到末尾）
        // 截断文本（只保留前maxLength个字符）
        vm.isTruncating = true
        event.target.innerText = text.substring(0, vm.maxLength)
        vm.isTruncating = false
      }
      vm.contents = event.target.innerHTML || ''
      vm.$emit('input', vm.contents)
      vm.$emit('change', vm.contents)
      vm.dispatch('ElFormItem', 'el.form.input', vm.content)
      vm.dispatch('ElFormItem', 'el.form.change', vm.content)
    },

    editorBlur() {
      this.$emit('blur')
      this.dispatch('ElFormItem', 'el.form.blur', this.content)
    },

    editorFocus() {
      this.$emit('focus')
      this.dispatch('ElFormItem', 'el.form.focus', this.content)
    },

    btnClick(item, e) {
      const vm = this

      const cmdObj = item.cmd
      const cmdName = cmdObj.aCommandName

      if (
        cmdName !== 'createLink' &&
        cmdName !== 'servTpl' &&
        cmdName !== 'backColor' &&
        cmdName !== 'foreColor'
      ) {
        e.preventDefault()
      } else {
        const { event } = e
        event.preventDefault()
      }

      // let blcokquoteFn = function() {
      //   if (item.componentName === 'BtnBlockquote') {
      //     if (vm.$refs['editorContent']) {
      //       [].slice.apply(vm.$refs['editorContent'].querySelectorAll('blockquote'), [0]).map(item => {
      //         console.log(item)

      //         item.style.borderLeft = '3px solid rgb(200, 200, 200)'
      //         item.style.borderTopColor = 'rgb(200, 200, 200)'
      //         item.style.borderRightColor = 'rgb(200, 200, 200)'
      //         item.style.borderBottomColor = 'rgb(200, 200, 200)'
      //         item.style.paddingLeft = '1ex'
      //         item.style.marginLeft = '0.8ex'
      //         item.style.color = 'rgb(102, 102, 102)'
      //       })
      //     }
      //   }
      // }

      switch (cmdName) {
        case 'heading':
          {
            const hName = e.target.innerHTML || ''
            const isSupported = document.queryCommandSupported(cmdObj.aCommandName)

            if (isSupported) {
              vm.execCmd(cmdObj.aCommandName, cmdObj.aShowDefaultUI, hName)
            } else {
              vm.execCmd('formatBlock', cmdObj.aShowDefaultUI, hName)
            }
          }
          break
        case 'backColor':
          {
            const { rgb } = e
            vm.execCmd(cmdObj.aCommandName, cmdObj.aShowDefaultUI, rgb)
          }
          break
        case 'foreColor':
          {
            const { rgb } = e
            vm.execCmd(cmdObj.aCommandName, cmdObj.aShowDefaultUI, rgb)
          }
          break
        case 'fontName':
          {
            const fontName = e.target.innerHTML || ''
            vm.execCmd(cmdObj.aCommandName, cmdObj.aShowDefaultUI, fontName)
          }
          break
        case 'fontSize':
          {
            const fontSize = e.target.innerHTML || ''
            vm.execCmd(cmdObj.aCommandName, cmdObj.aShowDefaultUI, fontSize)
          }
          break
        case 'createLink':
          {
            const { urlTxt } = e
            vm.execCmd(cmdObj.aCommandName, cmdObj.aShowDefaultUI, urlTxt)
          }
          break
        case 'servTpl':
          {
            const { templateFor } = e
            vm.execCmd('insertText', cmdObj.aShowDefaultUI, templateFor)
          }
          break
        default: {
          vm.execCmd(cmdObj.aCommandName, cmdObj.aShowDefaultUI, cmdObj.aValueArgument)
          // blcokquoteFn()
        }
      }

      return false
    }
  }
}
</script>

<style lang="scss">
/* 还原默认样式 */
.img-logicis-editor {
  position: relative;
  line-height: normal;

  ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }

  ol {
    display: block;
    list-style-type: decimal;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }

  blockquote {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 40px;
    margin-inline-end: 40px;
  }

  a {
    color: #1890ff;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>

<style lang="scss" scoped>
.is-error .img-logicis-editor {
  border: 1px solid #f56c6c;
  box-sizing: border-box;
}

.is-success .img-logicis-editor {
  // border: 1px solid #0acf97;
  box-sizing: border-box;
}

.img-logicis-editor {
  // font-family: DengXian;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  // min-width: 200px;
  width: 100%;
  margin: 0;
  padding: 0 0 2px 0;
  border: 1px solid #cccccc;
  border-radius: 5px;
  text-align: left;
  outline: none;

  .img-logics-toolbar {
    box-sizing: border-box;
    margin: 0;
    padding: 8px;
    width: 100%;
    line-height: 24px;
    border: 1px solid transparent;
    border-bottom: 1px solid #cccccc;
    outline: none;
    background-color: #f8f8f8;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    z-index: 300;

    .editor-btn {
      margin: 0 5px;
      padding: 3px;
      cursor: pointer;
      box-sizing: border-box;
      width: 24px;
      height: 24px;
      font-size: 14px;
      border: transparent;
      border-radius: 4px;
      background-color: transparent;
      line-height: 24px;
      vertical-align: middle;
      text-align: center;
      outline: none;

      .btn-svg-box {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        vertical-align: -0.15em;
        text-align: center;
        fill: '#000000';
        overflow: hidden;
        stroke-width: 1px;
      }

      &:hover {
        fill: #0066cc;
        background-color: #ffffff;
      }
    }
  }

  .img-logics-main {
    margin: 0;
    padding: 0;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    box-sizing: border-box;
    overflow: hidden;

    .img-logics-contents {
      box-sizing: border-box;
      margin: 0;
      padding: 12px 15px;
      width: 100%;
      outline: none;
      overflow: scroll;
      overflow-x: hidden;
    }

    .img-logics-txt {
      display: none;
    }
  }
}
</style>
