<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('ui.businessPartnerAssignment')"
    :visible.sync="visible"
    width="900px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
  >
    <el-table
      border
      ref="tables"
      class="mt10"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      :row-class-name="'pointer'"
      :max-height="tableMaxHeight"
      row-key="vid"
      :default-expand-all="false"
      :tree-props="{ children: 'child', hasChildren: 'hasChildren' }"
    >
      <!-- <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
        </template>
      </el-table-column> -->
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
          <el-switch
            v-if="item.prop === 'isActive'"
            v-model="scope.row.isActive"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <el-switch
            v-else-if="item.prop === 'isDefault'"
            v-model="scope.row.isDefault"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template v-else-if="item.prop === 'type'">{{
            selectDictLabel(dict.type.corporate_type, scope.row.type)
          }}</template>

          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        key="supplier"
        v-if="businessPartnerType.indexOf('1') !== -1"
        :label="$t('ui.supplier')"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <div style="cursor: pointer" @click.self.stop="supplierCellClick(scope.row)">
            <el-checkbox
              :false-label="'0'"
              :true-label="'1'"
              v-model="scope.row.supplierAssigned"
              @change="supplierCheckChange(scope.row)"
            ></el-checkbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        key="customer"
        v-if="businessPartnerType.indexOf('0') !== -1"
        :label="$t('ui.customer')"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <div style="cursor: pointer" @click.self="customerCellClick(scope.row)">
            <el-checkbox
              :false-label="'0'"
              :true-label="'1'"
              v-model="scope.row.customerAssigned"
              @change="customerCheckChange(scope.row)"
            ></el-checkbox>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="submit"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryCorporateList,
  queryCorporateListByBpId,
  saveAssignment,
  updateAssignment
} from '@/api/businessPartner/bpAssignment'
import locale from '@/views/organization/lang/index'
import UUID from '@/utils/UUID/uuid'
export default {
  directives: {},
  dicts: ['corporate_type'],
  mixins: [pageMixin],
  props: {
    warehouseId: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '3',
      savePath: 'assignmentDlg',
      loading: false,
      btnLoading: false,
      // 总条数
      total: 0,
      tableList: [],
      ids: [],
      businessPartnerType: '',
      visible: false,
      columns: [
        {
          prop: 'name',
          label: vm.$t('organization.corporate'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true,
          align: 'left'
        },
        {
          prop: 'type',
          label: vm.$t('organization.type'),
          visible: true,
          minWidth: 170,
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('PURCHASE.port')}`,
          type: 'InputEle'
        }
      ]
    }
  },
  computed: {},
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    supplierCellClick(row) {
      const oldValue = row.supplierAssigned
      const newValue = oldValue === '1' ? '0' : '1'
      this.$set(row, 'supplierAssigned', newValue)
      if (row.child && row.child.length > 0) {
        row.child.forEach((item) => {
          this.$set(item, 'supplierAssigned', newValue)
        })
      }
      this.$refs.tables.toggleRowExpansion(row, true)
    },
    supplierCheckChange(row) {
      const newValue = row.supplierAssigned
      if (row.child && row.child.length > 0) {
        row.child.forEach((item) => {
          this.$set(item, 'supplierAssigned', newValue)
        })
      }
      this.$refs.tables.toggleRowExpansion(row, true)
    },
    customerCellClick(row) {
      const oldValue = row.customerAssigned
      const newValue = oldValue === '1' ? '0' : '1'
      this.$set(row, 'customerAssigned', newValue)
      if (row.child && row.child.length > 0) {
        row.child.forEach((item) => {
          this.$set(item, 'customerAssigned', newValue)
        })
      }
      this.$refs.tables.toggleRowExpansion(row, true)
    },
    customerCheckChange(row) {
      const newValue = row.customerAssigned
      if (row.child && row.child.length > 0) {
        row.child.forEach((item) => {
          this.$set(item, 'customerAssigned', newValue)
        })
      }
      this.$refs.tables.toggleRowExpansion(row, true)
    },
    handleOpen(ids, type, isEdit) {
      this.ids = ids
      this.isEdit = isEdit
      this.businessPartnerType = type
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.tableList = []
      this.getList()
    },
    getList() {
      const vm = this
      this.loading = true
      const param = {}
      let queryFn
      if (this.isEdit) {
        queryFn = queryCorporateListByBpId
        param.businessPartnerMainId = this.ids[0]
      } else {
        queryFn = queryCorporateList
      }
      queryFn(param)
        .then((response) => {
          const rows = this.setVidForList(response.rows || [])
          this.tableList = rows

          this.loading = false
          this.total = response.total
          // this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    setVidForList(list) {
      const uuidObj = new UUID()
      const fn = function (ta) {
        const tmpList = ta.map((item) => {
          const uuid = uuidObj.getUUID()
          item.vid = uuid
          item.supplierAssigned = item.supplierAssigned === '1' ? '1' : '0'
          item.customerAssigned = item.customerAssigned === '1' ? '1' : '0'
          if (Array.isArray(item.child)) {
            fn(item.child)
          }
          return item
        })
        return tmpList
      }

      if (Array.isArray(list)) {
        const rs = fn(list)
        return rs
      } else {
        return list
      }
    },
    submit() {
      let params = {
        ids: this.ids,
        corporates: this.tableList,
        businessPartnerType: this.businessPartnerType
      }
      params = this.$trimOfObj(JSON.parse(JSON.stringify(params)))
      let saveFn
      if (this.isEdit) {
        saveFn = updateAssignment
      } else {
        saveFn = saveAssignment
      }
      this.$modal
        .confirm(this.$t('bp.assignmentConfirm'))
        .then(() => {
          return saveFn(params)
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('bp.assignmentSuccess').replace('$1', response.msg))
          this.$emit('onSuccess')
          this.handleBack()
        })
        .catch(() => {})
    },

    handleBack() {
      const vm = this
      vm.visible = false
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables.clearSort()
      this.getList()
    },
    handleRowClick(row) {
      // this.$emit('update', row)
      // this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}
</style>
