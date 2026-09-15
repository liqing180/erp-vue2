<template>
  <FormPageLayoutTabs ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-else-if="isCanUpdateSICProduct"
        @click="submitForm('UpdateSICProduct')"
        >{{ $t('uiBtn.submit') }}
      </el-button>

      <el-button type="primary" size="mini" v-if="approvedBtnShow" @click="handleApproved"
        >{{ $t('uiBtn.approve') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="rejectedBtnShow" @click="handleRejected"
        >{{ $t('uiBtn.reject1') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
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
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">{{ $t('menu.storeIssueChit') }}</div>
    </template>
    <template v-slot:tabs>
      <el-tabs v-model="activeName" size="mini" type="card" @tab-click="handleClick">
        <el-tab-pane
          :label="$t('SALES.storeIssueChitDetails')"
          name="storeIssueChitDetails"
        ></el-tab-pane>
        <el-tab-pane :label="$t('SALES.stockOutInDetails')" name="stockOutInDetails"></el-tab-pane>
      </el-tabs>
    </template>
    <template v-slot:content>
      <div v-show="activeName === 'storeIssueChitDetails'">
        <div class="form-card mb10" v-if="isComparison">
          <div class="legend-bar">
            <span class="legend-text">{{ $t('ui.legend') }}</span>
            <span class="legend-divider"></span>
            <span class="legend-item"
              ><span class="color-block add"></span>{{ $t('ui.added') }}</span
            >
            <span class="legend-divider"></span>
            <span class="legend-item">
              <span class="color-block edit"></span>{{ $t('ui.modified') }}
            </span>
            <span class="legend-divider"></span>
            <span class="legend-item"
              ><span class="color-block del"></span>{{ $t('ui.deleted') }}</span
            >
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
                  {{ $t('ui.rejectedBy1') }}：{{
                    (form.operationLogForLastReject || {}).operatorBy
                  }}
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
                :title="$t('ui.basicInfo')"
                :warning="collapseWarningForBasicInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="form1"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="130px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.type')}`" prop="storeIssueChitType">
                      <ComparisonInput
                        v-if="isModified('storeIssueChitTypeShowStr')"
                        :beforeValue="getBeforeValue('storeIssueChitTypeShowStr')"
                        :afterValue="
                          getAfterValue(
                            'storeIssueChitTypeShowStr',
                            selectDictLabel(
                              dict.type.store_issue_chit_type,
                              form.storeIssueChitType
                            )
                          )
                        "
                      />
                      <el-select
                        v-else
                        v-model="form.storeIssueChitType"
                        placeholder=""
                        style="width: 100%"
                        clearable
                        @change="typeChange"
                        disabled
                      >
                        <el-option
                          v-for="item in dict.type.store_issue_chit_type"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('SALES.storeIssueChitNo')">
                      <el-input
                        :value="form.storeIssueChitNo"
                        :title="form.storeIssueChitNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('ui.status')">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.store_issue_chit_status,
                            form.storeIssueChitStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.warehouse')}`"
                      prop="warehouseName"
                      :class="[isModified('warehouseName')]"
                    >
                      <!-- <SelectInput
                        :clearable="!isCanUpdateSICProduct"
                        :value="form.warehouseName"
                        :title="form.warehouseName"
                        @click="openWarehouseTable"
                        @clear="warehouseClear"
                        :disabled="!(!comDisFrom || isCanUpdateSICProduct)"
                      /> -->

                      <div class="input-switch-box">
                        <div class="con-left">
                          <el-select
                            v-model="form.warehouseIdList"
                            :title="form.warehouseName"
                            placeholder=""
                            style="width: 100%"
                            :clearable="!(!comDisFrom || isCanUpdateSICProduct)"
                            :filterable="false"
                            @change="warehouseIdListChange"
                            default-first-option
                            multiple
                            collapse-tags
                            class="log-msg-ellipsis"
                            v-default-select="[enterpriseIds]"
                            :disabled="
                              !(!comDisFrom || isCanUpdateSICProduct) || warehouseIdListLoading
                            "
                            :loading="warehouseIdListLoading"
                          >
                            <el-option
                              v-for="item in warehouseList"
                              :key="item.warehouseId"
                              :label="item.warehouseName"
                              :value="item.warehouseId"
                              :disabled="enterpriseIds.indexOf(item.warehouseId) !== -1"
                            >
                            </el-option>
                          </el-select>
                        </div>

                        <div class="con-right" v-if="!comDisFrom || isCanUpdateSICProduct">
                          <svg-icon
                            icon-class="list2"
                            class="primary-pointer"
                            style="font-size: 26px"
                            @click="openWarehouseTable"
                          />
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.dept')}`" prop="departmentId">
                      <ComparisonInput
                        v-if="isModified('departmentName')"
                        :beforeValue="getBeforeValue('departmentName')"
                        :afterValue="getAfterValue('departmentName', form.departmentName)"
                      />
                      <el-select
                        v-else
                        v-model="form.departmentId"
                        :title="form.allSuperiorName"
                        placeholder=""
                        style="width: 100%"
                        clearable
                        @change="departmentChange"
                        :disabled="comDisFrom"
                      >
                        <el-option
                          v-for="item in deptOptions"
                          :key="item.departmentId"
                          :label="item.customLabel"
                          :value="item.departmentId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.requiredBy')}`" prop="requiredBy">
                      <ComparisonInput
                        v-if="isModified('requiredBy')"
                        :beforeValue="getBeforeValue('requiredBy')"
                        :afterValue="getAfterValue('requiredBy', form.requiredBy)"
                      />
                      <!-- <SelectInput
                        :value="form.requiredBy"
                        :title="form.requiredBy"
                        @clear="purchasePersonClear"
                        clearable
                        @click="openPurchasePersonTable"
                        :disabled="!form.departmentId || comDisFrom"
                      /> -->

                      <CommonSelectAndList
                        v-else
                        :id="form.requiredId"
                        :label="form.requiredBy"
                        idKey="userId"
                        labelKey="nickName"
                        clearable
                        filterable
                        :options="requiredList"
                        :disabled="!form.departmentId || comDisFrom || requiredByLoading"
                        :loading="requiredByLoading"
                        @change="updatePurchasePerson"
                        @handleOpen="openPurchasePersonTable"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="`${$t('ui.reason')}`"
                      prop="reason"
                      :class="[isModified('reason')]"
                    >
                      <MyInput
                        type="textarea"
                        v-model="form.reason"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                        :disabled="comDisFrom"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="checkPermi(['projectManagement:storeIssueChit:isLoan'])">
                    <el-form-item :label="`${$t('SALES.isLoan')}`" :class="[isModified('isLoan')]">
                      <el-switch
                        v-model="form.isLoan"
                        active-value="1"
                        inactive-value="0"
                        :disabled="form.storeIssueChitType === '3' || comDisFrom"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.isLoan === '1'">
                    <el-form-item :label="`${$t('SALES.returnBy')}`" prop="returnBy">
                      <ComparisonInput
                        v-if="isModified('returnBy')"
                        :beforeValue="getBeforeValue('returnBy')"
                        :afterValue="getAfterValue('returnBy', parseTime(form.returnBy, fmtForYmd))"
                      />
                      <el-date-picker
                        v-else
                        v-model="form.returnBy"
                        type="date"
                        :format="fmtForYmd"
                        :style="{ width: '100%' }"
                        placeholder
                        :picker-options="timeDatePickerOptions"
                        :disabled="comDisFrom"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <template v-if="form.logisticsType === '1'">
                    <el-col :span="8" :key="'driver' + form.logisticsType">
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
                    <el-col :span="8" :key="'driver' + form.logisticsType">
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
                  </template>

                  <template v-if="form.storeIssueChitType === '1'">
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.projectCode')}`" prop="costProjectCode">
                        <ComparisonInput
                          v-if="isModified('costProjectCode')"
                          :beforeValue="getBeforeValue('costProjectCode')"
                          :afterValue="getAfterValue('costProjectCode', form.costProjectCode)"
                        />
                        <CommonSelectAndList
                          v-else
                          :id="form.costProjectId"
                          :label="form.costProjectCode"
                          idKey="costProjectId"
                          labelKey="costProjectCode"
                          :clearable="!comDisFrom"
                          filterable
                          :disabled="comDisFrom"
                          :options="projectNameOptions"
                          :loading="costProjectNameLoading"
                          @change="costProjectNameChange"
                          @handleOpen="openCostProjectNameTable"
                        />
                      </el-form-item>
                    </el-col>
                  </template>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div
            class="form-card mt10"
            v-if="form.storeIssueChitType === '2' || form.storeIssueChitType === '3'"
          >
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.shippingInfo')"
                :warning="collapseWarningForShippingInfo"
              >
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
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerName')}`" prop="businessPartnerName">
                      <ComparisonInput
                        v-if="isModified('businessPartnerName')"
                        :beforeValue="getBeforeValue('businessPartnerName')"
                        :afterValue="getAfterValue('businessPartnerName', form.businessPartnerName)"
                      />
                      <CommonSelectAndList
                        v-else
                        :id="form.businessPartnerMainId"
                        :label="form.businessPartnerName"
                        idKey="businessPartnerMainId"
                        labelKey="businessPartnerName"
                        filterable
                        :options="businessPartnerOptions"
                        @change="updateCustomer"
                        @handleOpen="openCustomerTable"
                        :disabled="comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('SALES.deliveryAddress')}`" prop="receiveAddress">
                      <ComparisonInput
                        v-if="isModified('receiveAddress')"
                        :beforeValue="getBeforeValue('receiveAddress')"
                        :afterValue="getAfterValue('receiveAddress', form.receiveAddress)"
                      />
                      <div v-else class="input-switch-box">
                        <div class="con-left">
                          <CommonSelectAndList
                            :id="form.receiveAddressId"
                            :label="form.receiveAddress"
                            idKey="businessAddressId"
                            labelKey="receiveAddress"
                            filterable
                            :options="businessAddressOptions"
                            :disabled="!form.businessPartnerId || comDisFrom"
                            @change="deliveryAddressChange"
                            @handleOpen="openReceiveAddressTable"
                          />
                        </div>
                        <div class="con-right" v-if="form.businessPartnerId && !comDisFrom">
                          <i
                            class="el-icon-edit primary"
                            style="font-size: 20px"
                            @click="openAddBPAddressDlg"
                          ></i>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.contactPerson')}`"
                      prop="bpContactPersonName"
                    >
                      <ComparisonInput
                        v-if="isModified('bpContactPersonName')"
                        :beforeValue="getBeforeValue('bpContactPersonName')"
                        :afterValue="getAfterValue('bpContactPersonName', form.bpContactPersonName)"
                      />
                      <div v-else class="input-switch-box">
                        <div class="con-left">
                          <CommonSelect
                            :id="form.bpContactPersonId"
                            :label="form.bpContactPersonName"
                            :title="form.bpContactPersonName"
                            idKey="contactPersonId"
                            labelKey="contactPersonName"
                            :options="form.bpBusinessContactPersonList || []"
                            @change="contactPersonChange"
                          />
                        </div>
                        <div class="con-right" v-if="form.businessPartnerId && !comDisFrom">
                          <i
                            class="el-icon-edit primary"
                            style="font-size: 20px"
                            @click="openAddBPContactPersonDlg"
                          ></i>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <ComparisonInput
                        v-if="isModified('bpEmail')"
                        :beforeValue="getBeforeValue('bpEmail')"
                        :afterValue="getAfterValue('bpEmail', form.bpEmail)"
                      />
                      <el-input
                        v-else
                        v-model="form.bpEmail"
                        :title="form.bpEmail"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.mobilePhone')}`">
                      <ComparisonInput
                        v-if="isModified('bpMobilePhone')"
                        :beforeValue="getBeforeValue('bpMobilePhone')"
                        :afterValue="getAfterValue('bpMobilePhone', form.bpMobilePhone)"
                      />
                      <el-input
                        v-else
                        v-model="form.bpMobilePhone"
                        :title="form.bpMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- v-if="form.storeIssueChitType === '2'" -->
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.projectCode')}`" prop="costProjectCode">
                      <ComparisonInput
                        v-if="isModified('costProjectCode')"
                        :beforeValue="getBeforeValue('costProjectCode')"
                        :afterValue="getAfterValue('costProjectCode', form.costProjectCode)"
                      />
                      <CommonSelectAndList
                        v-else
                        :id="form.costProjectId"
                        :label="form.costProjectCode"
                        idKey="costProjectId"
                        labelKey="costProjectCode"
                        :clearable="!comDisFrom"
                        filterable
                        :disabled="comDisFrom"
                        :options="projectNameOptions"
                        :loading="costProjectNameLoading"
                        @change="costProjectNameChange"
                        @handleOpen="openCostProjectNameTable"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" ref="collapseScrollPage">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('menu.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>

              <ProductTable
                ref="ProductTable"
                :pqProductList="initProductList"
                :businessPartnerId="form.businessPartnerId"
                :countryId="form.countryId"
                @updateTable="updateProductTable"
                :comDisFrom="comDisFrom"
                :modifyHighlight="modifyHighlight"
                :basicUpdateProps="basicUpdateProps"
                :warehouseList="form.warehouseList || []"
                :warehouseIdList="form.warehouseIdList || []"
                :costProjectId="form.costProjectId"
                :storeIssueChitId="form.storeIssueChitId"
                :isCanUpdateSICProduct="isCanUpdateSICProduct"
                @scrollPageToTable="scrollPageToTable"
              />
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
                    {{ $t('ui.operTime') }} :
                    {{ parseTime(form.operationLogForLast.operatorTime) }}
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
        <stockOutInDetails ref="stockOutInDetails" :formData="form" />
      </div>
    </template>

    <ApprovedDialog
      :id="form.storeIssueChitId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.storeIssueChitId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.storeIssueChitId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <RevisionComparisonDlg module-key="storeIssueChit" ref="RevisionComparisonDlg" />

    <selectCustomerTable ref="selectCustomerTable" @update="updateCustomer" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />

    <selectDriverDlg ref="selectDriverDlg" @onSuccess="updateDriver" />
    <selectVehicleDlg ref="selectVehicleDlg" @onSuccess="updateVehicle" />

    <selectPurchasePersonTable
      ref="selectPurchasePersonTable"
      :departmentId="form.departmentId"
      @update="updatePurchasePerson"
    />

    <payToAddressDlg
      ref="payToAddressDlg"
      :supplierId="form.businessPartnerMainId"
      @update="deliveryAddressChange"
    />

    <addBPAddressDlg ref="addBPAddressDlg" :isStoreIssueChit="true" @update="addBPAddress" />

    <addBPContactPersonDlg
      ref="addBPContactPersonDlg"
      :businessPartnerType="form.businessPartnerType"
      :isStoreIssueChit="true"
      @update="addBPContactPerson"
    />

    <selectCostProjectTable
      ref="selectCostProjectTable"
      :businessPartnerId="form.businessPartnerId"
      @update="costProjectNameChange"
    />
  </FormPageLayoutTabs>
</template>

<script>
import {
  queryStoreIssueChitById,
  saveStoreIssueChit,
  updateStoreIssueChitProduct,
  checkStoreIssueChitProductHaveChange,
  approvedStoreIssueChit,
  rejectedStoreIssueChit,
  cancelledStoreIssueChit,
  withdrawApproved,
  queryLegalEntityDepartmentList
} from '@/api/projectManagement/storeIssueChit'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryAddressByBusinessPartnerId } from '@/api/purchaseManagement/purchaseContract'
import { queryCanSelectCostProjectList } from '@/api/projectManagement/project'
import {
  queryCanSelectCustomerListHavePage,
  queryCanSelectWarehouseListHaveDataPermissions
} from '@/api/salesManagement/salesInquiry'
import { queryUsers } from '@/api/organization/corporate'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import ProductTable from './productTable.vue'
import selectCustomerTable from './components/selectCustomerTable.vue'
import stockOutInDetails from './components/stockOutInDetails.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import RevisionComparisonDlg from '@/components/RevisionComparison'
import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'
import selectWarehouseTable from './components/multipSelectWarehouseTable.vue'
import payToAddressDlg from '@/views/salesManagement/salesInquiry/components/payToAddressDlg.vue'
import selectDriverDlg from './components/selectDriverDlg.vue'
import selectVehicleDlg from './components/selectVehicleDlg.vue'
import addBPAddressDlg from '@/views/salesManagement/salesInquiry/components/addBPAddressDlg.vue'
import addBPContactPersonDlg from '@/views/salesManagement/salesInquiry/components/addBPContactPersonDlg.vue'
import selectCostProjectTable from '@/views/projectManagement/projectProduction/components/selectCostProjectTable.vue'

export default {
  mixins: [pageMixin],
  dicts: ['store_issue_chit_status', 'store_issue_chit_type', 'logistics_type'],
  components: {
    ProductTable,
    selectCustomerTable,
    SystemOperationLogTable,
    RevisionComparisonDlg,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    stockOutInDetails,
    selectPurchasePersonTable,
    selectWarehouseTable,
    payToAddressDlg,
    selectDriverDlg,
    selectVehicleDlg,
    addBPAddressDlg,
    addBPContactPersonDlg,
    selectCostProjectTable
  },
  data() {
    const vm = this
    return {
      saveKey: '12',
      activeNames: [],
      activeName: 'storeIssueChitDetails',
      rowId: '',
      timeId: '',
      submitLoading: false,

      form: {},
      projectNameOptions: [],
      costProjectNameLoading: false,
      businessPartnerOptions: [],
      businessAddressOptions: [],
      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      rules: {
        type: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        warehouseId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        warehouseIdList: [
          {
            required: true,
            type: 'array',
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        departmentIdList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        requiredBy: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('SALES.requiredBy')),
            trigger: ['change', 'blur']
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
        ],

        reason: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        returnBy: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        businessPartnerName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        bpContactPersonName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        receiveAddress: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      startTimeDateOptions: {
        disabledDate(time) {
          const { endDateTime } = vm.form
          if (!endDateTime) {
            return time.getTime() > new Date().getTime()
          }
          return time.getTime() > endDateTime || time.getTime() > new Date().getTime()
        }
      },
      endTimeDateOptions: {
        disabledDate(time) {
          const { startDateTime } = vm.form
          // if (!startDateTime) {
          //   return time.getTime() > new Date().getTime()
          // }
          // return time.getTime() <= startDateTime - 8.64e7 || time.getTime() > new Date().getTime()
          if (startDateTime) {
            return time.getTime() <= startDateTime - 8.64e7
          }
        }
      },
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

      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0',
        isCanSeeUpdateMsg: '0'
      },
      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedStoreIssueChit,
      rejectedUrl: rejectedStoreIssueChit,
      cancelledUrl: cancelledStoreIssueChit,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      basicUpdateMsgList: [],
      updateMsg: {},
      isComparison: false,
      productListCur: [],
      bpHistoryVersionList: [],
      /* 表格部分 */
      initServiceProductList: [],
      serviceProductDetailList: [],
      initProductList: [],
      productDetailList: [],
      collapseWarningForProductInfo: false,
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
      currencyOptions: [],
      warehouseOptions: [],
      props: {
        multiple: true,
        value: 'id',
        label: 'name',
        children: 'child',
        emitPath: false,
        checkStrictly: true
      },
      departmentList: [],
      requiredByOptions: [],
      accountSupplierUpdateProps: [],
      accountCustomerUpdateProps: [],
      deptOptions: [],
      warehouseList: [],
      requiredList: [],
      loading: false,
      warehouseIdListLoading: false,
      requiredByLoading: false,
      enterpriseIds: []
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
        this.handleUpdate()
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
      return this.checkPermi(['projectManagement:storeIssueChit:edit'])
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
        this.form.storeIssueChitId &&
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
        this.form.storeIssueChitId &&
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
        this.form.storeIssueChitId &&
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
        this.form.storeIssueChitId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    isCanUpdateSICProduct() {
      if (!this.editAuth || this.isComparison) {
        return false
      }
      if (
        ['1'].includes(this.dataType) &&
        this.form.storeIssueChitId &&
        this.buttonAuthMsg.isCanUpdateSICProduct === '1'
      ) {
        return true
      }
      return false
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['inventoryManagement:storeIssueChit:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.storeIssueChitId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['inventoryManagement:storeIssueChit:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.storeIssueChitId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },
    modifyHighlight() {
      return (
        this.approvedBtnShow && this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.isComparison
      )
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    queryCanSelectWarehouseListHaveDataPermissions() {
      this.warehouseIdListLoading = true
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$trimOfObj(param)
      param.warehouseTypeList = ['1', '2']
      param.menuPerms = this.menuKey.storeIssueChit

      queryCanSelectWarehouseListHaveDataPermissions(param)
        .then((response) => {
          const rows = response.rows || []
          this.warehouseList = rows
          this.warehouseIdListLoading = false
        })
        .catch(() => {
          this.warehouseIdListLoading = false
        })
    },
    queryUsers() {
      const param = {
        pageNum: 1,
        pageSize: 9999,
        departmentId: this.form.departmentId
      }
      this.$trimOfObj(param)
      param.menuPerms = this.menuKey.storeIssueChit
      this.requiredByLoading = true
      queryUsers(param)
        .then((response) => {
          this.total = response.total
          this.requiredList = response.rows || []
          this.requiredByLoading = false
        })
        .catch((err) => {
          this.requiredByLoading = false
          window.console.error(err)
        })
    },

    queryAddressByBusinessPartnerId() {
      if (!this.form.businessPartnerMainId) {
        return
      }
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$trimOfObj(param)
      param.businessPartnerMainId = this.form.businessPartnerMainId
      queryAddressByBusinessPartnerId(param)
        .then((response) => {
          const rows = response.rows || []
          this.businessAddressOptions = rows
        })
        .catch((err) => {
          window.console.error(err)
        })
    },
    openReceiveAddressTable() {
      this.$refs.payToAddressDlg.handleOpen()
    },
    openAddBPAddressDlg() {
      if (this.form.isAdhocEntryAddress === '1') {
        this.$refs.addBPAddressDlg.handleEdit(this.form.bpBusinessAddress)
      } else if (this.form.bpBusinessAddressOldData) {
        this.$refs.addBPAddressDlg.handleEdit(this.form.bpBusinessAddressOldData)
      } else {
        this.$refs.addBPAddressDlg.handleEdit()
      }
    },
    addBPAddress(row) {
      row.isAdhocEntryAddress = '1'
      this.$set(this.form, 'bpBusinessAddress', row)
      this.$set(this.form, 'bpBusinessAddressOldData', row)
      this.$set(this.form, 'receiveAddressName', row.receiveAddressName || row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
      this.$set(this.form, 'isAdhocEntryAddress', '1')
    },
    openAddBPContactPersonDlg() {
      if (this.form.isAdhocEntryContactPerson === '1') {
        this.$refs.addBPContactPersonDlg.handleEdit(this.form.bpBusinessContactPerson)
      } else {
        this.$refs.addBPContactPersonDlg.handleEdit()
      }
    },
    addBPContactPerson(row) {
      row.isAdhocEntryContactPerson = '1'
      this.$set(this.form, 'bpBusinessContactPerson', row)
      this.$set(this.form, 'bpBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'bpContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'bpMobileNum', row.mobileNum)
      this.$set(this.form, 'bpMobileCode', row.mobileCode)
      this.$set(this.form, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.form, 'bpEmail', row.email)
      this.$set(this.form, 'isAdhocEntryContactPerson', '1')
    },
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.storeIssueChitId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
    },
    handleUpdate() {
      this.reset()
      this.queryCanSelectWarehouseListHaveDataPermissions()
      this.queryLegalEntityDepartmentList()
      this.queryCurrencyListBySelect()
      this.queryBusinessPartnerOptions()
      const rowId = this.rowId
      queryStoreIssueChitById({ storeIssueChitId: rowId }).then((res) => {
        const data = res.data || {}
        // this.tableList = data.purchaseRequisiteDetailList || []
        this.operationLogList = data.operationLogList || []
        this.form = data
        this.enterpriseIds = JSON.parse(JSON.stringify(data.warehouseIdList || []))

        this.buttonAuthMsg = data.buttonAuthMsg || {}
        this.disEditWarehouseIdList = data.warehouseIdList
        /* 版本比对 */
        this.initVersionComparison(data, data.storeIssueChitProductList)
        this.queryCanSelectCostProjectList()
        this.queryAddressByBusinessPartnerId()
        this.queryUsers()
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
      this.productListCur = cloneList(currentProductList)
      this.isComparison = this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.approvedBtnShow
      if (this.isComparison === true) {
        setTimeout(() => {
          if (this.isComparison) {
            this.revisionComparison()
          }
        }, 300)
      }

      const comparisonProductList = [...cloneList(currentProductList), ...deletedProductList]
      this.initProductList = this.isComparison
        ? comparisonProductList
        : cloneList(currentProductList)
    },
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.getUpdateItem(prop).name) {
        return 'edit-outline'
      }
      return ''
    },
    handleClick() {},
    queryLegalEntityDepartmentList() {
      queryLegalEntityDepartmentList({}).then((res) => {
        this.deptOptions = res.data || []
        this.deptOptions.forEach((item) => {
          item.customLabel =
            (item.branchCompanyName ? item.branchCompanyName + ' - ' : '') + item.departmentName
        })
      })
    },
    departmentChange(value) {
      const item = this.deptOptions.find((item) => item.departmentId === value) || {}
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
      /* if (this.form.requiredId !== this.$store.state.user.userId) {
      } */
      this.purchasePersonClear()
      this.queryUsers()
    },
    openPurchasePersonTable() {
      this.$refs.selectPurchasePersonTable.handleOpen()
    },
    purchasePersonClear() {
      this.$set(this.form, 'requiredBy', undefined)
      this.$set(this.form, 'requiredId', undefined)
    },
    updatePurchasePerson(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'requiredBy', nickName)
      this.$set(this.form, 'requiredId', userId)
    },
    warehouseIdListChange() {
      if (this.form.warehouseIdList.length) {
        const list = this.warehouseList.filter(
          (x) => this.form.warehouseIdList.indexOf(x.warehouseId) !== -1
        )
        this.updateWarehouse(list)
      } else {
        this.warehouseClear()
      }
    },
    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen(
        this.form.warehouseList || [],
        this.disEditWarehouseIdList
      )
    },
    updateWarehouse(list) {
      const rows = list || []
      this.$set(this.form, 'warehouseList', rows)
      this.$set(
        this.form,
        'warehouseIdList',
        rows.map((item) => item.warehouseId)
      )
      this.$set(this.form, 'warehouseId', this.form.warehouseIdList.join(','))
      this.$set(this.form, 'warehouseName', rows.map((item) => item.warehouseName).join(', '))
    },
    warehouseClear() {
      this.$set(this.form, 'warehouseList', [])
      this.$set(this.form, 'warehouseIdList', [])
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseId', undefined)
    },
    reset() {
      this.form = {
        storeIssueChitType: undefined,
        businessPartnerName: undefined,
        purchaseQuotationStatus: '1',
        serviceOrderNo: undefined,
        businessPartnerId: undefined,
        contactPersonName: undefined,
        bpBusinessContactPersonList: [],
        bpBusinessAddressList: [],
        serviceTypeList: [],
        email: undefined,
        mobilePhone: undefined,
        startDateTime: undefined,
        endDateTime: undefined,
        isLoan: '1',
        logisticsType: undefined,
        departmentId: undefined,
        receiveAddress: undefined,
        warehouseIdList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initServiceProductList = []
      this.serviceProductDetailList = []
      this.initProductList = []
      this.productDetailList = []
      this.activeNames = ['1', '2', '3', '4', '11']
      this.activeName = 'storeIssueChitDetails'
      this.resetForm('form1')
      this.resetForm('form2')
      this.basicUpdateProps = []
      this.basicUpdateMsgList = []
      this.updateMsg = {}
      this.isComparison = false
      this.productListCur = []
    },
    typeChange() {
      if (this.form.storeIssueChitType === '3') {
        this.$set(this.form, 'isLoan', '1')
      }
      if (this.form.storeIssueChitType !== '2' && this.form.storeIssueChitType !== '3') {
        this.customerClear()
      }
      if (this.projectNameOptions.length <= 0) {
        this.queryCanSelectCostProjectList()
      }
    },
    logisticsTypeChange() {
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

    // 项目名称
    queryCanSelectCostProjectList() {
      this.costProjectNameLoading = true
      queryCanSelectCostProjectList({ businessPartnerId: this.form.businessPartnerId })
        .then((response) => {
          this.projectNameOptions = response.data || []
          this.costProjectNameLoading = false
        })
        .catch((err) => {
          window.console.error(err)
          this.costProjectNameLoading = false
        })
    },
    openCostProjectNameTable() {
      this.$refs.selectCostProjectTable.handleOpen(this.form.costProjectId)
    },
    costProjectNameChange(item = {}) {
      if (!item.costProjectId) {
        this.$set(this.form, 'costProjectId', undefined)
        this.$set(this.form, 'costProjectName', undefined)
        this.$set(this.form, 'costProjectCode', undefined)
      } else {
        this.$set(this.form, 'costProjectId', item.costProjectId)
        this.$set(this.form, 'costProjectName', item.costProjectName)
        this.$set(this.form, 'costProjectCode', item.costProjectCode)
        if (this.form.storeIssueChitType === '2' && this.form.storeIssueChitType === '3') {
          const { businessAddress, businessPartner } = item
          if (
            businessPartner &&
            businessPartner.businessPartnerId &&
            !this.form.businessPartnerId
          ) {
            this.updateCustomer(businessPartner, 'formProject')
            if (businessAddress && businessAddress.businessAddressId) {
              this.deliveryAddressChange(businessAddress)
            } else if (this.form.receiveAddressId) {
              this.deliveryAddressClear()
            }
            this.queryCanSelectCostProjectList()
          }
        }
      }
      // this.initProductList = []
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },

    queryBusinessPartnerOptions() {
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$trimOfObj(param)
      param.menuPerms = this.menuKey.storeIssueChit
      queryCanSelectCustomerListHavePage(param).then((response) => {
        const rows = response.rows || []
        this.businessPartnerOptions = rows
      })
    },
    /* 表单部分Start */
    openCustomerTable() {
      this.$refs.selectCustomerTable.handleOpen()
    },
    updateCustomer(row, type) {
      if (!row.businessPartnerMainId) {
        this.customerClear()
        return
      }
      const businessPartnerId = this.form.businessPartnerId
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      this.$set(this.form, 'bpBusinessAddressList', row.bpBusinessAddressList)
      this.$set(this.form, 'abbreviation', row.abbreviation)
      this.$set(this.form, 'customerGroup', row.customerGroup)
      this.$set(this.form, 'customerType', row.customerType)

      const account = row.bpBusinessAccountSupplier || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.$set(this.form, 'paymentTermId', account.paymentTermId)
      this.$set(this.form, 'paymentTermName', account.paymentTermName)
      this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])
      this.contactPersonClear()
      if (type !== 'formProject') {
        this.deliveryAddressClear()
      }
      if (
        row.bpBusinessAddressList &&
        row.bpBusinessAddressList.length === 1 &&
        (type !== 'formProject' || !this.form.receiveAddressId)
      ) {
        this.deliveryAddressChange(row.bpBusinessAddressList[0])
      }
      const arr = row.bpBusinessContactPersonList.filter((x) => x.isDefault === '1')
      if (arr && arr.length > 0) {
        this.contactPersonChange(arr[0])
      }
      if (this.form.costProjectId && type !== 'formProject') {
        if (businessPartnerId !== this.form.businessPartnerId) {
          this.costProjectNameChange()
        }
      }
      if (type !== 'formProject') {
        this.queryCanSelectCostProjectList()
      }
      this.queryAddressByBusinessPartnerId()
    },
    deliveryAddressChange(row) {
      // this.$set(this.form, 'addressForBPAddress', row)
      this.$set(this.form, 'receiveAddressName', row.receiveAddressName || row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
    },
    deliveryAddressClear() {
      this.$set(this.form, 'receiveAddress', undefined)
      this.$set(this.form, 'bpBusinessAddress', undefined)
      this.$set(this.form, 'bpBusinessAddressId', undefined)
      this.$set(this.form, 'bpAddressDataId', undefined)
      this.$set(this.form, 'bpAddress', undefined)
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
    // 清空供应商
    customerClear() {
      this.changeBPClearProductTable({
        oldBPId: this.form.businessPartnerId,
        newBPId: undefined
      })
      this.$set(this.form, 'bpBusinessContactPersonList', [])
      this.$set(this.form, 'businessPartnerMainId', undefined)
      this.$set(this.form, 'businessPartnerId', undefined)
      this.$set(this.form, 'businessPartnerName', undefined)
      this.$set(this.form, 'businessPartnerNo', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.$set(this.form, 'abbreviation', undefined)
      this.$set(this.form, 'customerGroup', undefined)
      this.$set(this.form, 'customerType', undefined)

      this.deliveryAddressClear()
      this.contactPersonClear()
      this.costProjectNameChange()
      this.queryCanSelectCostProjectList()
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
    contactPersonChange(row) {
      this.$set(this.form, 'bpBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'bpContactPersonId', row.contactPersonId)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'bpMobileNum', row.mobileNum)
      this.$set(this.form, 'bpMobileCode', row.mobileCode)
      this.$set(this.form, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.form, 'bpEmail', row.email)
    },
    updateProductTable(list) {
      this.productDetailList = list || []
    },
    changeBPClearProductTable({ oldBPId, newBPId }) {
      if (oldBPId !== newBPId) {
        this.initProductList = []
        this.initServiceProductList = []
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
    /* 表格部分End */
    async submitForm(submitType) {
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      let valid2 = true
      if (this.form.storeIssueChitType === '2' || this.form.storeIssueChitType === '3') {
        valid2 = await this.$refs.form2.validate().catch((err) => {
          return err
        })
        this.collapseWarningForShippingInfo = !valid2

        if (!valid2) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.shippingInfo'))
          )
          return
        }
      } else {
        this.collapseWarningForShippingInfo = false
      }

      const tableList = this.$refs.ProductTable.tableList
      if (tableList.length <= 0) {
        this.collapseWarningForProductInfo = true
        this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
        return true
      }
      const qtyReq = tableList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$refs.ProductTable.errorMessage('qty')

        this.collapseWarningForProductInfo = true
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qty')))
        return
      }
      this.collapseWarningForProductInfo = false

      if (valid1 && valid2) {
        let param = { ...this.form }
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.storeIssueChitProductList = tableList
        const preemptRiskConfirmed = tableList.some((x) => x.preemptRiskConfirmed === '1')
        if (preemptRiskConfirmed) {
          param.preemptRiskConfirmed = '1'
        }
        if (submitType === 'UpdateSICProduct') {
          const haveChange = await checkStoreIssueChitProductHaveChange(param).catch(() => {
            return false
          })
          if (!haveChange) {
            return
          }
        }
        this.$modal
          .confirm(this.$t('SALES.storeIssueChitConfirm'))
          .then(() => {
            this.submitLoading = true
            const submitFn =
              submitType === 'UpdateSICProduct' ? updateStoreIssueChitProduct : saveStoreIssueChit
            return submitFn(param)
          })
          .then((response) => {
            this.submitLoading = false
            this.$modal.msgSuccess(
              this.$t('SALES.storeIssueChitSuccess').replace('$1', response.msg)
            )
            this.back()
          })
          .catch(() => {
            this.submitLoading = false
          })
      }
    },
    validServiceProductList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        // this.$modal.msgError(this.$t('SALES.prProductTableEmpty'))
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.serviceInfo'))
        )
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.qty')))
        return valid
      }

      const durationReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.duration) && item.valuationUnit !== 'order'
      })
      if (durationReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.duration')))
        return valid
      }

      const warrantyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.warranty)
      })
      if (warrantyReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyDays'))
        )
        return valid
      }

      const warrantyStartDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.warrantyStartDate)
      })
      if (warrantyStartDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyStartDate'))
        )
        return valid
      }

      return true
    },
    validProductList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        return true
        // this.$modal.msgError(
        //   this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.productInfo'))
        // )
        // return valid
      }
      const uomReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.uom)
      })
      if (uomReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.uom')))
        return valid
      }

      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.qty')))
        return valid
      }

      const warrantyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.warranty)
      })
      if (warrantyReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyDays'))
        )
        return valid
      }

      const warrantyStartDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.warrantyStartDate)
      })
      if (warrantyStartDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyStartDate'))
        )
        return valid
      }

      return true
    },

    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.form.storeIssueChitId)
    },
    exitComparison() {
      this.isComparison = false
      this.initProductList = JSON.parse(JSON.stringify(this.productListCur))
      this.$nextTick(() => {
        this.$refs.ProductTable && this.$refs.ProductTable.initList(this.initProductList)
      })
    },
    getBeforeValue(prop) {
      const item = this.getUpdateItem(prop)
      if (prop === 'returnBy') {
        return this.parseTime(item.beforeValue, this.fmtForYmd)
      }
      if (prop === 'storeIssueChitTypeShowStr' && item.name === 'storeIssueChitType') {
        return this.selectDictLabel(this.dict.type.store_issue_chit_type, item.beforeValue)
      }
      return item.beforeValue
    },
    getAfterValue(prop, fallback) {
      const item = this.getUpdateItem(prop)
      if (item.afterValue === undefined) {
        return fallback
      }
      if (prop === 'returnBy') {
        return this.parseTime(item.afterValue, this.fmtForYmd)
      }
      if (prop === 'storeIssueChitTypeShowStr' && item.name === 'storeIssueChitType') {
        return this.selectDictLabel(this.dict.type.store_issue_chit_type, item.afterValue)
      }
      return item.afterValue
    },
    getUpdateItem(prop) {
      const propAliases = {
        storeIssueChitTypeShowStr: ['storeIssueChitTypeShowStr'],
        departmentName: ['departmentName'],
        costProjectCode: ['costProjectCode'],
        bpContactPersonName: ['bpContactPersonName']
      }
      const names = propAliases[prop] || [prop]
      return this.basicUpdateMsgList.find((row) => names.includes(row.name)) || {}
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
        `${vm.$t('ui.approvedSuccess')}`.replace('$1', `[${vm.form.storeIssueChitNo}]`)
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
        `${vm.$t('ui.rejectedSuccess')}`.replace('$1', `[${vm.form.storeIssueChitNo}]`)
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
        `${vm.$t('ui.cancelledSuccess')}`.replace('$1', `[${vm.form.storeIssueChitNo}]`)
      )
      vm.back('onCancelSuccess')
    },

    handleClose() {
      this.$refs.FormCloseDialog.handleOpen()
    },
    closeSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.closedSuccess')}`.replace('$1', `[${vm.form.storeIssueChitNo}]`)
      )
      vm.back('onCloseSuccess')
    }
  }
}
</script>
<style lang="scss">
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
