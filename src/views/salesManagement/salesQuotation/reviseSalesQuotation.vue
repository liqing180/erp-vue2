<template>
  <div>
    <reviseFromPage ref="FromPage" :propRowId="rowId" :propTimeId="timeId" reviseEntry="1" />
  </div>
</template>

<script>
import reviseFromPage from './reviseFromPage'

export default {
  name: 'ReviseSalesQuotation',
  components: {
    reviseFromPage
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
    },
    cancel() {
      this.$refs.FromPage.cancel()
    }
  }
}
</script>
<style lang="scss"></style>
