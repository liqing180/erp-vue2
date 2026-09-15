<template>
  <!-- formClass="form-page-btn--hide" -->
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
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
            <basicForm ref="basicForm" :comDisFrom="comDisFrom" :form="form" />
          </el-collapse-item>
        </div>
        <div class="form-card mt10" v-hasPermi="['organization:role:assignRule:list']">
          <el-collapse-item name="2">
            <FormCollapseItemTitle slot="title" :title="$t('organization.assignRule')">
            </FormCollapseItemTitle>
            <AssignRule
              ref="AssignRule"
              :comDisFrom="comDisFrom"
              :form="form"
              :companyList="companyList"
            ></AssignRule>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="3">
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
  </FormPageLayout>
</template>

<script>
import locale from '@/views/organization/lang/index'
import basicForm from '@/views/organization/role/basicForm'
import AssignRule from '@/views/organization/role/AssignRule'

import { getRole, updateNewRole, getBranchCompanyList } from '@/api/organization/role'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  name: 'EditRole',
  dicts: ['sys_user_sex'],
  components: { basicForm, AssignRule, SystemOperationLogTable },
  data() {
    return {
      timeId: '',
      activeNames: ['1', '2', '3'],
      form: {},
      roleId: '',
      parentsId: '',
      collapseWarningForBasicInfo: false,
      isView: undefined,
      companyList: []
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.roleId = this.$route.query.roleId
    this.isView = this.$route.query.isView === '1'
    this.init()
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.roleId = this.$route.query.roleId
      this.isView = this.$route.query.isView === '1'
      this.init()
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
      return this.checkPermi(['organization:role:edit'])
    },
    comDisFrom() {
      if (this.isView) {
        return true
      }
      return !this.editAuth
    }
  },
  methods: {
    init() {
      this.collapseWarningForBasicInfo = false
      this.$refs.basicForm && this.$refs.basicForm.reset()
      this.getRole()
      this.getBranchCompanyList()
    },
    getRole() {
      getRole(this.roleId).then((res) => {
        this.form = res.data
      })
    },
    getBranchCompanyList() {
      getBranchCompanyList().then((res) => {
        this.companyList = res.data || []
      })
    },
    // 取消按钮
    cancel() {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/organization/role' })
    },
    async submitForm() {
      const res = await this.$refs.basicForm.submit()
      if (res) {
        this.collapseWarningForBasicInfo = false

        for (const key in res) {
          this.$set(this.form, key, res[key])
        }
        const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
        this.$refs.AssignRule.getFromData(param)
        let content = this.$t('organization.addRoleConfirm')
        if (
          param.functionalPermissionsLeftCheckedKeys &&
          param.functionalPermissionsLeftCheckedKeys.length > 0 &&
          param.assignUserLeftCheckedKeys &&
          param.assignUserLeftCheckedKeys.length > 0
        ) {
          // console.log(param.functionalPermissionsLeftCheckedKeys)
          content = this.$t('organization.notAddCheckData').replace(
            '$1',
            this.$t('organization.functionalPermissions') + '/' + this.$t('organization.assignUser')
          )
        } else if (
          param.functionalPermissionsLeftCheckedKeys &&
          param.functionalPermissionsLeftCheckedKeys.length > 0
        ) {
          content = this.$t('organization.notAddCheckData').replace(
            '$1',
            this.$t('organization.functionalPermissions')
          )
          param.menuIdList = [...param.menuIdList, ...param.functionalPermissionsLeftCheckedKeys]
          param.menuIdList = [...new Set(param.menuIdList)]
        } else if (param.assignUserLeftCheckedKeys && param.assignUserLeftCheckedKeys.length > 0) {
          content = this.$t('organization.notAddCheckData').replace(
            '$1',
            this.$t('organization.assignUser')
          )
        }
        param.parentsId = this.parentsId
        this.$modal
          .confirm(content)
          .then(() => {
            return updateNewRole(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(
              `${this.$t('organization.savedSuccess').replace('$1', `${param.roleName}`)}`
            )
            this.cancel()
          })
          .catch(() => {})
      } else {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
      }
    }
  }
}
</script>
<style lang="scss"></style>
