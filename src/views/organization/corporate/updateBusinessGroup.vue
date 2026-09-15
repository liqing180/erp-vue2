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
            <el-form
              ref="createForm"
              :model="createForm"
              :rules="createRules"
              label-width="195px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('organization.businessGroupNameName')}`"
                    prop="businessGroupName"
                  >
                    <el-input
                      v-model="createForm.businessGroupName"
                      :title="createForm.businessGroupName"
                      :maxlength="200"
                      class="form-wd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('organization.pic')}`" prop="picUserName">
                    <SelectInput
                      :value="createForm.picUserName"
                      :title="createForm.picUserName"
                      @clear="picUserNameClear"
                      clearable
                      @click="openPicTable"
                      :disabled="comDisFrom"
                      class="form-wd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('organization.landlineNumber')}`"
                    prop="landlineNumber"
                  >
                    <el-input v-model="createForm.landlineNumber" :maxlength="50" class="form-wd" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('organization.email')}`" prop="email">
                    <el-input
                      v-model.trim="createForm.email"
                      :title="createForm.email"
                      class="form-wd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
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
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('ui.remarks')}`" prop="remarks">
                    <MyInput
                      type="textarea"
                      v-model="createForm.remarks"
                      :autosize="{ minRows: 2, maxRows: 4 }"
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
            <FormCollapseItemTitle slot="title" :title="$t('ui.systemOperationLog')">
              <template v-if="createForm.operationLogForLast">
                <span
                  v-if="createForm.operationLogForLast.operatorBy"
                  class="info-item mr20"
                  :title="createForm.operationLogForLast.operatorBy"
                >
                  {{ $t('ui.operName') }} : {{ createForm.operationLogForLast.operatorBy }}
                </span>
                <span v-if="createForm.operationLogForLast.operatorTime" class="info-item">
                  {{ $t('ui.operTime') }} :
                  {{ parseTime(createForm.operationLogForLast.operatorTime) }}
                </span>
              </template>
            </FormCollapseItemTitle>
            <div class="pb20">
              <SystemOperationLogTable :tableList="createForm.operationLogList || []" />
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
import { queryBusinessGroupById, updateBusinessGroup } from '@/api/organization/corporate'
import countryCurrencySelect from '@/components/select/countryCurrencySelect.vue'
import selectPicTable from '@/views/organization/corporate/selectPicTable.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  name: 'UpdateBusinessGroup',
  components: {
    countryCurrencySelect,
    selectPicTable,
    SystemOperationLogTable
  },
  mixins: [],
  data() {
    const vm = this
    return {
      submitLoading: false,
      // 一定要放在当前文件
      curPath: this.$options.__file,
      timeId: '',
      activeNames: ['1', '2'],
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
        ],
        email: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.email'))
          },
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ]
      },
      currencyId: undefined,
      collapseWarningForBasicInfo: false
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
      })
    },

    updateBusinessGroup(param) {
      const vm = this
      vm.submitLoading = true
      updateBusinessGroup(param)
        .then((res) => {
          vm.$message.success(
            `${vm
              .$t('organization.businessGroupSaveSuccess')
              .replace('$1', `${param.businessGroupNo}`)}`
          )
          this.cancel()
          vm.submitLoading = false
        })
        .catch((err) => {
          vm.submitLoading = false
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
        this.collapseWarningForBasicInfo = !valid
        if (valid) {
          this.$modal.confirm(vm.$t('organization.businessGroupSaveConfirm')).then(() => {
            let param = JSON.parse(JSON.stringify(vm.createForm))
            param = vm.$trimOfObj(param)
            vm.updateBusinessGroup(param)
          })
        } else {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
      })
    }
  }
}
</script>
