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
          v-hasPermi="['system:config:add']"
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
          v-hasPermi="['system:config:remove']"
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
          v-hasPermi="['system:config:export']"
          >{{ $t('uiBtn.export') }}
        </el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-refresh"
          size="mini"
          @click="handleRefreshCache"
          v-hasPermi="['system:config:remove']"
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
      ref="tables"
      border
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
        v-if="checkPermi(['system:config:remove'])"
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
          <template v-else-if="item.prop === 'updateTime'">{{
            parseTime(scope.row.updateTime, fmtForYmdhms)
          }}</template>
          <dict-tag
            v-else-if="item.prop === 'configType'"
            :options="dict.type.sys_yes_no"
            :value="scope.row.configType"
          />
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        class-name="small-padding fixed-width"
        :min-width="160"
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-edit pointer mr5"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.edit')"
              v-hasPermi="['system:config:edit']"
              @click="handleUpdate(scope.row)"
            ></i>
            <i
              v-hasPermi="['system:config:remove']"
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
              :label="$t('ui.configName')"
              prop="configNameEn"
              v-if="language === 'en'"
              key="configName111"
            >
              <el-input v-model="form.configNameEn" :disabled="comDisFrom" />
            </el-form-item>
            <el-form-item :label="$t('ui.configName')" prop="configName" v-else key="configName222">
              <el-input v-model="form.configName" :disabled="comDisFrom" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.configKey')" prop="configKey">
              <el-input v-model="form.configKey" :disabled="comDisFrom" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.configValue')" prop="configValue">
              <el-input v-model="form.configValue" :disabled="comDisFrom" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item :label="$t('ui.configType')" prop="configType">
              <el-radio-group v-model="form.configType" :disabled="comDisFrom">
                <el-radio
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col> -->
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
        <el-row>
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
        </el-row>
        <el-row v-if="language === 'en'" key="remarks111">
          <el-form-item :label="$t('ui.remarks')" prop="remarkEn">
            <MyInput
              type="textarea"
              v-model="form.remarkEn"
              :disabled="comDisFrom"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="300"
            ></MyInput>
          </el-form-item>
        </el-row>
        <el-row v-else key="remarks222">
          <el-form-item :label="$t('ui.remarks')" prop="remark">
            <MyInput
              type="textarea"
              v-model="form.remark"
              :disabled="comDisFrom"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="300"
            ></MyInput>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
        <el-button type="primary" v-if="!comDisFrom" @click="submitForm" :loading="btnLoading"
          >{{ $t('uiBtn.submit') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listConfig,
  getConfig,
  delConfig,
  addConfig,
  updateConfig,
  exportConfig,
  refreshCache
} from '@/api/system/config'
import pageMixin from '@/mixins/tableMinx'

export default {
  name: 'Config',
  dicts: ['sys_yes_no'],
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
          prop: 'configName',
          label: vm.$t('ui.configName'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'configKey',
          label: vm.$t('ui.configKey'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'configValue',
          label: vm.$t('ui.configValue'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        /* {
          prop: 'configType',
          label: vm.$t('ui.configType'),
          minWidth: 140,
          visible: true,
          tooltip: true
        }, */
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
        },
        {
          prop: 'updateBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'updateTime',
          label: vm.$t('ui.modifiedTime'),
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
        configNameEn: undefined,
        configName: undefined,
        configKey: undefined,
        configType: undefined
      },
      searchData: [
        {
          name: 'configName',
          label: vm.$t('ui.configName'),
          type: 'InputEle',
          isLine: false
        },
        {
          name: 'configKey',
          label: vm.$t('ui.configKey'),
          type: 'InputEle',
          isLine: false
        },
        {
          name: 'configType',
          label: vm.$t('ui.configType'),
          type: 'SelectEle',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'sys_yes_no',
          selectData: []
        }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        configNameEn: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.configName')),
            trigger: 'blur'
          }
        ],
        configName: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.configNameCN')),
            trigger: 'blur'
          }
        ],
        configKey: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.configKey')),
            trigger: 'blur'
          }
        ],
        configValue: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.configValue')),
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
      return this.checkPermi(['system:config:edit'])
    },
    comDisFrom() {
      if (this.form.configId) {
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
    /** 查询参数列表 */
    getList() {
      this.loading = true
      let params = this.addDateRange(this.queryParams, this.dateRange)
      params = this.$trimOfObj(params)

      listConfig(params).then((response) => {
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
      this.title = this.$t('ui.config')
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.configId)
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
      const configId = row.configId || this.ids
      getConfig(configId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = this.$t('ui.config')
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line eqeqeq
          if (this.form.configId != undefined) {
            this.btnLoading = true
            updateConfig(this.form)
              .then((response) => {
                this.btnLoading = false
                this.$modal.msgSuccess(this.$t('ui.modifiedSuccess'))
                this.open = false
                this.getList()
                if (this.form.configKey === 'sys_is_auto_code') {
                  this.$store.commit('SET_AUTO_CODE', this.form.configValue)
                }
                if (this.form.configKey === 'rounding_mode') {
                  this.$store.commit('SET_TO_FIXED_TYPE', this.form.configValue)
                }
              })
              .catch(() => {
                this.btnLoading = false
              })
          } else {
            this.btnLoading = true
            addConfig(this.form)
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
      const configIds = row.configId || this.ids
      this.$modal
        .confirm(this.$t('ui.delConfigConfirm').replace('$1', configIds))
        .then(function () {
          return delConfig(configIds)
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
        .confirm(this.$t('ui.exportConfigConfirm'))
        .then(() => {
          this.exportLoading = true
          return exportConfig(queryParams)
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
