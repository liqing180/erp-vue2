<template>
  <el-dropdown trigger="click" @command="registration">
    <div style="cursor: pointer">{{ $t('login.registration') }}</div>
    <el-dropdown-menu slot="dropdown" class="international">
      <el-dropdown-item command="carrier"> {{ $t('login.carrierRegistration') }} </el-dropdown-item>
      <el-dropdown-item command="consignor">
        {{ $t('login.consignorRegistration') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'registration',
  inject: ['reload'],
  methods: {
    registration(e) {
      this.$emit('registration', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.international /deep/ .el-dropdown-menu__item {
  white-space: nowrap;
}
</style>
