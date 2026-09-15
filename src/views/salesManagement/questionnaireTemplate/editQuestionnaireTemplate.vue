<template>
  <!-- formClass="form-page-btn--hide" -->
  <FormPageLayout>
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        @click="submitForm"
        v-hasPermi="['salesManagement:questionnaireTemplate:edit']"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="previewQuestionnaire" size="mini">{{
        $t('SALES.previewQuestionnaire')
      }}</el-button>
      <el-button type="primary" @click="previewQuestionnaire('export')" :loading="exportLoading">{{
        $t('SALES.exportQuestionnaire')
      }}</el-button>
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
                  <el-form-item
                    :label="`${$t('SALES.productCategory')}`"
                    prop="productCategoryIdList"
                  >
                    <el-cascader
                      :show-all-levels="false"
                      placeholder=""
                      v-model="form.productCategoryIdList"
                      :options="productCategoryData"
                      :props="{
                        multiple: false,
                        value: 'id',
                        label: 'categoryName',
                        children: 'child',
                        checkStrictly: true
                      }"
                      clearable
                      :collapse-tags="false"
                      class="cascader"
                      popper-class="hide-cascader-scrollbar"
                      style="width: 100%"
                    ></el-cascader>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item :label="$t('ui.description')" prop="description">
                  <MyInput
                    type="textarea"
                    v-model="form.description"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    resize="none"
                    show-word-limit
                    :maxlength="3000"
                  ></MyInput>
                </el-form-item>
              </el-row>
              <el-row>
                <el-col :span="8">
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
            <FormCollapseItemTitle
              slot="title"
              :title="$t('ui.content')"
              :warning="collapseWarningForContent"
            >
            </FormCollapseItemTitle>

            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane :label="$t('SALES.questionnaireDetails')" name="0">
                <!-- 问卷详情 -->
                <questionnaireDetails ref="questionnaireDetails" />
              </el-tab-pane>
              <el-tab-pane :label="$t('SALES.productDetails')" name="1">
                <!-- 产品明细 -->
                <productDetails
                  ref="productDetails"
                  :productCategoryIdList="form.productCategoryIdList"
                />
              </el-tab-pane>
            </el-tabs>
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

    <!-- 预览 -->
    <previewQuestionnaireTemplateDlg ref="previewQuestionnaireTemplateDlg" />
    <exportPDF ref="exportPDF" @exportSuccess="exportLoading = false" />
  </FormPageLayout>
</template>

<script>
import {
  queryQuestionnaireTemplateById,
  updateQuestionnaireTemplate,
  queryActiveProductCategoryTreeList
} from '@/api/salesManagement/questionnaireTemplate'
import locale from '@/views/salesManagement/lang/index'
import questionnaireDetails from '@/views/salesManagement/questionnaireTemplate/components/questionnaireDetails'
import productDetails from '@/views/salesManagement/questionnaireTemplate/components/productDetails'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import previewQuestionnaireTemplateDlg from '@/views/salesManagement/questionnaireTemplate/components/previewQuestionnaireTemplateDlg.vue'
import exportPDF from '@/views/salesManagement/questionnaireTemplate/components/exportPDF.vue'

export default {
  name: 'EditQuestionnaireTemplate',
  components: {
    questionnaireDetails,
    productDetails,
    SystemOperationLogTable,
    previewQuestionnaireTemplateDlg,
    exportPDF
  },
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
      departmentList: [],
      productCategoryData: [],
      activeName: '0',
      exportLoading: false,
      fromSrcPath: ''
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.fromSrcPath = this.$route.query.fromSrcPath
    this.init()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.rowId = this.$route.query.id
      this.fromSrcPath = this.$route.query.fromSrcPath
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
      this.queryQuestionnaireTemplateById()
    },
    queryQuestionnaireTemplateById() {
      queryQuestionnaireTemplateById({ questionnaireTemplateId: this.rowId })
        .then((res) => {
          const { categoryList } = res.data
          this.form = res.data
          // const { productCategoryId } = res.data
          // this.$set(this.form, 'productCategoryIdList', [productCategoryId])
          this.$refs.questionnaireDetails.init(categoryList)
          this.queryActiveProductCategoryTreeList()
        })
        .catch(() => {})
    },
    inputNumberChange(code) {
      this.$refs.form.validateField(code)
    },
    handleClick() {},
    queryActiveProductCategoryTreeList() {
      queryActiveProductCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.productCategoryData = arr
        const idArr = this.treeFindPath(
          this.productCategoryData,
          (data) => data.id === this.form.productCategoryId
        )
        this.$set(this.form, 'productCategoryIdList', idArr)
      })
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          if (x.child && x.child.length > 0) {
            this.handle(x.child)
          } else {
            x.child = undefined
          }
        })
      }
    },
    treeFindPath(tree, func, path = []) {
      if (!tree) return []
      for (const data of tree) {
        // 这里按照你的需求来存放最后返回的内容吧
        path.push(data.id)
        if (func(data)) return path
        if (data.child) {
          const findChildren = this.treeFindPath(data.child, func, path)
          if (findChildren.length) return findChildren
        }
        path.pop()
      }
      return []
    },
    // 取消按钮
    cancel() {
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }

      this.$store.dispatch('tagsView/delView', this.$route)
      if (this.fromSrcPath) {
        this.$router.push({ path: this.fromSrcPath })
      } else {
        this.$router.push({ path: '/salesManagement/questionnaireTemplate' })
      }
    },
    async previewQuestionnaire(type) {
      this.$refs.form.validate(async (valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (!valid) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
        if (valid) {
          const params = await this.validateForm()
          if (params) {
            if (type === 'export') {
              this.$refs.exportPDF.handleOpen(params)
              this.exportLoading = true
            } else {
              this.$refs.previewQuestionnaireTemplateDlg.handleOpen(params)
            }
          }
        }
      })
    },
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (!valid) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
        if (valid) {
          const params = await this.validateForm()
          if (params) {
            this.$modal
              .confirm(this.$t('SALES.questionnaireTemplateConfirm'))
              .then(() => {
                return updateQuestionnaireTemplate(params)
              })
              .then((response) => {
                this.$modal.msgSuccess(
                  this.$t('SALES.questionnaireTemplateSuccess').replace('$1', response.msg)
                )
                this.cancel()
              })
              .catch(() => {})
          }
        }
      })
    },
    async validateForm() {
      const params = JSON.parse(JSON.stringify(this.form))
      if (params.productCategoryIdList && params.productCategoryIdList.length > 0) {
        params.productCategoryId =
          params.productCategoryIdList[params.productCategoryIdList.length - 1]
      }
      const categoryList = await this.$refs.questionnaireDetails.submitForm()
      if (!categoryList) {
        this.collapseWarningForContent = true
        return false
      } else {
        this.collapseWarningForContent = false
      }
      categoryList.forEach((x) => {
        x.questionsList.forEach((k) => {
          if (k.answersCategory === '1') {
            delete k.dateFormat
            delete k.optionList
          } else if (k.answersCategory === '2' || k.answersCategory === '3') {
            delete k.dateFormat
          } else if (k.answersCategory === '4' || k.answersCategory === '5') {
            delete k.optionList
          }
        })
      })
      params.categoryList = categoryList
      return params
    }
  }
}
</script>
<style lang="scss"></style>
