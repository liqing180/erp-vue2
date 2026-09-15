<template>
  <viewFromPage ref="FromPage" :propRowId="rowId" :propTimeId="timeId" @back="back" />
</template>

<script>
import viewFromPage from './viewFromPage'

export default {
  name: 'ViewFromPage',
  components: {
    viewFromPage
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
    submitForm() {
      this.$refs.FromPage.submitForm()
    },
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.back()
      // this.$store.dispatch('tagsView/delView', this.$route)
      // this.$router.push({ path: '/projectManagement/storeIssueChit' })
    }
  }
}
</script>

<style lang="scss"></style>
