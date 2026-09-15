<template>
  <FormPageLayout ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        v-if="submitBtnShow && !approvedBtnShow"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="saveDraftBtnShow" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="approvedBtnShow" @click="handleApproved"
        >{{ $t('uiBtn.approve') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="rejectedBtnShow" @click="handleRejected"
        >{{ $t('uiBtn.reject1') }}
      </el-button>

      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
      </el-button>

      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>

      <el-button
        type="primary"
        size="mini"
        v-if="buttonAuthMsg.isCanSeeUpdateMsg === '1'"
        @click="revisionComparison"
        >{{ $t('uiBtn.revisionComparison') }}</el-button
      >
      <el-button type="primary" size="mini" v-if="isShowEditBtn" @click="exitComparison"
        >{{ $t('uiBtn.edit') }}
      </el-button>
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">{{ $t('menu.salesPrice') }}</div>
    </template>

    <template v-slot:content>
      <div>
        <div class="form-card mb10" v-if="isComparison">
          <div class="legend-bar">
            <span class="legend-text">{{ $t('ui.legend') }}</span>
            <span class="legend-divider"></span>
            <span class="legend-item"
              ><span class="color-block add"></span>{{ $t('ui.added') }}</span
            >
            <span class="legend-divider"></span>
            <span class="legend-item"
              ><span class="color-block edit"></span>{{ $t('ui.modified') }}</span
            >
            <span class="legend-divider"></span>
            <span class="legend-item"
              ><span class="color-block del"></span>{{ $t('ui.deleted') }}</span
            >
          </div>
        </div>

        <div
          class="form-card reject-card collapse-item-content-pt0 mb10"
          v-if="isComparison && (form.operationLogForLastReject || {}).operatorBy"
        >
          <el-collapse v-model="activeNames">
            <el-collapse-item name="11">
              <FormCollapseItemTitle slot="title" :title="$t('ui.rejectionOpinion')" />
              <div class="mb10">
                <div class="reject-remarks">
                  {{ (form.operationLogForLastReject || {}).operationDescription }}
                </div>
                <div class="reject-by">
                  {{ $t('ui.rejectedBy1') }}：{{
                    (form.operationLogForLastReject || {}).operatorBy
                  }}
                  |
                  {{ parseTime((form.operationLogForLastReject || {}).operatorTime, fmtForYmdhms) }}
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="1">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.basicInfo')"
                :warning="collapseWarningForBasicInfo"
              >
                <span class="info-item mr20" :title="form.salesOrganizationName">
                  {{ $t('SALES.salesOrganization') }} : {{ form.salesOrganizationName }}
                </span>
                <span class="info-item mr20">
                  {{ $t('ui.status') }} :
                  {{ selectDictLabel(dict.type.sales_price_status, form.salesPriceStatus) }}
                </span>
                <span v-if="form.salesPriceNo" class="info-item mr20" :title="form.salesPriceNo">
                  {{ $t('SALES.rrpCode') }} : {{ form.salesPriceNo }}
                </span>
              </FormCollapseItemTitle>
              <el-form
                ref="form1"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.salesOrganization')}`"
                      prop="salesOrganizationIdList"
                    >
                      <ComparisonInput
                        v-if="isModified('salesOrganizationName')"
                        :beforeValue="getBeforeValue('salesOrganizationName')"
                        :afterValue="
                          getAfterValue('salesOrganizationName', form.salesOrganizationName)
                        "
                      />
                      <!-- <CommonSelect
                        :id="form.departmentId"
                        :label="form.departmentName"
                        :title="form.allSuperiorName"
                        idKey="departmentId"
                        labelKey="departmentName"
                        :options="deptOptions"
                        @change="departmentChange"
                      /> -->
                      <CommonMultipleSelect
                        v-else
                        :ids="form.salesOrganizationIdList"
                        :labels="form.salesOrganizationNameList"
                        idKey="id"
                        labelKey="name"
                        :options="deptOptions"
                        @change="departmentChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(dict.type.sales_price_status, form.salesPriceStatus)
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.rrpCode')}`">
                      <el-input v-model="form.salesPriceNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.createdBy')}`">
                      <el-input v-model="form.createdBy" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.createdTime')}`">
                      <el-date-picker
                        :value="form.createdTime"
                        disabled
                        type="date"
                        :format="fmtForYmdhms"
                        :style="{ width: '100%' }"
                        placeholder
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.reason')" :class="[isModified('reason')]">
                      <MyInput
                        type="textarea"
                        v-model="form.reason"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="300"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10 collapse-item-content-pt0" ref="collapseScrollPage">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :comDisFrom="comDisFrom"
                  :modifyHighlight="modifyHighlight"
                  @scrollPageToTable="scrollPageToTable"
                />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="3">
              <FormCollapseItemTitle slot="title" :title="$t('ui.systemOperationLog')">
                <template v-if="form.operationLogForLast">
                  <span
                    v-if="form.operationLogForLast.operatorBy"
                    class="info-item mr20"
                    :title="form.operationLogForLast.operatorBy"
                  >
                    {{ $t('ui.operName') }} : {{ form.operationLogForLast.operatorBy }}
                  </span>
                  <span v-if="form.operationLogForLast.operatorTime" class="info-item">
                    {{ $t('ui.operTime') }} : {{ parseTime(form.operationLogForLast.operatorTime) }}
                  </span>
                </template>
              </FormCollapseItemTitle>
              <div class="pb20">
                <SystemOperationLogTable :tableList="form.operationLogList || []" />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>

    <ApprovedDialog
      :id="form.salesPriceId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
      :formData="approvedFormData"
      formDataKey="salesPrice"
    />
    <RejectDialog
      :id="form.salesPriceId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.salesPriceId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />
    <!-- return -->
    <ReturnDialog
      :id="form.salesPriceId"
      :rj-visible="returnVisible"
      :rj-api-url="returnUrl"
      @submitSuccess="returnSubmitSuccess"
      @rjVisibleChange="returnVisibleChange"
    />

    <RevisionComparisonDlg module-key="salesPrice" ref="RevisionComparisonDlg" />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

// import { queryUserDepartment } from '@/api/system/user'

import {
  saveSalesPrice,
  saveDraftSalesPrice,
  querySalesPriceById,
  approvedSalesPrice,
  rejectedSalesPrice,
  returnSalesQuotation,
  cancelledSalesPrice,
  withdrawApproved,
  getBranchCompanyList
} from '@/api/salesManagement/salesPrice'

import ProductInfo from './productInfo/productInfo.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import ReturnDialog from './returnDialog/returnDialog.vue'

import RevisionComparisonDlg from '@/components/RevisionComparison'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import { formDirtyClass } from '@/mixins/formDirtyClass'

export default {
  mixins: [pageMixin],
  dicts: ['sales_price_status'],
  components: {
    ProductInfo,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    ReturnDialog,
    RevisionComparisonDlg,
    SystemOperationLogTable
  },
  data() {
    return {
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        departmentId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        salesOrganizationIdList: [
          {
            required: true,
            type: 'array',
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        reason: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      deptOptions: [],
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanSaveDraft: '0',
        isCanCancelled: '0',
        isCanClosed: '0',
        isCanSeeUpdateMsg: '0'
      },

      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedSalesPrice,
      rejectedUrl: rejectedSalesPrice,
      cancelledUrl: cancelledSalesPrice,
      approvedFormData: undefined,

      returnVisible: false,
      returnUrl: returnSalesQuotation,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      basicUpdateMsgList: [],
      updateMsg: {},
      isComparison: false,
      detailListCur: [],
      detailRequestId: 0,
      bpHistoryVersionList: []
    }
  },
  props: {
    propTimeId: {
      type: String,
      default: ''
    },
    propRowId: {
      type: String,
      default: ''
    },
    taskId: {
      type: String,
      default: ''
    },
    comeFrom: {
      type: [String],
      // 1:update进入，2:审批流进入
      default: '1'
    },
    dataType: {
      type: [String, Number],
      default: '1' // todo:1, history:2, 管理员todo: 3
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.rowId = this.propRowId
        if (this.rowId) {
          this.handleUpdate()
        }
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    editAuth() {
      return this.checkPermi(['salesManagement:salesPrice:edit'])
    },
    comDisFrom() {
      if (this.approvedBtnShow && this.isComparison) {
        return true
      }
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.salesPriceId &&
        [this.buttonAuthMsg.isCanUpdate, this.buttonAuthMsg.isCanSaveDraft].includes('1')
      ) {
        dis = false
      }
      return dis
    },
    isServiceOrderCreated() {
      return this.form.documentType === 'ServiceOrder'
    },
    isSelfCreated() {
      return this.form.documentType === 'SelfCreated'
    },
    isDisForm() {
      if (this.isSelfCreated) {
        return false
      }
      if (this.isServiceOrderCreated) {
        return false
      }
      return true
    },
    submitBtnShow() {
      if (this.isComparison) {
        return false
      }
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (this.form.salesPriceId && this.buttonAuthMsg.isCanUpdate === '1') {
        show = true
      }
      return show
    },
    isShowEditBtn() {
      if (!this.editAuth) {
        return false
      }
      return (
        ['1', '3'].includes(this.dataType) &&
        this.form.salesPriceId &&
        this.buttonAuthMsg.isCanUpdate === '1' &&
        this.approvedBtnShow &&
        this.isComparison
      )
    },
    saveDraftBtnShow() {
      if (this.isComparison) {
        return false
      }
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.salesPriceId &&
        this.buttonAuthMsg.isCanSaveDraft === '1'
      ) {
        show = true
      }
      return show
    },
    approvedBtnShow() {
      let show = false
      /* BPM管理员操作todo进入 不需要判断 this.buttonAuthMsg */
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.salesPriceId &&
        this.buttonAuthMsg.isCanApproved === '1'
      ) {
        show = true
      }
      return show
    },
    rejectedBtnShow() {
      let show = false
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.salesPriceId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['salesManagement:salesPrice:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.salesPriceId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['salesManagement:salesPrice:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesPriceId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },
    modifyHighlight() {
      return (
        this.approvedBtnShow && this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.isComparison
      )
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.salesPriceId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
    },
    handleUpdate() {
      this.reset()
      const requestId = ++this.detailRequestId
      const rowId = this.rowId
      this.queryUserDepartment()
      querySalesPriceById({ salesPriceId: rowId }).then((res) => {
        if (requestId !== this.detailRequestId) return
        const data = res.data || {}
        data.salesPriceProductList = data.salesPriceProductList || []
        this.form = data
        this.$set(
          this.form,
          'salesOrganizationIdList',
          String(data.salesOrganizationId || '')
            .split(',')
            .filter(Boolean)
        )
        this.$set(
          this.form,
          'salesOrganizationNameList',
          String(data.salesOrganizationName || '')
            .split(',')
            .filter(Boolean)
        )
        this.buttonAuthMsg = data.buttonAuthMsg || {}
        this.initVersionComparison(data)

        setTimeout(() => {
          if (requestId !== this.detailRequestId) return
          this.setRouteTitleView(this.comDisFrom)
        }, 0)

        setTimeout(() => {
          if (requestId !== this.detailRequestId) return
          const initFormJson = this.getFormJson()
          formDirtyClass.routeStatusData[this.$route.name] = {
            $vm: this,
            saveShow: this.saveDraftBtnShow,
            submitShow: true,
            initFormJson,
            getFormJson: this.getFormJson,
            isSaveSuccess: false,
            saveOrSubmitFn: this.handleSaveDraftNoConFirm
          }
        }, 300)
      })
    },
    initVersionComparison(data) {
      const updateMsg = data.updateMsg || {}
      const cloneList = (list) => JSON.parse(JSON.stringify(list || []))
      const onlyDeleted = (list) => cloneList(list).filter((item) => item.updateType === '3')
      let rowTimeId = Date.now()
      const setRowTimeId = (list, prefix) => {
        list.forEach((item) => {
          rowTimeId++
          item.rowTimeId =
            item.rowTimeId ||
            item.salesPriceProductId ||
            item.salesPartId ||
            `${prefix}-${rowTimeId}`
        })
        return list
      }

      this.updateMsg = updateMsg
      this.basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
      this.basicUpdateProps = this.basicUpdateMsgList.map((item) => item.name)
      this.detailListCur = setRowTimeId(cloneList(data.salesPriceProductList), 'current')
      this.isComparison = this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.approvedBtnShow
      if (this.isComparison === true) {
        setTimeout(() => {
          if (this.isComparison) {
            this.revisionComparison()
          }
        }, 300)
      }

      const comparisonDetailList = [
        ...cloneList(this.detailListCur),
        ...setRowTimeId(
          onlyDeleted(updateMsg.beforeSalesPriceProductList),
          'deleted'
        )
      ]
      this.$set(
        this.form,
        'salesPriceProductList',
        this.isComparison ? comparisonDetailList : cloneList(this.detailListCur)
      )

      if (
        this.isComparison &&
        (data.operationLogForLastReject || {}).operatorBy &&
        !this.activeNames.includes('11')
      ) {
        this.activeNames.push('11')
      }
    },
    getFormJson() {
      const param = { ...this.form }
      return JSON.stringify(param)
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    backFN() {
      formDirtyClass.showNotify(this.$route.name).then((msg) => {
        if (msg === 'save') {
          this.handleSaveDraftNoConFirm()
          return
        } else if (msg === 'stop') {
          return
        }
        this.back()
      })
    },
    reset() {
      this.form = {
        salesOrganizationId: undefined,
        salesOrganizationName: undefined,
        allSuperiorName: undefined,
        rrpCode: undefined,
        createdBy: this.$store.state.user.nickName,
        salesPriceProductList: [],
        reason: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.activeNames = ['1', '2', '3', '4']
      this.buttonAuthMsg = {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanSaveDraft: '0',
        isCanCancelled: '0',
        isCanClosed: '0',
        isCanSeeUpdateMsg: '0'
      }
      this.basicUpdateProps = []
      this.basicUpdateMsgList = []
      this.updateMsg = {}
      this.isComparison = false
      this.detailListCur = []
      this.bpHistoryVersionList = []
      this.resetForm('form1')
    },

    queryUserDepartment() {
      getBranchCompanyList({}).then((res) => {
        this.deptOptions = res.data || []
        /* this.deptOptions.forEach((item) => {
          if (item.isDefault === '1') {
            this.$set(this.form, 'departmentId', item.departmentId)
            this.$set(this.form, 'departmentName', item.departmentName)
            this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
          }
        }) */
      })
    },
    // departmentChange(item) {
    //   this.$set(this.form, 'salesOrganizationId', item.departmentId)
    //   this.$set(this.form, 'salesOrganizationName', item.departmentName)
    //   this.$set(this.form, 'departmentId', item.departmentId)
    //   this.$set(this.form, 'departmentName', item.departmentName)
    //   this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
    // },
    departmentChange(ids, labels) {
      // this.$set(this.form, 'departmentIdList', ids)
      // this.$set(this.form, 'departmentNameList', labels)
      this.$set(this.form, 'salesOrganizationIdList', ids)
      this.$set(this.form, 'salesOrganizationNameList', labels)
      this.$set(this.form, 'salesOrganizationName', labels.join(','))
    },
    // 滚动页面到表格的可视区域
    scrollPageToTable() {
      try {
        if (!this.$refs.collapseScrollPage) return
        const offsetTop = this.$refs.collapseScrollPage.offsetTop
        if (!this.$refs.FormPageLayoutRef) return
        const pageContent = this.$refs.FormPageLayoutRef.$refs.pageContent
        if (pageContent) {
          pageContent.scrollTo({
            top: offsetTop - 50, // pageContent 没有使用定位
            behavior: 'smooth' // 平滑滚动
          })
        }
      } catch (err) {}
    },
    async submitForm(submitType, isConfirm = true, gotoRoute) {
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }

      if (valid1) {
        let param = { ...this.form }
        const tableList = this.$refs.ProductInfo.tableList || []
        const validProject = this.validConsignmentList(tableList)
        if (!validProject) {
          this.collapseWarningForProductInfo = true
          return
        }
        this.collapseWarningForProductInfo = false
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.salesPriceProductList = tableList
        param.salesOrganizationId = param.salesOrganizationIdList.join(',')
        param.salesOrganizationName = param.salesOrganizationNameList.join(',')
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'approvedAndSubmit') {
          // 审批流带提交功能
          this.approvedFormData = param
          this.aplVisible = true
        } else if (submitType === 'save') {
          confirmMsg = this.$t('SALES.RRPSaveConfirm')
          successMsg = this.$t('SALES.RRPSaveSuccess')
          submitFn = saveDraftSalesPrice
          if (isConfirm) {
            this.$modal
              .confirm(confirmMsg)
              .then(() => {
                this.submitLoading = true
                return submitFn(param)
              })
              .then((response) => {
                this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
                this.submitLoading = false
                this.back()
              })
              .catch(() => {
                this.submitLoading = false
              })
          } else {
            this.submitLoading = true
            submitFn(param)
              .then((response) => {
                const pageItem = formDirtyClass.routeStatusData[this.$route.name]
                if (pageItem) {
                  pageItem.isSaveSuccess = true
                }

                this.$modal.msgSuccess(successMsg.replace('$1', response.msg))

                setTimeout(() => {
                  this.submitLoading = false
                }, 1000)
                if (gotoRoute && gotoRoute.name !== this.$route.name) {
                  this.$store.dispatch('tagsView/delView', this.$route)
                  this.$router.push(gotoRoute).catch(() => {})
                } else {
                  this.back()
                }
              })
              .catch(() => {
                this.submitLoading = false
              })
          }
        } else {
          confirmMsg = this.$t('SALES.RRPSubmitConfirm')
          successMsg = this.$t('SALES.RRPSubmitSuccess')
          submitFn = saveSalesPrice
          this.$modal
            .confirm(confirmMsg)
            .then(() => {
              this.submitLoading = true
              return submitFn(param)
            })
            .then((response) => {
              this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
              this.submitLoading = false
              this.back()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      }
    },
    validConsignmentList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const pricingUom = detailList.find((item) => {
        return !this.$resultOfBoolean(item.pricingUom)
      })
      if (pricingUom) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.pricingUnit')))
        return valid
      }
      const salesPrice = detailList.find((item) => {
        return !this.$resultOfBoolean(item.salesRetailPrice)
      })
      if (salesPrice) {
        this.$refs.ProductInfo.errorMessage('salesRetailPrice')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesPrice')))
        return valid
      }

      return true
    },
    handleSaveDraft(isConfirm = true, gotoRoute) {
      this.submitForm('save', isConfirm, gotoRoute)
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      this.handleSaveDraft(false, gotoRoute)
    },
    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.form.salesPriceId)
    },
    getBeforeValue(prop) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop) || {}
      return item.beforeValue
    },
    getAfterValue(prop, fallback) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop)
      return item && item.afterValue !== undefined ? item.afterValue : fallback
    },
    exitComparison() {
      const detailList = JSON.parse(JSON.stringify(this.detailListCur || []))
      this.isComparison = false
      this.$set(this.form, 'salesPriceProductList', detailList)
      this.$nextTick(() => {
        this.$refs.ProductInfo && this.$refs.ProductInfo.changeTableList()
        const pageItem = formDirtyClass.routeStatusData[this.$route.name]
        if (pageItem) {
          pageItem.saveShow = this.saveDraftBtnShow
          pageItem.initFormJson = this.getFormJson()
        }
      })
    },
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    },
    dropdownVisibleChange() {
      /* 下拉菜单关闭后滚动条 手动还原 */
      if (this.$refs.scrollbar) {
        this.$refs.scrollbar.moveY = 0
      }
    },
    dropdownVisibleChange2() {
      /* 下拉菜单关闭后滚动条 手动还原 */
      if (this.$refs.scrollbar2) {
        this.$refs.scrollbar2.moveY = 0
      }
    },
    /* 审批 */
    handleApproved() {
      if (!this.submitBtnShow) {
        this.approvedFormData = undefined
        this.aplVisible = true
      } else {
        this.submitForm('approvedAndSubmit')
      }
    },
    aplVisibleChange(data) {
      this.aplVisible = data || false
    },
    aplSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.approvedSuccess')}`.replace(
          '$1',
          `${this.$t('SALES.rrpCode')} [${vm.form.salesPriceNo}]`
        )
      )
      this.aplVisible = false
      vm.back('onApprovedSuccess')
    },
    handleRejected() {
      this.rjVisible = true
    },
    rjVisibleChange(data) {
      this.rjVisible = data || false
    },
    rjSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.rejectedSuccess')}`.replace(
          '$1',
          `${this.$t('SALES.rrpCode')} [${vm.form.salesPriceNo}]`
        )
      )
      this.rjVisible = false
      vm.back('onRejectedSuccess')
    },
    handleReturn() {
      this.returnVisible = true
    },
    returnVisibleChange(data) {
      this.returnVisible = data || false
    },
    returnSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.returnedSuccess')}`.replace(
          '$1',
          `${vm.$t('SALES.rrpCode')} [${vm.form.salesPriceNo}]`
        )
      )
      vm.returnVisible = false
      vm.back('onApprovedSuccess')
    },

    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.cancelledSuccess')}`.replace(
          '$1',
          `${this.$t('SALES.rrpCode')} [${vm.form.salesPriceNo}]`
        )
      )
      vm.back('onCancelSuccess')
    }
  }
}
</script>
<style lang="scss">
.collapse-item-content-pt0 {
  .el-collapse-item__content {
    padding-top: 10px;
  }
}
</style>
<style lang="scss" scoped>
.exportHistoryPDF {
  position: absolute;
  right: 20px;
}

.legend-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;

  .legend-text {
    color: #606266;
  }
  .legend-divider {
    width: 1px;
    height: 14px;
    background: #e0e0e0;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .color-block {
    width: 16px;
    height: 16px;
    border: 1px solid #c0c4cc;
    border-radius: 3px;

    &.add {
      background-color: #d2e3fc;
      border-color: #1a73e8;
    }
    &.edit {
      background-color: #f0f7ff;
      border-color: #c2d7fb;
    }
    &.del {
      background-color: #f5f5f4;
      border-color: #78716c;
    }
  }
}
.reject-remarks {
  color: #444;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}
.reject-by {
  margin-top: 4px;
  color: #999;
  font-size: 11px;
}
.reject-card {
  border-left: 3px solid #f56c6c;
}
.reject-card ::v-deep .el-collapse-item__header,
.reject-card ::v-deep .el-collapse-item__wrap {
  background-color: #fff7f7;
}
</style>
