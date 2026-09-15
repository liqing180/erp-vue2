<template>
  <FormPageLayoutTabs v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" @click="handleSaveDraft" v-if="saveDraftBtnShow"
        >{{ $t('uiBtn.saveDraft') }}
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
                >{{ item.businessNo }}
              </el-dropdown-item>
            </div>
          </el-scrollbar>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>

    <template v-slot:content>
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
              ref="form"
              :model="form"
              @submit.native.prevent
              :rules="rules"
              label-width="180px"
              :disabled="comDisFrom"
            >
              <div v-if="form.projectProductionType === '1'" key="basicInfo111">
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.salesOrderNo')}`" prop="salesOrderNo">
                      <SelectInput
                        :value="form.salesOrderNo"
                        :title="form.salesOrderNo"
                        @click="openSalesOrderTable"
                        @clear="salesOrderNoClear"
                        :clearable="true"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.associatedProjectName')}`">
                      <el-input
                        :value="form.projectName"
                        :title="form.projectName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.productionNo')}`">
                      <el-input
                        v-model="form.projectProductionNo"
                        :title="form.projectProductionNo"
                        class="form-wd"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :class="[isModified('outWarehouseName')]"
                      :label="`${$t('PRODUCT.outboundWarehouse')}`"
                      prop="outWarehouseId"
                    >
                      <SelectInput
                        clearable
                        :value="form.outWarehouseName"
                        :title="form.outWarehouseName"
                        @click="openWarehouseFormTable"
                        @clear="warehouseFromClear"
                        :disabled="comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :class="[isModified('inWarehouseName')]"
                      :label="`${$t('PRODUCT.inboundWarehouse')}`"
                      prop="inWarehouseId"
                    >
                      <SelectInput
                        clearable
                        :value="form.inWarehouseName"
                        :title="form.inWarehouseName"
                        @click="openWarehouseToTable"
                        @clear="warehouseToClear"
                        :disabled="comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.project_production_status,
                            form.projectProductionStatus
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
                      :class="[isModified('picUserBy')]"
                      :label="`${$t('PRODUCT.pic')}`"
                      prop="picUserBy"
                    >
                      <SelectInput
                        :value="form.picUserBy"
                        :title="form.picUserBy"
                        @clear="picUserNameClear"
                        clearable
                        @click="openPicTable"
                        class="form-wd"
                        :disabled="comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.productionType')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.project_production_type,
                            form.projectProductionType
                          )
                        "
                        class="form-wd"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="$t('ui.remarks')"
                      prop="remarks"
                      :class="[isModified('remarks')]"
                    >
                      <MyInput
                        type="textarea"
                        v-model="form.remarks"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="300"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('SALES.logisticsType')}`">
                      <el-radio-group v-model="form.logisticsType" disabled>
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
              </div>
              <div v-if="form.projectProductionType === '2'" key="basicInfo222">
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.salesOrderNo')}`" prop="salesOrderNo">
                      <el-input
                        :value="form.salesOrderNo"
                        :title="form.salesOrderNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerName')}`">
                      <el-input
                        :value="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.productionNo')}`">
                      <el-input
                        v-model="form.projectProductionNo"
                        :title="form.projectProductionNo"
                        class="form-wd"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.outboundWarehouse')}`">
                      <el-input
                        v-model="form.outWarehouseName"
                        :title="form.outWarehouseName"
                        class="form-wd"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.productionType')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.project_production_type,
                            form.projectProductionType
                          )
                        "
                        class="form-wd"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.project_production_status,
                            form.projectProductionStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="$t('ui.remarks')"
                      prop="remarks"
                      :class="[isModified('remarks')]"
                    >
                      <MyInput
                        type="textarea"
                        v-model="form.remarks"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="300"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </el-collapse-item>
        </div>
        <div class="form-card mt10" v-show="form.projectProductionType === '1'">
          <el-collapse-item name="4">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PRODUCT.productionPersonnel')"
              :warning="collapseWarningForProductionPersonnel"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <picTable
                ref="picTable"
                :formData="form"
                :comDisFrom="comDisFrom"
                :modifyHighlight="modifyHighlight"
                :basicUpdateProps="basicUpdateProps"
              />
            </div>
          </el-collapse-item>
        </div>
        <div class="form-card mt10" v-if="form.projectProductionType === '1'">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PRODUCT.productionAccessories')"
              :warning="collapseWarningForProductInfo"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                  <el-button
                    @click="handleBtnAdd"
                    :disabled="loading || !form.salesOrderId || !form.outWarehouseId"
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    v-if="!comDisFrom"
                    >{{ $t('uiBtn.add') }}</el-button
                  >
                </el-col>
              </el-row>
              <el-table
                border
                max-height="600px"
                :data="form.projectProductionAccessoriesList"
                v-loading="loading"
                :row-class-name="tableRowClassName"
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
                  v-for="item in visibleColumn"
                  :key="item.prop + item.colSortIndex"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :min-width="item.minWidth"
                  :show-overflow-tooltip="item.tooltip"
                  :fixed="item.fixed"
                  :sortable="item.sortable"
                  :align="item.align || 'left'"
                  header-align="center"
                >
                  <template slot="header" slot-scope="{ column }">
                    <span v-if="['productionQty'].includes(item.prop)">
                      <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                    </span>
                    <span v-else>{{ column.label }}</span>
                  </template>
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'productionQty'">
                      <el-input-number
                        style="width: 98%"
                        v-model="scope.row.productionQty"
                        controls-position="right"
                        :min="1"
                        :max="scope.row.qty * 1"
                        @change="qtyChange(scope.row)"
                        v-if="!comDisFrom"
                      />
                      <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                    <template v-else-if="item.prop === 'remarks'">
                      <descriptionEditDlg
                        v-model="scope.row.remarks"
                        :maxlength="200"
                        :disabled="comDisFrom"
                      />
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
                        class="el-icon-delete pointer"
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
        <div class="form-card mt10" v-if="form.projectProductionType === '2'">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PRODUCT.productionMixDesign')"
              :warning="collapseWarningForProductInfo"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <el-table
                border
                max-height="600px"
                :data="form.projectProductionMixDesignList"
                v-loading="loading"
                :row-class-name="tableRowClassName"
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
                  v-for="item in visibleCurColumns3"
                  :key="item.prop + item.colSortIndex"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :min-width="item.minWidth"
                  :show-overflow-tooltip="item.tooltip"
                  :fixed="item.fixed"
                  :sortable="item.sortable"
                  :align="item.align || 'left'"
                  header-align="center"
                >
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'plannedProductionQty'">
                      {{ $numberStr(scope.row[item.prop], 3) }}
                    </template>
                    <template v-else-if="item.prop === 'productionQty'">
                      {{ $numberStr(scope.row[item.prop], 3) }}
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
                        class="el-icon-delete pointer"
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
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PRODUCT.materialConsumption')"
              :warning="collapseWarningForContent"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <el-row :gutter="10" class="mb8">
                <right-toolbar
                  :saveKey="form.projectProductionType === '1' ? '13' : '14'"
                  :showSearchBtn="false"
                  :showRefreshBtn="false"
                  @queryTable="queryTable"
                  :columnsInit="curColumns"
                  :columns="configCurColumn"
                ></right-toolbar>
              </el-row>
              <el-table
                border
                ref="tables"
                max-height="600px"
                :row-key="rowIdKey"
                :data="form.projectProductionConsumptionList"
                lazy
                :default-expand-all="true"
                :tree-props="{
                  children: 'childProjectTemplateContentList',
                  hasChildren: 'hasChildren'
                }"
                v-loading="loading"
                :header-cell-class-name="cellClass"
                :row-class-name="tableRowClassName"
                class="table"
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
                  v-for="item in visibleCurColumns"
                  :key="item.prop + item.colSortIndex"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :min-width="item.minWidth"
                  :show-overflow-tooltip="item.tooltip"
                  :fixed="item.fixed"
                  :sortable="item.sortable"
                  :align="item.align || 'left'"
                  header-align="center"
                >
                  <template slot="header" slot-scope="{ column }">
                    <span v-if="['consumptionQty'].includes(item.prop)">
                      <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                    </span>
                    <span v-else>{{ column.label }}</span>
                  </template>
                  <template slot-scope="scope">
                    <template v-if="scope.row.bomAccessoriesType !== '2'">
                      <template v-if="item.prop === 'productType'">
                        <!-- <span v-if="scope.row.productType === '1'">{{
                          $t('PRODUCT.product')
                        }}</span>
                        <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
                        <span>{{
                          selectDictLabel(dict.type.product_type, scope.row.productType)
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'unitCost'">
                        <el-input-number
                          style="width: 98%"
                          :precision="2"
                          v-thousandSplit="{ precision: 2 }"
                          :min="0.01"
                          :max="999999999.99"
                          v-model="scope.row.unitCost"
                          controls-position="right"
                          v-if="!comDisFrom && scope.row.isCanUpdateUnitCost === '1'"
                        />
                        <span v-else>{{ $numberStr(scope.row[item.prop], 2) }}</span>
                      </template>
                      <template v-else-if="item.prop === 'plannedConsumptionQty'">
                        <span
                          v-if="scope.row.customIndex !== 1 || form.projectProductionType === '2'"
                        >
                          {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
                        </span>
                      </template>
                      <template v-else-if="item.prop === 'consumptionQty'">
                        <el-input-number
                          style="width: 98%"
                          v-model="scope.row.consumptionQty"
                          controls-position="right"
                          :precision="scope.row.includeDecimal === '1' ? 3 : 0"
                          v-thousandSplit="{ precision: scope.row.includeDecimal === '1' ? 3 : 0 }"
                          :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                          :max="maxQty(scope.row)"
                          :disabled="scope.row.isDisabled === '1' || maxQty(scope.row) === 0"
                          @change="consumptionQtyChange(scope.row)"
                          v-if="!comDisFrom && scope.row.customIndex !== 1"
                        />
                        <span v-else-if="comDisFrom">{{
                          $numberStr(scope.row[item.prop], scope.row.decimalNum)
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'totalCost'">{{
                        $numberStr(scope.row[item.prop], 2)
                      }}</template>
                      <template v-else-if="item.prop === 'referenceAmount'">{{
                        $numberStr(scope.row[item.prop], 2)
                      }}</template>
                      <template v-else-if="item.prop === 'purchaseUnitPrice'">{{
                        $numberStr(scope.row[item.prop], 2)
                      }}</template>
                      <template v-else-if="item.prop === 'dateQuoted'">{{
                        parseTime(scope.row.dateQuoted, fmtForYmdhms)
                      }}</template>
                      <template v-else-if="item.prop === 'qtyTolerance'">
                        <span v-if="scope.row.qtyTolerance < 0" class="text-green">{{
                          $numberStr(scope.row[item.prop], scope.row.decimalNum)
                        }}</span>
                        <span v-else-if="scope.row.qtyTolerance > 0" class="text-red"
                          >+{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span
                        >
                        <span v-else>{{
                          $numberStr(scope.row[item.prop], scope.row.decimalNum)
                        }}</span>
                      </template>
                      <template v-else>{{ scope.row[item.prop] }}</template>
                    </template>
                    <template v-else>
                      <template v-if="item.prop === 'productType'">
                        <!-- <span v-if="scope.row.productType === '1'">{{
                          $t('PRODUCT.product')
                        }}</span>
                        <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
                        <span>{{
                          selectDictLabel(dict.type.product_type, scope.row.productType)
                        }}</span>
                      </template>
                      <template v-if="item.prop === 'productName'">
                        <span v-if="form.projectProductionType === '1'"
                          >{{ scope.row[item.prop] }} ({{ $t('PRODUCT.max') }}
                          {{ scope.row.maxQty }}, {{ $t('PRODUCT.min') }}
                          {{ scope.row.minQty }})</span
                        >
                        <span v-else>{{ scope.row[item.prop] }}</span>
                      </template>
                      <template v-else-if="item.prop === 'plannedConsumptionQty'">
                        {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
                      </template>
                      <template v-else-if="item.prop === 'consumptionQty'">{{
                        $numberStr(scope.row[item.prop], scope.row.decimalNum)
                      }}</template>
                      <template v-else-if="item.prop === 'qtyTolerance'"></template>
                      <template v-else>{{ scope.row[item.prop] }}</template>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
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
    </template>
    <!-- 成品名称 -->
    <selectProductTable ref="selectProductTable" @onSuccess="updateCombinationProductName" />
    <!-- 新增BOM配件 -->
    <selectProductNameTable
      ref="selectProductNameTable"
      :projectTemplateId="form.projectTemplateId"
      :outWarehouseId="form.outWarehouseId"
      @onSuccess="updateTable"
    />
    <selectPicTable ref="selectPicTable" :isSingle="true" @updatePic="updatePic" />
    <selectSalesOrderTable ref="selectSalesOrderTable" @update="updateSalesOrderNo" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />

    <ApprovedDialog
      :id="form.projectProductionId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.projectProductionId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />

    <!-- 取消 -->
    <FormCancelDialog
      :id="form.projectProductionId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <RevisionComparisonDlg ref="RevisionComparisonDlg" />
  </FormPageLayoutTabs>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'
import locale2 from '@/views/system/lang/index'
import selectPicTable from './components/selectPicTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'

import {
  queryProjectProductionById,
  saveDraftProjectProduction,
  saveProjectProduction,
  withdrawProjectTemplate,
  rejectedProjectProduction,
  approvedProjectProduction,
  withdrawApproved,
  cancelledProjectProduction
} from '@/api/projectManagement/projectProduction'
import { queryDefaultWarehouse } from '@/api/inventoryManagement/warehouse'

import selectProductNameTable from './components/selectProductNameTable'
import selectProductTable from './components/selectProductTable'
import selectSalesOrderTable from './components/selectSalesOrderTable.vue'
import picTable from './components/picTable.vue'
import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import RevisionComparisonDlg from './revisionComparisonDlg.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import Big from 'big.js/big.mjs'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  name: 'AddFormPage',
  dicts: ['project_production_status', 'project_production_type', 'logistics_type', 'product_type'],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    selectProductNameTable,
    selectProductTable,
    selectPicTable,
    selectSalesOrderTable,
    selectWarehouseTable,
    picTable,
    ApprovedDialog,
    RejectDialog,
    RevisionComparisonDlg,
    FormCancelDialog,
    SystemOperationLogTable
  },
  data() {
    const vm = this
    return {
      loading: false,
      saveKey: '2',
      activeNames: ['1', '2', '3', '4', '5'],
      submitLoading: false,
      previewPDFLoading: false,
      rowIdKey: 'fullId',
      rowId: '',
      timeId: '',
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList: [],
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      collapseWarningForContent: false,
      collapseWarningForProductionPersonnel: false,
      rules: {
        salesOrderNo: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        picUserBy: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        inWarehouseId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        outWarehouseId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.combinationProductName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70,
          fixed: true
        },
        {
          prop: 'projectTemplateNo',
          label: vm.$t('PRODUCT.combinationProductNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'plannedProductionQty',
          label: vm.$t('PRODUCT.plannedProductionQty'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productionQty',
          label: vm.$t('PRODUCT.productionQty'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          colMinWidth: 120
        },
        {
          prop: 'stockInQty',
          label: vm.$t('PRODUCT.stockInQty'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          colMinWidth: 200
        }
      ],
      columns3: [
        {
          prop: 'mixDesignName',
          label: vm.$t('PRODUCT.mixDesignName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70,
          fixed: true
        },
        {
          prop: 'productCode',
          label: vm.$t('PRODUCT.productCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        /* {
          prop: 'variationName',
          label: vm.$t('PRODUCT.variation'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }, */
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'plannedProductionQty',
          label: vm.$t('PRODUCT.plannedProductionQty'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productionQty',
          label: vm.$t('PRODUCT.productionQty'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          colMinWidth: 120
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          colMinWidth: 200
        }
      ],
      columns1: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PRODUCT.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PRODUCT.availableQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'reservedQty',
          label: vm.$t('PRODUCT.reservedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'plannedConsumptionQty',
          label: vm.$t('PRODUCT.plannedConsumptionQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'consumptionQty',
          label: vm.$t('PRODUCT.consumptionQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'stockOutQty',
          label: vm.$t('PRODUCT.outboundQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
      ],
      columns4: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'plannedConsumptionQty',
          label: vm.$t('PRODUCT.plannedConsumptionQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'consumptionQty',
          label: vm.$t('PRODUCT.consumptionQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qtyTolerance',
          label: vm.$t('SALES.qtyTolerance'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
      ],
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0',
        isCanPreviewPDF: '0'
      },
      initContent: '',
      config: {
        width: '100%', // px
        height: 640, // px
        contentReadOnly: false,
        isShowToolBar: true,
        disabled: false,
        buttonsOption: [
          {
            componentName: 'BtnServTpl',
            isShow: true
          }
        ]
      },
      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedProjectProduction,
      rejectedUrl: rejectedProjectProduction,
      cancelledUrl: cancelledProjectProduction,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      accountSupplierUpdateProps: [],
      accountCustomerUpdateProps: [],
      bpHistoryVersionList: [],
      // 物料消耗数据缓存
      projectProductionConsumptionListCreated: []
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
        } else {
          this.handleAdd()
        }
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      if (this.isView) {
        return false
      }
      return this.checkPermi(['projectManagement:projectProduction:edit'])
    },
    comDisFrom() {
      if (this.isView) {
        return true
      }
      let dis = true
      if (this.rowId) {
        if (this.editAuth && this.buttonAuthMsg.isCanUpdate === '1') {
          dis = false
        }
      } else {
        return !this.editAuth
      }
      return dis
    },
    saveDraftBtnShow() {
      let show = false
      if (this.rowId) {
        if (this.editAuth && this.buttonAuthMsg.isCanSaveDraft === '1') {
          show = true
        }
      } else {
        return this.editAuth
      }
      return show
    },
    reviseBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        this.form.projectProductionId &&
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
        this.form.projectProductionId &&
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
        this.form.projectProductionId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['projectManagement:projectProduction:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.projectProductionId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['projectManagement:projectProduction:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.projectProductionId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    modifyHighlight() {
      if (this.approvedBtnShow && this.buttonAuthMsg.isCanSeeUpdateMsg === '1') {
        return true
      }
      return false
    },
    curColumns() {
      if (this.form.projectProductionType === '2') {
        return this.columns4
      } else {
        return this.columns1
      }
    },
    configCurColumn() {
      const arr = [...this.curColumns]
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    visibleCurColumns() {
      const arr = this.curColumns.filter((column) => column.visible === true)
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    visibleCurColumns3() {
      const arr = this.columns3.filter((column) => column.visible === true)
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },

    minNum() {
      let num = 0
      const { subTotal, wastageAmount, adminAmount, markupAmount } = this.form
      if (subTotal) {
        num -= subTotal
      }
      if (wastageAmount) {
        num -= wastageAmount
      }
      if (adminAmount) {
        num -= adminAmount
      }
      if (markupAmount) {
        num -= markupAmount
      }

      return num
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
    this.$i18n.mergeLocaleMessage('zh', locale2.zh)
    this.$i18n.mergeLocaleMessage('en', locale2.en)
  },
  created() {
    this.reset()
    this.$$initColumnVisible('null', this.columns)
    this.$$initColumnVisible('null', this.columns3)
    this.$$initColumnVisible('13', this.columns1)
    this.$$initColumnVisible('14', this.columns4)
  },
  methods: {
    maxQty(row) {
      const { plannedConsumptionQty, availableQty, reservedQty } = row

      let qty = 0
      if (!availableQty) {
        qty += 0
      } else {
        qty += availableQty * 1000
      }
      if (!reservedQty) {
        qty += 0
      } else {
        qty += reservedQty * 1000
      }
      qty = qty / 1000
      if (qty === 0) {
        return 0
      }
      return plannedConsumptionQty * 1 > qty * 1 ? qty * 1 : plannedConsumptionQty * 1
    },
    // 小数上取整
    bigValue(e, type) {
      let res
      if (type === '1') {
        const big = new Big(e)
        const num = Math.pow(10, 3)
        const value = Math.ceil(big.times(num)) / num
        res = new Big(value).toFixed(3).toString()
      } else {
        res = Math.ceil(e)
      }
      return res
    },
    // 生产配件的生产数量变化
    qtyChange(row) {
      const { bomAccessoriesId, plannedProductionQty, productionQty } = row
      let per
      const parentPer = []
      if (productionQty) {
        per = '*' + plannedProductionQty + ',/' + productionQty
        parentPer.push(per)
        const projectProductionConsumptionListCreated = JSON.parse(
          JSON.stringify(this.projectProductionConsumptionListCreated)
        )
        const e = projectProductionConsumptionListCreated.filter(
          (x) => bomAccessoriesId === x.bomAccessoriesId
        )[0]
        const index = this.form.projectProductionConsumptionList.findIndex(
          (x) => x.bomAccessoriesId === bomAccessoriesId
        )
        this.$set(this.form.projectProductionConsumptionList, index, { ...e })

        this.form.projectProductionConsumptionList.forEach((x) => {
          if (bomAccessoriesId === x.bomAccessoriesId) {
            this.$set(x, 'per', per)
            const count = (data) => {
              data.forEach((k) => {
                const { includeDecimal, plannedConsumptionQtyCopy } = k
                let parentPerCopy = JSON.parse(JSON.stringify(parentPer))
                parentPerCopy = this.symbolChange(parentPerCopy)
                parentPerCopy.push('*' + plannedConsumptionQtyCopy)
                const plannedConsumptionQty = this.perHandler(parentPerCopy, includeDecimal)
                this.$set(k, 'plannedConsumptionQty', plannedConsumptionQty)
                this.$set(k, 'consumptionQty', undefined)
                if (
                  k.childProjectTemplateContentList &&
                  k.childProjectTemplateContentList.length > 0
                ) {
                  count(k.childProjectTemplateContentList)
                }
              })
            }
            if (x.childProjectTemplateContentList && x.childProjectTemplateContentList.length > 0) {
              count(x.childProjectTemplateContentList)
            }
          }
        })
        this.projectProductionConsumptionListCreated.forEach((x) => {
          if (bomAccessoriesId === x.bomAccessoriesId) {
            this.$set(x, 'per', per)
          }
        })
      } else {
        per = undefined

        this.projectProductionConsumptionListCreated.forEach((x) => {
          if (bomAccessoriesId === x.bomAccessoriesId) {
            this.$set(x, 'per', undefined)
          }
        })
        const projectProductionConsumptionListCreated = JSON.parse(
          JSON.stringify(this.projectProductionConsumptionListCreated)
        )
        const e = projectProductionConsumptionListCreated.filter(
          (x) => bomAccessoriesId === x.bomAccessoriesId
        )[0]
        const index = this.form.projectProductionConsumptionList.findIndex(
          (x) => x.bomAccessoriesId === bomAccessoriesId
        )
        this.$set(this.form.projectProductionConsumptionList, index, { ...e })
      }
    },
    perHandler(data, includeDecimal) {
      const list = data
      let numList = []
      let denList = []
      list.forEach((x) => {
        const arr = x.split(',')
        arr.forEach((m) => {
          if (m.indexOf('/') === -1) {
            numList.push(m)
          } else {
            denList.push(m)
          }
        })
      })
      numList = numList.join(',').replace(/\*/g, '').split(',')
      denList = denList.join(',').replace(/\//g, '').split(',')
      let num = 1
      let den = 1
      numList.forEach((x) => {
        num = num * x
      })
      denList.forEach((x) => {
        den = den * x
      })
      return this.bigValue(num / den, includeDecimal)
    },
    symbolChange(data) {
      const list = JSON.parse(JSON.stringify(data))
      const listCopy = list.map((k) => {
        const arr = k.split(',')
        const arrCopy = arr.map((m) => {
          let str = m
          if (str.indexOf('/') !== -1) {
            str = str.replace('/', '*')
          } else if (str.indexOf('*') !== -1) {
            str = str.replace('*', '/')
          }
          return str
        })
        k = arrCopy.join(',')
        return k
      })
      return listCopy
    },
    // 物料消耗的消耗数量变化
    consumptionQtyChange(row) {
      // 切割得到父级层级id
      const { fullId } = row
      const fullIds = fullId.split('-')
      const parentPer = []
      let parentIndex = 0
      let per
      let list = this.form.projectProductionConsumptionList
      list = list.filter((x) => x.fullId === fullIds[0])
      const isReplace = (data) => {
        data.forEach((x) => {
          if (x.bomAccessoriesId === fullIds[parentIndex]) {
            if (x.plannedConsumptionQtyCopy && x.consumptionQty) {
              per = '*' + x.plannedConsumptionQtyCopy + ',/' + x.consumptionQty
              if (parentPer.length > 0) {
                this.symbolChange(parentPer)
                const parentPerListCopy = this.symbolChange(parentPer)
                per += ',' + parentPerListCopy.join(',')
              }
              this.$set(x, 'per', per)
            } else if (parentIndex !== 0) {
              this.$set(x, 'per', undefined)
            }
            if (x.per) {
              parentPer.push(x.per)
            }
            if (parentIndex === fullIds.length - 1) {
              const { childProjectTemplateContentList } = x
              const childCompute = (child) => {
                child.forEach((childItem) => {
                  const { includeDecimal } = childItem
                  let parentPerCopy = JSON.parse(JSON.stringify(parentPer))
                  parentPerCopy = this.symbolChange(parentPerCopy)
                  if (parentPerCopy.length > 0) {
                    parentPerCopy.push('*' + childItem.plannedConsumptionQtyCopy)
                    const plannedConsumptionQty = this.perHandler(parentPerCopy, includeDecimal)
                    this.$set(childItem, 'plannedConsumptionQty', plannedConsumptionQty)
                  } else {
                    this.$set(
                      childItem,
                      'plannedConsumptionQty',
                      childItem.plannedConsumptionQtyCopy
                    )
                  }

                  if (childItem.consumptionQty) {
                    let qty = 0
                    if (!childItem.availableQty) {
                      qty += 0
                    } else {
                      qty += childItem.availableQty * 1000
                    }
                    if (!childItem.reservedQty) {
                      qty += 0
                    } else {
                      qty += childItem.reservedQty * 1000
                    }
                    qty = qty / 1000
                    qty =
                      childItem.plannedConsumptionQty * 1 > qty * 1
                        ? qty * 1
                        : childItem.plannedConsumptionQty * 1
                    if (childItem.consumptionQty > qty) {
                      this.$set(childItem, 'consumptionQty', qty)
                    }
                  }

                  if (
                    childItem.childProjectTemplateContentList &&
                    childItem.childProjectTemplateContentList.length > 0
                  ) {
                    childCompute(childItem.childProjectTemplateContentList)
                  }
                })
              }
              if (childProjectTemplateContentList && childProjectTemplateContentList.length > 0) {
                childCompute(childProjectTemplateContentList)
              }
              return
            }
            parentIndex++
          }
          if (x.childProjectTemplateContentList && x.childProjectTemplateContentList.length > 0) {
            isReplace(x.childProjectTemplateContentList)
          }
        })
      }
      isReplace(list)
      this.tableListDisabled()
    },
    // 消耗数量禁用
    tableListDisabled() {
      const isDisabled = (data, type = undefined) => {
        data.forEach((x) => {
          this.$set(x, 'isDisabled', type)
          if (type) {
            this.$set(x, 'consumptionQty', undefined)
          }
          const { plannedConsumptionQty, consumptionQty, childProjectTemplateContentList } = x
          if (
            consumptionQty &&
            plannedConsumptionQty &&
            consumptionQty * 1 === plannedConsumptionQty * 1
          ) {
            this.$set(x, 'childDisabled', '1')
          } else {
            this.$set(x, 'childDisabled', undefined)
          }
          if (childProjectTemplateContentList && childProjectTemplateContentList.length > 0) {
            isDisabled(childProjectTemplateContentList, x.childDisabled || x.isDisabled)
          }
        })
      }
      isDisabled(this.form.projectProductionConsumptionList)
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        }
        if (row.updateType === '3') {
          color = 'cancel-row'
        }
      }
      return color
    },
    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.rowId)
    },
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.projectProductionId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
    },
    handleAdd() {
      this.reset()
      // this.queryDefaultWarehouse()
    },
    openSalesOrderTable() {
      this.$refs.selectSalesOrderTable.handleOpen()
    },
    updateSalesOrderNo(row) {
      // this.$set(this.form, 'salesOrderId', row.salesOrderId)
      // this.$set(this.form, 'salesOrderNo', row.salesOrderNo)
      this.form = Object.assign(this.form, { ...row })
      const { warehouseId, warehouseName } = row || {}
      if (warehouseId) {
        this.$set(this.form, 'inWarehouseName', warehouseName)
        this.$set(this.form, 'inWarehouseId', warehouseId)
        this.$set(this.form, 'outWarehouseName', warehouseName)
        this.$set(this.form, 'outWarehouseId', warehouseId)
      }
      this.form.projectProductionAccessoriesList = []
      // this.queryDefaultWarehouse()
    },
    queryDefaultWarehouse() {
      queryDefaultWarehouse({ menuPerms: this.menuKey.projectProduction }).then((res) => {
        const { warehouseId, warehouseName } = res.data || {}
        if (warehouseId) {
          this.$set(this.form, 'inWarehouseName', warehouseName)
          this.$set(this.form, 'inWarehouseId', warehouseId)
          this.$set(this.form, 'outWarehouseName', warehouseName)
          this.$set(this.form, 'outWarehouseId', warehouseId)
        }
      })
    },
    openWarehouseFormTable() {
      const params = {
        queryType: 'from'
        // alreadySelectWarehouseId: this.form.inWarehouseId
      }
      this.$refs.selectWarehouseTable.handleOpen(params)
    },
    openWarehouseToTable() {
      const params = {
        queryType: 'to'
        // alreadySelectWarehouseId: this.form.outWarehouseId
      }
      this.$refs.selectWarehouseTable.handleOpen(params)
    },
    updateWarehouse(row, type) {
      if (type === 'to') {
        this.$set(this.form, 'inWarehouseName', row.warehouseName)
        this.$set(this.form, 'inWarehouseId', row.warehouseId)
      } else {
        this.$set(this.form, 'outWarehouseName', row.warehouseName)
        this.$set(this.form, 'outWarehouseId', row.warehouseId)
        this.form.projectProductionAccessoriesList = []
      }
    },
    salesOrderNoClear() {
      this.$set(this.form, 'salesOrderId', undefined)
      this.$set(this.form, 'salesOrderNo', undefined)
      this.$set(this.form, 'projectName', undefined)
      this.warehouseToClear()
      this.warehouseFromClear()
    },
    warehouseFromClear() {
      this.$set(this.form, 'outWarehouseName', undefined)
      this.$set(this.form, 'outWarehouseId', undefined)
      this.form.projectProductionAccessoriesList = []
      this.form.projectProductionConsumptionList = []
    },
    warehouseToClear() {
      this.$set(this.form, 'inWarehouseName', undefined)
      this.$set(this.form, 'inWarehouseId', undefined)
    },
    // 清空pic
    picUserNameClear() {
      this.$set(this.form, 'picUserBy', undefined)
      this.$set(this.form, 'picUserId', undefined)
      this.$set(this.form, 'mobilePhone', undefined)
      this.$set(this.form, 'mobileCode', undefined)
      this.$set(this.form, 'mobileNum', undefined)
    },
    // 打开pic弹窗
    openPicTable() {
      this.$refs.selectPicTable.handleOpen()
    },
    updatePic(row) {
      const { nickName, userId, mobilePhone, mobileCode, mobileNum } = row
      this.$set(this.form, 'picUserBy', nickName)
      this.$set(this.form, 'picUserId', userId)
      this.$set(this.form, 'mobilePhone', mobilePhone)
      this.$set(this.form, 'mobileCode', mobileCode)
      this.$set(this.form, 'mobileNum', mobileNum)
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      queryProjectProductionById({ projectProductionId: rowId }).then((res) => {
        const { buttonAuthMsg } = res.data
        this.form = res.data || {}
        this.form.projectProductionConsumptionList = this.traverseTree(
          this.form.projectProductionConsumptionList
        )

        const list = []
        this.form.projectProductionAccessoriesList.forEach((x) => {
          if (x.childProjectTemplateContentList && x.childProjectTemplateContentList.length > 0) {
            const plannedProductionQtyList = (data) => {
              data.forEach((k) => {
                list.push({
                  bomAccessoriesId: k.bomAccessoriesId,
                  plannedProductionQty: k.plannedProductionQty
                })
                if (
                  k.childProjectTemplateContentList &&
                  k.childProjectTemplateContentList.length > 0
                ) {
                  plannedProductionQtyList(k.childProjectTemplateContentList)
                }
              })
            }
            plannedProductionQtyList(x.childProjectTemplateContentList)
          }
        })

        this.projectProductionConsumptionListCreated = JSON.parse(
          JSON.stringify(this.form.projectProductionConsumptionList)
        )
        this.projectProductionConsumptionListCreated.forEach((x) => {
          if (x.productionQty) {
            const per = '*' + x.plannedProductionQty + ',/' + x.productionQty
            this.$set(x, 'per', per)
          }
          if (x.childProjectTemplateContentList && x.childProjectTemplateContentList.length > 0) {
            const plannedConsumptionQtyCopy = (data) => {
              data.forEach((k) => {
                const arr = list.filter((m) => m.bomAccessoriesId === k.bomAccessoriesId) || []
                if (arr.length > 0) {
                  k.plannedConsumptionQty = arr[0].plannedProductionQty
                  k.plannedConsumptionQtyCopy = arr[0].plannedProductionQty
                }
                if (
                  k.childProjectTemplateContentList &&
                  k.childProjectTemplateContentList.length > 0
                ) {
                  plannedConsumptionQtyCopy(k.childProjectTemplateContentList)
                }
              })
            }
            plannedConsumptionQtyCopy(x.childProjectTemplateContentList)
          }
        })

        this.buttonAuthMsg = buttonAuthMsg || {}
        this.initContent = this.form.projectMsg || ''

        /* 版本比对 */
        const updateMsg = res.data.updateMsg || {}
        const basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
        const beforeCommonFileList = updateMsg.beforeCommonFileList || []
        const afterCommonFileList = updateMsg.afterCommonFileList || []

        setTimeout(() => {
          this.basicUpdateProps = basicUpdateMsgList.map((item) => item.name)
          if (beforeCommonFileList.length > 0 || afterCommonFileList.length > 0) {
            this.basicUpdateProps.push('attachment')
          }
        }, 100)
        this.tableListDisabled()
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
    cellClass(row) {
      if (row.columnIndex === 0) {
        return 'cell-class'
      }
    },
    handleWithdraw() {
      const vm = this
      const confirm = vm.$t('PRODUCT.withdrawConfirm').replace('$1', this.form.projectTemplateNo)
      this.$modal
        .confirm(confirm)
        .then(() => {
          this.submitLoading = true
          withdrawProjectTemplate({
            projectProductionId: vm.rowId
          })
            .then((res) => {
              if (res.code === 200) {
                vm.$message.success(
                  vm.$t('PRODUCT.withdrawSuccess').replace('$1', this.form.projectTemplateNo)
                )
                this.cancel()
              }
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
            })
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    handleClick() {},
    selectable(row, rowIndex) {
      if (row.isCanSelectUse !== '1' && row.isCanSelectReQuote !== '1') return false
      return true // 不禁用
    },
    openProductTable() {
      this.$refs.selectProductTable.handleAdd()
    },
    productClear() {
      this.$set(this.createForm, 'combinationProductName', undefined)
      this.$set(this.createForm, 'productId', undefined)
    },
    updateCombinationProductName(row) {
      const { productName, productId } = row
      this.$set(this.createForm, 'combinationProductName', productName)
      this.$set(this.createForm, 'productId', productId)
    },
    reset() {
      this.form = {
        salesOrderNo: undefined,
        associatedProjectName: undefined,
        productionNo: undefined,
        picUserBy: undefined,
        projectProductionType: '1',
        remarks: undefined,
        logisticsType: '3',
        projectProductionPersonList: [],
        projectProductionAccessoriesList: [],
        projectProductionConsumptionList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForContent = false
      this.collapseWarningForProductionPersonnel = false
      this.activeNames = ['1', '2', '3', '4', '5']
      this.resetForm('form')
    },
    cellClassName({ row, column }) {
      let cellClass = ''
      if (row.isErr === '1' && column.property === 'uom' && row.productType === '1') {
        cellClass = 'is-err-table-cell'
      }
      return cellClass
    },
    handleBtnAdd() {
      const alreadySelectIdList = this.form.projectProductionAccessoriesList.map(
        (item) => item.productId
      )
      this.$refs.selectProductNameTable.handleOpen(alreadySelectIdList)
    },
    updateTable(list) {
      if (list.length > 0) {
        // this.loading = true
        const rows = JSON.parse(JSON.stringify(list))
        this.form.projectProductionAccessoriesList.push(...rows)
        this.form.projectProductionConsumptionList.push(...rows)
        this.form.projectProductionConsumptionList = this.traverseTree(
          this.form.projectProductionConsumptionList
        )
        this.projectProductionConsumptionListCreated = JSON.parse(
          JSON.stringify(this.form.projectProductionConsumptionList)
        )
      }
    },
    traverseTree(nodes, parentId = '', index = 0) {
      index++
      return nodes.map((node) => {
        // 使用父级ID和当前节点ID拼接生成fullId
        let fullId = parentId
          ? `${parentId}-${node.bomAccessoriesId || node.projectProductionConsumptionId}`
          : node.bomAccessoriesId || node.projectProductionConsumptionId
        if (!parentId && node.bomAccessoriesType === '2') {
          fullId = +new Date()
        }
        // 如果当前节点有子节点，递归调用traverseTree处理子节点
        const childProjectTemplateContentList = node.childProjectTemplateContentList
          ? this.traverseTree(node.childProjectTemplateContentList, fullId, index)
          : []
        // 返回新的节点对象，包含原有属性及新的fullId属性
        return {
          ...node,
          fullId,
          customIndex: index,
          plannedConsumptionQtyCopy: node.plannedConsumptionQty,
          childProjectTemplateContentList: childProjectTemplateContentList.length
            ? childProjectTemplateContentList
            : undefined // 移除空数组的children属性
        }
      })
    },
    // 取消按钮
    cancel() {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/projectManagement/projectProduction' })
    },
    /* 行删除 */
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.form.projectProductionAccessoriesList.splice(index, 1)
        this.form.projectProductionConsumptionList.splice(index, 1)
        // this.form.projectProductionConsumptionList = this.traverseTree(
        //   this.form.projectProductionAccessoriesList
        // )
        this.projectProductionConsumptionListCreated.splice(index, 1)
      })
    },

    toggleCheckedChildrens(selection, item, isChecked) {
      const _toggleCheckedChildrens = (data) => {
        // eslint-disable-next-line array-callback-return
        data.find((element) => {
          this.$refs.tables.toggleRowSelection(element, isChecked)
          if (isChecked && !selection.find((item) => item.fullId === element.fullId)) {
            selection.push(element)
          } else if (!isChecked && selection.find((item) => item.fullId === element.fullId)) {
            for (let i = selection.length - 1; i >= 0; i--) {
              if (selection[i].fullId === element.fullId) {
                selection.splice(i, 1)
                break
              }
            }
          }
          _toggleCheckedChildrens(element.child || [])
        })
      }
      _toggleCheckedChildrens(item.child || [])
    },
    async handleSaveDraft() {
      const valid1 = await this.$refs.form.validate().catch((err) => {
        return err
      })
      if (!valid1) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      this.collapseWarningForBasicInfo = false
      const param = JSON.parse(JSON.stringify(this.form))

      this.$modal
        .confirm(this.$t('PRODUCT.projectProductionSave'))
        .then(() => {
          this.submitLoading = true
          saveDraftProjectProduction(param)
            .then((res) => {
              const { projectProductionNo } = res.data || {}
              this.$modal.msgSuccess(
                this.$t('PRODUCT.projectProductionSaveSuccess').replace('$1', projectProductionNo)
              )
              this.cancel()
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
            })
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    // 消耗数量校验
    consumptionQtyValid() {
      let flag = false
      this.form.projectProductionConsumptionList.forEach((x) => {
        const consumptionQtyValue = (tree, callback) => {
          for (let i = 0; i < tree.length; i++) {
            if (flag) return
            const node = tree[i]
            const {
              plannedConsumptionQty,
              consumptionQty,
              childProjectTemplateContentList,
              isDisabled
            } = node
            if (isDisabled !== '1') {
              if (!consumptionQty) {
                if (childProjectTemplateContentList && childProjectTemplateContentList.length > 0) {
                  const isConsumptionQty = childProjectTemplateContentList.some(
                    (x) => x.consumptionQty
                  )
                  if (isConsumptionQty) {
                    consumptionQtyValue(childProjectTemplateContentList, callback)
                  } else {
                    callback(node)
                    return
                  }
                } else {
                  callback(node)
                  return
                }
                return
              }
              if (plannedConsumptionQty * 1 !== consumptionQty * 1) {
                if (childProjectTemplateContentList && childProjectTemplateContentList.length > 0) {
                  consumptionQtyValue(childProjectTemplateContentList, callback)
                } else {
                  callback(node)
                  return
                }
                return
              }
            }

            if (childProjectTemplateContentList && childProjectTemplateContentList.length > 0) {
              consumptionQtyValue(childProjectTemplateContentList, callback)
            }
          }
        }
        if (x.childProjectTemplateContentList && x.childProjectTemplateContentList.length > 0) {
          consumptionQtyValue(x.childProjectTemplateContentList, (node) => {
            flag = true
            this.collapseWarningForContent = true
            this.$modal.msgError(
              this.$t('PRODUCT.consumptionQtyMax').replace('$1', node.productName)
            )
          })
        }
      })

      return flag
    },
    async submitForm() {
      const valid1 = await this.$refs.form.validate().catch((err) => {
        return err
      })
      if (!valid1) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      this.collapseWarningForBasicInfo = false

      if (this.form.projectProductionPersonList.length <= 0) {
        this.$modal.msgError(this.$t('PRODUCT.productionPersonnelTableEmpty'))
        this.collapseWarningForProductionPersonnel = true
        return
      }
      this.collapseWarningForProductionPersonnel = false

      if (this.form.projectProductionAccessoriesList.length <= 0) {
        this.$modal.msgError(this.$t('PRODUCT.productionAccessoriesTableEmpty'))
        this.collapseWarningForProductInfo = true
        return
      }
      this.collapseWarningForProductInfo = false

      const productionQty = this.form.projectProductionAccessoriesList.some((x) => !x.productionQty)
      if (productionQty) {
        this.collapseWarningForProductInfo = true
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productionQty'))
        )
        return
      }
      this.collapseWarningForProductInfo = false

      const flag = this.consumptionQtyValid()
      if (flag) return
      this.collapseWarningForContent = false
      const param = JSON.parse(JSON.stringify(this.form))

      this.$modal
        .confirm(this.$t('PRODUCT.projectProductionSubmit'))
        .then(() => {
          this.submitLoading = true
          saveProjectProduction(param)
            .then((res) => {
              const { projectProductionNo } = res.data || {}
              this.$modal.msgSuccess(
                this.$t('PRODUCT.projectProductionSubmitSuccess').replace('$1', projectProductionNo)
              )
              this.cancel()
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
            })
        })
        .catch(() => {
          this.submitLoading = false
        })
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
        `${vm.$t('PRODUCT.projectProductionApprovedSuccess')}`.replace(
          '$1',
          vm.form.projectProductionNo
        )
      )
      this.aplVisible = false
      vm.cancel()
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
        `${vm.$t('PRODUCT.projectProductionRejectedSuccess')}`.replace(
          '$1',
          vm.form.projectProductionNo
        )
      )
      this.rjVisible = false
      vm.cancel()
    },
    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.cancelledSuccess')}`.replace(
          '$1',
          `${this.$t('PRODUCT.associatedProjectName')} [${vm.form.projectName}]`
        )
      )
      vm.cancel()
    }
  }
}
</script>

<style lang="scss" scoped>
.text-red {
  color: #ff0000;
}
.text-green {
  color: #00cc00;
}
.table {
  /deep/ .cell-class .cell .el-checkbox__inner {
    display: none;
    position: relative;
  }
}
.table {
  /deep/ .cell-class .cell:before {
    content: '';
    position: absolute;
  }
}
.unit {
  flex-shrink: 0;
  min-width: 30px;
  padding: 0 8px;
  text-align: center;
  background-color: #f5f7fa;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}
.border-line-solid {
  height: 1px;
  width: 100%;
  border-top: 1px solid #dcdfe6;
  // background-color: #dcdfe6;
  margin-bottom: 20px;
}
.border-line-dashed {
  height: 1px;
  width: 100%;
  border-top: 2px dashed #dcdfe6;
  // background-color: #dcdfe6;
  margin-bottom: 20px;
  border-spacing: 6px;
}
</style>
