<template>
  <addFromPage :propTimeId="timeId" @back="back" />
</template>

<script>
import addFromPage from './addFromPage'

export default {
  name: 'AddStoreIssueChit',
  components: {
    addFromPage
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
      this.$router.push({ path: '/projectManagement/storeIssueChit' })
    }
  }
}
</script>
<style lang="scss"></style>
