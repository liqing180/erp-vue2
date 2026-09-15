<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="$t('SALES.contactPerson')"
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
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.consignee')}`" prop="requestedBy">
            <div class="flexStart">
              <el-form-item class="fs-0" style="width: 84px">
                <el-select
                  v-model="termForm.title"
                  placeholder=""
                  style="width: 100%"
                  clearable
                  filterable
                  @change="titleChange"
                >
                  <el-option
                    v-for="dict in dict.type.business_contact_person_title"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-input
                v-model="termForm.requestedBy"
                maxlength="200"
                style="width: 100%"
              ></el-input>
            </div>

            <!-- <el-input v-model="termForm.requestedBy" maxlength="200" style="width: 100%"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.requestedEmail')}`">
            <el-input
              v-model.trim="termForm.requestedEmail"
              :title="termForm.requestedEmail"
              maxlength="500"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.requestedMobilePhone')}`"
            prop="requestedMobilePhone"
            ref="mobileNoRef"
          >
            <MobilePhoneInput
              :mobileCode.sync="termForm.requestedMobileCode"
              :mobileNum.sync="termForm.requestedMobileNum"
              :mobileNo.sync="termForm.requestedMobilePhone"
              @clearValidate="$refs.mobileNoRef.clearValidate()"
            />
          </el-form-item>
        </el-col>
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
      if (!this.termForm.requestedMobileCode || !this.termForm.requestedMobileNum) {
        callback(this.$t('ui.reqMsg').replace('$1', this.$t('ui.mobilePhone')))
      } else {
        callback()
      }
    }
    const validatorContactPersonName = (rule, value, callback) => {
      const { title, requestedBy } = vm.termForm
      if (!title || !requestedBy) {
        callback(vm.$t('ui.reqMsg').replace('$1', vm.$t('ui.requestedBy')))
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
        requestedBy: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          },
          { validator: validatorContactPersonName, trigger: ['change', 'blur'] }
        ],
        requestedEmail: [
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
        requestedMobilePhone: [{ required: false, validator: validatorPhoneNo, trigger: 'change' }]
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
      // const { title } = this.termForm
      // if (['Mr', 'Sir', 'Datuk'].indexOf(title) !== -1) {
      //   this.$set(this.termForm, 'sex', '0')
      // } else if (['Mrs', 'Ms', 'Mdm', 'Dame', 'Datin'].indexOf(title) !== -1) {
      //   this.$set(this.termForm, 'sex', '1')
      // }
      // if (this.termForm.requestedBy) {
      //   this.$refs.termForm.validateField('requestedBy')
      // }
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
        // addressIdList: [],
        // title: '',
        requestedBy: '',
        requestedMobilePhone: '',
        requestedMobileCode: '',
        requestedMobileNum: '',
        requestedEmail: ''
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
      if (dataRow && dataRow.requestedBy) {
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
          params.requestedBy = params.title + ' ' + params.requestedBy
          params.requestedId = +new Date() + ''
          this.$emit('update', params)
          vm.visible = false
        }
      })
    }
  }
}
</script>
