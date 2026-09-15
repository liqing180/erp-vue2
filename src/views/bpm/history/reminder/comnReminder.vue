<template>
  <div>
    <el-form ref="createForm" :model="createForm" :rules="createRules" label-width="195px">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('reminder.reminderType')}`" prop="reminderType">
            <el-checkbox-group v-model="createForm.reminderType">
              <el-checkbox :label="1" name="systemNotice">{{
                $t('reminder.systemNotice')
              }}</el-checkbox>
              <el-checkbox :label="2" name="email">{{ $t('reminder.email') }}</el-checkbox>
              <el-checkbox :label="3" name="phoneMessage" disabled>{{
                $t('reminder.phoneMessage')
              }}</el-checkbox>
              <el-checkbox :label="4" name="whatsapp">{{ $t('reminder.whatsapp') }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('reminder.reminderContent')}`" prop="reminderContent">
            <MyInput
              type="textarea"
              v-model="createForm.reminderContent"
              :autosize="{ minRows: 2, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="3000"
            ></MyInput>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('reminder.reason')}`" prop="reason">
            <MyInput
              type="textarea"
              v-model="createForm.reason"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="200"
            ></MyInput>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('reminder.handledBy')}`" prop="handledBy">
            <el-input
              v-model="createForm.handledBy"
              :title="!createForm.handledBy ? '' : createForm.handledBy"
              type="text"
              class="form-wd"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('reminder.dateHandled')}`" prop="dateHandled">
            <el-date-picker
              v-model="createForm.dateHandled"
              type="date"
              placeholder
              :editable="false"
              disabled
              class="form-wd"
              :format="fmtForYmdhms"
              value-format="timestamp"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer" style="text-align: right">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :disabled="fullscreenLoading" @click="reminderSubmit">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </div>
</template>

<script>
import locale from './locale'
import { reminder } from '@/api/bpm/bpm'

export default {
  props: {
    rowData: {
      type: Object,
      default: function () {
        return null
      }
    },
    isBaseOnTask: {
      type: [Boolean],
      default: false
    }
  },
  data() {
    const vm = this

    return {
      fullscreenLoading: false,

      createForm: {
        reminderType: []
      },
      createRules: {
        reminderType: [
          {
            type: 'array',
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        reminderContent: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        reason: [
          {
            required: true,
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
    }
  },

  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    init() {
      this.createForm = {
        reminderType: [],
        handledBy: this.$store.state.user.nickName
      }
      this.resetForm('createForm')
    },
    reminderSubmit() {
      const vm = this
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          let param = {}
          param.taskId = !vm.rowData ? undefined : vm.rowData.taskId || undefined
          param.businessId = !vm.rowData ? '' : vm.rowData.businessId || ''
          param.businessNo = !vm.rowData ? '' : vm.rowData.businessNo || ''
          param.processInstance = !vm.rowData ? '' : vm.rowData.processInstance || ''
          param.reason = vm.createForm.reason || ''
          param.reminderContent = vm.createForm.reminderContent || ''
          param.reminderType = vm.createForm.reminderType.join(',') || ''
          param = JSON.parse(JSON.stringify(param))
          param = vm.$trimOfObj(param)
          vm.reminder(param)
        }
      })
    },

    reminder(param) {
      const vm = this
      vm.fullscreenLoading = true
      reminder(param)
        .then(() => {
          setTimeout(() => {
            vm.fullscreenLoading = false
          }, 1000)
          vm.$message.success(`${vm.$t('reminder.submitSuccess')}`)
          vm.$emit('onSubmit')
        })
        .catch(() => {
          vm.fullscreenLoading = false
        })
    },

    handleBack() {
      this.$emit('onBack')
    }
  }
}
</script>
