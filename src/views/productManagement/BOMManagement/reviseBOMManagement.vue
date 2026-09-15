<template>
  <formPage :propRowId="rowId" :propTimeId="timeId" isRevisePage="1" @back="back" />
</template>

<script>
import formPage from './formPage.vue'
export default {
  name: 'ReviseBOMManagement',
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
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/productManagement/BOMManagement' })
    }
  }
}
</script>
