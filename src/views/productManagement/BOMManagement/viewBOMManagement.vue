<template>
  <formPage :propRowId="rowId" :propTimeId="timeId" @back="back" isView="1" />
</template>

<script>
import formPage from './formPage.vue'
export default {
  name: 'ViewBOMManagement',
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
      this.$router.back()
    }
  }
}
</script>
