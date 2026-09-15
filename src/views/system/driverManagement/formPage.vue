<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        :disabled="fullscreenLoading"
        v-if="!comDisFrom"
        @click="submitForm"
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
              ref="form"
              :model="form"
              :rules="rules"
              label-width="160px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.driverName')}`" prop="driverName">
                    <!-- <el-input
                      v-model="form.driverName"
                      :title="form.driverName"
                      :disabled="!!rowId"
                      maxlength="50"
                    ></el-input> -->
                    <SelectInput
                      :value="form.driverName"
                      :title="form.driverName"
                      @clear="driverNameClear"
                      clearable
                      @click="openDriverName"
                      :disabled="!!form.driverId"
                      class="form-wd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.userName')}`" prop="userName">
                    <el-input
                      v-model="form.userName"
                      :title="form.userName"
                      disabled
                      maxlength="20"
                      class="form-wd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.driverCode')}`" prop="driverCode">
                    <el-input
                      v-model="form.driverCode"
                      :title="form.driverCode"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.type')}`" prop="driverType">
                    <el-select
                      v-model="form.driverType"
                      class="form-wd"
                      placeholder=""
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in dict.type.sys_driver_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('ui.mobileNo')}`"
                    prop="mobilePhone"
                    ref="mobileNoRef"
                  >
                    <MobilePhoneInput
                      :mobileCode.sync="form.mobileCode"
                      :mobileNum.sync="form.mobileNum"
                      :mobileNo.sync="form.mobilePhone"
                      @clearValidate="$refs.mobileNoRef.clearValidate()"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('ui.remarks')}`" prop="remarks">
                    <MyInput
                      type="textarea"
                      v-model="form.remarks"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col>
                  <el-form-item :label="`${$t('system.driversPhoto')}`" prop="driversPhoto">
                    <driversPhoto
                      ref="driversPhotoRef"
                      :limit="1"
                      :accept="['.jpg', '.jpeg', '.png', '.bmp', '.webp']"
                      :disabled="comDisFrom"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('ui.attachment')}`" prop="fileIds">
                    <myUpload ref="uploadRef" :disabled="comDisFrom" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.isActive')}`" prop="isActive">
                    <el-switch v-model="form.isActive" active-value="1" inactive-value="0" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" v-if="!!rowId">
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
                  {{ $t('ui.operTime') }} :
                  {{ parseTime(form.operationLogForLast.operatorTime) }}
                </span>
              </template>
            </FormCollapseItemTitle>
            <div class="pb20">
              <SystemOperationLogTable :tableList="form.operationLogList || []" />
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
    <selectUserTable ref="selectUserTable" @onSuccess="updateTable" />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/system/lang/index'
import { queryDriverById, saveDriver, updateDriver } from '@/api/system/driverManagement'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import driversPhoto from './components/driversPhoto.vue'
import selectUserTable from './components/selectUserTable'
export default {
  components: {
    SystemOperationLogTable,
    driversPhoto,
    selectUserTable
  },
  mixins: [pageMixin],
  dicts: ['sys_driver_type'],
  data() {
    const vm = this
    const validatorPhoneNo = (rule, value, callback) => {
      if (!this.form.mobileCode || !this.form.mobileNum) {
        callback(this.$t('ui.reqMsg').replace('$1', this.$t('ui.mobilePhone')))
      } else {
        callback()
      }
    }
    return {
      fullscreenLoading: false,
      activeNames: ['1', '2'],
      form: {},
      rules: {
        driverName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        userName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        mobilePhone: [{ required: true, validator: validatorPhoneNo, trigger: 'change' }]
      },
      collapseWarningForBasicInfo: false,
      timeId: undefined,
      rowId: undefined
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
      return this.checkPermi(['system:driverManagement:edit'])
    },
    comDisFrom() {
      if (!this.editAuth && !!this.rowId) {
        return true
      }
      return false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.reset()
    if (this.rowId) {
      this.handleUpdate()
    }
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.rowId = this.$route.query.id
      this.reset()
      if (this.rowId) {
        this.handleUpdate()
      }
    }
  },
  methods: {
    openDriverName() {
      this.$refs.selectUserTable.handleAdd()
    },
    updateTable(e) {
      const { nickName, userName, employeeNo, mobileCode, mobileNum, mobilePhone, userId } = e
      this.$set(this.form, 'driverName', nickName)
      this.$set(this.form, 'userName', userName)
      this.$set(this.form, 'driverCode', employeeNo)
      this.$set(this.form, 'mobileCode', mobileCode)
      this.$set(this.form, 'mobileNum', mobileNum)
      this.$set(this.form, 'mobilePhone', mobilePhone)
      this.$set(this.form, 'userId', userId)
    },
    driverNameClear() {
      this.$set(this.form, 'driverName', undefined)
      this.$set(this.form, 'userName', undefined)
      this.$set(this.form, 'driverCode', undefined)
      this.$set(this.form, 'mobileCode', undefined)
      this.$set(this.form, 'mobileNum', undefined)
      this.$set(this.form, 'mobilePhone', undefined)
      this.$set(this.form, 'userId', undefined)
    },
    handleUpdate() {
      this.reset()
      queryDriverById({ driverId: this.rowId }).then((res) => {
        this.form = res.data || {}
        const {
          admissionValidityEnd,
          admissionValidityStart,
          commonFileList,
          commonFileListForAvatar
        } = res.data
        if (admissionValidityStart && admissionValidityEnd) {
          this.$set(this.form, 'admissionValidity', [admissionValidityStart, admissionValidityEnd])
        }
        this.$nextTick(() => {
          this.$refs.uploadRef.initFileList(commonFileList || [])
          this.$refs.driversPhotoRef.initFileList(commonFileListForAvatar || [])
        })
      })
    },
    reset() {
      const vm = this
      vm.form = {
        driverName: undefined,
        driverCode: undefined,
        userName: undefined,
        driverType: undefined,
        mobileCode: undefined,
        mobileNum: undefined,
        mobilePhone: undefined,
        driverAvatarId: undefined,
        avatar: undefined,
        isActive: '1',
        remarks: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      this.$refs.driversPhotoRef && this.$refs.driversPhotoRef.initFileList([])
      this.resetForm('form')
    },
    inputNumberChange(code, form) {
      this.$refs[form].validateField(code)
    },
    submitForm() {
      const vm = this
      let createValid = false
      vm.$refs.form.validate((valid) => {
        createValid = valid
      })
      this.collapseWarningForBasicInfo = !createValid
      if (!createValid) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      let param = JSON.parse(JSON.stringify(vm.form))
      param = vm.$trimOfObj(param)
      const driversPhotoFileIds = this.$refs.driversPhotoRef.getFileIds()
      if (driversPhotoFileIds === false) {
        return
      }
      param.commonFileListForAvatar = driversPhotoFileIds
      const fileIds = this.$refs.uploadRef.getFileIds()
      if (fileIds === false) {
        return
      }
      param.commonFileList = fileIds

      this.$modal
        .confirm(this.$t('system.driverConfirm'))
        .then(() => {
          if (this.rowId) {
            return updateDriver(param)
          } else {
            return saveDriver(param)
          }
        })
        .then(() => {
          this.$modal.msgSuccess(this.$t('system.driverSuccess').replace('$1', param.driverName))
          this.cancel()
        })
        .catch(() => {})
    },
    cancel() {
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/system/driverManagement')
    }
  }
}
</script>
