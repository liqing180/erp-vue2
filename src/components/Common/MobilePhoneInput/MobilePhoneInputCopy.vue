<template>
  <el-input
    :disabled="disabled"
    :value="mobileNum"
    :maxlength="20"
    @input="handleChange"
    :class="{ 'input-with-select': !disabled }"
  >
    <el-select
      :disabled="disabled"
      slot="prepend"
      :value="mobileCode"
      @change="selectChange"
      placeholder=""
      style="width: 84px"
    >
      <el-option
        v-for="dict in dictList"
        :key="dict.dictValue"
        :label="dict.dictValue"
        :value="dict.dictValue"
      >
        <span>{{ dict.dictLabel }}</span>
      </el-option>
    </el-select>
  </el-input>
</template>

<script>
export default {
  props: {
    dictList: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    mobileCode: {
      type: String,
      default: ''
    },
    mobileNum: {
      type: String,
      default: ''
    },
    mobileNo: {
      type: String,
      default: ''
    }
  },
  watch: {
    mobileCode: {
      handler() {
        if (!this.mobileCode && !this.mobileNum.trim()) {
          this.init = false
        }
      },
      immediate: true
    },
    mobileNum: {
      handler() {
        if (!this.mobileCode && !this.mobileNum.trim()) {
          this.init = false
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      init: false
    }
  },
  computed: {},
  methods: {
    handleChange(value) {
      if (this.mobileCode && this.mobileNum.trim()) {
        this.init = true
      }
      this.$emit('update:mobileNum', value.trim())
      this.$nextTick(() => {
        this.changeMobileNo()
      })
    },
    selectChange(value) {
      this.$emit('update:mobileCode', value)
      this.$nextTick(() => {
        this.changeMobileNo()
      })
    },
    changeMobileNo() {
      if (this.mobileCode && this.mobileNum.trim()) {
        this.init = true
        this.$emit('update:mobileNo', `${this.mobileCode} ${this.mobileNum.toString()}`)
      } else {
        if (!this.init) {
          this.$emit('clearValidate')
        }
        // this.$emit('update:mobileNo', '')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
</style>
