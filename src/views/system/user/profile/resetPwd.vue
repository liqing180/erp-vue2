<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="160px">
    <el-form-item :label="$t('ui.oldPassword')" prop="oldPassword">
      <el-input v-model="user.oldPassword" type="password" show-password />
    </el-form-item>
    <el-form-item :label="$t('ui.newPassword')" prop="newPassword">
      <el-input
        v-model="user.newPassword"
        @input="user.newPassword = user.newPassword.replace(/\s/g, '')"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item :label="$t('ui.confirmPassword')" prop="confirmPassword">
      <el-input
        v-model="user.confirmPassword"
        @input="user.confirmPassword = user.confirmPassword.replace(/\s/g, '')"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">{{ $t('uiBtn.submit') }}</el-button>
      <!-- <el-button type="danger" size="mini" @click="close">{{ $t('uiBtn.back') }}</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from '@/api/system/user'

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error(this.$t('ui.inconsistentPasswords')))
      } else {
        callback()
      }
    }
    return {
      test: '1test',
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.oldPassword')),
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.newPassword')),
            trigger: 'blur'
          },
          { min: 6, max: 20, message: this.$t('ui.validPassword'), trigger: 'blur' }
        ],
        confirmPassword: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.confirmPassword')),
            trigger: 'blur'
          },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$modal
            .confirm(this.$t('ui.submitPageConfirm'))
            .then(() => {
              return updateUserPwd(this.user.oldPassword, this.user.newPassword)
            })
            .then((response) => {
              this.$modal.msgSuccess(this.$t('notification.passwordResetSuccessfully'))
            })
        }
      })
    },
    close() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/index' })
    }
  }
}
</script>
