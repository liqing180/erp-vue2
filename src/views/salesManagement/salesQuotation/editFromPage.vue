<template>
  <FormPageLayoutTabs ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        :disabled="getVarContentLoading"
        v-if="submitBtnShow && !approvedBtnShow"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :disabled="getVarContentLoading"
        v-if="saveDraftBtnShow"
        @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="approvedBtnShow" @click="handleApproved"
        >{{ $t('uiBtn.approve') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="rejectedBtnShow" @click="handleRejected"
        >{{ $t('uiBtn.reject1') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="returnBtnShow" @click="handleReturn">{{
        $t('menu.return')
      }}</el-button>
      <el-button type="primary" size="mini" v-if="activateBtnShow" @click="handleActivate">{{
        $t('menu.activate')
      }}</el-button>
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
      <el-button type="primary" size="mini" v-if="generateSOBtnShow" @click="handleGenerateSO"
        >{{ $t('menu.generateSO') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="updateCustomerPODetailBtnShow"
        @click="handleUpdateCustomerPODetail"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="reviseBtnShow" @click="handleRevise"
        >{{ $t('uiBtn.revise') }}
      </el-button>

      <!-- <el-button
        type="primary"
        size="mini"
        v-if="previewPDFShow"
        :loading="previewPDFLoading"
        @click="handlePreviewPDF"
        >{{ $t('menu.previewPDF') }}
      </el-button> -->
      <el-button type="primary" size="mini" v-if="printPDFShow" @click="handlePrintPDF"
        >{{ $t('menu.printPDF') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="exportPDFShow" @click="handleExportPDF"
        >{{ $t('menu.exportPDF') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="buttonAuthMsg.isCanSeeUpdateMsg === '1'"
        @click="revisionComparison"
        >{{ $t('uiBtn.revisionComparison') }}</el-button
      >
      <el-button type="primary" size="mini" v-if="isShowEditBtn" @click="exitComparison"
        >{{ $t('uiBtn.edit') }}
      </el-button>
      <el-dropdown
        class="ml10 mr10"
        @command="(command) => settingHandleCommand(command)"
        trigger="click"
        v-if="bpHistoryVersionList.length > 0 && comeFrom === '1'"
        @visible-change="dropdownVisibleChange"
      >
        <el-button size="mini" type="primary">
          {{ $t('uiBtn.revisionRecord') }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-scrollbar :noresize="false" ref="scrollbar">
            <div style="max-height: 200px">
              <el-dropdown-item
                :command="item.businessId"
                v-for="item in bpHistoryVersionList"
                :key="item.businessId"
                >{{ item.businessNo }}
              </el-dropdown-item>
            </div>
          </el-scrollbar>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown
        class="ml10 mr10 exportHistoryPDF"
        @command="(command) => exportPDFCommand(command)"
        trigger="click"
        v-if="bpHistoryVersionList.length > 0 && exportQuotationShow && false"
        @visible-change="dropdownVisibleChange2"
      >
        <el-button size="mini" type="primary">
          {{ $t('menu.exportQuotation') }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-scrollbar :noresize="false" ref="scrollbar2">
            <div style="max-height: 200px">
              <el-dropdown-item
                :command="item.businessId"
                v-for="item in bpHistoryVersionList"
                :key="item.businessId"
                >{{ item.businessNo }}
              </el-dropdown-item>
            </div>
          </el-scrollbar>
        </el-dropdown-menu>
      </el-dropdown>

      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">{{ $t('menu.salesQuotation') }}</div>
    </template>
    <template v-slot:tabs v-if="previewPDFShow">
      <el-tabs v-model="tabsActiveName" size="mini" type="card" @tab-click="handleTabsClick">
        <el-tab-pane :label="$t('ui.basicInfo')" name="basicInfo"></el-tab-pane>
        <el-tab-pane :label="$t('menu.previewPDF')" name="pdfInfo"></el-tab-pane>
      </el-tabs>
    </template>

    <template v-slot:content>
      <div
        style="height: calc(100% - 6px)"
        v-show="tabsActiveName === 'pdfInfo'"
        v-loading="pdfInfoLoading"
      >
        <i-frame style="height: 100%" :src="pdfInfoUrl + '#navpanes=0'" v-if="pdfInfoUrl" />
        <!-- <div v-else style="height: 50vh"></div> -->
      </div>
      <div v-show="tabsActiveName === 'basicInfo'">
        <div class="form-card mb10" v-if="isComparison">
          <div class="legend-bar">
            <span class="legend-text">{{ $t('ui.legend') }}</span>
            <span class="legend-divider"></span>
            <span class="legend-item"
              ><span class="color-block add"></span>{{ $t('ui.added') }}</span
            >
            <span class="legend-divider"></span>
            <span class="legend-item"
              ><span class="color-block edit"></span>{{ $t('ui.modified') }}</span
            >
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
                <span class="info-item mr20" :title="form.businessPartnerName">
                  {{ $t('SALES.customerName') }} : {{ form.businessPartnerName }}
                </span>
                <span v-if="form.salesPersonBy" class="info-item mr20" :title="form.salesPersonBy">
                  {{ $t('SALES.salesPerson') }} : {{ form.salesPersonBy }}
                </span>
                <span class="info-item">
                  {{ $t('ui.status') }} :
                  {{ form.salesQuotationStatusShowStr }}
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
                      :label="`${$t('SALES.salesQuotationType')}`"
                      prop="salesQuotationType"
                    >
                      <SelectInput
                        v-model="form.salesQuotationTypeShowStr"
                        :title="form.salesQuotationTypeShowStr"
                        disabled
                      ></SelectInput>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input :value="form.salesQuotationStatusShowStr" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesQuotationNo')}`">
                      <el-input
                        v-model="form.salesQuotationNo"
                        :title="form.salesQuotationNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.customerName')}`"
                      prop="businessPartnerName"
                      :rules="[
                        {
                          required: staffNotRequired,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
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
                      <el-input
                        v-model="form.businessPartnerNo"
                        :title="form.businessPartnerNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType === 'MixDesign'">
                    <el-form-item :label="`${$t('SALES.ourRef')}`">
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
                  <el-col :span="8" v-else-if="form.salesQuotationType !== 'Project'">
                    <el-form-item :label="`${$t('SALES.salesInquiryNo')}`">
                      <el-input
                        v-model="form.salesInquiryNo"
                        :title="form.salesInquiryNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="form.salesQuotationType === 'Project'"
                    :key="form.salesQuotationType + 'taxRate'"
                  >
                    <el-form-item :label="`${$t('SALES.taxRate')}`">
                      <ComparisonInput
                        v-if="isModified('taxRate')"
                        :beforeValue="$numberStr(getBeforeValue('taxRate'), 1)"
                        :afterValue="$numberStr(getAfterValue('taxRate', form.taxRate), 1)"
                      />
                      <CommonSelect
                        v-else
                        :id="$numberStr(form.taxRate, 1)"
                        :label="$numberStr(form.taxRate, 1)"
                        idKey="taxRateStr"
                        labelKey="taxRateStr"
                        :options="taxRateOptions"
                        :disabled="!form.businessPartnerId || true"
                        @change="taxRateChange"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`" prop="currencyId">
                      <ComparisonInput
                        v-if="isModified('currency')"
                        :beforeValue="getBeforeValue('currency')"
                        :afterValue="getAfterValue('currency', form.currency)"
                      />
                      <CommonSelect
                        v-else
                        :id="form.currencyCode"
                        :label="form.currency"
                        :title="form.currency"
                        idKey="currencyCode"
                        labelKey="currency"
                        :filterable="true"
                        :clearable="false"
                        :options="currencyOptions || []"
                        @change="currencyChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('ui.paymentTerm')}`"
                      prop="paymentTermId"
                      :key="form.salesQuotationType + '11'"
                      :rules="[
                        {
                          required: form.salesQuotationType !== 'Staff',
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <ToolTipPaymentTerm :paymentTermObj="form.paymentTerm || {}">
                        <ComparisonInput
                          v-if="isModified('paymentTermName') || isModified('paymentTermMsg')"
                          :beforeValue="getBeforeValue('paymentTermName')"
                          :afterValue="getAfterValue('paymentTermName', form.paymentTermName)"
                          :showEditType="
                            isModified('paymentTermMsg') && !isModified('paymentTermName')
                          "
                        />
                        <div v-else class="input-switch-box">
                          <div class="con-left">
                            <!-- <SelectInput
                              :value="form.paymentTermName"
                              @clear="paymentTermChange({})"
                              clearable
                              @click="openPaymentTermDlg"
                              :disabled="comDisFrom || form.salesQuotationType === 'Staff'"
                              class="form-wd"
                            /> -->

                            <CommonSelectAndList
                              :id="form.paymentTermId"
                              :label="form.paymentTermName"
                              idKey="paymentTermId"
                              labelKey="paymentTermName"
                              filterable
                              :options="paymentTermList"
                              :disabled="comDisFrom || form.salesQuotationType === 'Staff'"
                              :loading="paymentTermNameLoading"
                              @change="paymentTermChange"
                              @handleOpen="openPaymentTermDlg"
                            />
                          </div>
                          <div
                            class="con-right"
                            v-if="
                              !comDisFrom &&
                              form.paymentTermName &&
                              checkPermi(['salesManagement:salesQuotation:editPaymentTerm'])
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

                  <el-col :span="8" v-if="form.salesQuotationType === 'MixDesign'">
                    <el-form-item :label="`${$t('SALES.yourRef')}`">
                      <ComparisonInput
                        v-if="isModified('yourRef')"
                        :beforeValue="getBeforeValue('yourRef')"
                        :afterValue="getAfterValue('yourRef', form.yourRef)"
                      />
                      <el-input
                        v-else
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-else>
                    <el-form-item :label="`${$t('SALES.ourRef')}`">
                      <ComparisonInput
                        v-if="isModified('ourRef')"
                        :beforeValue="getBeforeValue('ourRef')"
                        :afterValue="getAfterValue('ourRef', form.ourRef)"
                      />
                      <el-input
                        v-else
                        :disabled="isDisForm"
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8" v-if="false">
                    <el-form-item
                      :label="`${$t('SALES.department')}`"
                      prop="departmentId"
                      :class="[isModified('departmentId')]"
                    >
                      <CommonSelect
                        :disabled="isDisForm"
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
                  <el-col :span="8" v-if="form.salesQuotationType !== 'MixDesign'">
                    <el-form-item :label="`${$t('SALES.salesPerson')}`" prop="salesPersonBy">
                      <ComparisonInput
                        v-if="isModified('salesPersonBy')"
                        :beforeValue="getBeforeValue('salesPersonBy')"
                        :afterValue="getAfterValue('salesPersonBy', form.salesPersonBy)"
                      />
                      <!-- <SelectInput
                        :value="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        @clear="purchasePersonClear"
                        clearable
                        @click="openPurchasePersonTable"
                        :disabled="!form.departmentId || comDisFrom || isDisForm"
                      /> -->

                      <CommonSelectAndList
                        v-else
                        :id="form.salesPersonId"
                        :label="form.salesPersonBy"
                        idKey="userId"
                        labelKey="nickName"
                        filterable
                        :options="salesPersonList"
                        :disabled="!form.departmentId || comDisFrom || isDisForm"
                        :loading="salesPersonByLoading"
                        @change="updatePurchasePerson"
                        @handleOpen="openPurchasePersonTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType === 'MixDesign'">
                    <el-form-item
                      :label="`${$t('SALES.salesPerson')}`"
                      prop="salesPersonBy"
                      :key="form.salesQuotationType + 'salesPersonBy'"
                    >
                      <SelectInput
                        :value="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        @clear="purchasePersonClear"
                        clearable
                        @click="openPurchasePersonTable"
                        :disabled="!form.departmentId || comDisFrom || isDisForm"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="form.salesQuotationType !== 'Project'"
                    :key="form.salesQuotationType + 'taxRate'"
                  >
                    <el-form-item
                      :label="`${$t('SALES.taxRate')}`"
                      :rules="[
                        {
                          required: false,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <ComparisonInput
                        v-if="isModified('taxRate')"
                        :beforeValue="$numberStr(getBeforeValue('taxRate'), 1)"
                        :afterValue="$numberStr(getAfterValue('taxRate', form.taxRate), 1)"
                      />
                      <CommonSelect
                        v-else
                        :id="$numberStr(form.taxRate, 1)"
                        :label="$numberStr(form.taxRate, 1)"
                        idKey="taxRateStr"
                        labelKey="taxRateStr"
                        :options="taxRateOptions"
                        :disabled="!form.businessPartnerId || true"
                        @change="taxRateChange"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="form.salesQuotationType === 'Project'">
                    <el-form-item
                      :label="`${$t('SALES.projectCode')}`"
                      prop="costProjectCode"
                      :key="'costProjectId' + form.salesQuotationType"
                      :rules="[
                        {
                          required:
                            form.salesQuotationType === 'Project' &&
                            form.isSalesInquiryProject !== '1',
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <ComparisonInput
                        v-if="isModified('costProjectCode')"
                        :beforeValue="getBeforeValue('costProjectCode')"
                        :afterValue="getAfterValue('costProjectCode', form.costProjectCode)"
                      />
                      <!-- <CommonSelect
                        :id="form.costProjectId"
                        :label="form.costProjectCode"
                        :title="form.costProjectCode"
                        idKey="costProjectId"
                        labelKey="costProjectCode"
                        filterable
                        :options="projectNameOptions"
                        :loading="costProjectNameLoading"
                        @change="costProjectNameChange"
                      /> -->

                      <CommonSelectAndList
                        v-else
                        :id="form.costProjectId"
                        :label="form.costProjectCode"
                        idKey="costProjectId"
                        labelKey="costProjectCode"
                        clearable
                        filterable
                        :options="projectNameOptions"
                        :loading="costProjectNameLoading"
                        :disabled="comDisFrom"
                        @change="costProjectNameChange"
                        @handleOpen="openCostProjectNameTable"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="form.salesQuotationType !== 'MixDesign'">
                    <el-form-item :label="`${$t('SALES.yourRef')}`">
                      <ComparisonInput
                        v-if="isModified('yourRef')"
                        :beforeValue="getBeforeValue('yourRef')"
                        :afterValue="getAfterValue('yourRef', form.yourRef)"
                      />
                      <el-input
                        v-else
                        :disabled="isDisForm"
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <template v-if="form.salesQuotationType !== 'MixDesign'">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('SALES.validityDays')}`"
                        prop="validityForDay"
                        :key="'validityForDay' + staffNotRequired"
                        :rules="[
                          {
                            required: staffNotRequired && !isServiceOrderCreated,
                            message: $t('ui.reqMsg'),
                            trigger: ['blur']
                          }
                        ]"
                      >
                        <ComparisonInput
                          v-if="isModified('validityForDay')"
                          :beforeValue="getBeforeValue('validityForDay')"
                          :afterValue="getAfterValue('validityForDay', form.validity)"
                        />
                        <el-input-number
                          v-else
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.validityForDay"
                          :disabled="isDisForm"
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
                            :disabled="isDisForm"
                            :precision="0"
                            type="number"
                            :min="1"
                            :max="999"
                            :controls="false"
                            style="width: 30%"
                            @change="validityChange('validityForDay')"
                          />
                          <span class="mr5 ml5">{{ $t('SALES.day') }}</span>
                          <el-date-picker
                            :disabled="isDisForm"
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
                    <el-col :span="8" v-if="form.salesQuotationType === 'Project'">
                      <el-form-item
                        :label="`${$t('SALES.leadTimeDays2')}`"
                        prop="deliveryDateForDay"
                        :key="form.salesQuotationType"
                        class="custom-form-item"
                      >
                        <ComparisonInput
                          v-if="isModified('deliveryDateForDay')"
                          :beforeValue="getBeforeValue('deliveryDateForDay')"
                          :afterValue="getAfterValue('deliveryDateForDay', form.deliveryDateForDay)"
                        />
                        <el-input-number
                          v-else
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.deliveryDateForDay"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          controls-position="right"
                          style="width: 100%"
                          :controls="true"
                          @change="deliveryDateChange('deliveryDateForDay')"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" v-else>
                      <el-form-item
                        :label="`${$t('SALES.leadTimeDays2')}`"
                        prop="deliveryDateForDay"
                        :rules="[
                          {
                            required: !(isServiceOrderCreated || !staffNotRequired),
                            message: $t('ui.reqMsg').replace('$1', $t('SALES.leadTimeDays2')),
                            trigger: ['blur', 'change']
                          }
                        ]"
                        class="custom-form-item"
                      >
                        <ComparisonInput
                          v-if="isModified('deliveryDateForDay')"
                          :beforeValue="getBeforeValue('deliveryDateForDay')"
                          :afterValue="getAfterValue('deliveryDateForDay', form.deliveryDateForDay)"
                        />
                        <div v-else class="flex">
                          <el-input-number
                            v-thousandSplit="{ precision: 0 }"
                            :disabled="isDisForm"
                            v-model="form.deliveryDateForDay"
                            :precision="0"
                            type="number"
                            :min="0"
                            :max="999"
                            controls-position="right"
                            style="width: 100%"
                            :controls="form.salesQuotationType !== 'Project'"
                            @change="deliveryDateChange('deliveryDateForDay')"
                          />
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('SALES.customerQuestionnaire')}`"
                        prop="customerQuestionnaireId"
                        :rules="[
                          {
                            required: false,
                            message: $t('ui.reqMsg'),
                            trigger: ['change']
                          }
                        ]"
                      >
                        <ComparisonInput
                          v-if="isModified('customerQuestionnaireNo')"
                          :beforeValue="getBeforeValue('customerQuestionnaireNo')"
                          :afterValue="
                            getAfterValue('customerQuestionnaireNo', form.customerQuestionnaireNo)
                          "
                        />
                        <div v-else class="input-switch-box">
                          <div class="con-left">
                            <CommonSelect
                              :disabled="!form.businessPartnerId"
                              :id="form.customerQuestionnaireId"
                              :label="form.customerQuestionnaireNo"
                              :title="form.customerQuestionnaireNo"
                              idKey="customerQuestionnaireId"
                              labelKey="customerQuestionnaireNo"
                              :options="customerQuestionnaireOptions"
                              @change="customerQuestionnaireChange"
                            />
                          </div>
                          <div class="con-right" v-if="form.customerQuestionnaireId">
                            <svg-icon
                              @click="handleView"
                              icon-class="board-05"
                              class="primary-pointer"
                              style="height: 28px; width: 28px"
                            />
                          </div>
                        </div>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="8" v-if="form.salesQuotationType === 'Consignment'">
                      <el-form-item
                        :label="`${$t('SALES.consignmentStart')}`"
                        prop="consignmentStartTime"
                      >
                        <ComparisonInput
                          v-if="isModified('consignmentStartTime')"
                          :beforeValue="getBeforeValue('consignmentStartTime')"
                          :afterValue="
                            getAfterValue('consignmentStartTime', form.consignmentStartTime)
                          "
                        />
                        <el-date-picker
                          v-else
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
                    <el-col :span="8" v-if="form.salesQuotationType === 'Consignment'">
                      <el-form-item
                        :label="`${$t('SALES.consignmentEnd')}`"
                        prop="consignmentEndTime"
                      >
                        <ComparisonInput
                          v-if="isModified('consignmentEndTime')"
                          :beforeValue="getBeforeValue('consignmentEndTime')"
                          :afterValue="getAfterValue('consignmentEndTime', form.consignmentEndTime)"
                        />
                        <el-date-picker
                          v-else
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
                    <el-col
                      :span="8"
                      v-if="
                        ['Trading', 'Service', 'Consignment', 'Staff'].includes(
                          form.salesQuotationType
                        ) && false
                      "
                      key="priceType11"
                    >
                      <el-form-item
                        :label="`${$t('SALES.priceType')}`"
                        prop="priceTypeId"
                        :class="[isModified('priceTypeId')]"
                      >
                        <CommonSelect
                          :id="form.priceTypeId"
                          :label="form.priceTypeName"
                          :title="form.priceTypeName"
                          idKey="priceTypeId"
                          labelKey="priceTypeName"
                          :options="priceTypeOptions"
                          @change="priceTypeChange"
                          :disabled="!form.businessPartnerId"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>

                <!-- <template v-if="form.salesQuotationType === 'MixDesign'">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.warehouseName')}`" prop="warehouseName">
                        <ToolTipShowObj
                          :mData="form.addressForWarehouse || {}"
                          :showStr="form.warehouseName"
                          :rows="warehouseRows"
                        >
                          <SelectInput
                            clearable
                            :disabled="comDisFrom"
                            :value="form.warehouseName"
                            @click="openWarehouseTable"
                            @clear="warehouseClear"
                          />
                        </ToolTipShowObj>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template> -->
                <el-row v-if="form.salesQuotationType === 'MixDesign'">
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('SALES.limitingValuesofConcreteComposition')"
                      class="form-item__label-wrap"
                    >
                      <el-input
                        v-model="form.limitingValuesOfConcreteComposition"
                        maxlength="100"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      class="form-item__label-wrap"
                      :label="$t('SALES.typeStrengthClassofCement')"
                    >
                      <el-input v-model="form.typeStrengthClassOfCement" maxlength="100" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      class="form-item__label-wrap"
                      :label="$t('SALES.typeofAdmixtureAddition')"
                    >
                      <el-input v-model="form.typeOfAdmixtureAddition" maxlength="100" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('menu.exchangeRate')}`">
                      <el-input
                        :value="form.exchangeRateDesc"
                        :title="form.exchangeRateDesc"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row> -->

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')" :class="[isModified('basicRemarks')]">
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
                <el-row class="el-row-flex">
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.automatedEmail')}`"
                      :class="[isModified('automatedEmail')]"
                    >
                      <el-switch
                        v-model="form.automatedEmail"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="form.salesQuotationType === 'Trading' && !isServiceOrderCreated"
                  >
                    <el-form-item
                      :label="`${$t('SALES.blanketOrder')}`"
                      :class="[isModified('blanketOrder')]"
                    >
                      <el-switch
                        v-model="form.blanketOrder"
                        active-value="1"
                        inactive-value="0"
                        @change="blanketOrderChange"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    :key="'expirationDate-' + form.blanketOrder"
                    v-if="form.blanketOrder === '1'"
                  >
                    <el-form-item :label="`${$t('SALES.expirationDate')}`" prop="expirationDate">
                      <ComparisonInput
                        v-if="isModified('expirationDate')"
                        :beforeValue="getBeforeValue('expirationDate')"
                        :afterValue="getAfterValue('expirationDate', form.receivedDate)"
                      />
                      <el-date-picker
                        v-else
                        v-model="form.expirationDate"
                        :picker-options="consignmentStartTimePickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="
                      ['Trading', 'Service'].includes(form.salesQuotationType) &&
                      form.blanketOrder !== '1' &&
                      !isServiceOrderCreated
                    "
                  >
                    <el-form-item
                      :label="`${$t('SALES.dropShipping')}`"
                      :class="[isModified('dropShipping')]"
                    >
                      <el-switch
                        v-model="form.dropShipping"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType === 'MixDesign'">
                    <el-form-item
                      :label="`${$t('SALES.isNonDigital')}`"
                      :class="[isModified('isNonDigital')]"
                    >
                      <el-switch
                        v-model="form.isNonDigital"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType === 'MixDesign'">
                    <el-form-item :label="`${$t('SALES.COD')}`" :class="[isModified('isCod')]">
                      <el-switch
                        v-model="form.isCod"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="sysDockingSwitch">
                    <el-form-item
                      :label="`${$t('SALES.sealRequired')}`"
                      prop="sealRequired"
                      :class="[isModified('sealRequired')]"
                    >
                      <el-switch
                        v-model="form.sealRequired"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType === 'Trading' && false">
                    <el-form-item
                      :label="`${$t('SALES.priceTbd2')}`"
                      :class="[isModified('priceTbd')]"
                    >
                      <el-switch
                        v-model="form.priceTbd"
                        active-value="1"
                        inactive-value="0"
                        @change="priceTbdChange"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType === 'Service' && false">
                    <el-form-item
                      :label="`${$t('SALES.priceTbd')}`"
                      :class="[isModified('priceTbd')]"
                    >
                      <el-switch
                        v-model="form.priceTbd"
                        active-value="1"
                        inactive-value="0"
                        @change="priceTbdChange"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div
            class="form-card mt10"
            v-show="generateSOBtnShow || form.poType || updateCustomerPODetailBtnShow"
          >
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.customerPODetail')"
                :warning="collapseWarningForPODetail"
              >
                <span v-if="form.poType" class="info-item mr20">
                  {{ $t('SALES.poType') }} :
                  {{ selectDictLabel(dict.type.sales_po_type, form.poType) }}
                </span>
                <span
                  v-if="form.poContactPersonName"
                  class="info-item mr20"
                  :title="form.poContactPersonName"
                >
                  {{ $t('SALES.purchaseContactPerson') }} : {{ form.poContactPersonName }}
                </span>
              </FormCollapseItemTitle>
              <el-form
                ref="form3"
                :model="form"
                @submit.native.prevent
                :rules="rules2"
                label-width="180px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.poType')}`" prop="poType">
                      <el-select
                        v-model="form.poType"
                        @change="poTypeChange"
                        clearable
                        placeholder=""
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in dict.type.sales_po_type"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.poNo')}`"
                      prop="poNo"
                      :rules="[
                        {
                          required: ['1', '2', '3'].includes(form.poType),
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <el-input
                        :disabled="!form.poType || ['4'].includes(form.poType)"
                        v-model="form.poNo"
                        maxlength="30"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.poDate')}`" prop="poDate">
                      <el-date-picker
                        v-model="form.poDate"
                        :picker-options="poDatePickerOptions"
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
                    <el-form-item
                      :label="`${$t('SALES.purchaseContactPerson')}`"
                      prop="poContactPersonId"
                      :rules="[
                        {
                          required: staffNotRequired,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <CommonSelect
                        :disabled="!form.businessPartnerId"
                        :id="form.poContactPersonId"
                        :label="form.poContactPersonName"
                        :title="form.poContactPersonName"
                        idKey="contactPersonId"
                        labelKey="contactPersonName"
                        :options="
                          (form.bpBusinessContactPersonList || []).filter((i) => i.isActive === '1')
                        "
                        @change="poContactPersonChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input v-model="form.poEmail" :title="form.poEmail" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.mobilePhone')}`">
                      <el-input
                        v-model="form.poMobilePhone"
                        :title="form.poMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="`${$t('ui.attachment')}`"
                      :required="['1', '2', '3'].includes(form.poType)"
                    >
                      <myUpload ref="uploadRefPO" :limit="9" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10" v-if="form.salesQuotationType !== 'MixDesign'">
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
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                    <el-form-item
                      :label="`${$t('SALES.incoterm')}`"
                      prop="incotermId"
                      :rules="[
                        {
                          required: staffNotRequired,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <ComparisonInput
                        v-if="isModified('incotermName')"
                        :beforeValue="getBeforeValue('incotermName')"
                        :afterValue="getAfterValue('incotermName', form.incotermName)"
                      />
                      <CommonSelect
                        v-else
                        :id="form.incotermId"
                        :label="form.incotermName"
                        :title="form.incotermName"
                        idKey="incotermId"
                        labelKey="incotermName"
                        :options="incotermOptions"
                        @change="incotermIdChange"
                        :disabled="!form.businessPartnerId || comDisFrom"
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
                        v-if="!isModified('receivePortName') && form.incotermAddressType === '0'"
                        :value="$t('SALES.selfCollect')"
                        disabled
                      ></el-input>
                      <ComparisonInput
                        v-else-if="isModified('receivePortName')"
                        :beforeValue="getBeforeValue('receivePortName')"
                        :afterValue="getAfterValue('receivePortName', form.receivePortName)"
                      />
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
                            !form.businessPartnerId ||
                            comDisFrom
                          "
                          :loading="portNameLoading"
                          @change="updatePort"
                          ref="portRef"
                          @handleOpen="openPortTable"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                  <!-- 修订记录-2.0.5 279行： 默认填充法人仓库，隐藏该字段 -->
                  <el-col :span="8" v-if="form.salesQuotationType === 'Consignment'">
                    <el-form-item
                      :label="`${$t('SALES.warehouseName')}`"
                      prop="warehouseName"
                      :rules="[
                        {
                          required: staffNotRequired,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <ComparisonInput
                        v-if="isModified('warehouseName')"
                        :beforeValue="getBeforeValue('warehouseName')"
                        :afterValue="getAfterValue('warehouseName', form.warehouseName)"
                      />
                      <ToolTipShowObj
                        v-else
                        :mData="form.addressForWarehouse || {}"
                        :showStr="form.warehouseName"
                        :rows="warehouseRows"
                      >
                        <SelectInput
                          clearable
                          :value="form.warehouseName"
                          @click="openWarehouseTable"
                          @clear="warehouseClear"
                          :disabled="true"
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
                            ([
                              'CPT',
                              'CIP',
                              'DDP',
                              'DAP',
                              'DPU',
                              'FCA',
                              'CIF',
                              'FOB',
                              'CFR'
                            ].includes(form.incotermAbbreviation) ||
                              !form.incotermAbbreviation) &&
                            staffNotRequired,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <ComparisonInput
                        v-if="isModified('receiveAddress')"
                        :beforeValue="getBeforeValue('receiveAddress')"
                        :afterValue="getAfterValue('receiveAddress', form.receiveAddress)"
                      />
                      <div v-else class="input-switch-box">
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
                              isServiceOrderCreated ||
                              comDisFrom
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
                              isServiceOrderCreated ||
                              comDisFrom
                            "
                            :loading="receiveAddressLoading"
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
                              isServiceOrderCreated ||
                              comDisFrom
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
                      <ComparisonInput
                        v-if="isModified('district')"
                        :beforeValue="getBeforeValue('district')"
                        :afterValue="getAfterValue('district', form.district)"
                      />
                      <el-input
                        v-else
                        :value="form.district"
                        :title="form.district"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.contactPerson')}`"
                      prop="bpContactPersonName"
                      :rules="[
                        {
                          required: staffNotRequired,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <ComparisonInput
                        v-if="isModified('contactPersonName')"
                        :beforeValue="getBeforeValue('contactPersonName')"
                        :afterValue="getAfterValue('contactPersonName', form.bpContactPersonName)"
                      />
                      <div v-else class="input-switch-box">
                        <div class="con-left">
                          <CommonSelect
                            :disabled="!form.businessPartnerId || isDisForm"
                            :id="form.bpContactPersonId"
                            :label="form.bpContactPersonName"
                            :title="form.bpContactPersonName"
                            idKey="contactPersonId"
                            labelKey="contactPersonName"
                            :options="form.bpBusinessContactPersonList || []"
                            @change="contactPersonChange"
                          />
                        </div>
                        <div
                          class="con-right"
                          v-if="!(!form.businessPartnerId || isDisForm) && !comDisFrom"
                        >
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
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.consignee')}`" prop="consignee">
                      <ComparisonInput
                        v-if="isModified('consignee')"
                        :beforeValue="getBeforeValue('consignee')"
                        :afterValue="getAfterValue('consignee', form.consignee)"
                      />
                      <el-input
                        v-else
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
          <div class="form-card mt10" v-if="form.salesQuotationType === 'MixDesign'">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.projectInfo')"
                :warning="collapseWarningForProjectInfo"
              >
              </FormCollapseItemTitle>
              <projectInfo
                ref="projectInfo"
                :formData="form"
                :comDisFrom="comDisFrom"
                @specialRequirementChange="specialRequirementChange"
                :modifyHighlight="modifyHighlight"
                :basicUpdateProps="basicUpdateProps"
              />
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0" ref="collapseScrollPage">
            <el-collapse-item name="5">
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
                  :salesQuotationType="form.salesQuotationType"
                  :countryId="form.countryId"
                  :businessPartnerId="form.businessPartnerId"
                  :currencyId="form.currencyId"
                  :comDisFrom="comDisFrom"
                  :modifyHighlight="modifyHighlight"
                  :basicUpdateProps="basicUpdateProps"
                  :basicUpdateMsgList="basicUpdateMsgList"
                  @returnSubmitSuccess="back"
                  @deliveryDateForDayChange="deliveryDateChange('deliveryDateForDay')"
                  @scrollPageToTable="scrollPageToTable"
                  @scrollPageToTotalAmount="scrollPageToTotalAmount"
                />
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="6">
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
                  :varContentData="varContentData"
                  :comDisFrom="comDisFrom"
                  :modifyHighlight="modifyHighlight"
                />
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="7">
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
      :salesQuotationType="form.salesQuotationType"
      :businessPartnerId="form.businessPartnerId"
      @update="updateWarehouse"
    />
    <addBPAddressDlg ref="addBPAddressDlg" @update="addBPAddress" />
    <addBPContactPersonDlg ref="addBPContactPersonDlg" @update="addBPContactPerson" />

    <selectPaymentTermDlg
      ref="selectPaymentTermDlg"
      :paymentTermPurposeList="comPurPosList"
      :businessPartnerId="form.businessPartnerId"
      @onSuccess="paymentTermChange"
      :menuPerms="menuKey.salesQuotation"
    />
    <editPaymentTernDlg ref="editPaymentTernDlg" @onSuccess="paymentTermEditChange" />

    <ApprovedDialog
      :id="form.salesQuotationMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
      :formData="approvedFormData"
      formDataKey="salesQuotation"
    />
    <RejectDialog
      :id="form.salesQuotationMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.salesQuotationMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />
    <!-- return -->
    <ReturnDialog
      :id="form.salesQuotationMainId"
      :rj-visible="returnVisible"
      :rj-api-url="returnUrl"
      @submitSuccess="returnSubmitSuccess"
      @rjVisibleChange="returnVisibleChange"
    />

    <FormActivateDialog
      :id="form.salesQuotationMainId"
      @submitSuccess="activateSubmitSuccess"
      ref="FormActivateDialog"
    />

    <RevisionComparisonDlg module-key="salesQuotation" ref="RevisionComparisonDlg" />

    <previewQuestionnaireTemplateDlg
      ref="previewQuestionnaireTemplateDlg"
      :isCancel="true"
      :isDisabled="true"
    />
    <lowStockAlertDlg ref="lowStockAlertDlg" @onSuccess="lowStockAlertSuccess" />

    <selectCostProjectTable
      ref="selectCostProjectTable"
      :businessPartnerId="form.businessPartnerId"
      @update="costProjectNameChange"
    />
  </FormPageLayoutTabs>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

import { queryUserDepartment } from '@/api/system/user'
import { queryIncotermList, queryCanSelectPortList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryAllTaxForSales } from '@/api/system/tax'

import {
  saveSalesQuotation,
  saveDraftSalesQuotation,
  updateSalesQuotationPurchase,
  checkSalesQuotationProductMsg,
  generateSO,
  querySalesQuotationById,
  approvedSalesQuotation,
  rejectedSalesQuotation,
  cancelledSalesQuotation,
  returnSalesQuotation,
  querySalesQuotationHistoryVersion,
  withdrawApproved,
  preview,
  conversionCurrencyUnitPrice,
  dealAddProductMsgAndCalculate,
  getFormattedVarContent
} from '@/api/salesManagement/salesQuotation'
import { getToken } from '@/utils/auth'
import {
  queryBPCustomerQuestionnaireListNoPage,
  queryCustomerPriceTypeList
} from '@/api/salesManagement/salesInquiry'
import { queryCustomerQuestionnaireById } from '@/api/salesManagement/customerQuestionnaire'
import {
  queryPaymentTermListByPaymentTermPurpose,
  queryPaymentTermListByPaymentTermPurposeForPage
} from '@/api/system/paymentTerm'
import { queryCanSelectCostProjectList } from '@/api/projectManagement/project'
import { getSystemSetup } from '@/api/system/systemSetting'
import { queryUsers } from '@/api/organization/corporate'
import { queryAddressByBusinessPartnerId } from '@/api/purchaseManagement/purchaseContract'

import selectCustomerTable from './components/selectCustomerTable.vue'
import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'
import selectPortTable from './components/selectPortTable.vue'
import payToAddressDlg from './components/payToAddressDlg.vue'
import addBPAddressDlg from '@/views/salesManagement/salesInquiry/components/addBPAddressDlg.vue'
import addBPContactPersonDlg from '@/views/salesManagement/salesInquiry/components/addBPContactPersonDlg.vue'
import selectPaymentTermDlg from '@/views/system/paymentTerm/selectPaymentTermDlg.vue'
import editPaymentTernDlg from '@/views/system/paymentTerm/editPaymentTernDlg/editPaymentTernDlg.vue'

import selectWarehouseTable from './components/selectWarehouseTable.vue'
import ProductInfo from './productInfo/productInfo.vue'
import projectInfo from './components/projectInfo.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import ReturnDialog from './returnDialog/returnDialog.vue'
import FormActivateDialog from './activateDlg/formActivateDialog.vue'

import RevisionComparisonDlg from '@/components/RevisionComparison'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import previewQuestionnaireTemplateDlg from '@/views/salesManagement/questionnaireTemplate/components/previewQuestionnaireTemplateDlg.vue'
import lowStockAlertDlg from './components/lowStockAlertDlg.vue'
import ConditionsTable from './conditionsTable.vue'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import iFrame from '@/components/iFrame/index'
import { getMultiplyDecimalPlaces } from '@/utils/bigUtils/bigUtils.js'
import { formDirtyClass } from '@/mixins/formDirtyClass'
import selectCostProjectTable from '@/views/projectManagement/projectProduction/components/selectCostProjectTable.vue'

export default {
  mixins: [pageMixin],
  dicts: ['sales_quotation_type', 'sales_po_type', 'project_purpose_type'],
  components: {
    FormPageLayoutTabs,
    iFrame,
    selectCustomerTable,
    selectPurchasePersonTable,
    selectPortTable,
    selectWarehouseTable,
    payToAddressDlg,
    addBPAddressDlg,
    addBPContactPersonDlg,
    selectPaymentTermDlg,
    editPaymentTernDlg,
    ProductInfo,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    ReturnDialog,
    FormActivateDialog,
    RevisionComparisonDlg,
    SystemOperationLogTable,
    previewQuestionnaireTemplateDlg,
    projectInfo,
    lowStockAlertDlg,
    ConditionsTable,
    selectCostProjectTable
  },
  data() {
    return {
      paymentTermNameLoading: false,
      salesPersonByLoading: false,
      portNameLoading: false,
      receiveAddressLoading: false,
      businessAddressList: [],
      salesPersonList: [],
      paymentTermList: [],
      tabsActiveName: 'basicInfo',
      pdfInfoLoading: false,
      pdfInfoUrl: '',
      salesConditionsList: [],
      varContentData: {},
      getVarContentLoading: false,
      previewPDFLoading: false,
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,

      form: {
        salesQuotationProductList: [],
        salesQuotationProjectList: [],
        salesQuotationServiceList: [],
        projectCostDetailList: [],
        conditionsTableList: [],
        productOrServiceList: []
      },
      projectNameOptions: [],
      costProjectNameLoading: false,
      deliveryDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
          // return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      collapseWarningForBasicInfo: false,
      collapseWarningForPODetail: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      collapseWarningForProjectInfo: false,
      collapseWarningForConditions: false,
      rules: {
        expirationDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        salesQuotationType: [
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
        currencyId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        projectPurposeType: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],

        deliveryDateForDay: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        priceTypeId: [
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

        warehouseName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        bpContactPersonName: [
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
      rules2: {
        poType: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        poDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        poContactPersonId: [
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
      poDatePickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < Date.now() - 90 * 24 * 60 * 60 * 1000 || time.getTime() > Date.now()
          )
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

      paymentTermOptions: [],
      paymentMethodOptions: [],
      incotermOptions: [],
      portOptions: [],
      taxRateOptions: [],
      priceTypeOptions: [],
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
      approvedUrl: approvedSalesQuotation,
      rejectedUrl: rejectedSalesQuotation,
      cancelledUrl: cancelledSalesQuotation,
      approvedFormData: undefined,

      returnVisible: false,
      returnUrl: returnSalesQuotation,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      basicUpdateMsgList: [],
      updateMsg: {},
      isComparison: false,
      commonFileListCur: [],
      salesQuotationProductListCur: [],
      salesQuotationProjectListCur: [],
      salesQuotationServiceListCur: [],
      productOrServiceListCur: [],
      projectCostDetailListCur: [],
      salesQuotationMixDesignListCur: [],
      bpHistoryVersionList: []
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
    comSalesConditionsList() {
      if (!this.form.salesQuotationType || !this.form.country) {
        return []
      }
      let type = this.form.salesQuotationType
      if (this.form.salesQuotationType === 'Trading') {
        /* 国际交易 */
        if (!this.isLocalSales) {
          type = this.form.salesQuotationType + '-2'
        }
      }
      if (this.form.salesQuotationType === 'Project') {
        if (!this.isLocalSales) {
          type = this.form.salesQuotationType + '-2'
        } else {
          type = this.form.salesQuotationType + '-1'
        }
      }
      let list = JSON.parse(JSON.stringify(this.salesConditionsList || []))
      /* 项目的有一个不管是否国际交易都可选择的类型 */
      if (this.form.salesQuotationType === 'Project') {
        list = list.filter((item) => {
          return (item.purposeList || []).find((x) => x === 'Project' || x === type)
        })
      } else {
        list = list.filter((item) => {
          return (item.purposeList || []).find((x) => x === type)
        })
      }

      return this.groupAndAddHideLabel(list)
    },

    /* 是否是本地交易 */
    isLocalSales() {
      return this.form.country === this.legalEntityInfo.country
    },
    comPurPosList() {
      const purpose = {
        Trading: '3', // 贸易-本地
        Trading2: '3-2', // 贸易-国际
        Service: '4', // 服务
        Project: '10', // 项目
        Project1: '8', // 项目-本地
        Project2: '8-2', // 项目-国际
        MixDesign: '6', // 混凝土产品
        Consignment: '7' // 寄卖
      }

      let key
      key = this.form.salesQuotationType
      if (this.form.salesQuotationType === 'Trading') {
        /* 国际交易 */
        if (!this.isLocalSales) {
          key = this.form.salesQuotationType + '2'
        }
      }
      if (this.form.salesQuotationType === 'Project') {
        if (!this.isLocalSales) {
          key = this.form.salesQuotationType + '2'
        } else {
          key = this.form.salesQuotationType + '1'
        }
      }
      const list = [purpose[key]]
      /* 项目的有一个不管是否国际交易都可选择的类型 */
      if (this.form.salesQuotationType === 'Project') {
        list.push(purpose.Project)
      }
      return list
    },
    size() {
      return this.$store.getters.size
    },
    topPx() {
      const height = {
        default: 40,
        medium: 38,
        small: 34,
        mini: 30
      }
      return height[this.size] || height.default
    },
    /* 类型不等于SIC 生成就必填 */
    staffNotRequired() {
      return this.form.salesQuotationType !== 'Staff'
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    // 对接CDS
    sysDockingSwitch() {
      return this.$store.getters.sysDockingSwitch
    },
    editAuth() {
      return this.checkPermi(['salesManagement:salesQuotation:edit'])
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
        this.form.salesQuotationMainId &&
        [this.buttonAuthMsg.isCanUpdate, this.buttonAuthMsg.isCanSaveDraft].includes('1')
      ) {
        dis = false
      }
      return dis
    },
    isServiceOrderCreated() {
      return this.form.documentType === 'ServiceOrder'
    },
    isSelfCreated() {
      return this.form.documentType === 'SelfCreated'
    },
    isDisForm() {
      if (this.isSelfCreated) {
        return false
      }
      if (this.isServiceOrderCreated) {
        return false
      }
      return true
    },
    submitBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (this.form.salesQuotationMainId && this.buttonAuthMsg.isCanUpdate === '1') {
        show = true
      }
      return show
    },
    isShowEditBtn() {
      if (!this.editAuth) {
        return false
      }
      return (
        ['1', '3'].includes(this.dataType) &&
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanUpdate === '1' &&
        this.approvedBtnShow &&
        this.isComparison
      )
    },
    saveDraftBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanSaveDraft === '1'
      ) {
        show = true
      }
      return show
    },
    generateSOBtnShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:generateSO'])) {
        return false
      }
      let show = false
      if (this.form.salesQuotationMainId && this.buttonAuthMsg.isCanGenerateSO === '1') {
        show = true
      }
      return show
    },
    updateCustomerPODetailBtnShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:edit'])) {
        return false
      }
      let show = false
      if (
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanUpdateSalesQuotationPO === '1' &&
        !this.isServiceOrderCreated
      ) {
        show = true
      }
      return show
    },
    reviseBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        this.form.salesQuotationMainId &&
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
        this.form.salesQuotationMainId &&
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
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.salesQuotationMainId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    returnBtnShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:return'])) {
        return false
      }
      let show = false
      if (
        this.dataType === '1' &&
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanReturn === '1'
      ) {
        show = true
      }
      return show
    },
    activateBtnShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:activate'])) {
        return false
      }
      let show = false
      if (
        this.dataType === '1' &&
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanActivate === '1'
      ) {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },

    previewPDFShow() {
      if (
        !this.checkPermi(['salesManagement:salesQuotation:previewPDF']) &&
        !this.approvedBtnShow
      ) {
        return false
      }
      let show = false
      if (this.form.salesQuotationMainId && this.buttonAuthMsg.isCanPreviewPDF === '1') {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:printPDF']) && !this.approvedBtnShow) {
        return false
      }
      let show = false
      if (this.form.salesQuotationMainId && this.buttonAuthMsg.isCanPrintPDF === '1') {
        show = true
      }
      return show
    },
    exportPDFShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:exportPDF']) && !this.approvedBtnShow) {
        return false
      }
      let show = false
      if (this.form.salesQuotationMainId && this.buttonAuthMsg.isCanDownloadPDF === '1') {
        show = true
      }
      return show
    },
    exportQuotationShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:exportQuotation'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanPrintPDF === '1'
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
  },
  created() {},
  methods: {
    queryPaymentTermListByPaymentTermPurposeForPage() {
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      param.paymentTermPurposeList = this.comPurPosList
      param.businessPartnerId = this.form.businessPartnerId
      param.menuPerms = this.menuKey.salesQuotation

      this.$trimOfObj(param)
      this.paymentTermNameLoading = true
      queryPaymentTermListByPaymentTermPurposeForPage(param)
        .then((response) => {
          const list = response.rows || []
          this.paymentTermList = list
          this.paymentTermNameLoading = false
        })
        .catch((err) => {
          this.paymentTermNameLoading = false
          window.console.error(err)
        })
    },

    queryUsers() {
      const param = {
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.salesQuotation,
        departmentId: this.form.departmentId
      }
      this.$trimOfObj(param)
      this.salesPersonByLoading = true
      queryUsers(param)
        .then((response) => {
          this.salesPersonList = response.rows || []
          this.salesPersonByLoading = false
        })
        .catch((err) => {
          this.salesPersonByLoading = false
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
      this.receiveAddressLoading = true
      queryAddressByBusinessPartnerId(param)
        .then((response) => {
          const rows = response.rows || []
          this.businessAddressList = rows
          this.receiveAddressLoading = false
        })
        .catch((err) => {
          this.receiveAddressLoading = false
          window.console.error(err)
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
    specialRequirementChange() {
      if (
        this.form.specialRequirement !== '3' &&
        this.$refs.ProductInfo.activeName === 'projectTaskMixDesign'
      ) {
        this.$refs.ProductInfo.activeName = 'mixDesign'
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
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.salesQuotationMainId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))

          this.handleUpdate()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
      this.querySalesQuotationHistoryVersion()
      querySalesQuotationById({
        salesQuotationMainId: rowId,
        taskId: this.taskId || this.form.taskId
      }).then((res) => {
        const data = res.data || {}
        data.salesQuotationProductList = (data.salesQuotationProductList || []).map((x) => {
          return {
            ...x,
            exchangeRateDesc: data.exchangeRateDesc
          }
        })
        if (data.salesQuotationType === 'Project' && data.isSalesInquiryProject === '1') {
          const handlerSalesInquiryProductList = (list) => {
            let rowTimeId = Date.now()
            const handleList = (currentList, customIndex = 0) => {
              currentList.forEach((item) => {
                this.$set(item, 'isEdit', true)
                item.isSalesInquiryProject = '1'
                // 每条记录都生成唯一的 rowTimeId
                item.rowTimeId = rowTimeId++
                item.customIndex = customIndex
                if (item.childProductList && item.childProductList.length > 0) {
                  handleList(item.childProductList, customIndex + 1)
                } else {
                  item.childProductList = []
                }
              })
            }
            // handleList(list)
            // 每个第一层对象都从 0 级开始
            list.forEach((item) => {
              this.$set(item, 'isEdit', true)
              handleList([item], 0)
            })
          }
          handlerSalesInquiryProductList(data.salesQuotationProductList || [])
        }
        data.salesQuotationProjectList = (data.salesQuotationProjectList || []).map((x) => {
          return {
            ...x,
            exchangeRateDesc: data.exchangeRateDesc
          }
        })
        data.salesQuotationServiceList = (data.salesQuotationServiceList || []).map((item) => {
          if (item.isTemp === '1') {
            item.customId = item.salesQuotationServiceId
          }
          item.exchangeRateDesc = data.exchangeRateDesc
          return item
        })

        data.productOrServiceList = (data.productOrServiceList || []).map((item) => {
          item.rowTimeId = item.salesQuotationProductId || item.salesQuotationServiceId
          if (item.isTemp === '1') {
            item.customId = item.salesQuotationServiceId
          }
          if (!item.salesPartNo && (item.salesPartNoList || []).length > 0) {
            const partNoRow = item.salesPartNoList[0]
            this.$set(
              item,
              'salesPriceStrategyDetails',
              partNoRow.salesPriceStrategyDetailList || []
            )
            this.$set(item, 'salesPartNo', partNoRow.salesPartNo)
            this.$set(item, 'salesPartId', partNoRow.salesPartId)
            const defaultRow = item.salesPriceStrategyDetails.find((p) => p.isDefault) || {}
            this.$set(item, 'priceType', defaultRow.priceType)
            this.$set(item, 'priceTypeShowStr', defaultRow.priceTypeShowStr)
            this.$set(item, 'unitPrice', defaultRow.canUseUnitPrice)
          }
          item.exchangeRateDesc = data.exchangeRateDesc
          return item
        })

        data.salesQuotationMixDesignList = data.salesQuotationMixDesignList || []
        data.projectCostDetailList = data.projectCostDetailList || []
        data.productMsgTypeList = data.productMsgTypeList || []

        data.salesQuotationMixDesignList.forEach((item) => {
          if (item.passingRequirements) {
            item.passingRequirementsList = item.passingRequirements.split(',')
          }
        })

        this.initCommonFileList = data.commonFileList || []
        const addressForWarehouse = data.warehouse || {}
        const warehouseAddress = addressForWarehouse.warehouseAddress || {}
        data.addressForWarehouse = { ...addressForWarehouse, ...warehouseAddress }

        const bpBusinessAddress = data.bpBusinessAddress || {}
        if (bpBusinessAddress.isAdhocEntryAddress === '1') {
          this.$set(data, 'bpBusinessAddressOldData', bpBusinessAddress)
        }

        if (data.conditionsTableJson) {
          data.conditionsTableList = JSON.parse(data.conditionsTableJson)
        }

        if (!data.poDate && data.salesQuotationStatus === '3') {
          data.poDate = Date.now()
        }

        this.form = data

        const ContactPersonList = data.bpBusinessContactPersonList || []
        if (
          ContactPersonList.length > 0 &&
          data.salesQuotationStatus === '3' &&
          !data.poContactPersonId
        ) {
          const defaultContact = ContactPersonList.find((item) => item.isSalesDefault === '1')
          if (defaultContact) {
            this.poContactPersonChange(defaultContact)
          }
        }

        this.getFormattedVarContentFn()
        this.queryUserDepartment()
        this.queryCanSelectPortList()
        /* 服务订单生成的,自动填充打开此张单据的用户 */
        if (!this.form.salesPersonBy && this.isServiceOrderCreated) {
          this.$set(this.form, 'salesPersonBy', this.$store.state.user.nickName)
          this.$set(this.form, 'salesPersonId', this.$store.state.user.userId)
        }

        setTimeout(() => {
          if (this.$refs.uploadRefPO) {
            this.$refs.uploadRefPO.initFileList(data.commonFileListForPO || [])
          }
        }, 300)

        setTimeout(() => {
          const initFormJson = this.getFormJson()
          formDirtyClass.routeStatusData[this.$route.name] = {
            $vm: this,
            saveShow: this.saveDraftBtnShow,
            submitShow: true,
            initFormJson,
            getFormJson: this.getFormJson,
            isSaveSuccess: false,
            saveOrSubmitFn: this.handleSaveDraftNoConFirm
          }
        }, 500)
        this.queryCustomerQuestionnaire()
        this.getSystemSetup('init')

        this.buttonAuthMsg = data.buttonAuthMsg || {}
        this.initVersionComparison(data)
        if (this.form.salesQuotationType === 'Project') {
          this.$nextTick(() => {
            this.$refs.ProductInfo && this.$refs.ProductInfo.queryProjectTemplateById()
          })
        }
        this.queryAllTaxForSales()
        this.queryPaymentTermListByPaymentTermPurpose()
        this.queryCustomerPriceTypeList()
        this.queryPaymentTermListByPaymentTermPurposeForPage()
        this.queryUsers()
        this.queryAddressByBusinessPartnerId()
        if (
          this.form.salesQuotationType === 'Trading' ||
          this.form.salesQuotationType === 'Project'
        ) {
          this.queryCanSelectCostProjectList()
        }

        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },
    initVersionComparison(data) {
      const updateMsg = data.updateMsg || {}
      const cloneList = (list) => JSON.parse(JSON.stringify(list || []))
      const onlyDeleted = (list) => cloneList(list).filter((item) => item.updateType === '3')
      const markDeletedTree = (list, customIndex = 0) => {
        list.forEach((item) => {
          item.updateType = '3'
          item.customIndex = customIndex
          if (item.childProductList && item.childProductList.length > 0) {
            markDeletedTree(item.childProductList, customIndex + 1)
          }
        })
        return list
      }
      let rowTimeId = Date.now()
      const setRowTimeId = (list) => {
        list.forEach((item) => {
          rowTimeId++
          item.rowTimeId =
            item.rowTimeId ||
            item.salesQuotationProductId ||
            item.salesQuotationServiceId ||
            item.salesQuotationProjectId ||
            item.salesQuotationMixDesignId ||
            `comparison-${rowTimeId}`
          if (item.childProductList && item.childProductList.length > 0) {
            setRowTimeId(item.childProductList)
          }
        })
        return list
      }

      this.updateMsg = updateMsg
      this.basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
      this.basicUpdateProps = this.basicUpdateMsgList.map((item) => item.name)
      if (
        (updateMsg.beforeCommonFileList || []).length > 0 ||
        (updateMsg.afterCommonFileList || []).length > 0
      ) {
        this.basicUpdateProps.push('attachment')
      }

      this.commonFileListCur = cloneList(data.commonFileList)
      this.salesQuotationProductListCur = cloneList(data.salesQuotationProductList)
      this.salesQuotationProjectListCur = cloneList(data.salesQuotationProjectList)
      this.salesQuotationServiceListCur = cloneList(data.salesQuotationServiceList)
      this.productOrServiceListCur = cloneList(data.productOrServiceList)
      this.projectCostDetailListCur = cloneList(data.projectCostDetailList)
      this.salesQuotationMixDesignListCur = cloneList(data.salesQuotationMixDesignList)
      this.isComparison = this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.approvedBtnShow
      if (this.isComparison === true) {
        setTimeout(() => {
          if (this.isComparison) {
            this.revisionComparison()
          }
        }, 300)
      }

      if (this.isComparison && (data.operationLogForLastReject || {}).operatorBy) {
        this.activeNames = Array.from(new Set([...this.activeNames, '11']))
      }

      const deletedProjectList = setRowTimeId(onlyDeleted(updateMsg.beforeProjectList))
      const deletedProductOrServiceList = setRowTimeId(
        markDeletedTree(onlyDeleted(updateMsg.beforeProductOrServiceList))
      )
      const deletedMixDesignList = setRowTimeId(onlyDeleted(updateMsg.beforeMixDesignList))
      const comparisonProductList = cloneList(this.salesQuotationProductListCur)
      const comparisonProjectList = [
        ...cloneList(this.salesQuotationProjectListCur),
        ...deletedProjectList
      ]
      const comparisonProductOrServiceList = cloneList(this.productOrServiceListCur)
      const comparisonMixDesignList = [
        ...cloneList(this.salesQuotationMixDesignListCur),
        ...deletedMixDesignList
      ]

      if (['Trading', 'Service'].includes(data.salesQuotationType)) {
        comparisonProductOrServiceList.push(...deletedProductOrServiceList)
      } else {
        comparisonProductList.push(...deletedProductOrServiceList)
      }

      this.$set(
        this.form,
        'salesQuotationProductList',
        this.isComparison ? comparisonProductList : cloneList(this.salesQuotationProductListCur)
      )
      this.$set(
        this.form,
        'salesQuotationProjectList',
        this.isComparison ? comparisonProjectList : cloneList(this.salesQuotationProjectListCur)
      )
      this.$set(
        this.form,
        'salesQuotationServiceList',
        cloneList(this.salesQuotationServiceListCur)
      )
      this.$set(
        this.form,
        'productOrServiceList',
        this.isComparison ? comparisonProductOrServiceList : cloneList(this.productOrServiceListCur)
      )
      this.$set(this.form, 'projectCostDetailList', cloneList(this.projectCostDetailListCur))
      this.$set(
        this.form,
        'salesQuotationMixDesignList',
        this.isComparison ? comparisonMixDesignList : cloneList(this.salesQuotationMixDesignListCur)
      )
      this.initCommonFileList = this.isComparison
        ? [...cloneList(this.commonFileListCur), ...onlyDeleted(updateMsg.beforeCommonFileList)]
        : cloneList(this.commonFileListCur)
    },
    getFormJson() {
      const param = { ...this.form }
      param.commonFileList = this.$refs.ProductInfo && this.$refs.ProductInfo.getFileIds()
      return JSON.stringify(param)
    },
    getSystemSetup(type) {
      getSystemSetup().then((res) => {
        const data = res.data || {}
        const salesConditions = data.salesConditions || ''
        this.salesConditionsList = salesConditions ? JSON.parse(salesConditions) : []
        if (this.form.conditions) {
          return
        }
        this.setDefaultConditions(type)
      })
    },
    setDefaultConditions(type) {
      if (
        !this.form.salesQuotationType ||
        !this.form.country ||
        (this.form.salesQuotationType === 'Project' && !this.form.projectPurposeType)
      ) {
        this.$set(this.form, 'conditionsTableList', [])
        if (type && type === 'init') {
          // 更新初始表单部分字段
          formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
            conditionsTableList: []
          })
        }
        return
      }
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

      if (type && type === 'init') {
        // 更新初始表单部分字段
        formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
          conditionsTableList: JSON.parse(JSON.stringify(DefaultList))
        })
      }
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
    // 取消按钮
    back(type) {
      this.$emit('back', type)
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
        salesQuotationType: undefined,
        salesQuotationNo: undefined,
        businessPartnerName: undefined,
        salesQuotationStatus: undefined,
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
        validityForDay: undefined,
        validity: undefined,
        deliveryDateForDay: undefined,
        deliveryDate: undefined,
        ourRef: undefined,
        yourRef: undefined,
        priceTypeId: undefined,
        priceTypeName: undefined,
        basicRemarks: undefined,
        automatedEmail: '1',
        isNonDigital: '1',
        isCod: '0',
        dropShipping: '0',
        totalRemarks: undefined,
        priceTbd: '0', // 价格另议
        isUpdateAmount: '0', // 是否用户编辑过 subTotal

        poType: undefined,
        poNo: undefined,
        poDate: undefined,

        bpEmail: undefined,
        mobilePhone: undefined,

        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        receiveAddressForPort: {},
        addressForWarehouse: {},
        salesQuotationProductList: [],
        salesQuotationProjectList: [],
        salesQuotationServiceList: [],
        productOrServiceList: [],
        conditionsTableList: [],
        projectCostDetailList: [],
        consignmentStartTime: undefined,
        consignmentEndTime: undefined,

        taxId: undefined,
        taxNo: undefined,
        taxRate: undefined,

        // 配合比
        projectId: undefined,
        projectCode: undefined,
        zoneName: undefined,
        zoneId: undefined,
        receiveAddress: undefined,
        bpBusinessAddressId: undefined,
        projectContactPersonNames: undefined,
        specialRequirement: undefined,
        cubeSpacingNum: undefined,
        projectContactPersonList: [],
        projectBusinessContactPersonIds: undefined,
        projectContactPersonIds: undefined,
        salesQuotationMixDesignList: [],
        sealRequired: '0',
        expirationDate: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForPODetail = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForProjectInfo = false
      this.collapseWarningForConditions = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4', '5', '6', '7']
      this.tabsActiveName = 'basicInfo'
      this.salesConditionsList = []
      this.varContentData = {}

      setTimeout(() => {
        if (this.$refs.uploadRefPO) {
          this.$refs.uploadRefPO.initFileList([])
        }
      }, 300)
      this.basicUpdateProps = []
      this.basicUpdateMsgList = []
      this.updateMsg = {}
      this.isComparison = false
      this.commonFileListCur = []
      this.salesQuotationProductListCur = []
      this.salesQuotationProjectListCur = []
      this.salesQuotationServiceListCur = []
      this.productOrServiceListCur = []
      this.projectCostDetailListCur = []
      this.salesQuotationMixDesignListCur = []
      this.bpHistoryVersionList = []
      this.$nextTick(() => {
        this.$refs.form1 && this.$refs.form1.clearValidate()
        this.$refs.form2 && this.$refs.form2.clearValidate()
        this.$refs.form3 && this.$refs.form3.clearValidate()
      })
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
      if (this.form.salesQuotationType !== 'Project') {
        this.$set(this.form, 'salesQuotationProductList', [])
      }
      this.customerQuestionnaireClear()
      this.currencyClear()
      this.paymentMethodChange([], [])
      this.contactPersonClear()
      this.costProjectNameChange()
      this.$refs.projectInfo && this.$refs.projectInfo.projectClear()
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
      const account = row.bpBusinessAccountCustomer || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.$set(this.form, 'currencySymbol', account.currencySymbol)

      this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])
      this.customerQuestionnaireClear()
      this.taxRateChange({})
      this.queryAllTaxForSales()
      this.contactPersonClear()
      this.queryCustomerQuestionnaire()

      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isSalesDefault === '1')
        if (defaultContact) {
          this.contactPersonChange(defaultContact)
        }
      }
      if (this.form.salesQuotationType !== 'Project') {
        this.$set(this.form, 'salesQuotationProductList', [])
      }
      this.$refs.projectInfo && this.$refs.projectInfo.projectClear()

      if (this.form.salesQuotationType === 'Trading') {
        this.queryCanSelectCostProjectList()
      } else {
        this.costProjectNameChange()
      }
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
    queryCustomerQuestionnaire() {
      queryBPCustomerQuestionnaireListNoPage({
        businessPartnerId: this.form.businessPartnerId,
        createdType: 'SQ',
        salesQuotationMainId: this.form.salesQuotationMainId,
        menuPerms: this.menuKey.salesQuotation
      }).then((res) => {
        this.customerQuestionnaireOptions = res.data || []
        /* if (this.customerQuestionnaireOptions.length > 0 && !this.form.customerQuestionnaireId) {
          const topRow = this.customerQuestionnaireOptions[0]
          this.$set(this.form, 'customerQuestionnaireId', topRow.customerQuestionnaireId)
          this.$set(this.form, 'customerQuestionnaireNo', topRow.customerQuestionnaireNo)
        } */
      })
    },
    handleView() {
      queryCustomerQuestionnaireById({ customerQuestionnaireId: this.form.customerQuestionnaireId })
        .then((res) => {
          this.$refs.previewQuestionnaireTemplateDlg.handleOpen(res.data)
        })
        .catch(() => {})
    },
    queryUserDepartment() {
      queryUserDepartment({ menuPerms: this.menuKey.salesQuotation }).then((res) => {
        this.deptOptions = res.data || []
        /* 服务订单生成的,自动填充打开此张单据的用户的默认部门 */
        if (!this.form.departmentId && this.isServiceOrderCreated) {
          this.deptOptions.forEach((item) => {
            if (item.isDefault === '1') {
              this.$set(this.form, 'departmentId', item.departmentId)
              this.$set(this.form, 'departmentName', item.departmentName)
              this.$set(this.form, 'allSuperiorName', item.allSuperiorName)

              // 更新初始表单部分字段
              formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
                departmentId: item.departmentId,
                departmentName: item.departmentName,
                allSuperiorName: item.allSuperiorName
              })
            }
          })
        }
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

    queryAllTaxForSales() {
      if (this.form.businessPartnerId) {
        queryAllTaxForSales({ countryId: this.form.countryId }).then((res) => {
          const data = res.data || []
          data.forEach((item) => {
            item.taxRateStr = this.$numberStr(item.taxRate, 1)
          })
          this.taxRateOptions = data
        })
      } else {
        this.taxRateOptions = []
      }
    },
    taxRateChange(row) {
      this.$set(this.form, 'taxId', row.taxId)
      this.$set(this.form, 'taxNo', row.taxNo)
      this.$set(this.form, 'taxRate', row.taxRate)
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
      const oldCurrencyId = this.form.currencyId
      this.$set(this.form, 'currencyId', row.id)
      this.$set(this.form, 'currency', row.currency)
      this.$set(this.form, 'currencyCode', row.currencyCode)
      this.$set(this.form, 'currencySymbol', row.currencySymbol)

      if (
        this.form.salesQuotationProductList.length > 0 ||
        this.form.salesQuotationServiceList.length > 0 ||
        this.form.salesQuotationMixDesignList.length > 0 ||
        this.form.productOrServiceList.length > 0
      ) {
        const tableTimer = Date.now()
        this.tableTimer = tableTimer
        this.$set(this.form, 'tableLoading', true)
        conversionCurrencyUnitPrice({
          ...this.form,
          oldCurrencyId: oldCurrencyId,
          currencyId: row.id,
          salesQuotationProductList: this.form.salesQuotationProductList,
          salesQuotationServiceList: this.form.salesQuotationServiceList,
          salesQuotationMixDesignList: this.form.salesQuotationMixDesignList,
          productOrServiceList: this.form.productOrServiceList
        })
          .then((res) => {
            if (this.tableTimer !== tableTimer) return
            this.$set(this.form, 'tableLoading', false)

            const data = res.data || {}
            this.$set(this.form, 'exchangeRateDesc', data.exchangeRateDesc)

            const salesQuotationProductList = (data.salesQuotationProductList || []).map((x) => {
              return {
                ...x,
                exchangeRateDesc: data.exchangeRateDesc
              }
            })

            const handlerSalesInquiryProductList = (list) => {
              const handleList = (currentList, customIndex = 0) => {
                currentList.forEach((item) => {
                  // 每条记录都生成唯一的 rowTimeId
                  item.customIndex = customIndex
                  if (item.childProductList && item.childProductList.length > 0) {
                    handleList(item.childProductList, customIndex + 1)
                  } else {
                    item.childProductList = []
                  }
                })
              }
              // 每个第一层对象都从 0 级开始
              list.forEach((item) => {
                handleList([item], 0)
              })
            }
            handlerSalesInquiryProductList(salesQuotationProductList || [])

            const salesQuotationServiceList = (data.salesQuotationServiceList || []).map((x) => {
              return {
                ...x,
                exchangeRateDesc: data.exchangeRateDesc
              }
            })
            const productOrServiceList = (data.productOrServiceList || []).map((x) => {
              return {
                ...x,
                exchangeRateDesc: data.exchangeRateDesc
              }
            })
            const salesQuotationMixDesignList = (data.salesQuotationMixDesignList || []).map(
              (x) => {
                return {
                  ...x,
                  exchangeRateDesc: data.exchangeRateDesc
                }
              }
            )
            this.$set(this.form, 'salesQuotationProductList', salesQuotationProductList || [])
            this.$set(this.form, 'salesQuotationServiceList', salesQuotationServiceList || [])
            this.$set(this.form, 'productOrServiceList', productOrServiceList || [])
            this.$set(this.form, 'salesQuotationMixDesignList', salesQuotationMixDesignList || [])

            this.$set(this.form, 'otherCosts', data.otherCosts)
            this.$set(this.form, 'subTotal', data.subTotal)
            this.$set(this.form, 'totalTaxAmount', data.totalTaxAmount)
            this.$set(this.form, 'totalAmount', data.totalAmount)
          })
          .catch(() => {
            if (this.tableTimer !== tableTimer) return
            this.$set(this.form, 'tableLoading', false)
          })
      }
    },
    currencyClear() {
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      this.$set(this.form, 'salesQuotationProductList', [])
      this.$set(this.form, 'salesQuotationServiceList', [])
      this.$set(this.form, 'productOrServiceList', [])
    },

    projectTypeChange() {
      this.paymentTermChange({})
      this.setDefaultConditions()
    },

    queryPaymentTermListByPaymentTermPurpose() {
      this.paymentTermOptions = []
      if (!this.form.salesQuotationType || this.form.salesQuotationType === 'Staff') {
        return
      }

      queryPaymentTermListByPaymentTermPurpose({
        paymentTermPurposeList: this.comPurPosList,
        menuPerms: this.menuKey.salesQuotation,
        businessPartnerId: this.form.businessPartnerId
      }).then((res) => {
        this.paymentTermOptions = res.data || []
        const defaultPaymentTerm = this.paymentTermOptions.find((item) => item.isDefault === '1')
        if (defaultPaymentTerm && !this.form.paymentTermId) {
          this.paymentTermChange(defaultPaymentTerm, 'init')
        }
      })
    },
    openPaymentTermDlg() {
      this.$refs.selectPaymentTermDlg.handleAdd()
    },
    paymentTermChange(row, type) {
      this.$set(this.form, 'paymentTermId', row.paymentTermId)
      this.$set(this.form, 'paymentTermName', row.paymentTermName)
      this.$set(this.form, 'paymentTerm', row)
      this.getFormattedVarContentFn()
      if (type && type === 'init') {
        // 更新初始表单部分字段
        formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
          paymentTermId: row.paymentTermId,
          paymentTermName: row.paymentTermName,
          paymentTerm: row
        })
      }
    },
    paymentTermClear() {
      this.$set(this.form, 'paymentTermId', undefined)
      this.$set(this.form, 'paymentTermName', undefined)
      this.$set(this.form, 'paymentTerm', undefined)
      this.getFormattedVarContentFn()
    },
    openEditPaymentTermDlg() {
      this.$refs.editPaymentTernDlg.handleUpdate(this.form.paymentTerm)
    },
    paymentTermEditChange(item) {
      this.$set(this.form, 'paymentTerm', item)
      this.getFormattedVarContentFn()
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
        /*  this.$nextTick(() => {
            this.$refs.form1.validateField('validityForDay')
          }) */
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
      this.getFormattedVarContentFn()
      this.form.salesQuotationProductList.forEach((item) => {
        this.$set(item, 'deliveryDateForDay', this.form.deliveryDateForDay)
      })
      this.form.productOrServiceList.forEach((item) => {
        this.$set(item, 'deliveryDateForDay', this.form.deliveryDateForDay)
      })
    },

    // 查询BP可以选择的价格类型:
    queryCustomerPriceTypeList() {
      if (!this.form.businessPartnerId) {
        this.priceTypeOptions = []
        return
      }
      queryCustomerPriceTypeList({
        businessPartnerId: this.form.businessPartnerId,
        customerGroup: this.form.customerGroup
      }).then((res) => {
        this.priceTypeOptions = res.data || []
      })
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
      }
      this.$set(this.form, 'salesQuotationProductList', [])
    },
    priceTypeChange(item) {
      if (!item.priceTypeId) {
        this.$set(this.form, 'priceTypeId', undefined)
        this.$set(this.form, 'priceTypeName', undefined)
        return
      }
      if (this.form.salesQuotationProductList.length > 0) {
        const h = this.$createElement
        this.$msgbox({
          title: ' ',
          message: h('div', null, [
            h(
              'div',
              { style: 'font-size: 16px' },
              this.$t('SALES.priceTypeChangeMsg1').replace('$1', item.priceTypeName)
            ),
            h(
              'div',
              { class: 'mt10' },
              this.$t('SALES.priceTypeChangeMsg2').replace('$1', item.priceTypeName)
            ),
            h('ul', { class: 'my-sq-ul mt10' }, [
              h('li', null, this.$t('SALES.priceTypeChangeMsg3')),
              h('li', null, this.$t('SALES.priceTypeChangeMsg4'))
            ])
          ]),
          showCancelButton: true,
          confirmButtonText: this.$t('SALES.confirmSwitch'),
          cancelButtonText: this.$t('uiBtn.cancel')
        }).then(() => {
          this.$set(this.form, 'priceTypeId', item.priceTypeId)
          this.$set(this.form, 'priceTypeName', item.priceTypeName)
          this.resetPriceType()
        })
      } else {
        this.$set(this.form, 'priceTypeId', item.priceTypeId)
        this.$set(this.form, 'priceTypeName', item.priceTypeName)
      }
    },
    resetPriceType() {
      if (this.form.salesQuotationProductList.length > 0 && this.form.priceTypeId) {
        this.form.salesQuotationProductList.forEach((item) => {
          this.$set(item, 'unitPrice', undefined)
          this.$set(item, 'discount', undefined)
          this.$set(item, 'lineTotal', undefined)
          this.$set(item, 'salesCost', undefined)
          this.$set(item, 'salesProfit', undefined)
          this.$set(item, 'taxAmountProcess', undefined)
        })
        const tableTimer = Date.now()
        this.tableTimer = tableTimer
        this.$set(this.form, 'tableLoading', true)
        dealAddProductMsgAndCalculate({
          ...this.form,
          salesQuotationProductList: this.form.salesQuotationProductList
        })
          .then((res) => {
            if (this.tableTimer !== tableTimer) return
            this.$set(this.form, 'tableLoading', false)
            const data = res.data || {}
            this.$set(this.form, 'subTotal', data.subTotal)
            this.$set(this.form, 'totalFreight', data.totalFreight)
            this.$set(this.form, 'totalTaxAmount', data.totalTaxAmount)
            this.$set(this.form, 'totalAmount', data.totalAmount)
            this.$set(this.form, 'totalDiscount', data.totalDiscount)
            this.$set(this.form, 'expenseAmount', data.expenseAmount)
            this.$set(this.form, 'salesQuotationProductList', data.salesQuotationProductList || [])
          })
          .catch(() => {
            if (this.tableTimer !== tableTimer) return
            this.$set(this.form, 'tableLoading', false)
          })
      }
    },
    /* 客户采购信息 */
    poTypeChange(value) {
      if (value === '2') {
        this.$set(this.form, 'poNo', this.form.salesQuotationNo)
      } else {
        this.$set(this.form, 'poNo', undefined)
      }
      this.$nextTick(() => {
        this.$refs.form3.clearValidate('poNo')
      })
    },
    poContactPersonChange(row) {
      this.$set(this.form, 'poBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'poContactPersonId', row.contactPersonId)
      this.$set(this.form, 'poContactPersonName', row.contactPersonName)
      this.$set(this.form, 'poMobileNum', row.mobileNum)
      this.$set(this.form, 'poMobileCode', row.mobileCode)
      this.$set(this.form, 'poMobilePhone', row.mobilePhone)
      this.$set(this.form, 'poEmail', row.email)
    },
    blanketOrderChange() {
      if (this.form.blanketOrder === '1') {
        this.$set(this.form, 'dropShipping', '0')
      }
    },
    priceTbdChange() {
      this.$nextTick(() => {
        this.$set(this.form, 'isUpdateAmount', '0')
        this.$refs.ProductInfo.handleCalculate()
      })
    },

    /* 第二部分表单 */
    queryIncotermList() {
      queryIncotermList({}).then((res) => {
        this.incotermOptions = res.data || []
      })
    },
    incotermIdChange(item) {
      this.$set(this.form, 'incotermId', item.incotermId)
      this.$set(this.form, 'incotermName', item.incotermName)
      this.$set(this.form, 'incotermAbbreviation', item.incotermAbbreviation)
      this.$set(this.form, 'incotermAddressType', item.incotermAddressType)
      this.getFormattedVarContentFn()

      this.receivePortClear()
      this.$nextTick(() => {
        this.$refs.form2.clearValidate(['receivePortName', 'receiveAddressName'])
        this.queryCanSelectPortList()
      })
      if (this.form.documentType !== 'ServiceOrder') {
        this.receiveAddressClear()
      }
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
        firstCountryId = this.form.receiveAddressCountryId || this.form.countryId
        // firstCountry = this.form.receiveAddressCountry || this.form.country
        // firstCity = this.form.receiveAddressCity
        firstCountry =
          this.form.receiveAddressCountry || this.form.registeredAddressCountry || this.form.country
        firstCity = this.form.receiveAddressCity || this.form.registeredAddressCity
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
        firstCountryId = this.form.receiveAddressCountryId || this.form.countryId
        // firstCountry = this.form.receiveAddressCountry || this.form.country
        // firstCity = this.form.receiveAddressCity
        firstCountry =
          this.form.receiveAddressCountry || this.form.registeredAddressCountry || this.form.country
        firstCity = this.form.receiveAddressCity || this.form.registeredAddressCity
      }
      this.$refs.selectPortTable.handleOpen(firstCountryId, firstCountry, firstCity)
    },
    openReceiveAddressTable() {
      this.$refs.payToAddressDlg.handleOpen()
    },
    receivePortClear() {
      this.$set(this.form, 'receivePortName', undefined)
      this.$set(this.form, 'receivePortId', undefined)
      this.$set(this.form, 'receiveAddressForPort', undefined)
    },
    receiveAddressClear(isFromClear) {
      if (isFromClear && this.form.isAdhocEntryAddress === '1') {
        this.$set(this.form, 'bpBusinessAddressOldData', undefined)
      }
      this.$set(this.form, 'bpAddressDataId', undefined)
      this.$set(this.form, 'bpBusinessAddressId', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'bpBusinessAddress', undefined)
      this.$set(this.form, 'receiveAddress', undefined)
      this.$set(this.form, 'district', undefined)
      this.$set(this.form, 'isAdhocEntryAddress', undefined)
      this.$set(this.form, 'receiveAddressCountryId', undefined)
      this.$set(this.form, 'receiveAddressCountry', undefined)
      this.$set(this.form, 'receiveAddressCity', undefined)
      this.getFormattedVarContentFn()
    },
    /* 手动填入BP地址 */
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
      this.$set(this.form, 'bpAddressDataId', row.bpAddressDataId)
      this.$set(this.form, 'bpBusinessAddressId', row.businessAddressId)
      this.$set(this.form, 'bpBusinessAddress', row)
      this.$set(this.form, 'bpBusinessAddressOldData', row)
      // this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressName', row.receiveAddressName || row.label)

      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
      this.$set(this.form, 'isAdhocEntryAddress', '1')
      this.$set(this.form, 'receiveAddressCountryId', row.countryId)
      this.$set(this.form, 'receiveAddressCountry', row.country)
      this.$set(this.form, 'receiveAddressCity', row.city)
      this.queryCanSelectPortList()
    },
    updatePort(row) {
      const { portName, portId, countryId, country } = row
      this.$set(this.form, 'receiveAddressForPort', row)
      this.$set(this.form, 'receivePortName', portName)
      this.$set(this.form, 'receivePortId', portId)
      this.getFormattedVarContentFn()

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
            .then(() => {
              this.$refs.portRef.handleBlur()
            })
            .catch(() => {})
        }
      }
      if (['CIF', 'CFR'].indexOf(this.form.incotermAbbreviation) !== -1) {
        if (
          (this.form.receiveAddressCountry ||
            this.form.registeredAddressCountry ||
            this.form.country) &&
          (this.form.receiveAddressCountry ||
            this.form.registeredAddressCountry ||
            this.form.country) !== country
        ) {
          this.$alert(
            this.$t('SALES.portIncorrectForCIFOrCFR').replace('$1', this.form.incotermAbbreviation),
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
            .then(() => {
              this.$refs.portRef.handleBlur()
            })
            .catch(() => {})
        }
      }
    },
    updateAddress(row) {
      this.$set(this.form, 'bpAddressDataId', row.bpAddressDataId)
      this.$set(this.form, 'bpBusinessAddressId', row.businessAddressId)
      this.$set(this.form, 'bpBusinessAddress', row)
      // this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressName', row.receiveAddressName || row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
      this.$set(this.form, 'isAdhocEntryAddress', undefined)
      this.$set(this.form, 'receiveAddressCountryId', row.countryId)
      this.$set(this.form, 'receiveAddressCountry', row.country)
      this.$set(this.form, 'receiveAddressCity', row.city)
      this.queryCanSelectPortList()
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
      if (row.isAdhocEntryContactPerson === '1') {
        this.$set(this.form, 'bpBusinessContactPerson', row)
        this.$set(this.form, 'isAdhocEntryContactPerson', '1')
      } else {
        this.$set(this.form, 'isAdhocEntryContactPerson', undefined)
        this.$set(this.form, 'bpBusinessContactPerson', undefined)
      }
    },
    contactPersonClear() {
      this.$set(this.form, 'bpBusinessContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonName', undefined)
      this.$set(this.form, 'bpMobileNum', undefined)
      this.$set(this.form, 'bpMobileCode', undefined)
      this.$set(this.form, 'bpMobilePhone', undefined)
      this.$set(this.form, 'bpEmail', undefined)
      this.$set(this.form, 'isAdhocEntryContactPerson', undefined)
      this.$set(this.form, 'bpBusinessContactPerson', undefined)
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
      this.$set(this.form, 'bpContactPersonId', row.contactPersonId || undefined)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'bpMobileNum', row.mobileNum)
      this.$set(this.form, 'bpMobileCode', row.mobileCode)
      this.$set(this.form, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.form, 'bpEmail', row.email)
      this.$set(this.form, 'isAdhocEntryContactPerson', '1')
      if (row.contactPersonId) {
        const showList = this.form.bpBusinessContactPersonList || []
        const index = showList.findIndex((x) => x.contactPersonId === row.contactPersonId)
        if (index >= 0) {
          showList.splice(index, 1, row)
        }
      }
    },
    /* 表单部分End */
    getSQSubmitConfirm() {
      const bpBusinessAddress = this.form.bpBusinessAddress || {}
      if (
        this.form.incotermAddressType === '2' &&
        bpBusinessAddress.country &&
        this.legalEntityInfo.country !== bpBusinessAddress.country
      ) {
        return this.$t('SALES.SQinternationalTransactionsSubmitConfirm')
      } else {
        return this.$t('SALES.SQSubmitConfirm')
      }
    },

    async submitForm(submitType, isConfirm = true, gotoRoute) {
      const myFileIds = this.$refs.ProductInfo.getFileIds()
      if (myFileIds === false) {
        return
      }
      if (submitType === 'save') {
        this.collapseWarningForProjectInfo = false
        this.collapseWarningForShippingInfo = false
        let valid1 = true
        this.$refs.form1.clearValidate()
        this.$refs.projectInfo && this.$refs.projectInfo.clearValidate()
        this.$refs.form2 && this.$refs.form2.clearValidate()
        this.$refs.form1.validateField(['salesQuotationType', 'businessPartnerName'], (err) => {
          if (err) {
            valid1 = false
          }
        })
        this.collapseWarningForBasicInfo = !valid1
        if (!valid1) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
          return
        }
      } else {
        const valid1 = await this.$refs.form1.validate().catch((err) => {
          return err
        })
        this.collapseWarningForBasicInfo = !valid1
        if (!valid1) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
          return
        }

        let valid3 = true
        if (submitType === 'generateSO') {
          valid3 = await this.$refs.form3.validate().catch((err) => {
            return err
          })
          this.collapseWarningForPODetail = !valid3
          if (!valid3) {
            this.$modal.msgError(
              this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.customerPODetail'))
            )
            return
          }
          const myFileIdsForPO = this.$refs.uploadRefPO.getFileIds({
            required: ['1', '2', '3'].includes(this.form.poType),
            requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
          })
          if (myFileIdsForPO === false) {
            this.collapseWarningForPODetail = true
            return
          }
          this.form.commonFileListForPO = myFileIdsForPO
          this.collapseWarningForPODetail = false
        }

        if (submitType === 'updateCustomerPODetail') {
          valid3 = await this.$refs.form3.validate().catch((err) => {
            return err
          })
          this.collapseWarningForPODetail = !valid3
          if (!valid3) {
            this.$modal.msgError(
              this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.customerPODetail'))
            )
            return
          }
          const myFileIdsForPO = this.$refs.uploadRefPO.getFileIds({
            required: ['1', '2', '3'].includes(this.form.poType),
            requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
          })
          if (myFileIdsForPO === false) {
            this.collapseWarningForPODetail = true
            return
          }
          this.form.commonFileListForPO = myFileIdsForPO
          this.collapseWarningForPODetail = false
        }

        if (this.form.salesQuotationType === 'MixDesign') {
          const valid3 = await this.$refs.projectInfo.submitForm()
          if (!valid3) {
            this.$modal.msgError(
              this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.projectInfo'))
            )
            this.collapseWarningForProjectInfo = true
            return
          }
          this.collapseWarningForProjectInfo = false
        } else {
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
        }
      }

      let param = { ...this.form }

      if (submitType === 'save') {
        this.collapseWarningForProductInfo = false
        this.collapseWarningForConditions = false
      } else {
        if (param.priceTbd === '1' && param.subTotal === 0) {
          this.$modal.msgError(this.$t('SALES.enabledZero'))
          return
        }
        if (param.salesQuotationType === 'Trading') {
          // const validProduct = this.validProductList(param.salesQuotationProductList)
          // if (!validProduct) {
          //   this.$refs.ProductInfo.activeName = 'productDetail'
          //   this.collapseWarningForProductInfo = true
          //   return
          // }
          // this.$refs.ProductInfo.requiredError('', 'productDetail')

          const validProduct = this.validProductOrServiceList(param.productOrServiceList)
          if (!validProduct) {
            this.$refs.ProductInfo.activeName = 'ServiceTypeProduct'
            this.collapseWarningForProductInfo = true
            return
          }
          this.$refs.ProductInfo.requiredError('', 'ServiceTypeProduct')
        } else if (param.salesQuotationType === 'Service') {
          const validProduct = this.validProductOrServiceList(param.productOrServiceList)
          if (!validProduct) {
            this.$refs.ProductInfo.activeName = 'ServiceTypeProduct'
            this.collapseWarningForProductInfo = true
            return
          }
          this.$refs.ProductInfo.requiredError('', 'ServiceTypeProduct')

          /* const validProduct = this.validProductList(param.salesQuotationProductList, false)
        if (!validProduct) {
          this.$refs.ProductInfo.activeName = 'productDetail'
          this.collapseWarningForProductInfo = true
          return
        } */
          /* 服务订单关联SIC时，服务产品可为空 */
          /* const SRIsReqOne = !this.form.serviceOrderId
        const validService = this.validServiceList(param.salesQuotationServiceList, SRIsReqOne)
        if (!validService) {
          this.$refs.ProductInfo.activeName = 'projectTask'
          this.collapseWarningForProductInfo = true
          return
        } */
        } else if (param.salesQuotationType === 'Project') {
          if (param && param.isSalesInquiryProject === '1') {
            console.log(param.salesQuotationProductList, '================2630')

            // 产品明细页签判断
            const validProject = this.validProjectList(param.salesQuotationProductList)
            if (!validProject) {
              this.$refs.ProductInfo.activeName = 'projectProductDetail'
              this.collapseWarningForProductInfo = true
              return
            }

            // 成本明细页签  --- 判断外层的必填项
            const validProject1 = this.validProjectChildrenList(param.salesQuotationProductList)
            if (!validProject1) {
              this.$refs.ProductInfo.activeName = 'projectCostDetails'
              this.collapseWarningForProductInfo = true
              return
            }
            // 成本明细页签  --- 判断内层的必填项
            const detailListValid = (detailList) => {
              for (const item of detailList || []) {
                const childProductList = item.childProductList || []

                if (childProductList.length > 0) {
                  const validProjectChildren = this.validProjectChildrenList(childProductList)

                  if (!validProjectChildren) {
                    return false
                  }

                  // 继续校验更深层级的子级数据
                  if (!detailListValid(childProductList)) {
                    return false
                  }
                }
              }

              return true
            }

            if (!detailListValid(param.salesQuotationProductList)) {
              this.$refs.ProductInfo.activeName = 'projectCostDetails'
              this.collapseWarningForProductInfo = true
              return
            }
          } else {
            const validProduct = this.validProductList(param.salesQuotationProductList)
            if (!validProduct) {
              this.$refs.ProductInfo.activeName = 'productDetail'
              this.collapseWarningForProductInfo = true
              return
            }
            this.$refs.ProductInfo.requiredError('', 'productDetail')
          }
        } else if (param.salesQuotationType === 'Staff') {
          const validProduct = this.validProductList(param.salesQuotationProductList)
          if (!validProduct) {
            this.$refs.ProductInfo.activeName = 'productDetail'
            this.collapseWarningForProductInfo = true
            return
          }
        } else if (param.salesQuotationType === 'MixDesign') {
          // 配合比
          const validProject = this.validMixDesignList(param.salesQuotationMixDesignList)
          if (!validProject) {
            this.$refs.ProductInfo.activeName = 'mixDesign'
            this.collapseWarningForProductInfo = true
            return
          }
          this.$refs.ProductInfo.requiredError('', 'mixDesign')

          // 项目任务
          if (param.specialRequirement === '3') {
            const validService = this.validMixDesignServiceList(param.salesQuotationServiceList)
            if (!validService) {
              this.$refs.ProductInfo.activeName = 'projectTaskMixDesign'
              this.collapseWarningForProductInfo = true
              return
            }
          }
        }

        this.collapseWarningForProductInfo = false

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
      }

      param.commonFileList = myFileIds

      this.handleSetConditionsHtmlStr(true)
      param.conditions = this.form.conditions
      param.conditionsTableJson = this.form.conditionsTableJson

      if (this.form.isTotalAmountNegativeTips === '1') {
        this.$refs.ProductInfo.scrollPageToTotalAmount()
        return
      }

      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
      // if (param.salesQuotationProjectList && param.salesQuotationProjectList.length > 0) {
      //   const { projectTemplateContentList } = param.salesQuotationProjectList[0]
      //   param.salesQuotationProjectContentList = projectTemplateContentList || []
      // }
      // param.commonFileList = myFileIds
      let confirmMsg
      let successMsg
      let submitFn

      if (submitType === 'approvedAndSubmit') {
        // 审批流带提交功能
        this.approvedFormData = param
        this.aplVisible = true
      } else if (submitType === 'generateSO') {
        confirmMsg = this.$t('SALES.SQGenerateSOConfirm')
        successMsg = this.$t('SALES.SQGenerateSOSuccess')
        submitFn = generateSO
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
      } else if (submitType === 'updateCustomerPODetail') {
        /* 转销售订单后更新 客户采购信息 */
        confirmMsg = this.$t('SALES.SQSubmitConfirm')
        successMsg = this.$t('SALES.SQSubmitSuccess')
        submitFn = updateSalesQuotationPurchase
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
      } else if (submitType === 'save') {
        confirmMsg = this.$t('SALES.SQSaveConfirm')
        successMsg = this.$t('SALES.SQSaveSuccess')
        submitFn = saveDraftSalesQuotation
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
      } else {
        let validSQRes = {}
        let isGotoLowStockAlertDlg = false
        if (
          ['Trading', 'Service'].includes(param.salesQuotationType) &&
          !this.isServiceOrderCreated &&
          param.dropShipping !== '1'
        ) {
          this.submitLoading = true
          validSQRes = await checkSalesQuotationProductMsg(param).catch((err) => {
            return err
          })
          this.submitLoading = false
          if (validSQRes.code === 200 && validSQRes.data && validSQRes.data.length > 0) {
            isGotoLowStockAlertDlg = true
          }
        }

        if (isGotoLowStockAlertDlg) {
          this.$refs.lowStockAlertDlg.handleOpen(validSQRes.data, param)
          /*  */
          return
        }

        confirmMsg = this.getSQSubmitConfirm()
        successMsg = this.$t('SALES.SQSubmitSuccess')
        submitFn = saveSalesQuotation
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
    lowStockAlertSuccess(actionType) {
      if (actionType === 'submitLoading') {
        this.submitLoading = true
      }
      if (actionType === 'closeLoading') {
        this.submitLoading = false
      }
      if (actionType === 'closePage') {
        this.submitLoading = false
        this.back()
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

    validCoefficientIsTrue(row) {
      if (!row.uomCoefficient || !row.qty) return true
      const { decimalPlaces, formulaStr } = getMultiplyDecimalPlaces(row.qty, row.uomCoefficient)
      if (row.includeDecimal === '1') {
        if (decimalPlaces <= 3) {
          return true
        } else {
          this.$modal.msgError(
            this.$t('SALES.validCoefficientErrForDecimal')
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
            this.$t('SALES.validCoefficientErr')
              .replace('$1', row.productName)
              .replace('$2', formulaStr)
          )
          return false
        }
      }
    },
    validProductList(detailList, isReqOne = true) {
      const valid = false
      if (detailList.length <= 0) {
        if (isReqOne) {
          this.$modal.msgError(this.$t('SALES.productTableEmpty'))
          return valid
        } else {
          return true
        }
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
        this.$refs.ProductInfo.requiredError('productName', 'productDetail')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
        )
        return valid
      }

      const salesPartNoReq = detailList.find((item) => {
        return (
          !item.salesPartNo &&
          item.isAdhocEntry !== '1' &&
          this.form.salesQuotationType !== 'Staff' &&
          !this.isServiceOrderCreated &&
          !this.generateSOBtnShow &&
          !item.salesQuotationProductId
        )
        // 新增判断条件 没有salesQuotationProductId时 才判断销售编号的必填
        // salesQuotationProductId
      })
      if (salesPartNoReq) {
        this.$refs.ProductInfo.requiredError('salesPartNo', 'productDetail')
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesPartNo')))
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !item.uom
      })
      if (uomReq) {
        this.$refs.ProductInfo.requiredError('uom', 'productDetail')
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.uom1')))
        return valid
      }

      // 隐藏转化系数
      // const uomCoefficientReq = detailList.find((item) => {
      //   return !item.uomCoefficient
      // })
      // if (uomCoefficientReq) {
      //   this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.ratio')))
      //   return valid
      // }

      /* const purchaseQuotationNoReq = detailList.find((item) => {
        return !item.purchaseQuotationNo
      })
      if (purchaseQuotationNoReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.purchaseQuotationNo'))
        )
        return valid
      } */

      if (!(this.form.salesQuotationType === 'Trading' && this.form.blanketOrder === '1')) {
        const qtyReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.qty)
        })
        if (qtyReq) {
          console.log('salesQTY1111')

          this.$refs.ProductInfo.requiredError('qty', 'productDetail')
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
          return valid
        }
      }

      /* 校验系数*数量后小数位是否符合要求 */
      const validCoefficient = detailList.find((item) => {
        return !this.validCoefficientIsTrue(item)
      })
      if (validCoefficient) {
        return valid
      }

      if (this.form.approvedStatus) {
        const unitPriceReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.unitPrice)
        })
        if (unitPriceReq) {
          this.$refs.ProductInfo.requiredError('unitPrice', 'productDetail')
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
          return valid
        }
      } else {
        // 临时产品并且没有审批状态时单价 unitPrice 非必填
        const unitPriceReq = detailList
          .filter((x) => x.isAdhocEntry !== '1')
          .find((item) => {
            return !this.$resultOfBoolean(item.unitPrice)
          })
        if (unitPriceReq) {
          this.$refs.ProductInfo.requiredError('unitPrice', 'productDetail')
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
          return valid
        }
      }

      if (!this.isServiceOrderCreated) {
        const scheduledDeliveryDateReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.deliveryDateForDay)
        })
        if (scheduledDeliveryDateReq) {
          this.$refs.ProductInfo.requiredError('deliveryDateForDay', 'productDetail')
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
          )
          return valid
        }
      }
      /*  const warrantyStartDateReq = detailList.find((item) => {
        return this.$resultOfBoolean(item.warranty) && !item.warrantyStartDate
      })
      if (warrantyStartDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyStartDate'))
        )
        return valid
      } */

      return true
    },
    validServiceList(detailList, isReqOne = true) {
      const valid = false
      if (detailList.length <= 0) {
        if (isReqOne) {
          this.$modal.msgError(this.$t('SALES.projectTaskTableEmpty'))
          return valid
        } else {
          return true
        }
      }

      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        console.log('salesQTY2222')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }
      if (this.form.approvedStatus) {
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
      } else {
        const unitPriceReq = detailList
          .filter((x) => x.isAdhocEntry !== '1')
          .find((item) => {
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
      }

      if (!this.isServiceOrderCreated) {
        const scheduledDeliveryDateReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.deliveryDateForDay)
        })
        if (scheduledDeliveryDateReq) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
          )
          return valid
        }
      }

      return true
    },

    validProductOrServiceList(detailList, isReqOne = true) {
      const valid = false
      if (detailList.length <= 0 && isReqOne) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const productNameReq = detailList.find((item) => {
        return !(item.productName || '').trim()
      })
      if (productNameReq) {
        this.$refs.ProductInfo.requiredError('productName', 'ServiceTypeProduct')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
        )
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !item.uom
      })
      if (uomReq) {
        this.$refs.ProductInfo.requiredError('uom', 'ServiceTypeProduct')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.uom1')))
        return valid
      }

      // 隐藏转化系数
      // const uomCoefficientReq = detailList.find((item) => {
      //   return !item.uomCoefficient && item.productType !== '2'
      // })
      // if (uomCoefficientReq) {
      //   this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.ratio')))
      //   return valid
      // }

      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty) && this.form.blanketOrder !== '1'
      })
      if (qtyReq) {
        this.$refs.ProductInfo.requiredError('qty', 'ServiceTypeProduct')
        console.log('salesQTY3333')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      /* 校验系数*数量后小数位是否符合要求 */
      const validCoefficient = detailList.find((item) => {
        return !this.validCoefficientIsTrue(item)
      })
      if (validCoefficient) {
        return valid
      }

      if (this.form.approvedStatus) {
        const unitPriceReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.unitPrice)
        })
        if (unitPriceReq) {
          this.$refs.ProductInfo.requiredError('unitPrice', 'ServiceTypeProduct')

          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
          return valid
        }
      } else {
        const unitPriceReq = detailList
          .filter((x) => x.isAdhocEntry !== '1')
          .find((item) => {
            return !this.$resultOfBoolean(item.unitPrice)
          })
        if (unitPriceReq) {
          this.$refs.ProductInfo.requiredError('unitPrice', 'ServiceTypeProduct')

          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
          return valid
        }
      }

      if (!this.isServiceOrderCreated) {
        const scheduledDeliveryDateReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.deliveryDateForDay)
        })
        if (scheduledDeliveryDateReq) {
          this.$refs.ProductInfo.requiredError('deliveryDateForDay', 'ServiceTypeProduct')

          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
          )
          return valid
        }
      }
      /* const warrantyStartDateReq = detailList.find((item) => {
        return this.$resultOfBoolean(item.warranty) && !item.warrantyStartDate
      })
      if (warrantyStartDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyStartDate'))
        )
        return valid
      } */

      return true
    },

    // validProjectList1(detailList) {
    //   const valid = false
    //   if (detailList.length <= 0) {
    //     this.$modal.msgError(this.$t('SALES.projectTableEmpty'))
    //     return valid
    //   }
    //   const projectNameReq = detailList.find((item) => {
    //     return !this.$resultOfBoolean(item.projectName)
    //   })
    //   if (projectNameReq) {
    //     this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.projectName')))
    //     return valid
    //   }

    //   return true
    // },
    validProjectList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const productNameReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.productName)
      })
      if (productNameReq) {
        this.$refs.ProductInfo.errorMessage('productName', 'projectProductDetail')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
        )
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !item.uom
      })
      if (uomReq) {
        this.$refs.ProductInfo.errorMessage('uom', 'projectProductDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.uom1')))
        return valid
      }

      // const uomCoefficientReq = detailList.find((item) => {
      //   return !item.uomCoefficient
      // })
      // if (uomCoefficientReq) {
      //   this.$refs.ProductInfo.errorMessage('uomCoefficient', 'projectProductDetail')

      //   this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.ratio')))
      //   return valid
      // }

      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$refs.ProductInfo.errorMessage('qty', 'projectProductDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      /* 校验系数*数量后小数位是否符合要求 */
      // const validCoefficient = detailList.find((item) => {
      //   return !this.validCoefficientIsTrue(item)
      // })
      // if (validCoefficient) {
      //   return valid
      // }
      // const unitPriceReq = detailList.find((item) => {
      //   return !this.$resultOfBoolean(item.unitPrice)
      // })
      // if (unitPriceReq) {
      //   this.$refs.ProductInfo.errorMessage('unitPrice', 'projectProductDetail')

      //   this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
      //   return valid
      // }

      const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDateForDay)
      })
      if (scheduledDeliveryDateReq) {
        this.$refs.ProductInfo.errorMessage('deliveryDateForDay', 'projectProductDetail')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
        )
        return valid
      }

      return true
    },
    validProjectChildrenList(detailList) {
      const valid = false

      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const productNameReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.productName)
      })
      if (productNameReq) {
        this.$refs.ProductInfo.errorMessage('productName', 'projectCostDetails')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
        )
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !item.uom
      })
      if (uomReq) {
        this.$refs.ProductInfo.errorMessage('uom', 'projectCostDetails')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.uom1')))
        return valid
      }

      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.netQty)
      })
      if (qtyReq) {
        this.$refs.ProductInfo.errorMessage('netQty', 'projectCostDetails')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.netQty')))
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        return (
          !this.$resultOfBoolean(item.unitCost) &&
          (!item.childProductList || item.childProductList.length === 0)
        )
      })
      if (unitPriceReq) {
        this.$refs.ProductInfo.errorMessage('unitCost', 'projectCostDetails')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return valid
      }
      return true
    },
    validMixDesignList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.mixDesignTableEmpty'))
        return valid
      }
      const salesPartNoReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.salesPartNo)
      })
      if (salesPartNoReq) {
        this.$refs.ProductInfo.requiredError('salesPartNo', 'mixDesign')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.salesPartNo'))
        )
        return valid
      }

      const volumeReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.volume)
      })
      if (volumeReq) {
        this.$refs.ProductInfo.requiredError('volume', 'mixDesign')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.volume')))
        return valid
      }

      if (this.form.approvedStatus) {
        const unitPriceReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.unitPrice)
        })
        if (unitPriceReq) {
          this.$refs.ProductInfo.requiredError('unitPrice', 'mixDesign')

          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.price')))
          return valid
        }
      } else {
        const unitPriceReq = detailList
          .filter((x) => x.isAdhocEntry !== '1')
          .find((item) => {
            return !this.$resultOfBoolean(item.unitPrice)
          })
        if (unitPriceReq) {
          this.$refs.ProductInfo.requiredError('unitPrice', 'mixDesign')

          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.price')))
          return valid
        }
      }
      const variationShowStrReq = detailList.find((item) => {
        return item.trialMix === '1' && !item.variationShowStr
      })
      if (variationShowStrReq) {
        this.$refs.ProductInfo.requiredError('variationShowStr', 'mixDesign')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.trialMixVariation'))
        )
        return valid
      }
      const passingRequirementsReq = detailList.find((item) => {
        return item.trialMix === '1' && !item.passingRequirements
      })
      if (passingRequirementsReq) {
        this.$refs.ProductInfo.requiredError('passingRequirements', 'mixDesign')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.passingRequirements'))
        )
        return valid
      }

      return true
    },
    validMixDesignServiceList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        // ERP 1.1.0-26-4 版本 改为选填
        return true
        // this.$modal.msgError(this.$t('SALES.projectTaskTableEmpty'))
        // return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        console.log('salesQTY4444')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }
      if (this.form.approvedStatus) {
        const unitPriceReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.unitPrice)
        })
        if (unitPriceReq) {
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))

          return valid
        }
      } else {
        const unitPriceReq = detailList
          .filter((x) => x.isAdhocEntry !== '1')
          .find((item) => {
            return !this.$resultOfBoolean(item.unitPrice)
          })
        if (unitPriceReq) {
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))

          return valid
        }
      }
      return true
    },
    handleSaveDraft() {
      this.submitForm('save')
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      this.submitForm('save', false, gotoRoute)
    },
    handleGenerateSO() {
      const findItems = this.form.salesQuotationProductList.filter((item) => {
        return item.isAdhocEntry === '1'
      })
      if (findItems.length > 0) {
        this.$modal.msgError(
          this.$t('SALES.adhocEntryNoApproved').replace(
            '$1',
            findItems.map((x) => x.productName).join(', ')
          )
        )
        return
      }
      this.submitForm('generateSO')
    },
    handleUpdateCustomerPODetail() {
      this.submitForm('updateCustomerPODetail')
    },
    handlePreviewPDF() {
      const token = getToken()
      this.handleSetConditionsHtmlStr()
      if (this.$refs.ProductInfo) {
        this.$refs.ProductInfo.handleCalculate('previewPDF')
      }
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
    handleTabsClick() {
      if (this.tabsActiveName !== 'pdfInfo') return
      this.pdfInfoUrl = ''
      const token = getToken()
      if (this.$refs.ProductTable) {
        this.$refs.ProductTable.handleCalculate()
      }
      this.handleSetConditionsHtmlStr()
      let param = { ...this.form }
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

      this.pdfInfoLoading = true
      const timer = Date.now()
      this.queryTime = timer
      preview(param)
        .then((res) => {
          if (timer !== this.queryTime) return
          this.pdfInfoLoading = false
          const fileID = res.data || ''
          if (fileID) {
            const myUrl =
              process.env.VUE_APP_BASE_API +
              '/system/oss/filePreview/' +
              `${fileID}` +
              '?token=' +
              `${token}`
            this.pdfInfoUrl = myUrl
          }
        })
        .catch(() => {
          this.pdfInfoLoading = false
        })
    },
    handlePrintPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/sales/salesQuotation/preview' +
        `/${this.form.salesQuotationMainId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    handleExportPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/sales/salesQuotation/download' +
        `/${this.form.salesQuotationMainId}` +
        '?token=' +
        `${token}`
      window.location = myUrl
    },

    handleRevise() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: '/salesManagement/reviseSalesQuotation',
        query: {
          id: this.form.salesQuotationMainId,
          timeId: Date.now()
        }
      })
    },

    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.form.salesQuotationMainId)
    },
    getBeforeValue(prop) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop) || {}
      return this.formatComparisonValue(prop, item.beforeValue)
    },
    getAfterValue(prop, fallback) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop)
      const value = item && item.afterValue !== undefined ? item.afterValue : fallback
      return this.formatComparisonValue(prop, value)
    },
    formatComparisonValue(prop, value) {
      if (
        [
          'validity',
          'deliveryDate',
          'consignmentStartTime',
          'consignmentEndTime',
          'expirationDate'
        ].includes(prop) &&
        value
      ) {
        return this.parseTime(value, this.fmtForYmd)
      }
      return value
    },
    exitComparison() {
      const cloneList = (list) => JSON.parse(JSON.stringify(list || []))
      this.isComparison = false
      this.$set(
        this.form,
        'salesQuotationProductList',
        cloneList(this.salesQuotationProductListCur)
      )
      this.$set(
        this.form,
        'salesQuotationProjectList',
        cloneList(this.salesQuotationProjectListCur)
      )
      this.$set(
        this.form,
        'salesQuotationServiceList',
        cloneList(this.salesQuotationServiceListCur)
      )
      this.$set(this.form, 'productOrServiceList', cloneList(this.productOrServiceListCur))
      this.$set(this.form, 'projectCostDetailList', cloneList(this.projectCostDetailListCur))
      this.$set(
        this.form,
        'salesQuotationMixDesignList',
        cloneList(this.salesQuotationMixDesignListCur)
      )
      this.initCommonFileList = cloneList(this.commonFileListCur)
      this.$nextTick(() => {
        if (this.$refs.ProductInfo) {
          this.$refs.ProductInfo.initFileList(this.commonFileListCur)
        }
        const routeStatus = formDirtyClass.routeStatusData[this.$route.name]
        if (routeStatus) {
          routeStatus.initFormJson = this.getFormJson()
        }
      })
    },
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    },
    querySalesQuotationHistoryVersion() {
      if (this.comeFrom !== '1') return
      querySalesQuotationHistoryVersion({ businessId: this.rowId }).then((res) => {
        this.bpHistoryVersionList = res.data || []
      })
    },
    settingHandleCommand(businessId) {
      this.$router.push({
        path: '/salesManagement/viewSalesQuotation',
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

    exportPDFCommand(salesQuotationMainId) {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/sales/salesQuotation/preview' +
        `/${salesQuotationMainId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    dropdownVisibleChange2() {
      /* 下拉菜单关闭后滚动条 手动还原 */
      if (this.$refs.scrollbar2) {
        this.$refs.scrollbar2.moveY = 0
      }
    },
    /* 审批 */
    handleApproved() {
      if (this.isComparison || !this.submitBtnShow) {
        this.approvedFormData = undefined
        this.aplVisible = true
      } else {
        this.submitForm('approvedAndSubmit')
      }
    },
    aplVisibleChange(data) {
      this.aplVisible = data || false
    },
    aplSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.approvedSuccess')}`.replace(
          '$1',
          `${this.$t('SALES.salesQuotation')} [${vm.form.salesQuotationNo}]`
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
          `${this.$t('SALES.salesQuotation')} [${vm.form.salesQuotationNo}]`
        )
      )
      this.rjVisible = false
      vm.back('onRejectedSuccess')
    },
    handleReturn() {
      this.returnVisible = true
    },
    returnVisibleChange(data) {
      this.returnVisible = data || false
    },
    returnSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.returnedSuccess')}`.replace(
          '$1',
          `${vm.$t('SALES.salesQuotation')} [${vm.form.salesQuotationNo}]`
        )
      )
      vm.returnVisible = false
      vm.back('onApprovedSuccess')
    },

    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.cancelledSuccess')}`.replace(
          '$1',
          `${this.$t('SALES.salesQuotation')} [${vm.form.salesQuotationNo}]`
        )
      )
      vm.back('onCancelSuccess')
    },

    handleActivate() {
      this.$refs.FormActivateDialog.handleOpen(this.form)
    },
    activateSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('SALES.SQ_ActivateSuccess')}`.replace('$1', vm.form.salesQuotationNo)
      )
      vm.back('onActivateSuccess')
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

<style lang="scss" scoped>
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
  border-left: 3px solid #f56c6c;
}
.reject-card ::v-deep .el-collapse-item__header,
.reject-card ::v-deep .el-collapse-item__wrap {
  background-color: #fff7f7;
}
.exportHistoryPDF {
  position: absolute;
  right: 20px;
}
.custom-form-item {
  margin-bottom: 0 !important;
  .custom-tip {
    // position: absolute;
    // top: 30px;
    width: 100%;
    line-height: 1.1;
    font-size: 12px;
    padding: 5px 0;
  }
}
</style>
