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
        @queryTable="getList"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      ref="tables"
      border
      v-loading="loading"
      :data="tableList"
      @row-dblclick="handleUpdate"
      style="cursor: pointer"
    >
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
          <template v-if="item.prop === 'createTime'">{{
            parseTime(scope.row.createTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'updateTime'">{{
            parseTime(scope.row.updateTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'active'">
            <el-tag v-if="scope.row.active === 1">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.active === 0" type="danger">
              {{ $t('uiBtn.inactive') }}
            </el-tag>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <el-form ref="form" class="mr40" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.businessId')">
              <el-input :value="form.businessId" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.fileName')">
              <el-input :value="form.fileName" :title="form.fileName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.fileExtension')">
              <el-input :value="form.fileExtension" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.isActive')">
              <el-switch :value="form.active" disabled :active-value="1" :inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.creatorName')}`" prop="createBy">
              <el-input :value="form.creatorName" :title="form.creatorName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.createdTime')}`">
              <el-date-picker
                :value="form.createTime"
                :format="fmtForYmdhms"
                :style="{ width: '100%' }"
                disabled
                placeholder=""
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.attachment')}`">
            <myUpload ref="uploadRef" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryFileRecordList, queryFileRecordById } from '@/api/system/fileManagement'
import pageMixin from '@/mixins/tableMinx'

export default {
  name: 'FileManagement',
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      saveKey: '1',
      btnLoading: false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 参数表格数据
      tableList: [],
      columns: [
        {
          prop: 'businessId',
          label: vm.$t('ui.businessId'),
          visible: true,
          minWidth: 180,
          tooltip: true,
          fixed: true
        },

        {
          prop: 'fileName',
          label: vm.$t('ui.fileName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'fileExtension',
          label: vm.$t('ui.fileExtension'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'active',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 120
        },
        {
          prop: 'creatorName',
          label: vm.$t('ui.creatorName'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 170,
          visible: true
        }
      ],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('ui.businessId')} / ${this.$t('ui.fileName')}`
        }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      let params = this.addDateRange(this.queryParams, this.dateRange)
      params = this.$trimOfObj(params)

      queryFileRecordList(params).then((response) => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        configId: undefined,
        configName: undefined,
        configKey: undefined,
        configValue: undefined,
        configType: 'Y',
        remark: undefined,
        createBy: this.$store.state.user.nickName
      }
      setTimeout(() => {
        this.$refs.uploadRef.initFileList([])
      }, 100)
      this.resetForm('form')
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
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.reset()
      queryFileRecordById(row.id).then((response) => {
        const results = response.data || {}
        this.form = results
        setTimeout(() => {
          this.$refs.uploadRef.initFileList([results])
        }, 100)
        this.open = true
        this.title = this.$t('ui.viewFile')
      })
    }
  }
}
</script>
