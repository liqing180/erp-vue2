<template>
  <div class="flex history-container">
    <div class="history-menu-container formPage" :class="{ 'history-menu-collapse': isCollapse }">
      <div class="collapse-warp">
        <i
          :class="isCollapse === true ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"
          @click="isCollapse = !isCollapse"
        ></i>
      </div>
      <div
        class="menu-resize"
        style="right: 0"
        :data-collapse="isCollapse"
        v-dragHistory
        v-show="!isCollapse"
      ></div>
      <div style="height: 100%">
        <el-menu
          :default-active="activeName"
          :collapse-transition="false"
          :unique-opened="true"
          :collapse="isCollapse"
          @select="menuSelect"
          @open="menuOpen"
          mode="vertical"
          style="height: 100%"
        >
          <el-menu-item index="taskDetail">
            <i class="el-icon-" style="font-size: 18px"><svg-icon icon-class="board-03" /></i>
            <span slot="title">{{ $t('history.taskDetail') }}</span>
          </el-menu-item>
          <el-menu-item index="flowChart">
            <i class="el-icon-" style="font-size: 15px"><svg-icon icon-class="tree-table" /></i>
            <span slot="title">{{ $t('history.flowChart') }}</span>
          </el-menu-item>
          <el-menu-item index="additionalDocument">
            <i class="el-icon-document"></i>
            <span slot="title">{{ $t('history.additionalDocument') }}</span>
          </el-menu-item>
          <el-submenu
            index="revisionRecord"
            class="revisionRecord-submenu"
            style="height: calc(100% - 170px)"
            v-show="revisionRecordShow"
            popper-class="bpm-submenu"
          >
            <template slot="title">
              <i class="el-icon-" style="font-size: 18px"><svg-icon icon-class="form" /></i>
              <span slot="title">{{ $t('history.revisionRecord') }}</span>
            </template>
            <!-- <el-menu-item
              index="revisionComparison"
              v-show="tabActiveName === 'additionalDocument'"
              class="ellipsis"
              >{{ $t('uiBtn.revisionComparison') }}</el-menu-item
            > -->
            <el-scrollbar
              ref="scrollbar"
              class="scroll-bar-box"
              style="height: calc(100% - 56px)"
              v-if="historyVersionList.length > 0"
            >
              <div style="height: calc(100% - 56px)">
                <el-menu-item
                  :index="item.businessId"
                  :key="item.businessId"
                  v-for="item in historyVersionList"
                  >{{ item.businessNo }}</el-menu-item
                >
              </div>
            </el-scrollbar>
          </el-submenu>
        </el-menu>
      </div>
    </div>

    <div class="history-content" v-if="tabActiveName === 'taskDetail'">
      <TaskDetail :instanceId="instanceId" @back="back" />
    </div>
    <div class="history-content" v-if="tabActiveName === 'flowChart'">
      <FlowChart :instanceId="instanceId" @back="back" />
    </div>

    <div class="history-content" v-show="tabActiveName === 'additionalDocument'">
      <component
        ref="FromPage"
        :is="componentName"
        comeFrom="2"
        :propRowId="rowId"
        :propTimeId="timeId"
        :taskId="taskId"
        :dataType="dataType"
        @back="back"
      >
        <template v-slot:bpmMoreBtn="{ btnAuth }">
          <el-button
            type="primary"
            size="mini"
            v-if="(btnAuth || {}).isCanProcessReturn === '1' && returnAuth"
            @click.stop.prevent="actionHandle('returnProcessDlg')"
            >{{ $t('bpm.return') }}
          </el-button>
          <el-button
            type="primary"
            size="mini"
            v-if="(btnAuth || {}).isCanApprovalTransfer === '1' && transferAuth"
            @click.stop.prevent="actionHandle('transferDlg')"
            >{{ $t('bpm.transfer') }}
          </el-button>
          <el-button
            type="primary"
            size="mini"
            v-if="(btnAuth || {}).isCanSkipOverProcess === '1' && skipAuth"
            @click.stop.prevent="actionHandle('approvalSkipOverDlg')"
            >{{ $t('bpm.SKipOver') }}
          </el-button>
          <el-button
            type="primary"
            size="mini"
            v-if="(btnAuth || {}).isCanReminder === '1' && reminderAuth"
            @click.stop.prevent="actionHandle('reminder')"
            >{{ $t('bpm.reminder') }}
          </el-button>
        </template>
      </component>
    </div>

    <!-- 回退 -->
    <returnProcessDlg ref="returnProcessDlg" @onSuccess="back" />
    <!-- 转审 -->
    <transferDlg ref="transferDlg" @onSuccess="back" />
    <!-- 跳审 -->
    <approvalSkipOverDlg ref="approvalSkipOverDlg" @onSuccess="back" />
    <!-- 取消 -->
    <cancelDialog ref="cancelDialog" fromType="3" @onSuccess="back" />
    <!-- 催办提醒 -->
    <reminder ref="reminder" />
  </div>
</template>

<script>
import TaskDetail from '@/views/bpm/history/taskDetail/taskDetail.vue'
import FlowChart from '@/views/bpm/history/flowChart/flowChart.vue'
import locale from '@/views/bpm/lang/index'
import { queryProductHistoryVersion } from '@/api/productManagement/productInfo'
import { queryBomHistoryVersion } from '@/api/productManagement/BOMManagement'
import { queryBPHistoryVersion } from '@/api/businessPartner/businessPartner'
import { querySalesQuotationHistoryVersion } from '@/api/salesManagement/salesQuotation'
import '@/directive/dragHistory.js'

import returnProcessDlg from '@/views/bpm/history/returnProcessDlg/returnProcessDlg'
import transferDlg from '@/views/bpm/history/transferDlg/transferDlg'
import approvalSkipOverDlg from '@/views/bpm/history/approvalSkipOverDlg/approvalSkipOverDlg'
import cancelDialog from '@/views/bpm/history/cancelDialog/cancelDialog'
import reminder from '@/views/bpm/history/reminder/reminder'

const bpBusinessPartnerKey = () =>
  import('@/views/businessPartner/businessPartner/editFromPage.vue')
const ivtProductKey1 = () => import('@/views/productManagement/productInfo/editFromPage.vue')
const ivtProductKey2 = () => import('@/views/productManagement/service/editFromPage.vue')
const sysBomKey = () => import('@/views/productManagement/BOMManagement/formPage.vue')

/* 采购管理 */
const purchaseRequisiteKey = () =>
  import('@/views/purchaseManagement/purchaseRequisition/editFromPage.vue')
const purchaseContractKey = () =>
  import('@/views/purchaseManagement/purchaseContract/editFromPage.vue')
const requestForQuotationKey = () =>
  import('@/views/purchaseManagement/requestForQuotation/viewFromPage.vue')
const purchaseQuotationKey = () =>
  import('@/views/purchaseManagement/purchaseQuotation/editFromPage.vue')
const purchaseOrderKey = () => import('@/views/purchaseManagement/purchaseOrder/editFromPage.vue')
const logisticsExpenseKey = () =>
  import('@/views/purchaseManagement/purchaseOrder/logistics/editFromPage.vue')

const purchaseReturnKey = () =>
  import('@/views/purchaseManagement/purchaseReturnOrder/editFromPage.vue')
const consignmentOrderKey = () =>
  import('@/views/purchaseManagement/consignmentOrder/editFromPage.vue')
const consignmentPickUpKey = () =>
  import('@/views/purchaseManagement/consignmentPickUp/editFromPage.vue')
const approvedSupplierKey = () => import('@/views/purchaseManagement/asl/editFromPage.vue')
/* 库存管理 */
const inventoryAuditKey1 = () =>
  import('@/views/inventoryManagement/inventoryAudit/editAuditFromPage.vue')
const inventoryAuditKey2 = () =>
  import('@/views/inventoryManagement/inventoryAudit/editAdjustmentFromPage.vue')
const transferOrderKey = () => import('@/views/inventoryManagement/transferOrder/editFromPage.vue')
const specialOrderKey = () => import('@/views/stockInManagement/specialOrder/viewSpecialOrder.vue')
const inventoryInitializationKey = () =>
  import('@/views/inventoryManagement/inventoryInitialization/fromPage.vue')
const emergencyReceiveKey = () =>
  import('@/views/inventoryManagement/emergencyGoodsReceipt/editFromPage.vue')
const scrapKey = () =>
  import('@/views/inventoryManagement/warehouseManagement/labelScrap/editFromPage.vue')
/* 销售管理 */
const salesInquiryKey = () => import('@/views/salesManagement/salesInquiry/editFromPage.vue')
const salesQuotationKey = () => import('@/views/salesManagement/salesQuotation/editFromPage.vue')
const salesOrderKey = () => import('@/views/salesManagement/salesOrder/editFromPage.vue')
const piKey = () => import('@/views/salesManagement/proformaInvoice/formPage.vue')

const salesGoodsReturnKey = () =>
  import('@/views/salesManagement/salesGoodsReturn/editFromPage.vue')
const requestTrialKey = () => import('@/views/salesManagement/requestTrial/formPage.vue')
/* 项目管理 */
const projectTaskKey = () => import('@/views/projectManagement/projectTask/formPage.vue')
const projectCostKey = () => import('@/views/projectManagement/projectCost/formPage.vue')
const materialListKey = () => import('@/views/projectManagement/materialList/formPage.vue')
const storeIssueChitKey = () => import('@/views/projectManagement/storeIssueChit/editFromPage.vue')

const salesPriceKey = () => import('@/views/salesManagement/salesPrice/editFromPage.vue')
const projectProductionKey = () =>
  import('@/views/projectManagement/projectProduction/editFormPage.vue')
export default {
  name: 'History',
  components: {
    returnProcessDlg,
    transferDlg,
    approvalSkipOverDlg,
    cancelDialog,
    reminder,

    bpBusinessPartnerKey,
    ivtProductKey1,
    ivtProductKey2,
    sysBomKey,
    /* 采购 */
    purchaseRequisiteKey,
    purchaseContractKey,
    purchaseQuotationKey,
    purchaseOrderKey,
    logisticsExpenseKey,
    purchaseReturnKey,
    consignmentOrderKey,
    consignmentPickUpKey,
    approvedSupplierKey,
    /* 库存 */
    inventoryAuditKey1,
    inventoryAuditKey2,
    transferOrderKey,
    specialOrderKey,
    inventoryInitializationKey,
    emergencyReceiveKey,
    scrapKey,
    /* 销售 */
    salesInquiryKey,
    salesQuotationKey,
    salesOrderKey,
    piKey,

    salesGoodsReturnKey,
    requestTrialKey,
    /* 项目 */
    projectTaskKey,
    projectCostKey,
    materialListKey,
    storeIssueChitKey,
    TaskDetail,
    FlowChart,
    requestForQuotationKey,
    salesPriceKey,
    projectProductionKey
  },
  data() {
    return {
      /* 版本对比的子级点击后需重置为原来选中的 */
      activeName: 'additionalDocument',
      tabActiveName: 'additionalDocument',
      timeId: undefined,
      rowId: undefined, // 业务单据ID
      instanceId: undefined, // 流程实例ID
      taskId: undefined, // 任务ID
      moduleKey: undefined, // 模块key
      dataType: undefined, // todo:1, history:2
      isCollapse: true, // 左侧菜单是否收起
      fromSrcPath: '', // 来源模块路径
      historyVersionList: [], // 历史版本列表
      rowData: {}
    }
  },
  computed: {
    componentName() {
      return this.moduleKey
    },
    comQueryHistoryVersionFn() {
      const fnData = {
        bpBusinessPartnerKey: queryBPHistoryVersion,
        /* 产品 */
        ivtProductKey1: queryProductHistoryVersion,
        ivtProductKey2: queryProductHistoryVersion,
        sysBomKey: queryBomHistoryVersion,
        /* 采购 */
        purchaseRequisiteKey: undefined,
        purchaseContractKey: undefined,
        purchaseQuotationKey: undefined,
        purchaseOrderKey: undefined,
        logisticsExpenseKey: undefined,
        purchaseReturnKey: undefined,
        consignmentOrderKey: undefined,
        consignmentPickUpKey: undefined,
        approvedSupplierKey: undefined,
        /* 库存 */
        inventoryAuditKey1: undefined,
        inventoryAuditKey2: undefined,
        transferOrderKey: undefined,
        emergencyReceiveKey: undefined, // 紧急收货单
        scrapKey: undefined,
        /* 销售 */
        specialOrderKey: undefined,
        salesInquiryKey: undefined,
        salesQuotationKey: querySalesQuotationHistoryVersion,
        salesOrderKey: undefined,
        piKey: undefined,
        salesGoodsReturnKey: undefined,
        /* 项目 */
        projectTaskKey: undefined,
        projectCostKey: undefined,
        materialListKey: undefined,
        storeIssueChitKey: undefined,
        salesPriceKey: undefined,
        projectProductionKey: undefined
      }
      return fnData[this.moduleKey]
    },
    revisionRecordShow() {
      /* const showMode =
        this.moduleKey !== 'inventoryInitializationKey' &&
        this.moduleKey !== 'specialOrderKey' &&
        this.moduleKey !== 'requestForQuotationKey' &&
        this.moduleKey !== 'sysBomKey' &&
        this.moduleKey !== 'salesOrderKey' &&
        this.moduleKey !== 'requestTrialKey' &&
        this.moduleKey !== 'emergencyReceiveKey' &&
        this.moduleKey !== 'scrapKey' &&
        this.moduleKey !== 'approvedSupplierKey' */
      /* const show = this.tabActiveName === 'additionalDocument' || this.historyVersionList.length > 0
      return showMode && show */
      return this.historyVersionList.length > 0
    },
    returnAuth() {
      return this.checkPermi(['bpm:processPendingAction:return'])
    },
    transferAuth() {
      return this.checkPermi(['bpm:toDoTask:transfer', 'bpm:processPendingAction:transfer'])
    },
    cancelAuth() {
      return this.checkPermi(['bpm:processPendingAction:cancel'])
    },
    skipAuth() {
      return this.checkPermi(['bpm:processPendingAction:SKipOver'])
    },
    reminderAuth() {
      return this.checkPermi(['bpm:processPendingAction:reminder'])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    const paramsObj = this.$route.query
    this.timeId = paramsObj.timeId
    this.rowId = paramsObj.id
    this.instanceId = paramsObj.instanceId
    this.taskId = paramsObj.taskId
    this.taskName = paramsObj.taskName
    this.moduleKey = paramsObj.moduleKey
    this.dataType = paramsObj.dataType || '1'
    console.log(this.dataType, '===')
    this.fromSrcPath = decodeURIComponent(paramsObj.fromSrcPath)
    this.init()
  },
  activated() {
    const paramsObj = this.$route.query
    if (paramsObj.timeId !== this.timeId) {
      this.timeId = paramsObj.timeId
      this.rowId = paramsObj.id
      this.instanceId = paramsObj.instanceId
      this.taskId = paramsObj.taskId
      this.moduleKey = paramsObj.moduleKey
      this.dataType = paramsObj.dataType || '1'
      console.log(this.dataType, '===')
      this.fromSrcPath = decodeURIComponent(paramsObj.fromSrcPath)
      this.init()
    }
  },
  methods: {
    init() {
      this.activeName = 'additionalDocument'
      this.tabActiveName = 'additionalDocument'
      this.queryHistoryVersion()
    },
    back() {
      if (!this.fromSrcPath) {
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: `${this.fromSrcPath}`
      })

      this.$store.dispatch('getBPMTaskCount')
    },
    menuSelect(key) {
      if (['taskDetail', 'flowChart', 'additionalDocument'].includes(key)) {
        this.activeName = key
        this.tabActiveName = key
        return
      }
      if (key === 'revisionComparison') {
        /* 版本比对 */
        if (!this.revisionComparisonOpen) {
          this.revisionComparisonOpen = true
          setTimeout(() => {
            this.revisionComparisonOpen = false
          }, 1000)
          this.$refs.FromPage.revisionComparison()
        }
      } else {
        /* 历史版本 */
        if (!this.settingHandleCommand) {
          this.settingHandleCommand = true
          setTimeout(() => {
            this.settingHandleCommand = false
          }, 1000)
          this.$refs.FromPage.settingHandleCommand(key)
        }
      }
      const cur = this.activeName
      this.activeName = undefined
      this.$nextTick(() => {
        this.activeName = cur
      })
    },
    menuOpen() {
      setTimeout(() => {
        this.$refs.scrollbar.update()
      }, 600)
    },
    queryHistoryVersion() {
      if (!this.comQueryHistoryVersionFn) {
        this.historyVersionList = []
        return
      }
      this.comQueryHistoryVersionFn({ businessId: this.rowId }).then((res) => {
        const list = res.data || []
        this.historyVersionList = list.map((item) => {
          return {
            businessId: item.businessId,
            businessNo: item.businessNoAndRevision || item.businessNo
          }
        })
      })
    },
    showCancel(row) {
      const moduleKeys = [
        'specialOrderKey',
        'projectTaskKey',
        'projectCostKey',
        'materialListKey',
        'salesQuotationKey',
        'sysBomKey',
        'requestTrialKey'
      ]
      const isShow = moduleKeys.includes(this.moduleKey)
      if (this.moduleKey === 'purchaseOrderKey' && row.isCanCancelled === '0') {
        return false
      }
      return !isShow
    },
    actionHandle(type) {
      const params = {
        processInstance: this.instanceId,
        taskId: this.taskId,
        timeId: this.timeId,
        moduleKey: this.moduleKey.replace(/[12]$/, ''),
        businessId: this.rowId,
        taskName: this.taskName
      }
      console.log(params)

      this.$refs[type].handleOpen(params)
    }
  }
}
</script>
<style lang="scss">
.bpm-submenu {
  .el-menu--popup {
    background: #303133 !important;
    .el-menu-item {
      color: #ffffff;
    }
    .el-menu-item:hover {
      background: rgba(0, 0, 0, 0.1) !important;
    }
    .scroll-bar-box {
      background: #303133 !important;
      color: #ffffff;
      .el-scrollbar__bar.is-horizontal {
        background: #303133 !important;
      }
    }
  }
}

.history-container {
  height: 100%;
}
.history-menu-container {
  position: relative;
  // transition: width 0.28s;
  width: 300px;
  height: 100%;
  background-color: #fff;
  overflow: inherit;
}
.history-menu-collapse {
  width: 63px;
}
.revisionRecord-submenu .el-menu.el-menu--inline {
  display: block;
  height: calc(100% - 56px);
  .scroll-bar-box {
    // width: 200px;
    width: 100%;
  }
  .el-scrollbar__wrap {
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-menu-item {
    padding-left: 45px;
    padding-right: 20px;
    // width: 200px;
    width: 100%;
  }
}
.collapse-warp {
  position: absolute;
  top: 50%;
  right: -4px;
  z-index: 300;
  font-size: 16px;
  // background-color: #888;
  // right: 100%;
  // border: 1px solid #000;
  background-color: #fff;
  border-radius: 4px;
}

.history-content {
  flex: 1;
  overflow: hidden;
}

.pop-list-inrow {
  margin: 0;
  padding: 0;
  line-height: 32px;
  border: 1px solid #efefef;
  border-radius: 4px;

  dt {
    padding: 0 12px;
    font-weight: bold;
    text-align: center;
  }
  dd {
    cursor: pointer;
    border-top: 1px solid #efefef;
    padding: 0 12px;
    margin: 0;
    text-align: center;
  }
}
</style>
