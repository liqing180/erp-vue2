<template>
  <FormPageLayout v-loading="submitLoading" ref="FormPageLayoutRef">
    <template v-slot:btn>
      <el-button
        type="primary"
        :disabled="getVarContentLoading || getPQInfoLoading"
        size="mini"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button
        type="primary"
        :disabled="getVarContentLoading || getPQInfoLoading"
        size="mini"
        @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button type="primary" size="mini" :loading="previewPDFLoading" @click="handlePreviewPDF"
        >{{ $t('menu.previewPDF') }}
      </el-button>
      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
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
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.supplier')}`" prop="businessPartnerName">
                      <CommonSelectAndList
                        :id="form.businessPartnerId"
                        :label="form.businessPartnerName"
                        idKey="businessPartnerId"
                        labelKey="businessPartnerName"
                        filterable
                        :options="businessPartnerOptions"
                        :loading="businessPartnerOptionsLoading"
                        @change="updateSupplier"
                        @handleOpen="openSupplierTable"
                        :disabled="!!purchasePriceId || !!propPQId"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.p_purchase_order_status,
                            form.purchaseOrderStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.purchaseOrderNo')}`">
                      <el-input v-model="form.purchaseOrderNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.purchaseQuotationNo')}`"
                      prop="purchaseQuotationNo"
                    >
                      <CommonSelectAndList
                        :id="form.purchaseQuotationNo"
                        :label="form.purchaseQuotationNo"
                        idKey="purchaseQuotationNo"
                        labelKey="purchaseQuotationNo"
                        filterable
                        :options="purchaseQuotationOptions"
                        :loading="purchaseQuotationOptionsLoading"
                        @change="updatePurchaseQuotationNo"
                        @handleOpen="openPurchaseQuotationTable"
                        :disabled="!form.businessPartnerId || !!propPQId"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="false">
                    <el-form-item :label="`${$t('ui.dept')}`" prop="departmentId">
                      <CommonSelect
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
                    <el-form-item :label="`${$t('PURCHASE.leadTimeDays')}`">
                      <el-input-number
                        class="w100"
                        v-thousandSplit="{ precision: 0 }"
                        :precision="0"
                        v-model="form.leadTimeForDay"
                        :min="1"
                        :max="999"
                        controls-position="right"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.ourRef')}`">
                      <el-input
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                        :disabled="poEdit !== '1'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`" prop="currencyId">
                      <CommonSelect
                        :disabled="!form.purchaseQuotationNo || poEdit !== '1'"
                        :id="form.currencyCode"
                        :label="form.currency"
                        :title="form.currency"
                        idKey="currencyCode"
                        labelKey="currency"
                        :filterable="true"
                        :clearable="false"
                        :options="currencyOptions || []"
                        :loading="currencyOptionsLoading"
                        @change="currencyChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.purchaser')}`" prop="purchasePersonBy">
                      <CommonSelectAndList
                        :id="form.purchasePersonId"
                        :label="form.purchasePersonBy"
                        idKey="userId"
                        labelKey="nickName"
                        filterable
                        :options="purchasePersonByOptions"
                        :loading="purchasePersonByOptionsLoading"
                        @change="updatePurchasePerson"
                        @handleOpen="openPurchasePersonTable"
                        :disabled="!form.departmentId"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.yourRef')}`">
                      <el-input
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                        :disabled="poEdit !== '1'"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="false">
                    <el-form-item :label="`${$t('ui.paymentMethod')}`" prop="paymentMethodIdList">
                      <ToolTipShowList
                        :list="form.paymentMethodNameList || []"
                        :popoverTitle="$t('ui.paymentMethod')"
                      >
                        <CommonMultipleSelect
                          :disabled="!form.purchaseQuotationNo || poEdit !== '1'"
                          :ids="form.paymentMethodIdList"
                          :labels="form.paymentMethodNameList"
                          :showTitle="false"
                          idKey="value"
                          labelKey="label"
                          :options="dict.type.business_partner_payment_method"
                          @change="paymentMethodChange"
                        />
                      </ToolTipShowList>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('PURCHASE.paymentTerm')" prop="paymentTermName">
                      <ToolTipPaymentTerm :paymentTermObj="form.paymentTerm || {}">
                        <div class="input-switch-box">
                          <div class="con-left">
                            <CommonSelectAndList
                              :id="form.paymentTermId"
                              :label="form.paymentTermName"
                              idKey="paymentTermId"
                              labelKey="paymentTermName"
                              filterable
                              :options="paymentTermList"
                              :loading="paymentTermOptionsLoading"
                              @change="paymentTermChange"
                              @handleOpen="openPaymentTermDlg"
                              :disabled="!form.purchaseQuotationNo || poEdit !== '1'"
                            />
                          </div>
                          <div
                            class="con-right"
                            v-if="
                              !(!form.purchaseQuotationNo || poEdit !== '1') &&
                              form.paymentTermName &&
                              checkPermi(['purchaseManagement:purchaseOrder:editPaymentTerm'])
                            "
                          >
                            <i
                              class="el-icon-edit primary"
                              style="font-size: 20px"
                              @click="openEditPaymentTermDlg"
                            ></i>
                          </div>
                        </div>
                      </ToolTipPaymentTerm>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.validityDays')}`" prop="validityForDay">
                      <div class="flex">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.validityForDay"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          :controls="false"
                          style="width: 30%"
                          @change="validityChange('validityForDay')"
                        />
                        <span class="mr5 ml5">{{ $t('PURCHASE.day') }}</span>
                        <el-date-picker
                          @change="validityChange('validity')"
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
                  <!-- <el-col :span="8">
                    <el-form-item :label="`${$t('menu.exchangeRate')}`">
                      <el-input
                        :value="form.exchangeRateDesc"
                        :title="form.exchangeRateDesc"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col> -->
                </el-row>
                <el-row v-if="false">
                  <el-col :span="24">
                    <el-form-item :label="$t('PURCHASE.paymentTerm')" prop="paymentTermName">
                      <MyInput
                        type="textarea"
                        v-model="form.paymentTermName"
                        :disabled="!form.purchaseQuotationNo || poEdit !== '1'"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="1000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')">
                      <MyInput
                        type="textarea"
                        v-model="form.basicRemarks"
                        :autosize="{ minRows: 1, maxRows: 8 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.automatedEmail')}`">
                      <el-switch
                        v-model="form.automatedEmail"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.dropShipping')}`">
                      <el-switch
                        v-model="form.dropShipping"
                        active-value="1"
                        inactive-value="0"
                        :disabled="true"
                        @change="dropShippingChange"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="taxIncludedForSystemSetup === '1'">
                    <el-form-item :label="`${$t('system.taxIncluded')}`">
                      <el-switch
                        v-model="form.taxIncluded"
                        active-value="1"
                        inactive-value="0"
                        :disabled="true"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="false">
                    <el-form-item :label="`${$t('PURCHASE.salesOrderNo')}`">
                      <SelectInput
                        :value="form.salesOrderNo"
                        :title="form.salesOrderNo"
                        @clear="salesOrderNoClear"
                        clearable
                        @click="openSalesOrderTable"
                      />
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
                :title="$t('PURCHASE.RecipientInfo')"
                :warning="collapseWarningForShippingInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="form2"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
              >
                <div v-if="form.dropShipping === '1' && !form.salesOrderId" key="SOFormKey2">
                  <el-row>
                    <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                      <el-form-item :label="`${$t('PURCHASE.incoterm')}`">
                        <el-input
                          :value="form.incotermName"
                          :title="form.incotermName"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                      <el-form-item :label="`${$t('PURCHASE.port')}`">
                        <el-input
                          v-if="form.incotermAddressType === '0'"
                          :value="$t('PURCHASE.selfCollect')"
                          disabled
                        ></el-input>
                        <el-input
                          v-else
                          :value="form.receivePortName"
                          :title="form.receivePortName"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="`${$t('PURCHASE.deliveryAddress')}`">
                        <el-input
                          :value="form.receiveAddressName"
                          :title="form.receiveAddressName"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.consignee')}`">
                        <el-input
                          v-model="form.requestedBy"
                          :title="form.requestedBy"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.requestedEmail')}`">
                        <el-input
                          v-model="form.requestedEmail"
                          :title="form.requestedEmail"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.requestedMobilePhone')}`">
                        <el-input
                          v-model="form.requestedMobilePhone"
                          :title="form.requestedMobilePhone"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>

                <div v-else key="noSOFormKey">
                  <el-row>
                    <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                      <el-form-item
                        :label="`${$t('PURCHASE.incoterm')}`"
                        prop="incotermId"
                        :rules="[
                          {
                            required: comIncotermReq,
                            message: $t('ui.reqMsg'),
                            trigger: ['change']
                          }
                        ]"
                      >
                        <CommonSelect
                          :id="form.incotermId"
                          :label="form.incotermName"
                          :title="form.incotermName"
                          :disabled="!form.purchaseQuotationNo || poEdit !== '1'"
                          idKey="incotermId"
                          labelKey="incotermName"
                          :options="comIncotermOptions"
                          :loading="incotermOptionsLoading"
                          @change="incotermIdChange"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                      <el-form-item
                        :label="`${$t('PURCHASE.port')}`"
                        prop="receivePortName"
                        :rules="[
                          {
                            required: form.incotermAddressType === '1' && comIncotermReq,
                            message: $t('ui.reqMsg'),
                            trigger: ['change']
                          }
                        ]"
                      >
                        <el-input
                          v-if="form.incotermAddressType === '0'"
                          :value="$t('PURCHASE.selfCollect')"
                          disabled
                        ></el-input>
                        <ToolTipShowObj
                          v-else
                          :mData="form.addressForPort || {}"
                          :showStr="form.receivePortName"
                          :rows="shipToAddressRows"
                        >
                          <CommonSelectAndList
                            :id="form.receivePortId"
                            :label="form.receivePortName"
                            idKey="portId"
                            labelKey="portName"
                            filterable
                            :options="portOptions"
                            :disabled="
                              !form.incotermId ||
                              form.incotermAddressType !== '1' ||
                              poEdit !== '1' ||
                              !form.businessPartnerId
                            "
                            @change="updatePort"
                            ref="portRef"
                            @handleOpen="openReceivePortTable"
                          />
                        </ToolTipShowObj>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item
                        :label="`${$t('PURCHASE.deliveryAddress')}`"
                        prop="receiveAddressName"
                        key="warehouse11"
                      >
                        <ToolTipShowObj
                          :mData="form.addressForWarehouse || {}"
                          :showStr="form.receiveAddressName"
                          :rows="warehouseRows"
                        >
                          <SelectInput
                            clearable
                            :disabled="disWarehouse"
                            :value="form.receiveAddressName"
                            :title="form.receiveAddressName"
                            @click="openWarehouseTable"
                            @clear="warehouseClear"
                          />
                        </ToolTipShowObj>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.consignee')}`" prop="requestedBy">
                        <!-- <SelectInput
                          :clearable="true"
                          :value="form.requestedBy"
                          :title="form.requestedBy"
                          @click="addRequestedBy"
                          :disabled="
                            (form.dropShipping === '1' ? false : !form.receiveAddressName) ||
                            disWarehouse
                          "
                          @clear="requestedByClear"
                        /> -->

                        <el-select
                          v-model="form.requestedId"
                          :title="form.requestedBy"
                          placeholder=""
                          style="width: 100%"
                          clearable
                          @change="requestedByChange1"
                          :disabled="
                            (form.dropShipping === '1' ? false : !form.receiveAddressName) ||
                            disWarehouse
                          "
                        >
                          <el-option
                            v-for="item in form.userList"
                            :key="item.userId"
                            :label="item.nickName"
                            :value="item.userId"
                          ></el-option>
                        </el-select>
                        <!-- <div class="input-switch-box">
                        <div class="con-left">
                          <el-input
                            v-model="form.requestedBy"
                            :title="form.requestedBy"
                            disabled
                          ></el-input>
                        </div>
                        <div class="con-right" v-if="!!form.receiveAddressName">
                          <svg-icon
                            @click="addRequestedBy"
                            icon-class="add"
                            style="height: 36px; width: 36px; cursor: pointer"
                          />
                        </div>
                      </div> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.requestedEmail')}`">
                        <el-input
                          v-model="form.requestedEmail"
                          :title="form.requestedEmail"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.requestedMobilePhone')}`">
                        <el-input
                          v-model="form.requestedMobilePhone"
                          :title="form.requestedMobilePhone"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')">
                      <MyInput
                        type="textarea"
                        v-model="form.shipRemarks"
                        :autosize="{ minRows: 1, maxRows: 8 }"
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
          <div class="form-card mt10 collapse-item-content-pt0" ref="collapseScrollPage">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <ProductTable
                  ref="ProductTable"
                  :formData="form"
                  :productList="initPoDetailList"
                  :initCommonFileList="initCommonFileList"
                  :countryId="form.countryId"
                  :businessPartnerId="form.businessPartnerId"
                  :currencyId="form.currencyId"
                  @updateTable="updateProductTable"
                  :linkPR="false"
                  :poEdit="poEdit"
                  :poPurchaseQty="poPurchaseQty"
                  @scrollPageToTable="scrollPageToTable"
                  @scrollPageToTotalAmount="scrollPageToTotalAmount"
                  @updateLeadTime="updateLeadTime"
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
                  :comSalesConditionsList="comSalesConditionsList"
                  :comDisFrom="false"
                  :varContentData="varContentData"
                />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="5">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.contactInfo')"
                :warning="collapseWarningForDeliveryInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="form4"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.deliveryBy')}`" prop="bpContactPersonId">
                      <CommonSelect
                        :disabled="!form.businessPartnerId"
                        :id="form.bpContactPersonId"
                        :label="form.bpContactPersonName"
                        :title="form.bpContactPersonName"
                        idKey="contactPersonId"
                        labelKey="contactPersonName"
                        :options="form.bpBusinessContactPersonList || []"
                        @change="deliveryByChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.deliveryEmail')}`">
                      <el-input v-model="form.bpEmail" :title="form.bpEmail" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.deliveryMobilePhone')}`">
                      <el-input
                        v-model="form.bpMobilePhone"
                        :title="form.bpMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress1')}`"
                      prop="bpBusinessAddressId"
                    >
                      <!-- <ToolTipShowObj
                        :mData="form.bpBusinessAddress || {}"
                        :showStr="form.bpAddress"
                        :rows="bpAddressRows"
                      >
                        <SelectInput
                          :value="form.bpAddress"
                          @clear="deliveryAddressClear"
                          clearable
                          @click="openDeliveryAddressTable"
                          :disabled="!form.businessPartnerId"
                        />
                      </ToolTipShowObj> -->
                      <CommonSelectAndList
                        :id="form.bpBusinessAddressId"
                        :label="form.bpAddress"
                        :title="form.bpAddress"
                        idKey="businessAddressId"
                        labelKey="receiveAddress"
                        filterable
                        :options="deliveryAddressOptions"
                        :loading="deliveryAddressOptionsLoading"
                        :disabled="!form.businessPartnerId"
                        @change="deliveryAddressChange"
                        @handleOpen="openDeliveryAddressTable"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
    <selectSupplierTable ref="selectSupplierTable" @update="updateSupplier" />
    <selectPurchaseQuotationTable
      ref="selectPurchaseQuotationTable"
      :businessPartnerId="form.businessPartnerId"
      @update="updatePurchaseQuotationNo"
    />
    <selectPurchasePersonTable
      ref="selectPurchasePersonTable"
      :departmentId="form.departmentId"
      @update="updatePurchasePerson"
    />
    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
    <editRequestedByDlg ref="editRequestedByDlg" @update="requestedByChange" />
    <selectSalesOrderTable ref="selectSalesOrderTable" @update="salesOrderChange" />

    <selectPaymentTermDlg
      ref="selectPaymentTermDlg"
      :paymentTermPurposeList="['1']"
      :businessPartnerId="form.businessPartnerId"
      @onSuccess="paymentTermChange"
      :menuPerms="menuKey.PO"
    />
    <editPaymentTernDlg ref="editPaymentTernDlg" @onSuccess="paymentTermEditChange" />
    <selectBPAddressDlg
      ref="selectBPAddressDlg"
      :supplierId="form.businessPartnerMainId"
      @update="deliveryAddressChange"
    />
  </FormPageLayout>
</template>

<script>
import { formDirtyClass } from '@/mixins/formDirtyClass'
import { queryUserDepartment } from '@/api/system/user'
import { queryIncotermList, queryCanSelectPortList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryUnapprovedAdhocProductNameList } from '@/api/purchaseManagement/requestForQuotation'
import { queryUsers } from '@/api/organization/corporate'
import { queryAddressByBusinessPartnerId } from '@/api/purchaseManagement/purchaseContract'

import {
  savePurchaseOrder,
  saveDraftPurchaseOrder,
  preview,
  addPQDefaultMsgToPO,
  conversionCurrencyUnitPrice,
  getFormattedVarContent,
  checkPQFromRFQForBPCount,
  queryPurchaseOrderCanSelectBusinessPartnerList,
  queryCanSelectPurchaseQuotationList
} from '@/api/purchaseManagement/purchaseOrder'
import { getSystemSetup } from '@/api/system/systemSetting'
import { queryPaymentTermListByPaymentTermPurpose } from '@/api/system/paymentTerm'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import selectSupplierTable from './components/selectSupplierTable.vue'
import selectPurchaseQuotationTable from './components/selectPurchaseQuotationTable.vue'

import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'

import selectPortTable from './components/selectPortTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import editRequestedByDlg from './components/editRequestedByDlg.vue'
import selectSalesOrderTable from './components/selectSalesOrderTable.vue'
import selectPaymentTermDlg from '@/views/system/paymentTerm/selectPaymentTermDlg.vue'
import editPaymentTernDlg from '@/views/system/paymentTerm/editPaymentTernDlg/editPaymentTernDlg.vue'
import selectBPAddressDlg from './components/selectBPAddressDlg.vue'

import ProductTable from '@/views/purchaseManagement/purchaseOrder/productTable.vue'
import { getToken } from '@/utils/auth'
import ConditionsTable from '@/views/salesManagement/salesQuotation/conditionsTable.vue'
import { getMultiplyDecimalPlaces } from '@/utils/bigUtils/bigUtils.js'

export default {
  mixins: [pageMixin],
  dicts: ['p_purchase_order_status', 'business_partner_payment_method'],
  components: {
    selectSupplierTable,
    selectPurchaseQuotationTable,
    selectPurchasePersonTable,
    selectPortTable,
    selectWarehouseTable,
    editRequestedByDlg,
    selectSalesOrderTable,
    selectPaymentTermDlg,
    editPaymentTernDlg,
    ProductTable,
    ConditionsTable,
    selectBPAddressDlg
  },
  data() {
    return {
      salesConditionsList: [],
      varContentData: {},
      getVarContentLoading: false,
      getPQInfoLoading: false,

      previewPDFLoading: false,
      activeNames: [],
      timeId: '',
      submitLoading: false,

      form: {},
      /* 直运选择订单后保存的数据 */
      SOForm: {},

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForDeliveryInfo: false,
      collapseWarningForConditions: false,
      rules: {
        businessPartnerName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        purchaseQuotationNo: [
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
        purchasePersonBy: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        currencyId: [
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
        paymentTermName: [
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

        committedDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        /* salesOrderNo: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ], */
        incotermId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],

        receiveAddressName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        requestedBy: [
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
        bpBusinessAddressId: [
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
      committedDateDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      businessPartnerOptions: [],
      businessPartnerOptionsLoading: false,
      purchaseQuotationOptions: [],
      purchaseQuotationOptionsLoading: false,
      deptOptions: [],
      currencyOptions: [],
      currencyOptionsLoading: false,
      purchasePersonByOptions: [],
      purchasePersonByOptionsLoading: false,
      incotermOptions: [],
      incotermOptionsLoading: false,
      portOptions: [],
      freightTaxNoOptions: [],
      // 系统设置，是否含税开关 1 开 0 关
      taxIncludedForSystemSetup: '0',
      /* 表格部分 */
      initPoDetailList: [],
      initCommonFileList: [],
      purchaseOrderDetailList: [],
      collapseWarningForProductInfo: false,
      shipToAddressRows: [
        {
          label: this.$t('PURCHASE.port'),
          showLabel: 'portName'
        },
        {
          label: this.$t('PURCHASE.code'),
          showLabel: 'portCode'
        },
        {
          label: this.$t('PURCHASE.latLong'),
          showLabel: 'latLong'
        },
        {
          label: this.$t('PURCHASE.telephone'),
          showLabel: 'telephone'
        },
        {
          label: this.$t('PURCHASE.website'),
          showLabel: 'website'
        },
        {
          label: this.$t('PURCHASE.country'),
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
      poEdit: undefined,
      poPurchaseQty: undefined,
      paymentTermList: [],
      paymentTermOptionsLoading: false,
      deliveryAddressOptions: [],
      deliveryAddressOptionsLoading: false
    }
  },
  props: {
    propTimeId: {
      type: String,
      default: ''
    },
    rfqDetailId: {
      type: String,
      default: ''
    },
    purchasePriceId: {
      type: String,
      default: ''
    },
    propPQId: {
      type: String,
      default: ''
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.handleAdd()
      }
    },
    comIncotermReq: {
      handler: function (selected) {
        this.$nextTick(() => {
          if (this.$refs.form2) {
            this.$refs.form2.clearValidate(['incotermId', 'receivePortName'])
          }
        })
      }
    }
  },
  computed: {
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    isDropShipping() {
      return this.purchaseOrderDetailList.some(
        (item) => item.dropShipping === '1' || item.isSystemDocking === '1'
      )
      // return this.purchaseOrderDetailList.some((item) => item.dropShipping === '1')
    },
    comIncotermReq() {
      if (this.form.country === this.legalEntityInfo.country) {
        return false
      }
      const isProduct = this.purchaseOrderDetailList.find((item) => item.productType === '1')
      return !!isProduct
    },
    comIncotermOptions() {
      if (this.form.country === this.legalEntityInfo.country) {
        return this.incotermOptions.filter((item) => item.incotermAbbreviation === 'EXW')
      }
      return this.incotermOptions
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    disWarehouse() {
      /* 如果PQ没有选择仓库,则PO的仓库可以编辑，绕过系统设置的开关 */
      if (this.form.initialWarehouseId) {
        // return !this.form.purchaseQuotationNo || this.poEdit !== '1'
        return true
      } else {
        return !this.form.purchaseQuotationNo
      }
    },
    comSalesConditionsList() {
      const list = JSON.parse(JSON.stringify(this.salesConditionsList || []))
      return this.groupAndAddHideLabel(list)
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    // 付款条款
    queryPaymentTermListByPaymentTermPurpose() {
      this.paymentTermChange({})
      this.paymentTermList = []
      if (!this.form.businessPartnerId) {
        return
      }
      this.paymentTermOptionsLoading = true
      queryPaymentTermListByPaymentTermPurpose({
        paymentTermPurpose: '1',
        menuPerms: this.menuKey.PO,
        businessPartnerId: this.form.businessPartnerId
      })
        .then((res) => {
          this.paymentTermOptionsLoading = false
          this.paymentTermList = res.data || []
        })
        .catch(() => {
          this.paymentTermOptionsLoading = false
        })
    },
    openPaymentTermDlg() {
      this.$refs.selectPaymentTermDlg.handleAdd()
    },
    paymentTermChange(item) {
      this.$set(this.form, 'paymentTerm', item)
      this.$set(this.form, 'paymentTermId', item.paymentTermId)
      this.$set(this.form, 'paymentTermName', item.paymentTermName)
      this.getFormattedVarContentFn()
    },
    openEditPaymentTermDlg() {
      this.$refs.editPaymentTernDlg.handleUpdate(this.form.paymentTerm)
    },
    paymentTermEditChange(item) {
      this.$set(this.form, 'paymentTerm', item)
      this.getFormattedVarContentFn()
    },
    handleAdd() {
      this.reset()
      this.queryBusinessPartnerOptions()
      this.queryUserDepartment()
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
      this.queryCanSelectPortList()
      this.addPQDefaultMsgToPOFromRFQ()
      this.getSystemSetup()
    },
    getSystemSetup() {
      getSystemSetup().then((res) => {
        const data = res.data || {}
        this.taxIncludedForSystemSetup = data.taxIncluded
        this.poEdit = data.poEdit
        this.poPurchaseQty = data.poPurchaseQty
        const salesConditions = data.conditions || ''
        try {
          this.salesConditionsList = salesConditions ? JSON.parse(salesConditions) : []
        } catch (error) {
          this.salesConditionsList = []
        }
        this.setDefaultConditions()
      })
    },
    groupAndAddHideLabel(arr) {
      // 1. 按category分组, 相同分类下的内容放在一起
      const groups = {}
      arr.forEach((item) => {
        const category = item.category
        if (!groups[category]) {
          groups[category] = []
        }
        if (groups[category].length > 0) {
          item.hideLabel = '1'
        }
        groups[category].push(item)
      })
      const list = Object.values(groups).flat()
      console.log(list)

      return list
    },
    setDefaultConditions() {
      const list = this.comSalesConditionsList || []
      const categoryMap = new Map()
      list.forEach((item) => {
        // 仅处理isDefault为1的项，且同一category只存第一个
        if (item.isDefault === '1' && !categoryMap.has(item.category)) {
          categoryMap.set(item.category, item)
        }
      })
      const DefaultList = Array.from(categoryMap.values())
      this.$set(this.form, 'conditionsTableList', JSON.parse(JSON.stringify(DefaultList)))
      setTimeout(() => {
        const initFormJson = this.getFormJson()
        formDirtyClass.routeStatusData[this.$route.name] = {
          $vm: this,
          saveShow: true,
          submitShow: true,
          initFormJson,
          getFormJson: this.getFormJson,
          isSaveSuccess: false,
          saveOrSubmitFn: this.handleSaveDraftNoConFirm
        }
      }, 300)
    },
    handleSetConditionsHtmlStr(delNullVar = false) {
      if (delNullVar) {
        const list = this.form.conditionsTableList
        const newList = list.filter((item) => {
          const nullVarList = []
          const str = (item.conditions || '').trim()
          str.replace(/\$\{([A-Za-z0-9 _-]+)\}/g, (match, varKey) => {
            // console.log('match', match)
            // console.log('varKey', varKey)
            const is = this.varContentData[varKey]
            if (!this.$resultOfBoolean(is)) {
              nullVarList.push(varKey)
            }
            const value = match // 保留原占位符
            return value
          })
          return nullVarList.length <= 0
        })
        this.$set(this.form, 'conditionsTableList', newList)
      }
      // emailEditorRef
      let htmlStr = '<table style="width: 100%;" cellspacing="0" cellpadding="0">'
      const selectList = this.form.conditionsTableList
      selectList.forEach((item, index) => {
        if (item.conditionsCody) {
          item.conditions = item.conditionsCody
          delete item.conditionsCody
        }
        const labelStyle =
          'font-weight: bold;vertical-align: top;white-space: nowrap; padding: 4px 0;padding-right: 40px;'
        const valueStyle = 'vertical-align: top;width: 100%;padding: 4px 0;white-space: pre-wrap;'
        htmlStr +=
          '<tr>' +
          `<td valign="left" style="${labelStyle};">${index + 1}. ${item.category}</td>` +
          `<td valign="left" style="${valueStyle};">${item.conditions}</td></tr>`
      })
      htmlStr += '</table>'

      this.form.conditions = selectList.length > 0 ? htmlStr : ''
      this.form.conditionsTableJson = JSON.stringify(this.form.conditionsTableList)
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
    addPQDefaultMsgToPOFromRFQ() {
      if (this.propPQId) {
        this.updatePurchaseQuotationNo({ purchaseQuotationId: this.propPQId }, true)
      }
    },
    reset() {
      this.form = {
        /* createType: 1.PQ/PPL,2.ASL */
        createType: '1',
        /* 基础信息 */
        purchaseOrderNo: undefined,
        businessPartnerName: undefined,
        purchaseOrderStatus: undefined,
        businessPartnerId: undefined,
        bpContactPersonName: undefined,
        bpBusinessContactPersonList: [],
        bpBusinessAddressList: [],
        departmentId: undefined,
        departmentName: undefined,
        allSuperiorName: undefined,
        purchasePersonBy: this.$store.state.user.nickName,
        purchasePersonId: this.$store.state.user.userId,
        purchasePersonEmail: this.$store.state.user.email,
        purchasePersonMobileCode: this.$store.state.user.mobileCode,
        purchasePersonMobileNum: this.$store.state.user.mobileNum,
        purchasePersonMobilePhone: this.$store.state.user.mobilePhone,
        currencyId: undefined,
        currency: undefined,
        paymentTermName: undefined,
        paymentMethodIdList: [],
        paymentMethodNameList: [],
        validityForDay: 30,
        validity: Date.now() + 30 * 24 * 3600 * 1000,
        committedDate: undefined,
        leadTimeForDay: undefined,
        ourRef: undefined,
        yourRef: undefined,
        conditions: undefined,
        basicRemarks: undefined,
        automatedEmail: '1',
        dropShipping: '0',
        taxRate: undefined,
        bpEmail: undefined,
        mobilePhone: undefined,

        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        receivePortId: undefined,
        receivePortName: undefined,
        addressForPort: {},
        addressForWarehouse: {},
        conditionsTableList: [],
        userList: [],
        exchangeRateDesc: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForDeliveryInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForConditions = false
      this.initPoDetailList = []
      this.initCommonFileList = []
      this.purchaseOrderDetailList = []
      this.activeNames = ['1', '2', '3', '4', '5']
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form1')
      this.resetForm('form2')
      this.resetForm('form4')
    },

    backFN() {
      formDirtyClass.showNotify(this.$route.name).then((msg) => {
        if (msg === 'save') {
          this.handleSaveDraftNoConFirm()
          return
        } else if (msg === 'stop') {
          return
        }
        this.back()
      })
    },
    // 取消按钮
    back() {
      this.$emit('back')
    },
    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form1.validateField(code)
    },

    queryBusinessPartnerOptions() {
      this.businessPartnerOptionsLoading = true
      queryPurchaseOrderCanSelectBusinessPartnerList({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.PO
      })
        .then((res) => {
          this.businessPartnerOptionsLoading = false
          this.businessPartnerOptions = res.rows || []
        })
        .catch(() => {
          this.businessPartnerOptionsLoading = false
        })
    },
    openSupplierTable() {
      this.$refs.selectSupplierTable.handleOpen()
    },
    // 清空供应商
    supplierClear() {
      this.$set(this.form, 'businessPartnerMainId', undefined)
      this.$set(this.form, 'businessPartnerId', undefined)
      this.$set(this.form, 'businessPartnerName', undefined)
      this.$set(this.form, 'businessPartnerNo', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.purchaseQuotationNoClear()
      this.deliveryByClear()
      this.deliveryAddressClear()
      this.initPoDetailList = []
      this.queryPaymentTermListByPaymentTermPurpose()
    },
    updateSupplier(row) {
      if (!row.businessPartnerMainId) {
        this.supplierClear()
        return
      }
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      const registeredAddress =
        (row.bpBusinessAddressList || []).find((x) => (x.label || '').includes('Registered')) || {}
      this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
      this.$set(this.form, 'registeredAddressCity', registeredAddress.city)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      this.$set(this.form, 'bpBusinessAddressList', row.bpBusinessAddressList)
      this.purchaseQuotationNoClear()
      this.deliveryByClear()
      this.deliveryAddressClear()
      this.queryDeliveryAddressOptions()
      /* const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.deliveryByChange(defaultContact)
        }
      } */
      if (row.bpBusinessAddressList && row.bpBusinessAddressList.length === 1) {
        this.deliveryAddressChange(row.bpBusinessAddressList[0])
      }
      this.initPoDetailList = []
      this.queryPaymentTermListByPaymentTermPurpose()
      this.queryPurchaseQuotationOptions()
    },

    queryPurchaseQuotationOptions() {
      this.purchaseQuotationOptionsLoading = true
      queryCanSelectPurchaseQuotationList({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.PO,
        businessPartnerId: this.form.businessPartnerId
      })
        .then((res) => {
          this.purchaseQuotationOptionsLoading = false
          this.purchaseQuotationOptions = res.rows || []
        })
        .catch(() => {
          this.purchaseQuotationOptionsLoading = false
        })
    },
    openPurchaseQuotationTable() {
      this.$refs.selectPurchaseQuotationTable.handleOpen()
    },
    async updatePurchaseQuotationNo(row, isInit = false) {
      if (!row.purchaseQuotationId) {
        this.purchaseQuotationNoClear()
        return
      }
      // const that = this
      if (
        !this.form.purchaseQuotationId ||
        row.purchaseQuotationId !== this.form.purchaseQuotationId
      ) {
        const res = await checkPQFromRFQForBPCount({ purchaseQuotationId: row.purchaseQuotationId })
        console.log(res, '===1463')
        const { isNeedTips, tipsMsg } = res.data
        if (isNeedTips && isNeedTips === '1') {
          let confirm = true
          try {
            confirm = await this.$modal.confirm(tipsMsg)
          } catch (err) {
            console.log(err, '==============1467')
            confirm = false
          }
          console.log(confirm, '===============1465')
          if (!confirm) return
        }
      }

      this.$set(this.form, 'purchaseQuotationNo', row.purchaseQuotationNo)
      this.$set(this.form, 'purchaseQuotationId', row.purchaseQuotationId)
      this.warehouseClear()
      this.receivePortClear()
      this.getPQInfoLoading = true
      const qtimer = Date.now()
      this.queryPQTimer = qtimer
      addPQDefaultMsgToPO({
        purchaseQuotationId: row.purchaseQuotationId
      })
        .then((res) => {
          if (this.queryPQTimer !== qtimer) return
          const dataInfo = res.data || {}
          console.log('isInit', isInit)
          if (this.propPQId) {
            this.updateSupplier(dataInfo)
          }
          this.getPQInfoLoading = false
          this.$set(this.form, 'purchaseQuotationId', dataInfo.purchaseQuotationId)
          this.$set(this.form, 'purchaseQuotationNo', dataInfo.purchaseQuotationNo)
          this.$set(this.form, 'currencyId', dataInfo.currencyId)
          this.$set(this.form, 'currencyCode', dataInfo.currencyCode)
          this.$set(this.form, 'currency', dataInfo.currency)
          this.$set(this.form, 'paymentMethodIdList', dataInfo.paymentMethodIdList || [])
          this.$set(this.form, 'paymentMethodNameList', dataInfo.paymentMethodNameList || [])
          this.$set(this.form, 'ourRef', dataInfo.ourRef)
          this.$set(this.form, 'yourRef', dataInfo.yourRef)
          this.$set(this.form, 'dropShipping', dataInfo.dropShipping)
          this.$set(this.form, 'taxIncluded', dataInfo.taxIncluded)
          this.$set(this.form, 'currencySymbol', dataInfo.currencySymbol)
          this.$set(this.form, 'receiveAddressCountryId', dataInfo.receiveAddressCountryId)
          this.$set(this.form, 'receiveAddressCountry', dataInfo.receiveAddressCountry)
          this.$set(this.form, 'receiveAddressCity', dataInfo.receiveAddressCity)
          // this.$set(this.form, 'paymentTermName', dataInfo.paymentTermName)
          if (dataInfo.paymentTermId && dataInfo.paymentTerm) {
            this.paymentTermChange(dataInfo.paymentTerm)
          } else {
            this.$set(this.form, 'paymentTermName', dataInfo.paymentTermName)
          }
          this.incotermIdChange(dataInfo)

          if (dataInfo.incotermAddressType === '1') {
            this.$set(this.form, 'addressForPort', dataInfo.addressForPort)
            this.$set(this.form, 'receivePortId', dataInfo.receivePortId)
            this.$set(this.form, 'receivePortName', dataInfo.receivePortName)
          }

          if (
            // this.form.dropShipping !== '1' &&
            dataInfo.receiveAddressId &&
            dataInfo.addressForWarehouse &&
            dataInfo.addressForWarehouse.warehouseId
          ) {
            this.$set(this.form, 'addressForWarehouse', dataInfo.addressForWarehouse)
            this.$set(this.form, 'receiveAddressName', dataInfo.receiveAddressName)
            this.$set(this.form, 'receiveAddressId', dataInfo.receiveAddressId)
            this.$set(this.form, 'warehouseId', dataInfo.receiveAddressId)
            this.$set(this.form, 'warehouseName', dataInfo.receiveAddressName)
            this.$set(this.form, 'warehouseType', dataInfo.receiveAddressType)

            const warehouseMsg = dataInfo.addressForWarehouse || {}

            this.$set(this.form, 'initialWarehouseId', this.form.warehouseId)

            this.$set(this.form, 'requestedBy', warehouseMsg.picUserName)
            this.$set(this.form, 'requestedEmail', warehouseMsg.email)
            this.$set(this.form, 'requestedMobileCode', warehouseMsg.mobileCode)
            this.$set(this.form, 'requestedMobileNum', warehouseMsg.mobileNum)
            this.$set(this.form, 'requestedMobilePhone', warehouseMsg.mobilePhone)

            this.$set(this.form, 'userList', warehouseMsg.userList || [])
            if (this.form.userList.length > 0 && !!warehouseMsg.userId) {
              this.requestedByChange1(warehouseMsg.userId)
            }
          } else {
            this.$set(this.form, 'warehouseId', undefined)
            this.$set(this.form, 'warehouseName', undefined)
            this.$set(this.form, 'warehouseType', undefined)
            this.$set(this.form, 'initialWarehouseId', undefined)
            this.$set(this.form, 'userList', [])

            this.$set(this.form, 'receiveAddressId', dataInfo.receiveAddressId)
            this.$set(this.form, 'receiveAddressName', dataInfo.receiveAddressName)
            this.$set(this.form, 'requestedId', dataInfo.requestedId)
            this.$set(this.form, 'requestedBy', dataInfo.requestedBy)
            this.$set(this.form, 'requestedEmail', dataInfo.requestedEmail)
            this.$set(this.form, 'requestedMobileCode', dataInfo.requestedMobileCode)
            this.$set(this.form, 'requestedMobileNum', dataInfo.requestedMobileNum)
            this.$set(this.form, 'requestedMobilePhone', dataInfo.requestedMobilePhone)
          }

          this.$set(this.form, 'taxId', dataInfo.taxId)
          this.$set(this.form, 'taxNo', dataInfo.taxNo)
          this.$set(this.form, 'taxRate', dataInfo.taxRate)

          this.$set(this.form, 'bpBusinessContactPersonId', dataInfo.bpBusinessContactPersonId)
          this.$set(this.form, 'bpContactPersonId', dataInfo.bpContactPersonId)
          this.$set(this.form, 'bpContactPersonName', dataInfo.bpContactPersonName)
          this.$set(this.form, 'bpMobileNum', dataInfo.bpMobileNum)
          this.$set(this.form, 'bpMobileCode', dataInfo.bpMobileCode)
          this.$set(this.form, 'bpMobilePhone', dataInfo.bpMobilePhone)
          this.$set(this.form, 'bpEmail', dataInfo.bpEmail)

          const list = dataInfo.purchaseOrderDetailList || []
          let timer = Date.now()
          list.forEach((item) => {
            timer++
            item.rowTimeId = timer
            if (item.serviceSurchargeList) {
              item.serviceSurchargeList.forEach((child) => {
                timer++
                child.rowTimeId = timer
                /* 需求文档要求：费用项带出qty默认为空，非必填 */
                child.lineTotal = undefined
                child.qty = undefined
              })
            }
          })
          this.initPoDetailList = list
          this.form.detailsOfExpensesList = dataInfo.detailsOfExpensesList || []
          // this.initPoDetailList = dataInfo.purchaseOrderDetailList || []
          this.updateProductTable(list)

          this.initCommonFileList = dataInfo.commonFileList || []

          console.log(this.form.purchaseOrderStatus, '===========================1579')
          if (!dataInfo.purchaseOrderStatus || dataInfo.purchaseOrderStatus === '1') {
            console.log('===========================1580')
            this.queryUnapprovedAdhocProductNameList()
          }
          setTimeout(() => {
            const initFormJson = this.getFormJson()
            formDirtyClass.routeStatusData[this.$route.name] = {
              $vm: this,
              saveShow: true,
              submitShow: true,
              initFormJson,
              getFormJson: this.getFormJson,
              isSaveSuccess: false,
              saveOrSubmitFn: this.handleSaveDraftNoConFirm
            }
          }, 300)
        })
        .catch(() => {
          this.getPQInfoLoading = false
        })
    },
    queryUnapprovedAdhocProductNameList() {
      const that = this
      const openConfirm = (tempProductNameList) => {
        const h = that.$createElement
        const contents = []
        contents.push(h('div', { style: 'font-size: 14px' }, that.$t('PURCHASE.unApproval1')))
        tempProductNameList.forEach((x) => {
          const span1 = h(
            'span',
            {
              style:
                'display: inline-block;width: 8px; height: 8px;margin-right: 5px;border-radius: 8px; background: #ffba00'
            },
            ''
          )
          const span2 = h('span', { style: 'font-size: 14px' }, x)
          contents.push(h('div', { style: 'font-size: 14px' }, [span1, span2]))
        })
        const content = h('p', null, contents)
        this.$alert(content, '', {
          confirmButtonText: this.$t('uiBtn.confirm'),
          cancelButtonText: this.$t('uiBtn.back'),
          showCancelButton: false,
          showClose: false,
          type: 'warning',
          customClass: 'custom-class'
        })
          .then(() => {})
          .catch(() => {})
      }
      const productIdList = this.initPoDetailList.filter((x) => x.productId).map((k) => k.productId)
      // 筛选 没有productId 并且 isAdhocEntry === 1 的临时产品
      const isAdhocEntryProductList = this.initPoDetailList.filter(
        (x) => !x.productId && x.isAdhocEntry === '1'
      )
      if (productIdList.length > 0) {
        queryUnapprovedAdhocProductNameList({ productIdList }).then((res) => {
          let tempProductNameList = res.data || []
          if (isAdhocEntryProductList && isAdhocEntryProductList.length > 0) {
            tempProductNameList = [
              ...tempProductNameList,
              ...isAdhocEntryProductList.map((x) => x.productName)
            ]
          }
          if (tempProductNameList && tempProductNameList.length > 0) {
            const h = that.$createElement
            const contents = []
            contents.push(h('div', { style: 'font-size: 14px' }, that.$t('PURCHASE.unApproval1')))
            tempProductNameList.forEach((x) => {
              const span1 = h(
                'span',
                {
                  style:
                    'display: inline-block;width: 8px; height: 8px;margin-right: 5px;border-radius: 8px; background: #ffba00'
                },
                ''
              )
              const span2 = h('span', { style: 'font-size: 14px' }, x)
              contents.push(h('div', { style: 'font-size: 14px' }, [span1, span2]))
            })
            const content = h('p', null, contents)
            this.$alert(content, '', {
              confirmButtonText: this.$t('uiBtn.confirm'),
              cancelButtonText: this.$t('uiBtn.back'),
              showCancelButton: false,
              showClose: false,
              type: 'warning',
              customClass: 'custom-class'
            })
              .then(() => {})
              .catch(() => {})
          } else if (isAdhocEntryProductList && isAdhocEntryProductList.length > 0) {
            const tempProductNameList = isAdhocEntryProductList.map((x) => x.productName)
            openConfirm(tempProductNameList)
          }
        })
      } else if (isAdhocEntryProductList && isAdhocEntryProductList.length > 0) {
        const tempProductNameList = isAdhocEntryProductList.map((x) => x.productName)
        openConfirm(tempProductNameList)
      }
    },
    purchaseQuotationNoClear() {
      this.queryPQTimer = Date.now()
      this.$set(this.form, 'purchaseQuotationNo', undefined)
      this.$set(this.form, 'purchaseQuotationId', undefined)
      this.$set(this.form, 'dropShipping', '0')
      this.currencyClear()
      this.paymentMethodChange([], [])
      this.paymentTermChange({})
      this.incotermIdChange({})
      this.warehouseClear()
      this.receivePortClear()
      this.initPoDetailList = []
      this.purchaseOrderDetailList = []
      this.$set(this.form, 'detailsOfExpensesList', [])
    },

    queryUserDepartment() {
      queryUserDepartment({ menuPerms: this.menuKey.PO }).then((res) => {
        this.deptOptions = res.data || []
        this.deptOptions.forEach((item) => {
          if (item.isDefault === '1') {
            this.$set(this.form, 'departmentId', item.departmentId)
            this.$set(this.form, 'departmentName', item.departmentName)
            this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
            formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
              departmentId: item.departmentId,
              departmentName: item.departmentName,
              allSuperiorName: item.allSuperiorName
            })
            this.queryPurchasePersonByOptions()
          }
        })
      })
    },
    departmentChange(item) {
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
      if (this.form.purchasePersonId !== this.$store.state.user.userId) {
        this.purchasePersonClear()
      }
    },

    queryPurchasePersonByOptions() {
      this.purchasePersonByOptionsLoading = true
      queryUsers({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.PO,
        departmentId: this.form.departmentId
      })
        .then((res) => {
          this.purchasePersonByOptionsLoading = false
          this.purchasePersonByOptions = res.rows || []
        })
        .catch(() => {
          this.purchasePersonByOptionsLoading = false
        })
    },
    openPurchasePersonTable() {
      this.$refs.selectPurchasePersonTable.handleOpen()
    },
    purchasePersonClear() {
      this.$set(this.form, 'purchasePersonBy', undefined)
      this.$set(this.form, 'purchasePersonId', undefined)
      this.$set(this.form, 'purchasePersonEmail', undefined)
      this.$set(this.form, 'purchasePersonMobileCode', undefined)
      this.$set(this.form, 'purchasePersonMobileNum', undefined)
      this.$set(this.form, 'purchasePersonMobilePhone', undefined)
    },
    updatePurchasePerson(row) {
      this.$set(this.form, 'purchasePersonBy', row.nickName)
      this.$set(this.form, 'purchasePersonId', row.userId)
      this.$set(this.form, 'purchasePersonEmail', row.email)
      this.$set(this.form, 'purchasePersonMobileCode', row.mobileCode)
      this.$set(this.form, 'purchasePersonMobileNum', row.mobileNum)
      this.$set(this.form, 'purchasePersonMobilePhone', row.mobilePhone)
    },
    queryCurrencyListBySelect() {
      this.currencyOptionsLoading = true
      queryCurrencyListBySelect()
        .then((res) => {
          this.currencyOptionsLoading = false
          const list = res.data || []
          this.currencyOptions = list.map((item) => {
            item.label = `${item.currencyCode} (${item.currencyDesc})`
            return item
          })
        })
        .catch(() => {
          this.currencyOptionsLoading = false
        })
    },
    currencyChange(row) {
      this.$set(this.form, 'currencyId', row.id)
      this.$set(this.form, 'currency', row.currency)
      this.$set(this.form, 'currencyCode', row.currencyCode)
      this.$set(this.form, 'currencySymbol', row.currencySymbol)

      const detailList = this.$refs.ProductTable.getList()
      conversionCurrencyUnitPrice({
        purchaseQuotationId: this.form.purchaseQuotationId,
        businessPartnerId: this.form.businessPartnerId,
        createType: this.form.createType,
        currencyId: row.id,
        currencyCode: row.currencyCode,
        purchaseOrderDetailList: detailList,
        detailsOfExpensesList: this.form.detailsOfExpensesList || []
      }).then((res) => {
        const data = res.data || {}
        this.initPoDetailList = data.purchaseOrderDetailList || []
        this.$set(this.form, 'detailsOfExpensesList', data.detailsOfExpensesList || [])
      })
    },
    currencyClear() {
      this.$set(this.form, 'currencyCode', undefined)
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      this.$set(this.form, 'currencySymbol', undefined)
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
      this.getFormattedVarContentFn()
    },

    dropShippingChange() {
      this.salesOrderNoClear()
    },

    openSalesOrderTable() {
      this.$refs.selectSalesOrderTable.handleOpen()
    },
    salesOrderChange(row) {
      this.$set(this.form, 'salesOrderNo', row.salesOrderNo)
      this.$set(this.form, 'salesOrderId', row.salesOrderId)
      this.$set(this.SOForm, 'incotermId', row.incotermId)
      this.$set(this.SOForm, 'incotermName', row.incotermName)
      this.$set(this.SOForm, 'incotermAbbreviation', row.incotermAbbreviation)
      this.$set(this.SOForm, 'incotermAddressType', row.incotermAddressType)
      if (row.incotermAddressType === '1') {
        this.$set(this.SOForm, 'receivePortName', row.receiveAddressName)
      } else {
        this.$set(this.SOForm, 'receivePortName', row.receiveAddress)
      }
      this.$set(this.SOForm, 'receiveAddressId', row.receiveAddressId)
      this.$set(this.SOForm, 'requestedBy', row.bpContactPersonName)
      this.$set(this.SOForm, 'requestedEmail', row.bpEmail)
      this.$set(this.SOForm, 'requestedMobileCode', row.bpMobileCode)
      this.$set(this.SOForm, 'requestedMobileNum', row.bpMobileNum)
      this.$set(this.SOForm, 'requestedMobilePhone', row.bpMobilePhone)
    },

    salesOrderNoClear() {
      this.$set(this.form, 'salesOrderNo', undefined)
      this.$set(this.form, 'salesOrderId', undefined)
      this.$set(this.SOForm, 'incotermId', undefined)
      this.$set(this.SOForm, 'incotermName', undefined)
      this.$set(this.SOForm, 'incotermAbbreviation', undefined)
      this.$set(this.SOForm, 'incotermAddressType', undefined)
      this.$set(this.SOForm, 'receiveAddressId', undefined)
      this.$set(this.SOForm, 'receivePortName', undefined)
      this.$set(this.SOForm, 'requestedBy', undefined)
      this.$set(this.SOForm, 'requestedEmail', undefined)
      this.$set(this.SOForm, 'requestedMobileCode', undefined)
      this.$set(this.SOForm, 'requestedMobileNum', undefined)
      this.$set(this.SOForm, 'requestedMobilePhone', undefined)
    },

    /* 第二部分表单 */
    queryIncotermList() {
      this.incotermOptionsLoading = true
      queryIncotermList({})
        .then((res) => {
          this.incotermOptions = res.data || []
          this.incotermOptionsLoading = false
        })
        .catch(() => {
          this.incotermOptionsLoading = false
        })
    },
    incotermIdChange(item) {
      // const oldType = this.form.incotermAddressType
      this.$set(this.form, 'incotermId', item.incotermId)
      this.$set(this.form, 'incotermName', item.incotermName)
      this.$set(this.form, 'incotermAbbreviation', item.incotermAbbreviation)
      this.$set(this.form, 'incotermAddressType', item.incotermAddressType)

      this.$set(this.form, 'receivePortId', undefined)
      this.$set(this.form, 'receivePortName', undefined)
      this.$set(this.form, 'addressForPort', undefined)
      this.$nextTick(() => {
        this.$refs.form2.clearValidate('receivePortName')
      })
      this.getFormattedVarContentFn()
      this.queryCanSelectPortList()
    },

    queryCanSelectPortList() {
      let firstCountryId
      let firstCountry
      let firstCity
      if (['FOB', 'FAS'].includes(this.form.incotermAbbreviation)) {
        firstCountry = this.form.registeredAddressCountry
        firstCity = this.form.registeredAddressCity
      }
      if (['CIF', 'CFR'].includes(this.form.incotermAbbreviation)) {
        firstCountryId = this.form.receiveAddressCountryId
        firstCountry = this.form.receiveAddressCountry
        firstCity = this.form.receiveAddressCity
      }
      queryCanSelectPortList({
        pageNum: 1,
        pageSize: 300,
        firstCountryId,
        firstCountry,
        firstCity
      }).then((res) => {
        this.portOptions = res.rows || []
      })
    },
    openReceivePortTable() {
      if (this.form.incotermAddressType === '1') {
        let firstCountryId
        let firstCountry
        let firstCity
        if (['FOB', 'FAS'].includes(this.form.incotermAbbreviation)) {
          firstCountry = this.form.registeredAddressCountry
          firstCity = this.form.registeredAddressCity
        }
        if (['CIF', 'CFR'].includes(this.form.incotermAbbreviation)) {
          firstCountryId = this.form.receiveAddressCountryId
          firstCountry = this.form.receiveAddressCountry
          firstCity = this.form.receiveAddressCity
        }
        this.$refs.selectPortTable.handleOpen(firstCountryId, firstCountry, firstCity)
      }
    },
    receivePortClear() {
      this.$set(this.form, 'receivePortName', undefined)
      this.$set(this.form, 'receivePortId', undefined)
      this.$set(this.form, 'addressForPort', undefined)
      this.getFormattedVarContentFn()
    },
    updatePort(row) {
      const { portName, portId, country } = row
      this.$set(this.form, 'addressForPort', row)
      this.$set(this.form, 'receivePortName', portName)
      this.$set(this.form, 'receivePortId', portId)
      this.getFormattedVarContentFn()
      console.log(this.form.receiveAddressCountryId, '=============2075')
      if (!portId) return
      if (['FOB', 'FAS'].indexOf(this.form.incotermAbbreviation) !== -1) {
        if (
          this.form.registeredAddressCountry !== country &&
          this.form.registeredAddressCountry.indexOf(country) === -1
        ) {
          this.$alert(
            this.$t('PURCHASE.portIncorrectForFOBOrFAS2')
              .replace('$1', this.form.country)
              .replace('$2', this.form.incotermAbbreviation),
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
            .then(() => {
              this.$refs.portRef.handleBlur()
            })
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
            .then(() => {
              this.$refs.portRef.handleBlur()
            })
            .catch(() => {})
        }
      }
    },
    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId, warehouseType, userList } = row
      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'receiveAddressName', warehouseName)
      this.$set(this.form, 'receiveAddressId', warehouseId)
      this.$set(this.form, 'warehouseId', warehouseId)
      this.$set(this.form, 'warehouseName', warehouseName)
      this.$set(this.form, 'warehouseType', warehouseType)
      this.$set(this.form, 'userList', userList || [])
      if (userList && userList.length > 0) {
        this.$set(this.form, 'requestedId', row.userId)
        this.$set(this.form, 'requestedBy', row.picUserNameShowStr)
        this.$set(this.form, 'requestedEmail', row.email)
        this.$set(this.form, 'requestedMobileCode', row.mobileCode)
        this.$set(this.form, 'requestedMobileNum', row.mobileNum)
        this.$set(this.form, 'requestedMobilePhone', row.mobilePhone)
      }

      const detailList = this.$refs.ProductTable.getList()
      const noCanSelectProductIdList = row.noCanSelectProductIdList || []
      const newDetailList = detailList.filter((item) => {
        return !noCanSelectProductIdList.includes(item.productId)
      })
      this.initPoDetailList = JSON.parse(JSON.stringify(newDetailList))
    },
    warehouseClear() {
      this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'warehouseId', undefined)
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseType', undefined)
      this.$set(this.form, 'userList', [])
      this.requestedByClear()
    },
    addRequestedBy() {
      const params = {
        requestedBy: this.form.requestedBy,
        requestedEmail: this.form.requestedEmail,
        requestedMobileCode: this.form.requestedMobileCode,
        requestedMobileNum: this.form.requestedMobileNum,
        requestedMobilePhone: this.form.requestedMobilePhone
      }
      this.$refs.editRequestedByDlg.handleOpen(params)
    },
    requestedByChange(row) {
      this.$set(this.form, 'requestedBy', row.requestedBy)
      this.$set(this.form, 'requestedEmail', row.requestedEmail)
      this.$set(this.form, 'requestedMobileCode', row.requestedMobileCode)
      this.$set(this.form, 'requestedMobileNum', row.requestedMobileNum)
      this.$set(this.form, 'requestedMobilePhone', row.requestedMobilePhone)
    },
    requestedByChange1(e) {
      console.log(e)
      const { userList } = this.form
      if (e) {
        const row = userList.filter((x) => x.userId === e)[0]
        this.$set(this.form, 'requestedId', row.userId)
        this.$set(this.form, 'requestedBy', row.nickName)
        this.$set(this.form, 'requestedEmail', row.email)
        this.$set(this.form, 'requestedMobileCode', row.mobileCode)
        this.$set(this.form, 'requestedMobileNum', row.mobileNum)
        this.$set(this.form, 'requestedMobilePhone', row.mobilePhone)
      } else {
        this.requestedByClear()
      }
    },
    requestedByClear() {
      this.$set(this.form, 'requestedId', undefined)
      this.$set(this.form, 'requestedBy', undefined)
      this.$set(this.form, 'requestedEmail', undefined)
      this.$set(this.form, 'requestedMobileCode', undefined)
      this.$set(this.form, 'requestedMobileNum', undefined)
      this.$set(this.form, 'requestedMobilePhone', undefined)
    },

    updateLeadTime(list) {
      let maxLeadTime
      list.forEach((item) => {
        if (this.$resultOfBoolean(item.leadTime)) {
          if (!maxLeadTime) {
            maxLeadTime = item.leadTime
          } else if (item.leadTime > maxLeadTime) {
            maxLeadTime = item.leadTime
          }
        }
      })
      this.$set(this.form, 'leadTimeForDay', maxLeadTime)
      this.getFormattedVarContentFn()
    },
    /* 第三部分 表格部分Start */
    updateProductTable(list) {
      this.purchaseOrderDetailList = list || []
      let maxLeadTime
      this.purchaseOrderDetailList.forEach((item) => {
        if (this.$resultOfBoolean(item.leadTime)) {
          if (!maxLeadTime) {
            maxLeadTime = item.leadTime
          } else if (item.leadTime > maxLeadTime) {
            maxLeadTime = item.leadTime
          }
        }
      })
      this.$set(this.form, 'leadTimeForDay', maxLeadTime)
      /* const flag = this.purchaseOrderDetailList.some((item) => item.dropShipping === '1')
      if (flag) {
        if (this.form.dropShipping !== '1') {
          this.$set(this.form, 'dropShipping', '1')
          this.dropShippingChange()
        }
      }
      const flag1 = this.purchaseOrderDetailList.some((item) => item.isSystemDocking === '1')
      if (flag1) {
        if (this.form.dropShipping === '1') {
          this.$set(this.form, 'dropShipping', '0')
          this.dropShippingChange()
        }
      } */
    },
    /* 表格部分End */

    /* 第四部分表单 */
    deliveryByChange(row) {
      this.$set(this.form, 'bpBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'bpContactPersonId', row.contactPersonId)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'bpMobileNum', row.mobileNum)
      this.$set(this.form, 'bpMobileCode', row.mobileCode)
      this.$set(this.form, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.form, 'bpEmail', row.email)
    },
    deliveryByClear() {
      this.$set(this.form, 'bpBusinessContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonName', undefined)
      this.$set(this.form, 'bpMobileNum', undefined)
      this.$set(this.form, 'bpMobileCode', undefined)
      this.$set(this.form, 'bpMobilePhone', undefined)
      this.$set(this.form, 'bpEmail', undefined)
    },

    queryDeliveryAddressOptions() {
      this.deliveryAddressOptionsLoading = true
      this.deliveryAddressOptions = []
      if (!this.form.businessPartnerMainId) {
        this.deliveryAddressOptionsLoading = false
        return
      }
      const param = {
        pageNum: 1,
        pageSize: 9999,
        businessPartnerMainId: this.form.businessPartnerMainId
      }
      const timer = Date.now()
      this.queryADTimer = timer
      queryAddressByBusinessPartnerId(param)
        .then((response) => {
          if (this.queryADTimer !== timer) return
          this.deliveryAddressOptionsLoading = false
          const rows = response.rows || []
          this.deliveryAddressOptions = rows
        })
        .catch(() => {
          if (this.queryADTimer !== timer) return
          this.deliveryAddressOptionsLoading = false
        })
    },
    openDeliveryAddressTable() {
      this.$refs.selectBPAddressDlg.handleOpen()
    },
    deliveryAddressChange(row) {
      this.$set(this.form, 'bpBusinessAddress', row)
      this.$set(this.form, 'bpBusinessAddressId', row.businessAddressId)
      this.$set(this.form, 'bpAddressDataId', row.bpAddressDataId)
      this.$set(this.form, 'bpAddress', row.receiveAddress)
    },
    deliveryAddressClear() {
      this.$set(this.form, 'bpBusinessAddress', undefined)
      this.$set(this.form, 'bpBusinessAddressId', undefined)
      this.$set(this.form, 'bpAddressDataId', undefined)
      this.$set(this.form, 'bpAddress', undefined)
    },
    /* 表单部分End */

    async submitForm(submitType) {
      const myFileIds = this.$refs.ProductTable.getFileIds()
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
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.RecipientInfo'))
        )
        return
      }
      if (valid1 && valid2) {
        let param = { ...this.form }
        param = this.$trimOfObj(param)
        const detailList = this.$refs.ProductTable.getList()
        const validProduct = this.validProductList(detailList)
        if (!validProduct) {
          this.$refs.ProductTable.activeName = '1'
          this.collapseWarningForProductInfo = true
          return
        }
        /* const validDetailsOfExpenses = this.validDetailsOfExpensesList(
          param.detailsOfExpensesList || []
        )
        if (!validDetailsOfExpenses) {
          this.$refs.ProductTable.activeName = '1'
          this.collapseWarningForProductInfo = true
          return
        } */
        this.collapseWarningForProductInfo = false
        param.purchaseOrderDetailList = detailList

        const conditionsCurList = this.form.conditionsTableList || []
        /* if (conditionsCurList.length <= 0) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.conditions')))
          this.collapseWarningForConditions = true
          return
        } */
        const conditionsReq = conditionsCurList.find((item) => {
          const text = (item.conditions || '').trim()
          return text.length <= 0
        })
        if (conditionsReq) {
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.conditions')))
          this.collapseWarningForConditions = true
          return
        }
        this.collapseWarningForConditions = false

        param.commonFileList = myFileIds
        const valid4 = await this.$refs.form4.validate().catch((err) => {
          return err
        })
        this.collapseWarningForDeliveryInfo = !valid4

        if (!valid4) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.contactInfo'))
          )
          return
        }
        /* if (param.dropShipping === '1' && param.salesOrderId) {
          param.incotermId = this.SOForm.incotermId
          param.incotermName = this.SOForm.incotermName
          param.incotermAbbreviation = this.SOForm.incotermAbbreviation
          param.incotermAddressType = this.SOForm.incotermAddressType
          param.receiveAddressId = this.SOForm.receiveAddressId
          param.shipToAddressId = this.SOForm.receiveAddressId
          param.receivePortName = this.SOForm.receivePortName
          param.requestedId = this.SOForm.requestedId
          param.requestedBy = this.SOForm.requestedBy
          param.requestedEmail = this.SOForm.requestedEmail
          param.requestedMobileCode = this.SOForm.requestedMobileCode
          param.requestedMobileNum = this.SOForm.requestedMobileNum
          param.requestedMobilePhone = this.SOForm.requestedMobilePhone
        } else if (param.dropShipping === '1' && !param.salesOrderId) {
          param.requestedId = param.purchasePersonId
          param.requestedBy = param.purchasePersonBy
          param.requestedEmail = param.purchasePersonEmail
          param.requestedMobileCode = param.purchasePersonMobileCode
          param.requestedMobileNum = param.purchasePersonMobileNum
          param.requestedMobilePhone = param.purchasePersonMobilePhone
        } */

        if (this.form.isTotalAmountNegativeTips === '1') {
          this.$refs.ProductTable.scrollPageToTotalAmount()
          return
        }

        this.handleSetConditionsHtmlStr(true)
        param.conditions = this.form.conditions
        param.conditionsTableJson = this.form.conditionsTableJson
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('PURCHASE.poSaveConfirm')
          successMsg = this.$t('PURCHASE.poSaveSuccess')
          submitFn = saveDraftPurchaseOrder
        } else {
          confirmMsg = this.$t('PURCHASE.poSubmitConfirm')
          successMsg = this.$t('PURCHASE.poSubmitSuccess')
          submitFn = savePurchaseOrder
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
    validCoefficientIsTrue(row) {
      if (!row.purchaseUomCoefficient || !row.purchaseQty) return true
      const { decimalPlaces, formulaStr } = getMultiplyDecimalPlaces(
        row.purchaseQty,
        row.purchaseUomCoefficient
      )
      if (row.includeDecimal === '1') {
        if (decimalPlaces <= 3) {
          return true
        } else {
          this.$modal.msgError(
            this.$t('PURCHASE.validCoefficientErrForDecimal')
              .replace('$1', row.productName)
              .replace('$2', formulaStr)
          )
          return false
        }
      } else {
        if (decimalPlaces <= 0) {
          return true
        } else {
          this.$modal.msgError(
            this.$t('PURCHASE.validCoefficientErr')
              .replace('$1', row.productName)
              .replace('$2', formulaStr)
          )
          return false
        }
      }
    },
    validProductList(detailList) {
      this.$trimOfObj(this.form.detailsOfExpensesList)
      const detailsOfExpensesList = this.form.detailsOfExpensesList || []
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
        return valid
      }

      const expenseItemReq = detailsOfExpensesList.find((item) => {
        return !(item.expenseItem || '').trim()
      })
      if (expenseItemReq) {
        this.$set(expenseItemReq, 'productNameError', true)
        this.$set(expenseItemReq, 'ROW-ERROR', true)
        this.$refs.ProductTable.errorMessage('productName')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.productName'))
        )
        return valid
      }

      /* const moqReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.moq)
      })
      if (moqReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.moq')))
        return valid
      } */
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.purchaseQty)
      })
      if (qtyReq) {
        this.$refs.ProductTable.errorMessage('purchaseQty')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseQTY'))
        )
        return valid
      }

      if (!this.$refs.ProductTable.validateAssignPurchaseQty(detailList)) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseQTY'))
        )
        return false
      }

      const qtyLessThanMoq = detailList.find((item) => {
        return item.moq && item.purchaseQty < item.moq
      })
      if (qtyLessThanMoq) {
        this.$modal.msgError(this.$t('PURCHASE.qtyLessThanMoq'))
        return valid
      }

      /* 校验系数*数量后小数位是否符合要求 */
      const validCoefficient = detailList.find((item) => {
        return !this.validCoefficientIsTrue(item)
      })
      if (validCoefficient) {
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.purchaseUom)
      })
      if (uomReq) {
        this.$refs.ProductTable.errorMessage('purchaseUom')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseUOM'))
        )
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.unitPrice)
      })
      if (unitPriceReq) {
        this.$refs.ProductTable.errorMessage('unitPrice')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.unitPrice'))
        )
        return valid
      }

      const amountReq = detailsOfExpensesList.find((item) => {
        return !this.$resultOfBoolean(item.amount)
      })
      if (amountReq) {
        this.$set(amountReq, 'unitPriceError', true)
        this.$set(amountReq, 'ROW-ERROR', true)
        this.$refs.ProductTable.errorMessage('unitPrice')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.unitPrice'))
        )
        return valid
      }

      const leadTimeReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.leadTime)
      })
      if (leadTimeReq) {
        this.$refs.ProductTable.errorMessage('leadTime')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.leadTimeDays'))
        )
        return valid
      }
      this.$refs.ProductTable.$refs.totalForm.validateField('taxRate')
      if (!this.$resultOfBoolean(this.form.taxRate)) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.taxRate')))
        return valid
      }

      return true
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
    scrollPageToTotalAmount(offsetTop) {
      try {
        if (!this.$refs.FormPageLayoutRef) return
        const pageContent = this.$refs.FormPageLayoutRef.$refs.pageContent
        if (pageContent) {
          pageContent.scrollTo({
            top: offsetTop, // pageContent 没有使用定位
            behavior: 'smooth' // 平滑滚动
          })
        }
      } catch (err) {}
    },

    validDetailsOfExpensesList(detailList) {
      const valid = false
      const expenseItemReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.expenseItem)
      })
      if (expenseItemReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.expenseItem'))
        )
        return valid
      }
      const amountReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.amount)
      })
      if (amountReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.amount')))
        return valid
      }
      return true
    },

    getFormJson() {
      this.handleSetConditionsHtmlStr()
      const param = { ...this.form }
      delete param.subTotal
      delete param.totalTaxAmount
      delete param.totalAmount
      const detailList = this.$refs.ProductTable.getList()
      param.purchaseOrderDetailList = detailList
      const myFileIds = this.$refs.ProductTable.getFileIds()
      param.commonFileList = myFileIds

      return JSON.stringify(param)
    },
    async handleSaveDraft(isConfirm = true, gotoRoute) {
      const myFileIds = this.$refs.ProductTable.getFileIds()
      if (myFileIds === false) {
        return
      }
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForDeliveryInfo = false
      this.collapseWarningForProductInfo = false

      this.$refs.form1.clearValidate()
      let valid1 = true
      this.$refs.form1.validateField(['businessPartnerName', 'purchaseQuotationNo'], (err) => {
        if (err) {
          valid1 = false
        }
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }

      if (valid1) {
        this.handleSetConditionsHtmlStr()
        let param = { ...this.form }
        const detailList = this.$refs.ProductTable.getList()
        param.purchaseOrderDetailList = detailList
        param.commonFileList = myFileIds

        /* if (param.dropShipping === '1' && param.salesOrderId) {
          param.incotermId = this.SOForm.incotermId
          param.incotermName = this.SOForm.incotermName
          param.incotermAbbreviation = this.SOForm.incotermAbbreviation
          param.incotermAddressType = this.SOForm.incotermAddressType
          param.receiveAddressId = this.SOForm.receiveAddressId
          param.shipToAddressId = this.SOForm.receiveAddressId
          param.receivePortName = this.SOForm.receivePortName
          param.requestedId = this.SOForm.requestedId
          param.requestedBy = this.SOForm.requestedBy
          param.requestedEmail = this.SOForm.requestedEmail
          param.requestedMobileCode = this.SOForm.requestedMobileCode
          param.requestedMobileNum = this.SOForm.requestedMobileNum
          param.requestedMobilePhone = this.SOForm.requestedMobilePhone
        } else if (param.dropShipping === '1' && !param.salesOrderId) {
          param.requestedId = param.purchasePersonId
          param.requestedBy = param.purchasePersonBy
          param.requestedEmail = param.purchasePersonEmail
          param.requestedMobileCode = param.purchasePersonMobileCode
          param.requestedMobileNum = param.purchasePersonMobileNum
          param.requestedMobilePhone = param.purchasePersonMobilePhone
        } */

        if (this.form.isTotalAmountNegativeTips === '1') {
          this.$refs.ProductTable.scrollPageToTotalAmount()
          return
        }

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // param.commonFileList = myFileIds
        const confirmMsg = this.$t('PURCHASE.poSaveConfirm')
        const successMsg = this.$t('PURCHASE.poSaveSuccess')
        const submitFn = saveDraftPurchaseOrder
        if (isConfirm) {
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
        } else {
          this.submitLoading = true
          submitFn(param)
            .then((response) => {
              const pageItem = formDirtyClass.routeStatusData[this.$route.name]
              if (pageItem) {
                pageItem.isSaveSuccess = true
              }
              this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
              this.submitLoading = false
              if (gotoRoute && gotoRoute.name !== this.$route.name) {
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.push(gotoRoute).catch(() => {})
              } else {
                this.back()
              }
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      }
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      this.handleSaveDraft(false, gotoRoute)
    },
    handlePreviewPDF() {
      const token = getToken()
      if (this.$refs.ProductTable) {
        this.$refs.ProductTable.handleCalculate()
      }
      this.handleSetConditionsHtmlStr()
      let param = { ...this.form }
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
      const detailList = this.$refs.ProductTable.getList()
      param.purchaseOrderDetailList = detailList
      this.previewPDFLoading = true
      this.previewPDFLoading = true
      /* if (param.dropShipping === '1' && param.salesOrderId) {
        param.incotermId = this.SOForm.incotermId
        param.incotermName = this.SOForm.incotermName
        param.incotermAbbreviation = this.SOForm.incotermAbbreviation
        param.incotermAddressType = this.SOForm.incotermAddressType
        param.receiveAddressId = this.SOForm.receiveAddressId
        param.shipToAddressId = this.SOForm.receiveAddressId
        param.receivePortName = this.SOForm.receivePortName
        param.requestedId = this.SOForm.requestedId
        param.requestedBy = this.SOForm.requestedBy
        param.requestedEmail = this.SOForm.requestedEmail
        param.requestedMobileCode = this.SOForm.requestedMobileCode
        param.requestedMobileNum = this.SOForm.requestedMobileNum
        param.requestedMobilePhone = this.SOForm.requestedMobilePhone
      } else if (param.dropShipping === '1' && !param.salesOrderId) {
        param.requestedId = param.purchasePersonId
        param.requestedBy = param.purchasePersonBy
        param.requestedEmail = param.purchasePersonEmail
        param.requestedMobileCode = param.purchasePersonMobileCode
        param.requestedMobileNum = param.purchasePersonMobileNum
        param.requestedMobilePhone = param.purchasePersonMobilePhone
      } */
      preview(param)
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
