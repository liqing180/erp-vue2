<template>
  <addAuditFromPage :propTimeId="timeId" @back="back" />
</template>

<script>
import addAuditFromPage from './addAuditFromPage'

export default {
  name: 'AddInventoryAudit',
  components: {
    addAuditFromPage
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
  },
  methods: {
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/inventoryManagement/inventoryAudit' })
    }
  }
}
</script>
<style lang="scss"></style>
