<template>
  <div>
    <el-popover
      ref="popoverCPN"
      placement="bottom"
      trigger="hover"
      :open-delay="300"
      :disabled="popoverDisabled"
    >
      <el-scrollbar v-emailCmdPoper:5="`${emailStrToArr.length}`" class="scroll-bar-box">
        <div v-for="item in emailStrToArr" :key="item" class="pp-item">
          <span class="pp-item-label">{{ item.split(':')[0] }}</span>
          <span>&nbsp;:&nbsp;&nbsp;</span>
          <span>{{ item.split(':')[1] }}</span>
        </div>
      </el-scrollbar>
    </el-popover>
    <div v-popover:popoverCPN>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import emailCmdPoper from '@/directive/emailCmdPoper'
export default {
  directives: { emailCmdPoper },
  props: {
    emailStr: {
      type: String,
      default: ''
    }
  },
  computed: {
    emailStrToArr() {
      const vm = this
      const emailStr = vm.emailStr
      if (!emailStr) {
        return []
      }
      return emailStr.split(',')
    },
    popoverDisabled() {
      if (Array.isArray(this.emailStrToArr)) {
        const len = this.emailStrToArr.length
        if (len <= 0) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.pp-item {
  padding: 1px 5px;
  line-height: 28px;
  vertical-align: middle;
  color: #000000;
  text-align: left;
  border-left: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  border-right: 1px solid #efefef;
}
.pp-item:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.pp-item:first-child {
  border-top: 1px solid #efefef;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
</style>
