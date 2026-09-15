<template>
  <div style="padding-bottom: 20px">
    <tree-transfer
      :from_data="fromData"
      :to_data="toData"
      :defaultProps="{ label: 'name', children: 'child' }"
      @add-btn="add"
      @remove-btn="remove"
      height="600px"
      mode="transfer"
      filter
      :openAll="false"
      :default-expanded-keys="fromData[0] && [fromData[0].id]"
      pid="pid"
      class="transfer mt10"
      ref="transfer"
      placeholder=""
      :defaultCheckedKeys="checkedKeys"
      defaultTransfer
      @left-check-change="leftCheckChange"
    />
  </div>
</template>

<script>
import { getCanSelectUser } from '@/api/organization/role'
import locale from '@/views/organization/lang/index'
import treeTransfer from 'el-tree-transfer'

export default {
  name: 'AssignUser',
  props: {},
  components: {
    treeTransfer
  },
  data() {
    return {
      roleId: '',
      activeNames: ['1'],
      menuDefaultProps: {
        children: 'children',
        label: 'label'
      },
      fromData: [],
      toData: [],
      form: {},
      checkedKeys: [],
      timeId: '',
      // 左侧勾选数据
      assignUserLeftCheckedKeys: []
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
    this.getCanSelectUser()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.getCanSelectUser()
    }
  },
  methods: {
    getCanSelectUser() {
      getCanSelectUser({ roleId: this.roleId }).then((res) => {
        const fromData = res.userData || []
        fromData.forEach((x) => {
          // if (x.id.indexOf(',') === -1) {
          //   x.disabled = true
          // }
          if (!x.isCanSelectForPostTree || x.isCanSelectForPostTree !== '1') {
            x.disabled = true
          }
          if (!this.editAuth) {
            x.disabled = true
          }
          x.pid = 0
          x.child = this.findPid(x)
        })
        this.fromData = JSON.parse(JSON.stringify(fromData))
        console.log(this.fromData, '===')
        this.checkedKeys = res.checkedKeys || []
        if (this.checkedKeys.length > 0) {
          this.checkedKeys.forEach((x) => {
            this.getToLeftData(this.fromData, x)
          })
        }
      })
    },
    findPid(data) {
      if (data.child && data.child.length > 0) {
        // let flag = true
        data.child.forEach((k) => {
          if (!k.isCanSelectForPostTree || k.isCanSelectForPostTree !== '1') {
            k.disabled = true
          }
          if (!this.editAuth) {
            k.disabled = true
          }
          // if (k.id.indexOf(',') === -1) {
          //   k.disabled = true
          // } else {
          //   flag = false
          // }
          k.pid = data.id
          k.child = this.findPid(k)
        })
        // data.disabled = flag
        return data.child
      } else {
        return []
      }
    },
    getToLeftData(tree, value) {
      for (let i = 0; i < tree.length; i++) {
        const item = tree[i]
        if (tree[i].id === value) {
          return item
        } else if (tree[i].children) {
          const result = this.getToLeftData(tree[i].child, value)
          if (result) {
            return result
          }
        }
      }
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)
      this.assignUserLeftCheckedKeys = []
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)
    },
    getMenuId(data, arr) {
      data.map((x) => {
        if (x && x.child && x.child.length > 0) {
          this.getMenuId(x.child, arr)
        } else {
          arr.push(x.id + '')
        }
        return x
      })
      return arr
    },
    leftCheckChange(nodeObj, treeObj, checkAll) {
      const { checkedKeys } = treeObj
      this.assignUserLeftCheckedKeys = checkedKeys || []
    },
    submitForm() {
      let menuIdList = []
      menuIdList = this.getMenuId(this.toData, menuIdList)
      console.log(menuIdList, '===')
      return { menuIdList, assignUserLeftCheckedKeys: this.assignUserLeftCheckedKeys }
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
.transfer ::v-deep .transfer-title {
  display: none;
}
.transfer {
  height: calc(100vh - 230px) !important;
}
.transfer ::v-deep .transfer-main {
  height: 100%;
}
</style>
