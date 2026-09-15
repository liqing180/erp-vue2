<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-button
          @click="handleAddBtn"
          :disabled="!formData.projectId || tableList.length > 0"
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
          <span v-if="['volume'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'volume'">
            <el-input-number
              style="width: 96%"
              v-model="scope.row.volume"
              controls-position="right"
              :precision="3"
              v-thousandSplit="{ precision: 3 }"
              :min="0.001"
              :max="9999.999"
              @change="volumeChange(scope.row)"
              v-if="!comDisFrom"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 3) }}</template>
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'lineTotal'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'variationShowStr'">
            <span>{{ scope.row.variationShowStr }}</span>
            <!-- <template v-if="scope.row.trialMix === '1' && scope.row.trialMixNo">
              <span style="margin: 0 3px">-</span>
              <span>{{ scope.row.trialMixNo }}</span>
            </template> -->
          </template>
          <template v-else-if="item.prop === 'trialMix'">
            <el-switch
              v-model="scope.row.trialMix"
              active-value="1"
              inactive-value="0"
              :disabled="true"
            ></el-switch>
          </template>
          <template v-else-if="item.prop === 'passingRequirements'">
            <span v-if="scope.row.trialMix === '1'">
              {{ (scope.row.passingRequirementsList || []).join(', ') }}
            </span>
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
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              :class="scope.row.retestLoading ? 'el-icon-loading' : 'el-icon-refresh-left'"
              class="primary-pointer"
              style="font-size: 20px"
              :title="$t('menu.retest')"
              v-if="scope.row.isCanRetest === '1'"
              @click="handleRetest(scope.row)"
            ></i>
            <i
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.$index, scope.row)"
              v-if="!comDisFrom"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryMixDesignSalesVariation } from '@/api/salesManagement/salesQuotation'
import { retestMixDesignTrialMix } from '@/api/salesManagement/salesOrder'

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
    'formData.salesOrderMixDesignList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.salesOrderMixDesignList
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
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('SALES.lineTotal'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
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
          case 'projectName':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'description':
            item.colMinWidth = vm.comDisFrom ? undefined : 180
            break
        }
      })
    },
    handleAddBtn() {
      this.$refs.selectMixDesignList.handleOpen()
    },
    updateTable(data = []) {
      this.tableList.push(...data)
      const { otherCosts } = data[0]
      this.$set(this.totalForm, 'otherCosts', otherCosts || undefined)
      queryMixDesignSalesVariation({ mixDesignId: this.tableList[0].mixDesignId }).then((res) => {
        const data = res.data || []
        this.$set(this.totalForm, 'salesQuotationProductList', data)
      })
      this.changeTableList()
    },
    volumeChange(row) {
      const { volume } = row
      if (volume) {
        this.$emit('handleCalculate')
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
    handleRetest(row) {
      if (row.retestLoading) return
      this.$modal.confirm(this.$t('SALES.retestConfirm')).then(() => {
        this.$set(row, 'retestLoading', true)
        retestMixDesignTrialMix(row)
          .then((res) => {
            this.$modal.msgSuccess(this.$t('SALES.writeSuccess1'))
            this.$set(row, 'isCanRetest', '0')
            setTimeout(() => {
              this.$set(row, 'retestLoading', false)
            }, 2000)
          })
          .catch(() => {
            this.$set(row, 'retestLoading', false)
          })
      })
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.$set(this.totalForm, 'salesQuotationProductList', [])
        this.$set(this.totalForm, 'subTotal', undefined)
        this.$set(this.totalForm, 'totalFreight', undefined)
        this.$set(this.totalForm, 'totalTaxAmount', undefined)
        this.$set(this.totalForm, 'totalAmount', undefined)
        this.$set(this.totalForm, 'totalDiscount', undefined)
        this.$set(this.totalForm, 'expenseAmount', undefined)
        this.$set(this.totalForm, 'otherCosts', undefined)
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
