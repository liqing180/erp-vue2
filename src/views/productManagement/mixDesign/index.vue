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
      @updateSearchData="updateSearchData"
      v-show="showSearch"
    />
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['productManagement:mixDesign:add']"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="handleBatchAssignPlant"
          :disabled="multiple"
          v-if="assignProductionLineAuth"
          >{{ $t('PRODUCT.assignProductionLine2') }}</el-button
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
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      style="cursor: pointer"
    >
      <el-table-column
        v-if="assignProductionLineAuth"
        type="selection"
        width="50"
        align="center"
        :selectable="selectable"
      />
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
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="100"
        fixed="right"
        class-name="small-padding fixed-width"
        v-if="editAuth"
      >
        <template slot-scope="scope">
          <div class="flexStart" style="padding-left: 20px">
            <i
              class="el-icon-edit primary-pointer mr10"
              style="font-size: 20px"
              :title="$t('uiBtn.edit')"
              @click="handleUpdate(scope.row)"
            ></i>
            <i
              v-if="scope.row.mixDesignStatus === '3'"
              class="el-icon-connection primary-pointer mr10"
              style="font-size: 20px"
              :title="$t('PRODUCT.assignProductionLine')"
              @click="handleAssignPlant(scope.row)"
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
    <!-- 导入 -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <systemOperationLogTableDlg ref="systemOperationLogTableDlg" />

    <batchAuthPlantDlg ref="batchAuthPlantDlgRef" @onSuccess="getList" />
    <authPlantDlg ref="authPlantDlgRef" @onSuccess="getList" />
  </div>
</template>

<script>
import { getAllZoneList } from '@/api/organization/zone'

import { queryMixDesignList } from '@/api/productManagement/mixDesign'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'
import batchAuthPlantDlg from './batchAuthPlantDlg.vue'
import authPlantDlg from './authPlantDlg.vue'
export default {
  name: 'MixDesign',
  components: { systemOperationLogTableDlg, batchAuthPlantDlg, authPlantDlg },
  dicts: [],
  mixins: [pageMixin],
  data() {
    const vm = this

    return {
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
          placeholder: `${this.$t('PRODUCT.mixDesignSearch')}`
        },
        {
          name: 'zoneIdList',
          label: vm.$t('PRODUCT.zone'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'zoneId',
          selectLabel: 'zoneName',
          selectData: []
        },
        {
          name: 'isActive',
          label: vm.$t('ui.isActive'),
          type: 'SelectEle',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: vm.$t('uiBtn.active'), value: '1' },
            { label: vm.$t('uiBtn.inactive'), value: '0' }
          ]
        },
        {
          name: 'typeList',
          label: vm.$t('ui.type'),
          type: 'MultipleSelectEle',
          width: '230px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'standardProductList',
          label: vm.$t('PRODUCT.standardProduct'),
          type: 'MultipleSelectEle',
          width: '230px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'mixDesignStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        }
      ],
      // 列信息
      columns: [
        {
          prop: 'mixDesignCode',
          label: vm.$t('PRODUCT.mixDesignCode'),
          visible: true,
          minWidth: 180,
          tooltip: true,
          fixed: true,
          sortable: 'custom'
        },
        {
          prop: 'mixDesignName',
          label: vm.$t('PRODUCT.mixDesignName'),
          visible: true,
          minWidth: 180,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'productCode',
          label: vm.$t('PRODUCT.productCode1'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'zoneName',
          label: vm.$t('PRODUCT.zone'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'mixDesignStatus',
          propBy: 'mixDesignStatusShowStr',
          label: vm.$t('ui.status'),
          minWidth: 180,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'strengthClass',
          propBy: 'strengthClassShowStr',
          label: vm.$t('PRODUCT.strengthClass'),
          minWidth: 180,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'maxBatchLoadShowStr',
          label: vm.$t('PRODUCT.maxBatchLoad'),
          minWidth: 180,
          visible: true,
          tooltip: true
        },
        {
          prop: 'type',
          propBy: 'typeShowStr',
          label: vm.$t('ui.type'),
          minWidth: 120,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'standardProduct',
          propBy: 'standardProductShowStr',
          label: vm.$t('PRODUCT.standardProduct'),
          minWidth: 180,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'dischargeFormula',
          label: vm.$t('PRODUCT.dischargeFormula'),
          minWidth: 180,
          visible: true,
          tooltip: true
        },
        {
          prop: 'slump',
          label: vm.$t('PRODUCT.slump'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'slumpMin',
          label: vm.$t('PRODUCT.minAcceptableSlump'),
          minWidth: 220,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'slumpMax',
          label: vm.$t('PRODUCT.maxAcceptableSlump'),
          minWidth: 220,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'dcType',
          label: vm.$t('PRODUCT.dcType'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'exposureClass',
          label: vm.$t('PRODUCT.exposureClass'),
          minWidth: 180,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'clClass',
          label: vm.$t('PRODUCT.clClass'),
          minWidth: 120,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'cementType',
          label: vm.$t('PRODUCT.cementType'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'cementStrengthClass',
          label: vm.$t('PRODUCT.cementStrengthClass'),
          minWidth: 210,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'nominalAggregateMax',
          label: vm.$t('PRODUCT.maxNominalAggregate'),
          minWidth: 220,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'specialProperties',
          label: vm.$t('PRODUCT.specialProperties'),
          minWidth: 180,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'cementContentMin',
          label: vm.$t('PRODUCT.minCementContent'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'wcRatioMax',
          label: vm.$t('PRODUCT.maxWCRatio'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'airContent',
          label: vm.$t('PRODUCT.airContent'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'specialAdmixture',
          label: vm.$t('PRODUCT.specialAdmixture'),
          minWidth: 190,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'density',
          label: vm.$t('PRODUCT.density'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 140,
          visible: true,
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
        }
      ],

      statusDicts: [],
      typeDicts: [],
      standardProductDicts: []
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
      return this.checkPermi(['productManagement:mixDesign:edit'])
    },
    assignProductionLineAuth() {
      return this.checkPermi(['productManagement:mixDesign:assignProductionLine'])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  async created() {
    this.getAllZoneList()

    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    const a = this.MyDictDataClass.getDictFn('mdm_mix_design_status')
    const b = this.MyDictDataClass.getDictFn('mdm_mix_design_type')
    const c = this.MyDictDataClass.getDictFn('mdm_mix_design_standard_product')
    await Promise.all([a, b, c]).then((res) => {
      const res1 = res[0] || {}
      const res2 = res[1] || {}
      const res3 = res[2] || {}
      this.statusDicts = (res1 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.typeDicts = (res2 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.standardProductDicts = (res3 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
    })

    this.searchData.forEach((item) => {
      if (item.name === 'mixDesignStatusList') {
        item.selectData = this.statusDicts
      } else if (item.name === 'typeList') {
        item.selectData = this.typeDicts
      } else if (item.name === 'standardProductList') {
        item.selectData = this.standardProductDicts
      }
    })
    this.initQueryParams()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getAllZoneList()

    this.getList()
  },
  methods: {
    handleAssignPlant(row) {
      const data = { ...row }

      this.$refs.authPlantDlgRef.handleOpen(data)
    },
    handleBatchAssignPlant() {
      const type = this.selectList[0].type
      const zoneId = this.selectList[0].zoneId
      const validStatus = this.selectList.find((item) => item.mixDesignStatus !== '3')
      if (validStatus) {
        this.$modal.msgError(this.$t('PRODUCT.assignStatusError'))
        return
      }
      const validItem = this.selectList.find((item) => item.type !== type)
      if (validItem) {
        this.$modal.msgError(this.$t('PRODUCT.typeMsgError'))
        return
      }
      const validZone = this.selectList.find((item) => item.zoneId !== zoneId)
      if (validZone) {
        this.$modal.msgError(this.$t('PRODUCT.assignZoneError'))
        return
      }

      this.$refs.batchAuthPlantDlgRef.handleOpen(this.selectList, type, zoneId)
    },

    /* 查看操作日志 */
    handleOperationLog(row) {
      /* this.$refs.systemOperationLogTableDlg.handleOpen(queryOperationLogList, {
        mixDesignId: row.mixDesignId
      }) */
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.mixDesignId) {
          color = 'table-SelectedRow-bgcolor'
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
      this.loading = true
      let params = { ...this.queryParams }
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      params = this.$trimOfObj(params)

      queryMixDesignList(params).then((response) => {
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.density = this.$numberStr(item.density, 2)
          item.mixDesignStatusShowStr = this.selectDictLabel(this.statusDicts, item.mixDesignStatus)
          item.typeShowStr = this.selectDictLabel(this.typeDicts, item.type)
          item.standardProductShowStr = this.selectDictLabel(
            this.standardProductDicts,
            item.standardProduct
          )
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    getAllZoneList() {
      getAllZoneList({}).then((res) => {
        const zoneList = res.data || []

        this.searchData.forEach((item) => {
          if (item.name === 'zoneIdList') {
            this.$set(item, 'selectData', zoneList)
          }
        })
      })
    },

    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      this.initQueryParams()
      this.$refs.tables.clearSort()
      this.getList()
    },
    updateSearchData(e) {
      const item = this.searchData[e.index]
      if (item.name === 'selectAnInputName') {
        if (e.childType === 'all') {
          item.selectId = ''
          item.inputVal = ''
        } else if (e.childType === 'select') {
          item.selectId = e.value
          item.inputVal = ''
        } else {
          item.inputVal = e.value || ''
        }
      }
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.mixDesignId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/productManagement/addMixDesign',
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
      this.$router.push({
        path: '/productManagement/editMixDesign',
        query: {
          id: row.mixDesignId,
          timeId: Date.now()
        }
      })
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
        params.exportIdList = vm.tableList.map((item) => item.mixDesignId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/inventory/transferOrder/export',
        params,
        `${this.getFileNameDate('Transfer Order')}.xlsx`
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
