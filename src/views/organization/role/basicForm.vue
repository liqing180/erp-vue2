<template>
  <el-form
    ref="createForm"
    :model="createForm"
    :rules="createRules"
    label-width="160px"
    :disabled="comDisFrom"
    @submit.native.prevent
  >
    <el-row>
      <el-col :span="8">
        <el-form-item :label="`${$t('organization.roleName')}`" prop="roleName">
          <el-input
            v-model="createForm.roleName"
            :title="createForm.roleName"
            class="form-wd"
            :maxlength="200"
          ></el-input>
        </el-form-item>
      </el-col>
      <template v-if="false">
        <el-col :span="8">
          <el-form-item :label="`${$t('ui.createdBy')}`" prop="createdBy">
            <el-input :value="createForm.createdBy || userName" disabled class="form-wd"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('ui.createdBy')}`" prop="createdBy">
            <el-input :value="createForm.createdBy || userName" disabled class="form-wd"></el-input>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item :label="`${$t('ui.description')}`" prop="description">
          <MyInput
            type="textarea"
            v-model="createForm.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            resize="none"
            show-word-limit
            :maxlength="3000"
          ></MyInput>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item :label="`${$t('ui.isActive')}`" prop="isActive">
          <el-switch v-model="createForm.isActive" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    comDisFrom: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      createForm: {
        isActive: '1',
        createdBy: this.$store.state.user.nickName
      },
      createRules: {
        roleName: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('organization.roleName')),
            trigger: ['change', 'blur'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        status: [
          {
            required: true
          }
        ]
      }
    }
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
        this.createForm = JSON.parse(JSON.stringify(this.form))
      },
      deep: true
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  created() {},
  methods: {
    reset() {
      console.log('???')
      this.resetForm('createForm')
    },
    async submit() {
      try {
        await this.$refs.createForm.validate()
        const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.createForm)))
        return param
      } catch (err) {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
