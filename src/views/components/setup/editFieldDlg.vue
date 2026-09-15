<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    :title="title"
    v-dialogDragWidth
    :visible.sync="open"
    width="1000px"
    append-to-body
    @closed="closed"
  >
    <el-form ref="formRef1" class="mr40" :model="form" :rules="rules" label-width="180px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('Operation.fieldName')" prop="fieldName">
            <el-input v-model="form.fieldName" :disabled="comDisFrom" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('Operation.fieldId')}`">
            <el-input v-model="form.fieldId" disabled maxlength="200" />
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
          <el-form-item :label="`${$t('ui.isActive')}`">
            <el-switch
              v-model="form.isActive"
              :disabled="comDisFrom"
              active-value="1"
              inactive-value="0"
              @change="changeActive"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.moduleItBelongsTo === '6'">
          <el-form-item :label="`${$t('ui.customerDisplay')}`">
            <el-switch
              v-model="form.customerDisplay"
              :disabled="comDisFrom || form.isActive !== '1'"
              active-value="1"
              inactive-value="0"
            ></el-switch>
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
  dicts: ['mdm_invitation_consignor_type'],
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
        fieldName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.fieldName')),
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
    comDisFrom() {
      return !this.editAuth
    }
  },
  created() {},
  methods: {
    changeActive(value) {
      if (value === '0') {
        this.$set(this.form, 'customerDisplay', '0')
      }
      console.log(value)
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
      this.form = {}
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
          this.form = data
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

<style lang="scss" scoped></style>
