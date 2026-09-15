<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss">
$form-page-btn-height: 40px;
$form-page-content-margin: 20px;
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);

  width: 100%;
  position: relative;
  overflow: hidden;
}
.history-content {
  .formPage .form-page-content {
    margin-left: 10px;
  }
}
.formPage {
  height: calc(100vh - 50px);
  position: relative;
  display: flex;
  flex-direction: column;
  .form-page-btn {
    height: $form-page-btn-height;
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  .form-page-content {
    flex: 1;
    margin: $form-page-content-margin;
    margin-top: 10px;
    overflow: auto;
    padding-right: 4px;
    padding-top: 0;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 8px;
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #8f8f8f;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #ededed;
    }
  }
  &.form-page-btn--hide .form-page-btn {
    display: none;
  }
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }
  .fixed-header + .app-main {
    padding-top: 84px;
  }
  .formPage {
    /* 84 = navbar + tags-view = 50 + 34 */
    height: calc(100vh - 84px);
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
.app-body > .el-tooltip__popper {
  max-width: calc(100% - 60px);
}
</style>
