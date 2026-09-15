<template>
  <el-popover
    ref="popover"
    placement="bottom"
    width="270"
    trigger="click"
    popper-class="backcolor-pan-box"
    @show="popShow"
  >
    <div>
      <ColorPan @colorChange="colorChange" @cancel="colorCancel"></ColorPan>
    </div>
    <!-- <button slot="reference" :title="title" class="editor-btn" @click="btnClick($event)"> -->
    <button slot="reference" :title="title" class="editor-btn" @click="btnClick($event)">
      <svg viewBox="0 0 1024 1024" class="btn-svg-box">
        <path
          d="M510.030769 315.076923l84.676923 196.923077h-177.230769l76.8-196.923077h15.753846zM945.230769 157.538462v708.923076c0 43.323077-35.446154 78.769231-78.769231 78.769231H157.538462c-43.323077 0-78.769231-35.446154-78.769231-78.769231V157.538462c0-43.323077 35.446154-78.769231 78.769231-78.769231h708.923076c43.323077 0 78.769231 35.446154 78.769231 78.769231z m-108.307692 643.938461L600.615385 216.615385c-5.907692-11.815385-15.753846-19.692308-29.538462-19.692308h-139.815385c-11.815385 0-23.630769 7.876923-27.56923 19.692308l-216.615385 584.861538c-3.938462 11.815385 3.938462 25.6 17.723077 25.6h80.738462c11.815385 0 23.630769-9.846154 27.56923-21.661538l63.015385-175.261539h263.876923l68.923077 175.261539c3.938462 11.815385 15.753846 21.661538 27.569231 21.661538h80.738461c13.784615 0 23.630769-13.784615 19.692308-25.6z"
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
.backcolor-pan-box ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.backcolor-pan-box ul li {
  box-sizing: border-box;
  padding: 0 5px;
  line-height: 1.5em;
  cursor: pointer;
  -moz-user-select: none;
  user-select: none;
}
.backcolor-pan-box ul li:hover {
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
