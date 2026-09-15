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
                <div v-if="form.purchaseReturnType === '1'" key="purchaseReturnType11">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.DocNo')}`" prop="purchaseOrderNo">
                        <CommonSelectAndList
                          :id="form.purchaseOrderId"
                          :label="form.purchaseOrderNo"
                          :title="form.purchaseOrderNo"
                          idKey="purchaseOrderId"
                          labelKey="purchaseOrderNo"
                          filterable
                          :filter-method="filterMethodForPO"
                          @visible-change="visibleChange"
                          :clearable="false"
                          :options="purchaseOrderOptionsShow"
                          :optionsAll="purchaseOrderOptions"
                          :loading="purchaseOrderOptionsLoading"
                          @change="updatePurchaseOrderNo"
                          @handleOpen="openPurchaseOrderTable"
                        >
                          <template slot-scope="{ item }">{{ item.showPOStr }}</template>
                        </CommonSelectAndList>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('ui.status')}`">
                        <el-input
                          :value="
                            selectDictLabel(
                              dict.type.purchase_return_status,
                              form.purchaseReturnStatus
                            )
                          "
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.purchaseReturnOrderNo')}`">
                        <el-input v-model="form.purchaseReturnNo" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.logisticsCostNo')}`">
                        <CommonSelect
                          :id="form.logisticsDocumentId"
                          :label="form.logisticsDocumentNo"
                          :title="form.logisticsDocumentNo"
                          idKey="logisticsDocumentId"
                          labelKey="logisticsDocumentNo"
                          :disabled="!form.purchaseOrderNo"
                          :options="logisticsOptions"
                          :loading="logisticsOptionsLoading"
                          @change="logisticsChange"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.supplierName')}`">
                        <el-input
                          v-model="form.businessPartnerName"
                          :title="form.businessPartnerName"
                          disabled
                        ></el-input>
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
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('PURCHASE.warehouseName')}`"
                        prop="warehouseName"
                        key="warehouseName11"
                      >
                        <CommonSelectAndList
                          :id="form.warehouseId"
                          :label="form.warehouseName"
                          :title="form.warehouseName"
                          idKey="warehouseId"
                          labelKey="warehouseName"
                          filterable
                          :options="warehouseOptions"
                          :loading="warehouseOptionsLoading"
                          :disabled="!form.purchaseOrderNo"
                          @change="updateWarehouse"
                          @handleOpen="openWarehouseTable"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.purchaser')}`">
                        <el-input
                          v-model="form.purchasePersonBy"
                          :title="form.purchasePersonBy"
                          disabled
                        ></el-input>
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
                    <el-col :span="8" v-if="false">
                      <el-form-item :label="`${$t('ui.pic')}`" prop="picUserBy">
                        <SelectInput
                          :value="form.picUserBy"
                          :title="form.picUserBy"
                          @clear="picUserByClear"
                          clearable
                          @click="openPicTable"
                          class="form-wd"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.datePurchased')}`">
                        <el-date-picker
                          v-model="form.purchaseDate"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                          disabled
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.returnType')}`">
                        <el-input
                          :value="
                            selectDictLabel(dict.type.purchase_return_type, form.purchaseReturnType)
                          "
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.returnDate')}`" prop="returnDate">
                        <el-date-picker
                          v-model="form.returnDate"
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
                    <el-col :span="24">
                      <el-form-item :label="$t('ui.remarks')">
                        <MyInput
                          type="textarea"
                          v-model="form.remarks"
                          :autosize="{ minRows: 1, maxRows: 4 }"
                          resize="none"
                          show-word-limit
                          :maxlength="3000"
                        ></MyInput>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div v-if="form.purchaseReturnType === '2'" key="purchaseReturnType22">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.DocNo')}`" prop="consignmentOrderNo">
                        <CommonSelectAndList
                          :id="form.consignmentOrderId"
                          :label="form.consignmentOrderNo"
                          :title="form.consignmentOrderNo"
                          idKey="consignmentOrderId"
                          labelKey="consignmentOrderNo"
                          filterable
                          :filter-method="filterMethodForCO"
                          @visible-change="visibleChangeForCO"
                          :clearable="false"
                          :options="consignmentOrderOptionsShow"
                          :optionsAll="consignmentOrderOptions"
                          :loading="consignmentOrderOptionsLoading"
                          @change="updateConsignmentNo"
                          @handleOpen="openConsignmentTable"
                        >
                          <template slot-scope="{ item }">{{ item.showPOStr }}</template>
                        </CommonSelectAndList>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('ui.status')}`">
                        <el-input
                          :value="
                            selectDictLabel(
                              dict.type.purchase_return_status,
                              form.purchaseReturnStatus
                            )
                          "
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.purchaseReturnOrderNo')}`">
                        <el-input v-model="form.purchaseReturnNo" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('PURCHASE.warehouseName')}`"
                        prop="warehouseName"
                        key="warehouseName22"
                      >
                        <SelectInput
                          clearable
                          :disabled="true"
                          :value="form.warehouseName"
                          :title="form.warehouseName"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.supplierName')}`">
                        <el-input
                          v-model="form.businessPartnerName"
                          :title="form.businessPartnerName"
                          disabled
                        ></el-input>
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
                      <el-form-item :label="`${$t('ui.pic')}`" prop="picUserBy">
                        <SelectInput
                          :value="form.picUserBy"
                          :title="form.picUserBy"
                          @clear="picUserByClear"
                          clearable
                          @click="openPicTable"
                          class="form-wd"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.returnDate')}`" prop="returnDate">
                        <el-date-picker
                          v-model="form.returnDate"
                          :picker-options="validityDaysPickerOptions"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.purchaser')}`">
                        <el-input
                          v-model="form.purchasePersonBy"
                          :title="form.purchasePersonBy"
                          disabled
                        ></el-input>
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
                      <el-form-item :label="`${$t('PURCHASE.datePurchased')}`">
                        <el-date-picker
                          v-model="form.purchaseDate"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                          disabled
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.returnType')}`">
                        <el-input
                          :value="
                            selectDictLabel(dict.type.purchase_return_type, form.purchaseReturnType)
                          "
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
                          v-model="form.remarks"
                          :autosize="{ minRows: 1, maxRows: 4 }"
                          resize="none"
                          show-word-limit
                          :maxlength="3000"
                        ></MyInput>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div v-if="form.purchaseReturnType === '3'" key="purchaseReturnType33">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.DocNo')}`" prop="purchaseOrderNo">
                        <CommonSelectAndList
                          :id="form.purchaseOrderId"
                          :label="form.purchaseOrderNo"
                          :title="form.purchaseOrderNo"
                          idKey="purchaseOrderId"
                          labelKey="purchaseOrderNo"
                          filterable
                          :filter-method="filterMethodForPO"
                          @visible-change="visibleChange"
                          :clearable="false"
                          :options="purchaseOrderOptionsShow"
                          :optionsAll="purchaseOrderOptions"
                          :loading="purchaseOrderOptionsLoading"
                          @change="updatePurchaseOrderNo"
                          @handleOpen="openPurchaseOrderTable"
                        >
                          <template slot-scope="{ item }">{{ item.showPOStr }}</template>
                        </CommonSelectAndList>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('ui.status')}`">
                        <el-input
                          :value="
                            selectDictLabel(
                              dict.type.purchase_return_status,
                              form.purchaseReturnStatus
                            )
                          "
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.purchaseReturnOrderNo')}`">
                        <el-input v-model="form.purchaseReturnNo" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8" v-if="false">
                      <el-form-item :label="`${$t('ui.pic')}`" prop="picUserBy">
                        <SelectInput
                          :value="form.picUserBy"
                          :title="form.picUserBy"
                          @clear="picUserByClear"
                          clearable
                          @click="openPicTable"
                          class="form-wd"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.datePurchased')}`">
                        <el-date-picker
                          v-model="form.purchaseDate"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                          disabled
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.supplierName')}`">
                        <el-input
                          v-model="form.businessPartnerName"
                          :title="form.businessPartnerName"
                          disabled
                        ></el-input>
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
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.returnDate')}`" prop="returnDate">
                        <el-date-picker
                          v-model="form.returnDate"
                          :picker-options="validityDaysPickerOptions"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.purchaser')}`">
                        <el-input
                          v-model="form.purchasePersonBy"
                          :title="form.purchasePersonBy"
                          disabled
                        ></el-input>
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
                      <el-form-item :label="`${$t('PURCHASE.returnType')}`">
                        <el-input
                          :value="
                            selectDictLabel(dict.type.purchase_return_type, form.purchaseReturnType)
                          "
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
                          v-model="form.remarks"
                          :autosize="{ minRows: 1, maxRows: 4 }"
                          resize="none"
                          show-word-limit
                          :maxlength="3000"
                        ></MyInput>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.returnInfo')"
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
                    <el-form-item :label="`${$t('PURCHASE.incoterm')}`">
                      <CommonSelect
                        :clearable="!!form.incotermId"
                        :id="form.incotermId"
                        :label="form.incotermName || 'N/A'"
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
                      :label="`${$t('PURCHASE.port')}`"
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
                        :value="$t('PURCHASE.selfCollect')"
                        disabled
                      ></el-input>
                      <ToolTipShowObj
                        v-else
                        :mData="form.receiveAddressForPort || {}"
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
                            !['FAS', 'CIF', 'FOB', 'CFR', 'FCA'].includes(
                              form.incotermAbbreviation
                            ) ||
                            !form.businessPartnerId
                          "
                          :loading="portNameLoading"
                          @change="updatePort"
                          ref="portRef"
                          @handleOpen="openPortTable"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.zone')}`">
                      <el-input :value="form.district" :title="form.district" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress')}`"
                      prop="receiveAddressName"
                      :rules="[
                        {
                          required:
                            ['CPT', 'CIP', 'DDP', 'DAP', 'DPU', 'FCA'].includes(
                              form.incotermAbbreviation
                            ) || !form.incotermAbbreviation,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                      key="deliveryAddress2"
                    >
                      <!-- <SelectInput
                        :value="form.receiveAddressName"
                        :title="form.receiveAddressName"
                        @clear="receiveAddressClear"
                        clearable
                        @click="openReceiveAddressTable"
                        class="form-wd"
                      /> -->
                      <CommonSelectAndList
                        :id="form.receiveAddressId"
                        :label="form.receiveAddress"
                        :title="form.receiveAddress"
                        idKey="businessAddressId"
                        labelKey="receiveAddress"
                        filterable
                        :options="receiveAddressOptions"
                        :loading="receiveAddressOptionsLoading"
                        :disabled="!form.businessPartnerId || form.incotermAbbreviation === 'EXW'"
                        @change="updateAddress"
                        @handleOpen="openReceiveAddressTable"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.contactPerson')}`"
                      prop="bpContactPersonId"
                    >
                      <CommonSelect
                        :disabled="!form.businessPartnerId"
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
                    <el-form-item :label="`${$t('ui.mobilePhone')}`">
                      <el-input
                        v-model="form.bpMobilePhone"
                        :title="form.bpMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input v-model="form.bpEmail" :title="form.bpEmail" disabled></el-input>
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
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :initCommonFileList="initCommonFileList"
                  @scrollPageToTable="scrollPageToTable"
                />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
    <selectPurchaseOrderTable ref="selectPurchaseOrderTable" @update="updatePurchaseOrderNo" />
    <selectConsignmentTable ref="selectConsignmentTable" @update="updateConsignmentNo" />
    <selectDropShippingPurchaseOrderTable
      ref="selectDropShippingPurchaseOrderTable"
      @update="updatePurchaseOrderNo"
    />
    <selectWarehouseTable
      ref="selectWarehouseTable"
      :purchaseOrderId="form.purchaseOrderId"
      :logisticsDocumentId="form.logisticsDocumentId"
      @update="updateWarehouse"
    />
    <selectPicTable ref="selectPicTable" @update="updatePic" />

    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <payToAddressDlg
      ref="payToAddressDlg"
      :supplierId="form.businessPartnerMainId"
      @update="updateAddress"
    />
  </FormPageLayout>
</template>

<script>
import { formDirtyClass } from '@/mixins/formDirtyClass'
import { queryIncotermList, queryCanSelectPortList } from '@/api/common/common'
import {
  savePurchaseReturn,
  saveDraftPurchaseReturn,
  queryContactPersonByBusinessPartnerIdNoPage,
  queryPurchaseGoodsReturnCanSelectWarehouseList,
  queryLogisticsDocumentList,
  queryProductListForPass,
  queryProductListForFailed,
  queryProductListForConsignmentOrder,
  queryDropShippingCanSelectProductList,
  queryCanSelectPurchaseOrderList,
  queryDropShippingCanSelectPurchaseOrderList,
  queryCanSelectConsignmentOrderList
} from '@/api/purchaseManagement/purchaseReturnOrder'
import { queryAddressByBusinessPartnerId } from '@/api/purchaseManagement/purchaseContract'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import selectPurchaseOrderTable from './components/selectPurchaseOrderTable.vue'
import selectConsignmentTable from './components/selectConsignmentTable.vue'
import selectDropShippingPurchaseOrderTable from './components/selectDropShippingPurchaseOrderTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import selectPicTable from './components/selectPicTable.vue'
import ProductInfo from './productInfo/productInfo.vue'
import selectPortTable from './components/selectPortTable.vue'
import payToAddressDlg from './components/payToAddressDlg.vue'

export default {
  mixins: [pageMixin],
  dicts: ['purchase_return_status', 'purchase_return_type'],
  components: {
    selectPurchaseOrderTable,
    selectPicTable,
    selectWarehouseTable,
    ProductInfo,
    selectPortTable,
    payToAddressDlg,
    selectConsignmentTable,
    selectDropShippingPurchaseOrderTable
  },
  data() {
    return {
      activeNames: [],
      timeId: '',
      submitLoading: false,
      form: {
        purchaseReturnProductList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        purchaseOrderNo: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        consignmentOrderNo: [
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
        /* returnDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ], */
        picUserBy: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        dueDate: [
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
        bpContactPersonId: [
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
      purchaseOrderOptions: [],
      purchaseOrderOptionsLoading: false,
      purchaseOrderOptionsShow: [],
      consignmentOrderOptions: [],
      consignmentOrderOptionsShow: [],
      consignmentOrderOptionsLoading: false,
      warehouseOptions: [],
      warehouseOptionsLoading: false,
      incotermOptions: [],
      incotermOptionsLoading: false,
      portOptions: [],
      portNameLoading: false,
      receiveAddressOptions: [],
      receiveAddressOptionsLoading: false,
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
      initCommonFileList: [],
      logisticsOptions: [],
      logisticsOptionsLoading: false
    }
  },
  props: {
    propTimeId: {
      type: String,
      default: ''
    },
    type: {
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
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    addBtnDisabled() {
      if (this.form.purchaseReturnType === '3') {
        return !this.form.purchaseOrderId
      }
      if (this.form.purchaseReturnType === '2') {
        return !this.form.consignmentOrderId || !this.form.warehouseId
      }
      return !this.form.purchaseOrderId || !this.form.warehouseId
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    handleAdd() {
      this.reset()
      this.queryIncotermList()
      this.queryCanSelectPortList()
      this.$set(this.form, 'purchaseReturnType', this.type)
      if (this.form.purchaseReturnType === '3' || this.form.purchaseReturnType === '1') {
        this.queryPurchaseOrderOptions()
      }

      if (this.form.purchaseReturnType === '2') {
        this.queryConsignmentOrderOptions()
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
    },
    reset() {
      this.form = {
        /* 基础信息 */
        purchaseOrderNo: undefined,
        warehouseName: undefined,
        warehouseLabel: undefined,
        warehouseUserName: undefined,
        warehouseAddressShowStr: undefined,
        warehouseUserMobileCode: undefined,
        warehouseUserMobileNum: undefined,
        warehouseUserMobilePhone: undefined,
        warehouseUserEmail: undefined,
        picUserBy: this.$store.state.user.nickName,
        picUserId: this.$store.state.user.userId,
        purchaseReturnNo: undefined,
        purchasePersonBy: undefined,
        purchasePersonId: undefined,
        businessPartnerName: undefined,
        purchaseDate: undefined,
        returnDate: undefined,
        dueDate: undefined,
        ourRef: undefined,
        yourRef: undefined,
        remarks: undefined,
        automatedEmail: '1',
        bpBusinessContactPersonList: [],

        addressForWarehouse: {},
        purchaseReturnProductList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('form1')
      this.resetForm('form2')
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
      this.$refs.form2.validateField(code)
    },

    queryPurchaseOrderOptions() {
      let queryFn
      if (this.form.purchaseReturnType === '3') {
        queryFn = queryDropShippingCanSelectPurchaseOrderList
      } else {
        queryFn = queryCanSelectPurchaseOrderList
      }
      this.purchaseOrderOptionsLoading = true
      queryFn({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.purchaseReturnOrder
      })
        .then((res) => {
          this.purchaseOrderOptionsLoading = false
          const list = res.rows || []
          list.forEach((x) => {
            x.showPOStr = `${x.purchaseOrderNo}, ${x.businessPartnerName}`
          })
          this.purchaseOrderOptions = list
          this.purchaseOrderOptionsShow = list
        })
        .catch(() => {
          this.purchaseOrderOptionsLoading = false
        })
    },
    visibleChange(show) {
      if (show === false) {
        setTimeout(() => {
          this.purchaseOrderOptionsShow = this.purchaseOrderOptions
        }, 100)
      }
    },
    filterMethodForPO(str) {
      const res = []
      if ((str + '').trim() !== '') {
        this.purchaseOrderOptions.forEach((item) => {
          if (
            item.purchaseOrderNo.toLocaleLowerCase().indexOf(str.trim().toLocaleLowerCase()) >= 0
          ) {
            res.push(item)
          } else if (
            item.businessPartnerName.toLocaleLowerCase().indexOf(str.trim().toLocaleLowerCase()) >=
            0
          ) {
            res.push(item)
          }
        })
        this.purchaseOrderOptionsShow = res
      } else {
        this.purchaseOrderOptionsShow = this.purchaseOrderOptions
      }
    },
    openPurchaseOrderTable() {
      if (this.form.purchaseReturnType === '3') {
        this.$refs.selectDropShippingPurchaseOrderTable.handleOpen()
      } else {
        this.$refs.selectPurchaseOrderTable.handleOpen()
      }
    },

    updatePurchaseOrderNo(row) {
      this.$set(this.form, 'purchaseOrderId', row.purchaseOrderId)
      this.$set(this.form, 'purchaseOrderNo', row.purchaseOrderNo)
      this.$set(this.form, 'purchaseDate', row.createdTime)
      this.$set(this.form, 'purchasePersonBy', row.purchasePersonBy)
      this.$set(this.form, 'purchasePersonId', row.purchasePersonId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'abbreviation', row.abbreviation)
      this.$set(this.form, 'country', row.country)
      this.$set(this.form, 'countryId', row.countryId)

      this.warehouseClear()
      this.contactPersonClear()
      this.queryContactPersonByBusinessPartnerIdNoPage()
      this.logisticsClear()
      this.receiveAddressClear()
      // 默认填充地址
      this.queryReceiveAddressOptions()
      if (this.form.purchaseReturnType === '1') {
        this.queryLogisticsDocumentList()
      } else {
        this.queryPurchaseGoodsReturnCanSelectWarehouseList()
      }
      this.$set(this.form, 'purchaseReturnProductList', [])
    },
    queryConsignmentOrderOptions() {
      this.consignmentOrderOptionsLoading = true
      queryCanSelectConsignmentOrderList({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.purchaseReturnOrder
      })
        .then((res) => {
          this.consignmentOrderOptionsLoading = false
          const list = res.rows || []
          list.forEach((x) => {
            x.showPOStr = `${x.consignmentOrderNo}, ${x.businessPartnerName}`
          })
          this.consignmentOrderOptions = list
          this.consignmentOrderOptionsShow = list
        })
        .catch(() => {
          this.consignmentOrderOptionsLoading = false
        })
    },
    visibleChangeForCO(show) {
      if (show === false) {
        setTimeout(() => {
          this.consignmentOrderOptionsShow = this.consignmentOrderOptions
        }, 100)
      }
    },
    filterMethodForCO(str) {
      const res = []
      if ((str + '').trim() !== '') {
        this.consignmentOrderOptions.forEach((item) => {
          if (
            item.consignmentOrderNo.toLocaleLowerCase().indexOf(str.trim().toLocaleLowerCase()) >= 0
          ) {
            res.push(item)
          } else if (
            item.businessPartnerName.toLocaleLowerCase().indexOf(str.trim().toLocaleLowerCase()) >=
            0
          ) {
            res.push(item)
          }
        })
        this.consignmentOrderOptionsShow = res
      } else {
        this.consignmentOrderOptionsShow = this.consignmentOrderOptions
      }
    },
    openConsignmentTable() {
      this.$refs.selectConsignmentTable.handleOpen()
    },
    updateConsignmentNo(row) {
      this.$set(this.form, 'consignmentOrderId', row.consignmentOrderId)
      this.$set(this.form, 'consignmentOrderNo', row.consignmentOrderNo)
      this.$set(this.form, 'purchaseDate', row.createdTime)
      this.$set(this.form, 'purchasePersonBy', row.purchasePersonBy)
      this.$set(this.form, 'purchasePersonId', row.purchasePersonId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'country', row.country)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'abbreviation', row.abbreviation)
      this.$set(this.form, 'warehouseName', row.warehouseName)
      this.$set(this.form, 'warehouseId', row.warehouseId)
      this.queryContactPersonByBusinessPartnerIdNoPage()
      this.$set(this.form, 'purchaseReturnProductList', [])
      this.receiveAddressClear()
      this.queryReceiveAddressOptions()
      this.setDefaultProductList()
    },
    queryLogisticsDocumentList() {
      const param = { pageNum: 1, pageSize: 25 }
      param.purchaseOrderNo = this.form.purchaseOrderNo
      param.menuPerms = this.menuKey.purchaseReturnOrder
      this.logisticsOptionsLoading = true
      queryLogisticsDocumentList(param)
        .then((response) => {
          this.logisticsOptionsLoading = false
          const rows = response.data || []
          this.logisticsOptions = rows
          if (rows.length === 1) {
            this.logisticsChange(rows[0])
          } else {
            this.queryPurchaseGoodsReturnCanSelectWarehouseList()
          }
        })
        .catch((err) => {
          this.logisticsOptionsLoading = false
          window.console.error(err)
        })
    },
    logisticsChange(row) {
      this.warehouseClear()
      this.$set(this.form, 'logisticsDocumentId', row.logisticsDocumentId)
      this.$set(this.form, 'logisticsDocumentNo', row.logisticsDocumentNo)
      this.queryPurchaseGoodsReturnCanSelectWarehouseList()
      this.$set(this.form, 'purchaseReturnProductList', [])
    },
    logisticsClear() {
      this.$set(this.form, 'logisticsDocumentId', undefined)
      this.$set(this.form, 'logisticsDocumentNo', undefined)
    },

    queryPurchaseGoodsReturnCanSelectWarehouseList() {
      const param = { pageNum: 1, pageSize: 9999 }
      param.purchaseOrderId = this.form.purchaseOrderId
      param.logisticsDocumentId = this.form.logisticsDocumentId
      param.menuPerms = this.menuKey.purchaseReturnOrder
      this.warehouseOptions = []
      const timer = Date.now()
      this.queryWHTimer = timer
      this.warehouseOptionsLoading = true
      queryPurchaseGoodsReturnCanSelectWarehouseList(param)
        .then((response) => {
          if (this.queryWHTimer !== timer) return
          this.warehouseOptionsLoading = false
          const rows = response.rows || []
          this.warehouseOptions = rows
          if (rows.length === 1) {
            this.updateWarehouse(rows[0])
          } else {
            this.setDefaultProductList()
          }
        })
        .catch((err) => {
          this.warehouseOptionsLoading = false
          window.console.error(err)
        })
    },
    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    updateWarehouse(row) {
      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'warehouseName', row.warehouseName)
      this.$set(this.form, 'warehouseId', row.warehouseId)
      this.$set(this.form, 'warehouseLabel', rowData.label)
      this.$set(this.form, 'warehouseUserName', row.userName)
      this.$set(this.form, 'warehouseAddressShowStr', row.warehouseAddressShowStr)
      this.$set(this.form, 'warehouseUserMobileCode', row.mobileCode)
      this.$set(this.form, 'warehouseUserMobileNum', row.mobileNum)
      this.$set(this.form, 'warehouseUserMobilePhone', row.mobilePhone)
      this.$set(this.form, 'warehouseUserEmail', row.email)
      this.$set(this.form, 'purchaseReturnProductList', [])
      this.setDefaultProductList()
    },
    warehouseClear() {
      this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseId', undefined)
      this.$set(this.form, 'warehouseLabel', undefined)
      this.$set(this.form, 'warehouseUserName', undefined)
      this.$set(this.form, 'warehouseAddressShowStr', undefined)
      this.$set(this.form, 'warehouseUserMobileCode', undefined)
      this.$set(this.form, 'warehouseUserMobileNum', undefined)
      this.$set(this.form, 'warehouseUserMobilePhone', undefined)
      this.$set(this.form, 'warehouseUserEmail', undefined)

      if (this.form.purchaseReturnType !== '3') {
        this.$set(this.form, 'purchaseReturnProductList', [])
      }
    },

    // 设置默认产品列表
    async setDefaultProductList() {
      if (this.addBtnDisabled) return

      const timer = Date.now()
      this.queryTime = timer
      const param = { pageNum: 1, pageSize: 1000 }
      if (this.form.purchaseReturnType === '1') {
        param.purchaseOrderId = this.form.purchaseOrderId
        param.warehouseId = this.form.warehouseId
        param.purchaseReturnId = this.form.purchaseReturnId
        param.logisticsDocumentId = this.form.logisticsDocumentId
        const a = queryProductListForPass(param)
        const b = queryProductListForFailed(param)
        await Promise.all([a, b]).then((res) => {
          if (timer !== this.queryTime) return
          const res1 = res[0] || {}
          const res2 = res[1] || {}
          const rows1 = res1.data || []
          const rows2 = res2.data || []
          const rows = [...rows1, ...rows2]
          rows.forEach((item) => {
            item.remarks = ''
          })
          this.$set(this.form, 'purchaseReturnProductList', rows)
        })
      }

      if (this.form.purchaseReturnType === '2') {
        param.consignmentOrderId = this.form.consignmentOrderId
        param.warehouseId = this.form.warehouseId
        param.purchaseReturnId = this.form.purchaseReturnId
        queryProductListForConsignmentOrder(param).then((response) => {
          if (timer !== this.queryTime) return
          const rows = response.data || []
          rows.forEach((item) => {
            item.remarks = ''
          })
          this.$set(this.form, 'purchaseReturnProductList', rows)
        })
      }

      if (this.form.purchaseReturnType === '3') {
        param.purchaseOrderId = this.form.purchaseOrderId
        param.purchaseReturnId = this.form.purchaseReturnId
        queryDropShippingCanSelectProductList(param).then((response) => {
          if (timer !== this.queryTime) return
          const rows = response.data || []
          rows.forEach((item) => {
            item.remarks = ''
          })
          this.$set(this.form, 'purchaseReturnProductList', rows)
        })
      }
    },

    // 打开pic弹窗
    openPicTable() {
      this.$refs.selectPicTable.handleOpen()
    },
    updatePic(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'picUserBy', nickName)
      this.$set(this.form, 'picUserId', userId)
    },
    // 清空pic
    picUserByClear() {
      this.$set(this.form, 'picUserBy', undefined)
      this.$set(this.form, 'picUserId', undefined)
    },

    /* 第二部分表单 */
    queryIncotermList() {
      this.incotermOptionsLoading = true
      queryIncotermList({})
        .then((res) => {
          this.incotermOptionsLoading = false
          this.incotermOptions = res.data || []
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
      this.receiveAddressClear()
      this.receivePortClear()
      this.$nextTick(() => {
        this.$refs.form2.clearValidate(['receivePortName', 'receiveAddressName'])
      })
    },

    queryCanSelectPortList() {
      let firstCountryId
      let firstCountry
      let firstCity

      if (['FOB', 'FAS'].includes(this.form.incotermAbbreviation)) {
        firstCountryId = this.legalEntityInfo.countryId
        firstCountry = this.legalEntityInfo.country
        firstCity = this.legalEntityInfo.city
      }
      if (['CIF', 'CFR'].includes(this.form.incotermAbbreviation)) {
        const hasReceiveAddress = !!this.form.receiveAddressId
        firstCountryId = hasReceiveAddress
          ? this.form.receiveAddressCountryId
          : this.form.registeredAddressCountryId
        firstCountry = hasReceiveAddress
          ? this.form.receiveAddressCountry
          : this.form.registeredAddressCountry
        firstCity = hasReceiveAddress
          ? this.form.receiveAddressCity
          : this.form.registeredAddressCity
      }
      this.portNameLoading = true
      queryCanSelectPortList({
        pageNum: 1,
        pageSize: 9999,
        firstCountryId,
        firstCountry,
        firstCity
      })
        .then((res) => {
          this.portOptions = res.rows || []
          this.portNameLoading = false
        })
        .catch(() => {
          this.portNameLoading = false
        })
    },
    openPortTable() {
      let firstCountryId
      let firstCountry
      let firstCity

      if (['FOB', 'FAS'].includes(this.form.incotermAbbreviation)) {
        firstCountryId = this.legalEntityInfo.countryId
        firstCountry = this.legalEntityInfo.country
        firstCity = this.legalEntityInfo.city
      }
      if (['CIF', 'CFR'].includes(this.form.incotermAbbreviation)) {
        const hasReceiveAddress = !!this.form.receiveAddressId
        firstCountryId = hasReceiveAddress
          ? this.form.receiveAddressCountryId
          : this.form.registeredAddressCountryId
        firstCountry = hasReceiveAddress
          ? this.form.receiveAddressCountry
          : this.form.registeredAddressCountry
        firstCity = hasReceiveAddress
          ? this.form.receiveAddressCity
          : this.form.registeredAddressCity
      }
      this.$refs.selectPortTable.handleOpen(firstCountryId, firstCountry, firstCity)
    },

    queryReceiveAddressOptions() {
      this.receiveAddressOptions = []
      this.$set(this.form, 'registeredAddressCountryId', undefined)
      this.$set(this.form, 'registeredAddressCountry', undefined)
      this.$set(this.form, 'registeredAddressCity', undefined)
      if (!this.form.businessPartnerMainId) return
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$trimOfObj(param)
      param.businessPartnerMainId = this.form.businessPartnerMainId
      param.includeLatestData = '1'
      this.receiveAddressOptionsLoading = true
      queryAddressByBusinessPartnerId(param)
        .then((response) => {
          this.receiveAddressOptionsLoading = false
          const rows = response.rows || []
          const registeredAddress =
            rows.find((x) => (x.label || '').includes('Registered')) || {}
          this.$set(this.form, 'registeredAddressCountryId', registeredAddress.countryId)
          this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
          this.$set(this.form, 'registeredAddressCity', registeredAddress.city)
          this.receiveAddressOptions = rows
          if (rows && rows.length === 1) {
            this.updateAddress(rows[0])
          } else {
            this.queryCanSelectPortList()
          }
        })
        .catch((err) => {
          this.receiveAddressOptionsLoading = false
          window.console.error(err)
        })
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
      this.$set(this.form, 'receiveAddressCountryId', undefined)
      this.$set(this.form, 'receiveAddressCountry', undefined)
      this.$set(this.form, 'receiveAddressCity', undefined)
      this.$nextTick(() => {
        this.queryCanSelectPortList()
      })
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
            this.$t('PURCHASE.portIncorrectForFOBOrFAS')
              .replace('$1', this.legalEntityInfo.country)
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
        const portCountry = this.form.receiveAddressId
          ? this.form.receiveAddressCountry
          : this.form.registeredAddressCountry
        if (
          portCountry &&
          portCountry !== country
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
    updateAddress(row) {
      this.$set(this.form, 'addressForBPAddress', row)
      this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
      this.$set(this.form, 'receiveAddressCountryId', row.countryId)
      this.$set(this.form, 'receiveAddressCountry', row.country)
      this.$set(this.form, 'receiveAddressCity', row.city)

      this.$nextTick(() => {
        this.queryCanSelectPortList()
      })
    },
    queryContactPersonByBusinessPartnerIdNoPage() {
      this.$set(this.form, 'bpBusinessContactPersonList', [])
      if (!this.form.businessPartnerMainId) return
      queryContactPersonByBusinessPartnerIdNoPage({
        businessPartnerMainId: this.form.businessPartnerMainId,
        includeLatestData: '1'
      }).then((res) => {
        const data = res.data || []
        const defaultContact = data.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.contactPersonChange(defaultContact)
        } else if (data && data.length === 1) {
          this.contactPersonChange(data[0])
        }
        this.$set(this.form, 'bpBusinessContactPersonList', data)
      })
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

    async submitForm(submitType, isConfirm = true, gotoRoute) {
      const myFileIds = this.$refs.ProductInfo.getFileIds()
      if (myFileIds === false) {
        return
      }

      let valid1 = false
      let valid2 = false

      if (submitType === 'save') {
        this.$refs.form1.clearValidate()
        this.$refs.form2.clearValidate()
        valid1 = true
        valid2 = true
        const validProp =
          this.form.purchaseReturnType === '2' ? 'consignmentOrderNo' : 'purchaseOrderNo'
        this.$refs.form1.validateField([validProp, 'warehouseName'], (err) => {
          if (err) {
            valid1 = false
          }
        })
        this.collapseWarningForBasicInfo = !valid1
        this.collapseWarningForShippingInfo = !valid2
        if (!valid1) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
          return
        }
      } else {
        valid1 = await this.$refs.form1.validate().catch((err) => {
          return err
        })
        this.collapseWarningForBasicInfo = !valid1
        if (!valid1) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
          return
        }
        valid2 = await this.$refs.form2.validate().catch((err) => {
          return err
        })
        this.collapseWarningForShippingInfo = !valid2
        if (!valid2) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.returnInfo'))
          )
          return
        }
      }

      if (valid1 && valid2) {
        let param = { ...this.form }
        if (submitType !== 'save') {
          const validProduct = this.validProductList(param.purchaseReturnProductList)
          if (!validProduct) {
            this.$refs.ProductInfo.activeName = 'productDetail'
            this.collapseWarningForProductInfo = true
            return
          }
        }

        this.collapseWarningForProductInfo = false
        param.commonFileList = myFileIds

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('PURCHASE.PROSaveConfirm')
          successMsg = this.$t('PURCHASE.PROSaveSuccess')
          submitFn = saveDraftPurchaseReturn
        } else {
          confirmMsg = this.$t('PURCHASE.PROSubmitConfirm')
          successMsg = this.$t('PURCHASE.PROSubmitSuccess')
          submitFn = savePurchaseReturn
        }
        let docName = ''
        if (param.purchaseReturnType === '1') {
          docName = this.$t('menu.purchaseReturnOrder')
        }
        if (param.purchaseReturnType === '2') {
          docName = this.$t('menu.consignmentReturnOrder')
        }
        if (param.purchaseReturnType === '3') {
          docName = this.$t('menu.purchaseDirectShippingReturn')
        }
        if (isConfirm) {
          this.$modal
            .confirm(confirmMsg.replace('$1', docName))
            .then(() => {
              this.submitLoading = true
              return submitFn(param)
            })
            .then((response) => {
              this.$modal.msgSuccess(successMsg.replace('$1', docName).replace('$2', response.msg))
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
              this.$modal.msgSuccess(successMsg.replace('$1', docName).replace('$2', response.msg))
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
    validProductList(detailList, isReqOne = true) {
      const valid = false
      if (detailList.length <= 0 && isReqOne) {
        this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qtyToReturn)
      })
      if (qtyReq) {
        this.$refs.ProductInfo.errorMessage('qtyToReturn')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qtyToReturn'))
        )
        return valid
      }
      const returnedAmount = detailList.find((item) => {
        return !this.$resultOfBoolean(item.returnedAmount)
      })
      if (returnedAmount) {
        this.$refs.ProductInfo.errorMessage('returnedAmount')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.returnedAmount'))
        )
        return valid
      }

      const returnedReasonReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.returnedReason)
      })
      if (returnedReasonReq) {
        this.$refs.ProductInfo.errorMessage('returnedReason')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.returnReason'))
        )
        return valid
      }

      if (this.form.purchaseReturnType !== '2') {
        const returnedTypeReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.returnedType)
        })
        if (returnedTypeReq) {
          this.$refs.ProductInfo.errorMessage('returnedType')

          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.RMAType'))
          )
          return valid
        }

        // const scheduledReceivedDate = detailList.find((item) => {
        //   return item.returnedType === '3' && !item.scheduledReceivedDate
        // })
        // if (scheduledReceivedDate) {
        //   this.$refs.ProductInfo.errorMessage('scheduledReceivedDate')

        //   this.$modal.msgError(
        //     this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.estimatedReceiptDate'))
        //   )
        //   return valid
        // }
      }

      return true
    },

    getFormJson() {
      const param = { ...this.form }
      const myFileIds = this.$refs.ProductInfo.getFileIds()
      param.commonFileList = myFileIds

      return JSON.stringify(param)
    },
    handleSaveDraft() {
      this.submitForm('save')
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      this.submitForm('save', false, gotoRoute)
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
