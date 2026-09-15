<template>
  <div class="app-container">
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :topShowCount="1"
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-hasPermi="['system:tax:add']"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>

      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      class="mt10"
      v-loading="loading"
      :data="tableList"
      max-height="600"
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
        :min-width="getMinWidth(item)"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot-scope="scope">
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'isDefault'">
            <el-tag v-if="scope.row.isDefault === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isDefault === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>

          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-edit pointer mr5"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.edit')"
              v-hasPermi="['system:tax:edit']"
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
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/system/lang/index'
import { queryTaxCodeList, queryTaxCodeCountry } from '@/api/system/tax'

export default {
  components: {},
  mixins: [pageMixin],
  dicts: ['system_active', 'tax_type'],
  data() {
    const vm = this
    return {
      saveKey: '1',
      searchFormKey: Date.now(),
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      ids: [],
      // 显示搜索条件
      showSearch: true,
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      columns: [
        {
          prop: 'taxNo',
          label: vm.$t('taxCode.taxNo'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        },
        {
          prop: 'country',
          label: vm.$t('taxCode.countriesAndRegionsName'),
          visible: true,
          minWidth: 180,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'taxRate',
          label: vm.$t('taxCode.taxRate'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('taxCode.description'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'taxType',
          propBy: 'taxTypeStr',
          label: vm.$t('ui.type'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'isDefault',
          label: vm.$t('ui.isDefault'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
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
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('taxCode.taxNo')} / ${vm.$t(
            'taxCode.countriesAndRegionsName'
          )} / ${vm.$t('taxCode.description')}`
        },
        {
          name: 'countryId',
          label: vm.$t('taxCode.countriesAndRegionsName'),
          type: 'SelectEle',
          width: '200px',
          selectValue: 'dicValue',
          selectLabel: 'dicName',
          selectData: []
        },

        {
          name: 'isActive',
          label: vm.$t('ui.isActive'),
          type: 'SelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'system_active',
          selectData: []
        },
        {
          name: 'isDefaultList',
          label: vm.$t('ui.isDefault'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'system_active',
          selectData: []
        },
        {
          name: 'taxTypeList',
          label: vm.$t('ui.type'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'tax_type',
          selectData: []
        }
      ]
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
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getList()
  },
  mounted() {
    this.queryTaxCodeCountry()
  },
  methods: {
    getList() {
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      this.loading = true
      queryTaxCodeList(param)
        .then((response) => {
          this.loading = false
          this.total = response.total
          const rows = response.rows || []
          rows.forEach((item) => {
            item.taxRate = this.$numberStr(item.taxRate, 1)
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.taxTypeStr = this.selectDictLabel(this.dict.type.tax_type, item.taxType)
          })
          this.tableList = rows

          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.loading = false
        })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.taxTypeStr = this.selectDictLabel(this.dict.type.tax_type, item.taxType)
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    queryTaxCodeCountry() {
      queryTaxCodeCountry().then((res) => {
        this.$set(this.searchData[1], 'selectData', res.data || [])
      })
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
      this.queryTaxCodeCountry()
    },
    handleAdd() {
      this.$router.push({
        path: '/system/addTax',
        query: {
          timeId: Date.now()
        }
      })
    },
    handleUpdate(row) {
      this.$router.push({
        path: '/system/editTax',
        query: {
          timeId: Date.now(),
          id: row.taxId
        }
      })
    }
  }
}
</script>

<style scoped>
.searchWidth {
  width: 240px;
}
.clearfix {
  content: '';
  clear: both;
  zoom: 1;
}
</style>
