<template>
  <div>
    <editFromPage
      ref="FromPage"
      :propRowId="rowId"
      :propTimeId="timeId"
      :propSOId="soId"
      @back="back"
    />
  </div>
</template>

<script>
import editFromPage from './editFromPage'

export default {
  name: 'AddPreDeliveryNotice',
  components: {
    editFromPage
  },
  data() {
    return {
      timeId: undefined,
      rowId: undefined,
      soId: undefined
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.soId = this.$route.query.soId
  },
  activated() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.soId = this.$route.query.soId
  },
  methods: {
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/salesManagement/preDeliveryNotice' })
    }
  }
}
</script>
<style lang="scss"></style>
