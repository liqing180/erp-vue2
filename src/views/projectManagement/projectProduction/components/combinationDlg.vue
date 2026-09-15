<template>
  <el-dialog
    v-dialogDrag
    :title="$t('PRODUCT.combination')"
    :visible.sync="visible"
    width="1000px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('PRODUCT.combinationName')}`" prop="combinationName">
            <el-input
              v-model="form.combinationName"
              :title="form.combinationName"
              class="form-wd"
              maxlength="50"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="`${$t('PRODUCT.optionalRange')}`" prop="min">
            <div style="display: flex">
              <el-form-item prop="max" style="width: 50%">
                <el-input-number
                  style="width: 100%"
                  v-model="form.max"
                  controls-position="right"
                  :precision="0"
                  :min="1"
                  :max="100"
                  @change="inputNumberChange('max')"
                />
              </el-form-item>
              <el-form-item prop="min" style="width: 50%">
                <el-input-number
                  style="width: 100%"
                  v-model="form.min"
                  controls-position="right"
                  :precision="0"
                  :min="0"
                  :max="form.max || 1"
                  :disabled="!form.max"
                  @change="inputNumberChange('min')"
                />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :disabled="fullscreenLoading" @click="submitForm">{{
        $t('uiBtn.save')
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
        combinationName: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        max: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        min: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      }
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
      this.visible = true
    },
    reset() {
      this.form = {
        combinationName: undefined,
        max: undefined,
        min: undefined
      }
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      this.resetForm('form')
    },
    back() {
      this.visible = false
    },
    inputNumberChange(code) {
      this.$refs.form.validateField(code)
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const vm = this
          vm.fullscreenLoading = true
          const param = JSON.parse(JSON.stringify(this.form))
          closeInitialization(param)
            .then((res) => {
              vm.$message.success(
                `${vm.$t('INVENTORY.warehouseCloseSuccess').replace('$1', vm.form.warehouseName)}`
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
