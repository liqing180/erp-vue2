<template>
  <formPage :propTimeId="timeId" @back="back" />
</template>

<script>
import formPage from './formPage.vue'
export default {
  name: 'AddBOMManagement',
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
    console.log('activated')
    this.timeId = this.$route.query.timeId
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
