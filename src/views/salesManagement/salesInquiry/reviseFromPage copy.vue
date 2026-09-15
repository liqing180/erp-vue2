<template>
  <FormPageLayout ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        :disabled="getVarContentLoading"
        v-if="!comDisFrom"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>

      <el-button
        type="primary"
        size="mini"
        v-if="previewPDFShow"
        :loading="previewPDFLoading"
        @click="handlePreviewPDF"
        >{{ $t('menu.previewPDF') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="printPDFShow" @click="handlePrintPDF"
        >{{ $t('menu.printPDF') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="exportPDFShow" @click="handleExportPDF"
        >{{ $t('menu.exportPDF') }}
      </el-button>
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
                <span class="info-item mr20" :title="form.businessPartnerName">
                  {{ $t('SALES.customerName') }} : {{ form.businessPartnerName }}
                </span>
                <span v-if="form.salesPersonBy" class="info-item mr20" :title="form.salesPersonBy">
                  {{ $t('SALES.salesPerson') }} : {{ form.salesPersonBy }}
                </span>
                <span class="info-item">
                  {{ $t('ui.status') }} :
                  {{ selectDictLabel(dict.type.sales_inquiry_status, form.salesInquiryStatus) }}
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
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.salesInquiryType')}`"
                      prop="salesInquiryType"
                    >
                      <el-select
                        v-model="form.salesInquiryType"
                        placeholder=""
                        disabled
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in dict.type.sales_inquiry_type"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(dict.type.sales_inquiry_status, form.salesInquiryStatus)
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesInquiryNo')}`">
                      <el-input v-model="form.salesInquiryNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerName')}`" prop="businessPartnerName">
                      <SelectInput
                        clearable
                        :value="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        @click="openSupplierTable"
                        @clear="supplierClear"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerCode')}`">
                      <el-input v-model="form.businessPartnerNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.taxRate')}`">
                      <el-input :disabled="true" :value="$numberStr(form.taxRate, 1)"></el-input>
                    </el-form-item>
                  </el-col> -->

                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.ourRef')}`">
                      <el-input
                        :disabled="disInQuotation"
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`" prop="currencyId">
                      <CommonSelect
                        :disabled="true"
                        :id="form.currencyCode"
                        :label="form.currency"
                        :title="form.currency"
                        idKey="currencyCode"
                        labelKey="currency"
                        :filterable="true"
                        :options="currencyOptions || []"
                        @change="currencyChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <!-- <el-form-item :label="`${$t('ui.paymentMethod')}`" prop="paymentMethodIdList">
                      <ToolTipShowList
                        :list="form.paymentMethodNameList || []"
                        :popoverTitle="$t('ui.paymentMethod')"
                      >
                        <CommonMultipleSelect
                          :disabled="disInQuotation"
                          :ids="form.paymentMethodIdList"
                          :labels="form.paymentMethodNameList"
                          :showTitle="false"
                          idKey="value"
                          labelKey="label"
                          :options="dict.type.business_partner_payment_method"
                          @change="paymentMethodChange"
                        />
                      </ToolTipShowList>
                    </el-form-item> -->
                    <el-form-item :label="`${$t('ui.paymentTerm')}`" prop="paymentTermId">
                      <ToolTipPaymentTerm :paymentTermObj="form.paymentTerm || {}">
                        <SelectInput
                          disabled
                          v-model="form.paymentTermName"
                          :title="form.paymentTermName"
                        />
                      </ToolTipPaymentTerm>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.ourRef')}`">
                      <el-input
                        :disabled="disInQuotation"
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="30"
                      ></el-input>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.yourRef')}`">
                      <el-input
                        :disabled="disInQuotation"
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8" v-if="false">
                    <el-form-item :label="`${$t('SALES.department')}`" prop="departmentId">
                      <CommonSelect
                        :disabled="disInQuotation"
                        :id="form.departmentId"
                        :label="form.departmentName"
                        :title="form.allSuperiorName"
                        idKey="departmentId"
                        labelKey="departmentName"
                        :options="deptOptions"
                        @change="departmentChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesPerson')}`" prop="salesPersonBy">
                      <!-- <SelectInput
                        :value="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        @clear="purchasePersonClear"
                        clearable
                        @click="openPurchasePersonTable"
                        :disabled="!form.departmentId || comDisFrom || disInQuotation"
                      /> -->

                      <CommonSelectAndList
                        :id="form.salesPersonId"
                        :label="form.salesPersonBy"
                        idKey="userId"
                        labelKey="nickName"
                        filterable
                        :options="salesPersonList"
                        :disabled="!form.departmentId || comDisFrom || disInQuotation"
                        :loading="salesPersonLoading"
                        @change="updatePurchasePerson"
                        @handleOpen="openPurchasePersonTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesInquiryType === 'Trading' && false">
                    <el-form-item :label="`${$t('SALES.projectCode')}`" prop="costProjectId">
                      <SelectInput
                        :value="form.costProjectCode"
                        :title="form.costProjectCode"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="['Consignment', 'Service'].includes(form.salesInquiryType) && false"
                    key="priceType222"
                  >
                    <el-form-item :label="`${$t('SALES.priceType')}`" required>
                      <SelectInput
                        :value="form.priceTypeName"
                        :title="form.priceTypeName"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.taxRate')}`">
                      <el-input :disabled="true" :value="$numberStr(form.taxRate, 1)"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="form.salesInquiryType !== 'Trading'">
                    <el-form-item :label="`${$t('SALES.leadTimeDays2')}`">
                      <div class="flex">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.deliveryDateForDay"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          controls-position="right"
                          style="width: 100%"
                          :controls="form.salesInquiryType !== 'Project'"
                          @change="deliveryDateChange('deliveryDateForDay')"
                        />
                        <span
                          v-if="form.salesInquiryType === 'Project'"
                          class="mr5 ml5"
                          style="font-size: 12px; color: #606266"
                          >{{ $t('SALES.day') }}</span
                        >
                        <el-date-picker
                          v-if="form.salesInquiryType === 'Project'"
                          v-model="form.deliveryDate"
                          :picker-options="deliveryDatePickerOptions"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          style="width: 60%"
                          class="fs-0"
                          placeholder=""
                          @change="deliveryDateChange('deliveryDate')"
                          clearable
                        ></el-date-picker>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesInquiryType === 'Trading'">
                    <el-form-item :label="`${$t('SALES.leadTimeDays2')}`">
                      <div class="flex">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.deliveryDateForDay"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          controls-position="right"
                          style="width: 100%"
                          :controls="form.salesInquiryType !== 'Project'"
                          @change="deliveryDateChange('deliveryDateForDay')"
                        />
                        <span
                          v-if="form.salesInquiryType === 'Project'"
                          class="mr5 ml5"
                          style="font-size: 12px; color: #606266"
                          >{{ $t('SALES.day') }}</span
                        >
                        <el-date-picker
                          v-if="form.salesInquiryType === 'Project'"
                          v-model="form.deliveryDate"
                          :picker-options="deliveryDatePickerOptions"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          style="width: 60%"
                          class="fs-0"
                          placeholder=""
                          @change="deliveryDateChange('deliveryDate')"
                          clearable
                        ></el-date-picker>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <template v-if="form.salesInquiryType === 'Consignment'">
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('SALES.consignmentStart')}`"
                        prop="consignmentStartTime"
                      >
                        <el-date-picker
                          v-model="form.consignmentStartTime"
                          :picker-options="consignmentStartTimePickerOptions"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                          @change="consignmentStartTimeChange"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('SALES.consignmentEnd')}`"
                        prop="consignmentEndTime"
                      >
                        <el-date-picker
                          v-model="form.consignmentEndTime"
                          :picker-options="consignmentEndTimePickerOptions"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                          :disabled="!form.consignmentStartTime"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </template>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.validityDays')}`" prop="validityForDay">
                      <el-input-number
                        v-thousandSplit="{ precision: 0 }"
                        v-model="form.validityForDay"
                        :disabled="disInQuotation"
                        :precision="0"
                        type="number"
                        :min="1"
                        :max="999"
                        controls-position="right"
                        style="width: 100%"
                        @change="validityChange('validityForDay')"
                      />
                      <div class="flex" v-if="false">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.validityForDay"
                          :disabled="disInQuotation"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          :controls="false"
                          style="width: 30%"
                          @change="validityChange('validityForDay')"
                        />
                        <span class="mr5 ml5" style="font-size: 12px; color: #606266">{{
                          $t('SALES.day')
                        }}</span>
                        <el-date-picker
                          @change="validityChange('validity')"
                          :disabled="disInQuotation"
                          v-model="form.validity"
                          :picker-options="validityDaysPickerOptions"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '70%' }"
                          placeholder=""
                          clearable
                        ></el-date-picker>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row v-if="form.salesInquiryType === 'Project' && false">
                  <el-col :span="16">
                    <el-form-item :label="`${$t('SALES.productInfo')}`" prop="productMsgTypeList">
                      <el-checkbox-group
                        :disabled="disInQuotation"
                        v-model="form.productMsgTypeList"
                        style="height: 36px"
                      >
                        <el-checkbox label="1">{{ $t('SALES.materialList') }}</el-checkbox>
                        <el-checkbox label="2">{{ $t('SALES.projectTask') }}</el-checkbox>
                        <el-checkbox label="3">{{ $t('SALES.projectCost') }}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row
                  v-if="['Trading', 'Service'].includes(form.salesInquiryType)"
                  key="priceType11"
                >
                  <el-col
                    :span="8"
                    v-if="['Trading'].includes(form.salesInquiryType) && false"
                    key="priceType111"
                  >
                    <el-form-item :label="`${$t('SALES.priceType')}`" required>
                      <SelectInput
                        :value="form.priceTypeName"
                        :title="form.priceTypeName"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="form.salesInquiryType === 'Trading' && false">
                    <el-form-item :label="`${$t('SALES.priceTbd2')}`">
                      <el-switch
                        v-model="form.priceTbd"
                        active-value="1"
                        inactive-value="0"
                        disabled
                      ></el-switch>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="form.salesInquiryType === 'Service' && false">
                    <el-form-item :label="`${$t('SALES.priceTbd')}`">
                      <el-switch
                        v-model="form.priceTbd"
                        active-value="1"
                        inactive-value="0"
                        disabled
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')">
                      <MyInput
                        type="textarea"
                        v-model="form.basicRemarks"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="['Trading', 'Service'].includes(form.salesInquiryType)">
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.dropShipping')}`">
                      <el-switch
                        v-model="form.dropShipping"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
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
                :title="$t('SALES.shippingInfo')"
                :warning="collapseWarningForShippingInfo"
              >
                <span v-if="form.incotermName" class="info-item mr20" :title="form.incotermName">
                  {{ $t('SALES.incoterm') }} : {{ form.incotermName }}
                </span>
                <span
                  v-if="form.receiveAddressName"
                  class="info-item mr20"
                  :title="form.receiveAddressName"
                >
                  {{ $t('ui.address') }} : {{ form.receiveAddressName }}
                </span>
              </FormCollapseItemTitle>
              <el-form
                ref="form2"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                    <el-form-item :label="`${$t('SALES.incoterm')}`" prop="incotermId">
                      <CommonSelect
                        :id="form.incotermId"
                        :label="form.incotermName"
                        :title="form.incotermName"
                        idKey="incotermId"
                        labelKey="incotermName"
                        :options="incotermOptions"
                        @change="incotermIdChange"
                        :disabled="!form.businessPartnerId || comDisFrom || disInQuotation"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                    <el-form-item
                      :label="`${$t('SALES.port')}`"
                      prop="receivePortName"
                      :rules="[
                        {
                          required: ['FAS', 'CIF', 'FOB', 'CFR'].includes(
                            form.incotermAbbreviation
                          ),
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <el-input
                        v-if="form.incotermAddressType === '0'"
                        :value="$t('SALES.selfCollect')"
                        disabled
                      ></el-input>
                      <ToolTipShowObj
                        v-else
                        :mData="form.receiveAddressForPort || {}"
                        :showStr="form.receivePortName"
                        :rows="shipToAddressRows"
                      >
                        <SelectInput
                          :value="form.receivePortName"
                          @clear="receivePortClear"
                          clearable
                          @click="openPortTable"
                          :disabled="
                            !form.incotermId ||
                            !['FAS', 'CIF', 'FOB', 'CFR', 'FCA'].includes(
                              form.incotermAbbreviation
                            ) ||
                            comDisFrom ||
                            disInQuotation
                          "
                          class="form-wd"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                  <!-- 隐藏仓库名称字段, 后端该字段自动填充当前法人的默认仓库， 2.0.9-14: 91行 -->
                  <el-col :span="8" v-if="form.salesInquiryType === 'Consignment'">
                    <el-form-item :label="`${$t('SALES.warehouseName')}`" prop="warehouseName">
                      <ToolTipShowObj
                        :mData="form.addressForWarehouse || {}"
                        :showStr="form.warehouseName"
                        :rows="warehouseRows"
                      >
                        <!-- <SelectInput
                          clearable
                          :value="form.warehouseName"
                          @click="openWarehouseTable"
                          @clear="warehouseClear"
                          :disabled="comDisFrom || disInQuotation"
                        /> -->

                        <CommonSelectAndList
                          :id="form.warehouseId"
                          :label="form.warehouseName"
                          idKey="warehouseId"
                          labelKey="warehouseName"
                          filterable
                          :options="warehouseList"
                          :disabled="comDisFrom || disInQuotation"
                          :loading="warehouseLoading"
                          @change="updateWarehouse"
                          @handleOpen="openWarehouseTable"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <el-form-item
                      :label="`${$t('SALES.deliveryAddress')}`"
                      prop="receiveAddressName"
                      :rules="[
                        {
                          required:
                            [
                              'CPT',
                              'CIP',
                              'DDP',
                              'DAP',
                              'DPU',
                              'FCA',
                              'CIF',
                              'FOB',
                              'CFR'
                            ].includes(form.incotermAbbreviation) || !form.incotermAbbreviation,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <div class="input-switch-box">
                        <div class="con-left">
                          <!-- <SelectInput
                            :value="form.receiveAddressName"
                            :title="form.receiveAddressName"
                            @clear="receiveAddressClear(true)"
                            clearable
                            @click="openReceiveAddressTable"
                            :disabled="
                              !form.businessPartnerId ||
                              form.incotermAbbreviation === 'EXW' ||
                              comDisFrom ||
                              disInQuotation
                            "
                            class="form-wd"
                          /> -->

                          <CommonSelectAndList
                            :id="form.receiveAddressId"
                            :label="form.receiveAddress"
                            idKey="businessAddressId"
                            labelKey="receiveAddress"
                            filterable
                            :options="businessAddressList"
                            :disabled="
                              !form.businessPartnerId ||
                              form.incotermAbbreviation === 'EXW' ||
                              comDisFrom ||
                              disInQuotation
                            "
                            :loading="businessAddressLoading"
                            @change="updateAddress"
                            @handleOpen="openReceiveAddressTable"
                          />
                        </div>
                        <div
                          class="con-right"
                          v-if="
                            !(
                              !form.businessPartnerId ||
                              form.incotermAbbreviation === 'EXW' ||
                              comDisFrom ||
                              disInQuotation
                            )
                          "
                        >
                          <i
                            class="el-icon-edit primary"
                            style="font-size: 20px"
                            @click="openAddBPAddressDlg"
                          ></i>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.zone')}`">
                      <el-input :value="form.district" :title="form.district" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.contactPerson')}`" prop="bpContactPersonId">
                      <CommonSelect
                        :disabled="!form.businessPartnerId || disInQuotation"
                        :id="form.bpContactPersonId"
                        :label="form.bpContactPersonName"
                        :title="form.bpContactPersonName"
                        idKey="contactPersonId"
                        labelKey="contactPersonName"
                        :options="
                          (form.bpBusinessContactPersonList || []).filter((p) => p.isActive === '1')
                        "
                        @change="contactPersonChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input v-model="form.bpEmail" :title="form.bpEmail" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.mobilePhone')}`">
                      <el-input
                        v-model="form.bpMobilePhone"
                        :title="form.bpMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.consignee')}`" prop="consignee">
                      <el-input
                        v-model="form.consignee"
                        :title="form.consignee"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0" ref="collapseScrollPage">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
                <span v-if="$resultOfBoolean(form.totalAmount)" class="info-item mr20">
                  {{ $t('SALES.totalAmount') }} : {{ $numberStr(form.totalAmount, 2) }}
                </span>
                <span v-if="$resultOfBoolean(form.totalTaxAmount)" class="info-item">
                  {{ $t('SALES.taxAmount') }} : {{ $numberStr(form.totalTaxAmount, 2) }}
                </span>
              </FormCollapseItemTitle>
              <div>
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :initCommonFileList="initCommonFileList"
                  :salesInquiryType="form.salesInquiryType"
                  :countryId="form.countryId"
                  :businessPartnerId="form.businessPartnerId"
                  :currencyId="form.currencyId"
                  :comDisFrom="comDisFrom"
                  @returnSubmitSuccess="back"
                  @scrollPageToTable="scrollPageToTable"
                />
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.conditions')"
                :warning="collapseWarningForConditions"
              >
              </FormCollapseItemTitle>
              <div>
                <ConditionsTable
                  ref="ConditionsTable"
                  :formData="form"
                  :comSalesConditionsList="[]"
                  :comDisFrom="true"
                  :varContentData="varContentData"
                />
              </div>
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
      </div>
    </template>
    <selectCustomerTable ref="selectCustomerTable" @update="updateSupplier" />
    <selectPurchasePersonTable
      ref="selectPurchasePersonTable"
      :departmentId="form.departmentId"
      @update="updatePurchasePerson"
    />
    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <payToAddressDlg
      ref="payToAddressDlg"
      :supplierId="form.businessPartnerMainId"
      @update="updateAddress"
    />
    <selectWarehouseTable
      ref="selectWarehouseTable"
      :salesInquiryType="form.salesInquiryType"
      :businessPartnerId="form.businessPartnerId"
      @update="updateWarehouse"
    />

    <previewQuestionnaireTemplateDlg
      ref="previewQuestionnaireTemplateDlg"
      :isCancel="true"
      :isDisabled="true"
    />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

import { queryUserDepartment } from '@/api/system/user'
import { queryIncotermList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { preview } from '@/api/purchaseManagement/purchaseOrder'
import { queryCustomerQuestionnaireById } from '@/api/salesManagement/customerQuestionnaire'

import {
  saveSalesInquiry,
  saveDraftSalesInquiry,
  querySalesInquiryById,
  approvedSalesInquiry,
  rejectedSalesInquiry,
  cancelledSalesInquiry,
  generateSalesQuotation,
  queryCanSelectWarehouseListHaveDataPermissions
} from '@/api/salesManagement/salesInquiry'
import { getFormattedVarContent } from '@/api/salesManagement/salesQuotation'
import { getToken } from '@/utils/auth'
import { queryUsers } from '@/api/organization/corporate'
import { queryAddressByBusinessPartnerId } from '@/api/purchaseManagement/purchaseContract'
import selectCustomerTable from './components/selectCustomerTable.vue'
import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'
import selectPortTable from './components/selectPortTable.vue'
import payToAddressDlg from './components/payToAddressDlg.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import ProductInfo from './productInfo/productInfo.vue'

import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import previewQuestionnaireTemplateDlg from '@/views/salesManagement/questionnaireTemplate/components/previewQuestionnaireTemplateDlg.vue'
import ConditionsTable from '@/views/salesManagement/salesQuotation/conditionsTable.vue'
export default {
  mixins: [pageMixin],
  dicts: ['sales_inquiry_type', 'sales_inquiry_status', 'business_partner_payment_method'],
  components: {
    selectCustomerTable,
    selectPurchasePersonTable,
    selectPortTable,
    selectWarehouseTable,
    payToAddressDlg,
    ProductInfo,
    SystemOperationLogTable,
    previewQuestionnaireTemplateDlg,
    ConditionsTable
  },
  data() {
    return {
      salesPersonLoading: false,
      warehouseLoading: false,
      businessAddressLoading: false,
      businessAddressList: [],
      warehouseList: [],
      salesPersonList: [],
      varContentData: {},
      getVarContentLoading: false,
      previewPDFLoading: false,
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {
        salesInquiryProductList: [],
        salesInquiryProjectList: [],
        salesInquiryServiceList: [],
        projectCostDetailList: [],
        conditionsTableList: [],
        productOrServiceList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      collapseWarningForConditions: false,
      rules: {
        salesInquiryType: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        businessPartnerName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        departmentId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        salesPersonBy: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        taxRate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        paymentTermId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        paymentMethodIdList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        validityForDay: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        deliveryDateForDay: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        paymentTermName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        productMsgTypeList: [
          {
            required: true,
            type: 'array',
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ],

        incotermId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],

        warehouseName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        bpContactPersonId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        consignee: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        bpBusinessAddressId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        consignmentStartTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        consignmentEndTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      validityDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      deliveryDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
          // return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      consignmentStartTimePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      consignmentEndTimePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      deptOptions: [],
      customerQuestionnaireOptions: [],
      currencyOptions: [],
      incotermOptions: [],
      freightTaxNoOptions: [],
      /* 表格部分 */
      initCommonFileList: [],

      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0'
      },
      shipToAddressRows: [
        {
          label: this.$t('SALES.port'),
          showLabel: 'portName'
        },
        {
          label: this.$t('SALES.code'),
          showLabel: 'portCode'
        },
        {
          label: this.$t('SALES.latLong'),
          showLabel: 'latLong'
        },
        {
          label: this.$t('SALES.telephone'),
          showLabel: 'telephone'
        },
        {
          label: this.$t('SALES.website'),
          showLabel: 'website'
        },
        {
          label: this.$t('SALES.country'),
          showLabel: 'country'
        }
      ],
      warehouseRows: [
        {
          label: this.$t('INVENTORY.warehouseCode'),
          showLabel: 'warehouseCode'
        },
        {
          label: this.$t('INVENTORY.warehouseName'),
          showLabel: 'warehouseName'
        },
        {
          label: this.$t('INVENTORY.warehouseType'),
          showLabel: 'warehouseTypeShowStr'
        },
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

      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedSalesInquiry,
      rejectedUrl: rejectedSalesInquiry,
      cancelledUrl: cancelledSalesInquiry
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
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    editAuth() {
      return this.checkPermi(['salesManagement:salesInquiry:edit'])
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
    disInQuotation() {
      return true
    },

    previewPDFShow() {
      if (!this.checkPermi(['salesManagement:salesInquiry:previewPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesInquiryId &&
        this.buttonAuthMsg.isCanPreviewPDF === '1'
      ) {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (!this.checkPermi(['salesManagement:salesInquiry:printPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesInquiryId &&
        this.buttonAuthMsg.isCanPrintPDF === '1'
      ) {
        show = true
      }
      return show
    },
    exportPDFShow() {
      if (!this.checkPermi(['salesManagement:salesInquiry:exportPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesInquiryId &&
        this.buttonAuthMsg.isCanDownloadPDF === '1'
      ) {
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
    queryUsers() {
      const param = {
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.salesInquiry,
        departmentId: this.form.departmentId
      }
      this.$trimOfObj(param)
      this.salesPersonLoading = true
      queryUsers(param)
        .then((response) => {
          this.salesPersonList = response.rows || []
          this.salesPersonLoading = false
        })
        .catch((err) => {
          this.salesPersonLoading = false
          window.console.error(err)
        })
    },

    queryAddressByBusinessPartnerId() {
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$trimOfObj(param)
      param.businessPartnerMainId = this.form.businessPartnerMainId
      this.businessAddressLoading = true
      queryAddressByBusinessPartnerId(param)
        .then((response) => {
          const rows = response.rows || []
          this.businessAddressList = rows
          this.businessAddressLoading = false
        })
        .catch((err) => {
          this.businessAddressLoading = false
          window.console.error(err)
        })
    },

    queryCanSelectWarehouseListHaveDataPermissions() {
      const param = {
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.salesInquiry
      }
      this.$trimOfObj(param)
      if (this.form.salesInquiryType === 'Consignment') {
        param.businessPartnerId = this.form.businessPartnerId
        param.warehouseType = '3'
      } else {
        param.warehouseType = '1'
      }
      this.warehouseLoading = true
      queryCanSelectWarehouseListHaveDataPermissions(param)
        .then((response) => {
          const rows = response.rows || []
          this.warehouseList = rows
          this.warehouseLoading = false
        })
        .catch((err) => {
          this.warehouseLoading = false
          window.console.error(err)
        })
    },
    consignmentStartTimeChange() {
      const { consignmentStartTime, consignmentEndTime } = this.form
      this.consignmentEndTimePickerOptions = {
        disabledDate(time) {
          const currentTime = Date.now()
          let maxTime = currentTime
          if (consignmentStartTime) {
            maxTime =
              currentTime > consignmentStartTime + 1 * 24 * 60 * 60 * 1000
                ? currentTime
                : consignmentStartTime + 1 * 24 * 60 * 60 * 1000
          }
          return time.getTime() < maxTime
        }
      }
      if (consignmentEndTime && consignmentEndTime <= consignmentStartTime) {
        this.$set(this.form, 'consignmentEndTime', undefined)
      }
    },
    handleView() {
      queryCustomerQuestionnaireById({ customerQuestionnaireId: this.form.customerQuestionnaireId })
        .then((res) => {
          this.$refs.previewQuestionnaireTemplateDlg.handleOpen(res.data)
        })
        .catch(() => {})
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      this.queryUserDepartment()
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
      querySalesInquiryById({ salesInquiryId: rowId }).then((res) => {
        const data = res.data || {}
        data.salesInquiryProductList = data.salesInquiryProductList || []
        data.salesInquiryProjectList = data.salesInquiryProjectList || []
        data.salesInquiryServiceList = (data.salesInquiryServiceList || []).map((item) => {
          item.rowTimeId = item.salesInquiryProductId || item.salesInquiryServiceId
          if (item.isTemp === '1') {
            item.customId = item.salesInquiryServiceId
          }
          return item
        })

        data.productOrServiceList = (data.productOrServiceList || []).map((item) => {
          if (item.isTemp === '1') {
            item.customId = item.salesInquiryServiceId
            item.rowTimeId = item.salesInquiryServiceId
          }
          return item
        })

        data.projectCostDetailList = data.projectCostDetailList || []

        this.initCommonFileList = data.commonFileList || []
        const addressForWarehouse = data.warehouse || {}
        const warehouseAddress = addressForWarehouse.warehouseAddress || {}
        data.addressForWarehouse = { ...addressForWarehouse, ...warehouseAddress }

        data.productMsgTypeList = data.productMsgType ? data.productMsgType.split(',') : []

        if (data.conditionsTableJson) {
          data.conditionsTableList = JSON.parse(data.conditionsTableJson)
        }

        this.form = data
        this.getFormattedVarContentFn()

        this.buttonAuthMsg = data.buttonAuthMsg || {}

        this.queryCanSelectWarehouseListHaveDataPermissions()
        this.queryUsers()
        this.queryAddressByBusinessPartnerId()
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
      this.$router.push({ path: '/salesManagement/salesInquiry' })
    },
    getFormattedVarContentFn() {
      if (this.getVTimer) {
        clearTimeout(this.getVTimer)
      }
      this.getVarContentLoading = true
      this.getVTimer = setTimeout(() => {
        const queryTimer = Date.now()
        this.queryTimer = queryTimer
        getFormattedVarContent({ ...this.form })
          .then((res) => {
            if (this.queryTimer !== queryTimer) return
            const data = res.data || {}
            this.varContentData = data
            this.getVarContentLoading = false
          })
          .catch(() => {
            if (this.queryTimer !== queryTimer) return
            this.getVarContentLoading = false
          })
      }, 500)
    },
    reset() {
      this.form = {
        /* 基础信息 */
        salesInquiryType: undefined,
        salesInquiryNo: undefined,
        businessPartnerName: undefined,
        salesInquiryStatus: undefined,
        businessPartnerId: undefined,
        bpContactPersonName: undefined,
        bpBusinessContactPersonList: [],
        bpBusinessAddressList: [],
        departmentId: undefined,
        departmentName: undefined,
        allSuperiorName: undefined,
        salesPersonBy: this.$store.state.user.nickName,
        salesPersonId: this.$store.state.user.userId,
        currencyId: undefined,
        currency: undefined,
        paymentTermId: undefined,
        paymentTermName: undefined,
        paymentMethodIdList: [],
        paymentMethodNameList: [],
        validityForDay: undefined,
        validity: undefined,
        deliveryDateForDay: undefined,
        deliveryDate: undefined,
        ourRef: undefined,
        yourRef: undefined,
        productMsgTypeList: [],
        dropShipping: '0',
        priceTbd: '0', // 价格另议
        isUpdateAmount: '0', // 是否用户编辑过 subTotal

        bpEmail: undefined,
        mobilePhone: undefined,

        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        receiveAddressForPort: {},
        addressForWarehouse: {},
        salesInquiryProductList: [],
        salesInquiryProjectList: [],
        salesInquiryServiceList: [],
        projectCostDetailList: [],
        productOrServiceList: [],
        consignmentStartTime: undefined,
        consignmentEndTime: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4', '5']
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.salesConditionsList = []
      this.varContentData = {}
      this.$nextTick(() => {
        if (this.$refs.form1) {
          this.$refs.form1.clearValidate()
        }
        if (this.$refs.form2) {
          this.$refs.form2.clearValidate()
        }
      })
      // this.resetForm('form1')
      // this.resetForm('form2')
    },

    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form1.validateField(code)
    },
    openSupplierTable() {
      this.$refs.selectCustomerTable.handleOpen()
    },
    // 清空供应商
    supplierClear() {
      this.$set(this.form, 'businessPartnerMainId', undefined)
      this.$set(this.form, 'businessPartnerId', undefined)
      this.$set(this.form, 'businessPartnerName', undefined)
      this.$set(this.form, 'businessPartnerNo', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.$set(this.form, 'customerGroup', undefined)
      this.$set(this.form, 'salesInquiryProductList', [])
      if (this.form.salesInquiryType === 'Consignment') {
        this.warehouseClear()
      }
      this.customerQuestionnaireClear()
      this.currencyClear()
      this.paymentMethodChange([], [])
      this.contactPersonClear()
    },
    updateSupplier(row) {
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      this.$set(this.form, 'customerGroup', row.customerGroup)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      this.$set(this.form, 'bpBusinessAddressList', row.bpBusinessAddressList)
      this.$set(this.form, 'businessPartnerType', row.businessPartnerType)

      const account = row.bpBusinessAccountCustomer || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.$set(this.form, 'currencySymbol', account.currencySymbol)

      this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])
      if (this.form.salesInquiryType === 'Consignment') {
        this.warehouseClear()
      }
      this.customerQuestionnaireClear()
      this.contactPersonClear()
      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find(
          (item) => item.isSalesDefault === '1' && item.isActive === '1'
        )
        if (defaultContact) {
          this.contactPersonChange(defaultContact)
        }
      }
      this.$set(this.form, 'salesInquiryProductList', [])
    },
    customerQuestionnaireChange(item) {
      this.$set(this.form, 'customerQuestionnaireId', item.customerQuestionnaireId)
      this.$set(this.form, 'customerQuestionnaireNo', item.customerQuestionnaireNo)
    },
    customerQuestionnaireClear() {
      this.$set(this.form, 'customerQuestionnaireId', undefined)
      this.$set(this.form, 'customerQuestionnaireNo', undefined)
      this.$nextTick(() => {
        this.$refs.form1.clearValidate('customerQuestionnaireId')
      })
    },
    queryUserDepartment() {
      queryUserDepartment({ menuPerms: this.menuKey.salesInquiry }).then((res) => {
        this.deptOptions = res.data || []
        this.deptOptions.forEach((item) => {
          if (item.isDefault === '1') {
            this.$set(this.form, 'departmentId', item.departmentId)
            this.$set(this.form, 'departmentName', item.departmentName)
            this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
          }
        })
      })
    },
    departmentChange(item) {
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
      if (this.form.salesPersonId !== this.$store.state.user.userId) {
        this.purchasePersonClear()
      }
    },
    openPurchasePersonTable() {
      this.$refs.selectPurchasePersonTable.handleOpen()
    },
    purchasePersonClear() {
      this.$set(this.form, 'salesPersonBy', undefined)
      this.$set(this.form, 'salesPersonId', undefined)
    },
    updatePurchasePerson(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'salesPersonBy', nickName)
      this.$set(this.form, 'salesPersonId', userId)
    },
    queryCurrencyListBySelect() {
      queryCurrencyListBySelect().then((res) => {
        const list = res.data || []
        this.currencyOptions = list.map((item) => {
          item.label = `${item.currencyCode} (${item.currencyDesc})`
          return item
        })
      })
    },
    currencyChange(row) {
      this.$set(this.form, 'currencyId', row.id)
      this.$set(this.form, 'currency', row.currency)
      this.$set(this.form, 'currencyCode', row.currencyCode)
      this.$set(this.form, 'currencySymbol', row.currencySymbol)

      this.$set(this.form, 'salesInquiryProductList', [])
      this.$set(this.form, 'salesInquiryServiceList', [])
    },
    currencyClear() {
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      this.$set(this.form, 'salesInquiryProductList', [])
      this.$set(this.form, 'salesInquiryServiceList', [])
    },

    paymentMethodChange(ids, labels) {
      this.$set(this.form, 'paymentMethodIdList', ids)
      this.$set(this.form, 'paymentMethodNameList', labels)
    },

    validityChange(changeType) {
      const cur = this.appointTime(Date.now(), '00:00:00')
      const dayTimer = 24 * 60 * 60 * 1000
      if (changeType === 'validityForDay') {
        if (this.form.validityForDay) {
          this.$set(this.form, 'validity', dayTimer * this.form.validityForDay + cur)
        } else {
          this.$set(this.form, 'validity', undefined)
        }
      }
      if (changeType === 'validity') {
        if (this.form.validity) {
          const timer = Math.floor((this.form.validity - cur) / dayTimer)
          this.$set(this.form, 'validityForDay', timer)
        } else {
          this.$set(this.form, 'validityForDay', undefined)
          this.$nextTick(() => {
            this.$refs.form1.validateField('validityForDay')
          })
        }
      }
    },
    deliveryDateChange(changeType) {
      const cur = this.appointTime(Date.now(), '00:00:00')
      const dayTimer = 24 * 60 * 60 * 1000
      if (changeType === 'deliveryDateForDay') {
        if (this.form.deliveryDateForDay) {
          this.$set(this.form, 'deliveryDate', dayTimer * this.form.deliveryDateForDay + cur)
        } else {
          this.$set(this.form, 'deliveryDate', undefined)
        }
        this.$nextTick(() => {
          this.$refs.form1.validateField('deliveryDateForDay')
        })
      }
      if (changeType === 'deliveryDate') {
        if (this.form.deliveryDate) {
          const timer = Math.floor((this.form.deliveryDate - cur) / dayTimer)
          this.$set(this.form, 'deliveryDateForDay', timer)
        } else {
          this.$set(this.form, 'deliveryDateForDay', undefined)
          this.$nextTick(() => {
            this.$refs.form1.validateField('deliveryDateForDay')
          })
        }
      }
      this.form.salesInquiryProductList.forEach((item) => {
        this.$set(item, 'deliveryDateForDay', this.form.deliveryDateForDay)
      })
      this.form.productOrServiceList.forEach((item) => {
        this.$set(item, 'deliveryDateForDay', this.form.deliveryDateForDay)
      })
    },

    addressLocationTypeChange() {
      this.incotermIdChange({})
    },

    /* 第二部分表单 */
    queryIncotermList() {
      queryIncotermList({}).then((res) => {
        this.incotermOptions = res.data || []
      })
    },
    incotermIdChange(item) {
      // const oldType = this.form.incotermAddressType
      this.$set(this.form, 'incotermId', item.incotermId)
      this.$set(this.form, 'incotermName', item.incotermName)
      this.$set(this.form, 'incotermAbbreviation', item.incotermAbbreviation)
      this.$set(this.form, 'incotermAddressType', item.incotermAddressType)
      this.receiveAddressClear()
      this.receivePortClear()
      this.$nextTick(() => {
        this.$refs.form2.clearValidate(['receivePortName', 'receiveAddressName'])
      })
    },

    openPortTable() {
      this.$refs.selectPortTable.handleOpen()
    },
    openReceiveAddressTable() {
      this.$refs.payToAddressDlg.handleOpen()
    },
    receivePortClear() {
      this.$set(this.form, 'receivePortName', undefined)
      this.$set(this.form, 'receivePortId', undefined)
      this.$set(this.form, 'receiveAddressForPort', undefined)
    },
    receiveAddressClear() {
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'addressForBPAddress', undefined)
      this.$set(this.form, 'receiveAddress', undefined)
      this.$set(this.form, 'district', undefined)
    },
    updatePort(row) {
      const { portName, portId, countryId, country } = row
      this.$set(this.form, 'receiveAddressForPort', row)
      this.$set(this.form, 'receivePortName', portName)
      this.$set(this.form, 'receivePortId', portId)
      if (!portId) return
      if (['FOB', 'FAS'].indexOf(this.form.incotermAbbreviation) !== -1) {
        if (
          this.legalEntityInfo.countryId !== countryId &&
          this.legalEntityInfo.country !== country &&
          this.legalEntityInfo.country.indexOf(country) === -1
        ) {
          this.$alert(
            this.$t('SALES.portIncorrectForFOBOrFAS')
              .replace('$1', this.legalEntityInfo.country)
              .replace('$2', this.form.incotermAbbreviation),
            '',
            {
              confirmButtonText: this.$t('SALES.gotIt'),
              cancelButtonText: this.$t('uiBtn.back'),
              showCancelButton: false,
              showClose: false,
              type: 'warning',
              customClass: 'custom-class'
            }
          )
            .then(() => {})
            .catch(() => {})
        }
      }
      if (['CIF', 'CFR'].indexOf(this.form.incotermAbbreviation) !== -1) {
        if (
          (this.form.receiveAddressCountry || this.form.country) &&
          (this.form.receiveAddressCountry || this.form.country) !== country
        ) {
          this.$alert(
            this.$t('PURCHASE.portIncorrectForCIFOrCFR').replace(
              '$1',
              this.form.incotermAbbreviation
            ),
            '',
            {
              confirmButtonText: this.$t('PURCHASE.gotIt'),
              cancelButtonText: this.$t('uiBtn.back'),
              showCancelButton: false,
              showClose: false,
              type: 'warning',
              customClass: 'custom-class'
            }
          )
            .then(() => {})
            .catch(() => {})
        }
      }
    },
    updateAddress(row) {
      this.$set(this.form, 'addressForBPAddress', row)
      // this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressName', row.receiveAddressName || row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
    },
    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId } = row
      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'warehouseName', warehouseName)
      this.$set(this.form, 'warehouseId', warehouseId)
    },
    warehouseClear() {
      this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseId', undefined)
    },

    contactPersonChange(row) {
      this.$set(this.form, 'bpBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'bpContactPersonId', row.contactPersonId)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'bpMobileNum', row.mobileNum)
      this.$set(this.form, 'bpMobileCode', row.mobileCode)
      this.$set(this.form, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.form, 'bpEmail', row.email)
    },
    contactPersonClear() {
      this.$set(this.form, 'bpBusinessContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonName', undefined)
      this.$set(this.form, 'bpMobileNum', undefined)
      this.$set(this.form, 'bpMobileCode', undefined)
      this.$set(this.form, 'bpMobilePhone', undefined)
      this.$set(this.form, 'bpEmail', undefined)
    },
    /* 表单部分End */
    getSISubmitConfirm() {
      const bpBusinessAddress = this.form.bpBusinessAddress || {}
      if (
        this.form.incotermAddressType === '2' &&
        bpBusinessAddress.country &&
        this.legalEntityInfo.country !== bpBusinessAddress.country
      ) {
        return this.$t('SALES.SIinternationalTransactionsSubmitConfirm')
      } else {
        return this.$t('SALES.SISubmitConfirm')
      }
    },
    // 滚动页面到表格的可视区域
    scrollPageToTable() {
      try {
        if (!this.$refs.collapseScrollPage) return
        const offsetTop = this.$refs.collapseScrollPage.offsetTop
        if (!this.$refs.FormPageLayoutRef) return
        const pageContent = this.$refs.FormPageLayoutRef.$refs.pageContent
        if (pageContent) {
          pageContent.scrollTo({
            top: offsetTop - 50, // pageContent 没有使用定位
            behavior: 'smooth' // 平滑滚动
          })
        }
      } catch (err) {}
    },
    async submitForm(submitType) {
      const myFileIds = this.$refs.ProductInfo.getFileIds()
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

      const valid2 = await this.$refs.form2.validate().catch((err) => {
        return err
      })
      this.collapseWarningForShippingInfo = !valid2
      if (!valid2) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.shippingInfo'))
        )
        return
      }
      if (valid1 && valid2) {
        let param = { ...this.form }
        if (param.priceTbd === '1' && param.subTotal === 0) {
          this.$modal.msgError(this.$t('SALES.enabledZero'))
          return
        }
        if (param.salesInquiryType === 'Trading') {
          // const validProduct = this.validProductList(param.salesInquiryProductList)
          // if (!validProduct) {
          //   this.collapseWarningForProductInfo = true
          //   return
          // }
          const validService = this.validServiceList(param.salesInquiryServiceList)
          if (!validService) {
            this.collapseWarningForProductInfo = true
            return
          }
        } else if (param.salesInquiryType === 'Service') {
          const validProduct = this.validProductList(param.salesInquiryProductList, false)
          if (!validProduct) {
            this.collapseWarningForProductInfo = true
            return
          }
          const validService = this.validServiceList(param.salesInquiryServiceList)
          if (!validService) {
            this.collapseWarningForProductInfo = true
            return
          }
        } else if (param.salesInquiryType === 'Project') {
          const validProject = this.validProjectList(param.salesInquiryProjectList)
          if (!validProject) {
            this.collapseWarningForProductInfo = true
            return
          }
          if (this.form.salesInquiryStatus === '4' && this.form.productMsgTypeList.includes('1')) {
            const validProduct = this.validProductList(param.salesInquiryProductList)
            if (!validProduct) {
              this.$refs.ProductInfo.activeName = 'productDetail'
              this.collapseWarningForProductInfo = true
              return
            }
          }
          if (this.form.salesInquiryStatus === '4' && this.form.productMsgTypeList.includes('2')) {
            const validService = this.validServiceList(param.salesInquiryServiceList)
            if (!validService) {
              this.$refs.ProductInfo.activeName = 'projectTask'
              this.collapseWarningForProductInfo = true
              return
            }
          }
        } else if (param.salesInquiryType === 'Consignment') {
          const validProject = this.validConsignmentList(param.salesInquiryProductList)
          if (!validProject) {
            this.$refs.ProductInfo.activeName = 'Consignment'
            this.collapseWarningForProductInfo = true
            return
          }
        }

        this.collapseWarningForProductInfo = false
        param.commonFileList = myFileIds
        param.productMsgType = param.productMsgTypeList.join(',')

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

        // param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'generateQuote') {
          confirmMsg = this.$t('SALES.SIGenerateQuoteConfirm')
          successMsg = this.$t('SALES.SIGenerateQuoteSuccess')
          submitFn = generateSalesQuotation
        } else if (submitType === 'save') {
          confirmMsg = this.$t('SALES.SISaveConfirm')
          successMsg = this.$t('SALES.SISaveSuccess')
          submitFn = saveDraftSalesInquiry
        } else {
          confirmMsg = this.getSISubmitConfirm()
          successMsg = this.$t('SALES.SISubmitSuccess')
          submitFn = saveSalesInquiry
        }

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
      if (detailList.length <= 0 && isReqOne) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const list = detailList.filter((x) => x.productType === '3')
      if (list.length > 1 || (list.length === 1 && detailList.length > 1)) {
        this.$modal.msgError(this.$t('SALES.limitedSingleProduct'))
        return valid
      }
      const productNameReq = detailList.find((item) => {
        return !(item.productName || '').trim()
      })
      if (productNameReq) {
        this.$refs.ProductInfo.errorMessage('productName', 'productDetail')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
        )
        return valid
      }

      const salesPartNoReq = detailList.find((item) => {
        return !item.salesPartNo
      })
      if (salesPartNoReq && this.form.salesInquiryStatus === '4') {
        this.$refs.ProductInfo.errorMessage('salesPartNo', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesPartNo')))
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !item.uom
      })
      if (uomReq) {
        this.$refs.ProductInfo.errorMessage('uom', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.uom1')))
        return valid
      }

      const uomCoefficientReq = detailList.find((item) => {
        return !item.uomCoefficient
      })
      if (uomCoefficientReq) {
        this.$refs.ProductInfo.errorMessage('uomCoefficient', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.ratio')))
        return valid
      }

      const purchaseQuotationNoReq = detailList.find((item) => {
        return !item.purchaseQuotationNo && item.productType !== '2'
      })
      if (purchaseQuotationNoReq && this.form.salesInquiryStatus === '4') {
        this.$refs.ProductInfo.errorMessage('purchaseQuotationNo', 'productDetail')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.purchaseQuotationNo'))
        )
        return valid
      }

      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$refs.ProductInfo.errorMessage('qty', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.unitPrice)
      })
      if (unitPriceReq) {
        this.$refs.ProductInfo.errorMessage('unitPrice', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return valid
      }

      /* const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDate)
      })
      if (scheduledDeliveryDateReq && this.form.salesInquiryType !== 'Project') {
        this.$refs.ProductInfo.errorMessage('deliveryDate', 'productDetail')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
        )
        return valid
      } */

      return true
    },

    validConsignmentList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const list = detailList.filter((x) => x.productType === '3')
      if (list.length > 1 || (list.length === 1 && detailList.length > 1)) {
        this.$modal.msgError(this.$t('SALES.limitedSingleProduct'))
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$refs.ProductInfo.errorMessage('qty', 'Consignment')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.unitPrice)
      })
      if (unitPriceReq) {
        this.$refs.ProductInfo.errorMessage('unitPrice', 'Consignment')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return valid
      }

      // const consignmentAmountReq = detailList.find((item) => {
      //   return !this.$resultOfBoolean(item.consignmentAmount)
      // })
      // if (consignmentAmountReq) {
      //   this.$modal.msgError(
      //     this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.consignmentPrice'))
      //   )
      //   return valid
      // }

      /* const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDate)
      })
      if (scheduledDeliveryDateReq) {
        this.$refs.ProductInfo.errorMessage('deliveryDate', 'Consignment')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
        )
        return valid
      } */

      return true
    },

    validServiceList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.projectTaskTableEmpty'))
        return valid
      }

      const purchaseQuotationNoReq = detailList.find((item) => {
        return !item.purchaseQuotationNo
      })
      if (
        purchaseQuotationNoReq &&
        this.form.salesInquiryStatus === '4' &&
        purchaseQuotationNoReq.serviceType === 'External'
      ) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.purchaseQuotationNo'))
        )
        return valid
      }

      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        if (item.serviceType === 'External') {
          return item.purchaseQuotationNo && !this.$resultOfBoolean(item.unitPrice)
        } else {
          return !this.$resultOfBoolean(item.unitPrice)
        }
      })
      if (unitPriceReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return valid
      }

      /* const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDate)
      })
      if (scheduledDeliveryDateReq && this.form.salesInquiryType !== 'Project') {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
        )
        return valid
      } */

      return true
    },
    validProjectList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.projectTableEmpty'))
        return valid
      }
      const projectNameReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.projectName)
      })
      if (projectNameReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.projectName')))
        return valid
      }

      return true
    },
    handleSaveDraft() {
      this.submitForm('save')
    },
    handleGenerateQuote() {
      this.submitForm('generateQuote')
    },
    handlePreviewPDF() {
      const token = getToken()
      const params = { ...this.form }
      this.previewPDFLoading = true
      preview(params)
        .then((res) => {
          this.previewPDFLoading = false
          const fileID = res.data || ''
          if (fileID) {
            const myUrl =
              process.env.VUE_APP_BASE_API +
              '/system/oss/filePreview/' +
              `${fileID}` +
              '?token=' +
              `${token}`
            window.open(myUrl, 'print')
          }
        })
        .catch(() => {
          this.previewPDFLoading = false
        })
    },
    handlePrintPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/purchase/purchaseOrder/preview' +
        `/${this.form.salesInquiryId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    handleExportPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/purchase/purchaseOrder/download' +
        `/${this.form.salesInquiryId}` +
        '?token=' +
        `${token}`
      window.location = myUrl
    },

    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.rowId)
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
          `${this.$t('SALES.salesInquiry')} [${vm.form.salesInquiryNo}]`
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
          `${this.$t('SALES.salesInquiry')} [${vm.form.salesInquiryNo}]`
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
          `${this.$t('SALES.salesInquiry')} [${vm.form.salesInquiryNo}]`
        )
      )
      vm.back('onCancelSuccess')
    }
  }
}
</script>
<style lang="scss">
.collapse-item-content-pt0 {
  .el-collapse-item__content {
    padding-top: 10px;
  }
}
</style>
