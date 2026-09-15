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
                    <el-form-item :label="`${$t('PURCHASE.requiredFrom')}`">
                      <el-input
                        :value="selectDictLabel(dict.type.p_required_type, form.requiredType)"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input :value="form.purchaseRequisiteStatusShowStr" disabled></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.purchaseRequisitionNo')}`">
                      <el-input v-model="form.purchaseRequisiteNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.dept')}`" prop="departmentId">
                      <el-select
                        v-model="form.departmentId"
                        :title="form.allSuperiorName"
                        placeholder=""
                        style="width: 100%"
                        clearable
                        @change="departmentChange"
                        :loading="deptOptionsLoading"
                      >
                        <el-option
                          v-for="item in deptOptions"
                          :key="item.departmentId"
                          :label="item.departmentName"
                          :value="item.departmentId"
                        ></el-option>
                      </el-select>
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
                        filterable
                        :options="requiredByOptions"
                        :loading="requiredByLoading"
                        :disabled="requiredByLoading || !form.departmentId"
                        @change="updateRequiredBy"
                        @handleOpen="openRequiredByTable"
                      />
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
                      <CommonSelectAndList
                        :id="form.costProjectId"
                        :label="form.costProjectCode"
                        idKey="costProjectId"
                        labelKey="costProjectCode"
                        filterable
                        :options="costProjectOptions"
                        :loading="costProjectOptionsLoading"
                        @change="updateCostProjectName"
                        @handleOpen="openCostProjectNameTable"
                      />
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
                        :disabled="tableListIncludeSystemDocking"
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
                      v-else
                    >
                      <CommonSelectAndList
                        :id="form.warehouseId"
                        :label="form.warehouseName"
                        idKey="warehouseId"
                        labelKey="warehouseName"
                        filterable
                        :options="warehouseOptions"
                        :loading="warehouseOptionsLoading"
                        @change="updateWarehouse"
                        @handleOpen="openWarehouseTable"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row v-if="form.dropShipping === '1'" :key="'contactPerson' + form.dropShipping">
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.consignee')}`" prop="contactPersonName">
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

                <el-row>
                  <el-col :span="24">
                    <!-- <el-form-item :label="$t('ui.reason')" prop="reasonType">
                      <el-select
                        style="width: 100%"
                        v-model="form.reasonType"
                        placeholder=""
                        @change="reasonTypeChange"
                      >
                        <el-option
                          v-for="item in dict.type.pr_reason_type"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item> -->
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
                  <!-- <el-col :span="24" v-if="form.reasonType === 'Other'" key="reason11">
                    <el-form-item :label="$t('ui.remarks')" prop="reason">
                      <MyInput
                        type="textarea"
                        v-model="form.reason"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                      ></MyInput>
                    </el-form-item>
                  </el-col> -->
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
                :title="$t('PURCHASE.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div class="pb20" v-loading="btnLoading">
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5">
                    <el-button
                      :disabled="form.dropShipping !== '1' && !form.warehouseId"
                      @click="handleAddBtn"
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      >{{ $t('uiBtn.add') }}</el-button
                    >
                  </el-col>
                  <el-col :span="1.5" v-if="addAdhocEntryAuth">
                    <el-button
                      :disabled="form.dropShipping !== '1' && !form.warehouseId"
                      @click="handleSddAdhocEntry"
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      >{{ $t('menu.addAdhocEntry') }}</el-button
                    >
                  </el-col>
                  <el-col :span="1.5" v-if="addCustomProductAuth">
                    <el-button
                      :disabled="form.dropShipping !== '1' && !form.warehouseId"
                      @click="handleAddCustomProduct"
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      >{{ $t('menu.addCustomProduct') }}</el-button
                    >
                  </el-col>

                  <el-col :span="1.5" v-if="false">
                    <el-button
                      :disabled="selected.length <= 0"
                      @click="handleDelete"
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      >{{ $t('uiBtn.delete') }}</el-button
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
                  @select="handleSelectionChange"
                  @select-all="handleSelectAll"
                  @sort-change="handleSortChange"
                  v-table-tab
                >
                  <el-table-column
                    v-if="false"
                    type="selection"
                    key="selection"
                    align="center"
                    width="55"
                  ></el-table-column>
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
                    v-for="item in comVisibleColumn"
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
                      <span
                        v-if="
                          [
                            'productName',
                            'uom',
                            'qty',
                            // 'uomCoefficient',
                            'deliveryDate',
                            'deliveryDateForDay'
                          ].includes(item.prop)
                        "
                      >
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
                            scope.row.productNameError = false
                            scope.row['ROW-ERROR'] = false
                          "
                        />
                        <template v-else>{{ scope.row[item.prop] }}</template>

                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                      </template>
                      <template v-else-if="item.prop === 'internalPartNo'">
                        <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
                          scope.row.internalPartNo
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'externalPartNo'">
                        <!-- <el-autocomplete
                          style="width: 98%"
                          v-model="scope.row.externalPartNo"
                          :fetch-suggestions="
                            (queryString, cb) => queryPositionSugg(queryString, cb, scope.row)
                          "
                          placeholder
                          :clearable="false"
                          :maxlength="200"
                          v-if="scope.row.productType !== '2'"
                        /> -->

                        <!-- <el-select
                          style="width: 98%"
                          v-model="scope.row.externalPartNoListJson"
                          placeholder=""
                          multiple
                          collapse-tags
                          class="log-msg-ellipsis"
                          v-if="(scope.row.externalPartNoList || []).length > 0"
                        >
                          <el-option
                            v-for="item in scope.row.externalPartNoList"
                            :key="item"
                            :label="item"
                            :value="item"
                          >
                          </el-option>
                        </el-select> -->
                        <span>{{ (scope.row.externalPartNoListJson || []).join(', ') }}</span>
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
                        <!-- <el-input
                          v-if="scope.row.isAdhocEntry === '1' || scope.row.isCustomProduct === '1'"
                          style="width: 98%"
                          :title="scope.row.description"
                          v-model="scope.row.description"
                          :maxlength="7000"
                        /> -->
                        <descriptionEditDlg v-model="scope.row.description" :maxlength="7000" />

                        <!-- <template v-else>
                          <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
                        </template> -->
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
                        <span :title="showUomLabel(scope.row.uom)" v-else>
                          {{ scope.row.uom }}
                        </span>
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

                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                      </template>
                      <template v-else-if="item.prop === 'uomCoefficient'">
                        <div class="flex" style="width: 98%">
                          <el-input-number
                            class="flex-1"
                            :disabled="scope.row.uom === scope.row.basicUom"
                            v-model="scope.row.uomCoefficient"
                            controls-position="right"
                            :precision="3"
                            v-thousandSplit="{ precision: 3 }"
                            :min="0.001"
                            :max="99999.999"
                            @change="
                              scope.row.uomCoefficientError = false
                              scope.row['ROW-ERROR'] = false
                            "
                          />
                          <span class="fs-0 ml10" :title="showUomLabel(scope.row.basicUom)">{{
                            scope.row.basicUom
                          }}</span>
                        </div>
                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                      </template>
                      <template v-else-if="item.prop === 'qty'">
                        <el-input-number
                          style="width: 98%"
                          v-model="scope.row.qty"
                          controls-position="right"
                          v-thousandSplit="{ precision: scope.row.decimalNum, keepDec: false }"
                          :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                          :max="999999"
                          @change="changeAdhocEntryQty(scope.row)"
                          v-if="scope.row.isAdhocEntry === '1' || scope.row.isCustomProduct === '1'"
                          :key="'qty11' + scope.row.decimalNum"
                        />
                        <el-input-number
                          v-else
                          v-thousandSplit="{ precision: scope.row.decimalNum }"
                          style="width: 98%"
                          v-model="scope.row.qty"
                          controls-position="right"
                          :precision="scope.row.decimalNum"
                          :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                          :max="999999"
                          @change="
                            scope.row.qtyError = false
                            scope.row['ROW-ERROR'] = false
                          "
                        />

                        <TablePropError v-if="scope.row[item.prop + 'Error']" />

                        <!-- <template v-else>{{ scope.row.volumeShowStr }}</template> -->
                      </template>

                      <template v-else-if="item.prop === 'deliveryDateForDay'">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          style="width: 98%"
                          v-model="scope.row.deliveryDateForDay"
                          controls-position="right"
                          :precision="0"
                          :min="1"
                          :max="999999"
                          @change="changeExpectedDeliveryDate(scope.$index, scope.row)"
                        />
                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                      </template>
                      <template v-else-if="item.prop === 'deliveryDate'">
                        <el-date-picker
                          v-model="scope.row.deliveryDate"
                          :picker-options="timeDatePickerOptions"
                          @change="changeDeliveryDate(scope.$index, scope.row)"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          style="width: 98%"
                          placeholder=""
                          clearable
                        ></el-date-picker>
                        <TablePropError v-if="scope.row[item.prop + 'Error']" />

                        <!-- <template v-else>{{ scope.row.volumeShowStr }}</template> -->
                      </template>
                      <template v-else-if="item.prop === 'remarks'">
                        <descriptionEditDlg
                          v-model="scope.row.remarks"
                          :maxlength="200"
                        />
                      </template>
                      <template v-else-if="item.prop === 'productType'">
                        <!-- <span v-if="scope.row.productType === '1'">{{
                          $t('PURCHASE.product')
                        }}</span>
                        <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
                        <el-select
                          style="width: 98%"
                          v-model="scope.row.productType"
                          placeholder=""
                          filterable
                          v-if="scope.row.isAdhocEntry === '1'"
                        >
                          <el-option
                            v-for="item in (dict.type.product_type || []).filter(
                              (i) => ['1', '2'].indexOf(i.value) !== -1
                            )"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                        <span v-else>{{
                          selectDictLabel(dict.type.product_type, scope.row.productType)
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'qtyOnHand'">
                        <template>{{
                          $numberStr(scope.row[item.prop], scope.row.decimalNum)
                        }}</template>
                      </template>
                      <template v-else-if="item.prop === 'rejectedQtyForBasic'">
                        <template>{{
                          $numberStr(scope.row[item.prop], scope.row.decimalNum)
                        }}</template>
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
              <el-form @submit.native.prevent label-width="180px">
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')" prop="remarks">
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
              </el-form>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
    <selectRequiredByTable
      ref="selectRequiredByTable"
      :departmentId="form.departmentId"
      @update="updateRequiredBy"
    />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
    <selectProductTable
      ref="selectProductTable"
      :warehouseId="form.dropShipping !== '1' ? form.warehouseId : ''"
      :dropShipping="form.dropShipping"
      :costProjectId="form.costProjectId"
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
import { queryUserDepartment } from '@/api/system/user'
import {
  saveDraftPurchaseRequisite,
  savePurchaseRequisite,
  queryCanSelectWarehouseDefaultWarehouse,
  queryDropShippingAddressOptions,
  queryPRCanSelectWarehouseList
} from '@/api/purchaseManagement/purchaseRequisition'
import { queryAllUomList } from '@/api/system/uom'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import Sortable from 'sortablejs'
import selectRequiredByTable from '@/views/purchaseManagement/purchaseRequisition/components/selectRequiredByTable.vue'
import selectWarehouseTable from '@/views/purchaseManagement/purchaseRequisition/components/selectWarehouseTable.vue'
import selectProductTable from './components/selectProductTable'
import selectCostProjectTable from '@/views/purchaseManagement/purchaseRequisition/components/selectCostProjectTable.vue'
import selectDropShippingAddress from './components/selectDropShippingAddress'
import { queryUsersNoPage } from '@/api/organization/corporate'
import { queryCanSelectCostProjectListForPage } from '@/api/projectManagement/project'
import { formDirtyClass } from '@/mixins/formDirtyClass'
export default {
  dicts: [
    'pr_reason_type',
    'p_required_type',
    'valuation_unit',
    'product_type',
    'business_contact_person_title'
  ],
  mixins: [pageMixin],
  components: {
    selectDropShippingAddress,
    selectRequiredByTable,
    selectWarehouseTable,
    selectProductTable,
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
      submitLoading: false,
      btnLoading: false,
      saveKey: '27',
      savePath: 'purchaseMTable',
      activeNames: ['1', '2'],
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
        contactPersonName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        email: [
          /* {
            required: true,
            trigger: ['blur', 'change'],
            message: this.$t('ui.reqMsg')
          }, */
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ],
        mobilePhone: [{ required: true, validator: validatorPhoneNo, trigger: 'change' }],
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
      requiredByOptions: [],
      requiredByLoading: false,
      costProjectOptions: [],
      costProjectOptionsLoading: false,

      dropShippingAddressOptions: [],
      warehouseOptions: [],
      warehouseOptionsLoading: false,

      /* 表格部分 */
      columns: [
        /* {
          prop: 'productType',
          label: vm.$t('PURCHASE.productClass'),
          visible: true,
          colMinWidth: 120,
          tooltip: true,
          fixed: true,
          sortable: 'custom'
        }, */
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          tooltip: true,
          colMinWidth: 180,
          required: true,
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
          prop: 'externalPartNo',
          label: vm.$t('PURCHASE.externalPartNo'),
          visible: true,
          colMinWidth: 180,
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PURCHASE.alias'),
          visible: true,
          colMinWidth: 120,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          colMinWidth: 120,
          tooltip: false,
          sortable: 'custom'
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PURCHASE.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   fixedWidth: 180,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
        {
          prop: 'uom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          colMinWidth: 120,
          tooltip: true,
          sortable: 'custom'
        },
        /* {
          prop: 'qtyOnHand',
          label: vm.$t('PURCHASE.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true,
          sortable: 'custom'
        }, */
        {
          prop: 'qty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          colMinWidth: 120,
          tooltip: true,
          sortable: 'custom'
        },
        // {
        //   prop: 'uomCoefficient',
        //   label: vm.$t('PURCHASE.ratio'),
        //   visible: true,
        //   colMinWidth: 160,
        //   required: true,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
        /* {
          prop: 'stockInQty',
          label: vm.$t('PURCHASE.stockInQty'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        }, */
        // {
        //   prop: 'rejectedQtyForBasic',
        //   label: vm.$t('PURCHASE.rejectedQty1'),
        //   visible: true,
        //   minWidth: 200,
        //   padding: 60,
        //   tooltip: true
        // },
        {
          prop: 'deliveryDate',
          label: vm.$t('PURCHASE.requestedReceiptDate'),
          visible: true,
          colMinWidth: 160,
          required: true,
          tooltip: true,
          sortable: 'custom'
        },
        // {
        //   prop: 'deliveryDateForDay',
        //   label: vm.$t('PURCHASE.deliveryDateForDay'),
        //   visible: true,
        //   minWidth: 140,
        //   fixedWidth: 140,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
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
          // return time.getTime() < Date.now() - 8.64e7
          return time.getTime() < Date.now() - 90 * 24 * 60 * 60 * 1000
        }
      },
      tableList: [],
      selected: [],
      allUomList: [],
      sortableDom: undefined,
      rowIdKey: 'productId',
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
      createTableList: []
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
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.rowId = this.propRowId
        this.handleAdd()
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
    addAdhocEntryAuth() {
      return this.checkPermi(['purchaseManagement:purchaseRequisition:addAdhocEntry'])
    },
    addCustomProductAuth() {
      return this.checkPermi(['purchaseManagement:purchaseRequisition:addCustomProduct'])
    },
    // 列表是否包含定制产品
    projectCodeIsReq() {
      /* 直运开关 === '1' 项目也是必填的 */
      // if (this.form.dropShipping === '1') return true
      // if (!this.tableList || this.tableList.length <= 0) return false
      // return this.tableList.some((x) => x.isCustomProduct === '1')
      /* Yvonne 提出, 定制产品可能没有项目 */
      return false
    },
    tableListIncludeCustomProduct() {
      if (!this.tableList || this.tableList.length <= 0) return false
      return this.tableList.some((x) => x.isCustomProduct === '1')
    },

    // 列表是否包含对接产品
    tableListIncludeSystemDocking() {
      if (!this.tableList || this.tableList.length <= 0) return false
      return this.tableList.some((x) => x.isSystemDocking === '1')
    },
    aliasIsHide() {
      return !this.tableList.find((x) => x.alias)
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      const filterProps1 = []
      if (this.aliasIsHide) {
        filterProps1.push('alias')
      }
      arr = arr.filter((x) => !filterProps1.includes(x.prop))
      return arr
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  /* beforeDestroy() {},
  async deactivated() {
    await this.$modal.confirm('是否保存？').then(() => {})
  }, */
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  mounted() {},
  methods: {
    queryDropShippingAddressOptions() {
      queryDropShippingAddressOptions().then((res) => {
        this.dropShippingAddressOptions = res.data || []
      })
      /* const list = [
        {
          receiveAddressName: '直运地址1',
          title: 'Mrs',
          contactPersonName: '甘雨',
          email: '1232@qq.com',
          mobileCode: '+86',
          mobileNum: '123',
          mobilePhone: '+86 123'
        },
        {
          receiveAddressName: '直运地址2',
          title: 'Mr',
          contactPersonName: '钟离',
          email: '22222@qq.com',
          mobileCode: '+93',
          mobileNum: '22222',
          mobilePhone: '+94 22222'
        }
      ]
      this.dropShippingAddressOptions = list */
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
    handleSortChange({ prop, order }) {
      this.handlerTableList()
      // 如果排序被清除，按稳定索引恢复自然顺序
      if (!prop || !order) {
        this.tableList = (this.tableList || []).slice().sort((a, b) => {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        })
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
      this.queryDropShippingAddressOptions()
      this.queryCanSelectCostProjectListForPage()
      this.queryPRCanSelectWarehouseList()
    },
    getFormJson() {
      const param = { ...this.form }
      param.createTableList = this.createTableList
      const myFileIds = this.$refs.uploadRef && this.$refs.uploadRef.getFileIds()
      param.commonFileList = myFileIds
      return JSON.stringify(param)
    },
    reset() {
      this.form = {
        dropShipping: '0',
        reasonType: undefined,
        reason: undefined,
        requiredType: '1',
        purchaseRequisiteStatus: undefined,
        requiredBy: this.$store.state.user.nickName,
        requiredId: this.$store.state.user.userId,
        createdBy: this.$store.state.user.nickName,
        receiveAddressName: ''
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
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form1')
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
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/purchaseRequisition' })
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
            this.updateWarehouse(row)
          }, 0)
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
          this.deptOptionsLoading = false
          this.deptOptions = res.data || []
          setTimeout(() => {
            this.deptOptions.forEach((item) => {
              if (item.isDefault === '1') {
                this.$set(this.form, 'departmentId', item.departmentId)
                this.$set(this.form, 'departmentName', item.departmentName)
                this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
                this.queryRequiredByOptions()
              }
            })
          }, 200)
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
        })
        .catch(() => {
          this.deptOptionsLoading = false
        })
    },
    departmentChange(value) {
      const item = this.deptOptions.find((item) => item.departmentId === value) || {}
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
      if (this.form.requiredId !== this.$store.state.user.userId) {
        this.requiredByClear()
      }
      this.queryRequiredByOptions()
    },

    queryRequiredByOptions() {
      if (!this.form.departmentId) {
        this.requiredByOptions = []
        this.requiredByLoading = false
        this.queryRBTimer = Date.now()
      }
      const params = {
        departmentId: this.form.departmentId
      }
      const timer = Date.now()
      this.queryRBTimer = timer
      this.requiredByLoading = true
      queryUsersNoPage(params)
        .then((response) => {
          if (this.queryRBTimer !== timer) return
          this.requiredByLoading = false
          this.requiredByOptions = response.data || []
        })
        .catch(() => {
          this.requiredByLoading = false
        })
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

    queryCanSelectCostProjectListForPage() {
      this.costProjectOptionsLoading = true
      queryCanSelectCostProjectListForPage({
        pageNum: 1,
        pageSize: 9999
      })
        .then((res) => {
          this.costProjectOptionsLoading = false
          this.costProjectOptions = res.rows || []
        })
        .catch(() => {
          this.costProjectOptionsLoading = false
        })
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

    dropShippingChange() {
      /* const newDetailList = this.createTableList.filter((item) => {
        return item.isCustomProduct !== '1'
      })
      this.createTableList = newDetailList
      this.tableList = this.createTableList */
      // this.warehouseNameClear()
      /* if (this.form.dropShipping !== '1') {
        this.queryCanSelectWarehouseDefaultWarehouse()
      } */
    },

    queryPRCanSelectWarehouseList() {
      this.warehouseOptionsLoading = true
      queryPRCanSelectWarehouseList({
        pageNum: 1,
        pageSize: 9999,
        warehouseType: '1',
        menuPerms: this.menuKey.PR
      })
        .then((res) => {
          this.warehouseOptionsLoading = false
          this.warehouseOptions = res.rows || []
        })
        .catch(() => {
          this.warehouseOptionsLoading = false
        })
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
    titleChange() {
      if (this.form.contactPersonName) {
        this.$refs.form1.validateField('contactPersonName')
      }
    },
    reasonTypeChange() {
      this.$set(this.form, 'reason', '')
    },
    /* 表单部分End */

    /* 表格部分Start */
    queryPositionSugg(queryString, cb, row) {
      let positionList = []
      if (row.externalPartNoOptions) {
        positionList = row.externalPartNoOptions
      } else {
        const list = row.externalPartNoList || []
        row.externalPartNoOptions = list.map((externalPartNo) => {
          return { value: externalPartNo }
        })
        positionList = row.externalPartNoOptions
      }

      let results
      if (queryString) {
        results = positionList.filter(
          (p) => p.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      } else {
        results = positionList
      }
      cb(results)
    },

    queryAllUomList() {
      console.log(this.$route)

      // GET 请求 src\api\system\uom.js
      queryAllUomList({ menuPerms: this.menuKey.PR }).then((res) => {
        this.allUomList = res.data || []
      })
    },
    serviceUomChange(row) {
      if (row.uom === row.basicUom) {
        this.$set(row, 'uomCoefficient', 1)
      }
    },
    adhocEntryUomChange(row) {
      this.$set(row, 'basicUom', row.uom)
      this.$set(row, 'uomError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    purchaseUomChange(row) {
      const selectItem = row.uomDataList.find((item) => item.uomName === row.uom)
      this.$set(row, 'uomCoefficient', selectItem.uomCoefficient)
      this.queryRowTaxAmount(row)
      this.$set(row, 'uomError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    changeAdhocEntryQty(row) {
      this.$set(row, 'qtyError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.$nextTick(() => {
        if (row.qty) {
          this.$set(row, 'qty', this.$num(row.qty, row.decimalNum))
        }
      })
    },
    changeExpectedDeliveryDate(index, row) {
      this.$set(row, 'deliveryDateForDayError', false)
      this.$set(row, 'ROW-ERROR', false)
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.deliveryDateForDay) {
          const oldExpectedDeliveryDate = this.tableList.find(
            (item, index) => index > 0 && item.deliveryDateForDay
          )
          if (oldExpectedDeliveryDate) {
            const msg = topRow.deliveryDateForDay
            this.$modal
              .confirm(this.$t('PURCHASE.expectedDateForDayConfirm').replace('$1', msg))
              .then(() => {
                this.tableList.forEach((row) => {
                  this.$set(row, 'deliveryDateForDay', topRow.deliveryDateForDay)
                })
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'deliveryDateForDay', topRow.deliveryDateForDay)
            })
          }
        }
      }
    },
    changeDeliveryDate(index, row) {
      this.$set(row, 'deliveryDateError', false)
      this.$set(row, 'ROW-ERROR', false)
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.deliveryDate) {
          const oldDeliveryDate = this.tableList.find(
            (item, index) => index > 0 && item.deliveryDate
          )
          if (oldDeliveryDate) {
            const msg = this.parseTime(topRow.deliveryDate, this.fmtForYmd)
            this.$modal
              .confirm(this.$t('PURCHASE.committedDateConfirm').replace('$1', msg))
              .then(() => {
                this.tableList.forEach((row) => {
                  this.$set(row, 'deliveryDate', topRow.deliveryDate)
                  this.$set(row, 'deliveryDateError', false)
                  this.$set(row, 'ROW-ERROR', false)
                })
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'deliveryDate', topRow.deliveryDate)
              this.$set(row, 'deliveryDateError', false)
              this.$set(row, 'ROW-ERROR', false)
            })
          }
        }
      }
    },

    handleSddAdhocEntry() {
      this.createTableList.push({
        isAdhocEntry: '1',
        productType: '1',
        includeDecimal: '1',
        uomCoefficient: 1,
        decimalNum: 3,
        customId: +new Date(),
        deliveryDate:
          this.tableList.length > 0 && this.tableList[0].deliveryDate
            ? this.tableList[0].deliveryDate
            : ''
      })
      // assign stable index for newly added adhoc entry
      const newRow = this.createTableList[this.createTableList.length - 1]
      if (newRow && newRow._stableIndex === undefined) {
        this._stableCounter = (this._stableCounter || 0) + 1
        this.$set(newRow, '_stableIndex', this._stableCounter)
      }
      this.tableList = this.createTableList
      this.$refs.tables && this.$refs.tables.clearSort()
    },
    handleAddCustomProduct() {
      this.createTableList.push({
        isCustomProduct: '1',
        productType: '1',
        includeDecimal: '1',
        uomCoefficient: 1,
        decimalNum: 3,
        customId: +new Date(),
        deliveryDate:
          this.tableList.length > 0 && this.tableList[0].deliveryDate
            ? this.tableList[0].deliveryDate
            : ''
      })
      // assign stable index for newly added custom product
      const newRow2 = this.createTableList[this.createTableList.length - 1]
      if (newRow2 && newRow2._stableIndex === undefined) {
        this._stableCounter = (this._stableCounter || 0) + 1
        this.$set(newRow2, '_stableIndex', this._stableCounter)
      }
      this.tableList = this.createTableList
      this.$refs.tables && this.$refs.tables.clearSort()
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
        const topRow = this.createTableList[0]
        if (topRow && topRow.deliveryDate) {
          rows.forEach((row) => {
            this.$set(row, 'deliveryDate', topRow.deliveryDate)
          })
        }

        this.createTableList.forEach((row) => {
          if (row[this.rowIdKey]) {
            const index = rows.findIndex((item) => row[this.rowIdKey] === item[this.rowIdKey])
            if (index !== -1) {
              rows[index] = row
            }
          }
        })
        rows.forEach((x) => {
          const index = this.createTableList.findIndex(
            (item) => x[this.rowIdKey] === item[this.rowIdKey]
          )
          if (index === -1) {
            if (x.externalPartNoList) {
              this.$set(x, 'externalPartNoListJson', x.externalPartNoList)
            }
          }
        })
        // this.tableList = [...this.tableList, ...rows]
        // this.tableList = rows
        // this.createTableList = rows
        // preserve or assign stable indices for incoming rows
        rows.forEach((r) => {
          if (r && r._stableIndex === undefined) {
            this._stableCounter = (this._stableCounter || 0) + 1
            r._stableIndex = this._stableCounter
          }
        })
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
        // this.initDraggable()
      } else {
        this.tableList = []
        this.createTableList = []
      }
      this.$refs.tables && this.$refs.tables.clearSort()
    },
    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 选中多个删除
    handleDelete() {
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          this.tableList = this.tableList.filter((row) => {
            if (this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])) {
              return false
            }
            return true
          })
          this.changeTableList()
          this.selected = []
        })
        .catch(() => {})
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.createTableList = this.createTableList.filter((x) =>
          x.customId ? x.customId !== row.customId : x[this.rowIdKey] !== row[this.rowIdKey]
        )
        const findIndex = this.selected.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        if (findIndex !== -1) {
          this.selected.splice(findIndex, 1)
        }
      })
    },
    // 表格全选
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selected.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selected.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[this.rowIdKey])
        vm.selected = vm.selected.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    // 行单个选择
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selected.length; i++) {
        if (vm.selected[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selected.splice(i, 1)
        }
      }
      vm.selected.push(row)
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'table-SelectedRow-bgcolor'
      }
      if (this.tableList && this.tableList.length > 0 && rowIndex === this.tableList.length - 1) {
        const { isAdhocEntry } = this.tableList[this.tableList.length - 1]
        if (isAdhocEntry && isAdhocEntry === '1') {
          color = 'high-row'
        }
      }
      if (row['ROW-ERROR']) {
        color = 'required-row'
      }
      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (
        this.tableList.find((item) => !item[column.property] && item[column.property + 'Error'])
      ) {
        cellClass = 'is-required-table-cell'
      }
      return cellClass
    },
    initDraggable() {
      this.destroyDraggable()
      setTimeout(() => {
        const el = this.$refs.tables.$el.querySelectorAll(
          '.el-table__fixed-body-wrapper > table > tbody'
        )[0]
        this.sortableDom = Sortable.create(el, {
          handle: '.allowDrag',
          animation: 100,
          ghostClass: 'blue-background-class',
          onEnd: (evt) => {
            if (evt.oldIndex === evt.newIndex) return
            const targetRow = this.tableList.splice(evt.oldIndex, 1)[0]
            this.tableList.splice(evt.newIndex, 0, targetRow)
          }
        })
      }, 300)
    },
    destroyDraggable() {
      if (this.sortableDom) {
        this.sortableDom.destroy()
        this.sortableDom = undefined
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
    errorMessage(code) {
      this.scrollPageToTable()

      let rowIndex
      this.tableList.forEach((item, index) => {
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
      })
      this.$nextTick(() => {
        this.scrollToErrorColumn()
      })
    },
    /* 表格部分End */

    async submitForm(submitType, isConfirm = true, gotoRoute) {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      let valid1 = false
      if (submitType === 'save') {
        valid1 = true
        this.collapseWarningForBasicInfo = false
        this.$refs.form1.clearValidate()
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
        let param = { ...this.form }
        const detailList = this.createTableList
        if (detailList.length <= 0 && submitType !== 'save') {
          this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
          this.collapseWarningForProductInfo = true
          return
        }
        if (detailList.length > 0 && submitType !== 'save') {
          const productNameReq = detailList.find((item) => {
            return !(item.productName || '').trim()
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
            return !this.$resultOfBoolean(item.uom)
          })
          if (uomReq) {
            this.errorMessage('uom')

            this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.uom')))
            this.collapseWarningForProductInfo = true
            return
          }
          const qtyReq = detailList.find((item) => {
            return !this.$resultOfBoolean(item.qty)
          })
          if (qtyReq) {
            this.errorMessage('qty')

            this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qty')))
            this.collapseWarningForProductInfo = true
            return
          }

          /* const uomCoefficientReq = detailList.find((item) => {
            return !this.$resultOfBoolean(item.uomCoefficient)
          })
          if (uomCoefficientReq) {
            this.errorMessage('uomCoefficient')

            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.ratio'))
            )
            this.collapseWarningForProductInfo = true
            return
          } */

          const deliveryDateForDay = detailList.find((item) => {
            return !this.$resultOfBoolean(item.deliveryDate)
          })
          if (deliveryDateForDay) {
            this.errorMessage('deliveryDate')

            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.requestedReceiptDate'))
            )
            this.collapseWarningForProductInfo = true
            return
          }
        }

        // const deliveryDateReq = detailList.find((item) => {
        //   return !this.$resultOfBoolean(item.deliveryDate)
        // })
        // if (deliveryDateReq) {
        //   this.$modal.msgError(
        //     this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.scheduledDeliveryDate'))
        //   )
        //   this.collapseWarningForProductInfo = true
        //   return
        // }
        this.collapseWarningForProductInfo = false
        param.purchaseRequisiteDetailList = detailList
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

        // 外部编号数组转JSON
        param.purchaseRequisiteDetailList.forEach((x) => {
          if (x.externalPartNoListJson) {
            this.$set(x, 'externalPartNo', x.externalPartNoListJson.join(','))
            x.externalPartNoListJson = JSON.stringify(x.externalPartNoListJson)
          } else {
            this.$set(x, 'externalPartNo', undefined)
          }
        })
        param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('PURCHASE.prSaveConfirm')
          successMsg = this.$t('PURCHASE.prSaveSuccess')
          submitFn = saveDraftPurchaseRequisite
        } else {
          confirmMsg = this.$t('PURCHASE.prSubmitConfirm')
          successMsg = this.$t('PURCHASE.prSubmitSuccess')
          submitFn = savePurchaseRequisite
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
              const pageItem = formDirtyClass.routeStatusData[this.$route.name]
              if (pageItem) {
                pageItem.isSaveSuccess = true
              }
              this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
              this.cancel()
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
            })
        } else {
          this.submitLoading = true
          return submitFn(param)
            .then((response) => {
              const pageItem = formDirtyClass.routeStatusData[this.$route.name]
              if (pageItem) {
                pageItem.isSaveSuccess = true
              }
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
          const newDetailList = param.purchaseRequisiteDetailList.filter((item) => {
            return !param.noCanSelectProductIdList.includes(item.productId)
          })
          param.purchaseRequisiteDetailList = newDetailList
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
              const pageItem = formDirtyClass.routeStatusData[this.$route.name]
              if (pageItem) {
                pageItem.isSaveSuccess = true
              }
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
      // isConfirm
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
