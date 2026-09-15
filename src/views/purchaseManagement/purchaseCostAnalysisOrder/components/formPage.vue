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
              @submit.native.prevent
              :rules="rules"
              label-width="220px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('PURCHASE.expenseItem1')" prop="expenseItemName">
                    <el-input v-model="form.expenseItemName" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('ui.type')" prop="expenseItemType">
                    <el-select
                      style="width: 100%"
                      v-model="form.expenseItemType"
                      placeholder=""
                      @change="expenseItemTypeChange"
                    >
                      <el-option
                        v-for="dict in typeDicts"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item
                    :label="$t('PURCHASE.expenseProportionAmount')"
                    prop="expenseProportionAmount"
                  >
                    <el-input-number
                      style="width: 100%"
                      size="mini"
                      v-model="form.expenseProportionAmount"
                      controls-position="right"
                      :precision="1"
                      v-thousandSplit="{ precision: 1 }"
                      :min="1"
                      :max="100"
                      :disabled="!form.expenseItemType"
                      v-if="form.expenseItemType === '1'"
                    />
                    <el-input-number
                      style="width: 100%"
                      size="mini"
                      v-model="form.expenseProportionAmount"
                      controls-position="right"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0.01"
                      :max="999999.99"
                      :disabled="!form.expenseItemType"
                      v-else
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('PURCHASE.inventoryCategory')">
                    <el-input
                      :value="form.productCategoryNames"
                      :title="form.productCategoryNames"
                      disabled
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
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                    ></MyInput>
                  </el-form-item>
                </el-col>
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
                @updateTable="updateProductTable"
              />
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" v-if="form.operationLogForLast">
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
import {
  saveInventoryCostSettings,
  updateInventoryCostSettings,
  queryInventoryCostSettingsById
} from '@/api/reportManagement/inventoryCostAnalysis'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import locale2 from '@/views/salesManagement/lang/index'
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
        expenseItemName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        expenseItemType: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        expenseProportionAmount: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur'],
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
      supplierList: [],
      rowIndex: undefined,
      form: {},
      initProductList: [],
      typeDicts: [
        {
          label: vm.$t('SALES.expenseProportion6'),
          value: '1'
        },
        {
          label: vm.$t('SALES.amount6'),
          value: '2'
        }
      ]
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
      return this.checkPermi(['purchaseManagement:inventoryCostAnalysis:edit'])
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
        } else {
          this.handleAdd()
        }
      }
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
    this.$i18n.mergeLocaleMessage('zh', locale2.zh)
    this.$i18n.mergeLocaleMessage('en', locale2.en)
  },
  methods: {
    expenseItemTypeChange() {
      this.$set(this.form, 'expenseProportionAmount', undefined)
    },
    handleAdd() {
      this.reset()
    },
    handleUpdate() {
      this.reset()
      queryInventoryCostSettingsById({ inventoryCostSettingsId: this.rowId }).then((res) => {
        const data = res.data
        this.form = data
        const { productList } = this.form
        this.initProductList = productList || []
      })
    },
    updateProductTable(list) {
      this.initProductList = list || []
      if (this.initProductList && this.initProductList.length > 0) {
        const map = new Map()
        this.initProductList.forEach((item) => {
          map.set(item.productCategoryId, item)
        })
        const newData = [...map.values()]
        const productCategoryNames = newData.map((x) => x.productCategoryName).join(',')
        const productCategoryIds = newData.map((x) => x.productCategoryId).join(',')

        this.$set(this.form, 'productCategoryNames', productCategoryNames || '')
        this.$set(this.form, 'productCategoryIds', productCategoryIds || '')
      } else {
        this.$set(this.form, 'productCategoryNames', undefined)
        this.$set(this.form, 'productCategoryIds', undefined)
      }
    },
    reset() {
      this.form = {
        isActive: '1'
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.initProductList = []
      this.activeNames = ['1', '2', '3', '4']

      this.resetForm('form')
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/inventoryCostAnalysis' })
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

      const productList = this.$refs.ProductTable.getList()
      if (productList.length <= 0) {
        this.collapseWarningForProductInfo = true
        this.$modal.msgError(this.$t('SALES.productIsEmpty'))
        return
      }

      this.collapseWarningForProductInfo = false

      this.$modal
        .confirm(this.$t('SALES.costSettingsConfirm'))
        .then(() => {
          const params = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
          params.productList = productList
          if (this.rowId) {
            return updateInventoryCostSettings(params)
          } else {
            return saveInventoryCostSettings(params)
          }
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('SALES.costSettingsSuccess'))
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
