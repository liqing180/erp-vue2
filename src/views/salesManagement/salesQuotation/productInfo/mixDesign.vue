<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-button
          @click="handleAddBtn"
          :disabled="!formData.projectId"
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
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
    >
      <el-table-column
        v-if="false"
        type="selection"
        key="selection"
        align="center"
        width="55"
      ></el-table-column>
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
        v-for="item in comVisibleColumn"
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
              [
                'salesPartNo',
                'volume',
                'unitPrice',
                'variationShowStr',
                'passingRequirements'
              ].includes(item.prop)
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'volume'">
            <template v-if="!comDisFrom">
              <el-input-number
                style="width: 96%"
                v-model="scope.row.volume"
                controls-position="right"
                :precision="2"
                v-thousandSplit="{ precision: 2 }"
                :min="formData.productMinVol || 0.01"
                :max="
                  formData.projectMaxVol
                    ? Math.min(formData.projectMaxVol, 999999999.99)
                    : 999999999.99
                "
                @change="volumeChange(scope.row)"
              />
              <TablePropError v-if="scope.row[item.prop + '-CELL-ERROR']" />
            </template>

            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'unitPrice'">
            <div class="flexSb">
              <div class="flow1">
                <el-input-number
                  v-thousandSplit="{ precision: 2 }"
                  style="width: 98%"
                  v-model="scope.row.unitPrice"
                  controls-position="right"
                  :precision="2"
                  :min="0.01"
                  :max="999999999999.99"
                  @change="volumeChange(scope.row, 'unitPrice')"
                  v-if="!comDisFrom"
                />
                <div :title="$numberStr(scope.row[item.prop], 2)" v-else>
                  {{ $numberStr(scope.row[item.prop], 2) }}
                </div>
              </div>
              <div
                class="fs-0"
                v-if="scope.row.isNeedTips && ['1', '2'].indexOf(scope.row.isNeedTips) !== -1"
              >
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    <div v-if="scope.row.isNeedTips === '1'">
                      {{
                        $t('SALES.unitPriceHigh').replace('$1', $numberStr(scope.row.maxPrice, 2))
                      }}
                    </div>
                    <div v-if="scope.row.isNeedTips === '2'">
                      {{
                        $t('SALES.unitPriceLow').replace('$1', $numberStr(scope.row.minPrice, 2))
                      }}
                    </div>
                    <div class="mt10">{{ $t('SALES.priceExceeds') }}</div>
                    <div class="mt10">{{ $t('SALES.compulsoryApproval') }}</div>
                  </div>
                  <svg-icon icon-class="warning" class="ml10" style="height: 20px; width: 20px" />
                </el-tooltip>
              </div>
            </div>
            <TablePropError v-if="scope.row[item.prop + '-CELL-ERROR']" />
          </template>
          <template v-else-if="item.prop === 'lineTotal'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'trialMix'">
            <el-switch
              v-model="scope.row.trialMix"
              active-value="1"
              inactive-value="0"
              :disabled="comDisFrom || scope.row.isCanTrialMix !== '1'"
            ></el-switch>
          </template>
          <template v-else-if="item.prop === 'variationShowStr'">
            <template v-if="scope.row.trialMix === '1'">
              <template v-if="!comDisFrom">
                <CommonSelect
                  style="width: 98%"
                  :id="scope.row.variation"
                  :label="scope.row.variationShowStr"
                  :title="scope.row.variationShowStr"
                  idKey="variation"
                  labelKey="variationShowStr"
                  :options="scope.row.variationList || []"
                  @change="variationChange($event, scope.row)"
                />
                <TablePropError v-if="scope.row[item.prop + '-CELL-ERROR']" />
              </template>

              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </template>
          <template v-else-if="item.prop === 'passingRequirements'">
            <template v-if="scope.row.trialMix === '1'">
              <template v-if="!comDisFrom">
                <CommonMultipleSelect
                  style="width: 96%"
                  :ids="scope.row.passingRequirementsList"
                  :labels="scope.row.passingRequirementsList"
                  :showTitle="true"
                  idKey="ageName"
                  labelKey="ageName"
                  :options="
                    (scope.row.canSelectPassingRequirementsList || []).map((ageItem) => {
                      return { ageName: ageItem + '' }
                    })
                  "
                  @change="
                    (ids, labels) => {
                      rowAgeListChange(scope.row, ids, labels)
                    }
                  "
                />
                <TablePropError v-if="scope.row[item.prop + '-CELL-ERROR']" />
              </template>

              <span v-else>{{ scope.row.passingRequirementsList.join(', ') }}</span>
            </template>
          </template>
          <template v-else-if="item.prop === 'natureOfCasting'">
            <el-input
              style="width: 96%"
              v-model="scope.row.natureOfCasting"
              maxlength="100"
              v-if="!comDisFrom"
            />
            <template v-else>{{ scope.row.natureOfCasting }}</template>
          </template>
          <template v-else-if="item.prop === 'productRemarks'">
            <el-input
              v-if="!comDisFrom"
              style="width: 98%"
              :title="scope.row.productRemarks"
              v-model="scope.row.productRemarks"
              :maxlength="300"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="['productCode'].includes(item.prop)">
            <span class="primary-link" @click="nav(scope.row)">{{ scope.row[item.prop] }}</span>
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
        :fixed="false"
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

    <selectMixDesignList
      ref="selectMixDesignList"
      :projectId="formData.projectId"
      :currencyId="formData.currencyId"
      :businessPartnerId="formData.businessPartnerId"
      @update="updateTable"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectMixDesignList from '../components/selectMixDesignList.vue'
// import { queryMixDesignSalesVariation } from '@/api/salesManagement/salesQuotation'

export default {
  mixins: [pageMixin],
  components: { selectMixDesignList },
  props: {
    loading: {
      type: Boolean,
      default: false
    },

    comDisFrom: {
      type: Boolean,
      default: false
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
        this.totalForm = newValue || {}
      }
    },
    'formData.salesQuotationMixDesignList': {
      immediate: true,
      handler: function (selected) {
        console.log(this.formData.salesQuotationMixDesignList, '===224')
        this.tableList = this.formData.salesQuotationMixDesignList
        if (this.tableListCopy.length <= 0) {
          this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
        }
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
      saveKey: '48',
      savePath: 'salesMTable',
      activeName: '1',
      columns: [
        {
          prop: 'mixDesignName',
          label: vm.$t('SALES.mixDesignName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productCode',
          label: vm.$t('SALES.productCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'salesPartNo',
          label: vm.$t('PRODUCT.salesPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'volume',
          label: vm.$t('SALES.volume'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PRODUCT.price'),
          visible: true,
          minWidth: 140,
          tooltip: false,
          padding: 70,
          align: 'right'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('SALES.lineTotal'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'exchangeRateDesc',
          label: vm.$t('menu.exchangeRate'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'trialMix',
          label: vm.$t('SALES.trialMix'),
          visible: true,
          minWidth: 140,
          tooltip: false
        },
        {
          prop: 'variationShowStr',
          label: vm.$t('SALES.trialMixVariation'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'passingRequirements',
          label: vm.$t('SALES.passingRequirements'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productRemarks',
          label: vm.$t('SALES.productRemarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'natureOfCasting',
          label: vm.$t('SALES.natureOfCasting'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      totalForm: {},
      tableList: [],
      tableListCopy: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'salesPartId',
      popoverData: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: []
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    sysDockingSwitchQC() {
      return this.$store.getters.sysDockingSwitchQC
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      if (!this.sysDockingSwitchQC) {
        arr = arr.filter((item) => {
          const is = !['trialMix', 'variationShowStr', 'passingRequirements'].includes(item.prop)
          return is
        })
      }
      return arr
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'salesPartNo':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'volume':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'unitPrice':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'variationShowStr':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'passingRequirements':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'productRemarks':
            item.colMinWidth = vm.comDisFrom ? undefined : 200
            break
          case 'natureOfCasting':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
        }
      })
    },
    errorMessage(code) {
      this.tableList.forEach((item) => {
        if (!this.$resultOfBoolean(item[code])) {
          this.$set(item, code + 'Error', true)
        }
      })
    },
    handleAddBtn() {
      this.tableList.forEach((x) => {
        x.customId = x.mixDesignId + '_' + x.salesPartNo
      })
      this.$refs.selectMixDesignList.handleOpen(this.tableList)
    },
    updateTable(data = []) {
      this.tableList = data
      this.$set(this.totalForm, 'salesQuotationMixDesignList', data)
      this.changeTableList()
    },
    variationChange(selectRow, row) {
      this.$set(row, 'variationShowStr-CELL-ERROR', false)
      this.$set(row, 'ROW-ERROR', false)
      this.$set(row, 'variationId', selectRow.variationId)
      this.$set(row, 'variation', selectRow.variation)
      this.$set(row, 'variationShowStr', selectRow.variationShowStr)
    },
    rowAgeListChange(row, ids, labels) {
      this.$set(row, 'passingRequirements-CELL-ERROR', false)
      this.$set(row, 'ROW-ERROR', false)
      this.$set(row, 'passingRequirementsList', ids)
      this.$set(row, 'passingRequirements', ids.join(','))
    },
    volumeChange(row, type) {
      if (type === 'unitPrice') {
        this.$set(row, 'unitPrice-CELL-ERROR', false)
        this.$set(row, 'ROW-ERROR', false)
      } else {
        this.$set(row, 'volume-CELL-ERROR', false)
        this.$set(row, 'ROW-ERROR', false)
      }
      const { volume, unitPrice } = row
      if (volume && unitPrice) {
        const lineTotal = row.volume * row.unitPrice
        this.$set(row, 'lineTotal', lineTotal)
        this.$emit('handleCalculate')
      } else {
        this.$set(row, 'lineTotal', undefined)
      }
    },
    nav(row, type) {
      this.$router.push({
        path: '/productManagement/viewMixDesign',
        query: {
          id: row.mixDesignId,
          timeId: Date.now()
        }
      })
    },
    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        if (this.tableList.length === 0) {
          this.$set(this.totalForm, 'salesQuotationProductList', [])
          this.$set(this.totalForm, 'subTotal', undefined)
          this.$set(this.totalForm, 'totalFreight', undefined)
          this.$set(this.totalForm, 'totalTaxAmount', undefined)
          this.$set(this.totalForm, 'totalAmount', undefined)
          this.$set(this.totalForm, 'totalDiscount', undefined)
          this.$set(this.totalForm, 'expenseAmount', undefined)
          this.$set(this.totalForm, 'otherCosts', undefined)
        }
        this.$emit('handleCalculate')
      })
    },
    // 表格全选
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selected.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selected.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[this.rowIdKey])
        vm.selected = vm.selected.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    // 行单个选择
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selected.length; i++) {
        if (vm.selected[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selected.splice(i, 1)
        }
      }
      vm.selected.push(row)
    },
    requiredError(code) {
      let rowIndex
      this.tableList.forEach((item, index) => {
        if (code && !this.$resultOfBoolean(item[code])) {
          if (code === 'unitPrice') {
            if (item.isAdhocEntry !== '1') {
              this.$set(item, 'ROW-ERROR', true)
              this.$set(item, code + '-CELL-ERROR', true)
              if (!this.$resultOfBoolean(rowIndex)) {
                rowIndex = index
              }
            }
          } else {
            this.$set(item, 'ROW-ERROR', true)
            this.$set(item, code + '-CELL-ERROR', true)
            if (!this.$resultOfBoolean(rowIndex)) {
              rowIndex = index
            }
          }
        } else {
          this.$set(item, 'ROW-ERROR', false)
          if (code) {
            this.$set(item, code + '-CELL-ERROR', false)
          } else {
            Object.keys(item).forEach((key) => {
              if (key.endsWith('-CELL-ERROR')) {
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
      const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'table-SelectedRow-bgcolor'
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
        this.tableList.find(
          (item) => !item[column.property] && item[column.property + '-CELL-ERROR']
        )
      ) {
        cellClass = 'is-required-table-cell'
      }
      return cellClass
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-box {
  max-width: 600px;
  max-height: 60vh;
  overflow-y: auto;
  // padding: 12px;
  box-sizing: border-box;
  background-color: #333;
  div {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
