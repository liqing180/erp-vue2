<template>
  <el-popover ref="popover" placement="bottom" width="50" trigger="click" popper-class="font-size-box">
    <el-scrollbar class="scroll-bar-box" style="height:150px;">
      <ul>
        <li @click="fontItemClick($event)">1</li>
        <li @click="fontItemClick($event)">2</li>
        <li @click="fontItemClick($event)">3</li>
        <li @click="fontItemClick($event)">4</li>
        <li @click="fontItemClick($event)">5</li>
        <li @click="fontItemClick($event)">6</li>
        <li @click="fontItemClick($event)">7</li>
        <!-- <li @click="fontItemClick($event)">8px</li>
        <li @click="fontItemClick($event)">9px</li>
        <li @click="fontItemClick($event)">10px</li>
        <li @click="fontItemClick($event)">11px</li>
        <li @click="fontItemClick($event)">12px</li>
        <li @click="fontItemClick($event)">14px</li>
        <li @click="fontItemClick($event)">16px</li>
        <li @click="fontItemClick($event)">18px</li>
        <li @click="fontItemClick($event)">20px</li>
        <li @click="fontItemClick($event)">22px</li>
        <li @click="fontItemClick($event)">24px</li>
        <li @click="fontItemClick($event)">26px</li>
        <li @click="fontItemClick($event)">28px</li>
        <li @click="fontItemClick($event)">36px</li>
        <li @click="fontItemClick($event)">48px</li>
        <li @click="fontItemClick($event)">72px</li>-->
      </ul>
    </el-scrollbar>
    <!-- <button slot="reference" @click="btnClick($event)" :title="title" class="editor-btn"> -->
    <button slot="reference" :title="title" class="editor-btn" @click="btnClick($event)">
      <svg viewBox="0 0 1024 1024" class="btn-svg-box">
        <path
          d="M938.666667 256l-128-170.666667-128 170.666667h85.333333v170.666667h-85.333333l128 170.666666 128-170.666666h-85.333334V256zM397.098667 170.666667l-256 682.666666h91.178666l80-213.333333h271.488l80 213.333333h91.178667l-256-682.666666H397.098667z m-52.864 384L448 277.973333 551.765333 554.666667H344.234667z"
        />
      </svg>
    </button>
  </el-popover>
</template>

<script>
export default {
  name: 'BtnFontSize',
  props: {
    title: {
      type: [String, Number],
      default: ''
    }
  },
  methods: {
    // btnClick(e) {
    // this.$emit("click", e);
    // },
    btnClick(e) {
      e.stopPropagation()
      e.preventDefault()
      return false
    },

    fontItemClick(e) {
      this.$emit('click', e)
      this.$refs.popover.showPopper = false
    }
  }
}
</script>
<style>
.font-size-box {
  min-width: 50px !important;
}
.font-size-box .scroll-bar-box .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.font-size-box .scroll-bar-box ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.font-size-box .scroll-bar-box ul li {
  box-sizing: border-box;
  padding: 0 5px;
  line-height: 1.5em;
  cursor: pointer;
  -moz-user-select: none;
  user-select: none;
}
.font-size-box .scroll-bar-box ul li:hover {
  background-color: #0066cc;
  color: #ffffff;
}
</style>
<style scoped lang='scss'>
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
    fill: "#000000";
    overflow: hidden;
    stroke-width: 1px;
    zoom:0.5;
  }

  &:hover {
    fill: #0066cc;
    background-color: #ffffff;
  }
}
</style>
