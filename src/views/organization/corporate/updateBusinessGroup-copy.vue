<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" :disabled="fullscreenLoading" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <div class="form-card">
          <el-collapse-item name="1">
            <template slot="title">
              <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
              <strong>{{ $t('ui.basicInfo') }}</strong>
            </template>
            <el-form
              ref="createForm"
              :model="createForm"
              :rules="createRules"
              label-width="195px"
              :disabled="comDisFrom"
            >
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :xl="8">
                  <el-form-item
                    :label="`${$t('organization.businessGroupNameName')}`"
                    prop="businessGroupName"
                  >
                    <MyInput
                      type="textarea"
                      v-model="createForm.businessGroupName"
                      :title="createForm.businessGroupName"
                      :autosize="{ minRows: 1, maxRows: 1 }"
                      resize="none"
                      show-word-limit
                      :maxlength="200"
                    ></MyInput>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :xl="8">
                  <el-form-item :label="`${$t('organization.pic')}`" prop="picUserName">
                    <SelectInput
                      :disabled="comDisFrom"
                      :value="createForm.picUserName"
                      :title="createForm.picUserName"
                      @clear="picUserNameClear"
                      clearable
                      @click="openPicTable"
                      class="form-wd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :xl="8">
                  <el-form-item :label="`${$t('organization.mobilePhone')}`" prop="mobilePhone">
                    <el-input v-model="createForm.mobilePhone" disabled class="form-wd" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :xl="8">
                  <el-form-item :label="`${$t('organization.currency')}`" prop="currency">
                    <country-currency-select
                      v-model="createForm.currency"
                      class="form-wd"
                      :props="propVal"
                      :is-currency="true"
                      :disabled="currencyId"
                      :cur-path="curPath"
                      @select="handleCurrencyChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :xl="8">
                  <el-form-item
                    :label="`${$t('organization.businessGroupNo')}`"
                    prop="businessGroupNo"
                  >
                    <el-input v-model="createForm.businessGroupNo" disabled class="form-wd" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="`${$t('ui.remarks')}`" prop="remarks">
                    <MyInput
                      type="textarea"
                      v-model="createForm.remarks"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                      style="width: 100%"
                    ></MyInput>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :xl="8">
                  <el-form-item :label="`${$t('ui.createdBy')}`">
                    <el-input :value="createForm.createdBy" disabled class="form-wd"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :xl="8">
                  <el-form-item :label="`${$t('ui.createdTime')}`">
                    <el-date-picker
                      :value="createForm.createdTime"
                      :editable="false"
                      disabled
                      type="date"
                      :format="fmtForYmdhms"
                      :style="{ width: '100%' }"
                      placeholder
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :xl="8">
                  <el-form-item :label="`${$t('ui.modifiedBy')}`">
                    <el-input :value="createForm.modifiedBy" disabled class="form-wd"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :xl="8">
                  <el-form-item :label="`${$t('ui.modifiedTime')}`">
                    <el-date-picker
                      :value="createForm.modifiedTime"
                      :editable="false"
                      disabled
                      type="date"
                      :format="fmtForYmdhms"
                      :style="{ width: '100%' }"
                      placeholder
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
    <selectPicTable ref="selectPicTable" @updatePic="updatePic" />
  </FormPageLayout>
</template>

<script>
import locale from '@/views/organization/lang/index'
import { queryBusinessGroupById, updateBusinessGroup } from '@/api/organization/corporate'
import countryCurrencySelect from '@/components/select/countryCurrencySelect.vue'
import selectPicTable from '@/views/organization/corporate/selectPicTable.vue'

export default {
  components: {
    countryCurrencySelect,
    selectPicTable
  },
  mixins: [],
  data() {
    const vm = this
    return {
      fullscreenLoading: false,
      // 一定要放在当前文件
      curPath: this.$options.__file,
      timeId: '',
      activeNames: ['1'],
      propVal: 'currencyCode',
      createForm: {},
      createRules: {
        businessGroupName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
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
      currencyId: undefined
    }
  },

  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['organization:corporate:edit'])
    },
    comDisFrom() {
      return !this.editAuth
    }
  },

  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },

  created() {
    const vm = this
    vm.queryBusinessGroupById(vm.$route.query.id || '')
  },

  methods: {
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
    handleCurrencyChange(row) {
      this.$nextTick(() => {
        this.$set(this.createForm, 'currencyId', row.id || '')
        this.$set(this.createForm, 'currency', row.currency)
        this.$set(this.createForm, 'currencyCode', row.currencyCode)
      })
    },

    queryBusinessGroupById(id) {
      const vm = this
      queryBusinessGroupById(id).then((res) => {
        this.createForm = res.data
        if (res.data && res.data.currencyId) {
          vm.currencyId = res.data.currencyId
        }
        // vm.$set(vm.createForm, 'businessGroupName', result.businessGroupName)
        // vm.$set(vm.createForm, 'businessGroupNo', result.businessGroupNo)
        // vm.$set(vm.createForm, 'createdTime', result.createdTime)
        // vm.$set(vm.createForm, 'creator', result.creator)
        // vm.$set(vm.createForm, 'createdBy', result.createdBy)
        // vm.$set(vm.createForm, 'currency', result.currency)
        // vm.$set(vm.createForm, 'currencyId', result.currencyId)
        // vm.$set(vm.createForm, 'id', result.id)
        // vm.$set(vm.createForm, 'modifiedBy', result.modifiedBy)
        // vm.$set(vm.createForm, 'modifiedTime', result.modifiedTime)
        // vm.$set(vm.createForm, 'remarks', result.remarks)

        // vm.$set(vm.createForm, 'picUserName', result.picUserName)
        // vm.$set(vm.createForm, 'picUserId', result.picUserId)
        // vm.$set(vm.createForm, 'mobilePhone', result.mobilePhone)
        // vm.$set(vm.createForm, 'mobileCode', result.mobileCode)
        // vm.$set(vm.createForm, 'mobileNum', result.mobileNum)
      })
    },

    updateBusinessGroup(param) {
      const vm = this
      vm.fullscreenLoading = true
      updateBusinessGroup(param)
        .then((res) => {
          vm.$message.success(
            `${vm
              .$t('organization.businessGroupSaveSuccess')
              .replace('$1', `${param.businessGroupNo}`)}`
          )
          this.cancel()
          vm.fullscreenLoading = false
        })
        .catch((err) => {
          vm.fullscreenLoading = false
          window.console.error(err)
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
        if (valid) {
          this.$modal.confirm(vm.$t('organization.businessGroupSaveConfirm')).then(() => {
            let param = JSON.parse(JSON.stringify(vm.createForm))
            // let param = {}
            // param.businessGroupName = vm.createForm.businessGroupName
            // param.businessGroupNo = vm.createForm.businessGroupNo
            // param.createdTime = vm.createForm.createdTime
            // param.creator = vm.loginInfo.userId
            // param.createdBy = vm.createForm.createdBy
            // param.currency = vm.createForm.currency
            // param.currencyId = vm.createForm.currencyId
            // param.id = vm.createForm.id
            // param.modifiedBy = vm.createForm.modifiedBy
            // param.modifiedTime = vm.createForm.modifiedTime
            // param.remarks = vm.createForm.remarks
            // param.picUserName = vm.createForm.picUserName
            // param.picUserId = vm.createForm.picUserId
            // param.mobilePhone = vm.createForm.mobilePhone
            // param.mobileCode = vm.createForm.mobileCode
            // param.mobileNum = vm.createForm.mobileNum
            param = vm.$trimOfObj(param)
            vm.updateBusinessGroup(param)
          })
        }
      })
    }
  }
}
</script>
