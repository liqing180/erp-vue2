<template>
  <div class="pb20">
    <el-table
      border
      :data="tableList"
      :max-height="600"
      :tree-props="{
        children: 'childProjectTemplateContentList',
        hasChildren: 'hasChildren'
      }"
      :default-expand-all="true"
      row-key="rowTimeId"
      ref="tables"
      class="hide-check-all"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
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
        :align="item.align || 'center'"
      >
        <template slot-scope="scope">
          <template v-if="item.prop === 'productName'">
            <span v-if="scope.row.productName">{{ scope.row.productName }}</span>
            <span v-else>{{
              scope.row.variationShowStr ||
              selectDictLabel(dict.type.mdm_variation, scope.row.variation)
            }}</span>
          </template>
          <template v-else-if="item.prop === 'productType'">
            <!-- <span v-if="scope.row.productType === '1'">{{ $t('PRODUCT.product') }}</span> -->
            <!-- <span v-if="scope.row.productType === '2'">{{ $t('PRODUCT.service') }}</span> -->
            <span>{{ selectDictLabel(dict.type.product_type, scope.row.productType) }}</span>
          </template>
          <template v-else-if="item.prop === 'qty'">{{ $numberStr(scope.row.qty, 3) }}</template>
          <template v-else-if="item.prop === 'purchaseUnitPrice'">{{
            $numberStr(scope.row.purchaseUnitPrice, 2)
          }}</template>
          <template v-else-if="item.prop === 'referenceAmount'">{{
            $numberStr(scope.row.referenceAmount, 2)
          }}</template>
          <template v-else-if="item.prop === 'totalCost'">{{
            $numberStr(scope.row.totalCost, 2)
          }}</template>
          <template v-else-if="item.prop === 'unitPrice'">{{
            $numberStr(scope.row[item.prop], 2)
          }}</template>
          <template v-else-if="item.prop === 'lineTotal'">{{
            $numberStr(scope.row[item.prop], 2)
          }}</template>
          <template v-else-if="item.prop === 'salesProfit'">{{
            $numberStr(scope.row[item.prop], 2)
          }}</template>
          <template v-else-if="item.prop === 'createdTime'">{{
            parseTime(scope.row.createdTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'modifiedTime'">{{
            parseTime(scope.row.modifiedTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
export default {
  dicts: ['mdm_variation', 'product_type'],
  mixins: [pageMixin],
  components: {},
  props: {
    comDisFrom: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.totalForm = newValue || { taxRate: undefined }
      }
    },
    'formData.salesQuotationProductList': {
      immediate: true,
      handler: function () {
        let timeId = Date.now()
        this.formData.salesQuotationProductList.forEach((item) => {
          timeId++
          this.$set(item, 'rowTimeId', timeId)
          item.childProjectTemplateContentList &&
            item.childProjectTemplateContentList.forEach((child) => {
              timeId++
              child.parentTimeId = item.rowTimeId
              child.rowTimeId = timeId++
              this.$set(child, 'parentTimeId', item.rowTimeId)
              this.$set(child, 'rowTimeId', timeId)
            })
        })
        this.tableList = this.formData.salesQuotationProductList
        this.changeTableList()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '21',
      savePath: 'materialListMixDesign',
      btnLoading: false,
      totalForm: {},
      tableList: [],
      selectList: [],
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          align: 'left'
        },
        {
          prop: 'productType',
          label: vm.$t('PRODUCT.productClass'),
          width: 150,
          visible: true,
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
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'uom',
          label: vm.$t('ui.uom'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('PRODUCT.qty'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          minWidth: 200,
          visible: true,
          tooltip: true
        }
      ],
      rules: {
        wastageRate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        adminRate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        markupRate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      },
      editRowVariation: undefined
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    selectable(row, rowIndex) {
      if (!row.productName) {
        return false
      }
      return true // 不禁用
    },
    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    }
  }
}
</script>

<style lang="scss" scoped></style>
