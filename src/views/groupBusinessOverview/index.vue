<template>
  <div>
    <TopView v-if="curIndex === 1" :formData="topViewForm" @goToNextPage="topViewToNextPage" />
    <SecondView
      v-if="curIndex === 2"
      @goToNextPage="secondViewToNextPage"
      @backTop="secondViewToBack"
      :formData="secondViewForm"
    />
    <ThirdView v-if="curIndex === 3" @backTop="thirdViewToBack" :formData="thirdViewForm" />
  </div>
</template>

<script>
import TopView from '@/views/groupBusinessOverview/TopView.vue'
import SecondView from '@/views/groupBusinessOverview/SecondView.vue'
import ThirdView from '@/views/groupBusinessOverview/ThirdView.vue'

import locale from '@/views/groupBusinessOverview/lang/index'
export default {
  name: 'GroupBusinessOverview',
  components: {
    TopView,
    SecondView,
    ThirdView
  },
  data() {
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - 11)
    return {
      curIndex: 1,
      topViewForm: {
        topDateRange: [start.getTime(), end.getTime()],

        chart1YearType: '1',
        chart1DateRange: [start.getTime(), end.getTime()],

        chart2YearType: '1',
        chart2DateRange: [start.getTime(), end.getTime()]
      },
      secondViewForm: {
        topDateRange: [start.getTime(), end.getTime()]
      },
      thirdViewForm: {
        // legalEntityId: '11322344332722176',
        topDateRange: [start.getTime(), end.getTime()]
      }
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    topViewToNextPage(params) {
      if (params.dateRange && params.dateRange.length === 2) {
        this.secondViewForm.topDateRange = params.dateRange
      }
      this.curIndex = 2
    },
    secondViewToNextPage(params) {
      if (params.dateRange && params.dateRange.length === 2) {
        this.thirdViewForm.topDateRange = params.dateRange
      }
      if (params.legalEntityId) {
        this.thirdViewForm.legalEntityId = params.legalEntityId
      }
      this.curIndex = 3
    },
    secondViewToBack(params) {
      this.curIndex = 1
    },
    thirdViewToBack(params) {
      if (params.dateRange && params.dateRange.length === 2) {
        this.secondViewForm.topDateRange = params.dateRange
      }
      this.curIndex = 2
    }
  }
}
</script>

<style lang="scss">
.overviewDate {
  .el-picker-panel__body-wrapper {
    .el-picker-panel__sidebar {
      width: 130px !important;
      white-space: nowrap;
    }
    .el-picker-panel__body {
      margin-left: 130px !important;
    }
  }
}
</style>
