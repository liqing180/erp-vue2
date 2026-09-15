<template>
  <formPage :propRowId="rowId" :propTimeId="timeId" :isView="true" @back="back" />
</template>

<script>
import formPage from '@/views/projectManagement/projectTask/formPage'
export default {
  name: 'EditProjectTask',
  components: {
    formPage
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
      this.$router.push({ path: '/projectManagement/projectTask' })
    }
  }
}
</script>
