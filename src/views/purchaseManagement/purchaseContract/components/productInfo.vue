<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleAdd"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          :disabled="!productInfoForm.businessPartnerId"
          v-if="!comDisFrom"
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
      max-height="600px"
      :data="tableList"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
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
          <span
            v-if="
              item.prop === 'qty' ||
              item.prop === 'purchaseUom' ||
              item.prop === 'contractPrice' ||
              item.prop === 'leadTime' ||
              item.prop === 'warranty'
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'externalPartNo'">
            <el-input
              :title="scope.row.externalPartNo"
              style="width: 98%"
              v-model="scope.row.externalPartNo"
              :maxlength="50"
              v-if="!comDisFrom && scope.row.disExternalPartNo !== '1'"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'qty'">
            <el-input-number
              v-thousandSplit="{ precision: scope.row.decimalNum }"
              v-model="scope.row.qty"
              :precision="scope.row.decimalNum"
              :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
              :max="999999"
              style="width: 98%"
              controls-position="right"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseUom'">
            <el-select
              style="width: 98%"
              v-model="scope.row.purchaseUom"
              :title="showUomLabel(scope.row[item.prop])"
              placeholder=""
              @change="purchaseUomChange(scope.row)"
              filterable
              v-if="!comDisFrom"
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
          <template v-else-if="item.prop === 'contractPrice'">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-model="scope.row.contractPrice"
              :precision="2"
              :min="0.01"
              :max="999999999999.99"
              style="width: 98%"
              controls-position="right"
              @change="contractPriceChange(scope.row, scope.$index)"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'inventoryUnitPrice'">{{
            $numberStr(scope.row[item.prop], 2)
          }}</template>
          <template v-else-if="item.prop === 'moq'">
            <el-input-number
              v-thousandSplit="{ precision: scope.row.decimalNum }"
              v-model="scope.row.moq"
              :precision="scope.row.decimalNum"
              :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
              :max="999999"
              style="width: 98%"
              controls-position="right"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>
          <template v-else-if="item.prop === 'taxNo'">
            <el-select
              v-if="false"
              style="width: 98%"
              v-model="scope.row.taxNo"
              :loading="scope.row.taxLoading"
              @visible-change="
                (value) => {
                  taxNoVisible(value, scope.row)
                }
              "
              placeholder=""
            >
              <el-option
                v-for="item in scope.row.taxNoOptions || []"
                :key="item.taxNo"
                :label="item.taxNo"
                :value="item.taxNo"
              >
              </el-option>
            </el-select>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'leadTime'">
            <el-input-number
              v-thousandSplit="{ precision: 0 }"
              v-model="scope.row.leadTime"
              :precision="0"
              :min="1"
              :max="999"
              placeholder="1 - 999"
              style="width: 98%"
              controls-position="right"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>
          <template v-else-if="item.prop === 'warranty'">
            <el-input-number
              v-thousandSplit="{ precision: 0 }"
              v-model="scope.row.warranty"
              :precision="0"
              :min="1"
              :max="9999"
              :placeholder="`1 - ${$numberStr(9999, 0)}`"
              style="width: 98%"
              controls-position="right"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>
          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
            />
          </template>
          <template v-else-if="item.prop === 'categoryNameShowStr'">
            <ToolTipShowCategory :list="scope.row.categoryNameList || []">
              <div class="flow1">{{ scope.row[item.prop] }}</div>
            </ToolTipShowCategory>
          </template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        min-width="120"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-popover placement="left" trigger="hover" :disabled="elPopoverDisabled(scope.row)">
            <div class="tip-list-box">
              <div
                v-for="(item, index) in handlerDetails(scope.row)"
                :key="index"
                class="tip-list-item"
              >
                <b class="tip-list-title">{{ $t('PURCHASE.qty') }}</b> : <span>{{ item.qty }}</span>
                <br />
                <b class="tip-list-title">{{ $t('PURCHASE.lineDiscount') }}</b> :
                <span>{{ item.lineDiscount }}</span>
              </div>
            </div>
            <el-button
              v-show="Number(productInfoForm.contractType) === 2 && !!scope.row.contractPrice"
              icon="el-icon-s-data"
              type="text"
              size="mini"
              style="font-size: 20px; margin-right: 10px"
              slot="reference"
              @click="handleShare(scope.$index, scope.row)"
            ></el-button>
          </el-popover>
          <!-- <el-button
            v-if="Number(productInfoForm.contractType) === 2 && !!scope.row.contractPrice"
            icon="el-icon-s-data"
            type="text"
            size="mini"
            style="font-size: 20px"
            @click="handleShare(scope.$index, scope.row)"
          ></el-button> -->
          <el-button
            icon="el-icon-delete"
            type="text"
            size="mini"
            :disabled="comDisFrom"
            style="font-size: 20px; color: #f56c6c"
            @click="handleDelRow(scope.$index, scope.row)"
            v-if="!(scope.row.id && comDisFrom)"
          ></el-button>
          <el-button
            icon="el-icon-s-marketing"
            type="text"
            size="mini"
            style="font-size: 20px"
            v-if="false"
            @click="handleData(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 产品列表 -->
    <!-- 阶梯定价表 -->
    <tieredPricingList ref="tieredPricingList" :isEditStatus="!comDisFrom" @onSuccess="updateRow" />
    <!-- 采购价格分析 -->
    <purchasePriceAnalysis
      ref="purchasePriceAnalysis"
      :internal-part-no="curInternalPartNo"
      :currency-id="currencyId"
    ></purchasePriceAnalysis>

    <selectProductTable
      ref="selectProductTable"
      :businessPartnerId="productInfoForm.businessPartnerId"
      @onSuccess="updateTable"
    />
  </div>
</template>

<script>
import { queryAllTaxForPurchase } from '@/api/purchaseManagement/purchaseQuotation'
import { calculateProductInventoryUnitPrice } from '@/api/purchaseManagement/purchaseContract'
import pageMixin from '@/mixins/tableMinx'
import tieredPricingList from '@/views/purchaseManagement/purchaseContract/components/tieredPricingList'
import purchasePriceAnalysis from '@/views/purchaseManagement/purchaseContract/components/purchasePriceAnalysis'
import selectProductTable from '@/views/purchaseManagement/purchaseContract/components/selectProductTable'

export default {
  components: {
    tieredPricingList,
    purchasePriceAnalysis,
    selectProductTable
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
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.productInfoForm = newValue || {}
      }
    },
    'productInfoForm.businessPartnerId': {
      handler(newValue) {
        this.initPurchaseContractDetailList()
      },
      deep: false
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
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 160,
          tooltip: false
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 160,
        //   tooltip: true
        // },
        {
          prop: 'externalPartNo',
          label: vm.$t('PURCHASE.externalPartNo'),
          visible: true,
          minWidth: 160
        },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.productCategory1'),
          visible: true,
          minWidth: 160
          // tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('PRODUCT.purchaseQty'),
          visible: true,
          padding: 60,
          minWidth: 160
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PRODUCT.purchaseUOM1'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'contractPrice',
          label: vm.$t('PRODUCT.contractPrice'),
          visible: true,
          minWidth: 220,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'moq',
          label: vm.$t('PRODUCT.moq'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'taxNo',
          label: vm.$t('PRODUCT.taxNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'inventoryUom',
          label: vm.$t('PRODUCT.inventoryUOM1'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'inventoryUnitPrice',
          label: vm.$t('PRODUCT.inventoryPrice'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'leadTime',
          label: vm.$t('PRODUCT.leadTimeDays'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'warranty',
          label: vm.$t('PRODUCT.warrantyDays'),
          visible: true,
          minWidth: 160,
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
      curInternalPartNo: '',
      detailPriceList: [],
      productInfoForm: {},
      rowIdKey: 'productId'
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
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    purchaseUomChange(row) {
      this.contractPriceChange(row)
    },
    contractPriceChange(row, index) {
      const { productMainId, purchaseUom, contractPrice } = row
      if (!contractPrice) {
        this.$set(row, 'inventoryUnitPrice', undefined)
        return
      }
      calculateProductInventoryUnitPrice({
        productId: productMainId,
        oldUom: purchaseUom,
        unitPrice: contractPrice
      }).then((res) => {
        const { newUnitPrice } = res.data
        this.$set(row, 'inventoryUnitPrice', newUnitPrice)
      })
    },
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'externalPartNo':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'qty':
            item.fixedWidth = vm.comDisFrom ? undefined : 150
            break
          case 'purchaseUom':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'contractPrice':
            item.fixedWidth = vm.comDisFrom ? undefined : 220
            break
          case 'moq':
            item.fixedWidth = vm.comDisFrom ? undefined : 150
            break
          case 'taxNo':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'deliveryDate':
            item.colMinWidth = vm.comDisFrom ? undefined : 160
            break
          case 'inventoryUnitPrice':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
            break
          case 'leadTime':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'warranty':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    initPurchaseContractDetailList(data = []) {
      this.tableList = data
      this.changeTableList()
    },
    handlerDetails(row) {
      return row.contractDetailTiereds || []
    },
    elPopoverDisabled(row) {
      const ta = row.contractDetailTiereds
      if (Array.isArray(ta)) {
        const len = ta.length
        if (len <= 0) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    handleAdd(row) {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      const tableList = JSON.parse(JSON.stringify(this.tableList))
      this.$refs.selectProductTable.handleAdd(tableList)
    },
    taxNoVisible(value, row) {
      const vm = this
      if (value) {
        const params = {
          countryId: vm.productInfoForm.countryId,
          productId: row.productId
        }
        if (!params.countryId) {
          return
        }
        this.$set(row, 'taxLoading', true)
        queryAllTaxForPurchase(params)
          .then((res) => {
            const list = res.data || []
            this.$set(row, 'taxNoOptions', list)
            this.$set(row, 'taxLoading', false)
          })
          .catch((err) => {
            this.$set(row, 'taxNoOptions', [])
            this.$set(row, 'taxLoading', false)
            window.console.error(err)
          })
      }
    },
    updateTable(list) {
      this.tableList = list
      this.changeTableList()

      // if (list.length > 0) {
      //   const rows = JSON.parse(JSON.stringify(list))
      //   this.tableList = [...this.tableList, ...rows]
      //   this.changeTableList()
      // }
    },
    updateRow(data, index) {
      this.$set(this.tableList[index], 'contractDetailTiereds', data)
      // console.log(this.tableList, '===')
    },
    handleShare(index, row) {
      this.$refs.tieredPricingList.handleOpen(row, index)
    },
    handleDelRow(index, row) {
      this.tableList.splice(index, 1)
      this.changeTableList()
    },
    changeTableList() {
      this.$emit('updateTable', this.tableList)
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    handleData(index, row) {
      this.$refs.purchasePriceAnalysis.handleOpen()
      this.curInternalPartNo = row.internalPartNo
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        }
        if (row.updateType === '3') {
          color = 'cancel-row'
        }
      }
      /* const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'table-SelectedRow-bgcolor'
      } */
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

      return cellClass
    },
    async productInfoSubmit() {
      if (this.tableList.length <= 0) {
        // PURCHASE.prProductTableEmpty
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.prProductTableEmpty'))
        )
        return false
      }
      const qty = this.tableList.find((x) => !x.qty)
      if (qty) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.purchaseQty'))
        )
        return false
      }

      const purchaseUom = this.tableList.find((x) => !x.purchaseUom)
      if (purchaseUom) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.purchaseUOM1'))
        )
        return false
      }

      const contractPrice = this.tableList.find((x) => !x.contractPrice)
      if (contractPrice) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.contractPrice'))
        )
        return false
      }

      const leadTime = this.tableList.find((x) => !x.leadTime)
      if (leadTime) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.leadTimeDays'))
        )
        return false
      }

      const warranty = this.tableList.find((x) => !x.warranty)
      if (warranty) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.warrantyDays'))
        )
        return
      }
      const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.tableList)))
      return param
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
