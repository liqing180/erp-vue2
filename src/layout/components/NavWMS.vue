<template>
  <div style="vertical-align: top">
    <div v-if="checkPermi(['wms:system']) && wmsUrl" @click="navToWWms">
      <div class="my-nav-btn">
        <i class="el-icon-menu" style="font-size: 14px"></i>
        {{ $t('ui.wmsWarehouse') }}
      </div>
    </div>
  </div>
</template>

<script>
import { queryDomainName, exchange } from '@/api/login'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      // wmsUrl: 'http://192.168.101.40:8087'
      wmsUrl: ''
    }
  },
  created() {
    this.queryDomainName()
  },
  methods: {
    queryDomainName() {
      queryDomainName().then((res) => {
        this.wmsUrl = res.data.wmsDomain
      })
    },
    navToWWms() {
      // const url = `${this.wmsUrl}/authLogin?erpToken=${getToken()}`
      // window.open(url, '_self') // 当前标签页中打开
      // window.open(url, '_blank') // 新标签页中打开
      this.exchange()
    },
    exchange() {
      exchange({ token: getToken(), tenantType: 2 }).then((res) => {
        const data = res.data || {}
        if (data.access_token) {
          // const url = `http://192.168.101.116:8087/authLogin?erpToken=${data.access_token}`
          const url = `${this.wmsUrl}/authLogin?erpToken=${data.access_token}`
          window.open(url, '_self') // 当前标签页中打开
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-nav-btn {
  cursor: pointer;
  border: 1px solid #409eff;
  padding: 0 10px;
  border-radius: 4px;
  color: #409eff;
  font-size: 12px;
  height: 32px;
  line-height: 32px;
  margin-top: 9px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>
