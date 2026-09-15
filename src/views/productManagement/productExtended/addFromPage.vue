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
    <template v-slot:tabs>
      <el-tabs v-model="activeName" size="mini" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('ui.basicInfo')" name="basicInfo"></el-tab-pane>
        <el-tab-pane :label="$t('PRODUCT.specifications')" name="specifications"></el-tab-pane>
      </el-tabs>
    </template>
    <template v-slot:content>
      <div v-show="activeName === 'basicInfo'">
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
              >
                <el-row>
                  <el-col :span="8">
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
                          multiple: false,
                          value: 'id',
                          label: 'categoryName',
                          children: 'child',
                          checkStrictly: true
                        }"
                        clearable
                        :collapse-tags="false"
                        popper-class="hide-cascader-scrollbar"
                        style="width: 100%"
                      ></el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PRODUCT.extendedOrganization')}`"
                      prop="legalEntityIdList"
                    >
                      <el-select
                        v-model="form.legalEntityIdList"
                        clearable
                        multiple
                        collapse-tags
                        placeholder=""
                        style="width: 100%"
                        class="log-msg-ellipsis"
                        filterable
                        @change="extendedOrganizationChange"
                      >
                        <el-option
                          v-for="dict in extendedOrganizationList"
                          :key="dict.id"
                          :label="dict.legalEntityName"
                          :value="dict.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.internalPartNo')}`">
                      <el-input v-model="form.internalPartNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('PRODUCT.productName')}`" prop="productName">
                      <!-- <el-input v-model="form.productName" maxlength="200"></el-input> -->
                      <div class="input-switch-box">
                        <div class="con-left">
                          <el-input v-model="form.productName" maxlength="200"></el-input>
                        </div>
                        <div
                          class="con-right"
                          :title="productInfo.productName"
                          v-if="JSON.stringify(productInfo) !== '{}'"
                        >
                          <i
                            class="el-icon-share primary-link"
                            style="font-size: 20px"
                            @click="handleProductDetails"
                          ></i>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="false">
                    <el-form-item :label="`${$t('PRODUCT.chineseName')}`">
                      <el-input v-model="form.chineseName" maxlength="200"></el-input>
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
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.alias')}`">
                      <el-input v-model="form.alias" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.description')">
                      <MyInput
                        type="textarea"
                        v-model="form.description"
                        :autosize="{ minRows: 2, maxRows: 8 }"
                        resize="none"
                        show-word-limit
                        :maxlength="7000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.productClass')}`">
                      <el-input :value="$t('PRODUCT.product')" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.brand')}`">
                      <el-input v-model="form.brand" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item :label="`${$t('PRODUCT.purpose')}`" prop="purposeList">
                      <el-checkbox-group v-model="form.purposeList" style="height: 36px">
                        <el-checkbox label="1">{{ $t('PRODUCT.purchase') }}</el-checkbox>
                        <el-checkbox label="2">{{ $t('PRODUCT.sales') }}</el-checkbox>
                        <el-checkbox label="3">{{ $t('PRODUCT.packaging') }}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="12">
                    <el-form-item :label="`${$t('PRODUCT.barcodeControl')}`" prop="barcodeControl">
                      <el-radio-group v-model="form.barcodeControl">
                        <el-radio label="1">{{ $t('PRODUCT.serialBarcode') }}</el-radio>
                        <el-radio label="2">{{ $t('PRODUCT.lotBarcode') }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col> -->
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
                      <el-tooltip placement="top">
                        <div slot="content">
                          <div v-html="$t('switchTip.includeDecimalTip')"></div>
                        </div>
                        <i class="el-icon-info ml10"></i>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.rawMaterial')}`">
                      <el-switch
                        v-model="form.isRawMaterial"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.sequenceCode')}`">
                      <el-switch
                        v-model="form.isSequenceCode"
                        :disabled="form.includeDecimal === '1'"
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
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PRODUCT.productImage')"
                :warning="collapseWarningForPicture"
              >
              </FormCollapseItemTitle>
              <el-row>
                <el-col :span="24">
                  <div class="mb20">
                    <myUploadTable
                      ref="uploadPictureRef"
                      :disabled="false"
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
                  <div class="mb20">
                    <myUpload ref="uploadRef" />
                  </div>
                </el-col>
              </el-row>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
      <div v-show="activeName === 'specifications'">
        <div class="form-card form-card--p20">
          <el-form
            ref="form2"
            :model="specificationsForm"
            @submit.native.prevent
            :rules="rules"
            label-width="160px"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item :label="`${$t('PRODUCT.l')}`">
                  <div style="display: flex">
                    <el-input-number
                      style="width: 100%"
                      v-model="specificationsForm.length"
                      controls-position="right"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0.01"
                      :max="999.99"
                      @change="inputNumberChange('length')"
                    />
                    <el-select
                      class="fs-0"
                      style="width: 80px"
                      v-model="specificationsForm.lengthUom"
                      :title="showUomLabel(specificationsForm.lengthUom)"
                      @change="lengthUomChange('length')"
                      placeholder=""
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
                <el-form-item :label="`${$t('PRODUCT.w')}`">
                  <div style="display: flex">
                    <el-input-number
                      style="width: 100%"
                      v-model="specificationsForm.width"
                      controls-position="right"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0.01"
                      :max="999.99"
                      @change="inputNumberChange('width')"
                    />
                    <el-select
                      class="fs-0"
                      style="width: 80px"
                      v-model="specificationsForm.widthUom"
                      :title="showUomLabel(specificationsForm.widthUom)"
                      @change="lengthUomChange('width')"
                      placeholder=""
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
                <el-form-item :label="`${$t('PRODUCT.h')}`">
                  <div style="display: flex">
                    <el-input-number
                      style="width: 100%"
                      v-model="specificationsForm.height"
                      controls-position="right"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0.01"
                      :max="999.99"
                      @change="inputNumberChange('height')"
                    />
                    <el-select
                      class="fs-0"
                      style="width: 80px"
                      v-model="specificationsForm.heightUom"
                      :title="showUomLabel(specificationsForm.heightUom)"
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
              <el-col :span="8" :offset="16">
                <el-form-item :label="`${$t('PRODUCT.volume')}`">
                  <div style="display: flex">
                    <el-input-number
                      class="flex-1"
                      v-model="specificationsForm.volume"
                      controls-position="right"
                      :controls="false"
                      :precision="6"
                      :min="0"
                      :max="999.99"
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
            <div class="border-line-dashed"></div>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="`${$t('PRODUCT.netWeight')}`">
                  <div style="display: flex">
                    <el-input-number
                      style="width: 100%"
                      v-model="specificationsForm.netWeight"
                      controls-position="right"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999.99"
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
                <el-form-item :label="`${$t('PRODUCT.grossWeight')}`">
                  <div style="display: flex">
                    <el-input-number
                      style="width: 100%"
                      v-model="specificationsForm.grossWeight"
                      controls-position="right"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999.99"
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
              <el-col :span="8">
                <el-form-item :label="`${$t('PRODUCT.color')}`">
                  <el-input v-model="specificationsForm.color" maxlength="50"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('PRODUCT.UOM')}`" prop="uom">
                  <el-select
                    v-model="specificationsForm.uom"
                    :title="showUomLabel(specificationsForm.uom)"
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
              <el-col :span="8">
                <el-form-item :label="`${$t('PRODUCT.defaultUOM')}`" prop="defaultUom">
                  <el-select
                    v-model="specificationsForm.defaultUom"
                    :title="showUomLabel(specificationsForm.defaultUom)"
                    placeholder=""
                    @change="changeDefaultUOM"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in defaultUomList"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  :label="`${$t('PRODUCT.minimumPackagingUnit')}`"
                  prop="minimumPackagingUnit"
                >
                  <el-select
                    v-model="specificationsForm.minimumPackagingUnit"
                    :title="showUomLabel(specificationsForm.minimumPackagingUnit)"
                    placeholder=""
                    filterable
                    clearable
                    @change="changeUom('minimumPackagingUnit')"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in allUomListForMin"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="`${$t('PRODUCT.ratio')}`"
                  prop="minimumPackagingUnitCoefficient"
                  :rules="[
                    {
                      required: !!specificationsForm.minimumPackagingUnit,
                      message: $t('ui.reqMsg'),
                      trigger: ['blur']
                    }
                  ]"
                >
                  <div style="display: flex">
                    <el-input-number
                      style="width: 100%"
                      v-model="specificationsForm.minimumPackagingUnitCoefficient"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="99999"
                      @change="inputNumberChange('minimumPackagingUnitCoefficient')"
                    />
                    <div
                      slot="label"
                      style="text-align: left; white-space: nowrap"
                      v-if="specificationsForm.uom"
                    >
                      <span class="ml10" style="font-size: 16px">x</span>
                      <span class="ml10">{{ specificationsForm.uom }}</span>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('PRODUCT.purchaseUOM')}`" prop="purchaseUom">
                  <el-select
                    v-model="specificationsForm.purchaseUom"
                    :title="showUomLabel(specificationsForm.purchaseUom)"
                    placeholder=""
                    style="width: 100%"
                    @change="changeUom"
                  >
                    <el-option
                      v-for="item in defaultUomList"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="`${$t('PRODUCT.supplementaryPackagingUnit')}`">
                  <el-select
                    v-model="specificationsForm.supplementaryPackagingUnit"
                    :title="showUomLabel(specificationsForm.supplementaryPackagingUnit)"
                    placeholder=""
                    filterable
                    clearable
                    @change="changeUom('supplementaryPackagingUnit')"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in allUomListForSup"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="`${$t('PRODUCT.ratio')}`"
                  prop="supplementaryPackagingUnitCoefficient"
                  :rules="[
                    {
                      required: !!specificationsForm.supplementaryPackagingUnit,
                      message: $t('ui.reqMsg'),
                      trigger: ['blur']
                    }
                  ]"
                >
                  <div style="display: flex">
                    <el-input-number
                      style="width: 100%"
                      v-model="specificationsForm.supplementaryPackagingUnitCoefficient"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="99999"
                      @change="inputNumberChange('supplementaryPackagingUnitCoefficient')"
                    />
                    <div
                      slot="label"
                      style="text-align: left; white-space: nowrap"
                      v-if="specificationsForm.uom"
                    >
                      <span class="ml10" style="font-size: 16px">x</span>
                      <span class="ml10">{{ specificationsForm.uom }}</span>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('PRODUCT.salesUOM')}`" prop="salesUom">
                  <el-select
                    v-model="specificationsForm.salesUom"
                    :title="showUomLabel(specificationsForm.salesUom)"
                    placeholder=""
                    style="width: 100%"
                    @change="changeUom"
                  >
                    <el-option
                      v-for="item in defaultUomList"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="`${$t('PRODUCT.packagingUnit')}`">
                  <el-select
                    v-model="specificationsForm.packagingUnit"
                    :title="showUomLabel(specificationsForm.packagingUnit)"
                    placeholder=""
                    filterable
                    clearable
                    @change="changeUom('packagingUnit')"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in allUomListForPackaging"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="`${$t('PRODUCT.ratio')}`"
                  prop="packagingUnitCoefficient"
                  :rules="[
                    {
                      required: !!specificationsForm.packagingUnit,
                      message: $t('ui.reqMsg'),
                      trigger: ['blur']
                    }
                  ]"
                >
                  <div style="display: flex">
                    <el-input-number
                      style="width: 100%"
                      v-model="specificationsForm.packagingUnitCoefficient"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="99999"
                      @change="inputNumberChange('packagingUnitCoefficient')"
                    />
                    <div
                      slot="label"
                      style="text-align: left; white-space: nowrap"
                      v-if="specificationsForm.uom"
                    >
                      <span class="ml10" style="font-size: 16px">x</span>
                      <span class="ml10">{{ specificationsForm.uom }}</span>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('PRODUCT.inventoryUOM')}`" prop="inventoryUom">
                  <el-select
                    v-model="specificationsForm.inventoryUom"
                    :title="showUomLabel(specificationsForm.inventoryUom)"
                    placeholder=""
                    style="width: 100%"
                    @change="changeUom"
                  >
                    <el-option
                      v-for="item in defaultUomList"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item :label="$t('ui.remarks')">
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
        <div class="form-card mt10">
          <el-collapse v-model="specificationsActiveNames">
            <el-collapse-item name="1">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('menu.productExtended')"
                :warning="collapseWarningForSpecificationsProductExtended"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <el-table
                  border
                  ref="tables"
                  max-height="600px"
                  :row-key="rowIdKey"
                  :data="tableList"
                  v-table-tab
                >
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
                    v-for="item in specificationsColumn"
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
                      <span
                        v-if="
                          [
                            'uom',
                            'defaultUom',
                            'purchaseUom',
                            'salesUom',
                            'inventoryUom',
                            specificationsForm.minimumPackagingUnit ? 'minimumPackagingUnit' : '',
                            specificationsForm.supplementaryPackagingUnit
                              ? 'supplementaryPackagingUnit'
                              : '',
                            specificationsForm.packagingUnit ? 'packagingUnit' : ''
                          ].includes(item.prop)
                        "
                      >
                        <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                      </span>
                      <span v-else>{{ column.label }}</span>
                    </template>
                    <template slot-scope="scope">
                      <template v-if="item.prop === 'legalEntityId'">
                        <el-select
                          v-model="scope.row.legalEntityId"
                          clearable
                          placeholder=""
                          style="width: 98%"
                          class="log-msg-ellipsis"
                          filterable
                          disabled
                        >
                          <el-option
                            v-for="dict in extendedOrganizationList"
                            :key="dict.id"
                            :label="dict.legalEntityName"
                            :value="dict.id"
                          ></el-option>
                        </el-select>
                      </template>
                      <template v-else-if="item.prop === 'localization'">{{
                        selectDictLabel(dict.type.sys_localization, scope.row.localization)
                      }}</template>
                      <template v-else>{{ scope.row[item.prop] }}</template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </template>
  </FormPageLayoutTabs>
</template>

<script>
// import { queryProductByProductName } from '@/api/productManagement/productInfo'

import {
  queryLegalEntityList,
  saveDraftProductExtended,
  saveProductExtended
} from '@/api/productManagement/productExtended'
import {
  queryVolumeUomList,
  queryWeightUomList,
  queryLengthUomList,
  queryEnglishAllUomList,
  queryAllUomListByLocalization
} from '@/api/system/uom'
import { queryActiveProductCategoryTreeList } from '@/api/productManagement/productCategory'
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'

import myUploadTable from '@/components/Common/htz-image-upload/my-upload-table.vue'

export default {
  dicts: ['product_extended_status', 'sys_localization'],
  mixins: [pageMixin],
  components: { FormPageLayoutTabs, myUploadTable },
  data() {
    const vm = this
    const checkValueNameIfExist = (rule, value, callback) => {
      if (value) {
        return this.validateHas(value, callback)
      }
      callback()
    }
    return {
      rowIdKey: 'customId',
      activeName: 'basicInfo',
      activeNames: ['1', '2'],
      rowId: '',
      timeId: '',
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForPicture: false,
      collapseWarningForSpecificationsProductExtended: false,
      specificationsActiveNames: ['1'],
      specificationsForm: {},
      rules: {
        productCategoryIdList: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['change']
          }
        ],
        legalEntityIdList: [
          {
            required: true,
            type: 'array',
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
            // eslint-disable-next-line
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
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
        defaultUom: [
          {
            required: true,
            // eslint-disable-next-line
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ],
        purchaseUom: [
          {
            required: true,
            // eslint-disable-next-line
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ],
        salesUom: [
          {
            required: true,
            // eslint-disable-next-line
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ],
        inventoryUom: [
          {
            required: true,
            // eslint-disable-next-line
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ]
      },
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
      productCategoryData: [],
      allUomList: [],
      volumeUomList: [],
      weightUomList: [],
      lengthUomList: [],
      productInfo: {},
      extendedOrganizationList: [],
      tableList: [],
      englishAllUomList: []
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
        if (this.rowId) {
          this.handleUpdate()
        } else {
          this.handleAdd()
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
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    async validateHas(value, callback) {
      // const param = {
      //   productName: value
      // }
      try {
        // const res = await queryProductByProductName(param)
        // this.productInfo = res.data || {}
        // if (JSON.stringify(this.productInfo) !== '{}') {
        //   return callback(new Error(this.$t('PRODUCT.productIsAlready')))
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
    handleAdd() {
      this.reset()
      this.queryActiveProductCategoryTreeList()
      this.queryAllUomList()
      this.queryLegalEntityList()
    },

    queryLegalEntityList() {
      queryLegalEntityList({}).then((res) => {
        this.extendedOrganizationList = res.data || []
      })
    },
    extendedOrganizationChange() {
      const { legalEntityIdList } = this.form
      if (legalEntityIdList && legalEntityIdList.length > 0) {
        this.tableList = this.extendedOrganizationList
          .filter((x) => legalEntityIdList.indexOf(x.id) !== -1)
          .map((k) => {
            return {
              legalEntityName: k.legalEntityName,
              legalEntityId: k.id,
              localization: k.localization
            }
          })
        this.tableListUomChange()
      } else {
        this.tableList = []
      }
    },
    reset() {
      this.form = {
        purposeList: ['1'],
        productType: '1',
        isActive: '1',
        includeDecimal: '0',
        isRawMaterial: '1',
        isSequenceCode: '1',
        isPhantom: '0',
        productStatus: undefined,
        barcodeControl: '1',
        legalEntityIdList: [],
        createdBy: this.$store.state.user.nickName
      }
      this.specificationsForm = {
        uom: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.activeName = 'basicInfo'
      this.activeNames = ['1', '2', '3']
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
      this.resetForm('form1')
      this.resetForm('form2')
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
        this.tableListUomChange()
      })

      if (type === 'minimumPackagingUnit') {
        this.$refs.form2.clearValidate('minimumPackagingUnitCoefficient')
      }
      if (type === 'supplementaryPackagingUnit') {
        this.$refs.form2.clearValidate('supplementaryPackagingUnitCoefficient')
      }
      if (type === 'packagingUnit') {
        this.$refs.form2.clearValidate('packagingUnitCoefficient')
      }
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
    handleClick() {},
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/productManagement/productExtended' })
    },

    queryAllUomList() {
      queryAllUomListByLocalization({}).then((res) => {
        // this.englishAllUomList = res.data || []

        this.allUomList = (res.data || []).map((x) => x.uomName) || []
      })
      queryEnglishAllUomList({}).then((res) => {
        this.englishAllUomList = res.data || []
      })
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
    async submitForm() {
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
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
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
      if (this.tableList && this.tableList.length > 0) {
        const uom = this.tableList.some((x) => !this.$resultOfBoolean(x.uom))
        if (uom) {
          this.activeName = 'specifications'
          this.collapseWarningForSpecificationsProductExtended = true
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.UOM')))
          return
        }
        const defaultUom = this.tableList.some((x) => !this.$resultOfBoolean(x.defaultUom))
        if (defaultUom) {
          this.activeName = 'specifications'
          this.collapseWarningForSpecificationsProductExtended = true
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.defaultUOM'))
          )
          return
        }
        const purchaseUom = this.tableList.some((x) => !this.$resultOfBoolean(x.purchaseUom))
        if (purchaseUom) {
          this.activeName = 'specifications'
          this.collapseWarningForSpecificationsProductExtended = true
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.purchaseUOM'))
          )
          return
        }
        const salesUom = this.tableList.some((x) => !this.$resultOfBoolean(x.salesUom))
        if (salesUom) {
          this.activeName = 'specifications'
          this.collapseWarningForSpecificationsProductExtended = true
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.salesUOM'))
          )
          return
        }
        const inventoryUom = this.tableList.some((x) => !this.$resultOfBoolean(x.inventoryUom))
        if (inventoryUom) {
          this.activeName = 'specifications'
          this.collapseWarningForSpecificationsProductExtended = true
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.inventoryUOM'))
          )
          return
        }
        const minimumPackagingUnit = this.tableList.some(
          (x) =>
            this.specificationsForm.minimumPackagingUnit &&
            !this.$resultOfBoolean(x.minimumPackagingUnit)
        )
        if (minimumPackagingUnit) {
          this.activeName = 'specifications'
          this.collapseWarningForSpecificationsProductExtended = true
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.minimumPackagingUnit'))
          )
          return
        }
        const supplementaryPackagingUnit = this.tableList.some(
          (x) =>
            this.specificationsForm.supplementaryPackagingUnit &&
            !this.$resultOfBoolean(x.supplementaryPackagingUnit)
        )
        if (supplementaryPackagingUnit) {
          this.activeName = 'specifications'
          this.collapseWarningForSpecificationsProductExtended = true
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.supplementaryPackagingUnit'))
          )
          return
        }
        const packagingUnit = this.tableList.some(
          (x) => this.specificationsForm.packagingUnit && !this.$resultOfBoolean(x.packagingUnit)
        )
        if (packagingUnit) {
          this.activeName = 'specifications'
          this.collapseWarningForSpecificationsProductExtended = true
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.packagingUnit'))
          )
          return
        }
      }
      if (valid1 && valid2) {
        let param = { ...this.form }
        param.ivtSpecifications = { ...this.specificationsForm }
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // if (param.purposeList.length > 1) {
        //   param.purposeList = ['1', '2']
        // }
        param.purpose = param.purposeList.join(',')
        param.legalEntityIds = param.legalEntityIdList.join(',')

        if (param.productCategoryIdList) {
          param.productCategoryId =
            param.productCategoryIdList[param.productCategoryIdList.length - 1]
        }

        param.commonFileListForImage = pictureFiles
        param.commonFileList = myFileIds
        param.productExtendedList = this.tableList
        this.$modal
          .confirm(this.$t('PRODUCT.productSubmit'))
          .then(() => {
            return saveProductExtended(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(
              this.$t('PRODUCT.productSuccess').replace('$1', param.productName)
            )
            this.cancel()
          })
          .catch(() => {})
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
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        this.collapseWarningForBasicInfo = true
        return
      }
      this.collapseWarningForBasicInfo = false
      if (!isError) {
        let param = { ...this.form }
        param.ivtSpecifications = { ...this.specificationsForm }
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // if (param.purposeList.length > 1) {
        //   param.purposeList = ['1', '2']
        // }
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
