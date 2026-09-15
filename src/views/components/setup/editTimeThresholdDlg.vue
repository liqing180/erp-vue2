<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    :title="title"
    v-dialogDragWidth
    :visible.sync="open"
    width="1100px"
    append-to-body
    @closed="closed"
  >
    <el-form ref="formRef1" class="mr40" :model="form" :rules="rules" label-width="250px">
      <el-row>
        <el-col :span="12">
          <el-form-item
            :label="$t('Operation.divertReworkTimeThreshold')"
            prop="divertReworkTimeThreshold"
          >
            <div style="display: flex">
              <el-input-number
                style="width: 100%"
                v-model="form.divertReworkTimeThreshold"
                controls-position="right"
                :precision="0"
                v-thousandSplit="{ precision: 0 }"
                :min="1"
                :max="999"
                placeholder="1 - 999"
                :disabled="comDisFrom"
                @change="inputNumberChange('divertReworkTimeThreshold')"
              />
              <div class="unit">
                {{ form.customConfigFields && form.customConfigFields.TIME_THRESHOLD_UNIT }}
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('ui.isActive')}`">
            <el-switch
              v-model="form.isActive"
              :disabled="comDisFrom"
              active-value="1"
              inactive-value="0"
            ></el-switch>
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
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" v-if="!comDisFrom" @click="submitForm" :loading="btnLoading">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { querySetupFieldById, updateSetupField } from '@/api/operation/setup'
export default {
  props: {
    editAuth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btnLoading: false,
      open: false,
      title: '',
      form: {},
      // 表单校验
      rules: {
        divertReworkTimeThreshold: [
          {
            required: true,
            // eslint-disable-next-line
            // pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace(
              '$1',
              this.$t('Operation.divertReworkTimeThreshold')
            ),
            trigger: ['blur']
          }
        ]
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    comDisFrom() {
      return !this.editAuth
    }
  },
  created() {},
  methods: {
    inputNumberChange(code) {
      this.$refs.formRef1.validateField(code)
    },

    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        application: []
      }
      this.resetForm('formRef1')
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = this.$t('uiBtn.edit')
      if (this.comDisFrom) {
        this.title = this.$t('uiBtn.view')
      }
      this.reset()
      const id = row.setupId
      querySetupFieldById(id).then((response) => {
        if (response.code === 200) {
          const data = response.data || {}
          const config = data.customConfigFields || {}
          this.form = data
          this.$set(this.form, 'divertReworkTimeThreshold', config.TIME_THRESHOLD_TIME)
          this.open = true
        }
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      // 分类被删除时, getCheckedNodes() = [null], 将无效分类ID 清除
      this.$refs.formRef1.validate((valid) => {
        if (!valid) {
          return
        }
        if (valid) {
          this.form.customConfigFields = this.form.customConfigFields || {}
          this.form.customConfigFields.TIME_THRESHOLD_TIME = this.form.divertReworkTimeThreshold
          const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
          this.$modal
            .confirm(this.$t('Operation.setupSubmitConfirm'))
            .then(() => {
              this.btnLoading = true
              return updateSetupField(param)
            })
            .then((response) => {
              this.btnLoading = false
              this.$modal.msgSuccess(this.$t('Operation.setupSubmitSuccess'))

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
.unit {
  flex-shrink: 0;
  width: 40px;
  text-align: center;
  background-color: #f5f7fa;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}
</style>
