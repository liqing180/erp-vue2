<template>
  <FormPageLayout v-loading="submitLoading">
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
            <el-form ref="createForm" :model="createForm" :rules="createRules" label-width="195px">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('organization.branchCompany')}`"
                    prop="branchCompanyName"
                  >
                    <el-input
                      v-model="createForm.branchCompanyName"
                      :title="createForm.branchCompanyName"
                      class="form-wd"
                      maxlength="200"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('organization.email')}`" prop="email">
                    <el-input
                      v-model.trim="createForm.email"
                      :title="createForm.email"
                      class="form-wd"
                      :maxlength="350"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('organization.legalEntity')}`">
                    <el-input
                      v-model="createForm.legalEntity"
                      :title="createForm.legalEntity"
                      disabled
                      class="form-wd"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('organization.country')}`" prop="country">
                    <country-select
                      v-model="createForm.country"
                      class="form-wd"
                      @select="handleCountrySelect"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('organization.landlineNumber')}`"
                    ref="landlineNumberRef"
                  >
                    <MobilePhoneInput
                      :mobileCode.sync="createForm.landlineCode"
                      :mobileNum.sync="createForm.landlineNumber"
                      :mobileNo.sync="createForm.landlinePhone"
                      @clearValidate="$refs.landlineNumberRef.clearValidate()"
                      :clearableCode="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('organization.fax')}`" prop="fax" ref="faxRef">
                    <MobilePhoneInput
                      :mobileCode.sync="createForm.faxCode"
                      :mobileNum.sync="createForm.fax"
                      :mobileNo.sync="createForm.faxPhone"
                      @clearValidate="$refs.faxRef.clearValidate()"
                      :clearableCode="true"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('organization.currency')}`" prop="currency">
                    <CommonSelectAndList
                      :id="createForm.currencyId"
                      :label="createForm.currency"
                      :title="createForm.currency"
                      idKey="id"
                      labelKey="currency"
                      filterable
                      :options="currencyOptions"
                      :loading="currencyOptionsLoading"
                      @change="handleCurrencyChange"
                      @handleOpen="
                        () => {
                          $refs.currencySelectRef.handleClick()
                        }
                      "
                    />
                    <country-currency-select
                      :showInput="false"
                      ref="currencySelectRef"
                      v-model="createForm.currency"
                      class="form-wd"
                      :props="propVal"
                      :is-currency="true"
                      :cur-path="curPath"
                      @select="handleCurrencyChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('organization.website')}`" prop="website">
                    <el-input v-model="createForm.website" :maxlength="100" class="form-wd" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('organization.pic')}`" prop="picUserName">
                    <div class="flexStart">
                      <el-select
                        v-model="createForm.title"
                        placeholder=""
                        style="width: 84px"
                        class="fs-0"
                        clearable
                        filterable
                      >
                        <el-option
                          v-for="dict in dict.type.business_contact_person_title"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        ></el-option>
                      </el-select>
                      <SelectInput
                        :value="createForm.picUserName"
                        :title="createForm.picUserName"
                        @clear="picUserNameClear"
                        clearable
                        @click="openPicTable"
                        class="form-wd"
                        style="width: 100%"
                      />
                    </div>
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
              :title="$t('organization.titleAddress')"
              :warning="collapseWarningForTitleAddress"
            >
            </FormCollapseItemTitle>
            <div>
              <el-form
                ref="addressForm"
                :model="addressForm"
                :rules="addressRules"
                label-width="195px"
              >
                <el-row class="mt22">
                  <el-col :span="24">
                    <el-form-item :label="`${$t('organization.address1')}`" prop="address1">
                      <el-input v-model="addressForm.address1" :maxlength="500" class="form-wd" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('organization.address2')}`" prop="address2">
                      <el-input v-model="addressForm.address2" :maxlength="500" class="form-wd" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.province')}`" prop="province">
                      <el-input v-model="addressForm.province" :maxlength="200" class="form-wd" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.city')}`" prop="city">
                      <el-input v-model="addressForm.city" :maxlength="200" class="form-wd" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.location')}`" prop="location">
                      <el-input v-model="addressForm.location" :maxlength="200" class="form-wd" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.postalCode')}`" prop="postalCode">
                      <el-input
                        v-model="addressForm.postalCode"
                        :maxlength="20"
                        placeholder=""
                        class="form-wd"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.country')}`" prop="country">
                      <country-select
                        v-model="addressForm.country"
                        class="form-wd"
                        @select="handleCountrySelect2"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.remarks')}`" prop="remarks">
                      <MyInput
                        type="textarea"
                        v-model="addressForm.remarks"
                        :autosize="{ minRows: 2, maxRows: 4 }"
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
    </template>
    <selectPicTable ref="selectPicTable" @updatePic="updatePic" />
  </FormPageLayout>
</template>

<script>
import locale from '@/views/organization/lang/index'

import { saveBranchCompany, queryLegalEntityById } from '@/api/organization/corporate'
import countryCurrencySelect from '@/components/select/countryCurrencySelect.vue'
import countrySelect from '@/components/select/countrySelect'
import selectPicTable from '@/views/organization/corporate/selectPicTable.vue'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
function isWebsite(param) {
  const strRegex =
    // eslint-disable-next-line no-useless-escape
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
  const re = new RegExp(strRegex)
  return re.test(param)
}
export default {
  name: 'AddBranchCompany',
  dicts: ['business_contact_person_title'],
  components: {
    countryCurrencySelect,
    selectPicTable,
    countrySelect
  },
  data() {
    const vm = this
    const validWebsite = (rule, value, callback) => {
      if (value && !isWebsite(value)) {
        callback(new Error(vm.$t('organization.validWebsite')))
      } else {
        callback()
      }
    }

    return {
      submitLoading: false,
      // 一定要放在当前文件
      curPath: this.$options.__file,

      propVal: 'currencyCode',

      createForm: {
        createdBy: this.$store.state.user.nickName
      },
      createRules: {
        branchCompanyName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        country: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        phoneNo1: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],

        companyRegNo: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],

        website: [
          {
            validator: validWebsite,
            trigger: ['blur', 'change']
          }
        ],

        email: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          },
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ],

        currency: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ]
      },
      currencyOptions: [],
      currencyOptionsLoading: false,
      addressForm: {},
      addressRules: {
        address1: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],

        province: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],

        city: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],

        country: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ]
      },
      activeNames: ['1', '2'],
      isInit: true,
      timeId: '',
      collapseWarningForBasicInfo: false,
      collapseWarningForTitleAddress: false
    }
  },

  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },

  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    const vm = this
    vm.$set(vm.createForm, 'creatorName', this.$store.state.user.nickName)
    const query = vm.$route.query
    this.timeId = this.$route.query.timeId
    vm.createForm = Object.assign(vm.createForm, query)
    this.handleAdd()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.reset()
      const query = this.$route.query
      this.createForm = Object.assign(this.createForm, query)
      this.handleAdd()
    }
  },
  methods: {
    handleAdd() {
      this.queryCurrencyListBySelect()
      queryLegalEntityById(this.createForm.legalEntityId).then((res) => {
        // vm.submitLoading = false
        const data = res.data || {}
        const legalEntityAddress = data.legalEntityAddress || {}
        this.$set(this.createForm, 'legalEntity', data.legalEntityName)
        this.$set(this.addressForm, 'country', legalEntityAddress.country)
        this.$set(this.addressForm, 'countryId', legalEntityAddress.countryId)
        this.$set(this.createForm, 'currency', data.currency)
      })
    },
    changeInputNum(num) {
      // const reg = /^[0-9]*$/g
      num = num.replace(/[^\d]/g, '').replace(/\s/g, '')
      return num
    },
    // 清空pic
    picUserNameClear() {
      this.$set(this.createForm, 'picUserName', undefined)
      this.$set(this.createForm, 'picUserId', undefined)
      this.$set(this.createForm, 'mobilePhone', undefined)
      this.$set(this.createForm, 'mobileCode', undefined)
      this.$set(this.createForm, 'mobileNum', undefined)
    },
    // 打开pic弹窗
    openPicTable() {
      this.$refs.selectPicTable.handleOpen()
    },
    updatePic(row) {
      const { nickName, userId, mobilePhone, mobileCode, mobileNum } = row
      this.$set(this.createForm, 'picUserName', nickName)
      this.$set(this.createForm, 'picUserId', userId)
      this.$set(this.createForm, 'mobilePhone', mobilePhone)
      this.$set(this.createForm, 'mobileCode', mobileCode)
      this.$set(this.createForm, 'mobileNum', mobileNum)
    },
    reset() {
      this.createForm = {
        branchCompanyName: '',
        picUserName: '',
        picUserId: '',
        mobilePhone: '',
        mobileCode: '',
        mobileNum: '',
        email: '',
        website: '',
        fax: '',
        createdBy: this.$store.state.user.nickName
      }
      this.addressForm = {
        address1: '',
        address2: '',
        province: '',
        location: '',
        postalCode: '',
        city: '',
        country: undefined,
        countryId: undefined,
        remarks: ''
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForTitleAddress = false

      this.activeNames = ['1', '2']
      this.resetForm('createForm')
      this.resetForm('addressForm')
    },
    handleCountrySelect(row) {
      if (row) {
        const { id, name, en } = row
        this.$set(this.createForm, 'country', name)
        this.$set(this.createForm, 'countryId', id)
        this.$set(this.createForm, 'countryEn', en)
        this.handleCountrySelect2(row)
        if (row.mobileCode) {
          this.$set(this.createForm, 'landlineCode', row.mobileCode)
          this.$set(this.createForm, 'faxCode', row.mobileCode)
        } else {
          this.$set(this.createForm, 'landlineCode', undefined)
          this.$set(this.createForm, 'faxCode', undefined)
        }
      }
    },
    handleCountrySelect2(row) {
      if (row) {
        const { id, name, en } = row
        this.$set(this.addressForm, 'country', name)
        this.$set(this.addressForm, 'countryId', id)
        this.$set(this.addressForm, 'countryEn', en)
      }
    },

    queryCurrencyListBySelect() {
      this.currencyOptionsLoading = true
      queryCurrencyListBySelect()
        .then((res) => {
          this.currencyOptionsLoading = false
          const list = res.data || []
          this.currencyOptions = list.map((item) => {
            item.label = `${item.currencyCode} (${item.currencyDesc})`
            return item
          })
        })
        .catch(() => {
          this.currencyOptionsLoading = false
        })
    },
    handleCurrencyChange(row) {
      this.$nextTick(() => {
        this.$set(this.createForm, 'currencyId', row.id || '')
        this.$set(this.createForm, 'currency', row.currency)
        this.$set(this.createForm, 'currencyCode', row.currencyCode)
      })
    },

    saveBranchCompany(param) {
      const vm = this
      vm.submitLoading = true
      saveBranchCompany(param)
        .then((res) => {
          vm.$message.success(
            `${vm.$t('organization.branchCompanySuccess').replace('$1', param.branchCompanyName)}`
          )
          this.cancel()
          vm.submitLoading = false
        })
        .catch(() => {
          vm.submitLoading = false
        })
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/organization/corporate' })
    },
    submitForm() {
      const vm = this
      this.$refs.createForm.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (valid) {
          let createValid = false
          vm.$refs.addressForm.validate((addressFormValid) => {
            this.collapseWarningForTitleAddress = !addressFormValid
            createValid = addressFormValid
          })
          if (!createValid) {
            this.$modal.msgError(
              this.$t('ui.fromIncomplete').replace('$1', this.$t('organization.titleAddress'))
            )
            return
          }
          this.$modal.confirm(vm.$t('organization.branchCompanyConfirm')).then(() => {
            const param = JSON.parse(JSON.stringify(vm.createForm))
            param.branchCompanyAddress = JSON.parse(JSON.stringify(vm.addressForm))
            if (!param.landlineNumber) {
              param.landlineCode = ''
              param.landlinePhone = ''
            }
            if (!param.fax) {
              param.faxCode = ''
              param.faxPhone = ''
            }
            vm.saveBranchCompany(param)
          })
        } else {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
      })
    }
  }
}
</script>
