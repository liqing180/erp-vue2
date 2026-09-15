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
                    <el-form-item
                      :label="`${$t('SALES.salesOrganization')}`"
                      prop="salesOrganizationIdList"
                    >
                      <!-- <CommonSelect
                        :id="form.departmentId"
                        :label="form.departmentName"
                        :title="form.allSuperiorName"
                        idKey="departmentId"
                        labelKey="departmentName"
                        :options="deptOptions"
                        @change="departmentChange"
                      /> -->
                      <CommonMultipleSelect
                        :ids="form.salesOrganizationIdList"
                        :labels="form.salesOrganizationNameList"
                        :showTitle="false"
                        idKey="id"
                        labelKey="name"
                        :options="deptOptions"
                        @change="departmentChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(dict.type.sales_price_status, form.salesPriceStatus)
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.rrpCode')}`">
                      <el-input v-model="form.salesPriceNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.createdBy')}`">
                      <el-input v-model="form.createdBy" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.createdTime')}`">
                      <el-date-picker
                        :value="form.createdTime"
                        disabled
                        type="date"
                        :format="fmtForYmdhms"
                        :style="{ width: '100%' }"
                        placeholder
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.reason')">
                      <MyInput
                        type="textarea"
                        v-model="form.reason"
                        :autosize="{ minRows: 1, maxRows: 4 }"
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

          <div class="form-card mt10 collapse-item-content-pt0" ref="collapseScrollPage">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  @scrollPageToTable="scrollPageToTable"
                />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
  </FormPageLayout>
</template>

<script>
// import { queryUserDepartment } from '@/api/system/user'
import { queryTaxCodeByCountryId } from '@/api/system/tax'
import {
  saveSalesPrice,
  saveDraftSalesPrice,
  getBranchCompanyList
} from '@/api/salesManagement/salesPrice'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import ProductInfo from './productInfo/productInfo.vue'
import { formDirtyClass } from '@/mixins/formDirtyClass'

export default {
  mixins: [pageMixin],
  dicts: ['sales_quotation_type', 'sales_price_status', 'business_partner_payment_method'],
  components: {
    ProductInfo
  },
  data() {
    return {
      activeNames: [],
      timeId: '',
      submitLoading: false,
      form: {},
      deptOptions: [],
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        departmentId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        salesOrganizationIdList: [
          {
            required: true,
            type: 'array',
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
      }
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
      this.queryUserDepartment()
    },
    reset() {
      this.form = {
        salesOrganizationId: undefined,
        salesOrganizationName: undefined,
        allSuperiorName: undefined,
        rrpCode: undefined,
        createdBy: this.$store.state.user.nickName,
        reason: undefined,
        salesPriceProductList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('form1')
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
    queryTaxCodeByCountryId() {
      if (this.form.countryId) {
        queryTaxCodeByCountryId(this.form.countryId).then((res) => {
          console.log(res)
          const data = res.data || {}
          this.$set(this.form, 'taxRate', data.taxRate)
        })
      } else {
        this.$set(this.form, 'taxRate', undefined)
      }
    },

    queryUserDepartment() {
      getBranchCompanyList({}).then((res) => {
        this.deptOptions = res.data || []
        this.deptOptions.forEach((item) => {
          if (item.isSelect === '1') {
            this.$set(this.form, 'salesOrganizationIdList', [item.id])
            this.$set(this.form, 'salesOrganizationNameList', [item.name])
            // this.$set(this.form, 'departmentIdList', [item.id])
            // this.$set(this.form, 'departmentNameList', [item.name])
            // this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
          }
        })

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
      })
    },
    getFormJson() {
      const param = { ...this.form }
      return JSON.stringify(param)
    },
    // departmentChange(item) {
    //   this.$set(this.form, 'salesOrganizationId', item.departmentId)
    //   this.$set(this.form, 'salesOrganizationName', item.departmentName)
    //   this.$set(this.form, 'departmentId', item.departmentId)
    //   this.$set(this.form, 'departmentName', item.departmentName)
    //   this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
    // },
    departmentChange(ids, labels) {
      // this.$set(this.form, 'departmentIdList', ids)
      // this.$set(this.form, 'departmentNameList', labels)
      this.$set(this.form, 'salesOrganizationIdList', ids)
      this.$set(this.form, 'salesOrganizationNameList', labels)
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
    async submitForm(submitType, isConfirm = true, gotoRoute) {
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
        const tableList = this.$refs.ProductInfo.tableList || []
        const validProject = this.validConsignmentList(tableList)
        if (!validProject) {
          this.collapseWarningForProductInfo = true
          return
        }
        this.collapseWarningForProductInfo = false
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.salesPriceProductList = tableList
        // param.departmentId = param.departmentIdList.join(',')
        param.salesOrganizationId = param.salesOrganizationIdList.join(',')
        param.salesOrganizationName = param.salesOrganizationNameList.join(',')
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('SALES.RRPSaveConfirm')
          successMsg = this.$t('SALES.RRPSaveSuccess')
          submitFn = saveDraftSalesPrice
        } else {
          confirmMsg = this.$t('SALES.RRPSubmitConfirm')
          successMsg = this.$t('SALES.RRPSubmitSuccess')
          submitFn = saveSalesPrice
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
    validConsignmentList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const pricingUom = detailList.findIndex((item) => {
        return !this.$resultOfBoolean(item.pricingUom)
      })
      if (pricingUom !== -1) {
        this.$refs.ProductInfo.navPageForIndex(pricingUom)
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.pricingUnit')))
        return valid
      }
      const salesPrice = detailList.findIndex((item) => {
        return !this.$resultOfBoolean(item.salesRetailPrice)
      })
      if (salesPrice !== -1) {
        this.$refs.ProductInfo.errorMessage('salesRetailPrice')

        this.$refs.ProductInfo.navPageForIndex(salesPrice)
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesPrice')))
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
