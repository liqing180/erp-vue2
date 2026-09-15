<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
      :title="title"
      :visible.sync="open"
      width="1140px"
      append-to-body
      @closed="reset"
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
        :topShowCount="1"
      >
      </search-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addProduct">{{
            $t('uiBtn.add')
          }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            >{{ $t('uiBtn.delete') }}</el-button
          >
        </el-col>
        <right-toolbar
          :saveKey="saveKey"
          :showSearch.sync="showSearch"
          @queryTable="queryTable"
          :columns="configColumn"
          :columnsInit="columns"
        ></right-toolbar>
      </el-row>

      <el-table
        border
        ref="tables"
        :row-class-name="tableRowClassName"
        v-loading="loading"
        :data="searchTableList"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        :max-height="600"
      >
        <el-table-column type="selection" width="55" align="center" :selectable="selectable" />
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">{{ $t('uiBtn.back') }}</el-button>
        <el-button
          type="primary"
          @click="submitForm"
          :loading="btnLoading"
          :disabled="tableList.length <= 0"
          >{{ $t('uiBtn.save') }}
        </el-button>
      </div>
    </el-dialog>
    <selectProduct ref="selectProduct" :zoneId="zoneId" @select="updateTable" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProduct from './selectProduct.vue'
export default {
  name: 'productDlg',
  components: {
    selectProduct
  },
  props: {
    zoneId: {
      type: String,
      default: ''
    }
  },
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      btnLoading: false,
      saveKey: '3',
      // 遮罩层
      loading: false,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      selectList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 完整表格数据
      tableList: [],
      // 搜索后表格数据
      searchTableList: [],
      // 弹出层标题
      dateRange: [],
      // 查询参数
      queryParams: {
        condition: undefined,
        isActive: '1'
      },
      // 列信息
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
          tooltip: false
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
          tooltip: true
        }
      ],
      searchData: [
        {
          name: 'condition',
          placeholder: `${vm.$t('bp.mixDesignCode')} / ${vm.$t('ui.description')}`,
          type: 'InputEle'
        }
      ],
      searchFormKey: Date.now(),
      title: '',
      open: false
    }
  },
  beforeCreate() {},
  async created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    comDisFrom() {
      return false
    }
  },
  methods: {
    updateTable(list) {
      const rows = JSON.parse(JSON.stringify(list))
      this.tableList = [...this.tableList, ...rows]
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.mixDesignSalesPriceId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    addProduct() {
      const alreadySelectMixDesignIdList = this.tableList.map((item) => item.mixDesignSalesPriceId)
      this.$refs.selectProduct.handleAdd(alreadySelectMixDesignIdList)
    },
    selectable(row, rowIndex) {
      // return false // 禁用
      return true // 不禁用
    },
    getList() {
      if (this.queryParams.condition) {
        this.searchTableList = this.tableList.filter((item) => {
          return this.$isContain(this.queryParams.condition, [item.mixDesignCode, item.description])
        })
      } else {
        this.searchTableList = this.tableList
      }
    },
    /** 搜索 */
    handleSearchForm(query) {
      const param = this.$trimOfObj(query)
      this.queryParams = { ...param }
      if (!this.queryParams.dateType && this.carrierOrderStatus === '0') {
        this.queryParams.dateType = this.searchData[1].selectData[0].dictValue
      }
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      if (this.carrierOrderStatus === '0') {
        this.searchData[1].selectId = this.searchData[1].selectData[0].dictValue
        this.searchData[1].date = []
        const { pageSize } = this.queryParams
        this.queryParams = { pageNum: 1, pageSize, dateType: this.searchData[1].selectId }
      } else {
        const { pageSize } = this.queryParams
        this.queryParams = { pageNum: 1, pageSize }
      }
      this.$refs.tables.clearSort()
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log('change')
      this.ids = selection.map((item) => item.mixDesignSalesPriceId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    handleDelete() {
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          this.tableList = this.tableList.filter((item) => {
            if (this.ids.includes(item.mixDesignSalesPriceId)) {
              return false
            }
            return true
          })
          this.getList()
        })
        .catch(() => {})
    },
    reset() {},
    handleOpen(list) {
      this.reset()
      this.open = true
      this.title = this.$t('bp.mixDesignList')
      this.tableList = JSON.parse(JSON.stringify(list))
      this.getList()
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$emit('updateProductList', this.tableList)
      this.open = false
    }
  }
}
</script>

<style lang="scss" scoped>
.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
    margin-right: 10px;
  }
}
.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
  }
  .con-right {
    margin-left: 10px;
    line-height: 0;
  }
}
</style>
