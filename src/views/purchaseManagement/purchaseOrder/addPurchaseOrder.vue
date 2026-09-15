<template>
  <addFromPageASL
    :propTimeId="timeId"
    :pendingOrderProductIds="pendingOrderProductIds"
    :purchaseRequisiteDetailIds="purchaseRequisiteDetailIds"
    :dropShipping="dropShipping"
    @back="back"
    v-if="createdType === '2'"
  />
  <addFromPage
    :propTimeId="timeId"
    :rfqDetailId="rfqDetailId"
    :purchasePriceId="purchasePriceId"
    :propPQId="propPQId"
    @back="back"
    v-else
  />
</template>

<script>
import addFromPage from './addFromPage'
import addFromPageASL from './addFromPageASL'

export default {
  name: 'AddPurchaseOrder',
  components: {
    addFromPage,
    addFromPageASL
  },
  data() {
    return {
      timeId: undefined,
      rfqDetailId: undefined,
      purchasePriceId: undefined,
      propPQId: undefined,
      fromSrcPath: '', // 来源模块路径
      pendingOrderProductIds: undefined, // 来源RFQ ASl
      purchaseRequisiteDetailIds: undefined, // 来源RFQ ASl
      dropShipping: undefined,
      createdType: '1' // 1. 正常PO, 2: ASL PO
    }
  },
  created() {
    const paramsObj = this.$route.query
    this.timeId = paramsObj.timeId
    this.rfqDetailId = paramsObj.rfqId
    this.purchasePriceId = paramsObj.pplId
    this.propPQId = paramsObj.purchaseQuotationId
    this.pendingOrderProductIds = paramsObj.pendingOrderProductIds
    this.purchaseRequisiteDetailIds = paramsObj.purchaseRequisiteDetailIds
    this.dropShipping = paramsObj.dropShipping
    this.createdType = paramsObj.createdType || '1'
    this.fromSrcPath = decodeURIComponent(paramsObj.fromSrcPath || '')
  },
  activated() {
    const paramsObj = this.$route.query
    this.timeId = paramsObj.timeId
    this.rfqDetailId = paramsObj.rfqId
    this.purchasePriceId = paramsObj.pplId
    this.propPQId = paramsObj.purchaseQuotationId
    this.pendingOrderProductIds = paramsObj.pendingOrderProductIds
    this.purchaseRequisiteDetailIds = paramsObj.purchaseRequisiteDetailIds
    this.dropShipping = paramsObj.dropShipping
    this.createdType = paramsObj.createdType || '1'
    this.fromSrcPath = decodeURIComponent(paramsObj.fromSrcPath || '')
  },
  methods: {
    back() {
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      if (this.fromSrcPath) {
        this.$store.dispatch('tagsView/delView', this.$route)
        const options = {
          path: `${this.fromSrcPath}`
        }
        if (
          this.fromSrcPath.includes('editPurchaseQuotation') ||
          this.fromSrcPath.includes('viewPurchaseQuotation')
        ) {
          options.query = {
            id: this.propPQId,
            timeId: Date.now()
          }
        }
        this.$router.push(options)
      } else {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({ path: '/purchaseManagement/purchaseOrder' })
      }
    }
  }
}
</script>
<style lang="scss"></style>
