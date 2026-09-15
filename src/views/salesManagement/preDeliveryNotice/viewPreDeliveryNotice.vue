<template>
  <div>
    <editFromPage
      ref="FromPage"
      :propRowId="rowId"
      :propTimeId="timeId"
      :isView="true"
      @back="back"
    />
  </div>
</template>

<script>
import editFromPage from './editFromPage'

export default {
  name: 'ViewPreDeliveryNotice',
  components: {
    editFromPage
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
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.back()
    }
  }
}
</script>
<style lang="scss"></style>
