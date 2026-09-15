<template>
  <div class="app-container">
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :topShowCount="1"
      v-show="showSearch"
    />

    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-hasPermi="['inventoryManagement:warehouse:add']"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <right-toolbar
        ref="rightToolbar"
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
        :refreshTimeSaveKey="saveKey"
        @autoRefresh="autoRefresh"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      class="mt10"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @row-dblclick="handleDblclick"
      style="cursor: pointer"
    >
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
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'isDefault'">
            <el-tag v-if="scope.row.isDefault === '1'">{{ $t('ui.y') }}</el-tag>
            <el-tag v-if="scope.row.isDefault === '0'" type="danger">{{ $t('ui.n') }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'warehouseType'">
            {{ selectDictLabel(dict.type.warehouse_type, scope.row.warehouseType) }}
          </template>
          <template v-else-if="item.prop === 'internalPartNo'">
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'businessPartnerNo'">
            <span class="primary-link" @click="nav(scope.row, 'businessPartnerNo')">{{
              scope.row.businessPartnerNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'createdTime'">{{
            parseTime(scope.row.createdTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'modifiedTime'">{{
            parseTime(scope.row.modifiedTime, fmtForYmdhms)
          }}</template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        class-name="small-padding fixed-width"
        width="100"
        fixed="right"
        v-if="editAuth"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-edit pointer mr5"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.edit')"
              @click="handleUpdate(scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :saveKey="saveKey"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/inventoryManagement/lang/index'
import { queryWarehouseList } from '@/api/inventoryManagement/warehouse'
export default {
  name: 'Warehouse',
  dicts: ['warehouse_type'],
  mixins: [pageMixin],
  components: {},
  data() {
    const vm = this
    return {
      saveKey: '1',
      searchFormKey: Date.now(),
      loading: false,
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      // 显示搜索条件
      showSearch: true,
      columns: [
        {
          prop: 'warehouseName',
          label: vm.$t('INVENTORY.warehouseName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'warehouseCode',
          label: vm.$t('INVENTORY.warehouseCode'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'warehouseType',
          label: vm.$t('INVENTORY.warehouseType'),
          visible: true,
          width: 160,
          tooltip: true
        },
        {
          prop: 'isDefault',
          label: vm.$t('ui.isDefault'),
          visible: true,
          sortable: 'custom',
          minWidth: 120
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          sortable: 'custom',
          minWidth: 120
        },
        {
          prop: 'picUserNameShowStr',
          label: vm.$t('INVENTORY.receivedBy'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'mobilePhoneShowStr',
          label: vm.$t('INVENTORY.mobilePhone'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'emailShowStr',
          label: vm.$t('ui.email'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          width: 170,
          sortable: 'custom',
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          width: 170,
          sortable: 'custom',
          visible: true,
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('INVENTORY.warehouseName')} / ${vm.$t('INVENTORY.warehouseCode')}`
        },
        {
          name: 'warehouseTypeList',
          label: vm.$t('INVENTORY.warehouseType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'warehouse_type',
          selectData: []
        },
        {
          name: 'isDefaultList',
          label: vm.$t('ui.isDefault'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          selectData: [
            { dictValue: '1', dictLabel: vm.$t('ui.y') },
            { dictValue: '0', dictLabel: vm.$t('ui.n') }
          ]
        },
        {
          name: 'isActiveList',
          label: vm.$t('ui.isActive'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'system_active',
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ]
    }
  },
  watch: {},
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['inventoryManagement:warehouse:edit'])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getCreateDate()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    getCreateDate() {
      // 基础数据 CreateDate 默认为空
      // const timer = Date.now()
      // const endDate = this.appointTime(timer, '23:59:59')
      // const startDate = this.appointTime(timer - 90 * 60 * 60 * 24 * 1000, '00:00:00')
      // this.$set(this.queryParams, 'dateRange', [startDate, endDate])
      // this.$set(this.queryParams, 'startDateCreatedTime', startDate)
      // this.$set(this.queryParams, 'endDateCreatedTime', endDate)
    },
    getList(query) {
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      this.loading = true
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      queryWarehouseList(param)
        .then((response) => {
          this.tableList = response.rows
          this.total = response.total
          this.loading = false
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.loading = false
        })
    },
    autoRefresh() {
      this.getList({ noLoading: true })
    },
    nav(row, type) {
      if (type === 'businessPartnerNo') {
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
      }
    },
    handleAdd(row) {
      this.$router.push({
        path: '/inventoryManagement/warehouseManagement/addWarehouse',
        query: { timeId: +new Date() }
      })
    },

    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/inventoryManagement/warehouseManagement/editWarehouse',
        query: { id: row.warehouseId, timeId: +new Date() }
      })
    },
    handleUpdate(row) {
      this.$router.push({
        path: '/inventoryManagement/warehouseManagement/editWarehouse',
        query: { id: row.warehouseId, timeId: +new Date() }
      })
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
      this.getCreateDate()
      this.$refs.tables.clearSort()
      this.getList()
    }
  }
}
</script>

<style scoped></style>
