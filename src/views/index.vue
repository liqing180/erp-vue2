<template>
  <div style="height: 100%">
    <dashboard />
  </div>
</template>

<script>
import dashboard from '@/views/reportManagement/dashboard/index.vue'
export default {
  name: 'Index',
  components: {
    dashboard
  },
  data() {
    return {}
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
// .dashboard-editor-container {
//   padding: 32px;
//   background-color: rgb(240, 242, 245);
//   position: relative;

//   .chart-wrapper {
//     background: #fff;
//     padding: 16px 16px 0;
//     margin-bottom: 32px;
//   }
// }

// @media (max-width: 1024px) {
//   .chart-wrapper {
//     padding: 8px;
//   }
// }
</style>
