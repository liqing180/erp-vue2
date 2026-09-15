<template>
  <div style="padding-bottom: 20px">
    <tree-transfer
      :key="'tree' + roleId + '_' + timeStamp"
      :from_data="fromData"
      :to_data="toData"
      :defaultProps="{ label: 'customLabel' }"
      @add-btn="add"
      @remove-btn="remove"
      mode="transfer"
      filter
      :openAll="false"
      pid="pid"
      class="transfer mt10"
      ref="transfer"
      placeholder=""
      node-key="id"
      :defaultCheckedKeys="checkedKeys"
      :defaultTransfer="false"
      :transferOpenNode="false"
      :expandOnClickNode="true"
      :title="[$t('mapLang.all'), $t('mapLang.all')]"
      @left-check-change="leftCheckChange"
    >
      <!-- :defaultExpandedKeys="defaultExpandedKeys" -->
      <!-- @right-check-change="rightCheckChange" -->
    </tree-transfer>
  </div>
</template>

<script>
import { queryResourceTreeList } from '@/api/organization/role'
import locale from '@/views/organization/lang/index'
import treeTransfer from 'el-tree-transfer'

export default {
  name: 'FunctionalPermissions',
  props: {
    comDisFrom: Boolean
  },
  components: {
    treeTransfer
  },
  data() {
    return {
      roleId: '',
      activeNames: ['1'],
      fromData: [],
      toData: [],
      checkedKeys: [],
      timeId: '',
      // 左侧勾选数据
      functionalPermissionsLeftCheckedKeys: [],
      defaultExpandedKeys: [],
      timeStamp: +new Date(),
      rightCheckedKeys: []
    }
  },
  watch: {},
  computed: {
    editAuth() {
      if (this.comDisFrom) {
        return false
      }
      return this.checkPermi(['organization:role:functionalPermissions:edit'])
    }
  },
  created() {
    this.roleId = this.$route.query.roleId
    this.timeId = this.$route.query.timeId
    this.queryResourceTreeList()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.checkedKeys = []
      this.fromData = []
      this.toData = []
      this.timeId = this.$route.query.timeId
      this.roleId = this.$route.query.roleId

      this.queryResourceTreeList()
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    queryResourceTreeList() {
      queryResourceTreeList({ roleId: this.roleId }).then((res) => {
        const checkedKeys = res.checkedKeys || []
        const fromData = res.menus || []
        fromData.forEach((x) => {
          x.pid = 0
          x.customLabel = this.$t(`menu.${x.label}`)
          x.disabled = !this.editAuth

          if (checkedKeys.length > 0) {
            if (
              checkedKeys.indexOf(x.id) !== -1 &&
              this.checkedKeys.indexOf(x.id) === -1 &&
              (!x.children || x.children.length <= 0)
            ) {
              this.checkedKeys.push(x.id)
            }
          }
          x.children = this.findPid(x, checkedKeys)
        })
        this.fromData = JSON.parse(JSON.stringify(fromData))
        this.$nextTick(() => {
          this.$refs.transfer.addToAims()
        })
        // this.fromData.unshift({ pid: 0, id: 'all', customLabel: this.$t('mapLang.all') })
        // this.checkedKeys = res.checkedKeys || []
      })
    },
    findPid(data, checkedKeys) {
      // debugger
      if (data.children && data.children.length > 0) {
        data.children.forEach((k) => {
          k.pid = data.id
          k.customLabel = this.$t(`menu.${k.label}`)
          k.disabled = !this.editAuth
          if (
            checkedKeys.indexOf(k.id) !== -1 &&
            this.checkedKeys.indexOf(data.id) === -1 &&
            (!k.children || k.children.length <= 0)
          ) {
            this.checkedKeys.push(k.id)
          }
          k.children = this.findPid(k, checkedKeys)
        })
        return data.children
      } else {
        if (
          checkedKeys.indexOf(data.id) !== -1 &&
          this.checkedKeys.indexOf(data.id) === -1 &&
          (!data.children || data.children.length <= 0)
        ) {
          this.checkedKeys.push(data.id)
        }
        return []
      }
    },
    getToLeftData(data) {
      data.forEach((x) => {
        if (this.checkedKeys.indexOf(x.id) !== -1 && (!x.children || x.children.length <= 0)) {
          this.checkedKeys.push(x.id)
        }
        this.getToLeftData(x.children)
      })
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)

      this.functionalPermissionsLeftCheckedKeys = []
      this.rightCheckedKeys = []
      this.$nextTick(() => {
        this.$refs.transfer.$children[0].from_is_indeterminate = false
        this.$refs.transfer.$children[0].from_disabled = true
        this.$refs.transfer.$children[0].to_is_indeterminate = false
        this.$refs.transfer.$children[0].to_disabled = true
        this.$refs.transfer.$children[0].to_expanded_keys = []
      })
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)

      this.functionalPermissionsLeftCheckedKeys = []
      this.rightCheckedKeys = []
      this.$nextTick(() => {
        this.$refs.transfer.$children[0].from_is_indeterminate = false
        this.$refs.transfer.$children[0].from_disabled = true
        this.$refs.transfer.$children[0].to_is_indeterminate = false
        this.$refs.transfer.$children[0].to_disabled = true
        this.$refs.transfer.$children[0].to_expanded_keys = []
      })
    },
    getMenuId(data, arr) {
      data.map((x) => {
        // if (x && x.children && x.children.length > 0) {
        //   this.getMenuId(x.children, arr)
        // } else {
        //   arr.push(x.id + '')
        // }
        // return x
        arr.push(x.id + '')
        if (x && x.children) {
          this.getMenuId(x.children, arr)
        }
        return x
      })
      return arr
    },
    leftCheckChange(nodeObj, treeObj, checkAll) {
      this.defaultExpandedKeys = []
      if (treeObj && treeObj.checkedKeys) {
        const { checkedKeys } = treeObj
        this.functionalPermissionsLeftCheckedKeys = checkedKeys || []
        // this.timeStamp = +new Date()
        // this.$nextTick(() => {
        //   const { checkedKeys } = treeObj
        //   this.functionalPermissionsLeftCheckedKeys = checkedKeys || []
        //   const { id, children } = nodeObj
        //   if (checkedKeys.indexOf(id) !== -1) {
        //     const defaultExpandedKeys = [nodeObj.id]
        //     if (children && children.length > 0) {
        //       const findPid = (data) => {
        //         data.forEach((x) => {
        //           defaultExpandedKeys.push(x.id)
        //           if (x.children && x.children.length > 0) {
        //             findPid(x.children)
        //           }
        //         })
        //       }
        //       findPid(children)
        //     }
        //     this.defaultExpandedKeys = defaultExpandedKeys

        //     const wlTransferComponent = this.$refs.transfer.$refs['wl-transfer-component']
        //     this.$refs.transfer.$children[0].from_disabled = false
        //     const fromTree = wlTransferComponent.$refs['from-tree']
        //     if (fromTree) {
        //       // fromTree.setCheckedNodes(nodes)
        //       fromTree.setCheckedKeys(checkedKeys)
        //     }

        //     const toTree = wlTransferComponent.$refs['to-tree']
        //     if (toTree) {
        //       toTree.setCheckedKeys(this.rightCheckedKeys)
        //     }
        //   } else {
        //     if (checkedKeys && checkedKeys.length > 0) {
        //       this.$refs.transfer.$children[0].from_is_indeterminate = true
        //       this.$refs.transfer.$children[0].from_disabled = false
        //     } else {
        //       this.$refs.transfer.$children[0].from_is_indeterminate = false
        //       this.$refs.transfer.$children[0].from_disabled = true
        //     }
        //     const wlTransferComponent = this.$refs.transfer.$refs['wl-transfer-component']
        //     const fromTree = wlTransferComponent.$refs['from-tree']
        //     if (fromTree) {
        //       // fromTree.setCheckedNodes(nodes)
        //       fromTree.setCheckedKeys(checkedKeys)
        //     }

        //     const toTree = wlTransferComponent.$refs['to-tree']
        //     if (toTree) {
        //       toTree.setCheckedKeys(this.rightCheckedKeys)
        //     }
        //   }
        // })
      } else {
        if (checkAll) {
          // 全选
          const { leftKeys } = this.$refs.transfer.getChecked()
          this.functionalPermissionsLeftCheckedKeys = leftKeys
        } else {
          // 取消全选
          this.functionalPermissionsLeftCheckedKeys = []
        }
      }

      // console.log(
      //   this.$refs.transfer.$refs['wl-transfer-component'].$refs['from-tree'],
      // )
    },

    rightCheckChange(nodeObj, treeObj, checkAll) {
      if (treeObj && treeObj.checkedKeys) {
        this.timeStamp = +new Date()
        this.$nextTick(() => {
          const { checkedKeys } = treeObj
          const { id, children } = nodeObj
          this.rightCheckedKeys = checkedKeys || []

          if (checkedKeys.indexOf(id) !== -1) {
            const defaultExpandedKeys = [nodeObj.id]
            if (children && children.length > 0) {
              const findPid = (data) => {
                data.forEach((x) => {
                  defaultExpandedKeys.push(x.id)
                  if (x.children && x.children.length > 0) {
                    findPid(x.children)
                  }
                })
              }
              findPid(children)
            }

            const wlTransferComponent = this.$refs.transfer.$refs['wl-transfer-component']
            const toTree = wlTransferComponent.$refs['to-tree']
            // to_expanded_keys
            this.$refs.transfer.$children[0].to_disabled = false
            this.$refs.transfer.$children[0].to_is_indeterminate = true
            this.$refs.transfer.$children[0].to_expanded_keys = defaultExpandedKeys

            if (
              this.functionalPermissionsLeftCheckedKeys &&
              this.functionalPermissionsLeftCheckedKeys.length > 0
            ) {
              this.$refs.transfer.$children[0].from_disabled = false
              this.$refs.transfer.$children[0].from_is_indeterminate = true
            } else {
              this.$refs.transfer.$children[0].from_disabled = true
              this.$refs.transfer.$children[0].from_is_indeterminate = false
            }

            if (toTree) {
              // toTree.setCheckedNodes(nodes)
              toTree.setCheckedKeys(checkedKeys)
            }

            const fromTree = wlTransferComponent.$refs['from-tree']
            if (fromTree) {
              fromTree.setCheckedKeys(this.functionalPermissionsLeftCheckedKeys)
            }
          } else {
            if (checkedKeys && checkedKeys.length > 0) {
              this.$refs.transfer.$children[0].to_is_indeterminate = true
              this.$refs.transfer.$children[0].to_disabled = false
            } else {
              this.$refs.transfer.$children[0].to_is_indeterminate = false
              this.$refs.transfer.$children[0].to_disabled = true
            }
            const wlTransferComponent = this.$refs.transfer.$refs['wl-transfer-component']
            const toTree = wlTransferComponent.$refs['to-tree']
            if (toTree) {
              toTree.setCheckedKeys(checkedKeys)
            }

            const fromTree = wlTransferComponent.$refs['from-tree']
            if (fromTree) {
              fromTree.setCheckedKeys(this.functionalPermissionsLeftCheckedKeys)
            }
          }
        })
      } else {
        if (checkAll) {
          // 全选
          const { rightKeys } = this.$refs.transfer.getChecked()
          this.rightCheckedKeys = rightKeys
        } else {
          // 取消全选
          this.rightCheckedKeys = []
        }
      }
    },

    submitForm() {
      let menuIdList = []
      menuIdList = this.getMenuId(this.toData, menuIdList)
      return {
        menuIdList,
        functionalPermissionsLeftCheckedKeys: this.functionalPermissionsLeftCheckedKeys || []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer ::v-deep .transfer-title {
  // display: none;
}
.transfer {
  height: 600px !important;
}
.transfer ::v-deep .transfer-main {
  // height: 100%;
  height: 530px;
}
</style>
