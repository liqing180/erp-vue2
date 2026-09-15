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
                    <el-form-item :label="`${$t('SALES.customerName')}`" prop="businessPartnerName">
                      <CommonSelectAndList
                        :id="form.businessPartnerMainId"
                        :label="form.businessPartnerName"
                        idKey="businessPartnerMainId"
                        labelKey="businessPartnerName"
                        filterable
                        :clearable="false"
                        :options="businessPartnerList"
                        :loading="businessPartnerNameLoading"
                        @change="updateSupplier"
                        @handleOpen="openSupplierTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesOrderNo')}`">
                      <el-input
                        v-model="form.salesOrderNo"
                        :title="form.salesOrderNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesGoodsReturnNo')}`">
                      <el-input v-model="form.salesGoodsReturnNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.deliveryOrderNo')}`" prop="deliveryOrderNo">
                      <!-- <SelectInput
                        :value="form.deliveryOrderNo"
                        :title="form.deliveryOrderNo"
                        @click="openDeliveryOrderTable"
                        :disabled="!form.businessPartnerId"
                        :clearable="false"
                      /> -->

                      <CommonSelectAndList
                        :id="form.deliveryOrderId"
                        :label="form.deliveryOrderNo"
                        idKey="deliveryOrderId"
                        labelKey="deliveryOrderNo"
                        filterable
                        :disabled="!form.businessPartnerId"
                        :options="deliveryOrderList"
                        :loading="deliveryOrderNoLoading"
                        @change="updateDeliveryOrderNo"
                        @handleOpen="openDeliveryOrderTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesPerson')}`">
                      <el-input
                        v-model="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.sales_goods_return_status,
                            form.salesGoodsReturnStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.returnTo')}`" prop="warehouseName">
                      <!-- <SelectInput
                        clearable
                        :value="form.warehouseName"
                        :title="form.warehouseName"
                        @click="openWarehouseTable"
                        :disabled="!form.deliveryOrderNo || form.isDeliveryOrderWarehouse === '1'"
                        @clear="warehouseClear"
                      /> -->

                      <CommonSelectAndList
                        :id="form.warehouseNameId"
                        :label="form.warehouseName"
                        idKey="warehouseNameId"
                        labelKey="warehouseName"
                        filterable
                        :disabled="!form.deliveryOrderNo || form.isDeliveryOrderWarehouse === '1'"
                        :options="warehouseList"
                        :loading="warehouseNameLoading"
                        @change="updateWarehouse"
                        @handleOpen="openWarehouseTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.dateSold')}`">
                      <el-date-picker
                        v-model="form.soldDate"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                        disabled
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.yourRef')}`">
                      <el-input
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <template v-if="false">
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.dueDate')}`" prop="dueDate">
                        <el-date-picker
                          v-model="form.dueDate"
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
                      <el-form-item :label="`${$t('SALES.dateRequired')}`" prop="requiredDate">
                        <el-date-picker
                          v-model="form.requiredDate"
                          :picker-options="validityDaysPickerOptions"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </template>

                  <el-col :span="16">
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
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.ourRef')}`">
                      <el-input
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row v-if="false">
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.pic')}`" prop="picUserBy">
                      <SelectInput
                        :value="form.picUserBy"
                        :title="form.picUserBy"
                        @clear="picUserByClear"
                        clearable
                        @click="openPicTable"
                        class="form-wd"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10" v-if="false">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.returnInfo')"
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
                    <el-form-item :label="`${$t('SALES.address')}`">
                      <el-input
                        :value="form.warehouseLabel"
                        :title="form.warehouseLabel"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('SALES.deliveryAddress')}`">
                      <el-input
                        :value="form.warehouseAddressShowStr"
                        :title="form.warehouseAddressShowStr"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.contactPerson')}`" prop="warehouseUserName">
                      <!-- <el-input
                        v-model="form.warehouseUserName"
                        :title="form.warehouseUserName"
                        disabled
                      ></el-input> -->

                      <el-select
                        v-model="form.warehouseUserId"
                        :title="form.warehouseUserName"
                        placeholder=""
                        style="width: 100%"
                        clearable
                        @change="warehouseUserNameChange"
                      >
                        <el-option
                          v-for="item in form.userList"
                          :key="item.userId"
                          :label="item.userName"
                          :value="item.userId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input
                        v-model="form.warehouseUserEmail"
                        :title="form.warehouseUserEmail"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.mobilePhone')}`">
                      <el-input
                        v-model="form.warehouseUserMobilePhone"
                        :title="form.warehouseUserMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0" ref="collapseScrollPage">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :initCommonFileList="initCommonFileList"
                  @scrollPageToTable="scrollPageToTable"
                />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
    <selectCustomerTable ref="selectCustomerTable" @update="updateSupplier" />
    <selectDeliveryOrderTable
      ref="selectDeliveryOrderTable"
      :businessPartnerId="form.businessPartnerId"
      @update="updateDeliveryOrderNo"
    />
    <selectWarehouseTable ref="selectWarehouseTable" :formData="form" @update="updateWarehouse" />
    <selectPicTable ref="selectPicTable" @update="updatePic" />
  </FormPageLayout>
</template>

<script>
import {
  saveSalesGoodsReturn,
  saveDraftSalesGoodsReturn,
  queryCanSelectWarehouseListFromSGR,
  querySGRCanSelectDeliveryOrderList
} from '@/api/salesManagement/salesGoodsReturn'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

import { queryCanSelectCustomerListHavePage } from '@/api/salesManagement/salesInquiry'

import selectCustomerTable from './components/selectCustomerTable.vue'
import selectDeliveryOrderTable from './components/selectDeliveryOrderTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import selectPicTable from './components/selectPicTable.vue'
import ProductInfo from './productInfo/productInfo.vue'
import { formDirtyClass } from '@/mixins/formDirtyClass'

export default {
  mixins: [pageMixin],
  dicts: ['sales_goods_return_status'],
  components: {
    selectCustomerTable,
    selectDeliveryOrderTable,
    selectPicTable,
    selectWarehouseTable,
    ProductInfo
  },
  data() {
    return {
      warehouseList: [],
      deliveryOrderList: [],
      businessPartnerList: [],
      activeNames: [],
      timeId: '',
      submitLoading: false,
      form: {
        salesGoodsReturnProductList: []
      },
      warehouseSelectProduct: {},

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        businessPartnerName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        deliveryOrderNo: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        warehouseName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        /* requiredDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ], */
        picUserBy: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        warehouseUserName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        dueDate: [
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
      initCommonFileList: [],
      loading: false,
      businessPartnerNameLoading: false,
      deliveryOrderNoLoading: false,
      warehouseNameLoading: false
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
    queryCanSelectCustomerListHavePage() {
      this.businessPartnerNameLoading = true
      const param = {
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.salesGoodsReturn
      }
      queryCanSelectCustomerListHavePage(param)
        .then((response) => {
          const rows = response.rows || []
          this.businessPartnerList = rows
          this.businessPartnerNameLoading = false
        })
        .catch((err) => {
          this.businessPartnerNameLoading = false
          window.console.error(err)
        })
    },
    querySGRCanSelectDeliveryOrderList() {
      if (!this.form.businessPartnerId) {
        this.deliveryOrderList = []
        return
      }
      const param = {
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.salesGoodsReturn,
        businessPartnerId: this.form.businessPartnerId
      }
      this.deliveryOrderNoLoading = true
      querySGRCanSelectDeliveryOrderList(param)
        .then((response) => {
          const rows = response.rows || []
          this.deliveryOrderList = rows
          this.deliveryOrderNoLoading = false
        })
        .catch((err) => {
          this.deliveryOrderNoLoading = false
          window.console.error(err)
        })
    },
    handleAdd() {
      this.reset()
      this.queryCanSelectCustomerListHavePage()
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
      param.commonFileList = this.$refs.ProductInfo && this.$refs.ProductInfo.getFileIds()
      return JSON.stringify(param)
    },
    reset() {
      this.form = {
        /* 基础信息 */
        deliveryOrderNo: undefined,
        warehouseName: undefined,
        warehouseLabel: undefined,
        warehouseUserName: undefined,
        warehouseAddressShowStr: undefined,
        warehouseUserMobileCode: undefined,
        warehouseUserMobileNum: undefined,
        warehouseUserMobilePhone: undefined,
        warehouseUserEmail: undefined,
        picUserBy: this.$store.state.user.nickName,
        picUserId: this.$store.state.user.userId,
        salesGoodsReturnNo: undefined,
        salesPersonBy: undefined,
        salesPersonId: undefined,
        businessPartnerName: undefined,
        soldDate: undefined,
        requiredDate: undefined,
        dueDate: undefined,
        ourRef: undefined,
        yourRef: undefined,
        remarks: undefined,
        automatedEmail: '1',

        addressForWarehouse: {},
        salesGoodsReturnProductList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('form1')
      this.warehouseSelectProduct = {}
      // this.resetForm('form2')
    },
    // 取消按钮
    back() {
      this.$emit('back')
    },
    backFN() {
      formDirtyClass.showNotify(this.$route.name).then((msg) => {
        if (msg === 'save') {
          this.handleSaveDraftNoConFirm()
          return
        } else if (msg === 'stop') {
          return
        }
        this.back()
      })
    },
    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form2.validateField(code)
    },

    /* 第二部分表单 */
    openSupplierTable() {
      this.$refs.selectCustomerTable.handleOpen()
    },
    // 清空供应商
    supplierClear() {},
    updateSupplier(row) {
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'abbreviation', row.abbreviation)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      const account = row.bpBusinessAccountCustomer || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.updateDeliveryOrderNo({})
      this.querySGRCanSelectDeliveryOrderList()
    },

    openDeliveryOrderTable() {
      this.$refs.selectDeliveryOrderTable.handleOpen()
    },
    updateDeliveryOrderNo(row) {
      console.log('row================', row)
      this.$set(this.form, 'dropShipping', row.dropShipping)
      this.$set(this.form, 'deliveryOrderId', row.deliveryOrderId)
      this.$set(this.form, 'deliveryOrderNo', row.deliveryOrderNo)
      this.$set(this.form, 'salesOrderId', row.salesOrderId)
      this.$set(this.form, 'salesOrderNo', row.salesOrderNo)
      this.$set(this.form, 'soldDate', row.createdTime)
      this.$set(this.form, 'salesPersonBy', row.salesPersonBy)
      this.$set(this.form, 'salesPersonId', row.salesPersonId)
      this.$set(this.form, 'salesPersonId', row.salesPersonId)
      this.$set(this.form, 'salesQuotationType', row.salesQuotationType)
      // salesQuotationType Consignment
      this.$set(this.form, 'salesGoodsReturnProductList', [])
      this.warehouseClear()
      if (row.shipWarehouseId && row.shipWarehouse) {
        this.updateWarehouse(row.shipWarehouse)
        this.$set(this.form, 'isDeliveryOrderWarehouse', '1')
      } else {
        this.$set(this.form, 'isDeliveryOrderWarehouse', '0')
        if (this.form.deliveryOrderId) {
          this.queryCanSelectWarehouseListFromSGR()
        }
      }
    },
    queryCanSelectWarehouseListFromSGR() {
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$trimOfObj(param)
      param.menuPerms = this.menuKey.salesGoodsReturn
      param.deliveryOrderId = this.form.deliveryOrderId
      this.warehouseNameLoading = true
      queryCanSelectWarehouseListFromSGR(param)
        .then((response) => {
          const rows = response.rows || []
          this.warehouseList = rows
          this.warehouseNameLoading = false
          if (rows && rows.length === 1) {
            this.updateWarehouse(rows[0])
          }
        })
        .catch(() => {
          this.warehouseNameLoading = false
        })
    },

    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    updateWarehouse(row) {
      const oldWarehouseId = this.form.warehouseId

      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'warehouseName', row.warehouseName)
      this.$set(this.form, 'warehouseId', row.warehouseId)
      this.$set(this.form, 'warehouseLabel', rowData.label)
      if (oldWarehouseId) {
        this.warehouseSelectProduct[oldWarehouseId + this.form.deliveryOrderId] = JSON.parse(
          JSON.stringify(this.form.salesGoodsReturnProductList)
        )
      }
      if (row.warehouseId !== oldWarehouseId) {
        const storeP =
          this.warehouseSelectProduct[row.warehouseId + this.form.deliveryOrderId] || []
        if (row.warehouseId) {
          this.$set(this.form, 'salesGoodsReturnProductList', JSON.parse(JSON.stringify(storeP)))
        } else {
          this.$set(this.form, 'salesGoodsReturnProductList', [])
        }
      }
      if (row.userList && row.userList.length > 0) {
        this.$set(this.form, 'userList', row.userList || [])
        this.$set(this.form, 'warehouseUserId', row.userId)
        this.$set(this.form, 'warehouseUserName', row.userName)
        this.$set(this.form, 'warehouseAddressShowStr', row.warehouseAddressShowStr)
        this.$set(this.form, 'warehouseUserMobileCode', row.mobileCode)
        this.$set(this.form, 'warehouseUserMobileNum', row.mobileNum)
        this.$set(this.form, 'warehouseUserMobilePhone', row.mobilePhone)
        this.$set(this.form, 'warehouseUserEmail', row.email)
      } else {
        this.warehouseUserNameClear()
      }
    },
    warehouseClear() {
      this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseId', undefined)
      this.$set(this.form, 'warehouseLabel', undefined)
      this.$set(this.form, 'warehouseUserId', undefined)
      this.$set(this.form, 'warehouseUserName', undefined)
      this.$set(this.form, 'warehouseAddressShowStr', undefined)
      this.$set(this.form, 'warehouseUserMobileCode', undefined)
      this.$set(this.form, 'warehouseUserMobileNum', undefined)
      this.$set(this.form, 'warehouseUserMobilePhone', undefined)
      this.$set(this.form, 'warehouseUserEmail', undefined)
      this.$set(this.form, 'userList', [])
      this.$set(this.form, 'salesGoodsReturnProductList', [])
    },
    warehouseUserNameChange(e) {
      const { userList } = this.form
      if (e) {
        const row = userList.filter((x) => x.userId === e)[0]
        this.$set(this.form, 'warehouseUserId', row.userId)
        this.$set(this.form, 'warehouseUserName', row.userName)
        this.$set(this.form, 'warehouseUserMobileCode', row.mobileCode)
        this.$set(this.form, 'warehouseUserMobileNum', row.mobileNum)
        this.$set(this.form, 'warehouseUserMobilePhone', row.mobilePhone)
        this.$set(this.form, 'warehouseUserEmail', row.email)
      } else {
        this.warehouseUserNameClear()
      }
    },
    warehouseUserNameClear() {
      this.$set(this.form, 'warehouseUserId', undefined)
      this.$set(this.form, 'warehouseUserName', undefined)
      this.$set(this.form, 'warehouseUserMobileCode', undefined)
      this.$set(this.form, 'warehouseUserMobileNum', undefined)
      this.$set(this.form, 'warehouseUserMobilePhone', undefined)
      this.$set(this.form, 'warehouseUserEmail', undefined)
    },
    // 打开pic弹窗
    openPicTable() {
      this.$refs.selectPicTable.handleOpen()
    },
    updatePic(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'picUserBy', nickName)
      this.$set(this.form, 'picUserId', userId)
    },
    // 清空pic
    picUserByClear() {
      this.$set(this.form, 'picUserBy', undefined)
      this.$set(this.form, 'picUserId', undefined)
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
    /* 表单部分End */

    async submitForm(submitType, isConfirm = true, gotoRoute) {
      const myFileIds = this.$refs.ProductInfo.getFileIds()
      if (myFileIds === false) {
        return
      }
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }

      // const valid2 = await this.$refs.form2.validate().catch((err) => {
      //   return err
      // })
      // this.collapseWarningForShippingInfo = !valid2
      // if (!valid2) {
      //   this.$modal.msgError(
      //     this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.returnInfo'))
      //   )
      //   return
      // }

      if (valid1) {
        let param = { ...this.form }
        if (submitType === 'save') {
          this.collapseWarningForProductInfo = false
        } else {
          const validProduct = this.validProductList(param.salesGoodsReturnProductList)
          if (!validProduct) {
            this.$refs.ProductInfo.activeName = 'productDetail'
            this.collapseWarningForProductInfo = true
            return
          }
        }

        this.collapseWarningForProductInfo = false
        param.commonFileList = myFileIds

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('SALES.SGRSaveConfirm')
          successMsg = this.$t('SALES.SGRSaveSuccess')
          submitFn = saveDraftSalesGoodsReturn
        } else {
          confirmMsg = this.$t('SALES.SGRSubmitConfirm')
          successMsg = this.$t('SALES.SGRSubmitSuccess')
          submitFn = saveSalesGoodsReturn
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
              this.submitLoading = false
              this.back()
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
                this.back()
              }
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      }
    },
    validProductList(detailList, isReqOne = true) {
      const valid = false
      if (detailList.length <= 0 && isReqOne) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const rmaTypeReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.rmaType)
      })
      if (rmaTypeReq) {
        this.$refs.ProductInfo.errorMessage('rmaType', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.RMAType')))
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qtyToReturn)
      })
      if (qtyReq) {
        this.$refs.ProductInfo.errorMessage('qtyToReturn', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.qtyToReturn')))
        return valid
      }
      const returnedReasonReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.returnedReason)
      })
      if (returnedReasonReq) {
        this.$refs.ProductInfo.errorMessage('returnedReason', 'productDetail')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.returnReason'))
        )
        return valid
      }
      const scheduledReceivedDateReq = detailList.find((item) => {
        return (
          ['1', '3', '4', '8'].includes(item.rmaType) &&
          !this.$resultOfBoolean(item.scheduledReceivedDate)
        )
      })
      if (scheduledReceivedDateReq) {
        this.$refs.ProductInfo.errorMessage('scheduledReceivedDate', 'productDetail')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.estimatedReturnDate'))
        )
        return valid
      }

      return true
    },
    handleSaveDraft(isConfirm = true, gotoRoute) {
      this.submitForm('save', isConfirm, gotoRoute)
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      // isConfirm
      this.handleSaveDraft(false, gotoRoute)
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
