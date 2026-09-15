<template>
  <div style="padding: 0 0 20px 20px">
    <el-checkbox-group v-model="checkedKeys" @change="checkboxChange" class="checkbox">
      <el-checkbox
        v-for="(item, index) in checkboxList"
        :key="index"
        :label="item.userId"
        class="mt10"
        >{{ item.nickName }}</el-checkbox
      >
    </el-checkbox-group>
  </div>
</template>

<script>
import { getCanAssignUserList } from '@/api/organization/role'
import locale from '@/views/organization/lang/index'

export default {
  name: 'AssignUser',
  props: {},
  components: {},
  data() {
    return {
      roleId: '',
      form: {},
      checkboxList: [],
      checkedKeys: [],
      timeId: ''
    }
  },
  watch: {},
  computed: {
    editAuth() {
      return this.checkPermi(['organization:role:assignUser:edit'])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.roleId = this.$route.query.roleId
    this.timeId = this.$route.query.timeId
    this.getCanAssignUserList()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.getCanAssignUserList()
    }
  },
  methods: {
    getCanAssignUserList() {
      getCanAssignUserList({ roleId: this.roleId }).then((res) => {
        this.checkedKeys = res.checkedKeys || []
        this.checkboxList = res.userData || []
      })
    },
    checkboxChange() {},
    submitForm() {
      return { menuIdList: this.checkedKeys }
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/organization/role' })
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  flex-direction: column;
}
</style>
