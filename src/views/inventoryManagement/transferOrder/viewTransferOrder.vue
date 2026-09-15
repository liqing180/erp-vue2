<template>
  <div>
    <reviseFromPage
      ref="FromPage"
      @back="back"
      :propRowId="rowId"
      :propTimeId="timeId"
      :isView="true"
    />
  </div>
</template>

<script>
import reviseFromPage from './reviseFromPage'

export default {
  name: 'ViewTransferOrder',
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
      this.$router.back()
    }
  }
}
</script>
<style lang="scss"></style>
