<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <template v-if="!isView">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">{{
            $t('uiBtn.add')
          }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">{{
            $t('uiBtn.import')
          }}</el-button>
        </el-col>
      </template>

      <right-toolbar
        :saveKey="saveKey"
        @queryTable="queryTable"
        :showRefreshBtn="false"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      ref="termTable"
      :data="tableList"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      stripe
      class="mt22"
      max-height="390"
      border
      header-row-class-name="th-primary"
      highlight-current-row
      v-table-tab
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope"
          ><span>{{ scope.$index + 1 }} </span></template
        >
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
          <span v-if="['materialUom', 'requiredQty', 'estimatedLoss'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'productName'">
            <commonProductAndPicture :row="scope.row" />
          </template>
          <template v-else-if="item.prop === 'picture'">
            <div v-if="scope.row.defaultImageUrl" style="line-height: 0; height: 30px">
              <el-image
                style="height: 100%"
                :src="scope.row.defaultImageUrl"
                :preview-src-list="[scope.row.defaultImageUrl]"
              />
            </div>
          </template>
          <template v-else-if="item.prop === 'requiredQty'">
            <el-input-number
              v-model="scope.row.requiredQty"
              :precision="scope.row.decimalNum"
              v-thousandSplit="{ precision: scope.row.decimalNum }"
              :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
              :max="999999"
              placeholder=""
              style="width: 98%"
              controls-position="right"
              @change="inputNumberChange(scope.row)"
              v-if="!isView"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'estimatedLoss'">
            <el-input-number
              v-model="scope.row.estimatedLoss"
              :precision="0"
              v-thousandSplit="{ precision: 0 }"
              :min="1"
              :max="999999"
              :placeholder="`1 - ${$numberStr(999999, 0)}`"
              style="width: 98%"
              controls-position="right"
              @change="inputNumberChange(scope.row)"
              v-if="!isView"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>
          <template v-else-if="item.prop === 'materialUom'">
            <el-select
              style="width: 98%"
              v-model="scope.row.materialUom"
              :title="showUomLabel(scope.row[item.prop])"
              placeholder=""
              v-if="!isView"
            >
              <el-option
                v-for="item in scope.row.uomList || []"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <span v-else :title="showUomLabel(scope.row[item.prop])">{{
              scope.row[item.prop]
            }}</span>
          </template>
          <template v-else-if="item.prop === 'positionNo'">
            <el-input
              style="width: 98%"
              v-model="scope.row.positionNo"
              maxlength="500"
              placeholder=""
              v-if="!isView"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="isView"
            />
          </template>
          <template v-else-if="item.prop === 'categoryNameShowStr'">
            <ToolTipShowCategory :list="scope.row.categoryNameList || []">
              <div class="flow1">{{ scope.row[item.prop] }}</div>
            </ToolTipShowCategory>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column :label="$t('ui.action')" width="160" fixed="right" align="center">
        <template slot-scope="scope" v-if="!isView">
          <div class="flexCen">
            <i
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="delContentRowHandle(scope.$index)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <selectProductTable ref="selectProductTable" @onSuccess="updateProduct" />
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="updateTableList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from './selectProductTable.vue'

export default {
  components: { selectProductTable },
  mixins: [pageMixin],
  dicts: ['system_active', 'tax_type', 'tax_code_rounding_rules'],
  props: {
    isView: {
      type: Boolean,
      default: true
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '2',
      form: {},
      rules: {
        expenseItem: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        picUserName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        amount: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ]
      },
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          padding: 70,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PURCHASE.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PURCHASE.productCategory'),
          visible: true,
          minWidth: 200
          // tooltip: true
        },
        {
          prop: 'brand',
          label: vm.$t('PURCHASE.brand'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'materialUom',
          label: vm.$t('PRODUCT.materialUom'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'requiredQty',
          label: vm.$t('PRODUCT.requiredQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
        // {
        //   prop: 'estimatedLoss',
        //   label: vm.$t('PRODUCT.estimatedLoss'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        // {
        //   prop: 'totalQty',
        //   label: vm.$t('PRODUCT.totalQty'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        // {
        //   prop: 'positionNo',
        //   label: vm.$t('PRODUCT.positionNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      // 导入
      importOptions: {
        // 下载模板
        downFileUrl: '/sales/materialList/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/sales/materialList/checkImportData',
        // 提交导入
        importUrl: '/sales/materialList/importData',
        // 下载文件名
        fileName: 'Material List'
      },
      options: [],
      isContentEdit: false,
      tableList: [],
      editIndex: undefined
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  watch: {
    isView: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    init(data = []) {
      const rows = JSON.parse(JSON.stringify(data))
      this.tableList = rows
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    inputNumberChange(row) {
      const { requiredQty, estimatedLoss } = row
      let count
      if (requiredQty && estimatedLoss) {
        count = requiredQty + estimatedLoss
      } else if (requiredQty) {
        count = requiredQty
      } else if (estimatedLoss) {
        count = estimatedLoss
      }
      this.$set(row, 'totalQty', count)
    },
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'materialUom':
            item.fixedWidth = vm.isView ? undefined : 140
            break
          case 'positionNo':
            item.fixedWidth = vm.isView ? undefined : 140
            break
          case 'requiredQty':
            item.fixedWidth = vm.isView ? undefined : 140
            break
          case 'estimatedLoss':
            item.fixedWidth = vm.isView ? undefined : 140
            break
          case 'remarks':
            item.fixedWidth = vm.isView ? undefined : 140
            break
        }
      })
    },
    handleAdd() {
      const ids = this.tableList.map((x) => x.productId)
      this.$refs.selectProductTable.handleAdd(ids)
    },
    updateProduct(data = []) {
      const arr = JSON.parse(JSON.stringify(data))
      arr.forEach((x) => {
        if (x.uom) {
          x.materialUom = x.uom
        } else {
          x.materialUom = ''
        }
      })
      this.tableList = this.tableList.concat(arr)
    },
    updateTableList(e) {
      const { data } = e
      const ids = data.map((x) => x.productId)
      const arr = this.tableList.filter((x) => ids.indexOf(x.productId) === -1)
      const hash = []
      const newData = data.reduce((pre, cur) => {
        // eslint-disable-next-line no-unused-expressions
        hash[cur.productId] ? '' : (hash[cur.productId] = true && pre.push(cur))
        return pre
      }, [])
      const newTableList = newData.concat(arr)
      this.tableList = newTableList
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
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
      // const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      // if (cur) {
      //   color = 'table-SelectedRow-bgcolor'
      // }
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
    delContentRowHandle(index) {
      const vm = this
      vm.tableList.splice(index, 1)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
    }
  }
}
</script>
