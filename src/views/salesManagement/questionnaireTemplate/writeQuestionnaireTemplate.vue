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
            <el-form ref="form" :model="form" :rules="rules" label-width="140px">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    :label="$t('SALES.questionnaireName')"
                    prop="questionnaireTemplateName"
                  >
                    <el-input
                      v-model="form.questionnaireTemplateName"
                      :title="form.questionnaireTemplateName"
                      maxlength="500"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('SALES.questionnaireNo')" prop="questionnaireTemplateNo">
                    <el-input
                      v-model="form.questionnaireTemplateNo"
                      :title="form.questionnaireTemplateNo"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('ui.description')" prop="description">
                    <el-input v-model="form.description" :title="form.description" disabled />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.customer')}`" prop="businessPartnerId">
                    <CommonSelect
                      :id="form.businessPartnerId"
                      :label="form.businessPartnerName"
                      idKey="businessPartnerId"
                      labelKey="businessPartnerName"
                      :options="customerList"
                      @change="businessPartnerChange"
                      filterable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('SALES.salesOpportunity')" prop="salesOpportunity">
                    <el-input v-model="form.salesOpportunity" maxlength="200" />
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
              :title="$t('ui.content')"
              :warning="collapseWarningForContent"
            >
            </FormCollapseItemTitle>
            <paper ref="paper" :categoryList="categoryList" />
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>

<script>
import {
  queryQuestionnaireTemplateById,
  queryCanSelectCustomerListNoPage,
  saveCustomerQuestionnaireFromTemplate
} from '@/api/salesManagement/questionnaireTemplate'
import locale from '@/views/salesManagement/lang/index'
import paper from '@/views/salesManagement/questionnaireTemplate/components/paper.vue'

export default {
  name: 'WriteQuestionnaireTemplate',
  components: { paper },
  data() {
    return {
      timeId: '',
      rowId: '',
      activeNames: ['1', '2', '3'],
      form: {
        isActive: '1',
        questionnaireTemplateName: '',
        questionnaireTemplateNo: '',
        productCategoryIdList: undefined
      },
      collapseWarningForBasicInfo: false,
      collapseWarningForContent: false,
      // 表单校验
      rules: {
        questionnaireTemplateName: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.postName')),
            trigger: ['blur', 'change']
          }
        ],
        businessPartnerId: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.postName')),
            trigger: ['blur', 'change']
          }
        ]
      },
      customerList: [],
      categoryList: []
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.init()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.rowId = this.$route.query.id
      this.init()
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  methods: {
    init() {
      this.collapseWarningForBasicInfo = false
      this.queryCanSelectCustomerListNoPage()
      this.queryQuestionnaireTemplateById()
    },
    businessPartnerChange(row) {
      if (JSON.stringify(row) !== '{}') {
        this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
        this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
        this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      } else {
        this.$set(this.form, 'businessPartnerId', undefined)
        this.$set(this.form, 'businessPartnerMainId', undefined)
        this.$set(this.form, 'businessPartnerName', undefined)
      }
    },
    queryCanSelectCustomerListNoPage() {
      queryCanSelectCustomerListNoPage({}).then((res) => {
        this.customerList = res.data || []
      })
    },
    queryQuestionnaireTemplateById() {
      queryQuestionnaireTemplateById({ questionnaireTemplateId: this.rowId })
        .then((res) => {
          const { categoryList } = res.data
          this.form = res.data
          this.categoryList = categoryList
          this.categoryList.forEach((x) => {
            x.questionsList &&
              x.questionsList.forEach((k) => {
                this.$set(k, 'customResult', undefined)
                this.$set(k, 'explanationAnswer', undefined)
                if (k.answersCategory === '3') {
                  this.$set(k, 'customResult', [])
                }
              })
          })
        })
        .catch(() => {})
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/salesManagement/questionnaireTemplate' })
    },
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (!valid) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          const categoryList = await this.$refs.paper.submitForm()
          if (!categoryList) {
            this.collapseWarningForContent = true
            return
          } else {
            this.collapseWarningForContent = false
          }
          params.categoryList = categoryList
          this.$modal
            .confirm(this.$t('SALES.writeConfirm'))
            .then(() => {
              return saveCustomerQuestionnaireFromTemplate(params)
            })
            .then((response) => {
              this.$modal.msgSuccess(this.$t('SALES.writeSuccess'))
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
