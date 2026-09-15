<template>
  <formPage :propRowId="rowId" :propTimeId="timeId" @back="back" />
</template>

<script>
import formPage from './components/formPage.vue'
export default {
  name: 'EditCostSettings1',
  components: { formPage },
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
      this.$router.push({ path: '/reportManagement/inventoryCostAnalysis' })
    }
  }
}
</script>
