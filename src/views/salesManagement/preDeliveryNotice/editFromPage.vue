<template>
  <FormPageLayout ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        :disabled="!form.documentNo || !form.preDeliveryNoticeType || submitLoading"
        @click="handleAssign"
        v-if="submitBtnShow"
        >{{ $t('uiBtn.submit') || $t('SALES.next') }}
      </el-button>
      <!-- v-if="!comDisFrom && buttonAuthMsg.isCanAssignTask === '1'" -->
      <el-button
        type="primary"
        size="mini"
        :disabled="submitLoading"
        @click="submitForm('save')"
        v-if="saveBtnShow"
        >{{ $t('uiBtn.save') }}
      </el-button>
      <!-- v-if="!comDisFrom && buttonAuthMsg.isCanSaveDraft === '1'" -->

      <el-button type="primary" size="mini" v-if="withdrawBtnShow" @click="handleWithdraw"
        >{{ $t('menu.withdraw') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>
      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>

    <template v-slot:content>
      <!-- v-loading="loading" -->
      <div>
        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="1">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.basicInfo')"
                :warning="collapseWarningForBasicInfo"
              >
                <span
                  v-if="form.businessPartnerName"
                  class="info-item mr20"
                  :title="form.businessPartnerName"
                >
                  {{ $t('SALES.customerName') }} : {{ form.businessPartnerName }}
                </span>
                <span
                  v-if="form.shipWarehouseName"
                  class="info-item mr20"
                  :title="form.shipWarehouseName"
                >
                  {{ $t('SALES.deliveryWarehouse') }} : {{ form.shipWarehouseName }}
                </span>
                <span class="info-item" v-if="form.preDeliveryNoticeStatus">
                  {{ $t('ui.status') }} :
                  {{
                    selectDictLabel(
                      dict.type.pre_delivery_notice_status,
                      form.preDeliveryNoticeStatus
                    )
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
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.documentNo')}`" prop="documentNo">
                      <!-- <SelectInput
                        :value="form.documentNo"
                        :title="form.documentNo"
                        @click="openSalesOrderTable"
                        @clear="salesOrderNoClear"
                        :clearable="false"
                        :disabled="!!form.preDeliveryNoticeId"
                      /> -->

                      <CommonSelectAndList
                        :id="form.documentId"
                        :label="form.documentNo"
                        idKey="documentId"
                        labelKey="documentNo"
                        filterable
                        :clearable="false"
                        v-if="!form.preDeliveryNoticeId"
                        :options="salesOrderListShow"
                        :optionsAll="comAllOptions"
                        :filter-method="filterMethodForPQ"
                        :loading="documentNoLoading"
                        @visible-change="visibleChangeForPQ"
                        @change="updateSalesOrderNo"
                        @handleOpen="openSalesOrderTable"
                        :key="'documentNo' + comAllOptions.length"
                      >
                        <template slot-scope="{ item }">{{ item.SOShowStr }}</template>
                      </CommonSelectAndList>
                      <SelectInput
                        v-else
                        :value="form.documentNo"
                        :title="form.documentNo"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('ui.type')}`"
                      prop="preDeliveryNoticeType"
                      v-if="form.documentType === '15'"
                    >
                      <el-select
                        v-model="form.preDeliveryNoticeType"
                        @change="preDeliveryNoticeTypeChange"
                        class="w100"
                        placeholder=""
                        :disabled="!!form.preDeliveryNoticeId"
                      >
                        <el-option
                          v-for="dict in comTypeDicts"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label="`${$t('ui.type')}`" prop="preDeliveryNoticeType" v-else>
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.pre_delivery_notice_type,
                            form.preDeliveryNoticeType
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.preDeliveryNoticeNo')}`">
                      <el-input v-model="form.preDeliveryNoticeNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="false">
                    <el-form-item
                      :label="`${$t('SALES.purchaseOrder')}`"
                      prop="purchaseOrderNo"
                      :key="'purchaseOrderNo' + form.replenishType"
                      :rules="[
                        {
                          required: form.replenishType === '2' || comIsDropShippingSO,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <SelectInput
                        :value="form.purchaseOrderNo"
                        :title="form.purchaseOrderNo"
                        @click="openPurchaseOrderTable"
                        @clear="purchaseOrderNoClear"
                        :clearable="true"
                        :disabled="comDisPONo"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerName')}`">
                      <el-input
                        v-model="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.pre_delivery_notice_status,
                            form.preDeliveryNoticeStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.scheduledDeliveryDate')}`"
                      prop="deliveryDate"
                    >
                      <el-date-picker
                        disabled
                        v-model="form.deliveryDate"
                        :picker-options="validityDaysPickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesPerson')}`" prop="salesPersonBy">
                      <SelectInput
                        :value="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        clearable
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <!--  -->
                    <el-form-item
                      :label="`${$t('SALES.deliveryWarehouse')}`"
                      prop="shipWarehouseName"
                      :rules="[
                        {
                          required:
                            form.salesQuotationType === 'Consignment' && form.dropShipping !== '1',
                          message: $t('ui.reqMsg'),
                          trigger: ['change', 'blur']
                        }
                      ]"
                    >
                      <el-input
                        v-model="form.shipWarehouseName"
                        :title="form.shipWarehouseName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`">
                      <el-input v-model="form.currency" :title="form.currency" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col
                    :span="8"
                    v-if="['Replenish', 'Replenish_R'].includes(form.preDeliveryNoticeType)"
                  >
                    <el-form-item :label="`${$t('SALES.replenishType')}`" prop="replenishType">
                      <el-select
                        :disabled="
                          (form.replenishTypes && !(form.replenishTypes || '').includes(',')) ||
                          !!form.preDeliveryNoticeId
                        "
                        v-model="form.replenishType"
                        class="w100"
                        placeholder=""
                        @change="replenishTypeChange"
                      >
                        <el-option
                          v-for="dict in replenishTypeDicts"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')">
                      <MyInput
                        type="textarea"
                        v-model="form.remarks"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        disabled
                        :maxlength="3000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="false">
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.logisticsType')}`"
                      prop="logisticsType"
                      :rules="[
                        {
                          required:
                            form.preDeliveryNoticeType !== 'Consignment' &&
                            form.salesQuotationType !== 'Consignment',
                          message: $t('ui.reqMsg').replace('$1', $t('SALES.logisticsType')),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <el-radio-group
                        v-model="form.logisticsType"
                        :disabled="form.salesQuotationType === 'Consignment'"
                        @change="logisticsTypeChange"
                      >
                        <el-radio
                          v-for="dict in dict.type.logistics_type"
                          :key="dict.value"
                          :label="dict.value"
                        >
                          {{ dict.label }}</el-radio
                        >
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="form.logisticsType === '1'"
                    :key="'driver' + form.logisticsType"
                  >
                    <el-form-item :label="`${$t('SALES.driver')}`" prop="driverName">
                      <SelectInput
                        clearable
                        :value="form.driverName"
                        :title="form.driverName"
                        @click="openDriverTable"
                        @clear="driverNameClear"
                        :disabled="comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="form.logisticsType === '1'"
                    :key="'vehicle' + form.logisticsType"
                  >
                    <el-form-item :label="`${$t('SALES.vehicle')}`" prop="licensePlateNo">
                      <SelectInput
                        clearable
                        :value="form.licensePlateNo"
                        :title="form.licensePlateNo"
                        @click="openVehicleTable"
                        @clear="vehicleClear"
                        :disabled="comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="false">
                    <el-form-item :label="`${$t('SALES.sendEDO')}`">
                      <el-switch
                        v-model="form.sendEDo"
                        :disabled="form.logisticsType === '3'"
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
            <el-collapse-item name="3">
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
                :disabled="true"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.zone')}`">
                      <el-input :value="form.district" :title="form.district" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.incoterm')}`" prop="incotermId">
                      <CommonSelect
                        :id="form.incotermId"
                        :label="form.incotermName"
                        :title="form.incotermName"
                        idKey="incotermId"
                        labelKey="incotermName"
                        :options="incotermOptions"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('ui.address')}`"
                      prop="receiveAddressName"
                      :rules="[
                        {
                          required: false,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <ToolTipShowObj
                        :mData="form.receiveAddressForPort || {}"
                        :showStr="form.district ? '' : form.receiveAddressName"
                        :rows="shipToAddressRows"
                        v-if="form.incotermAddressType === '1'"
                      >
                        <SelectInput
                          :value="form.receiveAddressName"
                          :title="form.district ? form.receiveAddressName : ''"
                          @clear="receiveAddressClear"
                          clearable
                          @click="openReceiveAddressTable"
                          :disabled="true"
                          class="form-wd"
                        />
                      </ToolTipShowObj>
                      <SelectInput
                        v-else
                        :value="form.receiveAddressName"
                        :title="form.receiveAddressName"
                        @clear="receiveAddressClear"
                        clearable
                        @click="openReceiveAddressTable"
                        :disabled="true"
                        class="form-wd"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('SALES.deliveryAddress')}`">
                      <el-input
                        :value="form.receiveAddress"
                        :title="form.receiveAddress"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.contactPerson')}`" prop="bpContactPersonId">
                      <CommonSelect
                        :disabled="true"
                        :id="form.bpContactPersonId"
                        :label="form.bpContactPersonName"
                        :title="form.bpContactPersonName"
                        idKey="contactPersonId"
                        labelKey="contactPersonName"
                        :options="form.bpBusinessContactPersonList || []"
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
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0" ref="collapseScrollPage">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
                <!-- <span v-if="$resultOfBoolean(form.totalAmount)" class="info-item mr20">
                  {{ $t('SALES.totalAmount') }} : {{ $numberStr(form.totalAmount, 2) }}
                </span> -->
                <span class="info-item">
                  {{ $t('SALES.totalQTY') }} : {{ $numberStr(comTotalQty, 3) }}
                </span>
              </FormCollapseItemTitle>
              <div>
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :countryId="form.countryId"
                  :businessPartnerId="form.businessPartnerId"
                  :currencyId="form.currencyId"
                  :comDisFrom="comDisFrom"
                  :basicUpdateProps="basicUpdateProps"
                  @returnSubmitSuccess="back"
                  @updateProductList="updateProductList"
                  :comIsDropShippingSO="comIsDropShippingSO"
                  @scrollPageToTable="scrollPageToTable"
                />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10" v-if="form.preDeliveryNoticeId">
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
    <!-- @onSuccess="updateTable" -->
    <selectSalesOrderTable ref="selectSalesOrderTable" @update="updateSalesOrderNo" />
    <selectPurchaseOrderTable
      :formData="form"
      ref="selectPurchaseOrderTable"
      @update="updatePurchaseOrderNo"
    />
    <assignShipTasksDlg :formData="form" ref="assignShipTasksDlg" @success="assignSuccess" />

    <!-- 取消 -->
    <FormCancelDialog
      :id="form.preDeliveryNoticeId"
      :fromType="'1'"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <selectPaymentTermDlg
      ref="selectPaymentTermDlg"
      :paymentTermPurposeList="paymentTermPurposeList"
      :businessPartnerId="form.businessPartnerId"
      :paymentTermId="form.paymentTermId"
      :salesOrderId="form.salesOrderId"
      @onSuccess="back"
    />

    <selectDriverDlg ref="selectDriverDlg" @onSuccess="updateDriver" />
    <selectVehicleDlg ref="selectVehicleDlg" @onSuccess="updateVehicle" />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

// import { getSystemSetup } from '@/api/system/systemSetting'
import {
  getPreDeliveryNoticeFromSalesOrder,
  getPreDeliveryNoticeFromSalesGoodsReturn,
  queryPreDeliveryNoticeById,
  withdrawPreDeliveryNotice,
  saveDraftPreDeliveryNotice,
  cancelledPreDeliveryNotice,
  setPurchaseQtyForPre,
  submitAssignTask,
  dealDataFromUpdateWarehouse,
  queryPurchaseOrderListFromPreDeliveryNotice,
  queryCanSelectSalesOrderList,
  queryCanSelectSalesGoodsReturnList
} from '@/api/salesManagement/preDeliveryNotice'

import selectSalesOrderTable from './components/selectSalesOrderTable.vue'
import selectPurchaseOrderTable from './components/selectPurchaseOrderTable.vue'
import ProductInfo from './productInfo/productInfo.vue'
import assignShipTasksDlg from './assignShipTasksDlg.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import selectPaymentTermDlg from './components/selectPaymentTermDlg.vue'
import selectDriverDlg from '@/views/projectManagement/storeIssueChit/components/selectDriverDlg.vue'
import selectVehicleDlg from '@/views/projectManagement/storeIssueChit/components/selectVehicleDlg.vue'
import { formDirtyClass } from '@/mixins/formDirtyClass'

export default {
  mixins: [pageMixin],
  dicts: ['pre_delivery_notice_type', 'pre_delivery_notice_status', 'logistics_type'],
  components: {
    selectSalesOrderTable,
    selectPurchaseOrderTable,
    ProductInfo,
    SystemOperationLogTable,
    assignShipTasksDlg,
    FormCancelDialog,
    selectPaymentTermDlg,
    selectDriverDlg,
    selectVehicleDlg
  },
  data() {
    return {
      salesOrderList: [],
      salesGoodsReturnList: [],
      salesOrderListShow: [],
      purpose: {
        Trading: '3', // 贸易
        Service: '4', // 服务
        Project: '5', // 项目
        MixDesign: '6', // 混凝土产品
        Consignment: '7' // 寄卖
      },
      loading: false,
      replenishTypeDicts: [
        {
          value: '1',
          label: this.$t('SALES.warehouse')
        },
        {
          value: '2',
          label: this.$t('SALES.dropShipping1')
        }
      ],
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {
        preDeliveryNoticeProductList: [],
        salesOrderProjectList: [],
        salesOrderServiceList: [],
        projectCostDetailList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForPODetail: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        documentNo: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        preDeliveryNoticeType: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        replenishType: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        driverName: [
          {
            required: false,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        licensePlateNo: [
          {
            required: false,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      validityDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      poDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      deptOptions: [],
      customerQuestionnaireOptions: [],
      currencyOptions: [],
      paymentTermOptions: [],
      paymentMethodOptions: [],
      incotermOptions: [],
      freightTaxNoOptions: [],
      /* 表格部分 */

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
      cancelledUrl: cancelledPreDeliveryNotice,

      returnVisible: false,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      bpHistoryVersionList: [],
      // 请求的时间戳
      queryTime: undefined,
      documentNoLoading: false
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
    propSOId: {
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
        this.queryCanSelectSalesOrderList()
      }
    }
  },
  computed: {
    comAllOptions() {
      return [...this.salesOrderList, ...this.salesGoodsReturnList]
    },
    paymentTermPurposeList() {
      if (
        this.form.preDeliveryNoticeProductList &&
        this.form.preDeliveryNoticeProductList.length > 0
      ) {
        const { salesInquiryType } = this.form.preDeliveryNoticeProductList[0]
        return salesInquiryType ? [this.purpose[salesInquiryType]] : []
      }
      return []
    },
    /* 是否是直运的SO */
    comIsDropShippingSO() {
      let is = false
      if (this.form.documentType === '13' && this.form.dropShipping === '1') {
        is = true
      }
      return is
    },
    comDisPONo() {
      if (this.form.preDeliveryNoticeId) {
        return true
      }
      /* if (this.form.preDeliveryNoticeId && this.form.preDeliveryNoticeStatus !== '1') {
        return true
      } */
      if (this.comDisFrom) {
        return true
      }
      if (this.form.documentType === '13') {
        return (this.form.preDeliveryNoticeProductList || []).length <= 0
      }
      if (this.form.documentType === '15') {
        return (
          this.form.replenishType !== '2' ||
          (this.form.preDeliveryNoticeProductList || []).length <= 0
        )
      }
      return true
    },
    comTotalQty() {
      let value = 0
      const list = this.form.preDeliveryNoticeProductList || []
      list.forEach((item) => {
        if (item.preQty) {
          value += item.preQty
        }
        if (item.preUsePurchaseQtyForBasic) {
          value += item.preUsePurchaseQtyForBasic
        }
      })
      return value
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    comTypeDicts() {
      const list = this.dict.type.pre_delivery_notice_type || []
      let filterTypes = ['Repair', 'Replace', 'Replenish', 'Replenish_R']
      if (this.form.rmaTypes11) {
        filterTypes = []
        const SGRrmaTypes = this.form.rmaTypes.split(',')
        if (SGRrmaTypes.includes('1')) {
          filterTypes.push('Repair')
        }
        if (SGRrmaTypes.includes('3')) {
          filterTypes.push('Replace')
        }
        if (SGRrmaTypes.includes('4')) {
          filterTypes.push('Replenish')
        }
        if (SGRrmaTypes.includes('8')) {
          filterTypes.push('Replenish_R')
        }
      }
      return list.filter((item) => {
        return filterTypes.includes(item.value)
      })
    },
    editAuth() {
      return this.checkPermi(['salesManagement:preDeliveryNotice:edit'])
    },
    addAuth() {
      return this.checkPermi(['salesManagement:preDeliveryNotice:add'])
    },
    // isUrgentAuth() {
    //   return this.checkPermi(['salesManagement:preDeliveryNotice:urgent'])
    // },
    submitBtnShow() {
      if (!this.form.preDeliveryNoticeId) {
        return this.checkPermi(['salesManagement:preDeliveryNotice:edit'])
      }
      let show = false
      if (this.form.preDeliveryNoticeId && this.buttonAuthMsg.isCanAssignTask === '1') {
        show = true
      }
      return show
    },
    saveBtnShow() {
      if (!this.form.preDeliveryNoticeId) {
        return this.checkPermi(['salesManagement:preDeliveryNotice:edit'])
      }
      let show = false
      if (this.form.preDeliveryNoticeId && this.buttonAuthMsg.isCanSaveDraft === '1') {
        show = true
      }
      return show
    },
    withdrawBtnShow() {
      if (!this.checkPermi(['salesManagement:preDeliveryNotice:withdraw'])) {
        return false
      }
      let show = false
      if (this.form.preDeliveryNoticeId && this.buttonAuthMsg.isCanWithdraw === '1') {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['salesManagement:preDeliveryNotice:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.preDeliveryNoticeId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },
    comDisFrom() {
      let dis = true
      if (this.propRowId) {
        if (!this.editAuth) {
          return true
        }
        if (this.form.preDeliveryNoticeId && [this.buttonAuthMsg.isCanAssignTask].includes('1')) {
          dis = false
        }
        return dis
      } else {
        return !this.addAuth
      }
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    queryCanSelectSalesOrderList() {
      this.documentNoLoading = true
      const param = {
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.preDeliveryNotice
      }
      this.$trimOfObj(param)
      queryCanSelectSalesOrderList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.documentType = '13'
            item.documentId = item.salesOrderId
            item.documentNo = item.salesOrderNo
            item.SOShowStr = item.salesOrderNo + '，' + item.businessPartnerName
          })
          this.salesOrderList = rows
          this.salesOrderListShow = [...rows, ...this.salesGoodsReturnList]
          this.documentNoLoading = false
        })
        .catch(() => {
          this.documentNoLoading = false
        })
      queryCanSelectSalesGoodsReturnList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.documentType = '15'
            item.documentId = item.salesGoodsReturnId
            item.documentNo = item.salesGoodsReturnNo
            item.SOShowStr = item.salesGoodsReturnNo + '，' + item.businessPartnerName
          })
          this.salesGoodsReturnList = rows
          this.salesOrderListShow = [...this.salesOrderList, ...rows]
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    visibleChangeForPQ(show) {
      if (show === false) {
        setTimeout(() => {
          this.salesOrderListShow = this.comAllOptions
        }, 100)
      }
    },
    filterMethodForPQ(str) {
      const allOptions = this.comAllOptions
      const res = []
      if ((str + '').trim() !== '') {
        allOptions.forEach((item) => {
          if (item.documentNo.toLocaleLowerCase().indexOf(str.trim().toLocaleLowerCase()) >= 0) {
            res.push(item)
          } else if (
            item.businessPartnerName.toLocaleLowerCase().indexOf(str.trim().toLocaleLowerCase()) >=
            0
          ) {
            res.push(item)
          }
        })
        this.salesOrderListShow = res
      } else {
        this.salesOrderListShow = allOptions
      }
    },

    async handleAssign() {
      // 2.0.9-15-6 提交时，不需要再加载选择付款阶段弹出
      // const { productType } = this.form.preDeliveryNoticeProductList[0] || {}
      // productType = 3（产成品）时 选择付款条款弹窗
      // if (productType === '3' || this.form.salesQuotationType === 'Trading') {
      //   this.submitForm('productType3')
      //   return
      // }
      this.submitForm()

      // if (this.form.salesQuotationType === 'Consignment' || this.form.replenishType === '2') {
      //   this.submitForm()
      // } else {
      //   const valid1 = await this.$refs.form1.validate().catch((err) => {
      //     return err
      //   })
      //   this.collapseWarningForBasicInfo = !valid1
      //   if (!valid1) {
      //     this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
      //     return
      //   }
      //   this.collapseWarningForProductInfo = false
      //   const list = this.form.preDeliveryNoticeProductList || []
      //   if (list.length <= 0 || list.find((item) => item.productType !== '2')) {
      //     this.$refs.assignShipTasksDlg.handleAdd()
      //   } else {
      //     this.submitForm()
      //   }
      // }
    },
    assignSuccess() {
      this.back()
    },
    // 更新产品列表
    updateProductList(salesOrderProductId) {
      const param = { ...this.form }
      dealDataFromUpdateWarehouse(param).then((res) => {
        const data = res.data || {}
        data.preDeliveryNoticeProductList =
          this.traverseTree(data.preDeliveryNoticeProductList) || []

        data.preDeliveryNoticeProductList.forEach((x) => {
          if (
            !(x.maxQty <= 0 || x.preUsePurchaseQtyForBasic > 0 || this.form.replenishType === '2')
          ) {
            console.log(salesOrderProductId, '===============1151============')
            if (!this.$resultOfBoolean(x.preQty) || x.salesOrderProductId === salesOrderProductId) {
              console.log(x.maxQty, '===============1153============')
              this.$set(x, 'preQty', x.maxQty)
            }
          } else {
            this.$set(x, 'preQty', undefined)
          }
        })

        this.form.preDeliveryNoticeProductList = data.preDeliveryNoticeProductList || []
        this.$set(this.form, 'shipWarehouseId', data.shipWarehouseId)
        this.$set(this.form, 'shipWarehouseName', data.shipWarehouseName)
      })
    },
    handleAdd() {
      this.reset()
      if (this.propSOId) {
        this.getPreDeliveryNoticeFromSalesOrder(this.propSOId, true, 'init')
      } else {
        setTimeout(() => {
          const initFormJson = this.getFormJson()
          formDirtyClass.routeStatusData[this.$route.name] = {
            $vm: this,
            saveShow: this.saveBtnShow,
            submitShow: true,
            initFormJson,
            getFormJson: this.getFormJson,
            isSaveSuccess: false,
            saveOrSubmitFn: this.handleSaveDraftNoConFirm
          }
        }, 300)
      }
      // getSystemSetup().then((res) => {
      //   const data = res.data || {}
      //   this.$set(this.form, 'sendEDo', data.automatedSendEdo)
      // })
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      queryPreDeliveryNoticeById({ preDeliveryNoticeId: rowId }).then((res) => {
        const data = res.data || {}
        data.preDeliveryNoticeProductList =
          this.traverseTree(data.preDeliveryNoticeProductList) || []
        const addressForWarehouse = data.warehouse || {}
        const warehouseAddress = addressForWarehouse.warehouseAddress || {}
        data.addressForWarehouse = { ...addressForWarehouse, ...warehouseAddress }

        this.form = data

        this.buttonAuthMsg = data.buttonAuthMsg || {}
        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)

        setTimeout(() => {
          const initFormJson = this.getFormJson()
          formDirtyClass.routeStatusData[this.$route.name] = {
            $vm: this,
            saveShow: this.saveBtnShow,
            submitShow: true,
            initFormJson,
            getFormJson: this.getFormJson,
            isSaveSuccess: false,
            saveOrSubmitFn: this.handleSaveDraftNoConFirm
          }
        }, 300)
      })
    },
    getPreDeliveryNoticeFromSalesOrder(salesOrderId, isQueryPO = false, type) {
      this.loading = true
      getPreDeliveryNoticeFromSalesOrder({ salesOrderId: salesOrderId })
        .then((res) => {
          this.loading = false
          const data = res.data || {}
          data.preDeliveryNoticeProductList =
            this.traverseTree(data.preDeliveryNoticeProductList) || []

          data.preDeliveryNoticeProductList.forEach((x) => {
            if (
              !(x.maxQty <= 0 || x.preUsePurchaseQtyForBasic > 0 || this.form.replenishType === '2')
            ) {
              if (!this.$resultOfBoolean(x.preQty)) {
                this.$set(x, 'preQty', x.maxQty)
              }
            } else {
              this.$set(x, 'preQty', undefined)
            }
          })

          const addressForWarehouse = data.warehouse || {}
          const warehouseAddress = addressForWarehouse.warehouseAddress || {}
          data.addressForWarehouse = { ...addressForWarehouse, ...warehouseAddress }
          data.isUrgent = this.form.isUrgent
          // data.sendEDo = this.form.sendEDo
          // data.dropShipping = '1'
          data.sendEDo = '0'
          // data.logisticsType = this.form.logisticsType
          this.form = data

          if (type === 'init') {
            setTimeout(() => {
              const initFormJson = this.getFormJson()
              formDirtyClass.routeStatusData[this.$route.name] = {
                $vm: this,
                saveShow: this.saveBtnShow,
                submitShow: true,
                initFormJson,
                getFormJson: this.getFormJson,
                isSaveSuccess: false,
                saveOrSubmitFn: this.handleSaveDraftNoConFirm
              }
            }, 300)
          }

          if (this.form.dropShipping === '1' && isQueryPO) {
            // 获取可选择的PO, 如果只有一个就默认填充
            const productIdList = this.form.preDeliveryNoticeProductList.map(
              (item) => item.productId
            )
            const params = {
              pageNum: 1,
              pageSize: 10,
              productIdList,
              menuPerms: this.menuKey.preDeliveryNotice,
              documentId: this.form.documentId,
              documentType: this.form.documentType
            }
            queryPurchaseOrderListFromPreDeliveryNotice(params).then((res) => {
              const rows = res.rows || []
              if (rows.length === 1) {
                this.updatePurchaseOrderNo(rows[0], type)
              }
            })
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    getFormJson() {
      const param = { ...this.form }
      return JSON.stringify(param)
    },
    traverseTree(nodes, parentId = '') {
      return nodes.map((node) => {
        // 使用父级ID和当前节点ID拼接生成fullId
        let fullId = parentId ? `${parentId}-${node.salesOrderProductId}` : node.salesOrderProductId
        if (!parentId && node.bomAccessoriesType === '2') {
          fullId = +new Date()
        }
        // 如果当前节点有子节点，递归调用traverseTree处理子节点
        const childProjectTemplateContentList = node.childProjectTemplateContentList
          ? this.traverseTree(node.childProjectTemplateContentList, fullId)
          : []
        // 返回新的节点对象，包含原有属性及新的fullId属性
        return {
          ...node,
          fullId,
          childProjectTemplateContentList: childProjectTemplateContentList.length
            ? childProjectTemplateContentList
            : undefined // 移除空数组的children属性
        }
      })
    },
    getPreDeliveryNoticeFromSalesGoodsReturn(type) {
      this.loading = true
      getPreDeliveryNoticeFromSalesGoodsReturn({
        salesGoodsReturnId: this.form.documentId,
        preDeliveryNoticeType: this.form.preDeliveryNoticeType,
        replenishType: this.form.replenishType
      })
        .then((res) => {
          this.loading = false
          const data = res.data || {}
          data.preDeliveryNoticeProductList = data.preDeliveryNoticeProductList || []
          /* data.preDeliveryNoticeProductList.forEach((item) => {
          this.$set(item, 'maxQty', 20)
        }) */
          const addressForWarehouse = data.warehouse || {}
          const warehouseAddress = addressForWarehouse.warehouseAddress || {}
          data.addressForWarehouse = { ...addressForWarehouse, ...warehouseAddress }
          data.isUrgent = this.form.isUrgent
          // data.sendEDo = this.form.sendEDo
          data.sendEDo = '0'
          // data.logisticsType = this.form.logisticsType
          data.preDeliveryNoticeType = this.form.preDeliveryNoticeType
          data.replenishType = this.form.replenishType
          this.form = data

          if (type === 'init') {
            setTimeout(() => {
              const initFormJson = this.getFormJson()
              formDirtyClass.routeStatusData[this.$route.name] = {
                $vm: this,
                saveShow: this.saveBtnShow,
                submitShow: true,
                initFormJson,
                getFormJson: this.getFormJson,
                isSaveSuccess: false,
                saveOrSubmitFn: this.handleSaveDraftNoConFirm
              }
            }, 300)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 取消按钮
    back(type) {
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        if (this.propSOId) {
          this.$router.push({
            path: '/salesManagement/editSalesOrder',
            query: {
              id: this.propSOId,
              timeId: Date.now()
            }
          })
        } else {
          this.$router.back()
        }
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/salesManagement/preDeliveryNotice' })
      // this.$emit('back', type)
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
    reset() {
      this.form = {
        /* 基础信息 */
        preDeliveryNoticeType: undefined,
        documentId: undefined,
        documentNo: undefined,
        documentType: undefined,
        businessPartnerName: undefined,
        preDeliveryNoticeStatus: undefined,
        businessPartnerId: undefined,
        bpContactPersonName: undefined,
        bpBusinessContactPersonList: [],
        bpBusinessAddressList: [],
        departmentId: undefined,
        departmentName: undefined,
        allSuperiorName: undefined,
        salesPersonBy: undefined,
        salesPersonId: undefined,
        currencyId: undefined,
        currency: undefined,
        paymentTermId: undefined,
        paymentTermName: undefined,
        paymentMethodIdList: [],
        paymentMethodNameList: [],
        validity: undefined,
        deliveryDate: undefined,
        ourRef: undefined,
        yourRef: undefined,
        remarks: undefined,
        logisticsType: undefined,
        sendEDo: '0',

        poType: undefined,
        poNo: undefined,
        poDate: undefined,

        bpEmail: undefined,
        mobilePhone: undefined,
        freight: undefined,
        freightTaxNo: undefined,

        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        receiveAddressForPort: {},
        addressForWarehouse: {},
        preDeliveryNoticeProductList: [],
        salesOrderProjectList: [],
        salesOrderServiceList: [],
        projectCostDetailList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForPODetail = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4', '5']

      this.basicUpdateProps = []
      this.bpHistoryVersionList = []
      this.resetForm('form1')
      this.resetForm('form2')
    },

    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form2.validateField(code)
    },
    openSalesOrderTable() {
      this.$refs.selectSalesOrderTable.handleOpen()
    },
    // 清空供应商
    salesOrderNoClear() {},
    updateSalesOrderNo(row) {
      this.$set(this.form, 'documentId', row.documentId)
      this.$set(this.form, 'documentNo', row.documentNo)
      this.$set(this.form, 'documentType', row.documentType)
      this.$set(this.form, 'salesQuotationType', row.salesQuotationType)
      this.$set(this.form, 'preDeliveryNoticeType', undefined)
      this.$set(this.form, 'preDeliveryNoticeType', undefined)
      this.$set(this.form, 'replenishType', '1')
      this.$set(this.form, 'purchaseOrderNo', undefined)
      if (this.form.salesQuotationType === 'Consignment') {
        this.$set(this.form, 'logisticsType', undefined)
      }
      this.$nextTick(() => {
        this.$refs.form1.clearValidate('preDeliveryNoticeType')
      })

      if (row.documentType === '13') {
        this.getPreDeliveryNoticeFromSalesOrder(row.documentId, true)
      } else {
        this.getPreDeliveryNoticeFromSalesGoodsReturn()
      }
    },
    preDeliveryNoticeTypeChange() {
      if (['Replenish', 'Replenish_R'].includes(this.form.preDeliveryNoticeType)) {
        if (this.form.replenishTypes) {
          const initType = this.form.replenishTypes.includes(',') ? '1' : this.form.replenishTypes
          this.$set(this.form, 'replenishType', initType)
        } else {
          this.$set(this.form, 'replenishType', '1')
        }
      } else {
        this.$set(this.form, 'replenishType', '1')
      }
      this.getPreDeliveryNoticeFromSalesGoodsReturn()
    },
    replenishTypeChange() {
      this.getPreDeliveryNoticeFromSalesGoodsReturn()
    },
    /* 采购订单选择 */
    openPurchaseOrderTable() {
      const productIdList = this.form.preDeliveryNoticeProductList.map((item) => item.productId)
      this.$refs.selectPurchaseOrderTable.handleOpen(productIdList)
    },
    updatePurchaseOrderNo(row, type) {
      this.$set(this.form, 'purchaseOrderId', row.purchaseOrderId)
      this.$set(this.form, 'purchaseOrderNo', row.purchaseOrderNo)
      if (type === 'init') {
        // 更新初始表单部分字段
        formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
          purchaseOrderId: row.purchaseOrderId,
          purchaseOrderNo: row.purchaseOrderNo
        })
      }

      if (this.form.documentType === '13') {
        this.setPurchaseQtyForPre(type)
      } else {
        this.setPurchaseQtyForSGR(type)
      }
    },
    purchaseOrderNoClear() {
      this.$set(this.form, 'purchaseOrderId', undefined)
      this.$set(this.form, 'purchaseOrderNo', undefined)
      if (this.form.documentType === '13') {
        this.setPurchaseQtyForPre()
      } else {
        this.setPurchaseQtyForSGR()
      }
    },
    setPurchaseQtyForPre(type) {
      const timer = Date.now()
      this.queryTime = timer
      const purchaseOrderId = this.form.purchaseOrderId
      const preDeliveryNoticeId = this.form.preDeliveryNoticeId

      if (this.form.purchaseOrderId || preDeliveryNoticeId) {
        getPreDeliveryNoticeFromSalesOrder({ salesOrderId: this.form.documentId }).then((res1) => {
          // const data = res.data || {}
          let preDeliveryNoticeProductList = res1.data.preDeliveryNoticeProductList || []
          if (preDeliveryNoticeId) {
            preDeliveryNoticeProductList = this.form.preDeliveryNoticeProductList || []
          }
          setPurchaseQtyForPre({
            purchaseOrderId,
            preDeliveryNoticeProductList: preDeliveryNoticeProductList,
            preDeliveryNoticeId
          }).then((res) => {
            if (timer !== this.queryTime) return
            const data = res.data || {}
            const list = data.preDeliveryNoticeProductList || []
            // list.forEach((item) => {
            //   if (item.preQty) {
            //     if (item.preQty > item.maxQty) {
            //       item.preQty = undefined
            //     }
            //   }
            // })
            const isSelect = (data) => {
              data.forEach((item) => {
                if (this.form.salesQuotationType === 'Project') {
                  item.preQty = undefined
                  if (
                    item.childProjectTemplateContentList &&
                    item.childProjectTemplateContentList.length > 0
                  ) {
                    isSelect(item.childProjectTemplateContentList || [])
                  }
                } else if (item.preQty) {
                  if (item.preQty > item.maxQty) {
                    item.preQty = undefined
                  }
                }
              })
            }
            isSelect(list)
            const newList = this.traverseTree(list)

            newList.forEach((x) => {
              if (
                !(
                  x.maxQty <= 0 ||
                  x.preUsePurchaseQtyForBasic > 0 ||
                  this.form.replenishType === '2'
                )
              ) {
                if (!this.$resultOfBoolean(x.preQty)) {
                  this.$set(x, 'preQty', x.maxQty)
                }
              } else {
                this.$set(x, 'preQty', undefined)
              }
            })

            this.form.preDeliveryNoticeProductList = newList

            if (type === 'init') {
              // 更新初始表单部分字段
              formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
                preDeliveryNoticeProductList: newList
              })
            }
          })
        })
      } else {
        this.getPreDeliveryNoticeFromSalesOrder(this.form.documentId)

        /* this.form.preDeliveryNoticeProductList.forEach((item) => {
          if (item.preUsePurchaseQtyForBasic > 0) {
            this.$set(item, 'maxQty', item.maxQty + item.preUsePurchaseQtyForBasic)
          }
          this.$set(item, 'purchaseQtyForPreForBasic', undefined)
          this.$set(item, 'preUsePurchaseQtyForBasic', undefined)
        }) */
      }
    },
    setPurchaseQtyForSGR(type) {
      const timer = Date.now()
      this.queryTime = timer
      const purchaseOrderId = this.form.purchaseOrderId
      const preDeliveryNoticeId = this.form.preDeliveryNoticeId
      // const preDeliveryNoticeProductList = this.form.preDeliveryNoticeProductList
      if (this.form.purchaseOrderId || preDeliveryNoticeId) {
        getPreDeliveryNoticeFromSalesGoodsReturn({
          salesGoodsReturnId: this.form.documentId,
          preDeliveryNoticeType: this.form.preDeliveryNoticeType,
          replenishType: this.form.replenishType
        }).then((res1) => {
          // const data = res.data || {}
          let preDeliveryNoticeProductList = res1.data.preDeliveryNoticeProductList || []
          if (preDeliveryNoticeId) {
            preDeliveryNoticeProductList = this.form.preDeliveryNoticeProductList || []
          }
          setPurchaseQtyForPre({
            purchaseOrderId,
            preDeliveryNoticeProductList: preDeliveryNoticeProductList,
            preDeliveryNoticeId
          }).then((res) => {
            if (timer !== this.queryTime) return
            const data = res.data || {}
            const list = data.preDeliveryNoticeProductList || []
            this.form.preDeliveryNoticeProductList = list
            if (type === 'init') {
              // 更新初始表单部分字段
              formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
                preDeliveryNoticeProductList: list
              })
            }
          })
        })
      } else {
        this.getPreDeliveryNoticeFromSalesGoodsReturn(type)

        /* this.form.preDeliveryNoticeProductList.forEach((item) => {
          if (item.preUsePurchaseQtyForBasic > 0) {
            this.$set(item, 'maxQty', item.maxQty + item.preUsePurchaseQtyForBasic)
          }
          this.$set(item, 'purchaseQtyForPreForBasic', undefined)
          this.$set(item, 'preUsePurchaseQtyForBasic', undefined)
        }) */
      }
    },
    logisticsTypeChange() {
      if (this.form.logisticsType === '3') {
        this.$set(this.form, 'sendEDo', '0')
      }
      this.driverNameClear()
      this.vehicleClear()
    },
    openDriverTable() {
      this.$refs.selectDriverDlg.handleOpen()
    },
    updateDriver(row) {
      const { driverId, driverName } = row
      this.$set(this.form, 'driverId', driverId)
      this.$set(this.form, 'driverName', driverName)
    },
    driverNameClear() {
      this.$set(this.form, 'driverId', undefined)
      this.$set(this.form, 'driverName', undefined)
    },
    openVehicleTable() {
      this.$refs.selectVehicleDlg.handleOpen()
    },
    updateVehicle(row) {
      const { vehicleId, licensePlateNo } = row
      this.$set(this.form, 'vehicleId', vehicleId)
      this.$set(this.form, 'licensePlateNo', licensePlateNo)
    },
    vehicleClear() {
      this.$set(this.form, 'vehicleId', undefined)
      this.$set(this.form, 'licensePlateNo', undefined)
    },
    /* 第二部分表单 */
    openReceiveAddressTable() {
      if (this.form.incotermAddressType === '1') {
        this.$refs.selectPortTable.handleOpen()
      }
      if (this.form.incotermAddressType === '2') {
        this.$refs.payToAddressDlg.handleOpen()
      }
    },
    receiveAddressClear() {
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'receiveAddressForPort', undefined)
      this.$set(this.form, 'addressForBPAddress', undefined)
      this.$set(this.form, 'receiveAddress', undefined)
      this.$set(this.form, 'district', undefined)
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
    async submitForm(submitType, isConfirm = true, gotoRoute) {
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
        if (submitType !== 'save') {
          if (param.preDeliveryNoticeProductList.length <= 0) {
            this.$modal.msgError(this.$t('SALES.productTableEmpty'))
            this.collapseWarningForProductInfo = true
            return
          }
          const list = param.preDeliveryNoticeProductList.filter(
            (x) => !(x.isPhantom === '1' && x.nonInventoryItem === '1')
          )
          /* 直运的SO, 发货通知单不能选择仓库 */
          const warehouseNameReq = list.find((item) => {
            return (
              !this.$resultOfBoolean(item.warehouseName) &&
              !item.preUsePurchaseQtyForBasic &&
              !this.comIsDropShippingSO &&
              (!item.isTemp || item.isTemp !== '1')
            )
          })
          if (warehouseNameReq) {
            this.$refs.ProductInfo.errorMessage('warehouseName')

            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warehouse'))
            )
            return
          }
          if (param.isDeliverySchedule !== '1') {
            const maxQtyErr = list.find((item) => {
              return (item.preQty || 0) > (item.maxQty || 0) && item.isCanUpdateDropQty !== '1'
            })
            if (maxQtyErr) {
              this.$modal.msgError(this.$t('SALES.preMaxQtyErr'))
              return
            }
          }

          /* isCanUpdateDropQty === '1' 时，直运数量必须 */
          const preUsePurchaseQtyForBasicReq = param.preDeliveryNoticeProductList.find((item) => {
            return (
              !this.$resultOfBoolean(item.preUsePurchaseQtyForBasic) &&
              item.isCanUpdateDropQty === '1'
            )
          })
          if (preUsePurchaseQtyForBasicReq) {
            this.$refs.ProductInfo.errorMessage('preUsePurchaseQtyForBasic')
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.DropShipQty'))
            )
            return
          }

          let flag = false
          function containsEmptyValue(tree) {
            for (let i = 0; i < tree.length; i++) {
              const node = tree[i]
              if (flag) return
              if (tree[i].preQty || tree[i].preUsePurchaseQtyForBasic) {
                flag = true
                return
              }
              if (
                node.childProjectTemplateContentList &&
                node.childProjectTemplateContentList.length > 0
              ) {
                containsEmptyValue(node.childProjectTemplateContentList)
              }
            }
          }
          containsEmptyValue(param.preDeliveryNoticeProductList)
          if (!flag) {
            this.$refs.ProductInfo.errorMessage('preQty')
            this.$modal.msgError(this.$t('SALES.productTableEmpty1'))
            return
          }

          this.collapseWarningForProductInfo = false
        }

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        if (submitType === 'productType3') {
          this.$refs.selectPaymentTermDlg.handleAdd(param)
          return
        }
        let confirmMsg = this.$t('SALES.preDeliveryNoticeSubmitConfirm')
        let successMsg = this.$t('SALES.preDeliveryNoticeSubmitSuccess')
        let submitFn = submitAssignTask

        if (this.form.salesQuotationType === 'Consignment') {
          confirmMsg = this.$t('SALES.preDeliveryNoticeSubmitConfirm')
          successMsg = this.$t('SALES.preDeliveryNoticeSubmitSuccess')
          submitFn = submitAssignTask
        }
        if (this.form.replenishType === '2') {
          confirmMsg = this.$t('SALES.preDeliveryNoticeSubmitConfirm')
          successMsg = this.$t('SALES.preDeliveryNoticeSubmitSuccess')
          submitFn = submitAssignTask
        }
        if (submitType === 'save') {
          confirmMsg = this.$t('SALES.preDeliveryNoticeSaveConfirm')
          successMsg = this.$t('SALES.preDeliveryNoticeSaveSuccess')
          submitFn = saveDraftPreDeliveryNotice
        }

        if (isConfirm) {
          this.$modal
            .confirm(confirmMsg)
            .then(() => {
              this.submitLoading = true
              return submitFn(param)
            })
            .then((response) => {
              if (response.msg) {
                this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
              } else {
                this.$modal.msgSuccess(this.$t('SALES.preDeliveryNoticeSubmitSuccess1'))
              }
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

              if (response.msg) {
                this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
              } else {
                this.$modal.msgSuccess(this.$t('SALES.preDeliveryNoticeSubmitSuccess1'))
              }

              setTimeout(() => {
                this.submitLoading = false
              }, 1000)
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
      this.submitForm('save', false, gotoRoute)
    },
    handleWithdraw() {
      const vm = this
      const confirm = vm
        .$t('SALES.preDeliveryNoWithdrawConfirm')
        .replace('$1', this.form.preDeliveryNoticeNo)
      this.$modal.confirm(confirm).then(() => {
        withdrawPreDeliveryNotice({
          preDeliveryNoticeId: vm.form.preDeliveryNoticeId
        }).then((res) => {
          if (res.code === 200) {
            vm.$message.success(
              vm
                .$t('SALES.preDeliveryNoWithdrawSuccess')
                .replace('$1', this.form.preDeliveryNoticeNo)
            )
            this.back()
          }
        })
      })
    },
    handleCancel() {
      // this.$refs.FormCancelDialog.handleOpen()
      const vm = this
      const confirm = vm
        .$t('SALES.preDeliveryNoCancelConfirm')
        .replace('$1', this.form.preDeliveryNoticeNo)
      this.$modal.confirm(confirm).then(() => {
        cancelledPreDeliveryNotice({
          businessId: vm.form.preDeliveryNoticeId
        }).then((res) => {
          if (res.code === 200) {
            vm.$message.success(
              vm.$t('SALES.preDeliveryNoCancelSuccess').replace('$1', this.form.preDeliveryNoticeNo)
            )
            this.back()
          }
        })
      })
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
