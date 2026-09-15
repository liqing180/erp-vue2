<template>
  <formPage :propRowId="rowId" :propTimeId="timeId" />
</template>

<script>
import formPage from './salesFormPage.vue'
export default {
  name: 'EditSalesExpansionInformation',
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
