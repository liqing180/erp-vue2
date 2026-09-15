<template>
  <addFromPage ref="addFromPage" :propTimeId="timeId" />
</template>

<script>
import addFromPage from './addFromPage'

export default {
  name: 'AddPurchaseRequisition',
  components: {
    addFromPage
  },
  data() {
    return {
      timeId: undefined
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
  },
  activated() {
    this.timeId = this.$route.query.timeId
  },
  // 路由跳转拦截（菜单切换、Tab切换路由）
  // beforeRouteLeave(to, from, next) {
  //   console.log(to, from, '===========1122')
  //   // if (!this.isFormModified) {
  //   //   next();
  //   //   return;
  //   // }
  //   // Element弹窗确认
  //   this.$confirm('表单已修改，是否保存当前修改？', '提示', {
  //     confirmButtonText: '保存',
  //     cancelButtonText: '不保存',
  //     type: 'warning'
  //   })
  //     .then(() => {
  //       // 用户选择保存，执行保存后再跳转
  //       // this.handleSave();
  //       // 延迟等待保存完成再放行（真实项目可await接口）
  //       setTimeout(() => next(), 1000)
  //     })
  //     .catch(() => {
  //       // 不保存，直接放行跳转
  //       next()
  //     })
  // },
  mounted() {
    // 监听bus事件，接收传入的路由path
    if (this.$bus) {
      this.$bus.$on('saveForm', (targetPath) => {
        console.log(targetPath, '=====================targetPath')
        console.log(this.$route.fullPath, '=====================this.$route.fullPath')
        // 只有当前页面路由和关闭标签路由一致，才执行保存
        if (targetPath === this.$route.fullPath) {
          this.handleSave()
        }
      })
    }
  },
  methods: {
    handleSave() {
      console.log('handleSave==========================触发了')
      this.$refs.addFromPage && this.$refs.addFromPage.handleSaveDraft()
    }
  }
}
</script>
<style lang="scss"></style>
