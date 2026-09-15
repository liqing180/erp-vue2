<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('SIReturn.rejectReason')"
    :visible.sync="rejectVisible"
    width="1000px"
    append-to-body
    :close-on-click-modal="false"
    @closed="closeCb"
  >
    <el-form ref="approveForm" :model="approveForm" :rules="approveFormRules" label-width="140px">
      <el-col :span="12">
        <el-form-item :label="`${$t('ui.rejectedBy')}`" prop="rejectedBy">
          <el-input
            v-model="approveForm.rejectedBy"
            :title="!approveForm.rejectedBy ? '' : approveForm.rejectedBy"
            type="text"
            disabled
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="`${$t('ui.rejectedTime')}`" prop="dateRejected">
          <el-date-picker
            v-model="approveForm.dateRejected"
            :style="{ width: '100%' }"
            type="date"
            placeholder
            :editable="false"
            disabled
            :format="fmtForYmdhms"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="`${$t('SIReturn.rejectReasonLbl')}`" prop="rejectReason">
          <MyInput
            type="textarea"
            v-model="approveForm.rejectReason"
            :autosize="{ minRows: 1, maxRows: 4 }"
            resize="none"
            show-word-limit
            :maxlength="200"
          ></MyInput>
        </el-form-item>
      </el-col>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <!-- :loading="true" -->
      <el-button @click="backHandle">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" @click="rejectDlgSubmitHandler">{{ $t('uiBtn.submit') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { orderBy } from "lodash";
// import { mapGetters, mapState } from "vuex";
import locale from './locale'

export default {
  props: {
    rjVisible: {
      type: Boolean,
      default: false
    },
    rjApiUrl: {
      type: Function,
      default: null
    },
    backCb: {
      type: Function
    },
    returnType: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },

  data() {
    const vm = this
    return {
      approveForm: {},
      approveFormRules: {
        rejectReason: [
          {
            required: false,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },

    rejectVisible: {
      get: function () {
        return this.rjVisible
      },
      // eslint-disable-next-line no-unused-vars
      set: function (newValue) {
        this.$emit('rjVisibleChange', false)
      }
    }
  },

  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },

  created() {
    const vm = this
    vm.$set(vm.approveForm, 'rejectedBy', this.$store.state.user.nickName)
    setTimeout(() => {
      vm.approveFormRules.rejectReason[0].required = true
    }, 1000)
  },

  methods: {
    rejectDlgSubmitHandler() {
      const vm = this
      vm.rejectedDlgValidate((valid) => {
        if (valid) {
          vm.rejectedSubmit()
        }
      })
    },

    rejectedDlgValidate(callback) {
      this.$refs.approveForm.validate((valid) => {
        callback && callback(valid)
      })
    },

    rejectedSubmit() {
      const vm = this
      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 1000)
      const param = {
        salesQuotationMainId: this.id,
        returnType: this.returnType,
        reason: vm.approveForm.rejectReason
      }
      if (vm.rjApiUrl) {
        vm.rjApiUrl(param).then((res) => {
          if (res.code === 200) {
            vm.$emit('submitSuccess', param.returnType)
          }
        })
      }
    },
    backHandle() {
      const vm = this

      if (typeof vm.backCb === 'function') {
        vm.backCb()
      }
      vm.$emit('rjVisibleChange', false)
    },
    closeCb() {
      const vm = this
      vm.$set(vm.approveForm, 'rejectReason', '')
      this.$nextTick(() => {
        if (vm.$refs.approveForm) {
          vm.$refs.approveForm.clearValidate()
        }
      })
      vm.$emit('rjVisibleChange', false)
    }
  }
}
</script>
