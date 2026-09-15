<template>
  <FormPageLayoutTabs v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <!-- <el-button type="primary" size="mini" v-if="saveDraftBtnShow" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button> -->
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:tabs>
      <el-tabs v-model="activeName" size="mini" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('ui.basicInfo')" name="basicInfo"></el-tab-pane>
        <el-tab-pane :label="$t('PRODUCT.localAttributes')" name="localAttributes"></el-tab-pane>
        <el-tab-pane
          v-if="['1', '3', '4'].includes(form.productType)"
          :label="$t('PRODUCT.specifications')"
          name="specifications"
        ></el-tab-pane>
        <el-tab-pane
          :label="$t('PRODUCT.expandInfo')"
          name="expandInfo"
          v-if="form.isSystemDocking === '1'"
        ></el-tab-pane>
      </el-tabs>
    </template>
    <template v-slot:content>
      <!-- 集团层产品信息 -->
      <div v-show="activeName === 'basicInfo'">
        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="5">
              <FormCollapseItemTitle slot="title" :title="$t('ui.basicInfo')">
                <span class="info-item mr20" :title="businessGroupProduct.productName">
                  {{ $t('PRODUCT.productName') }} : {{ businessGroupProduct.productName }}
                </span>
              </FormCollapseItemTitle>
              <el-form
                ref="form0"
                :model="businessGroupProduct"
                @submit.native.prevent
                label-width="180px"
                :disabled="true"
              >
                <el-row>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('PRODUCT.productCategory1')}`">
                      <ToolTipShowCategory :list="businessGroupProduct.categoryNameList || []">
                        <el-input
                          :value="businessGroupProduct.categoryNameShowStr"
                          disabled
                        ></el-input>
                      </ToolTipShowCategory>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.internalPartNo')}`">
                      <el-input
                        v-model="businessGroupProduct.internalPartNo"
                        :title="businessGroupProduct.internalPartNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('PRODUCT.productName')}`">
                      <el-input
                        v-model="businessGroupProduct.productName"
                        :title="businessGroupProduct.productName"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="businessGroupProduct.productType === '2'">
                    <el-form-item :label="`${$t('PRODUCT.uom1')}`" prop="uom">
                      <el-input
                        v-model="businessGroupProduct.uom"
                        :title="showUomLabel(businessGroupProduct.uom)"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-else>
                    <el-form-item :label="`${$t('PRODUCT.brand')}`">
                      <el-input
                        v-model="businessGroupProduct.brand"
                        :title="businessGroupProduct.brand"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.alias')}`">
                      <el-input
                        v-model="businessGroupProduct.alias"
                        :title="businessGroupProduct.alias"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.productClass')}`">
                      <el-select
                        v-model="businessGroupProduct.productType"
                        placeholder=""
                        style="width: 100%"
                        :disabled="true"
                      >
                        <el-option
                          v-for="item in dict.type.product_type"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
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
                        :disabled="isFocus || !businessGroupProduct.description"
                      >
                        <div slot="content" class="desc-tooltip">
                          <div
                            v-if="businessGroupProduct.description"
                            style="line-height: 20px; white-space: pre-wrap"
                          >
                            {{ businessGroupProduct.description }}
                          </div>
                        </div>
                        <slot>
                          <div :class="{ 'tooltip-row': true }">
                            <MyInput
                              type="textarea"
                              v-model="businessGroupProduct.description"
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
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')">
                      <el-tooltip
                        ref="tooltip"
                        :enterable="true"
                        class="item"
                        effect="light"
                        placement="top"
                        :manual="false"
                        :disabled="isRemarksFocus || !businessGroupProduct.remarks"
                      >
                        <div slot="content" class="desc-tooltip">
                          <div
                            v-if="businessGroupProduct.remarks"
                            style="line-height: 20px; white-space: pre-wrap"
                          >
                            {{ businessGroupProduct.remarks }}
                          </div>
                        </div>
                        <slot>
                          <div>
                            <MyInput
                              type="textarea"
                              v-model="businessGroupProduct.remarks"
                              :autosize="{ minRows: 1, maxRows: 4 }"
                              resize="none"
                              show-word-limit
                              :maxlength="3000"
                              @focus="isRemarksFocus = true"
                              @blur="isRemarksFocus = false"
                            ></MyInput>
                          </div>
                        </slot>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                </el-row>

                <div v-if="businessGroupProduct.productType === '2'" key="productType222">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('ui.type')}`" prop="serviceType">
                        <el-radio-group v-model="businessGroupProduct.serviceType" disabled>
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
                      <el-form-item :label="`${$t('PRODUCT.purpose')}`">
                        <el-checkbox-group
                          v-model="businessGroupProduct.purposeList"
                          @change="purposeChange"
                          style="height: 36px"
                        >
                          <el-checkbox label="1">{{ $t('PRODUCT.purchase') }}</el-checkbox>
                          <el-checkbox label="2">{{ $t('PRODUCT.sales') }}</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('ui.isActive')}`"
                        :class="[isModified('isActive')]"
                      >
                        <el-switch
                          v-model="businessGroupProduct.isActive"
                          active-value="1"
                          inactive-value="0"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.includeDecimal')}`">
                        <el-switch
                          v-model="businessGroupProduct.includeDecimal"
                          active-value="1"
                          inactive-value="0"
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.includeDecimalTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>

                <div v-else key="productType111">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.inventoryUOM1')}`">
                        <el-select
                          v-model="businessGroupProduct.uom"
                          :title="showUomLabel(businessGroupProduct.uom)"
                          placeholder=""
                          filterable
                          clearable
                          @change="changeUom('uom')"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in allUomListForUom"
                            :key="item"
                            :label="item"
                            :value="item"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="businessGroupProduct.isSystemDocking === '1'">
                      <el-form-item :label="`${$t('ui.zoneName')}`" prop="zoneIdList">
                        <el-select
                          style="width: 100%"
                          v-model="businessGroupProduct.zoneIdList"
                          :title="zoneNameShowStr"
                          placeholder=""
                          multiple
                          collapse-tags
                          class="log-msg-ellipsis"
                          v-default-select="[enterpriseIds]"
                        >
                          <el-option
                            v-for="item in zoneList"
                            :key="item.zoneId"
                            :label="item.zoneName"
                            :value="item.zoneId"
                            :disabled="item.disabled"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        :label="`${$t('PRODUCT.purpose')}`"
                        prop="purposeList"
                        :class="[isModified('purpose')]"
                      >
                        <el-checkbox-group
                          v-model="businessGroupProduct.purposeList"
                          @change="purposeChange"
                          style="height: 36px"
                          :disabled="businessGroupProduct.isSystemDocking === '1'"
                        >
                          <el-checkbox
                            label="1"
                            :disabled="
                              businessGroupProduct.purpose &&
                              businessGroupProduct.purpose.indexOf('1') === -1
                            "
                            >{{ $t('PRODUCT.purchase') }}</el-checkbox
                          >
                          <el-checkbox
                            label="2"
                            :disabled="
                              businessGroupProduct.purpose &&
                              businessGroupProduct.purpose.indexOf('2') === -1
                            "
                            >{{ $t('PRODUCT.sales') }}</el-checkbox
                          >
                          <el-checkbox
                            label="3"
                            :disabled="
                              businessGroupProduct.purpose &&
                              businessGroupProduct.purpose.indexOf('3') === -1
                            "
                            >{{ $t('PRODUCT.packaging') }}</el-checkbox
                          >
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('ui.isActive')}`">
                        <el-switch
                          v-model="businessGroupProduct.isActive"
                          active-value="1"
                          inactive-value="0"
                          :disabled="true"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('PRODUCT.includeDecimal')}`"
                        :class="[isModified('includeDecimal')]"
                      >
                        <el-switch
                          v-model="businessGroupProduct.includeDecimal"
                          :disabled="true"
                          active-value="1"
                          inactive-value="0"
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.includeDecimalTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.assembledProduct')}`">
                        <el-switch
                          v-model="businessGroupProduct.assembledProduct"
                          active-value="1"
                          inactive-value="0"
                          :disabled="true"
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.assembledProductTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.sequenceCode')}`">
                        <el-switch
                          v-model="businessGroupProduct.isSequenceCode"
                          :disabled="true"
                          active-value="1"
                          inactive-value="0"
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.sequenceCodeTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.packingNotice')}`">
                        <el-switch
                          v-model="businessGroupProduct.packingNotice"
                          active-value="1"
                          inactive-value="0"
                          :disabled="true"
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.packingNoticeTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.setCombination')}`">
                        <el-switch
                          v-model="businessGroupProduct.setCombination"
                          active-value="1"
                          inactive-value="0"
                          :disabled="true"
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.setCombinationTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="8" v-if="sysDockingSwitch">
                      <el-form-item :label="`${$t('ui.systemDocking')}`" prop="isSystemDocking">
                        <el-switch
                          v-model="businessGroupProduct.isSystemDocking"
                          active-value="1"
                          inactive-value="0"
                          disabled
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.systemDockingTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.nonInventoryItem')}`">
                        <el-switch
                          v-model="businessGroupProduct.nonInventoryItem"
                          active-value="1"
                          inactive-value="0"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.labelManagement')}`">
                        <el-switch
                          v-model="businessGroupProduct.labelManagement"
                          active-value="0"
                          inactive-value="1"
                          :disabled="true"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col
                      v-if="businessGroupProduct.labelManagement === '0'"
                      :span="8"
                      key="inventoryControlMode11"
                    >
                      <el-form-item :label="`${$t('PRODUCT.inventoryControlMode')}`">
                        <el-select
                          v-model="businessGroupProduct.inventoryControlMode"
                          placeholder=""
                          style="width: 100%"
                          :disabled="true"
                        >
                          <el-option
                            v-for="item in dict.type.inventory_control_mode"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col
                      v-if="businessGroupProduct.labelManagement === '0'"
                      :span="8"
                      key="printMethod11"
                    >
                      <el-form-item :label="`${$t('PRODUCT.printMethod')}`">
                        <el-select
                          :disabled="true"
                          v-model="businessGroupProduct.printMethod"
                          placeholder=""
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in dict.type.ivt_print_method"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
      <!-- 法人层产品信息 -->
      <div v-show="activeName === 'localAttributes'">
        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="5">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.basicInfo')"
                :warning="collapseWarningForBasicInfo"
              >
                <span class="info-item mr20" :title="form.productName">
                  {{ $t('PRODUCT.productName') }} : {{ form.productName }}
                </span>
                <span class="info-item">
                  {{ $t('ui.status') }} :
                  {{
                    selectDictLabel(dict.type.product_extended_status, form.productExtendedStatus)
                  }}
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
                  <el-col :span="16">
                    <el-form-item :label="`${$t('PRODUCT.productCategory1')}`" required="">
                      <ToolTipShowCategory :list="form.categoryNameList || []">
                        <el-input :value="form.categoryNameShowStr" disabled></el-input>
                      </ToolTipShowCategory>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.internalPartNo')}`">
                      <el-input
                        v-model="form.internalPartNo"
                        :title="form.internalPartNo"
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
                      <!-- <el-input
                        v-model="form.productName"
                        :title="form.productName"
                        :disabled="comIsRevise"
                        maxlength="200"
                      ></el-input> -->
                      <div class="input-switch-box">
                        <div class="con-left">
                          <el-input
                            v-model="form.productName"
                            :title="form.productName"
                            maxlength="200"
                          ></el-input>
                        </div>
                        <div class="con-right" :title="productInfo.productName" v-if="false">
                          <i
                            class="el-icon-share primary-link"
                            style="font-size: 20px"
                            @click="handleProductDetails"
                          ></i>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.product_extended_status,
                            form.productExtendedStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="form.productType === '2'">
                    <el-form-item :label="`${$t('PRODUCT.uom1')}`" prop="uom">
                      <el-select
                        v-model="form.uom"
                        @change="changeUom1"
                        :title="showUomLabel(form.uom)"
                        class="w100"
                        placeholder=""
                        :disabled="form.productExtendedStatus === '2'"
                      >
                        <el-option
                          v-for="item in allUomList"
                          :key="item"
                          :label="item"
                          :value="item"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-else>
                    <el-form-item :label="`${$t('PRODUCT.brand')}`" :class="[isModified('brand')]">
                      <el-autocomplete
                        style="width: 100%"
                        v-model="form.brand"
                        :title="form.brand"
                        :fetch-suggestions="queryBrandSugg"
                        placeholder
                        clearable
                        :maxlength="200"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.alias')}`" :class="[isModified('alias')]">
                      <el-input v-model="form.alias" :title="form.alias" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PRODUCT.productClass')}`"
                      v-if="form.productType === '2'"
                    >
                      <el-input
                        :value="
                          form.productType === '2' ? $t('PRODUCT.service') : $t('PRODUCT.product')
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      v-else
                      key="productType22"
                      :label="`${$t('PRODUCT.productClass')}`"
                      prop="productType"
                      :rules="[
                        {
                          required: true,
                          message: $t('ui.reqMsg').replace('$1', $t('PRODUCT.productType')),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <el-select
                        v-model="form.productType"
                        @change="changeProductType()"
                        placeholder=""
                        style="width: 100%"
                        :disabled="form.isAlreadyHaveDocument === '1' || form.existsStockIn === '1'"
                      >
                        <el-option
                          v-for="item in (dict.type.product_type || []).filter(
                            (i) => i.value !== '2'
                          )"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="$t('ui.description')"
                      :class="[isModified('description')]"
                    >
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
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')">
                      <el-tooltip
                        ref="tooltip"
                        :enterable="true"
                        class="item"
                        effect="light"
                        placement="top"
                        :manual="false"
                        :disabled="isRemarksFocus || !form.remarks"
                      >
                        <div slot="content" class="desc-tooltip">
                          <div v-if="form.remarks" style="line-height: 20px; white-space: pre-wrap">
                            <div>{{ form.remarks }}</div>
                          </div>
                        </div>
                        <slot>
                          <div>
                            <MyInput
                              type="textarea"
                              v-model="form.remarks"
                              :autosize="{ minRows: 1, maxRows: 4 }"
                              resize="none"
                              show-word-limit
                              :maxlength="3000"
                              @focus="isRemarksFocus = true"
                              @blur="isRemarksFocus = false"
                            ></MyInput>
                          </div>
                        </slot>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                </el-row>

                <div v-if="form.productType === '2'" key="productType222">
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
                        prop="purposeList"
                        :class="[isModified('purpose')]"
                      >
                        <el-checkbox-group
                          v-model="form.purposeList"
                          @change="purposeChange"
                          style="height: 36px"
                        >
                          <el-checkbox label="1">{{ $t('PRODUCT.purchase') }}</el-checkbox>
                          <el-checkbox label="2">{{ $t('PRODUCT.sales') }}</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('ui.isActive')}`"
                        :class="[isModified('isActive')]"
                      >
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
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.includeDecimalTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>

                <div v-else key="productType111">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('PRODUCT.inventoryUOM1')}`"
                        prop="uom"
                        :class="[isModified('uom', 2)]"
                      >
                        <el-select
                          v-model="form.uom"
                          :title="showUomLabel(form.uom)"
                          placeholder=""
                          filterable
                          clearable
                          @change="changeUom('uom')"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in allUomListForUom"
                            :key="item"
                            :label="item"
                            :value="item"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="form.isSystemDocking === '1'">
                      <el-form-item :label="`${$t('ui.zoneName')}`" prop="zoneIdList">
                        <el-select
                          style="width: 100%"
                          v-model="form.zoneIdList"
                          :title="zoneNameShowStr"
                          placeholder=""
                          multiple
                          collapse-tags
                          class="log-msg-ellipsis"
                          v-default-select="[enterpriseIds]"
                        >
                          <el-option
                            v-for="item in zoneList"
                            :key="item.zoneId"
                            :label="item.zoneName"
                            :value="item.zoneId"
                            :disabled="item.disabled"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        :label="`${$t('PRODUCT.purpose')}`"
                        prop="purposeList"
                        :class="[isModified('purpose')]"
                      >
                        <el-checkbox-group
                          v-model="form.purposeList"
                          @change="purposeChange"
                          style="height: 36px"
                          :disabled="form.isSystemDocking === '1'"
                        >
                          <el-checkbox
                            label="1"
                            :disabled="
                              businessGroupProduct.purpose &&
                              businessGroupProduct.purpose.indexOf('1') === -1
                            "
                            >{{ $t('PRODUCT.purchase') }}</el-checkbox
                          >
                          <el-checkbox
                            label="2"
                            :disabled="
                              businessGroupProduct.purpose &&
                              businessGroupProduct.purpose.indexOf('2') === -1
                            "
                            >{{ $t('PRODUCT.sales') }}</el-checkbox
                          >
                          <el-checkbox
                            label="3"
                            :disabled="
                              (businessGroupProduct.purpose &&
                                businessGroupProduct.purpose.indexOf('3') === -1) ||
                              form.isPhantom === '1'
                            "
                            >{{ $t('PRODUCT.packaging') }}</el-checkbox
                          >
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('ui.isActive')}`"
                        :class="[isModified('isActive')]"
                      >
                        <el-switch
                          v-model="form.isActive"
                          active-value="1"
                          inactive-value="0"
                          :disabled="businessGroupProduct.isActive === '0'"
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
                          :disabled="
                            form.isSequenceCode === '1' ||
                            form.assembledProduct === '1' ||
                            form.setCombination === '1' ||
                            form.isSystemDocking === '1'
                          "
                          active-value="1"
                          inactive-value="0"
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.includeDecimalTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="false">
                      <el-form-item :label="`${$t('PRODUCT.rawMaterial')}`">
                        <el-switch
                          v-model="form.isRawMaterial"
                          disabled
                          active-value="1"
                          inactive-value="0"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.assembledProduct')}`">
                        <el-switch
                          v-model="form.assembledProduct"
                          active-value="1"
                          inactive-value="0"
                          @change="assembledProductSwitchChange"
                          :disabled="
                            form.isSystemDocking === '1' ||
                            form.includeDecimal === '1' ||
                            form.productType === '3' ||
                            form.isPhantom === '1'
                          "
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.assembledProductTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.sequenceCode')}`">
                        <el-switch
                          v-model="form.isSequenceCode"
                          :disabled="
                            form.includeDecimal === '1' ||
                            form.isSystemDocking === '1' ||
                            form.labelManagement === '0' ||
                            form.isPhantom === '1'
                          "
                          active-value="1"
                          inactive-value="0"
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.sequenceCodeTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.packingNotice')}`">
                        <el-switch
                          v-model="form.packingNotice"
                          active-value="1"
                          inactive-value="0"
                          :disabled="
                            form.isSystemDocking === '1' ||
                            businessGroupProduct.packingNotice === '0' ||
                            form.isPhantom === '1'
                          "
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.packingNoticeTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.setCombination')}`">
                        <el-switch
                          v-model="form.setCombination"
                          active-value="1"
                          inactive-value="0"
                          @change="setCombinationSwitchChange"
                          :disabled="
                            form.isSystemDocking === '1' ||
                            form.includeDecimal === '1' ||
                            form.productType === '3' ||
                            form.isPhantom === '1'
                          "
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.setCombinationTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="8" v-if="sysDockingSwitch">
                      <el-form-item :label="`${$t('ui.systemDocking')}`" prop="isSystemDocking">
                        <el-switch
                          v-model="form.isSystemDocking"
                          active-value="1"
                          inactive-value="0"
                          disabled
                        ></el-switch>
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div v-html="$t('switchTip.systemDockingTip')"></div>
                          </div>
                          <i class="el-icon-info ml10"></i>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.nonInventoryItem')}`">
                        <el-switch
                          v-model="form.nonInventoryItem"
                          active-value="1"
                          inactive-value="0"
                          @change="nonInventoryItemChange"
                          :disabled="form.isAlreadyHaveDocument === '1'"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.isPhantom')}`" prop="isPhantom">
                        <el-switch
                          v-model="form.isPhantom"
                          active-value="1"
                          inactive-value="0"
                          @change="changeIsPhantomSwitch()"
                          :disabled="
                            form.isSystemDocking === '1' ||
                            form.isAlreadyHaveDocument === '1' ||
                            form.existsStockIn === '1'
                          "
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PRODUCT.labelManagement')}`">
                        <el-switch
                          v-model="form.labelManagement"
                          active-value="0"
                          inactive-value="1"
                          @change="changeLabelManagementSwitch()"
                          :disabled="
                            form.isSequenceCode === '1' ||
                            form.nonInventoryItem === '1' ||
                            form.existsStockIn === '1' ||
                            form.isPhantom === '1'
                          "
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col
                      v-if="form.labelManagement === '0'"
                      :span="8"
                      key="inventoryControlMode11"
                    >
                      <el-form-item
                        :label="`${$t('PRODUCT.inventoryControlMode')}`"
                        prop="inventoryControlMode"
                        :rules="[
                          {
                            required: true,
                            message: $t('ui.reqMsg').replace(
                              '$1',
                              $t('PRODUCT.inventoryControlMode')
                            ),
                            trigger: ['change']
                          }
                        ]"
                      >
                        <el-select
                          v-model="form.inventoryControlMode"
                          placeholder=""
                          style="width: 100%"
                          @change="changeInventoryControlMode()"
                          :disabled="comDIsInventoryControlMode"
                        >
                          <el-option
                            v-for="item in dict.type.inventory_control_mode"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col v-if="form.labelManagement === '0'" :span="8" key="printMethod11">
                      <el-form-item
                        :label="`${$t('PRODUCT.printMethod')}`"
                        prop="printMethod"
                        :rules="[
                          {
                            required: true,
                            message: $t('ui.reqMsg').replace('$1', $t('PRODUCT.printMethod')),
                            trigger: ['change']
                          }
                        ]"
                      >
                        <el-select
                          :disabled="comDisPrintMethod"
                          v-model="form.printMethod"
                          placeholder=""
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in dict.type.ivt_print_method"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" v-show="['1', '3', '4'].includes(form.productType)">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PRODUCT.productImage')"
                :warning="collapseWarningForPicture"
              >
              </FormCollapseItemTitle>
              <el-row>
                <el-col :span="24">
                  <div class="mb20" :class="[isModified('attachmentPicture')]">
                    <myUploadTable
                      ref="uploadPictureRef"
                      :disabled="comDisFrom"
                      :limit="9"
                      :accept="['.jpg', '.jpeg', '.png', '.bmp', '.webp']"
                    />
                  </div>
                </el-col>
              </el-row>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="3">
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
      <!-- 法人层产品规格信息 -->
      <div v-show="activeName === 'specifications'">
        <div class="form-card form-card--p20">
          <el-form
            ref="form2"
            :model="specificationsForm"
            @submit.native.prevent
            :rules="rules"
            label-width="160px"
            :disabled="comDisFrom"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item
                  :label="`${$t('PRODUCT.l')}`"
                  :class="[isModified('lengthShowStr', 2)]"
                >
                  <div style="display: flex">
                    <el-input-number
                      style="width: 100%"
                      v-model="specificationsForm.length"
                      controls-position="right"
                      :controls="!comDisFrom"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999999.99"
                      @change="inputNumberChange('length')"
                    />
                    <el-select
                      class="fs-0"
                      style="width: 80px"
                      v-model="specificationsForm.lengthUom"
                      :title="showUomLabel(specificationsForm.lengthUom)"
                      placeholder=""
                      @change="lengthUomChange('length')"
                    >
                      <el-option
                        v-for="item in lengthUomList"
                        :key="item.lengthUom + 'length'"
                        :label="item.lengthUom"
                        :value="item.lengthUom"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="`${$t('PRODUCT.w')}`"
                  :class="[isModified('widthShowStr', 2)]"
                >
                  <div style="display: flex">
                    <el-input-number
                      style="width: 100%"
                      v-model="specificationsForm.width"
                      controls-position="right"
                      :controls="!comDisFrom"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999999.99"
                      @change="inputNumberChange('width')"
                    />
                    <el-select
                      class="fs-0"
                      style="width: 80px"
                      v-model="specificationsForm.widthUom"
                      :title="showUomLabel(specificationsForm.widthUom)"
                      placeholder=""
                      @change="lengthUomChange('width')"
                    >
                      <el-option
                        v-for="item in lengthUomList"
                        :key="item.lengthUom + 'width'"
                        :label="item.lengthUom"
                        :value="item.lengthUom"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="`${$t('PRODUCT.h')}`"
                  :class="[isModified('heightShowStr', 2)]"
                >
                  <div style="display: flex">
                    <el-input-number
                      style="width: 100%"
                      v-model="specificationsForm.height"
                      controls-position="right"
                      :controls="!comDisFrom"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999999.99"
                      @change="inputNumberChange('height')"
                    />
                    <el-select
                      class="fs-0"
                      style="width: 80px"
                      v-model="specificationsForm.heightUom"
                      placeholder=""
                      @change="lengthUomChange('height')"
                    >
                      <el-option
                        v-for="item in lengthUomList"
                        :key="item.lengthUom + 'height'"
                        :label="item.lengthUom"
                        :value="item.lengthUom"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="border-line-solid"></div>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="`${$t('PRODUCT.color')}`" :class="[isModified('color', 2)]">
                  <el-input v-model="specificationsForm.color" maxlength="50"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" :offset="8">
                <el-form-item :label="`${$t('PRODUCT.volume')}`">
                  <div style="display: flex">
                    <el-input-number
                      class="flex-1"
                      v-model="specificationsForm.volume"
                      controls-position="right"
                      :controls="false"
                      :precision="6"
                      :min="0"
                      :max="9999999999999999.99"
                      disabled
                    />
                    <div class="unit">{{ specificationsForm.volumeUom }}</div>
                    <svg-icon
                      class="fs-0"
                      icon-class="jisuanqi"
                      :style="`width: ${iconFontSize}px; height: ${iconFontSize}px; margin-left: 2px; align-self: center`"
                    />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="border-line-solid"></div>

            <el-row>
              <el-col :span="8">
                <el-form-item
                  :label="`${$t('PRODUCT.netWeight')}`"
                  :class="[isModified('netWeightShowStr', 2)]"
                >
                  <div style="display: flex">
                    <el-input-number
                      style="width: 100%"
                      v-model="specificationsForm.netWeight"
                      controls-position="right"
                      :controls="!comDisFrom"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999999.99"
                      @change="inputNumberChange('netWeight')"
                    />
                    <el-select
                      class="fs-0"
                      style="width: 80px"
                      v-model="specificationsForm.netWeightUom"
                      :title="showUomLabel(specificationsForm.netWeightUom)"
                      placeholder=""
                    >
                      <el-option
                        v-for="item in weightUomList"
                        :key="item + 'netWeight'"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="`${$t('PRODUCT.grossWeight')}`"
                  :class="[isModified('grossWeightShowStr', 2)]"
                >
                  <div style="display: flex">
                    <el-input-number
                      style="width: 100%"
                      v-model="specificationsForm.grossWeight"
                      controls-position="right"
                      :controls="!comDisFrom"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999999.99"
                      @change="inputNumberChange('grossWeight')"
                    />
                    <el-select
                      class="fs-0"
                      style="width: 80px"
                      v-model="specificationsForm.grossWeightUom"
                      :title="showUomLabel(specificationsForm.grossWeightUom)"
                      placeholder=""
                    >
                      <el-option
                        v-for="item in weightUomList"
                        :key="item + 'grossWeight'"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="border-line-dashed"></div>

            <el-row>
              <el-col :span="24">
                <el-form-item :label="$t('ui.remarks')" :class="[isModified('remarks', 2)]">
                  <MyInput
                    type="textarea"
                    v-model="specificationsForm.remarks"
                    :autosize="{ minRows: 2, maxRows: 8 }"
                    resize="none"
                    show-word-limit
                    :maxlength="3000"
                  ></MyInput>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div v-if="form.isSystemDocking === '1'">
        <div v-show="activeName === 'expandInfo'" class="form-card form-card--p20">
          <el-form
            ref="form3"
            :model="specificationsForm"
            @submit.native.prevent
            :rules="rules"
            label-width="160px"
            :disabled="comDisFrom"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item :label="`${$t('ui.type')}`" prop="type">
                  <el-select
                    style="width: 100%"
                    v-model="specificationsForm.type"
                    placeholder=""
                    clearable
                    @change="changeType"
                    disabled
                  >
                    <el-option
                      v-for="item in dict.type.mdm_material_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('PRODUCT.specificGravity')" prop="specificGravity">
                  <el-input-number
                    style="width: 100%"
                    v-model="specificationsForm.specificGravity"
                    controls-position="right"
                    :precision="4"
                    v-thousandSplit="{ precision: 4 }"
                    :min="0.0"
                    :max="999.9999"
                    @change="inputNumberChange2('specificGravity')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('PRODUCT.toleranceType')" prop="toleranceType">
                  <el-select
                    style="width: 100%"
                    v-model="specificationsForm.toleranceType"
                    placeholder=""
                    clearable
                  >
                    <el-option
                      v-for="item in dict.type.mdm_material_tolerance_type"
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
                <el-form-item :label="$t('PRODUCT.overTolerance')" prop="overTolerance">
                  <el-input-number
                    style="width: 100%"
                    v-model="specificationsForm.overTolerance"
                    controls-position="right"
                    :precision="4"
                    v-thousandSplit="{ precision: 4 }"
                    :min="0.0"
                    :max="9999.9999"
                    @change="inputNumberChange2('overTolerance')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('PRODUCT.underTolerance')" prop="underTolerance">
                  <el-input-number
                    style="width: 100%"
                    v-model="specificationsForm.underTolerance"
                    controls-position="right"
                    :precision="4"
                    v-thousandSplit="{ precision: 4 }"
                    :min="0.0"
                    :max="9999.9999"
                    @change="inputNumberChange2('underTolerance')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('PRODUCT.minInMixDesign')" prop="minInMix">
                  <el-input-number
                    style="width: 100%"
                    v-model="specificationsForm.minInMix"
                    controls-position="right"
                    :precision="4"
                    v-thousandSplit="{ precision: 4 }"
                    :min="0.0"
                    :max="specificationsForm.maxInMix || 999.9999"
                    @change="inputNumberChange2('minInMix')"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('PRODUCT.maxInMixDesign')" prop="maxInMix">
                  <el-input-number
                    style="width: 100%"
                    v-model="specificationsForm.maxInMix"
                    controls-position="right"
                    :precision="4"
                    v-thousandSplit="{ precision: 4 }"
                    :min="specificationsForm.minInMix || 0"
                    :max="999.9999"
                    @change="inputNumberChange2('maxInMix')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('PRODUCT.minMoisture')" prop="minMoisture">
                  <el-input-number
                    style="width: 100%"
                    v-model="specificationsForm.minMoisture"
                    controls-position="right"
                    :precision="4"
                    v-thousandSplit="{ precision: 4 }"
                    :min="0.0"
                    :max="specificationsForm.maxMoisture || 999.9999"
                    @change="inputNumberChange2('minMoisture')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('PRODUCT.maxMoisture')" prop="maxMoisture">
                  <el-input-number
                    style="width: 100%"
                    v-model="specificationsForm.maxMoisture"
                    controls-position="right"
                    :precision="4"
                    v-thousandSplit="{ precision: 4 }"
                    :min="specificationsForm.minMoisture || 0.0"
                    :max="999.9999"
                    @change="inputNumberChange2('maxMoisture')"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('PRODUCT.minTemperatureC')">
                  <el-input-number
                    style="width: 100%"
                    v-model="specificationsForm.minTemperatureC"
                    controls-position="right"
                    :precision="2"
                    v-thousandSplit="{ precision: 2 }"
                    :min="-999.99"
                    :max="
                      $resultOfBoolean(specificationsForm.maxTemperatureC)
                        ? specificationsForm.maxTemperatureC
                        : 999.99
                    "
                    @change="inputNumberChange2('minTemperatureC')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('PRODUCT.maxTemperatureC')">
                  <el-input-number
                    style="width: 100%"
                    v-model="specificationsForm.maxTemperatureC"
                    controls-position="right"
                    :precision="2"
                    v-thousandSplit="{ precision: 2 }"
                    :min="
                      $resultOfBoolean(specificationsForm.minTemperatureC)
                        ? specificationsForm.minTemperatureC
                        : -999.99
                    "
                    :max="999.99"
                    @change="inputNumberChange2('maxTemperatureC')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="['1', '2'].indexOf(specificationsForm.type) !== -1">
                <el-form-item
                  :label="$t('PRODUCT.minFinenessModulus')"
                  :rules="{
                    required: true,
                    message: $t('ui.reqMsg'),
                    trigger: ['blur']
                  }"
                  prop="minFinenessModulus"
                >
                  <el-input-number
                    style="width: 100%"
                    v-model="specificationsForm.minFinenessModulus"
                    controls-position="right"
                    :precision="2"
                    v-thousandSplit="{ precision: 2 }"
                    :min="0.01"
                    :max="specificationsForm.maxFinenessModulus || 9999.99"
                    @change="inputNumberChange2('minFinenessModulus')"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8" v-if="['1', '2'].indexOf(specificationsForm.type) !== -1">
                <el-form-item
                  :label="`${$t('PRODUCT.maxFinenessModulus')}`"
                  prop="maxFinenessModulus"
                  :rules="{
                    required: true,
                    message: $t('ui.reqMsg'),
                    trigger: ['blur']
                  }"
                >
                  <el-input-number
                    style="width: 100%"
                    v-model="specificationsForm.maxFinenessModulus"
                    controls-position="right"
                    :precision="2"
                    v-thousandSplit="{ precision: 2 }"
                    :min="specificationsForm.minFinenessModulus || 0.01"
                    :max="9999.99"
                    @change="inputNumberChange2('maxFinenessModulus')"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item :label="$t('ui.remarks')">
                  <MyInput
                    type="textarea"
                    v-model="specificationsForm.extendRemarks"
                    :autosize="{ minRows: 2, maxRows: 8 }"
                    resize="none"
                    show-word-limit
                    :maxlength="300"
                  ></MyInput>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div
        class="form-card mt10"
        v-show="activeName === 'specifications' && form.setCombination === '1'"
      >
        <el-collapse v-model="activeNames">
          <el-collapse-item name="6">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PRODUCT.setCombination')"
              :warning="collapseWarningSetCombination"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5" v-if="!comDisFrom">
                  <el-button
                    @click="handleBtnAddSetCombination"
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    >{{ $t('uiBtn.add') }}</el-button
                  >
                </el-col>
              </el-row>
              <el-table border ref="tables" max-height="400px" :data="setCombinationList">
                <el-table-column
                  type="index"
                  key="index"
                  :label="$t('ui.sn')"
                  width="60"
                  fixed="left"
                  align="center"
                  class-name="allowDrag"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-for="item in setCombinationColumns"
                  :key="item.prop + item.colSortIndex"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :min-width="item.minWidth"
                  :show-overflow-tooltip="item.tooltip"
                  :fixed="item.fixed"
                  :sortable="item.sortable"
                  :align="item.align || 'left'"
                  header-align="center"
                >
                  <template slot="header" slot-scope="{ column }">
                    <span v-if="['qty'].includes(item.prop)">
                      <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                    </span>
                    <span v-else>{{ column.label }}</span>
                  </template>
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'qty'">
                      <template v-if="!comDisFrom">
                        <el-input-number
                          style="width: 98%"
                          v-model="scope.row.qty"
                          controls-position="right"
                          :precision="scope.row.decimalNum"
                          v-thousandSplit="{ precision: scope.row.decimalNum }"
                          :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                          :max="99999"
                        />
                      </template>
                      <template v-else>{{
                        $numberStr(scope.row[item.prop], scope.row.decimalNum)
                      }}</template>
                    </template>
                    <template v-else-if="item.prop === 'uom'">
                      <span :title="showUomLabel(scope.row[item.prop])">{{
                        scope.row[item.prop]
                      }}</span>
                    </template>
                    <template v-else-if="item.prop === 'description'">
                      <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
                    </template>
                    <template v-else>{{ scope.row[item.prop] }}</template>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('ui.action')"
                  key="action"
                  align="center"
                  min-width="120"
                  class-name="small-padding fixed-width"
                  fixed="right"
                  v-if="!comDisFrom"
                >
                  <template slot-scope="scope">
                    <div class="flexCen">
                      <i
                        v-if="!scope.row.productSetCombinationId"
                        class="el-icon-delete pointer"
                        style="font-size: 20px; color: #f56c6c"
                        :title="$t('uiBtn.delete')"
                        @click="handleDelSetCombinationRow(scope.$index, scope.row)"
                      ></i>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </template>

    <ApprovedDialog
      :id="form.productMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
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

    <RevisionComparisonDlg ref="RevisionComparisonDlg" />

    <selectProductTable ref="selectProductTable" @onSuccess="updateTable" />
  </FormPageLayoutTabs>
</template>

<script>
import {
  approvedProduct,
  rejectedProduct,
  queryProductHistoryVersion,
  queryAllBrandList
} from '@/api/productManagement/productInfo'
import {
  queryVolumeUomList,
  queryWeightUomList,
  queryLengthUomList,
  queryAllUomListByLocalization
} from '@/api/system/uom'
import { queryActiveProductCategoryTreeList } from '@/api/productManagement/productCategory'
import {
  queryLegalEntityList,
  queryProductExtended,
  saveDraftProductExtended,
  saveProductExtended
} from '@/api/productManagement/productExtended'
import { getAllZoneList } from '@/api/organization/zone'

import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import RevisionComparisonDlg from '@/views/productManagement/productInfo/revisionComparisonDlg.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import selectProductTable from '@/views/productManagement/productInfo/selectProductTable.vue'
import myUploadTable from '@/components/Common/htz-image-upload/my-upload-table.vue'
export default {
  dicts: [
    'product_type',
    'product_extended_status',
    'valuation_unit',
    'service_type',
    'mdm_material_type',
    'mdm_material_tolerance_type',
    'ivt_print_method',
    'inventory_control_mode'
  ],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    ApprovedDialog,
    RejectDialog,
    RevisionComparisonDlg,
    myUploadTable,
    SystemOperationLogTable,
    selectProductTable
  },
  data() {
    const vm = this
    const checkValueNameIfExist = (rule, value, callback) => {
      if (value) {
        return this.validateHas(value, callback)
      }
      callback()
    }
    return {
      submitLoading: false,
      isFocus: false,
      isRemarksFocus: false,
      saveKey: '2',
      rowIdKey: 'customId',
      activeName: 'localAttributes',
      activeNames: [],
      specificationsActiveNames: ['1'],
      rowId: '',
      timeId: '',
      // 是否自动生成 EmployeeNo
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForPicture: false,
      collapseWarningForSpecificationsProductExtended: false,
      collapseWarningSetCombination: false,
      specificationsForm: {},
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
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['change']
          }
        ],
        departmentId: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['change']
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
        ],
        companyRegNo: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur']
          }
        ],
        productName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          },
          {
            validator: checkValueNameIfExist,
            trigger: ['blur']
          }
        ],
        barcodeControl: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ],
        uom: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ],
        defaultUom: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ],
        purchaseUom: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ],
        salesUom: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ],
        inventoryUom: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ],
        materialName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.materialName')),
            trigger: ['change', 'blur']
          }
        ],
        roleAlias: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.roleAlias')),
            trigger: ['change', 'blur']
          }
        ],
        roleKey: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.roleKey')),
            trigger: ['change', 'blur']
          }
        ],
        specificGravity: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.specificGravity')),
            trigger: ['blur']
          }
        ],
        toleranceType: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.toleranceType')),
            trigger: ['change', 'blur']
          }
        ],
        type: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.type')),
            trigger: ['change', 'blur']
          }
        ],
        productionRate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.productionRate')),
            trigger: ['change', 'blur']
          }
        ],
        contactPersonName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.contactPerson')),
            trigger: ['change', 'blur']
          }
        ],
        overTolerance: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.overTolerance')),
            trigger: ['blur']
          }
        ],
        underTolerance: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.underTolerance')),
            trigger: ['blur']
          }
        ],
        zoneIdList: [
          {
            required: true,
            type: 'array',
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      productCategoryData: [],
      allUomList: [],
      volumeUomList: [],
      weightUomList: [],
      lengthUomList: [],
      tableList: [],
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 140
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.inventoryUOM1'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
      ],
      specificationsColumn: [
        {
          prop: 'legalEntityId',
          label: vm.$t('PRODUCT.extendedOrganization'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'localization',
          label: vm.$t('ui.localization'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.UOM'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70
        },
        {
          prop: 'defaultUom',
          label: vm.$t('PRODUCT.defaultUOM'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        /* {
          prop: 'purchaseUom',
          label: vm.$t('PRODUCT.purchaseUOM'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'salesUom',
          label: vm.$t('PRODUCT.salesUOM'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }, */
        {
          prop: 'inventoryUom',
          label: vm.$t('PRODUCT.inventoryUOM'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'minimumPackagingUnit',
          label: vm.$t('PRODUCT.minimumPackagingUnit'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'supplementaryPackagingUnit',
          label: vm.$t('PRODUCT.supplementaryPackagingUnit'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'packagingUnit',
          label: vm.$t('PRODUCT.packagingUnit'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      extendedOrganizationList: [],

      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedProduct,
      rejectedUrl: rejectedProduct,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      ivtSpecificationsUpdateProps: [],
      bpHistoryVersionList: [],
      productInfo: {},
      englishAllUomList: [],

      setCombinationList: [],
      setCombinationColumns: [
        {
          prop: 'productName',
          label: this.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: this.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: this.$t('PRODUCT.inventoryUOM1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'qty',
          label: this.$t('PRODUCT.qty'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      zoneList: [],
      enterpriseIds: [],
      brandList: [],
      businessGroupProduct: {}
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
        this.queryLegalEntityList()
        if (this.rowId) {
          this.handleUpdate()
        }
      }
    }
  },
  computed: {
    size() {
      return this.$store.getters.size
    },
    iconFontSize() {
      const fontSizes = {
        medium: 36,
        small: 32,
        mini: 28
      }
      return fontSizes[this.size]
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    allUomListForUom() {
      const filterList = [
        this.specificationsForm.minimumPackagingUnit,
        this.specificationsForm.supplementaryPackagingUnit,
        this.specificationsForm.packagingUnit
      ]
      return this.allUomList.filter((item) => !filterList.includes(item))
    },
    allUomListForMin() {
      const filterList = [
        this.specificationsForm.uom,
        this.specificationsForm.supplementaryPackagingUnit,
        this.specificationsForm.packagingUnit
      ]
      return this.allUomList.filter((item) => !filterList.includes(item))
    },
    allUomListForSup() {
      const filterList = [
        this.specificationsForm.uom,
        this.specificationsForm.minimumPackagingUnit,
        this.specificationsForm.packagingUnit
      ]
      return this.allUomList.filter((item) => !filterList.includes(item))
    },
    allUomListForPackaging() {
      const filterList = [
        this.specificationsForm.uom,
        this.specificationsForm.minimumPackagingUnit,
        this.specificationsForm.supplementaryPackagingUnit
      ]
      return this.allUomList.filter((item) => !filterList.includes(item))
    },
    defaultUomList() {
      const list = [
        this.specificationsForm.uom,
        this.specificationsForm.minimumPackagingUnit,
        this.specificationsForm.supplementaryPackagingUnit,
        this.specificationsForm.packagingUnit
      ]
      return list.filter((item) => !!item)
    },

    editAuth() {
      return this.checkPermi(['productManagement:productExtended:edit'])
    },
    comDisFrom() {
      // if (this.form.productExtendedStatus === '2') {
      //   return true
      // }
      if (this.isView) {
        return true
      }
      return !this.editAuth
    },
    saveDraftBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (this.form.productExtendedStatus === '1') {
        show = true
      }
      return show
    },
    comIsRevise() {
      return this.form.isRevise === '1'
    },
    comDIsInventoryControlMode() {
      // this.form.isAlreadyHaveDocument === '1' ||
      // return this.form.existsStockIn === '1'
      return false
    },
    comDisPrintMethod() {
      // this.form.isAlreadyHaveDocument === '1' ||
      // return this.form.existsStockIn === '1'
      return false
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
    modifyHighlight() {
      if (this.approvedBtnShow && this.buttonAuthMsg.isCanSeeUpdateMsg === '1') {
        return true
      }
      return false
    },
    sysDockingSwitch() {
      return this.$store.getters.sysDockingSwitch || this.$store.getters.sysDockingSwitchQC
    },
    zoneNameShowStr() {
      const { zoneIdList } = this.form
      if (!zoneIdList || zoneIdList.length <= 0) return ''
      if (!this.zoneList || this.zoneList.length <= 0) return ''
      return this.zoneList
        .filter((x) => zoneIdList.indexOf(x.zoneId) !== -1)
        .map((x) => x.zoneName)
        .join(', ')
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  methods: {
    queryBrandSugg(queryString, cb) {
      const vm = this
      const brandList = vm.brandList

      let results
      if (queryString) {
        results = brandList.filter(
          (umo) => umo.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      } else {
        results = brandList
      }
      cb(results)
    },
    // 品牌
    queryAllBrandList() {
      queryAllBrandList().then((res) => {
        const list = res.data || []
        this.brandList = list.map((x) => {
          return { value: x }
        })
      })
    },
    getAllZoneList() {
      getAllZoneList({}).then((res) => {
        this.zoneList = res.data || []
        if (!this.form.zoneIdList || this.form.zoneIdList.length <= 0) {
          const zoneIdList = this.zoneList.map((x) => x.zoneId)
          this.$set(this.form, 'zoneIdList', zoneIdList)
        } else {
          this.zoneList.forEach((x) => {
            if (this.enterpriseIds.indexOf(x.zoneId) !== -1) {
              this.$set(x, 'disabled', true)
            }
          })
        }
      })
    },
    changeProductType() {
      if (this.form.productType === '3') {
        this.$set(this.form, 'includeDecimal', '0')
        this.$set(this.form, 'isSystemDocking', '0')
        this.$set(this.form, 'assembledProduct', '1')
      }
    },
    nonInventoryItemChange() {
      this.$set(this.form, 'labelManagement', undefined)
      this.$set(this.form, 'inventoryControlMode', undefined)
      this.$set(this.form, 'printMethod', undefined)
    },
    changeIsPhantomSwitch() {
      if (this.form.isPhantom === '1') {
        this.$set(this.form, 'isSystemDocking', '0')
        this.$set(this.form, 'assembledProduct', '0') // 生产制造产品
        this.$set(this.form, 'isSequenceCode', '0') // 序列码(供应商)
        this.$set(this.form, 'setCombination', '0') // 套装组合
        this.$set(this.form, 'packingNotice', '0') // 打包
        if ((this.form.purposeList || []).includes('3')) {
          this.form.purposeList = this.form.purposeList.filter((x) => x !== '3')
        }
      }
      this.$set(this.form, 'labelManagement', undefined)
      this.$set(this.form, 'inventoryControlMode', undefined)
      this.$set(this.form, 'printMethod', undefined)
    },
    changeLabelManagementSwitch() {
      this.$set(this.form, 'inventoryControlMode', undefined)
      this.$set(this.form, 'printMethod', undefined)
    },
    changeInventoryControlMode() {
      // if (this.form.inventoryControlMode === '1') {
      //   this.$set(this.form, 'printMethod', '1')
      // }
    },
    changeType() {
      this.$refs.form3.clearValidate('minMoisture')
      this.$refs.form3.clearValidate('maxMoisture')
    },
    selectExtendedOrganizationList(index) {
      let list = this.extendedOrganizationList
      this.tableList.forEach((x, i) => {
        if (x.legalEntityId && index !== i) {
          list = list.filter((item) => item.id !== x.legalEntityId)
        }
      })
      return list
    },
    legalEntityChange(row) {
      const { legalEntityId } = row
      if (legalEntityId) {
        const list = this.extendedOrganizationList.filter((x) => x.id === legalEntityId)
        const { localization } = list[0]
        this.$set(row, 'localization', localization)
      } else {
        this.$set(row, 'localization', undefined)
      }
      this.tableListUomChange()
    },
    queryLegalEntityList() {
      queryLegalEntityList({}).then((res) => {
        this.extendedOrganizationList = res.data || []
      })
    },
    async validateHas(value, callback) {
      // const param = {
      //   productName: value
      // }
      try {
        // const res = await queryProductByProductName(param)
        // this.productInfo = res.data || {}
        // if (JSON.stringify(this.productInfo) !== '{}') {
        //   if (this.form.productId !== this.productInfo.productId) {
        //     return callback(new Error(this.$t('PRODUCT.productIsAlready')))
        //   } else {
        //     callback()
        //   }
        // }
        // this.productInfo = {}
        callback()
      } catch (err) {
        callback()
      }
    },
    handleProductDetails() {
      const { productType, productMainId } = this.productInfo
      if (productType === '2') {
        this.$router.push({
          path: '/productManagement/editExtendedService',
          query: {
            id: productMainId,
            timeId: Date.now()
          }
        })
      } else {
        this.$router.push({
          path: '/productManagement/editExtendedProductInfo',
          query: {
            id: productMainId,
            timeId: Date.now()
          }
        })
      }
    },
    handleClick() {},
    handleBtnAdd() {
      if (this.loading) return
      this.loading = true
      const timeStamp = new Date().getTime()
      const form = {
        legalEntityId: undefined,
        localization: undefined,
        productName: undefined,
        internalPartNo: undefined,
        alias: undefined,
        brand: undefined,
        description: undefined,
        customId: JSON.stringify(timeStamp)
      }
      this.tableList.push(JSON.parse(JSON.stringify(form)))
      setTimeout(() => {
        this.loading = false
      }, 200)
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      this.queryAllBrandList()
      this.queryProductHistoryVersion()
      this.queryActiveProductCategoryTreeList()
      this.queryAllUomList()
      queryProductExtended({ productMainId: rowId }).then((res) => {
        const data = res.data || {}

        queryAllUomListByLocalization({ localization: data.localization, productId: rowId }).then(
          (respone) => {
            this.allUomList = (respone.data || []).map((x) => x.uomName) || []
            this.englishAllUomList = respone.data || []
          }
        )
        /* 初始化 AddressInfo */
        setTimeout(() => {
          this.$refs.uploadPictureRef.initFileList(data.commonFileListForImage || [])
          this.$refs.uploadRef.initFileList(data.commonFileList || [])
        }, 300)

        data.purposeList = data.purpose ? data.purpose.split(',') : []
        data.legalEntityIdList = data.legalEntityIds ? data.legalEntityIds.split(',') : []
        this.form = data
        this.specificationsForm = data.ivtSpecifications || {}
        this.businessGroupProduct = data.businessGroupProduct || {}
        this.businessGroupProduct.purposeList = this.businessGroupProduct.purpose
          ? this.businessGroupProduct.purpose.split(',')
          : []
        const { uom } = this.specificationsForm
        this.$set(this.form, 'uom', uom || undefined)
        this.setCombinationList = data.setCombinationList || []

        this.buttonAuthMsg = data.buttonAuthMsg || {}
        this.tableList = data.productExtendedList || []
        if (this.form.zoneIds) {
          const zoneIdList = this.form.zoneIds.split(',')
          this.enterpriseIds = JSON.parse(JSON.stringify(zoneIdList))
          this.$set(this.form, 'zoneIdList', zoneIdList)
        }
        this.getAllZoneList()

        /* 版本比对 */
        const updateMsg = data.updateMsg || {}
        const basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
        const ivtSpecificationsUpdateMsgList = updateMsg.ivtSpecificationsUpdateMsgList || []
        const beforeCommonFileList = updateMsg.beforeCommonFileList || []
        const afterCommonFileList = updateMsg.afterCommonFileList || []
        const beforeCommonFileListForImage = updateMsg.beforeCommonFileListForImage || []
        const afterCommonFileListForImage = updateMsg.afterCommonFileListForImage || []

        setTimeout(() => {
          this.basicUpdateProps = basicUpdateMsgList.map((item) => item.name)
          this.ivtSpecificationsUpdateProps = ivtSpecificationsUpdateMsgList.map(
            (item) => item.name
          )
          if (beforeCommonFileList.length > 0 || afterCommonFileList.length > 0) {
            this.basicUpdateProps.push('attachment')
          }
          if (beforeCommonFileListForImage.length > 0 || afterCommonFileListForImage.length > 0) {
            this.basicUpdateProps.push('attachmentPicture')
          }
        }, 100)
      })
    },
    // 取消按钮
    back(type) {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$emit('back', type)
    },
    /* 行删除 */
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
      })
    },
    /* 表单部分 */
    // 表单重置
    reset() {
      this.form = {
        purposeList: ['1', '2', '3'],
        isActive: '1',
        includeDecimal: '0',
        isRawMaterial: '1',
        isSequenceCode: '1',
        packingNotice: '0',
        setCombination: '0',
        isPhantom: '0',
        // 标签管理（0代表有标签 1代表无标签）
        labelManagement: '1',
        printMethod: undefined,
        productExtendedStatus: undefined,
        barcodeControl: '1',
        assembledProduct: '0',
        createdBy: this.$store.state.user.nickName,
        zoneIdList: []
      }
      this.businessGroupProduct = {}
      this.specificationsForm = {
        uom: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningSetCombination = false
      this.activeName = 'localAttributes'
      this.activeNames = ['1', '2', '3', '4', '5', '6']
      this.collapseWarningForSpecificationsProductExtended = false
      this.specificationsActiveNames = ['1']
      this.tableList = []
      setTimeout(() => {
        if (this.$refs.uploadPictureRef) {
          this.$refs.uploadPictureRef.initFileList([])
        }
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.basicUpdateProps = []
      this.ivtSpecificationsUpdateProps = []
      this.bpHistoryVersionList = []

      this.resetForm('form1')
      this.resetForm('form2')
    },

    queryActiveProductCategoryTreeList() {
      queryActiveProductCategoryTreeList().then((res) => {
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
    purposeChange() {
      if ((this.form.purposeList || []).includes('2') && this.form.setCombination === '1') {
        this.$modal.msgError(this.$t('PRODUCT.setCombinationCannotSales'))
      }
    },
    setCombinationSwitchChange() {
      if (this.form.setCombination === '1' && this.form.assembledProduct === '1') {
        this.$set(this.form, 'assembledProduct', '0')
        this.$modal.msgError(this.$t('PRODUCT.notUsed'))
      } else if ((this.form.purposeList || []).includes('2') && this.form.setCombination === '1') {
        this.$modal.msgError(this.$t('PRODUCT.setCombinationCannotSales'))
      }
    },
    assembledProductSwitchChange() {
      if (this.form.setCombination === '1' && this.form.assembledProduct === '1') {
        this.$set(this.form, 'setCombination', '0')
        this.$modal.msgError(this.$t('PRODUCT.notUsed'))
      }
      if (this.form.assembledProduct === '1') {
        this.$set(this.form, 'includeDecimal', '0')
      }
    },
    inputNumberChange(code) {
      this.$refs.form2.validateField(code)
      if (['length', 'width', 'height'].includes(code)) {
        const { length, width, height } = this.specificationsForm
        if (
          this.$resultOfBoolean(length) &&
          this.$resultOfBoolean(width) &&
          this.$resultOfBoolean(height)
        ) {
          const a = this.$bigMathTimes(length, width, height)
          this.$set(this.specificationsForm, 'volume', +a)
        } else {
          this.$set(this.specificationsForm, 'volume', undefined)
        }
      }
    },
    inputNumberChange2(code) {
      this.$refs.form3.validateField(code)
    },
    queryAllUomList() {
      // queryEnglishAllUomList({}).then((res) => {
      //   this.englishAllUomList = res.data || []
      // })
      queryVolumeUomList().then((res) => {
        this.volumeUomList = res.data || []
      })
      queryWeightUomList().then((res) => {
        this.weightUomList = res.data || []
      })
      queryLengthUomList().then((res) => {
        this.lengthUomList = res.data || []
      })
    },

    lengthUomChange(type) {
      let lengthUom
      switch (type) {
        case 'length':
          lengthUom = this.specificationsForm.lengthUom
          break
        case 'width':
          lengthUom = this.specificationsForm.widthUom
          break
        case 'height':
          lengthUom = this.specificationsForm.heightUom
          break
      }
      this.$set(this.specificationsForm, 'lengthUom', lengthUom)
      this.$set(this.specificationsForm, 'widthUom', lengthUom)
      this.$set(this.specificationsForm, 'heightUom', lengthUom)
      const selectItem = this.lengthUomList.find((item) => item.lengthUom === lengthUom) || {}
      this.$set(this.specificationsForm, 'volumeUom', selectItem.volumeUom)
    },

    changeUom1() {
      this.$set(this.specificationsForm, 'uom', this.form.uom)
    },

    changeUom(type) {
      this.$nextTick(() => {
        const defaultList = [...this.defaultUomList]
        const defaultUom = this.specificationsForm.defaultUom
        const purchaseUom = this.specificationsForm.purchaseUom
        const salesUom = this.specificationsForm.salesUom
        const inventoryUom = this.specificationsForm.inventoryUom
        if (defaultUom && !defaultList.includes(defaultUom)) {
          this.$set(this.specificationsForm, 'defaultUom', undefined)
        }
        if (purchaseUom && !defaultList.includes(purchaseUom)) {
          this.$set(this.specificationsForm, 'purchaseUom', undefined)
        }
        if (salesUom && !defaultList.includes(salesUom)) {
          this.$set(this.specificationsForm, 'salesUom', undefined)
        }
        if (inventoryUom && !defaultList.includes(inventoryUom)) {
          this.$set(this.specificationsForm, 'inventoryUom', undefined)
        }

        if (type === 'minimumPackagingUnit') {
          this.$refs.form2.clearValidate('minimumPackagingUnitCoefficient')
        }
        if (type === 'supplementaryPackagingUnit') {
          this.$refs.form2.clearValidate('supplementaryPackagingUnitCoefficient')
        }
        if (type === 'packagingUnit') {
          this.$refs.form2.clearValidate('packagingUnitCoefficient')
        }
        this.tableListUomChange()
      })
    },
    changeDefaultUOM() {
      const uom = this.specificationsForm.defaultUom
      if (uom) {
        this.$set(this.specificationsForm, 'purchaseUom', uom)
        this.$set(this.specificationsForm, 'salesUom', uom)
        this.$set(this.specificationsForm, 'inventoryUom', uom)
      }
      this.tableListUomChange()
    },

    handleBtnAddSetCombination() {
      const alreadySelectIdList = this.setCombinationList.map((item) => item.productId)
      this.$refs.selectProductTable.handleAdd(alreadySelectIdList)
    },
    /* 行删除 */
    handleDelSetCombinationRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.setCombinationList.splice(index, 1)
      })
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        this.setCombinationList.push(...rows)
      }
    },

    tableListUomChange() {
      this.tableList.forEach((x) => {
        if (x.localization) {
          const {
            uom,
            defaultUom,
            purchaseUom,
            salesUom,
            inventoryUom,
            minimumPackagingUnit,
            supplementaryPackagingUnit,
            packagingUnit
          } = this.specificationsForm
          if (uom) {
            this.uomFilter(uom, 'uom', x)
          } else {
            this.$set(x, 'uom', undefined)
          }
          if (defaultUom) {
            this.uomFilter(defaultUom, 'defaultUom', x)
          } else {
            this.$set(x, 'defaultUom', undefined)
          }
          if (purchaseUom) {
            this.uomFilter(purchaseUom, 'purchaseUom', x)
          } else {
            this.$set(x, 'purchaseUom', undefined)
          }
          if (salesUom) {
            this.uomFilter(salesUom, 'salesUom', x)
          } else {
            this.$set(x, 'salesUom', undefined)
          }
          if (inventoryUom) {
            this.uomFilter(inventoryUom, 'inventoryUom', x)
          } else {
            this.$set(x, 'inventoryUom', undefined)
          }
          if (minimumPackagingUnit) {
            this.uomFilter(minimumPackagingUnit, 'minimumPackagingUnit', x)
          } else {
            this.$set(x, 'minimumPackagingUnit', undefined)
          }
          if (supplementaryPackagingUnit) {
            this.uomFilter(supplementaryPackagingUnit, 'supplementaryPackagingUnit', x)
          } else {
            this.$set(x, 'supplementaryPackagingUnit', undefined)
          }
          if (packagingUnit) {
            this.uomFilter(packagingUnit, 'packagingUnit', x)
          } else {
            this.$set(x, 'packagingUnit', undefined)
          }
        } else {
          this.$set(x, 'uom', undefined)
          this.$set(x, 'defaultUom', undefined)
          this.$set(x, 'purchaseUom', undefined)
          this.$set(x, 'salesUom', undefined)
          this.$set(x, 'inventoryUom', undefined)
          this.$set(x, 'minimumPackagingUnit', undefined)
          this.$set(x, 'supplementaryPackagingUnit', undefined)
          this.$set(x, 'packagingUnit', undefined)
        }
      })
    },
    uomFilter(uom, label, row) {
      const { localization } = row
      const list = this.englishAllUomList.filter((x) => x.uomName === uom)
      if (list.length > 0) {
        const { uomExtendedList } = list[0]
        if (uomExtendedList && uomExtendedList.length > 0) {
          const list = uomExtendedList.filter((x) => x.localization === localization)
          if (list && list.length > 0) {
            this.$set(row, label, list[0].uomName)
          } else {
            this.$set(row, label, undefined)
          }
        }
      } else {
        this.$set(row, label, undefined)
      }
    },
    async submitFormProduct() {
      const pictureFiles = this.$refs.uploadPictureRef.getFileIds()
      if (pictureFiles === false) {
        return
      }
      const defaultPicture = pictureFiles.find((item) => {
        return item.isDefault === '1'
      })
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      if (!valid1) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.localAttributes'))
        )
        this.activeName = 'localAttributes'
        return
      }
      if ((this.form.purposeList || []).includes('2') && this.form.setCombination === '1') {
        this.$modal.msgError(this.$t('PRODUCT.setCombinationCannotSales'))
        this.collapseWarningForBasicInfo = true
        this.activeName = 'localAttributes'
        return
      }
      this.collapseWarningForBasicInfo = !valid1

      if (pictureFiles.length > 0 && !defaultPicture) {
        this.collapseWarningForPicture = true
        this.$modal.msgError(this.$t('PRODUCT.pictureNoDefault'))
        return
      }
      this.collapseWarningForPicture = false
      const valid2 = await this.$refs.form2.validate().catch((err) => {
        return err
      })
      if (!valid2) {
        this.activeName = 'specifications'
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.specifications'))
        )
        return
      }

      if (this.form.setCombination === '1') {
        if (this.setCombinationList.length <= 0) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.setCombination'))
          )
          this.collapseWarningSetCombination = true
          this.activeName = 'specifications'
          return
        }
        const qtyReq = this.setCombinationList.find((item) => !item.qty)
        if (qtyReq) {
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.qty')))
          this.collapseWarningSetCombination = true
          this.activeName = 'specifications'
          return
        }
      }
      this.collapseWarningSetCombination = false

      if (this.form.isSystemDocking === '1') {
        const valid3 = await this.$refs.form3.validate().catch((err) => {
          return err
        })

        if (!valid3) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.expandInfo'))
          )
          this.activeName = 'expandInfo'
          return
        }
      }
      if (valid1 && valid2) {
        let param = { ...this.form, setCombinationList: this.setCombinationList }
        param.ivtSpecifications = { ...this.specificationsForm }
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

        param.purpose = param.purposeList.join(',')
        param.legalEntityIds = param.legalEntityIdList.join(',')

        // if (param.productCategoryIdList) {
        //   param.productCategoryId =
        //     param.productCategoryIdList[param.productCategoryIdList.length - 1]
        // }
        param.commonFileListForImage = pictureFiles
        param.commonFileList = myFileIds
        param.productExtendedList = this.tableList
        param.ivtSpecifications.uom = this.form.uom
        if (this.submitLoading) return
        this.$modal
          .confirm(this.$t('PRODUCT.productSubmit'))
          .then(() => {
            this.submitLoading = true
            return saveProductExtended(param)
          })
          .then((response) => {
            setTimeout(() => {
              this.submitLoading = false
            }, 1000)
            this.$modal.msgSuccess(
              this.$t('PRODUCT.productSuccess').replace('$1', param.productName)
            )
            this.back()
          })
          .catch(() => {
            this.submitLoading = false
          })
      }
    },

    async submitFormService() {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.localAttributes'))
        )
        return
      }

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
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.purpose = param.purposeList.join(',')
        param.commonFileList = myFileIds

        this.$modal
          .confirm(this.$t('PRODUCT.productSubmit'))
          .then(() => {
            return saveProductExtended(param)
          })
          .then((res) => {
            this.$modal.msgSuccess(
              this.$t('PRODUCT.productSuccess').replace('$1', param.productName)
            )
            this.back()
          })
          .catch(() => {})
      }
    },

    submitForm() {
      if (this.form.productType === '2') {
        this.submitFormService()
      } else {
        this.submitFormProduct()
      }
    },

    handleSaveDraft() {
      this.$refs.form1.clearValidate()
      this.$refs.form2.clearValidate()
      const pictureFiles = this.$refs.uploadPictureRef.getFileIds()
      if (pictureFiles === false) {
        return
      }
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      let isError = false
      this.$refs.form1.validateField(
        ['productCategoryIdList', 'productName', 'departmentId'],
        (err) => {
          if (err) {
            isError = true
          }
        }
      )
      if (isError) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.localAttributes'))
        )
        this.collapseWarningForBasicInfo = true
        return
      }
      this.collapseWarningForBasicInfo = false
      if (!isError) {
        let param = { ...this.form }
        param.ivtSpecifications = { ...this.specificationsForm }
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

        param.purpose = param.purposeList.join(',')
        param.legalEntityIds = param.legalEntityIdList.join(',')

        if (param.productCategoryIdList) {
          param.productCategoryId =
            param.productCategoryIdList[param.productCategoryIdList.length - 1]
        }

        param.commonFileListForImage = pictureFiles
        param.commonFileList = myFileIds
        this.$modal
          .confirm(this.$t('PRODUCT.productDraftSubmit'))
          .then(() => {
            return saveDraftProductExtended(param)
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
        path: '/productManagement/reviseExtendedProductInfo',
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
        path: '/productManagement/viewExtendedProductInfo',
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
    }
  }
}
</script>
<style lang="scss" scoped>
.unit {
  flex-shrink: 0;
  min-width: 30px;
  padding: 0 8px;
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
.border-line-solid {
  height: 1px;
  width: 100%;
  border-top: 1px solid #dcdfe6;
  // background-color: #dcdfe6;
  margin-bottom: 20px;
}
.border-line-dashed {
  height: 1px;
  width: 100%;
  border-top: 2px dashed #dcdfe6;
  // background-color: #dcdfe6;
  margin-bottom: 20px;
  border-spacing: 6px;
}
</style>
