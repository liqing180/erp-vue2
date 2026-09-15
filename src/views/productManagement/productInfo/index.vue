<template>
  <div class="app-container">
    <!-- {{ selectedValue }} -->
    <!-- <a-tree-select
      v-model="selectedValue"
      style="width: 100%"
      :tree-data="treeData"
      allow-clear
      :maxTagCount="1"
      multiple
      tree-checkable
      :labelInValue="true"
    /> -->
    <!-- <ATreeSelectCustom style="width: 500px" /> -->
    <!-- :treeData="treeData" :value="selectedValue" -->
    <!-- :showCheckedStrategy="SHOW_PARENT" -->

    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :topShowCount="1"
      @updateSearchData="updateSearchData"
      v-show="showSearch"
    />

    <!-- <a-tree-select
      v-model="selectedValue"
      style="width: 100%"
      :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="Please select"
      allowClear
      multiple
      maxTagCount="1"
      :tree-data="treeData"
      :show-checked-strategy="SHOW_PARENT"
      :labelInValue="true"
    /> -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['productManagement:productInfo:addProduct']"
          >{{ $t('menu.addProduct') }}</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAddService"
          v-hasPermi="['productManagement:productInfo:addService']"
          >{{ $t('menu.addService') }}</el-button
        >
      </el-col> -->

      <el-col :span="1.5">
        <el-button
          type="primary"
          v-hasPermi="['productManagement:productInfo:assignTo']"
          size="mini"
          @click="handleAssignTo"
          :disabled="multiple"
          >{{ $t('menu.assignTo') }}</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="primary"
          v-hasPermi="['productManagement:productInfo:uploadImage']"
          size="mini"
          icon="el-icon-upload2"
          @click="handleUploadImage"
          :disabled="multiple"
          >{{ $t('menu.uploadImage') }}</el-button
        >
      </el-col>

      <el-col :span="1.5" v-if="false">
        <el-dropdown
          @command="(command) => seetingHandleCommand(command)"
          v-hasPermi="['productManagement:productInfo:edit']"
          v-if="!multiple"
          trigger="click"
        >
          <el-button size="mini" type="primary" :disabled="multiple">
            {{ $t('ui.action') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="active"
              icon="el-icon-open"
              v-hasPermi="['productManagement:productInfo:edit']"
              >{{ $t('uiBtn.activeBtn') }}
            </el-dropdown-item>
            <el-dropdown-item
              command="inactive"
              icon="el-icon-turn-off"
              v-hasPermi="['productManagement:productInfo:edit']"
              >{{ $t('uiBtn.inactiveBtn') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['productManagement:productInfo:import']"
          >{{ $t('uiBtn.import') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-hasPermi="['productManagement:productInfo:export']"
          >{{ $t('uiBtn.export') }}</el-button
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
      :data="tableList"
      row-key="productMainIdKey"
      :tree-props="{ children: 'reviseList', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      :max-height="tableMaxHeight"
      :cellClassName="cellClassName"
      style="cursor: pointer"
    >
      <!-- @select-all="handleSelectAll"
      @select="handleSelect" -->
      <el-table-column
        v-if="
          checkPermi(['productManagement:productInfo:export', 'productManagement:productInfo:edit'])
        "
        type="selection"
        width="50"
        align="center"
        :selectable="selectable"
      />
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span> -->
          <span>{{ scope.row.indexI }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in getVisibleColumn(visibleColumn)"
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
          <template v-else-if="item.prop === 'productName'">
            <commonProductAndPicture :row="scope.row" />
          </template>
          <template v-else-if="item.prop === 'productStatus'">
            <div class="flexStart">
              <span class="flow1">{{ scope.row[item.propBy] }}</span>
              <span
                class="inReviseIcon"
                :title="$t('ui.inRevision')"
                v-if="scope.row.isRevise === '1' && scope.row.approvedStatus === '1'"
              >
                <svg-icon icon-class="in-revision" />
              </span>
            </div>
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

      <!-- <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="180"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['productManagement:productInfo:edit']"
            @click="handleUpdate(scope.row)"
          >
            {{ $t('uiBtn.edit') }}
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      :saveKey="saveKey"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 导入 -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <selectLegalEntityDlg ref="selectLegalEntityDlg" @onSuccess="getList" />
    <uploadImageDlg ref="uploadImageDlg" @onSuccess="getList" />
  </div>
</template>

<script>
import { queryProductList, changeProductIsActive } from '@/api/productManagement/productInfo'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import { queryAllCategoryTreeList } from '@/api/productManagement/productCategory'
import selectLegalEntityDlg from './selectLegalEntityDlg'
import uploadImageDlg from './uploadImageDlg'
// import { TreeSelect } from 'ant-design-vue'
// import ATreeSelectCustom from './ATreeSelectCustom.vue'

export default {
  name: 'ProductInfo',
  dicts: ['ivt_product_status', 'approved_status', 'product_type'],
  mixins: [pageMixin],
  components: {
    selectLegalEntityDlg,
    uploadImageDlg
    // ATreeSelectCustom
  },
  data() {
    const vm = this

    return {
      // SHOW_PARENT: TreeSelect.SHOW_PARENT,
      saveKey: '1',
      // 遮罩层
      loading: true,
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
      // 总条数
      total: 0,
      // 用户表格数据
      tableList: [],
      // 日期范围
      dateRange: [],
      // 导入
      importOptions: {
        // 下载模板
        downFileUrl: '/system/product/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/system/product/checkImportData',
        // 提交导入
        importUrl: '/system/product/importData',
        // 下载文件名
        fileName: 'Product Info'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('ui.productSearch')}`
        },
        {
          name: 'productStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'ivt_product_status',
          selectData: []
        },
        {
          name: 'approvedStatusList',
          label: vm.$t('ui.processStatus'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'approved_status',
          selectData: []
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
        },
        // {
        //   name: 'productCategoryIds',
        //   label: this.$t('PRODUCT.productCategory1'),
        //   type: 'ElcascaderEle',
        //   width: '230px',
        //   mapValue: 'id',
        //   mapLabel: 'categoryName',
        //   checkStrictly: false,
        //   emitPath: false,
        //   multiple: true,
        //   selectData: []
        // },
        {
          name: 'productCategoryIds',
          label: this.$t('PRODUCT.productCategory1'),
          type: 'ATreeSelectCustom',
          width: '230px',
          mapValue: 'id',
          mapLabel: 'categoryName',
          checkStrictly: false,
          emitPath: false,
          multiple: true,
          selectData: []
        },
        {
          name: 'productTypeList',
          label: vm.$t('PRODUCT.productClass'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'product_type',
          selectData: []
        },
        {
          name: 'purposeList',
          label: vm.$t('PRODUCT.purpose'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'ivt_product_purpose',
          selectData: []
        }
      ],
      // 列信息
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: false,
          padding: 70,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          propBy: 'internalPartNoShowStr',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 40,
          sortable: 'custom'
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.inventoryUOM1'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom'
        },

        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          sortable: 'custom'
        },
        {
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom'
        },

        {
          prop: 'productStatus',
          propBy: 'productStatusStr',
          label: vm.$t('ui.status'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 40,
          sortable: 'custom'
        },
        {
          prop: 'approvedStatus',
          propBy: 'approvedStatusStr',
          label: vm.$t('ui.processStatus'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'productType',
          propBy: 'productTypeStr',
          label: vm.$t('PRODUCT.productClass'),
          width: 150,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.category'),
          visible: true,
          minWidth: 200
          // tooltip: true
          // sortable: 'custom' // 不能排序
        },
        {
          prop: 'purposeShowStr',
          label: vm.$t('PRODUCT.purpose'),
          visible: true,
          minWidth: 200,
          tooltip: true
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
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'approvedBy',
          label: vm.$t('ui.approvedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'approvedTime',
          label: vm.$t('ui.approvedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }
      ],
      timeStamp: undefined,
      selectedValue: [], // 选中的值
      treeData: [
        // 树形数据结构
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-1' },
            { title: 'Child Node2', value: '0-0-2' }
          ]
        },
        {
          title: 'Node2',
          value: '0-1'
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
    },
    editAuth() {
      return this.checkPermi(['organization:user:edit'])
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        if (route.params.isGetList && route.name === 'ProductInfo') {
          this.resetSearchForm(false)
          const params = route.params || {}
          this.$set(this.queryParams, 'jumpToIds', params.ids)
          this.createdInitTimer = Date.now()
          this.getList()
        }
      },
      immediate: true
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.queryAllCategoryTreeList()

    if (this.createdInitTimer && Date.now() - (this.createdInitTimer || 0) < 2000) return
    this.createdInitTimer = Date.now()
    this.$set(this.queryParams, 'isActiveList', ['1'])
    this.$set(this.queryParams, 'productStatusList', ['1', '2', '3'])
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
    this.queryAllCategoryTreeList()
  },
  methods: {
    getVisibleColumn(VisibleColumn) {
      const fixedIndex = VisibleColumn.findIndex((item) => item.fixed)
      const firstIndex = fixedIndex >= 0 ? fixedIndex : 0
      return VisibleColumn.map((item, index) => {
        if (firstIndex === index) {
          return {
            ...item,
            colWidth: item.colWidth + 30
          }
        }
        return item
      })
    },
    cellClassName({ row, column }) {
      let cellClass = ''
      const propList = ['productName', 'productStatus', 'categoryNameShowStr', 'description']
      if (propList.includes(column.property)) {
        cellClass = 'product-name-flex-cell'
      }
      return cellClass
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.productMainId) {
          color = 'table-SelectedRow-bgcolor'
        }
        if (row.reviseList) {
          row.reviseList.forEach((child) => {
            if (this.ids.indexOf(child.productMainId) !== -1) {
              color = 'table-SelectedRow-bgcolor'
            }
          })
        }
      }
      return color
    },
    // eslint-disable-next-line no-unused-vars
    selectable(row, rowIndex) {
      if (row.adminFlag === 1) {
        return false // 禁用
      } else {
        return true // 不禁用
      }
    },
    /** 查询用户列表 */
    getList() {
      /* querySearchList({}).then((res) => {
        const projectDictList = res.data.countryList || []
        this.searchData.forEach((item) => {
          if (item.name === 'countryIdList') {
            this.$set(item, 'selectData', projectDictList)
          }
        })
      }) */
      this.loading = true
      // const params = this.$trimOfObj(this.queryParams)
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      // const nodes =
      //   (this.$refs.searchForm && this.$refs.searchForm.getElcascaderEleCheckedNodes()) || []
      // if (nodes && nodes.length > 0) {
      //   params.productCategoryIdList = nodes
      // } else {
      //   params.productCategoryIdList = undefined
      // }
      // if (params.productCategoryIds && params.productCategoryIds.length > 0) {
      //   params.productCategoryIdList = params.productCategoryIds.map(
      //     (item) => item[item.length - 1]
      //   )
      // } else {
      //   params.productCategoryIdList = undefined
      // }
      if (params.productCategoryIds && params.productCategoryIds.length > 0) {
        params.productCategoryIdList = params.productCategoryIds.map((x) => x.value)
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryIds
      queryProductList(params).then((response) => {
        const rows = response.rows || []
        rows.forEach((item, index) => {
          // item.productMainId = item.productMainId + index
          item.productMainIdKey = item.productMainId + index
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          item.indexI = (this.queryParams.pageNum - 1) * this.queryParams.pageSize + index + 1

          this.setItemDict(item)
          if (item.reviseList) {
            item.reviseList.forEach((child) => {
              child.createdTime = this.parseTime(child.createdTime, this.fmtForYmdhms)
              child.modifiedTime = this.parseTime(child.modifiedTime, this.fmtForYmdhms)
              child.approvedTime = this.parseTime(child.approvedTime, this.fmtForYmdhms)
              child.productMainIdKey = child.productMainId + index
              this.setItemDict(child)
            })
          }
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        this.setItemDict(item)
        item.reviseList.forEach((child) => {
          this.setItemDict(child)
        })
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    setItemDict(item) {
      item.productTypeStr = this.selectDictLabel(this.dict.type.product_type, item.productType)
      // item.productType === '1' ? this.$t('PRODUCT.product') : this.$t('PRODUCT.service')
      item.productStatusStr = this.selectDictLabel(
        this.dict.type.ivt_product_status,
        item.productStatus
      )
      item.approvedStatusStr = this.selectDictLabel(
        this.dict.type.approved_status,
        item.approvedStatus
      )
    },
    queryAllCategoryTreeList() {
      queryAllCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.searchData.forEach((item) => {
          if (item.name === 'productCategoryIds') {
            this.$set(item, 'selectData', arr)
          }
        })
      })
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          if (x.child && x.child.length > 0) {
            x.children = x.child
            this.handle(x.child)
          } else {
            x.children = undefined
          }
        })
      }
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm(isGetList = true) {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$set(this.queryParams, 'isActiveList', ['1'])
      this.$set(this.queryParams, 'productStatusList', ['1', '2', '3'])
      this.$refs.tables && this.$refs.tables.clearSort()
      if (isGetList) {
        this.getList()
      }
    },
    updateSearchData(e) {
      if (e.childType === 'select') {
        this.searchData[e.index].selectId = e.value
        this.searchData[e.index].date = []
      } else {
        this.searchData[e.index].date = e.value
      }
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.productMainId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleSelect(selection) {
      console.log(selection, '=============747')
      this.ids = selection.map((item) => item.productMainId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
      const recursiveCheckAll = (data) => {
        data.forEach((row) => {
          if (this.ids.indexOf(row.productMainId) === -1) {
            this.$refs.tables.toggleRowSelection(row, false)
          } else {
            this.$refs.tables.toggleRowSelection(row, true)
          }
          if (row.reviseList && row.reviseList.length) {
            recursiveCheckAll(row.reviseList)
          }
        })
      }
      recursiveCheckAll(this.tableList)
    },
    /* 表格全选 */
    handleSelectAll(selection) {
      console.log(selection, '================753')
      this.ids = []
      this.selectList = []
      if (selection.length) {
        if (selection.length === this.tableList.length) {
          this.recursiveCheckAll(selection, true)
        } else {
          this.recursiveCheckAll(selection, false)
        }
      } else {
        this.recursiveCheckAll(selection, false)
      }
    },
    /**
     * 递归函数：批量勾选/取消所有父子级
     * @param {Array} data - 当前层级的数据（父级/子级数组）
     */
    recursiveCheckAll(data, isCheck) {
      data.forEach((row) => {
        if (isCheck && this.ids.indexOf(row.productMainId) === -1) {
          this.ids.push(row.productMainId)
          this.selectList.push(row)
        }
        this.$refs.tables.toggleRowSelection(row, isCheck)
        // 若有子级，递归处理子级
        if (row.reviseList && row.reviseList.length) {
          this.recursiveCheckAll(row.reviseList, isCheck)
        }
      })
      this.single = this.selectList.length !== 1
      this.multiple = !this.selectList.length
    },
    // 更多操作触发
    seetingHandleCommand(command) {
      switch (command) {
        case 'active':
          this.handleChangeUsersStatus('active')
          break
        case 'inactive':
          this.handleChangeUsersStatus('inactive')
          break
        default:
          break
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/productManagement/addProductInfo',
        query: {
          timeId: Date.now()
        }
      })
    },
    handleAddService() {
      this.$router.push({
        path: '/productManagement/addService',
        query: {
          timeId: Date.now()
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      if (row.productType === '2') {
        this.$router.push({
          path: '/productManagement/editService',
          query: {
            id: row.productMainId,
            timeId: Date.now()
          }
        })
      } else {
        this.$router.push({
          path: '/productManagement/editProductInfo',
          query: {
            id: row.productMainId,
            timeId: Date.now()
          }
        })
      }
    },

    handleAssignTo() {
      const err = this.selectList.find((item) => item.approvedStatus !== '3')
      if (err) {
        this.$modal.msgError(this.$t('PRODUCT.productAssignErr'))
        return
      }
      this.$refs.selectLegalEntityDlg.handleOpen([...this.ids])
    },
    handleUploadImage() {
      const err = this.selectList.find(
        (item) => item.productStatus === '4' || item.productStatus === '0'
      )
      if (err) {
        this.$modal.msgError(this.$t('PRODUCT.productUploadImageErr'))
        return
      }
      this.$refs.uploadImageDlg.handleOpen([...this.ids])
    },
    /** 批量修改用户状态 */
    handleChangeUsersStatus(type) {
      const names = this.selectList.map((item) => item.productName).join(', ')
      const isActive = type === 'active' ? '1' : '0'
      let confirmMsg = this.$t('PRODUCT.changeProductInactive').replace('$1', names)
      if (type === 'active') {
        confirmMsg = this.$t('PRODUCT.changeProductActive').replace('$1', names)
      }
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          return changeProductIsActive(this.ids, isActive)
        })
        .then(() => {
          this.getList()
          // this.$modal.msgSuccess(this.$t('ui.changeBPActiveSuccess'))
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    /** 导出按钮操作 */
    openExport() {
      this.$refs.ExportDlgRef.open()
    },
    handleExport(data) {
      const vm = this
      const { exportType } = data
      let params = this.addDateRange(this.queryParams, this.dateRange)
      params = JSON.parse(JSON.stringify(params))
      params = this.$trimOfObj(params)
      params.exportType = exportType

      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.productMainId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      // const nodes =
      //   (this.$refs.searchForm && this.$refs.searchForm.getElcascaderEleCheckedNodes()) || []
      // if (nodes && nodes.length > 0) {
      //   params.productCategoryIdList = nodes
      // } else {
      //   params.productCategoryIdList = undefined
      // }
      // if (params.productCategoryIds && params.productCategoryIds.length > 0) {
      //   params.productCategoryIdList = params.productCategoryIds.map(
      //     (item) => item[item.length - 1]
      //   )
      // } else {
      //   params.productCategoryIdList = undefined
      // }
      if (params.productCategoryIds && params.productCategoryIds.length > 0) {
        params.productCategoryIdList = params.productCategoryIds.map((x) => x.value)
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryIds
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/system/product/export',
        params,
        `${this.getFileNameDate('Product Info')}.xlsx`
      )
        .then((res) => {
          vm.exportLoading = false
          vm.$refs.ExportDlgRef.hide()
          vm.$modal.msgSuccess(vm.$t('ui.exportSuccess'))
        })
        .catch(() => {
          vm.exportLoading = false
        })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
    }
  }
}
</script>
<style lang="scss">
/* 处理特殊单元格内容与展开折叠列的样式冲突 */
.product-name-flex-cell {
  .cell {
    display: flex;
    align-items: center;
  }
}
</style>
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
.dept-select {
  /deep/ .vue-treeselect--disabled .vue-treeselect__control {
    background-color: #f5f7fa;
  }
  /deep/ .vue-treeselect__single-value {
    color: #c0c4cc;
  }
}
</style>
