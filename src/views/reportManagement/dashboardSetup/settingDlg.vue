<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="title"
    :visible.sync="open"
    width="700px"
    style="padding-top: 20vh"
    top="5vh"
    :append-to-body="false"
    @closed="closed"
    :modal-append-to-body="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="220px" class="mr20">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('ui.reportsName')" prop="reportId">
            <div class="input-switch-box">
              <div class="con-left">
                <el-cascader
                  class="tag-width"
                  style="width: 360px"
                  placeholder=""
                  :options="reportList"
                  :props="{ multiple: false, children: 'dashboards' }"
                  clearable
                  :collapse-tags="true"
                  filterable
                  v-model="form.reportId"
                  :show-all-levels="false"
                ></el-cascader>
              </div>
              <!-- <div class="con-right">
                <svg-icon
                  @click="openPlantTable"
                  icon-class="list"
                  style="height: 36px; width: 36px; cursor: pointer; color: #606266"
                />
              </div> -->
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" @click="submitForm" :loading="btnLoading"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveDefaultReport, queryAdminSetReportGroup } from '@/api/operation/setup'
export default {
  dicts: ['dm_load_order_status'],
  data() {
    return {
      btnLoading: false,
      open: false,
      title: '',
      curTime: undefined,
      form: {},
      // 表单校验
      rules: {
        reportId: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.reportsName')),
            trigger: ['change', 'blur']
          }
        ]
      },
      reportList: [],
      childrenList: []
    }
  },
  beforeCreate() {
  },
  computed: {
    comUrl() {
      return this.currentUrl
    }
  },
  methods: {
    reset() {
      this.form = {
        reportId: undefined
      }
      this.resetForm('form')
    },
    /** 修改按钮操作 */
    handleOpen(row) {
      this.curTime = Date.now()
      this.reset()
      this.open = true
      this.title = this.$t('ui.homeReports')
      this.queryAdminSetReportGroup()
    },
    queryAdminSetReportGroup() {
      queryAdminSetReportGroup({
        reportType: '1'
      }).then((res) => {
        const list = res.data || []
        const childrenList = []
        list.forEach((item) => {
          item.label = item.groupName
          item.value = item.reportGroupId
          if (item.dashboards) {
            item.dashboards.forEach((child) => {
              child.label = child.name
              child.value = child.id
              childrenList.push(child)
            })
          }
        })
        this.reportList = list
        this.childrenList = childrenList
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.reset()
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$modal
            .confirm(this.$t('SALES.submitPageConfirm'))
            .then(() => {
              this.btnLoading = true
              const reportRow = this.childrenList.find((item) => item.id === this.form.reportId[1])
              return saveDefaultReport(reportRow)
            })
            .then((response) => {
              this.btnLoading = false
              this.$modal.msgSuccess(this.$t('SALES.submitPageSuccess'))
              this.open = false
              this.$emit('onSuccess')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
  }
  .con-right {
    margin-left: 10px;
    line-height: 0;
  }
}
</style>
