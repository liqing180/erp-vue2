<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
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
                    <el-form-item :label="`${$t('INVENTORY.warehouseName')}`" prop="warehouseName">
                      <CommonSelectAndList
                        :id="form.warehouseId"
                        :label="form.warehouseName"
                        idKey="warehouseId"
                        labelKey="warehouseName"
                        filterable
                        :options="warehouseOptions"
                        :loading="warehouseOptionsLoading"
                        @change="updateWarehouse"
                        @handleOpen="openWarehouseFormTable"
                      />
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.salesOrderNo')}`"
                      :rules="[
                        {
                          required: form.warehouseType === '3',
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                      prop="salesOrderNo"
                    >
                      <SelectInput
                        :value="form.salesOrderNo"
                        :title="form.salesOrderNo"
                        @click="openSalesOrderTable"
                        @clear="salesOrderNoClear"
                        :disabled="disSalesOrderNo"
                        :clearable="true"
                      />
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.inventoryAuditNo')}`">
                      <el-input v-model="form.inventoryAuditNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.inventory_audit_status,
                            form.inventoryAuditStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('INVENTORY.method')" prop="inventoryAuditMethod">
                      <el-select
                        style="width: 100%"
                        v-model="form.inventoryAuditMethod"
                        placeholder=""
                        clearable
                        @change="inventoryAuditMethodChange"
                        :disabled="form.warehouseType === '3'"
                      >
                        <el-option
                          v-for="item in dict.type.inventory_audit_method"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="form.inventoryAuditMethod === '1'" :span="8">
                    <el-form-item
                      :label="$t('INVENTORY.criteriaRange')"
                      prop="criteriaRange"
                      key="criteriaRange"
                    >
                      <el-input-number
                        style="width: 100%"
                        v-model="form.criteriaRange"
                        controls-position="right"
                        :precision="0"
                        :min="1"
                        :max="100"
                        @change="inputNumberChange('criteriaRange')"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col v-else :span="8">
                    <el-form-item :label="`${$t('INVENTORY.scope')}`">
                      <el-cascader
                        :show-all-levels="false"
                        placeholder=""
                        size="small"
                        v-model="form.warehouseStructureIds"
                        :disabled="
                          !form.warehouseId ||
                          form.warehouseType === '3' ||
                          !form.inventoryAuditMethod ||
                          form.inventoryAuditMethod === '2'
                        "
                        :options="warehouseStructureOptions"
                        :loading="warehouseStructureOptionsLoading"
                        :props="{
                          multiple: true,
                          checkStrictly: false,
                          value: 'warehouseStructureId',
                          label: 'warehouseStructureName',
                          children: 'child'
                        }"
                        clearable
                        :collapse-tags="true"
                        class="cascader"
                        popper-class="hide-cascader-scrollbar"
                        :style="{ width: '100%' }"
                        @change="warehouseStructureChange"
                        @visible-change="warehouseStructureVisible"
                        ref="cascader1"
                      ></el-cascader>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="form.inventoryAuditMethod !== '1'">
                    <el-form-item :label="`${$t('INVENTORY.productCategory')}`">
                      <el-cascader
                        :show-all-levels="false"
                        placeholder=""
                        size="small"
                        v-model="form.productCategoryIds"
                        :disabled="
                          !form.warehouseId ||
                          form.warehouseType === '3' ||
                          !form.inventoryAuditMethod ||
                          form.inventoryAuditMethod === '2'
                        "
                        :options="productCategoryOptions"
                        :loading="productCategoryOptionsLoading"
                        :props="{
                          multiple: true,
                          checkStrictly: true,
                          value: 'productCategoryId',
                          label: 'categoryName',
                          children: 'child'
                        }"
                        clearable
                        :collapse-tags="true"
                        class="cascader"
                        popper-class="hide-cascader-scrollbar"
                        :style="{ width: '100%' }"
                        ref="cascader2"
                        @change="productCategoryChange"
                        @visible-change="productCategoryVisible"
                      ></el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.startEndTime')}`" prop="startEndTime">
                      <el-date-picker
                        v-model="form.startEndTime"
                        :picker-options="validityDaysPickerOptions"
                        type="daterange"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        unlink-panels
                        range-separator="-"
                        :start-placeholder="`${$t('ui.startDate')}`"
                        :end-placeholder="`${$t('ui.endDate')}`"
                        :default-time="['00:00:00', '23:59:59']"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')">
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
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.user')"
                :warning="collapseWarningForUser"
              >
              </FormCollapseItemTitle>
              <div>
                <UserTable ref="UserTable" :formData="form" />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('INVENTORY.auditDetails')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <AuditProductTable :formData="form" :comDisFrom="false" />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>

    <selectSalesOrderTable
      ref="selectSalesOrderTable"
      :warehouseId="form.warehouseId"
      @update="updateSalesOrderNo"
    />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
  </FormPageLayout>
</template>

<script>
import { queryCanSelectWarehouseListHaveDataPermissions } from '@/api/inventoryManagement/warehouse'
import {
  saveInventoryAudit,
  queryActiveWarehouseStructureTreeList,
  queryAuditCategoryTreeList,
  queryAuditCanSelectProductListForERP
} from '@/api/inventoryManagement/inventoryAudit'
import pageMixin from '@/mixins/tableMinx'

import selectSalesOrderTable from './components/selectSalesOrderTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import AuditProductTable from './productInfo/AuditProductTable.vue'
import UserTable from './productInfo/UserTable.vue'
import locale from '@/views/inventoryManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'
export default {
  mixins: [pageMixin],
  dicts: ['inventory_audit_status', 'inventory_audit_method'],
  components: {
    selectSalesOrderTable,
    selectWarehouseTable,
    UserTable,
    AuditProductTable
  },
  data() {
    return {
      activeNames: [],
      timeId: '',
      submitLoading: false,
      form: {
        detailList: [],
        userList: []
      },

      warehouseOptions: [],
      warehouseOptionsLoading: false,

      collapseWarningForBasicInfo: false,
      collapseWarningForUser: false,
      collapseWarningForProductInfo: false,
      rules: {
        warehouseName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        inventoryAuditMethod: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        criteriaRange: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        startEndTime: [
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
      warehouseStructureOptions: [],
      warehouseStructureOptionsLoading: false,
      productCategoryOptions: [],
      productCategoryOptionsLoading: false
    }
  },
  props: {
    propTimeId: {
      type: String,
      default: ''
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.handleAdd()
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
    disSalesOrderNo() {
      let dis = false
      if (this.form.warehouseType && this.form.warehouseType !== '3') {
        dis = true
      }
      return dis
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {},
  methods: {
    async handleAdd() {
      this.reset()
      this.queryWarehouseOptions()
      // this.queryActiveWarehouseStructureTreeList()
      // this.queryAuditCanSelectProductListForERP()
    },
    reset() {
      this.form = {
        /* 基础信息 */
        startEndTime: [],
        warehouseStructureIds: [],
        productCategoryIds: [],
        detailList: [],
        userList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForUser = false
      this.collapseWarningForProductInfo = false
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('form1')
    },
    queryActiveWarehouseStructureTreeList() {
      this.warehouseStructureOptionsLoading = true
      queryActiveWarehouseStructureTreeList({ warehouseId: this.form.warehouseId })
        .then((res) => {
          this.warehouseStructureOptionsLoading = false
          const arr = res.data || []
          this.handle(arr)
          this.warehouseStructureOptions = arr
        })
        .catch(() => {
          this.warehouseStructureOptionsLoading = false
        })
    },
    queryAuditCategoryTreeList() {
      const idsList = this.form.warehouseStructureIds || []
      const ids = idsList.map((item) => {
        return item[item.length - 1]
      })
      this.productCategoryOptionsLoading = true
      queryAuditCategoryTreeList({
        warehouseId: this.form.warehouseId,
        warehouseStructureIdList: ids
      })
        .then((res) => {
          this.productCategoryOptionsLoading = false
          const arr = res.data || []
          this.handle(arr)
          this.productCategoryOptions = arr
        })
        .catch(() => {
          this.productCategoryOptionsLoading = false
        })
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          if (x.child && x.child.length > 0) {
            this.handle(x.child)
          } else {
            x.child = undefined
          }
        })
      }
    },
    // 取消按钮
    back() {
      this.$emit('back')
    },
    /* 表单部分Start */
    /* 第一部分表单 */

    /* 第二部分表单 */
    openSalesOrderTable() {
      this.$refs.selectSalesOrderTable.handleOpen()
    },
    updateSalesOrderNo(row) {
      this.$set(this.form, 'salesOrderId', row.salesOrderId)
      this.$set(this.form, 'salesOrderNo', row.salesOrderNo)
      const warehouse = row.warehouse || {}
      row.warehouseType = warehouse.warehouseType
      this.updateWarehouse(row)
    },
    salesOrderNoClear() {
      this.$set(this.form, 'salesOrderId', undefined)
      this.$set(this.form, 'salesOrderNo', undefined)
      this.warehouseFromClear()
    },

    inventoryAuditMethodChange() {
      this.$set(this.form, 'productCategoryIds', [])
      this.$set(this.form, 'warehouseStructureIds', [])
      this.queryAuditCanSelectProductListForERP()
    },
    inputNumberChange(code) {
      this.$refs.form1.validateField(code)
      this.queryAuditCanSelectProductListForERP()
    },

    warehouseStructureVisible(value) {
      if (value === false) {
        // this.queryAuditCategoryTreeList()
      }
    },
    warehouseStructureChange() {
      this.$set(this.form, 'productCategoryIds', [])
      this.$nextTick(() => {
        this.productCategoryOptions = []
        this.queryAuditCanSelectProductListForERP()
      })
    },
    productCategoryVisible(value) {
      if (value) {
        this.queryAuditCategoryTreeList()
      }
    },
    productCategoryChange() {
      this.queryAuditCanSelectProductListForERP()
    },
    queryAuditCanSelectProductListForERP() {
      if (this.form.inventoryAuditMethod === '1') {
        this.$set(this.form, 'detailList', [])
        return
      }
      const idsList = this.form.warehouseStructureIds || []
      const ids = idsList.map((item) => {
        return item[item.length - 1]
      })

      const idsList2 = this.form.productCategoryIds || []
      const ids2 = idsList2.map((item) => {
        return item[item.length - 1]
      })
      if (!this.form.warehouseId) return
      const timer = Date.now()
      this.queryTime = timer
      queryAuditCanSelectProductListForERP({
        warehouseId: this.form.warehouseId,
        salesOrderId: this.form.salesOrderId,
        inventoryAuditMethod: this.form.inventoryAuditMethod,
        criteriaRange: this.form.criteriaRange,
        warehouseStructureIdList: ids,
        productCategoryIdList: ids2
      }).then((res) => {
        if (this.queryTime !== timer) return
        const data = res.data || []
        this.$set(this.form, 'detailList', data)
      })
    },

    queryWarehouseOptions() {
      this.warehouseOptionsLoading = true
      queryCanSelectWarehouseListHaveDataPermissions({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.inventoryAudit
      })
        .then((response) => {
          this.warehouseOptionsLoading = false
          this.warehouseOptions = response.rows
        })
        .catch(() => {
          this.warehouseOptionsLoading = false
        })
    },
    openWarehouseFormTable() {
      const params = {
        queryType: 'from',
        alreadySelectWarehouseId: this.form.toWarehouseId
      }
      this.$refs.selectWarehouseTable.handleOpen(params)
    },
    updateWarehouse(row) {
      if (!row.warehouseId) {
        this.warehouseFromClear()
        return
      }
      this.$set(this.form, 'warehouseName', row.warehouseName)
      this.$set(this.form, 'warehouseId', row.warehouseId)
      this.$set(this.form, 'warehouseType', row.warehouseType)
      this.$set(this.form, 'productCategoryIds', [])
      this.$set(this.form, 'warehouseStructureIds', [])
      this.$set(this.form, 'detailList', [])
      if (row.warehouseType === '3') {
        this.$set(this.form, 'inventoryAuditMethod', '2')
      }
      this.queryActiveWarehouseStructureTreeList()
      this.queryAuditCanSelectProductListForERP()
    },
    warehouseFromClear() {
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseId', undefined)
      this.$set(this.form, 'warehouseType', undefined)
      this.$set(this.form, 'productCategoryIds', [])
      this.$set(this.form, 'warehouseStructureIds', [])
      this.$set(this.form, 'detailList', [])
    },
    /* 表单部分End */

    async submitForm() {
      // getCheckedNodes(leafOnly) 是否只是叶子节点，默认值为 false

      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      if (valid1) {
        let param = { ...this.form }
        param.startTime = param.startEndTime[0]
        param.endTime = param.startEndTime[1]
        if (param.inventoryAuditMethod !== '1') {
          const select1 = this.$refs.cascader1.getCheckedNodes(false)
          const ids1 = select1.map((item) => {
            return item.value
          })
          const names1 = select1.map((item) => {
            return item.label
          })
          const select2 = this.$refs.cascader2.getCheckedNodes(false)
          const ids2 = select2.map((item) => {
            return item.value
          })
          console.log(select2)

          const names2 = select2.map((item) => {
            return item.label
          })
          param.warehouseStructureIdList = ids1
          param.warehouseStructureNames = names1.join(',')
          param.productCategoryIdList = ids2
          param.productCategoryNames = names2.join(',')
        }

        param.inventoryAuditType = '1'
        param.createdType = '1'
        delete param.startEndTime
        delete param.warehouseStructureIds
        delete param.productCategoryIds
        // collapseWarningForUser
        const validUser = this.validUserList(param.userList)
        if (!validUser) {
          this.collapseWarningForUser = true
          return
        }
        this.collapseWarningForUser = false
        const isReqOne = param.inventoryAuditMethod !== '1'
        const validProduct = this.validProductList(param.detailList, isReqOne)
        if (!validProduct) {
          this.collapseWarningForProductInfo = true
          return
        }
        this.collapseWarningForProductInfo = false
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        const confirmMsg = this.$t('INVENTORY.inventoryAuditSubmit')
        const successMsg = this.$t('INVENTORY.inventoryAuditSuccess')
        const submitFn = saveInventoryAudit

        this.$modal
          .confirm(confirmMsg)
          .then(() => {
            this.submitLoading = true
            return submitFn(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
            this.submitLoading = false
            this.back()
          })
          .catch(() => {
            this.submitLoading = false
          })
      }
    },
    validUserList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.user')))
        return valid
      }
      return true
    },
    validProductList(detailList, isReqOne = true) {
      const valid = false
      if (detailList.length <= 0 && isReqOne) {
        this.$modal.msgError(this.$t('INVENTORY.auditDetailsEmpty'))
        return valid
      }
      return true
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
