<template>
  <span :class="isAuth ? 'primary-link' : ''" @click="clickFn">{{ showStr }}</span>
</template>

<script>
export default {
  props: {
    moduleKey: {
      type: String,
      default: ''
    },
    showStr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      moduleAuth: {
        productExtended: 'productManagement:productExtended:list',
        businessPartner: 'businessPartner:businessPartner:list',
        purchaseRequisition: 'purchaseManagement:purchaseRequisition:list',
        requestForQuotation: 'purchaseManagement:requestForQuotation:list',
        purchaseQuotation: 'purchaseManagement:purchaseQuotation:list',
        purchaseOrder: 'purchaseManagement:purchaseOrder:list',
        purchaseReturnOrder: 'purchaseManagement:purchaseReturnOrder:list',
        consignmentOrder: 'purchaseManagement:consignmentOrder:list',
        purchaseContract: 'purchaseManagement:purchaseContract:list',
        serviceOrder: 'salesManagement:serviceOrder:list',
        salesInquiry: 'salesManagement:salesInquiry:list',
        salesQuotation: 'salesManagement:salesQuotation:list',
        salesOrder: 'salesManagement:salesOrder:list',
        deliveryOrder: 'salesManagement:deliveryOrder:list',
        salesGoodsReturn: 'salesManagement:salesGoodsReturn:list',
        preDeliveryNotice: 'salesManagement:preDeliveryNotice:list',
        projectTemplate: 'projectManagement:projectTemplate:list',
        transferOrder: 'inventoryManagement:transferOrder:list',
        storeIssueChit: 'projectManagement:storeIssueChit:list',
        proformaInvoice: 'salesManagement:proformaInvoice:list',

        all: 'all'
      }
    }
  },
  computed: {
    isAuth() {
      if (!this.moduleKey) {
        return false
      }
      const authKey = this.moduleAuth[this.moduleKey]

      if (!authKey) {
        return false
      }
      if (authKey === 'all') {
        return true
      }
      return this.checkPermi([authKey])
    }
  },
  methods: {
    clickFn() {
      if (!this.isAuth) return
      this.$emit('click')
    }
  }
}
</script>

<style></style>
