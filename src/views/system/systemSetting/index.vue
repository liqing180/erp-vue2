<template>
  <FormPageLayout ref="FormPageLayoutRef">
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        v-if="!comDisFrom"
        :disabled="fullscreenLoading"
        @click="submit"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </template>
    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <!-- 基本信息 -->
        <div class="form-card">
          <el-collapse-item name="1">
            <FormCollapseItemTitle slot="title" :title="$t('system.systemTrigger')">
            </FormCollapseItemTitle>
            <el-form :model="form" label-width="auto" :disabled="comDisFrom">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.automatedGeneratePreDeliveryNotice')}`">
                    <el-switch
                      v-model="form.automatedGeneratePreDeliveryNotice"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <div v-html="$t('system.generatePreDeliveryNoticeTip')"></div>
                      </div>
                      <i class="el-icon-info ml10"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.automatedPushDeliveryNotice')}`">
                    <el-switch
                      v-model="form.automatedPushDeliveryNotice"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <div v-html="$t('system.pushDeliveryNoticeTip')"></div>
                      </div>
                      <i class="el-icon-info ml10"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item :label="`${$t('system.automatedSendEdo')}`">
                    <el-switch
                      v-model="form.automatedSendEdo"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </el-form-item>
                </el-col> -->
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="2">
            <FormCollapseItemTitle slot="title" :title="$t('system.preDeliveryNotice')">
            </FormCollapseItemTitle>
            <el-form :model="form" label-width="auto" :disabled="comDisFrom">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.automatedSendEdo')}`">
                    <el-switch
                      v-model="form.automatedSendEdo"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <div v-html="$t('system.automatedSendEdoTip')"></div>
                      </div>
                      <i class="el-icon-info ml10"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" ref="purchaseOrderTabRef">
          <el-collapse-item name="17">
            <FormCollapseItemTitle slot="title" :title="$t('menu.purchaseOrder')">
            </FormCollapseItemTitle>
            <el-form
              :model="form"
              label-width="140px"
              @submit.native.prevent
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.poEdit')}`">
                    <el-switch
                      v-model="form.poEdit"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <div v-html="$t('system.poEditTip')"></div>
                      </div>
                      <i class="el-icon-info ml10"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.poPurchaseQty')}`">
                    <el-switch
                      v-model="form.poPurchaseQty"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <div v-html="$t('system.poPurchaseQtyTip')"></div>
                      </div>
                      <i class="el-icon-info ml10"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.taxIncluded')}`">
                    <el-switch
                      v-model="form.taxIncluded"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <div v-html="$t('system.taxIncludedTip')"></div>
                      </div>
                      <i class="el-icon-info ml10"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-row>
                  <el-col :span="24">
                    <el-button
                      class="mb10"
                      size="mini"
                      :v-if="!comDisFrom"
                      type="primary"
                      icon="el-icon-plus"
                      @click="addPOConditionsClick"
                      >{{ $t('system.addConditions') }}</el-button
                    >
                    <el-table
                      ref="dragTablePO"
                      border=""
                      row-key="conditionsId"
                      class="mb20"
                      :data="form.poConditionsList || []"
                      v-table-tab
                    >
                      <el-table-column
                        type="index"
                        :label="$t('ui.sn')"
                        width="60"
                        align="center"
                        class-name="allowDrag"
                      >
                        <template slot-scope="scope">
                          <span>{{ scope.$index + 1 }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="category"
                        :label="$t('ui.category')"
                        header-align="center"
                        align="left"
                        width="200"
                        :show-overflow-tooltip="true"
                        class-name="allowDrag"
                      >
                        <template slot="header" slot-scope="{ column }">
                          <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                        </template>
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.category" placeholder="" style="width: 98%">
                            <el-option
                              v-for="item in purchase_conditions_category"
                              :key="item.dictLabel"
                              :label="item.dictLabel"
                              :value="item.dictLabel"
                            >
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="conditions"
                        :label="$t('ui.conditions')"
                        header-align="center"
                        align="left"
                        min-width="400"
                        :show-overflow-tooltip="true"
                      >
                        <template slot="header" slot-scope="{ column }">
                          <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                        </template>
                        <template slot-scope="scope">
                          <MyInput
                            style="width: 98%"
                            type="textarea"
                            v-model="scope.row.conditions"
                            :autosize="{ minRows: 1, maxRows: 8 }"
                            resize="none"
                            :show-word-limit="false"
                            :maxlength="3000"
                            :disabled="comDisFrom"
                          ></MyInput>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="isDefault"
                        :label="$t('ui.isDefault')"
                        header-align="center"
                        align="left"
                        width="120"
                        :show-overflow-tooltip="false"
                      >
                        <template slot-scope="scope">
                          <el-switch
                            v-model="scope.row.isDefault"
                            :disabled="comDisFrom"
                            active-value="1"
                            inactive-value="0"
                          ></el-switch>
                        </template>
                      </el-table-column>

                      <el-table-column
                        :label="$t('ui.action')"
                        key="action"
                        align="center"
                        width="120"
                        class-name="small-padding fixed-width"
                        fixed="right"
                        v-if="!comDisFrom"
                      >
                        <template slot-scope="scope">
                          <div class="flexCen">
                            <i
                              class="el-icon-delete pointer"
                              style="font-size: 20px; color: #f56c6c"
                              :title="$t('uiBtn.delete')"
                              @click="handleDelPOConditions(scope.$index)"
                            ></i>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="3">
            <FormCollapseItemTitle slot="title" :title="$t('menu.purchaseRequisition')">
            </FormCollapseItemTitle>
            <el-form :model="form" label-width="auto" @submit.native.prevent :disabled="comDisFrom">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.prWarningDays')}`">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.prWarningDays"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="99"
                  /></el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="4">
            <FormCollapseItemTitle slot="title" :title="$t('menu.requestForQuotation')">
            </FormCollapseItemTitle>
            <el-form :model="form" label-width="auto" @submit.native.prevent :disabled="comDisFrom">
              <el-row>
                <el-col :span="6">
                  <el-form-item :label="`${$t('system.inquirySupplierQuantity')}`">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.inquirySupplierQuantity"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="9"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="`${$t('system.inquiryCycle')}`">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.inquiryCycle"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="999"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="`${$t('system.batchInput')}`">
                    <el-switch
                      v-model="form.rfqQtyBatchInput"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="`${$t('system.quoteLink')}`">
                    <el-switch
                      v-model="form.quoteLinkEnabled"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <div v-html="$t('system.quoteLinkTip')"></div>
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
          <el-collapse-item name="5">
            <FormCollapseItemTitle slot="title" :title="$t('menu.storeIssueChit')">
            </FormCollapseItemTitle>
            <el-form :model="form" label-width="auto" @submit.native.prevent :disabled="comDisFrom">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.returnDays')}`">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.returnDays"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="99"
                  /></el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" ref="salesQuotationTabRef">
          <el-collapse-item name="6">
            <FormCollapseItemTitle slot="title" :title="$t('menu.salesQuotation')">
            </FormCollapseItemTitle>
            <el-form :model="form" label-width="auto" @submit.native.prevent :disabled="comDisFrom">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.quotationValidityDays')}`">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.quotationValidityDays"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="99"
                  /></el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-button
                    class="mb10"
                    size="mini"
                    :v-if="!comDisFrom"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addConditionsClick"
                    >{{ $t('system.addConditions') }}</el-button
                  >
                  <el-table
                    ref="dragTable"
                    border=""
                    row-key="conditionsId"
                    class="mb20"
                    :data="form.salesConditionsList || []"
                    v-table-tab
                  >
                    <el-table-column
                      type="index"
                      :label="$t('ui.sn')"
                      width="60"
                      align="center"
                      class-name="allowDrag"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="category"
                      :label="$t('ui.category')"
                      header-align="center"
                      align="left"
                      width="200"
                      :show-overflow-tooltip="true"
                      class-name="allowDrag"
                    >
                      <template slot="header" slot-scope="{ column }">
                        <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                      </template>
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.category" placeholder="" style="width: 98%">
                          <el-option
                            v-for="item in dict.type.conditions_category"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="purposeList"
                      :label="$t('ui.purpose')"
                      header-align="center"
                      align="left"
                      width="200"
                      :show-overflow-tooltip="true"
                      class-name="allowDrag"
                    >
                      <template slot="header" slot-scope="{ column }">
                        <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                      </template>
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.purposeList"
                          :title="
                            selectDictLabels(
                              dict.type.conditions_purpose,
                              (scope.row.purposeList || []).join(',')
                            )
                          "
                          placeholder=""
                          style="width: 98%"
                          clearable
                          multiple
                          collapse-tags
                          class="log-msg-ellipsis"
                        >
                          <el-option
                            v-for="item in conditionsPurposeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="conditions"
                      :label="$t('ui.conditions')"
                      header-align="center"
                      align="left"
                      min-width="400"
                      :show-overflow-tooltip="true"
                    >
                      <template slot="header" slot-scope="{ column }">
                        <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                      </template>
                      <template slot-scope="scope">
                        <MyInput
                          type="textarea"
                          v-model="scope.row.conditions"
                          :autosize="{ minRows: 1, maxRows: 8 }"
                          resize="none"
                          :show-word-limit="false"
                          :maxlength="3000"
                          :disabled="comDisFrom"
                        ></MyInput>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="isDefault"
                      :label="$t('ui.isDefault')"
                      header-align="center"
                      align="left"
                      width="120"
                      :show-overflow-tooltip="false"
                    >
                      <template slot-scope="scope">
                        <el-switch
                          v-model="scope.row.isDefault"
                          :disabled="comDisFrom"
                          active-value="1"
                          inactive-value="0"
                        ></el-switch>
                      </template>
                    </el-table-column>

                    <el-table-column
                      :label="$t('ui.action')"
                      key="action"
                      align="center"
                      width="120"
                      class-name="small-padding fixed-width"
                      fixed="right"
                      v-if="!comDisFrom"
                    >
                      <template slot-scope="scope">
                        <div class="flexCen">
                          <i
                            class="el-icon-delete pointer"
                            style="font-size: 20px; color: #f56c6c"
                            :title="$t('uiBtn.delete')"
                            @click="handleDelConditions(scope.$index)"
                          ></i>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="7">
            <FormCollapseItemTitle slot="title" :title="$t('system.returnRate')">
            </FormCollapseItemTitle>
            <el-form
              :model="form"
              label-width="140px"
              @submit.native.prevent
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :md="12" :lg="10">
                  <el-form-item :label="`${$t('ui.supplier')}`">
                    <div class="flex">
                      <el-input-number
                        style="width: 50%"
                        v-model="form.supplierReturnRateDays"
                        controls-position="right"
                        :precision="0"
                        v-thousandSplit="{ precision: 0 }"
                        :min="1"
                        :max="999"
                      />
                      <span class="mr5 ml5">{{ $t('system.day') }}</span>
                      <el-input-number
                        style="width: 50%"
                        v-model="form.supplierReturnRate"
                        controls-position="right"
                        :precision="0"
                        v-thousandSplit="{ precision: 0 }"
                        :min="1"
                        :max="999"
                      />
                      <span class="mr5 ml5">%</span>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :md="12" :lg="10">
                  <el-form-item :label="`${$t('ui.customer')}`">
                    <div class="flex">
                      <el-input-number
                        style="width: 50%"
                        v-model="form.customerReturnRateDays"
                        controls-position="right"
                        :precision="0"
                        v-thousandSplit="{ precision: 0 }"
                        :min="1"
                        :max="999"
                      />
                      <span class="mr5 ml5">{{ $t('system.day') }}</span>
                      <el-input-number
                        style="width: 50%"
                        v-model="form.customerReturnRate"
                        controls-position="right"
                        :precision="0"
                        v-thousandSplit="{ precision: 0 }"
                        :min="1"
                        :max="999"
                      />
                      <span class="mr5 ml5">%</span>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="13">
            <FormCollapseItemTitle slot="title" :title="$t('menu.purchasingProcessReport')">
            </FormCollapseItemTitle>
            <el-form
              :model="form"
              label-width="160px"
              @submit.native.prevent
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.totalTimeElapsed')}`">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.purchaseTotalTimeElapsed"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="999"
                  /></el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.timeTaken')}`">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.purchaseTimeTaken"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="999"
                  /></el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
        <div class="form-card mt10">
          <el-collapse-item name="8">
            <FormCollapseItemTitle slot="title" :title="$t('menu.salesProgressReport')">
            </FormCollapseItemTitle>
            <el-form
              :model="form"
              label-width="160px"
              @submit.native.prevent
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.totalTimeElapsed')}`">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.salesTotalTimeElapsed"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="999"
                  /></el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.timeTaken')}`">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.salesTimeTaken"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="999"
                  /></el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
        <div class="form-card mt10">
          <el-collapse-item name="9">
            <FormCollapseItemTitle slot="title" :title="$t('menu.salesOrder')">
            </FormCollapseItemTitle>
            <el-form :model="form" label-width="auto" @submit.native.prevent :disabled="comDisFrom">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.consignmentWarningDays')}`">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.consignmentWarningDays"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="99"
                  /></el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="18">
            <FormCollapseItemTitle slot="title" :title="$t('menu.deliveryOrder')">
            </FormCollapseItemTitle>
            <el-form
              :model="form"
              label-width="140px"
              @submit.native.prevent
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.conditions')">
                    <emailEditor
                      v-model="form.doConditions"
                      class="form-wd"
                      :template-for="'doConditions'"
                      :init-content="initContent2"
                      :config="doConfig"
                    ></emailEditor>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="10">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('system.approvalStageIsAutomaticallySkipped')"
            >
            </FormCollapseItemTitle>
            <el-form :model="form" label-width="auto" @submit.native.prevent :disabled="comDisFrom">
              <el-row>
                <el-col>
                  <el-form-item label="">
                    <el-checkbox v-model="form.approvalDuplicate">{{
                      $t('system.approvalDuplicate')
                    }}</el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="">
                    <el-checkbox v-model="form.initiatorEqualApproval">{{
                      $t('system.initiatorEqualApproval')
                    }}</el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="">
                    <el-checkbox v-model="form.initiatorHighApproval">{{
                      $t('system.initiatorHighApproval')
                    }}</el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="11">
            <FormCollapseItemTitle slot="title" :title="$t('system.businessPartner')">
            </FormCollapseItemTitle>
            <div>
              {{ $t('system.ImportsDefaultStatus') }}
            </div>
            <div class="mt20">
              <el-radio v-model="form.importDataBpStatus" label="1">{{
                $t('system.open')
              }}</el-radio>
            </div>
            <div class="mt20">
              <el-radio v-model="form.importDataBpStatus" label="2">{{
                $t('system.pendApproval')
              }}</el-radio>
              <div style="padding-left: 24px; font-size: 12px; color: #606662">
                {{ $t('system.pendApprovalTip') }}
              </div>
            </div>
            <div class="mt20 mb20">
              <el-radio v-model="form.importDataBpStatus" label="3">{{
                $t('system.approved')
              }}</el-radio>
              <div style="padding-left: 24px; font-size: 12px; color: #606662">
                {{ $t('system.approvedTip') }}
              </div>
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="12">
            <FormCollapseItemTitle slot="title" :title="$t('system.product')">
            </FormCollapseItemTitle>
            <div>
              {{ $t('system.ImportsDefaultStatus') }}
            </div>
            <div class="mt20">
              <el-radio v-model="form.importDataProductStatus" label="1">{{
                $t('system.open')
              }}</el-radio>
            </div>
            <div class="mt20">
              <el-radio v-model="form.importDataProductStatus" label="2">{{
                $t('system.pendApproval')
              }}</el-radio>
              <div style="padding-left: 24px; font-size: 12px; color: #606662">
                {{ $t('system.pendApprovalTip') }}
              </div>
            </div>
            <div class="mt20 mb20">
              <el-radio v-model="form.importDataProductStatus" label="3">{{
                $t('system.approved')
              }}</el-radio>
              <div style="padding-left: 24px; font-size: 12px; color: #606662">
                {{ $t('system.approvedTip') }}
              </div>
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" ref="serviceSurchargeTabRef">
          <el-collapse-item name="20">
            <FormCollapseItemTitle slot="title" :title="$t('system.serviceSurcharge')">
            </FormCollapseItemTitle>
            <div>
              <el-button
                class="mb10"
                size="mini"
                :v-if="!comDisFrom"
                type="primary"
                icon="el-icon-plus"
                @click="addServiceSurcharge"
                >{{ $t('uiBtn.add') }}</el-button
              >
              <el-table
                ref="serviceSurcharge"
                border=""
                class="mb20"
                :data="form.serviceSurchargeList || []"
                v-table-tab
              >
                <el-table-column
                  type="index"
                  :label="$t('ui.sn')"
                  width="60"
                  align="center"
                  class-name="allowDrag"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="expenseItemName"
                  :label="$t('system.expenseItem')"
                  header-align="center"
                  align="left"
                  min-width="400"
                  :show-overflow-tooltip="true"
                >
                  <template slot="header" slot-scope="{ column }">
                    <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                  </template>
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.expenseItemName"
                      :maxlength="100"
                      :disabled="comDisFrom"
                    ></el-input>
                    <!-- <div v-if="isExpenseItemNameDuplicate(scope.$index)" style="color: #ff4949" >
                      {{
                        $t('system.expenseItemAlreadyExists').replace(
                          '$1',
                          scope.row.expenseItemName
                        )
                      }}
                    </div> -->
                  </template>
                </el-table-column>
                <el-table-column
                  prop="unit"
                  :label="$t('ui.unit')"
                  header-align="center"
                  align="left"
                  min-width="300"
                  :show-overflow-tooltip="true"
                  class-name="allowDrag"
                >
                  <template slot="header" slot-scope="{ column }">
                    <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                  </template>
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.unit"
                      :title="showUomLabel(scope.row.unit)"
                      filterable
                      placeholder=""
                      style="width: 98%"
                      :disabled="comDisFrom"
                    >
                      <el-option v-for="item in allUomList" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="qtyLimit"
                  :label="$t('system.QTYLimit')"
                  header-align="center"
                  align="left"
                  min-width="300"
                  :show-overflow-tooltip="true"
                >
                  <template slot="header" slot-scope="{ column }">
                    <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                  </template>
                  <template slot-scope="scope">
                    <el-input-number
                      class="flex-1"
                      v-model="scope.row.qtyLimit"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="999"
                      :disabled="comDisFrom"
                      style="width: 98%"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="includeDecimal"
                  :label="$t('PRODUCT.includeDecimal')"
                  header-align="center"
                  align="left"
                  width="120"
                  :show-overflow-tooltip="false"
                >
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.includeDecimal"
                      :disabled="comDisFrom"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="isDefault"
                  :label="$t('ui.isDefault')"
                  header-align="center"
                  align="left"
                  width="120"
                  :show-overflow-tooltip="false"
                >
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.isDefault"
                      :disabled="comDisFrom"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$t('ui.action')"
                  key="action"
                  align="center"
                  width="120"
                  class-name="small-padding fixed-width"
                  fixed="right"
                  v-if="!comDisFrom"
                >
                  <template slot-scope="scope">
                    <div class="flexCen">
                      <i
                        class="el-icon-delete pointer"
                        style="font-size: 20px; color: #f56c6c"
                        :title="$t('uiBtn.delete')"
                        @click="handleDelServiceSurcharge(scope.$index)"
                      ></i>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="14">
            <FormCollapseItemTitle slot="title" :title="$t('system.salesCostConfiguration')">
            </FormCollapseItemTitle>

            <div>
              <el-radio v-model="form.salesCostConfigurationType" label="1">{{
                $t('system.latestTransactionPrice')
              }}</el-radio>
            </div>
            <div class="mt20">
              <el-radio v-model="form.salesCostConfigurationType" label="2">{{
                $t('system.highestHistoricalPrice')
              }}</el-radio>
              <div style="padding-left: 24px; font-size: 12px; color: #606662">
                <el-form
                  :model="form"
                  label-width="auto"
                  :disabled="comDisFrom || form.salesCostConfigurationType !== '2'"
                  ref="form2"
                >
                  <el-form-item
                    prop="highestHistoricalPriceDays"
                    :rules="[
                      {
                        required: form.salesCostConfigurationType === '2',
                        pattern: new RegExp(/^(?!(\s+$))/g),
                        message: $t('ui.reqMsg'),
                        trigger: ['blur']
                      }
                    ]"
                  >
                    <el-input-number
                      style="width: 150px"
                      v-model="form.highestHistoricalPriceDays"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="999"
                    />
                    <span class="mr5 ml5">{{ $t('system.days') }}</span>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="mt20 mb20">
              <el-radio v-model="form.salesCostConfigurationType" label="3">{{
                $t('system.movingAverageCost')
              }}</el-radio>
            </div>
            <div class="mt20 mb20">
              <el-radio v-model="form.salesCostConfigurationType" label="4">{{
                $t('system.weightedAverageCost')
              }}</el-radio>
              <div style="padding-left: 24px; font-size: 12px; color: #606662">
                <el-form
                  :model="form"
                  ref="form4"
                  label-width="auto"
                  :disabled="comDisFrom || form.salesCostConfigurationType !== '4'"
                  inline
                  :key="'weightedAverageCost_' + form.salesCostConfigurationType"
                >
                  <el-form-item
                    style="width: 150px"
                    prop="weightedAverageCostType"
                    :rules="[
                      {
                        required: form.salesCostConfigurationType === '4',
                        pattern: new RegExp(/^(?!(\s+$))/g),
                        message: $t('ui.reqMsg'),
                        trigger: ['blur']
                      }
                    ]"
                  >
                    <el-radio v-model="form.weightedAverageCostType" label="2">{{
                      $t('system.month')
                    }}</el-radio>
                  </el-form-item>
                  <el-form-item
                    prop="weightedAverageCostDays"
                    :rules="[
                      {
                        required:
                          form.salesCostConfigurationType === '4' &&
                          form.weightedAverageCostType === '1',
                        pattern: new RegExp(/^(?!(\s+$))/g),
                        message: $t('ui.reqMsg'),
                        trigger: ['blur']
                      }
                    ]"
                  >
                    <el-radio v-model="form.weightedAverageCostType" label="1">
                      <el-input-number
                        style="width: 150px"
                        v-model="form.weightedAverageCostDays"
                        controls-position="right"
                        :precision="0"
                        v-thousandSplit="{ precision: 0 }"
                        :min="1"
                        :max="999"
                        :disabled="form.weightedAverageCostType !== '1'"
                      />
                      <span class="mr5 ml5">{{ $t('system.days') }}</span>
                    </el-radio>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-collapse-item>
        </div>
        <div class="form-card mt10">
          <el-collapse-item name="15">
            <FormCollapseItemTitle slot="title" :title="$t('system.warehouseLogicSettings')">
            </FormCollapseItemTitle>
            <div style="width: 100%; max-width: 800px" class="mb20">
              <el-form :model="form" label-width="auto" :disabled="comDisFrom">
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('system.MRPAutoExecute')}`">
                      <el-switch
                        v-model="form.mrpautoExecute"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('system.printLabelsForProjectItems')}`">
                      <el-switch
                        v-model="form.printLabelsForProjectItemsEnabled"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                      <el-tooltip placement="top">
                        <div slot="content">
                          <div v-html="$t('system.printLabelsTip')"></div>
                        </div>
                        <i class="el-icon-info ml10"></i>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>

              <div style="color: #86909c">{{ $t('system.configureRulesOutbound') }}</div>
              <!-- 默认规则部分 -->
              <div class="defaultRule mt20">
                <div class="rule-title">{{ $t('system.defaultRule') }}</div>
                <div class="mt10">
                  <el-radio :value="'1'" label="1">{{ $t('system.FIFO') }}</el-radio>
                </div>
                <div class="mt10" style="color: #5681f1">{{ $t('system.defaultRuleTip') }}</div>
              </div>
              <div class="bestMatchRule">
                <div class="rule-title">{{ $t('system.bestMatchRule') }}</div>
                <div style="color: #86909c">{{ $t('system.bestMatchRuleTip') }}</div>
                <div class="flexStart mt10" v-if="!comDisFrom">
                  <el-input
                    clearable
                    size="medium"
                    :placeholder="$t('system.enterProductTip')"
                    class="flex-1 mr5"
                    v-model="enterProductValue"
                    @input="searchProductList"
                  >
                  </el-input>
                  <el-button
                    size="medium"
                    :disabled="comDisFrom"
                    type="primary"
                    class="fs-0"
                    @click="addProduct"
                    >{{ $t('system.addProduct') }}</el-button
                  >
                </div>
                <div class="product-list">
                  <div>{{ $t('system.appliedBestMatch') }}</div>
                  <el-scrollbar ref="scrollbarRef">
                    <div style="max-height: 600px">
                      <div
                        class="product-item flexStart mt10"
                        v-for="item in form.appliedBestMatchShowList || []"
                        :key="item.productId"
                      >
                        <div
                          class="product-item-name flex-1 mr10 ellipsis-text"
                          :title="item.productName"
                        >
                          {{ item.productName }}
                        </div>
                        <el-button
                          size="medium"
                          @click="removeProduct(item)"
                          v-if="!comDisFrom"
                          type="text"
                          class="fs-0"
                          ><span style="color: #f56c6c">{{ $t('system.remove') }}</span></el-button
                        >
                        <!-- <i
                          class="el-icon-delete pointer"
                          style="font-size: 20px; color: #f56c6c"
                          :title="$t('uiBtn.delete')"
                          @click="handleDelRow(scope.$index, scope.row)"
                        ></i> -->
                      </div>
                    </div>
                  </el-scrollbar>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="16">
            <FormCollapseItemTitle slot="title" :title="$t('system.businessCalendarSettings')">
            </FormCollapseItemTitle>
            <div style="width: 100%; max-width: 1000px" class="mb20">
              <div style="color: #4b5563; font-size: 16px">
                {{ $t('system.usageScenario') }}
              </div>

              <el-tabs v-model="activeName" @tab-click="handleTabClick" class="mt10">
                <el-tab-pane :label="$t('system.weeklyWorkingHours')" name="1"></el-tab-pane>
                <el-tab-pane :label="$t('system.holidaysSpecialDates')" name="2"></el-tab-pane>
              </el-tabs>
              <!-- 工作时间 -->
              <el-form
                :model="form"
                label-width="auto"
                :disabled="comDisFrom"
                class="business-calendar-settings"
                v-show="activeName === '1'"
              >
                <el-row>
                  <el-col :span="4">
                    <span style="color: #6b7280; font-weight: 700">{{
                      $t('system.dayOfWeek')
                    }}</span>
                  </el-col>
                  <el-col :span="4">
                    <span style="color: #6b7280; font-weight: 700">{{
                      $t('system.workingDay')
                    }}</span>
                  </el-col>
                  <el-col :span="16">
                    <span style="color: #6b7280; font-weight: 700">{{
                      $t('system.workingBreakPeriods')
                    }}</span>
                  </el-col>
                </el-row>
                <ul>
                  <li v-for="(father, fatherIndex) in dayRules" :key="father.id">
                    <el-form
                      :model="father"
                      :rules="rules"
                      label-width="auto"
                      :disabled="comDisFrom"
                      :ref="'weekForm_' + fatherIndex"
                      :show-message="false"
                    >
                      <el-row class="mt20">
                        <el-col :span="4">
                          <span style="font-weight: 700">{{ weekList[fatherIndex] }}</span>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-checkbox v-model="father.isWorkDay"></el-checkbox>
                          </el-form-item>
                        </el-col>
                        <el-col :span="16">
                          <div class="flexStart">
                            <div class="mb10">{{ $t('system.Work') }}：</div>
                            <el-row>
                              <el-col :span="11">
                                <el-form-item prop="mondayStartTime">
                                  <el-time-picker
                                    v-model="father.mondayStartTime"
                                    :disabled="!father.isWorkDay || comDisFrom"
                                    :picker-options="{
                                      selectableRange: '00:00:00 - 23:59:00'
                                    }"
                                    value-format="timestamp"
                                    placeholder=""
                                    format="HH:mm"
                                    style="width: 100%"
                                    @change="handleWorkTimeChange(father, fatherIndex)"
                                  >
                                  </el-time-picker>
                                </el-form-item>
                              </el-col>
                              <el-col :span="2">
                                <div class="flexCen">-</div>
                              </el-col>
                              <el-col :span="11">
                                <el-form-item prop="mondayEndTime">
                                  <el-time-picker
                                    v-model="father.mondayEndTime"
                                    :disabled="!father.isWorkDay || comDisFrom"
                                    :picker-options="{
                                      selectableRange: '00:00:00 - 23:59:00'
                                    }"
                                    placeholder=""
                                    format="HH:mm"
                                    style="width: 100%"
                                    value-format="timestamp"
                                    @change="handleWorkTimeChange(father, fatherIndex)"
                                  >
                                  </el-time-picker>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </div>
                          <ul style="margin-left: 40px">
                            <li v-for="(item, index) in father.breakTimeSlots" :key="item.id">
                              <div class="flexStart">
                                <div class="mb10">{{ $t('system.Break') }}：</div>
                                <el-form
                                  :model="item"
                                  :rules="rules"
                                  label-width="auto"
                                  :disabled="comDisFrom"
                                  :ref="'breakForm_' + item.id"
                                  :show-message="false"
                                >
                                  <el-row>
                                    <el-col :span="10">
                                      <!-- prop="mondayBreakStartTime" -->
                                      <el-form-item
                                        prop="mondayBreakStartTime"
                                        :rules="{
                                          required: true,
                                          message: $t('ui.reqMsg'),
                                          pattern: new RegExp(/^(?!(\s+$))/g),
                                          trigger: ['change', 'blur']
                                        }"
                                      >
                                        <!-- selectableRange: '00:00:00 - 23:59:00' -->
                                        <!-- :picker-options="{
                                            selectableRange: [
                                              '00:00:00 - 12:00:00',
                                              '13:00:00 - 23:59:00'
                                            ]
                                          }" -->

                                        <el-time-picker
                                          v-model="item.mondayBreakStartTime"
                                          :disabled="
                                            !father.isWorkDay ||
                                            comDisFrom ||
                                            !father.mondayStartTime ||
                                            !father.mondayEndTime
                                          "
                                          :picker-options="{
                                            selectableRange: selectableRangeFun(father, index)
                                          }"
                                          placeholder=""
                                          format="HH:mm"
                                          style="width: 100%"
                                          value-format="timestamp"
                                        >
                                        </el-time-picker>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="2">
                                      <div class="flexCen">-</div>
                                    </el-col>
                                    <el-col :span="10">
                                      <!-- prop="mondayBreakEndTime" -->
                                      <el-form-item
                                        prop="mondayBreakEndTime"
                                        :rules="{
                                          required: true,
                                          message: $t('ui.reqMsg'),
                                          pattern: new RegExp(/^(?!(\s+$))/g),
                                          trigger: ['change', 'blur']
                                        }"
                                      >
                                        <el-time-picker
                                          v-model="item.mondayBreakEndTime"
                                          :disabled="
                                            !father.isWorkDay ||
                                            comDisFrom ||
                                            !father.mondayStartTime ||
                                            !father.mondayEndTime
                                          "
                                          :picker-options="{
                                            selectableRange: selectableRangeFun(father, index)
                                          }"
                                          placeholder=""
                                          format="HH:mm"
                                          style="width: 100%"
                                          value-format="timestamp"
                                        >
                                        </el-time-picker>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="2">
                                      <div class="flexCen">
                                        <i
                                          class="el-icon-close pointer"
                                          :disabled="!father.isWorkDay || comDisFrom"
                                          :style="{
                                            fontSize: '22px',
                                            color:
                                              !father.isWorkDay || comDisFrom
                                                ? '#C0C4CC'
                                                : '#f56c6c',
                                            marginTop: '3px',
                                            cursor:
                                              !father.isWorkDay || comDisFrom ? 'not-allowed' : ''
                                          }"
                                          @click="delBreakPeriod(father, fatherIndex, index)"
                                        ></i>
                                      </div>
                                    </el-col>
                                  </el-row>
                                </el-form>
                              </div>
                            </li>
                          </ul>

                          <div class="flexSb">
                            <el-button
                              type="text"
                              icon="el-icon-plus"
                              :disabled="
                                !father.isWorkDay || comDisFrom || father.breakTimeSlots.length >= 2
                              "
                              @click="addBreakPeriod(fatherIndex)"
                              >{{ $t('system.AddBreakPeriod') }}</el-button
                            >
                            <el-button
                              type="text"
                              :disabled="!father.isWorkDay || comDisFrom"
                              v-if="fatherIndex < 5"
                              >{{ $t('system.ApplyToWeekdays') }}</el-button
                            >
                          </div>
                        </el-col>
                      </el-row>
                      <el-divider></el-divider>
                    </el-form>
                  </li>
                </ul>
              </el-form>
              <!-- 节假日 -->
              <div v-show="activeName === '2'">
                <div class="flexSb" style="color: #4b5563">
                  <div>
                    {{
                      activeName === '1'
                        ? $t('system.usageScenario')
                        : $t('system.holidaysOrSpecial')
                    }}
                  </div>
                  <el-button
                    type="success"
                    icon="el-icon-plus"
                    :disabled="comDisFrom"
                    @click="addHolidaysSpecialDates"
                    >{{ $t('system.AddExceptionDate') }}
                  </el-button>
                </div>
                <el-form
                  :model="form"
                  label-width="auto"
                  :disabled="comDisFrom"
                  class="business-calendar-settings"
                >
                  <ul>
                    <li
                      v-for="(father, fatherIndex) in exceptions"
                      :key="fatherIndex"
                      class="business-item mt10"
                    >
                      <el-form
                        :model="father"
                        :rules="rules"
                        label-width="auto"
                        :disabled="comDisFrom"
                        :ref="'holiday_' + fatherIndex"
                        :show-message="false"
                      >
                        <el-row class="mt20">
                          <el-col :span="6">
                            <el-form-item prop="holidayDate">
                              <!-- :picker-options="validityDaysPickerOptions" -->
                              <el-date-picker
                                v-model="father.holidayDate"
                                :format="fmtForYmd"
                                value-format="timestamp"
                                :style="{ width: '100%' }"
                                placeholder=""
                                clearable
                              ></el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item prop="name">
                              <el-input v-model="father.name"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item prop="type">
                              <el-select
                                v-model="father.type"
                                :disabled="comDisFrom"
                                placeholder=""
                                style="width: 100%"
                              >
                                <el-option
                                  v-for="dict in [
                                    { value: 'HOLIDAY', label: $t('system.nonWorkingDayHoliday') },
                                    {
                                      value: 'SPECIAL_WORKDAY',
                                      label: $t('system.specialWorkingDay')
                                    }
                                  ]"
                                  :key="dict.value"
                                  :label="dict.label"
                                  :value="dict.value"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6" v-if="father.type === 'SPECIAL_WORKDAY'">
                            <el-row>
                              <el-col :span="11">
                                <el-form-item prop="mondayStartTime">
                                  <el-time-picker
                                    v-model="father.mondayStartTime"
                                    :disabled="comDisFrom"
                                    :picker-options="{
                                      selectableRange: '00:00:00 - 23:59:00'
                                    }"
                                    placeholder=""
                                    format="HH:mm"
                                    style="width: 100%"
                                    value-format="timestamp"
                                  >
                                  </el-time-picker>
                                </el-form-item>
                              </el-col>
                              <el-col :span="2">
                                <div class="flexCen">-</div>
                              </el-col>
                              <el-col :span="11">
                                <el-form-item prop="mondayEndTime">
                                  <el-time-picker
                                    v-model="father.mondayEndTime"
                                    :disabled="comDisFrom"
                                    :picker-options="{
                                      selectableRange: '00:00:00 - 23:59:00'
                                    }"
                                    placeholder=""
                                    format="HH:mm"
                                    style="width: 100%"
                                    value-format="timestamp"
                                  >
                                  </el-time-picker>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>

                        <div class="flexEnd">
                          <el-button
                            type="text"
                            :disabled="comDisFrom"
                            @click="delHolidaysSpecialDates(fatherIndex)"
                          >
                            <span style="color: #f56c6c">
                              {{ $t('uiBtn.delete') }}
                            </span></el-button
                          >
                        </div>
                      </el-form>
                    </li>
                  </ul>
                </el-form>
              </div>
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="19">
            <FormCollapseItemTitle slot="title" :title="$t('system.EmergencyGoodsReceipt')">
            </FormCollapseItemTitle>
            <el-form :model="form" label-width="auto" :disabled="comDisFrom">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.ApprovalFlow')}`">
                    <el-switch
                      v-model="form.approvalFlowEnabled"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <div v-html="$t('system.ApprovalFlowTips')"></div>
                      </div>
                      <i class="el-icon-info ml10"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.OverseasSupplier')}`">
                    <el-switch
                      v-model="form.overseasSupplierEnabled"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <div v-html="$t('system.OverseasSupplierTips')"></div>
                      </div>
                      <i class="el-icon-info ml10"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.ASLValidation')}`">
                    <el-switch
                      v-model="form.aslValidationEnabled"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <div v-html="$t('system.ASLValidationTips')"></div>
                      </div>
                      <i class="el-icon-info ml10"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

            <div style="width: 100%; max-width: 800px" class="mb20">
              <div class="defaultRule">
                <div class="rule-title">{{ $t('system.defaultRule1') }}</div>
                <div class="mt10" style="color: #5681f1">{{ $t('system.defaultRuleTips') }}</div>
              </div>

              <div class="mt20">
                <div style="font-size: 16px; font-weight: 700">
                  {{ $t('system.RestrictByCategory') }}
                </div>
                <div style="color: #86909c">
                  {{ $t('system.AllProducts') }}
                </div>
              </div>

              <div class="tree-page">
                <el-tree
                  ref="tree"
                  :data="treeList"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  :check-strictly="false"
                  show-checkbox
                  node-key="id"
                  class="tree"
                  :default-expanded-keys="defaultExpandedKeys"
                  :default-checked-keys="defaultCheckedKeys || []"
                >
                </el-tree>
              </div>

              <div
                class="mt10"
                style="
                  padding: 10px 20px;
                  background-color: #fff2f0;
                  border: 1px solid #ffccc7;
                  border-radius: 5px;
                "
              >
                <div style="color: #c73121">{{ $t('system.checkedCategoryTips') }}</div>
              </div>
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>

    <selectProductTable ref="selectProductTable" @onSuccess="addProductSuccess" />
  </FormPageLayout>
</template>

<script>
import locale from '@/views/system/lang/index'
import { getSystemSetup, updateSystemSetup } from '@/api/system/systemSetting'
import selectProductTable from './selectProductTable.vue'
import emailEditor from '@/views/system/emailManagement/editor/editor'
import Sortable from 'sortablejs'
import { queryBusinessSelectProductCategoryTreeList } from '@/api/productManagement/productCategory'
import { queryAllUomListByLocalization } from '@/api/system/uom'
import { getDictsForLocalized } from '@/api/system/dict/data'
export default {
  name: 'SystemSetting',
  dicts: ['conditions_category', 'conditions_purpose'],
  components: {
    selectProductTable,
    emailEditor
  },
  data() {
    const vm = this
    return {
      form: {
        automatedGeneratePreDeliveryNotice: '0',
        automatedPushDeliveryNotice: '0',
        automatedSendEdo: '0',
        poEdit: '0',
        poPurchaseQty: '0',
        taxIncluded: '0',
        conditions: undefined,
        doConditions: undefined,
        consignmentWarningDays: undefined,
        prWarningDays: undefined,
        purchaseTotalTimeElapsed: undefined,
        purchaseTimeTaken: undefined,
        salesTotalTimeElapsed: undefined,
        salesTimeTaken: undefined,
        supplierReturnRateDays: undefined,
        supplierReturnRate: undefined,
        customerReturnRateDays: undefined,
        customerReturnRate: undefined,
        approvalDuplicate: undefined,
        importDataBpStatus: undefined,
        importDataProductStatus: undefined,
        salesCostConfigurationType: undefined,
        highestHistoricalPriceDays: undefined,
        weightedAverageCostDays: undefined,
        weightedAverageCostType: undefined,
        rfqQtyBatchInput: '0',
        quoteLinkEnabled: '0',
        printLabelsForProjectItemsEnabled: '0'
      },
      purposeOptions: [
        {
          value: 'Trading',
          label: this.$t('ui.trading')
        },
        {
          value: 'Service',
          label: this.$t('ui.service')
        },
        {
          value: 'Consignment',
          label: this.$t('ui.consignment')
        },
        {
          value: 'Staff',
          label: this.$t('ui.staff')
        },
        {
          value: 'newPlantInstallation',
          // New Plant Installation 新设备安装
          label: this.$t('ui.newPlantInstallation')
        },
        {
          value: 'plantModification',
          // Plant Modification 设备改装
          label: this.$t('ui.plantModification')
        },
        {
          value: 'installationCommissioning',
          // Installation & Commissioning 安装与调试
          label: this.$t('ui.installationCommissioning')
        }
      ],
      activeNames: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20'
      ],
      fullscreenLoading: false,
      enterProductValue: '',
      activeName: '1',
      weekList: [
        this.$t('system.Monday'),
        this.$t('system.Tuesday'),
        this.$t('system.Wednesday'),
        this.$t('system.Thursday'),
        this.$t('system.Friday'),
        this.$t('system.Saturday'),
        this.$t('system.Sunday')
      ],
      // 星期
      dayRules: [],
      // 节假日
      exceptions: [],
      pickerOptions: {
        shortcuts: [
          {
            text: vm.$t('ui.weekly'),
            onClick(picker) {
              const end = vm.appointTime(Date.now(), '23:59:59')
              const start = vm.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 6
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: vm.$t('ui.fortnightly'),
            onClick(picker) {
              const end = vm.appointTime(Date.now(), '23:59:59')
              const start = vm.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 13
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: vm.$t('ui.monthly'),
            onClick(picker) {
              const end = vm.appointTime(Date.now(), '23:59:59')
              const start = vm.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 29
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: vm.$t('ui.quarterly'),
            onClick(picker) {
              const end = vm.appointTime(Date.now(), '23:59:59')
              const start = vm.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 89
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: vm.$t('ui.sixMonthly'),
            onClick(picker) {
              const end = vm.appointTime(Date.now(), '23:59:59')
              const start = vm.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: vm.$t('ui.annually'),
            onClick(picker) {
              const end = vm.appointTime(Date.now(), '23:59:59')
              const start = vm.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 364
              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate(time) {
          return false
        }
      },
      rules: {
        mondayStartTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        mondayEndTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        holidayDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        type: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      exceptionsCreate: [],
      cursorPosition: 0,
      initContent: '',
      initContent2: '',
      config: {
        width: 800, // px
        height: 440, // px
        contentReadOnly: false,
        isShowToolBar: true,
        disabled: false,
        buttonsOption: [
          {
            componentName: 'BtnFontNameList',
            isShow: false
          },
          {
            componentName: 'BtnBackColor',
            isShow: false
          },
          {
            componentName: 'BtnUnderLine',
            isShow: false
          },
          {
            componentName: 'BtnCreateLink',
            isShow: false
          },
          {
            componentName: 'BtnUnlink',
            isShow: false
          },
          {
            componentName: 'BtnHeader',
            isShow: false
          },
          {
            componentName: 'BtnServTpl',
            isShow: true
          }
        ]
      },
      doConfig: {
        width: 800, // px
        height: 440, // px
        contentReadOnly: false,
        isShowToolBar: true,
        disabled: false,
        buttonsOption: [
          {
            componentName: 'BtnFontNameList',
            isShow: false
          },
          {
            componentName: 'BtnBackColor',
            isShow: false
          },
          {
            componentName: 'BtnUnderLine',
            isShow: false
          },
          {
            componentName: 'BtnCreateLink',
            isShow: false
          },
          {
            componentName: 'BtnUnlink',
            isShow: false
          },
          {
            componentName: 'BtnHeader',
            isShow: false
          },
          {
            componentName: 'BtnServTpl',
            isShow: false
          }
        ]
      },
      treeList: [],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: 'child',
        label: 'categoryName'
      },
      allUomList: [],
      purchase_conditions_category: []
    }
  },
  computed: {
    editAuth() {
      return this.checkPermi(['system:systemSetting:edit'])
    },
    comDisFrom() {
      return !this.editAuth
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    sysDockingSwitch() {
      return this.$store.getters.sysDockingSwitch || this.$store.getters.sysDockingSwitchQC
    },
    conditionsPurposeOptions() {
      const list = this.dict.type.conditions_purpose || []
      if (this.sysDockingSwitch) {
        return list
      } else {
        return list.filter((i) => i.value !== 'MixDesign')
      }
    },
    isExpenseItemNameDuplicate() {
      return (index) => {
        const currentName = this.form.serviceSurchargeList[index]?.expenseItemName?.trim()
        if (!currentName) return false
        return this.form.serviceSurchargeList.some(
          (item, idx) => idx !== index && item.expenseItemName?.trim() === currentName
        )
      }
    }
  },
  watch: {
    'form.salesCostConfigurationType': {
      handler(val) {
        if (val !== '2') {
          this.form.highestHistoricalPriceDays = undefined
          this.$refs.form2 && this.$refs.form2.clearValidate()
        } else {
          if (!this.form.highestHistoricalPriceDays) {
            this.form.highestHistoricalPriceDays = 180
          }
        }

        if (val !== '4') {
          this.form.weightedAverageCostDays = undefined
          this.form.weightedAverageCostType = undefined
          this.$refs.form4 && this.$refs.form4.clearValidate()
        }
      },
      immediate: true
    },
    'form.weightedAverageCostType': {
      handler(val) {
        if (val !== '1') {
          this.form.weightedAverageCostDays = undefined
        } else {
          if (!this.form.weightedAverageCostDays) {
            this.form.weightedAverageCostDays = 180
          }
        }
      },
      immediate: true
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryAllProductCategoryTreeList()
    this.queryAllUomListByLocalization()
    this.handleUpdate()
    // /type/localized/{dictType}
    getDictsForLocalized('purchase_conditions_category').then((res) => {
      this.purchase_conditions_category = res.data || []
    })
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.handleUpdate()
  },
  methods: {
    queryAllUomListByLocalization() {
      queryAllUomListByLocalization({}).then((res) => {
        this.allUomList = (res.data || []).map((x) => x.uomName)
      })
    },
    queryAllProductCategoryTreeList() {
      queryBusinessSelectProductCategoryTreeList().then((res) => {
        this.treeList = res.data
        if (this.defaultExpandedKeys.length === 0) {
          this.defaultExpandedKeys = this.treeList.length > 0 ? this.treeList.map((x) => x.id) : []
        }
      })
    },
    // 工作时间段
    handleWorkTimeChange(father, fatherIndex) {
      const { mondayStartTime, mondayEndTime } = father
      if (!mondayStartTime || !mondayEndTime) {
        father.breakTimeSlots.forEach((x) => {
          x.mondayBreakStartTime = undefined
          x.mondayBreakEndTime = undefined
        })
      }
      // 清空休息时间段
    },
    // 休息时间段
    selectableRangeFun(father, index) {
      let ranges = []
      const { mondayStartTime, mondayEndTime } = father
      if (!mondayStartTime || !mondayEndTime) {
        ranges = ['00:00:00 - 23:59:00']
      } else {
        ranges = [
          this.timestampToTime(mondayStartTime) + ' - ' + this.timestampToTime(mondayEndTime)
        ]
      }
      return ranges
    },
    handleTabClick() {},
    // 添加休息时间段
    addBreakPeriod(index) {
      this.dayRules[index].breakTimeSlots.push({
        id: +new Date(),
        mondayBreakEndTime: undefined,
        mondayBreakStartTime: undefined
      })
    },
    // 删除休息时间段
    delBreakPeriod(father, fatherIndex, index) {
      if (!father.isWorkDay || this.comDisFrom) return
      this.dayRules[fatherIndex].breakTimeSlots.splice(index, 1)
      console.log(this.dayRules[fatherIndex].breakTimeSlots, '=============1197')
    },
    // 添加节假日
    addHolidaysSpecialDates() {
      this.exceptions.push({
        customId: this.exceptions.length + 1,
        sourceType: 'MANUAL',
        isAdd: '1'
      })
    },
    delHolidaysSpecialDates(index) {
      this.exceptions.splice(index, 1)
    },
    searchProductList() {
      const value = (this.enterProductValue || '').trim().toLowerCase()

      const list = this.form.productStockOutStrategyList || []
      if (value) {
        const showList = list.filter((item) => {
          const str1 = (item.productName || '').toLowerCase()
          const str2 = (item.alternateSku || '').toLowerCase()
          return str1.includes(value) || str2.includes(value)
        })
        this.$set(this.form, 'appliedBestMatchShowList', showList)
      } else {
        this.$set(this.form, 'appliedBestMatchShowList', list)
      }
      this.$nextTick(() => {
        if (this.$refs.scrollbarRef) {
          this.$refs.scrollbarRef.moveY = 0
          this.$refs.scrollbarRef.update()
          // this.$refs.scrollbarRef.moveY = 0
        }
      })
      // setTimeout(() => {
      //   console.log(this.$refs.scrollbarRef)

      //   if (this.$refs.scrollbarRef) {
      //     this.$refs.scrollbarRef.update()
      //     // this.$refs.scrollbarRef.moveY = 0
      //   }
      // }, 200)
    },
    addProduct() {
      const list = this.form.productStockOutStrategyList || []
      const ids = list.map((i) => i.productId)
      this.$refs.selectProductTable.handleAdd(ids)
      // list.push({
      //   productId: list.length + 1,
      //   productName: value
      // })
      // this.$set(this.form, 'productStockOutStrategyList', list)
    },
    addProductSuccess(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        this.form.productStockOutStrategyList.push(...rows)
        this.searchProductList()
      }
    },
    removeProduct(row) {
      const index = this.form.productStockOutStrategyList.findIndex(
        (item) => row.productId === item.productId
      )
      this.form.productStockOutStrategyList.splice(index, 1)
      this.searchProductList()
    },

    /* 采购订单 条件 Start */
    scrollToPO() {
      const offsetTop = this.$refs.purchaseOrderTabRef.offsetTop
      const pageContent = this.$refs.FormPageLayoutRef.$refs.pageContent
      if (pageContent) {
        pageContent.scrollTo({
          top: offsetTop - 50, // pageContent 没有使用定位
          behavior: 'smooth' // 平滑滚动
        })
      }
    },
    addPOConditionsClick() {
      const list = this.form.poConditionsList || []
      list.push({
        conditionsId: Date.now(),
        conditions: ''
      })
      this.$set(this.form, 'poConditionsList', list)
      setTimeout(() => {
        this.setDragTableForPO()
      }, 200)
    },
    handleDelPOConditions(index) {
      const list = this.form.poConditionsList || []
      list.splice(index, 1)
      setTimeout(() => {
        this.setDragTableForPO()
      }, 200)
    },
    addServiceSurcharge() {
      const list = this.form.serviceSurchargeList || []
      list.push({
        // id: Date.now(),
        expenseItemName: undefined,
        unit: undefined,
        qtyLimit: undefined,
        includeDecimal: '0'
      })
      this.$set(this.form, 'serviceSurchargeList', list)
    },
    handleDelServiceSurcharge(index) {
      const list = this.form.serviceSurchargeList || []
      list.splice(index, 1)
    },
    setDragTableForPO() {
      this.destroyDraggable()
      const el = this.$refs.dragTablePO.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortableDomPO = Sortable.create(el, {
        handle: '.allowDrag',
        animation: 100,
        ghostClass: 'blue-background-class',
        onEnd: (evt) => {
          if (evt.oldIndex === evt.newIndex) return
          const list = this.form.poConditionsList || []
          const targetRow = list.splice(evt.oldIndex, 1)[0]
          list.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
    destroyDraggableForPO() {
      if (this.sortableDomPO) {
        this.sortableDomPO.destroy()
        this.sortableDomPO = undefined
      }
    },
    /* 采购订单 条件 End */

    /* 销售报价 条件 Start */
    scrollToSQ() {
      const offsetTop = this.$refs.salesQuotationTabRef.offsetTop
      const pageContent = this.$refs.FormPageLayoutRef.$refs.pageContent
      if (pageContent) {
        pageContent.scrollTo({
          top: offsetTop - 50, // pageContent 没有使用定位
          behavior: 'smooth' // 平滑滚动
        })
      }
    },
    scrollToServiceSurcharge() {
      const offsetTop = this.$refs.serviceSurchargeTabRef.offsetTop
      const pageContent = this.$refs.FormPageLayoutRef.$refs.pageContent
      if (pageContent) {
        pageContent.scrollTo({
          top: offsetTop - 50, // pageContent 没有使用定位
          behavior: 'smooth' // 平滑滚动
        })
      }
    },
    addConditionsClick() {
      const list = this.form.salesConditionsList || []
      list.push({
        conditionsId: Date.now(),
        conditions: ''
      })
      this.$set(this.form, 'salesConditionsList', list)
      setTimeout(() => {
        this.setDragTable()
      }, 200)
    },
    handleDelConditions(index) {
      const list = this.form.salesConditionsList || []
      list.splice(index, 1)
      setTimeout(() => {
        this.setDragTable()
      }, 200)
    },
    setDragTable() {
      this.destroyDraggable()
      const el = this.$refs.dragTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortableDom = Sortable.create(el, {
        handle: '.allowDrag',
        animation: 100,
        ghostClass: 'blue-background-class',
        onEnd: (evt) => {
          if (evt.oldIndex === evt.newIndex) return
          const list = this.form.salesConditionsList || []
          const targetRow = list.splice(evt.oldIndex, 1)[0]
          list.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
    destroyDraggable() {
      if (this.sortableDom) {
        this.sortableDom.destroy()
        this.sortableDom = undefined
      }
    },
    /* 销售报价 条件 End */

    handleUpdate() {
      getSystemSetup().then((res) => {
        const data = res.data || {}
        data.calendarWorking = data.calendarWorking || {}
        data.productStockOutStrategyList = data.productStockOutStrategyList || []
        this.form = res.data
        this.initContent2 = data.doConditions || ''

        const poConditions = data.conditions || ''
        try {
          if (poConditions) {
            this.$set(this.form, 'poConditionsList', JSON.parse(poConditions))
          }
        } catch (error) {
          this.$set(this.form, 'poConditionsList', [])
        }

        const salesConditions = data.salesConditions || ''
        if (salesConditions) {
          this.$set(this.form, 'salesConditionsList', JSON.parse(salesConditions))
        }
        setTimeout(() => {
          this.setDragTableForPO()
          this.setDragTable()
        }, 500)
        this.searchProductList()
        const {
          approvalDuplicate,
          initiatorEqualApproval,
          initiatorHighApproval,
          highestHistoricalPriceDays,
          weightedAverageCostDays,
          weightedAverageCostType,
          calendarWorking,
          emergencyReceiptCategoryBlackList
        } = this.form
        this.defaultCheckedKeys = emergencyReceiptCategoryBlackList || []
        this.form.approvalDuplicate = approvalDuplicate && approvalDuplicate * 1 === 1
        this.form.initiatorEqualApproval =
          initiatorEqualApproval && initiatorEqualApproval * 1 === 1
        this.form.initiatorHighApproval = initiatorHighApproval && initiatorHighApproval * 1 === 1

        this.$set(
          this.form,
          'highestHistoricalPriceDays',
          highestHistoricalPriceDays ? highestHistoricalPriceDays * 1 : undefined
        )
        this.$set(
          this.form,
          'weightedAverageCostDays',
          weightedAverageCostDays ? weightedAverageCostDays * 1 : undefined
        )
        this.$set(this.form, 'weightedAverageCostType', weightedAverageCostType || undefined)
        const { dayRules, exceptions } = calendarWorking
        this.dayRules = dayRules || []
        this.dayRules.forEach((x) => {
          // x.mondayStartTime = this.timeToTimestamp(x.workStartTime)
          // x.mondayEndTime = this.timeToTimestamp(x.workEndTime)
          this.$set(x, 'mondayStartTime', this.timeToTimestamp(x.workStartTime))
          this.$set(x, 'mondayEndTime', this.timeToTimestamp(x.workEndTime))
          if (x.breakTimeSlots && x.breakTimeSlots.length > 0) {
            x.breakTimeSlots.forEach((y) => {
              // y.mondayBreakStartTime = this.timeToTimestamp(y.breakStartTime)
              // y.mondayBreakEndTime = this.timeToTimestamp(y.breakEndTime)
              this.$set(y, 'mondayBreakStartTime', this.timeToTimestamp(y.breakStartTime))
              this.$set(y, 'mondayBreakEndTime', this.timeToTimestamp(y.breakEndTime))
            })
          }
        })
        this.exceptions = exceptions || []
        this.exceptions.forEach((x) => {
          x.customId = x.id
          // x.holidayDate = this.timeToTimestamp(x.exceptionDate, 'date')
          this.$set(x, 'holidayDate', this.timeToTimestamp(x.exceptionDate, 'date'))
          if (x.specialWorkStart) {
            // x.mondayStartTime = this.timeToTimestamp(x.specialWorkStart)
            this.$set(x, 'mondayStartTime', this.timeToTimestamp(x.specialWorkStart))
          }
          if (x.specialWorkEnd) {
            // x.mondayEndTime = this.timeToTimestamp(x.specialWorkEnd)
            this.$set(x, 'mondayEndTime', this.timeToTimestamp(x.specialWorkEnd))
          }
        })
        this.exceptionsCreate = JSON.parse(JSON.stringify(this.exceptions))
      })
    },
    /**
     * 将时分字符串（如 "3:00"）转换为当前日期对应时间的时间戳
     * @param {string} timeStr - 时分字符串，格式为 "HH:mm"
     * @returns {number} 对应的毫秒级时间戳
     */
    timeToTimestamp(timeStr, type) {
      if (!timeStr) return ''
      if (type === 'date') {
        const [year, month, date] = timeStr.split('-').map(Number)
        if (isNaN(year) || isNaN(month) || isNaN(date)) {
          return
        }
        const targetTime = new Date(year, month - 1, date, 0, 0, 0, 0)
        return targetTime.getTime()
      }
      // 解析时分
      const [hours, minutes] = timeStr.split(':').map(Number)
      if (isNaN(hours) || isNaN(minutes)) {
        return
      }

      // 获取当前日期
      const today = new Date()
      // 创建当前日期的指定时间（0秒0毫秒）
      const targetTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hours,
        minutes,
        0,
        0
      )
      return targetTime.getTime()
    },

    /**
     * 将时间戳转换为时分格式字符串（如 "16:48"）
     * @param {number} timestamp - 毫秒级时间戳
     * @returns {string} 时分格式字符串
     */
    timestampToTime(timestamp, type) {
      if (!timestamp) return ''
      if (type === 'date') {
        const date = new Date(timestamp)

        // 获取年份
        const year = date.getFullYear()

        // 获取月份（加1是因为月份从0开始，且需补零确保两位数）
        const month = String(date.getMonth() + 1).padStart(2, '0')

        // 获取日期（补零确保两位数）
        const day = String(date.getDate()).padStart(2, '0')

        // 拼接为"年-月-日"格式
        return `${year}-${month}-${day}`
      }
      const date = new Date(timestamp)
      // 获取小时并补零
      const hours = String(date.getHours()).padStart(2, '0')
      // 获取分钟并补零
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}:00`
    },
    // 每周日历检测
    async validateBusinessCalendarSettings() {
      for (let i = 0; i < this.dayRules.length; i++) {
        // console.log(this.$refs['weekForm_' + i], '============1388')
        if (!this.dayRules[i].isWorkDay) continue
        const valid = await this.$refs['weekForm_' + i][0].validate().catch((err) => {
          return err
        })
        const { breakTimeSlots } = this.dayRules[i]
        if (breakTimeSlots && breakTimeSlots.length > 0) {
          for (let j = 0; j < breakTimeSlots.length; j++) {
            // console.log(this.$refs['breakForm_' + breakTimeSlots[j].id], j, '===========1396')
            const valid1 = await this.$refs['breakForm_' + breakTimeSlots[j].id][0]
              .validate()
              .catch((err) => {
                return err
              })
            if (!valid1) {
              this.activeName = '1'
              this.fullscreenLoading = false
              this.$modal.msgError(
                this.$t('ui.fromIncomplete').replace(
                  '$1',
                  this.$t('system.businessCalendarSettings')
                )
              )
              return false
            }
          }
        }
        if (!valid) {
          this.activeName = '1'
          this.fullscreenLoading = false
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('system.businessCalendarSettings'))
          )
          return false
        }
      }
      return true
    },
    // 节假日检测
    async validateBusinessCalendarSettings1() {
      for (let i = 0; i < this.exceptions.length; i++) {
        // console.log(this.$refs['weekForm_' + i], '============1388')
        const valid = await this.$refs['holiday_' + i][0].validate().catch((err) => {
          return err
        })
        if (!valid) {
          this.activeName = '2'
          this.fullscreenLoading = false
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('system.businessCalendarSettings'))
          )
          return false
        }
      }
      return true
    },
    async submit(data) {
      if (this.$refs.tree) {
        const checkedKeys = this.$refs.tree.getCheckedKeys()
        console.log(checkedKeys, '===============2292')
        this.$set(this.form, 'emergencyReceiptCategoryBlackList', checkedKeys)
      }

      this.fullscreenLoading = true
      if (this.form.salesCostConfigurationType === '2') {
        const valid = await this.$refs.form2.validate().catch((err) => {
          return err
        })
        if (!valid) {
          this.fullscreenLoading = false
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('system.salesCostConfiguration'))
          )
          return
        }
      }
      if (this.form.salesCostConfigurationType === '4') {
        const valid1 = await this.$refs.form4.validate().catch((err) => {
          return err
        })
        if (!valid1) {
          this.fullscreenLoading = false
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('system.salesCostConfiguration'))
          )
          return
        }
      }
      // 每周日历检测
      const flag = await this.validateBusinessCalendarSettings()
      if (!flag) return
      // 节假日检测
      const flag1 = await this.validateBusinessCalendarSettings1()
      if (!flag1) return
      const { dayRules, exceptions } = this
      dayRules.forEach((x) => {
        x.workStartTime = this.timestampToTime(x.mondayStartTime)
        x.workEndTime = this.timestampToTime(x.mondayEndTime)
        if (x.breakTimeSlots && x.breakTimeSlots.length > 0) {
          x.breakTimeSlots.forEach((y) => {
            y.breakStartTime = this.timestampToTime(y.mondayBreakStartTime)
            y.breakEndTime = this.timestampToTime(y.mondayBreakEndTime)
          })
        }
      })
      exceptions.forEach((x) => {
        x.exceptionDate = this.timestampToTime(x.holidayDate, 'date')
        // console.log(x.exceptionDate, '============1617')
        if (x.mondayStartTime) {
          x.specialWorkStart = this.timestampToTime(x.mondayStartTime)
        }
        if (x.mondayEndTime) {
          x.specialWorkEnd = this.timestampToTime(x.mondayEndTime)
        }
      })
      let exceptionsCreate = JSON.parse(JSON.stringify(this.exceptionsCreate))
      exceptionsCreate.forEach((x, i) => {
        const index = this.exceptions.findIndex((k) => k.customId === x.customId)
        if (index !== -1) {
          // console.log(this.exceptions[index], '=============1628')
          exceptionsCreate[i] = this.exceptions[index]
        } else {
          x.delFlag = '2'
        }
      })
      // console.log(exceptionsCreate, '============1635')
      const list = this.exceptions
        .filter((x) => x.isAdd === '1')
        .map((k) => {
          const { isAdd, ...param } = k
          return {
            ...param
          }
        })
      exceptionsCreate = exceptionsCreate.concat(list)
      // console.log(list, exceptionsCreate, '==================1626')
      this.form.calendarWorking.dayRules = dayRules
      // this.form.calendarWorking.exceptions = exceptions
      this.form.calendarWorking.exceptions = exceptionsCreate

      const poConditionsList = this.form.poConditionsList || []
      const validPOConditions = this.validPOconditions(poConditionsList)
      if (!validPOConditions) {
        return
      }
      this.$set(this.form, 'conditions', JSON.stringify(poConditionsList))

      const SQConditionsList = this.form.salesConditionsList || []
      const validSQConditions = this.validSQconditions(SQConditionsList)
      if (!validSQConditions) {
        return
      }

      const serviceSurchargeList = this.form.serviceSurchargeList || []
      const validServiceSurcharge = this.validServiceSurcharge(serviceSurchargeList)
      if (!validServiceSurcharge) {
        return
      }

      this.$set(this.form, 'salesConditions', JSON.stringify(SQConditionsList))
      this.$modal
        .confirm(this.$t('system.systemSettingConfirm'))
        .then(() => {
          this.form.approvalDuplicate = this.form.approvalDuplicate ? 1 : 0
          this.form.initiatorEqualApproval = this.form.initiatorEqualApproval ? 1 : 0
          this.form.initiatorHighApproval = this.form.initiatorHighApproval ? 1 : 0
          return updateSystemSetup(this.form)
        })
        .then(() => {
          this.fullscreenLoading = false
          this.handleUpdate()
          this.$message.success(`${this.$t('system.systemSettingSuccess')}`)
        })
        .catch(() => {
          this.fullscreenLoading = false
        })
    },
    validPOconditions(ConditionsList) {
      console.log('11', ConditionsList)

      const fail = false
      ConditionsList.forEach((item) => {
        item.conditions = (item.conditions || '').trim()
      })
      const categoryReq = ConditionsList.find((item) => {
        return !item.category
      })
      if (categoryReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.category')))
        this.fullscreenLoading = false
        this.scrollToPO()
        return fail
      }
      const conditionsReq = ConditionsList.find((item) => {
        return !item.conditions
      })
      if (conditionsReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.conditions')))
        this.fullscreenLoading = false
        this.scrollToPO()
        return fail
      }
      return true
    },
    validSQconditions(ConditionsList) {
      const fail = false
      ConditionsList.forEach((item) => {
        item.conditions = (item.conditions || '').trim()
      })
      const categoryReq = ConditionsList.find((item) => {
        return !item.category
      })
      if (categoryReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.category')))
        this.fullscreenLoading = false
        this.scrollToSQ()
        return fail
      }
      const purposeListReq = ConditionsList.find((item) => {
        return (item.purposeList || []).length <= 0
      })
      if (purposeListReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.purpose')))
        this.fullscreenLoading = false
        this.scrollToSQ()
        return fail
      }
      const conditionsReq = ConditionsList.find((item) => {
        return !item.conditions
      })
      if (conditionsReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.conditions')))
        this.fullscreenLoading = false
        this.scrollToSQ()
        return fail
      }
      return true
    },
    validServiceSurcharge(ConditionsList) {
      const fail = false
      ConditionsList.forEach((item) => {
        item.expenseItemName = (item.expenseItemName || '').trim()
      })
      const expenseItemReq = ConditionsList.find((item) => {
        return !item.expenseItemName
      })
      if (expenseItemReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('system.expenseItem'))
        )
        this.fullscreenLoading = false
        this.scrollToServiceSurcharge()
        return fail
      }
      // 检查重复
      const seen = new Set()
      for (const item of ConditionsList) {
        if (seen.has(item.expenseItemName)) {
          this.$modal.msgError(
            this.$t('system.expenseItemAlreadyExists').replace('$1', item.expenseItemName)
          )
          this.fullscreenLoading = false
          this.scrollToServiceSurcharge()
          return fail
        }
        seen.add(item.expenseItemName)
      }
      const uomReq = ConditionsList.find((item) => {
        return !item.unit
      })
      if (uomReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.unit')))
        this.fullscreenLoading = false
        this.scrollToServiceSurcharge()
        return fail
      }
      const QTYLimitReq = ConditionsList.find((item) => {
        return !item.qtyLimit
      })
      if (QTYLimitReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('system.QTYLimit')))
        this.fullscreenLoading = false
        this.scrollToServiceSurcharge()
        return fail
      }
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
.defaultRule {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background-color: #eff6ff;
  border: 1px solid #d3e2f5;
  padding: 10px;
  border-radius: 6px;
  .rule-title {
    font-size: 18px;
    font-weight: bold;
    color: #2040b6;
  }
}
.bestMatchRule {
  .rule-title {
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  .product-list {
    margin-top: 20px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    background-color: #f9fafb;
    border-radius: 6px;
    border: 1px solid #e8ecf0;
    .product-item {
      padding: 0 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      background-color: #fff;
      border: 1px solid #e8ecf0;
      border-radius: 6px;
      .product-item-name {
        padding: 10px 0;
      }
    }
  }
}
.business-calendar-settings ::v-deep .el-form-item {
  margin-bottom: 5px !important;
}
.business-item {
  padding: 0 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  border: 1px solid #e8ecf0;
  border-radius: 6px;
}
.tree-page {
  height: 500px;
  padding: 10px 20px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;

  .tree {
    height: 100%;
    overflow: hidden auto;
  }
}
</style>
