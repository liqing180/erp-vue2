<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="title"
    :visible.sync="open"
    width="550px"
    append-to-body
    @closed="closed"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="290px" class="mr20 form-item-mb">
      <el-row>
        <el-form-item :label="$t('notification.popupSettings')">
          <el-select style="width: 100%" v-model="form.POPUP_SETTINGS" placeholder="">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <span slot="label">
            {{ $t('notification.systemMessageNotifications') }}
          </span>
          <el-switch
            v-model="form.SYSTEM_MESSAGE_NOTIFICATIONS"
            :disabled="comDisFrom"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-row>
      <!-- <el-row v-show="verificationTimeoutAuth">
        <el-form-item>
          <span slot="label">
            {{ $t('notification.systemMessageNotifications') }}
            <el-tooltip :content="$t('xxxxxxxxxx')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-switch
            v-model="form.systemMessageNotifications"
            :disabled="comDisFrom"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-row> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" @click="submitForm" :loading="btnLoading" v-if="!comDisFrom"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryTaskNotifications, save } from '@/api/system/behaviour.js'
import locale from './locale'
export default {
  data() {
    return {
      btnLoading: false,
      open: false,
      title: '',
      form: {},
      // 表单校验
      rules: {
        popupSettings: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('notification.popupSettings')),
            trigger: 'blur'
          }
        ]
      },
      options: [
        /* {
          label: this.$t('notification.bottomLeft'),
          value: 'bottom-left'
        },
        {
          label: this.$t('notification.bottomRight'),
          value: 'bottom-right'
        }, */
        {
          label: this.$t('notification.topLeft'),
          value: 'top-left'
        },
        {
          label: this.$t('notification.topRight'),
          value: 'top-right'
        }
      ]
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['system:role:edit'])
    },
    comDisFrom() {
      return false
    },
    verificationTimeoutAuth() {
      return this.checkPermi(['system:taskNotifications:verificationTimeout'])
    }
  },
  methods: {
    reset() {
      this.form = {
        POPUP_SETTINGS: 'top-right',
        SYSTEM_MESSAGE_NOTIFICATIONS: '1'
      }
      this.resetForm('form')
    },
    resetSwitchAuth(data) {
      /* if (!this.verificationTimeoutAuth) {
        this.$set(data, 'SYSTEM_MESSAGE_NOTIFICATIONS', '0')
      } */
    },
    /** 修改按钮操作 */
    handleUpdate() {
      this.reset()
      this.open = true
      this.title = this.$t('notification.notificationWindowSettings')
      queryTaskNotifications({}).then((response) => {
        const data = response.data || {}
        // this.resetSwitchAuth(data)
        this.form = Object.assign(this.form, data)
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
          const formData = JSON.stringify(this.form)

          const param = {
            activity: '1',
            data: null,
            path: 'Notification',
            taskNotifications: formData
          }

          this.$modal
            .confirm(this.$t('notification.submitPageConfirm'))
            .then(() => {
              this.btnLoading = true
              return save(param)
            })
            .then((response) => {
              this.btnLoading = false
              this.$modal.msgSuccess(
                this.$t('notification.submitPageSuccess').replace('$1', this.form.zoneName)
              )
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
<style>
.form-item-mb .el-form-item {
  margin-bottom: 10px;
}
</style>
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
