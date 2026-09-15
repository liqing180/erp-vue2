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
          v-hasPermi="['productManagement:productRelationship:add']"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          v-hasPermi="['productManagement:productRelationship:edit']"
          @click="handleEdit"
          :disabled="multiple"
          >{{ $t('uiBtn.edit') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-dropdown
          @command="(command) => settingHandleCommand(command)"
          v-hasPermi="['productManagement:productRelationship:edit']"
          v-if="!multiple"
        >
          <el-button size="mini" type="primary" :disabled="multiple">
            {{ $t('ui.action') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="active" icon="el-icon-open"
              >{{ $t('uiBtn.activeBtn') }}
            </el-dropdown-item>
            <el-dropdown-item command="inactive" icon="el-icon-turn-off"
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
          v-hasPermi="['productManagement:productRelationship:import']"
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
          v-hasPermi="['productManagement:productRelationship:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>
      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      class="mt10"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @row-dblclick="handleDblclick"
      @selection-change="handleSelectionChange"
      row-key="id"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
        align="center"
        v-if="
          checkPermi([
            'productManagement:productRelationship:edit',
            'productManagement:productRelationship:export'
          ])
        "
      >
      </el-table-column>
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
          <template v-else-if="item.prop === 'internalPartNo'">
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'businessPartnerName'">
            <div
              @mouseenter="showPop($event, scope.row, 'businessPartnerName')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'businessPartnerNo'">
            <div
              @mouseenter="showPop($event, scope.row, 'businessPartnerNo')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text" :class="{ 'primary-link': BPAuth }">
                {{ scope.row[item.prop] }}
              </div>
            </div>
            <!-- <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="businessPartner"
              @click="nav(scope.row, 'businessPartnerNo')"
            /> -->
          </template>
          <template v-else-if="item.prop === 'externalPartNo'">
            <div
              @mouseenter="showPop($event, scope.row, 'externalPartNo')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'country'">
            <div
              @mouseenter="showPop($event, scope.row, 'country')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'supplierTypeShowStr'">
            <div
              @mouseenter="showPop($event, scope.row, 'supplierTypeShowStr')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'supplierGroupShowStr'">
            <div
              @mouseenter="showPop($event, scope.row, 'supplierGroupShowStr')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
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
          <template v-else-if="item.prop === 'remarks'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        min-width="120"
        class-name="small-padding fixed-width"
        fixed="right"
        v-if="false"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate(scope.row)">
            <span v-if="scope.row.isActive === '0'">{{ $t('uiBtn.activeBtn') }}</span>
            <span v-else style="color: #ff4949">{{ $t('uiBtn.inactiveBtn') }}</span>
          </el-button>
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

    <!-- 导出 -->
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <!-- 导入 -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />

    <ToolTipShowListForFN ref="ToolTipShowList" @clickItem="clickItem" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import { queryAllProductCategoryTreeList } from '@/api/productManagement/productCategory'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
import {
  queryProductSheetList,
  updateActive,
  querySearchList
} from '@/api/productManagement/productRelationship'
export default {
  name: 'ProductRelationship',
  dicts: ['bp_supplier_type', 'bp_supplier_group'],
  mixins: [pageMixin],
  components: { ToolTipShowListForFN },
  data() {
    const vm = this
    return {
      saveKey: '1',
      searchFormKey: Date.now(),
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      loading: false,
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.productCode'),
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
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.category'),
          visible: true,
          minWidth: 200
          // tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('PRODUCT.supplierName'),
          visible: true,
          minWidth: 200,
          // sortable: 'custom',
          tooltip: false
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('PRODUCT.supplierCode'),
          visible: true,
          minWidth: 200,
          // sortable: 'custom',
          tooltip: false
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 140,
          visible: true,
          tooltip: false,
          sortable: 'custom'
        },
        {
          prop: 'externalPartNo',
          label: vm.$t('PRODUCT.externalPartNo'),
          visible: true,
          minWidth: 160,
          tooltip: false
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          sortable: 'custom',
          minWidth: 120
        },
        // {
        //   prop: 'isDefault',
        //   label: vm.$t('ui.isDefault'),
        //   visible: true,
        //   sortable: 'custom',
        //   minWidth: 120
        // },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'supplierTypeShowStr',
          // propBy: 'supplierTypeStr',
          label: vm.$t('PRODUCT.supplierType'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'supplierGroupShowStr',
          // propBy: 'supplierGroupStr',
          label: vm.$t('ui.supplierGroup'),
          visible: true,
          minWidth: 200,
          tooltip: false
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
          minWidth: 170,
          sortable: 'custom',
          visible: true
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
          minWidth: 170,
          sortable: 'custom',
          visible: true
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
          placeholder: `${this.$t('ui.externalPartNoProductSearch')}`
        },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('PRODUCT.supplierName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'supplierTypeList',
          label: vm.$t('ui.supplierType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'bp_supplier_type',
          selectData: []
        },
        // {
        //   name: 'supplierGroupList',
        //   label: vm.$t('ui.supplierGroup'),
        //   type: 'MultipleSelectEle',
        //   width: '200px',
        //   selectValue: 'dictValue',
        //   selectLabel: 'dictLabel',
        //   dict: 'bp_supplier_group',
        //   selectData: []
        // },
        {
          name: 'productCategoryId',
          label: this.$t('PRODUCT.productCategory1'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'id',
          mapLabel: 'categoryName',
          checkStrictly: true,
          multiple: true,
          selectData: []
        },
        // {
        //   name: 'isDefaultList',
        //   label: vm.$t('ui.isDefault'),
        //   type: 'MultipleSelectEle',
        //   width: '200px',
        //   selectValue: 'dictValue',
        //   selectLabel: 'dictLabel',
        //   selectData: [
        //     { dictValue: '1', dictLabel: vm.$t('ui.y') },
        //     { dictValue: '0', dictLabel: vm.$t('ui.n') }
        //   ]
        // },
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
      ],
      importOptions: {
        // 下载模板
        downFileUrl: '/system/productSheet/importTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/system/productSheet/checkImportData',
        // 提交导入
        importUrl: '/system/productSheet/importData',
        // 下载文件名
        fileName: 'Purchase Product Info'
      }
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        if (route.params.isGetList && route.name === 'ProductRelationship') {
          this.resetSearchForm(false)
          const params = route.params || {}
          console.log(params)
          this.$set(this.queryParams, 'jumpToIds', params.ids)
          this.createdInitTimer = Date.now()
          this.getList()
        }
      },
      immediate: true
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['organization:role:edit'])
    },
    BPAuth() {
      return this.checkPermi(['businessPartner:businessPartner:list'])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.queryAllProductCategoryTreeList()

    if (this.createdInitTimer && Date.now() - (this.createdInitTimer || 0) < 2000) return
    this.createdInitTimer = Date.now()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
    this.queryAllProductCategoryTreeList()
  },
  methods: {
    getList() {
      this.querySearchList()
      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      // if (this.queryParams.productCategoryId && this.queryParams.productCategoryId.length > 0) {
      //   param.productCategoryId =
      //     this.queryParams.productCategoryId[this.queryParams.productCategoryId.length - 1]
      // } else {
      //   param.productCategoryId = undefined
      // }

      if (param.productCategoryId && param.productCategoryId.length > 0) {
        param.productCategoryIdList = param.productCategoryId.map((item) => item[item.length - 1])
      } else {
        param.productCategoryIdList = undefined
      }
      delete param.productCategoryId

      this.loading = true
      queryProductSheetList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            /* item.supplierTypeStr = this.selectDictLabel(
              this.dict.type.bp_supplier_type,
              item.supplierType
            )
            item.supplierGroupStr = this.selectDictLabel(
              this.dict.type.bp_supplier_group,
              item.supplierGroup
            ) */
          })
          this.tableList = rows
          this.loading = false
          this.total = response.total

          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.loading = false
        })
    },
    querySearchList() {
      querySearchList({ labelType: this.activeName }).then((res) => {
        const data = res.data || {}
        const vendorList = data.vendorList || []
        this.searchData.forEach((item) => {
          if (item.name === 'businessPartnerIdList') {
            this.$set(item, 'selectData', vendorList)
          }
        })
      })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        /* item.supplierTypeStr = this.selectDictLabel(
          this.dict.type.bp_supplier_type,
          item.supplierType
        )
        item.supplierGroupStr = this.selectDictLabel(
          this.dict.type.bp_supplier_group,
          item.supplierGroup
        ) */
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    queryAllProductCategoryTreeList() {
      queryAllProductCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.$set(this.searchData[3], 'selectData', arr)
      })
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          if (x.child && x.child.length > 0) {
            x.children = x.child
            this.handle(x.child)
          }
        })
      }
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.id) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },

    showPop(e, row, type) {
      let list = []
      let uniqueArr = []
      const childProductSheetList = row.childProductSheetList || []
      if (type === 'businessPartnerNo') {
        list = childProductSheetList.map((x) => {
          return {
            customName: x.businessPartnerNo,
            customId: x.businessPartnerId,
            itemClass: this.BPAuth ? 'primary-pointer' : '',
            type
          }
        })
      } else if (type === 'businessPartnerName') {
        list = childProductSheetList.map((x) => {
          return {
            customName: x.businessPartnerName,
            type
          }
        })
      } else if (type === 'externalPartNo') {
        childProductSheetList.forEach((x) => {
          if (x.externalPartNo) {
            list.push({
              customName: x.externalPartNo + ' - ' + x.businessPartnerName,
              type
            })
          }
        })
      } else if (type === 'country') {
        list = childProductSheetList.map((x) => {
          return {
            customName: x.country,
            type
          }
        })
      } else if (type === 'supplierTypeShowStr') {
        childProductSheetList.forEach((x) => {
          if (x.supplierTypeShowStr) {
            list.push({
              customName: x.supplierTypeShowStr,
              type
            })
          }
        })
      } else if (type === 'supplierGroupShowStr') {
        childProductSheetList.forEach((x) => {
          if (x.externalPartNo) {
            list.push({
              customName: x.supplierGroupShowStr,
              type
            })
          }
        })
      }

      uniqueArr = [...new Set(list.map((a) => a.customName))].map((customName) => {
        return list.find((a) => a.customName === customName)
      })

      const params = {
        labelKey: 'customName',
        list: uniqueArr
      }
      if (list.length > 0 && this.$refs.ToolTipShowList) {
        this.$refs.ToolTipShowList.showPop(e, params)
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    clickItem(item) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      const { type, customId } = item
      if (type === 'businessPartnerNo') {
        if (!this.BPAuth) return
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: customId,
            timeId: Date.now()
          }
        })
      }
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
        path: '/productManagement/addProductRelationship',
        query: { timeId: +new Date() }
      })
    },
    handleEdit() {
      this.$router.push({
        path: '/productManagement/batchEditProductRelationship',
        query: { id: this.ids.join(','), timeId: +new Date() }
      })
    },

    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/productManagement/editProductRelationship',
        query: { id: row.id, timeId: +new Date() }
      })
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
      this.$refs.tables && this.$refs.tables.clearSort()
      if (isGetList) {
        this.getList()
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    settingHandleCommand(command) {
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
    /** 批量修改用户状态 */
    handleChangeUsersStatus(type) {
      const isActive = type === 'active' ? '1' : '0'
      let confirmMsg = this.$t('PRODUCT.productRelationshipInactive')
      if (type === 'active') {
        confirmMsg = this.$t('PRODUCT.productRelationshipActive')
      }
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          return updateActive({ ids: this.ids, isActive })
        })
        .then(() => {
          this.getList()
        })
        .catch(() => {})
    },
    handleUpdate(row) {
      const isActive = row.isActive === '1' ? '0' : '1'
      let confirmMsg = this.$t('PRODUCT.productRelationshipActive')
      if (row.isActive === '1') {
        confirmMsg = this.$t('PRODUCT.productRelationshipInactive')
      }
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          return updateActive({ ids: [row.id], isActive })
        })
        .then(() => {
          this.getList()
        })
        .catch(() => {})
    },
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
      // if (params.productCategoryId && params.productCategoryId.length > 0) {
      //   params.productCategoryId = params.productCategoryId[params.productCategoryId.length - 1]
      // } else {
      //   params.productCategoryId = undefined
      // }
      if (params.productCategoryId && params.productCategoryId.length > 0) {
        params.productCategoryIdList = params.productCategoryId.map((item) => item[item.length - 1])
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryId
      params.exportType = exportType

      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.id)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      const index = params.exportFields.indexOf('internalPartNo')
      if (index !== -1) {
        params.exportFields.splice(index + 1, 0, 'inventoryUom')
      } else {
        params.exportFields.splice(2, 0, 'inventoryUom')
      }
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/system/productSheet/export',
        params,
        `${this.getFileNameDate('Purchase Product Info')}.xlsx`
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

<style scoped></style>
