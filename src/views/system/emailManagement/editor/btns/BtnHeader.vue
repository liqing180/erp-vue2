<template>
  <el-popover
    ref="popover"
    placement="bottom"
    width="50"
    trigger="click"
    popper-class="headers-box"
    @show="popShow"
  >
    <el-scrollbar class="scroll-bar-box" style="height: 130px">
      <ul>
        <li @click="itemClick($event)">H1</li>
        <li @click="itemClick($event)">H2</li>
        <li @click="itemClick($event)">H3</li>
        <li @click="itemClick($event)">H4</li>
        <li @click="itemClick($event)">H5</li>
        <li @click="itemClick($event)">H6</li>
      </ul>
    </el-scrollbar>
    <button slot="reference" :title="title" class="editor-btn" @click="btnClick($event)">
      <svg viewBox="0 0 1024 1024" class="btn-svg-box">
        <path
          d="M758.857143 249.142857v32q-2.285714 0-6.285714 0.285714t-13.714286 1.714286-17.142857 4.285714-13.714286 8.571429-6.285714 13.714286v507.428571q0 12.571429 14.285714 19.714286t28.571429 7.714286l14.285714 1.142857v32H530.285714v-32q42.857143 0 50-3.714286t7.142857-24.857143v-225.142857H301.714286v225.142857q0 21.142857 7.142857 24.857143t50 3.714286v32H130.285714v-32q2.285714 0 6.285715-0.285715t13.714285-1.714285 17.142857-4.285715 13.714286-8.571428 6.285714-13.714286V309.714286q0-12.571429-14.285714-19.714286T144.571429 282.285714l-14.285715-1.142857v-32h228.571429v32q-42.857143 0-50 3.714286T301.714286 309.714286v225.142857h285.714285V309.714286q0-21.142857-7.142857-24.857143T530.285714 281.142857v-32h228.571429z"
        />
      </svg>
    </button>
  </el-popover>
</template>

<script>
export default {
  name: 'BtnFontNameList',
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
    popShow() {
      try {
        const selectionObj = window.getSelection()
        const selRang = selectionObj.getRangeAt(0)
        this.rang = selRang
      } catch (e) {
        console.warn(e)
        this.rang = null
      }
    },

    btnClick(e) {
      e.stopPropagation()
      e.preventDefault()
      return false
    },

    itemClick(e) {
      if (this.rang) {
        const selectionObj = window.getSelection()
        selectionObj.removeAllRanges()
        selectionObj.addRange(this.rang)
      }

      this.$emit('click', e)
      this.$refs.popover.showPopper = false

      return false
    }
  }
}
</script>
<style>
.headers-box {
  min-width: 50px !important;
}
.headers-box .scroll-bar-box .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.headers-box .scroll-bar-box ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.headers-box .scroll-bar-box ul li {
  box-sizing: border-box;
  padding: 0 5px;
  line-height: 1.5em;
  cursor: pointer;
  -moz-user-select: none;
  user-select: none;
}
.headers-box .scroll-bar-box ul li:hover {
  background-color: #0066cc;
  color: #ffffff;
}
</style>
<style scoped lang="scss">
.btn-h-box {
  display: inline-block;
  position: relative;
  left: 0;
  top: 0;
  right: 0;
}

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
</style>
