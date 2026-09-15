<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="sendEDOBtnShow" @click="handleSendEDO"
        >{{ $t('menu.sendEDO') }}
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
      <div v-if="form.salesQuotationType === 'MixDesign'" key="info111">
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
                    <el-form-item :label="`${$t('SALES.salesOrderNo')}`">
                      <el-input
                        v-model="form.salesOrderNo"
                        :title="form.salesOrderNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerName')}`">
                      <el-input v-model="form.businessPartnerName" disabled></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.deliveryOrderNo')}`">
                      <el-input v-model="form.deliveryOrderNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesOrderType')}`">
                      <el-input
                        :value="form.salesQuotationTypeShowStr"
                        :title="form.salesQuotationTypeShowStr"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('menu.stockCertificate')}`">
                      <el-input
                        v-model="form.stockCertificateNo"
                        :title="form.stockCertificateNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(dict.type.delivery_order_status, form.deliveryOrderStatus)
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesPerson')}`">
                      <el-input
                        v-model="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        disabled
                      ></el-input>
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
                :title="$t('SALES.projectInfo')"
                :warning="collapseWarningForShippingInfo"
              >
                <span
                  v-if="form.receiveAddress"
                  class="info-item mr20"
                  :title="form.receiveAddress"
                >
                  {{ $t('SALES.deliveryAddress') }} : {{ form.receiveAddress }}
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
                    <el-form-item :label="`${$t('SALES.projectName')}`">
                      <el-input
                        :value="form.projectName"
                        :title="form.projectName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.projectContactPersonName')}`">
                      <el-input
                        :value="form.projectContactPersonName"
                        :title="form.projectContactPersonName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.projectContactPersonNo')}`">
                      <div
                        @mouseenter="showPop($event, form, 'projectContactPersonNo')"
                        @mouseleave="hidePop($event, form)"
                      >
                        <el-input :value="form.projectContactPersonNo" disabled></el-input>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.zone')}`">
                      <el-input :value="form.zoneName" :title="form.zoneName" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('SALES.deliveryAddress')}`">
                      <el-input
                        :value="form.receiveAddress"
                        :title="form.receiveAddress"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" v-if="form.deliveryOrderShipping">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.deliveryInformation')"
                :warning="collapseWarningForShippingInfo"
              >
                <span
                  v-if="form.deliveryOrderShipping.driverName"
                  class="info-item mr20"
                  :title="form.deliveryOrderShipping.driverName"
                >
                  {{ $t('SALES.driver') }} : {{ form.deliveryOrderShipping.driverName }}
                </span>
                <span class="info-item">
                  {{ $t('SALES.deliveryDate') }} :
                  {{ parseTime(form.deliveryOrderShipping.deliveryDate, fmtForYmdhms) }}
                </span>
              </FormCollapseItemTitle>
              <el-form
                ref="form6"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
                :disabled="true"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.driver')}`">
                      <el-input
                        :value="form.deliveryOrderShipping.driverName"
                        :title="form.deliveryOrderShipping.driverName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.vehicle')}`">
                      <el-input
                        :value="form.deliveryOrderShipping.licensePlateNo"
                        :title="form.deliveryOrderShipping.licensePlateNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.deliveryDate')}`">
                      <el-date-picker
                        :value="form.deliveryOrderShipping.deliveryDate"
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
              </el-form>
            </el-collapse-item>
          </div>

          <div
            class="form-card mt10"
            v-show="form.deliveryOrderAcknowledge && form.deliveryOrderAcknowledge.acknowledgedBy"
          >
            <el-collapse-item name="4">
              <FormCollapseItemTitle slot="title" :title="$t('SALES.acknowledgeInfo')">
                <span class="info-item mr20" :title="form.deliveryOrderAcknowledge.acknowledgedBy">
                  {{ $t('SALES.acknowledgedBy') }} :
                  {{ form.deliveryOrderAcknowledge.acknowledgedBy }}
                </span>
              </FormCollapseItemTitle>
              <el-form ref="form3" :model="form" @submit.native.prevent label-width="180px">
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.acknowledgedBy')}`">
                      <el-input
                        :value="form.deliveryOrderAcknowledge.acknowledgedBy"
                        :title="form.deliveryOrderAcknowledge.acknowledgedBy"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.recipientsMobileNo')}`">
                      <div
                        @mouseenter="
                          showPop($event, form.deliveryOrderAcknowledge, 'recipientsMobileNo')
                        "
                        @mouseleave="hidePop($event, form)"
                      >
                        <el-input
                          :value="form.deliveryOrderAcknowledge.acknowledgedMobileNo"
                          disabled
                        ></el-input>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.contactPersonEmail')}`">
                      <div>
                        <el-input :value="form.poEmail" :title="form.poEmail" disabled></el-input>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.remarks')}`">
                      <MyInput
                        type="textarea"
                        :value="form.deliveryOrderAcknowledge.acknowledgedRemarks"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        disabled
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}`">
                      <myUpload ref="uploadRefACK" :disabled="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col
                    :span="12"
                    v-if="
                      form.deliveryOrderAcknowledge &&
                      form.deliveryOrderAcknowledge.commonFileListForSign &&
                      form.deliveryOrderAcknowledge.commonFileListForSign.length > 0
                    "
                  >
                    <el-form-item
                      :label="
                        form.deliveryOrderAcknowledge.commonFileListForSign[1]
                          ? $t('SALES.signature1')
                          : $t('SALES.signature')
                      "
                    >
                      <div class="sign_card">
                        <!-- <img
                          :src="form.deliveryOrderAcknowledge.commonFileListForSign[0].url"
                          alt=""
                          style="width: 300px; height: 130px; border: 1px solid #dedede"
                        /> -->
                        <el-image
                          style="width: 300px; height: 130px; border: 1px solid #dedede"
                          :src="form.deliveryOrderAcknowledge.commonFileListForSign[0].url"
                          :preview-src-list="[
                            form.deliveryOrderAcknowledge.commonFileListForSign[0].url
                          ]"
                        ></el-image>
                      </div>
                      <img src="" alt="" />
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="12"
                    v-if="
                      form.deliveryOrderAcknowledge &&
                      form.deliveryOrderAcknowledge.commonFileListForSign &&
                      form.deliveryOrderAcknowledge.commonFileListForSign.length > 1
                    "
                  >
                    <el-form-item :label="$t('SALES.signature2')">
                      <div class="sign_card">
                        <!-- <img
                          :src="form.deliveryOrderAcknowledge.commonFileListForSign[0].url"
                          alt=""
                          style="width: 300px; height: 130px; border: 1px solid #dedede"
                        /> -->
                        <el-image
                          style="width: 300px; height: 130px; border: 1px solid #dedede"
                          :src="form.deliveryOrderAcknowledge.commonFileListForSign[1].url"
                          :preview-src-list="[
                            form.deliveryOrderAcknowledge.commonFileListForSign[1].url
                          ]"
                        ></el-image>
                      </div>
                      <img src="" alt="" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="5">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :salesQuotationType="form.salesQuotationType"
                  :countryId="form.countryId"
                  :businessPartnerId="form.businessPartnerId"
                  :currencyId="form.currencyId"
                  :comDisFrom="comDisFrom"
                  :basicUpdateProps="basicUpdateProps"
                  @returnSubmitSuccess="back"
                />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10" v-if="form.deliveryOrderId">
            <el-collapse-item name="6">
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
      <div v-else key="info222">
        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="1">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.basicInfo')"
                :warning="collapseWarningForBasicInfo"
              >
                <span v-if="form.storekeeperBy" class="info-item mr20" :title="form.storekeeperBy">
                  {{ $t('SALES.storekeeper') }} : {{ form.storekeeperBy }}
                </span>
                <span
                  v-if="form.shipWarehouseName"
                  class="info-item mr20"
                  :title="form.shipWarehouseName"
                >
                  {{ $t('SALES.deliveryWarehouse') }} : {{ form.shipWarehouseName }}
                </span>
                <span class="info-item" v-if="form.deliveryOrderStatus">
                  {{ $t('ui.status') }} :
                  {{ selectDictLabel(dict.type.delivery_order_status, form.deliveryOrderStatus) }}
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
                    <el-form-item :label="`${$t('SALES.salesOrderNo')}`">
                      <el-input
                        v-model="form.salesOrderNo"
                        :title="form.salesOrderNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <!-- <el-form-item :label="`${$t('SALES.preDeliveryNoticeNo')}`">
                      <el-input v-model="form.preDeliveryNoticeNo" disabled></el-input>
                    </el-form-item> -->
                    <el-form-item :label="`${$t('SALES.deliveryNoticeNo')}`">
                      <el-input v-model="form.deliveryNoticeNo" disabled></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.deliveryOrderNo')}`">
                      <el-input v-model="form.deliveryOrderNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesOrderType')}`">
                      <el-input
                        :value="form.salesQuotationTypeShowStr"
                        :title="form.salesQuotationTypeShowStr"
                        disabled
                      ></el-input>
                      <!-- :value="
                          selectDictLabel(dict.type.sales_quotation_type, form.salesQuotationType)
                        " -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('menu.stockCertificate')}`">
                      <el-input
                        v-model="form.stockCertificateNo"
                        :title="form.stockCertificateNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(dict.type.delivery_order_status, form.deliveryOrderStatus)
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesPerson')}`">
                      <el-input
                        v-model="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.storekeeper')}`">
                      <el-input
                        v-model="form.storekeeperBy"
                        :title="form.storekeeperBy"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.deliveryWarehouse')}`">
                      <el-input
                        v-model="form.shipWarehouseName"
                        :title="form.shipWarehouseName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="false">
                  <el-col :span="24">
                    <el-form-item :label="`${$t('SALES.logisticsType')}`">
                      <el-radio-group
                        v-model="form.logisticsType"
                        :disabled="!!form.deliveryOrderId"
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
                          required: true,
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

          <div class="form-card mt10" v-if="form.deliveryOrderShipping">
            <el-collapse-item name="6">
              <FormCollapseItemTitle slot="title" :title="$t('SALES.deliveryInformation')">
                <template
                  v-if="form.deliveryOrderShipping && form.deliveryOrderShipping.shippingAgent"
                >
                  <span class="info-item mr20" :title="form.deliveryOrderShipping.shippingAgent">
                    {{ $t('SALES.shippingAgent') }} : {{ form.deliveryOrderShipping.shippingAgent }}
                  </span>
                  <span class="info-item mr20" :title="form.deliveryOrderShipping.shippingNo">
                    {{ $t('SALES.shippingNo') }} :
                    {{ form.deliveryOrderShipping.shippingNo }}
                  </span>
                  <span class="info-item">
                    {{ $t('SALES.deliveryDate') }} :
                    {{ parseTime(form.deliveryOrderShipping.deliveryDate, fmtForYmdhms) }}
                  </span>
                </template>
                <template v-else>
                  <span class="info-item mr20" :title="form.deliveryOrderShipping.driverName">
                    {{ $t('SALES.driver') }} : {{ form.deliveryOrderShipping.driverName }}
                  </span>
                  <span class="info-item mr20">
                    {{ $t('SALES.vehicle') }} :
                    {{ form.deliveryOrderShipping.licensePlateNo }}
                  </span>
                  <span class="info-item">
                    {{ $t('SALES.deliveryDate') }} :
                    {{ parseTime(form.deliveryOrderShipping.deliveryDate, fmtForYmdhms) }}
                  </span>
                </template>
              </FormCollapseItemTitle>
              <el-form ref="form6" :model="form" @submit.native.prevent label-width="180px">
                <template v-if="form.deliveryOrderShipping.shippingAgent">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.shippingAgent')}`">
                        <el-input
                          :value="form.deliveryOrderShipping.shippingAgent"
                          :title="form.deliveryOrderShipping.shippingAgent"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.shippingNo')}`">
                        <el-input
                          :value="form.deliveryOrderShipping.shippingNo"
                          :title="form.deliveryOrderShipping.shippingNo"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.deliveryDate')}`">
                        <el-date-picker
                          :value="form.deliveryOrderShipping.deliveryDate"
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
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="`${$t('ui.remarks')}`">
                        <MyInput
                          type="textarea"
                          :value="form.deliveryOrderShipping.remarks"
                          :autosize="{ minRows: 1, maxRows: 4 }"
                          resize="none"
                          show-word-limit
                          disabled
                        ></MyInput>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="`${$t('ui.attachment')}`">
                        <myUpload ref="uploadRef6" :disabled="true" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
                <template v-else>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.driver')}`">
                        <el-input
                          :value="form.deliveryOrderShipping.driverName"
                          :title="form.deliveryOrderShipping.driverName"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.vehicle')}`">
                        <el-input
                          :value="form.deliveryOrderShipping.licensePlateNo"
                          :title="form.deliveryOrderShipping.licensePlateNo"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.deliveryDate')}`">
                        <el-date-picker
                          :value="form.deliveryOrderShipping.deliveryDate"
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

          <div
            class="form-card mt10"
            v-show="form.deliveryOrderAcknowledge && form.deliveryOrderAcknowledge.acknowledgedBy"
          >
            <el-collapse-item name="3">
              <FormCollapseItemTitle slot="title" :title="$t('SALES.acknowledgeInfo')">
                <span class="info-item mr20" :title="form.deliveryOrderAcknowledge.acknowledgedBy">
                  {{ $t('ui.acknowledgedBy') }} : {{ form.deliveryOrderAcknowledge.acknowledgedBy }}
                </span>
                <span class="info-item">
                  {{ $t('ui.dateAcknowledged') }} :
                  {{ parseTime(form.deliveryOrderAcknowledge.acknowledgedTime) }}
                </span>
              </FormCollapseItemTitle>
              <el-form ref="form3" :model="form" @submit.native.prevent label-width="180px">
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.acknowledgedBy')}`">
                      <el-input
                        :value="form.deliveryOrderAcknowledge.acknowledgedBy"
                        :title="form.deliveryOrderAcknowledge.acknowledgedBy"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.dateAcknowledged')}`">
                      <el-date-picker
                        :value="form.deliveryOrderAcknowledge.acknowledgedTime"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                        disabled
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.remarks')}`">
                      <MyInput
                        type="textarea"
                        :value="form.deliveryOrderAcknowledge.acknowledgedRemarks"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        disabled
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}`">
                      <myUpload ref="uploadRefACK" :disabled="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col
                    :span="24"
                    v-if="
                      form.deliveryOrderAcknowledge &&
                      form.deliveryOrderAcknowledge.commonFileListForSign &&
                      form.deliveryOrderAcknowledge.commonFileListForSign.length > 0
                    "
                  >
                    <el-form-item :label="$t('SALES.signature')">
                      <div class="sign_card">
                        <!-- <img
                          :src="form.deliveryOrderAcknowledge.commonFileListForSign[0].url"
                          alt=""
                          style="width: 300px; height: 130px; border: 1px solid #dedede"
                        /> -->
                        <el-image
                          style="width: 300px; height: 130px; border: 1px solid #dedede"
                          :src="form.deliveryOrderAcknowledge.commonFileListForSign[0].url"
                          :preview-src-list="[
                            form.deliveryOrderAcknowledge.commonFileListForSign[0].url
                          ]"
                        ></el-image>
                      </div>
                      <img src="" alt="" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :salesQuotationType="form.salesQuotationType"
                  :countryId="form.countryId"
                  :businessPartnerId="form.businessPartnerId"
                  :currencyId="form.currencyId"
                  :comDisFrom="comDisFrom"
                  :basicUpdateProps="basicUpdateProps"
                  @returnSubmitSuccess="back"
                />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10" v-if="form.deliveryOrderId">
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

      <popover-svc
        ref="pop1"
        trigger="hover"
        placement="top"
        :close-delay="0"
        :visible-arrow="true"
        popper-class="pop-warp"
        :offset="-30"
      >
        <div @mouseenter="mouseenterCur($event)" class="pop-box">
          <el-table :data="popoverData.purchaseRequisiteList || []" border>
            <el-table-column
              :label="popoverData.columnLabel1"
              :key="popoverData.columnLabel1"
              width="200"
              align="center"
              prop="column1"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.column1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="popoverData.columnLabel2"
              :key="popoverData.columnLabel2"
              width="220"
              align="center"
              prop="column2"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.column2 }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </popover-svc>
    </template>
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import { getToken } from '@/utils/auth'
import { queryDeliveryOrderById, sendEDo } from '@/api/salesManagement/deliveryOrder'

import ProductInfo from './productInfo/productInfo.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import { Popover } from 'element-ui'
const popoverSvc = {
  extends: Popover,
  methods: {
    popBy(el) {
      // 先隐藏并销毁之前显示的
      this.close()
      this.doDestroy(true)
      this.$nextTick(() => {
        // 显示新的
        this.referenceElm = this.$refs.reference = el
        this.showPopper = true
        this.$emit('input', true)
      })
    },
    close() {
      this.showPopper = false
      this.$emit('input', false)
    }
  }
}
export default {
  mixins: [pageMixin],
  dicts: ['sales_quotation_type', 'delivery_order_status', 'logistics_type'],
  components: {
    ProductInfo,
    SystemOperationLogTable,
    popoverSvc
  },
  data() {
    return {
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {
        deliveryOrderProductList: [],
        salesOrderProjectList: [],
        salesOrderServiceList: [],
        projectCostDetailList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForPODetail: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        salesOrderNo: [
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

      popoverData: {},

      /* 版本比对高亮 */
      basicUpdateProps: [],
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
    sendEDOBtnShow() {
      if (this.isView) {
        return false
      }
      if (!this.checkPermi(['salesManagement:deliveryOrder:sendEDO'])) {
        return false
      }
      let show = false
      if (this.form.deliveryOrderId && this.buttonAuthMsg.isCanSendEDo === '1') {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (!this.checkPermi(['salesManagement:deliveryOrder:printPDF'])) {
        return false
      }
      return true
    },
    exportPDFShow() {
      if (!this.checkPermi(['salesManagement:deliveryOrder:exportPDF'])) {
        return false
      }
      return true
    },
    comDisFrom() {
      return true
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    showPop(e, obj, type) {
      let reqList = []
      if (type === 'recipientsMobileNo') {
        this.$set(this.popoverData, 'columnLabel1', this.$t('SALES.acknowledgedBy'))
        this.$set(this.popoverData, 'columnLabel2', this.$t('SALES.recipientsMobileNo'))
        const list = obj.alreadyCustomerAckList || []
        reqList = list.map((item) => {
          return {
            column1: item.acknowledgedBy,
            column2: item.mobileNo
          }
        })
      } else {
        this.$set(this.popoverData, 'columnLabel1', this.$t('SALES.contactPerson'))
        this.$set(this.popoverData, 'columnLabel2', this.$t('SALES.contactPersonNo'))
        const list = obj.projectContactPersonList || []
        reqList = list.map((item) => {
          return {
            column1: item.contactPersonName,
            column2: item.mobileNo
          }
        })
      }
      if (reqList.length <= 0) return
      this.$set(this.popoverData, 'purchaseRequisiteList', reqList)

      this.$set(this.popoverData, 'hide', false)
      this.$refs.pop1.popBy(e.target)
    },
    hidePop(e, obj) {
      if (this.popoverData) {
        this.popoverData.hide = true
      }
      setTimeout(() => {
        this.popoverData.hide && this.$refs.pop1.close()
      }, 300)
    },
    mouseenterCur() {
      if (this.popoverData) {
        this.popoverData.hide = false
      }
    },

    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      queryDeliveryOrderById({ deliveryOrderId: rowId }).then((res) => {
        const data = res.data || {}
        data.deliveryOrderProductList = data.deliveryOrderProductList || []

        const addressForWarehouse = data.warehouse || {}
        const warehouseAddress = addressForWarehouse.warehouseAddress || {}
        data.addressForWarehouse = { ...addressForWarehouse, ...warehouseAddress }
        const deliveryOrderAcknowledge = data.deliveryOrderAcknowledge || {}
        data.deliveryOrderAcknowledge = deliveryOrderAcknowledge
        const commonFileListForAcknowledged =
          deliveryOrderAcknowledge.commonFileListForAcknowledged || []
        setTimeout(() => {
          this.$refs.uploadRefACK &&
            this.$refs.uploadRefACK.initFileList(commonFileListForAcknowledged)
          const { deliveryOrderShipping } = data
          this.$refs.uploadRef6 &&
            this.$refs.uploadRef6.initFileList(deliveryOrderShipping.commonFileList || [])
        }, 300)
        data.projectContactPersonList = data.projectContactPersonList || []
        data.projectContactPersonName = data.projectContactPersonList
          .map((item) => item.contactPersonName)
          .join(', ')
        data.projectContactPersonNo = data.projectContactPersonList
          .map((item) => item.mobileNo)
          .join(', ')
        this.form = data

        this.buttonAuthMsg = data.buttonAuthMsg || {}
      })
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    reset() {
      this.form = {
        /* 基础信息 */
        salesQuotationType: undefined,
        salesOrderNo: undefined,
        businessPartnerName: undefined,
        deliveryOrderStatus: undefined,
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
        isUrgent: '0',
        logisticsType: '1',
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
        deliveryOrderProductList: [],
        salesOrderProjectList: [],
        salesOrderServiceList: [],
        projectCostDetailList: [],
        deliveryOrderAcknowledge: {},
        deliveryOrderShipping: {}
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForPODetail = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4', '5', '6']

      this.basicUpdateProps = []
      this.bpHistoryVersionList = []

      setTimeout(() => {
        this.$refs.uploadRefACK && this.$refs.uploadRefACK.initFileList([])
        this.$refs.uploadRef6 && this.$refs.uploadRef6.initFileList([])
      }, 300)
      this.resetForm('form1')
      this.resetForm('form2')
    },

    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form2.validateField(code)
    },
    // 清空供应商
    salesOrderNoClear() {},

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

    openPurchasePersonTable() {
      this.$refs.selectPurchasePersonTable.handleOpen()
    },
    purchasePersonClear() {
      this.$set(this.form, 'salesPersonBy', undefined)
      this.$set(this.form, 'salesPersonId', undefined)
    },

    /* 客户采购信息 */
    poContactPersonChange(row) {
      this.$set(this.form, 'poBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'poContactPersonId', row.contactPersonId)
      this.$set(this.form, 'poContactPersonName', row.contactPersonName)
      this.$set(this.form, 'poMobileNum', row.mobileNum)
      this.$set(this.form, 'poMobileCode', row.mobileCode)
      this.$set(this.form, 'poMobilePhone', row.mobilePhone)
      this.$set(this.form, 'poEmail', row.email)
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
    updatePort(row) {
      const { portName, portId } = row
      this.$set(this.form, 'receiveAddressForPort', row)
      this.$set(this.form, 'receiveAddressName', portName)
      this.$set(this.form, 'receiveAddressId', portId)
    },
    updateAddress(row) {
      this.$set(this.form, 'addressForBPAddress', row)
      this.$set(this.form, 'receiveAddressName', row.label)
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

    handleSendEDO() {
      const vm = this
      const confirm = vm.$t('SALES.sendEDOConfirm')
      this.$modal.confirm(confirm).then(() => {
        sendEDo({
          deliveryOrderId: vm.form.deliveryOrderId
        }).then((res) => {
          if (res.code === 200) {
            vm.$message.success(vm.$t('SALES.sendEDOSuccess'))
            this.back()
          }
        })
      })
    },

    handleExportPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/sales/deliveryOrder/download' +
        `/${this.form.deliveryOrderId}` +
        '?token=' +
        `${token}`
      window.location = myUrl
    },
    handlePrintPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/sales/deliveryOrder/preview' +
        `/${this.form.deliveryOrderId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
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
