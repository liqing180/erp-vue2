<template>
  <div>
    <viewAdjustmentFromPage
      ref="FromPage"
      @back="back"
      :propRowId="rowId"
      :propTimeId="timeId"
      :isView="true"
    />
  </div>
</template>

<script>
import viewAdjustmentFromPage from './viewAdjustmentFromPage'

export default {
  name: 'ViewTransferOrder',
  components: {
    viewAdjustmentFromPage
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
