<template>
  <!-- formClass="form-page-btn--hide" -->
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" :disabled="tableList.length <= 0" @click="submitForm"
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
              :title="$t('menu.productInfo')"
              :warning="collapseWarningForBasicInfo"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <el-row :gutter="10" class="mb8">
                <right-toolbar
                  :saveKey="saveKey"
                  :showRefreshBtn="false"
                  :columns="configColumn"
                  :columnsInit="columns"
                ></right-toolbar>
              </el-row>
              <el-table border ref="tables" class="mb20" :data="tableList" v-table-tab>
                <el-table-column
                  type="index"
                  key="index"
                  :label="$t('ui.sn')"
                  width="60"
                  fixed="left"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  v-for="item in visibleColumn"
                  :key="item.prop + item.colSortIndex"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :min-width="getMinWidth(item)"
                  :show-overflow-tooltip="item.tooltip"
                  :fixed="item.fixed"
                  :sortable="item.sortable"
                  :align="item.align || 'left'"
                  header-align="center"
                >
                  <template slot="header" slot-scope="{ column }">
                    <span v-if="['salesUom', 'unitPrice'].includes(item.prop)">
                      <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                    </span>
                    <span v-else-if="['competitorPriceMax'].includes(item.prop)">
                      {{ column.label }}
                      <svg-icon icon-class="up1" />
                    </span>
                    <span v-else-if="['competitorPriceMin'].includes(item.prop)">
                      {{ column.label }}
                      <svg-icon icon-class="down1" />
                    </span>
                    <span v-else>{{ column.label }}</span>
                  </template>
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'salesUom'">
                      <el-select
                        v-if="!comDisFrom && scope.row.isApproved !== '1'"
                        style="width: 98%"
                        v-model="scope.row.salesUom"
                        :title="showUomLabel(scope.row[item.prop])"
                        placeholder=""
                        @change="salesUomChange(scope.row)"
                      >
                        <el-option
                          v-for="item in scope.row.uomList || []"
                          :key="item"
                          :label="item"
                          :value="item"
                        >
                        </el-option>
                      </el-select>
                      <span v-else :title="showUomLabel(scope.row[item.prop])">{{
                        scope.row[item.prop]
                      }}</span>
                    </template>
                    <template v-else-if="item.prop === 'salesPartNo'">
                      <template>{{ scope.row[item.prop] }}</template>
                    </template>
                    <template v-else-if="item.prop === 'priceType'">
                      {{ selectDictLabel(dict.type.s_price_type, scope.row.priceType) }}
                    </template>

                    <template v-else-if="item.prop === 'unitPrice'">
                      <el-input-number
                        v-thousandSplit="{ precision: 2 }"
                        v-if="!comDisFrom"
                        style="width: 98%"
                        v-model="scope.row.unitPrice"
                        controls-position="right"
                        :precision="2"
                        :min="0.01"
                        :max="999999999999.99"
                      />
                      <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
                    </template>

                    <template v-else-if="item.prop === 'remarks'">
                      <descriptionEditDlg
                        style="width: 100%"
                        v-model="scope.row.remarks"
                        :maxlength="200"
                        :disabled="comDisFrom"
                      />
                    </template>
                    <template v-else-if="item.prop === 'competitorPriceMax'">{{
                      $numberStr(scope.row[item.prop], 2)
                    }}</template>
                    <template v-else-if="item.prop === 'competitorPriceMin'">{{
                      $numberStr(scope.row[item.prop], 2)
                    }}</template>
                    <template v-else-if="item.prop === 'recommendedRetailPrice'">{{
                      $numberStr(scope.row[item.prop], 2)
                    }}</template>
                    <template v-else-if="item.prop === 'salesRetailPrice'">{{
                      $numberStr(scope.row[item.prop], 2)
                    }}</template>

                    <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>

<script>
import {
  updateSalesPriceStrategyList,
  querySalesPriceStrategyListForProductId
} from '@/api/salesManagement/salesPriceStrategy'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

export default {
  mixins: [pageMixin],
  dicts: ['s_price_type'],
  data() {
    const vm = this
    return {
      submitLoading: false,
      id: '',
      ids: '',
      loading: false,
      saveKey: '5',
      rowIdKey: 'id',
      activeNames: ['1', '2'],
      // 总条数
      total: 0,
      /* 表格部分 */
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'salesUom',
          label: vm.$t('SALES.pricingUnit'),
          visible: true,
          fixedWidth: 160,
          tooltip: true
        },
        {
          prop: 'salesPartNo',
          label: vm.$t('SALES.salesPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'priceType',
          label: vm.$t('SALES.priceType'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'competitorPriceMax',
          label: vm.$t('SALES.competitorPricing'),
          visible: true,
          width: 160,
          tooltip: true
        },
        {
          prop: 'competitorPriceMin',
          label: vm.$t('SALES.competitorPricing'),
          visible: true,
          width: 160,
          tooltip: true
        },
        {
          prop: 'recommendedRetailPrice',
          label: vm.$t('SALES.recommendedRetailPrice'),
          visible: true,
          minWidth: 200,
          padding: 50,
          tooltip: true
        },
        {
          prop: 'salesRetailPrice',
          label: vm.$t('SALES.RRP'),
          visible: true,
          minWidth: 200,
          padding: 50,
          tooltip: true
        },

        {
          prop: 'unitPrice',
          label: vm.$t('SALES.discountedPrice'),
          visible: true,
          fixedWidth: 160,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          fixedWidth: 200,
          tooltip: false
        }
      ],
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined
      },
      collapseWarningForBasicInfo: false,
      supplierList: [],
      rowIndex: undefined,
      form: {}
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
      return this.checkPermi(['salesManagement:servicePriceList:edit'])
    },
    comDisFrom() {
      if (this.id) {
        return !this.editAuth
      }
      return true
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.timeId = this.$route.query.timeId
    this.id = this.$route.query.id
    if (this.id) {
      this.handleUpdate()
    }
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.id = this.$route.query.id
      if (this.id) {
        this.handleUpdate()
      }
    }
  },
  methods: {
    handleUpdate() {
      querySalesPriceStrategyListForProductId(this.id.split(',')).then((res) => {
        const servicePriceStrategyList = res.data || []
        this.tableList = servicePriceStrategyList
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    salesUomChange(row) {
      const salesUom = row.salesUom
      this.tableList.forEach((item) => {
        if (item.productId === row.productId) {
          this.$set(item, 'salesUom', salesUom)
        }
      })
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/salesManagement/salesPriceStrategy' })
    },
    submitForm: function () {
      const pricingUnitFlag = this.tableList.some((x) => !this.$resultOfBoolean(x.salesUom))
      if (pricingUnitFlag) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.pricingUnit')))
        return
      }

      const unitPriceFlag = this.tableList.some((x) => !this.$resultOfBoolean(x.unitPrice))
      if (unitPriceFlag) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.discountedPrice'))
        )
        return
      }

      this.collapseWarningForBasicInfo = false

      this.$modal
        .confirm(this.$t('SALES.priceStrategySubmitConfirm'))
        .then(() => {
          const params = this.$trimOfObj(JSON.parse(JSON.stringify(this.tableList)))
          this.submitLoading = true
          return updateSalesPriceStrategyList(params)
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('SALES.priceStrategySubmitSuccess'))
          this.cancel()
          this.submitLoading = false
        })
        .catch(() => {
          this.submitLoading = false
        })
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
