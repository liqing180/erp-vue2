<template>
  <el-dialog
    v-dialogDrag
    :title="$t('SALES.setPricingInBulk')"
    :visible.sync="visible"
    width="400px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" @submit.native.prevent :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('SALES.percentage')}`" prop="percentage">
            <el-input-number
              v-thousandSplit="{ precision: 1 }"
              style="width: 98%"
              v-model="form.percentage"
              controls-position="right"
              :precision="1"
              :min="0.1"
              :max="999.9"
              @change="inputNumberChange('reminderTime')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div style="text-align: center">
            {{ $t('SALES.percentageTip') }}
          </div>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="fullscreenLoading" @click="submitForm">{{
        $t('uiBtn.confirm1')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import locale from '@/views/salesManagement/lang/index'
export default {
  props: {},
  data() {
    const vm = this
    return {
      visible: false,
      fullscreenLoading: false,
      form: {},
      rules: {
        percentage: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur']
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
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    inputNumberChange(code) {
      this.$refs.form.validateField(code)
    },
    handleOpen() {
      this.reset()
      this.visible = true
    },
    reset() {
      this.form = {
        percentage: undefined
      }
      this.resetForm('form')
    },
    back() {
      this.visible = false
    },
    submitForm() {
      if (this.fullscreenLoading) {
        return
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.back()
          this.$emit('onSuccess', this.form.percentage)
        }
      })
    }
  }
}
</script>

<style lang="scss"></style>
