<template>
  <div class="tree-page">
    <el-input placeholder="" v-model="filterText" clearable> </el-input>
    <el-tree
      ref="tree"
      :data="fromData"
      show-checkbox
      :default-expand-all="false"
      node-key="userId"
      :check-strictly="true"
      empty-text="No Data"
      :render-content="powerRenderContent"
      :props="{
        children: 'child',
        label: 'userName'
      }"
      class="tree"
      :filter-node-method="filterNode"
      style="font-size: 14px; padding-bottom: 20px"
    ></el-tree>
  </div>
</template>

<script>
import locale from '@/views/organization/lang/index'
import { getCanAssignUserList } from '@/api/organization/role'

export default {
  name: 'AccessPermissions',
  props: {
    comDisFrom: Boolean
  },
  components: {},
  data() {
    return {
      visible: false,
      activeName: '0',
      fromData: [],
      row: '',
      roleId: '',
      form: {},
      query: {},
      filterText: '',
      timeId: ''
    }
  },
  computed: {
    editAuth() {
      if (this.comDisFrom) {
        return false
      }
      return this.checkPermi(['organization:role:accessPermissions:edit'])
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
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
      this.roleId = this.$route.query.roleId
      this.getCanAssignUserList()
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      // return data.userName.indexOf(value) !== -1
      const text = value.toUpperCase()
      return data.userName.toUpperCase().indexOf(text) !== -1
    },
    getCanAssignUserList() {
      getCanAssignUserList({ roleId: this.roleId }).then((res) => {
        const fromData = res.userData || []
        fromData.forEach((item) => {
          this.findPid(item)
        })
        this.fromData = JSON.parse(JSON.stringify(fromData))
        this.checkedKeys = res.checkedKeys || []

        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.checkedKeys)
        })
      })
    },

    findPid(data) {
      data.disabled = !this.editAuth
      if (data.child && data.child.length > 0) {
        data.child.forEach((k) => {
          this.findPid(k)
        })
      }
    },
    powerRenderContent(h, { node, data, store }) {
      const iconClass = ''
      let style = ''
      if (data.type === 0) {
        // iconClass = 'el-icon-message'
      } else if (data.type === 1) {
        // iconClass = 'el-icon-document'
        style = 'color:#20A0FF'
      } else if (data.type === 2) {
        // iconClass = 'el-icon-star-off'
        style = 'color:#FF4949'
      }

      const content = (
        <span>
          <span>
            <span>
              <i class={iconClass} style={style}></i>&ensp;{node.label}
            </span>
          </span>
        </span>
      )
      return content
    },
    queryTableList() {},
    handleBack() {
      const vm = this
      this.reset()
      vm.visible = false
    },
    close() {
      this.reset()
    },
    reset() {
      this.activeName = '0'
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      // 半选中的部门节点
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/organization/role' })
    },
    submitForm() {
      const ids = this.getDeptAllCheckedKeys()
      return { menuIdList: ids }
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}
.transfer ::v-deep .transfer-title {
  display: none;
}
.tree-page {
  // height: 600px;
  width: 500px;
  height: calc(100vh - 260px);
  padding: 0 20px 20px;
  .tree {
    height: 100%;
    overflow: hidden auto;
  }
}
</style>
