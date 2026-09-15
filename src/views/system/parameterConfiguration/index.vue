<template>
  <div class="app-container">
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      @updateSearchData="updateSearchData"
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      ref="tables"
      border
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
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
        :min-width="item.minWidth"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot-scope="scope">
          <ToolTipShowList
            v-if="item.prop === 'details'"
            showLabel="detailName"
            :list="scope.row.detailList || []"
          />
          <template v-else-if="item.prop === 'modifiedTime'">{{
            parseTime(scope.row.modifiedTime, fmtForYmdhms)
          }}</template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        class-name="small-padding fixed-width"
        width="100"
        fixed="right"
        v-if="!comDisFrom"
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

    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
      @closed="closed"
      :title="$t('menu.parameterConfiguration')"
      :visible.sync="userVisible"
      width="1000px"
    >
      <el-row class="transfer-style">
        <el-transfer
          :key="transferKey"
          style="text-align: left; display: inline-block"
          :height="'600px'"
          filterable
          filter-placeholder=" "
          v-model="transferValue"
          :data="transferData"
          :disabled="true"
          :titles="[$t('uiBtn.inactive'), $t('uiBtn.active')]"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          @change="transferChange"
        >
          <template #default="{ option }">
            <div
              class="transfer-item"
              :draggable="transferValue.includes(option.key)"
              @dragstart="handleDragStart(option)"
              @dragover.prevent
              @drop="handleDrop(option)"
            >
              {{ option.label }}
            </div>
          </template>
        </el-transfer>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="ghost" @click="userVisible = false">{{ $t('uiBtn.back') }}</el-button>
        <el-button type="primary" v-if="!comDisFrom" @click="handleSave" :loading="submitLoading">{{
          $t('uiBtn.submit')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryParameterConfigurationList,
  queryUomList,
  queryIncotermList,
  queryPortList,
  queryCountryList,
  queryCurrencyList,
  queryMobileCodeList1,
  updateUomList,
  updateIncotermList,
  updatePortList,
  updateCountryList,
  updateCurrencyList,
  updateMobileCodeList
} from '@/api/system/parameterConfiguration'
import pageMixin from '@/mixins/tableMinx'

export default {
  name: 'ParameterConfiguration',
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      saveKey: '1',
      btnLoading: false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      tableList: [],
      columns: [
        {
          prop: 'parameterName',
          label: vm.$t('ui.parameterName'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'details',
          label: vm.$t('ui.details'),
          visible: true,
          minWidth: 200,
          tooltip: false
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
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('ui.parameterName')}`
        }
      ],
      curRow: {},
      userVisible: false,

      transferValue: [],
      transferData: [],
      submitLoading: false,
      transferKey: Date.now(),
      dragItem: undefined,
      sortableDom: undefined
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getList()
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['system:parameterConfiguration:edit'])
    },
    comDisFrom() {
      return !this.editAuth
    }
  },
  methods: {
    transferChange(e) {
      this.transferKey = +new Date()
    },
    handleDragStart(item) {
      this.dragItem = item // 记录当前拖拽的项
    },
    handleDrop(targetItem) {
      const dragIndex = this.transferData.findIndex((item) => item.key === this.dragItem.key)
      const targetIndex = this.transferData.findIndex((item) => item.key === targetItem.key)

      // 调整数据顺序
      const [removed] = this.transferData.splice(dragIndex, 1)
      this.transferData.splice(targetIndex, 0, removed)

      const dragIndex1 = this.transferValue.findIndex((key) => key === this.dragItem.key)
      const targetIndex1 = this.transferValue.findIndex((key) => key === targetItem.key)

      const [removed1] = this.transferValue.splice(dragIndex1, 1)
      this.transferValue.splice(targetIndex1, 0, removed1)
      // 清空拖拽项
      this.dragItem = null
    },
    /** 查询岗位列表 */
    getList() {
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      queryParameterConfigurationList(params).then((response) => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 搜索 */
    handleSearchForm() {
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
      this.ids = selection.map((item) => item.postId)
      // eslint-disable-next-line eqeqeq
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }

      this.curRow = row
      this.userVisible = true
      this.queryTransferList()
    },
    closed() {
      this.$nextTick(() => {
        this.transferKey = this.transferKey + 1
      })
      this.transferValue = []
      this.transferData = []
    },
    queryTransferList() {
      this.submitLoading = true
      const parameterKey = this.curRow.parameterKey
      let Fn
      let labelName = ''
      switch (parameterKey) {
        case 'UOM':
          Fn = queryUomList
          labelName = 'uomName'
          break
        case 'INCOTERM':
          Fn = queryIncotermList
          labelName = 'dictLabel'
          break
        case 'PORT':
          Fn = queryPortList
          labelName = 'portName'
          break
        case 'COUNTRY':
          Fn = queryCountryList
          labelName = 'name'
          break
        case 'CURRENCY':
          Fn = queryCurrencyList
          labelName = 'currency'
          break
        case 'MOBILE_CODE':
          Fn = queryMobileCodeList1
          labelName = 'description'
          break
      }
      Fn({}).then((res) => {
        if (res.code === 200) {
          this.submitLoading = false
          const selectIds = []
          const list = res.data || []
          list.forEach((item) => {
            if (parameterKey === 'PORT') {
              item.key = item.portId
              item.id = item.portId
            } else {
              item.key = item.id
            }
            item.disabled = this.comDisFrom
            item.label = item[labelName]
            if (item.isSelect === '1') {
              selectIds.push(item.id)
            }
          })
          this.transferValue = selectIds
          this.transferData = list
        }
      })
    },
    handleSave() {
      const vm = this
      this.$modal.confirm(this.$t('ui.submitParameterConfirm')).then(() => {
        return vm.updateData()
      })
    },
    updateData() {
      const parameterKey = this.curRow.parameterKey

      const params = {
        selectIdList: this.transferValue
      }
      let Fn
      switch (parameterKey) {
        case 'UOM':
          Fn = updateUomList
          break
        case 'INCOTERM':
          Fn = updateIncotermList
          break
        case 'PORT':
          Fn = updatePortList
          break
        case 'COUNTRY':
          Fn = updateCountryList
          break
        case 'CURRENCY':
          Fn = updateCurrencyList
          break
        case 'MOBILE_CODE':
          Fn = updateMobileCodeList
          break
      }
      this.submitLoading = true
      Fn(params)
        .then((res) => {
          this.submitLoading = false
          if (res.code === 200) {
            this.userVisible = false
            this.$message.success(`${this.$t('ui.submitParameterSuccess')}`)
            this.getList()
          }
        })
        .catch(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>
<style lang="scss">
.transfer-style {
  text-align: center;
  .el-transfer-panel {
    width: 300px;
    .el-transfer-panel__body {
      height: 500px !important;
      .el-transfer-panel__list.is-filterable {
        height: calc(500px - 62px) !important;
      }
    }
  }
  .el-transfer__buttons {
    display: inline-flex;
    flex-direction: column;
    padding: 0 30px;
    .el-transfer__button:nth-child(2) {
      margin: 0;
    }
  }

  .el-transfer__buttons .el-transfer__button {
    width: 80px !important;
  }
}
</style>
