<template>
  <FormPageLayoutTabs>
    <template v-slot:btn>
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
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :disabled="btnDisabled"
        v-if="saveDraftBtnShow"
        @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="buttonAuthMsg.isCanSeeUpdateMsg === '1'"
        @click="revisionComparison"
        >{{ $t('uiBtn.revisionComparison') }}</el-button
      >
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">{{ $t('menu.materialList') }}</div>
    </template>
    <template v-slot:tabs>
      <el-tabs v-model="activeName" size="mini" type="card">
        <el-tab-pane :label="$t('menu.customerQuestionnaire')" name="0"></el-tab-pane>
        <el-tab-pane :label="$t('menu.materialList')" name="1"></el-tab-pane>
      </el-tabs>
    </template>
    <template v-slot:content>
      <div v-show="activeName === '0'">
        <div class="form-card" style="padding: 20px">
          <paper ref="paper" :isDisabled="true" />
        </div>
      </div>
      <div v-show="activeName === '1'">
        <el-collapse v-model="activeNames">
          <!-- 基本信息 -->
          <div class="form-card">
            <el-collapse-item name="1">
              <FormCollapseItemTitle slot="title" :title="$t('ui.basicInfo')">
              </FormCollapseItemTitle>

              <el-form ref="form" :model="form" @submit.native.prevent label-width="160px" disabled>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.materialListNo')}`" prop="materialListNo">
                      <el-input v-model="form.materialListNo" :title="form.materialListNo" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`" prop="status">
                      <el-input
                        :value="
                          selectDictLabel(dict.type.project_cost_status, form.materialListStatus)
                        "
                        :title="
                          selectDictLabel(dict.type.project_cost_status, form.materialListStatus)
                        "
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.salesInquiryNo')}`" prop="salesInquiryNo">
                      <el-input v-model="form.salesInquiryNo" :title="form.salesInquiryNo" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.customer')}`" prop="customerName">
                      <el-input v-model="form.customerName" :title="form.customerName" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.country')}`" prop="country">
                      <el-input v-model="form.country" :title="form.country" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.salesPerson')}`" prop="salesPersonBy">
                      <el-input v-model="form.salesPersonBy" :title="form.salesPersonBy" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <!-- 产品信息 -->
          <div class="form-card mt10">
            <el-collapse-item name="2">
              <FormCollapseItemTitle slot="title" :title="$t('PURCHASE.productInfo')">
              </FormCollapseItemTitle>
              <div class="pb20">
                <productInfo ref="productInfo" />
              </div>
            </el-collapse-item>
          </div>

          <!-- 项目任务 -->
          <div class="form-card mt10">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('menu.materialList')"
                :warning="collapseWarningMaterialList"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <materialList
                  ref="materialList"
                  :isView="isView"
                  :modifyHighlight="modifyHighlight"
                />
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="4">
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
                    {{ $t('ui.operTime') }} :
                    {{ parseTime(form.operationLogForLast.operatorTime) }}
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
      :id="form.materialListId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />

    <RejectDialog
      :id="form.materialListId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />

    <RevisionComparisonDlg ref="RevisionComparisonDlg" />
  </FormPageLayoutTabs>
</template>

<script>
import {
  queryMaterialListById,
  saveDraftMaterialList,
  saveMaterialList,
  approvedMaterialList,
  rejectedMaterialList,
  withdrawApproved
} from '@/api/projectManagement/materialList'
import { queryCustomerQuestionnaireById } from '@/api/salesManagement/customerQuestionnaire'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import locale1 from '@/views/productManagement/lang/index'
import productInfo from './components/productInfo.vue'
import materialList from './components/materialList.vue'
import paper from '@/views/salesManagement/questionnaireTemplate/components/paper.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import RevisionComparisonDlg from './revisionComparisonDlg.vue'

export default {
  dicts: ['project_cost_status'],
  name: 'MaterialList',
  mixins: [pageMixin],
  components: {
    productInfo,
    paper,
    materialList,
    SystemOperationLogTable,
    ApprovedDialog,
    RejectDialog,
    RevisionComparisonDlg
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
    dataType: {
      type: [String, Number],
      default: '1'
    },
    comeFrom: {
      type: [String],
      // 1:update进入，2:审批流进入
      default: '1'
    },
    taskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      rowId: '',
      timeId: '',
      form: {},
      activeName: '1',
      aplVisible: false,
      approvedUrl: approvedMaterialList,
      rjVisible: false,
      rejectedUrl: rejectedMaterialList,
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0'
      },
      collapseWarningMaterialList: false,
      corporateLegalEntity: {},
      btnDisabled: false
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['projectManagement:materialList:edit'])
    },
    comDisFrom() {
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (['1', '3'].includes(this.dataType) && this.buttonAuthMsg.isCanUpdate === '1') {
        dis = false
      }
      return dis
    },
    saveDraftBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (['1', '3'].includes(this.dataType) && this.buttonAuthMsg.isCanSaveDraft === '1') {
        show = true
      }
      return show
    },
    approvedBtnShow() {
      let show = false
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      }
      if (this.buttonAuthMsg.isCanApproved === '1') {
        show = true
      }
      return show
    },
    rejectedBtnShow() {
      let show = false
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      }
      if (this.buttonAuthMsg.isCanRejected === '1') {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['projectManagement:materialList:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.materialListId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    modifyHighlight() {
      if (this.approvedBtnShow) {
        return true
      }
      return false
    },
    isView() {
      if (!this.editAuth) {
        return true
      }
      if (this.form.materialListStatus !== '1') {
        return true
      }
      return false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {
    this.rowId = this.$route.query.id
    this.timeId = this.$route.query.timeId
    this.handleUpdate()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.rowId = this.$route.query.id
      this.handleUpdate()
    }
  },

  methods: {
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.materialListId,
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
      queryMaterialListById({ materialListId: this.rowId }).then((res) => {
        console.log(res)
        const {
          buttonAuthMsg,
          salesInquiryProjects,
          materialListDetailList,
          corporateLegalEntity,
          ...params
        } = res.data
        this.form = params
        this.corporateLegalEntity = corporateLegalEntity || {}
        this.buttonAuthMsg = buttonAuthMsg || {}
        this.$nextTick(() => {
          this.$refs.productInfo && this.$refs.productInfo.init(salesInquiryProjects)
          this.$refs.materialList && this.$refs.materialList.init(materialListDetailList)
        })
        this.queryCustomerQuestionnaireById()

        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },
    queryCustomerQuestionnaireById() {
      queryCustomerQuestionnaireById({ customerQuestionnaireId: this.form.customerQuestionnaireId })
        .then((res) => {
          this.handlePaperData(res.data)
        })
        .catch(() => {})
    },
    handlePaperData(form = {}) {
      const { categoryList } = form
      categoryList.forEach((x) => {
        x.questionsList &&
          x.questionsList.forEach((k) => {
            this.$set(k, 'customResult', k.explanationAnswer || undefined)
            if (k.answersCategory === '1') {
              this.$set(k, 'customResult', k.explanationAnswer || undefined)
            } else if (k.answersCategory === '2') {
              const arr = k.optionList.filter((x) => x.isSelect === '1')
              if (arr && arr.length > 0) {
                this.$set(k, 'customResult', arr[0].optionName)
              } else {
                this.$set(k, 'customResult', undefined)
              }
            } else if (k.answersCategory === '3') {
              const arr = k.optionList.filter((x) => x.isSelect === '1')
              if (arr && arr.length > 0) {
                this.$set(
                  k,
                  'customResult',
                  arr.map((k) => k.optionName)
                )
              } else {
                this.$set(k, 'customResult', [])
              }
            } else if (k.answersCategory === '4') {
              this.$set(k, 'customResult', k.fixedTime || undefined)
            } else if (k.answersCategory === '5') {
              if (k.startTime && k.endTime) {
                this.$set(k, 'customResult', [k.startTime, k.endTime - 86399000] || undefined)
              } else {
                this.$set(k, 'customResult', undefined)
              }
            }
          })
      })
      this.$nextTick(() => {
        this.$refs.paper.init(categoryList)
      })
    },
    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.rowId)
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    /* 表单部分 */
    // 表单重置
    reset() {
      this.form = {
        materialListNo: '',
        materialListStatus: '',
        salesInquiryNo: '',
        customerName: '',
        country: '',
        salesPersonBy: ''
      }
      this.activeNames = ['1', '2', '3', '4']
    },
    materialListValidate() {
      const tableList = this.$refs.materialList.tableList
      let flag = true
      if (tableList.length <= 0) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('menu.materialList'))
        )
        flag = false
        return
      } else {
        const materialUom = tableList.find((x) => !x.materialUom)
        if (materialUom) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.materialUom'))
          )
          flag = false
          return
        }
        const requiredQty = tableList.find((x) => !x.requiredQty)
        if (requiredQty) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.requiredQty'))
          )
          flag = false
          return
        }
        // const estimatedLoss = tableList.find((x) => !x.estimatedLoss)
        // if (estimatedLoss) {
        //   this.$modal.msgError(
        //     this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.estimatedLoss'))
        //   )
        //   flag = false
        //   return
        // }
      }
      return flag
    },
    handleSaveDraft() {
      const flag = this.materialListValidate()
      this.collapseWarningMaterialList = !flag
      if (!flag) return
      const tableList = this.$refs.materialList.tableList
      this.collapseWarningMaterialList = false
      const params = {
        materialListId: this.rowId,
        modifiedTime: this.form.modifiedTime
      }
      params.materialListDetailList = tableList
      this.btnDisabled = true
      saveDraftMaterialList(params)
        .then((res) => {
          this.back()
          setTimeout(() => {
            this.btnDisabled = false
          }, 500)
        })
        .catch(() => {
          this.btnDisabled = false
        })
    },
    submitForm() {
      const flag = this.materialListValidate()
      this.collapseWarningMaterialList = !flag
      if (!flag) return
      const tableList = this.$refs.materialList.tableList
      this.collapseWarningMaterialList = false
      this.$modal
        .confirm(this.$t('PRODUCT.materialListSubmitConfirm'))
        .then(() => {
          const params = {
            materialListId: this.rowId,
            modifiedTime: this.form.modifiedTime
          }
          params.materialListDetailList = tableList
          return saveMaterialList(params)
        })
        .then((response) => {
          this.$modal.msgSuccess(
            this.$t('PRODUCT.materialListSubmitSuccess').replace('$1', this.form.materialListNo)
          )
          this.back()
        })
        .catch(() => {})
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
        `${vm.$t('PRODUCT.materialListApprovedSuccess')}`.replace('$1', vm.form.materialListNo)
      )
      this.aplVisible = false
      vm.back()
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
        `${vm.$t('PRODUCT.materialListRejectedSuccess')}`.replace('$1', vm.form.materialListNo)
      )
      this.rjVisible = false
      vm.back()
    }
  }
}
</script>
<style lang="scss" scoped></style>
