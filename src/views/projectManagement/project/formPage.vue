<template>
  <FormPageLayoutTabs v-loading="submitLoading">
    <template v-slot:btn>
      <template v-if="!nextPage">
        <el-button
          type="primary"
          size="mini"
          v-if="!comDisFrom && form.costProjectStatus !== '2'"
          @click="submitForm"
          >{{ $t('uiBtn.submit') }}
        </el-button>
        <!-- <el-button
        type="primary"
        size="mini"
        @click="handleSaveDraft"
        v-if="saveAuth && form.costProjectStatus !== '2'"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button> -->
        <el-button type="primary" size="mini" @click="handleComplete" v-if="completeAuth"
          >{{ $t('menu.complete') }}
        </el-button>
      </template>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>

    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <div class="form-card" v-show="!nextPage">
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
              label-width="150px"
              :disabled="comDisFrom || form.costProjectStatus === '2'"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.projectName')}`" prop="costProjectName">
                    <el-input
                      v-model="form.costProjectName"
                      :title="form.costProjectName"
                      class="form-wd"
                      maxlength="100"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.status')}`">
                    <el-input
                      :value="
                        selectDictLabel(dict.type.cost_project_status, form.costProjectStatus)
                      "
                      :title="
                        selectDictLabel(dict.type.cost_project_status, form.costProjectStatus)
                      "
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    v-if="!rowId"
                    :label="`${$t('PRODUCT.projectCode')}`"
                    :rules="[
                      {
                        required: form.isAutoNo === '0',
                        pattern: new RegExp(/^(?!(\s+$))/g),
                        message: $t('ui.reqMsg'),
                        trigger: ['blur']
                      }
                    ]"
                    prop="costProjectCode"
                  >
                    <div class="input-switch-box">
                      <div class="con-left">
                        <el-input
                          :disabled="form.isAutoNo === '1'"
                          v-model="form.costProjectCode"
                          :title="form.costProjectCode"
                          maxlength="50"
                        />
                      </div>
                      <div class="con-right">
                        <el-switch
                          v-model="form.isAutoNo"
                          active-value="1"
                          inactive-value="0"
                          @change="changeEmployeeNoSwitch('costProjectCode')"
                        ></el-switch>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item
                    :label="`${$t('PRODUCT.projectCode')}`"
                    prop="costProjectCode"
                    v-else
                  >
                    <el-input disabled v-model="form.costProjectCode" maxlength="50" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.customer')}`" prop="businessPartnerIdList">
                    <div class="input-switch-box">
                      <div class="con-left">
                        <ToolTipShowList :list="form.businessPartnerNameList || []" popoverTitle="">
                          <CommonMultipleSelect
                            :disabled="form.costProjectStatus === '2'"
                            :ids="form.businessPartnerIdList"
                            :labels="form.businessPartnerNameList"
                            :showTitle="true"
                            idKey="businessPartnerId"
                            labelKey="businessPartnerName"
                            :collapseTags="true"
                            :options="customerList"
                            @change="businessPartnerIdListChange"
                          />
                        </ToolTipShowList>
                      </div>
                      <div class="con-right" v-if="form.costProjectStatus !== '2'">
                        <svg-icon
                          icon-class="list2"
                          class="primary-pointer"
                          style="font-size: 26px"
                          @click="openCustomerTable"
                        />
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.address')}`" prop="receiveAddressId">
                    <CommonSelectAndList
                      :id="form.receiveAddressId"
                      :label="form.receiveAddress"
                      :title="form.receiveAddress"
                      idKey="businessAddressId"
                      labelKey="receiveAddress"
                      filterable
                      :options="addressList"
                      :disabled="
                        !(form.businessPartnerIdList || []).length || form.costProjectStatus === '2'
                      "
                      :loading="receiveAddressLoading"
                      @change="deliveryAddressChange"
                      @handleOpen="openReceiveAddressTable"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="16" v-if="false">
                  <el-form-item :label="`${$t('SALES.addressDetails')}`">
                    <el-input
                      v-model="form.receiveAddress"
                      :title="form.receiveAddress"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('PRODUCT.projectDescription')"
                    prop="costProjectDescription"
                  >
                    <MyInput
                      type="textarea"
                      v-model="form.costProjectDescription"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="300"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <actualCostAndSalesAmount
          ref="actualCostAndSalesAmount"
          @changeNextPage="changeNextPage"
          @updateById="updateById"
          v-if="rowId"
        />

        <template v-if="rowId && !nextPage">
          <div class="form-card mt10">
            <el-collapse-item name="3">
              <FormCollapseItemTitle slot="title" :title="$t('SALES.projectSummary')">
              </FormCollapseItemTitle>
              <div class="pb20">
                <projectSummaryTable ref="projectSummaryTable" />
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="2">
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
        </template>
      </el-collapse>
    </template>

    <multipleSelectCustomerTable ref="multipleSelectCustomerTable" @update="updateCustomer" />

    <payToAddressDlg
      ref="payToAddressDlg"
      :businessPartnerIdList="form.businessPartnerIdList"
      @update="deliveryAddressChange"
    />

    <!-- 完成 -->
    <selectProductTable
      ref="selectProductTable"
      :costProjectId="form.costProjectId"
      @onSuccess="handleUpdate"
    />
  </FormPageLayoutTabs>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'
import locale2 from '@/views/system/lang/index'
import multipleSelectCustomerTable from './components/multipleSelectCustomerTable.vue'
import actualCostAndSalesAmount from './actualCostAndSalesAmount'
import { queryCostProjectById, submitCostProject } from '@/api/projectManagement/project'
import { queryCanSelectCustomerListHavePage } from '@/api/salesManagement/salesInquiry'
import { queryAddressByBusinessPartnerId } from '@/api/purchaseManagement/purchaseContract'

import payToAddressDlg from './components/payToAddressDlg.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import projectSummaryTable from './components/projectSummaryTable'
import selectProductTable from './components/selectProductTable'

export default {
  dicts: ['cost_project_status'],
  name: '',
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    multipleSelectCustomerTable,
    payToAddressDlg,
    SystemOperationLogTable,
    actualCostAndSalesAmount,
    projectSummaryTable,
    selectProductTable
  },
  data() {
    return {
      loading: false,
      saveKey: '2',
      activeNames: ['1', '2', '3', '4'],
      activeName: 'basicInfo',
      submitLoading: false,
      rowIdKey: 'fullId',
      rowId: '',
      timeId: '',
      form: {},
      collapseWarningForBasicInfo: false,
      rules: {
        costProjectName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        businessPartnerIdList: [
          {
            required: true,
            type: 'array',
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        receiveAddressId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      bpAddressRows: [
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
      ],
      nextPage: false,
      customerList: [],
      addressList: [],
      businessPartnerIdListLoading: false,
      receiveAddressLoading: false,
      projectSummaryTableList: [],
      buttonAuthMsg: {
        isCanCompleted: '0'
      }
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
        } else {
          this.queryCanSelectCustomerListHavePage()
        }
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['projectManagement:project:edit'])
    },
    saveAuth() {
      if (this.isView === '1') {
        return false
      }
      return this.checkPermi(['projectManagement:project:edit'])
    },
    completeAuth() {
      return (
        this.checkPermi(['projectManagement:project:complete']) &&
        this.buttonAuthMsg.isCanCompleted === '1'
      )
    },
    comDisFrom() {
      if (this.isView === '1') {
        return true
      }

      let dis = true
      if (this.rowId) {
        if (this.editAuth) {
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
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  methods: {
    queryAddressByBusinessPartnerId() {
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      param.businessPartnerIdList = this.form.businessPartnerIdList
      this.receiveAddressLoading = true
      queryAddressByBusinessPartnerId(param)
        .then((response) => {
          const rows = response.rows || []
          this.addressList = rows
          this.receiveAddressLoading = false
        })
        .catch((err) => {
          this.receiveAddressLoading = false
          window.console.error(err)
        })
    },
    queryCanSelectCustomerListHavePage() {
      const param = {
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.project
      }
      this.businessPartnerIdListLoading = true
      queryCanSelectCustomerListHavePage(param)
        .then((response) => {
          const rows = response.rows || []
          this.customerList = rows
          this.businessPartnerIdListLoading = false
        })
        .catch((err) => {
          this.businessPartnerIdListLoading = false
          window.console.error(err)
        })
    },
    openReceiveAddressTable() {
      this.$refs.payToAddressDlg.handleOpen()
    },
    deliveryAddressChange(row) {
      console.log(row, '===========row')
      // this.$set(this.form, 'addressForBPAddress', row)
      this.$set(this.form, 'receiveAddressName', row.receiveAddressName || row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
    },
    deliveryAddressClear() {
      // this.$set(this.form, 'addressForBPAddress', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'receiveAddress', undefined)
      this.$set(this.form, 'district', undefined)
    },
    changeNextPage() {
      this.nextPage = true
    },
    updateById() {
      const rowId = this.rowId
      queryCostProjectById({ costProjectId: rowId }).then((res) => {
        const data = res.data || {}
        this.buttonAuthMsg = data.buttonAuthMsg || {}
        this.$nextTick(() => {
          const {
            actualCostNew,
            salesAmount,
            receivedAmount,
            profitLoss,
            profit,
            projectProgress
          } = data
          if (
            this.$resultOfBoolean(actualCostNew) ||
            this.$resultOfBoolean(salesAmount) ||
            this.$resultOfBoolean(receivedAmount) ||
            this.$resultOfBoolean(profitLoss) ||
            this.$resultOfBoolean(profit) ||
            this.$resultOfBoolean(projectProgress)
          ) {
            this.$refs.projectSummaryTable &&
              this.$refs.projectSummaryTable.init([
                { actualCostNew, salesAmount, receivedAmount, profitLoss, profit, projectProgress }
              ])
          } else {
            this.$refs.projectSummaryTable && this.$refs.projectSummaryTable.init([])
          }
        })
      })
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      queryCostProjectById({ costProjectId: rowId }).then((res) => {
        const data = res.data || {}
        data.businessPartnerIdList = (data.businessPartnerList || []).map(
          (item) => item.businessPartnerId
        )
        data.businessPartnerNameList = (data.businessPartnerList || []).map(
          (item) => item.businessPartnerName
        )
        this.form = data
        this.buttonAuthMsg = data.buttonAuthMsg || {}

        this.queryCanSelectCustomerListHavePage()
        this.queryAddressByBusinessPartnerId()
        this.$nextTick(() => {
          this.$refs.actualCostAndSalesAmount && this.$refs.actualCostAndSalesAmount.init(data)
          const {
            actualCostNew,
            salesAmount,
            receivedAmount,
            profitLoss,
            profit,
            projectProgress
          } = data
          if (
            this.$resultOfBoolean(actualCostNew) ||
            this.$resultOfBoolean(salesAmount) ||
            this.$resultOfBoolean(receivedAmount) ||
            this.$resultOfBoolean(profitLoss) ||
            this.$resultOfBoolean(profit) ||
            this.$resultOfBoolean(projectProgress)
          ) {
            this.$refs.projectSummaryTable &&
              this.$refs.projectSummaryTable.init([
                { actualCostNew, salesAmount, receivedAmount, profitLoss, profit, projectProgress }
              ])
          } else {
            this.$refs.projectSummaryTable && this.$refs.projectSummaryTable.init([])
          }
        })
      })
    },

    /* 表单部分Start */
    businessPartnerIdListChange(ids, labels, s) {
      this.$set(this.form, 'businessPartnerIdList', ids)
      this.$set(this.form, 'businessPartnerNameList', labels)
      this.queryAddressByBusinessPartnerId()
      if (this.form.receiveAddressId) {
        this.deliveryAddressClear()
      }
    },
    openCustomerTable() {
      const ids = this.form.businessPartnerIdList || []
      const names = this.form.businessPartnerNameList || []
      const curList = []
      ids.forEach((id, index) => {
        curList.push({
          businessPartnerId: id,
          businessPartnerName: names[index]
        })
      })
      this.$refs.multipleSelectCustomerTable.handleOpen(curList)
    },

    updateCustomer(list) {
      this.$set(
        this.form,
        'businessPartnerIdList',
        list.map((item) => item.businessPartnerId)
      )
      this.$set(
        this.form,
        'businessPartnerNameList',
        list.map((item) => item.businessPartnerName)
      )

      this.queryAddressByBusinessPartnerId()
      if (this.form.receiveAddressId) {
        this.deliveryAddressClear()
      }
    },
    customerClear() {
      this.$set(this.form, 'businessPartnerList', [])
      this.$set(this.form, 'businessPartnerIdList', [])
      this.$set(this.form, 'businessPartnerNameList', [])
      if (this.form.receiveAddressId) {
        this.deliveryAddressClear()
      }
    },
    changeEmployeeNoSwitch(code) {
      this.$set(this.form, code, '')
      if (this.$refs.form1) {
        this.$nextTick(() => {
          this.$refs.form1.clearValidate(code)
        })
      }
    },
    reset() {
      this.form = {
        costProjectName: undefined,
        costProjectDescription: undefined,
        isAutoNo: '1',
        costProjectCode: undefined,
        businessPartnerNames: undefined,
        receiveAddressName: undefined,
        receiveAddressId: undefined,
        receiveAddress: undefined,
        district: undefined,
        businessPartnerIdList: []
      }
      this.collapseWarningForBasicInfo = false
      this.activeNames = ['1', '2', '3', '4']
      this.activeName = 'basicInfo'
      this.resetForm('form1')
    },
    // 取消按钮
    cancel(type) {
      if (this.nextPage) {
        this.nextPage = false
        this.$refs.actualCostAndSalesAmount && this.$refs.actualCostAndSalesAmount.cancel()
        this.$nextTick(() => {
          const {
            actualCostNew,
            salesAmount,
            receivedAmount,
            profitLoss,
            profit,
            projectProgress
          } = this.form

          if (
            this.$resultOfBoolean(actualCostNew) ||
            this.$resultOfBoolean(salesAmount) ||
            this.$resultOfBoolean(receivedAmount) ||
            this.$resultOfBoolean(profitLoss) ||
            this.$resultOfBoolean(profit) ||
            this.$resultOfBoolean(projectProgress)
          ) {
            this.$refs.projectSummaryTable &&
              this.$refs.projectSummaryTable.init([
                { actualCostNew, salesAmount, receivedAmount, profitLoss, profit, projectProgress }
              ])
          } else {
            this.$refs.projectSummaryTable && this.$refs.projectSummaryTable.init([])
          }
        })
        return
      }
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/projectManagement/project' })
    },
    submitForm(type) {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          let params = this.form
          params = this.$trimOfObj(JSON.parse(JSON.stringify(params)))
          this.$modal
            .confirm(this.$t('PRODUCT.projectSubmit'))
            .then(() => {
              this.submitLoading = true
              submitCostProject(params)
                .then((res) => {
                  this.$modal.msgSuccess(
                    this.$t('PRODUCT.projectSubmitSuccess').replace('$1', res.msg)
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
        }
      })
    },
    handleSaveDraft() {
      this.submitForm('save')
    },
    handleComplete() {
      this.$refs.selectProductTable.handleAdd()
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
