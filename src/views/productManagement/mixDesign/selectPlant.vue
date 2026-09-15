<template>
  <!-- 授权用户 -->
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PRODUCT.addProductionLine1')"
    :visible.sync="visible"
    width="1100px"
    top="5vh"
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
              >{{ selectDictLabel(dict.type.mdm_mix_design_type, scope.row.type) }}
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
          v-for="item in customColumns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :show-overflow-tooltip="item.tooltip"
          :sortable="item.sortable"
          :align="item.align || 'center'"
        >
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
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button
        :disabled="selected.length <= 0"
        type="primary"
        @click="handleSelectUser"
        :loading="btnLoading"
        >{{ isInputSelect ? $t('uiBtn.save') : $t('uiBtn.submit') }}</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import {
  queryMixDesignCanAddProductionLineList,
  addProductionLineToMixDesign
} from '@/api/productManagement/mixDesign'
import pageMixin from '@/mixins/tableMinx'
export default {
  dicts: ['mdm_mix_design_type', 'mdm_production_line_active'],
  mixins: [pageMixin],
  components: {},
  props: {
    zoneId: {
      type: [Number, String]
    },
    mixDesignId: {
      type: [Number, String]
    },
    isInputSelect: {
      type: [Boolean],
      default: false
    },
    type: {
      default: undefined
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '3',
      // 遮罩层
      visible: false,
      btnLoading: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 选中数组值
      selected: [],
      // 总条数
      total: 0,
      // 未授权用户数据
      userList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        isActive: '1',
        deptIdList: [],
        roleIdList: []
      },
      deptOptions: [],
      roleOptions: [],
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
          dict: 'mdm_mix_design_type',
          selectData: []
        } */
      ],
      customColumns: []
    }
  },
  computed: {
    productionLineIdList() {
      return this.selected.map((item) => item.productionLineId)
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      let color = 'pointer'
      for (const item of this.productionLineIdList.values()) {
        if (item === row.productionLineId) {
          color = 'pointer table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    // 显示弹框
    show(selected) {
      if (selected) {
        this.selected = JSON.parse(JSON.stringify(selected))
      }
      this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      this.$set(this.queryParams, 'isActive', '1')
      this.getList()
      this.visible = true
    },

    cancel() {
      this.visible = false
    },
    closed() {
      this.resetSearchForm(false)
      this.selected = []
      this.userList = []
    },
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selected.map((d) => d.productionLineId)
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item.productionLineId)) {
            vm.selected.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.userList.map((item) => item.productionLineId)
        vm.selected = vm.selected.filter((item) => !delArr.includes(item.productionLineId))
      }
    },
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selected.length; i++) {
        if (vm.selected[i].productionLineId === row.productionLineId) {
          return vm.selected.splice(i, 1)
        }
      }
      vm.selected.push(row)
    },
    handleRowClick(row) {
      const index = this.selected.findIndex(
        (item) => item.productionLineId === row.productionLineId
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
      params.mixDesignId = this.mixDesignId
      params.typeList = [this.type]
      queryMixDesignCanAddProductionLineList(params).then((res) => {
        this.loading = false
        this.userList = res.rows
        this.total = res.total
        this.$nextTick(() => {
          this.selected.forEach((row) => {
            this.userList.forEach((item) => {
              if (row.productionLineId === item.productionLineId) {
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
      if (this.isInputSelect) {
        this.$emit('select', this.selected)
        this.cancel()
        return
      }
      const userNames = this.selected.map((item) => item.userName)
      this.$modal
        .confirm(this.$t('ui.submitPageConfirm2'))
        .then(() => {
          this.btnLoading = true
          return addProductionLineToMixDesign({
            mixDesignIdList: [this.mixDesignId],
            productionLineIdList: this.productionLineIdList
          })
        })
        .then((res) => {
          this.$modal.msgSuccess(this.$t('ui.submitPageSuccess').replace('$1', userNames))
          if (res.code === 200) {
            this.cancel()
            setTimeout(() => {
              this.$emit('ok')
              this.btnLoading = false
            }, 1000)
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>
