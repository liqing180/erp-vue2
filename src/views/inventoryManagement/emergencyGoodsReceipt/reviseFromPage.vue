<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
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
                <span
                  v-if="form.departmentName"
                  class="info-item mr20"
                  :title="form.departmentName"
                >
                  {{ $t('ui.dept') }} : {{ form.departmentName }}
                </span>
                <span v-if="form.warehouseName" class="info-item mr20" :title="form.warehouseName">
                  {{ $t('PURCHASE.deliveryAddress') }} : {{ form.warehouseName }}
                </span>
                <span class="info-item" v-if="form.emergencyGoodsStatus">
                  {{ $t('ui.status') }} :
                  {{
                    selectDictLabel(dict.type.i_emergency_goods_status, form.emergencyGoodsStatus)
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
                    <el-form-item :label="`${$t('ui.supplier')}`" prop="businessPartnerName">
                      <SelectInput
                        :value="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.i_emergency_goods_status,
                            form.emergencyGoodsStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.emergencyGoodsReceiptNo')}`">
                      <el-input v-model="form.emergencyGoodsReceiptNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.dept')}`" prop="departmentId">
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
                    <el-form-item :label="`${$t('PURCHASE.requiredBy')}`" prop="requiredBy">
                      <!-- <SelectInput
                        :value="form.requiredBy"
                        :title="form.requiredBy"
                        @clear="requiredByClear"
                        clearable
                        @click="openRequiredByTable"
                        :disabled="!form.departmentId"
                        class="form-wd"
                      /> -->

                      <CommonSelectAndList
                        :id="form.requiredId"
                        :label="form.requiredBy"
                        idKey="userId"
                        labelKey="nickName"
                        clearable
                        filterable
                        :options="requiredList"
                        :loading="requiredListLoading"
                        :disabled="!form.departmentId || comDisFrom"
                        @change="updateRequiredBy"
                        @handleOpen="openRequiredByTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`" prop="currencyId">
                      <CommonSelect
                        :disabled="!form.businessPartnerId"
                        :id="form.currencyCode"
                        :label="form.currency"
                        :title="form.currency"
                        idKey="currencyCode"
                        labelKey="currency"
                        filterable
                        :options="currencyOptions || []"
                        :loading="currencyOptionsLoading"
                        @change="currencyChange"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryOrderNo1')}`"
                      prop="deliveryOrderNo"
                    >
                      <el-input v-model="form.deliveryOrderNo" maxlength="50"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.projectCode')}`"
                      prop="costProjectCode"
                      :rules="[
                        {
                          required: projectCodeIsReq,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <!-- <SelectInput
                        :value="form.costProjectCode"
                        :title="form.costProjectCode"
                        @clear="costProjectNameClear"
                        clearable
                        @click="openCostProjectNameTable"
                        class="form-wd"
                      /> -->

                      <CommonSelectAndList
                        :id="form.costProjectId"
                        :label="form.costProjectCode"
                        idKey="costProjectId"
                        labelKey="costProjectCode"
                        filterable
                        :options="costProjectList"
                        :loading="costProjectListLoading"
                        :disabled="comDisFrom"
                        @change="updateCostProjectName"
                        @handleOpen="openCostProjectNameTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.receivedDate')}`" prop="receivedDate">
                      <el-date-picker
                        v-model="form.receivedDate"
                        :picker-options="receivedDatePickerOptions"
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
                    <el-form-item :label="`${$t('PURCHASE.dropShipping')}`">
                      <el-switch
                        v-model="form.dropShipping"
                        active-value="1"
                        inactive-value="0"
                        disabled
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress')}`"
                      prop="receiveAddressName"
                      v-if="form.dropShipping === '1'"
                    >
                      <el-input
                        v-model="form.receiveAddressName"
                        :title="form.receiveAddressName"
                        maxlength="200"
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress')}`"
                      prop="warehouseName"
                      key="deliveryAddress2"
                      v-else
                    >
                      <SelectInput
                        :value="form.warehouseName"
                        :title="form.warehouseName"
                        @clear="warehouseNameClear"
                        clearable
                        @click="openWarehouseTable"
                        :disabled="true"
                        class="form-wd"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row v-if="form.dropShipping === '1'">
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.consignee')}`"
                      prop="contactPersonName"
                      :rules="[
                        {
                          required: legalEntityInfo.countryId !== form.countryId,
                          // eslint-disable-next-line
                          pattern: new RegExp(/^(?!(\s+$))/g),
                          message: $t('ui.reqMsg'),
                          trigger: ['blur', 'change']
                        }
                      ]"
                    >
                      <el-input
                        v-model="form.contactPersonName"
                        maxlength="200"
                        style="width: 100%"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.requestedEmail')}`" prop="email">
                      <el-input
                        v-model.trim="form.email"
                        :title="form.email"
                        maxlength="500"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.requestedMobilePhone')}`"
                      ref="mobileNoRef"
                    >
                      <MobilePhoneInput
                        :mobileCode.sync="form.mobileCode"
                        :mobileNum.sync="form.mobileNum"
                        :mobileNo.sync="form.mobilePhone"
                        @clearValidate="$refs.mobileNoRef.clearValidate()"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row v-if="isSystemDocking === '1'">
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.zone')}`">
                      <el-input v-model="form.zoneName" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.reason')">
                      <MyInput
                        type="textarea"
                        v-model="form.reason"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="200"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}(DO)`">
                      <myUpload ref="uploadDORef" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}`">
                      <myUpload ref="uploadRef" :disabled="true" />
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
                :title="$t('PURCHASE.goodsReceiptDetails')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5" v-if="!comDisFrom">
                    <el-button
                      :disabled="
                        !form.businessPartnerId || (!form.warehouseId && form.dropShipping !== '1')
                      "
                      @click="handleAddBtn"
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      >{{ $t('uiBtn.add') }}</el-button
                    >
                  </el-col>
                  <el-col :span="1.5" v-if="!comDisFrom && addCustomProductAuth">
                    <el-button
                      :disabled="!form.warehouseId && form.dropShipping !== '1'"
                      @click="handleAddCustomProduct"
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      >{{ $t('menu.addCustomProduct') }}</el-button
                    >
                  </el-col>
                  <right-toolbar
                    :showSearchBtn="false"
                    :showRefreshBtn="false"
                    :saveKey="saveKey"
                    :savePath="savePath"
                    :columns="configColumn"
                    :columnsInit="columns"
                  ></right-toolbar>

                  <search-form
                    ref="searchForm"
                    v-model="queryParams"
                    :searchData="searchData"
                    :handleQuery="handleSearchForm"
                    :resetQuery="resetSearchForm"
                    :showCustom="false"
                    :topShowCount="1"
                    :isProductCustomSearch="true"
                  />
                </el-row>
                <el-table
                  border
                  ref="tables"
                  :row-class-name="tableRowClassName"
                  :cell-class-name="tableCellClassName"
                  :data="tableList"
                  @sort-change="handleSortChange"
                  :row-key="rowIdKey"
                  :indent="2"
                  :tree-props="{ children: 'serviceSurchargeList', hasChildren: 'hasChildren' }"
                  default-expand-all
                  v-table-tab
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
                      <!-- <span>{{ scope.$index + 1 }}</span> -->
                      <span>{{ scope.row.snNum }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="item in getVisibleColumn(visibleColumn)"
                    :key="item.prop + item.colSortIndex"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :min-width="getMinWidth(item)"
                    :show-overflow-tooltip="item.tooltip"
                    :fixed="item.fixed"
                    :sortable="item.sortable"
                    :align="item.align || 'left'"
                    header-align="center"
                  >
                    <template slot="header" slot-scope="{ column }">
                      <span v-if="['productName', 'uom', 'receivedQty'].includes(item.prop)">
                        <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                      </span>
                      <span v-else>{{ column.label }}</span>
                    </template>
                    <template slot-scope="scope">
                      <template v-if="item.prop === 'productName'">
                        <span v-if="scope.row.isExpenseItem === '1'">{{
                          scope.row.expenseItemName
                        }}</span>
                        <span v-else>{{ scope.row[item.prop] }}</span>
                      </template>

                      <template
                        v-else-if="
                          item.prop === 'internalPartNo' && scope.row.isCustomProduct !== '1'
                        "
                      >
                        <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
                          scope.row.internalPartNo
                        }}</span>
                      </template>

                      <template v-else-if="item.prop === 'alias'">
                        <el-input
                          v-if="!comDisFrom && scope.row.isCustomProduct === '1'"
                          style="width: 98%"
                          :title="scope.row.alias"
                          v-model="scope.row.alias"
                          :maxlength="200"
                        />
                        <template v-else>{{ scope.row[item.prop] }}</template>
                      </template>
                      <template v-else-if="item.prop === 'description'">
                        <descriptionEditDlg
                          v-if="!comDisFrom"
                          v-model="scope.row.description"
                          :maxlength="7000"
                        />
                        <template v-else>
                          <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
                        </template>
                      </template>
                      <template v-else-if="item.prop === 'partNo'">
                        <el-input
                          v-if="!comDisFrom && scope.row.isCustomProduct === '1'"
                          style="width: 98%"
                          :title="scope.row.partNo"
                          v-model="scope.row.partNo"
                          :maxlength="200"
                        />
                        <template v-else>{{ scope.row[item.prop] }}</template>
                      </template>
                      <template v-else-if="item.prop === 'uom'">
                        <span
                          v-if="scope.row.isExpenseItem === '1'"
                          :title="showUomLabel(scope.row.unit)"
                          >{{ scope.row.unit }}</span
                        >
                        <span :title="showUomLabel(scope.row.uom)" v-else>
                          {{ scope.row.uom }}
                        </span>
                      </template>
                      <template v-else-if="item.prop === 'receivedQty'">
                        <span v-if="scope.row.isExpenseItem === '1'">{{ scope.row.qty }}</span>
                        <span v-else>{{
                          $numberStr(scope.row[item.prop], scope.row.decimalNum)
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'unitPrice'">
                        <el-input-number
                          v-if="!comDisFrom"
                          v-thousandSplit="{ precision: 6, minPrecision: 2, keepDec: false }"
                          :precision="6"
                          :min-precision="2"
                          style="width: 98%"
                          v-model="scope.row.unitPrice"
                          controls-position="right"
                          :min="0"
                          :max="99999999.99"
                          @change="unitPriceChange(scope.row)"
                        />
                        <template v-else>{{
                          $numberStr(scope.row[item.prop], 6, false, 2)
                        }}</template>
                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                      </template>

                      <template v-else-if="item.prop === 'remarks'">
                        <descriptionEditDlg
                          v-model="scope.row.remarks"
                          :maxlength="200"
                          :disabled="comDisFrom"
                        />
                      </template>
                      <template v-else-if="item.prop === 'productType'">
                        <span>{{
                          selectDictLabel(dict.type.product_type, scope.row.productType)
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'lineTotal'">
                        <template>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</template>
                      </template>

                      <template v-else>{{ scope.row[item.prop] }}</template>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('ui.action')"
                    key="action"
                    align="center"
                    min-width="120"
                    class-name="small-padding fixed-width"
                    fixed="right"
                    v-if="!comDisFrom"
                  >
                    <template slot-scope="scope">
                      <div class="flexCen">
                        <i
                          class="el-icon el-icon-delete pointer"
                          style="font-size: 20px; color: #f56c6c"
                          :title="$t('uiBtn.delete')"
                          @click="handleDelRow(scope.$index, scope.row)"
                        ></i>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="3">
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
    <selectRequiredByTable ref="selectRequiredByTable" @update="updateRequiredBy" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
    <selectProductTable
      ref="selectProductTable"
      :warehouseId="form.warehouseId"
      :businessPartnerId="form.businessPartnerId"
      :costProjectId="form.costProjectId"
      :dropShipping="form.dropShipping"
      @onSuccess="updateTable"
    />
    <selectCostProjectTable
      ref="selectCostProjectTable"
      :departmentId="form.departmentId"
      @update="updateCostProjectName"
    />
  </FormPageLayout>
</template>

<script>
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryUserDepartment } from '@/api/system/user'
import {
  revisePurchaseRequisite,
  queryEmergencyGoodsReceiptById
} from '@/api/inventoryManagement/emergencyGoodsReceipt'
import { queryUsers } from '@/api/organization/corporate'
import { queryCanSelectCostProjectListForPage } from '@/api/projectManagement/project'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import selectRequiredByTable from './components/selectRequiredByTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import selectProductTable from './components/selectProductTable'
import selectCostProjectTable from './components/selectCostProjectTable.vue'

import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  dicts: [
    'pr_reason_type',
    'p_required_type',
    'i_emergency_goods_status',
    'product_type',
    'business_contact_person_title'
  ],
  mixins: [pageMixin],
  components: {
    selectRequiredByTable,
    selectWarehouseTable,
    selectProductTable,
    SystemOperationLogTable,
    selectCostProjectTable
  },
  data() {
    const vm = this
    const validatorPhoneNo = (rule, value, callback) => {
      if (!vm.form.mobileCode || !vm.form.mobileNum) {
        callback(vm.$t('ui.reqMsg').replace('$1', vm.$t('ui.mobilePhone')))
      } else {
        callback()
      }
    }

    return {
      costProjectList: [],
      costProjectListLoading: false,
      requiredList: [],
      requiredListLoading: false,
      submitLoading: false,
      saveKey: '10',
      savePath: 'EGRTable',
      activeNames: ['1', '2', '3'],
      rowId: '',
      timeId: '',
      form: {},
      collapseWarningForBasicInfo: false,
      rules: {
        departmentId: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['change']
          }
        ],
        requiredBy: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PURCHASE.requiredBy')),
            trigger: ['change']
          }
        ],
        costProjectCode: [
          {
            required: false,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PURCHASE.requiredBy')),
            trigger: ['change']
          }
        ],
        warehouseName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PURCHASE.deliveryAddress')),
            trigger: ['change']
          }
        ],
        receiveAddressName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PURCHASE.deliveryAddress')),
            trigger: ['change']
          }
        ],
        // contactPersonName: [
        //   {
        //     required: true,
        //     // eslint-disable-next-line
        //     pattern: new RegExp(/^(?!(\s+$))/g),
        //     message: this.$t('ui.reqMsg'),
        //     trigger: ['blur', 'change']
        //   }
        // ],
        email: [
          {
            required: false,
            trigger: ['blur', 'change'],
            message: this.$t('ui.reqMsg')
          },
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ],
        mobilePhone: [{ required: true, validator: validatorPhoneNo, trigger: 'change' }],

        requestedEmail: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: this.$t('ui.reqMsg')
          },
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ],
        requestedMobilePhone: [{ required: true, validator: validatorPhoneNo, trigger: 'change' }],
        reasonType: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        reason: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      deptOptions: [],
      deptOptionsLoading: false,
      currencyOptions: [],
      currencyOptionsLoading: false,
      zoneList: [],
      /* 表格部分 */
      columns: [
        /* {
          prop: 'productType',
          label: vm.$t('PURCHASE.productClass'),
          visible: true,
          width: 150,
          tooltip: true,
          fixed: true,
          sortable: 'custom'
        }, */
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          fixedWidth: 180,
          tooltip: true,
          fixed: true,
          sortable: 'custom'
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },

        {
          prop: 'alias',
          label: vm.$t('PURCHASE.alias'),
          visible: true,
          minWidth: 200,
          colMinWidth: 120,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          colMinWidth: 120,
          tooltip: false,
          sortable: 'custom'
        },
        {
          prop: 'uom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 140,
          colMinWidth: 120,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'receivedQty',
          label: vm.$t('PURCHASE.receiveQty'),
          visible: true,
          minWidth: 180,
          colMinWidth: 120,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 180,
          colMinWidth: 140,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('PURCHASE.lineTotal'),
          visible: true,
          minWidth: 180,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          fixedWidth: 200,
          tooltip: false,
          sortable: 'custom'
        }
      ],
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 90 * 24 * 60 * 60 * 1000
        }
      },
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'rowTimeId',
      collapseWarningForProductInfo: false,
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.productSearch1')}`,
          type: 'InputEle'
        }
      ],
      // 查询参数
      queryParams: {
        condition: undefined
      },
      createTableList: [],
      receivedDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  props: {
    isView: {
      type: Boolean,
      default: false
    },
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
    projectCodeIsReq: {
      immediate: false,
      handler: function (selected) {
        if (this.$refs.form1) {
          this.$refs.form1.clearValidate('costProjectCode')
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
      return this.checkPermi(['inventoryManagement:emergencyGoodsReceipt:edit'])
    },
    comDisFrom() {
      if (this.isView) {
        return true
      }
      if (this.rowId) {
        return !this.editAuth
      }
      return false
    },
    addCustomProductAuth() {
      return this.checkPermi(['inventoryManagement:emergencyGoodsReceipt:addCustomProduct'])
    },
    // 列表是否包含定制产品
    projectCodeIsReq() {
      // if (!this.tableList || this.tableList.length <= 0) return false
      // return this.tableList.some((x) => x.isCustomProduct === '1')
      /* Yvonne 提出, 定制产品可能没有项目 */
      return false
    },
    tableListIncludeCustomProduct() {
      if (!this.tableList || this.tableList.length <= 0) return false
      return this.tableList.some((x) => x.isCustomProduct === '1')
    },
    isSystemDocking() {
      return this.$store.state.user.legalEntityInfo.isSystemDocking
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    queryCanSelectCostProjectListForPage() {
      const param = {
        pageNum: 1,
        pageSize: 9999,
        departmentId: this.departmentId
      }
      this.$trimOfObj(param)
      this.costProjectListLoading = true
      queryCanSelectCostProjectListForPage(param)
        .then((response) => {
          const rows = response.rows || []
          this.costProjectList = rows
          this.costProjectListLoading = false
        })
        .catch((err) => {
          this.costProjectListLoading = false
          window.console.error(err)
        })
    },
    queryUsers() {
      const param = {
        pageNum: 1,
        pageSize: 9999,
        departmentId: this.form.departmentId
      }
      this.$trimOfObj(param)
      param.menuPerms = this.menuKey.emergencyGoodsReceipt
      this.requiredListLoading = true
      queryUsers(param)
        .then((response) => {
          this.total = response.total
          this.requiredList = response.rows || []
          this.requiredListLoading = false
        })
        .catch((err) => {
          this.requiredListLoading = false
          window.console.error(err)
        })
    },
    getVisibleColumn(VisibleColumn) {
      const fixedIndex = VisibleColumn.findIndex((item) => item.fixed)
      const firstIndex = fixedIndex >= 0 ? fixedIndex : 0
      return VisibleColumn.map((item, index) => {
        if (firstIndex === index) {
          return {
            ...item,
            width: 240,
            isLeft: '1'
          }
        }
        return item
      })
    },
    handleSortChange({ prop, order }) {
      this.handlerTableList()
      if (!prop || !order) {
        this.tableList = (this.tableList || []).slice().sort((a, b) => {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        })
        this.resetSnNum(this.tableList)
        return
      }
      // 根据排序字段和顺序对数据进行排序（保留稳定性：相等时回退到 _stableIndex）
      this.tableList = (this.tableList || []).slice().sort((a, b) => {
        const valueA = a[prop] !== undefined && a[prop] !== null ? a[prop] : ''
        const valueB = b[prop] !== undefined && b[prop] !== null ? b[prop] : ''

        if (valueA === valueB) {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        }

        if (order === 'ascending') {
          return valueA > valueB ? 1 : -1
        } else if (order === 'descending') {
          return valueA < valueB ? 1 : -1
        }
        return 0
      })
      this.resetSnNum(this.tableList)
    },
    handlerTableList() {
      // let table = JSON.parse(JSON.stringify(this.createTableList))
      let table = this.createTableList
      if (this.queryParams.condition) {
        table = table.filter((item) => {
          return this.$isContain(this.queryParams.condition, [
            item.productName,
            item.internalPartNo,
            item.description
          ])
        })
      }
      // 确保每行有稳定索引，用于取消排序时恢复原始顺序
      table.forEach((row) => {
        if (row && row._stableIndex === undefined) {
          this._stableCounter = (this._stableCounter || 0) + 1
          this.$set(row, '_stableIndex', this._stableCounter)
        }
      })
      this.tableList = table
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.handlerTableList()
      this.$refs.tables && this.$refs.tables.clearSort()
    },
    /** 重置 */
    resetSearchForm() {
      this.$refs.tables && this.$refs.tables.clearSort()
    },
    handleUpdate() {
      this.reset()
      this.queryCurrencyListBySelect()
      const rowId = this.rowId
      queryEmergencyGoodsReceiptById({ emergencyGoodsReceiptId: rowId }).then((res) => {
        const data = res.data || {}
        const list = data.emergencyGoodsReceiptDetailList || []
        let timer = Date.now()
        list.forEach((item, index) => {
          timer++
          item.rowTimeId = timer
          if (item.serviceSurchargeList) {
            item.serviceSurchargeList.forEach((child) => {
              timer++
              child.isExpenseItem = '1'
              child.rowTimeId = timer
            })
          }
        })
        this.createTableList = list
        this.tableList = this.createTableList
        this.changeTableList()
        this.queryUsers()
        this.queryCanSelectCostProjectListForPage()
        /* 初始化 AddressInfo */
        setTimeout(() => {
          this.$refs.uploadRef.initFileList(data.commonFileList || [])
          this.$refs.uploadDORef.initFileList(data.commonFileListForDO || [])
        }, 300)

        this.form = data
      })
    },
    // 取消按钮
    back(type) {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/purchaseRequisition' })
    },
    reset() {
      this.form = {
        businessPartnerName: undefined,
        departmentId: undefined,
        warehouseName: undefined,
        deliveryOrderNo: undefined,
        costProjectCode: undefined,
        receivedDate: undefined,
        currencyCode: undefined,
        currency: undefined,
        zoneId: undefined,
        reason: undefined,
        emergencyGoodsStatus: undefined,
        requiredBy: undefined,
        requiredId: undefined,
        createdBy: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.tableList = []
      this.createTableList = []
      // reset stable counter when clearing lists
      this._stableCounter = 0
      this.changeTableList()
      this.activeNames = ['1', '2', '3']
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
        if (this.$refs.uploadDORef) {
          this.$refs.uploadDORef.initFileList([])
        }
      }, 300)

      this.resetForm('form1')
    },

    /* 表单部分Start */
    queryUserDepartment() {
      this.deptOptionsLoading = true
      queryUserDepartment({ menuPerms: this.menuKey.PR })
        .then((res) => {
          this.deptOptions = res.data || []
          this.deptOptionsLoading = false
        })
        .catch(() => {
          this.deptOptionsLoading = false
        })
    },
    departmentChange(item) {
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
      if (this.form.requiredId !== this.$store.state.user.userId) {
        this.requiredByClear()
      }
      this.queryUsers()
      this.queryCanSelectCostProjectListForPage()
    },
    openRequiredByTable() {
      this.$refs.selectRequiredByTable.handleOpen()
    },
    // 清空pic
    requiredByClear() {
      this.$set(this.form, 'requiredBy', undefined)
      this.$set(this.form, 'requiredId', undefined)
    },
    updateRequiredBy(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'requiredBy', nickName)
      this.$set(this.form, 'requiredId', userId)
    },

    openCostProjectNameTable() {
      this.$refs.selectCostProjectTable.handleOpen()
    },
    // 清空pic
    costProjectNameClear() {
      this.$set(this.form, 'costProjectName', undefined)
      this.$set(this.form, 'costProjectId', undefined)
      this.$set(this.form, 'costProjectCode', undefined)
    },
    updateCostProjectName(row) {
      const {
        costProjectName,
        costProjectId,
        costProjectCode,
        businessPartnerName,
        receiveAddress
      } = row
      this.$set(this.form, 'costProjectName', costProjectName)
      this.$set(this.form, 'costProjectId', costProjectId)
      this.$set(this.form, 'costProjectCode', costProjectCode)
      if (receiveAddress) {
        this.$set(this.form, 'receiveAddressName', receiveAddress)
      }
      this.$set(this.form, 'contactPersonName', businessPartnerName)
      const businessPartner = row.businessPartner || {}
      if (businessPartner.countryMobileCode) {
        this.$set(this.form, 'mobileCode', businessPartner.countryMobileCode)
        this.$nextTick(() => {
          if (this.$refs.mobileNoRef) {
            this.$refs.mobileNoRef.clearValidate()
          }
        })
      }
    },

    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    // 清空pic
    warehouseNameClear() {
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseId', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'noCanSelectProductIdList', undefined)
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId } = row
      const noCanSelectProductIdList = row.noCanSelectProductIdList || []
      if (this.createTableList.length <= 0) {
        this.$set(this.form, 'warehouseName', warehouseName)
        this.$set(this.form, 'warehouseId', warehouseId)
        this.$set(this.form, 'noCanSelectProductIdList', noCanSelectProductIdList)
        return
      }
      const delList = this.createTableList.filter((item) => {
        return noCanSelectProductIdList.includes(item.productId)
      })
      if (delList.length <= 0) {
        this.$set(this.form, 'warehouseName', warehouseName)
        this.$set(this.form, 'warehouseId', warehouseId)
        this.$set(this.form, 'noCanSelectProductIdList', noCanSelectProductIdList)
        return
      }

      let htmlStr = '<div>'
      htmlStr += `<div>${this.$t('PURCHASE.switchToTip').replace('$1', row.warehouseName)}</div>`
      htmlStr += '<ul>'
      const icon =
        '<i style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;background-color: #666;margin-right: 4px"></i>'
      delList.forEach((item) => {
        htmlStr += `<li>${icon} ${item.productName}</li>`
      })
      htmlStr += '</ul></div>'
      this.$confirm(htmlStr, this.$t('PURCHASE.warehouseChangeNotice'), {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('PURCHASE.switchTo').replace('$1', row.warehouseName),
        cancelButtonText: this.$t('uiBtn.cancel')
      })
        .then(() => {
          this.$set(this.form, 'warehouseName', warehouseName)
          this.$set(this.form, 'warehouseId', warehouseId)
          this.$set(this.form, 'noCanSelectProductIdList', noCanSelectProductIdList)
          /* const newDetailList = this.createTableList.filter((item) => {
            return !noCanSelectProductIdList.includes(item.productId)
          })
          this.createTableList = newDetailList
          this.tableList = this.createTableList */
        })
        .catch(() => {})
      // this.tableList = []
      // this.createTableList = []
      // this.changeTableList()
    },
    queryCurrencyListBySelect() {
      this.currencyOptionsLoading = true
      queryCurrencyListBySelect()
        .then((res) => {
          const list = res.data || []
          this.currencyOptions = list.map((item) => {
            item.label = `${item.currencyCode} (${item.currencyDesc})`
            return item
          })
          this.currencyOptionsLoading = false
        })
        .catch(() => {
          this.currencyOptionsLoading = false
        })
    },
    currencyChange(row) {
      this.$set(this.form, 'currencyId', row.id)
      this.$set(this.form, 'currency', row.currency)
      this.$set(this.form, 'currencyCode', row.currencyCode)
    },
    /* 表单部分End */

    /* 表格部分Start */
    nav(row) {
      if (row.isAdhocEntry === '1') {
        this.$router.push({
          path: '/productManagement/editProductInfo',
          query: {
            id: row.productMainId,
            timeId: Date.now(),
            back: '1'
          }
        })
      } else {
        this.$router.push({
          path: '/productManagement/viewExtendedProductInfo',
          query: {
            id: row.productMainId,
            timeId: Date.now()
          }
        })
      }
    },
    adhocEntryUomChange(row) {
      this.$set(row, 'uomError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.$set(row, 'basicUom', row.uom)
    },
    purchaseUomChange(row) {
      this.$set(row, 'uomError', false)
      this.$set(row, 'ROW-ERROR', false)
      const selectItem = row.uomDataList.find((item) => item.uomName === row.uom)
      this.$set(row, 'uomCoefficient', selectItem.uomCoefficient)
    },

    handleAddCustomProduct() {
      this.createTableList.push({
        isCustomProduct: '1',
        productType: '1',
        includeDecimal: '1',
        uomCoefficient: 1,
        decimalNum: 3,
        customId: +new Date()
      })
      // assign stable index for newly added custom product
      const newRow2 = this.createTableList[this.createTableList.length - 1]
      if (newRow2 && newRow2._stableIndex === undefined) {
        this._stableCounter = (this._stableCounter || 0) + 1
        this.$set(newRow2, '_stableIndex', this._stableCounter)
      }
      this.tableList = this.createTableList
    },
    handleAddBtn() {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      // this.$refs.selectProductTable.handleAdd(alreadySelectIdList)
      const tableList = JSON.parse(JSON.stringify(this.createTableList))
      this.$refs.selectProductTable.handleAdd(tableList)
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        this.createTableList.forEach((row) => {
          if (row[this.rowIdKey]) {
            const index = rows.findIndex((item) => row[this.rowIdKey] === item[this.rowIdKey])
            if (index !== -1) {
              rows[index] = row
            }
          }
        })

        // preserve or assign stable indices for incoming rows
        rows.forEach((r) => {
          if (r && r._stableIndex === undefined) {
            this._stableCounter = (this._stableCounter || 0) + 1
            r._stableIndex = this._stableCounter
          }
        })

        // this.tableList = [...this.tableList, ...rows]
        // this.tableList = rows
        // this.createTableList = rows
        this.createTableList.length = 0
        this.createTableList.push(...rows)
        this.tableList = this.createTableList
        this.changeTableList()
        this.$nextTick(() => {
          this.selected.forEach((row) => {
            this.tableList.forEach((item) => {
              if (row[this.rowIdKey] === item[this.rowIdKey]) {
                this.$refs.tables.toggleRowSelection(item, true)
              }
            })
          })
        })
      } else {
        this.tableList = []
        this.createTableList = []
      }
    },
    changeTableList() {
      this.resetSnNum(this.createTableList)
      const allList = []
      this.createTableList.forEach((item) => {
        allList.push(item)
        if (item.serviceSurchargeList) {
          item.serviceSurchargeList.forEach((child) => {
            allList.push({
              ...child,
              productName: child.expenseItemName,
              receivedQty: child.qty
            })
          })
          allList.push(...item.serviceSurchargeList)
        }
      })
      this.$$getColumnContentMaxWidth(this.columns, allList)
    },
    resetSnNum(list, plantStage) {
      list.forEach((item, index) => {
        item.snNum = plantStage ? `${plantStage}.${index + 1}` : `${index + 1}`
        // 如果当前节点有子节点，递归查找
        if (item.serviceSurchargeList && item.serviceSurchargeList.length > 0) {
          this.resetSnNum(item.serviceSurchargeList, item.snNum)
        }
      })
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        if (row.productId || row.isCustomProduct === '1') {
          const findindex1 = this.tableList.findIndex(
            (item) => item[this.rowIdKey] === row[this.rowIdKey]
          )
          if (findindex1 !== -1) {
            this.tableList.splice(findindex1, 1)
          }
          const findindex2 = this.createTableList.findIndex(
            (item) => item[this.rowIdKey] === row[this.rowIdKey]
          )
          if (findindex2 !== -1) {
            this.createTableList.splice(findindex2, 1)
          }
        } else {
          this.createTableList.find((item) => {
            const findChildIndex = (item.serviceSurchargeList || []).findIndex(
              (child) => child[this.rowIdKey] === row[this.rowIdKey]
            )
            if (findChildIndex !== -1) {
              item.serviceSurchargeList.splice(findChildIndex, 1)
              return true
            }
            return false
          })
        }
        this.resetSnNum(this.createTableList)
      })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (row['ROW-ERROR']) {
        color = 'required-row'
      }
      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (
        this.createTableList.find(
          (item) => !item[column.property] && item[column.property + 'Error']
        )
      ) {
        cellClass = 'is-required-table-cell'
      }
      return cellClass
    },
    /* 表格部分End */

    async submitForm(submitType) {
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
      }
      if (valid1) {
        let param = { ...this.form }
        const detailList = this.createTableList
        if (detailList.length <= 0) {
          this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
          this.collapseWarningForProductInfo = true
          return
        }
        const uomReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.uom)
        })
        if (uomReq) {
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.uom')))
          this.collapseWarningForProductInfo = true
          return
        }
        const qtyReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.qty)
        })
        if (qtyReq) {
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qty')))
          this.collapseWarningForProductInfo = true
          return
        }

        const uomCoefficientReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.uomCoefficient)
        })
        if (uomCoefficientReq) {
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.ratio')))
          this.collapseWarningForProductInfo = true
          return
        }

        this.collapseWarningForProductInfo = false
        param.emergencyGoodsReceiptDetailList = detailList
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.commonFileList = myFileIds
        const confirmMsg = this.$t('PURCHASE.egrSubmitConfirm')
        const successMsg = this.$t('PURCHASE.egrSubmitSuccess')
        const submitFn = revisePurchaseRequisite
        const noCanSelectProductIdList = param.noCanSelectProductIdList || []
        const delList = this.createTableList.filter((item) => {
          return noCanSelectProductIdList.includes(item.productId)
        })
        if (delList.length > 0) {
          this.autoRemoveAndSubmit({
            delList,
            param,
            successMsg,
            submitFn,
            submitType
          })
          return
        }
        this.$modal
          .confirm(confirmMsg)
          .then(() => {
            return submitFn(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
            this.back()
          })
          .catch(() => {})
      }
    },
    autoRemoveAndSubmit({ delList, param, successMsg, submitFn, submitType }) {
      let htmlStr = '<div>'
      htmlStr += `<div>${this.$t('PURCHASE.switchToTip').replace('$1', param.warehouseName)}</div>`
      htmlStr += '<ul>'
      const icon =
        '<i style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;background-color: #666;margin-right: 4px"></i>'
      delList.forEach((item) => {
        htmlStr += `<li>${icon} ${item.productName}</li>`
      })
      htmlStr += '</ul>'
      htmlStr += `<div>${this.$t('PURCHASE.switchToTip2')}</div>`
      htmlStr += '</div>'

      this.$confirm(htmlStr, '', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('PURCHASE.autoRemoveSubmit'),
        cancelButtonText: this.$t('uiBtn.back')
      })
        .then(() => {
          const newDetailList = param.emergencyGoodsReceiptDetailList.filter((item) => {
            return !param.noCanSelectProductIdList.includes(item.productId)
          })
          param.emergencyGoodsReceiptDetailList = newDetailList
          this.createTableList = newDetailList
          this.tableList = this.createTableList
          if (newDetailList.length <= 0 && submitType !== 'save') {
            this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
            this.collapseWarningForProductInfo = true
            return
          }
          this.submitLoading = true
          submitFn(param)
            .then((response) => {
              this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
              this.back()
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
            })
        })
        .catch(() => {})
    },
    handleSaveDraft() {
      this.submitForm('save')
    }
  }
}
</script>
<style lang="scss"></style>
