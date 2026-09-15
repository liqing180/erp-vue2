<template>
  <formPage :propTimeId="timeId" @back="back" />
</template>

<script>
import formPage from './formPage.vue'
export default {
  name: 'AddRequestTrial',
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
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      if (this.$route.query.soId) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({
          path: '/salesManagement/editSalesOrder',
          query: {
            id: this.$route.query.soId,
            timeId: Date.now()
          }
        })
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/salesManagement/salesOrder' })
    }
  }
}
</script>
