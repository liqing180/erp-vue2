<template>
  <div v-loading.fullscreen.lock="fullscreenLoading"></div>
</template>

<script>
// import { exchange } from '@/api/login'
import {
  setToken
  //  removeToken
} from '@/utils/auth'
export default {
  data() {
    return {
      fullscreenLoading: false
    }
  },
  created() {
    const query = this.$route.query
    if (query.wmsToken) {
      this.fullscreenLoading = true
      setToken(query.wmsToken)
      this.$store.commit('SET_TOKEN', query.wmsToken)
      setTimeout(() => {
        this.$router.push({ path: '/' }).catch(() => {})
        this.fullscreenLoading = false
      }, 100)

      // exchange({ token: query.wmsToken, tenantType: 1 })
      //   .then((res) => {
      //     const data = res.data || {}
      //     if (data.access_token) {
      //       setToken(data.access_token)
      //       this.$store.commit('SET_TOKEN', data.access_token)
      //       setTimeout(() => {
      //         this.$router.push({ path: '/' }).catch(() => {})
      //         this.fullscreenLoading = false
      //       }, 100)
      //     }
      //   })
      //   .catch(() => {
      //     removeToken()
      //     this.fullscreenLoading = false
      //   })
    }
  }
}
</script>
