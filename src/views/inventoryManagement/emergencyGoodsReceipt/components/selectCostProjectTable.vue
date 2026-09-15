<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('menu.project')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
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
      class="mt10"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      :row-class-name="'pointer'"
      :max-height="tableMaxHeight"
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
        :min-width="getMinWidth(item)"
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
          <template v-else-if="item.prop === 'actualCost'">
            {{ $numberStr(scope.row[item.prop], 6, false, 2) }}
          </template>
          <template v-else-if="item.prop === 'salesAmount'">
            {{ $numberStr(scope.row[item.prop], 6, false, 2) }}
          </template>
          <template v-else-if="item.prop === 'profit'">
            {{ $numberStr(scope.row[item.prop], 6, false, 2) }}
          </template>
          <template v-else-if="item.prop === 'profitMargin'">
            {{ $numberStr(scope.row[item.prop], 6, false, 2) }}
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
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryCanSelectCostProjectListForPage } from '@/api/projectManagement/project'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'
export default {
  dicts: ['user_status'],
  mixins: [pageMixin],
  props: {
    departmentId: {
      type: String,
      default: ''
    }
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    const vm = this

    return {
      saveKey: '13',
      savePath: 'EGRTable',
      searchFormKey: Date.now(),
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      tableList: [],
      tableMaxHeightResize: true,
      selected: '',
      visible: false,
      columns: [
        {
          prop: 'costProjectCode',
          label: vm.$t('PRODUCT.projectNameNo'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'costProjectName',
          label: vm.$t('PRODUCT.projectName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'receiveAddress',
          label: vm.$t('ui.address'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'costProjectDescription',
          label: vm.$t('PRODUCT.projectDescription'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('SALES.customer'),
          visible: true,
          minWidth: 200,
          padding: 50,
          tooltip: true
        },
        // {
        //   prop: 'currency',
        //   label: vm.$t('ui.currency'),
        //   minWidth: 160,
        //   visible: true,
        //   tooltip: true
        // },
        // {
        //   prop: 'actualCost',
        //   label: vm.$t('PRODUCT.actualCost'),
        //   visible: true,
        //   minWidth: 200,
        //   padding: 50,
        //   tooltip: true,
        //   align: 'right'
        // },
        // {
        //   prop: 'salesAmount',
        //   label: vm.$t('PRODUCT.salesAmount'),
        //   visible: true,
        //   minWidth: 200,
        //   padding: 50,
        //   tooltip: true,
        //   align: 'right'
        // },
        // {
        //   prop: 'profit',
        //   label: vm.$t('PRODUCT.profit'),
        //   visible: true,
        //   minWidth: 150,
        //   tooltip: true,
        //   align: 'right'
        // },
        // {
        //   prop: 'profitMargin',
        //   label: vm.$t('SALES.profitMargin'),
        //   visible: true,
        //   minWidth: 150,
        //   tooltip: true
        // },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 170,
          sortable: 'custom',
          visible: true
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${vm.$t('PRODUCT.projectTemplateSearch')} / ${vm.$t('SALES.customerName')}`,
          type: 'InputEle'
        }
      ]
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleOpen() {
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    getList() {
      const vm = this
      const param = this.queryParams
      this.$trimOfObj(param)
      param.departmentId = this.departmentId
      this.loading = true
      queryCanSelectCostProjectListForPage(param)
        .then((response) => {
          this.loading = false
          this.total = response.total
          // this.tableList = response.rows
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          })
          this.tableList = rows

          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
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
      this.$emit('update', row)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}
</style>
