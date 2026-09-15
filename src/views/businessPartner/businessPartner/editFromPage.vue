<template>
  <FormPageLayoutTabs v-loading="submitLoading">
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        v-if="!comDisFrom && !approvedBtnShow"
        @click="submitForm(false)"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="saveDraftBtnShow" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
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
      <el-button type="primary" size="mini" v-if="reviseBtnShow" @click="handleRevise"
        >{{ $t('uiBtn.revise') }}
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
        class="ml10 mr10 fr"
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
                >{{ item.businessNoAndRevision }}
              </el-dropdown-item>
            </div>
          </el-scrollbar>
        </el-dropdown-menu>
      </el-dropdown>
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">
        {{ $t('menu.businessPartner') }}
      </div>
    </template>
    <template v-slot:tabs>
      <el-tabs v-model="activeName" size="mini" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('ui.basicInfo')" name="basicInfo"></el-tab-pane>
        <el-tab-pane
          v-if="form.typeList.includes('0')"
          :label="$t('bp.customerInfo')"
          name="customerInfo"
        ></el-tab-pane>
        <el-tab-pane
          v-if="form.typeList.includes('1')"
          :label="$t('bp.supplierInfo')"
          name="supplierInfo"
        ></el-tab-pane>
        <el-tab-pane :label="$t('ui.attachment')" name="attachment"></el-tab-pane>
      </el-tabs>
    </template>
    <template v-slot:content>
      <!-- <div class="form-card" v-show="activeName !== 'attachment'">
        <FormSteps
          :statusList="dict.type.bp_business_partner_status"
          :status="form.businessPartnerStatus"
        />
      </div> -->
      <div v-show="activeName === 'basicInfo'">
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
                  {{ $t('ui.businessPartnerName') }} : {{ form.businessPartnerName }}
                </span>
                <span class="info-item">
                  {{ $t('ui.status') }} :
                  {{ form.businessPartnerStatusShowStr }}
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
                    <el-form-item
                      :label="`${$t('ui.category')}`"
                      prop="typeList"
                      :class="[isModified('businessPartnerType')]"
                    >
                      <el-checkbox-group
                        v-model="form.typeList"
                        style="height: 36px"
                        @change="typeListChange"
                      >
                        <el-checkbox
                          label="0"
                          :disabled="
                            sysDockingSwitch &&
                            isSystemDocking === '1' &&
                            form.isRevise === '1' &&
                            form.businessPartnerType &&
                            form.businessPartnerType.indexOf('0') !== -1
                          "
                          >{{ $t('ui.customer') }}</el-checkbox
                        >
                        <el-checkbox
                          label="1"
                          :disabled="
                            sysDockingSwitch &&
                            isSystemDocking === '1' &&
                            form.isRevise === '1' &&
                            form.businessPartnerType &&
                            form.businessPartnerType.indexOf('1') !== -1
                          "
                          >{{ $t('ui.supplier') }}</el-checkbox
                        >
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="false">
                    <el-form-item :label="`${$t('ui.dept')}`" prop="departmentId">
                      <el-input
                        v-model="form.departmentName"
                        :title="form.allSuperiorName"
                        maxlength="200"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <el-form-item
                      :label="`${$t('ui.businessPartnerName')}`"
                      prop="businessPartnerName"
                    >
                      <ComparisonInput
                        v-if="isModified('businessPartnerName')"
                        :beforeValue="getBeforeValue('businessPartnerName')"
                        :afterValue="form.businessPartnerName"
                      />
                      <el-input
                        v-else
                        v-model="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        :disabled="comDisFrom"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.businessPartnerCode')}`">
                      <el-input
                        :value="form.businessPartnerNoShowStr"
                        :title="form.businessPartnerNoShowStr"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.abbreviation')}`">
                      <ComparisonInput
                        v-if="isModified('abbreviation')"
                        :beforeValue="getBeforeValue('abbreviation')"
                        :afterValue="form.abbreviation"
                      />
                      <el-input
                        v-else
                        v-model="form.abbreviation"
                        :title="form.abbreviation"
                        maxlength="50"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('bp.alias')}`" prop="alias">
                      <ComparisonInput
                        v-if="isModified('alias')"
                        :beforeValue="getBeforeValue('alias')"
                        :afterValue="form.alias"
                      />
                      <el-input
                        v-else
                        v-model="form.alias"
                        :title="form.alias"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="form.businessPartnerStatusShowStr"
                        :title="form.businessPartnerStatusShowStr"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.country')}`" prop="country">
                      <ComparisonInput
                        v-if="isModified('country')"
                        :beforeValue="getBeforeValue('country')"
                        :afterValue="form.country"
                      />
                      <CountrySelect
                        v-else
                        v-model="form.country"
                        class="form-wd"
                        @select="handleCountrySelect"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`" prop="regCurrencyId">
                      <ComparisonInput
                        v-if="isModified('regCurrency')"
                        :beforeValue="getBeforeValue('regCurrency')"
                        :afterValue="form.regCurrency"
                      />
                      <CommonSelect
                        v-else
                        :id="form.regCurrencyId"
                        :label="form.regCurrency"
                        idKey="id"
                        labelKey="currency"
                        filterable
                        :disabled="comDisFrom"
                        :options="currencyOptions"
                        @change="salesCurrencyChangeRegistrationInfo"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.website')}`" prop="website">
                      <ComparisonInput
                        v-if="isModified('website')"
                        :beforeValue="getBeforeValue('website')"
                        :afterValue="form.website"
                      />
                      <el-input
                        v-else
                        v-model="form.website"
                        :title="form.website"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`" prop="email">
                      <ComparisonInput
                        v-if="isModified('email')"
                        :beforeValue="getBeforeValue('email')"
                        :afterValue="form.email"
                      />
                      <el-input
                        v-else
                        v-model.trim="form.email"
                        :title="form.email"
                        maxlength="50"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.phone')}`" prop="mobilePhone" ref="mobileNoRef">
                      <ComparisonInput
                        v-if="isModified('mobilePhone')"
                        :beforeValue="getBeforeValue('mobilePhone')"
                        :afterValue="form.mobilePhone"
                      />
                      <MobilePhoneInput
                        v-else
                        :mobileCode.sync="form.mobileCode"
                        :mobileNum.sync="form.mobileNum"
                        :mobileNo.sync="form.mobilePhone"
                        :disabled="comDisFrom"
                        @clearValidate="$refs.mobileNoRef.clearValidate()"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')" :class="[isModified('remarks')]">
                      <MyInput
                        type="textarea"
                        v-model="form.remarks"
                        :autosize="{ minRows: 2, maxRows: 8 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.createdBy')}`">
                      <el-input :value="form.createdBy" disabled class="form-wd"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.createdTime')}`">
                      <el-date-picker
                        :value="form.createdTime"
                        :editable="false"
                        disabled
                        type="date"
                        :format="fmtForYmdhms"
                        :style="{ width: '100%' }"
                        placeholder
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.isActive')}`" :class="[isModified('isActive')]">
                      <el-switch
                        v-model="form.isActive"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('bp.shippingAgent')}`"
                      :class="[isModified('shippingAgent')]"
                    >
                      <el-switch
                        v-model="form.shippingAgent"
                        active-value="1"
                        inactive-value="0"
                        :disabled="form.typeList.indexOf('1') === -1"
                      ></el-switch>
                      <el-tooltip placement="top">
                        <div slot="content">
                          <div v-html="$t('switchTip.shippingAgentTip')"></div>
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
                :title="$t('ui.registrationInfo')"
                :warning="collapseWarningForRegistrationInfo"
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
                    <el-form-item :label="`${$t('ui.companyRegNo')}`" prop="companyRegNo">
                      <ComparisonInput
                        v-if="isModified('companyRegNo')"
                        :beforeValue="getBeforeValue('companyRegNo')"
                        :afterValue="form.companyRegNo"
                      />
                      <el-input
                        v-else
                        v-model="form.companyRegNo"
                        :title="form.companyRegNo"
                        :disabled="form.isRevise === '1'"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.corporateRepresentative')}`">
                      <ComparisonInput
                        v-if="isModified('corporateRepresentative')"
                        :beforeValue="getBeforeValue('corporateRepresentative')"
                        :afterValue="form.corporateRepresentative"
                      />
                      <el-input
                        v-else
                        v-model="form.corporateRepresentative"
                        :title="form.corporateRepresentative"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('ui.fax')}`"
                      :class="[isModified('faxCode'), isModified('fax')]"
                      prop="fax"
                      ref="faxRef"
                    >
                      <MobilePhoneInput
                        :mobileCode.sync="form.faxCode"
                        :mobileNum.sync="form.fax"
                        :mobileNo.sync="form.faxPhone"
                        @clearValidate="$refs.faxRef.clearValidate()"
                        :disabled="comDisFrom"
                      />
                      <!-- <el-input v-model="createForm.fax" :maxlength="50" class="form-wd" /> -->
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.taxpayerIdentificationNo')}`">
                      <ComparisonInput
                        v-if="isModified('taxpayerIdentificationNo')"
                        :beforeValue="getBeforeValue('taxpayerIdentificationNo')"
                        :afterValue="form.taxpayerIdentificationNo"
                      />
                      <el-input
                        v-else
                        v-model="form.taxpayerIdentificationNo"
                        :title="form.taxpayerIdentificationNo"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.registeredCapital')}`">
                      <ComparisonInput
                        v-if="isModified('registeredCapital')"
                        :beforeValue="getBeforeValue('registeredCapital')"
                        :afterValue="form.registeredCapital"
                      />
                      <el-input
                        v-else
                        v-model="form.registeredCapital"
                        :title="form.registeredCapital"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="`${$t('organization.trademark')}`"
                      :class="[isModified('commonFileListTrademark')]"
                    >
                      <div class="text-center" style="width: 120px">
                        <userAvatar
                          :dlgTitle="$t('organization.trademark')"
                          :photoUrl="form.photoUrl"
                          @change="changePhoto"
                          :disabled="comDisFrom"
                          :isDownload="form.businessPartnerStatus !== '2'"
                          :documentName="
                            form.businessPartnerName
                              ? form.businessPartnerName + ' - ' + 'Trademark'
                              : 'Trademark'
                          "
                          :commonFileList="form.commonFileListTrademark || []"
                        />
                      </div>
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
                :title="$t('ui.addressInfo')"
                :warning="collapseWarningForAddressInfo"
              >
              </FormCollapseItemTitle>
              <AddressInfo
                ref="AddressInfoRef"
                :comDisFrom="comDisFrom"
                :modifyHighlight="modifyHighlight"
                :countryItem="{ countryId: form.countryId, country: form.country }"
                :cdsQc="accForm2.syncCustomer === '1' || accForm1.syncSupplier === '1' ? '1' : '0'"
                :geofenceTypeRequired="accForm2.syncCustomer === '1' ? true : false"
                :projectList="projectList"
                @change="addressListChange"
              />
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.contactPersonInfo')"
                :warning="collapseWarningForContactPersonInfo"
              >
              </FormCollapseItemTitle>
              <ContactPersonInfo
                ref="ContactPersonInfoRef"
                :comDisFrom="comDisFrom"
                :modifyHighlight="modifyHighlight"
                :addressList="addressList"
                :cdsQc="accForm2.syncCustomer === '1' || accForm1.syncSupplier === '1' ? '1' : '0'"
                :typeList="form.typeList"
                @change="contactPersonListChange"
                :countryMobileCode="form.countryMobileCode"
              />
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
      <div v-show="activeName === 'customerInfo'">
        <div class="form-card form-card--p20">
          <el-form
            ref="form3"
            :model="accForm2"
            @submit.native.prevent
            :rules="accFormRules"
            label-width="180px"
            :disabled="comDisFrom"
          >
            <el-row key="customerType">
              <el-col :span="8">
                <el-form-item :label="`${$t('ui.customerType')}`" prop="customerType">
                  <ComparisonInput
                    v-if="isModified('customerType', 3)"
                    :beforeValue="getBeforeValue('customerType', 3)"
                    :afterValue="getAfterValue('customerType', 3, accForm2.customerType)"
                  />
                  <el-select
                    v-else
                    v-model="accForm2.customerType"
                    :disabled="comDisFrom"
                    placeholder=""
                    style="width: 100%"
                    clearable
                  >
                    <el-option
                      v-for="dict in dict.type.bp_customer_type"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('ui.customerGroup')}`" prop="customerGroup">
                  <ComparisonInput
                    v-if="isModified('customerGroup', 3)"
                    :beforeValue="getBeforeValue('customerGroup', 3)"
                    :afterValue="getAfterValue('customerGroup', 3, accForm2.customerGroup)"
                  />
                  <el-select
                    v-else
                    v-model="accForm2.customerGroup"
                    :disabled="comDisFrom"
                    placeholder=""
                    style="width: 100%"
                    clearable
                  >
                    <el-option
                      v-for="dict in dict.type.bp_customer_group"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="sysDockingSwitch && isSystemDocking === '1'">
              <el-col :span="8">
                <el-form-item :label="`${$t('ui.systemDocking')}`" prop="syncCustomer">
                  <el-switch
                    v-model="accForm2.syncCustomer"
                    active-value="1"
                    inactive-value="0"
                    :disabled="form.businessPartnerStatus === '3' || form.isRevise === '1'"
                    @change="isSystemDockingChange"
                  ></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('bp.displayProdCodeOnApp')}`">
                  <el-switch
                    v-model="accForm2.displayProdCodeOnApp"
                    :disabled="comDisFrom"
                    active-value="1"
                    inactive-value="0"
                  ></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-collapse v-model="activeNames1">
          <div class="form-card mt10">
            <el-collapse-item name="1">
              <template slot="title">
                <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
                <strong>{{ $t('ui.customerSettlement') }}</strong>
              </template>
              <el-form
                ref="accForm2"
                :model="accForm2"
                @submit.native.prevent
                :rules="{}"
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`">
                      <ComparisonInput
                        v-if="isModified('currency', 3)"
                        :beforeValue="getBeforeValue('currency', 3)"
                        :afterValue="accForm2.currency"
                      />
                      <CommonSelect
                        v-else
                        :id="accForm2.currencyId"
                        :label="accForm2.currency"
                        idKey="id"
                        labelKey="currency"
                        filterable
                        :disabled="comDisFrom"
                        :options="currencyOptions"
                        @change="salesCurrencyChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.invoiceType')}`">
                      <ComparisonInput
                        v-if="isModified('invoiceType', 3)"
                        :beforeValue="getBeforeValue('invoiceType', 3)"
                        :afterValue="getAfterValue('invoiceType', 3, accForm2.invoiceType)"
                      />
                      <el-select
                        v-else
                        v-model="accForm2.invoiceType"
                        placeholder=""
                        style="width: 100%"
                        clearable
                      >
                        <el-option
                          v-for="dict in dict.type.bp_invoice_type"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('ui.paymentTerm')}`">
                      <ComparisonInput
                        v-if="isModified('paymentTermName', 3)"
                        :beforeValue="getBeforeValue('paymentTermName', 3)"
                        :afterValue="getAfterValue('paymentTermName', 3, accForm2.paymentTermName)"
                      />
                      <ToolTipPaymentTerm v-else :paymentTermObj="accForm2.paymentTerm || {}">
                        <SelectInput
                          :value="accForm2.paymentTermName"
                          @clear="salesPaymentTermChange({})"
                          clearable
                          @click="openSalesPaymentTermDlg"
                          :disabled="comDisFrom"
                          class="form-wd"
                        />
                      </ToolTipPaymentTerm>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="3">
              <!-- <template slot="title">
                <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
                <strong>{{ $t('organization.bankInfo') }}</strong>
              </template> -->
              <FormCollapseItemTitle
                slot="title"
                :title="$t('organization.bankInfo')"
                :warning="collapseWarningForBankInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="bankInfoRef"
                :model="accForm2"
                @submit.native.prevent
                :rules="accFormRules"
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.accountName')}`" prop="accountName">
                      <ComparisonInput
                        v-if="isModified('accountName', 3)"
                        :beforeValue="getBeforeValue('accountName', 3)"
                        :afterValue="accForm2.accountName"
                      />
                      <el-autocomplete
                        v-else
                        style="width: 100%"
                        v-model="accForm2.accountName"
                        :title="accForm2.accountName"
                        :fetch-suggestions="accountNameQuerySug"
                        @select="customerAccountNameChange"
                        placeholder
                        clearable
                        :maxlength="200"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('organization.beneficiaryName')}`"
                      prop="beneficiaryName"
                    >
                      <ComparisonInput
                        v-if="isModified('beneficiaryName', 3)"
                        :beforeValue="getBeforeValue('beneficiaryName', 3)"
                        :afterValue="accForm2.beneficiaryName"
                      />
                      <el-input
                        v-else
                        v-model="accForm2.beneficiaryName"
                        :title="accForm2.beneficiaryName"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('organization.bankAccountNumber')}`"
                      prop="bankAccountNumber"
                    >
                      <ComparisonInput
                        v-if="isModified('bankAccountNumber', 3)"
                        :beforeValue="getBeforeValue('bankAccountNumber', 3)"
                        :afterValue="accForm2.bankAccountNumber"
                      />
                      <el-input
                        v-else
                        v-model="accForm2.bankAccountNumber"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.bankName')}`" prop="bankName">
                      <ComparisonInput
                        v-if="isModified('bankName', 3)"
                        :beforeValue="getBeforeValue('bankName', 3)"
                        :afterValue="accForm2.bankName"
                      />
                      <el-input v-else v-model="accForm2.bankName" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('organization.accountCurrency')}`"
                      prop="accountCurrencyCode"
                    >
                      <ComparisonInput
                        v-if="isModified('accountCurrencyCode', 3)"
                        :beforeValue="getBeforeValue('accountCurrencyCode', 3)"
                        :afterValue="accForm2.accountCurrency"
                      />
                      <CommonSelect
                        v-else
                        :id="accForm2.accountCurrencyCode"
                        :label="accForm2.accountCurrency"
                        :title="accForm2.accountCurrency"
                        idKey="currencyCode"
                        labelKey="currency"
                        :filterable="true"
                        :clearable="false"
                        :options="currencyOptions || []"
                        @change="customerBankCurrencyChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.SWIFTCode')}`" prop="swiftCode">
                      <ComparisonInput
                        v-if="isModified('swiftCode', 3)"
                        :beforeValue="getBeforeValue('swiftCode', 3)"
                        :afterValue="accForm2.swiftCode"
                      />
                      <el-input v-else v-model="accForm2.swiftCode" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.bankCode')}`" prop="bankCode">
                      <ComparisonInput
                        v-if="isModified('bankCode', 3)"
                        :beforeValue="getBeforeValue('bankCode', 3)"
                        :afterValue="accForm2.bankCode"
                      />
                      <el-input v-else v-model="accForm2.bankCode" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.branchCode')}`" prop="branchCode">
                      <ComparisonInput
                        v-if="isModified('branchCode', 3)"
                        :beforeValue="getBeforeValue('branchCode', 3)"
                        :afterValue="accForm2.branchCode"
                      />
                      <el-input v-else v-model="accForm2.branchCode" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.businessRegNo')}`">
                      <el-input
                        :value="form.companyRegNo"
                        :title="form.companyRegNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-divider></el-divider>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.addressLine1')}`" prop="address1">
                      <ComparisonInput
                        v-if="isModified('address1', 3)"
                        :beforeValue="getBeforeValue('address1', 3)"
                        :afterValue="accForm2.address1"
                      />
                      <el-input v-else v-model="accForm2.address1" maxlength="500"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.addressLine2')}`">
                      <ComparisonInput
                        v-if="isModified('address2', 3)"
                        :beforeValue="getBeforeValue('address2', 3)"
                        :afterValue="accForm2.address2"
                      />
                      <el-input v-else v-model="accForm2.address2" maxlength="500"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.provinceState')}`" prop="province">
                      <ComparisonInput
                        v-if="isModified('province', 3)"
                        :beforeValue="getBeforeValue('province', 3)"
                        :afterValue="accForm2.province"
                      />
                      <el-input v-else v-model="accForm2.province" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.cityTown')}`" prop="city">
                      <ComparisonInput
                        v-if="isModified('city', 3)"
                        :beforeValue="getBeforeValue('city', 3)"
                        :afterValue="accForm2.city"
                      />
                      <el-input v-else v-model="accForm2.city" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.location')}`" prop="location">
                      <ComparisonInput
                        v-if="isModified('location', 3)"
                        :beforeValue="getBeforeValue('location', 3)"
                        :afterValue="accForm2.location"
                      />
                      <el-input v-else v-model="accForm2.location" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.postalCode')}`">
                      <ComparisonInput
                        v-if="isModified('postalCode', 3)"
                        :beforeValue="getBeforeValue('postalCode', 3)"
                        :afterValue="accForm2.postalCode"
                      />
                      <el-input v-else v-model="accForm2.postalCode" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.bankCountry')}`" prop="bankCountry">
                      <ComparisonInput
                        v-if="isModified('bankCountry', 3)"
                        :beforeValue="getBeforeValue('bankCountry', 3)"
                        :afterValue="accForm2.bankCountry"
                      />
                      <CountrySelect
                        v-else
                        v-model="accForm2.bankCountry"
                        class="form-wd"
                        @select="customerBankCountrySelect"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')" :class="[isModified('bankRemarks', 3)]">
                      <MyInput
                        type="textarea"
                        v-model="accForm2.bankRemarks"
                        :autosize="{ minRows: 2, maxRows: 8 }"
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

          <div class="form-card mt10" v-if="accForm2.syncCustomer === '1'">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('bp.project')"
                :warning="collapseWarningForProject"
              >
              </FormCollapseItemTitle>
              <projectTable
                ref="projectTable"
                :addressList="addressList"
                :contactPersonList="contactPersonList"
                :comDisFrom="comDisFrom"
                :modifyHighlight="modifyHighlight"
                @change="projectListChange"
                :businessPartnerMainId="form.businessPartnerMainId"
              />
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
      <div v-show="activeName === 'supplierInfo'">
        <div class="form-card form-card--p20">
          <el-form
            ref="form4"
            :model="accForm1"
            @submit.native.prevent
            :rules="accFormRules"
            label-width="180px"
            :disabled="comDisFrom"
          >
            <el-row key="supplierType">
              <el-col :span="8">
                <el-form-item :label="`${$t('ui.supplierType')}`" prop="supplierType">
                  <ComparisonInput
                    v-if="isModified('supplierType', 2)"
                    :beforeValue="getBeforeValue('supplierType', 2)"
                    :afterValue="getAfterValue('supplierType', 2, accForm1.supplierType)"
                  />
                  <el-select
                    v-else
                    v-model="accForm1.supplierType"
                    :disabled="comDisFrom"
                    placeholder=""
                    style="width: 100%"
                    clearable
                  >
                    <el-option
                      v-for="dict in dict.type.bp_supplier_type"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('ui.supplierGroup')}`" prop="supplierGroup">
                  <ComparisonInput
                    v-if="isModified('supplierGroup', 2)"
                    :beforeValue="getBeforeValue('supplierGroup', 2)"
                    :afterValue="getAfterValue('supplierGroup', 2, accForm1.supplierGroup)"
                  />
                  <el-select
                    v-else
                    v-model="accForm1.supplierGroup"
                    :disabled="comDisFrom"
                    placeholder=""
                    style="width: 100%"
                    clearable
                  >
                    <el-option
                      v-for="dict in dict.type.bp_supplier_group"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('bp.shippingAgent')}`" v-if="false">
                  <el-switch
                    v-model="form.shippingAgent"
                    active-value="1"
                    inactive-value="0"
                  ></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" v-if="sysDockingSwitch && isSystemDocking === '1'">
                <el-form-item :label="`${$t('ui.systemDocking')}`" prop="syncSupplier">
                  <el-switch
                    v-model="accForm1.syncSupplier"
                    active-value="1"
                    inactive-value="0"
                    :disabled="form.businessPartnerStatus === '3' || form.isRevise === '1'"
                    @change="syncSupplierChange"
                  ></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-collapse v-model="activeNames2">
          <div class="form-card mt10">
            <el-collapse-item name="1">
              <template slot="title">
                <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
                <strong>{{ $t('ui.supplierSettlement') }}</strong>
              </template>
              <el-form
                ref="accForm1"
                :model="accForm1"
                @submit.native.prevent
                :rules="{}"
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`">
                      <ComparisonInput
                        v-if="isModified('currency', 2)"
                        :beforeValue="getBeforeValue('currency', 2)"
                        :afterValue="accForm1.currency"
                      />
                      <CommonSelect
                        v-else
                        :id="accForm1.currencyId"
                        :label="accForm1.currency"
                        idKey="id"
                        labelKey="currency"
                        filterable
                        :disabled="comDisFrom"
                        :options="currencyOptions"
                        @change="purchaseCurrencyChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.invoiceType')}`">
                      <ComparisonInput
                        v-if="isModified('invoiceType', 2)"
                        :beforeValue="getBeforeValue('invoiceType', 2)"
                        :afterValue="getAfterValue('invoiceType', 2, accForm1.invoiceType)"
                      />
                      <el-select
                        v-else
                        v-model="accForm1.invoiceType"
                        placeholder=""
                        style="width: 100%"
                        clearable
                      >
                        <el-option
                          v-for="dict in dict.type.bp_invoice_type"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('ui.paymentTerm')}`">
                      <ComparisonInput
                        v-if="isModified('paymentTermId', 2)"
                        :beforeValue="getBeforeValue('paymentTermId', 2)"
                        :afterValue="getAfterValue('paymentTermId', 2, accForm1.paymentTermName)"
                      />
                      <ToolTipPaymentTerm v-else :paymentTermObj="accForm1.paymentTerm || {}">
                        <SelectInput
                          :value="accForm1.paymentTermName"
                          @clear="purchasePaymentTermChange({})"
                          clearable
                          @click="openPurchasePaymentTermDlg"
                          :disabled="comDisFrom"
                          class="form-wd"
                        />
                      </ToolTipPaymentTerm>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="2">
              <template slot="title">
                <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
                <strong>{{ $t('organization.bankInfo') }}</strong>
              </template>
              <el-form
                ref="BPbankInfoRef"
                :model="accForm1"
                @submit.native.prevent
                :rules="accFormRules"
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.accountName')}`" prop="accountName">
                      <ComparisonInput
                        v-if="isModified('accountName', 2)"
                        :beforeValue="getBeforeValue('accountName', 2)"
                        :afterValue="accForm1.accountName"
                      />
                      <el-autocomplete
                        v-else
                        style="width: 100%"
                        v-model="accForm1.accountName"
                        :title="accForm1.accountName"
                        :fetch-suggestions="accountNameQuerySug"
                        @select="BPAccountNameChange"
                        placeholder
                        clearable
                        :maxlength="200"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('organization.beneficiaryName')}`"
                      prop="beneficiaryName"
                    >
                      <ComparisonInput
                        v-if="isModified('beneficiaryName', 2)"
                        :beforeValue="getBeforeValue('beneficiaryName', 2)"
                        :afterValue="accForm1.beneficiaryName"
                      />
                      <el-input
                        v-else
                        v-model="accForm1.beneficiaryName"
                        :title="accForm1.beneficiaryName"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('organization.bankAccountNumber')}`"
                      prop="bankAccountNumber"
                    >
                      <ComparisonInput
                        v-if="isModified('bankAccountNumber', 2)"
                        :beforeValue="getBeforeValue('bankAccountNumber', 2)"
                        :afterValue="accForm1.bankAccountNumber"
                      />
                      <el-input
                        v-else
                        v-model="accForm1.bankAccountNumber"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.bankName')}`" prop="bankName">
                      <ComparisonInput
                        v-if="isModified('bankName', 2)"
                        :beforeValue="getBeforeValue('bankName', 2)"
                        :afterValue="accForm1.bankName"
                      />
                      <el-input v-else v-model="accForm1.bankName" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('organization.accountCurrency')}`"
                      prop="accountCurrencyCode"
                    >
                      <ComparisonInput
                        v-if="isModified('accountCurrencyCode', 2)"
                        :beforeValue="getBeforeValue('accountCurrencyCode', 2)"
                        :afterValue="accForm1.accountCurrency"
                      />
                      <CommonSelect
                        v-else
                        :id="accForm1.accountCurrencyCode"
                        :label="accForm1.accountCurrency"
                        :title="accForm1.accountCurrency"
                        idKey="currencyCode"
                        labelKey="currency"
                        :filterable="true"
                        :clearable="false"
                        :options="currencyOptions || []"
                        @change="BPBankCurrencyChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.SWIFTCode')}`">
                      <ComparisonInput
                        v-if="isModified('swiftCode', 2)"
                        :beforeValue="getBeforeValue('swiftCode', 2)"
                        :afterValue="accForm1.swiftCode"
                      />
                      <el-input v-else v-model="accForm1.swiftCode" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.bankCode')}`" prop="bankCode">
                      <ComparisonInput
                        v-if="isModified('bankCode', 2)"
                        :beforeValue="getBeforeValue('bankCode', 2)"
                        :afterValue="accForm1.bankCode"
                      />
                      <el-input v-else v-model="accForm1.bankCode" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.branchCode')}`" prop="branchCode">
                      <ComparisonInput
                        v-if="isModified('branchCode', 2)"
                        :beforeValue="getBeforeValue('branchCode', 2)"
                        :afterValue="accForm1.branchCode"
                      />
                      <el-input v-else v-model="accForm1.branchCode" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.businessRegNo')}`">
                      <el-input
                        :value="form.companyRegNo"
                        :title="form.companyRegNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-divider></el-divider>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.addressLine1')}`" prop="address1">
                      <ComparisonInput
                        v-if="isModified('address1', 2)"
                        :beforeValue="getBeforeValue('address1', 2)"
                        :afterValue="accForm1.address1"
                      />
                      <el-input v-else v-model="accForm1.address1" maxlength="500"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.addressLine2')}`">
                      <ComparisonInput
                        v-if="isModified('address2', 2)"
                        :beforeValue="getBeforeValue('address2', 2)"
                        :afterValue="accForm1.address2"
                      />
                      <el-input v-else v-model="accForm1.address2" maxlength="500"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.provinceState')}`" prop="province">
                      <ComparisonInput
                        v-if="isModified('province', 2)"
                        :beforeValue="getBeforeValue('province', 2)"
                        :afterValue="accForm1.province"
                      />
                      <el-input v-else v-model="accForm1.province" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.cityTown')}`" prop="city">
                      <ComparisonInput
                        v-if="isModified('city', 2)"
                        :beforeValue="getBeforeValue('city', 2)"
                        :afterValue="accForm1.city"
                      />
                      <el-input v-else v-model="accForm1.city" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.location')}`" prop="location">
                      <ComparisonInput
                        v-if="isModified('location', 2)"
                        :beforeValue="getBeforeValue('location', 2)"
                        :afterValue="accForm1.location"
                      />
                      <el-input v-else v-model="accForm1.location" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.postalCode')}`">
                      <ComparisonInput
                        v-if="isModified('postalCode', 2)"
                        :beforeValue="getBeforeValue('postalCode', 2)"
                        :afterValue="accForm1.postalCode"
                      />
                      <el-input v-else v-model="accForm1.postalCode" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.bankCountry')}`" prop="bankCountry">
                      <ComparisonInput
                        v-if="isModified('bankCountry', 2)"
                        :beforeValue="getBeforeValue('bankCountry', 2)"
                        :afterValue="accForm1.bankCountry"
                      />
                      <CountrySelect
                        v-else
                        v-model="accForm1.bankCountry"
                        class="form-wd"
                        @select="BPBankCountrySelect"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')" :class="[isModified('bankRemarks', 2)]">
                      <MyInput
                        type="textarea"
                        v-model="accForm1.bankRemarks"
                        :autosize="{ minRows: 2, maxRows: 8 }"
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
        </el-collapse>
      </div>
      <div v-show="activeName === 'attachment'">
        <div class="form-card form-card--p20 clearfix">
          <div class="pb20" :class="[isModified('attachment')]">
            <myUpload
              ref="uploadRef"
              :disabled="comDisFrom"
              :modifyHighlight="modifyHighlight"
              :documentName="form.businessPartnerName"
              :documentNameList="[form.businessPartnerName, form.abbreviation, form.alias]"
            />
          </div>
        </div>
      </div>
    </template>

    <ApprovedDialog
      :id="form.businessPartnerMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
      :formData="approvedFormData"
      formDataKey="businessPartner"
    />
    <RejectDialog
      :id="form.businessPartnerMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />

    <RevisionComparisonDlg module-key="businessPartner" ref="RevisionComparisonDlg" />

    <selectPaymentTermDlg
      ref="purchasePaymentTermDlg"
      :paymentTermPurposeList="['1', '2']"
      @onSuccess="purchasePaymentTermChange"
      :menuPerms="menuKey.BP"
    />
    <selectPaymentTermDlg
      ref="salesPaymentTermDlg"
      :paymentTermPurposeList="['3', '4', '5', '6', '7']"
      @onSuccess="salesPaymentTermChange"
      :menuPerms="menuKey.BP"
    />
  </FormPageLayoutTabs>
</template>

<script>
import { formDirtyClass } from '@/mixins/formDirtyClass'
import {
  saveBusinessPartner,
  saveDraftBusinessPartner,
  queryUserDepartment,
  queryBusinessPartnerById,
  approvedBusinessPartner,
  rejectedBusinessPartner,
  withdrawApproved,
  queryBPHistoryVersion
} from '@/api/businessPartner/businessPartner'
import { queryAllTaxCodeByCountryId } from '@/api/system/tax'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryPaymentTermListByPaymentTermPurpose } from '@/api/system/paymentTerm'
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import AddressInfo from './components/AddressInfo.vue'
import ContactPersonInfo from './components/ContactPersonInfo.vue'
import CountrySelect from '@/components/select/countrySelect'
import locale from '@/views/businessPartner/lang/index'
import projectTable from './components/projectTable'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import RevisionComparisonDlg from '@/components/RevisionComparison'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import userAvatar from '@/components/Common/htz-image-upload/userAvatar.vue'
import selectPaymentTermDlg from '@/views/system/paymentTerm/selectPaymentTermDlg.vue'

function isWebsite(param) {
  const strRegex =
    // eslint-disable-next-line no-useless-escape
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
  const re = new RegExp(strRegex)
  return re.test(param)
}
export default {
  dicts: [
    'bp_supplier_type',
    'bp_supplier_group',
    'bp_customer_type',
    'bp_customer_group',
    'bp_invoice_type',
    'bp_business_partner_status',
    'business_partner_payment_method'
  ],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    AddressInfo,
    ContactPersonInfo,
    CountrySelect,
    ApprovedDialog,
    RejectDialog,
    RevisionComparisonDlg,
    SystemOperationLogTable,
    userAvatar,
    projectTable,
    selectPaymentTermDlg
  },
  data() {
    const vm = this
    const validatorPhoneNo = (rule, value, callback) => {
      if (!this.form.mobileCode || !this.form.mobileNum) {
        callback(this.$t('ui.reqMsg').replace('$1', this.$t('ui.mobilePhone')))
      } else {
        callback()
      }
    }
    const validWebsite = (rule, value, callback) => {
      if (value && !isWebsite(value)) {
        callback(new Error(vm.$t('ui.validWebsite')))
      } else {
        callback()
      }
    }
    return {
      submitLoading: false,
      activeName: 'basicInfo',
      activeNames: [],
      activeNames1: [],
      activeNames2: [],
      rowId: '',
      timeId: '',
      // 是否自动生成 EmployeeNo
      form: {},
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0'
      },
      collapseWarningForBasicInfo: false,
      collapseWarningForRegistrationInfo: false,
      collapseWarningForAddressInfo: false,
      collapseWarningForContactPersonInfo: false,
      collapseWarningForProject: false,
      collapseWarningForBankInfo: false,

      rules: {
        typeList: [
          {
            type: 'array',
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
        businessPartnerName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur']
          }
        ],
        email: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.email'))
          },
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ],
        mobilePhone: [{ required: true, validator: validatorPhoneNo, trigger: 'change' }],

        website: [
          {
            validator: validWebsite,
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
        country: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        regCurrencyId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        registeredAddress: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      },
      accFormRules: {
        supplierType: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        customerType: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        customerGroup: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        accountName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        beneficiaryName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        bankAccountNumber: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        swiftCode: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        bankCode: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        branchCode: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        accountCurrencyCode: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        bankName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        labelList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        address1: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        province: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        city: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        location: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        bankCountry: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      deptOptions: [],
      addressList: [],
      taxOptions: [],
      accountList: [
        { value: vm.$t('organization.singaporeDollarAccount') },
        { value: vm.$t('organization.USDollarAccount') },
        { value: vm.$t('organization.chineseYuanAccount') }
      ],
      currencyOptions: [],
      purchasePaymentTermOptions: [],
      salesPaymentTermOptions: [],
      accForm1: {},
      accForm2: {},

      contactPersonList: [],
      projectList: [],
      projectCustomerAddressList: [],

      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedBusinessPartner,
      rejectedUrl: rejectedBusinessPartner,
      approvedFormData: undefined,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      basicUpdateMsgList: [],
      accountSupplierUpdateProps: [],
      accountSupplierUpdateMsgList: [],
      accountCustomerUpdateProps: [],
      accountCustomerUpdateMsgList: [],
      updateMsg: {},
      isComparison: false,
      commonFileListCur: [],
      addressListCur: [],
      contactPersonListCur: [],
      projectListCur: [],
      bpHistoryVersionList: [],

      typeListCache: [],
      isDocking: false,
      isHandler: false
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
    },
    isDocking: {
      handler: function (newVal) {
        this.closeDocking()
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['businessPartner:businessPartner:edit'])
    },
    comDisFrom() {
      let dis = true
      if (this.approvedBtnShow && this.isComparison) {
        return true
      }
      if (!this.editAuth) {
        return true
      }
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.businessPartnerMainId &&
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
        this.form.businessPartnerMainId &&
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
        this.form.businessPartnerMainId &&
        this.buttonAuthMsg.isCanSaveDraft === '1'
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
        this.form.businessPartnerMainId &&
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
        this.form.businessPartnerMainId &&
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
        this.form.businessPartnerMainId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['businessPartner:businessPartner:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.businessPartnerMainId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    modifyHighlight() {
      return (
        this.approvedBtnShow && this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.isComparison
      )
    },
    sysDockingSwitch() {
      return this.$store.getters.sysDockingSwitch
    },
    // 法人对接
    isSystemDocking() {
      return this.$store.state.user.legalEntityInfo.isSystemDocking
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    // 更新项目中的地址数据
    handlerProject() {
      this.projectList.forEach((x) => {
        x.customerAddressList = []
        x.siteAddress = ''

        const arr = this.projectCustomerAddressList
          .filter((k) => k.projectId === x.rowTimeId)
          .map((j) => j.customerAddressId)
          .join(',')
        this.addressList.forEach((m) => {
          if (arr.indexOf(m.rowTimeId) !== -1) {
            x.customerAddressList.push(m)
          }
        })
        x.siteAddress = this.siteAddressTitle(x.customerAddressList)
      })
      // console.log(this.projectList, '===')
      this.$refs.projectTable && this.$refs.projectTable.initList(this.projectList)
    },
    siteAddressTitle(e) {
      if (!e || e.length <= 0) return ''
      let location = ''
      e.forEach((x) => {
        const { country, provinceState, cityTown, address1, province, city } = x
        location += address1 + '-' + (city || cityTown)
        if (province || provinceState) {
          location += `-${province || provinceState}`
        }
        location += `-${country} / `
      })
      location = location.substring(0, location.length - 3)

      return location
    },
    addressListChange(data) {
      this.addressList = data || []
      this.projectCustomerAddressList = []
      if (this.addressList.length > 0) {
        this.addressList.forEach((x) => {
          if (x.projectIdList) {
            this.projectCustomerAddressList.push({
              customerAddressId: x.rowTimeId,
              projectId: x.projectIdList
            })
          }
        })
        this.handlerProject()
      } else {
        this.projectCustomerAddressList = []
        this.projectList.forEach((x) => {
          x.customerAddressList = []
          x.siteAddress = ''
        })
      }
    },
    contactPersonListChange(data, type) {
      this.contactPersonList = data || []
      if (type === 'delete') {
        // 删除 同步更新项目中绑定的项目联系人
        if (this.contactPersonList.length > 0) {
          const arr = this.contactPersonList.map((x) => x.rowTimeId)
          this.projectList.forEach((x) => {
            if (x.projectContactPersonList && x.projectContactPersonList.length > 0) {
              x.projectContactPersonList.forEach((k, j) => {
                if (arr.indexOf(k.rowTimeId) === -1) {
                  x.projectContactPersonList.splice(j, 1)
                }
              })
              this.$set(
                x,
                'projectContactPersonName',
                x.projectContactPersonList.map((m) => m.contactPersonName).join(',')
              )
            } else {
              x.projectContactPersonList = []
              x.projectContactPersonName = ''
            }
          })
        } else {
          this.projectList.forEach((x) => {
            x.projectContactPersonList = []
            x.projectContactPersonName = ''
          })
        }
      }
    },
    projectListChange(data) {
      this.projectList = data || []
      this.projectCustomerAddressList = []
      if (this.projectList.length > 0) {
        this.projectList.forEach((x) => {
          x.customerAddressList.forEach((k) => {
            this.projectCustomerAddressList.push({
              customerAddressId: k.rowTimeId,
              projectId: x.rowTimeId
            })
          })
        })
        // console.log(this.projectList, '====1458')
        // console.log(this.projectCustomerAddressList, '====1459')

        this.handlerAddress()
      } else {
        this.projectCustomerAddressList = []
        this.addressList.forEach((x) => {
          x.projectIdList = []
        })
      }
    },
    // 更新地址中的项目数据
    handlerAddress() {
      this.addressList.forEach((x) => {
        const arr = this.projectCustomerAddressList
          .filter((k) => k.customerAddressId === x.rowTimeId)
          .map((j) => j.projectId)
          .join(',')
        x.projectIdList = ''
        // console.log(arr, '===1476')
        if (!arr || arr.length <= 0) return
        this.projectList &&
          this.projectList.forEach((m) => {
            if (arr.indexOf(m.rowTimeId) !== -1) {
              x.projectIdList = m.rowTimeId
            }
          })
      })
      console.log(this.addressList, '===1535')
    },

    /* 银行信息 */
    accountNameQuerySug(queryString, cb) {
      const list = this.accountList

      let results
      if (queryString) {
        results = list.filter(
          (umo) => umo.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      } else {
        results = list
      }
      cb(results)
    },
    customerAccountNameChange(val) {
      this.$set(this.accForm2, 'accountName', val.value)
    },
    customerBankCurrencyChange(row) {
      this.$set(this.accForm2, 'accountCurrencyId', row.id)
      this.$set(this.accForm2, 'accountCurrency', row.currency)
      this.$set(this.accForm2, 'accountCurrencyCode', row.currencyCode)
      this.$set(this.accForm2, 'accountCurrencySymbol', row.currencySymbol)
    },
    customerBankCountrySelect(row) {
      if (row) {
        const { id, name, code } = row
        this.$set(this.accForm2, 'bankCountry', name)
        this.$set(this.accForm2, 'bankCountryId', id)
        this.$set(this.accForm2, 'bankCountryCode', code)
      }
    },

    BPAccountNameChange(val) {
      this.$set(this.accForm1, 'accountName', val.value)
    },
    BPBankCurrencyChange(row) {
      this.$set(this.accForm1, 'accountCurrencyId', row.id)
      this.$set(this.accForm1, 'accountCurrency', row.currency)
      this.$set(this.accForm1, 'accountCurrencyCode', row.currencyCode)
      this.$set(this.accForm1, 'accountCurrencySymbol', row.currencySymbol)
    },
    BPBankCountrySelect(row) {
      if (row) {
        const { id, name, code } = row
        this.$set(this.accForm1, 'bankCountry', name)
        this.$set(this.accForm1, 'bankCountryId', id)
        this.$set(this.accForm1, 'bankCountryCode', code)
      }
    },

    typeListChange(e) {
      if (this.form.typeList.indexOf('1') === -1) {
        this.$set(this.form, 'shippingAgent', '0')
      } else {
        if (!this.accForm1.supplierType) {
          this.accForm1.supplierType = '2'
        }
      }
      if (this.form.typeList.indexOf('0') !== -1) {
        if (!this.accForm2.customerType) {
          this.accForm2.customerType = '2'
        }
      }
      if (this.sysDockingSwitch && this.isSystemDocking === '1') {
        if (this.form.typeList.indexOf('0') !== -1 && this.typeListCache.indexOf('0') === -1) {
          this.$set(this.accForm2, 'syncCustomer', '1')
        } else if (this.form.typeList.indexOf('0') === -1) {
          this.$set(this.accForm2, 'syncCustomer', '0')
        }
        if (this.form.typeList.indexOf('1') !== -1 && this.typeListCache.indexOf('1') === -1) {
          this.$set(this.accForm1, 'syncSupplier', '1')
        } else if (this.form.typeList.indexOf('1') === -1) {
          this.$set(this.accForm1, 'syncSupplier', '0')
        }
      } else {
        this.$set(this.accForm2, 'syncCustomer', '0')
        this.$set(this.accForm1, 'syncSupplier', '0')
      }
      if (this.accForm2.syncCustomer === '1' || this.accForm1.syncSupplier === '1') {
        this.isDocking = true
      } else {
        this.isDocking = false
      }

      const { regCurrencyId, regCurrencyCode, regCurrency, regCurrencySymbol } = this.form
      if (regCurrencyId && this.form.typeList.indexOf('0') !== -1) {
        const { currencyId } = this.accForm2
        if (!currencyId) {
          this.salesCurrencyChange({
            id: regCurrencyId,
            currencyCode: regCurrencyCode,
            currency: regCurrency,
            currencySymbol: regCurrencySymbol
          })
        }
      }
      if (regCurrencyId && this.form.typeList.indexOf('1') !== -1) {
        const { currencyId } = this.accForm1
        if (!currencyId) {
          this.purchaseCurrencyChange({
            id: regCurrencyId,
            currencyCode: regCurrencyCode,
            currency: regCurrency,
            currencySymbol: regCurrencySymbol
          })
        }
      }

      this.typeListCache = JSON.parse(JSON.stringify(this.form.typeList))
    },
    isSystemDockingChange() {
      if (this.accForm2.syncCustomer === '1' || this.accForm1.syncSupplier === '1') {
        this.isDocking = true
      } else {
        this.isDocking = false
      }
    },
    syncSupplierChange() {
      if (this.accForm2.syncCustomer === '1' || this.accForm1.syncSupplier === '1') {
        this.isDocking = true
      } else {
        this.isDocking = false
      }
    },
    closeDocking() {
      if (this.isHandler) return

      if (this.accForm2.syncCustomer !== '1') {
        this.projectList = []
        this.$refs.projectTable && this.$refs.projectTable.initList(this.projectList)
      }
      this.addressList = [
        {
          label: 'Registered',
          labelList: ['Registered'],
          rowTimeId: Date.now(),
          isAutoAddressCode: '1',
          isActive: '1'
        }
      ]
      this.$refs.AddressInfoRef && this.$refs.AddressInfoRef.initList(this.addressList)
    },
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.businessPartnerMainId,
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
    sysDockingSwitchFun(data) {
      if (data.cdsQc === '1') {
        this.isHandler = true
        this.isDocking = true
        setTimeout(() => {
          this.isHandler = false
        }, 1000)
      }
      data.typeList = data.businessPartnerType ? data.businessPartnerType.split(',') : []
      const bpBusinessAddressList = data.bpBusinessAddressList || []
      bpBusinessAddressList.forEach((item) => {
        item.rowTimeId = item.businessAddressId
        item.isNewCustomerAddress = 0
        if (item.label) {
          item.labelList = item.label.split(', ')
        }
      })

      const bpBusinessContactPersonList = data.bpBusinessContactPersonList || []
      bpBusinessContactPersonList.forEach((item) => {
        item.rowTimeId = item.businessContactPersonId
        item.addressNamesList = item.addressNamesList || []
        const selectAddress = bpBusinessAddressList.filter((row) =>
          item.addressNamesList.includes(row.label)
        )
        item.addressIdList = selectAddress.map((item) => item.rowTimeId)
      })

      const projectList = data.projectList || []
      projectList.forEach((x) => {
        x.rowTimeId = x.projectId
        x.isNewProject = 0
        if (x.credit !== '1') {
          x.credit = '0'
        }
        x.projectContactPersonList &&
          x.projectContactPersonList.forEach((k) => (k.rowTimeId = k.businessContactPersonId))
      })
      this.projectCustomerAddressList = data.projectCustomerAddressList || []
      this.contactPersonList = bpBusinessContactPersonList || []
      this.addressList = bpBusinessAddressList || []
      this.projectList = projectList || []
      if (bpBusinessAddressList.length > 0) {
        this.handlerAddress()
        if (projectList.length > 0) {
          this.handlerProject()
        }
      }

      data.commonFileListTrademark = data.commonFileListTrademark || []

      /* 初始化 AddressInfo */
      setTimeout(() => {
        this.$refs.uploadRef.initFileList(data.commonFileList || [])
      }, 100)

      this.queryUserDepartment()
      this.queryCurrencyListBySelect()

      this.form = data
      this.typeListCache = JSON.parse(JSON.stringify(this.form.typeList))
      const Trademark = this.form.commonFileListTrademark[0]
      if (Trademark) {
        this.$set(this.form, 'photoUrl', Trademark.url)
        this.$set(this.form, 'fileIdsTrademark', Trademark.id || '')
      }
      this.buttonAuthMsg = data.buttonAuthMsg || {}
      this.accForm1 = data.bpBusinessAccountSupplier || {}
      this.accForm2 = data.bpBusinessAccountCustomer || {}

      this.$set(this.accForm2, 'syncCustomer', data.syncCustomer || '0')
      this.$set(this.accForm2, 'displayProdCodeOnApp', data.displayProdCodeOnApp || '0')
      this.$set(this.accForm1, 'syncSupplier', data.syncSupplier || '0')

      /* 版本比对 */
      this.initVersionComparison(
        data,
        bpBusinessAddressList,
        bpBusinessContactPersonList,
        projectList
      )
    },
    initVersionComparison(data, addressList, contactPersonList, projectList = []) {
      const updateMsg = data.updateMsg || {}
      const cloneList = (list) => JSON.parse(JSON.stringify(list || []))
      const onlyDeleted = (list) => cloneList(list).filter((item) => item.updateType === '3')

      this.updateMsg = updateMsg
      this.basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
      this.accountSupplierUpdateMsgList = updateMsg.accountSupplierUpdateMsgList || []
      this.accountCustomerUpdateMsgList = updateMsg.accountCustomerUpdateMsgList || []
      this.basicUpdateProps = this.basicUpdateMsgList.map((item) => item.name)
      this.accountSupplierUpdateProps = this.accountSupplierUpdateMsgList.map((item) => item.name)
      this.accountCustomerUpdateProps = this.accountCustomerUpdateMsgList.map((item) => item.name)

      const beforeCommonFileList = updateMsg.beforeCommonFileList || []
      const afterCommonFileList = updateMsg.afterCommonFileList || []
      const beforeTrademarkList = updateMsg.beforeCommonFileListTrademark || []
      const afterTrademarkList = updateMsg.afterCommonFileListTrademark || []
      if (beforeCommonFileList.length > 0 || afterCommonFileList.length > 0) {
        this.basicUpdateProps.push('attachment')
      }
      if (beforeTrademarkList.length > 0 || afterTrademarkList.length > 0) {
        this.basicUpdateProps.push('commonFileListTrademark')
      }

      const currentProjectList = cloneList(projectList)
      currentProjectList.forEach((item) => {
        item.rowTimeId = item.rowTimeId || item.projectId
      })
      this.commonFileListCur = cloneList(data.commonFileList)
      this.addressListCur = cloneList(addressList)
      this.contactPersonListCur = cloneList(contactPersonList)
      this.projectListCur = currentProjectList
      this.isComparison = this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.approvedBtnShow
      if (this.isComparison === true) {
        setTimeout(() => {
          if (this.isComparison) {
            this.revisionComparison()
          }
        }, 300)
      }

      const comparisonAddressList = [
        ...cloneList(addressList),
        ...onlyDeleted(updateMsg.beforeBusinessAddressList)
      ]
      comparisonAddressList.forEach((item) => {
        item.rowTimeId = item.rowTimeId || item.businessAddressId
        if (item.label && !item.labelList) {
          item.labelList = item.label.split(', ')
        }
      })
      const comparisonContactList = [
        ...cloneList(contactPersonList),
        ...onlyDeleted(updateMsg.beforeBusinessContactPersonList)
      ]
      comparisonContactList.forEach((item) => {
        item.rowTimeId = item.rowTimeId || item.businessContactPersonId
        item.addressNamesList = item.addressNamesList || []
        if (!item.addressIdList) {
          item.addressIdList = comparisonAddressList
            .filter((address) => item.addressNamesList.includes(address.label))
            .map((address) => address.rowTimeId)
        }
      })
      const comparisonProjectList = [
        ...cloneList(currentProjectList),
        ...onlyDeleted(updateMsg.beforeProjectList)
      ]
      comparisonProjectList.forEach((item) => {
        item.rowTimeId = item.rowTimeId || item.projectId
      })
      const comparisonFileList = [
        ...cloneList(data.commonFileList),
        ...onlyDeleted(beforeCommonFileList)
      ]

      this.addressList = this.isComparison ? comparisonAddressList : cloneList(addressList)
      this.contactPersonList = this.isComparison
        ? comparisonContactList
        : cloneList(contactPersonList)
      this.projectList = this.isComparison ? comparisonProjectList : cloneList(currentProjectList)

      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.AddressInfoRef && this.$refs.AddressInfoRef.initList(this.addressList)
          this.$refs.ContactPersonInfoRef &&
            this.$refs.ContactPersonInfoRef.initList(this.contactPersonList)
          this.$refs.projectTable && this.$refs.projectTable.initList(this.projectList)
          this.$refs.uploadRef &&
            this.$refs.uploadRef.initFileList(
              this.isComparison ? comparisonFileList : this.commonFileListCur
            )
        }, 100)
      })
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      this.queryBPHistoryVersion()
      // this.queryPurchasePaymentTerm()
      // this.querySalesPaymentTerm()
      queryBusinessPartnerById(rowId, this.taskId).then((res) => {
        const data = res.data || {}
        if (this.sysDockingSwitch && this.isSystemDocking === '1') {
          return this.sysDockingSwitchFun(data)
        }
        const bpBusinessAddressList = data.bpBusinessAddressList || []
        bpBusinessAddressList.forEach((item) => {
          item.rowTimeId = item.businessAddressId
          if (item.label) {
            item.labelList = item.label.split(', ')
          }
        })
        const bpBusinessContactPersonList = data.bpBusinessContactPersonList || []
        bpBusinessContactPersonList.forEach((item) => {
          item.rowTimeId = item.businessContactPersonId
          item.addressNamesList = item.addressNamesList || []
          const selectAddress = bpBusinessAddressList.filter((row) =>
            item.addressNamesList.includes(row.label)
          )
          item.addressIdList = selectAddress.map((item) => item.rowTimeId)
        })
        data.commonFileListTrademark = data.commonFileListTrademark || []

        this.queryUserDepartment()
        this.queryCurrencyListBySelect()
        data.typeList = data.businessPartnerType ? data.businessPartnerType.split(',') : []
        // data.departmentName = '11111111'
        this.form = data
        const Trademark = this.form.commonFileListTrademark[0]
        if (Trademark) {
          this.$set(this.form, 'photoUrl', Trademark.url)
          this.$set(this.form, 'fileIdsTrademark', Trademark.id || '')
        }
        this.buttonAuthMsg = data.buttonAuthMsg || {}
        this.accForm1 = data.bpBusinessAccountSupplier || {}
        this.accForm2 = data.bpBusinessAccountCustomer || {}
        this.typeListCache = JSON.parse(JSON.stringify(this.form.typeList))
        /* 版本比对 */
        this.initVersionComparison(
          data,
          bpBusinessAddressList,
          bpBusinessContactPersonList,
          data.projectList || []
        )
        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)

        setTimeout(() => {
          const initFormJson = this.getFormJson()
          formDirtyClass.routeStatusData[this.$route.name] = {
            $vm: this,
            saveShow: this.saveDraftBtnShow,
            submitShow: this.submitBtnShow,
            initFormJson,
            getFormJson: this.getFormJson,
            isSaveSuccess: false,
            saveOrSubmitFn: this.handleSaveDraftNoConFirm
          }
        }, 300)

        // this.queryAllTaxCodeByCountryId()
        this.formClearValidate('form1')
        this.formClearValidate('form2')
      })
    },
    formClearValidate(refKey) {
      this.$nextTick(() => {
        if (this.$refs[refKey]) {
          this.$refs[refKey].clearValidate()
        } else {
          let count = 0
          const timer = setInterval(() => {
            count++ // 每次循环计数器 +1
            // console.log(`第 ${count} 次循环（间隔 100 毫秒）`)
            // 条件 1：循环达到 5 次时退出
            if (count >= 5) {
              // console.log('已循环 5 次，退出')
              clearInterval(timer) // 清除定时器，终止循环
              return
            }

            // 条件 2：自定义提前退出条件（示例：当 count 为 3 时提前退出）
            if (this.$refs[refKey]) {
              this.$refs[refKey].clearValidate()
              // console.log('满足提前），退出')
              clearInterval(timer) // 清除定时器
            }
          }, 100)
        }
      })
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
    back(type) {
      this.$emit('back', type)
    },
    /* 表单部分 */
    // 表单重置
    reset() {
      this.form = {
        typeList: [],
        departmentId: undefined,
        businessPartnerName: undefined,
        email: undefined,
        alias: undefined,
        mobileNum: undefined,
        mobileCode: undefined,
        mobilePhone: undefined,
        companyRegNo: undefined,
        country: undefined,
        registeredAddress: undefined,
        remarks: '',
        isActive: '1',
        createdBy: this.$store.state.user.nickName
      }
      this.buttonAuthMsg = {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0'
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForRegistrationInfo = false
      this.collapseWarningForAddressInfo = false
      this.collapseWarningForContactPersonInfo = false
      this.collapseWarningForProject = false
      this.collapseWarningForBankInfo = false

      this.activeName = 'basicInfo'
      this.activeNames = ['1', '2', '3', '4', '5', '11']
      setTimeout(() => {
        this.$refs.uploadRef.initFileList([])
      }, 100)

      this.basicUpdateProps = []
      this.basicUpdateMsgList = []
      this.accountSupplierUpdateProps = []
      this.accountSupplierUpdateMsgList = []
      this.accountCustomerUpdateProps = []
      this.accountCustomerUpdateMsgList = []
      this.updateMsg = {}
      this.isComparison = false
      this.commonFileListCur = []
      this.addressListCur = []
      this.contactPersonListCur = []
      this.projectListCur = []
      this.bpHistoryVersionList = []

      this.resetForm('form1')
      this.resetForm('form2')

      /* 初始 accounting */
      this.accForm1 = {
        supplierType: '2',
        syncSupplier: '0'
      }
      this.accForm2 = {
        customerType: '2',
        syncCustomer: '0',
        cdsQc: '0',
        displayProdCodeOnApp: '1'
      }
      this.activeNames1 = ['1', '2', '3']
      this.activeNames2 = ['1', '2']

      /* 初始化 AddressInfo */
      setTimeout(() => {
        this.$refs.AddressInfoRef.reset()
        this.$refs.ContactPersonInfoRef.reset()
      }, 100)
    },

    queryUserDepartment() {
      queryUserDepartment({}).then((res) => {
        this.deptOptions = res.data || []
      })
    },
    departmentChange(item) {
      // const item = this.deptOptions.find((item) => item.departmentId === value) || {}
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
    },
    handleCountrySelect(row) {
      if (row) {
        const { id, name, en } = row
        this.$set(this.form, 'country', name)
        this.$set(this.form, 'countryEn', en)
        this.$set(this.form, 'countryId', id)
        this.$set(this.form, 'taxNo', undefined)
        this.$set(this.form, 'countryMobileCode', row.mobileCode)

        // 国家
        this.addressList.forEach((item) => {
          if (!item.address1) {
            this.$set(item, 'country', name)
            this.$set(item, 'countryId', id)
          }
        })
        this.$refs.AddressInfoRef.initList(this.addressList)

        if (row.currencyActiveStatus === '1') {
          this.salesCurrencyChangeRegistrationInfo({
            id: row.currencyId,
            currency: row.currencyDesc,
            currencyCode: row.currencyCode,
            currencySymbol: row.currencySymbol
          })
        }
        if (row.mobileCodeActiveStatus === '1') {
          this.$set(this.form, 'mobileCode', row.mobileCode)
          this.$set(this.form, 'faxCode', row.mobileCode)
          this.$nextTick(() => {
            if (this.$refs.mobileNoRef) {
              this.$refs.mobileNoRef.clearValidate()
            }
            if (this.$refs.faxRef) {
              this.$refs.faxRef.clearValidate()
            }
          })
        }
      } else {
        this.$set(this.form, 'country', undefined)
        this.$set(this.form, 'countryEn', undefined)
        this.$set(this.form, 'countryId', undefined)
        this.$set(this.form, 'taxNo', undefined)
        this.$set(this.form, 'countryMobileCode', undefined)
      }
      // this.queryAllTaxCodeByCountryId()
    },
    /* 税 */
    queryAllTaxCodeByCountryId() {
      if (this.form.countryId) {
        queryAllTaxCodeByCountryId(this.form.countryId).then((res) => {
          this.taxOptions = res.data || []
        })
      } else {
        this.taxOptions = []
      }
    },
    /* 货币 */
    queryCurrencyListBySelect() {
      queryCurrencyListBySelect().then((res) => {
        const list = res.data || []
        this.currencyOptions = list.map((item) => {
          item.label = `${item.currencyCode} (${item.currencyDesc})`
          return item
        })
      })
    },
    salesCurrencyChangeRegistrationInfo(row) {
      this.$set(this.form, 'regCurrencyId', row.id)
      this.$set(this.form, 'regCurrency', row.currency)
      this.$set(this.form, 'regCurrencyCode', row.currencyCode)
      this.$set(this.form, 'regCurrencySymbol', row.currencySymbol)
      this.salesCurrencyChange(row)
      this.purchaseCurrencyChange(row)
    },
    purchaseCurrencyChange(row) {
      this.$set(this.accForm1, 'currencyId', row.id)
      this.$set(this.accForm1, 'currency', row.currency)
      this.$set(this.accForm1, 'currencyCode', row.currencyCode)
      this.$set(this.accForm1, 'currencySymbol', row.currencySymbol)
    },
    salesCurrencyChange(row) {
      this.$set(this.accForm2, 'currencyId', row.id)
      this.$set(this.accForm2, 'currency', row.currency)
      this.$set(this.accForm2, 'currencyCode', row.currencyCode)
      this.$set(this.accForm2, 'currencySymbol', row.currencySymbol)
    },
    /* 付款条款 */
    queryPurchasePaymentTerm() {
      queryPaymentTermListByPaymentTermPurpose({
        paymentTermPurposeList: ['1', '2'],
        menuPerms: this.menuKey.BP
      }).then((res) => {
        this.purchasePaymentTermOptions = res.data || []
      })
    },
    querySalesPaymentTerm() {
      queryPaymentTermListByPaymentTermPurpose({
        paymentTermPurposeList: ['3', '4', '5', '6', '7'],
        menuPerms: this.menuKey.BP
      }).then((res) => {
        this.salesPaymentTermOptions = res.data || []
      })
    },
    openPurchasePaymentTermDlg() {
      this.$refs.purchasePaymentTermDlg.handleAdd()
    },
    purchasePaymentTermChange(item) {
      this.$set(this.accForm1, 'paymentTerm', item)
      this.$set(this.accForm1, 'paymentTermId', item.paymentTermId)
      this.$set(this.accForm1, 'paymentTermName', item.paymentTermName)
    },
    openSalesPaymentTermDlg() {
      this.$refs.salesPaymentTermDlg.handleAdd()
    },
    salesPaymentTermChange(item) {
      this.$set(this.accForm2, 'paymentTerm', item)
      this.$set(this.accForm2, 'paymentTermId', item.paymentTermId)
      this.$set(this.accForm2, 'paymentTermName', item.paymentTermName)
    },

    changePhoto(file) {
      this.$set(this.form, 'commonFileListTrademark', file.url ? [file] : [])
      this.$set(this.form, 'photoUrl', file.url)
      this.$set(this.form, 'fileIdsTrademark', file.id || '')
    },

    getFormJson() {
      const param = { ...this.form }
      param.bpBusinessAccountSupplier = this.accForm1
      param.bpBusinessAccountCustomer = this.accForm2
      param.bpBusinessAddressList = this.addressList
      param.bpBusinessContactPersonList = this.contactPersonList
      param.projectCustomerAddressList = this.projectCustomerAddressList
      param.projectList = this.projectList
      param.myFileIds = this.$refs.uploadRef && this.$refs.uploadRef.getFileIds()
      return JSON.stringify(param)
    },

    async submitForm(isApproved = false) {
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
        this.activeName = 'basicInfo'
        return
      }
      const valid2 = await this.$refs.form2.validate().catch((err) => {
        return err
      })
      this.collapseWarningForRegistrationInfo = !valid2
      if (!valid2) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.registrationInfo'))
        )
        this.activeName = 'basicInfo'
        return
      }
      if (valid1 && valid2) {
        let param = { ...this.form }
        param.bpBusinessAccountSupplier = this.accForm1
        param.bpBusinessAccountCustomer = this.accForm2
        // param.bpBusinessAddressList = this.$refs.AddressInfoRef.getTableList()
        // param.bpBusinessContactPersonList = this.$refs.ContactPersonInfoRef.getTableList()
        // param.bpBusinessContactPersonList.forEach((item) => {
        //   item.addressNamesList = this.$refs.ContactPersonInfoRef.getAddressLabelList(
        //     item.addressIdList
        //   )
        // })

        param.bpBusinessAddressList = this.addressList
        param.bpBusinessContactPersonList = this.contactPersonList
        param.projectCustomerAddressList = this.projectCustomerAddressList
        param.projectList = this.projectList

        param.syncCustomer = param.bpBusinessAccountCustomer.syncCustomer || '0'
        param.displayProdCodeOnApp = param.bpBusinessAccountCustomer.displayProdCodeOnApp || '0'
        param.syncSupplier = param.bpBusinessAccountSupplier.syncSupplier || '0'
        if (param.typeList.indexOf('0') === -1) {
          param.syncCustomer = '0'
          param.displayProdCodeOnApp = '0'
          // delete param.syncCustomer
        }
        if (param.typeList.indexOf('1') === -1) {
          param.syncSupplier = '0'
          // delete param.syncSupplier
        }
        if (param.syncCustomer === '1' || param.syncSupplier === '1') {
          param.cdsQc = '1'
        } else {
          param.cdsQc = '0'
        }
        const validAddress = this.validAddressList(param.bpBusinessAddressList || [], param)
        if (!validAddress) {
          this.collapseWarningForAddressInfo = true
          this.activeName = 'basicInfo'
          return
        }

        if (
          !param.bpBusinessAddressList.some((item) => item.isActive === '1') &&
          (param.shippingAgent !== '1' || param.syncCustomer === '1' || param.syncSupplier === '1')
        ) {
          this.$modal.msgError(this.$t('bp.addressReq'))
          this.collapseWarningForAddressInfo = true
          this.activeName = 'basicInfo'
          return
        }
        this.collapseWarningForAddressInfo = false
        if (!param.bpBusinessContactPersonList.some((item) => item.isActive === '1')) {
          this.$modal.msgError(this.$t('bp.contactPersonReq'))
          this.collapseWarningForContactPersonInfo = true
          this.activeName = 'basicInfo'
          return
        }
        this.collapseWarningForContactPersonInfo = false

        if (this.form.typeList.includes('0')) {
          const valid3 = await this.$refs.form3.validate().catch((err) => {
            return err
          })
          const valid31 = await this.$refs.bankInfoRef.validate().catch((err) => {
            return err
          })

          if (!valid3) {
            this.$modal.msgError(
              this.$t('ui.fromIncomplete').replace('$1', this.$t('bp.customerInfo'))
            )
            this.activeName = 'customerInfo'
            return
          }
          if (!valid31) {
            this.collapseWarningForBankInfo = true
            this.$modal.msgError(
              this.$t('ui.fromIncomplete').replace('$1', this.$t('organization.bankInfo'))
            )
            this.activeName = 'customerInfo'
            return
          }
          this.collapseWarningForBankInfo = false

          if (this.sysDockingSwitch && this.accForm2.syncCustomer === '1') {
            if (param.projectList.length <= 0) {
              this.$modal.msgError(
                this.$t('ui.fromIncomplete').replace('$1', this.$t('bp.projectErr'))
              )
              this.activeName = 'customerInfo'
              this.collapseWarningForProject = true
              return
            }

            // const siteAddress = param.projectList.find((item) => {
            //   return !this.$resultOfBoolean(item.siteAddress)
            // })
            // if (siteAddress) {
            //   this.$modal.msgError(
            //     this.$t('ui.commonReqMsg').replace('$1', this.$t('bp.projectAddress'))
            //   )
            //   this.activeName = 'customerInfo'
            //   this.collapseWarningForProject = true
            //   return
            // }

            const projectContactPersonIdList = param.projectList.find((item) => {
              return !this.$resultOfBoolean(item.projectContactPersonList)
            })
            if (projectContactPersonIdList) {
              this.$modal.msgError(
                this.$t('ui.commonReqMsg').replace('$1', this.$t('bp.projectContactPersonName'))
              )
              this.activeName = 'customerInfo'
              this.collapseWarningForProject = true
              return
            }
          }
          this.collapseWarningForProject = false
        }
        if (this.form.typeList.includes('1')) {
          const valid4 = await this.$refs.form4.validate().catch((err) => {
            return err
          })
          const valid41 = await this.$refs.BPbankInfoRef.validate().catch((err) => {
            return err
          })
          if (!valid4) {
            this.$modal.msgError(
              this.$t('ui.fromIncomplete').replace('$1', this.$t('bp.supplierInfo'))
            )
            this.activeName = 'supplierInfo'
            return
          }
          if (!valid41) {
            this.$modal.msgError(
              this.$t('ui.fromIncomplete').replace('$1', this.$t('organization.bankInfo'))
            )
            this.activeName = 'supplierInfo'
            return
          }
        }

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.commonFileList = myFileIds

        if (param.typeList.length > 1) {
          param.typeList = ['0', '1']
        }
        param.businessPartnerType = param.typeList.join(',')

        param.projectList &&
          param.projectList.forEach((x) => {
            if (!x.projectId) {
              x.projectId = x.rowTimeId
            }
            if (x.customerAddressList && x.customerAddressList.length > 0) {
              x.customerAddressList.forEach((k) => {
                if (!k.businessAddressId) {
                  k.businessAddressId = k.rowTimeId
                }
                delete k.projectIdList
              })
            }
            // delete x.customerAddressList
            if (x.projectContactPersonList && x.projectContactPersonList.length > 0) {
              x.projectContactPersonList.forEach((x) => {
                if (!x.contactPersonId) {
                  x.contactPersonId = x.rowTimeId
                }
              })
            }
          })
        param.bpBusinessContactPersonList &&
          param.bpBusinessContactPersonList.forEach((x) => {
            if (!x.contactPersonId) {
              x.contactPersonId = x.rowTimeId
            }
          })

        param.bpBusinessAddressList.forEach((x) => {
          if (!x.businessAddressId) {
            x.businessAddressId = x.rowTimeId
          }
          delete x.projectIdList
        })
        if (!param.mobileNum) {
          param.mobileCode = ''
          param.mobilePhone = ''
        }
        if (!param.fax) {
          param.faxCode = ''
          param.faxPhone = ''
        }
        if (isApproved) {
          // 审批流带提交功能
          this.approvedFormData = param
          this.aplVisible = true
          return
        }
        let content = this.$t('bp.submitConfirm')
        if (param.bpBusinessContactPersonList && param.bpBusinessContactPersonList.length > 0) {
          if (this.form.typeList.includes('0') && this.form.typeList.includes('1')) {
            const isDefaultSalesContactReq = param.bpBusinessContactPersonList.some((item) => {
              return item.isSalesDefault === '1'
            })
            const isDefaultPurchasingContactReq = param.bpBusinessContactPersonList.some((item) => {
              return item.isPurchaseDefault === '1'
            })
            if (!isDefaultSalesContactReq && !isDefaultPurchasingContactReq) {
              content = this.$t('bp.noPurchasingAndSalesContact')
            } else if (!isDefaultSalesContactReq) {
              content = this.$t('bp.noSalesContact')
            } else if (!isDefaultPurchasingContactReq) {
              content = this.$t('bp.noPurchasingContact')
            }
          } else if (this.form.typeList.includes('0')) {
            const isDefaultSalesContactReq = param.bpBusinessContactPersonList.some((item) => {
              return item.isSalesDefault === '1'
            })
            if (!isDefaultSalesContactReq) {
              content = this.$t('bp.noSalesContact')
            }
          } else if (this.form.typeList.includes('1')) {
            const isDefaultPurchasingContactReq = param.bpBusinessContactPersonList.some((item) => {
              return item.isPurchaseDefault === '1'
            })
            if (!isDefaultPurchasingContactReq) {
              content = this.$t('bp.noPurchasingContact')
            }
          }
        }
        // console.log(param, '===')
        this.$modal
          .confirm(content)
          .then(() => {
            this.submitLoading = true
            return saveBusinessPartner(param)
          })
          .then((response) => {
            const pageItem = formDirtyClass.routeStatusData[this.$route.name]
            if (pageItem) {
              pageItem.isSaveSuccess = true
            }
            this.submitLoading = false
            this.$modal.msgSuccess(this.$t('bp.submitSuccess').replace('$1', response.msg))
            this.back()
          })
          .catch(() => {
            this.submitLoading = false
          })
      }
    },
    handleSaveDraft(isConfirm = true, gotoRoute) {
      this.$refs.form1.clearValidate()
      this.$refs.form2.clearValidate()
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      let isError = false
      this.$refs.form1.validateField(['typeList', 'businessPartnerName', 'departmentId'], (err) => {
        if (err) {
          isError = true
        }
      })
      if (isError) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        this.collapseWarningForBasicInfo = true
        return
      }
      this.collapseWarningForBasicInfo = false
      if (!isError) {
        let param = { ...this.form }
        param.bpBusinessAccountSupplier = this.accForm1
        param.bpBusinessAccountCustomer = this.accForm2
        // param.bpBusinessAddressList = this.$refs.AddressInfoRef.getTableList()
        // param.bpBusinessContactPersonList = this.$refs.ContactPersonInfoRef.getTableList()
        // param.bpBusinessContactPersonList.forEach((item) => {
        //   item.addressNamesList = this.$refs.ContactPersonInfoRef.getAddressLabelList(
        //     item.addressIdList
        //   )
        // })

        param.bpBusinessAddressList = this.addressList
        param.bpBusinessContactPersonList = this.contactPersonList
        param.projectCustomerAddressList = this.projectCustomerAddressList
        param.projectList = this.projectList

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.commonFileList = myFileIds

        if (param.typeList.length > 1) {
          param.typeList = ['0', '1']
        }
        param.businessPartnerType = param.typeList.join(',')
        param.syncCustomer = param.bpBusinessAccountCustomer.syncCustomer || '0'
        param.displayProdCodeOnApp = param.bpBusinessAccountCustomer.displayProdCodeOnApp || '0'
        param.syncSupplier = param.bpBusinessAccountSupplier.syncSupplier || '0'

        if (param.typeList.indexOf('0') === -1) {
          param.syncCustomer = '0'
          param.displayProdCodeOnApp = '0'
          // delete param.syncCustomer
        }
        if (param.typeList.indexOf('1') === -1) {
          param.syncSupplier = '0'
          // delete param.syncSupplier
        }
        if (param.syncCustomer === '1' || param.syncSupplier === '1') {
          param.cdsQc = '1'
        } else {
          param.cdsQc = '0'
        }
        param.projectList &&
          param.projectList.forEach((x) => {
            if (!x.projectId) {
              x.projectId = x.rowTimeId
            }
            if (x.customerAddressList && x.customerAddressList.length > 0) {
              x.customerAddressList.forEach((k) => {
                if (!k.businessAddressId) {
                  k.businessAddressId = k.rowTimeId
                }
                delete k.projectIdList
              })
            }
            // delete x.customerAddressList
            if (x.projectContactPersonList && x.projectContactPersonList.length > 0) {
              x.projectContactPersonList.forEach((x) => {
                if (!x.contactPersonId) {
                  x.contactPersonId = x.rowTimeId
                }
              })
            }
          })
        param.bpBusinessContactPersonList &&
          param.bpBusinessContactPersonList.forEach((x) => {
            if (!x.contactPersonId) {
              x.contactPersonId = x.rowTimeId
            }
          })

        param.bpBusinessAddressList.forEach((x) => {
          if (!x.businessAddressId) {
            x.businessAddressId = x.rowTimeId
          }
          delete x.projectIdList
        })
        if (!param.mobileNum) {
          param.mobileCode = ''
          param.mobilePhone = ''
        }
        if (!param.fax) {
          param.faxCode = ''
          param.faxPhone = ''
        }
        if (isConfirm) {
          this.$modal
            .confirm(this.$t('bp.draftConfirm'))
            .then(() => {
              this.submitLoading = true
              return saveDraftBusinessPartner(param)
            })
            .then((response) => {
              const pageItem = formDirtyClass.routeStatusData[this.$route.name]
              if (pageItem) {
                pageItem.isSaveSuccess = true
              }
              this.submitLoading = false
              this.$modal.msgSuccess(this.$t('bp.draftSubmitSuccess'))
              this.cancel()
            })
            .catch(() => {
              this.submitLoading = false
            })
        } else {
          this.submitLoading = true
          saveDraftBusinessPartner(param)
            .then((response) => {
              const pageItem = formDirtyClass.routeStatusData[this.$route.name]
              if (pageItem) {
                pageItem.isSaveSuccess = true
              }
              this.submitLoading = false
              this.$modal.msgSuccess(this.$t('bp.draftSubmitSuccess'))
              if (gotoRoute && gotoRoute.name !== this.$route.name) {
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.push(gotoRoute).catch(() => {})
              } else {
                this.cancel()
              }
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      }
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      // isConfirm
      this.handleSaveDraft(false, gotoRoute)
    },
    validAddressList(list, param) {
      const valid = false
      if (
        !list.some((item) => item.isActive === '1') &&
        (param.shippingAgent !== '1' || param.syncCustomer === '1' || param.syncSupplier === '1')
      ) {
        this.$modal.msgError(this.$t('bp.addressReq'))
        return valid
      }

      const address1Req = list.find((item) => {
        return !item.address1
      })
      if (address1Req) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.addressInfo')))
        return valid
      }
      return true
    },

    handleRevise() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: '/businessPartner/reviseBusinessPartner',
        query: {
          id: this.form.businessPartnerMainId,
          timeId: Date.now()
        }
      })
    },
    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.form.businessPartnerMainId)
    },
    exitComparison() {
      this.isComparison = false
      this.addressList = JSON.parse(JSON.stringify(this.addressListCur))
      this.contactPersonList = JSON.parse(JSON.stringify(this.contactPersonListCur))
      this.projectList = JSON.parse(JSON.stringify(this.projectListCur))
      this.$nextTick(() => {
        this.$refs.AddressInfoRef && this.$refs.AddressInfoRef.initList(this.addressList)
        this.$refs.ContactPersonInfoRef &&
          this.$refs.ContactPersonInfoRef.initList(this.contactPersonList)
        this.$refs.projectTable && this.$refs.projectTable.initList(this.projectList)
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList(this.commonFileListCur)
      })
    },
    getBeforeValue(prop, type = 1) {
      let list = this.basicUpdateMsgList
      if (type === 2) {
        list = this.accountSupplierUpdateMsgList
      } else if (type === 3) {
        list = this.accountCustomerUpdateMsgList
      }
      const item = list.find((row) => row.name === prop) || {}
      return item.beforeValue
    },
    getAfterValue(prop, type = 1, fallback) {
      let list = this.basicUpdateMsgList
      if (type === 2) {
        list = this.accountSupplierUpdateMsgList
      } else if (type === 3) {
        list = this.accountCustomerUpdateMsgList
      }
      const item = list.find((row) => row.name === prop)
      return item && item.afterValue !== undefined ? item.afterValue : fallback
    },
    isModified(prop, type = 1) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (type === 1) {
        if (this.basicUpdateProps.includes(prop)) {
          return 'edit-outline'
        }
      } else if (type === 2) {
        if (this.accountSupplierUpdateProps.includes(prop)) {
          return 'edit-outline'
        }
      } else if (type === 3) {
        if (this.accountCustomerUpdateProps.includes(prop)) {
          return 'edit-outline'
        }
      }
    },
    queryBPHistoryVersion() {
      if (this.comeFrom !== '1') return
      queryBPHistoryVersion({ businessId: this.rowId }).then((res) => {
        this.bpHistoryVersionList = res.data || []
      })
    },
    settingHandleCommand(businessId) {
      this.$router.push({
        path: '/businessPartner/viewBusinessPartner',
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
      if (this.comDisFrom) {
        this.approvedFormData = undefined
        this.aplVisible = true
      } else {
        this.submitForm(true)
      }
    },
    aplVisibleChange(data) {
      this.aplVisible = data || false
    },
    aplSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('bp.approvedSuccess')}`.replace('$1', vm.form.businessPartnerName)
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
        `${vm.$t('bp.rejectedSuccess')}`.replace('$1', vm.form.businessPartnerName)
      )
      this.rjVisible = false
      vm.back('onRejectedSuccess')
    }
  }
}
</script>
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
