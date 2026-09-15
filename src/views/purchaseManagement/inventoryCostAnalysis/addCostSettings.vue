<template>
  <formPage :propTimeId="timeId" @back="back" />
</template>

<script>
import formPage from './components/formPage.vue'
export default {
  name: 'AddCostSettings',
  components: { formPage },
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
      this.$router.push({ path: '/purchaseManagement/inventoryCostAnalysis' })
    }
  }
}
</script>
