<template>
  <FormPageLayoutTabs>
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        v-if="!comDisFrom && !approvedBtnShow"
        @click="submitForm(false)"
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
      <el-button type="primary" size="mini" v-if="reviseBtnShow" @click="handleRevise"
        >{{ $t('uiBtn.revise') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="buttonAuthMsg.isCanSeeUpdateMsg === '1'"
        @click="revisionComparison"
        >{{ $t('uiBtn.revisionComparison') }}</el-button
      >
      <el-dropdown
        class="ml10 mr10 fr"
        @command="(command) => settingHandleCommand(command)"
        trigger="click"
        v-if="bpHistoryVersionList.length > 0 && comeFrom === '1'"
        @visible-change="dropdownVisibleChange"
      >
        <el-button size="mini" type="primary">
          {{ $t('uiBtn.revisionRecord') }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-scrollbar :noresize="false" ref="scrollbar">
            <div style="max-height: 200px">
              <el-dropdown-item
                :command="item.businessId"
                v-for="item in bpHistoryVersionList"
                :key="item.businessId"
                >{{ item.businessNo }}
              </el-dropdown-item>
            </div>
          </el-scrollbar>
        </el-dropdown-menu>
      </el-dropdown>
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">{{ $t('menu.productInfo') }}</div>
    </template>
    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <div class="form-card">
          <el-collapse-item name="1">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('ui.basicInfo')"
              :warning="collapseWarningForBasicInfo"
            >
              <!-- <span class="info-item mr20" :title="form.productName">
                {{ $t('PRODUCT.productName') }} : {{ form.productName }}
              </span>
              <span class="info-item">
                {{ $t('ui.status') }} :
                {{ selectDictLabel(dict.type.ivt_product_status, form.productStatus) }}
              </span> -->
            </FormCollapseItemTitle>
            <el-form
              ref="form1"
              :model="form"
              @submit.native.prevent
              :rules="rules"
              label-width="140px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="16">
                  <el-form-item
                    :label="`${$t('PRODUCT.productCategory1')}`"
                    prop="productCategoryIdList"
                    v-if="!comDisFrom"
                    :class="[isModified('categoryNameShowStr')]"
                    key="productCategory11"
                  >
                    <el-cascader
                      :show-all-levels="true"
                      placeholder=""
                      v-model="form.productCategoryIdList"
                      :options="productCategoryData"
                      :props="{
                        multiple: true,
                        value: 'id',
                        label: 'categoryName',
                        children: 'child',
                        checkStrictly: true
                      }"
                      clearable
                      :collapse-tags="true"
                      popper-class="hide-cascader-scrollbar"
                      style="width: 100%"
                      filterable
                      class="cascader"
                    >
                      <template #default="{ node }">
                        <span :title="node.label">{{ node.label }}</span>
                      </template>
                    </el-cascader>
                  </el-form-item>
                  <el-form-item
                    v-else
                    :label="`${$t('PRODUCT.productCategory1')}`"
                    required
                    key="productCategory22"
                    :class="[isModified('categoryNameShowStr')]"
                  >
                    <ToolTipShowCategory :list="form.categoryNameList || []">
                      <el-input :value="form.categoryNameShowStr" disabled></el-input>
                    </ToolTipShowCategory>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.status')}`">
                    <el-input
                      :value="selectDictLabel(dict.type.ivt_product_status, form.productStatus)"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="16">
                  <el-form-item
                    :label="`${$t('PRODUCT.productName')}`"
                    prop="productName"
                    :class="[isModified('productName')]"
                  >
                    <el-input v-model="form.productName" maxlength="200"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.internalPartNo')}`">
                    <el-input v-model="form.internalPartNo" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.alias')}`" :class="[isModified('alias')]">
                    <el-input v-model="form.alias" maxlength="200"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.productClass')}`" required>
                    <el-input :value="$t('PRODUCT.service')" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('PRODUCT.uom1')}`"
                    prop="uom"
                    :class="[isModified('uom', 2)]"
                  >
                    <CommonSelect
                      :disabled="comDisFrom"
                      :id="form.uom"
                      :label="form.uom"
                      :title="showUomLabel(form.uom)"
                      idKey="uomName"
                      labelKey="uomName"
                      filterable
                      :options="allUomList || []"
                      @change="changeUom"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.description')" :class="[isModified('description')]">
                    <el-tooltip
                      ref="tooltip"
                      :enterable="true"
                      class="item"
                      effect="light"
                      placement="top"
                      :manual="false"
                      :disabled="isFocus || !form.description"
                    >
                      <div slot="content" class="desc-tooltip">
                        <div
                          v-if="form.description"
                          style="line-height: 20px; white-space: pre-wrap"
                        >
                          <div>{{ form.description }}</div>
                        </div>
                      </div>
                      <slot>
                        <div>
                          <MyInput
                            type="textarea"
                            v-model="form.description"
                            :autosize="{ minRows: 2, maxRows: 8 }"
                            resize="none"
                            show-word-limit
                            :maxlength="7000"
                            @focus="isFocus = true"
                            @blur="isFocus = false"
                          ></MyInput>
                        </div>
                      </slot>
                    </el-tooltip>
                    <!-- <MyInput
                      type="textarea"
                      v-model="form.description"
                      :autosize="{ minRows: 2, maxRows: 8 }"
                      resize="none"
                      show-word-limit
                      :maxlength="7000"
                    ></MyInput> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.type')}`" prop="serviceType">
                    <el-radio-group v-model="form.serviceType" disabled>
                      <el-radio
                        v-for="dict in dict.type.service_type"
                        :key="dict.value"
                        :label="dict.value"
                      >
                        {{ dict.label }}</el-radio
                      >
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('PRODUCT.purpose')}`"
                    :class="[isModified('purpose')]"
                    prop="purposeList"
                  >
                    <el-checkbox-group v-model="form.purposeList" style="height: 36px">
                      <el-checkbox label="1">{{ $t('PRODUCT.purchase') }}</el-checkbox>
                      <el-checkbox label="2">{{ $t('PRODUCT.sales') }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.isActive')}`" :class="[isModified('isActive')]">
                    <el-switch
                      v-model="form.isActive"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('PRODUCT.includeDecimal')}`"
                    :class="[isModified('includeDecimal')]"
                  >
                    <el-switch
                      v-model="form.includeDecimal"
                      active-value="1"
                      inactive-value="0"
                      :disabled="comIsRevise"
                    ></el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
        <div class="form-card mt10" v-if="false">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PRODUCT.priceInformation')"
              :warning="collapseWarningForPriceInformation"
            >
            </FormCollapseItemTitle>
            <el-form
              ref="form2"
              :model="form"
              @submit.native.prevent
              :rules="rules"
              label-width="140px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.productType')}`" prop="serviceType">
                    <el-radio-group v-model="form.serviceType" disabled>
                      <el-radio
                        v-for="dict in dict.type.service_type"
                        :key="dict.value"
                        :label="dict.value"
                      >
                        {{ dict.label }}</el-radio
                      >
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('PRODUCT.valuation')" :required="true">
                    <div class="input-switch-box">
                      <div class="con-left">
                        <el-form-item
                          prop="valuationAmount"
                          :rules="[
                            {
                              required: form.serviceType === 'Internal',
                              message: $t('ui.reqMsg'),
                              trigger: ['blur']
                            }
                          ]"
                          :show-message="false"
                          :class="[isModified('valuationAmount')]"
                        >
                          <div style="display: flex">
                            <el-input-number
                              style="z-index: 10"
                              v-model="form.valuationAmount"
                              :disabled="form.serviceType !== 'Internal'"
                              :precision="2"
                              v-thousandSplit="{ precision: 2 }"
                              type="number"
                              :min="0"
                              :max="999999999999.99"
                              class="w100"
                              @change="inputNumberChange('valuationAmount')"
                              @blur="inputNumberChange('valuationAmount')"
                              :controls="false"
                              controls-position="right"
                            />
                            <div class="unit">{{ form.valuationCurrencySymbol }}</div>
                          </div>
                        </el-form-item>
                      </div>
                      <span style="padding: 0 4px">/</span>
                      <div class="con-right" style="width: 40%; margin-left: 0">
                        <el-form-item
                          prop="valuationUnit"
                          :show-message="false"
                          :class="[isModified('valuationUnit')]"
                        >
                          <el-select
                            v-model="form.valuationUnit"
                            @change="valuationUnitChange"
                            class="w100"
                            placeholder=""
                          >
                            <el-option
                              v-for="dict in dict.type.valuation_unit"
                              :key="dict.value"
                              :label="dict.label"
                              :value="dict.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </div>
                    <transition name="el-zoom-in-top">
                      <div v-if="form.valuationReq" class="el-form-item__error">
                        {{ $t('ui.reqMsg') }}
                      </div>
                    </transition>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.remarks')" :class="[isModified('remarks')]">
                    <MyInput
                      type="textarea"
                      v-model="form.remarks"
                      :autosize="{ minRows: 2, maxRows: 8 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
        <div class="form-card mt10">
          <el-collapse-item name="4">
            <template slot="title">
              <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
              <strong>{{ $t('ui.attachment') }}</strong>
            </template>
            <el-row>
              <el-col :span="24">
                <div class="mb20" :class="[isModified('attachment')]">
                  <myUpload ref="uploadRef" :disabled="comDisFrom" />
                </div>
              </el-col>
            </el-row>
          </el-collapse-item>
        </div>
        <div class="form-card mt10">
          <el-collapse-item name="5">
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
    </template>

    <ApprovedDialog
      :id="form.productMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
      :formData="approvedFormData"
      formDataKey="ivtProduct"
    />
    <RejectDialog
      :id="form.productMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.productMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <RevisionComparisonDlg ref="RevisionComparisonDlg" />
  </FormPageLayoutTabs>
</template>

<script>
import {
  saveProduct,
  saveDraftProduct,
  queryProductById,
  approvedProduct,
  rejectedProduct,
  cancelledProduct,
  withdrawApproved,
  queryProductHistoryVersion,
  checkInventoryUom
} from '@/api/productManagement/productInfo'
import { queryAllUomListByLocalization } from '@/api/system/uom'
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import RevisionComparisonDlg from '@/views/productManagement/service/revisionComparisonDlg.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import { queryActiveProductCategoryTreeList } from '@/api/productManagement/productCategory'
export default {
  dicts: ['ivt_product_status', 'service_type', 'valuation_unit'],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    RevisionComparisonDlg,
    SystemOperationLogTable
  },
  data() {
    return {
      isFocus: false,
      activeNames: [],
      rowId: '',
      timeId: '',
      // 是否自动生成 EmployeeNo
      deptOptions: [],
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForPriceInformation: false,
      collapseWarningForSupplierInfo: false,
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0'
      },
      rules: {
        productCategoryIdList: [
          {
            required: true,
            type: 'array',
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['change']
          }
        ],
        productName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ],

        valuationUnit: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        uom: [
          {
            required: true,
            // eslint-disable-next-line
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ],
        purposeList: [
          {
            required: true,
            type: 'array',
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ]
      },
      bpAddressRows: [
        {
          label: this.$t('INVENTORY.label'),
          showLabel: 'label'
        },
        {
          label: this.$t('organization.address1'),
          showLabel: 'address1'
        },
        {
          label: this.$t('organization.address2'),
          showLabel: 'address2'
        },
        {
          label: this.$t('organization.city'),
          showLabel: 'city'
        },
        {
          label: this.$t('organization.province'),
          showLabel: 'province'
        },
        {
          label: this.$t('organization.postalCode'),
          showLabel: 'postalCode'
        },
        {
          label: this.$t('organization.country'),
          showLabel: 'country'
        }
      ],

      productCategoryData: [],
      allUomList: [],
      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedProduct,
      rejectedUrl: rejectedProduct,
      cancelledUrl: cancelledProduct,
      approvedFormData: undefined,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      ivtSpecificationsUpdateProps: [],
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

    editAuth() {
      return this.checkPermi(['productManagement:productInfo:edit'])
    },
    comDisFrom() {
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.productMainId &&
        this.buttonAuthMsg.isCanUpdate === '1'
      ) {
        dis = false
      }
      return dis
    },
    saveDraftBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.productMainId &&
        this.buttonAuthMsg.isCanSaveDraft === '1'
      ) {
        show = true
      }
      return show
    },
    comIsRevise() {
      return this.form.isRevise === '1'
    },
    reviseBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        this.form.productMainId &&
        this.buttonAuthMsg.isCanRevise === '1' &&
        this.comeFrom === '1'
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
        this.form.productMainId &&
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
        this.form.productMainId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.productMainId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['productManagement:productInfo:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.productMainId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    modifyHighlight() {
      if (this.approvedBtnShow && this.buttonAuthMsg.isCanSeeUpdateMsg === '1') {
        return true
      }
      return false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.productMainId,
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
      const rowId = this.rowId
      this.queryAllUomList()
      this.queryProductHistoryVersion()
      queryProductById(rowId, this.taskId).then((res) => {
        const data = res.data || {}
        setTimeout(() => {
          this.$refs.uploadRef.initFileList(data.commonFileList || [])
        }, 300)
        data.purposeList = data.purpose ? data.purpose.split(',') : []

        this.form = data
        const ivtSpecifications = data.ivtSpecifications || {}
        this.$set(this.form, 'uom', ivtSpecifications.uom || undefined)
        this.queryActiveProductCategoryTreeList(data.categoryIdList || [])

        this.buttonAuthMsg = data.buttonAuthMsg || {}

        /* 版本比对 */
        const updateMsg = data.updateMsg || {}
        const ivtSpecificationsUpdateMsgList = updateMsg.ivtSpecificationsUpdateMsgList || []
        const basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
        const beforeCommonFileList = updateMsg.beforeCommonFileList || []
        const afterCommonFileList = updateMsg.afterCommonFileList || []

        setTimeout(() => {
          this.basicUpdateProps = basicUpdateMsgList.map((item) => item.name)
          this.ivtSpecificationsUpdateProps = ivtSpecificationsUpdateMsgList.map(
            (item) => item.name
          )
          if (beforeCommonFileList.length > 0 || afterCommonFileList.length > 0) {
            this.basicUpdateProps.push('attachment')
          }
        }, 100)
        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },
    reset() {
      this.form = {
        productName: undefined,
        productStatus: undefined,
        alias: undefined,
        description: undefined,
        isActive: '0',
        includeDecimal: '0',
        productType: '2',
        serviceType: 'Internal',
        purposeList: [],
        valuationAmount: undefined,
        valuationCurrencySymbol: undefined,
        valuationUnit: undefined,
        remarks: undefined,
        businessPartnerMainId: undefined,
        bpBusinessContactPersonId: undefined,
        bpContactPersonName: undefined,
        bpMobilePhone: undefined,
        bpEmail: undefined,
        bpBusinessAddressId: undefined,
        bpAddress: undefined
      }

      this.collapseWarningForBasicInfo = false
      this.collapseWarningForPriceInformation = false
      this.collapseWarningForSupplierInfo = false
      this.activeNames = ['1', '2', '3', '4', '5']

      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.basicUpdateProps = []
      this.ivtSpecificationsUpdateProps = []
      this.bpHistoryVersionList = []

      this.resetForm('form1')
      // this.resetForm('form2')
    },

    queryActiveProductCategoryTreeList(id = []) {
      queryActiveProductCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.productCategoryData = arr
        if (id) {
          const ids = this.findParentChains(this.productCategoryData, id) || []
          this.$set(this.form, 'productCategoryIdList', ids)
          this.$refs.form1 && this.$refs.form1.clearValidate('productCategoryIdList')
        }
      })
    },
    /**
     * 在树形结构中根据ID数组查找所有父级链ID
     * @param {Array} tree - 树形结构数组
     * @param {Array} ids - 需要查找的ID数组
     * @returns {Array} 二维ID数组集合，每个元素包含ID及其所有父级ID
     */
    findParentChains(tree, ids) {
      const result = []
      // 遍历每个ID
      ids.forEach((id) => {
        // 查找ID对应的所有父级ID
        const parentChain = this.findParentIds(tree, id)
        if (parentChain.length > 0) {
          result.push(parentChain)
        }
      })
      return result
    },
    /**
     * 递归查找指定ID的所有父级ID
     * @param {Array} tree - 树形结构数组
     * @param {number} targetId - 目标ID
     * @param {Array} parents - 父级ID数组（递归使用）
     * @returns {Array} 包含目标ID及其所有父级ID的数组
     */
    findParentIds(tree, targetId, parents = []) {
      for (const node of tree) {
        // 复制当前父级链并添加当前节点ID
        const currentParents = [...parents, node.productCategoryId]

        if (node.productCategoryId === targetId) {
          // 找到目标ID，返回包含所有父级ID的数组
          return currentParents
        }

        if (node.child && node.child.length > 0) {
          // 递归查找子节点
          const result = this.findParentIds(node.child, targetId, currentParents)
          if (result.length > 0) {
            return result
          }
        }
      }

      // 未找到目标ID，返回空数组
      return []
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          if (x.child && x.child.length > 0) {
            this.handle(x.child)
          } else {
            x.child = undefined
          }
        })
      }
    },

    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    /* 表单部分 */
    inputNumberChange(code) {
      if (code === 'valuationAmount') {
        this.form.valuationAmountValid = true
        this.validValuation()
      }
      // this.$refs.form2.validateField(code)
    },
    valuationUnitChange() {
      this.form.valuationUnitValid = true
      this.validValuation()
    },
    validValuation(type) {
      if (type === 'submit') {
        this.form.valuationAmountValid = true
        this.form.valuationUnitValid = true
      }
      const req1 =
        !this.$resultOfBoolean(this.form.valuationAmount) && this.form.serviceType === 'Internal'
      const req2 = !this.$resultOfBoolean(this.form.valuationUnit)
      if ((req1 && this.form.valuationAmountValid) || (req2 && this.form.valuationUnitValid)) {
        this.$set(this.form, 'valuationReq', true)
      } else {
        this.$set(this.form, 'valuationReq', false)
      }
    },
    queryAllUomList() {
      queryAllUomListByLocalization({}).then((res) => {
        this.allUomList = res.data || []
      })
    },
    changeUom(row) {
      const timer = Date.now()
      this.queryTimer = timer
      if (row.uomName) {
        if (!this.comIsRevise) {
          this.$set(this.form, 'uom', row.uomName)
          return
        }
        checkInventoryUom({ productMainId: this.rowId, inventoryUom: row.uomName })
          .then((res) => {
            if (this.queryTimer !== timer) return
            const data = res.data || {}
            if (data.legalEntityNames) {
              this.$modal.msgError(
                this.$t('PRODUCT.inventoryUomExtendedTip').replace('$1', data.legalEntityNames)
              )
            } else {
              this.$set(this.form, 'uom', row.uomName)
            }
          })
          .catch(() => {})
      } else {
        this.$set(this.form, 'uom', undefined)
      }
    },

    /* 供应商部分 */

    async submitForm(isApproved = false) {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }

      setTimeout(() => {
        this.validValuation('submit')
      }, 100)

      // const valid2 = await this.$refs.form2.validate().catch((err) => {
      //   return err
      // })

      // this.collapseWarningForPriceInformation = !valid2

      // if (!valid2) {
      //   this.$modal.msgError(
      //     this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.priceInformation'))
      //   )
      //   return
      // }

      if (valid1) {
        let param = { ...this.form }
        param.ivtSpecifications = param.ivtSpecifications || {}
        param.ivtSpecifications.uom = this.form.uom
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.purpose = param.purposeList.join(',')
        if (param.productCategoryIdList) {
          param.categoryIdList = param.productCategoryIdList.map((x) => x[x.length - 1])
          param.productCategoryId = param.categoryIdList[0]
        }
        param.commonFileList = myFileIds

        if (isApproved) {
          // 审批流带提交功能
          this.approvedFormData = param
          this.aplVisible = true
          return
        }

        this.$modal
          .confirm(this.$t('PRODUCT.productSubmit'))
          .then(() => {
            return saveProduct(param)
          })
          .then((res) => {
            this.$modal.msgSuccess(this.$t('PRODUCT.productSuccess').replace('$1', res.msg))
            this.back()
          })
          .catch(() => {})
      }
    },

    saveDraftClearValidValuation() {
      this.form.valuationAmountValid = false
      this.form.valuationUnitValid = false
      this.$set(this.form, 'valuationReq', false)
    },

    handleSaveDraft() {
      this.$refs.form1.clearValidate()
      // this.$refs.form2.clearValidate()
      this.saveDraftClearValidValuation()
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      this.collapseWarningForPriceInformation = false
      this.collapseWarningForSupplierInfo = false
      let isError = false
      this.$refs.form1.validateField(['productCategoryIdList', 'productName'], (err) => {
        if (err) {
          isError = true
        }
      })
      if (isError) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        this.collapseWarningForBasicInfo = true
        return
      }
      this.collapseWarningForBasicInfo = false
      if (!isError) {
        let param = { ...this.form }
        param.ivtSpecifications = param.ivtSpecifications || {}
        param.ivtSpecifications.uom = this.form.uom
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.purpose = param.purposeList.join(',')
        if (param.productCategoryIdList) {
          param.categoryIdList = param.productCategoryIdList.map((x) => x[x.length - 1])
          param.productCategoryId = param.categoryIdList[0]
        }
        param.commonFileList = myFileIds
        this.$modal
          .confirm(this.$t('PRODUCT.productDraftSubmit'))
          .then(() => {
            return saveDraftProduct(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(
              this.$t('PRODUCT.productDraftSuccess').replace('$1', param.productName)
            )
            this.back()
          })
          .catch(() => {})
      }
    },

    handleRevise() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: '/productManagement/reviseService',
        query: {
          id: this.form.productMainId,
          timeId: Date.now()
        }
      })
    },
    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.rowId)
    },
    isModified(prop, type = 1) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (type === 1) {
        if (this.basicUpdateProps.includes(prop)) {
          return 'edit-outline'
        }
      } else if (type === 2) {
        if (this.ivtSpecificationsUpdateProps.includes(prop)) {
          return 'edit-outline'
        }
      }
    },
    queryProductHistoryVersion() {
      if (this.comeFrom !== '1') return
      queryProductHistoryVersion({ businessId: this.rowId }).then((res) => {
        this.bpHistoryVersionList = res.data || []
      })
    },
    settingHandleCommand(businessId) {
      this.$router.push({
        path: '/productManagement/viewService',
        query: {
          id: businessId,
          timeId: Date.now()
        }
      })
    },
    dropdownVisibleChange() {
      /* 下拉菜单关闭后滚动条 手动还原 */
      if (this.$refs.scrollbar) {
        this.$refs.scrollbar.moveY = 0
      }
    },

    /* 审批 */
    handleApproved() {
      if (this.comDisFrom) {
        this.approvedFormData = undefined
        this.aplVisible = true
      } else {
        this.submitForm(true)
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
          `${this.$t('PRODUCT.product')} [${vm.form.productName}]`
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
          `${this.$t('PRODUCT.product')} [${vm.form.productName}]`
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
          `${this.$t('PRODUCT.product')} [${vm.form.productName}]`
        )
      )
      vm.back('onCancelSuccess')
    }
  }
}
</script>
<style lang="scss" scoped>
.unit {
  flex-shrink: 0;
  width: 40px;
  text-align: center;
  background-color: #f5f7fa;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}
</style>
