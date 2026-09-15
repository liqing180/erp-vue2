<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>

      <search-form
        ref="searchForm"
        v-model="queryParams"
        :searchData="searchData"
        :handleQuery="handleSearchForm"
        :resetQuery="resetSearchForm"
        :showCustom="false"
        :topShowCount="1"
        :isProductCustomSearch="true"
      />
    </el-row>

    <el-table
      border
      ref="tables"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :data="tableList"
      @sort-change="handleSortChange"
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
        :min-width="getMinWidth(item)"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-if="item.prop === 'isActive'"
            v-model="scope.row.isActive"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <el-switch
            v-else-if="item.prop === 'isDefault'"
            v-model="scope.row.isDefault"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template v-else-if="item.prop === 'internalPartNo'">
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'businessPartnerName'">
            <!-- <span class="primary-link" @click="nav(scope.row, 'businessPartnerName')">
              {{ scope.row.businessPartnerName }}
            </span> -->
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="businessPartner"
              @click="nav(scope.row, 'businessPartnerName')"
            />
          </template>
          <template v-else-if="item.prop === 'purchaseQuotationNo'">
            <span class="primary-link" @click="nav(scope.row, 'purchaseQuotationNo')">{{
              scope.row.purchaseQuotationNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'documentNo'">
            <!-- <span class="primary-link" @click="nav(scope.row, 'documentNo')">{{
              scope.row.documentNo
            }}</span> -->
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="purchaseQuotation"
              @click="nav(scope.row, 'documentNo')"
              v-if="scope.row.priceType === '1'"
            />
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="purchaseContract"
              @click="nav(scope.row, 'documentNo')"
              v-if="scope.row.priceType === '2'"
            />
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="purchaseOrder"
              @click="nav(scope.row, 'documentNo')"
              v-if="scope.row.priceType === '3'"
            />
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            {{ $numberStr(scope.row.unitPrice, 2) }}
          </template>
          <template v-else-if="item.prop === 'purchaseQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseUom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'categoryNameShowStr'">
            <ToolTipShowCategory :list="scope.row.categoryNameList || []">
              <div class="flow1">{{ scope.row[item.prop] }}</div>
            </ToolTipShowCategory>
          </template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
export default {
  mixins: [pageMixin],
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    showPdf: {
      type: Boolean,
      default: false
    },
    rfqVendorList: {
      type: Array,
      default() {
        return []
      }
    },
    productIdList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    rfqVendorList: {
      immediate: true,
      handler: function (selected) {
        this.createTableList = JSON.parse(JSON.stringify(this.rfqVendorList))
        this.tableList = this.createTableList
        this.changeTableList()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '3',
      savePath: 'purchaseMTable',
      columns: [
        {
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('PURCHASE.supplierCode'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 170,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'incotermAbbreviation',
          label: vm.$t('PURCHASE.incoterm'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'priceType',
          propBy: 'priceTypeStr',
          label: vm.$t('PURCHASE.priceType'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.purchaseQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'receiveAddressName',
          label: vm.$t('PURCHASE.deliveryAddress'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'validity',
          label: vm.$t('PURCHASE.validityDays'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'quoteFrom',
          propBy: 'quoteFromStr',
          label: vm.$t('PURCHASE.quoteFrom'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.priceSource'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'businessPartnerId',
      searchData: [
        {
          name: 'condition',
          placeholder: `${vm.$t('PURCHASE.supplierName')} / ${vm.$t('ui.code')}  / ${vm.$t(
            'PURCHASE.projectCode'
          )}`,
          type: 'InputEle'
        }
      ],
      // 查询参数
      queryParams: {
        condition: undefined
      },
      createTableList: []
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleSortChange({ prop, order }) {
      this.handlerTableList()
      if (!prop || !order) {
        this.tableList = (this.tableList || []).slice().sort((a, b) => {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        })
        return
      }
      // 根据排序字段和顺序对数据进行排序（保留稳定性：相等时回退到 _stableIndex）
      this.tableList = (this.tableList || []).slice().sort((a, b) => {
        const valueA = a[prop] !== undefined && a[prop] !== null ? a[prop] : ''
        const valueB = b[prop] !== undefined && b[prop] !== null ? b[prop] : ''

        if (valueA === valueB) {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        }

        if (order === 'ascending') {
          return valueA > valueB ? 1 : -1
        } else if (order === 'descending') {
          return valueA < valueB ? 1 : -1
        }
        return 0
      })
    },

    handlerTableList() {
      // let table = JSON.parse(JSON.stringify(this.createTableList))
      let table = this.createTableList
      if (this.queryParams.condition) {
        table = table.filter((item) => {
          return this.$isContain(this.queryParams.condition, [
            item.businessPartnerName,
            item.businessPartnerNo,
            item.costProjectCode
          ])
        })
      }
      // 确保每行有稳定索引，用于取消排序时恢复原始顺序
      table.forEach((row) => {
        if (row && row._stableIndex === undefined) {
          this._stableCounter = (this._stableCounter || 0) + 1
          this.$set(row, '_stableIndex', this._stableCounter)
        }
      })
      this.tableList = table
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.handlerTableList()
    },
    /** 重置 */
    resetSearchForm() {
      this.$refs.tables && this.$refs.tables.clearSort()
    },
    initList(list) {
      this.createTableList = JSON.parse(JSON.stringify(list))
      this.tableList = this.createTableList
      // reset stable counter when clearing lists
      this._stableCounter = 0
    },
    getList() {
      return this.createTableList
    },
    changeTableList() {
      this.$emit('updateTable', this.createTableList)
      this.$$getColumnContentMaxWidth(this.columns, this.createTableList)
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'table-SelectedRow-bgcolor'
      }
      return color
    },
    nav(row, type) {
      if (type === 'businessPartnerName') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.businessPartnerId,
            timeId: Date.now()
          }
        })
      } else if (type === 'internalPartNo') {
        this.$router.push({
          path: '/productManagement/viewExtendedProductInfo',
          query: {
            id: row.productId,
            timeId: Date.now()
          }
        })
      } else if (type === 'purchaseQuotationNo') {
        console.log('object')
      } else if (type === 'documentNo') {
        switch (row.priceType) {
          case '1': // PQ
            this.$router.push({
              path: '/purchaseManagement/viewPurchaseQuotation',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '2': // PC
            this.$router.push({
              path: '/purchaseManagement/viewPurchaseContract',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '3': // PO
            this.$router.push({
              path: '/purchaseManagement/viewPurchaseOrder',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
        }
      }
    }
  }
}
</script>

<style></style>
