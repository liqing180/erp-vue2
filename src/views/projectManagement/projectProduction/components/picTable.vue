<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-button @click="handleAddBtn" type="primary" icon="el-icon-plus" size="mini">{{
          $t('uiBtn.add')
        }}</el-button>
      </el-col>
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
      class="mt10"
      :data="tableList"
      @sort-change="handleSortChange"
      :max-height="tableMaxHeight"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
    >
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
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot-scope="scope">
          <dict-tag
            v-if="item.prop === 'status'"
            :options="dict.type.user_status"
            :value="scope.row[item.prop]"
          />
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        min-width="120"
        class-name="small-padding fixed-width"
        fixed="right"
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
    <selectPicTable ref="selectPicTable" @updatePic="updateTable" />
    <historyQuotationRecordsDlg ref="historyQuotationRecordsDlg" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectPicTable from './selectPicTable.vue'
import historyQuotationRecordsDlg from '@/views/purchaseManagement/purchaseQuotation/components/historyQuotationRecordsDlg.vue'
export default {
  dicts: ['valuation_unit'],
  mixins: [pageMixin],
  components: {
    selectPicTable,
    historyQuotationRecordsDlg
  },
  props: {
    comDisFrom: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'formData.projectProductionPersonList': {
      immediate: true,
      handler: function (newVal) {
        this.tableList = this.formData.projectProductionPersonList || []
        this.changeTableList()
      }
    }
  },
  data() {
    return {
      saveKey: '35',
      savePath: 'picTable',
      columns: [
        {
          prop: 'nickName',
          label: this.$t('ui.userName'),
          visible: true,
          minWidth: 170,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'employeeNo',
          label: this.$t('organization.employeeNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'userName',
          label: this.$t('organization.userId'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'departmentName',
          label: this.$t('organization.department'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'postName',
          label: this.$t('organization.positionName'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'email',
          label: this.$t('organization.email'),
          visible: true,
          minWidth: 170,
          tooltip: true
        }
      ],
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'userId'
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        } else if (row.updateType === '3') {
          return 'cancel-row'
        }
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
    },
    handleAddBtn() {
      // const ids = this.tableList.map((x) => x.userId)
      const tableList = JSON.parse(JSON.stringify(this.tableList))
      this.$refs.selectPicTable.handleOpen(tableList)
    },
    updateTable(list = []) {
      // if (list.length > 0) {
      const rows = JSON.parse(JSON.stringify(list))
      this.tableList.length = 0
      this.tableList.push(...rows)
    },
    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },

    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
      })
    }
  }
}
</script>

<style></style>
