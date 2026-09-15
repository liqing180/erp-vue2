<template>
  <FormPageLayout ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
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
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.p_consignment_order_status,
                            form.consignmentOrderStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.consignmentOrderNo')}`">
                      <el-input v-model="form.consignmentOrderNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`" prop="currencyId">
                      <CommonSelect
                        :disabled="!form.businessPartnerId"
                        :id="form.currencyCode"
                        :label="form.currency"
                        :title="form.currency"
                        idKey="currencyCode"
                        labelKey="currency"
                        :filterable="true"
                        :options="currencyOptions || []"
                        :loading="currencyOptionsLoading"
                        @change="currencyChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.purchaseDepartment')}`"
                      prop="departmentId"
                    >
                      <CommonSelect
                        :id="form.departmentId"
                        :label="form.departmentName"
                        :title="form.allSuperiorName"
                        idKey="departmentId"
                        labelKey="departmentName"
                        :options="deptOptions"
                        :loading="deptOptionsLoading"
                        @change="departmentChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.ourRef')}`">
                      <el-input
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.taxRate')}`" prop="taxRate">
                      <el-input-number
                        v-thousandSplit="{ precision: 1 }"
                        v-model="form.taxRate"
                        :disabled="!form.businessPartnerId"
                        :precision="1"
                        type="number"
                        class="form-wd"
                        :min="0"
                        :max="100"
                        placeholder=""
                        style="width: 100%"
                        controls-position="right"
                        @change="inputNumberChange('taxRate')"
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
                          :disabled="!form.businessPartnerId"
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
                          :disabled="!form.businessPartnerId"
                        />
                      </ToolTipPaymentTerm>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.consignmentStart')}`"
                      prop="consignmentStartTime"
                    >
                      <el-date-picker
                        v-model="form.consignmentStartTime"
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
                      :label="`${$t('PURCHASE.consignmentEnd')}`"
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
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.committedDate')}`" prop="committedDate">
                      <el-date-picker
                        v-model="form.committedDate"
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
                <el-row v-if="false">
                  <el-col :span="24">
                    <el-form-item :label="$t('PURCHASE.paymentTerm')" prop="paymentTermName">
                      <MyInput
                        type="textarea"
                        v-model="form.paymentTermName"
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
                        :autosize="{ minRows: 1, maxRows: 4 }"
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
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.shippingInfo')"
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
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.incoterm')}`" prop="incotermId">
                      <CommonSelect
                        :id="form.incotermId"
                        :label="form.incotermName"
                        :title="form.incotermName"
                        idKey="incotermId"
                        labelKey="incotermName"
                        :options="incotermOptions"
                        :loading="incotermOptionsLoading"
                        @change="incotermIdChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.shipToAddress1')}`"
                      prop="shipToAddressName"
                      :rules="[
                        {
                          required: form.incotermAddressType === '1',
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
                        :showStr="form.shipToAddressName"
                        :rows="shipToAddressRows"
                      >
                        <CommonSelectAndList
                          :id="form.shipToAddressId"
                          :label="form.shipToAddressName"
                          idKey="portId"
                          labelKey="portName"
                          filterable
                          :options="portOptions"
                          :disabled="
                            !form.incotermId ||
                            form.incotermAddressType !== '1' ||
                            !form.businessPartnerId
                          "
                          @change="updatePort"
                          ref="portRef"
                          @handleOpen="openReceiveAddressTable"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.warehouse')}`" prop="receiveAddressName">
                      <ToolTipShowObj
                        :mData="form.addressForWarehouse || {}"
                        :showStr="form.receiveAddressName"
                        :rows="warehouseRows"
                      >
                        <CommonSelectAndList
                          :id="form.receiveAddressId"
                          :label="form.receiveAddressName"
                          idKey="warehouseId"
                          labelKey="warehouseName"
                          filterable
                          :options="warehouseOptions"
                          :loading="warehouseOptionsLoading"
                          :disabled="!form.businessPartnerId"
                          @change="updateWarehouse"
                          @handleOpen="openWarehouseTable"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.requestedBy')}`" prop="requestedBy">
                      <SelectInput
                        :clearable="true"
                        :value="form.requestedBy"
                        :title="form.requestedBy"
                        @click="addRequestedBy"
                        :disabled="!form.receiveAddressName"
                        @clear="requestedByClear"
                      />
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

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')">
                      <MyInput
                        type="textarea"
                        v-model="form.shipRemarks"
                        :autosize="{ minRows: 1, maxRows: 4 }"
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
                  :warehouseId="form.warehouseId"
                  :businessPartnerId="form.businessPartnerId"
                  :currencyId="form.currencyId"
                  @updateTable="updateProductTable"
                  :linkPR="false"
                  @scrollPageToTable="scrollPageToTable"
                />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.deliveryInfo')"
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
                      <ToolTipShowObj
                        :mData="form.bpBusinessAddress || {}"
                        :showStr="form.bpAddress"
                        :rows="bpAddressRows"
                      >
                        <CommonSelect
                          :disabled="!form.businessPartnerId"
                          :id="form.bpBusinessAddressId"
                          :label="form.bpAddress"
                          idKey="businessAddressId"
                          labelKey="label"
                          :options="form.bpBusinessAddressList || []"
                          @change="deliveryAddressChange"
                        />
                      </ToolTipShowObj>
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
    <selectPurchasePersonTable
      ref="selectPurchasePersonTable"
      :departmentId="form.departmentId"
      @update="updatePurchasePerson"
    />
    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <selectWarehouseTable
      ref="selectWarehouseTable"
      :businessPartnerId="form.businessPartnerId"
      @update="updateWarehouse"
    />
    <editRequestedByDlg ref="editRequestedByDlg" @update="requestedByChange" />

    <selectPaymentTermDlg
      ref="selectPaymentTermDlg"
      :paymentTermPurposeList="['2']"
      :businessPartnerId="form.businessPartnerId"
      @onSuccess="paymentTermChange"
      :menuPerms="menuKey.consignmentOrder"
    />
  </FormPageLayout>
</template>

<script>
import { queryUserDepartment } from '@/api/system/user'
import { queryIncotermList, queryCanSelectPortList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryUsers } from '@/api/organization/corporate'

import {
  saveConsignmentOrder,
  saveDraftConsignmentOrder,
  preview,
  queryBusinessCanSelectVendorList,
  queryCanSelectConsignmentWarehouseList
} from '@/api/purchaseManagement/consignmentOrder'
import { queryPaymentTermListByPaymentTermPurpose } from '@/api/system/paymentTerm'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import selectSupplierTable from './components/selectSupplierTable.vue'
import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'

import selectPortTable from './components/selectPortTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import editRequestedByDlg from './components/editRequestedByDlg.vue'
import selectPaymentTermDlg from '@/views/system/paymentTerm/selectPaymentTermDlg.vue'

import ProductTable from './productTable.vue'
import { getToken } from '@/utils/auth'
import { formDirtyClass } from '@/mixins/formDirtyClass'

export default {
  mixins: [pageMixin],
  dicts: ['p_consignment_order_status', 'business_partner_payment_method'],
  components: {
    selectSupplierTable,
    selectPurchasePersonTable,
    selectPortTable,
    selectWarehouseTable,
    editRequestedByDlg,
    ProductTable,
    selectPaymentTermDlg
  },
  data() {
    return {
      activeNames: [],
      timeId: '',
      submitLoading: false,
      form: {},

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForDeliveryInfo: false,
      rules: {
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
            trigger: ['blur', 'change']
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
        validity: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        committedDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
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
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      consignmentEndTimePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      businessPartnerOptions: [],
      businessPartnerOptionsLoading: false,
      deptOptions: [],
      deptOptionsLoading: false,
      purchasePersonByOptions: [],
      purchasePersonByOptionsLoading: false,
      currencyOptions: [],
      currencyOptionsLoading: false,
      paymentTermOptions: [],
      paymentMethodOptions: [],
      incotermOptions: [],
      incotermOptionsLoading: false,
      portOptions: [],
      warehouseOptions: [],
      warehouseOptionsLoading: false,
      /* 表格部分 */
      initPoDetailList: [],
      initCommonFileList: [],
      consignmentOrderDetailList: [],
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
      paymentTermList: [],
      paymentTermOptionsLoading: false
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
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.handleAdd()
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    // 付款条款
    queryPaymentTermListByPaymentTermPurpose(type) {
      this.paymentTermChange({})
      this.paymentTermList = []
      if (!this.form.businessPartnerId) {
        return
      }
      this.paymentTermOptionsLoading = true
      queryPaymentTermListByPaymentTermPurpose({
        paymentTermPurpose: '2',
        menuPerms: this.menuKey.consignmentOrder,
        businessPartnerId: this.form.businessPartnerId
      })
        .then((res) => {
          this.paymentTermOptionsLoading = false
          this.paymentTermList = res.data || []
          const list = this.paymentTermList.filter((x) => x.isDefault === '1') || []
          if (!this.form.paymentTermId && list.length > 0) {
            this.paymentTermChange(list[0], type)
          }
        })
        .catch(() => {
          this.paymentTermOptionsLoading = false
        })
    },
    openPaymentTermDlg() {
      this.$refs.selectPaymentTermDlg.handleAdd()
    },
    paymentTermChange(item, type) {
      this.$set(this.form, 'paymentTerm', item)
      this.$set(this.form, 'paymentTermId', item.paymentTermId)
      this.$set(this.form, 'paymentTermName', item.paymentTermName)

      if (type && type === 'init') {
        // 更新初始表单部分字段
        formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
          paymentTerm: item,
          paymentTermId: item.paymentTermId,
          paymentTermName: item.paymentTermName
        })
      }
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
    handleAdd() {
      this.reset()
      this.queryUserDepartment()
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
      this.queryCanSelectPortList()
      this.queryPaymentTermListByPaymentTermPurpose('init')
      this.queryBusinessPartnerOptions()

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
    getFormJson() {
      const param = { ...this.form }
      param.commonFileList = this.$refs.ProductTable && this.$refs.ProductTable.getFileIds()

      delete param.subTotal
      delete param.totalTaxAmount
      delete param.totalAmount
      return JSON.stringify(param)
    },
    reset() {
      this.form = {
        /* 基础信息 */
        consignmentOrderNo: undefined,
        businessPartnerName: undefined,
        consignmentOrderStatus: undefined,
        businessPartnerId: undefined,
        bpContactPersonName: undefined,
        bpBusinessContactPersonList: [],
        bpBusinessAddressList: [],
        departmentId: undefined,
        departmentName: undefined,
        allSuperiorName: undefined,
        purchasePersonBy: this.$store.state.user.nickName,
        purchasePersonId: this.$store.state.user.userId,
        currencyId: undefined,
        currency: undefined,
        paymentTermId: undefined,
        paymentTermName: undefined,
        paymentMethodIdList: [],
        paymentMethodNameList: [],
        validity: undefined,
        committedDate: undefined,
        ourRef: undefined,
        yourRef: undefined,
        basicRemarks: undefined,
        automatedEmail: '1',

        bpEmail: undefined,
        mobilePhone: undefined,

        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        shipToAddressId: undefined,
        shipToAddressName: undefined,
        addressForPort: {},
        addressForWarehouse: {},
        consignmentStartTime: undefined,
        consignmentEndTime: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForDeliveryInfo = false
      this.collapseWarningForProductInfo = false
      this.initPoDetailList = []
      this.initCommonFileList = []
      this.consignmentOrderDetailList = []
      this.activeNames = ['1', '2', '3', '4']
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form1')
      this.resetForm('form2')
      this.resetForm('form4')
    },
    // 取消按钮
    back() {
      this.$emit('back')
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
    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form1.validateField(code)
    },

    queryBusinessPartnerOptions() {
      this.businessPartnerOptionsLoading = true
      queryBusinessCanSelectVendorList({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.consignmentOrder
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
      this.$set(this.form, 'abbreviation', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.$set(this.form, 'taxRate', undefined)
      this.currencyClear()
      this.paymentMethodChange([], [])
      this.warehouseClear()
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
      this.$set(this.form, 'abbreviation', row.abbreviation)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      const registeredAddress =
        (row.bpBusinessAddressList || []).find((x) => (x.label || '').includes('Registered')) || {}
      this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
      this.$set(this.form, 'registeredAddressCity', registeredAddress.city)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      this.$set(this.form, 'bpBusinessAddressList', row.bpBusinessAddressList)
      const account = row.bpBusinessAccountSupplier || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.$set(this.form, 'currencySymbol', account.currencySymbol)
      this.$nextTick(() => {
        if (this.$resultOfBoolean(this.form.taxRate)) {
          this.$refs.form1.validateField('taxRate')
        }
      })
      this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])
      this.warehouseClear()
      this.deliveryByClear()
      this.deliveryAddressClear()
      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.deliveryByChange(defaultContact)
        }
      }
      if (row.bpBusinessAddressList && row.bpBusinessAddressList.length === 1) {
        this.deliveryAddressChange(row.bpBusinessAddressList[0])
      }
      this.initPoDetailList = []
      this.queryPaymentTermListByPaymentTermPurpose()
      this.queryWarehouseOptions()
    },
    queryUserDepartment() {
      this.deptOptionsLoading = true
      queryUserDepartment({ menuPerms: this.menuKey.consignmentOrder })
        .then((res) => {
          this.deptOptionsLoading = false
          this.deptOptions = res.data || []
          this.deptOptions.forEach((item) => {
            if (item.isDefault === '1') {
              this.$set(this.form, 'departmentId', item.departmentId)
              this.$set(this.form, 'departmentName', item.departmentName)
              this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
              this.queryPurchasePersonByOptions()

              // 更新初始表单部分字段
              formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
                departmentId: item.departmentId,
                departmentName: item.departmentName,
                allSuperiorName: item.allSuperiorName
              })
            }
          })
        })
        .catch(() => {
          this.deptOptionsLoading = false
        })
    },
    departmentChange(item) {
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
      if (this.form.purchasePersonId !== this.$store.state.user.userId) {
        this.purchasePersonClear()
      }
      this.queryPurchasePersonByOptions()
    },

    queryPurchasePersonByOptions() {
      this.purchasePersonByOptions = []
      if (!this.form.departmentId) return
      const timer = Date.now()
      this.queryUserTimer = timer
      this.purchasePersonByOptionsLoading = true
      queryUsers({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.PO,
        departmentId: this.form.departmentId
      })
        .then((res) => {
          if (this.queryUserTimer !== timer) return
          this.purchasePersonByOptionsLoading = false
          this.purchasePersonByOptions = res.rows || []
        })
        .catch(() => {
          if (this.queryUserTimer !== timer) return
          this.purchasePersonByOptionsLoading = false
        })
    },
    openPurchasePersonTable() {
      this.$refs.selectPurchasePersonTable.handleOpen()
    },
    purchasePersonClear() {
      this.$set(this.form, 'purchasePersonBy', undefined)
      this.$set(this.form, 'purchasePersonId', undefined)
    },
    updatePurchasePerson(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'purchasePersonBy', nickName)
      this.$set(this.form, 'purchasePersonId', userId)
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
      this.initPoDetailList = []
    },
    currencyClear() {
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      this.$set(this.form, 'currencyCode', undefined)
      this.$set(this.form, 'currencySymbol', undefined)

      this.initPoDetailList = []
    },
    paymentMethodChange(ids, labels) {
      this.$set(this.form, 'paymentMethodIdList', ids)
      this.$set(this.form, 'paymentMethodNameList', labels)
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
      // if (oldType !== item.incotermAddressType) {

      // }
      this.$set(this.form, 'shipToAddressId', undefined)
      this.$set(this.form, 'shipToAddressName', undefined)
      this.$set(this.form, 'addressForPort', undefined)
      this.$nextTick(() => {
        this.$refs.form2.clearValidate('shipToAddressName')
      })
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
    openReceiveAddressTable() {
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
    receiveAddressClear() {
      this.$set(this.form, 'shipToAddressName', undefined)
      this.$set(this.form, 'shipToAddressId', undefined)
      this.$set(this.form, 'addressForPort', undefined)
    },
    updatePort(row) {
      const { portName, portId, countryId, country } = row
      this.$set(this.form, 'addressForPort', row)
      this.$set(this.form, 'shipToAddressName', portName)
      this.$set(this.form, 'shipToAddressId', portId)

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
          this.form.receiveAddressCountryId &&
          this.form.receiveAddressCountryId !== countryId &&
          this.form.country !== country
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

    queryWarehouseOptions() {
      this.warehouseOptions = []
      const timer = Date.now()
      this.queryWHTimer = timer
      if (!this.form.businessPartnerId) {
        this.warehouseOptionsLoading = false
        return
      }
      this.warehouseOptionsLoading = true
      queryCanSelectConsignmentWarehouseList({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.consignmentOrder,
        consignorId: this.form.businessPartnerId
      })
        .then((res) => {
          if (this.queryWHTimer !== timer) return
          this.warehouseOptionsLoading = false
          this.warehouseOptions = res.rows || []
        })
        .catch(() => {
          if (this.queryWHTimer !== timer) return
          this.warehouseOptionsLoading = false
        })
    },
    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId } = row
      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'receiveAddressName', warehouseName)
      this.$set(this.form, 'receiveAddressId', warehouseId)
      this.$set(this.form, 'warehouseId', warehouseId)
      this.$set(this.form, 'warehouseName', warehouseName)

      this.$set(this.form, 'requestedBy', row.userName)
      this.$set(this.form, 'requestedEmail', row.email)
      this.$set(this.form, 'requestedMobileCode', row.mobileCode)
      this.$set(this.form, 'requestedMobileNum', row.mobileNum)
      this.$set(this.form, 'requestedMobilePhone', row.mobilePhone)
    },
    warehouseClear() {
      this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'warehouseId', undefined)
      this.$set(this.form, 'warehouseName', undefined)
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
    requestedByClear() {
      this.$set(this.form, 'requestedBy', undefined)
      this.$set(this.form, 'requestedEmail', undefined)
      this.$set(this.form, 'requestedMobileCode', undefined)
      this.$set(this.form, 'requestedMobileNum', undefined)
      this.$set(this.form, 'requestedMobilePhone', undefined)
    },

    /* 第三部分 表格部分Start */
    updateProductTable(list) {
      this.consignmentOrderDetailList = list || []
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
    deliveryAddressChange(row) {
      this.$set(this.form, 'bpBusinessAddress', row)
      this.$set(this.form, 'bpBusinessAddressId', row.businessAddressId)
      this.$set(this.form, 'bpAddressDataId', row.bpAddressDataId)
      this.$set(this.form, 'bpAddress', row.label)
    },
    deliveryAddressClear() {
      this.$set(this.form, 'bpBusinessAddress', undefined)
      this.$set(this.form, 'bpBusinessAddressId', undefined)
      this.$set(this.form, 'bpAddressDataId', undefined)
      this.$set(this.form, 'bpAddress', undefined)
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
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.shippingInfo'))
        )
        return
      }
      if (valid1 && valid2) {
        let param = { ...this.form }
        const detailList = this.$refs.ProductTable.getList()
        const validProduct = this.validProductList(detailList)
        if (!validProduct) {
          this.collapseWarningForProductInfo = true
          return
        }
        this.collapseWarningForProductInfo = false
        param.consignmentOrderDetailList = detailList
        param.commonFileList = myFileIds
        const valid4 = await this.$refs.form4.validate().catch((err) => {
          return err
        })
        this.collapseWarningForDeliveryInfo = !valid4

        if (!valid4) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.deliveryInfo'))
          )
          return
        }

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('PURCHASE.conOrderSaveConfirm')
          successMsg = this.$t('PURCHASE.conOrderSaveSuccess')
          submitFn = saveDraftConsignmentOrder
        } else {
          confirmMsg = this.$t('PURCHASE.conOrderSubmitConfirm')
          successMsg = this.$t('PURCHASE.conOrderSubmitSuccess')
          submitFn = saveConsignmentOrder
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
    validProductList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.uom)
      })
      if (uomReq) {
        this.$refs.ProductTable.errorMessage('uom')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.uom')))
        return valid
      }

      const uomCoefficientReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.uomCoefficient)
      })
      if (uomCoefficientReq) {
        this.$refs.ProductTable.errorMessage('uomCoefficient')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.ratio')))
        return valid
      }

      const consignedQtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.consignedQty)
      })
      if (consignedQtyReq) {
        this.$refs.ProductTable.errorMessage('consignedQty')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.consignedQty'))
        )
        return valid
      }

      const consignedCostReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.consignedCost)
      })
      if (consignedCostReq) {
        this.$refs.ProductTable.errorMessage('consignedCost')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.consignedCost'))
        )
        return valid
      }

      const consignedAmountReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.consignedAmount)
      })
      if (consignedAmountReq) {
        this.$refs.ProductTable.errorMessage('consignedAmount')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.consignedAmount'))
        )
        return valid
      }

      /* const leadTimeReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.leadTime)
      })
      if (leadTimeReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.leadTimeDays'))
        )
        return valid
      }

      const committedDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.committedDate)
      })
      if (committedDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.committedDate'))
        )
        return valid
      } */

      return true
    },
    handleSaveDraft(isConfirm = true, gotoRoute) {
      this.$refs.form1.clearValidate()
      this.$refs.form2.clearValidate()
      this.$refs.form4.clearValidate()
      const myFileIds = this.$refs.ProductTable.getFileIds()
      if (myFileIds === false) {
        return
      }
      this.$refs.form1.validateField(['businessPartnerName'])
      if (!this.form.businessPartnerName) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.supplier')))
        this.collapseWarningForBasicInfo = true
        return
      }
      this.collapseWarningForBasicInfo = false

      let param = { ...this.form }
      const detailList = this.$refs.ProductTable.getList()
      param.consignmentOrderDetailList = detailList
      param.commonFileList = myFileIds
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

      const confirmMsg = this.$t('PURCHASE.conOrderSaveConfirm')
      const successMsg = this.$t('PURCHASE.conOrderSaveSuccess')
      if (isConfirm) {
        this.$modal
          .confirm(confirmMsg)
          .then(() => {
            this.submitLoading = true
            return saveDraftConsignmentOrder(param)
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
        saveDraftConsignmentOrder(param)
          .then((response) => {
            const pageItem = formDirtyClass.routeStatusData[this.$route.name]
            if (pageItem) {
              pageItem.isSaveSuccess = true
            }
            this.$modal.msgSuccess(successMsg.replace('$1', response.msg))

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
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      this.handleSaveDraft(false, gotoRoute)
    },
    handlePreviewPDF() {
      const token = getToken()
      const params = { ...this.form }
      const detailList = this.$refs.ProductTable.getList()
      params.consignmentOrderDetailList = detailList
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
