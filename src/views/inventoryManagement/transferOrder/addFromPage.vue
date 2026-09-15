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
                :title="$t('INVENTORY.deliveryInfo')"
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
                    <el-form-item :label="`${$t('SALES.salesOrderNo')}`" prop="salesOrderNo">
                      <div class="input-switch-box">
                        <div class="con-left">
                          <CommonSelectAndList
                            :id="form.salesOrderId"
                            :label="form.salesOrderNo"
                            idKey="salesOrderId"
                            labelKey="salesOrderNo"
                            filterable
                            :options="salesOrderOptions"
                            :loading="salesOrderOptionsLoading"
                            @change="updateSalesOrderNo"
                            @handleOpen="openSalesOrderTable"
                          />
                        </div>
                        <div v-if="form.salesOrderTransferOrderType">
                          <div
                            v-if="form.salesOrderTransferOrderType === '1'"
                            class="salesOrderTip"
                          >
                            {{ $t('INVENTORY.consignment') }}
                          </div>
                          <div v-else class="salesOrderTip">{{ $t('INVENTORY.pickup') }}</div>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.transferOrderNo')}`">
                      <el-input v-model="form.transferOrderNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(dict.type.transfer_order_status, form.transferOrderStatus)
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('INVENTORY.transferFrom')}`"
                      prop="fromWarehouseName"
                    >
                      <!-- <SelectInput
                        clearable
                        :value="form.fromWarehouseName"
                        :title="form.fromWarehouseName"
                        @click="openWarehouseFormTable"
                        :disabled="form.salesOrderTransferOrderType === '2'"
                        @clear="warehouseFromClear"
                      /> -->
                      <CommonSelectAndList
                        :id="form.fromWarehouseId"
                        :label="form.fromWarehouseName"
                        :title="form.fromWarehouseName"
                        idKey="warehouseId"
                        labelKey="warehouseName"
                        filterable
                        :options="fromWarehouseOptions"
                        :loading="fromWarehouseOptionsLoading"
                        @change="updateWarehouse($event, 'from')"
                        @handleOpen="openWarehouseFormTable"
                        :disabled="form.salesOrderTransferOrderType === '2'"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('INVENTORY.scheduledTransferDate')}`"
                      prop="scheduledTransferDate"
                    >
                      <el-date-picker
                        v-model="form.scheduledTransferDate"
                        :picker-options="validityDaysPickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.ourRef')}`">
                      <el-input
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.requiredBy')}`" prop="requiredBy">
                      <CommonSelectAndList
                        :id="form.requiredId"
                        :label="form.requiredBy"
                        idKey="userId"
                        labelKey="nickName"
                        filterable
                        :options="requiredByOptions"
                        :loading="requiredByOptionsLoading"
                        @change="updateRequiredBy"
                        @handleOpen="openRequiredByTable"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.reason')" prop="reason">
                      <MyInput
                        type="textarea"
                        v-model="form.reason"
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
          <div class="form-card mt10">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('INVENTORY.shippingInfo')"
                :warning="collapseWarningForShippingInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="form2"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.transferTo')}`" prop="toWarehouseName">
                      <CommonSelectAndList
                        :id="form.toWarehouseId"
                        :label="form.toWarehouseName"
                        :title="form.toWarehouseName"
                        idKey="warehouseId"
                        labelKey="warehouseName"
                        filterable
                        :options="toWarehouseOptions"
                        :loading="toWarehouseOptionsLoading"
                        @change="updateWarehouse($event, 'to')"
                        @handleOpen="openWarehouseToTable"
                        :disabled="form.salesOrderTransferOrderType === '1'"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('INVENTORY.deliveryAddress')}`">
                      <el-input
                        :value="form.toWarehouseAddressShowStr"
                        :title="form.toWarehouseAddressShowStr"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.contactPerson')}`" prop="toUserBy">
                      <!-- <el-input :value="form.toUserBy" :title="form.toUserBy" disabled></el-input> -->
                      <el-select
                        v-model="form.toUserId"
                        :title="form.toUserBy"
                        placeholder=""
                        style="width: 100%"
                        clearable
                        @change="warehouseUserNameChange"
                      >
                        <el-option
                          v-for="item in form.userList"
                          :key="item.userId"
                          :label="item.nickName"
                          :value="item.userId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.mobilePhone1')}`">
                      <el-input
                        :value="form.toMobilePhone"
                        :title="form.toMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input :value="form.toEmail" :title="form.toEmail" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('INVENTORY.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <ProductInfo ref="ProductInfo" :formData="form" />
                <el-form :model="form" @submit.native.prevent label-width="180px">
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
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>

    <selectSalesOrderTable ref="selectSalesOrderTable" @update="updateSalesOrderNo" />

    <selectRequiredByTable ref="selectRequiredByTable" @update="updateRequiredBy" />
    <selectWarehouseTable
      ref="selectWarehouseTable"
      :salesOrderTransferOrderType="form.salesOrderTransferOrderType"
      @update="updateWarehouse"
    />
  </FormPageLayout>
</template>

<script>
import { queryDefaultWarehouse } from '@/api/inventoryManagement/warehouse'
import { queryUsersNeedSameLegalEntity } from '@/api/system/user'
import {
  saveTransferOrder,
  queryCanSelectSalesOrderListFromTransferOrder,
  queryFromWarehouseList,
  queryToWarehouseList
} from '@/api/inventoryManagement/transferOrder'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

import selectSalesOrderTable from './components/selectSalesOrderTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import selectRequiredByTable from './components/selectRequiredByTable.vue'
import ProductInfo from './productInfo/productInfo.vue'
export default {
  mixins: [pageMixin],
  dicts: ['transfer_order_status'],
  components: {
    selectSalesOrderTable,
    selectRequiredByTable,
    selectWarehouseTable,
    ProductInfo
  },
  data() {
    return {
      activeNames: [],
      timeId: '',
      submitLoading: false,
      form: {
        transferOrderProductList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        fromWarehouseName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        requiredBy: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        scheduledTransferDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        reason: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        toWarehouseName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        toUserBy: [
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
      salesOrderOptions: [],
      salesOrderOptionsLoading: false,
      fromWarehouseOptions: [],
      fromWarehouseOptionsLoading: false,
      toWarehouseOptions: [],
      toWarehouseOptionsLoading: false,
      deptOptions: [],
      requiredByOptions: [],
      requiredByOptionsLoading: false,
      customerQuestionnaireOptions: [],
      currencyOptions: [],
      paymentTermOptions: [],
      paymentMethodOptions: [],
      incotermOptions: [],
      freightTaxNoOptions: [],
      /* 表格部分 */
      warehouseRows: [
        {
          label: this.$t('INVENTORY.warehouseCode'),
          showLabel: 'warehouseCode'
        },
        {
          label: this.$t('INVENTORY.warehouseName'),
          showLabel: 'warehouseName'
        },
        {
          label: this.$t('INVENTORY.warehouseType'),
          showLabel: 'warehouseTypeShowStr'
        },
        {
          label: this.$t('INVENTORY.label'),
          showLabel: 'label'
        },
        {
          label: this.$t('organization.address1'),
          showLabel: 'address1'
        },
        {
          label: this.$t('organization.address2'),
          showLabel: 'address2'
        },
        {
          label: this.$t('organization.city'),
          showLabel: 'city'
        },
        {
          label: this.$t('organization.province'),
          showLabel: 'province'
        },
        {
          label: this.$t('organization.postalCode'),
          showLabel: 'postalCode'
        },
        {
          label: this.$t('organization.country'),
          showLabel: 'country'
        }
      ]
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
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    handleAdd() {
      this.reset()
      this.querySalesOrderOptions()
      this.queryFromWarehouseOptions()
      this.queryToWarehouseOptions()
      this.queryRequiredByOptions()
    },
    reset() {
      this.form = {
        /* 基础信息 */
        validity: undefined,
        ourRef: undefined,
        mobilePhone: undefined,
        receiveAddressForPort: {},
        addressForWarehouse: {},
        transferOrderProductList: [],
        requiredBy: this.$store.state.user.nickName,
        requiredId: this.$store.state.user.userId
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('form1')
      this.resetForm('form2')
    },
    // 取消按钮
    back() {
      this.$emit('back')
    },
    /* 表单部分Start */
    /* 第一部分表单 */
    querySalesOrderOptions() {
      this.salesOrderOptionsLoading = true
      queryCanSelectSalesOrderListFromTransferOrder({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.transferOrder
      })
        .then((res) => {
          this.salesOrderOptionsLoading = false
          this.salesOrderOptions = res.rows || []
        })
        .catch(() => {
          this.salesOrderOptionsLoading = false
        })
    },
    openSalesOrderTable() {
      this.$refs.selectSalesOrderTable.handleOpen()
    },
    updateSalesOrderNo(row) {
      if (!row.salesOrderId) {
        this.salesOrderNoClear()
        return
      }
      this.$set(this.form, 'salesOrderId', row.salesOrderId)
      this.$set(this.form, 'salesOrderNo', row.salesOrderNo)
      // 销售订单TO转移类型. 1寄卖,2提取
      this.$set(this.form, 'salesOrderTransferOrderType', row.salesOrderTransferOrderType)
      if (row.salesOrderTransferOrderType === '1') {
        this.updateWarehouse(row.warehouse || {}, 'to')
      } else {
        this.updateWarehouse(row.warehouse || {}, 'from')
      }
      this.queryDefaultWarehouse()
    },
    salesOrderNoClear() {
      this.$set(this.form, 'salesOrderId', undefined)
      this.$set(this.form, 'salesOrderNo', undefined)
      this.warehouseToClear()
      this.warehouseFromClear()

      this.$set(this.form, 'salesOrderTransferOrderType', undefined)
      this.queryFromWarehouseOptions()
      this.queryToWarehouseOptions()
    },

    queryRequiredByOptions() {
      const timer = Date.now()
      this.queryRBTimer = timer
      this.requiredByOptionsLoading = true
      queryUsersNeedSameLegalEntity({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.transferOrder
      })
        .then((response) => {
          if (this.queryRBTimer !== timer) return
          this.requiredByOptionsLoading = false
          this.requiredByOptions = response.rows
        })
        .catch(() => {
          if (this.queryRBTimer !== timer) return
          this.requiredByOptionsLoading = false
        })
    },
    openRequiredByTable() {
      this.$refs.selectRequiredByTable.handleOpen()
    },
    requiredByClear() {
      this.$set(this.form, 'requiredBy', undefined)
      this.$set(this.form, 'requiredId', undefined)
    },
    updateRequiredBy(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'requiredBy', nickName)
      this.$set(this.form, 'requiredId', userId)
    },

    /* 第二部分表单 */
    // 查询默认仓库
    queryDefaultWarehouse() {
      queryDefaultWarehouse({ menuPerms: this.menuKey.transferOrder }).then((res) => {
        const { warehouseId } = res.data || {}
        if (warehouseId) {
          if (this.form.salesOrderTransferOrderType === '1') {
            this.updateWarehouse(res.data || {}, 'from')
          } else if (this.form.salesOrderTransferOrderType === '2') {
            this.updateWarehouse(res.data || {}, 'to')
          }
        }
      })
    },
    queryFromWarehouseOptions() {
      this.fromWarehouseOptions = []
      const params = {
        pageNum: 1,
        pageSize: 25,
        alreadySelectWarehouseId: this.form.toWarehouseId,
        menuPerms: this.menuKey.transferOrder
      }
      if (this.form.salesOrderTransferOrderType) {
        params.salesOrderTransferOrderType = this.form.salesOrderTransferOrderType
      }
      const timer = Date.now()
      this.queryFWHTimer = timer
      this.fromWarehouseOptionsLoading = true
      queryFromWarehouseList(params)
        .then((res) => {
          if (this.queryFWHTimer !== timer) return
          this.fromWarehouseOptionsLoading = false
          this.fromWarehouseOptions = res.rows || []
        })
        .catch(() => {
          this.fromWarehouseOptionsLoading = false
        })
    },
    queryToWarehouseOptions() {
      this.toWarehouseOptions = []
      const params = {
        pageNum: 1,
        pageSize: 25,
        alreadySelectWarehouseId: this.form.fromWarehouseId,
        menuPerms: this.menuKey.transferOrder
      }
      if (this.form.salesOrderTransferOrderType) {
        params.salesOrderTransferOrderType = this.form.salesOrderTransferOrderType
      }
      const timer = Date.now()
      this.queryTWHTimer = timer
      this.toWarehouseOptionsLoading = true
      queryToWarehouseList(params)
        .then((res) => {
          if (this.queryTWHTimer !== timer) return
          this.toWarehouseOptionsLoading = false
          this.toWarehouseOptions = res.rows || []
        })
        .catch(() => {
          if (this.queryTWHTimer !== timer) return
          this.toWarehouseOptionsLoading = false
        })
    },

    openWarehouseFormTable() {
      const params = {
        queryType: 'from',
        alreadySelectWarehouseId: this.form.toWarehouseId
      }
      this.$refs.selectWarehouseTable.handleOpen(params)
    },
    openWarehouseToTable() {
      const params = {
        queryType: 'to',
        alreadySelectWarehouseId: this.form.fromWarehouseId
      }
      this.$refs.selectWarehouseTable.handleOpen(params)
    },
    updateWarehouse(row, type) {
      if (type === 'to') {
        this.$set(this.form, 'toWarehouseName', row.warehouseName)
        this.$set(this.form, 'toWarehouseId', row.warehouseId)
        this.$set(this.form, 'toWarehouseAddressShowStr', row.warehouseAddressShowStr)
        this.$set(this.form, 'userList', [])
        if (row.userList && row.userList.length > 0) {
          const topUser = row.userList[0]
          this.$set(this.form, 'userList', row.userList || [])
          this.$set(this.form, 'toUserId', topUser.userId)
          this.$set(this.form, 'toUserBy', topUser.nickName)
          this.$set(this.form, 'toMobileCode', topUser.mobileCode)
          this.$set(this.form, 'toMobileNum', topUser.mobileNum)
          this.$set(this.form, 'toMobilePhone', topUser.mobilePhone)
          this.$set(this.form, 'toEmail', topUser.email)
        }
        this.queryFromWarehouseOptions()
      } else {
        this.$set(this.form, 'fromWarehouseName', row.warehouseName)
        this.$set(this.form, 'fromWarehouseId', row.warehouseId)
        this.queryToWarehouseOptions()
      }

      this.$set(this.form, 'transferOrderProductList', [])
    },
    warehouseFromClear() {
      this.$set(this.form, 'fromWarehouseName', undefined)
      this.$set(this.form, 'fromWarehouseId', undefined)
      this.$set(this.form, 'transferOrderProductList', [])
      // this.$set(this.form, 'toMobileCode', undefined)
      // this.$set(this.form, 'toMobileNum', undefined)
      // this.$set(this.form, 'toMobilePhone', undefined)
      // this.$set(this.form, 'toEmail', undefined)
      this.queryToWarehouseOptions()
    },
    warehouseToClear() {
      this.$set(this.form, 'toWarehouseName', undefined)
      this.$set(this.form, 'toWarehouseId', undefined)
      this.$set(this.form, 'toWarehouseAddressShowStr', undefined)
      this.$set(this.form, 'toUserId', undefined)
      this.$set(this.form, 'toUserBy', undefined)
      this.$set(this.form, 'toMobileCode', undefined)
      this.$set(this.form, 'toMobileNum', undefined)
      this.$set(this.form, 'toMobilePhone', undefined)
      this.$set(this.form, 'toEmail', undefined)
      this.$set(this.form, 'transferOrderProductList', [])
      this.$set(this.form, 'userList', [])
      this.queryFromWarehouseOptions()
    },
    warehouseUserNameChange(e) {
      const { userList } = this.form
      if (e) {
        const row = userList.filter((x) => x.userId === e)[0]
        this.$set(this.form, 'toUserId', row.userId)
        this.$set(this.form, 'toUserBy', row.nickName)
        this.$set(this.form, 'toMobileCode', row.mobileCode)
        this.$set(this.form, 'toMobileNum', row.mobileNum)
        this.$set(this.form, 'toMobilePhone', row.mobilePhone)
        this.$set(this.form, 'toEmail', row.email)
      } else {
        this.warehouseUserNameClear()
      }
    },
    warehouseUserNameClear() {
      this.$set(this.form, 'toUserId', undefined)
      this.$set(this.form, 'toUserBy', undefined)
      this.$set(this.form, 'toMobileCode', undefined)
      this.$set(this.form, 'toMobileNum', undefined)
      this.$set(this.form, 'toMobilePhone', undefined)
      this.$set(this.form, 'toEmail', undefined)
    },
    /* 表单部分End */

    async submitForm() {
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('INVENTORY.deliveryInfo'))
        )
        return
      }

      const valid2 = await this.$refs.form2.validate().catch((err) => {
        return err
      })
      this.collapseWarningForShippingInfo = !valid2
      if (!valid2) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('INVENTORY.shippingInfo'))
        )
        return
      }
      if (valid1 && valid2) {
        let param = { ...this.form }
        const validProduct = this.validProductList(param.transferOrderProductList)
        if (!validProduct) {
          this.$refs.ProductInfo.activeName = 'productDetail'
          this.collapseWarningForProductInfo = true
          return
        }
        this.collapseWarningForProductInfo = false
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        const confirmMsg = this.$t('INVENTORY.transferOrderSubmit')
        const successMsg = this.$t('INVENTORY.transferOrderSuccess')
        const submitFn = saveTransferOrder

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
    validProductList(detailList, isReqOne = true) {
      const valid = false
      if (detailList.length <= 0 && isReqOne) {
        this.$modal.msgError(this.$t('INVENTORY.productTableEmpty'))
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('INVENTORY.qty')))
        return valid
      }
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
.collapse-item-content-pt0 {
  /deep/.el-collapse-item__content {
    padding-top: 10px;
  }
}
.salesOrderTip {
  flex-shrink: 0;
  margin-left: 6px;
  background-color: #f59a23;
  color: #fff;
  padding: 0 6px;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 12px;
  // color: #fff;
}
</style>
