<template>
  <!-- 授权用户 -->
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('bp.addMixDesign')"
    :visible.sync="visible"
    width="1140px"
    top="5vh"
    append-to-body
    @closed="closed"
  >
    <search-form
      ref="searchForm"
      :key="searchFormKey"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      v-show="showSearch"
    >
      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </search-form>

    <el-row>
      <el-table
        border
        :row-class-name="tableRowClassName"
        @row-click="handleRowClick"
        ref="tables"
        :data="userList"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
        @sort-change="handleSortChange"
        :max-height="600"
        v-loading="loading"
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
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
          :min-width="item.minWidth"
          :show-overflow-tooltip="item.tooltip"
          :fixed="item.fixed"
          :sortable="item.sortable"
          :align="item.align || 'center'"
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'isActive'">
              <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
              <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                $t('uiBtn.inactive')
              }}</el-tag>
            </template>
            <template v-else-if="item.prop === 'description'">
              <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :selectedNum="selected.length"
        :saveKey="saveKey"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button :disabled="selected.length <= 0" type="primary" @click="handleSelectUser">{{
        $t('uiBtn.save')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryProjectCanAddMixDesignSalesPriceList } from '@/api/businessPartner/businessPartner'
import pageMixin from '@/mixins/tableMinx'
export default {
  mixins: [pageMixin],
  components: {},
  props: {
    zoneId: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '4',
      searchFormKey: Date.now(),
      // 遮罩层
      visible: false,
      // 遮罩层
      loading: true,
      // 选中数组值
      selected: [],
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 未授权用户数据
      userList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined
      },
      columns: [
        {
          prop: 'salesPartNo',
          label: vm.$t('PRODUCT.salesPartNo'),
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
          prop: 'mixDesignCode',
          label: vm.$t('bp.mixDesignCode'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          minWidth: 180,
          visible: true,
          tooltip: false
        }
      ],
      searchData: [
        {
          name: 'condition',
          placeholder: `${vm.$t('bp.mixDesignCode')} / ${vm.$t('ui.description')}`,
          type: 'InputEle'
        }
      ],
      /* 已经选择的联系人Id(过滤) */
      alreadySelectMixDesignIdList: []
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    plantIdList() {
      return this.selected.map((item) => item.mixDesignSalesPriceId)
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      let color = 'pointer'
      for (const item of this.plantIdList.values()) {
        if (item === row.mixDesignSalesPriceId) {
          color = 'pointer table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    // 显示弹框
    handleAdd(alreadySelectMixDesignIdList) {
      this.alreadySelectMixDesignIdList = alreadySelectMixDesignIdList || []
      this.selected = []
      this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      this.getList()
      this.visible = true
    },
    cancel() {
      this.visible = false
    },
    closed() {
      this.resetSearchForm(false)
      this.$nextTick(() => {
        this.searchFormKey = this.searchFormKey + 1
      })
      this.selected = []
      this.userList = []
    },
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selected.map((d) => d.mixDesignSalesPriceId)
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item.mixDesignSalesPriceId)) {
            vm.selected.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.userList.map((item) => item.mixDesignSalesPriceId)
        vm.selected = vm.selected.filter((item) => !delArr.includes(item.mixDesignSalesPriceId))
      }
    },
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selected.length; i++) {
        if (vm.selected[i].mixDesignSalesPriceId === row.mixDesignSalesPriceId) {
          return vm.selected.splice(i, 1)
        }
      }
      vm.selected.push(row)
    },
    handleRowClick(row) {
      const index = this.selected.findIndex(
        (item) => item.mixDesignSalesPriceId === row.mixDesignSalesPriceId
      )
      const isSelected = index > -1
      if (isSelected) {
        this.selected.splice(index, 1)
      } else {
        this.selected.push(row)
      }
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    // 查询表数据
    getList() {
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      params.zoneId = this.zoneId
      params.alreadySelectMixDesignSalesPriceIdList = this.alreadySelectMixDesignIdList
      queryProjectCanAddMixDesignSalesPriceList(params).then((res) => {
        this.loading = false
        this.userList = res.rows || []
        this.total = res.total
        this.$nextTick(() => {
          this.selected.forEach((row) => {
            this.userList.forEach((item) => {
              if (row.mixDesignSalesPriceId === item.mixDesignSalesPriceId) {
                this.$refs.tables.toggleRowSelection(item, true)
              }
            })
          })
        })
      })
    },
    /** 搜索 */
    handleSearchForm(query) {
      const param = this.$trimOfObj(query)
      this.queryParams = { ...param }
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm(isGetList = true) {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables && this.$refs.tables.clearSort()
      if (isGetList) {
        this.getList()
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.selected = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 选择授权用户操作 */
    handleSelectUser() {
      if (this.btnLoading) {
        return
      }
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 500)
      this.$emit('select', this.selected)
      this.cancel()
    }
  }
}
</script>
