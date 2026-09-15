<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        :label="$t('organization.functionalPermissions')"
        name="1"
        v-if="functionalPermissionsAuth"
      >
        <functionalPermissions ref="functionalPermissions" :comDisFrom="comDisFrom" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('organization.accessPermissions')"
        name="2"
        v-if="accessPermissionsAuth"
      >
        <accessPermissions ref="accessPermissions" :comDisFrom="comDisFrom" />
      </el-tab-pane>
      <el-tab-pane :label="$t('organization.warehouse')" name="3" v-if="warehouseAuth">
        <warehouse ref="warehouse" :comDisFrom="comDisFrom" :formData="form" />
      </el-tab-pane>
      <el-tab-pane :label="$t('organization.vendor')" name="4" v-if="vendorAuth">
        <vendor ref="vendor" :comDisFrom="comDisFrom" :formData="form" :companyList="companyList" />
      </el-tab-pane>
      <el-tab-pane :label="$t('menu.customer')" name="6" v-if="customerAuth">
        <customer
          ref="customer"
          :comDisFrom="comDisFrom"
          :formData="form"
          :companyList="companyList"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('menu.paymentTerm')" name="7" v-if="paymentTermAuth">
        <paymentTerm
          ref="paymentTerm"
          :comDisFrom="comDisFrom"
          :formData="form"
          :companyList="companyList"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('organization.salesPriceControl')" name="8">
        <el-form
          ref="createForm"
          :model="createForm"
          label-width="200px"
          :disabled="comDisFrom"
          @submit.native.prevent
        >
          <el-row>
            <el-col :span="8">
              <el-form-item>
                <template slot="label">
                  <div class="flexEnd">
                    <div>{{ $t('organization.priceUpwardLimit') }}</div>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <div v-html="$t('organization.priceUpwardLimitTip')"></div>
                      </div>
                      <i class="el-icon-info ml10"></i>
                    </el-tooltip>
                  </div>
                </template>
                <el-input-number
                  v-thousandSplit="{ precision: 2 }"
                  v-model="createForm.priceUpwardLimit"
                  :precision="2"
                  type="number"
                  class="form-wd"
                  :min="0"
                  :max="999.99"
                  placeholder="0.00 - 999.99"
                  style="width: 100%"
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <template slot="label">
                  <div class="flexEnd">
                    <div>{{ $t('organization.priceDownwardLimit') }}</div>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <div v-html="$t('organization.priceDownwardLimitTip')"></div>
                      </div>
                      <i class="el-icon-info ml10"></i>
                    </el-tooltip>
                  </div>
                </template>
                <el-input-number
                  v-thousandSplit="{ precision: 2 }"
                  v-model="createForm.priceDownwardLimit"
                  :precision="2"
                  type="number"
                  class="form-wd"
                  :min="0"
                  :max="100"
                  placeholder="0.00 - 100.00"
                  style="width: 100%"
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('organization.assignUser')" name="5" v-if="assignUserAuth">
        <assignUser ref="assignUser" :comDisFrom="comDisFrom" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import functionalPermissions from './functionalPermissions.vue'
import accessPermissions from './accessPermissions2.vue'
import warehouse from '@/views/organization/role/warehouse'
import vendor from '@/views/organization/role/vendor'
import customer from '@/views/organization/role/customer'
import paymentTerm from '@/views/organization/role/paymentTerm'

import assignUser from './assignUser.vue'
export default {
  props: {
    comDisFrom: Boolean,
    form: {
      type: Object,
      default: () => {}
    },
    companyList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    functionalPermissions,
    accessPermissions,
    warehouse,
    vendor,
    assignUser,
    customer,
    paymentTerm
  },
  data() {
    return {
      activeName: '1',
      createForm: {
        priceUpwardLimit: undefined,
        priceDownwardLimit: undefined
      }
    }
  },
  computed: {
    functionalPermissionsAuth() {
      return this.checkPermi(['organization:role:functionalPermissions:list'])
    },
    accessPermissionsAuth() {
      return this.checkPermi(['organization:role:accessPermissions:list'])
    },
    warehouseAuth() {
      return this.checkPermi(['organization:role:warehouse:list'])
    },
    vendorAuth() {
      return this.checkPermi(['organization:role:vendor:list'])
    },
    customerAuth() {
      return this.checkPermi(['organization:role:customer:list'])
    },
    paymentTermAuth() {
      return false
      // return this.checkPermi(['organization:role:paymentTerm:list'])
    },
    assignUserAuth() {
      return this.checkPermi(['organization:role:assignUser:list'])
    }
  },
  watch: {
    form: {
      immediate: true,
      handler(newVal) {
        const { priceDownwardLimit, priceUpwardLimit } = this.form
        this.$set(this.createForm, 'priceDownwardLimit', priceDownwardLimit || undefined)
        this.$set(this.createForm, 'priceUpwardLimit', priceUpwardLimit || undefined)
      }
    }
  },
  methods: {
    handleClick() {},
    getFromData(params) {
      const { priceUpwardLimit, priceDownwardLimit } = this.createForm
      params.priceUpwardLimit = priceUpwardLimit
      params.priceDownwardLimit = priceDownwardLimit
      if (this.functionalPermissionsAuth) {
        const { menuIdList, functionalPermissionsLeftCheckedKeys } =
          this.$refs.functionalPermissions.submitForm()
        params.menuIdList = menuIdList
        params.functionalPermissionsLeftCheckedKeys = functionalPermissionsLeftCheckedKeys || []
      }
      if (this.accessPermissionsAuth) {
        const accessPermissionsIdList = this.$refs.accessPermissions.submitForm()
        params.accessPermissionsIdList = accessPermissionsIdList
      }
      if (this.warehouseAuth) {
        const warehouseData = this.$refs.warehouse.submitForm()
        params.dpTypeWarehouse = warehouseData.dpTypeWarehouse
        params.warehouseIdList = warehouseData.warehouseIdList
      }
      if (this.vendorAuth) {
        const vendorData = this.$refs.vendor.submitForm()
        params.dpTypeVendor = vendorData.dpTypeVendor
        params.vendorIdList = vendorData.vendorIdList
        params.vendorBranchCompanyIdList = vendorData.vendorBranchCompanyIdList
      }
      if (this.customerAuth) {
        const vendorData = this.$refs.customer.submitForm()
        params.dpTypeCustomer = vendorData.dpTypeVendor
        params.customerIdList = vendorData.vendorIdList
        params.customerBranchCompanyIdList = vendorData.customerBranchCompanyIdList
      }
      if (this.paymentTermAuth) {
        const vendorData = this.$refs.paymentTerm.submitForm()
        params.dpTypePaymentTerm = vendorData.dpTypeVendor
        params.paymentTermIdList = vendorData.vendorIdList
        params.paymentTermBranchCompanyIdList = vendorData.paymentTermBranchCompanyIdList
      }
      if (this.assignUserAuth) {
        const { menuIdList } = this.$refs.assignUser.submitForm()
        params.userIdList = menuIdList
      }
    }
  }
}
</script>

<style></style>
