<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item :label="$t('ui.jobName')" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder=" "
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('ui.jobGroup')" prop="jobGroup">
        <el-select
          v-model="queryParams.jobGroup"
          placeholder=" "
          clearable
          size="small"
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.sys_job_group"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('ui.jobStatus')" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder=" "
          clearable
          size="small"
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.sys_job_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{
          $t('uiBtn.search')
        }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{
          $t('uiBtn.reset')
        }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['monitor:job:add']"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['monitor:job:edit']"
          >{{ $t('uiBtn.edit') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['monitor:job:remove']"
          >{{ $t('menu.remove') }}</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"

          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['monitor:job:export']"
          >导出</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-s-operation"
          size="mini"
          @click="handleJobLog"
          v-hasPermi="['monitor:job:query']"
          >日志</el-button
        >
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      border
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      :max-height="600"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="$t('ui.jobId')" width="100" align="center" prop="jobId" />
      <el-table-column
        :label="$t('ui.jobName')"
        align="center"
        prop="jobName"
        :show-overflow-tooltip="true"
      />
      <el-table-column :label="$t('ui.jobGroup')" align="center" prop="jobGroup">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_job_group" :value="scope.row.jobGroup" />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.callTheTargetString')"
        align="center"
        prop="invokeTarget"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('ui.cronExpressions')"
        align="center"
        prop="cronExpression"
        :show-overflow-tooltip="true"
      />
      <el-table-column :label="$t('ui.jobStatus')" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
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
            v-hasPermi="['monitor:job:edit']"
            >{{ $t('uiBtn.edit') }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['monitor:job:remove']"
            >{{ $t('menu.remove') }}</el-button
          >
          <el-dropdown
            size="mini"
            @command="(command) => handleCommand(command, scope.row)"
            v-hasPermi="['monitor:job:changeStatus', 'monitor:job:query']"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>{{ $t('uiBtn.more') }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="handleRun"
                icon="el-icon-caret-right"
                v-hasPermi="['monitor:job:changeStatus']"
                >{{ $t('ui.executeOnce') }}</el-dropdown-item
              >
              <el-dropdown-item
                command="handleView"
                icon="el-icon-view"
                v-hasPermi="['monitor:job:query']"
                >{{ $t('ui.detail') }}</el-dropdown-item
              >
              <el-dropdown-item
                command="handleJobLog"
                icon="el-icon-s-operation"
                v-hasPermi="['monitor:job:query']"
                >{{ $t('menu.jobLog') }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
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

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.jobName')" prop="jobName">
              <el-input v-model="form.jobName" placeholder=" " />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.jobGroup')" prop="jobGroup">
              <el-select v-model="form.jobGroup" placeholder=" ">
                <el-option
                  v-for="dict in dict.type.sys_job_group"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="invokeTarget">
              <span slot="label">
                {{ $t('ui.callingMethods') }}
                <el-tooltip placement="top">
                  <div slot="content">
                    Bean调用示例：ryTask.ryParams('ry')
                    <br />Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
                    <br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.invokeTarget" placeholder=" " />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('ui.cronExpressions')" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder=" ">
                <template slot="append">
                  <el-button type="primary" @click="handleShowCron">
                    {{ $t('ui.generateExpression') }}
                    <i class="el-icon-time el-icon--right"></i>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('ui.misfirePolicy')" prop="misfirePolicy">
              <el-radio-group v-model="form.misfirePolicy" size="small">
                <el-radio-button label="1">{{ $t('ui.executeImmediately') }}</el-radio-button>
                <el-radio-button label="2">{{ $t('ui.executeOnce') }}</el-radio-button>
                <el-radio-button label="3">{{ $t('ui.abortExecution') }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.concurrent')" prop="concurrent">
              <el-radio-group v-model="form.concurrent" size="small">
                <el-radio-button label="0">{{ $t('ui.allow') }}</el-radio-button>
                <el-radio-button label="1">{{ $t('ui.prohibit') }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.jobStatus')">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_job_status"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
        <el-button type="primary" @click="submitForm" :loading="btnLoading">{{
          $t('uiBtn.submit')
        }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="Cron表达式生成器"
      :visible.sync="openCron"
      append-to-body
      destroy-on-close
      class="scrollbar"
    >
      <crontab @hide="openCron = false" @fill="crontabFill" :expression="expression"></crontab>
    </el-dialog>

    <!-- 任务日志详细 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('ui.detail')"
      :visible.sync="openView"
      width="700px"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="140px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.jobId')}：`">{{ form.jobId }}</el-form-item>
            <el-form-item :label="`${$t('ui.jobName')}：`">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.jobGroup')}：`">{{
              jobGroupFormat(form)
            }}</el-form-item>
            <el-form-item :label="`${$t('ui.createdTime')}：`">{{ form.createdTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.cronExpressions')}：`">{{
              form.cronExpression
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.nextExecutionTime')}：`">{{
              parseTime(form.nextValidTime)
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.callingMethods')}：`">{{
              form.invokeTarget
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.jobStatus')}：`">
              <div v-if="form.status == 0">{{ $t('ui.normal') }}</div>
              <div v-else-if="form.status == 1">{{ $t('ui.failed') }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.concurrent')}：`">
              <div v-if="form.concurrent == 0">{{ $t('ui.allow') }}</div>
              <div v-else-if="form.concurrent == 1">{{ $t('ui.prohibit') }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.executionStrategy')}：`">
              <div v-if="form.misfirePolicy == 0">{{ $t('ui.defaultPolicy') }}</div>
              <div v-else-if="form.misfirePolicy == 1">{{ $t('ui.executeImmediately') }}</div>
              <div v-else-if="form.misfirePolicy == 2">{{ $t('ui.executeOnce') }}</div>
              <div v-else-if="form.misfirePolicy == 3">{{ $t('ui.abortExecution') }}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openView = false">{{ $t('uiBtn.close') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listJob,
  getJob,
  delJob,
  addJob,
  updateJob,
  exportJob,
  runJob,
  changeJobStatus
} from '@/api/monitor/job'
import Crontab from '@/components/Crontab'

export default {
  components: { Crontab },
  name: 'Job',
  dicts: ['sys_job_group', 'sys_job_status'],
  data() {
    return {
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
      // 定时任务表格数据
      tableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示详细弹出层
      openView: false,
      // 是否显示Cron表达式弹出层
      openCron: false,
      // 传入的表达式
      expression: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        jobName: undefined,
        jobGroup: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName: [{ required: true, message: this.$t('ui.reqMsg'), trigger: 'blur' }],
        invokeTarget: [{ required: true, message: this.$t('ui.reqMsg'), trigger: 'blur' }],
        cronExpression: [{ required: true, message: this.$t('ui.reqMsg'), trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询定时任务列表 */
    getList() {
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      listJob(params).then((response) => {
        this.tableList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 任务组名字典翻译
    jobGroupFormat(row, column) {
      return this.selectDictLabel(this.dict.type.sys_job_group, row.jobGroup)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        jobId: undefined,
        jobName: undefined,
        jobGroup: undefined,
        invokeTarget: undefined,
        cronExpression: undefined,
        misfirePolicy: 1,
        concurrent: 1,
        status: '0'
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
      this.ids = selection.map((item) => item.jobId)
      // eslint-disable-next-line eqeqeq
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case 'handleRun':
          this.handleRun(row)
          break
        case 'handleView':
          this.handleView(row)
          break
        case 'handleJobLog':
          this.handleJobLog(row)
          break
        default:
          break
      }
    },
    // 任务状态修改
    handleStatusChange(row) {
      const text = row.status === '0' ? '启用' : '停用'
      this.$modal
        .confirm('确认要"' + text + '""' + row.jobName + '"任务吗？')
        .then(function () {
          return changeJobStatus(row.jobId, row.status)
        })
        .then(() => {
          this.$modal.msgSuccess(text + '成功')
        })
        .catch(function () {
          row.status = row.status === '0' ? '1' : '0'
        })
    },
    /* 立即执行一次 */
    handleRun(row) {
      this.$modal
        .confirm('确认要立即执行一次"' + row.jobName + '"任务吗？')
        .then(function () {
          return runJob(row.jobId, row.jobGroup)
        })
        .then(() => {
          this.$modal.msgSuccess('执行成功')
        })
        .catch(() => {})
    },
    /** 任务详细信息 */
    handleView(row) {
      getJob(row.jobId).then((response) => {
        this.form = response.data
        this.openView = true
      })
    },
    /** cron表达式按钮操作 */
    handleShowCron() {
      this.expression = this.form.cronExpression
      this.openCron = true
    },
    /** 确定后回传值 */
    crontabFill(value) {
      this.form.cronExpression = value
    },
    /** 任务日志列表查询 */
    handleJobLog(row) {
      const jobId = row.jobId || 0
      this.$router.push({ path: '/monitor/job-log/index', query: { jobId: jobId } })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = this.$t('ui.addJob')
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const jobId = row.jobId || this.ids
      getJob(jobId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = this.$t('ui.editJob')
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line eqeqeq
          if (this.form.jobId != undefined) {
            this.btnLoading = true
            updateJob(this.form)
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
            addJob(this.form)
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
      const jobIds = row.jobId || this.ids
      this.$modal
        .confirm('是否确认删除定时任务编号为"' + jobIds + '"的数据项？')
        .then(function () {
          return delJob(jobIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$modal
        .confirm('是否确认导出所有定时任务数据项？')
        .then(() => {
          this.exportLoading = true
          return exportJob(queryParams)
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
