<template>
  <fromPage :propRowId="rowId" :propTimeId="timeId" @back="back" />
</template>

<script>
import fromPage from './fromPage'

export default {
  name: 'ViewInventoryInitialization',
  components: {
    fromPage
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
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/inventoryManagement/inventoryInitialization' })
    }
  }
}
</script>
<style lang="scss"></style>
