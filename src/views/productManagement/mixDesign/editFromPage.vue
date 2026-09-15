<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <!-- <el-button
        type="primary"
        size="mini"
        v-if="updateCostShow && !isView"
        :loading="btnLoading"
        @click="handleUpdateCost"
        >{{ $t('menu.updateCost') }}
      </el-button> -->
      <!-- <el-button
        type="primary"
        size="mini"
        v-if="withdrawBtnShow && !comDisFrom"
        :loading="btnLoading"
        @click="handleWithdraw"
        >{{ $t('menu.withdraw') }}
      </el-button> -->
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <div>
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
                    <el-form-item :label="$t('PRODUCT.zone')" prop="zoneId">
                      <el-input v-model="form.zoneName" :title="form.zoneName" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(dict.type.mdm_mix_design_status, form.mixDesignStatus)
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.mixDesignCode')" prop="mixDesignCode">
                      <el-input v-model="form.mixDesignCode" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.mixDesignName')" prop="mixDesignName">
                      <el-input v-model="form.mixDesignName" maxlength="100" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('ui.type')" prop="type">
                      <el-select
                        style="width: 100%"
                        v-model="form.type"
                        placeholder=""
                        :disabled="!!form.mixDesignId"
                        clearable
                      >
                        <el-option
                          v-for="item in dict.type.mdm_mix_design_type"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.productCode1')}`" prop="productCode">
                      <el-input v-model="form.productCode" maxlength="50" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('PRODUCT.strengthClass')"
                      prop="strengthClass"
                      :rules="[
                        {
                          required: form.concreteTest === '1',
                          pattern: new RegExp(/^(?!(\s+$))/g),
                          message: $t('ui.reqMsg').replace('$1', $t('PRODUCT.strengthClass')),
                          trigger: ['blur']
                        }
                      ]"
                    >
                      <el-row>
                        <el-col :span="14">
                          <CommonSelect
                            v-if="sysDockingSwitchQC"
                            :id="form.strengthClassId"
                            :label="form.strengthClass"
                            idKey="strengthClassId"
                            labelKey="strengthClass"
                            :options="strengthClassOptions"
                            @change="strengthClassChange"
                          />
                          <el-input-number
                            v-else
                            style="width: 100%"
                            v-model="form.strengthClass"
                            controls-position="right"
                            :precision="1"
                            v-thousandSplit="{ precision: 1 }"
                            :min="0.1"
                            :max="999.9"
                            @change="inputNumberChange('strengthClass')"
                          />
                        </el-col>
                        <el-col :span="10">
                          <el-form-item :show-message="false">
                            <el-select
                              style="width: 100%"
                              v-model="form.strengthClassUnit"
                              placeholder=""
                              disabled
                            >
                              <el-option
                                v-for="item in dict.type.strength_class_unit"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              >
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.maxBatchLoad')" required>
                      <el-row>
                        <el-col :span="16">
                          <el-form-item :show-message="true" prop="maxBatchLoad">
                            <el-input-number
                              style="width: 100%"
                              v-model="form.maxBatchLoad"
                              controls-position="right"
                              :precision="3"
                              v-thousandSplit="{ precision: 3 }"
                              :min="0.001"
                              :max="999.999"
                              @change="inputNumberChange('maxBatchLoad')"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item :show-message="false" prop="loadUnit">
                            <el-select
                              style="width: 100%"
                              v-model="form.loadUnit"
                              :placeholder="$t('ui.unit')"
                            >
                              <el-option
                                v-for="item in dict.type.mdm_mix_design_load_unit"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              >
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <!-- <span class="el-form-item__error">aaaaaa</span> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.standardProduct')" prop="standardProduct">
                      <el-select
                        style="width: 100%"
                        v-model="form.standardProduct"
                        placeholder=""
                        clearable
                      >
                        <el-option
                          v-for="item in dict.type.mdm_mix_design_standard_product"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.dischargeFormula')" prop="dischargeFormulaId">
                      <CommonSelect
                        :id="form.dischargeFormulaId"
                        :label="form.dischargeFormula"
                        :title="form.dischargeFormula"
                        :disabled="!form.zoneId"
                        idKey="dischargeFormulaId"
                        labelKey="dischargeFormulaName"
                        :filterable="true"
                        :options="dischargeFormulaList"
                        @change="dischargeFormulaChange"
                      >
                        <template v-slot="{ item }">
                          <span class="select-left-text">{{ item.dischargeFormulaName }}</span>
                          <span class="select-right-text">{{ item.dischargeFormulaCode }}</span>
                        </template>
                      </CommonSelect>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.dcType')" prop="dcType">
                      <el-input v-model="form.dcType" maxlength="50" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.clClass')" prop="clClass">
                      <el-input v-model="form.clClass" maxlength="50" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('PRODUCT.slump')"
                      :required="form.concreteTest === '1'"
                    >
                      <el-row>
                        <el-col :span="14">
                          <el-form-item
                            :show-message="true"
                            prop="slump"
                            :rules="[
                              {
                                required: form.concreteTest === '1',
                                pattern: new RegExp(/^(?!(\s+$))/g),
                                message: $t('ui.reqMsg').replace('$1', $t('PRODUCT.slump')),
                                trigger: ['blur']
                              }
                            ]"
                          >
                            <el-input-number
                              style="width: 100%"
                              v-model="form.slump"
                              controls-position="right"
                              :precision="0"
                              v-thousandSplit="{ precision: 0 }"
                              :min="1"
                              :max="9999"
                              @change="inputNumberChange('slump')"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                          <el-form-item
                            :show-message="false"
                            prop="slumpUnit"
                            :rules="[
                              {
                                required: form.concreteTest === '1',
                                pattern: new RegExp(/^(?!(\s+$))/g),
                                message: $t('ui.reqMsg').replace('$1', $t('ui.unit')),
                                trigger: ['change', 'blur']
                              }
                            ]"
                          >
                            <el-select style="width: 100%" v-model="form.slumpUnit" placeholder="">
                              <el-option
                                v-for="item in dict.type.mdm_slump_unit"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              >
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('PRODUCT.minAcceptableSlump')"
                      prop="slumpMin"
                      :rules="[
                        {
                          required: form.concreteTest === '1',
                          pattern: new RegExp(/^(?!(\s+$))/g),
                          message: $t('ui.reqMsg').replace('$1', $t('PRODUCT.minAcceptableSlump')),
                          trigger: ['blur']
                        }
                      ]"
                    >
                      <el-input-number
                        style="width: 100%"
                        v-model="form.slumpMin"
                        controls-position="right"
                        :precision="0"
                        v-thousandSplit="{ precision: 0 }"
                        :min="1"
                        :max="9999"
                        @change="inputNumberChange('slumpMin')"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('PRODUCT.maxAcceptableSlump')"
                      prop="slumpMax"
                      :rules="[
                        {
                          required: form.concreteTest === '1',
                          pattern: new RegExp(/^(?!(\s+$))/g),
                          message: $t('ui.reqMsg').replace('$1', $t('PRODUCT.maxAcceptableSlump')),
                          trigger: ['blur']
                        }
                      ]"
                    >
                      <el-input-number
                        style="width: 100%"
                        v-model="form.slumpMax"
                        controls-position="right"
                        :precision="0"
                        v-thousandSplit="{ precision: 0 }"
                        :min="1"
                        :max="9999"
                        @change="inputNumberChange('slumpMax')"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.cementType')" prop="cementType">
                      <el-input v-model="form.cementType" maxlength="50" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('PRODUCT.cementStrengthClass')"
                      prop="cementStrengthClass"
                    >
                      <el-input v-model="form.cementStrengthClass" maxlength="50" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('PRODUCT.cementTypeStrength2')"
                      prop="cementTypeStrength2"
                    >
                      <el-input v-model="form.cementTypeStrength2" maxlength="50" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('PRODUCT.maxNominalAggregate')"
                      prop="nominalAggregateMax"
                    >
                      <el-input v-model="form.nominalAggregateMax" maxlength="50" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.minCementContent')" prop="cementContentMin">
                      <el-input v-model="form.cementContentMin" maxlength="50" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.airContent')" prop="airContent">
                      <el-input v-model="form.airContent" maxlength="50" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.specialProperties')" prop="specialProperties">
                      <el-input v-model="form.specialProperties" maxlength="50" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.maxWCRatio')" prop="wcRatioMax">
                      <el-input v-model="form.wcRatioMax" maxlength="50" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.specialAdmixture')" prop="specialAdmixture">
                      <el-input v-model="form.specialAdmixture" maxlength="100" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.density')" prop="density">
                      <el-input-number
                        style="width: 100%"
                        v-model="form.density"
                        controls-position="right"
                        :precision="2"
                        v-thousandSplit="{ precision: 2 }"
                        :min="0.01"
                        :max="9999.99"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.exposureClass')" prop="exposureClass">
                      <el-input v-model="form.exposureClass" maxlength="50" />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.tensileStrength')" prop="tensileStrength">
                      <el-row>
                        <el-col :span="14">
                          <el-input-number
                            style="width: 100%"
                            v-model="form.tensileStrength"
                            controls-position="right"
                            :precision="1"
                            v-thousandSplit="{ precision: 1 }"
                            :min="0.1"
                            :max="999.9"
                            @change="inputNumberChange('tensileStrength')"
                          />
                        </el-col>
                        <el-col :span="10">
                          <el-form-item :show-message="false" prop="tensileStrengthUnit">
                            <el-select
                              style="width: 100%"
                              v-model="form.tensileStrengthUnit"
                              placeholder=""
                            >
                              <el-option
                                v-for="item in dict.type.strength_class_unit"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              >
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.consisClass')" prop="consisClass">
                      <el-input v-model="form.consisClass" maxlength="50" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.structure')" prop="structure">
                      <el-input v-model="form.structure" maxlength="50" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.additionType')" prop="additionType">
                      <el-input v-model="form.additionType" maxlength="50" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('PRODUCT.otherAggregates')" prop="otherAggregates">
                      <el-input v-model="form.otherAggregates" maxlength="50" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('PRODUCT.concreteLimitValue2')"
                      prop="concreteLimitValue2"
                    >
                      <el-input v-model="form.concreteLimitValue2" maxlength="50" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('PRODUCT.concreteLimitValue')"
                      prop="concreteLimitValue"
                    >
                      <el-input v-model="form.concreteLimitValue" maxlength="50" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-form-item :label="$t('ui.description')">
                    <MyInput
                      type="textarea"
                      v-model="form.description"
                      :autosize="{ minRows: 1, maxRows: 8 }"
                      resize="none"
                      show-word-limit
                      :maxlength="300"
                    ></MyInput>
                  </el-form-item>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')">
                      <MyInput
                        type="textarea"
                        v-model="form.remarks"
                        :autosize="{ minRows: 1, maxRows: 8 }"
                        resize="none"
                        show-word-limit
                        :maxlength="300"
                      ></MyInput>
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
                    <el-form-item :label="`${$t('PRODUCT.concreteTest')}`">
                      <el-switch
                        v-model="form.concreteTest"
                        active-value="1"
                        inactive-value="0"
                        @change="concreteTestChange"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PRODUCT.variation')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <ProductInfo ref="ProductInfo" :comDisFrom="comDisFrom" :formData="form" />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PRODUCT.variationDetail')"
                :warning="collapseWarningForVariationDetail"
              >
              </FormCollapseItemTitle>
              <div>
                <VariationDetail ref="variationDetail" :comDisFrom="comDisFrom" :formData="form" />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="5">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('menu.salesPrice')"
                :warning="collapseWarningForSalesPrice"
              >
              </FormCollapseItemTitle>
              <div>
                <SalesPrice ref="salesPrice" :formData="form" :comDisFrom="comDisFrom" />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="6">
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
  </FormPageLayout>
</template>

<script>
import {
  queryCanSelectStrengthClass,
  queryDischargeFormulaSearchList,
  saveMixDesign,
  updateUnitCost,
  withdrawMixDesign,
  queryMixDesignById
} from '@/api/productManagement/mixDesign'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

import ProductInfo from './productInfo/productInfo.vue'
import VariationDetail from '@/views/productManagement/mixDesign/productInfo/VariationDetail.vue'
import SalesPrice from './productInfo/SalesPrice.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  mixins: [pageMixin],
  dicts: [
    'mdm_mix_design_status',
    'mdm_mix_design_type',
    'strength_class_unit',
    'mdm_slump_unit',
    'mdm_mix_design_load_unit',
    'mdm_mix_design_standard_product'
  ],
  components: {
    ProductInfo,
    VariationDetail,
    SalesPrice,
    SystemOperationLogTable
  },
  data() {
    return {
      activeNames: [],
      timeId: '',
      submitLoading: false,
      btnLoading: false,
      form: {
        variationList: [],
        salesPriceList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      collapseWarningForVariationDetail: false,
      collapseWarningForSalesPrice: false,
      rules: {
        zoneId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PRODUCT.mixDesignName')),
            trigger: ['change', 'blur']
          }
        ],
        mixDesignName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PRODUCT.mixDesignName')),
            trigger: ['change', 'blur']
          }
        ],
        productCode: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PRODUCT.productCode')),
            trigger: ['change', 'blur']
          }
        ],

        maxBatchLoad: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PRODUCT.maxBatchLoad')),
            trigger: ['blur']
          }
        ],
        loadUnit: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.unit')),
            trigger: ['change', 'blur']
          }
        ],
        type: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PRODUCT.type')),
            trigger: ['change', 'blur']
          }
        ],
        dischargeFormulaId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PRODUCT.dischargeFormula')),
            trigger: ['change', 'blur']
          }
        ],
        standardProduct: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PRODUCT.standardProduct')),
            trigger: ['change', 'blur']
          }
        ]
      },
      buttonAuthMsg: {
        isCanUpdate: '0',
        isCanWithdraw: '0',
        isCanUpdateUnitCost: '0'
      },
      zoneList: [],
      strengthClassOptions: [],
      dischargeFormulaList: []
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
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    editAuth() {
      return this.checkPermi(['productManagement:mixDesign:edit'])
    },
    sysDockingSwitchQC() {
      return this.$store.getters.sysDockingSwitchQC
    },

    comDisFrom() {
      let dis = true
      if (this.isView) {
        return true
      }
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (this.form.mixDesignId && this.buttonAuthMsg.isCanUpdate === '1') {
        dis = false
      }
      return dis
    },
    withdrawBtnShow() {
      if (!this.checkPermi(['productManagement:mixDesign:withdraw'])) {
        return false
      }
      if (this.form.variationList.length >= 4) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanWithdraw === '1') {
        show = true
      }
      return show
    },
    updateCostShow() {
      if (!this.checkPermi(['productManagement:mixDesign:update'])) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanUpdateUnitCost === '1') {
        show = true
      }
      return show
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    handleUpdate() {
      this.reset()
      this.queryCanSelectStrengthClass()
      queryMixDesignById({
        mixDesignId: this.rowId
      }).then((res) => {
        const data = res.data || {}
        data.variationList = data.variationList || []
        data.salesPriceList = data.salesPriceList || []
        data.variationList.forEach((item) => {
          item.timeId = item.variationId
          const variationMaterialList = item.variationMaterialList || []
          variationMaterialList.forEach((item) => {
            item.timeId = item.variationMaterialId
          })
        })
        this.form = data

        this.buttonAuthMsg = data.buttonAuthMsg || {}
        this.queryDischargeFormulaSearchList()
        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },
    reset() {
      this.form = {
        mixDesignId: undefined,
        mixDesignName: undefined,
        mixDesignCode: undefined,
        productCode: undefined,
        strengthClass: undefined,
        maxBatchLoad: undefined,
        loadUnit: undefined,
        type: undefined,
        dischargeFormulaInputValue: undefined,
        dischargeFormula: undefined,
        dischargeFormulaId: undefined,
        standardProduct: undefined,
        concreteTest: undefined,
        slump: undefined,
        slumpMin: undefined,
        dcType: undefined,
        slumpMax: undefined,
        clClass: undefined,
        cementType: undefined,
        exposureClass: undefined,
        cementStrengthClass: undefined,
        nominalAggregateMax: undefined,
        specialProperties: undefined,
        cementContentMin: undefined,
        wcRatioMax: undefined,
        airContent: undefined,
        specialAdmixture: undefined,
        density: undefined,
        description: '',
        remarks: '',
        isActive: '1',
        variationList: [],
        salesPriceList: [],

        tensileStrengthUnit: 'MPa',
        tensileStrength: undefined,
        consisClass: undefined,
        structure: undefined,
        additionType: undefined,
        otherAggregates: undefined,
        concreteLimitValue2: undefined,
        concreteLimitValue: undefined,
        cementTypeStrength2: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForVariationDetail = false
      this.collapseWarningForSalesPrice = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4', '5', '6']
      this.resetForm('form1')
    },
    // 取消按钮
    back() {
      this.$emit('back')
    },
    /* 表单部分Start */
    zoneChange(row) {
      this.$set(this.form, 'zoneId', row.zoneId)
      this.$set(this.form, 'zoneName', row.zoneName)
      this.dischargeFormulaChange({})
      this.queryDischargeFormulaSearchList()
    },
    queryCanSelectStrengthClass() {
      queryCanSelectStrengthClass({}).then((res) => {
        const data = res.data || []
        this.strengthClassOptions = data
      })
    },
    strengthClassChange(row) {
      this.$set(this.form, 'strengthClass', row.strengthClass)
      this.$set(this.form, 'strengthClassId', row.strengthClassId)
      this.$set(this.form, 'strengthClassUnit', row.unit)
      this.$refs.form1.validateField('strengthClass')
    },
    queryDischargeFormulaSearchList() {
      if (!this.form.zoneId) {
        this.dischargeFormulaList = []
        return
      }
      queryDischargeFormulaSearchList({ zoneId: this.form.zoneId }).then((response) => {
        this.$nextTick(() => {
          this.dischargeFormulaList = response.data || []
        })
      })
    },
    dischargeFormulaChange(row) {
      this.$set(this.form, 'dischargeFormulaId', row.dischargeFormulaId)
      this.$set(this.form, 'dischargeFormula', row.dischargeFormulaName)
    },
    concreteTestChange() {
      this.$refs.form1.clearValidate([
        'strengthClass',
        'slump',
        'slumpUnit',
        'slumpMin',
        'slumpMax'
      ])
    },
    inputNumberChange(code) {
      this.$refs.form1.validateField(code)
    },

    /* 表单部分End */
    handleUpdateCost() {
      const vm = this
      const confirm = vm.$t('PRODUCT.updateMixDesignSubmit')
      this.$modal
        .confirm(confirm)
        .then(() => {
          this.btnLoading = true
          return updateUnitCost({
            mixDesignId: vm.rowId
          })
        })
        .then((res) => {
          if (res.code === 200) {
            vm.$message.success(vm.$t('PRODUCT.updateMixDesignSuccess'))
            this.back()
          }
          this.btnLoading = false
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    handleWithdraw() {
      const vm = this
      const confirm = vm
        .$t('PRODUCT.withdrawMixDesignConfirm')
        .replace('$1', this.form.mixDesignCode)
      this.$modal
        .confirm(confirm)
        .then(() => {
          this.btnLoading = true

          return withdrawMixDesign({
            mixDesignId: vm.rowId
          })
        })
        .then((res) => {
          if (res.code === 200) {
            vm.$message.success(
              vm.$t('PRODUCT.withdrawMixDesignSuccess').replace('$1', this.form.mixDesignCode)
            )
            this.back()
          }
          this.btnLoading = false
        })
        .catch(() => {
          this.btnLoading = false
        })
    },

    async submitForm() {
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
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

        const validProduct = this.validProductList(param.variationList)
        if (!validProduct) {
          this.collapseWarningForProductInfo = true
          return
        }
        this.collapseWarningForProductInfo = false

        const validVariationDetail = this.validVariationDetail(
          param.variationList.filter((item) => item.variationType === '1')
        )
        if (!validVariationDetail) {
          this.collapseWarningForVariationDetail = true
          return
        }
        this.collapseWarningForVariationDetail = false

        const validSalesPartNoList = this.validSalesPartNoList(param.salesPriceList)
        if (!validSalesPartNoList) {
          this.collapseWarningForSalesPrice = true
          return
        }
        this.collapseWarningForSalesPrice = false

        const confirmMsg = this.$t('ui.submitPageConfirm')
        const successMsg = this.$t('ui.submitPageSuccess')
        const submitFn = saveMixDesign

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
    },
    validProductList(detailList, isReqOne = true) {
      const valid = false

      // if (detailList.length <= 0 && isReqOne) {
      //   this.$modal.msgError(this.$t('PRODUCT.variationTableEmpty'))
      //   return valid
      // }
      const activeList = detailList.filter((item) => item.isActive === '1')
      if (activeList.length <= 0 && isReqOne) {
        this.$modal.msgError(this.$t('PRODUCT.variationReqOneActive'))
        return valid
      }

      return true
    },
    validVariationDetail(detailList, isReqOne = true) {
      // const valid = false
      // const activeList = detailList.filter((item) => item.isActive === '1')
      /* const purchaseUnitPriceReq = activeList.find((item) => {
        return item.variationMaterialList.find((child) => {
          return (
            !this.$resultOfBoolean(child.purchaseUnitPrice) &&
            !this.$resultOfBoolean(child.referenceAmount) &&
            this.form.mixDesignStatus === '2'
          )
        })
      })
      if (purchaseUnitPriceReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.purchasePrice'))
        )
        return valid
      } */
      /* const unitCostReq = activeList.find((item) => {
        return item.variationMaterialList.find((child) => {
          return !this.$resultOfBoolean(child.unitCost) && this.form.mixDesignStatus === '2'
        })
      })
      if (unitCostReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.unitCost')))
        return valid
      } */
      return true
    },
    validSalesPartNoList(detailList) {
      if (detailList.length === 0) return true
      const valid = false
      if (detailList.length > 0) {
        const salesPartNoFlag = detailList.find((x) => !x.salesPartNo)
        if (salesPartNoFlag) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.salesPartNo'))
          )
          return valid
        }

        const salesPartNoList = detailList.map((x) => x.salesPartNo)
        const filterList = Array.from(new Set(salesPartNoList))
        if (filterList.length < salesPartNoList.length) {
          this.$modal.msgError(this.$t('PRODUCT.fieldExists'))
          return valid
        }

        const productNameFlag = detailList.find((x) => !x.productName)
        if (productNameFlag) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
          )
          return valid
        }

        const priceFlag = detailList.find((x) => !x.unitPrice)
        if (priceFlag) {
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.price')))
          return valid
        }
      }
      const activeList = detailList.filter((item) => item.isActive === '1')
      if (activeList.length <= 0) {
        this.$modal.msgError(this.$t('PRODUCT.salesPartReqOneActive'))
        return valid
      }
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
.collapse-item-content-pt0 {
  /deep/.el-collapse-item__content {
    padding-top: 10px;
  }
}
.salesOrderTip {
  flex-shrink: 0;
  margin-left: 6px;
  background-color: #f59a23;
  color: #fff;
  padding: 0 6px;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 12px;
  // color: #fff;
}
</style>
