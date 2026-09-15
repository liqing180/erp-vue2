<template>
  <el-dialog
    v-dialogDrag
    :title="$t('menu.stockIn')"
    :visible.sync="visible"
    width="1140px"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form ref="form" :model="form" :disabled="comDisFrom" :rules="rules" label-width="195px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('POAck.operator')}`" prop="operatorBy">
            <el-input :value="form.operatorBy" :title="form.operatorBy" disabled />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="`${$t('POAck.time')}`">
            <el-date-picker
              v-model="form.operatorTime"
              type="datetime"
              :format="fmtForYmdhms"
              :style="{ width: '100%' }"
              placeholder
              disabled
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('POAck.acknowledgedBy')}`" prop="acknowledgedBy">
            <SelectInput
              :value="form.acknowledgedBy"
              :title="form.acknowledgedBy"
              @clear="acknowledgedByClear"
              clearable
              @click="openRequiredByTable"
              :disabled="comDisFrom"
              class="form-wd"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="`${$t('POAck.dateAcknowledged')}`" prop="acknowledgedTime">
            <el-date-picker
              v-model="form.acknowledgedTime"
              :picker-options="PickerOptions"
              :editable="false"
              type="date"
              :format="fmtForYmd"
              :style="{ width: '100%' }"
              placeholder
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label="`${$t('ui.remarks')}`" prop="remarks">
            <MyInput
              type="textarea"
              v-model="form.remarks"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="200"
            ></MyInput>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.attachment')}`" required>
            <myUpload ref="uploadRef" :limit="9" :disabled="comDisFrom" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button
        type="primary"
        v-if="!comDisFrom"
        :loading="fullscreenLoading"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}</el-button
      >
    </div>

    <selectRequiredByTable ref="selectRequiredByTable" @update="updateRequiredBy" />
  </el-dialog>
</template>

<script>
import { inWarehousePO, queryInWarehousePOMsg } from '@/api/purchaseManagement/purchaseOrder'
import locale from './locale'
import selectRequiredByTable from './selectRequiredByTable.vue'

export default {
  components: { selectRequiredByTable },
  props: {},
  data() {
    return {
      visible: false,
      fullscreenLoading: false,
      form: {},
      rules: {
        acknowledgedBy: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        acknowledgedTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      PickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      editRow: {}
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    comDisFrom() {
      return this.editRow.isCanInWarehouse !== '1'
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    handleOpen(row) {
      this.editRow = row
      if (this.editRow.isCanInWarehouse === '1') {
        this.reset()
      } else {
        this.byIdReset()
        this.queryInWarehousePOMsg()
      }
      this.visible = true
    },
    queryInWarehousePOMsg() {
      queryInWarehousePOMsg({
        purchaseOrderId: this.editRow.purchaseOrderId
      }).then((res) => {
        const data = res.data || {}
        this.form = data
        setTimeout(() => {
          this.$refs.uploadRef && this.$refs.uploadRef.initFileList(data.commonFileList)
        }, 300)
      })
    },
    reset() {
      this.form = {
        operatorBy: this.$store.state.user.nickName,
        operatorTime: Date.now(),
        acknowledgedBy: this.$store.state.user.nickName,
        acknowledgedId: this.$store.state.user.userId,
        acknowledgedTime: Date.now(),
        remarks: undefined
      }
      setTimeout(() => {
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      }, 300)
      this.resetForm('form')
    },
    byIdReset() {
      this.form = {
        operatorBy: undefined,
        operatorTime: undefined,
        acknowledgedBy: undefined,
        acknowledgedId: undefined,
        acknowledgedTime: undefined,
        remarks: undefined
      }
      setTimeout(() => {
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      }, 300)
      this.resetForm('form')
    },
    back() {
      this.visible = false
    },
    close() {
      this.reset()
    },
    openRequiredByTable() {
      this.$refs.selectRequiredByTable.handleOpen()
    },
    acknowledgedByClear() {
      this.$set(this.form, 'acknowledgedBy', undefined)
      this.$set(this.form, 'acknowledgedId', undefined)
    },
    updateRequiredBy(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'acknowledgedBy', nickName)
      this.$set(this.form, 'acknowledgedId', userId)
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const vm = this
          const param = {
            purchaseOrderId: vm.editRow.purchaseOrderId,
            purchaseOrderNo: vm.editRow.purchaseOrderNo,
            warehouseId: vm.editRow.warehouseId,
            warehouseName: vm.editRow.warehouseName,
            ...vm.form
          }
          const fileIds = vm.$refs.uploadRef.getFileIds({ required: true })
          if (fileIds === false) {
            return
          }
          param.commonFileList = fileIds

          vm.fullscreenLoading = true
          inWarehousePO(param)
            .then((res) => {
              if (res.code === 200) {
                vm.$modal.msgSuccess(
                  vm.$t('POAck.poSubmitSuccess').replace('$1', param.purchaseOrderNo)
                )
                vm.$emit('submitSuccess')
                vm.back()
              }
              setTimeout(() => {
                vm.fullscreenLoading = false
              }, 2000)
            })
            .catch(() => {
              vm.fullscreenLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.el-select-group__title .option-title-box {
  display: flex;
  flex-direction: row;
  // background-color: #aaaaaa;
  font-weight: bold;
  // color: #000000;
  color: #606266;
  font-size: 14px;
  margin-left: -20px;
  text-align: left;
  padding-left: 3px;
  padding-right: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .option-title-a {
    width: 85px;
  }
  .option-title-b {
    padding-left: 3px;
    padding-right: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 120px;
  }
  .option-title-c {
    width: 85px;
  }
}
</style>
<style scoped lang="scss">
.return-gp-box .el-select-dropdown__item {
  height: auto;
  white-space: wrap;
  overflow: auto;
  text-overflow: none;
}

.op-list {
  display: flex;
  flex-direction: row;
  text-align: left;
  margin-left: -20px;
  padding-left: 3px;
  padding-right: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .op-list-a {
    width: 85px;
  }
  .op-list-b {
    padding-left: 3px;
    padding-right: 3px;
    word-break: break-all;
    white-space: normal;
  }
  .op-list-c {
    width: 85px;
  }
}
</style>
