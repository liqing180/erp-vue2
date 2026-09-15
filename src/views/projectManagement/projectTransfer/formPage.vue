<template>
  <FormPageLayout ref="FormPageLayoutRef">
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        v-if="!comDisFrom"
        :loading="btnLoading"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
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
                    :label="`${$t('PRODUCT.transferFrom')}`"
                    prop="transferFromCostProjectId"
                  >
                    <div style="position: relative">
                      <CommonSelectAndList
                        :id="form.transferFromCostProjectId"
                        :label="form.transferFromCostProjectName"
                        idKey="costProjectId"
                        labelKey="costProjectName"
                        filterable
                        clearable
                        :options="canSelectProjectList('transferFrom')"
                        :loading="projectLoading"
                        :showAdd="false"
                        @change="updateProject($event, 'transferFrom')"
                      >
                        <template slot-scope="{ item }">{{ item.projectShowStr }}</template>
                      </CommonSelectAndList>
                      <div class="custom-add-list">
                        <svg-icon
                          icon-class="list2"
                          class="primary-pointer"
                          style="font-size: 26px"
                          @click="openProject('transferFrom')"
                          v-if="!comDisFrom"
                        />
                      </div>
                    </div>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.transferFromCustomer')}`">
                    <el-input
                      v-model="form.transferFromBusinessPartnerName"
                      :title="form.transferFromBusinessPartnerName"
                      class="form-wd"
                      disabled
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.projectTransferOrderNo')}`">
                    <el-input
                      v-model="form.costProjectTransferNo"
                      :title="form.costProjectTransferNo"
                      class="form-wd"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('PRODUCT.transferTo')}`"
                    prop="transferToCostProjectId"
                  >
                    <div style="position: relative">
                      <CommonSelectAndList
                        :id="form.transferToCostProjectId"
                        :label="form.transferToCostProjectName"
                        idKey="costProjectId"
                        labelKey="costProjectName"
                        filterable
                        clearable
                        :options="canSelectProjectList('transferTo')"
                        :loading="projectLoading"
                        :showAdd="false"
                        @change="updateProject($event, 'transferTo')"
                      >
                        <template slot-scope="{ item }">{{ item.projectShowStr }}</template>
                      </CommonSelectAndList>
                      <div class="custom-add-list">
                        <svg-icon
                          icon-class="list2"
                          class="primary-pointer"
                          style="font-size: 26px"
                          @click="openProject('transferTo')"
                          v-if="!comDisFrom"
                        />
                      </div>
                    </div>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.transferToCustomer')}`">
                    <el-input
                      v-model="form.transferToBusinessPartnerName"
                      :title="form.transferToBusinessPartnerName"
                      class="form-wd"
                      disabled
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.transferDate')}`" prop="transferDate">
                    <el-date-picker
                      v-model="form.transferDate"
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
                <el-col :span="24">
                  <el-form-item :label="$t('ui.reason')" prop="reason">
                    <MyInput
                      type="textarea"
                      v-model="form.reason"
                      :autosize="{ minRows: 2, maxRows: 4 }"
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
        <div class="form-card mt10" ref="collapseScrollPage">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('menu.productInfo')"
              :warning="collapseWarningForProductInfo"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                  <el-button
                    @click="handleBtnAdd"
                    :disabled="loading || !form.transferFromCostProjectId"
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    v-if="!comDisFrom"
                    >{{ $t('uiBtn.add') }}</el-button
                  >
                </el-col>

                <right-toolbar
                  :saveKey="saveKey"
                  :savePath="savePath"
                  :showRefreshBtn="false"
                  @queryTable="queryTable"
                  :columns="configColumn"
                  :columnsInit="columns"
                ></right-toolbar>
              </el-row>
              <el-table
                border
                max-height="600px"
                :data="showTableList"
                :row-class-name="tableRowClassName"
                :key="'table' + modifyHighlight"
                :cell-class-name="tableCellClassName"
                v-loading="loading"
              >
                <!-- <el-table-column
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
                </el-table-column> -->
                <el-table-column
                  type="index"
                  :label="$t('ui.sn')"
                  width="80"
                  fixed="left"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.projectProductionConsumptionId
                        ? scope.$index + 1
                        : $t('PRODUCT.subTotal')
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-for="item in visibleColumn"
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
                    <template v-if="['transferQty'].includes(item.prop)">
                      <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                    </template>

                    <template v-else-if="['transferAmount'].includes(item.prop)">
                      <span>{{ column.label }}</span>
                      <span v-if="legalEntityInfo.currencySymbol"
                        >({{ legalEntityInfo.currencySymbol }})</span
                      >
                    </template>
                    <span v-else>{{ column.label }}</span>
                  </template>
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'transferQty'">
                      <template v-if="!comDisFrom && scope.row.subTotal != '1'">
                        <el-input-number
                          v-thousandSplit="{ precision: scope.row.decimalNum }"
                          style="width: 98%"
                          v-model="scope.row.transferQty"
                          controls-position="right"
                          :precision="scope.row.decimalNum"
                          :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                          :max="scope.row.canTransferQty"
                          @change="transferQtyChange(scope.row)"
                        />
                      </template>
                      <template v-else>{{
                        $numberStr(scope.row[item.prop], scope.row.decimalNum)
                      }}</template>

                      <TablePropError v-if="scope.row[item.prop + 'Error']" />
                    </template>
                    <template v-else-if="item.prop === 'stockOutQty'">
                      <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
                    </template>
                    <template v-else-if="item.prop === 'alreadyTransferQty'">
                      <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
                    </template>
                    <template v-else-if="item.prop === 'transferAmount'">
                      <span>{{ $numberStr(scope.row[item.prop], 2) }}</span>
                    </template>

                    <template v-else-if="item.prop === 'uom'">
                      <span :title="showUomLabel(scope.row[item.prop])">{{
                        scope.row[item.prop]
                      }}</span>
                    </template>
                    <template v-else-if="item.prop === 'basicUom'">
                      <span :title="showUomLabel(scope.row[item.prop])">{{
                        scope.row[item.prop]
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
                  v-if="!comDisFrom"
                >
                  <template slot-scope="scope">
                    <div class="flexCen" v-if="scope.row.subTotal !== '1'">
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
    </template>
    <!-- 转出、转入项目 -->
    <selectCostProjectTable ref="selectCostProjectTable" @onSuccess="updateProject" />

    <!-- 新增产品 -->
    <selectProductTable
      ref="selectProductTable"
      :transferFromCostProjectId="form.transferFromCostProjectId"
      @onSuccess="updateTable"
    />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'
import locale2 from '@/views/system/lang/index'

import {
  queryCanSelectCostProjectList,
  submitCostProjectTransfer,
  queryCostProjectTransferById
} from '@/api/projectManagement/projectTransfer'

import selectCostProjectTable from './components/selectCostProjectTable'
import selectProductTable from './components/selectProductTable'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  name: '',
  dicts: ['project_template_status', 'product_type'],
  mixins: [pageMixin],
  components: {
    selectProductTable,
    SystemOperationLogTable,
    selectCostProjectTable
  },
  data() {
    const vm = this
    return {
      loading: false,
      saveKey: '2',
      activeNames: ['1', '2', '3', '4'],
      btnLoading: false,
      previewPDFLoading: false,
      rowIdKey: 'fullId',
      savePath: 'projectTransferFormPage',
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
        transferFromCostProjectId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        transferToCostProjectId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        transferDate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        reason: [
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
          prop: 'projectProductionNo',
          label: vm.$t('PRODUCT.projectProductionNo'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
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
        },
        {
          prop: 'stockOutQty',
          label: vm.$t('PRODUCT.outboundQTY'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'alreadyTransferQty',
          label: vm.$t('PRODUCT.alreadyTransferQty'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'transferQty',
          label: vm.$t('PRODUCT.transferQTY'),
          visible: true,
          colMinWidth: 120,
          tooltip: true
        },
        {
          prop: 'transferAmount',
          label: vm.$t('PRODUCT.transferAmount'),
          visible: true,
          colMinWidth: 180,
          tooltip: true,
          align: 'right'
        }
      ],
      buttonAuthMsg: {
        isCanUpdate: '0'
      },
      tableList: [],
      projectLoading: false,
      projectList: [],
      submitLoading: false
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
        this.queryCanSelectCostProjectList()
      }
    }
  },
  computed: {
    showTableList() {
      const rows = (this.tableList || []).slice()
      if (rows.length > 0) {
        let stockOutQty = 0
        let transferQty = 0
        let transferAmount = 0
        let alreadyTransferQty = 0
        rows.forEach((item) => {
          if (this.$resultOfBoolean(item.stockOutQty)) {
            stockOutQty += Number(item.stockOutQty) || 0
          }
          if (this.$resultOfBoolean(item.transferQty)) {
            transferQty += Number(item.transferQty) || 0
          }
          if (this.$resultOfBoolean(item.transferAmount)) {
            transferAmount += Number(item.transferAmount) || 0
          }
          if (this.$resultOfBoolean(item.alreadyTransferQty)) {
            alreadyTransferQty += Number(item.alreadyTransferQty) || 0
          }
        })
        transferQty = rows.some((x) => this.$resultOfBoolean(x.transferQty))
          ? transferQty
          : undefined
        transferAmount = rows.some((x) => this.$resultOfBoolean(x.transferAmount))
          ? transferAmount
          : undefined
        alreadyTransferQty = rows.some((x) => this.$resultOfBoolean(x.alreadyTransferQty))
          ? alreadyTransferQty
          : undefined
        rows.push({
          subTotal: '1',
          stockOutQty,
          transferQty,
          transferAmount,
          alreadyTransferQty,
          decimalNum: 3
        })
      }
      console.log(rows, '============561')
      return rows
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
    editAuth() {
      return this.checkPermi(['projectManagement:projectTransfer:edit'])
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
      queryCostProjectTransferById({ costProjectTransferId: rowId }).then((res) => {
        const data = res.data
        this.tableList = data.costProjectTransferProductList || []
        this.buttonAuthMsg = data.buttonAuthMsg || {}
        this.form = data
        this.changeTableList()
        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },
    canSelectProjectList(type) {
      const list = this.projectList
      if (type === 'transferFrom') {
        return list.filter((x) => {
          return x.costProjectId !== this.form.transferToCostProjectId
        })
      } else if (type === 'transferTo') {
        return list.filter((x) => {
          return x.costProjectId !== this.form.transferFromCostProjectId
        })
      }
      return list
    },
    queryCanSelectCostProjectList() {
      this.projectLoading = true
      queryCanSelectCostProjectList({
        pageNum: 1,
        pageSize: 999999
      })
        .then((res) => {
          const rows = res.data || []
          rows.forEach((x) => {
            x.projectShowStr = `${x.costProjectCode}, ${x.costProjectName}`
          })
          this.projectList = rows || []

          this.projectLoading = false
        })
        .catch(() => {
          this.projectLoading = false
        })
    },
    updateProject(row, type) {
      if (type === 'transferFrom') {
        // console.log(!row.costProjectId, '=============686')
        // console.log(
        //   this.form.transferFromCostProjectId,
        //   row.costProjectId,
        //   this.form.transferFromCostProjectId !== row.costProjectId,
        //   '=============691'
        // )
        if (!row.costProjectId || this.form.transferFromCostProjectId !== row.costProjectId) {
          this.tableList = []
        }
        this.$set(this.form, 'transferFromCostProjectId', row.costProjectId)
        this.$set(this.form, 'transferFromCostProjectName', row.costProjectName)
        this.$set(this.form, 'transferFromCostProjectCode', row.costProjectCode)
        this.$set(this.form, 'transferFromBusinessPartnerName', row.businessPartnerName)
      } else {
        this.$set(this.form, 'transferToCostProjectId', row.costProjectId)
        this.$set(this.form, 'transferToCostProjectName', row.costProjectName)
        this.$set(this.form, 'transferToCostProjectCode', row.costProjectCode)
        this.$set(this.form, 'transferToBusinessPartnerName', row.businessPartnerName)
      }
    },
    openProject(type) {
      this.$refs.selectCostProjectTable.handleOpen(type, this.form)
    },
    handleBtnAdd() {
      const alreadySelectIdList = JSON.parse(JSON.stringify(this.tableList))
      this.$refs.selectProductTable.handleAdd(alreadySelectIdList)
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        this.tableList = rows
      }
      this.changeTableList()
    },
    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    transferQtyChange(row) {
      this.$set(row, 'transferQtyError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    cellClass(row) {
      if (row.columnIndex === 0) {
        return 'cell-class'
      }
    },
    reset() {
      this.form = {
        reason: undefined,
        transferFromCostProjectId: undefined,
        transferFromCostProjectName: undefined,
        transferFromCostProjectCode: undefined,
        transferFromBusinessPartnerName: undefined,
        transferToCostProjectId: undefined,
        transferToCostProjectName: undefined,
        transferToCostProjectCode: undefined,
        transferToBusinessPartnerName: undefined,
        projectTemplateStatus: undefined,
        projectTemplateStatusName: undefined,
        costProjectTransferProductList: [],
        transferDate: Date.now()
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForContent = false
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('form1')
    },
    cellClassName({ row, column }) {
      let cellClass = ''
      if (row.isErr === '1' && column.property === 'uom' && row.productType === '1') {
        cellClass = 'is-err-table-cell'
      }
      return cellClass
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
      this.$router.push({ path: '/projectManagement/projectTransfer' })
    },
    /* 行删除 */
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.changeTableList()
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.fullId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
      if (row['ROW-ERROR']) {
        color = 'required-row'
      }
      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (this.modifyHighlight) {
        if (row.updateType === '1') {
          if ((row.updateMsgList || []).find((item) => item.name === column.property)) {
            cellClass = 'edit-table-cell'
          }
        }
      }
      if (!row[column.property] && row[column.property + 'Error']) {
        cellClass = 'is-required-table-cell'
      }
      return cellClass
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
    async submitForm() {
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      if (!valid1) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }

      this.collapseWarningForBasicInfo = false

      if (this.tableList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.productIsEmpty'))
        this.collapseWarningForProductInfo = true
        return
      }
      const qtyReq = this.tableList.find((item) => {
        return !this.$resultOfBoolean(item.transferQty)
      })
      if (qtyReq) {
        // this.errorMessage('transferQty')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.transferQTY'))
        )
        this.collapseWarningForProductInfo = true
        return
      }

      this.collapseWarningForProductInfo = false
      const param = JSON.parse(JSON.stringify(this.form))
      param.costProjectTransferProductList = this.tableList

      this.$modal
        .confirm(this.$t('PRODUCT.submitProjectTransferOrder'))
        .then(() => {
          this.btnLoading = true
          submitCostProjectTransfer(param)
            .then((res) => {
              this.$modal.msgSuccess(
                this.$t('PRODUCT.transferOrderSubmittedSuccessfully').replace('$1', res.msg)
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
.custom-add-list {
  position: absolute;
  top: 0;
  right: -35px;
  cursor: pointer;
}
</style>
