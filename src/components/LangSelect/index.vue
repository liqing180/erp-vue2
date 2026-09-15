<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon :icon-class="language === 'zh' ? 'CN' : 'EN'" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language === 'zh'" command="zh"> 中文 </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'en'" command="en"> English </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import {
  changeLanguage
  // changeLoginLanguage
} from '@/api/common/common'
export default {
  name: 'changeLanguage',
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  props: {
    loginFlag: {
      type: Boolean,
      default: false
    }
  },
  inject: ['reload'],
  created() {
    const vm = this
    window.addEventListener('storage', vm.listenerStorage)
    vm.$once('hook:beforeDestroy', () => {
      window.removeEventListener('storage', vm.listenerStorage)
    })
  },
  methods: {
    listenerStorage(e) {
      if (e.key === 'language') {
        const newLanguage = e.newValue
        if (newLanguage && newLanguage !== this.language) {
          this.handleSetLanguage(newLanguage)
        }
      }
    },
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('app/setLanguage', lang)
      if (this.$store.state.settings.dynamicTitle) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'dynamicTitle',
          value: false
        })
        this.$nextTick(() => {
          this.$store.dispatch('settings/changeSetting', {
            key: 'dynamicTitle',
            value: true
          })
        })
      }
      if (this.loginFlag) {
        /* changeLoginLanguage({
          language: lang
        }).then((response) => {
          this.reload()
        }) */
        this.reload()
      } else {
        changeLanguage({
          language: lang
        })
          .then((response) => {
            this.$message({
              message: this.$t('ui.setLanguageSuccess'),
              type: 'success'
            })
            this.reload()
          })
          .catch(() => {
            this.reload()
          })
      }
      // this.reload()
    }
  }
}
</script>
