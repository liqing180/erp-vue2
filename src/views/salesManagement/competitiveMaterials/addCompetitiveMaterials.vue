<template>
  <formPage :propTimeId="timeId" @back="back" />
</template>

<script>
import formPage from './formPage.vue'
export default {
  name: 'AddCompetitiveMaterials',
  components: { formPage },
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
      this.$router.push({ path: '/salesManagement/competitiveMaterials' })
    }
  }
}
</script>
