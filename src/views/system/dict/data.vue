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
      v-loading="loading"
      ref="tables"
      :data="tableList"
      @selection-change="handleSelectionChange"
      @row-dblclick="handleUpdate"
      :max-height="600"
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
          <template v-if="item.prop === 'createdTime'">{{
            parseTime(scope.row.createdTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'modifiedTime'">{{
            parseTime(scope.row.modifiedTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'dictLabel'">
            <span v-if="scope.row.listClass == '' || scope.row.listClass == 'default'">{{
              scope.row.dictLabel
            }}</span>
            <el-tag v-else :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass">{{
              scope.row.dictLabel
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'dictLabelZHCN'">
            <span v-if="scope.row.listClass == '' || scope.row.listClass == 'default'">{{
              scope.row.dictLabelZHCN
            }}</span>
            <el-tag v-else :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass">{{
              scope.row.dictLabelZHCN
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'status'">
            <el-tag v-if="scope.row.status === '0'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.status === '1'" type="danger">
              {{ $t('uiBtn.inactive') }}
            </el-tag>
          </template>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.dictLabel')" prop="dictLabel">
              <el-input v-model="form.dictLabel" :disabled="comDisFrom" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.dictType')">
              <el-input v-model="form.dictType" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.dictLabelCN')" prop="dictLabelZHCN">
              <el-input v-model="form.dictLabelZHCN" :disabled="comDisFrom" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.dictValue')" prop="dictValue">
              <el-input v-model="form.dictValue" :disabled="comDisFrom" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.cssClass')" prop="cssClass">
              <el-input v-model="form.cssClass" :disabled="comDisFrom" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.sort')" prop="dictSort">
              <el-input-number
                class="w100"
                v-model="form.dictSort"
                :disabled="comDisFrom"
                :precision="0"
                v-thousandSplit="{ precision: 0 }"
                controls-position="right"
                :min="0"
                :max="9999"
                @change="inputNumberChange('dictSort')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.createdBy')}`" prop="createdBy">
              <el-input v-model="form.createdBy" :title="form.createdBy" disabled maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.createdTime')}`" prop="createdTime">
              <el-date-picker
                :value="form.createdTime"
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
        <el-row>
          <el-form-item :label="$t('ui.remarks')" prop="remark">
            <MyInput
              v-model="form.remark"
              type="textarea"
              :maxlength="300"
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
          <el-col :span="12">
            <el-form-item :label="$t('ui.listClass')" prop="listClass">
              <el-select v-model="form.listClass" class="w100" :disabled="comDisFrom">
                <el-option
                  v-for="item in listClassOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
import { listData, getData, delData, addData, updateData, exportData } from '@/api/system/dict/data'
import { listType, getType } from '@/api/system/dict/type'
import pageMixin from '@/mixins/tableMinx'

export default {
  name: 'DictData',
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
          prop: 'dictCode',
          label: vm.$t('ui.dictCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'dictLabel',
          label: vm.$t('ui.dictLabel'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'dictLabelZHCN',
          label: vm.$t('ui.dictLabelCN'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'dictValue',
          label: vm.$t('ui.dictValue'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'dictSort',
          label: vm.$t('ui.sort'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'status',
          label: vm.$t('ui.isActive'),
          minWidth: 140,
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
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
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
        }
      ],
      // 默认字典类型
      defaultDictType: '',
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 数据标签回显样式
      listClassOptions: [
        {
          value: 'default',
          label: this.$t('ui.listClass_default')
        },
        {
          value: 'primary',
          label: this.$t('ui.listClass_primary')
        },
        {
          value: 'success',
          label: this.$t('ui.listClass_success')
        },
        {
          value: 'info',
          label: this.$t('ui.listClass_info')
        },
        {
          value: 'warning',
          label: this.$t('ui.listClass_warning')
        },
        {
          value: 'danger',
          label: this.$t('ui.listClass_danger')
        }
      ],
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
          name: 'dictLabel',
          label: vm.$t('ui.dictLabel'),
          type: 'InputEle',
          isLine: false
        },
        {
          name: 'dictType',
          label: vm.$t('ui.dictName'),
          type: 'SelectEle',
          selectValue: 'dictType',
          selectLabel: 'dictName',
          selectData: []
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
        dictLabel: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.dictLabel')),
            trigger: 'blur'
          }
        ],
        dictValue: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.dictValue')),
            trigger: 'blur'
          }
        ],
        dictSort: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.sort')),
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
      if (this.form.dictCode) {
        return !this.editAuth
      }
      return false
    }
  },
  created() {
    const dictId = this.$route.params && this.$route.params.dictId
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getType(dictId)
    this.getTypeList()
  },
  methods: {
    inputNumberChange(code) {
      this.$refs.form.validateField(code)
    },
    /** 查询字典类型详细 */
    getType(dictId) {
      getType(dictId).then((response) => {
        this.queryParams.dictType = response.data.dictType
        this.defaultDictType = response.data.dictType
        this.getList()
      })
    },
    /** 查询字典类型列表 */
    getTypeList() {
      listType().then((response) => {
        this.searchData.forEach((item) => {
          if (item.name === 'dictType') {
            item.selectData = response.rows || []
          }
        })
      })
    },
    /** 查询字典数据列表 */
    getList() {
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      listData(params).then((response) => {
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
        dictCode: undefined,
        dictLabel: undefined,
        dictLabelZHCN: undefined,
        dictValue: undefined,
        cssClass: undefined,
        listClass: 'default',
        dictSort: 0,
        status: '0',
        remark: undefined,
        createdBy: this.$store.state.user.nickName
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
      this.title = this.$t('ui.dictData')
      this.form.dictType = this.queryParams.dictType
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.dictCode)
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
      const dictCode = row.dictCode || this.ids
      getData(dictCode).then((response) => {
        this.form = response.data
        this.open = true
        this.title = this.$t('ui.dictData')
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line eqeqeq
          if (this.form.dictCode != undefined) {
            this.btnLoading = true
            updateData(this.form)
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
            addData(this.form)
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
      const dictCodes = row.dictCode || this.ids
      this.$modal
        .confirm(this.$t('ui.delDictDataConfirm').replace('$1', dictCodes))
        .then(function () {
          return delData(dictCodes)
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
          return exportData(queryParams)
        })
        .then((response) => {
          this.$download.name(response.msg)
          this.exportLoading = false
        })
        .catch(() => {})
    }
  }
}
</script>
