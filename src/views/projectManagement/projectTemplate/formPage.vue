<template>
  <FormPageLayoutTabs>
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        v-if="!comDisFrom"
        :loading="btnLoading"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button
        type="primary"
        :loading="btnLoading"
        size="mini"
        @click="handleSaveDraft"
        v-if="saveDraftBtnShow && !comDisFrom"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="withdrawBtnShow && !comDisFrom"
        :loading="btnLoading"
        @click="handleWithdraw"
        >{{ $t('menu.withdraw') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="updateCostShow && !isView"
        :loading="btnLoading"
        @click="handleUpdateCost"
        >{{ $t('menu.updateCost') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="previewPDFShow"
        :loading="previewPDFLoading"
        @click="handlePreviewPDF"
        >{{ $t('menu.previewPDF') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="printPDFShow" @click="handlePrintPDF"
        >{{ $t('menu.printPDF') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="exportPDFShow" @click="handleExportPDF"
        >{{ $t('menu.exportPDF') }}
      </el-button>

      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:tabs>
      <el-tabs v-model="activeName" size="mini" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('ui.basicInfo')" name="basicInfo"></el-tab-pane>
        <el-tab-pane :label="$t('PRODUCT.templateInfo')" name="templateInfo"></el-tab-pane>
      </el-tabs>
    </template>
    <template v-slot:content>
      <div v-show="activeName === 'basicInfo'">
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
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.projectName')}`" prop="projectName">
                      <el-input
                        v-model="form.projectName"
                        :title="form.projectName"
                        class="form-wd"
                        maxlength="100"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.project_template_status,
                            form.projectTemplateStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.projectCode')}`">
                      <el-input
                        v-model="form.projectTemplateNo"
                        :title="form.projectTemplateNo"
                        class="form-wd"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="$t('PRODUCT.projectDescription')"
                      prop="projectDescription"
                    >
                      <MyInput
                        type="textarea"
                        v-model="form.projectDescription"
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
                    <el-form-item
                      :label="$t('PRODUCT.projectQuotationContent')"
                      prop="projectQuotationContent"
                    >
                      <MyInput
                        type="textarea"
                        v-model="form.projectQuotationContent"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="$t('PRODUCT.projectTermsConditions')"
                      prop="projectTermsConditions"
                    >
                      <MyInput
                        type="textarea"
                        v-model="form.projectTermsConditions"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.isActive')}`">
                      <el-switch
                        v-model="form.isActive"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
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
                :title="$t('PRODUCT.BOM')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5">
                    <el-button
                      @click="handleBtnAdd"
                      :disabled="loading"
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      v-if="!comDisFrom && form.projectTemplateStatus !== '2'"
                      >{{ $t('uiBtn.add') }}</el-button
                    >
                  </el-col>
                </el-row>
                <el-table border max-height="600px" :data="tableList" v-loading="loading">
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
                    <template slot-scope="scope">
                      <template v-if="item.prop === 'combinationProductNo'">
                        <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
                          scope.row.combinationProductNo
                        }}</span>
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
                    v-if="!comDisFrom && form.projectTemplateStatus !== '2'"
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
                :title="$t('ui.content')"
                :warning="collapseWarningForContent"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5">
                    <el-button
                      @click="handleReQuote"
                      :disabled="selectList.length <= 0"
                      type="primary"
                      size="mini"
                      v-if="form.projectTemplateStatus === '2' && !isView"
                      >{{ $t('menu.reQuote') }}</el-button
                    >
                  </el-col>
                  <right-toolbar
                    :saveKey="saveKey"
                    :showSearchBtn="false"
                    :showRefreshBtn="false"
                    @queryTable="queryTable"
                    :columnsInit="columns1"
                    :columns="configCurColumn"
                  ></right-toolbar>
                </el-row>
                <el-table
                  border
                  ref="tables"
                  max-height="600px"
                  :row-key="rowIdKey"
                  :data="treeTableList"
                  lazy
                  :default-expand-all="true"
                  :tree-props="{
                    children: 'childProjectTemplateContentList',
                    hasChildren: 'hasChildren'
                  }"
                  @select="handleSelect"
                  @select-all="handleSelectAll"
                  @selection-change="handleSelectionChange"
                  v-loading="loading"
                  :header-cell-class-name="cellClass"
                  class="table"
                >
                  <el-table-column
                    type="selection"
                    width="55"
                    :selectable="selectable"
                    align="center"
                  />

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
                      <span v-if="['unitCost'].includes(item.prop)">
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
                        <template
                          v-else-if="['purchaseQuotationNo', 'internalPartNo'].includes(item.prop)"
                        >
                          <span class="primary-link" @click="nav(scope.row, item.prop)">{{
                            scope.row[item.prop]
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
                            @blur="calculateProjectTemplate"
                            v-if="!comDisFrom && scope.row.isCanUpdateUnitCost === '1'"
                          />
                          <span v-else>{{ $numberStr(scope.row[item.prop], 2) }}</span>
                        </template>
                        <template v-else-if="item.prop === 'totalCost'">{{
                          $numberStr(scope.row[item.prop], 2)
                        }}</template>
                        <template v-else-if="item.prop === 'referenceAmount'">{{
                          $numberStr(scope.row[item.prop], 2)
                        }}</template>
                        <template v-else-if="item.prop === 'purchaseUnitPrice'">
                          <!-- <el-input-number
                            style="width: 98%"
                            :precision="2"
                            v-thousandSplit="{ precision: 2 }"
                            :min="0.01"
                            :max="999999999.99"
                            v-model="scope.row.purchaseUnitPrice"
                            controls-position="right"
                            v-if="
                              !comDisFrom &&
                              scope.row.isCanSelectUse === '1' &&
                              !scope.row.purchaseQuotationNo
                            "
                          /> -->
                          <span>
                            {{ $numberStr(scope.row[item.prop], 2) }}
                          </span>
                        </template>
                        <template v-else-if="item.prop === 'dateQuoted'">{{
                          parseTime(scope.row.dateQuoted, fmtForYmdhms)
                        }}</template>
                        <template v-else-if="item.prop === 'description'">
                          <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
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
                        <template v-else-if="item.prop === 'productName'">
                          <span
                            >{{ scope.row[item.prop] }} ({{ $t('PRODUCT.max') }}
                            {{ scope.row.maxQty }}, {{ $t('PRODUCT.min') }}
                            {{ scope.row.minQty }})</span
                          >
                        </template>
                        <template v-else-if="item.prop === 'description'">
                          <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
                        </template>
                        <template v-else>{{ scope.row[item.prop] }}</template>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>

                <div style="display: flex; justify-content: flex-end">
                  <el-form
                    ref="form"
                    :model="form"
                    @submit.native.prevent
                    :rules="rules"
                    label-width="120px"
                    class="mt20"
                    style="width: 600px"
                    :disabled="comDisFrom"
                  >
                    <el-row>
                      <el-col :span="24">
                        <el-form-item :label="`${$t('PRODUCT.subTotal')}`" prop="subTotal">
                          <el-input-number
                            v-model="form.subTotal"
                            :precision="2"
                            v-thousandSplit="{ precision: 2 }"
                            type="number"
                            class="form-wd"
                            placeholder=""
                            style="width: 100%"
                            controls-position="right"
                            disabled
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item
                          :label="`${$t('PRODUCT.wastage')}`"
                          prop="wastageRate"
                          :rules="{
                            required: !!rowId,
                            message: $t('ui.reqMsg'),
                            pattern: new RegExp(/^(?!(\s+$))/g),
                            trigger: ['blur']
                          }"
                        >
                          <el-input-number
                            v-model="form.wastageRate"
                            :precision="0"
                            type="number"
                            class="form-wd"
                            :min="1"
                            :max="200"
                            placeholder=""
                            style="width: 100%"
                            controls-position="right"
                            @blur="calculateProjectTemplate"
                            @change="inputNumberChange('wastageRate')"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="`${$t('PRODUCT.wastageAmount')}`">
                          <el-input-number
                            v-model="form.wastageAmount"
                            :precision="2"
                            v-thousandSplit="{ precision: 2 }"
                            type="number"
                            class="form-wd"
                            :min="0"
                            placeholder=""
                            style="width: 100%"
                            controls-position="right"
                            disabled
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item
                          :label="`${$t('PRODUCT.admin')}`"
                          prop="adminRate"
                          :rules="{
                            required: !!rowId,
                            message: $t('ui.reqMsg'),
                            pattern: new RegExp(/^(?!(\s+$))/g),
                            trigger: ['blur']
                          }"
                        >
                          <div style="display: flex">
                            <el-input-number
                              v-model="form.adminRate"
                              :precision="0"
                              type="number"
                              class="form-wd"
                              :min="1"
                              :max="500"
                              placeholder=""
                              style="width: 40%"
                              controls-position="right"
                              @blur="calculateProjectTemplate"
                              @change="inputNumberChange('adminRate')"
                            />
                            <span style="padding: 0 10px">%</span>
                            <el-input-number
                              v-model="form.adminAmount"
                              :precision="2"
                              v-thousandSplit="{ precision: 2 }"
                              type="number"
                              class="form-wd"
                              :min="0"
                              placeholder=""
                              style="width: 60%"
                              controls-position="right"
                              disabled
                            />
                          </div>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item
                          :label="`${$t('PRODUCT.markup')}`"
                          prop="markupRate"
                          :rules="{
                            required: !!rowId,
                            message: $t('ui.reqMsg'),
                            pattern: new RegExp(/^(?!(\s+$))/g),
                            trigger: ['blur']
                          }"
                        >
                          <div style="display: flex">
                            <el-input-number
                              v-model="form.markupRate"
                              :precision="0"
                              type="number"
                              class="form-wd"
                              :min="1"
                              :max="500"
                              placeholder=""
                              style="width: 40%"
                              controls-position="right"
                              @blur="calculateProjectTemplate"
                              @change="inputNumberChange('markupRate')"
                            />
                            <span style="padding: 0 10px">%</span>
                            <el-input-number
                              v-model="form.markupAmount"
                              :precision="2"
                              v-thousandSplit="{ precision: 2 }"
                              type="number"
                              class="form-wd"
                              :min="0"
                              placeholder=""
                              style="width: 60%"
                              controls-position="right"
                              disabled
                            />
                          </div>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24">
                        <el-form-item :label="`${$t('PRODUCT.otherCosts')}`" prop="otherCosts">
                          <el-input-number
                            v-model="form.otherCosts"
                            :precision="2"
                            v-thousandSplit="{ precision: 2 }"
                            type="number"
                            class="form-wd"
                            placeholder=""
                            :min="minNum"
                            :max="999999999.99"
                            style="width: 100%"
                            controls-position="right"
                            @blur="calculateProjectTemplate"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item :label="`${$t('PRODUCT.totalAmount')}`" prop="totalAmount">
                          <div class="input-switch-box">
                            <div class="con-left">
                              <el-input
                                :value="$numberStr(form.totalAmount, 2)"
                                disabled
                              ></el-input>
                            </div>
                            <div class="con-right" v-if="!comDisFrom">
                              <svg-icon
                                @click="handleCalculate"
                                icon-class="jisuanqi"
                                style="height: 36px; width: 36px; cursor: pointer"
                              />
                            </div>
                          </div>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10" v-if="propRowId">
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
      <div v-show="activeName === 'templateInfo'">
        <div class="form-card">
          <div class="form-card--p20">
            <el-form
              ref="form2"
              :model="form"
              @submit.native.prevent
              :rules="rules"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="24">
                  <el-form-item prop="projectMsg">
                    <contentEditor
                      v-model="form.projectMsg"
                      class="form-wd"
                      :init-content="initContent"
                      :config="config"
                      :disabled="comDisFrom"
                      :key="'contentEditor' + comDisFrom"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
    </template>
    <!-- 成品名称 -->
    <selectProductTable ref="selectProductTable" @onSuccess="updateCombinationProductName" />
    <!-- 新增BOM配件 -->
    <selectProductNameTable ref="selectProductNameTable" @onSuccess="updateTable" />
    <!-- 组合 -->
    <combinationDlg ref="combinationDlg" />
  </FormPageLayoutTabs>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'
import locale2 from '@/views/system/lang/index'

import {
  addBomMsgFromProjectTemplate,
  calculateProjectTemplate,
  queryProjectTemplateById,
  saveDraftProjectTemplate,
  saveProjectTemplate,
  withdrawProjectTemplate,
  reQuote,
  updateUnitCost,
  preview
} from '@/api/projectManagement/projectTemplate'

import selectProductNameTable from './components/selectProductNameTable'
import selectProductTable from './components/selectProductTable'
import combinationDlg from './components/combinationDlg'
import contentEditor from '@/views/system/emailManagement/editor/editor'
import { getToken } from '@/utils/auth'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  name: '',
  dicts: ['project_template_status', 'product_type'],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    selectProductNameTable,
    selectProductTable,
    combinationDlg,
    contentEditor,
    SystemOperationLogTable
  },
  data() {
    const htmlChartGtTenThousand = (rule, value, callback) => {
      if (typeof value === 'undefined' || value === '') {
        // callback()
      } else if (value.length > 7000) {
        const obj = document.createElement('div')
        obj.innerHTML = value
        const curVal = obj.childNodes
        let strLen = 0
        Array.from([])
          .slice.apply(curVal, [0])
          // eslint-disable-next-line array-callback-return
          .map((item) => {
            if (item.nodeType === 3) {
              strLen += item.toString().trim().length
            } else {
              strLen += item.innerText.trim().length
            }
          })
        if (strLen <= 0) {
          // required.
          // callback()
          // callback(new Error(vm.$t('ETM.contentReq')))
        } else {
          callback(new Error(vm.$t('ETM.htmlChartGtTenThousand7000')))
        }
      } else {
        callback()
      }
    }
    const vm = this
    return {
      loading: false,
      saveKey: '2',
      activeNames: ['1', '2', '3', '4'],
      activeName: 'basicInfo',
      btnLoading: false,
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
      rules: {
        projectName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        projectQuotationContent: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        projectDescription: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        projectTermsConditions: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        wastageRate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        adminRate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        markupRate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        projectMsg: [
          {
            validator: htmlChartGtTenThousand,
            trigger: ['change', 'blur']
          }
        ]
      },
      columns: [
        {
          prop: 'combinationProductName',
          label: vm.$t('PRODUCT.combinationProductName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70,
          fixed: true
        },
        {
          prop: 'combinationProductNo',
          label: vm.$t('PRODUCT.combinationProductNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
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
        }
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // }
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
          prop: 'productType',
          label: vm.$t('PRODUCT.productClass'),
          visible: true,
          width: 150,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchaseQuotationNo',
          label: vm.$t('SALES.purchaseQuotationNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'dateQuoted',
          label: vm.$t('SALES.dateQuoted'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchaseUnitPrice',
          label: vm.$t('SALES.purchasePrice'),
          visible: true,
          minWidth: 200,
          align: 'right',
          fixedWidth: 200,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('PRODUCT.qty'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'referenceAmount',
          label: vm.$t('SALES.referenceAmount'),
          visible: true,
          minWidth: 200,
          align: 'right',
          tooltip: true
        },
        {
          prop: 'unitCost',
          label: vm.$t('SALES.unitCost'),
          visible: true,
          minWidth: 200,
          align: 'right',
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          fixedWidth: 200,
          tooltip: true
        },
        {
          prop: 'totalCost',
          label: vm.$t('SALES.totalCost'),
          visible: true,
          minWidth: 200,
          align: 'right',
          tooltip: true
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
      tableList: [],
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
            isShow: false
          }
        ]
      },
      treeTableList: [],
      // 缓存初始化勾选id
      createdIds: []
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
        if (this.rowId) {
          this.handleUpdate()
        }
      }
    }
  },
  computed: {
    configCurColumn() {
      const arr = [...this.columns1]
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
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['projectManagement:projectTemplate:edit'])
    },
    comDisFrom() {
      if (this.isView === '1') {
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
    withdrawBtnShow() {
      if (!this.checkPermi(['projectManagement:projectTemplate:withdraw'])) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanWithdraw === '1') {
        show = true
      }
      return show
    },
    updateCostShow() {
      if (!this.checkPermi(['projectManagement:projectTemplate:updateCost'])) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanUpdateUnitCost === '1') {
        show = true
      }
      return show
    },
    previewPDFShow() {
      if (!this.checkPermi(['projectManagement:projectTemplate:previewPDF'])) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanPreviewPDF === '1') {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (!this.checkPermi(['projectManagement:projectTemplate:printPDF'])) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanPrintPDF === '1') {
        show = true
      }
      return show
    },
    exportPDFShow() {
      if (!this.checkPermi(['projectManagement:projectTemplate:exportPDF'])) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanDownloadPDF === '1') {
        show = true
      }
      return show
    },
    visibleCurColumns() {
      const arr = this.columns1.filter((column) => column.visible === true)
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

    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      queryProjectTemplateById({ projectTemplateId: rowId }).then((res) => {
        const { projectTemplateBomList, projectTemplateContentList, buttonAuthMsg, ...params } =
          res.data
        this.tableList = projectTemplateBomList
        this.treeTableList = this.traverseTree(projectTemplateContentList)
        this.form = Object.assign(this.form, { ...params })
        this.buttonAuthMsg = buttonAuthMsg || {}

        const _handleSelectAll = (data) => {
          data.forEach((item) => {
            if (item.isSelect === '1' && item.isCanSelectUse === '1' && !this.comDisFrom) {
              this.$refs.tables && this.$refs.tables.toggleRowSelection(item, true)
            }
            if (
              item.childProjectTemplateContentList &&
              item.childProjectTemplateContentList.length > 0
            ) {
              _handleSelectAll(item.childProjectTemplateContentList || [])
            }
          })
        }
        this.$nextTick(() => {
          if (this.form.projectTemplateStatus !== '2') {
            _handleSelectAll(this.treeTableList)
          }
          if (this.comDisFrom) {
            this.$set(this.config, 'contentReadOnly', true)
            this.$set(this.config, 'disabled', true)
            this.$set(this.config, 'isShowToolBar', false)
            this.config = { ...this.config }
          }
          this.initContent = this.form.projectMsg || ''
        })
        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },
    cellClass(row) {
      if (row.columnIndex === 0) {
        return 'cell-class'
      }
    },
    handleReQuote() {
      const projectTemplateContentIdList = []
      const isSelect = (data) => {
        data.forEach((item) => {
          if (this.ids.indexOf(item.fullId) !== -1) {
            // this.$set(item, 'isSelect', '1')
            projectTemplateContentIdList.push(item.projectTemplateContentId)
          }
          if (
            item.childProjectTemplateContentList &&
            item.childProjectTemplateContentList.length > 0
          ) {
            isSelect(item.childProjectTemplateContentList || [])
          }
        })
      }
      isSelect(this.treeTableList)
      this.$modal
        .confirm(this.$t('PRODUCT.reQuoteSubmit'))
        .then(() => {
          reQuote({ projectTemplateId: this.rowId, projectTemplateContentIdList }).then((res) => {
            this.$modal.msgSuccess(this.$t('PRODUCT.reQuoteSubmitSuccess'))
          })
        })
        .catch(() => {})
    },
    inputNumberChange(code) {
      this.$refs.form.validateField(code)
    },
    handleWithdraw() {
      this.btnLoading = true
      const vm = this
      const confirm = vm.$t('PRODUCT.withdrawConfirm').replace('$1', this.form.projectTemplateNo)
      this.$modal
        .confirm(confirm)
        .then(() => {
          withdrawProjectTemplate({
            projectTemplateId: vm.rowId
          })
            .then((res) => {
              if (res.code === 200) {
                vm.$message.success(
                  vm.$t('PRODUCT.withdrawSuccess').replace('$1', this.form.projectTemplateNo)
                )
                this.cancel()
              }
              this.btnLoading = false
            })
            .catch(() => {
              this.btnLoading = false
            })
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    handleUpdateCost() {
      this.btnLoading = true
      const vm = this
      const confirm = vm.$t('PRODUCT.updateCostSubmit')
      this.$modal
        .confirm(confirm)
        .then(() => {
          updateUnitCost({
            projectTemplateId: vm.rowId
          })
            .then((res) => {
              if (res.code === 200) {
                vm.$message.success(vm.$t('PRODUCT.updateCostSuccess'))
                this.cancel()
              }
              this.btnLoading = false
            })
            .catch(() => {
              this.btnLoading = false
            })
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    handlePreviewPDF() {
      const token = getToken()
      const params = { ...this.form }
      const isSelect = (data) => {
        data.forEach((item) => {
          if (this.ids.indexOf(item.fullId) !== -1) {
            this.$set(item, 'isSelect', '1')
          }
          if (
            item.childProjectTemplateContentList &&
            item.childProjectTemplateContentList.length > 0
          ) {
            isSelect(item.childProjectTemplateContentList || [])
          }
        })
      }
      isSelect(this.treeTableList)
      params.projectTemplateBomList = this.tableList || []
      params.projectTemplateContentList = this.treeTableList
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
    handlePrintPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/system/projectTemplate/preview' +
        `/${this.form.projectTemplateId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    handleExportPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/system/projectTemplate/download' +
        `/${this.form.projectTemplateId}` +
        '?token=' +
        `${token}`
      window.location = myUrl
    },
    handleClick() {},

    selectable(row, rowIndex) {
      if (this.comDisFrom) return false
      // if ((row.isCanSelectUse !== '1' && row.isCanSelectReQuote !== '1') || this.comDisFrom) {
      //   return false
      // }
      if (row.isDisabled === '1') {
        return false
      }
      if (this.form.projectTemplateStatus !== '2' && row.isCanSelectUse === '1') {
        return true
      }
      if (this.form.projectTemplateStatus === '2' && row.isCanSelectReQuote === '1') {
        return true
      }
      return false // 禁用
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
        projectName: undefined,
        projectTemplateNo: undefined,
        projectDescription: undefined,
        projectQuotationContent: undefined,
        projectTermsConditions: undefined,
        isActive: '1',
        subTotal: undefined,
        wastageRate: undefined,
        wastageAmount: undefined,
        adminRate: undefined,
        adminAmount: undefined,
        markupRate: undefined,
        markupAmount: undefined,
        otherCosts: undefined,
        totalAmount: undefined,
        projectMsg: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForContent = false
      this.activeNames = ['1', '2', '3', '4']
      this.activeName = 'basicInfo'
      this.resetForm('form1')
    },
    cellClassName({ row, column }) {
      let cellClass = ''
      if (row.isErr === '1' && column.property === 'uom' && row.productType === '1') {
        cellClass = 'is-err-table-cell'
      }
      return cellClass
    },
    nav(row, type) {
      // this.$router.push({
      //   path: '/productManagement/viewProductInfo',
      //   query: {
      //     id: row.productMainId,
      //     timeId: Date.now()
      //   }
      // })
      if (type === 'purchaseQuotationNo') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseQuotation',
          query: {
            id: row.purchaseQuotationId,
            timeId: Date.now()
          }
        })
      } else if (type === 'internalPartNo') {
        this.$router.push({
          path: '/productManagement/viewExtendedProductInfo',
          query: {
            id: row.productMainId,
            timeId: Date.now()
          }
        })
      }
    },
    extendedOrganizationChange() {
      this.tableList = []
    },
    handleBtnAdd() {
      const alreadySelectIdList = this.tableList.map((item) => item.productId)
      this.$refs.selectProductNameTable.handleOpen(alreadySelectIdList)
    },
    updateTable(list) {
      if (list.length > 0) {
        this.loading = true
        const rows = JSON.parse(JSON.stringify(list))
        const bomIdList = rows.map((x) => x.bomId)
        addBomMsgFromProjectTemplate({ bomIdList })
          .then((res) => {
            this.tableList.push(...rows)
            const list = JSON.parse(JSON.stringify(res.data || []))
            this.treeTableList.push(...list)
            this.treeTableList = this.traverseTree(this.treeTableList)
            this.calculateProjectTemplate()
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    calculateProjectTemplate() {
      this.loading = true
      const isSelect = (data) => {
        data.forEach((item) => {
          if (this.ids.indexOf(item.fullId) !== -1) {
            this.$set(item, 'isSelect', '1')
          }
          if (
            item.childProjectTemplateContentList &&
            item.childProjectTemplateContentList.length > 0
          ) {
            isSelect(item.childProjectTemplateContentList || [])
          }
        })
      }
      if (this.form.projectTemplateStatus !== '2') {
        isSelect(this.treeTableList)
      }

      // if (this.form.projectTemplateStatus === '2') {
      //   this.createdIds = JSON.parse(JSON.stringify(this.ids))
      // }
      calculateProjectTemplate({
        ...this.form,
        projectTemplateBomList: this.tableList,
        projectTemplateContentList: this.treeTableList
      })
        .then((res) => {
          const { projectTemplateBomList, projectTemplateContentList, ...params } = res.data
          this.tableList = projectTemplateBomList
          this.treeTableList = this.traverseTree(projectTemplateContentList)
          const _handleSelectAll = (data) => {
            data.forEach((item) => {
              if (item.isSelect === '1' && item.isCanSelectUse === '1') {
                this.$refs.tables.toggleRowSelection(item, true)
              }
              if (
                item.childProjectTemplateContentList &&
                item.childProjectTemplateContentList.length > 0
              ) {
                _handleSelectAll(item.childProjectTemplateContentList || [])
              }
            })
          }
          if (this.form.projectTemplateStatus !== '2') {
            this.$nextTick(() => {
              _handleSelectAll(this.treeTableList)
            })
          }
          this.form = Object.assign(this.form, { ...params })
          this.$set(this.form, 'wastageAmount', params.wastageAmount)
          this.$set(this.form, 'adminAmount', params.adminAmount)
          this.$set(this.form, 'markupAmount', params.markupAmount)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCalculate() {
      this.calculateProjectTemplate()
    },
    traverseTree(nodes, parentId = '') {
      return nodes.map((node) => {
        // 使用父级ID和当前节点ID拼接生成fullId
        let fullId = parentId ? `${parentId}-${node.bomAccessoriesId}` : node.bomAccessoriesId
        if (!parentId && node.bomAccessoriesType === '2') {
          fullId = +new Date()
        }
        // 如果当前节点有子节点，递归调用traverseTree处理子节点
        const childProjectTemplateContentList = node.childProjectTemplateContentList
          ? this.traverseTree(node.childProjectTemplateContentList, fullId)
          : []
        // 返回新的节点对象，包含原有属性及新的fullId属性
        return {
          ...node,
          fullId,
          childProjectTemplateContentList: childProjectTemplateContentList.length
            ? childProjectTemplateContentList
            : undefined // 移除空数组的children属性
        }
      })
    },
    handleBtnCombination() {
      this.$refs.combinationDlg.handleOpen()
    },
    // 取消按钮
    cancel() {
      if (this.isView === '1') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/projectManagement/projectTemplate' })
    },
    /* 行删除 */
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        const { bomId } = row
        this.treeTableList = this.treeTableList.filter((x) => x.bomId !== bomId)
        this.tableList.splice(index, 1)
        this.calculateProjectTemplate()
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.fullId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
      this.tableDisabled()
    },
    tableDisabled() {
      const isDisabled = (data) => {
        data.forEach((item) => {
          if (item.bomAccessoriesType === '2') {
            const { childProjectTemplateContentList, maxQty } = item

            const list = childProjectTemplateContentList.filter(
              (k) => this.ids.indexOf(k.fullId) !== -1
            )
            childProjectTemplateContentList.forEach((x) => {
              if (list.length === maxQty) {
                if (this.ids.indexOf(x.fullId) === -1) {
                  this.$set(x, 'isDisabled', '1')
                }
              } else {
                this.$set(x, 'isDisabled', undefined)
              }
            })
          }
          if (
            item.childProjectTemplateContentList &&
            item.childProjectTemplateContentList.length > 0
          ) {
            isDisabled(item.childProjectTemplateContentList || [])
          }
        })
      }
      isDisabled(this.treeTableList)
    },
    handleSelectAll() {
      const isAllSelected = this.$refs.tables.store.states.isAllSelected
      const _handleSelectAll = (data) => {
        data.forEach((item) => {
          this.$refs.tables.toggleRowSelection(item, isAllSelected)
          _handleSelectAll(item.childProjectTemplateContentList || [])
        })
      }
      _handleSelectAll(this.treeTableList)
    },
    handleSelect(selection, current) {
      // 判断selection中是否存在current,若是存在那么就代表是被勾选上了,若是不存在代表是取消勾选了
      const isChecked = !!selection.find((item) => item.fullId === current.fullId)
      // 如果当前项被取消勾选
      if (!isChecked) {
        // 那么其所有的祖先也应该被取消勾选
        // this.uncheckedParents(selection, current)
        // 那么其所有的后代也应该被取消勾选
        this.toggleCheckedChildrens(selection, current, false)
      } else {
        // 如果当前项被勾选
        // 那么若同一组的元素都被勾选了,那么父元素将也被勾选,依次往上类推
        // this.checkedParents(selection)
        // 那么其所有的后代都要被勾选
        this.toggleCheckedChildrens(selection, current, true)
      }
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
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      if (!valid1) {
        this.activeName = 'basicInfo'
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      this.collapseWarningForBasicInfo = false
      const param = JSON.parse(JSON.stringify(this.form))
      // param.projectMsg = param.projectMsg.replace(/<img([^>]*)>/g, '<img$1 />')

      const isSelect = (data) => {
        data.forEach((item) => {
          if (this.ids.indexOf(item.fullId) !== -1) {
            this.$set(item, 'isSelect', '1')
          } else if (item.isCanSelectUse === '1') {
            this.$set(item, 'isSelect', '0')
          }
          if (
            item.childProjectTemplateContentList &&
            item.childProjectTemplateContentList.length > 0
          ) {
            isSelect(item.childProjectTemplateContentList || [])
          }
        })
      }
      isSelect(this.treeTableList)
      param.projectTemplateBomList = this.tableList
      param.projectTemplateContentList = this.treeTableList
      this.btnLoading = true
      this.$modal
        .confirm(this.$t('PRODUCT.templateSave'))
        .then(() => {
          saveDraftProjectTemplate(param)
            .then((res) => {
              const { projectTemplateNo } = res.data || {}
              this.$modal.msgSuccess(
                this.$t('PRODUCT.templateSaveSuccess').replace('$1', projectTemplateNo)
              )
              this.cancel()
              this.btnLoading = false
            })
            .catch(() => {
              this.btnLoading = false
            })
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    async submitForm() {
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      if (!valid1) {
        this.activeName = 'basicInfo'
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }

      this.collapseWarningForBasicInfo = false

      if (this.tableList.length <= 0) {
        this.activeName = 'basicInfo'
        this.$modal.msgError(this.$t('PRODUCT.bomTableEmpty'))
        this.collapseWarningForProductInfo = true
        return
      }
      this.collapseWarningForProductInfo = false

      const isSelect = (data) => {
        data.forEach((item) => {
          if (this.ids.indexOf(item.fullId) !== -1) {
            this.$set(item, 'isSelect', '1')
          } else if (item.isCanSelectUse === '1') {
            this.$set(item, 'isSelect', '0')
          }
          if (
            item.childProjectTemplateContentList &&
            item.childProjectTemplateContentList.length > 0
          ) {
            isSelect(item.childProjectTemplateContentList || [])
          }
        })
      }
      if (this.form.projectTemplateStatus !== '2') {
        isSelect(this.treeTableList)
      }

      let index = 1
      const isSn = (data) => {
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          item.customIndex = index
          index++
          if (
            item.childProjectTemplateContentList &&
            item.childProjectTemplateContentList.length > 0
          ) {
            isSn(item.childProjectTemplateContentList || [])
          }
        }
      }
      isSn(this.treeTableList)

      let flag = false
      const isRange = (data) => {
        data.forEach((item) => {
          if (flag) return
          if (item.bomAccessoriesType === '2') {
            const { childProjectTemplateContentList, productName, customIndex, maxQty, minQty } =
              item

            const list = childProjectTemplateContentList.filter((k) => k.isSelect === '1')
            if (list.length > maxQty || list.length < minQty) {
              flag = true
              const str =
                productName +
                `(${this.$t('PRODUCT.max')}
                            ${maxQty}, ${this.$t('PRODUCT.min')}
                            ${minQty})`
              this.$modal.msgError(
                this.$t('PRODUCT.checkProduct').replace('$1', str).replace('$2', customIndex)
              )
              this.collapseWarningForContent = true
              return
            }

            if (list && list.length > 0) {
              isRange(list || [])
              return
            }
            // let num = 0
            // if (list && list.length > 0) {
            //   const childFullIds = childProjectTemplateContentList.map((x) => x.fullId)
            //   this.ids.forEach((x) => {
            //     if (childFullIds.indexOf(x) !== -1) {
            //       num++
            //     }
            //   })
            // }
            // if (childProjectTemplateContentList && childProjectTemplateContentList.length > 0) {
            //   const childFullIds = childProjectTemplateContentList.map((x) => x.fullId)
            //   this.ids.forEach((x) => {
            //     if (childFullIds.indexOf(x) !== -1) {
            //       num++
            //     }
            //   })
            // }
            // if (num > maxQty || num < minQty) {
            //   flag = true
            //   this.$modal.msgError(this.$t('PRODUCT.checkProduct').replace('$1', productName))
            //   this.collapseWarningForContent = true
            //   return
            // }
          }
          if (
            item.childProjectTemplateContentList &&
            item.childProjectTemplateContentList.length > 0
          ) {
            isRange(item.childProjectTemplateContentList || [])
          }
        })
      }
      if (this.form.projectTemplateStatus !== '2') {
        isRange(this.treeTableList)
      }
      if (flag) return
      if (this.rowId) {
        if (this.form.projectTemplateStatus === '2' && this.treeTableList.length <= 0) {
          this.activeName = 'basicInfo'
          this.$modal.msgError(this.$t('PRODUCT.contentTableEmpty'))
          this.collapseWarningForContent = true
          return
        }
        const isCanUpdateUnitCost = (data) => {
          data.forEach((item) => {
            if (flag) return
            if (item.isCanUpdateUnitCost === '1') {
              if (!this.$resultOfBoolean(item.unitCost)) {
                flag = true
                this.$modal.msgError(
                  this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.unitCost'))
                )
                return
              }
              if (
                !this.$resultOfBoolean(item.purchaseUnitPrice) &&
                !this.$resultOfBoolean(item.referenceAmount)
              ) {
                flag = true
                this.$modal.msgError(
                  this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.purchasePrice'))
                )
                return
              }
            }

            if (
              item.childProjectTemplateContentList &&
              item.childProjectTemplateContentList.length > 0
            ) {
              isCanUpdateUnitCost(item.childProjectTemplateContentList || [])
            }
          })
        }
        const assembledProductList = this.treeTableList.filter(
          (x) => (x) => x.assembledProduct !== '1'
        )
        if (this.form.projectTemplateStatus !== '1') {
          isCanUpdateUnitCost(assembledProductList)
        }
        if (flag) return
        // const isPurchasePrice = (data) => {
        //   if (flag) return
        //   data.forEach((item) => {
        //     if (
        //       item.isSelect === '1' &&
        //       item.isCanSelectUse === '1' &&
        //       !item.purchaseQuotationNo &&
        //       !item.purchaseUnitPrice
        //     ) {
        //       flag = true
        //       this.$modal.msgError(
        //         this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.purchasePrice'))
        //       )
        //       return
        //     }
        //     if (
        //       item.childProjectTemplateContentList &&
        //       item.childProjectTemplateContentList.length > 0
        //     ) {
        //       isPurchasePrice(item.childProjectTemplateContentList || [])
        //     }
        //   })
        // }
        // isPurchasePrice(this.treeTableList)
        // if (flag) return

        const valid2 = await this.$refs.form.validate().catch((err) => {
          return err
        })
        if (!valid2) {
          this.activeName = 'basicInfo'
          this.collapseWarningForContent = true
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.content')))
          return
        }
      }
      this.collapseWarningForContent = false

      const tempDiv = document.createElement('div')
      const htmlStr = this.form.projectMsg || ''
      tempDiv.innerHTML = htmlStr
      const str = (tempDiv.innerText || '').trim()
      if (!!str || htmlStr.includes('<img')) {
        console.log('true')
      } else {
        this.activeName = 'templateInfo'
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.templateInfo'))
        )
        return
      }
      const valid3 = await this.$refs.form2.validate().catch((err) => {
        return err
      })

      if (!valid3) {
        this.activeName = 'templateInfo'
        this.$modal.msgError(
          this.$t('ETM.htmlChartGtTenThousand7000')
          // this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.templateInfo'))
        )
        return
      }

      const param = JSON.parse(JSON.stringify(this.form))
      param.projectTemplateBomList = this.tableList
      param.projectTemplateContentList = this.treeTableList
      this.btnLoading = true
      this.$modal
        .confirm(this.$t('PRODUCT.templateSubmit'))
        .then(() => {
          saveProjectTemplate(param)
            .then((res) => {
              const { projectTemplateNo } = res.data || {}
              this.$modal.msgSuccess(
                this.$t('PRODUCT.templateSubmitSuccess').replace('$1', projectTemplateNo)
              )
              this.cancel()
              this.btnLoading = false
            })
            .catch(() => {
              this.btnLoading = false
            })
        })
        .catch(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
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
