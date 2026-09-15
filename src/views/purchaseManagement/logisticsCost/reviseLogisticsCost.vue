<template>
  <div>
    <addFromPage
      ref="FromPage"
      :propRowId="rowId"
      :propTimeId="timeId"
      :isRevise="true"
      @back="back"
    />
  </div>
</template>

<script>
import addFromPage from './addFromPage'

export default {
  name: 'ReviseLogisticsCost',
  components: {
    addFromPage
  },
  data() {
    return {
      timeId: undefined,
      rowId: undefined
    }
  },
  created() {
    const paramsObj = this.$route.query
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.fromSrcPath = decodeURIComponent(paramsObj.fromSrcPath || '')
  },
  activated() {
    const paramsObj = this.$route.query
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.fromSrcPath = decodeURIComponent(paramsObj.fromSrcPath || '')
  },
  methods: {
    back() {
      if (this.fromSrcPath) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({
          path: `${this.fromSrcPath}`
        })
      } else {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({ path: '/purchaseManagement/logisticsCost' })
      }
    }
  }
}
</script>
<style lang="scss"></style>
