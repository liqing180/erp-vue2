<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item :label="$t('ui.deptName')" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('ui.isActive')" prop="status">
        <el-select
          v-model="queryParams.status"
          clearable
          placeholder=""
          size="small"
          @change="handleQuery"
        >
          <el-option :label="$t('uiBtn.active')" value="0" />
          <el-option :label="$t('uiBtn.inactive')" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
          >{{ $t('uiBtn.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >{{ $t('uiBtn.reset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dept:add']"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-sort" size="mini" @click="toggleExpandAll">{{
          $t('ui.expand')
        }}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      border
      v-if="refreshTable"
      v-loading="loading"
      :data="tableList"
      row-key="deptId"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @row-dblclick="handleUpdate"
      style="cursor: pointer"
    >
      <el-table-column
        prop="deptName"
        :label="$t('ui.deptName')"
        :min-width="200"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="orderNum" :label="$t('ui.sort')" :min-width="120"></el-table-column>
      <el-table-column prop="status" :label="$t('ui.isActive')" :min-width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '0'">{{ $t('uiBtn.active') }}</el-tag>
          <el-tag v-if="scope.row.status === '1'" type="danger">
            {{ $t('uiBtn.inactive') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('ui.createdBy')" align="center" prop="createdBy" :min-width="160">
      </el-table-column>
      <el-table-column
        :label="$t('ui.createdTime')"
        align="center"
        prop="createdTime"
        :min-width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.modifiedBy')"
        align="center"
        prop="modifiedBy"
        :min-width="160"
      >
      </el-table-column>
      <el-table-column
        :label="$t('ui.modifiedTime')"
        align="center"
        prop="modifiedTime"
        :min-width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.modifiedTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        class-name="small-padding fixed-width"
        width="180"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-hasPermi="['system:dept:edit']"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >{{ $t('uiBtn.edit') }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
            >{{ $t('uiBtn.add') }}</el-button
          >
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            style="color: #f56c6c"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
            >{{ $t('uiBtn.delete') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
      @close="close"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0 && deptOptions.length > 0">
            <el-form-item :label="$t('ui.parentDept')" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder=""
                :disabled="comDisFrom"
                @input="parentChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.deptName')" prop="deptName">
              <el-input v-model="form.deptName" :disabled="comDisFrom" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.sort')" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                :precision="0"
                v-thousandSplit="{ precision: 0 }"
                controls-position="right"
                :disabled="comDisFrom"
                :min="0"
                :max="9999"
                style="width: 100%"
                @change="inputNumberChange('orderNum')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.leader')" prop="leader">
              <el-input v-model="form.leader" maxlength="20" :disabled="comDisFrom" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.mobilePhone')" prop="phone">
              <el-input v-model="form.phone" maxlength="50" :disabled="comDisFrom" />
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
          <el-col :span="12">
            <el-form-item :label="$t('ui.isActive')">
              <el-switch
                v-model="form.status"
                :disabled="comDisFrom"
                active-value="0"
                inactive-value="1"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.email')" prop="email">
              <el-input
                v-model.trim="form.email"
                :title="form.email"
                maxlength="50"
                :disabled="comDisFrom"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
        <el-button type="primary" v-if="!comDisFrom" @click="submitForm" :loading="btnLoading">
          {{ $t('uiBtn.submit') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listDept,
  getDept,
  delDept,
  addDept,
  updateDept,
  listDeptExcludeChild
} from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Dept',
  components: { Treeselect },
  data() {
    return {
      btnLoading: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      tableList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 是否展开
      expand: false,
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验

      rules: {
        parentId: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.parentDept')),
            trigger: 'blur'
          }
        ],
        deptName: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.deptName')),
            trigger: 'blur'
          }
        ],
        orderNum: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.sort')),
            trigger: 'blur'
          }
        ],
        email: [
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['system:dept:edit'])
    },
    comDisFrom() {
      if (this.form.deptId) {
        return !this.editAuth
      }
      return false
    }
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      listDept(params).then((response) => {
        this.tableList = this.handleTree(response.data, 'deptId')
        this.loading = false
      })
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: '0',
        createdBy: this.$store.state.user.nickName
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    inputNumberChange(code) {
      this.$refs.form.validateField(code)
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      // eslint-disable-next-line eqeqeq
      if (row != undefined) {
        this.form.parentId = row.deptId
      }
      this.open = true
      this.title = this.$t('ui.dept')
      listDept().then((response) => {
        this.deptOptions = this.handleTree(response.data, 'deptId')
      })
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row, column, even) {
      try {
        if (even && even.target._prevClass.indexOf('el-icon-arrow-right') !== -1) {
          return
        }
      } catch (err) {}
      this.reset()
      getDept(row.deptId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = this.$t('ui.dept')
      })
      listDeptExcludeChild(row.deptId).then((response) => {
        this.deptOptions = this.handleTree(response.data, 'deptId')
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line eqeqeq
          if (this.form.deptId != undefined) {
            this.btnLoading = true
            updateDept(this.form)
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
            addDept(this.form)
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
        } else {
          this.formItemVerify()
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm(this.$t('ui.delDeptConfirm').replace('$1', row.deptName))
        .then(function () {
          return delDept(row.deptId)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('ui.deleteSuccess'))
        })
        .catch(() => {})
    },
    parentChange(e) {
      this.$refs.form.validateField('parentId')
      if (e) {
        this.removeBorder()
      } else {
        setTimeout(() => {
          this.formItemVerify()
        })
      }
    },
    formItemVerify() {
      const inputDomArr = this.$refs.form.$el.getElementsByClassName('is-required')
      for (let i = 0; i < inputDomArr.length; i++) {
        // vuetreeselect组件
        if (
          inputDomArr[i].getElementsByClassName('vue-treeselect__control')[0] !== undefined &&
          !inputDomArr[i].classList.contains('is-success')
        ) {
          inputDomArr[i]
            .getElementsByClassName('vue-treeselect__control')[0]
            .classList.add('treeselectBiTian')
        }
      }
    },
    removeBorder() {
      this.$nextTick(() => {
        const inputDomArr = this.$refs.form.$el.getElementsByClassName('is-success')
        for (let i = 0; i < inputDomArr.length; i++) {
          inputDomArr[i].getElementsByClassName('vue-treeselect__control'[0], 'inputDomArr')
          // vuetreeselect组件
          if (inputDomArr[i].getElementsByClassName('vue-treeselect__control')[0] !== undefined) {
            inputDomArr[i]
              .getElementsByClassName('vue-treeselect__control')[0]
              .classList.remove('treeselectBiTian')
          }
        }
      })
    },
    close() {
      this.$refs.form.$el
        .getElementsByClassName('vue-treeselect__control')[0]
        .classList.remove('treeselectBiTian')
      // this.removeBorder()
    }
  }
}
</script>

<style lang="scss">
.treeselectBiTian {
  width: 100%;
  border-color: #ff4949;
}
</style>
