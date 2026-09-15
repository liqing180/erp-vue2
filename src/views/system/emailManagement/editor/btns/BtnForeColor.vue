<template>
  <el-popover
    ref="popover"
    placement="bottom"
    width="270"
    trigger="click"
    popper-class="forecolor-pan-box"
    @show="popShow"
  >
    <div>
      <ColorPan @cancel="colorCancel" @colorChange="colorChange"></ColorPan>
    </div>
    <!-- <button slot="reference" :title="title" class="editor-btn" @click="btnClick($event)"> -->
    <button slot="reference" :title="title" class="editor-btn" @click="btnClick($event)">
      <svg viewBox="0 0 1024 1024" class="btn-svg-box">
        <path d="M0 853.333333h1024v170.666667H0z" />
        <path
          d="M568.888889 56.888889H455.111111L199.111111 739.555556h113.777778l63.715555-170.666667h270.222223l63.715555 170.666667h113.777778L568.888889 56.888889zM419.84 455.111111L512 208.782222 604.16 455.111111H419.84z"
        />
      </svg>
    </button>
  </el-popover>
</template>

<script>
// import btnmixin from '../btnmixin'
import ColorPan from '../ColorPan'
export default {
  name: 'BtnBackColor',
  // mixins: [btnmixin]
  components: {
    ColorPan
  },
  props: {
    title: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      rang: null
    }
  },
  methods: {
    btnClick(e) {
      e.stopPropagation()
      e.preventDefault()
      return false
    },
    popShow() {
      const vm = this

      try {
        const selectionObj = window.getSelection()
        const selRang = selectionObj.getRangeAt(0)
        vm.rang = selRang
      } catch (error) {
        vm.rang = null
      }
    },
    colorChange(obj) {
      const vm = this

      if (vm.rang) {
        const selectionObj = window.getSelection()
        selectionObj.removeAllRanges()
        selectionObj.addRange(vm.rang)
      }

      vm.$emit('click', obj)
      vm.$refs.popover.showPopper = false
    },

    colorCancel() {
      const vm = this
      vm.$refs.popover.showPopper = false
    }
  }
}
</script>

<style>
.forecolor-pan-box ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.forecolor-pan-box ul li {
  box-sizing: border-box;
  padding: 0 5px;
  line-height: 1.5em;
  cursor: pointer;
  -moz-user-select: none;
  user-select: none;
}
.forecolor-pan-box ul li:hover {
  background-color: #0066cc;
  color: #ffffff;
}
</style>
<style scoped lang="scss">
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
    zoom: 0.5;
  }

  &:hover {
    fill: #0066cc;
    background-color: #ffffff;
  }
}
</style>
