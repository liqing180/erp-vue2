<!-- eslint-disable -->
<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="140px">
    <el-form-item :label="$t('ui.userName')" prop="nickName">
      <!-- eslint-disable-next-line vue/no-mutating-props -->
      <el-input v-model="user.nickName" :disabled="customerDis" maxlength="30" />
    </el-form-item>
    <el-form-item :label="$t('ui.mobilePhone')" prop="mobilePhone" ref="mobileNoRef">
      <!-- eslint-disable-next-line vue/no-mutating-props -->
      <!-- <el-input v-model="user.phonenumber" maxlength="11" /> -->
      <MobilePhoneInput
        :mobileCode.sync="user.mobileCode"
        :mobileNum.sync="user.mobileNum"
        :mobileNo.sync="user.mobilePhone"
        @clearValidate="$refs.mobileNoRef.clearValidate()"
      />
    </el-form-item>
    <el-form-item :label="$t('ui.email')" prop="email">
      <!-- eslint-disable-next-line vue/no-mutating-props -->
      <el-input
        v-model.trim="user.email"
        :title="user.email"
        :disabled="customerDis"
        maxlength="50"
      />
    </el-form-item>
    <el-form-item :label="$t('ui.sex')">
      <!-- eslint-disable-next-line vue/no-mutating-props -->
      <el-select v-model="user.sex" placeholder="" clearable style="width: 100%">
        <el-option
          v-for="dict in dict.type.sys_user_sex"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item :label="`${$t('ui.signedPicture')}`">
      <userSignature
        ref="uploadRef"
        :accept="['.jpg', '.jpeg', '.png', '.bmp', '.webp']"
        :dlgTitle="$t('ui.signedPicture')"
        :signatureUrl="user.signatureUrl"
        @change="changePhoto"
        :documentName="user.nickName ? user.nickName + ' - ' + 'Signed Picture' : 'Signed Picture'"
        :commonFileList="user.commonFileListSignature || []"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">{{ $t('uiBtn.submit') }}</el-button>
      <!-- <el-button type="danger" size="mini" @click="close">{{ $t('uiBtn.back') }}</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from '@/api/system/user'
import userSignature from '@/components/Common/htz-image-upload/userSignature.vue'

export default {
  components: { userSignature },
  props: {
    user: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  dicts: ['sys_user_sex'],

  data() {
    const validatorPhoneNo = (rule, value, callback) => {
      if (!this.user.mobileCode || !this.user.mobileNum) {
        callback(this.$t('ui.reqMsg').replace('$1', this.$t('ui.mobilePhone')))
      } else {
        callback()
      }
    }
    return {
      // 表单校验
      rules: {
        nickName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.userName')),
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.email')),
            trigger: 'blur'
          },
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ],
        mobilePhone: [
          { required: true, validator: validatorPhoneNo, trigger: 'change' }
          // {
          //   required: true,
          //   message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.mobilePhone')),
          //   trigger: 'blur'
          // }
        ]
      }
    }
  },
  computed: {
    tenantType() {
      return Number(this.$store.getters.tenantType)
    },
    // 客户端禁用
    customerDis() {
      let isDisabled = false
      if (Number(this.tenantType) === 1) {
        isDisabled = true
      }
      return isDisabled
    }
  },
  methods: {
    changePhoto(file) {
      this.$set(this.user, 'commonFileListSignature', file.url ? [file] : [])
      this.$set(this.user, 'signatureUrl', file.url)
      this.$set(this.user, 'signature', file.id || '')
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$modal
            .confirm(this.$t('ui.submitPageConfirm'))
            .then(() => {
              return updateUserProfile(this.user)
            })
            .then((response) => {
              this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
              this.$store.dispatch('GetInfo')
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
