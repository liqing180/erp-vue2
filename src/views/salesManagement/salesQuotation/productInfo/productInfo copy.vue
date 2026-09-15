<template>
  <div class="pb20">
    <el-row :key="salesQuotationType">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <template v-for="item in comTabs">
          <el-tab-pane :name="item.key" :key="item.key">
            <span slot="label">
              <span>{{ item.label }}</span>
              <span v-if="item.key === 'productDetail' || item.key === 'Consignment'" class="ml5">
                <span v-if="formData.salesQuotationProductList.length"
                  >({{ formData.salesQuotationProductList.length }})</span
                >
              </span>
              <span v-if="item.key === 'projectTask'" class="ml5">
                <span v-if="formData.salesQuotationServiceList.length"
                  >({{ formData.salesQuotationServiceList.length }})</span
                >
              </span>

              <span v-if="item.key === 'ServiceTypeProduct'" class="ml5">
                <span v-if="formData.productOrServiceList.length"
                  >({{ formData.productOrServiceList.length }})</span
                >
              </span>

              <span v-if="item.key === 'project'" class="ml5">
                <span v-if="formData.salesQuotationProjectList.length"
                  >({{ formData.salesQuotationProjectList.length }})</span
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
        <el-tab-pane
          name="projectTaskMixDesign"
          v-if="salesQuotationType === 'MixDesign' && formData.specialRequirement === '3'"
        >
          <span slot="label">
            <span>{{ $t('SALES.projectTask') }}</span>
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
        :comDisFrom="true"
        @deliveryDateForDayChange="$emit('deliveryDateForDayChange')"
        @updatePriceControlNotice="updatePriceControlNotice"
      />
    </div>
    <div v-show="activeName === 'project1'">
      <ProjectTable1
        ref="project1"
        :formData="formData"
        :productList="projectList"
        :modifyHighlight="modifyHighlight"
        :salesQuotationType="salesQuotationType"
        :comDisFrom="comDisFrom"
        @handleCalculate="handleCalculate"
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
        @deliveryDateForDayChange="$emit('deliveryDateForDayChange')"
        @handleCalculate="handleCalculate"
        @updatePriceControlNotice="updatePriceControlNotice"
      />
    </div>
    <div v-show="activeName === 'materialList'" key="materialList">
      <materialList
        ref="materialList"
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        @deliveryDateForDayChange="$emit('deliveryDateForDayChange')"
        @updatePriceControlNotice="updatePriceControlNotice"
        v-if="salesQuotationType !== 'MixDesign'"
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
        @deliveryDateForDayChange="$emit('deliveryDateForDayChange')"
        @updatePriceControlNotice="updatePriceControlNotice"
      />
    </div>

    <div v-show="activeName === 'templateInfo'">
      <contentEditor
        class="form-wd"
        :init-content="initContent"
        :config="config"
        :disabled="true"
      />
    </div>
    <div v-show="activeName === 'customerQuestionnaire'">
      <div v-if="formData.customerQuestionnaireId">
        <paper ref="paper" :isDisabled="true" />
      </div>
      <div v-else class="noAttachment">{{ $t('ui.noData') }}</div>
    </div>
    <template v-if="salesQuotationType === 'MixDesign'">
      <!-- 配合比 -->
      <div v-show="activeName === 'mixDesign'">
        <mixDesign
          ref="mixDesign"
          :formData="formData"
          :modifyHighlight="modifyHighlight"
          :comDisFrom="comDisFrom"
          @materialListMixDesignChange="materialListMixDesignChange"
          @handleCalculate="handleCalculate"
        />
      </div>
      <div v-show="activeName === 'materialListMixDesign'">
        <materialListMixDesign
          ref="materialListMixDesign"
          :formData="formData"
          :modifyHighlight="modifyHighlight"
          :comDisFrom="comDisFrom"
        />
      </div>
      <div v-show="activeName === 'projectTaskMixDesign'">
        <projectTaskMixDesign
          ref="projectTaskMixDesign"
          :formData="formData"
          :modifyHighlight="modifyHighlight"
          :comDisFrom="comDisFrom"
        />
      </div>
    </template>
    <div v-show="activeName !== 'attachment' && activeName !== 'customerQuestionnaire'">
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
            <el-form-item
              :label="`${$t('SALES.otherCosts')}`"
              prop="otherCosts"
              :class="[isModified('otherCosts')]"
              v-if="['Project'].indexOf(salesQuotationType) !== -1"
            >
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                v-if="!comDisFrom"
                style="width: 100%"
                v-model="totalForm.otherCosts"
                controls-position="right"
                :precision="2"
                disabled
              />
              <el-input v-else :value="$numberStr(totalForm.otherCosts, 2)" disabled></el-input>
            </el-form-item>
            <el-form-item
              :label="`${$t('SALES.subTotal')}`"
              prop="subTotal"
              :class="[isModified('subTotal')]"
            >
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                v-if="!comDisFrom && formData.priceTbd === '1'"
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
              v-if="salesQuotationType === 'Project' && false"
              :label="`${$t('SALES.expenseItem')}`"
              prop="expenseAmount"
            >
              <div class="input-switch-box">
                <div class="con-left">
                  <el-input :value="$numberStr(totalForm.expenseAmount, 2)" disabled></el-input>
                </div>
                <div class="con-right" v-if="totalForm.salesQuotationId">
                  <svg-icon
                    @click="handleExpenseItemAmount"
                    icon-class="system"
                    style="height: 26px; width: 26px; cursor: pointer"
                  />
                </div>
              </div>
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
                    :disabled="salesQuotationType === 'Consignment'"
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
                    @change="totalDiscountChange"
                    :disabled="salesQuotationType === 'Consignment'"
                  />
                  <el-input
                    v-else
                    :value="$numberStr(totalForm.totalDiscount, 2)"
                    disabled
                  ></el-input>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              :label="`${$t('SALES.totalFreight')}`"
              prop="totalFreight"
              :class="[isModified('totalFreight')]"
            >
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                v-if="!comDisFrom"
                style="width: 100%"
                v-model="totalForm.totalFreight"
                controls-position="right"
                :precision="2"
                :min="0"
                :max="999999999999.99"
              />
              <!-- @input="totalDiscountChange" -->
              <el-input v-else :value="$numberStr(totalForm.totalFreight, 2)" disabled></el-input>
            </el-form-item>
            <el-form-item
              :label="`${$t('SALES.taxAmount')}`"
              prop="totalTaxAmount"
              :class="[isModified('totalTaxAmount')]"
            >
              <el-input :value="$numberStr(totalForm.totalTaxAmount, 2)" disabled></el-input>
            </el-form-item>
            <el-form-item
              :label="`${$t('SALES.totalAmount')}`"
              prop="totalAmount"
              :class="[isModified('totalAmount')]"
            >
              <div class="input-switch-box">
                <div class="con-left">
                  <el-input :value="$numberStr(totalForm.totalAmount, 2)" disabled></el-input>
                </div>
                <div class="con-right" v-if="!comDisFrom">
                  <svg-icon
                    @click="handleCalculate('isCalculate')"
                    icon-class="jisuanqi"
                    style="height: 36px; width: 36px; cursor: pointer"
                  />
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div v-show="activeName === 'attachment'" :class="[isModified('attachment')]">
      <myUpload
        ref="uploadRef"
        :disabled="comDisFrom"
        :updateFileList="updateFileList"
        :allFileSize="isServiceOrderCreated ? 20 : undefined"
        :fomType="'Sales Quotation'"
      />
    </div>

    <ExpenseItemDlg ref="ExpenseItemDlg" :formData="formData" :comDisFrom="true" />

    <totalPriceControlNoticeDlg
      ref="totalPriceControlNoticeDlg"
      :formData="formData"
      pageType="salesQuotation"
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
import ServiceProductTable from './ServiceProductTable'
import ProjectTable from './ProjectTable'
import ProjectCostTable from './ProjectCostTable'
import materialList from './materialList'
import ProjectTable1 from './ProjectTable1'
import projectTaskMixDesign from './projectTaskMixDesign'

// 配合比
import mixDesign from './mixDesign'
import materialListMixDesign from './materialListMixDesign'

import ExpenseItemDlg from '@/views/salesManagement/salesInquiry/productInfo/ExpenseItemDlg.vue'

import paper from '@/views/salesManagement/questionnaireTemplate/components/paper.vue'
import { calculate } from '@/api/salesManagement/salesQuotation'
import { queryCustomerQuestionnaireById } from '@/api/salesManagement/customerQuestionnaire'
import contentEditor from '@/views/system/emailManagement/editor/editor'
import { queryProjectTemplateById } from '@/api/projectManagement/projectTemplate'
import ServiceTypeProductTable from './ServiceTypeProductTable'
import totalPriceControlNoticeDlg from '@/views/salesManagement/salesInquiry/productInfo/totalPriceControlNoticeDlg'
import totalPriceControlNoticeDlgNoSubmit from '@/views/salesManagement/salesInquiry/productInfo/totalPriceControlNoticeDlgNoSubmit'

export default {
  mixins: [pageMixin],
  components: {
    ProjectTable,
    TradingProductTable,
    ConsignmentProductTable,
    ServiceProductTable,
    ServiceTypeProductTable,
    ProjectCostTable,
    paper,
    ExpenseItemDlg,
    contentEditor,
    materialList,
    ProjectTable1,
    mixDesign,
    materialListMixDesign,
    projectTaskMixDesign,
    totalPriceControlNoticeDlg,
    totalPriceControlNoticeDlgNoSubmit
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },

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
    salesQuotationType: {
      type: String,
      default: ''
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
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
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
    salesQuotationType: {
      immediate: true,
      handler(newValue) {
        if (newValue === 'Project') {
          this.activeName = 'productDetail'
        } else if (newValue === 'Consignment') {
          this.activeName = 'Consignment'
        } else if (newValue === 'Service') {
          this.activeName = 'ServiceTypeProduct'
        } else if (newValue === 'MixDesign') {
          this.activeName = 'mixDesign'
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
    },
    'formData.salesQuotationProjectList': {
      immediate: true,
      handler: function (newVal) {
        if (newVal && newVal.length > 0) {
          const { projectMsg } = newVal[0]
          this.initContent = projectMsg
        } else {
          this.initContent = ''
        }
      }
    }
  },
  data() {
    return {
      activeName: '1',
      totalForm: {},
      totalFormCopy: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: [],
      initContent: '',
      config: {
        width: '100%', // px
        height: 500, // px
        contentReadOnly: true,
        isShowToolBar: false,
        disabled: true,
        buttonsOption: [
          {
            componentName: 'BtnServTpl',
            isShow: true
          }
        ]
      }
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    comTabs() {
      let list = []
      if (this.salesQuotationType === 'Service') {
        list = [
          {
            label: this.$t('SALES.productDetail'),
            key: 'ServiceTypeProduct'
          }
          /* {
            label: this.$t('SALES.materialList'),
            key: 'productDetail'
          },
          {
            label: this.$t('SALES.projectTask'),
            key: 'projectTask'
          } */
        ]
      } else if (this.salesQuotationType === 'Project') {
        // list = [
        //   {
        //     label: this.$t('SALES.project'),
        //     key: 'project1'
        //   },
        //   {
        //     label: this.$t('SALES.materialList'),
        //     key: 'materialList'
        //   }
        // ]
        list = [
          {
            label: this.$t('SALES.productDetail'),
            key: 'productDetail'
          }
        ]
      } else if (this.salesQuotationType === 'Consignment') {
        list = [
          {
            label: this.$t('SALES.productDetail'),
            key: 'Consignment'
          }
        ]
      } else if (this.salesQuotationType === 'MixDesign') {
        list = [
          {
            label: this.$t('SALES.mixDesign'),
            key: 'mixDesign'
          },
          {
            label: this.$t('SALES.materialList'),
            key: 'materialListMixDesign'
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
    },
    isServiceOrderCreated() {
      return this.formData.documentType === 'ServiceOrder'
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
    materialListMixDesignChange(data = []) {
      this.totalForm.salesQuotationProductList = data
    },
    getFileIds() {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return false
      }
      return myFileIds
    },
    requiredError(code, refType) {
      if (code) {
        this.$emit('scrollPageToTable')
      }
      this.$refs[refType] && this.$refs[refType].requiredError(code)
    },
    updateFileList(list) {
      this.curFileList = list
    },
    handleTabClick() {
      if (this.activeName === 'customerQuestionnaire') {
        this.queryCustomerQuestionnaireById()
      }
    },
    errorMessage(code, refType) {
      this.$refs[refType] && this.$refs[refType].errorMessage(code)
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
    handleExpenseItemAmount() {
      this.$refs.ExpenseItemDlg.handleAdd()
    },
    subTotalChange() {
      if (this.$resultOfBoolean(this.totalForm.subTotal)) {
        this.$set(this.totalForm, 'isUpdateAmount', '1')
      } else {
        this.$set(this.totalForm, 'isUpdateAmount', '0')
      }
    },
    discountPerChange() {
      this.$set(this.totalForm, 'totalDiscount', undefined)
      const qtyReq1 = this.totalForm.salesQuotationProductList.find((item) => {
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
      this.handleCalculate('isCalculate')
    },
    totalDiscountChange() {
      this.$set(this.totalForm, 'totalDiscountPer', undefined)
      const qtyReq1 = this.totalForm.salesQuotationProductList.find((item) => {
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
      this.handleCalculate('isCalculate')
    },
    handleCalculate(type) {
      // const that = this
      // console.log(this.totalForm, '====648')
      const params = {
        ...this.totalForm,
        salesQuotationProductList: this.totalForm.salesQuotationProductList,
        salesQuotationServiceList: this.totalForm.salesQuotationServiceList
      }
      // if (params.salesQuotationProjectList && params.salesQuotationProjectList.length > 0) {
      //   const { projectTemplateContentList } = params.salesQuotationProjectList[0]
      //   params.salesQuotationProjectContentList = projectTemplateContentList || []
      // }
      if (!type || type !== 'previewPDF') {
        if (this.formData.blanketOrder !== '1') {
          const qtyReq1 = this.totalForm.salesQuotationProductList.find((item) => {
            return !this.$resultOfBoolean(item.qty)
          })
          if (qtyReq1) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1'))
            )
            return
          }
        }
        const qtyReq2 = this.totalForm.productOrServiceList.find((item) => {
          return !this.$resultOfBoolean(item.qty)
        })
        if (qtyReq2) {
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
          return
        }
      }

      const timer = Date.now()
      this.queryTotalTime = timer
      calculate(params)
        .then((res) => {
          if (this.queryTotalTime === timer) {
            const data = res.data || {}
            const {
              otherCosts,
              subTotal,
              expenseAmount,
              totalFreight,
              totalDiscount,
              totalTaxAmount,
              totalAmount,
              salesQuotationProductList,
              totalDiscountPer
            } = res.data
            // this.$set(this.totalForm, 'subTotal', subTotal)
            // this.$set(this.totalForm, 'totalFreight', totalFreight)
            // this.$set(this.totalForm, 'totalTaxAmount', totalTaxAmount)
            // this.$set(this.totalForm, 'totalAmount', totalAmount)
            // this.$set(this.totalForm, 'totalDiscount', totalDiscount)
            // this.$set(this.totalForm, 'expenseAmount', expenseAmount)
            // this.$set(this.totalForm, 'totalDiscountPer', totalDiscountPer)
            // if (this.salesQuotationType === 'Project') {
            //   this.$set(this.totalForm, 'otherCosts', otherCosts)
            //   // this.queryProjectTemplateById()
            // }
            // this.$set(this.totalForm, 'salesQuotationProductList', salesQuotationProductList)

            const {
              isNeedTips
              //  isNeedTipsForAut
            } = data
            // if (isNeedTipsForAut && ['1', '2'].indexOf(isNeedTipsForAut) !== -1) {
            //   this.$refs.totalPriceControlNoticeDlgNoSubmit.open(data)
            //   return
            // }

            if (
              isNeedTips &&
              ['1', '2'].indexOf(isNeedTips) !== -1 &&
              (type === 'isCalculate' ||
                !this.checkPermi(['salesManagement:salesQuotation:AllowSellingBelowCost']))
            ) {
              this.$refs.totalPriceControlNoticeDlg.open(data)
            } else {
              this.$set(this.totalForm, 'subTotal', subTotal)
              this.$set(this.totalForm, 'totalFreight', totalFreight)
              this.$set(this.totalForm, 'totalTaxAmount', totalTaxAmount)
              this.$set(this.totalForm, 'totalAmount', totalAmount)
              this.$set(this.totalForm, 'totalDiscount', totalDiscount)
              this.$set(this.totalForm, 'expenseAmount', expenseAmount)
              this.$set(this.totalForm, 'totalDiscountPer', totalDiscountPer)
              if (this.salesQuotationType === 'Project') {
                this.$set(this.totalForm, 'otherCosts', otherCosts)
              }
              this.$set(this.totalForm, 'salesQuotationProductList', salesQuotationProductList)

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
    updatePriceControlNotice(data, type) {
      const {
        otherCosts,
        subTotal,
        expenseAmount,
        totalFreight,
        totalDiscount,
        totalTaxAmount,
        totalAmount,
        salesQuotationProductList,
        totalDiscountPer
      } = data
      this.$set(this.totalForm, 'subTotal', subTotal)
      this.$set(this.totalForm, 'totalFreight', totalFreight)
      this.$set(this.totalForm, 'totalTaxAmount', totalTaxAmount)
      this.$set(this.totalForm, 'totalAmount', totalAmount)
      this.$set(this.totalForm, 'totalDiscount', totalDiscount)
      this.$set(this.totalForm, 'expenseAmount', expenseAmount)
      this.$set(this.totalForm, 'totalDiscountPer', totalDiscountPer)
      if (this.salesQuotationType === 'Project') {
        this.$set(this.totalForm, 'otherCosts', otherCosts)
      }
      if (!type) {
        this.$set(this.totalForm, 'salesQuotationProductList', salesQuotationProductList)
      }
      this.totalFormCopy = JSON.parse(JSON.stringify(this.totalForm))
    },
    closePriceControlNotice() {
      const {
        // otherCosts,
        // subTotal,
        // expenseAmount,
        // totalFreight,
        // totalTaxAmount,
        // totalAmount,
        // salesQuotationProductList,
        totalDiscount,
        totalDiscountPer
      } = this.totalFormCopy
      // this.$set(this.totalForm, 'subTotal', subTotal)
      // this.$set(this.totalForm, 'totalFreight', totalFreight)
      // this.$set(this.totalForm, 'totalTaxAmount', totalTaxAmount)
      // this.$set(this.totalForm, 'totalAmount', totalAmount)
      // this.$set(this.totalForm, 'expenseAmount', expenseAmount)
      this.$set(this.totalForm, 'totalDiscount', totalDiscount)
      this.$set(this.totalForm, 'totalDiscountPer', totalDiscountPer)
      // if (this.salesQuotationType === 'Project') {
      //   this.$set(this.totalForm, 'otherCosts', otherCosts)
      // }
      // this.$set(this.totalForm, 'salesQuotationProductList', salesQuotationProductList)
    },
    queryProjectTemplateById() {
      const { salesQuotationProjectList } = this.totalForm
      if (salesQuotationProjectList && salesQuotationProjectList.length > 0) {
        const { projectTemplateId } = salesQuotationProjectList[0]
        if (projectTemplateId) {
          queryProjectTemplateById({ projectTemplateId })
            .then((res) => {
              const { projectMsg } = res.data
              this.initContent = projectMsg
            })
            .catch(() => {})
        } else {
          this.initContent = ''
        }
      } else {
        this.initContent = ''
      }
    },
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
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
