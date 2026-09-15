<template>
  <addFromPage :propTimeId="timeId" :propRfqDetailIds="rfqDetailIds" :mergeForm="mergeForm" />
</template>

<script>
import addFromPage from './addFromPage'

export default {
  name: 'AddRequestForQuotation',
  components: {
    addFromPage
  },
  data() {
    return {
      timeId: undefined,
      rfqDetailIds: undefined,
      mergeForm: {
        isMergePrAddress: undefined,
        warehouseId: undefined,
        warehouseName: undefined,
        receiveAddressName: undefined,
        dropShipping: undefined
      }
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rfqDetailIds = this.$route.query.rfqDetailIds
    if (this.$route.query.isMergePrAddress && this.$route.query.isMergePrAddress === '1') {
      this.mergeForm = {
        warehouseId: this.$route.query.warehouseId || '',
        warehouseName: this.$route.query.warehouseName || '',
        receiveAddressName: this.$route.query.receiveAddressName || '',
        dropShipping: this.$route.query.dropShipping,
        isMergePrAddress: '1'
      }
    }
  },
  activated() {
    this.timeId = this.$route.query.timeId
    this.rfqDetailIds = this.$route.query.rfqDetailIds
    if (this.$route.query.isMergePrAddress && this.$route.query.isMergePrAddress === '1') {
      this.mergeForm = {
        warehouseId: this.$route.query.warehouseId || '',
        warehouseName: this.$route.query.warehouseName || '',
        receiveAddressName: this.$route.query.receiveAddressName || '',
        dropShipping: this.$route.query.dropShipping,
        isMergePrAddress: '1'
      }
    }
  },
  methods: {}
}
</script>
<style lang="scss"></style>
