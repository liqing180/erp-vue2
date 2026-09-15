<template>
  <div class="app-container">
    <el-form :model="queryParams" @submit.native.prevent ref="queryForm" :inline="true">
      <el-form-item :label="$t('ui.templateName')" prop="templateName">
        <el-input
          v-model="queryParams.templateName"
          clearable
          size="small"
          @keyup.enter.native.stop="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
          >{{ $t('uiBtn.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          {{ $t('uiBtn.reset') }}
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
          v-hasPermi="['system:template:add']"
        >
          {{ $t('uiBtn.add') }}
        </el-button>
      </el-col>
    </el-row>

    <el-table
      border
      @row-dblclick="handleUpdate"
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      :max-height="600"
      style="cursor: pointer"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('ui.templateName')" align="center" prop="name" />
      <el-table-column :label="$t('ui.remarks')" align="center" prop="remark" />
      <el-table-column
        fixed="right"
        :label="$t('ui.action')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:template:edit']"
            >{{ $t('uiBtn.edit') }}
          </el-button>
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

    <!-- 添加或修改权限模板对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item :label="$t('ui.templateName')" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item :label="$t('ui.templateDefault')" prop="isDefault">
          <el-switch v-model="form.isDefault" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item :label="`${$t('ui.templateType')}`" prop="templateType">
          <el-select v-model="form.templateType" placeholder="" style="width: 100%">
            <el-option
              v-for="dict in dict.type.sys_authority_template_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('ui.menuAuth')">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">{{
            $t('ui.expand')
          }}</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">
            {{ $t('ui.selectAll') }}
          </el-checkbox>
          <el-checkbox
            v-model="form.menuCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'menu')"
            >{{ $t('ui.parentChildLinkage') }}
          </el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="No Data"
            :props="defaultProps"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ $t(`menu.${node.label}`) }}</span>
            </span>
          </el-tree>
        </el-form-item>
        <el-form-item :label="$t('ui.remarks')">
          <MyInput v-model="form.remark" :maxlength="300" type="textarea"></MyInput>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
        <el-button type="primary" @click="submitForm" :loading="btnLoading">{{
          $t('uiBtn.submit')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryTemplateList,
  queryTemplateById,
  delTemplate,
  saveTemplate,
  updateTemplate,
  exportTemplate
} from '@/api/system/template'
import { treeselect as menuTreeselect, templateMenuTreeselect } from '@/api/system/menu'

export default {
  name: 'RightsTemplate',
  dicts: ['sys_authority_template_type'],

  data() {
    return {
      btnLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 权限模板表格数据
      tableList: [],

      // 所有菜单列表
      menuOptions: [],

      defaultProps: {
        children: 'children',
        label: 'label'
      },

      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        templateName: undefined
      },

      menuExpand: false,
      menuNodeAll: false,
      // 表单参数
      form: {
        menuIds: []
      },
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.templateName')),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type === 'menu') {
        const treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type === 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      } else if (type === 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type === 'menu') {
        this.form.menuCheckStrictly = !!value
      }
    },
    /** 查询权限模板列表 */
    getList() {
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      queryTemplateList(params).then((response) => {
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
      if (this.$refs.menu) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.menuExpand = false
      this.menuNodeAll = false
      this.form = {
        id: undefined,
        name: undefined,
        remark: undefined,
        menuIds: [],
        menuCheckStrictly: true,
        isDefault: '0',
        templateType: undefined,
        createdBy: this.$store.state.user.nickName
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = this.$t('ui.rightsTemplate')
      this.getMenuTreeselect()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const tempId = row.id || this.ids
      // const roleMenu =
      const roleMenu = this.getMenuTreeselects(tempId)
      queryTemplateById(tempId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = this.$t('ui.rightsTemplate')
        this.$nextTick(() => {
          roleMenu.then((res) => {
            const checkedKeys = res.checkedKeys
            checkedKeys.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false)
              })
            })
          })
        })
      })
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then((response) => {
        this.menuOptions = response.data
      })
    },
    /** 查询菜单树结构 */
    getMenuTreeselects(tempId) {
      return templateMenuTreeselect(tempId).then((response) => {
        this.menuOptions = response.menus
        return response
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            this.btnLoading = true
            updateTemplate(this.form)
              .then((response) => {
                this.btnLoading = false
                if (response.code === 200) {
                  this.$modal.msgSuccess(this.$t('ui.modifiedSuccess'))
                  this.open = false
                  this.getList()
                }
              })
              .catch(() => {
                this.btnLoading = false
              })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            this.btnLoading = true
            saveTemplate(this.form)
              .then((response) => {
                this.btnLoading = false
                if (response.code === 200) {
                  this.$modal.msgSuccess(this.$t('ui.addSuccess'))
                  this.open = false
                  this.getList()
                }
              })
              .catch(() => {
                this.btnLoading = false
              })
          }
        }
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除权限模板编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delTemplate(ids)
        })
        .then(() => {
          this.getList()
          // this.msgSuccess('删除成功')
        })
        .catch(function () {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有权限模板数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return exportTemplate(queryParams)
        })
        .then((response) => {
          this.download(response.msg)
        })
        .catch(function () {})
    }
  }
}
</script>
