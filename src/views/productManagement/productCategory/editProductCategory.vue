<template>
  <FormPageLayout v-loading="submitLoading">
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
              <span class="info-item mr20" :title="form.categoryName">
                {{ $t('PRODUCT.categoryName') }} : {{ form.categoryName }}
              </span>
              <span class="info-item">
                {{ $t('ui.isActive') }} :
                {{ form.isActive === '1' ? $t('uiBtn.active') : $t('uiBtn.inactive') }}
              </span>
            </FormCollapseItemTitle>
            <!-- <template slot="title">
              <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
              <strong>{{ $t('ui.basicInfo') }}</strong>
            </template> -->
            <el-form
              ref="form"
              :model="form"
              @submit.native.prevent
              :rules="rules"
              label-width="180px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="16">
                  <el-form-item :label="`${$t('PRODUCT.parentCategory1')}`">
                    <el-input :value="form.parentName" :title="form.parentName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.categoryCode')}`" prop="uniqueNo">
                    <el-input v-model="form.uniqueNo" maxlength="5" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item :label="`${$t('PRODUCT.categoryName')}`" prop="categoryName">
                    <el-input
                      v-model="form.categoryName"
                      :title="form.categoryName"
                      maxlength="200"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.description')">
                    <MyInput
                      type="textarea"
                      v-model="form.description"
                      :autosize="{ minRows: 2, maxRows: 8 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.createdBy')}`">
                    <el-input :value="form.createdBy" disabled class="form-wd"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.createdTime')}`">
                    <el-date-picker
                      :value="form.createdTime"
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

              <el-row>
                <el-col :span="12">
                  <el-form-item :label="`${$t('ui.isActive')}`">
                    <el-switch
                      v-model="form.isActive"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </el-form-item>
                </el-col>
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
                  {{ $t('ui.operTime') }} : {{ parseTime(form.operationLogForLast.operatorTime) }}
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
import locale from '@/views/productManagement/lang/index'
import { update, queryProductCategoryById } from '@/api/productManagement/productCategory'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  name: 'EditProductCategory',
  components: { SystemOperationLogTable },
  data() {
    return {
      submitLoading: false,
      activeNames: ['1', '2'],
      form: {},
      rules: {
        categoryName: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('organization.departmentName')),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        uniqueNo: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('organization.departmentName')),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ]
      },
      id: '',
      collapseWarningForBasicInfo: false,
      isView: undefined
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
      return this.checkPermi(['productManagement:productCategory:edit'])
    },
    comDisFrom() {
      if (this.isView) {
        return true
      }
      if (this.rowId) {
        return !this.editAuth
      }
      return false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.id = this.$route.query.id
    this.timeId = this.$route.query.timeId
    this.isView = this.$route.query.isView === '1'
    this.queryProductCategoryById()
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.id = this.$route.query.id
      this.isView = this.$route.query.isView === '1'
      this.queryProductCategoryById()
    }
  },

  methods: {
    queryProductCategoryById() {
      queryProductCategoryById(this.id).then((res) => {
        this.form = res.data
      })
    },
    update(param) {
      this.submitLoading = true
      if (!param.parentId) {
        param.parentId = 0
      }
      update(param)
        .then(() => {
          this.$message.success(
            `${this.$t('PRODUCT.productCategorySuccess').replace('$1', `${param.categoryName}`)}`
          )
          this.cancel()
          this.submitLoading = false
        })
        .catch(() => {
          this.submitLoading = false
        })
    },

    submitForm() {
      this.$refs.form.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (!valid) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
        if (valid) {
          this.$modal.confirm(this.$t('PRODUCT.productCategorySubmit')).then(() => {
            let param = JSON.parse(JSON.stringify(this.form))
            param = this.$trimOfObj(param)
            this.update(param)
          })
        }
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
      this.$router.push({ path: '/productManagement/productCategory' })
    }
  }
}
</script>
