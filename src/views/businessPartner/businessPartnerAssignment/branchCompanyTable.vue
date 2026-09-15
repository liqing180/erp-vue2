<template>
  <div>
    <el-table
      border
      ref="tables"
      class="mb20"
      max-height="600px"
      :data="tableList"
      v-loading="loading"
    >
      <!-- <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column> -->
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
          <template v-if="item.prop === 'branchCompanyName'">
            <div style="text-align: left; word-wrap: break-word; word-break: normal">
              {{ scope.row[item.prop] }}
            </div>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
export default {
  components: {},
  mixins: [pageMixin],
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    topMsg: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    list: {
      immediate: true,
      handler: function (list) {
        const rows = list || []
        this.tableList = rows
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '4',
      showSearch: true,
      savePath: 'checkListTable',
      loading: false,
      // 总条数
      total: 0,
      /* 表格部分 */
      columns: [
        {
          prop: 'legalEntityName',
          label: vm.$t('organization.legalEntityName'),
          visible: true,
          width: 300,
          tooltip: true
        },
        {
          prop: 'branchCompanyName',
          label: vm.$t('organization.branchCompany'),
          visible: true,
          minWidth: 160,
          tooltip: false
        }
      ],
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        dateRange: undefined,
        goodsReceiptNoteNo: undefined
      },
      rowIdKey: 'goodsReceiptNoteId',
      selectRow: {}
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
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.form {
  /deep/ .el-form-item {
    margin-bottom: 8px;
  }
}

.flexEnd {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.desc {
  font-size: 12px;
}
</style>
