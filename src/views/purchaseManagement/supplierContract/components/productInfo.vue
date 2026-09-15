<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-if="!formData.purchaseOrderNo"
          :disabled="!formData.businessPartnerId"
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
      :cell-class-name="tableCellClassName"
      :key="'tableKey' + formData.purchaseOrderNo + modifyHighlight"
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
              ['purchaseUom', 'purchaseQty', 'unitPrice', 'committedDate'].includes(item.prop) &&
              !formData.purchaseOrderNo
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
          <template v-else-if="item.prop === 'internalPartNo'">
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'productType'">
            <!-- <span v-if="scope.row.productType === '1'">{{ $t('PURCHASE.product') }}</span> -->
            <!-- <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
            <span>{{ selectDictLabel(dict.type.product_type, scope.row.productType) }}</span>
          </template>
          <template v-else-if="item.prop === 'lineTotal'">{{
            $numberStr(scope.row.lineTotal, 2)
          }}</template>

          <template v-else-if="item.prop === 'purchaseUom'">
            <el-select
              style="width: 98%"
              v-model="scope.row.purchaseUom"
              :title="showUomLabel(scope.row[item.prop])"
              placeholder=""
              filterable
              @change="purchaseUomChange(scope.row)"
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

          <template v-else-if="item.prop === 'purchaseQty'">
            <el-input-number
              v-thousandSplit="{ precision: scope.row.decimalNum }"
              v-model="scope.row.purchaseQty"
              :precision="scope.row.decimalNum"
              :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
              :max="999999"
              style="width: 98%"
              controls-position="right"
              @change="purchaseQtyChange(scope.row)"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <div v-else-if="item.prop === 'unitPrice'">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-if="!comDisFrom"
              style="width: 98%"
              v-model="scope.row.unitPrice"
              controls-position="right"
              :precision="2"
              :min="0.01"
              :max="999999999999.99"
              @change="unitPriceChange(scope.row)"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </div>

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
              :placeholder="`1-${$numberStr(9999, 0)}`"
              style="width: 98%"
              controls-position="right"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>

          <template v-else-if="item.prop === 'committedDate'">
            <el-date-picker
              v-if="!comDisFrom"
              v-model="scope.row.committedDate"
              @change="changeExpectedDeliveryDate(scope.$index)"
              :format="fmtForYmd"
              value-format="timestamp"
              style="width: 98%"
              placeholder=""
              clearable
            ></el-date-picker>
            <template v-else>{{ parseTime(scope.row[item.prop], fmtForYmd) }}</template>
          </template>

          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
            />
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
        width="120"
        class-name="small-padding fixed-width"
        fixed="right"
        v-if="!formData.purchaseOrderNo && !comDisFrom"
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
import { calculateProductInventoryUnitPrice } from '@/api/purchaseManagement/purchaseContract'
import pageMixin from '@/mixins/tableMinx'
import tieredPricingList from '@/views/purchaseManagement/purchaseContract/components/tieredPricingList'
import purchasePriceAnalysis from '@/views/purchaseManagement/purchaseContract/components/purchasePriceAnalysis'
import selectProductTable from '@/views/purchaseManagement/supplierContract/components/selectProductTable'

export default {
  dicts: ['product_type'],
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
    // 'productInfoForm.supplierContractId': {
    //   handler(newValue) {
    //     this.initPurchaseContractDetailList()
    //   },
    //   deep: false
    // },
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
      saveKey: '3',
      savePath: 'productInfo',
      // 总条数
      total: 0,
      /* 表格部分 */
      columns: [
        {
          prop: 'productType',
          label: vm.$t('PURCHASE.productClass'),
          visible: true,
          width: 150,
          tooltip: true,
          fixed: true
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
          prop: 'documentNo',
          label: vm.$t('PURCHASE.pqPcNo'),
          visible: true,
          minWidth: 160
        },
        {
          prop: 'externalPartNo',
          label: vm.$t('PURCHASE.externalPartNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PRODUCT.purchaseUOM1'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'moq',
          label: vm.$t('PRODUCT.moq'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          padding: 60,
          minWidth: 160
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('PURCHASE.lineTotal'),
          visible: true,
          fixedWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'leadTime',
          label: vm.$t('PURCHASE.deliveryDate1'),
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
          prop: 'committedDate',
          label: vm.$t('PURCHASE.expectedDeliveryDate'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'purchaseRequisiteListShowStr',
          label: vm.$t('PURCHASE.DocNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
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
    console.log('1111112')
  },
  methods: {
    nav(row) {
      this.$router.push({
        path: '/productManagement/viewExtendedProductInfo',
        query: {
          id: row.productMainId,
          timeId: Date.now()
        }
      })
    },
    purchaseQtyChange(row) {
      this.getLineTotal(row)
    },
    unitPriceChange(row) {
      this.getLineTotal(row)
    },
    getLineTotal(row) {
      if (row.unitPrice && row.purchaseQty) {
        const lineTotal = row.unitPrice * row.purchaseQty
        this.$set(row, 'lineTotal', lineTotal)
      } else {
        this.$set(row, 'lineTotal', undefined)
      }
    },
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
          case 'purchaseQty':
            item.fixedWidth = vm.comDisFrom ? undefined : 150
            break
          case 'unitPrice':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            item.tooltip = vm.comDisFrom
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
          case 'deliveryDate':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
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
          case 'committedDate':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
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
    getDetailList() {
      return this.tableList
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

    changeExpectedDeliveryDate(index) {
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.committedDate) {
          const oldCommittedDate = this.tableList.find(
            (item, index) => index > 0 && item.committedDate
          )
          if (oldCommittedDate) {
            const msg = this.parseTime(topRow.committedDate, this.fmtForYmd)
            this.$modal
              .confirm(this.$t('PURCHASE.committedDateConfirm').replace('$1', msg))
              .then(() => {
                this.tableList.forEach((row) => {
                  this.$set(row, 'committedDate', topRow.committedDate)
                })
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'committedDate', topRow.committedDate)
            })
          }
        }
      }
    },

    handleAdd(row) {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      const tableList = JSON.parse(JSON.stringify(this.tableList))

      this.$refs.selectProductTable.handleAdd(tableList)
    },
    updateTable(list) {
      const rows = JSON.parse(JSON.stringify(list))
      this.tableList.forEach((row) => {
        const index = rows.findIndex((item) => row[this.rowIdKey] === item[this.rowIdKey])
        if (index !== -1) {
          rows[index] = row
        }
      })
      this.tableList = rows

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
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
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
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.prProductTableEmpty'))
        )
        return false
      }

      if (!this.formData.purchaseOrderNo) {
        const purchaseUom = this.tableList.find((x) => !x.purchaseUom)
        if (purchaseUom) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.purchaseUOM1'))
          )
          return false
        }

        const purchaseQtyReq = this.tableList.find((x) => !x.purchaseQty)
        if (purchaseQtyReq) {
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qty')))
          return false
        }

        const unitPriceReq = this.tableList.find((x) => !x.unitPrice)
        if (unitPriceReq) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.unitPrice'))
          )
          return false
        }

        const committedDateReq = this.tableList.find((x) => !x.committedDate)
        if (committedDateReq) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.expectedDeliveryDate'))
          )
          return false
        }
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
