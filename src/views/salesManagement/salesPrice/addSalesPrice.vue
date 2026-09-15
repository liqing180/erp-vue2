<template>
  <addFromPage
    :propTimeId="timeId"
    :rfqDetailId="rfqDetailId"
    :purchasePriceId="purchasePriceId"
    @back="back"
  />
</template>

<script>
import addFromPage from './addFromPage'

export default {
  name: 'AddSalesPrice',
  components: {
    addFromPage
  },
  data() {
    return {
      timeId: undefined,
      rfqDetailId: undefined,
      purchasePriceId: undefined,
      fromSrcPath: '' // 来源模块路径
    }
  },
  created() {
    const paramsObj = this.$route.query
    this.timeId = paramsObj.timeId
    this.rfqDetailId = paramsObj.rfqId
    this.purchasePriceId = paramsObj.pplId
    this.fromSrcPath = decodeURIComponent(paramsObj.fromSrcPath || '')
  },
  activated() {
    const paramsObj = this.$route.query
    this.timeId = paramsObj.timeId
    this.rfqDetailId = paramsObj.rfqId
    this.purchasePriceId = paramsObj.pplId
    this.fromSrcPath = decodeURIComponent(paramsObj.fromSrcPath || '')
  },
  methods: {
    back() {
      if (this.fromSrcPath) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({
          path: `${this.fromSrcPath}`
        })
      } else {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({ path: '/salesManagement/salesPrice' })
      }
    }
  }
}
</script>
<style lang="scss"></style>
