<template>
  <div class="pb20">
    <el-row :key="salesQuotationType">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <template v-for="item in comTabs">
          <el-tab-pane :name="item.key" :key="item.key">
            <span slot="label">
              <span>{{ item.label }}</span>
              <span v-if="item.key === 'productDetail' || item.key === 'Consignment'" class="ml5">
                <span v-if="formData.salesOrderProductList.length"
                  >({{ formData.salesOrderProductList.length }})</span
                >
              </span>
              <span v-if="item.key === 'projectTask'" class="ml5">
                <span v-if="formData.salesOrderServiceList.length"
                  >({{ formData.salesOrderServiceList.length }})</span
                >
              </span>

              <span v-if="item.key === 'ServiceTypeProduct'" class="ml5">
                <span v-if="(formData.productOrServiceList || []).length"
                  >({{ (formData.productOrServiceList || []).length }})</span
                >
              </span>

              <span v-if="item.key === 'project'" class="ml5">
                <span v-if="formData.salesOrderProjectList.length"
                  >({{ formData.salesOrderProjectList.length }})</span
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
        <!-- <el-tab-pane name="templateInfo" v-if="salesQuotationType === 'Project'">
          <span slot="label">
            <span>{{ $t('SALES.templateInfo') }}</span>
          </span>
        </el-tab-pane> -->
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
        :formData="formData"
        :productList="projectList"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
      />
    </div>
    <div v-show="activeName === 'projectCostDetails'">
      <projectCostDetails
        ref="projectCostDetails"
        :formData="formData"
        :productList="projectList"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
      />
    </div>
    <div v-show="activeName === 'project1'">
      <ProjectTable1
        :formData="formData"
        :productList="projectList"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
      />
    </div>
    <div v-show="activeName === 'materialList'" key="materialList">
      <materialList
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        v-if="salesQuotationType !== 'MixDesign'"
      />
    </div>
    <div v-show="activeName === 'templateInfo'" v-if="false">
      <contentEditor class="form-wd" :init-content="initContent" :config="config" />
    </div>
    <div v-if="activeName === 'productDetail'" key="productDetail">
      <TradingProductTable
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        @handleUpdate="$emit('handleUpdate')"
      />
    </div>
    <div v-if="activeName === 'Consignment'" key="ConsignmentProduct">
      <ConsignmentProductTable
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        :buttonAuthMsg="buttonAuthMsg"
        @back="$emit('back')"
      />
    </div>
    <div v-show="activeName === 'serviceInfo'">
      <el-form :model="totalForm" @submit.native.prevent label-width="140px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.description')}`">
              <MyInput
                type="textarea"
                v-model="totalForm.description"
                :autosize="{ minRows: 2, maxRows: 4 }"
                resize="none"
                show-word-limit
                disabled
                :maxlength="3000"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-show="activeName === 'projectTask'">
      <ServiceProductTable
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
      />
    </div>
    <div v-show="activeName === 'projectCost'">
      <ProjectCostTable
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
      />
    </div>

    <div v-if="activeName === 'ServiceTypeProduct'" key="ServiceTypeProduct">
      <ServiceTypeProductTable
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="true"
        @deliveryDateForDayChange="$emit('deliveryDateForDayChange')"
        @handleCalculate="handleCalculate"
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
            <!-- <el-form-item
              :label="`${$t('SALES.otherCosts')}`"
              prop="otherCosts"
              :class="[isModified('otherCosts')]"
              v-if="['MixDesign'].indexOf(salesQuotationType)"
            >
              <el-input :value="$numberStr(totalForm.otherCosts, 2)" disabled></el-input>
            </el-form-item> -->
            <el-form-item
              :label="`${$t('SALES.subTotal')}`"
              prop="subTotal"
              :class="[isModified('subTotal')]"
            >
              <el-input :value="$numberStr(totalForm.subTotal, 2)" disabled></el-input>
            </el-form-item>
            <!-- <el-form-item
              v-if="salesQuotationType === 'Project'"
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
            </el-form-item> -->

            <el-form-item
              :label="`${$t('SALES.totalDiscount')}`"
              prop="totalDiscount"
              :class="[isModified('totalDiscount')]"
            >
              <div class="flexStart">
                <div style="width: 110px">
                  <el-input :value="$numberStr(totalForm.totalDiscountPer, 2)" disabled></el-input>
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
                    @input="totalDiscountChange"
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
                @input="totalDiscountChange"
              />
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
                    @click="handleCalculate"
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
        :fomType="'Sales Order'"
      />
    </div>

    <ExpenseItemDlg ref="ExpenseItemDlg" :formData="formData" :comDisFrom="true" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import TradingProductTable from './TradingProductTable'
import ConsignmentProductTable from './ConsignmentProductTable'
import ServiceProductTable from './ServiceProductTable'
import ProjectTable from './ProjectTable'
import ProjectCostTable from './ProjectCostTable'
import ExpenseItemDlg from '@/views/salesManagement/salesInquiry/productInfo/ExpenseItemDlg.vue'
import materialList from './materialList'
import ProjectTable1 from './ProjectTable1'
import mixDesign from './mixDesign'
import materialListMixDesign from './materialListMixDesign'
import projectTaskMixDesign from './projectTaskMixDesign'
import ServiceTypeProductTable from './ServiceTypeProductTable.vue'

import paper from '@/views/salesManagement/questionnaireTemplate/components/paper.vue'
import { calculate } from '@/api/salesManagement/salesQuotation'
import { queryCustomerQuestionnaireById } from '@/api/salesManagement/customerQuestionnaire'
import contentEditor from '@/views/system/emailManagement/editor/editor'
import projectCostDetails from './project/projectCostDetails.vue'

export default {
  mixins: [pageMixin],
  components: {
    ProjectTable,
    TradingProductTable,
    ConsignmentProductTable,
    ServiceProductTable,
    ProjectCostTable,
    ServiceTypeProductTable,
    paper,
    ExpenseItemDlg,
    contentEditor,
    materialList,
    ProjectTable1,
    mixDesign,
    materialListMixDesign,
    projectTaskMixDesign,
    projectCostDetails
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
    },
    buttonAuthMsg: {
      type: Object,
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
        } else if (newValue === 'Service') {
          this.activeName = 'ServiceTypeProduct'
        } else if (newValue === 'Trading') {
          this.activeName = 'ServiceTypeProduct'
        } else if (newValue === 'Consignment') {
          this.activeName = 'Consignment'
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
    },
    'formData.salesOrderProjectList': {
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
          }, */
        ]
      } else if (this.salesQuotationType === 'Trading') {
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
      } else if (this.salesQuotationType === 'Project') {
        /* list = [
          {
            label: this.$t('SALES.project'),
            key: 'project1'
          },
          {
            label: this.$t('SALES.materialList'),
            key: 'materialList'
          }
        ] */
        if (this.formData && this.formData.isSalesInquiryProject === '1') {
          list = [
            {
              label: this.$t('SALES.productDetail'),
              key: 'productDetail'
            },
            {
              label: this.$t('SALES.costDetails'),
              key: 'projectCostDetails'
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
    totalDiscountChange() {},
    handleCalculate() {
      const params = {
        ...this.totalForm,
        salesOrderProductList: this.totalForm.salesOrderProductList,
        salesOrderServiceList: this.totalForm.salesOrderServiceList
      }
      const timer = Date.now()
      this.queryTotalTime = timer
      calculate(params).then((res) => {
        if (this.queryTotalTime === timer) {
          const data = res.data || {}
          this.$set(this.totalForm, 'subTotal', data.subTotal)
          this.$set(this.totalForm, 'totalFreight', data.totalFreight)
          this.$set(this.totalForm, 'totalTaxAmount', data.totalTaxAmount)
          this.$set(this.totalForm, 'totalAmount', data.totalAmount)
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
