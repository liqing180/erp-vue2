<template>
  <div class="app-container">
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
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
      @row-dblclick="handleUpdate"
      @sort-change="handleSortChange"
      style="cursor: pointer"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="90" fixed="left" align="center">
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
        :min-width="item.minWidth"
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
          <template v-else-if="item.prop === 'isFailed'">
            <el-tag v-if="scope.row[item.prop] === 1">{{ $t('ui.y') }}</el-tag>
            <el-tag v-if="scope.row[item.prop] === 0" type="danger">{{ $t('ui.n') }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'sentStatus'">{{
            selectDictLabel(dict.type.email_send_status, scope.row.sentStatus)
          }}</template>
          <template v-else-if="item.prop === 'sentMode'">{{
            selectDictLabel(dict.type.email_send_mode, scope.row.sentMode)
          }}</template>
          <template v-else-if="item.prop === 'sendTime'">{{
            parseTime(scope.row.sendTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'createdTime'">{{
            parseTime(scope.row.createdTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'modifiedTime'">{{
            parseTime(scope.row.modifiedTime, fmtForYmdhms)
          }}</template>
          <template v-else>{{ scope.row[item.prop] }}</template>
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
              v-hasPermi="['system:pendingSendEmail:edit']"
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
import {
  queryPendingSendEmailList,
  queryPendingSendUserTemplateFor
} from '@/api/system/emailManagement'

export default {
  name: 'PendingSendEmail',
  directives: {},
  components: {},
  mixins: [pageMixin],
  dicts: ['email_send_status', 'email_send_mode'],
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
          prop: 'documentNo',
          label: vm.$t('system.documentNo'),
          visible: true,
          sortable: 'custom',
          fixed: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('system.businessPartnerName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'templateForShow',
          label: vm.$t('system.emailFor'),
          minWidth: 200,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'templateSubject',
          label: vm.$t('system.subject'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'toUser',
          label: vm.$t('system.to'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'isFailed',
          label: vm.$t('system.isFailed'),
          visible: true,
          minWidth: 130,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'sentStatus',
          label: vm.$t('system.sendStatus'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 180,
          sortable: 'custom',
          visible: true,
          tooltip: true
        }
      ],
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('system.documentNo')} / ${vm.$t('system.businessPartnerName')}`
        },
        {
          name: 'templateFor',
          label: vm.$t('system.emailFor'),
          type: 'SelectEle',
          width: '200px',
          selectValue: 'dicName',
          selectLabel: 'dicDesc',
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
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getList()
    this.queryUserTemplateFor()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },

  methods: {
    getList() {
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      this.loading = true
      queryPendingSendEmailList(param)
        .then((response) => {
          this.tableList = response.rows || []
          this.total = response.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    queryUserTemplateFor() {
      queryPendingSendUserTemplateFor().then((res) => {
        this.$set(this.searchData[1], 'selectData', res.data || [])
      })
    },
    // 修改
    handleUpdate(row) {
      this.$router.push({
        path: '/system/emailManagement/editPendingSendEmail',
        query: { id: row.id, timeId: +new Date() }
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
      this.this.queryUserTemplateFor()
    }
  }
}
</script>

<style scoped lang="scss"></style>
