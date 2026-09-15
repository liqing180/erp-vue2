<template>
  <fromPage :propTimeId="timeId" @back="back" />
</template>

<script>
import fromPage from './fromPage'

export default {
  name: 'AddInventoryInitialization',
  components: {
    fromPage
  },
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
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/inventoryManagement/inventoryInitialization' })
    }
  }
}
</script>
<style lang="scss"></style>
