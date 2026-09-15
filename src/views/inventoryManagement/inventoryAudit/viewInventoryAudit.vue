<template>
  <div>
    <viewAuditFromPage
      ref="FromPage"
      @back="back"
      :propRowId="rowId"
      :propTimeId="timeId"
      :isView="true"
    />
  </div>
</template>

<script>
import viewAuditFromPage from './viewAuditFromPage'

export default {
  name: 'ViewInventoryAudit',
  components: {
    viewAuditFromPage
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
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.back()
    }
  }
}
</script>
<style lang="scss"></style>
