<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item :label="$t('ui.roleName')" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('ui.roleKey')" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('ui.isActive')" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder=""
          clearable
          size="small"
          style="width: 240px"
          @change="handleQuery"
        >
          <el-option :label="$t('uiBtn.active')" value="0" />
          <el-option :label="$t('uiBtn.inactive')" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('ui.createdTime')">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('ui.startDate')"
          :end-placeholder="$t('ui.endDate')"
          :format="fmtForYmd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
          {{ $t('uiBtn.search') }}
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
          v-hasPermi="['system:role:add']"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"

          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"

          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
          >删除</el-button
        >
      </el-col> -->
      <el-col :span="1.5" v-if="false">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['organization:role:import']"
          >{{ $t('uiBtn.import') }}</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"

          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['system:role:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-dropdown
          @command="(command) => seetingHandleCommand(command)"
          v-hasPermi="['system:role:remove', 'system:role:edit']"
          v-if="!multiple"
          trigger="click"
        >
          <el-button size="mini" type="primary" :disabled="multiple">
            {{ $t('ui.action') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="delete"
              icon="el-icon-delete"
              v-hasPermi="['system:role:remove']"
              >{{ $t('uiBtn.delete') }}
            </el-dropdown-item>
            <el-dropdown-item command="active" icon="el-icon-open" v-hasPermi="['system:role:edit']"
              >{{ $t('uiBtn.activeBtn') }}
            </el-dropdown-item>
            <el-dropdown-item
              command="inactive"
              icon="el-icon-turn-off"
              v-hasPermi="['system:role:edit']"
              >{{ $t('uiBtn.inactiveBtn') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        v-if="checkPermi(['system:role:remove', 'system:role:edit'])"
        width="55"
        align="center"
        :selectable="selectable"
      />
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
        :min-width="item.minWidth"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot-scope="scope">
          <!-- <el-switch
            v-if="item.prop === 'status'"
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            :disabled="scope.row.adminFlag === 1 || !editAuth"
            @change="handleStatusChange(scope.row)"
          ></el-switch> -->
          <el-switch
            v-if="item.prop === 'status'"
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            :disabled="true"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
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
        min-width="230"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-hasPermi="['system:role:edit']"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >{{ $t('uiBtn.edit') }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            style="color: #f56c6c"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            v-if="scope.row.adminFlag !== 1"
            >{{ $t('uiBtn.delete') }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleAuthUser(scope.row)"
            v-hasPermi="['system:role:edit']"
            v-if="scope.row.adminFlag !== 1"
            >{{ $t('menu.assignUser') }}</el-button
          >
          <!-- <el-dropdown
            size="mini"
            @command="(command) => handleCommand(command, scope.row)"
            v-hasPermi="['system:role:edit']"
            v-if="scope.row.adminFlag !== 1"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>{{ $t('uiBtn.more') }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="handleDataScope"
                icon="el-icon-circle-check"
                v-hasPermi="['system:role:edit']"
                >{{ $t('ui.dataAuth') }}</el-dropdown-item
              >
              <el-dropdown-item
                command="handleAuthUser"
                icon="el-icon-user"
                v-hasPermi="['system:role:edit']"
                >{{ $t('menu.assignUser') }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown> -->
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.roleName')" prop="roleName">
              <el-input v-model="form.roleName" maxlength="50" :disabled="!!form.roleId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="roleKey">
              <span slot="label">
                <el-tooltip :content="$t('ui.roleKeyTooltip')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t('ui.roleKey') }}
              </span>
              <el-input v-model="form.roleKey" :disabled="comDisFrom" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.roleAlias')" prop="roleAlias">
              <el-input v-model="form.roleAlias" maxlength="50" :disabled="comDisFrom" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.sort')" prop="roleSort">
              <el-input-number
                class="w100"
                :disabled="comDisFrom"
                v-model="form.roleSort"
                :precision="0"
                v-thousandSplit="{ precision: 0 }"
                controls-position="right"
                :min="0"
                :max="9999"
                @change="inputNumberChange('roleSort')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.createdBy')}`" prop="createdBy">
              <el-input v-model="form.createdBy" disabled maxlength="50" />
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
          <el-form-item :label="$t('ui.remarks')">
            <MyInput
              :disabled="comDisFrom"
              type="textarea"
              v-model="form.remark"
              :autosize="{ minRows: 2, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="300"
            ></MyInput>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.isActive')}`">
              <el-switch
                v-model="form.status"
                :disabled="comDisFrom"
                active-value="0"
                inactive-value="1"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.menuAuth')">
              <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">{{
                $t('ui.expand')
              }}</el-checkbox>
              <el-checkbox
                :disabled="comDisFrom"
                v-model="menuNodeAll"
                @change="handleCheckedTreeNodeAll($event, 'menu')"
              >
                {{ $t('ui.selectAll') }}
              </el-checkbox>
              <el-checkbox
                :disabled="comDisFrom"
                v-model="form.menuCheckStrictly"
                @change="handleCheckedTreeConnect($event, 'menu')"
                >{{ $t('ui.parentChildLinkage') }}
              </el-checkbox>
              <el-tree
                class="tree-border"
                :data="menuOptions"
                :show-checkbox="true"
                ref="menu"
                node-key="id"
                :check-strictly="!form.menuCheckStrictly"
                empty-text="No Data"
                :props="menuDefaultProps"
                @check-change="checkChange"
              >
                <span class="custom-tree-node" slot-scope="{ node }">
                  <span>{{ $t(`menu.${node.label}`) }}</span>
                </span>
              </el-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.zone')}`" prop="zoneIds">
              <el-checkbox
                :disabled="comDisFrom"
                v-model="zoneNodeAll"
                @change="handleCheckedTreeNodeAll($event, 'zone')"
              >
                {{ $t('ui.selectAll') }}
              </el-checkbox>
              <el-tree
                class="tree-border"
                :data="zoneOptions"
                show-checkbox
                ref="zone"
                node-key="id"
                :check-strictly="false"
                empty-text="No Data"
                :props="zoneDefaultProps"
                @check-change="zoneCheckChange"
              >
                <span class="custom-tree-node" slot-scope="{ node }">
                  <span :title="node.label">{{ node.label }}</span>
                </span>
              </el-tree>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
        <el-button type="primary" @click="submitForm" :loading="btnLoading" v-if="!comDisFrom"
          >{{ $t('uiBtn.submit') }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
      :title="title"
      :visible.sync="openDataScope"
      width="600px"
      append-to-body
    >
      <el-form :model="form" label-width="140px">
        <el-form-item :label="$t('ui.roleName')">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item :label="$t('ui.roleKey')">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item :label="$t('ui.dataScope')">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange" style="width: 100%">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('ui.dataAuth')" v-show="form.dataScope == 2">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">
            {{ $t('ui.expand') }}
          </el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">
            {{ $t('ui.selectAll') }}
          </el-checkbox>
          <el-checkbox
            v-model="form.deptCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'dept')"
            >{{ $t('ui.parentChildLinkage') }}
          </el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="dept"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="No Data"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDataScope">{{ $t('uiBtn.back') }}</el-button>
        <el-button type="primary" @click="submitDataScope">{{ $t('uiBtn.submit') }}</el-button>
      </div>
    </el-dialog>

    <!-- 导入 -->
    <file-import
      :importOptions="importOptions"
      @updateImport="updateImport"
      @importTemplate="importTemplate"
      @fileImportSuccess="getList"
    ></file-import>
  </div>
</template>

<script>
import {
  listRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  exportRole,
  dataScope,
  changeRoleStatus,
  changeStatusList,
  importTemplate
} from '@/api/system/role'
import { treeselect as menuTreeselect, roleMenuTreeselect } from '@/api/system/menu'
import { treeselect as deptTreeselect, roleDeptTreeselect } from '@/api/system/dept'
import pageMixin from '@/mixins/tableMinx'

export default {
  name: 'Role',
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      btnLoading: false,
      saveKey: '1',
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      selectList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: '1',
          label: this.$t('ui.allDataAuth')
        },
        {
          value: '2',
          label: this.$t('ui.customDataAuth')
        },
        {
          value: '3',
          label: this.$t('ui.thisDeptDataAuth')
        },
        {
          value: '4',
          label: this.$t('ui.deptAndBelowDataAuth')
        },
        {
          value: '5',
          label: this.$t('ui.personalDataAuth')
        }
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 导入
      importOptions: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: vm.$t('ui.roleImport'),
        // 是否禁用上传
        isUploading: false,
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/role/importData'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 列信息
      columns: [
        {
          prop: 'roleName',
          label: vm.$t('ui.roleName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true,
          sortable: 'custom'
        },
        {
          prop: 'roleAlias',
          label: vm.$t('ui.roleAlias'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'roleKey',
          label: vm.$t('ui.roleKey'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'roleSort',
          label: vm.$t('ui.sort'),
          minWidth: 120,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'status',
          label: vm.$t('ui.isActive'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 180,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 180,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }
      ],
      // 表单参数
      form: {},
      menuDefaultProps: {
        children: 'children',
        label: 'label',
        disabled: this.disabledFn
      },
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: true
      },
      zoneDefaultProps: {
        children: 'children',
        label: 'zoneName',
        disabled: this.disabledFn
      },
      // 表单校验
      rules: {
        roleName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.roleName')),
            trigger: 'blur'
          }
        ],
        roleAlias: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.roleAlias')),
            trigger: 'blur'
          }
        ],
        roleKey: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.roleKey')),
            trigger: 'blur'
          }
        ],
        roleSort: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.sort')),
            trigger: 'blur'
          }
        ],
        zoneIds: [
          {
            required: true,
            type: 'array',
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.zone')),
            trigger: ['change']
          }
        ]
      },
      zoneOptions: [],
      zoneNodeAll: false
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getList()
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['system:role:edit'])
    },
    comDisFrom() {
      if (this.form.adminFlag === 1) {
        return true
      }
      if (this.form.roleId) {
        return !this.editAuth
      }
      return false
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  methods: {
    inputNumberChange(code) {
      this.$refs.form.validateField(code)
    },
    checkChange() {
      const result = []
      const getMenuId = (arr) => {
        arr.forEach((v) => {
          result.push(v.id)
          if (v.children instanceof Array) {
            getMenuId(v.children)
          }
        })
      }
      getMenuId(this.menuOptions)
      const getCheckedList = this.$refs.menu.getCheckedNodes()
      if (result.length === getCheckedList.length && getCheckedList.length !== 0) {
        this.menuNodeAll = true
      } else {
        this.menuNodeAll = false
      }
    },
    zoneCheckChange() {
      const result = []
      const getZoneId = (arr) => {
        arr.forEach((v) => {
          result.push(v.id)
          if (v.children instanceof Array) {
            getZoneId(v.children)
          }
        })
      }
      getZoneId(this.zoneOptions)
      const getCheckedList = this.$refs.zone.getCheckedNodes()
      if (result.length === getCheckedList.length && getCheckedList.length !== 0) {
        this.zoneNodeAll = true
      } else {
        this.zoneNodeAll = false
      }
      this.$set(this.form, 'zoneIds', this.getZoneAllCheckedKeys())
    },
    disabledFn() {
      return this.comDisFrom
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.roleId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      if (row.adminFlag === 1) {
        return false // 禁用
      } else {
        return true // 不禁用
      }
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true
      let params = this.addDateRange(this.queryParams, this.dateRange)
      params = this.$trimOfObj(params)
      listRole(params).then((response) => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then((response) => {
        this.menuOptions = response.data
      })
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then((response) => {
        this.deptOptions = response.data
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
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      const checkedKeys = this.$refs.dept.getCheckedKeys()
      // 半选中的部门节点
      const halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 所有区域节点数据
    getZoneAllCheckedKeys() {
      // 目前被选中的区域节点
      const checkedKeys = this.$refs.zone.getCheckedKeys()
      // 半选中的区域节点
      const halfCheckedKeys = this.$refs.zone.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then((response) => {
        this.menuOptions = response.menus || []
        const list = response.zoneList || []
        this.zoneOptions = list.map((item) => {
          item.id = item.zoneId
          return item
        })

        return response
      })
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeselect(roleId) {
      return roleDeptTreeselect(roleId).then((response) => {
        this.deptOptions = response.depts
        return response
      })
    },
    // 角色状态修改
    handleStatusChange(row) {
      let confirmMsg = this.$t('ui.changeRoleInactive').replace('$1', row.roleName)
      if (row.status === '0') {
        confirmMsg = this.$t('ui.changeRoleActive').replace('$1', row.roleName)
      }
      this.$modal
        .confirm(confirmMsg)
        .then(function () {
          return changeRoleStatus(row.roleId, row.status)
        })
        .then(() => {
          this.$modal.msgSuccess(this.$t('ui.changeRoleActiveSuccess'))
        })
        .catch(function () {
          row.status = row.status === '0' ? '1' : '0'
        })
    },
    /** 批量修改用户状态 */
    handleChangeUsersStatus(type) {
      const roleNames = this.selectList.map((item) => item.roleName).join(', ')
      const status = type === 'active' ? '0' : '1'
      let confirmMsg = this.$t('ui.changeRoleInactive').replace('$1', roleNames)
      if (type === 'active') {
        confirmMsg = this.$t('ui.changeRoleActive').replace('$1', roleNames)
      }
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          return changeStatusList(this.ids, status)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('ui.changeRoleActiveSuccess'))
        })
        .catch(() => {})
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false
      this.reset()
    },
    // 表单重置
    reset() {
      if (this.$refs.menu) {
        this.$refs.menu.setCheckedKeys([])
      }
      if (this.$refs.zone) {
        this.$refs.zone.setCheckedKeys([])
      }

      this.menuExpand = false
      this.menuNodeAll = false
      this.deptExpand = true
      this.deptNodeAll = false
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: '0',
        menuIds: [],
        deptIds: [],
        zoneIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: undefined,
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
      this.dateRange = []
      this.resetForm('queryForm')
      this.queryParams.isAsc = this.queryParams.orderByColumn = undefined
      this.$refs.tables.clearSort()
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.roleId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 排序触发事件 */
    // handleSortChange(column, prop, order) {
    //   if (column.order) {
    //     this.queryParams.orderByColumn = column.prop
    //     this.queryParams.isAsc = column.order
    //   } else {
    //     this.queryParams.isAsc = this.queryParams.orderByColumn = undefined
    //   }

    //   this.getList()
    // },
    // 更多操作触发
    seetingHandleCommand(command) {
      switch (command) {
        case 'delete':
          this.handleDelete({})
          break
        case 'active':
          this.handleChangeUsersStatus('active')
          break
        case 'inactive':
          this.handleChangeUsersStatus('inactive')
          break
        default:
          break
      }
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case 'handleDataScope':
          this.handleDataScope(row)
          break
        case 'handleAuthUser':
          this.handleAuthUser(row)
          break
        default:
          break
      }
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type === 'menu') {
        const treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      } else if (type === 'dept') {
        const treeList = this.deptOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type === 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      } else if (type === 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
      } else if (type === 'zone') {
        this.$refs.zone.setCheckedNodes(value ? this.zoneOptions : [])
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type === 'menu') {
        this.form.menuCheckStrictly = !!value
      } else if (type === 'dept') {
        this.form.deptCheckStrictly = !!value
      }
    },

    handleAdd() {
      this.reset()
      this.getMenuTreeselect()
      this.open = true
      this.title = this.$t('ui.role')
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.reset()
      const roleId = row.roleId || this.ids
      const roleNodeList = this.getRoleMenuTreeselect(roleId)
      getRole(roleId).then((response) => {
        this.form = response.data
        this.open = true
        this.$nextTick(() => {
          roleNodeList.then((res) => {
            const checkedKeys = res.checkedKeys || []
            checkedKeys.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false)
              })
            })
            const checkedZoneIds = res.checkedZoneIds || []
            checkedZoneIds.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.zone.setChecked(v, true, false)
              })
            })
          })
        })
        this.title = this.$t('ui.role')
      })
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if (value !== '2') {
        this.$refs.dept.setCheckedKeys([])
      }
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset()
      const roleDeptTreeselect = this.getRoleDeptTreeselect(row.roleId)
      getRole(row.roleId).then((response) => {
        this.form = response.data
        this.openDataScope = true
        this.$nextTick(() => {
          roleDeptTreeselect.then((res) => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys)
          })
        })
        this.title = this.$t('ui.assignDataAuth')
      })
    },
    /** 分配用户操作 */
    handleAuthUser: function (row) {
      const roleId = row.roleId
      this.$router.push('/system/role-auth/user/' + roleId)
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
          param.menuIds = this.getMenuAllCheckedKeys()
          param.zoneIds = this.getZoneAllCheckedKeys()

          if (this.form.roleId) {
            this.$modal
              .confirm(this.$t('ui.addRoleConfirm'))
              .then(() => {
                this.btnLoading = true
                return updateRole(param)
              })
              .then((response) => {
                this.btnLoading = false
                this.$modal.msgSuccess(
                  this.$t('ui.addRoleSuccess').replace('$1', this.form.roleName)
                )
                this.open = false
                this.getList()
              })
              .catch(() => {
                this.btnLoading = false
              })
          } else {
            this.$modal
              .confirm(this.$t('ui.addRoleConfirm'))
              .then(() => {
                this.btnLoading = true
                return addRole(param)
              })
              .then((response) => {
                this.btnLoading = false
                this.$modal.msgSuccess(
                  this.$t('ui.addRoleSuccess').replace('$1', this.form.roleName)
                )
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
    /** 提交按钮（数据权限） */
    submitDataScope: function () {
      if (this.form.roleId) {
        this.form.deptIds = this.getDeptAllCheckedKeys()
        dataScope(this.form).then((response) => {
          this.$modal.msgSuccess(this.$t('ui.changeDataScopeSuccess'))
          this.openDataScope = false
          this.getList()
        })
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids
      const roleNames = this.selectList.map((item) => item.roleName).join(', ')

      this.$modal
        .confirm(this.$t('ui.delRoleConfirm').replace('$1', row.roleName || roleNames))
        .then(function () {
          return delRole(roleIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(this.$t('ui.deleteSucceeded'))
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$modal
        .confirm(this.$t('ui.roleExportConfirm'))
        .then(() => {
          this.exportLoading = true
          return exportRole(queryParams)
        })
        .then((response) => {
          this.$download.name(response.msg)
          this.exportLoading = false
        })
        .catch(() => {})
    },
    /** 导入按钮操作 */
    handleImport() {
      this.importOptions.open = true
    },
    /** 更新导入字段 */
    updateImport(key, value) {
      this.importOptions[key] = value
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.$download.name(response.msg)
      })
    }
  }
}
</script>
