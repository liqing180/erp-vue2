<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('ui.postName')"
    :visible.sync="dialogTableVisible"
    width="800px"
    top="5vh"
    @closed="closed"
  >
    <el-input placeholder="" v-model="filterText" clearable> </el-input>
    <el-row class="transfer-style mt20" v-loading="loading">
      <el-tree
        ref="tree"
        :data="postList"
        show-checkbox
        :default-expand-all="true"
        node-key="postId"
        :check-strictly="true"
        :props="{
          children: 'children',
          label: 'postName'
        }"
        class="tree"
        :filter-node-method="filterNode"
        style="font-size: 14px; padding-bottom: 20px"
        @check="treeCheck"
      ></el-tree>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="dialogTableVisible = false">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" @click="handleSave">{{ $t('uiBtn.submit') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryPostTreeList } from '@/api/system/post'
export default {
  props: {
    query: {
      type: Object,
      default: () => {}
    },
    enterpriseIds: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      postList: [],
      loading: false,
      filterText: '',
      form: {}
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      console.log(value, '===69')
      if (!value) return true
      // return data.postName.indexOf(value) !== -1
      const text = value.toUpperCase()
      return data.postName.toUpperCase().indexOf(text) !== -1
    },
    closed() {
      this.postList = []
    },
    treeCheck(node, list) {
      // node 该节点所对应的对象、list 树目前的选中状态对象
      // 选中事件在选中后执行，当lis中有两个选中时，使用setCheckedKeys方法，选中一个节点
      // if (list.checkedKeys.length === 2) {
      //   // 单选实现
      //   this.$refs.tree.setCheckedKeys([node.postId])
      // }
      // if (list.checkedKeys.length === 0) {
      //   this.form = {}
      // } else {
      //   this.form = node
      // }
    },
    handleOpen() {
      this.dialogTableVisible = true
      this.getList()
    },
    getList() {
      this.loading = true
      queryPostTreeList({ pageNum: 1, pageSize: 25 })
        .then((response) => {
          const postList = response.rows
          this.handlerData(postList)
          this.postList = postList
          if (this.query && this.query.postIdList) {
            setTimeout(() => {
              this.$refs.tree && this.$refs.tree.setCheckedKeys(this.query.postIdList)
              // this.$refs.tree && this.$refs.tree.setCurrentKey(this.query.postIdList[0])
            }, 200)
          }

          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handlerData(data, index = 0) {
      data.forEach((x) => {
        x.customIndex = index + 1
        x.disabled = false
        if (this.enterpriseIds && this.enterpriseIds.includes(x.postId)) {
          x.disabled = true
        }
        if (x.children && x.children.length > 0) {
          this.handlerData(x.children, x.customIndex)
        } else {
          x.children = undefined
        }
      })
    },
    handleSave() {
      // getCheckedNodes(leafOnly) 是否只是叶子节点，默认值为 false
      const nodes = this.$refs.tree.getCheckedNodes(false)
      console.log(nodes)
      const ids = nodes.map((item) => {
        return item.postId
      })
      const names = nodes.map((item) => {
        return item.postName
      })
      this.$emit('onSuccess', ids, names)
      this.dialogTableVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer-style {
  height: calc(100vh - 260px);
  overflow: hidden auto;
  .tree {
    height: 100%;
    // overflow: hidden auto;
    /deep/ .el-tree-node__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
