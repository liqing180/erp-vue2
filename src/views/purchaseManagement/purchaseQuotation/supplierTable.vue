<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-button @click="handleAddBtn" type="primary" icon="el-icon-plus" size="mini">{{
          $t('uiBtn.add')
        }}</el-button>
      </el-col>
      <el-col :span="1.5" v-if="false">
        <el-button
          :disabled="selected.length <= 0"
          @click="handleDelete"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          >{{ $t('uiBtn.delete') }}</el-button
        >
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

    <!-- :row-key="rowIdKey" -->
    <el-table
      border
      ref="tables"
      v-loading="loading"
      :row-class-name="tableRowClassName"
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
          <span v-if="['contactPersonName'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'contactPersonName'">
            <CommonSelect
              v-if="!comDisFrom"
              style="width: 98%"
              :id="scope.row.contactPersonId"
              :label="scope.row.contactPersonName"
              :title="scope.row.contactPersonName"
              idKey="contactPersonId"
              labelKey="contactPersonName"
              :options="scope.row.bpBusinessContactPersonList || []"
              @change="rowContactPersonChange($event, scope.row)"
            />
            <template v-else>{{ scope.row.contactPersonName }}</template>
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
        fixed="right"
        v-if="!comDisFrom || showPdf"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              v-if="!comDisFrom"
              class="el-icon el-icon-delete pointer mr5"
              style="font-size: 20px; color: #f56c6c"
              @click="handleDelRow(scope.$index, scope.row)"
            ></i>
            <svg-icon
              v-if="showPdf"
              icon-class="pdf"
              class="primary-pointer"
              style="font-size: 20px"
              @click="handlePdf(scope.$index, scope.row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <selectSupplierTable
      ref="selectSupplierTable"
      :productIdList="productIdList"
      @onSuccess="updateTable"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectSupplierTable from './components/selectSupplierTable'
export default {
  mixins: [pageMixin],
  components: {
    selectSupplierTable
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    showPdf: {
      type: Boolean,
      default: false
    },
    rfqVendorList: {
      type: Array,
      default() {
        return []
      }
    },
    productIdList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    rfqVendorList: {
      immediate: true,
      handler: function (selected) {
        this.tableList = JSON.parse(JSON.stringify(this.rfqVendorList))
        this.changeTableList()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '21',
      savePath: 'purchaseMTable',
      columns: [
        {
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('PURCHASE.supplierCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'contactPersonName',
          label: vm.$t('PURCHASE.contactPerson'),
          visible: true,
          width: 200,
          tooltip: true
        },
        {
          prop: 'email',
          label: vm.$t('PURCHASE.contactPersonEmail'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'businessPartnerId'
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    initList(list) {
      this.tableList = JSON.parse(JSON.stringify(list))
    },
    getList() {
      return this.tableList
    },
    rowContactPersonChange(value, row) {
      const data = value || {}
      this.$set(row, 'businessContactPersonId', data.businessContactPersonId)
      this.$set(row, 'contactPersonId', data.contactPersonId)
      this.$set(row, 'contactPersonName', data.contactPersonName)
      this.$set(row, 'email', data.email)
      this.$set(row, 'mobileCode', data.mobileCode)
      this.$set(row, 'mobileNum', data.mobileNum)
      this.$set(row, 'mobilePhone', data.mobilePhone)
    },
    handleAddBtn() {
      const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      this.$refs.selectSupplierTable.handleAdd(alreadySelectIdList)
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        this.tableList = [...this.tableList, ...rows]
        this.changeTableList()
        this.$nextTick(() => {
          this.selected.forEach((row) => {
            this.tableList.forEach((item) => {
              if (row[this.rowIdKey] === item[this.rowIdKey]) {
                this.$refs.tables.toggleRowSelection(item, true)
              }
            })
          })
        })
        // this.initDraggable()
      }
    },
    changeTableList() {
      this.$emit('updateTable', this.tableList)
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 选中多个删除
    handleDelete() {
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          this.tableList = this.tableList.filter((row) => {
            if (this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])) {
              return false
            }
            return true
          })
          this.changeTableList()
          this.selected = []
        })
        .catch(() => {})
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        const findIndex = this.selected.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        if (findIndex !== -1) {
          this.selected.splice(findIndex, 1)
        }
      })
    },
    handlePdf(index, row) {
      this.$emit('handlePdfRow', row)
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
      const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'table-SelectedRow-bgcolor'
      }
      return color
    }
  }
}
</script>

<style></style>
