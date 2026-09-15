<template>
  <formPage :propRowId="rowId" :propTimeId="timeId" :isView="isView" />
</template>

<script>
import formPage from './formPage.vue'
export default {
  name: 'EditZone',
  components: { formPage },
  data() {
    return {
      timeId: undefined,
      rowId: undefined,
      isView: undefined
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.isView = this.$route.query.isView === '1'
  },
  activated() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.isView = this.$route.query.isView === '1'
  },
  methods: {}
}
</script>
