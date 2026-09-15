<template>
  <div>
    <editFromPage ref="FromPage" :propRowId="rowId" :propTimeId="timeId" @back="back" />
  </div>
</template>

<script>
import editFromPage from './editFromPage'

export default {
  name: 'EditProductInfo',
  components: {
    editFromPage
  },
  data() {
    return {
      timeId: undefined,
      rowId: undefined,
      isBack: undefined
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.isBack = this.$route.query.back
  },
  activated() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.isBack = this.$route.query.back
  },
  methods: {
    submitForm() {
      this.$refs.FromPage.submitForm()
    },
    back() {
      if (this.isBack) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/productManagement/productInfo' })
    }
  }
}
</script>
<style lang="scss"></style>
