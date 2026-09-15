<template>
  <!-- formClass="form-page-btn--hide" -->
  <FormPageLayout>
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
              ref="form"
              :model="form"
              :rules="rules"
              label-width="140px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('menu.department')" prop="departmentIdList">
                    <el-cascader
                      v-model="form.departmentIdList"
                      :options="departmentList"
                      :props="props"
                      collapse-tags
                      clearable
                      :show-all-levels="false"
                      style="width: 100%"
                      placeholder=""
                      popper-class="hide-cascader-scrollbar"
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('ui.postName')" prop="postName">
                    <el-input v-model="form.postName" :title="form.postName" maxlength="100" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('ui.sort')">
                    <el-input-number
                      class="w100"
                      v-model="form.postSort"
                      :precision="0"
                      v-thousandSplit="{ precision: 0 }"
                      controls-position="right"
                      :min="0"
                      :max="9999"
                      @change="inputNumberChange('postSort')"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item :label="$t('ui.remarks')" prop="remark">
                  <MyInput
                    type="textarea"
                    v-model="form.remark"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    resize="none"
                    show-word-limit
                    :maxlength="3000"
                  ></MyInput>
                </el-form-item>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
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
  </FormPageLayout>
</template>

<script>
import { getPost, updatePost, queryPostCanSelectDepartment } from '@/api/system/post'
import locale from '@/views/system/lang/index'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  name: 'EditPost',
  dicts: ['sys_user_sex'],
  components: { SystemOperationLogTable },
  data() {
    return {
      timeId: '',
      activeNames: ['1', '2'],
      form: {
        departmentIdList: []
      },
      collapseWarningForBasicInfo: false,
      // 表单校验
      rules: {
        departmentIdList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.postName')),
            trigger: ['blur', 'change']
          }
        ],
        postName: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.postName')),
            trigger: ['blur', 'change']
          }
        ],
        postCode: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.postCode')),
            trigger: 'blur'
          }
        ],
        postSort: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.sort')),
            trigger: 'blur'
          }
        ]
      },
      props: {
        multiple: true,
        value: 'id',
        label: 'name',
        children: 'child',
        emitPath: false,
        checkStrictly: true
      },
      departmentList: []
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.postId = this.$route.query.postId
    this.init()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
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
      return this.checkPermi(['system:post:edit'])
    },
    comDisFrom() {
      if (this.form.postId) {
        return !this.editAuth
      }
      return false
    }
  },
  methods: {
    init() {
      this.collapseWarningForBasicInfo = false
      this.handleUpdate()
    },
    /** 修改按钮操作 */
    handleUpdate() {
      getPost(this.postId).then((response) => {
        this.form = response.data
        this.queryPostCanSelectDepartment()
      })
    },
    inputNumberChange(code) {
      this.$refs.form.validateField(code)
    },
    // 查部门
    queryPostCanSelectDepartment() {
      queryPostCanSelectDepartment({}).then((res) => {
        const fromData = res.data || []
        fromData.forEach((x) => {
          if (x.type !== 5 && x.type !== 6) {
            x.disabled = true
          }
          if (
            this.form.postId &&
            this.form.departmentIdList &&
            this.form.departmentIdList.indexOf(x.id) !== -1
          ) {
            x.disabled = true
          }
          x.child = this.disabledId(x)
        })
        this.departmentList = JSON.parse(JSON.stringify(fromData))
      })
    },
    disabledId(data) {
      if (data.child && data.child.length > 0) {
        data.child.forEach((k) => {
          if (k.type !== 5 && k.type !== 6) {
            k.disabled = true
          }
          if (
            this.form.postId &&
            this.form.departmentIdList &&
            this.form.departmentIdList.indexOf(k.id) !== -1
          ) {
            k.disabled = true
          }
          k.child = this.disabledId(k)
        })
        return data.child
      }
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/organization/post' })
    },
    async submitForm() {
      this.$refs.form.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (!valid) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          this.$modal
            .confirm(this.$t('system.postConfirm'))
            .then(() => {
              return updatePost(params)
            })
            .then((response) => {
              this.$modal.msgSuccess(this.$t('system.postSuccess').replace('$1', params.postName))
              this.cancel()
            })
            .catch(() => {})
        }
      })
    }
  }
}
</script>
<style lang="scss"></style>
