<template>
  <FormPageLayoutTabs>
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
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
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="16">
                  <el-form-item
                    :label="`${$t('PRODUCT.productCategory1')}`"
                    prop="productCategoryIdList"
                    v-if="!comDisFrom"
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
                  <el-form-item :label="`${$t('PRODUCT.productName')}`" prop="productName">
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
                      disabled
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
                  <el-form-item :label="`${$t('PRODUCT.serviceType')}`" prop="serviceType">
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
  </FormPageLayoutTabs>
</template>

<script>
import {
  reviseProduct,
  queryProductById,
  checkInventoryUom
} from '@/api/productManagement/productInfo'
import { queryAllUomListByLocalization } from '@/api/system/uom'

import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import { queryActiveProductCategoryTreeList } from '@/api/productManagement/productCategory'

export default {
  dicts: ['ivt_product_status', 'service_type', 'valuation_unit'],
  mixins: [pageMixin],
  components: { FormPageLayoutTabs, SystemOperationLogTable },
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
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
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
      productCategoryData: [],
      allUomList: [],
      deptOptions: [],
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
    },
    isView: {
      type: Boolean,
      default: false
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
      if (this.isView) {
        return true
      }
      if (this.rowId) {
        return !this.editAuth
      }
      return false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    handleUpdate() {
      this.reset()
      this.queryAllUomList()
      const rowId = this.rowId
      queryProductById(rowId).then((res) => {
        const data = res.data || {}
        setTimeout(() => {
          this.$refs.uploadRef.initFileList(data.commonFileList || [])
        }, 500)
        data.purposeList = data.purpose ? data.purpose.split(',') : []

        this.form = data
        const ivtSpecifications = data.ivtSpecifications || {}
        this.$set(this.form, 'uom', ivtSpecifications.uom || undefined)
        this.queryActiveProductCategoryTreeList(data.categoryIdList || [])
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
      console.log('1')
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)

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

    // 取消按钮
    cancel() {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/productManagement/productInfo' })
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

        this.$modal
          .confirm(this.$t('PRODUCT.productSubmit'))
          .then(() => {
            return reviseProduct(param)
          })
          .then((res) => {
            this.$modal.msgSuccess(this.$t('PRODUCT.productSuccess').replace('$1', res.msg))
            this.cancel()
          })
          .catch(() => {})
      }
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
