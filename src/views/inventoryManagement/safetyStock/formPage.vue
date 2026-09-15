<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" v-if="!comDisFrom" size="mini" @click="submitForm"
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
              <template v-if="!!propRowId">
                <span class="info-item mr20" :title="createForm.warehouseName">
                  {{ $t('INVENTORY.warehouseName') }} : {{ createForm.warehouseName }}
                </span>
                <span class="info-item">
                  {{ $t('ui.isActive') }} :
                  {{ createForm.isActive === '1' ? $t('uiBtn.active') : $t('uiBtn.inactive') }}
                </span>
              </template>
            </FormCollapseItemTitle>
            <el-form
              ref="createForm"
              :model="createForm"
              :rules="createRules"
              label-width="195px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="`${$t('INVENTORY.warehouseName')}`" prop="warehouseName">
                    <CommonSelectAndList
                      :id="createForm.warehouseId"
                      :label="createForm.warehouseName"
                      idKey="warehouseId"
                      labelKey="warehouseName"
                      filterable
                      :options="warehouseOptions"
                      :loading="warehouseOptionsLoading"
                      @change="updateWarehouse"
                      @handleOpen="openWarehouseTable"
                      :disabled="!!propRowId"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('INVENTORY.warehouseCode')}`" prop="warehouseCode">
                    <el-input v-model="createForm.warehouseCode" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.remarks')">
                    <MyInput
                      type="textarea"
                      v-model="createForm.remarks"
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
        <div class="form-card mt10 collapse-item-content-pt0" v-if="!!propRowId">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('INVENTORY.productInfo')"
              :warning="collapseWarningForProductInfo"
            >
            </FormCollapseItemTitle>
            <el-form
              ref="createForm2"
              :model="createForm"
              :rules="createRules"
              label-width="195px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('INVENTORY.productName')}`" prop="productName">
                    <SelectInput
                      clearable
                      :disabled="true"
                      :value="createForm.productName"
                      :title="createForm.productName"
                      @click="openProductTable"
                      @clear="productClear"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('INVENTORY.internalPartNo')}`" prop="internalPartNo">
                    <el-input
                      v-model="createForm.internalPartNo"
                      :title="createForm.internalPartNo"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('INVENTORY.uomInv')}`" prop="uomInv">
                    <el-input v-model="createForm.uom" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('INVENTORY.safetyStockMethod')}`"
                    prop="safetyStockMethod"
                  >
                    <CommonSelect
                      :id="createForm.safetyStockMethod"
                      :label="createForm.safetyStockMethodLabel"
                      idKey="dictValue"
                      labelKey="dictLabel"
                      filterable
                      :disabled="comDisFrom"
                      :options="createForm.safetyStockMethodOptions || []"
                      @change="safetyStockMethodChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('INVENTORY.leadTimeDays')}`" prop="leadTimeDays">
                    <el-input-number
                      v-model="createForm.leadTimeDays"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      type="number"
                      class="form-wd textleft"
                      :min="1"
                      :max="9999"
                      @change="leadTimeDaysChange"
                      style="width: 100%"
                      controls-position="right"
                      :disabled="createForm.leadTimeDaysCanEdit !== '1'"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('INVENTORY.replenishmentCycleDays')}`"
                    prop="replenishmentCycleDays"
                  >
                    <el-input-number
                      v-model="createForm.replenishmentCycleDays"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      type="number"
                      class="form-wd textleft"
                      :min="1"
                      :max="9999"
                      @change="replenishmentCycleDaysChange"
                      style="width: 100%"
                      controls-position="right"
                      :disabled="createForm.replenishmentCycleDaysCanEdit !== '1'"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row v-if="createForm.safetyStockMethod === '2'" key="safetyStockMethod22">
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('INVENTORY.serviceLevel')}`"
                    prop="serviceLevel"
                    :rules="[
                      {
                        required: createForm.safetyStockMethod === '2',
                        message: $t('ui.reqMsg'),
                        trigger: ['blur', 'change']
                      }
                    ]"
                  >
                    <el-select
                      :disabled="comDisFrom || createForm.safetyStockMethod !== '2'"
                      v-model="createForm.serviceLevel"
                      @change="serviceLevelChange"
                      placeholder=""
                      style="width: 98%"
                    >
                      <el-option
                        v-for="item in dict.type.i_service_level"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('INVENTORY.periodIndicator')}`"
                    prop="periodIndicator"
                    :rules="[
                      {
                        required: createForm.safetyStockMethod === '2',
                        message: $t('ui.reqMsg'),
                        trigger: ['blur', 'change']
                      }
                    ]"
                  >
                    <CommonSelect
                      :id="createForm.periodIndicator"
                      :label="createForm.periodIndicatorLabel"
                      idKey="dictValue"
                      labelKey="dictLabel"
                      filterable
                      :disabled="comDisFrom || createForm.safetyStockMethod !== '2'"
                      :options="createForm.periodIndicatorOptions || []"
                      @change="periodIndicatorChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('INVENTORY.historicalPeriodCount')}`"
                    prop="historicalPeriodCount"
                    :rules="[
                      {
                        required: createForm.safetyStockMethod === '2',
                        message: $t('ui.reqMsg'),
                        trigger: ['blur', 'change']
                      }
                    ]"
                  >
                    <el-input-number
                      :disabled="comDisFrom || createForm.safetyStockMethod !== '2'"
                      v-model="createForm.historicalPeriodCount"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      type="number"
                      class="form-wd textleft"
                      :min="createForm.periodIndicator === '1' ? 12 : 6"
                      :max="createForm.periodIndicator === '1' ? 24 : 12"
                      @change="historicalPeriodCountChange"
                      style="width: 100%"
                      controls-position="right"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('INVENTORY.safetyStock')}`" prop="safetyStock">
                    <el-input-number
                      :key="createForm.includeDecimal + 'aa'"
                      v-model="createForm.safetyStock"
                      :precision="createForm.decimalNum"
                      v-thousandSplit="{ precision: createForm.decimalNum }"
                      type="number"
                      class="form-wd textleft"
                      :min="createForm.includeDecimal === '1' ? 0 : 0"
                      :max="createForm.includeDecimal === '1' ? 999999.999 : 999999"
                      @change="inputNumberChange('safetyStock')"
                      style="width: 100%"
                      controls-position="right"
                      :disabled="comDisFrom || createForm.safetyStockMethod === '2'"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('INVENTORY.safetyTimeDays')}`" prop="safetyTimeDays">
                    <el-input-number
                      v-model="createForm.safetyTimeDays"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      type="number"
                      class="form-wd textleft"
                      :min="0"
                      :max="30"
                      style="width: 100%"
                      controls-position="right"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.isActive')}`">
                    <el-switch v-model="createForm.isActive" active-value="1" inactive-value="0" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
        <div class="form-card mt10 collapse-item-content-pt0" v-if="!!propRowId">
          <el-collapse-item name="3">
            <FormCollapseItemTitle slot="title" :title="$t('INVENTORY.mrpPlan')">
            </FormCollapseItemTitle>
            <div class="pb20">
              <mrpPlanTable
                :formData="createForm"
                :warehouseId="createForm.warehouseId"
                ref="mrpPlanTable"
                :mrpPlanList="mrpPlanList"
                @mrpPlanListChange="mrpPlanListChange"
              />
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10 collapse-item-content-pt0" v-if="!propRowId">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('INVENTORY.productInfo')"
              :warning="collapseWarningForProductInfo"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <productInfo
                :formData="createForm"
                :warehouseId="createForm.warehouseId"
                :comDisFrom="comDisFrom"
                ref="productInfo"
              />
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>

    <!-- 仓库 -->
    <warehouseNameDlg ref="warehouseNameDlg" @updateWarehouse="updateWarehouse" />
    <!-- 选产品 -->
    <selectProductTable
      ref="selectProductTable"
      :warehouseId="createForm.warehouseId"
      @onSuccess="updateTable"
    />
  </FormPageLayout>
</template>

<script>
import locale from '@/views/inventoryManagement/lang/index'
import locale1 from '@/views/organization/lang/index'
import locale2 from '@/views/purchaseManagement/lang/index'
import warehouseNameDlg from './warehouseNameDlg.vue'
import selectProductTable from '@/views/inventoryManagement/safetyStock/selectProductTable'
import productInfo from './productInfo.vue'
import mrpPlanTable from './mrpPlanTable.vue'

import { queryPCCanSelectWarehouseList } from '@/api/purchaseManagement/purchaseContract'
import {
  saveSafetyStock,
  querySafetyStockById,
  updateSafetyStock,
  calculateSingle
} from '@/api/inventoryManagement/safetyStock'
export default {
  name: 'FormPage',
  dicts: ['i_safety_stock_method', 'i_service_level', 'i_period_indicator'],
  components: { warehouseNameDlg, selectProductTable, productInfo, mrpPlanTable },
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
  data() {
    const vm = this
    return {
      submitLoading: false,
      createForm: {},
      createRules: {
        warehouseName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        productName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        safetyStockMethod: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        leadTimeDays: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        replenishmentCycleDays: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        safetyStock: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        replenishQty: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      },
      warehouseOptions: [],
      warehouseOptionsLoading: false,
      activeNames: ['1', '2', '3'],
      timeId: '',
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      alreadySelectIdList: [],
      mrpPlanList: []
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
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['inventoryManagement:safetyStock:edit'])
    },
    comDisFrom() {
      if (this.rowId) {
        return !this.editAuth
      }
      return false
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
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  activated() {},
  methods: {
    handleAdd() {
      this.reset()
      this.queryWarehouseOptions()
    },
    handleUpdate() {
      this.reset()
      querySafetyStockById({ safetyStockId: this.rowId }).then((res) => {
        const data = res.data || {}
        data.leadTimeDaysCanEdit = data.leadTimeDays ? '0' : '1'
        data.replenishmentCycleDaysCanEdit = data.replenishmentCycleDays ? '0' : '1'
        if (data.safetyStockMethod === '1') {
          data.safetyStockMethodLabel = this.$t('INVENTORY.manualEntry')
        }
        if (data.safetyStockMethod === '2') {
          data.safetyStockMethodLabel = this.$t('INVENTORY.serviceLevelMethod')
        }
        if (data.periodIndicator === '1') {
          data.periodIndicatorLabel = this.$t('INVENTORY.week')
        }
        if (data.periodIndicator === '2') {
          data.periodIndicatorLabel = this.$t('INVENTORY.month')
        }
        this.mrpPlanList = data.mrpPlanList || []
        // this.mrpPlanList = [{ isCanCreatePR: '1' }]
        this.createForm = data
      })
    },
    mrpPlanListChange(list) {
      this.mrpPlanList = list || []
    },
    inputNumberChange(code) {
      this.$refs.createForm2.validateField(code)
    },
    safetyStockMethodChange(row) {
      this.$set(this.createForm, 'safetyStockMethod', row.dictValue)
      this.$set(this.createForm, 'safetyStockMethodLabel', row.dictLabel)
      this.$set(this.createForm, 'serviceLevel', row.dictLabel)
      if (this.createForm.safetyStockMethod === '1') {
        this.$set(this.createForm, 'serviceLevel', undefined)
        this.$set(this.createForm, 'periodIndicator', undefined)
        this.$set(this.createForm, 'periodIndicatorLabel', undefined)
        this.$set(this.createForm, 'historicalPeriodCount', undefined)
      } else {
        this.$set(this.createForm, 'serviceLevel', '1.64')
        const options = this.createForm.periodIndicatorOptions || []
        if (options.find((i) => i.dictValue === '2')) {
          this.$set(this.createForm, 'periodIndicator', '2')
          this.$set(this.createForm, 'periodIndicatorLabel', this.$t('INVENTORY.month'))
          this.$set(this.createForm, 'historicalPeriodCount', 6)
        } else if (options.find((i) => i.dictValue === '1')) {
          this.$set(this.createForm, 'periodIndicator', '1')
          this.$set(this.createForm, 'periodIndicatorLabel', this.$t('INVENTORY.week'))
          this.$set(this.createForm, 'historicalPeriodCount', 12)
        }
      }
      this.getRowSafetyStock()
      this.$refs.createForm2.clearValidate([
        'serviceLevel',
        'periodIndicator',
        'historicalPeriodCount'
      ])
    },
    leadTimeDaysChange() {
      this.$nextTick(() => {
        if (this.createForm.leadTimeDays > 90) {
          this.$set(this.createForm, 'leadTimeDays', 90)
        }
        this.getRowSafetyStock()
      })
      this.$refs.createForm2.validateField('leadTimeDays')
    },
    replenishmentCycleDaysChange() {
      this.$nextTick(() => {
        if (this.createForm.replenishmentCycleDays > 90) {
          this.$set(this.createForm, 'replenishmentCycleDays', 90)
        }
        this.getRowSafetyStock()
      })
      this.$refs.createForm.validateField('replenishmentCycleDays')
    },
    serviceLevelChange() {
      this.getRowSafetyStock()
    },
    periodIndicatorChange(row) {
      this.$set(this.createForm, 'periodIndicator', row.dictValue)
      this.$set(this.createForm, 'periodIndicatorLabel', row.dictLabel)
      if (this.createForm.periodIndicator === '1') {
        this.$set(this.createForm, 'historicalPeriodCount', 12)
      }
      if (this.createForm.periodIndicator === '2') {
        this.$set(this.createForm, 'historicalPeriodCount', 6)
      }
      this.getRowSafetyStock()
    },
    historicalPeriodCountChange() {
      this.getRowSafetyStock()
    },
    getRowSafetyStock() {
      const timer = Date.now()
      this.queryTimer = timer
      calculateSingle({
        ...this.createForm
      })
        .then((res) => {
          if (this.queryTimer !== timer) return
          const data = res.data || {}
          this.$set(this.createForm, 'safetyStock', data.safetyStock)
        })
        .catch(() => {})
    },

    reset() {
      this.createForm = {
        isActive: undefined,
        ivtProductList: []
      }
      this.mrpPlanList = []
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.activeNames = ['1', '2', '3']
      this.resetForm('createForm')
      this.resetForm('createForm2')
    },
    queryWarehouseOptions() {
      this.warehouseOptionsLoading = true
      queryPCCanSelectWarehouseList({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.safetyStock
      })
        .then((response) => {
          this.warehouseOptionsLoading = false
          this.warehouseOptions = response.rows
        })
        .catch(() => {
          this.warehouseOptionsLoading = false
        })
    },
    openWarehouseTable() {
      this.$refs.warehouseNameDlg.handleOpen()
    },
    updateWarehouse(row) {
      const vm = this
      if (row.warehouseId !== vm.createForm.warehouseId) {
        this.productClear()
      }
      const { warehouseCode, warehouseId, warehouseName } = row
      vm.$set(vm.createForm, 'warehouseId', warehouseId)
      vm.$set(vm.createForm, 'warehouseCode', warehouseCode)
      vm.$set(vm.createForm, 'warehouseName', warehouseName)
    },
    warehouseClear() {
      const vm = this
      vm.$set(vm.createForm, 'warehouseId', null)
      vm.$set(vm.createForm, 'warehouseCode', null)
      vm.$set(vm.createForm, 'warehouseName', null)
      this.productClear()
    },
    openProductTable() {
      this.$refs.selectProductTable.handleAdd()
    },
    productClear() {
      this.$set(this.createForm, 'productName', undefined)
      this.$set(this.createForm, 'productId', undefined)
      this.$set(this.createForm, 'internalPartNo', undefined)
      this.$set(this.createForm, 'ivtProduct', undefined)
      this.$set(this.createForm, 'includeDecimal', undefined)
      this.$set(this.createForm, 'decimalNum', undefined)
      this.$set(this.createForm, 'ivtProductList', [])
    },
    updateTable(row) {
      const { productName, productId, internalPartNo, includeDecimal, decimalNum } = row
      this.$set(this.createForm, 'productName', productName)
      this.$set(this.createForm, 'productId', productId)
      this.$set(this.createForm, 'internalPartNo', internalPartNo)
      this.$set(this.createForm, 'includeDecimal', includeDecimal)
      this.$set(this.createForm, 'decimalNum', decimalNum)
      this.$set(this.createForm, 'ivtProduct', row)
    },
    save(param) {
      const vm = this
      vm.submitLoading = true
      saveSafetyStock(param)
        .then((res) => {
          vm.$message.success(`${vm.$t('INVENTORY.safetyStockSuccess')}`)
          this.cancel()
          vm.submitLoading = false
        })
        .catch(() => {
          vm.submitLoading = false
        })
    },
    update(param) {
      const vm = this
      vm.submitLoading = true
      updateSafetyStock(param)
        .then((res) => {
          vm.$message.success(`${vm.$t('INVENTORY.safetyStockSuccess')}`)
          this.cancel()
          vm.submitLoading = false
        })
        .catch(() => {
          vm.submitLoading = false
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
      this.$router.push({ path: '/inventoryManagement/safetyStock' })
    },
    async submitForm() {
      const vm = this
      const valid1 = await this.$refs.createForm.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1

      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }

      if (!this.rowId) {
        if ((this.createForm.ivtProductList || []).length <= 0) {
          this.$modal.msgError(this.$t('INVENTORY.productTableEmpty'))
          this.collapseWarningForProductInfo = true
          return
        }
        if ((this.createForm.ivtProductList || []).find((item) => !item.safetyStockMethod)) {
          this.$refs.productInfo.errorMessage('safetyStockMethod')
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('INVENTORY.safetyStockMethod'))
          )
          this.collapseWarningForProductInfo = true
          return
        }
        if (
          (this.createForm.ivtProductList || []).find(
            (item) => !this.$resultOfBoolean(item.leadTimeDays)
          )
        ) {
          this.$refs.productInfo.errorMessage('leadTimeDays')
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('INVENTORY.leadTimeDays'))
          )
          this.collapseWarningForProductInfo = true
          return
        }
        if (
          (this.createForm.ivtProductList || []).find(
            (item) => !this.$resultOfBoolean(item.replenishmentCycleDays)
          )
        ) {
          this.$refs.productInfo.errorMessage('replenishmentCycleDays')
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('INVENTORY.replenishmentCycleDays'))
          )
          this.collapseWarningForProductInfo = true
          return
        }
        if (
          (this.createForm.ivtProductList || []).find(
            (item) => !item.serviceLevel && item.safetyStockMethod === '2'
          )
        ) {
          this.$refs.productInfo.errorMessage('serviceLevel')
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('INVENTORY.serviceLevel'))
          )
          this.collapseWarningForProductInfo = true
          return
        }
        if (
          (this.createForm.ivtProductList || []).find(
            (item) => !item.periodIndicator && item.safetyStockMethod === '2'
          )
        ) {
          this.$refs.productInfo.errorMessage('periodIndicator')
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('INVENTORY.periodIndicator'))
          )
          this.collapseWarningForProductInfo = true
          return
        }
        if (
          (this.createForm.ivtProductList || []).find(
            (item) => !item.historicalPeriodCount && item.safetyStockMethod === '2'
          )
        ) {
          this.$refs.productInfo.errorMessage('historicalPeriodCount')
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('INVENTORY.historicalPeriodCount'))
          )
          this.collapseWarningForProductInfo = true
          return
        }
        if (
          (this.createForm.ivtProductList || []).find(
            (item) => !this.$resultOfBoolean(item.safetyStock)
          )
        ) {
          this.$refs.productInfo.errorMessage('safetyStock')
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('INVENTORY.safetyStock'))
          )
          this.collapseWarningForProductInfo = true
          return
        }
      } else {
        const valid2 = await this.$refs.createForm2.validate().catch((err) => {
          return err
        })
        this.collapseWarningForProductInfo = !valid2
        if (!valid2) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('INVENTORY.productInfo'))
          )
          return
        }
      }
      this.collapseWarningForProductInfo = false

      this.$modal.confirm(vm.$t('INVENTORY.safetyStockSubmit')).then(() => {
        const param = JSON.parse(JSON.stringify(vm.createForm))
        if (this.rowId) {
          vm.update(param)
        } else {
          ;(param.ivtProductList || []).forEach((item) => {
            if (item.safetyStockMethod === '1') {
              item.serviceLevel = undefined
              item.periodIndicator = undefined
              item.historicalPeriodCount = undefined
            }
          })
          vm.save(param)
        }
      })
    }
  }
}
</script>
