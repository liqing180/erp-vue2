<template>
  <div>
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :showMenu="false"
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

    <div class="" style="width: 100%">
      <el-table
        border
        ref="tables"
        :data="tableList"
        :max-height="tableMaxHeight"
        @sort-change="handleSortChange"
        @row-click="handleRowClick"
        :row-class-name="'pointer'"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" :selectable="selectable" align="center" />
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
            <template v-if="item.prop === 'productName'">
              <commonProductAndPicture :row="scope.row" />
            </template>
            <template v-else-if="item.prop === 'purchaseQty'">
              <template>{{
                $numberStr(
                  scope.row[item.prop],
                  scope.row.decimalNum,
                  scope.row.isAdhocEntry !== '1'
                )
              }}</template>
            </template>
            <template v-else-if="item.prop === 'description'">
              <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
            </template>
            <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :selectedNum="
          $$getFilteredSelectedNum(filteredSelectedList, tableList, selectList, rowIdKey)
        "
        :saveKey="saveKey"
        :savePath="savePath"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" @click="submit" :loading="btnLoading"
        >{{ $t('uiBtn.save') }}
      </el-button>
    </div> -->
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryPendInquiryProductList,
  initRFQFromPRSelectAddress
} from '@/api/purchaseManagement/requestForQuotation'
export default {
  directives: {
    // transferDom
  },
  dicts: ['service_type'],
  mixins: [pageMixin],
  props: {
    dropShipping: {
      type: String,
      default: ''
    },
    rfqId: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '10',
      savePath: 'projectMDlg',
      searchFormKey: Date.now(),
      btnLoading: false,
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'rfqDetailId',
      tableList: [],
      filteredSelectedList: [],
      // 外部已勾选保存的产品行
      alreadyRFQDetailList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList: [],
      visible: false,
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          sortable: 'custom',
          padding: 70,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.DocNo'),
          visible: true,
          minWidth: 160,
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
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'deliveryDate',
          propBy: 'deliveryDateStr',
          label: vm.$t('PURCHASE.requestedReceiptDate'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'requiredBy',
          label: vm.$t('PURCHASE.requiredBy'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdTime',
          propBy: 'createdTimeStr',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
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
          placeholder: `${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        }
      ]
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
  watch: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    handleAdd(selectList = [], alreadyRFQDetailList = [], type) {
      this.alreadyRFQDetailList = alreadyRFQDetailList || []
      this.selectList = selectList || []
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      console.log(this.selectList, '===================258')
      this.getList(type)
    },
    getList(type) {
      const vm = this
      const param = { ...this.queryParams }
      param.selectedIdList = this.$$getSelectedIdList(this.selectList, this.rowIdKey)
      this.$trimOfObj(param)
      param.rfqId = this.rfqId || undefined
      this.loading = true
      queryPendInquiryProductList(param)
        .then((response) => {
          this.loading = false
          this.filteredSelectedList = this.$$getFilteredSelectedList(response)
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTimeStr = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.deliveryDateStr = this.parseTime(item.deliveryDate, this.fmtForYmd)
          })
          this.tableList = rows
          if (this.tableList.length <= 0 && type === 'init') {
            this.$emit('noData')
          }
          this.total = response.total
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
        item.serviceTypeStr = this.selectDictLabel(this.dict.type.service_type, item.serviceType)
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
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
      const index = this.selectList.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      const isSelected = index > -1
      if (isSelected) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(row)
      }
      this.$refs.tables.toggleRowSelection(row, !isSelected)
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
    closed() {
      this.selectList = []
      this.tableList = []
      this.$refs.tables.clearSelection()
    },

    submit(rows = []) {
      if (this.selectList.length <= 0) {
        this.btnLoading = false
        this.$emit('onSuccess', [])
        return
      }
      if (this.btnLoading) return
      this.btnLoading = true
      // console.log(this.selectList, '===================374')

      initRFQFromPRSelectAddress({
        rfqId: this.rfqId || undefined,
        rfqDetailIdList: this.selectList.map((x) => x.rfqDetailId),
        isMergePrAddress: '1',
        dropShipping: this.selectList.some((x) => x.dropShipping === '1') ? '1' : '0',
        isValidDropShippingForSO: this.dropShipping,
        alreadyRFQDetailList: rows || this.alreadyRFQDetailList || []
      })
        .then((res) => {
          const data = res.data || {}
          const list = data.rfqDetailList || []

          setTimeout(() => {
            this.btnLoading = false
          }, 2000)
          this.$emit('onSuccess', list, data)
          // this.visible = false
        })
        .catch(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
