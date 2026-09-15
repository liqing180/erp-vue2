<template>
  <formPage :propRowId="rowId" :propTimeId="timeId" />
</template>

<script>
import formPage from './salesBatchEditFormPage.vue'
export default {
  name: 'BatchEditSalesExpansionInformation',
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
