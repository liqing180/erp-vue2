<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('ui.paymentTerm')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :showMenu="false"
      v-show="showSearch"
    >
      <right-toolbar
        :saveKey="saveKey"
        :savePath="savePath"
        :showRefreshBtn="true"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </search-form>

    <el-table
      border
      ref="tables"
      class="mt10"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      :row-class-name="'pointer'"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      :max-height="tableMaxHeight"
      tooltip-effect="light"
    >
      <!-- <el-table-column type="selection" width="55" :selectable="selectable" align="center" /> -->
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
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
          <template v-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else-if="item.prop === 'stageShowStr'">
            <ToolTipPaymentTerm :paymentTermObj="scope.row || {}">
              {{ scope.row[item.prop] }}
            </ToolTipPaymentTerm>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :saveKey="saveKey"
      :savePath="savePath"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <!-- <el-button type="primary" :loading="btnLoading" @click="submit"
        >{{ $t('uiBtn.save') }}
      </el-button> -->
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryPaymentTermListByPaymentTermPurposeForPage } from '@/api/system/paymentTerm'

export default {
  dicts: ['payment_term_type', 'payment_term_purpose'],
  mixins: [pageMixin],
  props: {
    paymentTermPurposeList: {
      type: Array,
      default() {
        return []
      }
    },
    businessPartnerId: {
      type: String,
      default: ''
    },
    menuPerms: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '2',
      savePath: 'IMTable',
      searchFormKey: Date.now(),
      btnLoading: false,
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      tableList: [],
      selectList: [],
      rowIdKey: 'userId',
      tableMaxHeightResize: true,
      selected: '',
      visible: false,
      columns: [
        {
          prop: 'paymentTermNo',
          label: vm.$t('ui.paymentTermNo'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'paymentTermCode',
          label: vm.$t('ui.paymentTermCode'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'paymentTermName',
          label: vm.$t('menu.paymentTerm'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'paymentTermType',
          propBy: 'paymentTermTypeStr',
          label: vm.$t('ui.type'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'paymentTermPurpose',
          propBy: 'paymentTermPurposeStr',
          label: vm.$t('ui.purpose'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'stageShowStr',
          label: vm.$t('ui.stage'),
          minWidth: 160,
          visible: true,
          tooltip: true
          // sortable: 'custom'
        },

        {
          prop: 'description',
          label: vm.$t('ui.description'),
          minWidth: 160,
          visible: true,
          sortable: 'custom'
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${vm.$t('menu.paymentTerm')} / ${vm.$t('ui.paymentTermCode')} / ${vm.$t(
            'ui.description'
          )}`,
          type: 'InputEle'
        }
      ]
    }
  },
  computed: {},
  beforeCreate() {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleAdd() {
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    treeToTile(treeData, childKey = 'childList') {
      const arr = []
      const expanded = (data) => {
        if (data && data.length > 0) {
          data.forEach((e) => {
            arr.push({
              ...e,
              nodeList: data
            })
            expanded(e[childKey] || [])
          })
        }
      }
      expanded(treeData)
      return arr
    },
    getList() {
      const vm = this
      const param = this.queryParams
      param.paymentTermPurposeList = this.paymentTermPurposeList
      param.businessPartnerId = this.businessPartnerId
      param.menuPerms = this.menuPerms
      this.loading = true
      this.$trimOfObj(param)

      queryPaymentTermListByPaymentTermPurposeForPage(param)
        .then((response) => {
          this.loading = false
          this.total = response.total
          const list = response.rows || []
          list.forEach((item) => {
            item.paymentTermTypeStr = this.selectDictLabel(
              this.dict.type.payment_term_type,
              item.paymentTermType
            )
            item.paymentTermPurposeStr = this.selectDictLabels(
              this.dict.type.payment_term_purpose,
              item.paymentTermPurpose || ''
            )
            const detailList = this.treeToTile(item.paymentTermDetailList || [])
            item.stageShowStr = detailList.length
          })
          this.tableList = list
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)

          this.$nextTick(() => {
            this.selectList.forEach((row) => {
              this.tableList.forEach((item) => {
                if (row[this.rowIdKey] === item[this.rowIdKey]) {
                  this.$refs.tables.toggleRowSelection(item, true)
                }
              })
            })
          })
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.paymentTermTypeStr = this.selectDictLabel(
          this.dict.type.payment_term_type,
          item.paymentTermType
        )
        item.paymentTermPurposeStr = this.selectDictLabels(
          this.dict.type.payment_term_purpose,
          item.paymentTermPurpose || ''
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },

    handleBack() {
      const vm = this
      vm.visible = false
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables.clearSort()
      this.getList()
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selectList.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selectList.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[this.rowIdKey])
        vm.selectList = vm.selectList.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selectList.length; i++) {
        if (vm.selectList[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selectList.splice(i, 1)
        }
      }
      vm.selectList.push(row)
    },
    handleRowClick(row, column) {
      if (column && column.property === 'picture') {
        return
      }
      this.$emit('onSuccess', row)
      this.visible = false
      // const index = this.selectList.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      // const isSelected = index > -1
      // if (isSelected) {
      //   this.selectList.splice(index, 1)
      // } else {
      //   this.selectList.push(row)
      // }
      // this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    closed() {
      this.$refs.tables.clearSelection()
    },
    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 2000)
      this.$emit('onSuccess', this.selectList)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}
</style>
