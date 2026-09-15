<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item of sizeOptions"
        :key="item.value"
        :disabled="size === item.value"
        :command="item.value"
      >
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { addClass, removeClass } from '@/utils'
export default {
  data() {
    return {
      sizeOptions: [
        { label: this.$t('ui.small'), value: 'mini' },
        { label: this.$t('ui.medium'), value: 'small' },
        { label: this.$t('ui.large'), value: 'medium' }
      ]
    }
  },
  computed: {
    size() {
      return this.$store.getters.size
    }
  },
  created() {
    addClass(document.body, `app-size--${this.size}`)
    this.$ELEMENT.size = this.size
  },
  methods: {
    handleSetSize(size) {
      removeClass(document.body, `app-size--${this.size}`)
      addClass(document.body, `app-size--${size}`)

      this.$ELEMENT.size = size
      this.$store.dispatch('app/setSize', size)
      this.refreshView()
      this.$message({
        message: this.$t('ui.layoutSizeSuccess'),
        type: 'success'
      })
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', this.$route)

      const { fullPath } = this.$route

      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }
}
</script>
