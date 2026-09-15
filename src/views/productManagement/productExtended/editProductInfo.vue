<template>
  <div>
    <editFromPage ref="FromPage" :propRowId="rowId" :propTimeId="timeId" @back="back" />
  </div>
</template>

<script>
import editFromPage from './editFromPage'

export default {
  name: 'EditExtendedProductInfo',
  components: {
    editFromPage
  },
  data() {
    return {
      timeId: undefined,
      rowId: undefined,
      fromSrcPath: undefined
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.fromSrcPath = decodeURIComponent(this.$route.query.fromSrcPath || '')
  },
  activated() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.fromSrcPath = decodeURIComponent(this.$route.query.fromSrcPath || '')
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
      if (this.fromSrcPath) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({
          path: `${this.fromSrcPath}`
        })
      } else {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({ path: '/productManagement/productExtended' })
      }
    }
  }
}
</script>
<style lang="scss"></style>
