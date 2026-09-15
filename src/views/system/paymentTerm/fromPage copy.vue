<template>
  <!-- formClass="form-page-btn--hide" -->
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
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
              ref="form"
              :model="form"
              @submit.native.prevent
              :rules="rules"
              label-width="180px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.type')}`" prop="paymentTermType">
                    <el-select
                      v-model="form.paymentTermType"
                      :disabled="comDisFrom || !!rowId"
                      placeholder=""
                      style="width: 100%"
                      @change="handlePaymentTermType"
                    >
                      <el-option
                        v-for="dict in dict.type.payment_term_type"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.paymentTermNo')}`" prop="paymentTermNo">
                    <el-input v-model="form.paymentTermNo" disabled maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.category')}`" prop="categoryTypeIds">
                    <el-input v-model="form.categoryTypeIds" disabled maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.paymentTermName')}`" prop="paymentTermName">
                    <el-input
                      v-model="form.paymentTermName"
                      :title="form.paymentTermName"
                      maxlength="1000"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.paymentMethod')}`" prop="paymentMethodIds">
                    <CommonMultipleSelect
                      :disabled="comDisFrom || !!rowId"
                      :ids="form.paymentMethodIds"
                      :labels="form.paymentMethodNameList"
                      idKey="value"
                      labelKey="label"
                      :options="dict.type.business_partner_payment_method"
                      @change="paymentMethodChange"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.isDefault')}`">
                    <el-switch
                      v-model="form.isDefault"
                      active-value="1"
                      inactive-value="0"
                      @change="handleIsDefault"
                    ></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.isActive')}`">
                    <el-switch
                      :disabled="form.isDefault === '1' ? true : false"
                      v-model="form.isActive"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.description')" prop="description">
                    <MyInput
                      type="textarea"
                      v-model="form.description"
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
        <div class="form-card mt10">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('ui.content')"
              :warning="collapseWarningForContent"
            >
            </FormCollapseItemTitle>

            <el-form
              :model="termForm"
              :rules="termFormRules"
              label-width="180px"
              :disabled="comDisFrom"
              ref="termForm"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.dueDays')}`" prop="days">
                    <el-input-number
                      style="width: 100%"
                      v-model="termForm.days"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="0"
                      :max="99999"
                      @change="inputNumberChange('days')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.paymentPercentage')}`" prop="percentage">
                    <el-input-number
                      style="width: 100%"
                      v-model="termForm.percentage"
                      placeholder="1 - 100"
                      controls-position="right"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      :min="1"
                      :max="maxPercent"
                      @change="inputNumberChange('percentage')"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.description')">
                    <MyInput
                      type="textarea"
                      v-model="termForm.description"
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
                  <el-form-item :label="`${$t('ui.downPayment')}`">
                    <el-switch
                      v-model="termForm.downPayment"
                      :disabled="disDownPayment"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.goodsIssue')}`">
                    <el-switch
                      v-model="termForm.goodsIssue"
                      :disabled="disGoodsIssue"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div style="text-align: center; margin-bottom: 10px">
              <template v-if="isTermEdit">
                <el-button type="primary" v-if="!comDisFrom" size="small" @click="handleEditTerm">{{
                  $t('uiBtn.save')
                }}</el-button>
                <el-button size="small" @click="handleResetTerm">{{ $t('uiBtn.back') }}</el-button>
              </template>
              <template v-else-if="!comDisFrom && !rowId">
                <el-button
                  type="primary"
                  size="small"
                  :disabled="maxPercent === 0"
                  @click="handleAddTerm"
                  >{{ $t('uiBtn.add') }}</el-button
                >
                <el-button size="small" @click="handleResetTerm">{{ $t('uiBtn.reset') }}</el-button>
              </template>
            </div>

            <div>
              <div class="pb20">
                <el-row :gutter="10" class="mb8">
                  <!-- <el-col :span="1.5">
                    <el-button
                      v-if="!comDisFrom"
                      :disabled="selected.length <= 0"
                      @click="handleDelete"
                      type="danger"
                      plain
                      icon="el-icon-delete"
                      size="mini"
                      >{{ $t('uiBtn.delete') }}</el-button
                    >
                  </el-col> -->
                  <right-toolbar
                    :showSearchBtn="false"
                    :showRefreshBtn="false"
                    :saveKey="saveKey"
                    :columns="configColumn"
                    :columnsInit="columns"
                  ></right-toolbar>
                </el-row>
                <el-table
                  border
                  ref="tables"
                  :row-key="rowIdKey"
                  :row-class-name="tableRowClassName"
                  :data="tableList"
                  @select="handleSelectionChange"
                  @select-all="handleSelectAll"
                  @row-click="handleTermRowClick"
                >
                  <!-- <el-table-column
                    v-if="!comDisFrom"
                    type="selection"
                    key="selection"
                    align="center"
                    width="55"
                  ></el-table-column> -->
                  <el-table-column
                    type="index"
                    key="index"
                    :label="$t('ui.stage')"
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
                      <el-tag
                        v-if="item.prop === 'downPayment' || item.prop === 'goodsIssue'"
                        :type="scope.row[item.prop] === '1' ? '' : 'info'"
                        >{{
                          scope.row[item.prop] === '1' ? $t('uiBtn.yes') : $t('uiBtn.no')
                        }}</el-tag
                      >
                      <template v-else>{{ scope.row[item.prop] }}</template>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="!comDisFrom"
                    :label="$t('ui.action')"
                    key="action"
                    align="center"
                    min-width="120"
                    class-name="small-padding fixed-width"
                    fixed="right"
                  >
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" icon="el-icon-edit"
                        >{{ $t('uiBtn.edit') }}
                      </el-button>
                      <el-button
                        icon="el-icon-delete"
                        type="text"
                        size="mini"
                        @click.stop="handleDelRow(scope.$index, scope.row)"
                        style="color: #f56c6c"
                        v-if="!rowId"
                        >{{ $t('uiBtn.delete') }}</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
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
    </template>
  </FormPageLayout>
</template>

<script>
import {
  savePaymentTerm,
  queryPaymentTermById,
  updatePaymentTerm,
  queryDefaultPaymentTermByLegalEntityId
} from '@/api/system/paymentTerm'
import pageMixin from '@/mixins/tableMinx'
import Sortable from 'sortablejs'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  dicts: ['payment_term_type', 'business_partner_payment_method'],
  mixins: [pageMixin],
  components: { SystemOperationLogTable },
  data() {
    const vm = this
    return {
      saveKey: '1',
      activeNames: [],
      rowId: '',
      // 是否自动生成 EmployeeNo
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForContent: false,
      rules: {
        paymentTermType: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        paymentMethodIds: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        paymentTermName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        description: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: 'blur'
          }
        ]
      },

      /* 表格表单部分 */
      maxPercent: 100,
      termForm: {},
      termFormRules: {
        days: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        percentage: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      },
      isTermEdit: false,
      editIndex: undefined,
      /* 表格部分 */
      columns: [
        {
          prop: 'days',
          label: vm.$t('ui.dueDays'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'percentage',
          label: vm.$t('ui.paymentPercentage'),
          visible: true,
          minWidth: 160,
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
          prop: 'downPayment',
          label: vm.$t('ui.downPayment'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'goodsIssue',
          label: vm.$t('ui.goodsIssue'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'rowTimeId'
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    if (this.rowId) {
      this.handleUpdate()
    } else {
      this.handleAdd()
    }
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.rowId = this.$route.query.id
      if (this.rowId) {
        this.handleUpdate()
      } else {
        this.handleAdd()
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['system:paymentTerm:edit'])
    },
    comDisFrom() {
      if (this.rowId) {
        return !this.editAuth
      }
      return false
    },
    isCategoryDisabled() {
      if (this.form.paymentTermType === '0' || this.form.paymentTermType === '1') {
        return false
      } else {
        return true
      }
    },
    getList() {
      return this.tableList
    },
    isDefaultValue() {
      return this.form.isDefault === '1'
    },
    disGoodsIssue() {
      if (this.form.paymentTermType === '2') {
        return true
      }
      const arr = this.tableList.filter((item, index) => {
        if (this.editIndex === index) {
          return false
        } else {
          return item.goodsIssue === 1
        }
      })
      if (arr.length > 0) {
        return true
      }
      return false
    },

    disDownPayment() {
      if (this.form.paymentTermType === '2') {
        return true
      }
      if (this.editIndex === 0) {
        return false
      }
      if (this.tableList.length > 0) {
        return true
      }
      return false
    }
  },
  methods: {
    handleAdd() {
      this.reset()
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      queryPaymentTermById(rowId).then((response) => {
        const data = response.data || {}
        data.paymentMethodIds = data.paymentMethodIds ? data.paymentMethodIds.split(',') : []
        this.form = data

        const list = this.form.paymentTermDetailList || []
        list.forEach((item) => {
          item.rowTimeId = item.id
        })
        this.tableList = list
        this.initDraggable()
      })
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/system/paymentTerm' })
    },
    /* 表单部分 */
    // 表单重置
    reset() {
      this.form = {
        paymentTermType: undefined,
        paymentTermNo: undefined,
        paymentTermName: undefined,
        paymentMethodIds: [],
        paymentMethodNames: undefined,
        categoryTypeIds: undefined,
        categoryTypeNames: undefined,
        description: '',
        isDefault: '0',
        isActive: '1',
        createdBy: this.$store.state.user.nickName
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForContent = false
      this.activeNames = ['1', '2', '3']
      this.resetForm('form')

      this.isTermEdit = false
      this.editIndex = undefined
      this.tableList = []
      this.selected = []
      this.destroyDraggable()
      /* 表格部分 */
      this.handleResetTerm()
    },
    handlePaymentTermType(key) {
      const vm = this
      /* if (key === 0) {
        vm.queryPurchaseCategoryTreeList()
      } else {
        vm.queryPurchaseCategoryTreeList()
      } */
      vm.tableList = []
      vm.handleResetTerm()
    },
    paymentMethodChange(ids, labels) {
      this.$set(this.form, 'paymentMethodIds', ids)
      this.$set(this.form, 'paymentMethodNameList', labels)
    },
    handleIsDefault(value) {
      if (value === '1') {
        this.$set(this.form, 'isActive', '1')
      }
    },

    /* 表格表单部分 */
    inputNumberChange(code) {
      this.$refs.termForm.validateField(code)
    },
    handleResetTerm() {
      this.isTermEdit = false
      this.editIndex = undefined
      this.termForm = {
        days: undefined,
        percentage: undefined,
        description: '',
        downPayment: '0',
        goodsIssue: '0'
      }
      this.$nextTick(() => {
        this.$refs.termForm && this.$refs.termForm.clearValidate()
      })

      this.setMaxPercent()
    },
    handleAddTerm() {
      const vm = this
      vm.isTermEdit = false
      vm.$refs.termForm.validate((valid) => {
        if (valid) {
          vm.tableList.push({
            ...vm.termForm,
            rowTimeId: Date.now()
          })
          vm.setMaxPercent()
          vm.handleResetTerm()
          vm.initDraggable()
        }
      })
    },
    handleTermRowClick(dataRow) {
      const vm = this

      vm.$refs.termForm && this.$refs.termForm.clearValidate()
      const { percentage } = dataRow

      const totalPercent = this.tableList.reduce((total, curVal) => {
        return total + curVal.percentage
      }, 0)

      const remainPercent = 100 - totalPercent
      vm.maxPercent = remainPercent + percentage
      vm.isTermEdit = true
      vm.editIndex = vm.tableList.findIndex((item) => item.rowTimeId === dataRow.rowTimeId)
      vm.termForm = {
        ...dataRow
      }
    },
    handleEditTerm() {
      const vm = this
      vm.$refs.termForm.validate((valid) => {
        if (valid) {
          vm.$set(vm.tableList, vm.editIndex, { ...vm.termForm })
          vm.editIndex = undefined
          vm.termForm = {}
          vm.handleResetTerm()
          vm.isTermEdit = false
          vm.setMaxPercent()
        }
      })
    },
    setMaxPercent() {
      this.maxPercent =
        this.tableList.length > 0
          ? 100 - this.tableList.map((item) => item.percentage).reduce((a, b) => a + b)
          : 100
    },

    /* 表格部分 */
    /* 选中多个删除 */
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
          this.selected = []
        })
        .catch(() => {})
    },
    /* 行删除 */
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.setMaxPercent()
        setTimeout(() => {
          this.handleResetTerm()
        }, 20)
        const findIndex = this.selected.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        if (findIndex !== -1) {
          this.selected.splice(findIndex, 1)
        }
      })
    },
    /* 表格全选 */
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
    /* 行单个选择 */
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
      let color = 'pointer'
      const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'pointer table-SelectedRow-bgcolor'
      }
      return color
    },
    initDraggable() {
      this.destroyDraggable()
      if (this.comDisFrom) {
        return
      }
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
    submitForm() {
      const vm = this
      this.$refs.form.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (!valid) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
        if (valid) {
          this.collapseWarningForContent = true
          if (vm.tableList.length <= 0) {
            this.$modal.msgError(vm.$t('ui.conditionValid'))
            return
          }
          const totalPercent = this.tableList.reduce((total, curVal) => {
            return total + curVal.percentage
          }, 0)
          if (totalPercent < 100) {
            this.$modal.msgError(vm.$t('ui.no100Msg'))
            return
          }
          if (vm.form.paymentTermType !== '2') {
            const arr = this.tableList.filter((item) => {
              return item.goodsIssue === '1'
            })
            if (arr.length <= 0) {
              this.$modal.msgError(vm.$t('ui.goodsIssueValid'))
              return
            }
          }
          this.collapseWarningForContent = false

          this.queryDefaultPaymentTermByLegalEntityId()
          // this.endSubmitForm()
        }
      })
    },
    queryDefaultPaymentTermByLegalEntityId() {
      const vm = this
      const param = {
        paymentTermType: this.form.paymentTermType
      }
      queryDefaultPaymentTermByLegalEntityId(param).then((res) => {
        const results = res.data || {}
        console.log(vm.form, results)

        if (res.code === 200) {
          const typeNames = [vm.$t('ui.sales'), vm.$t('ui.purchase'), vm.$t('ui.serviceOrder')]

          if (vm.isDefaultValue) {
            if (results.paymentTermName && vm.form.id !== results.id) {
              const validateDefault = ` ${vm
                .$t('ui.isDefaultPaymentTerm')
                .replace('$1', `${typeNames[vm.form.paymentTermType]}`)
                .replace('$2', `[${results.paymentTermName}]`)
                .replace('$3', `[${results.legalEntityName}]`)}`
              this.$modal.msgError(validateDefault)
            } else {
              vm.endSubmitForm()
            }
          } else {
            if (vm.form.id === results.id) {
              const confirmInfo = `${vm
                .$t('ui.noDefaultPaymentTerm')
                .replace('$1', `[${results.legalEntityName}]`)
                .replace('$2', typeNames[vm.form.paymentTermType])
                .replace('$3', typeNames[vm.form.paymentTermType])}`

              this.$modal.confirm(confirmInfo).then(() => {
                vm.endSubmitForm()
              })
            } else if (!results.paymentTermName) {
              const confirmInfo = `${vm
                .$t('ui.noDefaultPaymentTerm')
                .replace('$1', `[${results.legalEntityName}]`)
                .replace('$2', typeNames[`${vm.form.paymentTermType}`])
                .replace('$3', typeNames[`${vm.form.paymentTermType}`])}`
              this.$modal.confirm(confirmInfo).then(() => {
                vm.endSubmitForm()
              })
            } else {
              vm.endSubmitForm()
            }
          }
        }
      })
    },
    endSubmitForm() {
      const vm = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          let param = { ...this.form }
          param.paymentTermDetailList = vm.tableList
          param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
          param.paymentMethodIds = param.paymentMethodIds.toString()
          if (vm.tableList.length <= 0) {
            this.$modal.msgError(vm.$t('ui.conditionValid'))
            return
          }
          const totalPercent = this.tableList.reduce((total, curVal) => {
            return total + curVal.percentage
          }, 0)
          if (totalPercent < 100) {
            this.$modal.msgError(vm.$t('ui.no100Msg'))
            return
          }
          if (vm.form.paymentTermType !== '2') {
            const arr = this.tableList.filter((item) => {
              return item.goodsIssue === '1'
            })
            if (arr.length <= 0) {
              this.$modal.msgError(vm.$t('ui.goodsIssueValid'))
              return
            }
          }
          this.$modal
            .confirm(this.$t('ui.submitPTConfirm'))
            .then(() => {
              if (param.id) {
                return updatePaymentTerm(param)
              }
              return savePaymentTerm(param)
            })
            .then((response) => {
              this.$modal.msgSuccess(
                this.$t('ui.submitPTSuccess').replace('$1', param.paymentTermName)
              )
              this.cancel()
            })
            .catch(() => {})
        }
      })
    }
  }
}
</script>
<style lang="scss"></style>
