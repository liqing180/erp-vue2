<template>
  <FormPageLayoutTabs>
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
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
                <span class="info-item mr20" :title="form.productName">
                  {{ $t('PRODUCT.productName') }} : {{ form.productName }}
                </span>
                <span class="info-item">
                  {{ $t('ui.status') }} :
                  {{ selectDictLabel(dict.type.ivt_product_status, form.productStatus) }}
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
                      <el-input v-model="form.internalPartNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('PRODUCT.productName')}`" prop="productName">
                      <el-input
                        v-model="form.productName"
                        :title="form.productName"
                        maxlength="200"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        v-if="form.productStatus === '0'"
                        :value="$t('ui.superseded')"
                        disabled
                      ></el-input>
                      <el-input
                        v-else
                        :value="selectDictLabel(dict.type.ivt_product_status, form.productStatus)"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.alias')}`">
                      <el-input v-model="form.alias" :title="form.alias" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.chineseName')}`">
                      <el-input v-model="form.chineseName" maxlength="200"></el-input>
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
                      <el-radio-group v-model="form.barcodeControl" disabled>
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
                        disabled
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
                  <div class="mb20">
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
      <div v-show="activeName === 'specifications'" class="form-card form-card--p20">
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
              <el-form-item :label="`${$t('PRODUCT.l')}`">
                <div style="display: flex">
                  <el-input-number
                    style="width: 100%"
                    v-model="specificationsForm.length"
                    controls-position="right"
                    :controls="!comDisFrom"
                    :precision="2"
                    v-thousandSplit="{ precision: 2 }"
                    :min="0"
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
                    :controls="!comDisFrom"
                    :precision="2"
                    v-thousandSplit="{ precision: 2 }"
                    :min="0"
                    :max="999.99"
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
              <el-form-item :label="`${$t('PRODUCT.h')}`">
                <div style="display: flex">
                  <el-input-number
                    style="width: 100%"
                    v-model="specificationsForm.height"
                    controls-position="right"
                    :controls="!comDisFrom"
                    :precision="2"
                    v-thousandSplit="{ precision: 2 }"
                    :min="0"
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
                    :controls="!comDisFrom"
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
                    :controls="!comDisFrom"
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
                  disabled
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
                  disabled
                  v-model="specificationsForm.defaultUom"
                  :title="showUomLabel(specificationsForm.defaultUom)"
                  placeholder=""
                  @change="changeDefaultUOM"
                  style="width: 100%"
                >
                  <el-option v-for="item in defaultUomList" :key="item" :label="item" :value="item">
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
                  disabled
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
                    disabled
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
                  disabled
                  v-model="specificationsForm.purchaseUom"
                  :title="showUomLabel(specificationsForm.purchaseUom)"
                  placeholder=""
                  style="width: 100%"
                >
                  <el-option v-for="item in defaultUomList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('PRODUCT.supplementaryPackagingUnit')}`">
                <el-select
                  disabled
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
                    disabled
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
                  disabled
                  placeholder=""
                  style="width: 100%"
                >
                  <el-option v-for="item in defaultUomList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('PRODUCT.packagingUnit')}`">
                <el-select
                  disabled
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
                    disabled
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
                  disabled
                  v-model="specificationsForm.inventoryUom"
                  :title="showUomLabel(specificationsForm.inventoryUom)"
                  placeholder=""
                  style="width: 100%"
                >
                  <el-option v-for="item in defaultUomList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row> </el-row>
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
    </template>
  </FormPageLayoutTabs>
</template>

<script>
import { reviseProduct, queryProductById } from '@/api/productManagement/productInfo'
import {
  queryAllUomList,
  queryVolumeUomList,
  queryWeightUomList,
  queryLengthUomList
} from '@/api/system/uom'
import { queryActiveProductCategoryTreeList } from '@/api/productManagement/productCategory'
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'
import myUploadTable from '@/components/Common/htz-image-upload/my-upload-table.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  dicts: ['ivt_product_status'],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    myUploadTable,
    SystemOperationLogTable
  },
  data() {
    return {
      activeName: 'basicInfo',
      activeNames: [],
      rowId: '',
      timeId: '',
      // 是否自动生成 EmployeeNo
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForPicture: false,
      specificationsForm: {},

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
        ]
      },
      productCategoryData: [],
      allUomList: [],
      volumeUomList: [],
      weightUomList: [],
      lengthUomList: []
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
    },

    modifyHighlight() {
      if (this.approvedBtnShow) {
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
    handleClick() {},

    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      this.queryActiveProductCategoryTreeList()
      this.queryAllUomList()
      queryProductById(rowId).then((res) => {
        const data = res.data || {}

        /* 初始化 AddressInfo */
        setTimeout(() => {
          this.$refs.uploadPictureRef.initFileList(data.commonFileListForImage || [])
          this.$refs.uploadRef.initFileList(data.commonFileList || [])
        }, 300)

        data.purposeList = data.purpose ? data.purpose.split(',') : []
        this.form = data
        this.specificationsForm = data.ivtSpecifications || {}
        const { uom } = this.specificationsForm
        this.$set(this.form, 'uom', uom || undefined)
      })
    },
    // 取消按钮
    back() {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/productManagement/productExtended' })
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
        isPhantom: '0',
        productStatus: '1',
        barcodeControl: '1',
        createdBy: this.$store.state.user.nickName
      }
      this.specificationsForm = {
        uom: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.activeName = 'basicInfo'
      this.activeNames = ['1', '2', '3', '4']
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
    queryAllUomList() {
      queryAllUomList().then((res) => {
        this.allUomList = res.data || []
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

        if (type === 'minimumPackagingUnit') {
          this.$refs.form2.clearValidate('minimumPackagingUnitCoefficient')
        }
        if (type === 'supplementaryPackagingUnit') {
          this.$refs.form2.clearValidate('supplementaryPackagingUnitCoefficient')
        }
        if (type === 'packagingUnit') {
          this.$refs.form2.clearValidate('packagingUnitCoefficient')
        }
      })
    },
    changeDefaultUOM() {
      const uom = this.specificationsForm.defaultUom
      if (uom) {
        this.$set(this.specificationsForm, 'purchaseUom', uom)
        this.$set(this.specificationsForm, 'salesUom', uom)
        this.$set(this.specificationsForm, 'inventoryUom', uom)
      }
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
      const valid2 = await this.$refs.form2.validate().catch((err) => {
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
      if (!valid2) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.specifications'))
        )
        return
      }
      if (valid1 && valid2) {
        let param = { ...this.form }
        param.ivtSpecifications = { ...this.specificationsForm }
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // if (param.purposeList.length > 1) {
        //   param.purposeList = ['1', '2']
        // }
        param.purpose = param.purposeList.join(',')
        if (param.productCategoryIdList) {
          param.productCategoryId =
            param.productCategoryIdList[param.productCategoryIdList.length - 1]
        }

        param.commonFileListForImage = pictureFiles
        param.commonFileList = myFileIds
        param.ivtSpecifications.uom = this.form.uom
        this.$modal
          .confirm(this.$t('PRODUCT.productSubmit'))
          .then(() => {
            return reviseProduct(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(this.$t('PRODUCT.productSuccess').replace('$1', response.msg))
            this.back()
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
