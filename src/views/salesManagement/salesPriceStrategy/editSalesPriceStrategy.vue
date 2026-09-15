<template>
  <editFormPage :propRowId="rowId" :propTimeId="timeId" />
</template>

<script>
import editFormPage from './editFormPage'
export default {
  name: 'EditSalesPriceStrategy',
  components: {
    editFormPage
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
