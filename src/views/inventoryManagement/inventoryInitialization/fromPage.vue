<template>
  <FormPageLayoutTabs v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" v-if="saveDraftBtnShow" size="mini" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="closeBtnShow" @click="closeForm"
        >{{ $t('uiBtn.close') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="approvedBtnShow" @click="handleApproved"
        >{{ $t('uiBtn.approve') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="rejectedBtnShow" @click="handleRejected"
        >{{ $t('uiBtn.reject1') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="buttonAuthMsg.isCanSeeUpdateMsg === '1'"
        @click="revisionComparison"
        >{{ $t('uiBtn.revisionComparison') }}</el-button
      >
      <el-button type="primary" size="mini" v-if="isShowEditBtn" @click="exitComparison">
        {{ $t('uiBtn.edit') }}
      </el-button>
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">
        {{ $t('menu.inventoryInitialization') }}
      </div>
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
            <span class="legend-item">
              <span class="color-block edit"></span>{{ $t('ui.modified') }}
            </span>
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
                    <el-form-item :label="`${$t('INVENTORY.warehouseName')}`" prop="warehouseName">
                      <!-- <SelectInput
                        clearable
                        :value="form.warehouseName"
                        :title="form.warehouseName"
                        @click="openWarehouseTable"
                        @clear="warehouseClear"
                        :disabled="!!rowId"
                      /> -->

                      <CommonSelectAndList
                        :id="form.warehouseId"
                        :label="form.warehouseName"
                        idKey="warehouseId"
                        labelKey="warehouseName"
                        filterable
                        :options="warehouseList"
                        :loading="warehouseListLoading"
                        :disabled="!!rowId"
                        @change="updateWarehouse"
                        @handleOpen="openWarehouseTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.inventoryInitializationNo')}`">
                      <el-input
                        :value="form.inventoryInitializationNo"
                        :title="form.inventoryInitializationNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.inventory_initialization_status,
                            form.inventoryInitializationStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="false">
                    <el-form-item :label="`${$t('INVENTORY.operator')}`" prop="operatorBy">
                      <SelectInput
                        :value="form.operatorBy"
                        :title="form.operatorBy"
                        @clear="purchasePersonClear"
                        :disabled="comDisFrom"
                        clearable
                        @click="openPurchasePersonTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`">
                      <el-input
                        :value="form.currency || legalEntityInfo.currency"
                        :title="form.currency || legalEntityInfo.currency"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('INVENTORY.reason')" prop="reason">
                      <MyInput
                        type="textarea"
                        v-model="form.reason"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="200"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row> -->
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('INVENTORY.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <productInfo
                  :formData="form"
                  :comDisFrom="comDisFrom"
                  :modifyHighlight="modifyHighlight"
                  ref="productInfo"
                />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10" v-if="rowId">
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

    <!-- 仓库 -->
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
    <!-- 操作人 -->
    <selectPurchasePersonTable ref="selectPurchasePersonTable" @update="updatePurchasePerson" />
    <!-- 关闭 -->
    <closeDialog ref="closeDialog" @onSuccess="back" />

    <ApprovedDialog
      :id="form.inventoryInitializationId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.inventoryInitializationId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.inventoryInitializationId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />
    <RevisionComparisonDlg module-key="inventoryInitialization" ref="RevisionComparisonDlg" />
  </FormPageLayoutTabs>
</template>

<script>
import RevisionComparisonDlg from '@/components/RevisionComparison'
import {
  saveInventoryInitialization,
  saveDraftInventoryInitialization,
  queryInventoryInitializationById,
  approvedInventoryInitialization,
  rejectedInventoryInitialization,
  cancelledInventoryInitialization,
  withdrawApproved
} from '@/api/inventoryManagement/inventoryInitialization'
import { queryCanSelectWarehouseListHaveDataPermissions } from '@/api/salesManagement/salesInquiry'

import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import locale from '@/views/inventoryManagement/lang/index'
import locale1 from '@/views/productManagement/lang/index'
import locale2 from '@/views/purchaseManagement/lang/index'

import selectWarehouseTable from './components/selectWarehouseTable.vue'
import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'
import productInfo from './components/productInfo.vue'
import closeDialog from './components/closeDialog.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import { formDirtyClass } from '@/mixins/formDirtyClass'

export default {
  dicts: ['inventory_initialization_status'],
  mixins: [pageMixin],
  components: {
    RevisionComparisonDlg,
    FormPageLayoutTabs,
    SystemOperationLogTable,
    selectWarehouseTable,
    selectPurchasePersonTable,
    productInfo,
    closeDialog,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog
  },
  data() {
    return {
      warehouseList: [],
      warehouseListLoading: false,
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        warehouseName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        operatorBy: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        reason: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ]
      },
      buttonAuthMsg: {},
      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedInventoryInitialization,
      rejectedUrl: rejectedInventoryInitialization,
      cancelledUrl: cancelledInventoryInitialization,

      /* 版本比对高亮 */
      isComparison: false,
      productListCur: []
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
        } else {
          this.handleAdd()
        }
      }
    }
  },
  computed: {
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
      // currency: row.currency,
      // currencyId: row.currencyId,
      // currencyCode: row.currencyCode,
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    editAuth() {
      return this.checkPermi(['inventoryManagement:inventoryInitialization:edit'])
    },
    comDisFrom() {
      if (this.approvedBtnShow && this.isComparison) {
        return true
      }
      if (!this.rowId) {
        return !this.checkPermi(['inventoryManagement:inventoryInitialization:add'])
      }

      let dis = true
      if (!this.editAuth) {
        return true
      }

      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.inventoryInitializationId &&
        this.buttonAuthMsg.isCanUpdate === '1'
      ) {
        dis = false
      }
      return dis
    },
    isShowEditBtn() {
      if (!this.editAuth) {
        return false
      }
      return (
        ['1', '3'].includes(this.dataType) &&
        this.form.inventoryInitializationId &&
        this.buttonAuthMsg.isCanUpdate === '1' &&
        this.approvedBtnShow &&
        this.isComparison
      )
    },
    saveDraftBtnShow() {
      if (!this.rowId) {
        return this.checkPermi(['inventoryManagement:inventoryInitialization:add'])
      }
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.inventoryInitializationId &&
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
        this.form.inventoryInitializationId &&
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
        this.form.inventoryInitializationId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['inventoryManagement:inventoryInitialization:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.inventoryInitializationId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['inventoryManagement:inventoryInitialization:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.inventoryInitializationId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },
    closeBtnShow() {
      if (!this.checkPermi(['inventoryManagement:inventoryInitialization:close'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.inventoryInitializationId &&
        this.buttonAuthMsg.isCanClosed === '1'
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
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
    this.$i18n.mergeLocaleMessage('zh', locale2.zh)
    this.$i18n.mergeLocaleMessage('en', locale2.en)
  },
  methods: {
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.form.inventoryInitializationId)
    },
    queryCanSelectWarehouseListHaveDataPermissions() {
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      param.warehouseType = '1'
      this.$trimOfObj(param)
      param.menuPerms = this.menuKey.inventoryInitialization
      this.warehouseListLoading = true
      queryCanSelectWarehouseListHaveDataPermissions(param)
        .then((response) => {
          const rows = response.rows || []
          this.warehouseList = rows
          this.warehouseListLoading = false
        })
        .catch((err) => {
          this.warehouseListLoading = false
          window.console.error(err)
        })
    },
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.inventoryInitializationId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
    },
    handleAdd() {
      this.reset()
      this.queryCanSelectWarehouseListHaveDataPermissions()
      setTimeout(() => {
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
    },
    handleUpdate() {
      this.reset()
      this.getById()
    },
    getById() {
      queryInventoryInitializationById({
        inventoryInitializationId: this.rowId
      }).then((res) => {
        const data = res.data || {}
        data.inventoryInitializationProductList = data.inventoryInitializationProductList || []
        this.form = data
        this.buttonAuthMsg = data.buttonAuthMsg || {}
        this.initVersionComparison(data, data.inventoryInitializationProductList)

        setTimeout(() => {
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
    initVersionComparison(data, currentProductList) {
      const updateMsg = data.updateMsg || {}
      const cloneList = (list) => JSON.parse(JSON.stringify(list || []))
      const deletedProductList = cloneList(
        updateMsg.beforeInventoryInitializationProductList
      ).filter((item) => item.updateType === '3')

      this.productListCur = cloneList(currentProductList)
      this.isComparison = this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.approvedBtnShow
      if (this.isComparison === true) {
        setTimeout(() => {
          if (this.isComparison) {
            this.revisionComparison()
          }
        }, 300)
      }

      const comparisonProductList = [...cloneList(currentProductList), ...deletedProductList]
      this.$set(
        this.form,
        'inventoryInitializationProductList',
        this.isComparison ? comparisonProductList : cloneList(currentProductList)
      )
    },
    getFormJson() {
      const param = { ...this.form }
      return JSON.stringify(param)
    },
    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId, warehouseCode } = row
      // const warehouseAddress = row.warehouseAddress || {}
      // const rowData = { ...row, ...warehouseAddress }
      // this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'warehouseName', warehouseName)
      this.$set(this.form, 'warehouseId', warehouseId)
      this.$set(this.form, 'warehouseCode', warehouseCode)
      this.$set(this.form, 'inventoryInitializationProductList', [])
    },
    warehouseClear() {
      // this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseId', undefined)
      this.$set(this.form, 'warehouseCode', undefined)
      this.$set(this.form, 'inventoryInitializationProductList', [])
    },
    openPurchasePersonTable() {
      this.$refs.selectPurchasePersonTable.handleOpen()
    },
    purchasePersonClear() {
      this.$set(this.form, 'operatorBy', undefined)
      this.$set(this.form, 'operatorId', undefined)
    },
    updatePurchasePerson(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'operatorBy', nickName)
      this.$set(this.form, 'operatorId', userId)
    },
    // 表单重置
    reset() {
      this.form = {
        inventoryInitializationProductList: []
      }
      this.buttonAuthMsg = {}
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.activeNames = ['1', '2', '3', '11']
      this.resetForm('form1')
      this.isComparison = false
      this.productListCur = []
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
    /* 审批 */
    handleApproved() {
      this.aplVisible = true
    },
    aplVisibleChange(data) {
      this.aplVisible = data || false
    },
    aplSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.approvedSuccess')}`.replace(
          '$1',
          `${this.$t('menu.inventoryInitialization')} [${vm.form.inventoryInitializationNo}]`
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
          `${this.$t('menu.inventoryInitialization')} [${vm.form.inventoryInitializationNo}]`
        )
      )
      this.rjVisible = false
      vm.back('onRejectedSuccess')
    },
    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.cancelledSuccess')}`.replace(
          '$1',
          `${this.$t('menu.inventoryInitialization')} [${vm.form.inventoryInitializationNo}]`
        )
      )
      vm.back('onCancelSuccess')
    },

    closeForm() {
      this.$refs.closeDialog.handleOpen(this.form)
    },
    async submitForm(submitType, isConfirm = true, gotoRoute) {
      // getCheckedNodes(leafOnly) 是否只是叶子节点，默认值为 false
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      if (valid1) {
        if (submitType !== 'save') {
          if (this.form.inventoryInitializationProductList.length <= 0) {
            this.$modal.msgError(this.$t('INVENTORY.productTableEmpty'))
            this.collapseWarningForProductInfo = true
            return
          }
          if (this.form.inventoryInitializationProductList.find((item) => !item.unitPrice)) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('INVENTORY.purchasePrice'))
            )
            this.collapseWarningForProductInfo = true
            return
          }
        }

        this.collapseWarningForProductInfo = false
        let param = { ...this.form }
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        if (!param.currency) {
          param.currency = this.legalEntityInfo.currency
          param.currencyId = this.legalEntityInfo.currencyId
          param.currencyCode = this.legalEntityInfo.currencyCode
        }

        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('INVENTORY.inventoryInitializationSaveConfirm')
          successMsg = this.$t('INVENTORY.inventoryInitializationSaveSuccess')
          submitFn = saveDraftInventoryInitialization
        } else {
          confirmMsg = this.$t('INVENTORY.inventoryInitializationConfirm')
          successMsg = this.$t('INVENTORY.inventoryInitializationSuccess')
          submitFn = saveInventoryInitialization
        }
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
      }
    },
    handleSaveDraft() {
      this.submitForm('save')
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      this.submitForm('save', false, gotoRoute)
    },
    exitComparison() {
      this.isComparison = false
      this.$set(
        this.form,
        'inventoryInitializationProductList',
        JSON.parse(JSON.stringify(this.productListCur))
      )
    }
  }
}
</script>
<style lang="scss">
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
  border: 1px solid #e2e8f0;
}
.reject-card ::v-deep .el-collapse-item__header,
.reject-card ::v-deep .el-collapse-item__wrap {
  background-color: #f8fafc;
}
.reject-card ::v-deep .el-collapse-item__header {
  border-bottom: 1px solid #e2e8f0;
}
</style>
