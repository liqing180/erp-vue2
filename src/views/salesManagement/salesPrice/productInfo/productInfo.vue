<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleAdd"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-if="!comDisFrom"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-if="!comDisFrom"
          >{{ $t('uiBtn.import') }}</el-button
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
      max-height="600px"
      :data="comTableList"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      row-key="rowTimeId"
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
          <span v-if="item.prop === 'salesRetailPrice' || item.prop === 'pricingUom'">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span
            v-else-if="
              item.prop === 'competitorPriceForMax' || item.prop === 'competitorPriceForMin'
            "
          >
            {{ column.label }}
            <svg-icon :icon-class="item.prop === 'competitorPriceForMin' ? 'down1' : 'up1'" />
          </span>

          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'pricingUom'">
            <el-select
              style="width: 98%"
              v-model="scope.row.pricingUom"
              :title="showUomLabel(scope.row.pricingUom)"
              placeholder=""
              @change="pricingUomChange(scope.row, scope.$index)"
              v-if="false"
              :loading="uomLoading"
            >
              <el-option
                v-for="item in scope.row.uomList || []"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <span v-else :title="showUomLabel(scope.row.pricingUom)">{{
              scope.row[item.prop]
            }}</span>
          </template>
          <template v-else-if="item.prop === 'salesRetailPrice'">
            <template v-if="!comDisFrom">
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                v-model="scope.row.salesRetailPrice"
                :precision="2"
                :min="0.01"
                :max="99999999.99"
                style="width: 98%"
                controls-position="right"
                @change="salesRetailPriceChange(scope.row, scope.$index)"
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'minRate'">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-model="scope.row.minRate"
              :precision="2"
              :min="0"
              :max="200"
              style="width: 98%"
              controls-position="right"
              @change="inputChange(scope.row, 'minRate')"
              :disabled="!scope.row.inventoryCost"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'minPrice'">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-model="scope.row.minPrice"
              :precision="2"
              :min="0"
              :max="scope.row.salesRetailPrice || 100"
              style="width: 98%"
              controls-position="right"
              :disabled="!scope.row.salesRetailPrice || !scope.row.inventoryCost"
              @change="inputChange(scope.row, 'minPrice')"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'maxRate'">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-model="scope.row.maxRate"
              :precision="2"
              :min="0"
              :max="999.99"
              style="width: 98%"
              controls-position="right"
              @change="inputChange(scope.row, 'maxRate')"
              :disabled="!scope.row.inventoryCost"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'maxPrice'">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-model="scope.row.maxPrice"
              :precision="2"
              :min="scope.row.salesRetailPrice || 0"
              :max="
                scope.row.salesRetailPrice
                  ? (scope.row.salesRetailPrice * 9.9999).toFixed(2) * 1
                  : 9999999999999.99
              "
              style="width: 98%"
              controls-position="right"
              :disabled="!scope.row.salesRetailPrice || !scope.row.inventoryCost"
              @change="inputChange(scope.row, 'maxPrice')"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'inventoryCost'">{{
            $numberStr(scope.row[item.prop], 2)
          }}</template>

          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="300"
              :disabled="comDisFrom"
            />
          </template>
          <template
            v-else-if="
              ['competitorPriceForMax', 'competitorPriceForMin', 'recommendedRetailPrice'].indexOf(
                item.prop
              ) !== -1
            "
          >
            {{ $numberStr(scope.row[item.prop], 2) }}
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        min-width="60"
        class-name="small-padding fixed-width"
        fixed="right"
        v-if="!comDisFrom"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.$index, scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :saveKey="saveKey"
      :savePath="savePath"
      v-show="comTotal > 0"
      :total="comTotal"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    />

    <selectProductTable ref="selectProductTable" @onSuccess="updateTable" />
    <ImportExcelDlg
      ref="importDlg"
      :importOptions="importOptions"
      :formData="formData"
      :alreadyProductIdList="tableList.map((item) => item[rowIdKey])"
      @onSuccess="updateTableList"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from './selectProductTable'
import { dealAddProductMsg } from '@/api/salesManagement/salesPrice'
import ImportExcelDlg from './importDlg.vue'

export default {
  components: {
    selectProductTable,
    ImportExcelDlg
  },
  mixins: [pageMixin],
  props: {
    currencyId: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'formData.salesPriceProductList': {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.tableList = this.setRowTimeId(newValue || [])
        this.changeTableList()
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
      saveKey: '5',
      savePath: 'purchaseMTable',
      // 总条数
      total: 0,
      /* 表格部分 */
      columns: [
        {
          prop: 'salesPartNo',
          label: vm.$t('SALES.salesPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
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
          prop: 'pricingUom',
          label: vm.$t('SALES.pricingUnit'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'competitorPriceForMax',
          label: vm.$t('SALES.competitorPricingHigh'),
          fixedWidth: 160,
          visible: true,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'competitorPriceForMin',
          label: vm.$t('SALES.competitorPricingLow'),
          fixedWidth: 160,
          visible: true,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'inventoryCost',
          label: vm.$t('SALES.costOfGoods'),
          fixedWidth: 160,
          visible: true,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'recommendedRetailPrice',
          label: vm.$t('SALES.recommendedRetailPrice'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'salesRetailPrice',
          label: vm.$t('SALES.salesPrice'),
          visible: true,
          minWidth: 220,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'minRate',
          label: vm.$t('SALES.minRate'),
          fixedWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'minPrice',
          label: vm.$t('SALES.minimumPriceFloor'),
          fixedWidth: 180,
          visible: true,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'maxRate',
          label: vm.$t('SALES.maxRate'),
          fixedWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'maxPrice',
          label: vm.$t('SALES.maximumPriceCeiling'),
          fixedWidth: 180,
          visible: true,
          tooltip: true,
          padding: 50,
          align: 'right'
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
      curInternalPartNo: '',
      detailPriceList: [],
      productInfoForm: {},
      rowIdKey: 'salesPartId',
      // 导入
      importOptions: {
        // 下载模板
        // downFileUrl: '/sales/salesPrice/downTemplate',
        downFileUrl: 'sales/salesPrice/downTemplateAndData',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/sales/salesPrice/checkImportData',
        // 提交导入
        importUrl: '/sales/salesPrice/importData',
        // 下载文件名
        fileName: 'Sales Price'
      },
      uomLoading: false
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    comTotal() {
      return this.tableList.length
    },
    comTableList() {
      const pageNum = this.queryParams.pageNum
      const pageSize = this.queryParams.pageSize
      // const total = this.comTotal
      const startIndex = (pageNum - 1) * pageSize
      const endIndex = pageNum * pageSize
      return this.tableList.slice(startIndex, endIndex)
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    salesRetailPriceChange(row, index) {
      this.$set(row, 'salesRetailPriceError', false)
      this.$set(row, 'ROW-ERROR', false)

      const { salesRetailPrice } = row
      if (salesRetailPrice) {
        if (row.minPrice && row.minPrice > row.salesRetailPrice) {
          this.$set(row, 'minPrice', row.salesRetailPrice)
          setTimeout(() => {
            if (row.inventoryCost) {
              const minRate = (row.minPrice * 100) / (row.inventoryCost.toFixed(2) || 0)
              console.log(minRate, '==========487')
              this.$set(row, 'minRate', minRate)
            }
          }, 100)
        }
        if (row.maxPrice && row.maxPrice < row.salesRetailPrice) {
          this.$set(row, 'maxPrice', row.salesRetailPrice)
          setTimeout(() => {
            if (row.inventoryCost) {
              const maxRate = (row.maxPrice * 100) / (row.inventoryCost.toFixed(2) || 0)
              console.log(maxRate, '==========497')
              this.$set(row, 'maxRate', maxRate)
            }
          }, 100)
        }
      }
    },
    inputChange(row, code) {
      const { inventoryCost } = row
      if (inventoryCost) {
        if (code === 'minRate') {
          const minPrice = (inventoryCost.toFixed(2) * (row.minRate || 0)) / 100
          this.$set(row, 'minPrice', parseFloat(minPrice.toFixed(2)))
        } else if (code === 'minPrice') {
          const minRate = (row.minPrice / inventoryCost.toFixed(2)) * 100
          this.$set(row, 'minRate', parseFloat(minRate.toFixed(2)))
        } else if (code === 'maxRate') {
          const maxPrice = (inventoryCost.toFixed(2) * (row.maxRate || 0)) / 100
          this.$set(row, 'maxPrice', parseFloat(maxPrice.toFixed(2)))
        } else if (code === 'maxPrice') {
          const maxRate = (row.maxPrice / inventoryCost.toFixed(2)) * 100
          this.$set(row, 'maxRate', parseFloat(maxRate.toFixed(2)))
        }
        setTimeout(() => {
          if (row.inventoryCost) {
            if (row.minPrice && row.minPrice > row.salesRetailPrice) {
              const minRate = ((row.minPrice * 100) / (row.inventoryCost.toFixed(2) || 0)).toFixed(
                2
              )
              this.$set(row, 'minRate', minRate)
            }

            if (row.maxPrice && row.maxPrice < row.salesRetailPrice) {
              const maxRate = ((row.maxPrice * 100) / (row.inventoryCost.toFixed(2) || 0)).toFixed(
                2
              )
              this.$set(row, 'maxRate', maxRate)
            }

            if (
              code === 'minRate' &&
              ((inventoryCost.toFixed(2) * (row.minRate || 0)) / 100).toFixed(2) !==
                row.minPrice.toFixed(2)
            ) {
              const minRate = ((row.minPrice * 100) / (row.inventoryCost.toFixed(2) || 0)).toFixed(
                2
              )
              this.$set(row, 'minRate', minRate)
            }

            if (
              code === 'maxRate' &&
              ((inventoryCost.toFixed(2) * (row.maxRate || 0)) / 100).toFixed(2) !==
                row.maxPrice.toFixed(2)
            ) {
              const maxRate = ((row.maxPrice * 100) / (row.inventoryCost.toFixed(2) || 0)).toFixed(
                2
              )
              this.$set(row, 'maxRate', maxRate)
            }
          }
        }, 100)
      }
    },
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'salesRetailPrice':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          /* case 'pricingUom':
            item.fixedWidth = vm.comDisFrom ? undefined : 150
            break */
          case 'remarks':
            item.colMinWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    pricingUomChange(row, index) {
      this.uomLoading = true
      dealAddProductMsg({ salesPriceProductList: [row] }).then((res) => {
        const { salesPriceProductList } = res.data
        this.$set(this.tableList, index, salesPriceProductList[0])
        this.uomLoading = false
      })
    },
    handleAdd(row) {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      const tableList = JSON.parse(JSON.stringify(this.tableList))
      this.$refs.selectProductTable.handleAdd(tableList)
    },
    updateTable(list) {
      // if (list.length > 0) {
      const rows = this.setRowTimeId(JSON.parse(JSON.stringify(list)))
      this.tableList.length = 0
      this.tableList.push(...rows)
      // this.$set(this.tableList[0], 'inventoryCost', 100)
      this.changeTableList()
      // }
    },
    handleDelRow(index, row) {
      const findindex = this.tableList.findIndex(
        (item) => item[this.rowIdKey] === row[this.rowIdKey]
      )
      this.tableList.splice(findindex, 1)
      this.changeTableList()
    },
    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    setRowTimeId(list) {
      const rows = Array.isArray(list) ? list : []
      const rowTimeId = Date.now()
      rows.forEach((item, index) => {
        if (!item.rowTimeId) {
          this.$set(
            item,
            'rowTimeId',
            item.salesPriceProductId || item.salesPartId || `sales-price-${rowTimeId}-${index}`
          )
        }
      })
      return rows
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        } else if (row.updateType === '3') {
          color = 'cancel-row'
        }
      }
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
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
    },
    updateTableList(e) {
      const { data } = e
      const newTableList = this.setRowTimeId(data || [])
      this.tableList = newTableList
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    navPageForIndex(index) {
      const pageNum = Math.floor(index / this.queryParams.pageSize) + 1
      this.$set(this.queryParams, 'pageNum', pageNum)
    },
    errorMessage(code) {
      this.$emit('scrollPageToTable')
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
    }
  }
}
</script>

<style lang="scss" scoped>
.tip-list-box {
  max-height: 500px;
  // overflow-x: hidden;
  // overflow-y: scroll;
  overflow: hidden auto;

  .tip-list-item:not(:last-child) {
    margin-bottom: 20px;
    line-height: 20px;
    vertical-align: middle;
  }

  .tip-list-title {
    display: inline-block;
    // min-width: 120px;
    text-align: left;
  }
}
</style>
