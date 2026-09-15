<template>
  <!-- v-loading="loading" -->
  <div style="height: 100%">
    <i-frame :src="url" v-if="validToken === '1'" />
  </div>
</template>
<script>
import iFrame from '@/components/iFrame/index'
import { verifyToken } from '@/api/common/common.js'
import { getToken } from '@/utils/auth'
import { MessageBox } from 'element-ui'
export default {
  name: 'CreateReport',
  components: { iFrame },
  data() {
    return {
      url: process.env.VUE_APP_URL + '/metabase',
      // url: 'http://192.168.101.88:3000'
      validToken: undefined,
      loading: true
    }
  },
  created() {
    const token = getToken()
    verifyToken(token)
      .then((response) => {
        this.loading = false
        const value = response.data
        if (value === true) {
          this.validToken = '1'
        } else {
          this.validToken = '2'
          if (!this.$store.state.app.confirmDlg401) {
            this.$store.commit('app/SET_CONFIRM_401', true)
            MessageBox.confirm(this.$t('ui.loginStatusExpired'), '', {
              confirmButtonText: this.$t('uiBtn.loginAgain'),
              cancelButtonText: this.$t('uiBtn.back'),
              type: 'warning'
            })
              .then(() => {
                this.$store.commit('app/SET_CONFIRM_401', false)
                this.$store.dispatch('FedLogOut').then(() => {
                  location.href = '/index'
                })
              })
              .catch(() => {
                this.$store.commit('app/SET_CONFIRM_401', false)
              })
          }
        }
      })
      .catch(() => {
        this.loading = false
        this.validToken = '2'
      })
  }
}
</script>
