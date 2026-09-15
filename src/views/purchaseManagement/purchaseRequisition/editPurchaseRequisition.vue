<template>
  <div>
    <editFromPage ref="FromPage" :propRowId="rowId" :propTimeId="timeId" @back="back" />
  </div>
</template>

<script>
import editFromPage from './editFromPage'

export default {
  name: 'EditPurchaseRequisition',
  components: {
    editFromPage
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
    back() {
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/purchaseRequisition' })
    }
  }
}
</script>
<style lang="scss"></style>
