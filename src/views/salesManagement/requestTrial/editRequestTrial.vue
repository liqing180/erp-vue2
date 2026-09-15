<template>
  <formPage :propRowId="rowId" :propTimeId="timeId" @back="back" />
</template>

<script>
import formPage from './formPage.vue'
export default {
  name: 'EditRequestTrial',
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
    console.log('activated')
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
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
