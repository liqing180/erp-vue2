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
                      <!-- <SelectInput
                        clearable
                        :value="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        @click="openSupplierTable"
                        @clear="supplierClear"
                      /> -->

                      <CommonSelectAndList
                        :id="form.businessPartnerMainId"
                        :label="form.businessPartnerName"
                        idKey="businessPartnerMainId"
                        labelKey="businessPartnerName"
                        filterable
                        :options="businessPartnerList"
                        :loading="businessPartnerListLoading"
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
                        :disabled="!form.departmentId"
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
                        @change="dropShippingChange"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress')}`"
                      prop="receiveAddressName"
                      v-if="form.dropShipping === '1'"
                      key="receiveAddressName11"
                    >
                      <!-- <el-input v-model="form.receiveAddressName" maxlength="200"></el-input> -->
                      <selectDropShippingAddress
                        class="w100"
                        :value="form.receiveAddressName"
                        :title="form.receiveAddressName"
                        :canSelectOptions="dropShippingAddressOptions"
                        @input="
                          (e) => {
                            $set(form, 'receiveAddressName', e)
                          }
                        "
                        @change="dropShippingAddressChange"
                        :disabled="false"
                      />
                    </el-form-item>
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress')}`"
                      prop="warehouseName"
                      key="deliveryAddress2"
                      v-else
                    >
                      <!-- <SelectInput
                        :value="form.warehouseName"
                        :title="form.warehouseName"
                        @clear="warehouseNameClear"
                        clearable
                        @click="openWarehouseTable"
                        class="form-wd"
                      /> -->

                      <CommonSelectAndList
                        :id="form.warehouseId"
                        :label="form.warehouseName"
                        idKey="warehouseId"
                        labelKey="warehouseName"
                        filterable
                        :options="warehouseList"
                        :loading="warehouseListLoading"
                        @change="updateWarehouse"
                        @handleOpen="openWarehouseTable"
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
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row v-if="isSystemDocking === '1'">
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.zone')}`"
                      prop="zoneId"
                      :rules="[
                        {
                          required: zoneList.length > 0,
                          message: $t('ui.reqMsg').replace('$1', $t('PURCHASE.zone')),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <el-select style="width: 100%" v-model="form.zoneId" placeholder="" clearable>
                        <el-option
                          v-for="item in zoneList"
                          :key="item.zoneId"
                          :label="item.zoneName"
                          :value="item.zoneId"
                        >
                        </el-option>
                      </el-select>
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
                      <myUpload ref="uploadDORef" :disabled="false" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}`">
                      <myUpload ref="uploadRef" :disabled="false" />
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
              <div class="pb20" v-loading="btnLoading">
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5">
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
                  <el-col :span="1.5" v-if="addCustomProductAuth">
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
                        <el-input
                          v-if="scope.row.isAdhocEntry === '1' || scope.row.isCustomProduct === '1'"
                          style="width: 98%"
                          :title="scope.row.productName"
                          v-model="scope.row.productName"
                          :maxlength="200"
                          @input="
                            scope.row[item.prop + 'Error'] = false
                            scope.row['ROW-ERROR'] = false
                          "
                        />
                        <selectExpenseItemName
                          :value="scope.row.expenseItemName"
                          :canSelectOptions="
                            getServiceSurchargeListOptions(serviceSurchargeListOptions, item)
                          "
                          :allOptions="serviceSurchargeListOptions"
                          :style="`width:  calc(98% - ${item.isLeft === '1' ? 22 : 0}px)`"
                          @change="productNameChange($event, scope.row)"
                          v-else-if="scope.row.isExpenseItem === '1'"
                        />
                        <template v-else>
                          <span v-if="scope.row.isExpenseItem === '1'">{{
                            scope.row.expenseItemName
                          }}</span>
                          <span v-else>{{ scope.row[item.prop] }}</span>
                        </template>
                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                        <div
                          v-if="getFieldExists(scope.row)"
                          class="flow1"
                          style="
                            color: #ff4949;
                            font-size: 12px;
                            line-height: 13px;
                            padding: 3px 0;
                            text-align: left;
                          "
                        >
                          {{
                            $t('ui.alreadyExists').replace('$1', `[${scope.row.expenseItemName}]`)
                          }}
                        </div>
                      </template>
                      <template v-else-if="item.prop === 'internalPartNo'">
                        <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
                          scope.row.internalPartNo
                        }}</span>
                      </template>

                      <template v-else-if="item.prop === 'alias'">
                        <el-input
                          v-if="scope.row.isAdhocEntry === '1' || scope.row.isCustomProduct === '1'"
                          style="width: 98%"
                          :title="scope.row.alias"
                          v-model="scope.row.alias"
                          :maxlength="200"
                        />
                        <template v-else>{{ scope.row[item.prop] }}</template>
                      </template>
                      <template v-else-if="item.prop === 'description'">
                        <descriptionEditDlg v-model="scope.row.description" :maxlength="7000" />
                      </template>
                      <template v-else-if="item.prop === 'partNo'">
                        <el-input
                          v-if="scope.row.isAdhocEntry === '1' || scope.row.isCustomProduct === '1'"
                          style="width: 98%"
                          :title="scope.row.partNo"
                          v-model="scope.row.partNo"
                          :maxlength="200"
                        />
                        <template v-else>{{ scope.row[item.prop] }}</template>
                      </template>
                      <template v-else-if="item.prop === 'uom'">
                        <el-select
                          style="width: 98%"
                          v-model="scope.row.uom"
                          :title="showUomLabel(scope.row.uom)"
                          placeholder=""
                          @change="adhocEntryUomChange(scope.row)"
                          filterable
                          v-if="scope.row.isAdhocEntry === '1' || scope.row.isCustomProduct === '1'"
                        >
                          <el-option
                            v-for="item in allUomList"
                            :key="item"
                            :label="item"
                            :value="item"
                          >
                          </el-option>
                        </el-select>
                        <el-select
                          style="width: 98%"
                          v-model="scope.row.unit"
                          filterable
                          :title="showUomLabel(scope.row.unit)"
                          placeholder=""
                          @change="adhocEntryUomChange(scope.row)"
                          v-else-if="scope.row.isExpenseItem === '1' && scope.row.isCustom === '1'"
                        >
                          <el-option
                            v-for="item in allUomList"
                            :key="item"
                            :label="item"
                            :value="item"
                          >
                          </el-option>
                        </el-select>
                        <template v-else>
                          <span
                            v-if="scope.row.isExpenseItem === '1'"
                            :title="showUomLabel(scope.row.unit)"
                            >{{ scope.row.unit }}</span
                          >
                          <span :title="showUomLabel(scope.row.uom)" v-else>
                            {{ scope.row.uom }}
                          </span>
                        </template>
                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                        <!-- <el-select
                          style="width: 98%"
                          v-model="scope.row.uom"
                          :title="showUomLabel(scope.row[item.prop])"
                          @change="purchaseUomChange(scope.row)"
                          placeholder=""
                          filterable
                          v-else
                        >
                          <el-option
                            v-for="item in scope.row.uomDataList || []"
                            :key="item.uomName"
                            :label="item.uomName"
                            :value="item.uomName"
                          >
                          </el-option>
                        </el-select> -->
                      </template>
                      <template v-else-if="item.prop === 'receivedQty'">
                        <el-input-number
                          v-thousandSplit="{ precision: scope.row.decimalNum, keepDec: false }"
                          style="width: 98%"
                          v-model="scope.row.qty"
                          controls-position="right"
                          :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                          :max="scope.row.qtyLimit"
                          @change="expenseItemQtyChange(scope.row)"
                          v-if="scope.row.isExpenseItem === '1'"
                        />
                        <el-input-number
                          style="width: 98%"
                          v-else
                          v-thousandSplit="{ precision: scope.row.decimalNum }"
                          v-model="scope.row.receivedQty"
                          controls-position="right"
                          :precision="scope.row.decimalNum"
                          :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                          :max="999999"
                          @change="changeReceiveQty(scope.row)"
                        />
                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                        <!-- <template v-else>{{ scope.row.volumeShowStr }}</template> -->
                      </template>
                      <template v-else-if="item.prop === 'unitPrice'">
                        <el-input-number
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
                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                      </template>

                      <template v-else-if="item.prop === 'remarks'">
                        <descriptionEditDlg v-model="scope.row.remarks" :maxlength="200" />
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
                  >
                    <template slot-scope="scope">
                      <div class="flexCen">
                        <div style="width: 30px">
                          <i
                            class="el-icon-plus pointer mr10"
                            style="font-size: 20px; color: #409eff"
                            :title="$t('uiBtn.add')"
                            v-if="
                              scope.row.productId &&
                              scope.row.isExpenseItem !== '1' &&
                              (scope.row.serviceSurchargeList || []).length < 8
                            "
                            @click="handleAddChild(scope.row)"
                          ></i>
                        </div>
                        <div>
                          <i
                            class="el-icon el-icon-delete pointer"
                            style="font-size: 20px; color: #f56c6c"
                            :title="$t('uiBtn.delete')"
                            @click="handleDelRow(scope.$index, scope.row)"
                          ></i>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>

    <selectSupplierTableForASL ref="selectSupplierTableForASL" @update="updateSupplier" />

    <selectRequiredByTable
      ref="selectRequiredByTable"
      :departmentId="form.departmentId"
      @update="updateRequiredBy"
    />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
    <selectProductTable
      ref="selectProductTable"
      :warehouseId="form.dropShipping !== '1' ? form.warehouseId : ''"
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
import { queryAllUomList } from '@/api/system/uom'
import { queryUserDepartment } from '@/api/system/user'
import {
  queryCanSelectWarehouseDefaultWarehouse,
  queryPRCanSelectWarehouseList
} from '@/api/purchaseManagement/purchaseRequisition'

import {
  saveDraftEmergencyGoodsReceipt,
  saveEmergencyGoodsReceipt,
  queryZoneListByProductIdList,
  queryDropShippingAddressOptions,
  queryEmergencyGoodsReceiptNoListByDeliveryOrderNo,
  queryEGRCanSelectBusinessPartnerList
} from '@/api/inventoryManagement/emergencyGoodsReceipt'
import { queryUsers } from '@/api/organization/corporate'
import { queryCanSelectCostProjectListForPage } from '@/api/projectManagement/project'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import selectSupplierTableForASL from './components/selectSupplierTableForASL.vue'
import selectRequiredByTable from './components/selectRequiredByTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import selectProductTable from './components/selectProductTable'
import selectCostProjectTable from './components/selectCostProjectTable.vue'
import { getSystemSetup } from '@/api/system/systemSetting'
import selectExpenseItemName from '@/views/purchaseManagement/purchaseQuotation/components/selectExpenseItemName'
import selectDropShippingAddress from './components/selectDropShippingAddress'
import { formDirtyClass } from '@/mixins/formDirtyClass'

export default {
  dicts: ['i_emergency_goods_status', 'product_type', 'business_contact_person_title'],
  mixins: [pageMixin],
  components: {
    selectSupplierTableForASL,
    selectRequiredByTable,
    selectWarehouseTable,
    selectProductTable,
    selectCostProjectTable,
    selectExpenseItemName,
    selectDropShippingAddress
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
      warehouseList: [],
      warehouseListLoading: false,
      costProjectList: [],
      costProjectListLoading: false,
      requiredList: [],
      requiredListLoading: false,
      businessPartnerList: [],
      businessPartnerListLoading: false,
      submitLoading: false,
      btnLoading: false,
      saveKey: '10',
      savePath: 'EGRTable',
      activeNames: ['1', '2'],
      rowId: '',
      timeId: '',
      form: {},
      collapseWarningForBasicInfo: false,
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
        deliveryOrderNo: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PURCHASE.requiredBy')),
            trigger: ['change']
          }
        ],
        receivedDate: [
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
        reason: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
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
        mobilePhone: [{ required: true, validator: validatorPhoneNo, trigger: 'change' }]
      },
      deptOptions: [],
      deptOptionsLoading: false,
      currencyOptions: [],
      currencyOptionsLoading: false,
      zoneList: [],
      dropShippingAddressOptions: [],

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
      tableList: [],
      selected: [],
      allUomList: [],
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
      serviceSurchargeListOptions: [],
      receivedDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
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
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function () {
        this.timeId = this.propTimeId
        this.rowId = this.propRowId
        this.handleAdd()
      }
    },
    projectCodeIsReq: {
      immediate: false,
      handler: function () {
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
    // 法人对接
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
    queryPRCanSelectWarehouseList() {
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$trimOfObj(param)
      param.warehouseType = '1'
      param.menuPerms = this.menuKey.emergencyGoodsReceipt
      this.warehouseListLoading = true
      queryPRCanSelectWarehouseList(param)
        .then((response) => {
          const rows = response.rows || []
          this.warehouseList = rows
          this.warehouseListLoading = false
        })
        .catch((err) => {
          this.warehouseListLoading = false
          window.console.error(err)
        })
    },
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
    queryEGRCanSelectBusinessPartnerList() {
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$trimOfObj(param)
      param.menuPerms = this.menuKey.emergencyGoodsReceipt
      this.businessPartnerListLoading = true
      queryEGRCanSelectBusinessPartnerList(param)
        .then((response) => {
          const rows = response.rows || []
          this.businessPartnerList = rows
          this.businessPartnerListLoading = false
        })
        .catch((err) => {
          this.businessPartnerListLoading = false
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
    getSystemSetup() {
      getSystemSetup().then((res) => {
        const data = res.data || {}
        this.serviceSurchargeListOptions = data.serviceSurchargeList || []
      })
    },
    dropShippingChange() {
      // this.warehouseNameClear()
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
    handleAdd() {
      this.reset()
      this.queryCanSelectWarehouseDefaultWarehouse()
      this.queryUserDepartment()
      this.queryAllUomList()
      this.queryCurrencyListBySelect()
      this.getSystemSetup()
      this.queryDropShippingAddressOptions()
      this.queryEGRCanSelectBusinessPartnerList()
      this.queryPRCanSelectWarehouseList()

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
      param.commonFileListForDO = this.$refs.uploadDORef && this.$refs.uploadDORef.getFileIds()
      param.commonFileList = this.$refs.uploadRef && this.$refs.uploadRef.getFileIds()
      return JSON.stringify(param)
    },
    reset() {
      this.form = {
        businessPartnerName: undefined,
        departmentId: undefined,
        warehouseName: undefined,
        deliveryOrderNo: undefined,
        costProjectCode: undefined,
        receivedDate: Date.now(),
        currencyCode: undefined,
        currency: undefined,
        zoneId: undefined,
        reason: undefined,
        emergencyGoodsStatus: undefined,
        requiredBy: this.$store.state.user.nickName,
        requiredId: this.$store.state.user.userId,
        createdBy: this.$store.state.user.nickName,
        dropShipping: '0'
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.tableList = []
      this.createTableList = []
      // reset stable counter when clearing lists
      this._stableCounter = 0
      this.changeTableList()
      this.activeNames = ['1', '2']
      setTimeout(() => {
        if (this.$refs.uploadDORef) {
          this.$refs.uploadDORef.initFileList([])
        }
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form1')
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/inventoryManagement/emergencyGoodsReceipt' })
    },
    backFN() {
      formDirtyClass.showNotify(this.$route.name).then((msg) => {
        if (msg === 'save') {
          this.handleSaveDraftNoConFirm()
          return
        } else if (msg === 'stop') {
          return
        }
        this.cancel()
      })
    },
    openSupplierTable() {
      this.$refs.selectSupplierTableForASL.handleOpen()
    },
    // 清空供应商
    supplierClear() {
      this.$set(this.form, 'businessPartnerMainId', undefined)
      this.$set(this.form, 'businessPartnerId', undefined)
      this.$set(this.form, 'businessPartnerName', undefined)
      this.$set(this.form, 'businessPartnerNo', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.currencyChange({})
      const newDetailList = this.createTableList.filter((item) => {
        return item.isCustomProduct === '1'
      })
      this.createTableList = newDetailList
      this.tableList = this.createTableList
      this.$refs.tables && this.$refs.tables.clearSort()

      this.changeTableList()
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
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)

      const account = row.bpBusinessAccountSupplier || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)

      const newDetailList = this.createTableList.filter((item) => {
        return item.isCustomProduct === '1'
      })
      this.createTableList = newDetailList
      this.tableList = this.createTableList
      this.$refs.tables && this.$refs.tables.clearSort()

      this.changeTableList()
      if (this.legalEntityInfo.countryId === this.form.countryId) {
        this.$nextTick(() => {
          this.$refs.form1 && this.$refs.form1.validateField('contactPersonName')
        })
      }
    },
    // 法人默认的本公司仓库
    queryCanSelectWarehouseDefaultWarehouse() {
      this.btnLoading = true
      queryCanSelectWarehouseDefaultWarehouse({
        menuPerms: this.menuKey.PR
      })
        .then((res) => {
          const row = res.data || {}
          this.btnLoading = false
          setTimeout(() => {
            this.updateWarehouse(row, 'init')
          }, 0)
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    nav(row) {
      this.$router.push({
        path: '/productManagement/viewExtendedProductInfo',
        query: {
          id: row.productId,
          timeId: Date.now()
        }
      })
    },
    /* 表单部分Start */
    queryUserDepartment() {
      // POST 请求
      this.deptOptionsLoading = true
      queryUserDepartment({ menuPerms: this.menuKey.PR })
        .then((res) => {
          this.deptOptions = res.data || []
          this.deptOptionsLoading = false
          setTimeout(() => {
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
                this.queryUsers()
                this.queryCanSelectCostProjectListForPage()
              }
            })
          }, 200)
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
    queryDropShippingAddressOptions() {
      queryDropShippingAddressOptions({ documentType: '27' }).then((res) => {
        this.dropShippingAddressOptions = res.data || []
      })
    },
    dropShippingAddressChange(row) {
      this.$set(this.form, 'receiveAddressName', row.receiveAddressName)
      this.$nextTick(() => {
        this.$refs.form1.validateField('receiveAddressName')
      })
      if (row.contactPersonName) {
        this.$set(this.form, 'title', row.title)
        this.$set(this.form, 'contactPersonName', row.contactPersonName)
        this.$set(this.form, 'email', row.email)
        this.$set(this.form, 'mobileCode', row.mobileCode)
        this.$set(this.form, 'mobileNum', row.mobileNum)
        this.$set(this.form, 'mobilePhone', row.mobilePhone)
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
      // this.tableList = []
      // this.createTableList = []
      // this.changeTableList()
    },
    updateWarehouse(row, type) {
      const { warehouseName, warehouseId } = row
      const noCanSelectProductIdList = row.noCanSelectProductIdList || []
      if (this.createTableList.length <= 0) {
        this.$set(this.form, 'warehouseName', warehouseName)
        this.$set(this.form, 'warehouseId', warehouseId)
        this.$set(this.form, 'noCanSelectProductIdList', noCanSelectProductIdList)
        if (type && type === 'init') {
          // 更新初始表单部分字段
          formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
            warehouseName: warehouseName,
            warehouseId: warehouseId,
            noCanSelectProductIdList: noCanSelectProductIdList
          })
        }
        return
      }
      const delList = this.createTableList.filter((item) => {
        return noCanSelectProductIdList.includes(item.productId)
      })
      if (delList.length <= 0) {
        this.$set(this.form, 'warehouseName', warehouseName)
        this.$set(this.form, 'warehouseId', warehouseId)
        this.$set(this.form, 'noCanSelectProductIdList', noCanSelectProductIdList)

        if (type && type === 'init') {
          // 更新初始表单部分字段
          formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
            warehouseName: warehouseName,
            warehouseId: warehouseId,
            noCanSelectProductIdList: noCanSelectProductIdList
          })
        }
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

          if (type && type === 'init') {
            // 更新初始表单部分字段
            formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
              warehouseName: warehouseName,
              warehouseId: warehouseId,
              noCanSelectProductIdList: noCanSelectProductIdList
            })
          }
          // const newDetailList = this.createTableList.filter((item) => {
          //   return !noCanSelectProductIdList.includes(item.productId)
          // })
          // this.createTableList = newDetailList
          // this.tableList = this.createTableList
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
    queryZoneListByProductIdList() {
      const productIdList = this.tableList.map((x) => x.productId)
      queryZoneListByProductIdList({ productIdList }).then((res) => {
        this.zoneList = res.data || []
      })
    },
    /* 表单部分End */

    /* 表格部分Start */
    getServiceSurchargeListOptions(options, row, index) {
      const findItem = this.createTableList.find((item) => {
        return (item.serviceSurchargeList || []).find(
          (child) => child[this.rowIdKey] === row[this.rowIdKey]
        )
      })
      const filterList = []
      const list = (findItem || {}).serviceSurchargeList || []
      list.forEach((item, i) => {
        if (item[this.rowIdKey] !== row[this.rowIdKey] && item.expenseItemName) {
          filterList.push(item.expenseItemName)
        }
      })
      return options.filter((item) => !filterList.includes(item.expenseItemName))
    },
    getFieldExists(row) {
      const rowExpenseItemName = (row.expenseItemName || '').trim()
      if (!rowExpenseItemName) return false
      const findItem = this.createTableList.find((item) => {
        return (item.serviceSurchargeList || []).find(
          (child) => child[this.rowIdKey] === row[this.rowIdKey]
        )
      })
      const list = (findItem || {}).serviceSurchargeList || []

      const exists = list.find(
        (item) =>
          item[this.rowIdKey] !== row[this.rowIdKey] &&
          (item.expenseItemName || '').trim() === rowExpenseItemName
      )
      return !!exists
    },
    productNameChange(data, row) {
      if (data.expenseItemName === row.expenseItemName) return
      this.$set(row, 'expenseItemName', data.expenseItemName)
      this.$set(row, 'includeDecimal', data.includeDecimal || '1')
      this.$set(row, 'decimalNum', data.includeDecimal === '0' ? 0 : 3)
      if (!(row.isCustom === '1' && data.isCustom === '1')) {
        this.$set(row, 'unit', data.unit)
      }
      this.$set(row, 'qtyLimit', data.qtyLimit)
      this.$set(row, 'isCustom', data.isCustom)
      this.$set(row, 'productNameError', false)
      this.$set(row, 'purchaseUomError', false)
      if (row.qtyLimit && row.qty > row.qtyLimit) {
        this.$set(row, 'qty', undefined)
        this.$set(row, 'lineTotal', undefined)
      }
    },
    queryAllUomList() {
      queryAllUomList({ menuPerms: this.menuKey.PR }).then((res) => {
        this.allUomList = res.data || []
      })
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
        customId: +new Date(),
        rowTimeId: +new Date()
      })
      // assign stable index for newly added custom product
      const newRow2 = this.createTableList[this.createTableList.length - 1]
      if (newRow2 && newRow2._stableIndex === undefined) {
        this._stableCounter = (this._stableCounter || 0) + 1
        this.$set(newRow2, '_stableIndex', this._stableCounter)
      }
      this.tableList = this.createTableList
      this.$refs.tables && this.$refs.tables.clearSort()

      this.resetSnNum(this.createTableList)
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
        let timer = Date.now()
        rows.forEach((p) => {
          if (!p[this.rowIdKey]) {
            timer++
            p[this.rowIdKey] = timer
          }
          if (p.isPhantom === '1' && !p.serviceSurchargeList) {
            const defaultList = this.serviceSurchargeListOptions.filter((i) => i.isDefault === '1')
            p.serviceSurchargeList = defaultList.map((item, index) => {
              timer++
              return {
                rowTimeId: timer,
                expenseItemName: item.expenseItemName, // 费用项名称
                unit: item.unit,
                unitPrice: undefined,
                includeDecimal: item.includeDecimal,
                decimalNum: item.includeDecimal === '1' ? 3 : 0,
                qtyLimit: item.qtyLimit,
                isExpenseItem: '1',
                qty: 1
              }
            })
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
        // this.initDraggable()
      } else {
        this.tableList = []
        this.createTableList = []
      }
      this.$refs.tables && this.$refs.tables.clearSort()
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
    handleAddChild(row) {
      if (!row.serviceSurchargeList) {
        this.$set(row, 'serviceSurchargeList', [])
      }
      if (row.serviceSurchargeList) {
        const params = {
          rowTimeId: Date.now(),
          expenseItemName: '', // 费用项名称
          unit: undefined,
          unitPrice: undefined,
          includeDecimal: undefined,
          decimalNum: undefined,
          qtyLimit: undefined,
          isExpenseItem: '1'
        }
        const parentStage = row.snNum
        const curStage = (row.serviceSurchargeList || []).length + 1
        params.snNum = `${parentStage}.${curStage}`
        row.serviceSurchargeList.push(params)
      }
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
    resetSnNum(list, plantStage) {
      list.forEach((item, index) => {
        item.snNum = plantStage ? `${plantStage}.${index + 1}` : `${index + 1}`
        // 如果当前节点有子节点，递归查找
        if (item.serviceSurchargeList && item.serviceSurchargeList.length > 0) {
          this.resetSnNum(item.serviceSurchargeList, item.snNum)
        }
      })
    },
    changeReceiveQty(row) {
      this.$set(row, 'receivedQtyError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.getLineTotal(row)
    },
    expenseItemQtyChange(row) {
      if (row.qty) {
        row.qty = this.$num(row.qty, row.decimalNum)
      }
      this.$set(row, 'receivedQtyError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.getLineTotal(row)
    },
    unitPriceChange(row) {
      this.$set(row, 'unitPriceError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.getLineTotal(row)
    },
    getLineTotal(row) {
      if (row.isExpenseItem === '1') {
        if (this.$resultOfBoolean(row.unitPrice) && row.qty) {
          const lineTotal = row.unitPrice * row.qty
          this.$set(row, 'lineTotal', lineTotal)
        } else {
          this.$set(row, 'lineTotal', undefined)
        }
      } else {
        if (this.$resultOfBoolean(row.unitPrice) && row.receivedQty) {
          const lineTotal = row.unitPrice * row.receivedQty
          this.$set(row, 'lineTotal', lineTotal)
        } else {
          this.$set(row, 'lineTotal', undefined)
        }
      }
    },

    errorMessage(code) {
      this.scrollPageToTable()

      let rowIndex
      this.createTableList.forEach((item, index) => {
        if (code && !this.$resultOfBoolean(item[code])) {
          this.$set(item, 'ROW-ERROR', true)
          this.$set(item, code + 'Error', true)
          if (!this.$resultOfBoolean(rowIndex)) {
            rowIndex = index
          }
        } else {
          this.$set(item, 'ROW-ERROR', false)
          if (code) {
            this.$set(item, code + 'Error', false)
          } else {
            Object.keys(item).forEach((key) => {
              if (key.endsWith('Error')) {
                this.$set(item, key, false)
              }
            })
          }
        }
        /* 服务费用项必填校验 */
        if (['productName', 'receivedQty', 'uom', 'unitPrice'].includes(code)) {
          const childList = item.serviceSurchargeList || []
          childList.forEach((child) => {
            if (code === 'productName') {
              if (!this.$resultOfBoolean(child.expenseItemName)) {
                this.$set(child, code + 'Error', true)
              }
            }
            if (code === 'receivedQty') {
              if (!this.$resultOfBoolean(child.qty)) {
                this.$set(child, code + 'Error', true)
              }
            }
            if (code === 'uom') {
              if (!this.$resultOfBoolean(child.unit)) {
                this.$set(child, code + 'Error', true)
              }
            }
            if (code === 'unitPrice') {
              if (!this.$resultOfBoolean(child.unitPrice)) {
                this.$set(child, code + 'Error', true)
              }
            }
          })
        }
      })
      this.$nextTick(() => {
        this.scrollToErrorColumn()
      })
    },
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
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (row['ROW-ERROR']) {
        color = 'required-row'
      }
      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (!row[column.property] && row[column.property + 'Error']) {
        cellClass = 'is-required-table-cell'
      }
      return cellClass
    },
    /* 表格部分End */

    async submitForm(submitType, isConfirm = true, gotoRoute) {
      let valid1 = false
      if (submitType === 'save') {
        valid1 = true
        this.collapseWarningForBasicInfo = false
        this.$refs.form1.clearValidate()
        this.$refs.form1.validateField(['businessPartnerName'], (err) => {
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
        valid1 = await this.$refs.form1.validate().catch((err) => {
          return err
        })
        this.collapseWarningForBasicInfo = !valid1
        if (!valid1) {
          /* if (this.tableListIncludeCustomProduct && !this.form.costProjectCode) {
            this.$modal.msgError({
              message: this.$t('PURCHASE.addCustomProductRequestProject'),
              dangerouslyUseHTMLString: true // 关键：允许渲染HTML
            })
          } */
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
      }

      if (valid1) {
        const myFileIdsDo = this.$refs.uploadDORef.getFileIds()
        if (myFileIdsDo === false) {
          return
        }
        const myFileIds = this.$refs.uploadRef.getFileIds()
        if (myFileIds === false) {
          return
        }
        let param = { ...this.form }
        const detailList = this.createTableList
        if (detailList.length <= 0 && submitType !== 'save') {
          this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
          this.collapseWarningForProductInfo = true
          return
        }
        if (detailList.length > 0 && submitType !== 'save') {
          const productNameReq = detailList.find((item) => {
            if (!(item.productName || '').trim()) {
              return true
            }
            const errItem = (item.serviceSurchargeList || []).find(
              (child) => !this.$resultOfBoolean(child.expenseItemName)
            )
            if (errItem) {
              return true
            }
            return false
          })
          if (productNameReq) {
            this.errorMessage('productName')
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.productName'))
            )
            this.collapseWarningForProductInfo = true
            return
          }
          const uomReq = detailList.find((item) => {
            if (!item.uom) {
              return true
            }
            const errItem = (item.serviceSurchargeList || []).find(
              (child) => !this.$resultOfBoolean(child.unit)
            )
            if (errItem) {
              return true
            }
            return false
          })
          if (uomReq) {
            this.errorMessage('uom')
            this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.uom')))
            this.collapseWarningForProductInfo = true
            return
          }
          const qtyReq = detailList.find((item) => {
            if (!this.$resultOfBoolean(item.receivedQty)) {
              return true
            }
            const errItem = (item.serviceSurchargeList || []).find(
              (child) => !this.$resultOfBoolean(child.qty)
            )
            if (errItem) {
              return true
            }
            return false
          })
          if (qtyReq) {
            this.errorMessage('receivedQty')
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.receiveQty'))
            )
            this.collapseWarningForProductInfo = true
            return
          }
          /* const unitPriceReq = detailList.find((item) => {
            if (!this.$resultOfBoolean(item.unitPrice)) {
              return true
            }
            const errItem = (item.serviceSurchargeList || []).find(
              (child) => !this.$resultOfBoolean(child.unitPrice)
            )
            if (errItem) {
              return true
            }
            return false
          })
          if (unitPriceReq) {
            this.errorMessage('unitPrice')
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.unitPrice'))
            )
            this.collapseWarningForProductInfo = true
            return
          } */
        }

        this.collapseWarningForProductInfo = false
        param.emergencyGoodsReceiptDetailList = detailList
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.commonFileListForDO = myFileIdsDo
        param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('PURCHASE.egrSaveConfirm')
          successMsg = this.$t('PURCHASE.egrSaveSuccess')
          submitFn = saveDraftEmergencyGoodsReceipt
        } else {
          confirmMsg = this.$t('PURCHASE.egrSubmitConfirm')
          successMsg = this.$t('PURCHASE.egrSubmitSuccess')
          submitFn = saveEmergencyGoodsReceipt
        }
        if (param.dropShipping === '1') {
          param.warehouseName = undefined
          param.warehouseId = undefined
          param.noCanSelectProductIdList = undefined
        }
        if (param.dropShipping !== '1') {
          param.receiveAddressName = undefined
          param.title = undefined
          param.contactPersonName = undefined
          param.email = undefined
          param.mobileCode = undefined
          param.mobileNum = undefined
          param.mobilePhone = undefined
        }
        if (!param.mobileNum) {
          param.mobileCode = undefined
          param.mobilePhone = undefined
        }

        if (submitType !== 'save') {
          await queryEmergencyGoodsReceiptNoListByDeliveryOrderNo({
            deliveryOrderNo: param.deliveryOrderNo
          })
            .then((res) => {
              const data = res.data || []
              if (data.length > 0) {
                confirmMsg = this.$t('PURCHASE.egrSubmitConfirmForDoNo')
                  .replace('$1', param.deliveryOrderNo)
                  .replace('$2', data.join(', '))
              }
            })
            .catch(() => {})
        }

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
            submitType,
            gotoRoute
          })
          return
        }
        if (isConfirm) {
          this.$modal
            .confirm(confirmMsg)
            .then(() => {
              this.submitLoading = true
              return submitFn(param)
            })
            .then((response) => {
              this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
              this.cancel()
              this.submitLoading = false
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
                this.cancel()
              }
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      }
    },
    autoRemoveAndSubmit({ delList, param, successMsg, submitFn, submitType, gotoRoute }) {
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
              this.submitLoading = false
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
        })
        .catch(() => {})
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
.high-row td {
  // height: 49px;
}
</style>
