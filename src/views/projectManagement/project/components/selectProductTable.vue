<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PRODUCT.completeTheProject')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @close="close"
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
      style="position: relative"
    >
      <div style="color: #f8bb5a; position: absolute; left: 10px">
        {{ $t('PRODUCT.confirmNeedReturning') }}
      </div>

      <right-toolbar
        :saveKey="saveKey"
        :savePath="savePath"
        :showRefreshBtn="true"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </search-form>

    <el-table
      border
      ref="tables"
      :data="tableList"
      :max-height="tableMaxHeight"
      @sort-change="handleSortChange"
      :row-class-name="'pointer'"
      class="mt20 table"
      v-loading="loading"
    >
      <!-- <el-table-column type="selection" width="55" :selectable="selectable" align="center" /> -->
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
        <!-- <template slot="header" slot-scope="{ column }">
          <template v-if="['returnedQty'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </template>

          <span v-else>{{ column.label }}</span>
        </template> -->
        <template slot-scope="scope">
          <template v-if="item.prop === 'productName'">
            <commonProductAndPicture :row="scope.row" />
          </template>

          <template v-else-if="item.prop === 'returnedQty'">
            <template>
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                v-model="scope.row.returnedQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="0"
                :max="scope.row.stockOutQty"
                :disabled="!scope.row.stockOutQty || scope.row.stockOutQty <= 0"
                @change="returnedQtyChange(scope.row)"
              />
            </template>
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
          <template v-else-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'qtyOnHand'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'availableQtyFrom'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'availableQtyTo'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'reservedQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'inTransitQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'basicUom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else-if="item.prop === 'remarks'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else-if="item.prop === 'stockOutQty'">
            <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
          </template>
          <template v-else-if="item.prop === 'consumptionQty'">
            <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
          </template>
          <template v-else-if="item.prop === 'alreadyTransferQty'">
            <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
          </template>

          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :saveKey="saveKey"
      :savePath="savePath"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="submit"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>

    <submitProductTable
      ref="submitProductTable"
      :costProjectId="costProjectId"
      @onSuccess="onSuccess"
    />
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryProjectProductionProductListByCostProjectId,
  saveProjectProductionReturnedProductList
} from '@/api/projectManagement/project'
import submitProductTable from './submitProductTable'
export default {
  components: {
    submitProductTable
  },
  mixins: [pageMixin],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    costProjectId: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '1010',
      savePath: 'selectProductTable',
      searchFormKey: Date.now(),
      loading: false,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'costProjectId',
      tableList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList: [],
      visible: false,
      columns: [
        {
          prop: 'projectProductionNo',
          label: vm.$t('PRODUCT.productionNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        // {
        //   prop: 'alias',
        //   label: vm.$t('PRODUCT.alias'),
        //   visible: true,
        //   minWidth: 200,
        //   sortable: 'custom',
        //   tooltip: true
        // },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: false
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        // {
        //   prop: 'description',
        //   label: vm.$t('ui.description'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: false
        // },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'stockOutQty',
          label: vm.$t('PRODUCT.outboundQTY'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'consumptionQty',
          label: vm.$t('PRODUCT.consumptionQty'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'alreadyTransferQty',
          label: vm.$t('PRODUCT.alreadyTransferQty'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'warehouseName',
          label: vm.$t('PRODUCT.warehouse'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'returnedQty',
          label: vm.$t('PRODUCT.returnQty'),
          visible: true,
          colMinWidth: 120,
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
          placeholder: `${this.$t('PRODUCT.productSearchAlias')}  / ${vm.$t(
            'PRODUCT.projectProductionNo'
          )}`,
          type: 'InputEle'
        }
      ],
      /* 已经选择的联系人Id(过滤) */
      alreadySelectIdList: [],
      timeStamp: undefined
    }
  },
  computed: {},
  watch: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    handleAdd(alreadySelectIdList) {
      this.alreadySelectIdList = alreadySelectIdList || []
      // this.queryParams.productCategoryId = ''
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    getList() {
      const vm = this
      const param = this.queryParams
      this.$trimOfObj(param)
      param.costProjectId = this.costProjectId
      this.loading = true
      queryProjectProductionProductListByCostProjectId(param)
        .then((response) => {
          this.loading = false
          this.total = response.total
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.returnedQty = 0
            this.selectList.forEach((x) => {
              if (item.projectProductionConsumptionId === x.projectProductionConsumptionId) {
                item.returnedQty = x.returnedQty
              }
            })
          })
          this.tableList = rows
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    returnedQtyChange(row) {
      const data = JSON.parse(JSON.stringify(row))
      const { returnedQty, projectProductionConsumptionId } = data
      const flag = this.selectList.some(
        (x) => x.projectProductionConsumptionId === projectProductionConsumptionId
      )

      if (flag) {
        if (returnedQty && returnedQty > 0) {
          this.selectList.forEach((x) => {
            if (x.projectProductionConsumptionId === projectProductionConsumptionId) {
              x.returnedQty = returnedQty
            }
          })
        } else {
          this.selectList = this.selectList.filter(
            (x) => x.projectProductionConsumptionId !== projectProductionConsumptionId
          )
        }
      } else {
        if (returnedQty && returnedQty > 0) {
          this.selectList.push(row)
        }
      }
    },
    selectable(row, rowIndex) {
      return true // 不禁用
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
    close() {
      this.selectList = []
      this.tableList = []
      this.$refs.tables.clearSelection()
    },
    onSuccess() {
      this.visible = false
      this.$emit('onSuccess')
    },
    submit() {
      if (this.selectList.length <= 0) {
        const params = {
          costProjectId: this.costProjectId,
          productList: []
        }
        this.$modal
          .confirm(this.$t('PRODUCT.confirmCompleted'))
          .then(() => {
            this.btnLoading = true
            saveProjectProductionReturnedProductList(params)
              .then((res) => {
                this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
                this.onSuccess()
                this.btnLoading = false
              })
              .catch(() => {
                this.btnLoading = false
              })
          })
          .catch(() => {
            this.btnLoading = false
          })
      } else {
        this.$refs.submitProductTable.handleAdd(this.selectList)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
