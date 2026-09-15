<template>
  <el-popover
    ref="popover"
    placement="bottom"
    width="200"
    trigger="click"
    popper-class="createlink-box"
    @show="popShow"
  >
    <el-scrollbar class="scroll-bar-box" style="height: 70px">
      <div class="el-input el-input--mini" style="height: 30px">
        <input v-model="urlTxt" type="text" class="el-input__inner" />
      </div>
      <div style="margin-top: 3px; height: 30px; line-height: 30px">
        <button
          class="el-button el-button--default el-button--mini is-round"
          @click="btnSave($event)"
        >
          Save
        </button>
        <button class="el-button el-button--default el-button--mini is-round" @click="btnClear">
          Clear
        </button>
      </div>
    </el-scrollbar>

    <button slot="reference" :title="title" class="editor-btn" @click="btnClick($event)">
      <svg viewBox="0 0 1025 1024" class="btn-svg-box">
        <path
          d="M618.24 439.381333a152.746667 152.746667 0 0 1 0 216l-135.893333 135.893334a163.370667 163.370667 0 1 1-231.04-231.04l66.922666-66.944 45.269334 45.269333-66.944 66.944a99.370667 99.370667 0 1 0 140.522666 140.522667l135.893334-135.893334a88.746667 88.746667 0 0 0 0-125.482666z m182.528-197.589333a163.370667 163.370667 0 0 1 0 231.04L733.866667 539.776l-45.269334-45.248 66.944-66.944a99.370667 99.370667 0 1 0-140.522666-140.522667l-135.893334 135.893334a88.746667 88.746667 0 0 0 0 125.482666l-45.269333 45.269334a152.746667 152.746667 0 0 1 0-216l135.893333-135.893334a163.370667 163.370667 0 0 1 231.04 0z"
        />
      </svg>
    </button>
  </el-popover>
</template>

<script>
export default {
  name: 'BtnCreateLink',
  props: {
    title: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      urlTxt: '',
      rang: null
    }
  },
  methods: {
    btnClick(e) {
      e.stopPropagation()
      e.preventDefault()
      return false
    },

    fontItemClick(e) {
      this.$emit('click', e)
      this.$refs.popover.showPopper = false
    },

    popShow() {
      const vm = this

      try {
        const selectionObj = window.getSelection()
        const selRang = selectionObj.getRangeAt(0)
        vm.rang = selRang
        vm.urlTxt = 'http://'
      } catch (error) {
        vm.rang = null
      }
    },

    btnSave(e) {
      const vm = this
      if (vm.rang) {
        const selectionObj = window.getSelection()
        selectionObj.removeAllRanges()
        selectionObj.addRange(this.rang)
      }

      vm.$emit('click', { event: e, urlTxt: vm.urlTxt || '' })
      vm.$refs.popover.showPopper = false
    },

    btnClear() {
      const vm = this
      vm.urlTxt = ''
    }
  }
}
</script>
<style>
.createlink-box .scroll-bar-box .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.createlink-box .scroll-bar-box ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.createlink-box .scroll-bar-box ul li {
  box-sizing: border-box;
  padding: 0 5px;
  line-height: 1.5em;
  cursor: pointer;
  -moz-user-select: none;
  user-select: none;
}
.createlink-box .scroll-bar-box ul li:hover {
  background-color: #0066cc;
  color: #ffffff;
}
</style>
<style scoped lang="scss">
.createLink-input .scroll-bar-box .el-scrollbar__wrap input.link-input {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6 !important;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}

.editor-btn {
  margin: 0 1px;
  padding: 0;
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
