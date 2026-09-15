<template>
  <formPage :propTimeId="timeId" />
</template>

<script>
import formPage from '@/views/inventoryManagement/warehouseManagement/warehouse/formPage'
export default {
  name: 'AddWarehouse',
  components: {
    formPage
  },
  data() {
    return {
      timeId: undefined
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
  },
  activated() {
    this.timeId = this.$route.query.timeId
  }
}
</script>
