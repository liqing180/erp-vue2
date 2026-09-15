<template>
  <div class="dashboard-container" ref="fullScreenContainer" v-if="dashboardAuth">
    <!-- 头部 -->
    <board-header
      :reportUrlList="reportUrlList"
      :todaysDataOptions="todaysDataOptions"
      :comTodaysData="comTodaysData"
      @toggleFullscreen="toggleFullscreen"
      :isShowFullScreen="isShowFullScreen"
      @handleChangeUrl="handleChangeUrl"
      @handleChangeTodays="handleChangeTodays"
      @setMaskShow="setMaskShow"
      :formData="form"
      :isExpand="isExpand"
      @changeIsExpand="isExpand = !isExpand"
    />
    <div v-if="comUrl" class="iframeModule_out">
      <i-frame :src="comUrl" :otherHeight="comOrderHeight" />
      <div class="mask" v-if="mask" @click="mask = false"></div>
    </div>
    <div v-else-if="reportUrlList.length <= 0 && initPage" style="padding: 20px">
      {{ $t('DASHBOARD.noAuthMsg') }}
    </div>

    <settingDlg ref="settingDlg" @onSuccess="settingSuccess" />
  </div>
  <div v-else style="padding: 20px">
    {{ $t('DASHBOARD.noAuthMsg') }}
  </div>
</template>

<script>
import boardHeader from './boardHeader'
import settingDlg from './settingDlg'
import iFrame from '@/components/iFrame/index'
import { debounce } from '@/utils'
import locale from '@/views/reportManagement/dashboard/lang/index'
import {
  queryReportGroupForDashboard,
  queryTaskCenterStatistics,
  saveUserDefaultReport,
  queryTodayTransactionsPurchase,
  queryTodayTransactionsSales,
  queryTodayTransactionsOverall
} from '@/api/reportManagement/dashboard'

export default {
  components: { boardHeader, settingDlg, iFrame },
  data() {
    return {
      zoneIdList: [],
      // 顶部是否展开
      isExpand: true,
      // 是否全屏
      isShowFullScreen: false,
      // 窗口、地图全屏
      isShowFullScreenIndex: 0,
      viewReportList: [],
      mask: false,
      form: {
        openQty: 0,
        overdueQty: 0,
        processedQty: 0,
        myInitiatedQty: 0,
        notificationsQty: 0,

        reportUrl: undefined,
        reportName: undefined,
        reportDetailId: undefined,

        todaysDataActive: 'overall'
      },
      reportUrlList: [
        // {
        //   label: '文件夹1',
        //   options: [
        //     {
        //       reportName: '报表-百度',
        //       reportDetailId: '1',
        //       publicUrl: 'www.baidu.com'
        //     },
        //     {
        //       reportName: '报表-gitee',
        //       reportDetailId: '2',
        //       publicUrl: 'www.gitee.com'
        //     }
        //   ]
        // }
      ],
      purchaseTodaysData: [
        {
          label: this.$t('DASHBOARD.todaysOrders'),
          value: 0,
          percentage: 0
        },
        {
          label: this.$t('DASHBOARD.todaysStockIns'),
          value: 0,
          percentage: 0
        },
        {
          label: this.$t('DASHBOARD.todaysReturns'),
          value: 0,
          percentage: 0
        },
        {
          label: this.$t('DASHBOARD.activeSuppliers'),
          value: 0,
          percentage: 0
        }
      ],
      salesTodaysData: [
        {
          label: this.$t('DASHBOARD.todaysOrders'),
          value: 0,
          percentage: 0
        },
        {
          label: this.$t('DASHBOARD.todaysDeliveries'),
          value: 0,
          percentage: 0
        },
        {
          label: this.$t('DASHBOARD.todaysReturns'),
          value: 0,
          percentage: 0
        },
        {
          label: this.$t('DASHBOARD.activeCustomers'),
          value: 0,
          percentage: 0
        }
      ],
      overallTodaysData: [
        {
          label: this.$t('DASHBOARD.purchaseOrders'),
          value: 0,
          percentage: 0
        },
        {
          label: this.$t('DASHBOARD.salesOrders'),
          value: 0,
          percentage: 0
        },
        {
          label: this.$t('DASHBOARD.activeSuppliers'),
          value: 0,
          percentage: 0
        },
        {
          label: this.$t('DASHBOARD.activeCustomers'),
          value: 0,
          percentage: 0
        }
      ],
      initPage: false
    }
  },
  computed: {
    comOrderHeight() {
      let height = this.isShowFullScreen ? 200 : 84 + 200
      if (!this.isExpand) {
        height -= 132
      }
      return height
    },
    legalEntityId() {
      return this.$store.state.user.legalEntityInfo.legalEntityId
    },
    comUrl() {
      if (!this.form.reportUrl) {
        return undefined
      }
      // return 'https://cds.batchtec.com.sg/metabase/public/dashboard/6b2aeaff-2238-41e0-a1b0-48a74f12f789?zone_id=9063469616660480&zone_id=9640388640374784&zone_id=9640411810299904&zone_id=7710250824761344&zone_id=7986453126447104&zone_id=8780060882632704&zone_id=8191137795801088&zone_id=8111745274806272&date_filter=past30days#hide_parameters=zone_id,date_filter&titled=false'

      return (
        process.env.VUE_APP_URL +
        this.form.reportUrl +
        `?legal_entity_id=${this.legalEntityId}#hide_parameters=legal_entity_id&titled=false`
      )
    },
    comTodaysData() {
      if (this.form.todaysDataActive === 'purchase') {
        return this.purchaseTodaysData
      }
      if (this.form.todaysDataActive === 'sales') {
        return this.salesTodaysData
      }
      return this.overallTodaysData
    },
    dashboardPurchaseAuth() {
      return this.checkPermi(['system:dashboard:purchase'])
    },
    dashboardSalesAuth() {
      return this.checkPermi(['system:dashboard:sales'])
    },
    dashboardOverallAuth() {
      return this.checkPermi(['system:dashboard:overall'])
    },
    dashboardAuth() {
      return this.dashboardPurchaseAuth || this.dashboardSalesAuth || this.dashboardOverallAuth
    },
    todaysDataOptions() {
      const list = []
      if (this.dashboardPurchaseAuth) {
        list.push({
          label: this.$t('DASHBOARD.purchase'),
          value: 'purchase'
        })
      }
      if (this.dashboardSalesAuth) {
        list.push({
          label: this.$t('DASHBOARD.sales'),
          value: 'sales'
        })
      }
      if (this.dashboardOverallAuth) {
        list.push({
          label: this.$t('DASHBOARD.overall'),
          value: 'overall'
        })
      }
      return list
    }
  },
  created() {
    this.dataRefreh()
    this.createdInitTimer = Date.now()
    this.queryReportGroupForDashboard()
    this.queryTaskCenterStatistics()
    const dashboardTodaysId = this.$cache.local.getJSON('dashboardTodaysId')
    if (
      dashboardTodaysId &&
      this.todaysDataOptions.find((item) => item.value === dashboardTodaysId)
    ) {
      this.$set(this.form, 'todaysDataActive', dashboardTodaysId)
    }
    this.handleChangeTodays()
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  mounted() {
    const that = this
    window.onresize = debounce(() => {
      if (that.isShowFullScreenIndex > 0) {
        that.isShowFullScreen = false
        that.isShowFullScreenIndex = 0
      } else {
        that.isShowFullScreenIndex++
      }
    }, 0)
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.dataRefreh()
    this.queryReportGroupForDashboard()
    this.queryTaskCenterStatistics()
    this.handleChangeTodays()
    const that = this
    window.onresize = debounce(() => {
      if (that.isShowFullScreenIndex > 0) {
        that.isShowFullScreen = false
        that.isShowFullScreenIndex = 0
      } else {
        that.isShowFullScreenIndex++
      }
    }, 0)
  },
  deactivated() {
    this.isShowFullScreenIndex = 0
    window.onresize = null
    clearInterval(this.intervalId) // 清除计时器
    this.intervalId = null // 设置为null
  },
  beforeDestroy() {
    this.isShowFullScreenIndex = 0
    window.onresize = null
    clearInterval(this.intervalId) // 清除计时器
    this.intervalId = null // 设置为null
  },
  methods: {
    dataRefreh(time) {
      // 计时器正在进行中，退出函数
      if (this.intervalId != null) {
        return
      }
      // 计时器为空，操作
      this.intervalId = setInterval(() => {
        this.queryTaskCenterStatistics()
        this.handleChangeTodays()
      }, 60 * 1000)
    },
    setMaskShow(value) {
      this.mask = value
    },
    // 区域数据
    queryUserDefaultReport() {},

    // 全屏状态切换
    toggleFullscreen() {
      const _this = this
      this.isShowFullScreenIndex = 0
      const el = this.$refs.fullScreenContainer
      if (document.fullscreenElement === null || el !== document.fullscreenElement) {
        _this.openFullscreen(el)
      } else {
        _this.quitFullscreen()
      }
    },
    // 全屏
    openFullscreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        // IE11
        element.msRequestFullscreen()
      }
      this.isShowFullScreen = true
    },
    // 退出全屏
    quitFullscreen() {
      this.isShowFullScreen = false
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    },
    queryReportGroupForDashboard() {
      const dashboardReportId = this.$cache.local.getJSON('dashboardReportId')
      queryReportGroupForDashboard({ reportType: 'ERP' }).then((res) => {
        this.$nextTick(() => {
          this.initPage = true
        })
        let topRow
        let isDefalutRow
        const list = res.data || []
        const showList = []
        list.forEach((item) => {
          if (item.dashboards && item.dashboards.length > 0) {
            item.dashboards.forEach((child) => {
              child.reportId = item.reportGroupId + '-' + child.id
              child.reportName = child.name
              if (!topRow) {
                topRow = child
              }
              if (child.reportId === dashboardReportId) {
                isDefalutRow = child
              }
            })
            showList.push({
              label: item.groupName,
              options: item.dashboards
            })
          }
        })
        this.reportUrlList = showList

        if (isDefalutRow) {
          this.$set(this.form, 'reportUrl', isDefalutRow.publicUrl)
          this.$set(this.form, 'reportId', isDefalutRow.reportId)
          this.$set(this.form, 'reportName', isDefalutRow.reportName)
        } else if (topRow) {
          this.$set(this.form, 'reportUrl', topRow.publicUrl)
          this.$set(this.form, 'reportId', topRow.reportId)
          this.$set(this.form, 'reportName', topRow.reportName)
        }
        // this.viewReportList = res.data || []
      })
    },
    queryTaskCenterStatistics() {
      queryTaskCenterStatistics({}).then((res) => {
        const data = res.data || {}
        this.$set(this.form, 'myInitiatedQty', data.myInitiatedQty || 0)
        this.$set(this.form, 'notificationsQty', data.notificationsQty || 0)
        this.$set(this.form, 'openQty', data.openQty || 0)
        this.$set(this.form, 'overdueQty', data.overdueQty || 0)
        this.$set(this.form, 'processedQty', data.processedQty || 0)
      })
    },
    handleChangeUrl(reportRow) {
      this.$set(this.form, 'reportUrl', reportRow.publicUrl)
      this.$set(this.form, 'reportId', reportRow.reportId)
      this.$set(this.form, 'reportName', reportRow.reportName)
      this.$cache.local.setJSON('dashboardReportId', reportRow.reportId)
      this.saveUserDefaultReport(reportRow.reportId)
    },
    handleChangeTodays() {
      const active = this.form.todaysDataActive
      if (!active) return
      let FN
      if (active === 'purchase') {
        FN = queryTodayTransactionsPurchase
      }
      if (active === 'sales') {
        FN = queryTodayTransactionsSales
      }
      if (active === 'overall') {
        FN = queryTodayTransactionsOverall
      }
      const timer = Date.now()
      this.queryTime = timer
      FN({}).then((res) => {
        if (timer !== this.queryTime) return
        const data = res.data || {}
        if (active === 'purchase') {
          const list = [...this.purchaseTodaysData]
          const todayOrders = data.todayOrders || 0
          const todayStockIns = data.todayStockIns || 0
          const todayReturns = data.todayReturns || 0
          const activeSuppliers = data.activeSuppliers || 0
          const max = Math.max(1, todayOrders, todayStockIns, todayReturns, activeSuppliers)
          list[0].value = todayOrders
          list[0].percentage = (todayOrders * 100) / max
          list[1].value = todayStockIns
          list[1].percentage = (todayStockIns * 100) / max
          list[2].value = todayReturns
          list[2].percentage = (todayReturns * 100) / max
          list[3].value = activeSuppliers
          list[3].percentage = (activeSuppliers * 100) / max
        }

        if (active === 'sales') {
          const list = [...this.salesTodaysData]
          const todayOrders = data.todayOrders || 0
          const todayDeliveries = data.todayDeliveries || 0
          const todayReturns = data.todayReturns || 0
          const activeCustomers = data.activeCustomers || 0
          const max = Math.max(1, todayOrders, todayDeliveries, todayReturns, activeCustomers)
          list[0].value = todayOrders
          list[0].percentage = (todayOrders * 100) / max
          list[1].value = todayDeliveries
          list[1].percentage = (todayDeliveries * 100) / max
          list[2].value = todayReturns
          list[2].percentage = (todayReturns * 100) / max
          list[3].value = activeCustomers
          list[3].percentage = (activeCustomers * 100) / max
        }

        if (active === 'overall') {
          const list = [...this.overallTodaysData]
          const purchaseOrderCount = data.purchaseOrderCount || 0
          const salesOrderCount = data.salesOrderCount || 0
          const activeSuppliers = data.activeSuppliers || 0
          const activeCustomers = data.activeCustomers || 0
          const max = Math.max(
            1,
            purchaseOrderCount,
            salesOrderCount,
            activeSuppliers,
            activeCustomers
          )
          list[0].value = purchaseOrderCount
          list[0].percentage = (purchaseOrderCount * 100) / max
          list[1].value = salesOrderCount
          list[1].percentage = (salesOrderCount * 100) / max
          list[2].value = activeSuppliers
          list[2].percentage = (activeSuppliers * 100) / max
          list[3].value = activeCustomers
          list[3].percentage = (activeCustomers * 100) / max
        }
      })
    },
    saveUserDefaultReport(reportId) {
      const ids = reportId.split('-')
      saveUserDefaultReport({
        reportGroupId: ids[0],
        id: ids[1]
      }).then((res) => {
        console.log(res)
      })
    },
    setting() {
      this.$refs.settingDlg.handleOpen({})
    },
    settingSuccess(reportRow) {
      this.queryReportGroupForDashboard()
      this.form.reportUrl = reportRow.publicUrl
    }
  }
}
</script>

<style lang="scss" scoped>
.iframeModule_out {
  position: relative;
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(119, 119, 119, 0);
  }
}
.dashboard-container {
  background-color: #fff;
  height: 100%;
}
</style>
