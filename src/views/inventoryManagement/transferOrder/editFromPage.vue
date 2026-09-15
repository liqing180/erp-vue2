<template>
  <FormPageLayoutTabs v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="approvedBtnShow" @click="handleApproved"
        >{{ $t('uiBtn.approve') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="rejectedBtnShow" @click="handleRejected"
        >{{ $t('uiBtn.reject1') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="buttonAuthMsg.isCanSeeUpdateMsg === '1'"
        @click="revisionComparison"
        >{{ $t('uiBtn.revisionComparison') }}</el-button
      >
      <el-button type="primary" size="mini" v-if="isShowEditBtn" @click="exitComparison">
        {{ $t('uiBtn.edit') }}
      </el-button>
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">{{ $t('menu.transferOrder') }}</div>
    </template>
    <template v-slot:tabs>
      <el-tabs
        v-if="form.approvedStatus === '3'"
        v-model="activeName"
        size="mini"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane :label="$t('INVENTORY.transferOrderDetails')" name="basicInfo"></el-tab-pane>
        <el-tab-pane
          :label="$t('INVENTORY.stockOutInDetails')"
          name="stockOutInDetails"
        ></el-tab-pane>
      </el-tabs>
    </template>
    <template v-slot:content>
      <div v-show="activeName === 'basicInfo'">
        <div class="form-card mb10" v-if="isComparison">
          <div class="legend-bar">
            <span class="legend-text">{{ $t('ui.legend') }}</span>
            <span class="legend-divider"></span>
            <span class="legend-item"><span class="color-block add"></span>{{ $t('ui.added') }}</span>
            <span class="legend-divider"></span>
            <span class="legend-item">
              <span class="color-block edit"></span>{{ $t('ui.modified') }}
            </span>
            <span class="legend-divider"></span>
            <span class="legend-item"><span class="color-block del"></span>{{ $t('ui.deleted') }}</span>
          </div>
        </div>
        <div
          class="form-card reject-card collapse-item-content-pt0 mb10"
          v-if="isComparison && (form.operationLogForLastReject || {}).operatorBy"
        >
          <el-collapse v-model="activeNames">
            <el-collapse-item name="11">
              <FormCollapseItemTitle slot="title" :title="$t('ui.rejectionOpinion')" />
              <div class="mb10">
                <div class="reject-remarks">
                  {{ (form.operationLogForLastReject || {}).operationDescription }}
                </div>
                <div class="reject-by">
                  {{ $t('ui.rejectedBy1') }}：{{ (form.operationLogForLastReject || {}).operatorBy }}
                  |
                  {{ parseTime((form.operationLogForLastReject || {}).operatorTime, fmtForYmdhms) }}
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="1">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('INVENTORY.deliveryInfo')"
                :warning="collapseWarningForBasicInfo"
              >
                <span class="info-item mr20" :title="form.fromWarehouseName">
                  {{ $t('INVENTORY.transferFrom') }} : {{ form.fromWarehouseName }}
                </span>
                <span v-if="form.requiredBy" class="info-item mr20" :title="form.requiredBy">
                  {{ $t('INVENTORY.requiredBy') }} : {{ form.requiredBy }}
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
                    <el-form-item :label="`${$t('SALES.salesOrderNo')}`" prop="salesOrderNo">
                      <div class="input-switch-box">
                        <div class="con-left">
                          <el-input
                            v-model="form.salesOrderNo"
                            :title="form.salesOrderNo"
                            disabled
                          ></el-input>
                        </div>
                        <div v-if="form.salesOrderTransferOrderType">
                          <div
                            v-if="form.salesOrderTransferOrderType === '1'"
                            class="salesOrderTip"
                          >
                            {{ $t('INVENTORY.consignment') }}
                          </div>
                          <div v-else class="salesOrderTip">{{ $t('INVENTORY.pickup') }}</div>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.transferOrderNo')}`">
                      <el-input
                        v-model="form.transferOrderNo"
                        :title="form.transferOrderNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(dict.type.transfer_order_status, form.transferOrderStatus)
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('INVENTORY.transferFrom')}`"
                      prop="fromWarehouseName"
                    >
                      <el-input
                        v-model="form.fromWarehouseName"
                        :title="form.fromWarehouseName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('INVENTORY.scheduledTransferDate')}`"
                      prop="scheduledTransferDate"
                    >
                      <ComparisonInput
                        v-if="isModified('scheduledTransferDate')"
                        :beforeValue="getBeforeValue('scheduledTransferDate')"
                        :afterValue="getAfterValue(
                          'scheduledTransferDate',
                          parseTime(form.scheduledTransferDate, fmtForYmd)
                        )"
                      />
                      <el-date-picker
                        v-else
                        v-model="form.scheduledTransferDate"
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
                    <el-form-item
                      :label="`${$t('INVENTORY.ourRef')}`"
                    >
                      <ComparisonInput
                        v-if="isModified('ourRef')"
                        :beforeValue="getBeforeValue('ourRef')"
                        :afterValue="getAfterValue('ourRef', form.ourRef)"
                      />
                      <el-input
                        v-else
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('INVENTORY.requiredBy')}`"
                      prop="requiredBy"
                    >
                      <ComparisonInput
                        v-if="isModified('requiredBy')"
                        :beforeValue="getBeforeValue('requiredBy')"
                        :afterValue="getAfterValue('requiredBy', form.requiredBy)"
                      />
                      <CommonSelectAndList
                        v-else
                        :id="form.requiredId"
                        :label="form.requiredBy"
                        idKey="userId"
                        labelKey="nickName"
                        filterable
                        :options="requiredByOptions"
                        :loading="requiredByOptionsLoading"
                        @change="updateRequiredBy"
                        @handleOpen="openRequiredByTable"
                        :disabled="comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="$t('ui.reason')"
                      prop="reason"
                      :class="[isModified('reason')]"
                    >
                      <MyInput
                        type="textarea"
                        v-model="form.reason"
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
                :title="$t('INVENTORY.shippingInfo')"
                :warning="collapseWarningForShippingInfo"
              >
                <span class="info-item mr20" :title="form.toWarehouseName">
                  {{ $t('INVENTORY.transferTo') }} : {{ form.toWarehouseName }}
                </span>
                <span class="info-item mr20" :title="form.toUserBy">
                  {{ $t('INVENTORY.contactPerson') }} : {{ form.toUserBy }}
                </span>
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
                    <el-form-item :label="`${$t('INVENTORY.transferTo')}`" prop="toWarehouseName">
                      <el-input
                        v-model="form.toWarehouseName"
                        :title="form.toWarehouseName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('INVENTORY.deliveryAddress')}`">
                      <el-input
                        :value="form.toWarehouseAddressShowStr"
                        :title="form.toWarehouseAddressShowStr"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.contactPerson')}`">
                      <el-input :value="form.toUserBy" :title="form.toUserBy" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.mobilePhone1')}`">
                      <el-input
                        :value="form.toMobilePhone"
                        :title="form.toMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input :value="form.toEmail" :title="form.toEmail" disabled></el-input>
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
                :title="$t('INVENTORY.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
                <span class="info-item mr20">
                  {{ $t('INVENTORY.product') }} : {{ form.transferOrderProductList.length }}
                </span>
              </FormCollapseItemTitle>
              <div>
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :comDisFrom="comDisFrom"
                  :modifyHighlight="modifyHighlight"
                  :basicUpdateProps="basicUpdateProps"
                />
                <el-form :model="form" @submit.native.prevent label-width="180px">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="$t('ui.remarks')" :class="[isModified('remarks')]">
                        <MyInput
                          type="textarea"
                          v-model="form.remarks"
                          :autosize="{ minRows: 1, maxRows: 4 }"
                          resize="none"
                          show-word-limit
                          :disabled="comDisFrom"
                          :maxlength="3000"
                        ></MyInput>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
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
      <div v-show="activeName === 'stockOutInDetails'">
        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="5">
              <FormCollapseItemTitle slot="title" :title="$t('INVENTORY.stockOutDetails')">
              </FormCollapseItemTitle>
              <el-form :model="stockOutForm" label-width="180px">
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.warehouse')}`">
                      <el-input
                        :value="stockOutForm.warehouseName"
                        :title="stockOutForm.warehouseName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.deliveryNoticeNo')}`">
                      <el-input
                        :value="stockOutForm.deliveryNoticeNo"
                        :title="stockOutForm.deliveryNoticeNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.certificateNo')}`">
                      <el-input
                        :value="stockOutForm.stockCertificateNo"
                        :title="stockOutForm.stockCertificateNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.time')}`">
                      <el-date-picker
                        :value="stockOutForm.modifiedTime"
                        :format="fmtForYmdhms"
                        disabled
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.operator')}`">
                      <el-input
                        :value="stockOutForm.modifiedBy"
                        :title="stockOutForm.modifiedBy"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div class="pb20">
                <el-table
                  border
                  :data="stockOutForm.deliveryNoticeProductList || []"
                  :max-height="390"
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
                    prop="productName"
                    :label="$t('PRODUCT.productName')"
                    min-width="220"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    prop="internalPartNo"
                    :label="$t('PRODUCT.internalPartNo')"
                    min-width="180"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    prop="alias"
                    :label="$t('PRODUCT.alias')"
                    min-width="180"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <!-- <el-table-column
                    prop="partNo"
                    :label="$t('PRODUCT.partNo')"
                    min-width="180"
                    show-overflow-tooltip
                  >
                  </el-table-column> -->
                  <el-table-column
                    prop="uom"
                    :label="$t('INVENTORY.uom1')"
                    min-width="120"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <span :title="showUomLabel(scope.row.uom)">{{ scope.row.uom }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stockOutQty"
                    :label="$t('INVENTORY.outboundedQTY')"
                    min-width="180"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <span>{{ $numberStr(scope.row.stockOutQty, scope.row.decimalNum) }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </div>
          <!-- v-if="form.deliveryNoticeShipping" -->
          <div class="form-card mt10" v-if="false">
            <el-collapse-item name="6">
              <FormCollapseItemTitle slot="title" :title="$t('SALES.deliveryInformation')">
                <template>
                  <span class="info-item mr20" :title="form.deliveryNoticeShipping.driverName">
                    {{ $t('SALES.driver') }} : {{ form.deliveryNoticeShipping.driverName }}
                  </span>
                  <span class="info-item mr20">
                    {{ $t('SALES.vehicle') }} :
                    {{ form.deliveryNoticeShipping.licensePlateNo }}
                  </span>
                  <span class="info-item">
                    {{ $t('SALES.deliveryDate') }} :
                    {{ parseTime(form.deliveryNoticeShipping.stockedOutTime, fmtForYmdhms) }}
                  </span>
                </template>
              </FormCollapseItemTitle>
              <el-form ref="form6" :model="form" @submit.native.prevent label-width="180px">
                <template>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.driver')}`">
                        <el-input
                          :value="form.deliveryNoticeShipping.driverName"
                          :title="form.deliveryNoticeShipping.driverName"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.vehicle')}`">
                        <el-input
                          :value="form.deliveryNoticeShipping.licensePlateNo"
                          :title="form.deliveryNoticeShipping.licensePlateNo"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.deliveryDate')}`">
                        <el-date-picker
                          :value="form.deliveryNoticeShipping.stockedOutTime"
                          :format="fmtForYmdhms"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                          disabled
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="7">
              <FormCollapseItemTitle slot="title" :title="$t('INVENTORY.stockInDetails')">
              </FormCollapseItemTitle>
              <stockInDetailsProductTable
                ref="stockInDetailsProductTable"
                :goodsReceiptNoteDetails="stockInForm.goodsReceiptNoteDetails || []"
              />
              <template v-if="false">
                <el-form :model="stockInForm" label-width="180px">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('INVENTORY.warehouse')}`">
                        <el-input
                          :value="stockInForm.warehouseName"
                          :title="stockInForm.warehouseName"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('INVENTORY.goodsReceiptNoteNo')}`">
                        <el-input
                          :value="stockInForm.goodsReceiptNoteNo"
                          :title="stockInForm.goodsReceiptNoteNo"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('INVENTORY.certificateNo')}`">
                        <el-input
                          :value="stockInForm.stockCertificateNo"
                          :title="stockInForm.stockCertificateNo"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('INVENTORY.time')}`">
                        <el-date-picker
                          :value="stockInForm.modifiedTime"
                          :format="fmtForYmdhms"
                          disabled
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('INVENTORY.operator')}`">
                        <el-input
                          :value="stockInForm.modifiedBy"
                          :title="stockInForm.modifiedBy"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div class="pb20">
                  <el-table
                    border
                    :data="stockInForm.goodsReceiptNoteDetails || []"
                    :max-height="390"
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
                      prop="productName"
                      :label="$t('PRODUCT.productName')"
                      min-width="220"
                      show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                      prop="internalPartNo"
                      :label="$t('PRODUCT.internalPartNo')"
                      min-width="180"
                      show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                      prop="alias"
                      :label="$t('PRODUCT.alias')"
                      min-width="180"
                      show-overflow-tooltip
                    >
                    </el-table-column>
                    <!-- <el-table-column
                    prop="partNo"
                    :label="$t('PRODUCT.partNo')"
                    min-width="180"
                    show-overflow-tooltip
                  >
                  </el-table-column> -->
                    <el-table-column
                      prop="uom"
                      :label="$t('INVENTORY.uom1')"
                      min-width="120"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span :title="showUomLabel(scope.row.uom)">{{ scope.row.uom }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="stockInQty"
                      :label="$t('INVENTORY.stockInQTY')"
                      min-width="180"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span>{{ $numberStr(scope.row.stockInQty, scope.row.decimalNum) }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>

    <selectRequiredByTable ref="selectRequiredByTable" @update="updateRequiredBy" />

    <ApprovedDialog
      :id="form.transferOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.transferOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.transferOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <RevisionComparisonDlg module-key="transferOrder" ref="RevisionComparisonDlg" />
  </FormPageLayoutTabs>
</template>

<script>
import { queryUsersNeedSameLegalEntity } from '@/api/system/user'
import {
  saveTransferOrder,
  queryTransferOrderById,
  approvedTransferOrder,
  rejectedTransferOrder,
  cancelledTransferOrder,
  withdrawApproved
} from '@/api/inventoryManagement/transferOrder'

import locale from '@/views/salesManagement/lang/index'
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import ProductInfo from './productInfo/productInfo.vue'
import selectRequiredByTable from './components/selectRequiredByTable.vue'
import stockInDetailsProductTable from './productInfo/stockInDetailsProductTable.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'

import RevisionComparisonDlg from '@/components/RevisionComparison'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
export default {
  dicts: ['transfer_order_status'],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    RevisionComparisonDlg,
    SystemOperationLogTable,
    ProductInfo,
    selectRequiredByTable,
    stockInDetailsProductTable
  },
  data() {
    return {
      activeName: 'basicInfo',
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {
        transferOrderProductList: []
      },
      stockOutForm: {},
      stockInForm: {},
      requiredByOptions: [],
      requiredByOptionsLoading: false,
      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanSeeUpdateMsg: '0'
      },
      rules: {
        fromWarehouseName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        requiredBy: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        scheduledTransferDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        reason: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],

        toWarehouseName: [
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

      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedTransferOrder,
      rejectedUrl: rejectedTransferOrder,
      cancelledUrl: cancelledTransferOrder,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      basicUpdateMsgList: [],
      updateMsg: {},
      isComparison: false,
      transferOrderProductListCur: []
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
      return this.checkPermi(['inventoryManagement:transferOrder:edit'])
    },
    comDisFrom() {
      if (this.approvedBtnShow && this.isComparison) {
        return true
      }
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.transferOrderId &&
        this.buttonAuthMsg.isCanUpdate === '1'
      ) {
        dis = false
      }
      return dis
    },
    isShowEditBtn() {
      if (!this.editAuth) {
        return false
      }
      return (
        ['1', '3'].includes(this.dataType) &&
        this.form.transferOrderId &&
        this.buttonAuthMsg.isCanUpdate === '1' &&
        this.approvedBtnShow &&
        this.isComparison
      )
    },
    approvedBtnShow() {
      let show = false
      /* BPM管理员操作todo进入 不需要判断 this.buttonAuthMsg */
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.transferOrderId &&
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
        this.form.transferOrderId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['inventoryManagement:transferOrder:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.transferOrderId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['inventoryManagement:transferOrder:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.transferOrderId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    modifyHighlight() {
      return (
        this.approvedBtnShow &&
        this.buttonAuthMsg.isCanSeeUpdateMsg === '1' &&
        this.isComparison
      )
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.transferOrderId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
    },
    handleClick() {},

    handleUpdate() {
      this.reset()
      this.queryRequiredByOptions()
      queryTransferOrderById({
        transferOrderId: this.rowId
      }).then((res) => {
        const data = res.data || {}
        data.transferOrderProductList = data.transferOrderProductList || []
        data.deliveryNoticeShipping = data.deliveryNoticeShipping || {}
        this.form = data

        this.stockOutForm = data.deliveryNotice || {}
        this.stockInForm = data.goodsReceiptNote || {}

        // if (
        //   data.goodsReceiptNote &&
        //   data.goodsReceiptNote.goodsReceiptNoteDetails &&
        //   data.goodsReceiptNote.goodsReceiptNoteDetails.length > 0
        // ) {
        //   data.goodsReceiptNote.goodsReceiptNoteDetails.forEach((x) => {
        //     this.$set(x, 'warehouseName', this.stockInForm.warehouseName)
        //     this.$set(x, 'goodsReceivedNoteNo', this.stockInForm.goodsReceivedNoteNo)
        //     this.$set(x, 'stockCertificateNo', this.stockInForm.stockCertificateNo)
        //   })
        // }

        this.buttonAuthMsg = data.buttonAuthMsg || {}
        /* 版本比对 */
        this.initVersionComparison(data, data.transferOrderProductList)

        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },
    initVersionComparison(data, currentProductList) {
      const updateMsg = data.updateMsg || {}
      const cloneList = (list) => JSON.parse(JSON.stringify(list || []))
      const deletedProductList = cloneList(updateMsg.beforeProductList).filter(
        (item) => item.updateType === '3'
      )

      this.updateMsg = updateMsg
      this.basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
      this.basicUpdateProps = this.basicUpdateMsgList.map((item) => item.name)
      this.transferOrderProductListCur = cloneList(currentProductList)
      this.isComparison =
        this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.approvedBtnShow
      if (this.isComparison === true) {
        setTimeout(() => {
          if (this.isComparison) {
            this.revisionComparison()
          }
        }, 300)
      }

      const comparisonProductList = [
        ...cloneList(currentProductList),
        ...deletedProductList
      ]
      this.$set(
        this.form,
        'transferOrderProductList',
        this.isComparison ? comparisonProductList : cloneList(currentProductList)
      )
    },
    // 表单重置
    reset() {
      this.form = {
        /* 基础信息 */
        validity: undefined,
        ourRef: undefined,
        mobilePhone: undefined,
        receiveAddressForPort: {},
        addressForWarehouse: {},
        transferOrderProductList: [],
        deliveryNoticeShipping: {}
      }
      this.stockOutForm = {}
      this.stockInForm = {}
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4', '5', '6', '7', '11']
      this.resetForm('form1')
      this.resetForm('form2')
      this.basicUpdateProps = []
      this.basicUpdateMsgList = []
      this.updateMsg = {}
      this.isComparison = false
      this.transferOrderProductListCur = []
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    /* 表单部分Start */
    /* 第一部分表单 */
    queryRequiredByOptions() {
      const timer = Date.now()
      this.queryRBTimer = timer
      this.requiredByOptionsLoading = true
      queryUsersNeedSameLegalEntity({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.transferOrder
      })
        .then((response) => {
          if (this.queryRBTimer !== timer) return
          this.requiredByOptionsLoading = false
          this.requiredByOptions = response.rows
        })
        .catch(() => {
          if (this.queryRBTimer !== timer) return
          this.requiredByOptionsLoading = false
        })
    },
    openRequiredByTable() {
      this.$refs.selectRequiredByTable.handleOpen()
    },
    requiredByClear() {
      this.$set(this.form, 'requiredBy', undefined)
      this.$set(this.form, 'requiredId', undefined)
    },
    updateRequiredBy(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'requiredBy', nickName)
      this.$set(this.form, 'requiredId', userId)
    },

    /* 第二部分表单 */
    openWarehouseFormTable() {
      const params = {
        queryType: 'from',
        alreadySelectWarehouseId: this.form.toWarehouseId
      }
      this.$refs.selectWarehouseTable.handleOpen(params)
    },
    openWarehouseToTable() {
      const params = {
        queryType: 'to',
        alreadySelectWarehouseId: this.form.fromWarehouseId
      }
      this.$refs.selectWarehouseTable.handleOpen(params)
    },
    updateWarehouse(row, type) {
      if (type === 'to') {
        this.$set(this.form, 'toWarehouseName', row.warehouseName)
        this.$set(this.form, 'toWarehouseId', row.warehouseId)
        this.$set(this.form, 'toWarehouseAddressShowStr', row.warehouseAddressShowStr)
        this.$set(this.form, 'toUserId', row.userId)
        this.$set(this.form, 'toUserBy', row.nickName)
        this.$set(this.form, 'toMobileCode', row.mobileCode)
        this.$set(this.form, 'toMobileNum', row.mobileNum)
        this.$set(this.form, 'toMobilePhone', row.mobilePhone)
        this.$set(this.form, 'toEmail', row.email)
      } else {
        this.$set(this.form, 'fromWarehouseName', row.warehouseName)
        this.$set(this.form, 'fromWarehouseId', row.warehouseId)
      }
    },
    warehouseFromClear() {
      this.$set(this.form, 'fromWarehouseName', undefined)
      this.$set(this.form, 'fromWarehouseId', undefined)
    },
    warehouseToClear() {
      this.$set(this.form, 'toWarehouseName', undefined)
      this.$set(this.form, 'toWarehouseId', undefined)
      this.$set(this.form, 'toWarehouseAddressShowStr', undefined)
      this.$set(this.form, 'toUserId', undefined)
      this.$set(this.form, 'toUserBy', undefined)
      this.$set(this.form, 'toMobileCode', undefined)
      this.$set(this.form, 'toMobileNum', undefined)
      this.$set(this.form, 'toMobilePhone', undefined)
      this.$set(this.form, 'toEmail', undefined)
    },
    /* 表单部分End */

    async submitForm() {
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('INVENTORY.deliveryInfo'))
        )
        return
      }

      const valid2 = await this.$refs.form2.validate().catch((err) => {
        return err
      })
      this.collapseWarningForShippingInfo = !valid2
      if (!valid2) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('INVENTORY.shippingInfo'))
        )
        return
      }
      if (valid1 && valid2) {
        let param = { ...this.form }
        const validProduct = this.validProductList(param.transferOrderProductList)
        if (!validProduct) {
          this.$refs.ProductInfo.activeName = 'productDetail'
          this.collapseWarningForProductInfo = true
          return
        }
        this.collapseWarningForProductInfo = false
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        const confirmMsg = this.$t('INVENTORY.transferOrderSubmit')
        const successMsg = this.$t('INVENTORY.transferOrderSuccess')
        const submitFn = saveTransferOrder

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
        this.$modal.msgError(this.$t('INVENTORY.productTableEmpty'))
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('INVENTORY.qty')))
        return valid
      }
      return true
    },
    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.form.transferOrderId)
    },
    exitComparison() {
      this.isComparison = false
      this.$set(
        this.form,
        'transferOrderProductList',
        JSON.parse(JSON.stringify(this.transferOrderProductListCur))
      )
    },
    getBeforeValue(prop) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop) || {}
      if (prop === 'scheduledTransferDate') {
        return this.parseTime(item.beforeValue, this.fmtForYmd)
      }
      return item.beforeValue
    },
    getAfterValue(prop, fallback) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop)
      if (!item || item.afterValue === undefined) {
        return fallback
      }
      if (prop === 'scheduledTransferDate') {
        return this.parseTime(item.afterValue, this.fmtForYmd)
      }
      return item.afterValue
    },
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
      return ''
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
          `${this.$t('INVENTORY.transferOrder')} [${vm.form.transferOrderNo}]`
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
          `${this.$t('INVENTORY.transferOrder')} [${vm.form.transferOrderNo}]`
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
          `${this.$t('INVENTORY.transferOrder')} [${vm.form.transferOrderNo}]`
        )
      )
      vm.back('onCancelSuccess')
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
.legend-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;

  .legend-text {
    color: #606266;
  }
  .legend-divider {
    width: 1px;
    height: 14px;
    background: #e0e0e0;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .color-block {
    width: 16px;
    height: 16px;
    border: 1px solid #c0c4cc;
    border-radius: 3px;

    &.add {
      background-color: #d2e3fc;
      border-color: #1a73e8;
    }
    &.edit {
      background-color: #f0f7ff;
      border-color: #c2d7fb;
    }
    &.del {
      background-color: #f5f5f4;
      border-color: #78716c;
    }
  }
}
.reject-remarks {
  color: #444;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}
.reject-by {
  margin-top: 4px;
  color: #999;
  font-size: 11px;
}
.reject-card {
  border: 1px solid #e2e8f0;
}
.reject-card ::v-deep .el-collapse-item__header,
.reject-card ::v-deep .el-collapse-item__wrap {
  background-color: #f8fafc;
}
.reject-card ::v-deep .el-collapse-item__header {
  border-bottom: 1px solid #e2e8f0;
}
</style>
