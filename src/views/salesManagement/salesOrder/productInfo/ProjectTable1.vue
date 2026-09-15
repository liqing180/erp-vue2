<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>
    <el-table
      border
      ref="tables"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      :data="tableList"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
    >
      <el-table-column
        v-if="false"
        type="selection"
        key="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column
        type="index"
        key="index"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
        class-name="allowDrag"
      >
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
        :min-width="getMinWidth(item)"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot="header" slot-scope="{ column }">
          <span v-if="['projectName', 'projectDescription'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'projectName'">
            <el-select
              v-model="scope.row.projectTemplateId"
              :title="scope.row.projectName"
              placeholder=""
              style="width: 98%"
              clearable
              @change="projectChange($event, scope.$index)"
              v-if="!comDisFrom"
            >
              <el-option
                v-for="item in projectList"
                :key="item.projectTemplateId"
                :label="item.projectName"
                :value="item.projectTemplateId"
              ></el-option>
            </el-select>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'projectDescription'">
            <el-input
              v-if="!comDisFrom"
              style="width: 98%"
              :title="scope.row.projectDescription"
              v-model="scope.row.projectDescription"
              :maxlength="300"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'projectTermsConditions'">
            <el-input
              v-if="!comDisFrom"
              style="width: 98%"
              :title="scope.row.projectTermsConditions"
              v-model="scope.row.projectTermsConditions"
              :maxlength="300"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'projectQuotationContent'">
            <el-input
              v-if="!comDisFrom"
              style="width: 98%"
              :title="scope.row.projectQuotationContent"
              v-model="scope.row.projectQuotationContent"
              :maxlength="300"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
        :fixed="false"
        v-if="!comDisFrom"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.$index, scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryCanSelectProjectTemplateListNoPage } from '@/api/salesManagement/salesQuotation'
export default {
  mixins: [pageMixin],
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false
    },

    comDisFrom: {
      type: Boolean,
      default: false
    },
    countryId: {
      type: String,
      default: ''
    },
    businessPartnerId: {
      type: String,
      default: ''
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.totalForm = newValue || {}
      }
    },
    'formData.salesOrderProjectList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.salesOrderProjectList
        this.changeTableList()
      }
    },
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '48',
      savePath: 'salesMTable',
      activeName: '1',
      columns: [
        {
          prop: 'projectName',
          label: vm.$t('SALES.projectName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'projectDescription',
          label: vm.$t('PRODUCT.projectDescription'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'projectQuotationContent',
          label: vm.$t('menu.projectCost'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'projectTermsConditions',
          label: vm.$t('PRODUCT.projectTermsConditions'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      totalForm: {},
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'salesPartId',
      popoverData: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: [],
      projectList: []
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.queryCanSelectProjectTemplateListNoPage()
  },
  methods: {
    queryCanSelectProjectTemplateListNoPage() {
      queryCanSelectProjectTemplateListNoPage({})
        .then((res) => {
          this.projectList = res.data || []
        })
        .catch(() => {})
    },
    projectChange(id, index) {
      if (id) {
        const e = this.projectList.filter((x) => x.projectTemplateId === id)[0]
        this.$set(this.tableList, index, { ...e })
        this.totalForm.salesOrderProductList = e.projectTemplateContentList || []
      } else {
        this.$set(this.tableList, index, { id: +new Date() })
        this.totalForm.salesOrderProductList = []
      }
    },
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'projectName':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'projectDescription':
            item.colMinWidth = vm.comDisFrom ? undefined : 200
            break
          case 'projectTermsConditions':
            item.colMinWidth = vm.comDisFrom ? undefined : 200
            break
          case 'projectQuotationContent':
            item.colMinWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },

    handleAddBtn() {
      this.tableList.push({})
    },
    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
      })
    },
    // 表格全选
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selected.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selected.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[this.rowIdKey])
        vm.selected = vm.selected.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    // 行单个选择
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selected.length; i++) {
        if (vm.selected[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selected.splice(i, 1)
        }
      }
      vm.selected.push(row)
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        }
        if (row.updateType === '3') {
          color = 'cancel-row'
        }
      }
      const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'table-SelectedRow-bgcolor'
      }
      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (this.modifyHighlight) {
        if (row.updateType === '1') {
          if ((row.updateMsgList || []).find((item) => item.name === column.property)) {
            cellClass = 'edit-table-cell'
          }
        }
      }

      return cellClass
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-box {
  max-width: 600px;
  max-height: 60vh;
  overflow-y: auto;
  // padding: 12px;
  box-sizing: border-box;
  background-color: #333;
  div {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
