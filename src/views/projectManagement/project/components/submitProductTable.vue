<template>
  <el-dialog
    v-dialogDrag
    :title="$t('PRODUCT.confirmComplete')"
    :visible.sync="visible"
    width="800px"
    :modal="true"
    :close-on-click-modal="false"
    append-to-body
    @close="close"
  >
    <el-table
      border
      ref="tables"
      :data="tableList"
      :max-height="tableMaxHeight"
      @sort-change="handleSortChange"
      :row-class-name="'pointer'"
      class="mt20 table"
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
        :min-width="getMinWidth(item)"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot-scope="scope">
          <template v-if="item.prop === 'productName'">
            <commonProductAndPicture :row="scope.row" />
          </template>
          <template v-else-if="item.prop === 'returnedQty'">
            {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
          </template>
          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('uiBtn.no') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="submit"
        >{{ $t('uiBtn.yes') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { saveProjectProductionReturnedProductList } from '@/api/projectManagement/project'
export default {
  directives: {
    // transferDom
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
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 160,
          tooltip: false
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'returnedQty',
          label: vm.$t('PRODUCT.returnQty'),
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
      this.tableList = alreadySelectIdList || []
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      this.visible = true
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },

    close() {
      this.tableList = []
    },
    submit() {
      this.btnLoading = true
      const params = {
        costProjectId: this.costProjectId,
        productList: this.tableList
      }
      console.log(params, '==============173')
      // return
      saveProjectProductionReturnedProductList(params)
        .then((res) => {
          this.$emit('onSuccess')
          this.visible = false
          this.btnLoading = false
        })
        .catch(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
