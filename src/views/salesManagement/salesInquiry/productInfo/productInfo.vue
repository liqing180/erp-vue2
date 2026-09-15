<template>
  <div class="pb20">
    <el-row :key="salesInquiryType">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <template v-for="item in comTabs">
          <el-tab-pane :name="item.key" :key="item.key" :disabled="item.disabled">
            <span slot="label">
              <span>{{ item.label }}</span>
              <span v-if="item.key === 'productDetail' || item.key === 'Consignment'" class="ml5">
                <span v-if="formData.salesInquiryProductList.length"
                  >({{ formData.salesInquiryProductList.length }})</span
                >
              </span>
              <span v-if="item.key === 'projectTask'" class="ml5">
                <span v-if="formData.salesInquiryServiceList.length"
                  >({{ formData.salesInquiryServiceList.length }})</span
                >
              </span>
              <span v-if="item.key === 'ServiceTypeProduct'" class="ml5">
                <span v-if="formData.productOrServiceList.length"
                  >({{ formData.productOrServiceList.length }})</span
                >
              </span>

              <span v-if="item.key === 'project'" class="ml5">
                <span v-if="formData.salesInquiryProjectList.length"
                  >({{ formData.salesInquiryProjectList.length }})</span
                >
              </span>
              <span v-if="item.key === 'projectCost'" class="ml5">
                <span v-if="formData.projectCostDetailList.length"
                  >({{ formData.projectCostDetailList.length }})</span
                >
              </span>
            </span>
          </el-tab-pane>
        </template>

        <el-tab-pane name="attachment">
          <span slot="label">
            <span>{{ $t('SALES.attachmentInfo') }}</span>
            <span v-show="curFileList.length" class="ml5">({{ curFileList.length }})</span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <div v-show="activeName === 'project'">
      <ProjectTable
        ref="project"
        :formData="formData"
        :productList="projectList"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        @deliveryDateForDayChange="$emit('deliveryDateForDayChange')"
      />
    </div>

    <div v-show="activeName === 'projectProductDetail'">
      <projectProductDetail
        ref="projectProductDetail"
        :formData="formData"
        :productList="projectList"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        @deliveryDateForDayChange="$emit('deliveryDateForDayChange')"
        @updatePriceControlNotice="updatePriceControlNotice"
      />
    </div>
    <div v-show="activeName === 'projectCostDetails'">
      <projectCostDetails
        ref="projectCostDetails"
        :formData="formData"
        :productList="projectList"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        @deliveryDateForDayChange="$emit('deliveryDateForDayChange')"
        @updatePriceControlNotice="updatePriceControlNotice"
      />
    </div>

    <div v-if="activeName === 'productDetail'" key="productDetail">
      <TradingProductTable
        ref="productDetail"
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        @handleReturn="handleReturn"
        @deliveryDateForDayChange="$emit('deliveryDateForDayChange')"
        @handleCalculate="handleCalculate"
        @updatePriceControlNotice="updatePriceControlNotice"
      />
    </div>
    <div v-if="activeName === 'Consignment'" key="ConsignmentProduct">
      <ConsignmentProductTable
        ref="Consignment"
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        @deliveryDateForDayChange="$emit('deliveryDateForDayChange')"
        @updatePriceControlNotice="updatePriceControlNotice"
        @handleCalculate="handleCalculate"
      />
    </div>

    <div v-show="activeName === 'projectTask'">
      <ServiceProductTable
        ref="projectTask"
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        @handleReturn="handleReturn"
        @deliveryDateForDayChange="$emit('deliveryDateForDayChange')"
        @handleCalculate="handleCalculate"
        @updatePriceControlNotice="updatePriceControlNotice"
      />
    </div>

    <div v-if="activeName === 'ServiceTypeProduct'" key="ServiceTypeProduct">
      <ServiceTypeProductTable
        ref="ServiceTypeProduct"
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        @handleReturn="handleReturn"
        @deliveryDateForDayChange="$emit('deliveryDateForDayChange')"
        @handleCalculate="handleCalculate"
        @updatePriceControlNotice="updatePriceControlNotice"
      />
    </div>

    <div v-show="activeName === 'projectCost'">
      <ProjectCostTable
        ref="projectCost"
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        @handleReturn="handleReturn"
        @deliveryDateForDayChange="$emit('deliveryDateForDayChange')"
        @updatePriceControlNotice="updatePriceControlNotice"
      />
    </div>
    <div v-show="activeName === 'customerQuestionnaire'">
      <div v-if="formData.customerQuestionnaireId">
        <paper ref="paper" :isDisabled="true" />
      </div>
      <div v-else class="noAttachment">{{ $t('ui.noData') }}</div>
    </div>

    <div v-show="!['attachment', 'customerQuestionnaire'].includes(activeName)">
      <el-form ref="totalForm" class="mt20" :model="totalForm" :rules="{}" label-width="140px">
        <div class="flex">
          <div class="flex-1">
            <el-form-item
              :label="`${$t('ui.remarks')}`"
              prop="totalRemarks"
              :class="[isModified('totalRemarks')]"
            >
              <MyInput
                v-model="totalForm.totalRemarks"
                :maxlength="3000"
                type="textarea"
                :autosize="{ minRows: 10, maxRows: 10 }"
                :disabled="comDisFrom"
                show-word-limit
                resize="none"
              >
              </MyInput>
            </el-form-item>
          </div>
          <div style="width: 40%; max-width: 600px; margin-right: 0px">
            <el-form-item :label="`${$t('SALES.subTotal')}`" prop="subTotal">
              <ComparisonInput
                v-if="isModified('subTotal')"
                :beforeValue="$numberStr(getBeforeValue('subTotal'), 2)"
                :afterValue="$numberStr(totalForm.subTotal, 2)"
              />
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                v-else-if="!comDisFrom && formData.priceTbd === '1'"
                style="width: 100%"
                v-model="totalForm.subTotal"
                controls-position="right"
                :precision="2"
                :min="0"
                :max="999999999999.99"
                @change="subTotalChange"
              />
              <el-input v-else :value="$numberStr(totalForm.subTotal, 2)" disabled></el-input>
            </el-form-item>
            <el-form-item
              v-if="salesInquiryType === 'Project'"
              :label="`${$t('SALES.expenseItem')}`"
              prop="expenseAmount"
            >
              <ComparisonInput
                v-if="isModified('expenseAmount')"
                :beforeValue="$numberStr(getBeforeValue('expenseAmount'), 2)"
                :afterValue="$numberStr(totalForm.expenseAmount, 2)"
              />
              <div v-else class="input-switch-box">
                <div class="con-left">
                  <el-input :value="$numberStr(totalForm.expenseAmount, 2)" disabled></el-input>
                </div>
                <div class="con-right">
                  <svg-icon
                    @click="handleExpenseItemAmount"
                    icon-class="system"
                    style="height: 26px; width: 26px; cursor: pointer"
                  />
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="`${$t('SALES.totalFreight')}`" prop="totalFreight">
              <ComparisonInput
                v-if="isModified('totalFreight')"
                :beforeValue="$numberStr(getBeforeValue('totalFreight'), 2)"
                :afterValue="$numberStr(totalForm.totalFreight, 2)"
              />
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                v-else-if="!comDisFrom"
                style="width: 100%"
                v-model="totalForm.totalFreight"
                controls-position="right"
                :precision="2"
                :min="0"
                :max="999999999999.99"
                @change="handleCalculate('isCalculate')"
              />
              <el-input v-else :value="$numberStr(totalForm.totalFreight, 2)" disabled></el-input>
            </el-form-item>
            <el-form-item
              :label="`${$t('SALES.totalDiscount')}`"
              prop="totalDiscount"
              :class="[isModified('totalDiscount')]"
            >
              <div class="flexStart">
                <div style="width: 110px">
                  <el-input-number
                    v-thousandSplit="{ precision: 3 }"
                    v-if="!comDisFrom"
                    style="width: 100%"
                    v-model="totalForm.totalDiscountPer"
                    controls-position="right"
                    :precision="3"
                    :min="0"
                    :max="100"
                    :disabled="salesInquiryType === 'Consignment'"
                    @change="discountPerChange"
                  />
                  <el-input
                    v-else
                    :value="$numberStr(totalForm.totalDiscountPer, 3)"
                    disabled
                  ></el-input>
                </div>
                <div style="margin: 0 10px">%</div>
                <div class="flex-1">
                  <el-input-number
                    v-thousandSplit="{ precision: 2 }"
                    v-if="!comDisFrom"
                    style="width: 100%"
                    v-model="totalForm.totalDiscount"
                    controls-position="right"
                    :precision="2"
                    :min="0"
                    :max="999999999999.99"
                    :disabled="salesInquiryType === 'Consignment'"
                    @change="totalDiscountChange"
                  />
                  <el-input
                    v-else
                    :value="$numberStr(totalForm.totalDiscount, 2)"
                    disabled
                  ></el-input>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="`${$t('SALES.taxAmount')}`" prop="totalTaxAmount">
              <ComparisonInput
                v-if="isModified('totalTaxAmount')"
                :beforeValue="$numberStr(getBeforeValue('totalTaxAmount'), 2)"
                :afterValue="$numberStr(totalForm.totalTaxAmount, 2)"
              />
              <el-input v-else :value="$numberStr(totalForm.totalTaxAmount, 2)" disabled></el-input>
            </el-form-item>
            <el-form-item
              :label="`${$t('SALES.totalAmount')}`"
              prop="totalAmount"
              :error="
                totalForm.isTotalAmountNegativeTips === '1'
                  ? totalForm.totalAmountNegativeTipsMsg
                  : ''
              "
              ref="totalAmountRef"
            >
              <ComparisonInput
                v-if="isModified('totalAmount')"
                :beforeValue="$numberStr(getBeforeValue('totalAmount'), 2)"
                :afterValue="$numberStr(totalForm.totalAmount, 2)"
              />
              <div v-else class="input-switch-box">
                <div class="con-left">
                  <el-input :value="$numberStr(totalForm.totalAmount, 2)" disabled></el-input>
                </div>
                <!-- <div class="con-right" v-if="!comDisFrom">
                  <svg-icon
                    @click="handleCalculate('isCalculate')"
                    icon-class="jisuanqi"
                    style="height: 36px; width: 36px; cursor: pointer"
                  />
                </div> -->
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <div v-show="activeName === 'attachment'">
      <myUpload
        ref="uploadRef"
        :disabled="comDisFrom"
        :modifyHighlight="modifyHighlight"
        :updateFileList="updateFileList"
        :fomType="'Sales Inquiry'"
        :limit="9"
      />
    </div>

    <ReturnDialog
      :id="formData.salesInquiryId"
      :returnType="returnType"
      :rj-visible="returnVisible"
      :rj-api-url="returnUrl"
      @submitSuccess="returnSubmitSuccess"
      @rjVisibleChange="returnVisibleChange"
    />

    <ExpenseItemDlg
      ref="ExpenseItemDlg"
      :formData="formData"
      :modifyHighlight="modifyHighlight"
      :comDisFrom="comDisFrom"
      @submitSuccess="expenseItemSubmitSuccess"
    />

    <totalPriceControlNoticeDlg
      ref="totalPriceControlNoticeDlg"
      :formData="formData"
      pageType="salesInquiry"
      @updatePriceControlNotice="updatePriceControlNotice"
      @closePriceControlNotice="closePriceControlNotice"
    />
    <totalPriceControlNoticeDlgNoSubmit
      ref="totalPriceControlNoticeDlgNoSubmit"
      :formData="formData"
      @closePriceControlNotice="closePriceControlNotice"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import TradingProductTable from './TradingProductTable'
import ConsignmentProductTable from './ConsignmentProductTable'
import ServiceTypeProductTable from './ServiceTypeProductTable'

import ServiceProductTable from './ServiceProductTable'
import ProjectTable from './ProjectTable'
import ProjectCostTable from './ProjectCostTable'
import ExpenseItemDlg from './ExpenseItemDlg'

import paper from '@/views/salesManagement/questionnaireTemplate/components/paper.vue'
import totalPriceControlNoticeDlg from '@/views/salesManagement/salesInquiry/productInfo/totalPriceControlNoticeDlg'
import totalPriceControlNoticeDlgNoSubmit from '@/views/salesManagement/salesInquiry/productInfo/totalPriceControlNoticeDlgNoSubmit'

import {
  calculate,
  returnMaterialList,
  returnProjectTask,
  returnProjectCost
} from '@/api/salesManagement/salesInquiry'
import { queryCustomerQuestionnaireById } from '@/api/salesManagement/customerQuestionnaire'
import ReturnDialog from '../returnDialog/returnDialog.vue'
import projectProductDetail from './project/projectProductDetail.vue'
import projectCostDetails from './project/projectCostDetails.vue'

export default {
  mixins: [pageMixin],
  components: {
    ProjectTable,
    TradingProductTable,
    ConsignmentProductTable,
    ServiceTypeProductTable,
    ServiceProductTable,
    ProjectCostTable,
    ExpenseItemDlg,
    paper,
    ReturnDialog,
    totalPriceControlNoticeDlg,
    totalPriceControlNoticeDlgNoSubmit,
    projectProductDetail,
    projectCostDetails
  },
  props: {
    comDisFrom: {
      type: Boolean,
      default: false
    },

    projectList: {
      type: Array,
      default() {
        return []
      }
    },
    initCommonFileList: {
      type: Array,
      default() {
        return []
      }
    },
    salesInquiryType: {
      type: String,
      default: 'Trading'
    },
    countryId: {
      type: String,
      default: ''
    },
    businessPartnerId: {
      type: String,
      default: ''
    },
    currencyId: {
      type: String,
      default: ''
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    basicUpdateProps: {
      type: Array,
      default() {
        return []
      }
    },
    basicUpdateMsgList: {
      type: Array,
      default() {
        return []
      }
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    inQuotation() {
      return this.formData.salesInquiryStatus === '4'
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.totalForm = newValue || {}
        if (JSON.stringify(this.totalFormCopy) === '{}') {
          this.totalFormCopy = JSON.parse(JSON.stringify(this.totalForm))
        }
      }
    },
    initCommonFileList: {
      immediate: true,
      handler: function () {
        this.initFileList(this.initCommonFileList)
      }
    },
    salesInquiryType: {
      immediate: true,
      handler(newValue) {
        if (newValue === 'Project') {
          this.activeName = 'projectProductDetail'
        } else if (newValue === 'Consignment') {
          this.activeName = 'Consignment'
        } else if (newValue === 'Service') {
          this.activeName = 'ServiceTypeProduct'
        } else if (newValue === 'Trading') {
          this.activeName = 'ServiceTypeProduct'
        } else {
          this.activeName = 'productDetail'
        }
      }
    },
    'formData.customerQuestionnaireId': {
      immediate: true,
      handler(newValue) {
        if (this.activeName === 'customerQuestionnaire') {
          this.queryCustomerQuestionnaireById()
        }
      }
    }
  },
  data() {
    return {
      activeName: '1',
      totalForm: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: [],

      returnVisible: false,
      returnUrl: returnMaterialList,
      returnType: undefined,
      totalFormCopy: {}
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    comTabs() {
      let list = []
      if (this.salesInquiryType === 'Service') {
        list = [
          {
            label: this.$t('SALES.productDetail'),
            key: 'ServiceTypeProduct'
          }
          // {
          //   label: this.$t('SALES.projectTask'),
          //   key: 'projectTask'
          // }
        ]
      } else if (this.salesInquiryType === 'Trading') {
        list = [
          {
            label: this.$t('SALES.productDetail'),
            key: 'ServiceTypeProduct'
          }
          // {
          //   label: this.$t('SALES.projectTask'),
          //   key: 'projectTask'
          // }
        ]
      } else if (this.salesInquiryType === 'Project') {
        // list = [
        //   {
        //     label: this.$t('SALES.project'),
        //     key: 'project'
        //   },
        //   this.formData.productMsgTypeList.includes('1')
        //     ? {
        //         label: this.$t('SALES.materialList'),
        //         key: 'productDetail'
        //       }
        //     : null,
        //   this.formData.productMsgTypeList.includes('2')
        //     ? {
        //         label: this.$t('SALES.projectTask'),
        //         key: 'projectTask'
        //       }
        //     : null,
        //   this.formData.productMsgTypeList.includes('3')
        //     ? {
        //         label: this.$t('SALES.projectCost'),
        //         key: 'projectCost'
        //       }
        //     : null,
        //   {
        //     label: this.$t('SALES.customerQuestionnaire'),
        //     key: 'customerQuestionnaire'
        //   }
        // ]
        list = [
          {
            label: this.$t('SALES.productDetail'),
            key: 'projectProductDetail'
          },
          {
            label: this.$t('SALES.costDetails'),
            key: 'projectCostDetails'
            // disabled:
            //   !this.formData.salesInquiryProductList ||
            //   this.formData.salesInquiryProductList.length <= 0
          }
        ]
      } else if (this.salesInquiryType === 'Consignment') {
        list = [
          {
            label: this.$t('SALES.productDetail'),
            key: 'Consignment'
          }
        ]
      } else {
        list = [
          {
            label: this.$t('SALES.productDetail'),
            key: 'productDetail'
          }
        ]
      }
      return list.filter((item) => item)
    }
  },
  methods: {
    initFileList(FileList) {
      const maxAttempts = 10 // 最大尝试次数
      const interval = 200 // 每次尝试的间隔时间（毫秒）
      let attempts = 0
      const retry = () => {
        if (attempts < maxAttempts) {
          attempts++
          setTimeout(() => {
            if (this.$refs.uploadRef) {
              this.$refs.uploadRef.initFileList(FileList)
            } else {
              retry()
            }
          }, interval)
        } else {
          console.log('无法获取组件')
        }
      }
      retry()
    },
    getFileIds() {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return false
      }
      return myFileIds
    },

    updateFileList(list) {
      this.curFileList = list
    },
    handleTabClick() {
      if (this.activeName === 'customerQuestionnaire') {
        this.queryCustomerQuestionnaireById()
      }
      if (this.activeName === 'projectProductDetail') {
        this.$nextTick(() => {
          this.$refs.projectProductDetail.changeTableList()
        })
      }
    },
    errorMessage(code, refType) {
      this.$emit('scrollPageToTable')
      this.$refs[refType] && this.$refs[refType].errorMessage(code)

      // this.tableList.forEach((item) => {
      //   if (!this.$resultOfBoolean(item[code])) {
      //     this.$set(item, code + 'Error', true)
      //   }
      // })
    },
    queryCustomerQuestionnaireById() {
      if (!this.formData.customerQuestionnaireId) return
      queryCustomerQuestionnaireById({
        customerQuestionnaireId: this.formData.customerQuestionnaireId
      })
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

    subTotalChange() {
      console.log('subTotalChange')
      if (this.$resultOfBoolean(this.totalForm.subTotal)) {
        this.$set(this.totalForm, 'isUpdateAmount', '1')
      } else {
        this.$set(this.totalForm, 'isUpdateAmount', '0')
      }
      this.handleCalculate('isCalculate')
    },
    totalDiscountChange() {
      this.$set(this.totalForm, 'totalDiscountPer', undefined)
      const qtyReq1 = this.totalForm.salesInquiryProductList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq1) {
        return
      }
      const qtyReq2 = this.totalForm.productOrServiceList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq2) {
        return
      }
      // 计算费用项总金额
      this.handleCalculate('isCalculate')
    },
    discountPerChange() {
      this.$set(this.totalForm, 'totalDiscount', undefined)
      const qtyReq1 = this.totalForm.salesInquiryProductList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq1) {
        return
      }
      const qtyReq2 = this.totalForm.productOrServiceList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq2) {
        return
      }
      // 计算费用项总金额
      this.handleCalculate('isCalculate')
    },
    handleExpenseItemAmount() {
      this.handleCalculate('openExpenseItemDlg')
    },
    expenseItemSubmitSuccess() {
      // 计算费用项总金额
      this.handleCalculate()
    },
    handleCalculate(type) {
      const params = {
        ...this.totalForm,
        expenseItemList: this.totalForm.expenseItemList,
        salesInquiryProductList: this.totalForm.salesInquiryProductList,
        salesInquiryServiceList: this.totalForm.salesInquiryServiceList
      }
      const qtyReq1 = this.totalForm.salesInquiryProductList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq1) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return
      }
      const qtyReq2 = this.totalForm.productOrServiceList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq2) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return
      }
      const timer = Date.now()
      this.queryTotalTime = timer
      calculate(params)
        .then((res) => {
          if (this.queryTotalTime === timer) {
            const data = res.data || {}
            if (data.isTotalAmountNegativeTips === '1') {
              this.scrollPageToTotalAmount()
            }
            this.$set(this.totalForm, 'isTotalAmountNegativeTips', data.isTotalAmountNegativeTips)
            this.$set(this.totalForm, 'totalAmountNegativeTipsMsg', data.totalAmountNegativeTipsMsg)
            // const curList = this.totalForm.salesInquiryProductList
            // const newList = data.salesInquiryProductList
            // const rowKey =
            //   this.totalForm.salesInquiryType === 'Project'
            //     ? 'salesInquiryProductId'
            //     : 'salesPartId'
            // curList.forEach((curItem) => {
            //   newList.forEach((newItem) => {
            //     if (curItem[rowKey] === newItem[rowKey]) {
            //       this.$set(curItem, 'unitPrice', newItem.unitPrice)
            //       this.$set(curItem, 'lineTotal', newItem.lineTotal)
            //       this.$set(curItem, 'taxAmountProcess', newItem.taxAmountProcess)
            //       this.$set(curItem, 'salesCost', newItem.salesCost)
            //       this.$set(curItem, 'salesProfit', newItem.salesProfit)
            //       this.$set(curItem, 'pplUnitPrice', newItem.pplUnitPrice)
            //     }
            //   })
            // })

            const { salesInquiryProductList } = data
            const handlerSalesInquiryProductList = (list) => {
              const handleList = (currentList, customIndex = 0) => {
                currentList.forEach((item) => {
                  // 每条记录都生成唯一的 rowTimeId
                  item.customIndex = customIndex
                  if (item.childProductList && item.childProductList.length > 0) {
                    handleList(item.childProductList, customIndex + 1)
                  } else {
                    item.childProductList = []
                  }
                })
              }
              // 每个第一层对象都从 0 级开始
              list.forEach((item) => {
                handleList([item], 0)
              })
            }
            handlerSalesInquiryProductList(salesInquiryProductList || [])

            // 赋值
            const handlerProductList = (list = []) => {
              const resultMap = new Map()

              const buildMap = (data = []) => {
                data.forEach((item) => {
                  if (item.rowTimeId !== undefined && item.rowTimeId !== null) {
                    resultMap.set(String(item.rowTimeId), item)
                  }

                  if (item.childProductList && item.childProductList.length > 0) {
                    buildMap(item.childProductList)
                  }
                })
              }

              const updateList = (data = []) => {
                data.forEach((item) => {
                  const result = resultMap.get(String(item.rowTimeId))

                  if (result) {
                    this.$set(item, 'unitCost', result.unitCost)
                    this.$set(item, 'unitPrice', result.unitPrice)
                    this.$set(item, 'lineTotal', result.lineTotal)
                    this.$set(item, 'scrapRate', result.scrapRate)
                    this.$set(item, 'pricingQty', result.pricingQty)
                    this.$set(item, 'qty', result.qty)
                    this.$set(item, 'netQty', result.netQty)
                    this.$set(item, 'lineTotalPricingCost', result.lineTotalPricingCost)
                  }

                  if (item.childProductList && item.childProductList.length > 0) {
                    updateList(item.childProductList)
                  }
                })
              }

              buildMap(salesInquiryProductList || [])
              updateList(list)
            }
            handlerProductList(this.totalForm.salesInquiryProductList)

            if (type === 'openExpenseItemDlg') {
              this.$refs.ExpenseItemDlg.handleAdd()
            }
            const {
              isNeedTips
              // isNeedTipsForAut
            } = data
            // if (isNeedTipsForAut && ['1', '2'].indexOf(isNeedTipsForAut) !== -1) {
            // this.$refs.totalPriceControlNoticeDlgNoSubmit.open(data)
            // return
            // }
            if (
              isNeedTips &&
              ['1', '2'].indexOf(isNeedTips) !== -1 &&
              (type === 'isCalculate' ||
                !this.checkPermi(['salesManagement:salesInquiry:AllowSellingBelowCost']))
            ) {
              this.$refs.totalPriceControlNoticeDlg.open(data)
            } else {
              this.$set(this.totalForm, 'subTotal', data.subTotal)
              this.$set(this.totalForm, 'subTotalOnlyProduct', data.subTotalOnlyProduct)
              this.$set(this.totalForm, 'expenseAmount', data.expenseAmount)
              this.$set(this.totalForm, 'expenseItemList', data.expenseItemList)
              this.$set(this.totalForm, 'totalFreight', data.totalFreight)
              this.$set(this.totalForm, 'totalTaxAmount', data.totalTaxAmount)
              this.$set(this.totalForm, 'totalAmount', data.totalAmount)
              this.$set(this.totalForm, 'totalDiscount', data.totalDiscount)
              this.$set(this.totalForm, 'totalDiscountPer', data.totalDiscountPer)
              this.totalFormCopy = JSON.parse(JSON.stringify(this.totalForm))
            }
          }
        })
        .catch(() => {
          this.closePriceControlNotice()

          // this.$set(this.totalForm, 'totalDiscount', undefined)
          // this.$set(this.totalForm, 'totalDiscountPer', undefined)
        })
    },
    scrollPageToTotalAmount() {
      if (this.$refs.totalAmountRef) {
        const offsetTop = this.$refs.totalAmountRef.$el.offsetTop
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight
        this.$emit('scrollPageToTotalAmount', offsetTop - viewportHeight / 2)
      }
    },
    updatePriceControlNotice(data) {
      this.$set(this.totalForm, 'subTotal', data.subTotal)
      this.$set(this.totalForm, 'subTotalOnlyProduct', data.subTotalOnlyProduct)
      this.$set(this.totalForm, 'expenseAmount', data.expenseAmount)
      this.$set(this.totalForm, 'expenseItemList', data.expenseItemList)
      this.$set(this.totalForm, 'totalFreight', data.totalFreight)
      this.$set(this.totalForm, 'totalTaxAmount', data.totalTaxAmount)
      this.$set(this.totalForm, 'totalAmount', data.totalAmount)
      this.$set(this.totalForm, 'totalDiscount', data.totalDiscount)
      this.$set(this.totalForm, 'totalDiscountPer', data.totalDiscountPer)
      this.totalFormCopy = JSON.parse(JSON.stringify(this.totalForm))
      if (data.isTotalAmountNegativeTips === '1') {
        if (this.$refs.totalAmountRef) {
          const offsetTop = this.$refs.totalAmountRef.$el.offsetTop
          const viewportHeight = window.innerHeight || document.documentElement.clientHeight
          this.$emit('scrollPageToTotalAmount', offsetTop - viewportHeight / 2)
        }
        // this.$modal.msgError(data.totalAmountNegativeTipsMsg)
      }
      this.$set(this.totalForm, 'isTotalAmountNegativeTips', data.isTotalAmountNegativeTips)
      this.$set(this.totalForm, 'totalAmountNegativeTipsMsg', data.totalAmountNegativeTipsMsg)
    },
    closePriceControlNotice() {
      const data = this.totalFormCopy
      // this.$set(this.totalForm, 'subTotal', data.subTotal)
      // this.$set(this.totalForm, 'subTotalOnlyProduct', data.subTotalOnlyProduct)
      // this.$set(this.totalForm, 'expenseAmount', data.expenseAmount)
      // this.$set(this.totalForm, 'expenseItemList', data.expenseItemList)
      // this.$set(this.totalForm, 'totalFreight', data.totalFreight)
      // this.$set(this.totalForm, 'totalTaxAmount', data.totalTaxAmount)
      // this.$set(this.totalForm, 'totalAmount', data.totalAmount)
      this.$set(this.totalForm, 'totalDiscount', data.totalDiscount)
      this.$set(this.totalForm, 'totalDiscountPer', data.totalDiscountPer)
    },
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    },
    getBeforeValue(prop) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop) || {}
      return item.beforeValue
    },

    handleReturn(type) {
      if (type === 'materialList') {
        this.returnVisible = true
        this.returnUrl = returnMaterialList
        this.returnType = type
      }
      if (type === 'projectTask') {
        this.returnVisible = true
        this.returnUrl = returnProjectTask
        this.returnType = type
      }
      if (type === 'projectCost') {
        this.returnVisible = true
        this.returnUrl = returnProjectCost
        this.returnType = type
      }
    },
    returnVisibleChange(data) {
      this.returnVisible = data || false
    },
    returnSubmitSuccess(type) {
      const vm = this
      if (type === 'materialList') {
        vm.$message.success(
          `${vm.$t('ui.returnedSuccess')}`.replace(
            '$1',
            `${this.$t('SALES.materialList')} [${vm.formData.materialListNo}]`
          )
        )
      }
      if (type === 'projectTask') {
        vm.$message.success(
          `${vm.$t('ui.returnedSuccess')}`.replace(
            '$1',
            `${this.$t('SALES.projectTask')} [${vm.formData.projectTaskNo}]`
          )
        )
      }
      if (type === 'projectCost') {
        vm.$message.success(
          `${vm.$t('ui.returnedSuccess')}`.replace(
            '$1',
            `${this.$t('SALES.projectCost')} [${vm.formData.projectCostNo}]`
          )
        )
      }

      this.returnVisible = false
      this.$emit('returnSubmitSuccess')
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-box {
  max-width: 600px;
  max-height: 60vh;
  overflow-y: auto;
  // padding: 12px;
  box-sizing: border-box;
  background-color: #333;
  div {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
