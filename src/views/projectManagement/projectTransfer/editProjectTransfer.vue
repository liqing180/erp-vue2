<template>
  <formPage :propRowId="rowId" :propTimeId="timeId" />
</template>

<script>
import formPage from './formPage.vue'
export default {
  name: 'EditProjectTransfer',
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
  methods: {}
}
</script>
