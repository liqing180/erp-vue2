<template>
  <el-dialog
    v-dialogDrag
    :title="$t('INVENTORY.closeReason')"
    :visible.sync="visible"
    width="1140px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="195px">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('INVENTORY.closedBy')}`" prop="cancelledBy">
            <el-input
              v-model="form.cancelledBy"
              :title="!form.cancelledBy"
              type="text"
              disabled
              class="form-wd"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="false">
          <el-form-item :label="`${$t('INVENTORY.dateClosed')}`" prop="dateCancelled">
            <el-date-picker
              :value="form.dateCancelled"
              :editable="false"
              disabled
              type="date"
              :format="fmtForYmdhms"
              :style="{ width: '100%' }"
              placeholder
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label="`${$t('ui.reason')}`" prop="closedReason">
            <MyInput
              type="textarea"
              v-model="form.closedReason"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="200"
            ></MyInput>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.attachment')}`" prop="fileIds">
            <myUpload ref="uploadRef" :disabled="false" :limit="9" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :disabled="fullscreenLoading" @click="submitForm">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { closeInitialization } from '@/api/inventoryManagement/inventoryInitialization'
export default {
  name: 'CloseDialog',
  components: {},
  data() {
    const vm = this
    return {
      visible: false,
      fullscreenLoading: false,
      form: {},
      rules: {
        closedReason: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      inventoryInitializationNo: undefined
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  methods: {
    handleOpen(row) {
      this.reset()
      const { inventoryInitializationId, warehouseName, inventoryInitializationNo } = row
      this.$set(this.form, 'inventoryInitializationId', inventoryInitializationId)
      this.$set(this.form, 'warehouseName', warehouseName)
      this.inventoryInitializationNo = inventoryInitializationNo
      this.visible = true
    },
    reset() {
      this.form = {
        closedReason: '',
        cancelledBy: this.$store.state.user.nickName
      }
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      this.resetForm('form')
    },
    back() {
      this.visible = false
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const vm = this
          vm.fullscreenLoading = true
          const param = JSON.parse(JSON.stringify(this.form))
          const fileIds = this.$refs.uploadRef.getFileIds()
          if (fileIds === false) {
            vm.fullscreenLoading = false
            return
          }
          param.commonFileList = fileIds
          closeInitialization(param)
            .then((res) => {
              vm.$message.success(
                `${vm
                  .$t('INVENTORY.inventoryInitializationCloseSuccess')
                  .replace('$1', vm.inventoryInitializationNo)}`
              )
              this.back()
              vm.$emit('onSuccess')
              vm.fullscreenLoading = false
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
.dialog-footer {
  margin-bottom: 20px;
}

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
