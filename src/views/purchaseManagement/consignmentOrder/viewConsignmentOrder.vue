<template>
  <div>
    <reviseFromPage ref="FromPage" :propRowId="rowId" :propTimeId="timeId" :isView="true" />
  </div>
</template>

<script>
import reviseFromPage from './reviseFromPage'

export default {
  name: 'ViewConsignmentOrder',
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
  methods: {}
}
</script>
<style lang="scss"></style>
