<template>
  <div>
    <reviseFromPage
      ref="FromPage"
      :propRowId="rowId"
      :propTimeId="timeId"
      :isView="true"
      @back="back"
    />
  </div>
</template>

<script>
import reviseFromPage from './reviseFromPage'

export default {
  name: 'ViewPurchaseQuotation',
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
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/salesManagement/serviceOrder' })
    }
  }
}
</script>
<style lang="scss"></style>
