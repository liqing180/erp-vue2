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
                    :label="`${$t('organization.departmentName')}`"
                    prop="departmentName"
                  >
                    <el-input v-model="createForm.departmentName" class="form-wd" maxlength="200" />
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
                      class="form-wd"
                      :disabled="comDisFrom"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('organization.branchCompany')}`"
                    prop="branchCompanyName"
                  >
                    <el-input
                      v-model="createForm.branchCompanyName"
                      :title="createForm.branchCompanyName"
                      disabled
                      class="form-wd"
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
            <FormCollapseItemTitle
              slot="title"
              :title="$t('menu.accessPermissions')"
              :warning="collapseWarningForAccessPermissions"
            >
            </FormCollapseItemTitle>
            <div>
              <el-form
                ref="accessPermissionsForm"
                :model="createForm"
                :rules="createRules"
                label-width="195px"
              >
                <el-row class="mt22">
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.position')}`" prop="postIdList">
                      <el-select
                        v-model="createForm.postIdList"
                        multiple
                        collapse-tags
                        placeholder=""
                        style="width: 100%"
                        v-default-select="[enterpriseIds]"
                        class="log-msg-ellipsis"
                      >
                        <el-option
                          v-for="dict in positionOptions"
                          :key="dict.postId"
                          :label="dict.postName"
                          :value="dict.postId"
                          :disabled="dict.disabled"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="3">
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
import {
  updateDepartment,
  queryDepartmentById,
  queryAllSysPost
} from '@/api/organization/corporate'
import selectPicTable from '@/views/organization/corporate/selectPicTable.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  name: 'EditDepartment',
  components: {
    selectPicTable,
    SystemOperationLogTable
  },
  data() {
    const vm = this
    return {
      submitLoading: false,
      propVal: 'currencyCode',
      activeNames: ['1', '2', '3'],
      createForm: {
        departmentName: '',
        legalEntityName: '',
        picUserName: '',
        remarks: '',
        creatorName: '',
        postIdList: []
      },
      createRules: {
        departmentName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg').replace('$1', vm.$t('organization.departmentName')),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        postIdList: [
          {
            type: 'array',
            required: false,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ]
      },
      positionOptions: [],
      enterpriseIds: [],
      collapseWarningForBasicInfo: false,
      collapseWarningForAccessPermissions: false
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
    vm.$set(vm.createForm, 'creatorName', this.$store.state.user.nickName)
    const query = vm.$route.query
    vm.createForm = Object.assign(vm.createForm, query)
    this.queryDepartmentById()
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.reset()
      const query = this.$route.query
      this.createForm = Object.assign(this.createForm, query)
      this.queryDepartmentById()
    }
  },

  methods: {
    // 查询职位
    queryAllSysPost() {
      queryAllSysPost().then((res) => {
        this.positionOptions = res.data || []
        this.positionOptions.forEach((x) => {
          if (this.createForm.postIdList.indexOf(x.postId) !== -1) {
            this.$set(x, 'disabled', true)
          }
        })
      })
    },
    // 清空pic
    picUserNameClear() {
      this.$set(this.createForm, 'picUserName', undefined)
      this.$set(this.createForm, 'picUserId', undefined)
      this.$set(this.createForm, 'mobilePhone', undefined)
      this.$set(this.createForm, 'mobileCode', undefined)
      this.$set(this.createForm, 'mobileNum', undefined)
      this.$set(this.createForm, 'email', undefined)
    },
    // 打开pic弹窗
    openPicTable() {
      this.$refs.selectPicTable.handleOpen()
    },
    updatePic(row) {
      const { nickName, userId, mobilePhone, mobileCode, mobileNum, email } = row
      this.$set(this.createForm, 'picUserName', nickName)
      this.$set(this.createForm, 'picUserId', userId)
      this.$set(this.createForm, 'mobilePhone', mobilePhone)
      this.$set(this.createForm, 'mobileCode', mobileCode)
      this.$set(this.createForm, 'mobileNum', mobileNum)
      this.$set(this.createForm, 'email', email)
    },
    queryDepartmentById() {
      queryDepartmentById(this.createForm.departmentId).then((res) => {
        const data = res.data
        data.postIdList = data.postIdList || []
        this.createForm = data
        this.enterpriseIds = JSON.parse(JSON.stringify(this.createForm.postIdList))
        this.createForm = Object.assign(this.createForm, this.$route.query)
        this.queryAllSysPost()
      })
    },
    saveBusinessGroup(param) {
      const vm = this
      vm.submitLoading = true
      updateDepartment(param)
        .then(() => {
          vm.$message.success(
            `${vm
              .$t('organization.submitDepartmentSuccess')
              .replace('$1', `${param.departmentName}`)}`
          )
          this.cancel()
          vm.submitLoading = false
        })
        .catch(() => {
          vm.submitLoading = false
        })
    },
    reset() {
      this.activeNames = ['1', '2', '3']
      this.createForm = {
        departmentName: '',
        branchCompany: '',
        legalEntity: '',
        picUserName: '',
        picUserId: '',
        mobilePhone: '',
        mobileCode: '',
        mobileNum: '',
        remarks: '',
        createdBy: this.$store.state.user.nickName,
        postIdList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForAccessPermissions = false
      this.resetForm('createForm')
      this.resetForm('accessPermissionsForm')
    },
    submitForm() {
      const vm = this
      this.$refs.createForm.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid

        if (valid) {
          this.$refs.accessPermissionsForm.validate((valid1) => {
            this.collapseWarningForAccessPermissions = !valid1

            if (valid1) {
              this.$modal.confirm(vm.$t('organization.submitDepartment')).then(() => {
                let param = JSON.parse(JSON.stringify(vm.createForm))
                param = vm.$trimOfObj(param)
                vm.saveBusinessGroup(param)
              })
            } else {
              this.$modal.msgError(
                this.$t('ui.fromIncomplete').replace('$1', this.$t('menu.accessPermissions'))
              )
            }
          })
        } else {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
      })
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/organization/corporate' })
    }
  }
}
</script>
