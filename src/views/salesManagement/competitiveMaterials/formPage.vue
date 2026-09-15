<template>
  <!-- formClass="form-page-btn--hide" -->
  <FormPageLayout ref="FormPageLayoutRef">
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
              @submit.native.prevent
              :rules="rules"
              label-width="130px"
              v-if="!rowId"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('menu.competitor')" prop="competitor">
                    <el-input v-model="form.competitor" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.description')">
                    <MyInput
                      type="textarea"
                      v-model="form.description"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

            <el-form
              ref="form"
              :model="competitorData"
              @submit.native.prevent
              :rules="rules"
              label-width="180px"
              disabled
              v-else
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('PRODUCT.productName')">
                    <el-input
                      v-model="competitorData.productName"
                      :title="competitorData.productName"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('PRODUCT.productCode')">
                    <el-input
                      v-model="competitorData.internalPartNo"
                      :title="competitorData.internalPartNo"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('PRODUCT.brand')">
                    <el-input
                      v-model="competitorData.brand"
                      :title="competitorData.brand"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('SALES.recommendedRetailPrice')">
                    <el-input
                      :value="$numberStr(competitorData.recommendedRetailPrice, 2)"
                      :title="$numberStr(competitorData.recommendedRetailPrice, 2)"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('ui.currency')">
                    <el-input
                      v-model="competitorData.currency"
                      :title="competitorData.currency"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" ref="collapseScrollPage">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('menu.productInfo')"
              :warning="collapseWarningForProductInfo"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <ProductTable
                ref="ProductTable"
                :pqProductList="initProductList"
                :comDisFrom="comDisFrom"
                :rowId="rowId"
                :competitorData="competitorData"
                @updateTable="updateProductTable"
                @scrollPageToTable="scrollPageToTable"
              />
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="3">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('ui.attachment')"
              :warning="collapseWarningForAttachment"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <myUpload ref="uploadRef" :disabled="comDisFrom" />
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" v-if="form.operationLogForLast">
          <el-collapse-item name="4">
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
import { saveCompetitor, queryCompetitorById } from '@/api/salesManagement/competitiveMaterials'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import ProductTable from './productTable.vue'

export default {
  mixins: [pageMixin],
  components: { SystemOperationLogTable, ProductTable },
  data() {
    const vm = this
    return {
      id: '',
      ids: '',
      loading: false,
      saveKey: '5',
      rowId: '',
      timeId: '',
      activeNames: ['1', '2', '3', '4'],
      // 总条数
      total: 0,
      rules: {
        competitor: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ]
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined
      },
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      collapseWarningForAttachment: false,
      supplierList: [],
      rowIndex: undefined,
      form: {},
      initProductList: [],
      competitorList: [],
      competitorData: {}
    }
  },
  props: {
    propTimeId: {
      type: String,
      default: ''
    },
    propRowId: {
      type: String,
      default: ''
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
      return this.checkPermi(['salesManagement:competitiveMaterials:edit'])
    },
    comDisFrom() {
      if (this.rowId) {
        return !this.editAuth
      }
      return false
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.rowId = this.propRowId
        if (this.rowId) {
          this.handleUpdate()
        }
      }
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    handleUpdate() {
      this.reset()
      queryCompetitorById({ productMainId: this.rowId }).then((res) => {
        const data = res.data
        this.form = data
        const { competitorData, competitorList, commonFileList } = this.form
        this.competitorData = competitorData
        this.initProductList = competitorList

        setTimeout(() => {
          this.$refs.uploadRef.initFileList(commonFileList || [])
        }, 300)
      })
    },
    updateProductTable(list) {
      this.competitorList = list || []
    },
    reset() {
      this.form = {}
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForAttachment = false
      this.initProductList = []
      this.competitorList = []
      this.activeNames = ['1', '2', '3', '4']
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form')
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/salesManagement/competitiveMaterials' })
    },
    // 滚动页面到表格的可视区域
    scrollPageToTable() {
      try {
        if (!this.$refs.collapseScrollPage) return
        const offsetTop = this.$refs.collapseScrollPage.offsetTop
        if (!this.$refs.FormPageLayoutRef) return
        const pageContent = this.$refs.FormPageLayoutRef.$refs.pageContent
        if (pageContent) {
          pageContent.scrollTo({
            top: offsetTop - 50, // pageContent 没有使用定位
            behavior: 'smooth' // 平滑滚动
          })
        }
      } catch (err) {}
    },
    async submitForm() {
      const valid1 = await this.$refs.form.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      this.collapseWarningForBasicInfo = false

      const competitorList = this.$refs.ProductTable.getList()
      if (competitorList.length <= 0) {
        this.collapseWarningForProductInfo = true
        this.$modal.msgError(this.$t('SALES.productIsEmpty'))
        return
      }

      if (!this.rowId) {
        const competitivePrice = competitorList.some(
          (x) => !this.$resultOfBoolean(x.competitorPrice)
        )
        if (competitivePrice) {
          this.$refs.ProductTable.errorMessage('competitorPrice')

          this.collapseWarningForProductInfo = true
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.competitivePrice'))
          )
          return
        }
      } else {
        const competitor = competitorList.some((x) => !this.$resultOfBoolean(x.competitor))
        if (competitor) {
          this.$refs.ProductTable.errorMessage('competitor')

          this.collapseWarningForProductInfo = true
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('menu.competitor')))
          return
        }

        const competitorPrice = competitorList.some(
          (x) => !this.$resultOfBoolean(x.competitorPrice)
        )
        if (competitorPrice) {
          this.$refs.ProductTable.errorMessage('competitorPrice')

          this.collapseWarningForProductInfo = true
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.competitivePrice'))
          )
          return
        }
      }

      this.collapseWarningForProductInfo = false

      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        this.collapseWarningForAttachment = true
        return
      }
      this.collapseWarningForAttachment = false

      this.$modal
        .confirm(this.$t('SALES.competitiveConfirm'))
        .then(() => {
          const params = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
          params.commonFileList = myFileIds
          params.competitorList = competitorList
          return saveCompetitor(params)
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('SALES.competitiveSuccess'))
          this.cancel()
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.card {
  max-width: 500px;
  max-height: 300px;
  overflow: hidden auto;
  .item {
    font-size: 14px;
    line-height: 20px;
    width: 100%;
  }
}
.flow1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: initial;
}

.card::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(127, 135, 146, 0.5);
}

.card::-webkit-scrollbar-track {
  width: 10px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
</style>
