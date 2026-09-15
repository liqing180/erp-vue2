<template>
  <FormPageLayoutTabs v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm" v-if="!comDisFrom"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        @click="handleSaveDraft"
        v-if="saveDraftBtnShow && isRevisePage !== '1'"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="approvedBtnShow && isRevisePage !== '1'"
        @click="handleApproved"
        >{{ $t('uiBtn.approve') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="rejectedBtnShow && isRevisePage !== '1'"
        @click="handleRejected"
        >{{ $t('uiBtn.reject1') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow && isRevisePage !== '1'"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="reviseBtnShow && isRevisePage !== '1'"
        @click="handleRevise"
        >{{ $t('uiBtn.revise') }}
      </el-button>

      <el-button
        type="primary"
        size="mini"
        v-if="copyBtnShow && isRevisePage !== '1'"
        @click="handleCopy"
        >{{ $t('menu.copyBOM') }}
      </el-button>

      <el-dropdown
        class="ml10 mr10 fr"
        @command="(command) => settingHandleCommand(command)"
        trigger="click"
        v-if="
          bpHistoryVersionList.length > 0 &&
          comeFrom === '1' &&
          isRevisePage !== '1' &&
          isView !== '1'
        "
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

      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>

      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">{{ $t('menu.BOMManagement') }}</div>
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
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PRODUCT.combinationProductName')}`"
                      prop="combinationProductName"
                    >
                      <SelectInput
                        clearable
                        :value="form.combinationProductName"
                        :title="form.combinationProductName"
                        @click="openProductTable"
                        @clear="productClear"
                        :disabled="!!rowId"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input :value="form.bomStatusShowStr" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.BOMNo')}`">
                      <el-input
                        v-model="form.bomNo"
                        :title="form.bomNo"
                        maxlength="200"
                        class="form-wd"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.combinationProductNo')}`">
                      <el-input
                        v-model="form.combinationProductNo"
                        :title="form.combinationProductNo"
                        maxlength="200"
                        class="form-wd"
                        disabled
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
                  <el-col :span="24">
                    <el-form-item
                      :label="`${$t('ui.attachment')}`"
                      :class="[isModified('attachment')]"
                    >
                      <myUpload ref="uploadRef" :limit="9" :disabled="comDisFrom" />
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
                :title="$t('PRODUCT.BOMAccessories')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5" v-if="!comDisFrom">
                    <el-button
                      @click="handleBtnAdd"
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      :disabled="!form.combinationProductName"
                      >{{ $t('uiBtn.add') }}</el-button
                    >
                  </el-col>
                  <el-col :span="1.5" v-if="!comDisFrom">
                    <el-button
                      @click="handleBtnCombination"
                      :disabled="!isCombination()"
                      type="primary"
                      size="mini"
                      >{{ $t('PRODUCT.combination') }}</el-button
                    >
                  </el-col>

                  <right-toolbar
                    :saveKey="saveKey"
                    :showSearchBtn="false"
                    :showRefreshBtn="false"
                    @queryTable="queryTable"
                    :columns="configColumn"
                    :columnsInit="columns"
                  ></right-toolbar>
                </el-row>
                <el-table
                  border
                  ref="tables"
                  max-height="600px"
                  :row-key="rowIdKey"
                  lazy
                  :default-expand-all="true"
                  :tree-props="{ children: 'childBomAccessoriesList', hasChildren: 'hasChildren' }"
                  :data="tableList"
                  :row-class-name="tableRowClassName"
                  :key="'table' + modifyHighlight"
                  :cell-class-name="tableCellClassName"
                  :header-cell-class-name="cellClass"
                  @select="handleSelect"
                  @select-all="handleSelectAll"
                  @selection-change="handleSelectionChange"
                  class="table"
                  v-table-tab
                >
                  <el-table-column
                    type="selection"
                    width="55"
                    :selectable="selectable"
                    align="center"
                    v-if="!comDisFrom"
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
                      <span v-if="['uom', 'qty'].includes(item.prop)">
                        <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                      </span>
                      <span v-else>{{ column.label }}</span>
                    </template>
                    <template slot-scope="scope">
                      <template v-if="scope.row.bomAccessoriesType !== '2'">
                        <template v-if="item.prop === 'uom'">
                          <el-select
                            style="width: 98%"
                            v-model="scope.row.uom"
                            :title="showUomLabel(scope.row[item.prop])"
                            placeholder=""
                            v-if="!comDisFrom && scope.row.productType === '2'"
                          >
                            <el-option
                              v-for="item in scope.row.uomList || []"
                              :key="item"
                              :label="item"
                              :value="item"
                            >
                            </el-option>
                          </el-select>
                          <span v-else>{{ scope.row[item.prop] }}</span>
                        </template>
                        <template v-else-if="item.prop === 'qty'">
                          <el-input-number
                            style="width: 98%"
                            v-model="scope.row.qty"
                            controls-position="right"
                            :precision="scope.row.decimalNum"
                            v-thousandSplit="{ precision: scope.row.decimalNum }"
                            :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                            :max="scope.row.includeDecimal === '1' ? 999.999 : 999"
                            v-if="!comDisFrom"
                          />
                          <!-- v-if="!comDisFrom && scope.row.isAlreadyAccessories !== '1'" -->
                          <span v-else>{{
                            $numberStr(scope.row[item.prop], scope.row.decimalNum)
                          }}</span>
                        </template>
                        <template v-else-if="item.prop === 'remarks'">
                          <descriptionEditDlg
                            v-model="scope.row.remarks"
                            :maxlength="200"
                            :disabled="comDisFrom"
                          />
                        </template>
                        <template v-else-if="item.prop === 'productType'">
                          <div v-if="scope.row.bomAccessoriesType !== '2'">
                            <!-- <span v-if="scope.row.productType === '1'">{{
                              $t('PRODUCT.product')
                            }}</span>
                            <span v-if="scope.row.productType === '2'">{{
                              $t('menu.service')
                            }}</span> -->
                            <span>{{
                              selectDictLabel(dict.type.product_type, scope.row.productType)
                            }}</span>
                          </div>
                        </template>
                        <template v-else>{{ scope.row[item.prop] }}</template>
                      </template>
                      <template v-else>
                        <template v-if="item.prop === 'productType'">
                          <div v-if="scope.row.bomAccessoriesType !== '2'">
                            <span v-if="scope.row.productType === '1'">{{
                              $t('PRODUCT.product')
                            }}</span>
                            <span v-if="scope.row.productType === '2'">{{
                              $t('menu.service')
                            }}</span>
                          </div>
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
                          class="el-icon-edit pointer mr10"
                          style="font-size: 20px; color: #409eff"
                          :title="$t('uiBtn.edit')"
                          v-if="scope.row.bomAccessoriesType === '2'"
                          @click="handleCombination(scope.row)"
                        ></i>
                        <i
                          class="el-icon-plus pointer mr10"
                          style="font-size: 20px; color: #409eff"
                          :title="$t('uiBtn.add')"
                          v-if="scope.row.assembledProduct === '1' && scope.row.customIndex < 6"
                          @click="handleAddChild(scope.row)"
                        ></i>
                        <!-- scope.row.isAlreadyAccessories !== '1' && scope.row.assembledProduct === '1' && scope.row.customIndex < 6 -->

                        <i
                          class="el-icon-delete pointer"
                          style="font-size: 20px; color: #f56c6c"
                          :title="$t('uiBtn.delete')"
                          v-if="
                            (scope.row.isFatherType !== '1' &&
                              scope.row.isAlreadyAccessories !== '1') ||
                            (scope.row.isAlreadyAccessories === '1' &&
                              scope.row.parentId === '0') ||
                            scope.row.bomAccessoriesType === '2'
                          "
                          @click="handleDelRow(scope.row)"
                        ></i>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" v-if="rowId">
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
                    {{ $t('ui.operTime') }} :
                    {{ parseTime(form.operationLogForLast.operatorTime) }}
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
    <!-- 成品名称 -->
    <selectProductTable ref="selectProductTable" @onSuccess="updateCombinationProductName" />
    <!-- 新增BOM配件 -->
    <selectProductNameTable ref="selectProductNameTable" :query="form" @onSuccess="updateTable" />
    <!-- 组合 -->
    <combinationDlg ref="combinationDlg" :max="selectList.length" @onSuccess="updateCombination" />

    <ApprovedDialog
      :id="form.bomId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.bomId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
  </FormPageLayoutTabs>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'
import {
  saveBom,
  reviseBom,
  saveDraftBom,
  queryBomById,
  approvedBom,
  rejectedBom,
  withdrawApproved,
  queryBomHistoryVersion
} from '@/api/productManagement/BOMManagement'
import selectProductNameTable from './components/selectProductNameTable'
import selectProductTable from './components/selectProductTable'
import combinationDlg from './components/combinationDlg'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
export default {
  name: '',
  dicts: ['bom_status', 'product_type'],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    selectProductNameTable,
    selectProductTable,
    combinationDlg,
    SystemOperationLogTable,
    ApprovedDialog,
    RejectDialog
  },
  data() {
    const vm = this
    return {
      saveKey: '2',
      activeNames: ['1', '2', '3'],
      submitLoading: false,
      rowIdKey: 'fullId',
      rowId: '',
      timeId: '',
      form: {},
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList: [],
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        combinationProductName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      columns: [
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
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        /* {
          prop: 'partNo',
          label: vm.$t('PRODUCT.partNo'),
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
          prop: 'qty',
          label: vm.$t('PRODUCT.qty1'),
          visible: true,
          minWidth: 200,
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
      tableList: [],
      fullId: undefined,
      parentId: undefined,

      /* 审批 */
      buttonAuthMsg: {},
      bpHistoryVersionList: [],
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedBom,
      rejectedUrl: rejectedBom,
      /* 版本比对高亮 */
      basicUpdateProps: [],
      rowParentId: undefined
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
    isRevisePage: {
      type: [String],
      // 1: Revise 页面，0: 其他
      default: '0'
    },
    isView: {
      type: [String],
      // 1: 查看页面，0: 其他
      default: '0'
    }
  },
  watch: {
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    },
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
      return this.checkPermi(['productManagement:BOMManagement:edit'])
    },
    copyAuth() {
      return this.checkPermi(['productManagement:BOMManagement:copy'])
    },
    comDisFrom() {
      let dis = true
      if (!this.rowId) return false
      if (!this.editAuth) {
        return true
      }
      if (this.isRevisePage === '1' && this.form.bomStatus === '2') {
        return false
      }
      /*  */
      if (this.form.bomId && this.buttonAuthMsg.isCanUpdate === '1') {
        dis = false
      }
      return dis
    },
    saveDraftBtnShow() {
      if (!this.rowId) return true
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.bomId &&
        this.buttonAuthMsg.isCanSaveDraft === '1'
      ) {
        show = true
      }
      return show
    },
    comIsRevise() {
      return this.form.isRevise === '1'
    },
    reviseBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (this.form.bomId && this.buttonAuthMsg.isCanRevise === '1' && this.comeFrom === '1') {
        show = true
      }
      return show
    },
    copyBtnShow() {
      if (this.isRevisePage === '1') return false
      if (this.isView === '1') return false
      let show = false
      if (!this.copyAuth) {
        return false
      }
      if (this.form.bomId && this.form.bomStatus === '2' && this.comeFrom === '1') {
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
        this.form.bomId &&
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
        this.form.bomId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      /* if (!this.checkPermi(['inventoryManagement:inventoryAudit:cancel'])) {
        return false
      } */
      let show = false
      if (this.dataType !== '2' && this.form.bomId && this.buttonAuthMsg.isCanCancelled === '1') {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['productManagement:BOMManagement:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.bomId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    modifyHighlight() {
      if (this.approvedBtnShow && this.buttonAuthMsg.isCanSeeUpdateMsg === '1') {
        return true
      }
      return false
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
    cellClass(row) {
      if (row.columnIndex === 0) {
        return 'cell-class'
      }
    },
    queryBomHistoryVersion() {
      if (this.comeFrom !== '1') return
      if (this.isRevisePage === '1') return
      queryBomHistoryVersion({ businessId: this.rowId }).then((res) => {
        this.bpHistoryVersionList = res.data || []
      })
    },
    isModified(prop, type = 1) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    },
    settingHandleCommand(businessId) {
      this.$router.push({
        path: '/productManagement/viewBOMManagement',
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

    handleAdd() {
      this.reset()
      const qeury = this.$route.query || {}
      if (qeury.copyId) {
        queryBomById({ bomId: qeury.copyId }).then((res) => {
          const data = res.data || {}
          this.form = {
            remarks: data.remarks,
            copyFromBomId: data.bomId,
            copyFromBomNo: data.bomNo
          }
          const { bomAccessoriesList, commonFileList } = data
          this.tableList = bomAccessoriesList || []
          this.tableList = this.traverseTree(this.tableList)
          this.buttonAuthMsg = data.buttonAuthMsg || {}
          setTimeout(() => {
            this.$refs.uploadRef && this.$refs.uploadRef.initFileList(commonFileList || [])
          }, 300)
          setTimeout(() => {
            this.setRouteTitleView(this.comDisFrom)
          }, 0)
        })
      }
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      this.queryBomHistoryVersion()
      queryBomById({ bomId: rowId }).then((res) => {
        const data = res.data || {}
        this.form = data
        const { bomAccessoriesList, commonFileList } = data
        this.tableList = bomAccessoriesList || []
        this.tableList = this.traverseTree(this.tableList)
        this.buttonAuthMsg = data.buttonAuthMsg || {}

        /* 版本比对 */
        const updateMsg = data.updateMsg || {}
        const basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
        const beforeCommonFileList = updateMsg.beforeCommonFileList || []
        const afterCommonFileList = updateMsg.afterCommonFileList || []

        setTimeout(() => {
          this.basicUpdateProps = basicUpdateMsgList.map((item) => item.name)
          if (beforeCommonFileList.length > 0 || afterCommonFileList.length > 0) {
            this.basicUpdateProps.push('attachment')
          }
        }, 100)

        setTimeout(() => {
          this.$refs.uploadRef && this.$refs.uploadRef.initFileList(commonFileList || [])
        }, 300)
      })
    },
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    selectable(row, rowIndex) {
      if (row.bomAccessoriesType === '2' || row.isFatherType === '1') return false
      return true // 不禁用
    },
    openProductTable() {
      const alreadySelectIdList = this.tableList
        .filter((x) => x.bomAccessoriesType !== '2')
        .map((item) => item.productId)
      const bomAccessoriesTypeList = (this.tableList || []).filter(
        (x) => x.bomAccessoriesType === '2'
      )
      bomAccessoriesTypeList.forEach((x) => {
        if (x.childBomAccessoriesList && x.childBomAccessoriesList.length > 0) {
          x.childBomAccessoriesList.forEach((k) => {
            alreadySelectIdList.push(k.productId)
          })
        }
      })
      this.$refs.selectProductTable.handleAdd(alreadySelectIdList)
    },
    productClear() {
      this.$set(this.form, 'combinationProductName', undefined)
      this.$set(this.form, 'productId', undefined)
      this.$set(this.form, 'combinationProductNo', undefined)
    },
    updateCombinationProductName(row) {
      /* if (this.form.productId !== row.productId) {
        this.tableList = []
      } */
      const { productName, internalPartNo } = row
      const data = { ...row }
      delete data.approvedBy
      delete data.approvedId
      delete data.approvedStatusShowStr
      delete data.approvedStatus
      delete data.approvedTime
      this.form = Object.assign(this.form, { ...data })
      this.$set(this.form, 'combinationProductName', productName)
      this.$set(this.form, 'combinationProductNo', internalPartNo)
    },
    reset() {
      this.form = {
        combinationProductName: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.activeNames = ['1', '2', '3']

      this.bpHistoryVersionList = []
      this.basicUpdateProps = []
      this.resetForm('form1')
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
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
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (this.modifyHighlight) {
        if (row.updateType === '1') {
          if (
            (row.updateMsgList || []).find((item) => {
              let name = item.name
              if (item.name === 'minQty' || item.name === 'maxQty') {
                name = 'productName'
              }
              return name === column.property
            })
          ) {
            cellClass = 'edit-table-cell'
          }
        }
      }
      if (row.isErr === '1' && column.property === 'uom' && row.productType === '1') {
        cellClass = 'is-err-table-cell'
      }
      return cellClass
    },
    nav(row) {
      const fromSrcPath = encodeURIComponent('/productManagement/addProductExtended')
      this.$router.push({
        path: '/productManagement/editExtendedProductInfo',
        query: {
          id: row.productId,
          timeId: Date.now(),
          fromSrcPath
        }
      })
    },
    extendedOrganizationChange() {
      this.tableList = []
    },
    // 是否可组合
    isCombination() {
      if (this.selectList.length <= 1) return false
      // 判断产品类别是否一致
      const num = this.selectList.filter((x) => x.productType === '1').length
      if (num !== this.selectList.length && num !== 0) return false
      const fullIds = this.selectList.map((x) => x.fullId)
      let flag = true
      const getParents = (tree, parentId) => {
        tree.forEach((x) => {
          if (x.fullId === fullIds[0]) {
            this.parentId = parentId || ''
            const treeIds = tree.map((x) => x.fullId)
            flag = fullIds.every((k) => treeIds.indexOf(k) !== -1)
            if (flag) {
              flag = fullIds.length <= tree.length
            }
            return
          }
          if (x.childBomAccessoriesList) {
            return getParents(x.childBomAccessoriesList, x.fullId)
          }
        })
      }
      getParents(this.tableList)
      return flag
    },
    updateCombination(e = {}) {
      const { fullId } = e
      if (fullId) {
        console.log('==========994')
        const getCurrent = (tree) => {
          tree.forEach((x, i) => {
            if (x.fullId === fullId) {
              tree.splice(i, 1, e)
              return
            }
            if (x.childBomAccessoriesList) {
              return getCurrent(x.childBomAccessoriesList)
            }
          })
        }
        getCurrent(this.tableList)
      } else {
        if (this.parentId) {
          const getCurrent = (tree) => {
            tree.forEach((x, i) => {
              if (x.fullId === this.parentId) {
                const fullIds = this.selectList.map((x) => x.fullId)
                x.childBomAccessoriesList = x.childBomAccessoriesList.filter(
                  (k) => fullIds.indexOf(k.fullId) === -1
                )

                const timeStamp = +new Date() + i
                const setFullId = (selectList) => {
                  selectList.forEach((m) => {
                    m.fullId = this.parentId + '-' + timeStamp + '-' + m.productId
                    if (m.childBomAccessoriesList && m.childBomAccessoriesList.length) {
                      setFullId(m.childBomAccessoriesList)
                    }
                  })
                }
                setFullId(this.selectList)
                x.childBomAccessoriesList.push({
                  ...e,
                  fullId: timeStamp,
                  childBomAccessoriesList: this.selectList
                })
                return
              }
              if (x.childBomAccessoriesList) {
                return getCurrent(x.childBomAccessoriesList)
              }
            })
          }
          getCurrent(this.tableList)
        } else {
          console.log(this.parentId, '==========1041')
          const fullIds = this.selectList.map((x) => x.fullId)
          this.tableList = this.tableList.filter((k) => fullIds.indexOf(k.fullId) === -1)

          const timeStamp = +new Date()
          const setFullId = (selectList, parentId) => {
            selectList.forEach((x, i) => {
              // if (x.productId === '13682440434024450') {
              //   console.log(x, '====1049')
              // }
              x.fullId = (parentId || timeStamp) + '-' + (x.productId || timeStamp + i)
              x.parentId = x.parentId === '0' ? timeStamp + i : x.parentId
              if (x.childBomAccessoriesList && x.childBomAccessoriesList.length) {
                setFullId(x.childBomAccessoriesList, x.fullId)
              }
            })
          }
          setFullId(this.selectList)
          console.log(this.selectList, '=====1058')
          this.tableList.push({
            ...e,
            fullId: timeStamp,
            childBomAccessoriesList: this.selectList
          })
          console.log(this.tableList, '========1064')
        }

        this.parentId = ''
        this.handleSelectionChange([])
        const _handleSelectAll = (data, type) => {
          data.forEach((item) => {
            this.$refs.tables.toggleRowSelection(item, false)
            if (type === '2') {
              this.$set(item, 'isFatherType', '1')
            } else {
              this.$set(item, 'isFatherType', undefined)
            }
            _handleSelectAll(item.childBomAccessoriesList || [], item.bomAccessoriesType)
          })
        }
        _handleSelectAll(this.tableList)
      }
      this.isCombination()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection, '===1089')
      this.ids = selection.map((item) => item.fullId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
      this.isCombination()
    },
    handleSelectAll() {
      const isAllSelected = this.$refs.tables.store.states.isAllSelected
      const _handleSelectAll = (data) => {
        data.forEach((item) => {
          this.$refs.tables.toggleRowSelection(item, isAllSelected)
          _handleSelectAll(item.childBomAccessoriesList || [])
        })
      }
      _handleSelectAll(this.tableList)
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
    // 新增BOM配件
    handleBtnAdd() {
      this.fullId = undefined
      const alreadySelectIdList = this.tableList
        .filter((x) => x.bomAccessoriesType !== '2')
        .map((item) => item.productId)
      const bomAccessoriesTypeList = (this.tableList || []).filter(
        (x) => x.bomAccessoriesType === '2'
      )
      bomAccessoriesTypeList.forEach((x) => {
        if (x.childBomAccessoriesList && x.childBomAccessoriesList.length > 0) {
          x.childBomAccessoriesList.forEach((k) => {
            alreadySelectIdList.push(k.productId)
          })
        }
      })
      alreadySelectIdList.push(this.form.productId)
      this.$refs.selectProductNameTable.handleOpen(alreadySelectIdList)
    },
    // 产品新增子集
    handleAddChild(row) {
      console.log(row, '===1151')
      const { childBomAccessoriesList, customIndex, fullId, productId } = row

      this.fullId = fullId
      /**
       * 获取当前点击行数据的子集id
       */
      // 筛选出非组合产品中的id
      const alreadySelectIdList = (childBomAccessoriesList || [])
        .filter((x) => x.bomAccessoriesType !== '2')
        .map((item) => item.productId)
      // 筛选出组合产品
      const bomAccessoriesTypeList = (childBomAccessoriesList || []).filter(
        (x) => x.bomAccessoriesType === '2'
      )
      // 筛选出组合产品中的id
      bomAccessoriesTypeList.forEach((x) => {
        if (x.childBomAccessoriesList && x.childBomAccessoriesList.length > 0) {
          x.childBomAccessoriesList.forEach((k) => {
            alreadySelectIdList.push(k.productId)
          })
        }
      })
      // 成品名称id
      alreadySelectIdList.push(this.form.productId)
      // 当前行id
      if (productId) {
        alreadySelectIdList.push(productId)
      }
      const ids = this.getAssembledProductIds(fullId)
      console.log(ids, '===1172')
      alreadySelectIdList.push(...ids)
      this.$refs.selectProductNameTable.handleOpen(alreadySelectIdList, customIndex)
    },
    getAssembledProductIds(fullId) {
      const id = fullId.split('-')[0]
      const list = this.tableList.filter((x) => x.fullId === id)
      const ids = []
      const getIds = (data) => {
        const flag = data.find((x) => x.fullId === fullId)
        if (flag) {
          const productIds = data
            .filter((x) => x.fullId !== fullId && x.assembledProduct === '1')
            .map((k) => k.productId)
          ids.push(...productIds)
          return
        }
        data.forEach((x) => {
          // const { assembledProduct, isAlreadyAccessories, productId } = x
          // if (assembledProduct === '1' && isAlreadyAccessories !== '1') {
          //   ids.push(productId)
          // }
          const { productId } = x
          if (productId) {
            ids.push(productId)
          }
          if (x.childBomAccessoriesList) {
            getIds(x.childBomAccessoriesList)
          }
        })
      }
      getIds(list)
      return ids
    },
    /* 行删除 */
    handleDelRow(row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        // this.tableList.splice(index, 1)
        this.delCurrentIdRow(this.tableList, row.fullId, 0)
        console.log(this.tableList, '====1229')
      })
    },
    // 删除行
    delCurrentIdRow(data, id, index) {
      data.forEach((x, i) => {
        console.log(index, '====1237')
        if (x.fullId === id) {
          console.log(x, '====1240')

          const _handleSelectAll = (data) => {
            data.forEach((item) => {
              this.$refs.tables.toggleRowSelection(item, false)
              if (item.childBomAccessoriesList && item.childBomAccessoriesList.length > 0) {
                _handleSelectAll(item.childBomAccessoriesList || [])
              }
            })
          }
          if (x.childBomAccessoriesList && x.childBomAccessoriesList.length > 0) {
            _handleSelectAll(x.childBomAccessoriesList)
          }

          const timeStamp = +new Date()
          let childBomAccessoriesList = []
          if (x.bomAccessoriesType === '2') {
            childBomAccessoriesList = JSON.parse(JSON.stringify(x.childBomAccessoriesList))
            childBomAccessoriesList.forEach((k) => {
              k.isFatherType = undefined
              k.parentId = index === 0 ? '0' : k.parentId ? k.parentId : timeStamp
            })
          }
          return data.splice(i, 1, ...childBomAccessoriesList)
        }
        if (x.childBomAccessoriesList) {
          const index1 = index + 1
          console.log(index1, '===1254')
          this.delCurrentIdRow(x.childBomAccessoriesList, id, index1)
        }
      })
    },
    updateChildBomAccessoriesList(data, rows) {
      data.forEach((x, i) => {
        if (x.fullId === this.fullId) {
          if (x.childBomAccessoriesList && x.childBomAccessoriesList.length > 0) {
            x.childBomAccessoriesList.push(...rows)
          } else {
            this.$set(x, 'childBomAccessoriesList', rows)
          }
          return
        }
        if (x.childBomAccessoriesList) {
          this.updateChildBomAccessoriesList(x.childBomAccessoriesList, rows)
        }
      })
    },
    updateTable(list = []) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        if (this.fullId !== undefined) {
          this.updateChildBomAccessoriesList(this.tableList, rows)
        } else {
          this.tableList.push(...rows)
        }
      }
      this.tableList = this.traverseTree(this.tableList)
      console.log(this.tableList, '=====1273')
    },
    traverseTree(nodes, parentId = '', type, index = 0) {
      index++
      return nodes.map((node, i) => {
        // 使用父级ID和当前节点ID拼接生成fullId
        let fullId = parentId
          ? `${parentId}-${node.productId ? node.productId : +new Date() + i}`
          : node.productId
          ? node.productId
          : +new Date() + i
        if (!parentId && node.bomAccessoriesType === '2') {
          fullId = +new Date()
        }
        if (type === '2') {
          this.$set(node, 'isFatherType', '1')
        } else {
          this.$set(node, 'isFatherType', undefined)
        }
        // 如果当前节点有子节点，递归调用traverseTree处理子节点
        const childBomAccessoriesList = node.childBomAccessoriesList
          ? this.traverseTree(node.childBomAccessoriesList, fullId, node.bomAccessoriesType, index)
          : []
        // 返回新的节点对象，包含原有属性及新的fullId属性
        return {
          ...node,
          fullId,
          customIndex: index,
          childBomAccessoriesList: childBomAccessoriesList.length
            ? childBomAccessoriesList
            : undefined // 移除空数组的children属性
        }
      })
    },

    handleBtnCombination() {
      console.log(this.ids, '====1284')
      const id = this.ids[0].split('-')[0]
      this.rowParentId = id
      this.$refs.combinationDlg.handleOpen()
    },
    handleCombination(row, column) {
      this.$refs.combinationDlg.handleOpen(row)
    },

    // 取消按钮
    async handleSaveDraft() {
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      if (!valid1) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      this.collapseWarningForBasicInfo = false
      const fileIds = this.$refs.uploadRef.getFileIds()
      if (fileIds === false) {
        return
      }
      const param = JSON.parse(JSON.stringify(this.form))
      param.bomAccessoriesList = this.tableList
      param.commonFileList = fileIds

      this.$modal
        .confirm(this.$t('PRODUCT.bomDraftSubmit'))
        .then(() => {
          this.submitLoading = true
          return saveDraftBom(param).then((res) => {
            const { bomNo } = res.data || {}
            this.$modal.msgSuccess(this.$t('PRODUCT.bomDraftSuccess').replace('$1', bomNo))
            this.back()
            this.submitLoading = false
          })
        })
        .catch(() => {
          this.submitLoading = false
        })
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

      const fileIds = this.$refs.uploadRef.getFileIds()
      if (fileIds === false) {
        return
      }
      if (this.tableList.length <= 0) {
        this.$modal.msgError(this.$t('PRODUCT.tableEmpty'))
        this.collapseWarningForProductInfo = true
        return
      }
      let flag = false
      function containsEmptyValue(tree, callback) {
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i]
          if (flag) return
          const {
            bomAccessoriesType,
            assembledProduct,
            isAlreadyAccessories,
            childBomAccessoriesList
          } = tree[i]

          if (bomAccessoriesType !== '2') {
            callback(node)
          }
          if (assembledProduct === '1' && isAlreadyAccessories !== '1') {
            if (
              !childBomAccessoriesList ||
              childBomAccessoriesList.length <= 0 ||
              childBomAccessoriesList.filter((x) => x.assembledProduct !== '1').length <= 0
            ) {
              callback(node, 'noAccessories')
              return
            }
            let flag = childBomAccessoriesList.some((x) => x.bomAccessoriesType === '2')
            if (!flag) {
              flag = childBomAccessoriesList
                .filter((x) => x.assembledProduct !== '1')
                .some((x) => x.productType === '1')
            }
            if (!flag) {
              callback(node, 'noAccessories')
            }
            if (childBomAccessoriesList.filter((x) => x.assembledProduct === '0').length === 0) {
              callback(node, 'noAccessories')
              return
            }
          }
          if (node.childBomAccessoriesList && node.childBomAccessoriesList.length > 0) {
            containsEmptyValue(node.childBomAccessoriesList, callback)
          }
        }
      }
      containsEmptyValue(this.tableList, (node, type) => {
        if (!node.uom) {
          if (flag) return
          flag = true
          this.collapseWarningForProductInfo = true
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.uom1')))
        } else if (node.qty == null || node.qty === undefined) {
          if (flag) return
          flag = true
          this.collapseWarningForProductInfo = true
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.qty1')))
        } else if (type === 'noAccessories') {
          if (flag) return
          flag = true
          this.collapseWarningForProductInfo = true
          this.$modal.msgError(this.$t('PRODUCT.hasNoAccessories').replace('$1', node.productName))
        }
      })
      if (flag) return
      this.collapseWarningForProductInfo = false

      const param = JSON.parse(JSON.stringify(this.form))
      param.bomAccessoriesList = this.tableList
      param.commonFileList = fileIds

      this.$modal
        .confirm(this.$t('PRODUCT.bomSubmit'))
        .then(() => {
          let submitFn = saveBom
          if (this.isRevisePage === '1') {
            submitFn = reviseBom
          }
          this.submitLoading = true
          return submitFn(param).then((res) => {
            const { bomNo } = res.data || {}
            this.$modal.msgSuccess(
              this.$t('PRODUCT.bomSuccess').replace('$1', bomNo || this.form.bomNo)
            )
            this.back()
            this.submitLoading = false
          })
        })
        .catch(() => {
          this.submitLoading = false
        })
    },

    /* 审批 */
    back(type) {
      this.$emit('back', type)
    },
    handleApproved() {
      this.aplVisible = true
    },
    aplVisibleChange(data) {
      this.aplVisible = data || false
    },
    aplSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.approvedSuccess')}`.replace(
          '$1',
          `${this.$t('PRODUCT.BOM1')} [${vm.form.bomNo}]`
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
          `${this.$t('PRODUCT.BOM1')} [${vm.form.bomNo}]`
        )
      )
      this.rjVisible = false
      vm.back('onRejectedSuccess')
    },
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.bomId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
    },
    handleRevise() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: '/productManagement/reviseBOMManagement',
        query: {
          id: this.form.bomId,
          timeId: Date.now()
        }
      })
    },
    handleCopy() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: '/productManagement/addBOMManagement',
        query: {
          copyId: this.form.bomId,
          timeId: Date.now()
        }
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
