<template>
  <FormPageLayoutTabs>
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
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
            </FormCollapseItemTitle>
            <el-form
              ref="form1"
              :model="form"
              @submit.native.prevent
              :rules="rules"
              label-width="140px"
            >
              <el-row>
                <el-col :span="16">
                  <el-form-item
                    :label="`${$t('PRODUCT.productCategory1')}`"
                    prop="productCategoryIdList"
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
                      class="cascader"
                      popper-class="hide-cascader-scrollbar"
                      style="width: 100%"
                      filterable
                      @visible-change="productCategoryVisibleChange"
                    >
                      <template #default="{ node }">
                        <span :title="node.label">{{ node.label }}</span>
                      </template>
                    </el-cascader>
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
                  <el-form-item :label="`${$t('PRODUCT.productName')}`" prop="productName">
                    <el-input v-model="form.productName" maxlength="200"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('PRODUCT.internalPartNo')}`"
                    :rules="[
                      {
                        required: form.isAutoInternalPartNo === '0',
                        pattern: new RegExp(/^(?!(\s+$))/g),
                        message: $t('ui.reqMsg').replace('$1', $t('ui.internalPartNo')),
                        trigger: ['blur']
                      }
                    ]"
                    prop="internalPartNo"
                  >
                    <div class="input-switch-box">
                      <div class="con-left">
                        <el-input
                          :disabled="form.isAutoInternalPartNo === '1'"
                          v-model="form.internalPartNo"
                          :title="form.internalPartNo"
                          maxlength="50"
                        />
                      </div>
                      <div class="con-right">
                        <el-switch
                          v-model="form.isAutoInternalPartNo"
                          active-value="1"
                          inactive-value="0"
                          @change="changeEmployeeNoSwitch('internalPartNo')"
                        ></el-switch>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.alias')}`">
                    <el-input v-model="form.alias" maxlength="200"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.productClass')}`" required>
                    <el-input :value="$t('PRODUCT.service')" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.uom1')}`" prop="uom">
                    <el-select
                      v-model="form.uom"
                      :title="showUomLabel(form.uom) || form.uom"
                      placeholder=""
                      filterable
                      clearable
                      style="width: 100%"
                    >
                      <el-option v-for="item in allUomList" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.description')">
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
                        <div :class="{ 'tooltip-row': true }">
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
                    <el-radio-group v-model="form.serviceType" @change="serviceTypeChange">
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
                  <el-form-item :label="`${$t('PRODUCT.purpose')}`" prop="purposeList">
                    <el-checkbox-group v-model="form.purposeList" style="height: 36px">
                      <el-checkbox label="1">{{ $t('PRODUCT.purchase') }}</el-checkbox>
                      <el-checkbox label="2">{{ $t('PRODUCT.sales') }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.isActive')}`">
                    <el-switch
                      v-model="form.isActive"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.includeDecimal')}`">
                    <el-switch
                      v-model="form.includeDecimal"
                      active-value="1"
                      inactive-value="0"
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
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.productType')}`" prop="serviceType">
                    <el-radio-group v-model="form.serviceType" @change="serviceTypeChange">
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
                        >
                          <div style="display: flex">
                            <el-input-number
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
                        <el-form-item prop="valuationUnit" :show-message="false">
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
                  <el-form-item :label="$t('ui.remarks')">
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
                <div class="mb20">
                  <myUpload ref="uploadRef" />
                </div>
              </el-col>
            </el-row>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayoutTabs>
</template>

<script>
import { queryBusinessGroupCurrency } from '@/api/productManagement/service'

import {
  saveDraftProduct,
  saveProduct,
  getTempInternalPartNo
} from '@/api/productManagement/productInfo'
import { queryActiveServiceCategoryTreeList } from '@/api/productManagement/productCategory'

import { queryAllUomListByLocalization } from '@/api/system/uom'
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'

export default {
  dicts: ['ivt_product_status', 'service_type', 'valuation_unit'],
  mixins: [pageMixin],
  components: { FormPageLayoutTabs },
  data() {
    return {
      isFocus: false,
      activeNames: [],
      rowId: '',
      timeId: '',
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForPriceInformation: false,
      collapseWarningForSupplierInfo: false,
      rules: {
        productCategoryIdList: [
          {
            required: true,
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
      deptOptions: [],
      productCategoryData: [],
      allUomList: [],
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
      ]
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
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.rowId = this.propRowId
        this.handleAdd()
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    productCategoryVisibleChange(e) {
      const { productCategoryIdList, isAutoInternalPartNo } = this.form
      if (!e) {
        if (isAutoInternalPartNo === '1' && productCategoryIdList.length > 0) {
          const categoryIdList = productCategoryIdList.map((x) => x[x.length - 1])
          const productCategoryId = categoryIdList[0]
          getTempInternalPartNo({ productCategoryId })
            .then((res) => {
              this.$set(this.form, 'internalPartNo', res.msg || '')
            })
            .catch(() => {})
        } else {
          this.$set(this.form, 'internalPartNo', undefined)
        }
      }
    },
    changeEmployeeNoSwitch(code) {
      this.$set(this.form, code, '')
      this.productCategoryVisibleChange(false)
      if (this.$refs.form1) {
        this.$nextTick(() => {
          this.$refs.form1.clearValidate(code)
        })
      }
    },
    handleAdd() {
      this.reset()
      this.queryAllUomList()
      this.queryActiveServiceCategoryTreeList()
      this.queryBusinessGroupCurrency()
    },
    reset() {
      this.form = {
        productName: undefined,
        productStatus: undefined,
        alias: undefined,
        description: undefined,
        isActive: '1',
        includeDecimal: '0',
        productType: '2',
        serviceType: 'Internal',
        purposeList: ['2'],
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
        bpAddress: undefined,
        isAutoInternalPartNo: '1'
      }

      this.collapseWarningForBasicInfo = false
      this.collapseWarningForPriceInformation = false
      this.collapseWarningForSupplierInfo = false
      this.activeNames = ['1', '2', '3', '4']

      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)

      this.resetForm('form1')
      // this.resetForm('form2')
    },
    inputNumberChange(code) {
      if (code === 'valuationAmount') {
        this.form.valuationAmountValid = true
        this.validValuation()
      }
      // this.$refs.form2.validateField(code)
    },
    queryActiveServiceCategoryTreeList() {
      queryActiveServiceCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.productCategoryData = arr
      })
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
    saveDraftClearValidValuation() {
      this.form.valuationAmountValid = false
      this.form.valuationUnitValid = false
      this.$set(this.form, 'valuationReq', false)
    },

    serviceTypeChange() {
      if (this.form.serviceType === 'Internal') {
        this.form.purposeList = ['2']
      } else {
        this.form.purposeList = ['1', '2']
        this.$set(this.form, 'valuationAmount', undefined)
        this.$set(this.form, 'valuationReq', false)
        // this.$refs.form2.clearValidate('valuationAmount')
      }
    },

    /* 供应商部分 */

    handleClick() {},
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/productManagement/productInfo' })
    },
    queryAllUomList() {
      queryAllUomListByLocalization({}).then((res) => {
        this.allUomList = (res.data || []).map((x) => x.uomName)
      })
    },

    queryBusinessGroupCurrency() {
      queryBusinessGroupCurrency().then((res) => {
        const data = res.data || {}
        this.$set(this.form, 'valuationCurrencyId', data.id)
        this.$set(this.form, 'valuationCurrencyCode', data.currencyCode)
        this.$set(this.form, 'valuationCurrencySymbol', data.currencySymbol)
      })
    },

    async submitForm() {
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
        if (param.isAutoInternalPartNo === '1') {
          delete param.internalPartNo
        }
        this.$modal
          .confirm(this.$t('PRODUCT.productSubmit'))
          .then(() => {
            return saveProduct(param)
          })
          .then((res) => {
            this.$modal.msgSuccess(this.$t('PRODUCT.productSuccess').replace('$1', res.msg))
            this.cancel()
          })
          .catch(() => {})
      }
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
        if (param.isAutoInternalPartNo === '1') {
          delete param.internalPartNo
        }
        this.$modal
          .confirm(this.$t('PRODUCT.productDraftSubmit'))
          .then(() => {
            return saveDraftProduct(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(
              this.$t('PRODUCT.productDraftSuccess').replace('$1', param.productName)
            )
            this.cancel()
          })
          .catch(() => {})
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.cascader ::v-deep .el-cascader__tags {
  flex-wrap: nowrap;
}
.cascader ::v-deep .el-cascader__tags > span {
  display: flex;
  max-width: calc(100% - 100px);
}
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
