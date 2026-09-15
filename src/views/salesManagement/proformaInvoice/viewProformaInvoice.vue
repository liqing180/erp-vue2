<template>
  <formPage :propRowId="rowId" :propTimeId="timeId" :isView="true" @back="back" />
</template>

<script>
import formPage from './formPage'
export default {
  name: 'ViewProformaInvoice',
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
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/salesManagement/proformaInvoice' })
    }
  }
}
</script>
