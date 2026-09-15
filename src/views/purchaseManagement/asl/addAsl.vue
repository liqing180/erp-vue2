<template>
  <addFromPage :propTimeId="timeId" @back="back" />
</template>

<script>
import addFromPage from './addFromPage'

export default {
  name: 'AddAsl',
  components: {
    addFromPage
  },
  data() {
    return {
      timeId: undefined
    }
  },
  created() {
    const paramsObj = this.$route.query
    this.timeId = paramsObj.timeId
  },
  activated() {
    const paramsObj = this.$route.query
    this.timeId = paramsObj.timeId
  },
  methods: {
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/asl' })
    }
  }
}
</script>
<style lang="scss"></style>
