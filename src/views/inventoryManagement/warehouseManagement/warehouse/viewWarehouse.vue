<template>
  <formPage :propRowId="rowId" :propTimeId="timeId" :isView="true" />
</template>

<script>
import formPage from '@/views/inventoryManagement/warehouseManagement/warehouse/formPage'
export default {
  name: 'ViewWarehouse',
  components: {
    formPage
  },
  data() {
    return {
      timeId: undefined,
      rowId: undefined
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
  },
  activated() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
  },
  methods: {
    submitForm() {
      this.$refs.FromPage.submitForm()
    }
  }
}
</script>
