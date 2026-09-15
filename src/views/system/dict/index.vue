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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dict:add']"
          >{{ $t('uiBtn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:dict:remove']"
          >{{ $t('uiBtn.delete') }}
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"

          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['system:dict:export']"
          >{{ $t('uiBtn.export') }}
        </el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-refresh"
          size="mini"
          @click="handleRefreshCache"
          v-hasPermi="['system:dict:remove']"
          >{{ $t('uiBtn.refreshCache') }}</el-button
        >
      </el-col>
      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        @queryTable="getList"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      @row-dblclick="handleUpdate"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        v-if="checkPermi(['system:dict:remove'])"
      />

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
          <template v-else-if="item.prop === 'modifiedTime'">{{
            parseTime(scope.row.modifiedTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'status'">
            <el-tag v-if="scope.row.status === '0'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.status === '1'" type="danger">
              {{ $t('uiBtn.inactive') }}
            </el-tag>
          </template>
          <router-link
            v-else-if="item.prop === 'dictType'"
            :to="'/system/dict-data/index/' + scope.row.dictId"
            class="link-type"
          >
            <span>{{ scope.row.dictType }}</span>
          </router-link>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :min-width="160"
        :label="$t('ui.action')"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-edit pointer mr5"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.edit')"
              v-hasPermi="['system:dict:edit']"
              @click="handleUpdate(scope.row)"
            ></i>
            <i
              v-hasPermi="['system:dict:remove']"
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelete(scope.row)"
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('ui.dictName')"
              prop="dictNameEn"
              v-if="language === 'en'"
              key="dictName111"
            >
              <el-input v-model="form.dictNameEn" :disabled="comDisFrom" />
            </el-form-item>
            <el-form-item :label="$t('ui.dictName')" prop="dictName" v-else key="dictName222">
              <el-input v-model="form.dictName" :disabled="comDisFrom" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.dictType')" prop="dictType">
              <el-input v-model="form.dictType" :disabled="comDisFrom" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.createdBy')}`" prop="createBy">
              <el-input v-model="form.createBy" :title="form.createBy" disabled maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.createdTime')}`" prop="createTime">
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
        <!--  <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.modifiedBy')">
              <el-input disabled v-model="form.modifiedBy" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.modifiedTime')}`">
              <el-date-picker
                :value="form.modifiedTime"
                :format="fmtForYmdhms"
                :style="{ width: '100%' }"
                disabled
                placeholder=""
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-form-item :label="$t('ui.remarks')" prop="remark">
            <MyInput
              v-model="form.remark"
              :maxlength="300"
              type="textarea"
              :disabled="comDisFrom"
            ></MyInput>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.isActive')" prop="status">
              <el-switch
                v-model="form.status"
                :disabled="comDisFrom"
                active-value="0"
                inactive-value="1"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
        <el-button type="primary" v-if="!comDisFrom" @click="submitForm" :loading="btnLoading">{{
          $t('uiBtn.submit')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listType,
  getType,
  delType,
  addType,
  updateType,
  exportType,
  refreshCache
} from '@/api/system/dict/type'
import pageMixin from '@/mixins/tableMinx'
export default {
  name: 'Dict',
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
      // 字典表格数据
      tableList: [],
      columns: [
        {
          prop: 'dictName',
          label: vm.$t('ui.dictName'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'dictType',
          label: vm.$t('ui.dictType'),
          visible: true,
          minWidth: 220,
          tooltip: true
        },
        {
          prop: 'status',
          label: vm.$t('ui.isActive'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'remark',
          label: vm.$t('ui.remarks'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        }
        /* {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 170,
          visible: true
        } */
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
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      searchData: [
        {
          name: 'dictName',
          label: vm.$t('ui.dictName'),
          type: 'InputEle',
          isLine: false
        },
        {
          name: 'dictType',
          label: vm.$t('ui.dictType'),
          type: 'InputEle',
          isLine: false
        },
        {
          name: 'status',
          label: vm.$t('ui.isActive'),
          type: 'SelectEle',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: vm.$t('uiBtn.active'), value: '0' },
            { label: vm.$t('uiBtn.inactive'), value: '1' }
          ]
        }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictNameEn: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.dictName')),
            trigger: 'blur'
          }
        ],
        dictName: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.dictNameCN')),
            trigger: 'blur'
          }
        ],
        dictType: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.dictType')),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['system:dict:edit'])
    },
    comDisFrom() {
      if (this.form.dictId) {
        return !this.editAuth
      }
      return false
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    language() {
      return this.$store.getters.language
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getList()
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true
      let params = this.addDateRange(this.queryParams, this.dateRange)
      params = this.$trimOfObj(params)
      listType(params).then((response) => {
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
        dictId: undefined,
        dictNameEn: undefined,
        dictName: undefined,
        dictType: undefined,
        status: '0',
        remark: undefined,
        createBy: this.$store.state.user.nickName
      }
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = this.$t('ui.dict')
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.dictId)
      // eslint-disable-next-line eqeqeq
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.reset()
      const dictId = row.dictId || this.ids
      getType(dictId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = this.$t('ui.dict')
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line eqeqeq
          if (this.form.dictId != undefined) {
            this.btnLoading = true
            updateType(this.form)
              .then((response) => {
                this.btnLoading = false
                this.$modal.msgSuccess(this.$t('ui.modifiedSuccess'))
                this.open = false
                this.getList()
              })
              .catch(() => {
                this.btnLoading = false
              })
          } else {
            this.btnLoading = true
            addType(this.form)
              .then((response) => {
                this.btnLoading = false
                this.$modal.msgSuccess(this.$t('ui.addSuccess'))
                this.open = false
                this.getList()
              })
              .catch(() => {
                this.btnLoading = false
              })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids
      this.$modal
        .confirm(this.$t('ui.delDictConfirm').replace('$1', dictIds))
        .then(function () {
          return delType(dictIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('ui.deleteSuccess'))
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$modal
        .confirm(this.$t('ui.exportDictConfirm'))
        .then(() => {
          this.exportLoading = true
          return exportType(queryParams)
        })
        .then((response) => {
          this.$download.name(response.msg)
          this.exportLoading = false
        })
        .catch(() => {})
    },
    /** 刷新缓存按钮操作 */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.$modal.msgSuccess(this.$t('ui.refreshSuccess'))
      })
    }
  }
}
</script>
