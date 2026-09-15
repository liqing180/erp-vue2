<template>
  <!-- formClass="form-page-btn--hide" -->
  <FormPageLayout>
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
              <el-table
                border
                ref="tables"
                max-height="700px"
                :row-key="rowIdKey"
                :data="tableList"
                v-table-tab
              >
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
                  :min-width="item.minWidth"
                  :show-overflow-tooltip="item.tooltip"
                  :fixed="item.fixed"
                  :sortable="item.sortable"
                  :align="item.align || 'left'"
                  header-align="center"
                >
                  <template slot="header" slot-scope="{ column }">
                    <span v-if="item.prop === 'unitPrice'">
                      <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                    </span>
                    <span v-else>{{ column.label }}</span>
                  </template>
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'pricingUnit'">
                      <span :title="showUomLabel(scope.row.pricingUnit)">{{
                        scope.row.pricingUnit
                      }}</span>
                    </template>

                    <template v-else-if="item.prop === 'unitPrice'">
                      <el-input-number
                        v-thousandSplit="{ precision: 2 }"
                        style="width: 98%"
                        v-model="scope.row.unitPrice"
                        controls-position="right"
                        :precision="2"
                        :min="0.01"
                        :max="99999999.99"
                        :disabled="comDisFrom"
                      />
                    </template>
                    <template v-else-if="item.prop === 'remarks'">
                      <descriptionEditDlg
                        v-model="scope.row.remarks"
                        :maxlength="200"
                        :disabled="comDisFrom"
                      />
                    </template>
                    <template v-else>{{ scope.row[item.prop] }}</template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" v-if="form.operationLogForLast">
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
import {
  saveServicePriceStrategy,
  queryServicePriceStrategyById
} from '@/api/salesManagement/servicePriceList'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  dicts: ['valuation_unit'],
  mixins: [pageMixin],
  components: { SystemOperationLogTable },
  data() {
    const vm = this
    return {
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
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.productCode'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'pricingUnit',
          label: vm.$t('SALES.pricingUnit'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('SALES.unitPrice'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
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
    this.ids = this.$route.query.ids
    if (this.id) {
      this.handleUpdate()
    }
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.id = this.$route.query.id
      this.ids = this.$route.query.ids
      if (this.id) {
        this.handleUpdate()
      }
    }
  },
  methods: {
    handleUpdate() {
      this.form = {}
      queryServicePriceStrategyById({ productMainId: this.id }).then((res) => {
        const data = res.data
        this.form = data
        const servicePriceStrategyList = data.servicePriceStrategyList || []
        this.tableList = servicePriceStrategyList

        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },
    // 取消按钮
    cancel() {
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/salesManagement/servicePriceList' })
    },
    submitForm: function () {
      const pricingUnitFlag = this.tableList.some((x) => !this.$resultOfBoolean(x.pricingUnit))
      if (pricingUnitFlag) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.pricingUnit')))
        return
      }

      const unitPriceFlag = this.tableList.some((x) => !this.$resultOfBoolean(x.unitPrice))
      if (unitPriceFlag) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return
      }

      this.collapseWarningForBasicInfo = false

      this.$modal
        .confirm(this.$t('SALES.servicePriceListSubmitConfirm'))
        .then(() => {
          const params = this.$trimOfObj(JSON.parse(JSON.stringify(this.tableList)))
          return saveServicePriceStrategy(params)
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('SALES.servicePriceListSubmitSuccess'))
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
