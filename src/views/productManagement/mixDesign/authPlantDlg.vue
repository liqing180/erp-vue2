<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="title"
    :visible.sync="open"
    width="1100px"
    append-to-body
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
        :showRefreshBtn="true"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </search-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          v-if="assignProductionLineAuth"
          @click="openSelectUser"
          >{{ $t('PRODUCT.addProductionLine1') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-circle-close"
          size="mini"
          :disabled="multiple"
          @click="cancelAuthUserAll"
          v-if="cancelAuthAuth"
          >{{ $t('ui.batchCancelAuth') }}</el-button
        >
      </el-col>
    </el-row>

    <el-table
      border
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      :max-height="600"
      ref="tables"
    >
      <el-table-column v-if="cancelAuthAuth" type="selection" width="55" align="center" />
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
          <!-- <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template> -->
          <template v-if="item.prop === 'isActive'"
            >{{ selectDictLabel(dict.type.mdm_production_line_active, scope.row.isActive) }}
          </template>
          <template v-else-if="item.prop === 'type'"
            >{{ selectDictLabel(dict.type.mdm_plant_type, scope.row.type) }}
          </template>
          <template v-else-if="item.prop === 'mixerSize'"
            >{{ $numberStr(scope.row.mixerSize, 2) }}
          </template>
          <template v-else-if="item.prop === 'productionRate'"
            >{{ $numberStr(scope.row.productionRate, 2) }}
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
        width="160px"
        align="center"
        fixed="right"
        class-name="small-padding fixed-width"
        v-if="cancelAuthAuth"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="cancelAuthUser(scope.row)"
            >{{ $t('ui.cancelAuth') }}
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
    <selectPlant
      ref="select"
      :zoneId="zoneId"
      :mixDesignId="mixDesignId"
      :type="type"
      @ok="handleQuery"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  queryMixDesignProductionLineList,
  deleteMixDesignProductionLine
} from '@/api/productManagement/mixDesign'
import selectPlant from './selectPlant'
import pageMixin from '@/mixins/tableMinx'
export default {
  dicts: ['mdm_plant_type', 'mdm_production_line_active'],
  name: 'AuthUser',
  mixins: [pageMixin],
  components: { selectPlant },
  data() {
    const vm = this
    return {
      saveKey: '2',
      searchFormKey: Date.now(),
      open: false,
      title: '',
      // 遮罩层
      loading: true,
      // 选中用户组
      productionLineIdList: [],
      selectList: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 列信息
      columns: [
        {
          prop: 'plantName',
          label: vm.$t('PRODUCT.plantName'),
          visible: true,
          minWidth: 180,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'productionLineName',
          label: vm.$t('PRODUCT.productionLineName'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'zoneName',
          label: vm.$t('PRODUCT.zone'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        // {
        //   prop: 'location',
        //   label: vm.$t('PRODUCT.location'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'type',
          label: vm.$t('ui.type'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        // {
        //   prop: 'mixerSizeShowStr',
        //   label: vm.$t('PRODUCT.mixerSize'),
        //   minWidth: 120,
        //   visible: true,
        //   tooltip: true
        // },
        // {
        //   prop: 'productionRate',
        //   label: vm.$t('PRODUCT.productionRate'),
        //   minWidth: 160,
        //   visible: true,
        //   tooltip: true
        // },
        {
          prop: 'contactPersonName',
          label: vm.$t('PRODUCT.contactPerson'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'mobileNo',
          label: vm.$t('ui.mobilePhone'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }
      ],
      // 用户表格数据
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        isActive: '1'
      },
      isView: false,
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PRODUCT.plantName')} / ${vm.$t(
            'PRODUCT.productionLineName'
          )} / ${vm.$t('ui.remarks')}`
        },
        {
          name: 'isActive',
          label: vm.$t('ui.isActive'),
          type: 'SelectEle',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'mdm_production_line_active',
          selectData: []
        }
        /* {
          name: 'typeList',
          label: vm.$t('PRODUCT.type'),
          type: 'MultipleSelectEle',
          width: '230px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'mdm_plant_type',
          selectData: []
        } */
      ],
      zoneId: '',
      mixDesignId: '',
      type: ''
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    assignProductionLineAuth() {
      return this.checkPermi(['productManagement:mixDesign:assignProductionLine'])
    },
    cancelAuthAuth() {
      return this.checkPermi(['productManagement:mixDesign:cancelAuth'])
    }
  },
  created() {},
  methods: {
    handleOpen(row) {
      this.zoneId = row.zoneId
      this.mixDesignId = row.mixDesignId
      this.type = row.type

      if (this.zoneId) {
        this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
        this.$set(this.queryParams, 'isActive', '1')
        this.getList()
      }
      this.open = true
      if (this.isView) {
        this.title = this.$t('PRODUCT.assignProductionLine')
      } else {
        this.title = this.$t('PRODUCT.assignProductionLine')
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.$emit('onSuccess')
      this.resetSearchForm(false)
      this.$nextTick(() => {
        this.searchFormKey = this.searchFormKey + 1
      })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.productionLineIdList.values()) {
        if (item === row.productionLineId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    /** 查询授权用户列表 */
    getList() {
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      params.zoneId = this.zoneId
      params.mixDesignId = this.mixDesignId
      queryMixDesignProductionLineList(params).then((response) => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 返回按钮
    handleClose() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/system/role' })
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
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.productionLineIdList = selection.map((item) => item.productionLineId)
      this.selectList = [...selection]
      this.multiple = !selection.length
    },
    /** 打开授权用户表弹窗 */
    openSelectUser() {
      this.$refs.select.show()
    },
    /** 取消授权按钮操作 */
    cancelAuthUser(row) {
      this.$modal
        .confirm(
          this.$t('PRODUCT.mixDesignCancelAssignConfirm').replace('$1', row.productionLineName)
        )
        .then(() => {
          return deleteMixDesignProductionLine({
            productionLineIdList: [row.productionLineId],
            mixDesignId: this.mixDesignId
          })
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('PRODUCT.mixDesignCancelAssignSuccess'))
        })
        .catch(() => {})
    },
    /** 批量取消授权按钮操作 */
    cancelAuthUserAll() {
      const productionLineIdList = this.productionLineIdList
      const plantNames = this.selectList.map((item) => item.productionLineName).join(', ')
      this.$modal
        .confirm(this.$t('PRODUCT.mixDesignCancelAssignConfirm').replace('$1', plantNames))
        .then(() => {
          return deleteMixDesignProductionLine({
            mixDesignId: this.mixDesignId,
            productionLineIdList: productionLineIdList
          })
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('PRODUCT.mixDesignCancelAssignSuccess'))
        })
        .catch(() => {})
    }
  }
}
</script>
