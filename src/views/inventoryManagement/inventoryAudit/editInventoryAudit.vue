<template>
  <div>
    <editAuditFromPage ref="FromPage" :propRowId="rowId" :propTimeId="timeId" @back="back" />
  </div>
</template>

<script>
import editAuditFromPage from './editAuditFromPage'

export default {
  name: 'EditInventoryAudit',
  components: {
    editAuditFromPage
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
      this.$router.push({ path: '/inventoryManagement/inventoryAudit' })
    }
  }
}
</script>
<style lang="scss"></style>
