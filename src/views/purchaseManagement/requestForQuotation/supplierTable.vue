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

      <search-form
        ref="searchForm"
        v-model="queryParams"
        :searchData="searchData"
        :handleQuery="handleSearchForm"
        :resetQuery="resetSearchForm"
        :showCustom="false"
        :topShowCount="1"
        :isProductCustomSearch="true"
      />
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
      @sort-change="handleSortChange"
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
            <template v-if="!comDisFrom">
              <CommonSelect
                style="width: 98%"
                :id="scope.row.contactPersonId"
                :label="scope.row.contactPersonName"
                :title="scope.row.contactPersonName"
                idKey="contactPersonId"
                labelKey="contactPersonName"
                :options="scope.row.bpBusinessContactPersonList || []"
                @change="rowContactPersonChange($event, scope.row)"
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <template v-else>{{ scope.row.contactPersonName }}</template>
          </template>
          <template v-else-if="item.prop === 'rfqPdf'">
            <svg-icon
              icon-class="pdf"
              class="primary-pointer"
              style="font-size: 20px"
              @click="handlePdf(scope.$index, scope.row)"
              v-if="!scope.row.pdfLoading"
            />
            <i
              v-if="scope.row.pdfLoading"
              class="el-icon el-icon-loading"
              style="font-size: 20px; color: #409eff"
            ></i>
          </template>
          <template v-else-if="item.prop === 'quoteLinkEnabled'">
            <el-switch
              v-model="scope.row.quoteLinkEnabled"
              :disabled="comDisFrom"
              active-value="1"
              inactive-value="0"
            ></el-switch>
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
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.$index, scope.row)"
            ></i>
            <div>
              <svg-icon
                v-if="showPdf && !scope.row.pdfLoading"
                icon-class="pdf"
                class="primary-pointer"
                style="font-size: 20px"
                @click="handlePdf(scope.$index, scope.row)"
              />
              <i
                v-if="showPdf && scope.row.pdfLoading"
                class="el-icon el-icon-loading"
                style="font-size: 20px; color: #409eff"
              ></i>
            </div>
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
    },
    reqInquirySupplierQuantity: {
      type: [Number, String],
      default: undefined
    },
    quoteLinkEnabled: {
      type: String,
      default: '0'
    }
  },
  watch: {
    rfqVendorList: {
      immediate: true,
      handler: function (selected) {
        this.createTableList = JSON.parse(JSON.stringify(this.rfqVendorList))
        // this.tableList = JSON.parse(JSON.stringify(this.rfqVendorList))
        this.tableList = this.createTableList
        this.changeTableList()
      }
    },
    reqInquirySupplierQuantity: {
      handler: function (value) {
        this.inquirySupplierQuantity = value
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '37',
      savePath: 'purchaseMTable',
      columns: [
        {
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('PURCHASE.supplierCode'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'rfqPdf',
          label: vm.$t('PURCHASE.rfqPdf'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'contactPersonName',
          label: vm.$t('PURCHASE.contactPerson'),
          visible: true,
          width: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'email',
          label: vm.$t('PURCHASE.contactPersonEmail'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 170,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'quoteLinkEnabled',
          label: vm.$t('system.quoteLink'),
          minWidth: 170,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },

        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        }
      ],
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'businessPartnerId',
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.supplierSearch1')}`,
          type: 'InputEle'
        }
      ],
      // 查询参数
      queryParams: {
        condition: undefined
      },
      createTableList: [],
      inquirySupplierQuantity: undefined
    }
  },
  created() {
    this._stableCounter = 0
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleSortChange({ prop, order }) {
      this.handlerTableList()
      if (!prop || !order) {
        this.tableList = (this.tableList || []).slice().sort((a, b) => {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        })
        return
      }
      // 根据排序字段和顺序对数据进行排序（保留稳定性：相等时回退到 _stableIndex）
      this.tableList = (this.tableList || []).slice().sort((a, b) => {
        const valueA = a[prop] !== undefined && a[prop] !== null ? a[prop] : ''
        const valueB = b[prop] !== undefined && b[prop] !== null ? b[prop] : ''

        if (valueA === valueB) {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        }

        if (order === 'ascending') {
          return valueA > valueB ? 1 : -1
        } else if (order === 'descending') {
          return valueA < valueB ? 1 : -1
        }
        return 0
      })
    },
    handlerTableList() {
      // let table = JSON.parse(JSON.stringify(this.createTableList))
      let table = this.createTableList
      if (this.queryParams.condition) {
        table = table.filter((item) => {
          return this.$isContain(this.queryParams.condition, [
            item.businessPartnerName,
            item.businessPartnerNo,
            item.remarks
          ])
        })
      }
      // 确保每行有稳定索引，用于取消排序时恢复原始顺序
      table.forEach((row) => {
        if (row && row._stableIndex === undefined) {
          this._stableCounter = (this._stableCounter || 0) + 1
          this.$set(row, '_stableIndex', this._stableCounter)
        }
      })
      this.tableList = table
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.handlerTableList()
    },
    /** 重置 */
    resetSearchForm() {
      this.$refs.tables && this.$refs.tables.clearSort()
    },
    initList(list) {
      this.createTableList = JSON.parse(JSON.stringify(list))
      this.tableList = this.createTableList
    },
    getList() {
      return this.createTableList
    },
    errorMessage(code) {
      this.createTableList.forEach((item) => {
        if (!this.$resultOfBoolean(item[code])) {
          this.$set(item, code + 'Error', true)
        }
      })
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
      this.$set(row, 'contactPersonNameError', false)
    },
    handleAddBtn() {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      // this.$refs.selectSupplierTable.handleAdd(alreadySelectIdList)
      const tableList = JSON.parse(JSON.stringify(this.createTableList))
      this.$refs.selectSupplierTable.handleAdd(tableList, this.inquirySupplierQuantity)
    },
    updateTable(list, inquirySupplierQuantity) {
      this.inquirySupplierQuantity = inquirySupplierQuantity
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        rows.forEach((item) => {
          if (!item.contactPersonId) {
            this.$set(item, 'email', undefined)
            const ContactPersonList = item.bpBusinessContactPersonList || []
            if (ContactPersonList.length > 0) {
              let defaultContact = ContactPersonList.find((item) => item.isPurchaseDefault === '1')
              if (ContactPersonList.length === 1) {
                defaultContact = ContactPersonList[0]
              }
              if (defaultContact) {
                this.rowContactPersonChange(defaultContact, item)
              }
            }
          }
          if (!item.quoteLinkEnabled) {
            item.quoteLinkEnabled = this.quoteLinkEnabled
          }
        })

        // preserve or assign stable indices for incoming rows
        rows.forEach((r) => {
          if (r && r._stableIndex === undefined) {
            this._stableCounter = (this._stableCounter || 0) + 1
            r._stableIndex = this._stableCounter
          }
        })
        // this.tableList = [...this.tableList, ...rows]
        // this.tableList = rows
        // this.createTableList = rows
        this.createTableList.length = 0
        this.createTableList.push(...rows)
        this.tableList = this.createTableList
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
      } else {
        this.tableList = []
        this.createTableList = []
      }
    },
    changeTableList() {
      this.$emit('updateTable', this.createTableList, this.inquirySupplierQuantity)
      this.$$getColumnContentMaxWidth(this.columns, this.createTableList)
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
        this.createTableList = this.createTableList.filter(
          (x) => x[this.rowIdKey] !== row[this.rowIdKey]
        )
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
