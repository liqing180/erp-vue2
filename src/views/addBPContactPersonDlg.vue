<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="$t('PURCHASE.contactPerson')"
      :visible.sync="visible"
      width="1200px"
      :modal="true"
      :close-on-click-modal="false"
      @closed="closed"
    >
      <el-form
        :model="termForm"
        :rules="termFormRules"
        label-width="200px"
        :disabled="comDisFrom"
        ref="termForm"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.contactPersonName')}`" prop="contactPersonName">
              <div class="flexStart">
                <el-form-item class="fs-0" style="width: 84px">
                  <el-select
                    v-model="termForm.title"
                    :disabled="comDisFrom"
                    placeholder=""
                    style="width: 100%"
                    clearable
                    filterable
                    @change="titleChange"
                    size="mini"
                  >
                    <el-option
                      v-for="dict in canSelectCptList"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-input
                  v-model="termForm.contactPersonName"
                  maxlength="200"
                  style="width: 100%"
                  size="mini"
                ></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.email')}`" prop="email">
              <el-input
                v-model.trim="termForm.email"
                :title="termForm.email"
                maxlength="200"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.position')}`">
              <el-autocomplete
                style="width: 100%"
                v-model="termForm.position"
                :fetch-suggestions="queryPositionSugg"
                placeholder
                clearable
                :maxlength="200"
                size="mini"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.sex')}`" prop="sex">
              <CommonSelect
                :disabled="comDisFrom"
                :id="termForm.sex"
                :label="
                  language !== 'en'
                    ? (susList.find((x) => x.dictValue === termForm.sex) || {}).dictLabelZh
                    : (susList.find((x) => x.dictValue === termForm.sex) || {}).dictLabel
                "
                idKey="dictValue"
                :labelKey="language !== 'en' ? 'dictLabelZh' : 'dictLabel'"
                :options="canSelectSusList || []"
                size="mini"
                @change="
                  ($event) => {
                    $set(termForm, 'sex', $event.dictValue)
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.mobilePhone')}`" prop="mobilePhone" ref="mobileNoRef">
              <MobilePhoneInput
                :mobileCode.sync="termForm.mobileCode"
                :mobileNum.sync="termForm.mobileNum"
                :mobileNo.sync="termForm.mobilePhone"
                :disabled="comDisFrom"
                @clearValidate="$refs.mobileNoRef.clearValidate()"
                class="mobile_phone"
                size="mini"
                :legalEntityId="legalEntity.id"
                :isToken="false"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item :label="`${$t('ui.weChat')}`">
              <el-input v-model="termForm.weChat" maxlength="50"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.other')}`">
              <el-input v-model="termForm.other" maxlength="50" size="mini"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.landline')}`">
              <MobilePhoneInput
                :mobileCode.sync="termForm.landlineCode"
                :mobileNum.sync="termForm.landlineNum"
                :mobileNo.sync="termForm.landline"
                :disabled="comDisFrom"
                size="mini"
                class="mobile_phone"
                :isToken="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.extensionNumber')}`">
              <el-input v-model="termForm.extensionNumber" maxlength="50" size="mini"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('ui.remarks')">
              <MyInput
                type="textarea"
                v-model="termForm.remarks"
                :autosize="{ minRows: 2, maxRows: 4 }"
                resize="none"
                show-word-limit
                :maxlength="3000"
                size="mini"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="8">
            <el-form-item :label="`${$t('ui.isDefault')}`">
              <el-switch
                v-model="termForm.isDefault"
                :disabled="true"
                active-value="1"
                inactive-value="0"
                @change="handleIsDefault"
              ></el-switch>
            </el-form-item>
          </el-col> -->
          <el-col :span="8" v-if="businessPartnerType.indexOf('1') !== -1">
            <el-form-item :label="`${$t('ui.defaultPurchasingContact')}`">
              <el-switch
                v-model="termForm.isPurchaseDefault"
                :disabled="comDisFrom"
                active-value="1"
                inactive-value="0"
                size="mini"
                @change="isPurchaseDefaultChange"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="businessPartnerType.indexOf('0') !== -1">
            <el-form-item :label="`${$t('ui.defaultSalesContact')}`">
              <el-switch
                v-model="termForm.isSalesDefault"
                :disabled="comDisFrom"
                active-value="1"
                inactive-value="0"
                size="mini"
                @change="isSalesDefaultChange"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.isActive')}`">
              <el-switch
                :disabled="
                  comDisFrom ||
                  termForm.isPurchaseDefault === '1' ||
                  termForm.isSalesDefault === '1'
                    ? true
                    : false
                "
                v-model="termForm.isActive"
                active-value="1"
                inactive-value="0"
                size="mini"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <div style="text-align: center; margin-bottom: 10px"> -->
      <div slot="footer" class="dialog-footer">
        <template>
          <el-button size="small" @click="visible = false">{{ $t('uiBtn.back') }}</el-button>
          <el-button type="primary" size="small" @click="handleEditTerm">{{
            $t('uiBtn.save')
          }}</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { queryPositionList } from '@/api/businessPartner/businessPartner'
import { externalCommonType, queryPositionList } from '@/api/login'
export default {
  dicts: [],
  props: {
    comDisFrom: {
      type: [Boolean],
      default: false
    },
    businessPartnerType: {
      type: String,
      default: ''
    },
    isStoreIssueChit: {
      type: [Boolean],
      default: false
    },
    legalEntity: {
      type: [Object],
      default() {
        return {}
      }
    },
    language: {
      type: [String],
      default: ''
    }
  },
  computed: {
    canSelectCptList() {
      const { sex } = this.termForm
      let list = this.cptList
      if (!isNaN(sex)) {
        if (sex === '0') {
          list = list.filter((x) => ['Mr', 'Sir', 'Datuk', 'Dr', 'Hon'].indexOf(x.dictValue) !== -1)
        } else if (sex === '1') {
          list = list.filter(
            (x) => ['Mrs', 'Ms', 'Mdm', 'Dame', 'Datin', 'Dr', 'Hon'].indexOf(x.dictValue) !== -1
          )
        }
      }
      return list
    },
    canSelectSusList() {
      const { title } = this.termForm
      let list = this.susList
      if (title) {
        if (['Mr', 'Sir', 'Datuk'].indexOf(title) !== -1) {
          list = list.filter((x) => x.dictValue === '0')
        } else if (['Mrs', 'Ms', 'Mdm', 'Dame', 'Datin'].indexOf(title) !== -1) {
          list = list.filter((x) => x.dictValue === '1')
        }
      }
      return list
    }
  },
  data() {
    const vm = this
    // const validatorPhoneNo = (rule, value, callback) => {
    //   if (!this.termForm.mobileCode || !this.termForm.mobileNum) {
    //     callback(this.$t('ui.reqMsg').replace('$1', this.$t('ui.mobilePhone')))
    //   } else {
    //     callback()
    //   }
    // }
    const validatorContactPersonName = (rule, value, callback) => {
      const { title, contactPersonName } = vm.termForm
      if (!title || !contactPersonName) {
        callback(vm.$t('ui.reqMsg').replace('$1', vm.$t('ui.contactPersonName')))
      } else {
        callback()
      }
    }
    return {
      /* 表格表单部分 */
      termForm: {},
      termFormRules: {
        contactPersonName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          },
          { validator: validatorContactPersonName, trigger: ['change', 'blur'] }
        ],
        email: [
          {
            required: false,
            trigger: ['blur', 'change'],
            message: this.$t('ui.reqMsg')
          },
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ],
        sex: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ]
      },
      visible: false,
      // 称呼
      cptList: [],
      // 性别
      susList: []
    }
  },
  methods: {
    isPurchaseDefaultChange() {
      if (this.termForm.isPurchaseDefault === '1') {
        this.$set(this.termForm, 'isActive', '1')
      }
    },
    isSalesDefaultChange() {
      if (this.termForm.isSalesDefault === '1') {
        this.$set(this.termForm, 'isActive', '1')
      }
    },
    titleChange() {
      const { title } = this.termForm
      if (['Mr', 'Sir', 'Datuk'].indexOf(title) !== -1) {
        this.$set(this.termForm, 'sex', '0')
      } else if (['Mrs', 'Ms', 'Mdm', 'Dame', 'Datin'].indexOf(title) !== -1) {
        this.$set(this.termForm, 'sex', '1')
      }
      if (this.termForm.contactPersonName) {
        this.$refs.termForm.validateField('contactPersonName')
      }
    },
    async getDictList() {
      const res = await externalCommonType('business_contact_person_title')
      console.log(res, '=================322')
      this.cptList = res.data || []
      // const res1 = await externalCommonType('sys_user_sex')
      // console.log(res1, '=================325')
      // const res1 = await this.getDicts('sys_user_sex')
      this.susList = [
        {
          dictValue: '0',
          dictLabel: 'Male',
          dictLabelZh: '男'
        },
        {
          dictValue: '1',
          dictLabel: 'Female',
          dictLabelZh: '女'
        }
      ]
    },
    reset() {
      this.handleResetTerm()
    },
    /* 表格表单部分 */
    handleCountrySelect(row) {
      if (row) {
        const { id, name } = row
        this.$set(this.termForm, 'country', name)
        this.$set(this.termForm, 'countryId', id)
      }
    },
    handleResetTerm() {
      this.isTermEdit = false
      this.editIndex = undefined
      this.termForm = {
        addressIdList: [],
        title: '',
        contactPersonName: '',
        mobilePhone: '',
        mobileCode: '',
        mobileNum: '',
        email: '',
        isDefault: '0',
        isActive: '1'
      }
      this.$nextTick(() => {
        this.$refs.termForm && this.$refs.termForm.clearValidate()
      })
    },
    closed() {
      this.handleResetTerm()
    },
    handleEdit(dataRow) {
      this.initRules()
      this.getDictList()
      this.queryPositionList()
      this.handleResetTerm()
      const vm = this
      if (dataRow && dataRow.contactPersonName) {
        const params = JSON.parse(JSON.stringify(dataRow))
        vm.termForm = {
          ...params
        }
      }
      this.visible = true
    },

    initRules() {
      this.termFormRules = {
        contactPersonName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          },
          { validator: this.validatorContactPersonName, trigger: ['change', 'blur'] }
        ],
        email: [
          {
            required: false,
            trigger: ['blur', 'change'],
            message: this.$t('ui.reqMsg')
          },
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ],
        sex: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ]
      }
    },

    handleIsDefault(value) {
      if (value === '1') {
        this.$set(this.termForm, 'isActive', '1')
      }
    },
    queryPositionSugg(queryString, cb) {
      const vm = this
      const positionList = vm.positionList

      let results
      if (queryString) {
        results = positionList.filter(
          (umo) => umo.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      } else {
        results = positionList
      }
      cb(results)
    },
    queryPositionList() {
      queryPositionList().then((res) => {
        const list = res.data || []
        this.positionList = list.map((position) => {
          return { value: position }
        })
      })
    },

    handleEditTerm() {
      const vm = this
      vm.$refs.termForm.validate((valid) => {
        if (valid) {
          const params = this.$trimOfObj(JSON.parse(JSON.stringify(vm.termForm)))
          this.$emit('update', params)
          vm.visible = false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.mobile_phone {
  vertical-align: middle;
}
</style>
