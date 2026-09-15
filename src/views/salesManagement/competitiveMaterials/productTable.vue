<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-button
          :loading="btnLoading"
          @click="handleAddBtn"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>
    <el-table
      border
      ref="tables"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
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
        class-name="allowDrag"
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
          <span v-if="['competitorPrice'].includes(item.prop) && !rowId">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else-if="['competitor', 'competitorPrice'].includes(item.prop) && rowId">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>

        <template slot-scope="scope">
          <template v-if="item.prop === 'competitorName'">
            <template v-if="!comDisFrom">
              <el-input
                style="width: 98%"
                v-model="scope.row.competitorName"
                maxlength="50"
                @input="
                  scope.row.competitorNameError = false
                  scope.row['ROW-ERROR'] = false
                "
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'competitor'">
            <template v-if="!comDisFrom && !scope.row.competitorId">
              <el-input
                style="width: 98%"
                v-model="scope.row.competitor"
                maxlength="50"
                @input="
                  scope.row.competitorError = false
                  scope.row['ROW-ERROR'] = false
                "
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'description'">
            <el-input
              v-if="!comDisFrom && !scope.row.competitorId"
              style="width: 98%"
              v-model="scope.row.description"
              maxlength="200"
            />
            <template v-else>
              <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
            </template>
          </template>
          <template v-else-if="item.prop === 'competitorBrand'">
            <template v-if="!comDisFrom">
              <el-input
                style="width: 98%"
                v-model="scope.row.competitorBrand"
                maxlength="50"
                @input="
                  scope.row.competitorBrandError = false
                  scope.row['ROW-ERROR'] = false
                "
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'competitorPrice'">
            <template v-if="!comDisFrom">
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                style="width: 98%"
                v-model="scope.row.competitorPrice"
                controls-position="right"
                :precision="2"
                :min="1"
                :max="999999999"
                @change="competitorPriceChange(scope.row)"
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'percentage'">
            <span v-if="scope.row[item.prop] !== undefined">
              {{ $numberStr(scope.row[item.prop], 2) }}
              <svg-icon :icon-class="scope.row[item.prop] * 1 >= 0 ? 'up1' : 'down1'" />
            </span>
          </template>
          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
            />
          </template>
          <template v-else-if="item.prop === 'priceDifference'">
            {{ $numberStr(scope.row[item.prop], 2) }}
          </template>
          <template v-else-if="item.prop === 'recommendedRetailPrice'">
            {{ $numberStr(scope.row[item.prop], 2) }}
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="flexStart">
            <div class="flexCen flex-1">
              <i
                class="el-icon el-icon-s-data pointer"
                style="font-size: 20px; color: #1890ff"
                @click="handleChart(scope.$index, scope.row)"
                v-if="rowId && scope.row.competitorId"
              ></i>
            </div>
            <div class="flexCen flex-1">
              <i
                class="el-icon el-icon-delete pointer"
                style="font-size: 20px; color: #f56c6c"
                :title="$t('uiBtn.delete')"
                @click="handleDelRow(scope.$index, scope.row)"
              ></i>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <selectProductTable
      ref="selectProductTable"
      :businessPartnerId="businessPartnerId"
      @onSuccess="updateTable"
    />
    <chartDlg ref="chartDlg" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from './selectProductTable'
import chartDlg from './chartDlg'

export default {
  mixins: [pageMixin],
  components: {
    selectProductTable,
    chartDlg
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    linkRFQ: {
      type: Boolean,
      default: false
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    pqProductList: {
      type: Array,
      default() {
        return []
      }
    },
    countryId: {
      type: String,
      default: ''
    },
    businessPartnerId: {
      type: String,
      default: ''
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    rowId: {
      type: String,
      default: ''
    },
    competitorData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    pqProductList: {
      immediate: true,
      handler: function () {
        if (!this.rowId) {
          this.columns = this.columns1
        } else {
          this.columns = this.columns2
        }
        this.tableList = JSON.parse(JSON.stringify(this.pqProductList))
        // this.changeTableList()
        this.initColumnWidth()
      }
    },
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '12',
      savePath: 'salesMTable',
      columns: [],
      columns1: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
          visible: true,
          minWidth: 160,
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
          prop: 'recommendedRetailPrice',
          label: vm.$t('SALES.recommendedRetailPrice'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'competitorName',
          label: vm.$t('SALES.name'),
          visible: true,
          minWidth: 140,
          fixedWidth: vm.comDisFrom ? undefined : 140,
          tooltip: true
        },
        {
          prop: 'competitorBrand',
          label: vm.$t('PRODUCT.brand'),
          visible: true,
          minWidth: 140,
          fixedWidth: vm.comDisFrom ? undefined : 140,
          tooltip: true
        },
        {
          prop: 'competitorPrice',
          label: vm.$t('SALES.competitivePrice'),
          visible: true,
          minWidth: 140,
          fixedWidth: vm.comDisFrom ? undefined : 140,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          fixedWidth: vm.comDisFrom ? undefined : 200,
          tooltip: false
        }
      ],
      columns2: [
        {
          prop: 'competitor',
          label: vm.$t('menu.competitor'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixedWidth: vm.comDisFrom ? undefined : 140
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          fixedWidth: vm.comDisFrom ? undefined : 200
        },
        {
          prop: 'competitorName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          fixedWidth: vm.comDisFrom ? undefined : 140
        },
        {
          prop: 'competitorBrand',
          label: vm.$t('SALES.brand'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          fixedWidth: vm.comDisFrom ? undefined : 140
        },
        {
          prop: 'competitorPrice',
          label: vm.$t('SALES.competitivePrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          fixedWidth: vm.comDisFrom ? undefined : 140
        },
        {
          prop: 'priceDifference',
          label: vm.$t('SALES.priceMargin'),
          visible: true,
          width: 120,
          align: 'right',
          tooltip: true
        },
        {
          prop: 'percentage',
          label: vm.$t('SALES.difference'),
          visible: true,
          width: 100,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          fixedWidth: vm.comDisFrom ? undefined : 200
        }
      ],
      tableList: [],
      rowIdKey: 'productId',
      btnLoading: false
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    competitorPriceChange(row) {
      this.$set(row, 'competitorPriceError', false)
      this.$set(row, 'ROW-ERROR', false)

      const { recommendedRetailPrice } = this.competitorData
      const { competitorPrice } = row
      if (competitorPrice && recommendedRetailPrice) {
        const priceDifference = competitorPrice * 1 - recommendedRetailPrice * 1
        const percentage = (priceDifference * 100) / recommendedRetailPrice
        this.$set(row, 'priceDifference', priceDifference)
        this.$set(row, 'percentage', percentage)
      } else {
        this.$set(row, 'priceDifference', undefined)
        this.$set(row, 'percentage', undefined)
      }
    },
    initColumnWidth() {
      const vm = this
      const flag = this.tableList.some((x) => x.isAdd === '1')
      if (flag) {
        this.columns.forEach((item) => {
          const prop = item.prop
          switch (prop) {
            case 'competitor':
              item.fixedWidth = 140
              break
            case 'description':
              item.fixedWidth = 200
              break
            case 'competitorName':
              item.fixedWidth = 140
              break
            case 'competitorBrand':
              item.fixedWidth = 140
              break
            case 'competitorPrice':
              item.fixedWidth = 200
              break
            case 'remarks':
              item.fixedWidth = 200
              break
          }
        })
      } else {
        this.columns.forEach((item) => {
          const prop = item.prop
          switch (prop) {
            case 'competitorPrice':
              item.fixedWidth = vm.comDisFrom ? undefined : 200
              break
            case 'competitorName':
              item.fixedWidth = vm.comDisFrom ? undefined : 140
              break
            case 'competitorBrand':
              item.fixedWidth = vm.comDisFrom ? undefined : 140
              break
            case 'remarks':
              item.fixedWidth = vm.comDisFrom ? undefined : 200
              break
          }
        })
      }
    },
    errorMessage(code) {
      // this.tableList.forEach((item) => {
      //   if (!this.$resultOfBoolean(item[code])) {
      //     this.$set(item, code + 'Error', true)
      //   }
      // })

      let rowIndex
      this.tableList.forEach((item, index) => {
        if (code && !this.$resultOfBoolean(item[code])) {
          this.$set(item, 'ROW-ERROR', true)
          this.$set(item, code + 'Error', true)
          if (!this.$resultOfBoolean(rowIndex)) {
            rowIndex = index
          }
        } else {
          this.$set(item, 'ROW-ERROR', false)
          if (code) {
            this.$set(item, code + 'Error', false)
          } else {
            Object.keys(item).forEach((key) => {
              if (key.endsWith('Error')) {
                this.$set(item, key, false)
              }
            })
          }
        }
      })
      this.$nextTick(() => {
        this.scrollToErrorColumn()
      })
    },
    initList(list) {
      this.tableList = JSON.parse(JSON.stringify(list))
    },
    getList() {
      return this.tableList
    },
    handleAddBtn() {
      if (!this.rowId) {
        // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
        const tableList = JSON.parse(JSON.stringify(this.tableList))
        this.$refs.selectProductTable.handleAdd(tableList)
      } else {
        this.btnLoading = true
        this.tableList.push({
          competitor: undefined,
          description: undefined,
          competitorName: undefined,
          competitorBrand: undefined,
          competitorPrice: undefined,
          priceDifference: undefined,
          percentage: undefined,
          remarks: undefined,
          isAdd: '1'
        })
        this.initColumnWidth()
        setTimeout(() => {
          this.btnLoading = false
        }, 200)
      }
    },
    updateTable(list) {
      // if (list.length > 0) {
      const rows = JSON.parse(JSON.stringify(list))
      this.tableList.length = 0
      this.tableList.push(...rows)
      this.changeTableList()
      // }
    },
    changeTableList() {
      this.$emit('updateTable', this.tableList)
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    handleChart(index, row) {
      this.$refs.chartDlg.openChart(row)
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.initColumnWidth()
        this.changeTableList()
      })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (row['ROW-ERROR']) {
        color = 'required-row'
      }
      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (this.modifyHighlight) {
        if (row.updateType === '1') {
          if ((row.updateMsgList || []).find((item) => item.name === column.property)) {
            cellClass = 'edit-table-cell'
          }
        }
      }
      if (
        this.tableList.find((item) => !item[column.property] && item[column.property + 'Error'])
      ) {
        cellClass = 'is-required-table-cell'
      }
      return cellClass
    }
  }
}
</script>

<style></style>
