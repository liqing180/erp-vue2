<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="$t('PRODUCT.contactPerson')"
      :visible.sync="visible"
      width="1140px"
      :modal="true"
      :close-on-click-modal="false"
      @closed="closed"
    >
      <el-form
        :model="termForm"
        :rules="termFormRules"
        label-width="140px"
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
                ></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.email')}`" prop="email">
              <el-input
                v-model.trim="termForm.email"
                :title="termForm.email"
                maxlength="500"
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
                :maxlength="100"
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
                :label="(susList.find((x) => x.dictValue === termForm.sex) || {}).dictLabel || ''"
                idKey="dictValue"
                labelKey="dictLabel"
                :options="canSelectSusList || []"
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
              <el-input v-model="termForm.other" maxlength="50"></el-input>
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
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.extensionNumber')}`">
              <el-input v-model="termForm.extensionNumber" maxlength="50"></el-input>
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
              ></el-switch>
            </el-form-item>
          </el-col>
          <template v-if="!isStoreIssueChit">
            <el-col :span="8" v-if="businessPartnerType.indexOf('0') !== -1">
              <el-form-item :label="`${$t('ui.defaultSalesContact')}`">
                <el-switch
                  v-model="termForm.isSalesDefault"
                  :disabled="comDisFrom"
                  active-value="1"
                  inactive-value="0"
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
                ></el-switch>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <!-- <div style="text-align: center; margin-bottom: 10px"> -->
      <div slot="footer" class="dialog-footer">
        <template>
          <el-button size="small" @click="visible = false">{{ $t('uiBtn.back') }}</el-button>
          <el-button type="primary" v-if="!comDisFrom" size="small" @click="handleEditTerm">{{
            $t('uiBtn.save')
          }}</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryPositionList } from '@/api/businessPartner/businessPartner'

export default {
  dicts: ['business_contact_person_title'],
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
    const validatorPhoneNo = (rule, value, callback) => {
      if (!this.termForm.mobileCode || !this.termForm.mobileNum) {
        callback(this.$t('ui.reqMsg').replace('$1', this.$t('ui.mobilePhone')))
      } else {
        callback()
      }
    }
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
        addressIdList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
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
            required: true,
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
        ],
        mobilePhone: [{ required: true, validator: validatorPhoneNo, trigger: 'change' }]
      },
      visible: false,
      // 称呼
      cptList: [],
      // 性别
      susList: []
    }
  },
  methods: {
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
      const res = await this.getDicts('business_contact_person_title')
      this.cptList = res.data || []
      const res1 = await this.getDicts('sys_user_sex')
      this.susList = res1.data || []
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
