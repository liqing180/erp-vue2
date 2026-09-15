<template>
  <!--
    data:就是数据格式，时一个对象，具体格式下面有示例
    horizontal:默认是false，即纵向展示
    collapsable:是否折叠，有这个属性，则表示默认折叠，有其他方法可以在存在此属性时，也保证是展开状态
    on-expand:点击折叠点，点击可以展开，再次点击可以折叠，是个方法
    on-node-click:顾名思义，就是点击节点，触发的事件
    on-node-mouseover:鼠标移入节点触发的事件，可以触发一个弹层用于展示详情
    on-node-mouseout:鼠标移出节点触发的事件，可以控制详情弹层的隐藏
    原文链接：https://blog.csdn.net/yehaocheng520/article/details/119675805
  -->
  <div>
    <vue2-org-tree
      :data="chartData"
      :horizontal="true"
      collapsable
      :renderContent="renderContent"
      @on-expand="onExpand"
      class="tree"
      v-if="JSON.stringify(chartData) !== '{}'"
    />
    <viewDeptUserDlg ref="viewDeptUserDlg" />
  </div>
</template>

<script>
import { queryBusinessGroupList, queryCorporateSummary } from '@/api/organization/corporate'
import viewDeptUserDlg from './viewDeptUserDlg.vue'
export default {
  name: 'CorporateDetail',
  components: {
    viewDeptUserDlg
  },
  data() {
    return {
      bussinessGroupOptions: [],
      businessGroupId: '',
      chartData: {}
    }
  },
  mounted() {
    const vm = this

    const fn = async function () {
      await vm.queryBusinessGroupList()
    }
    vm.$nextTick(() => {
      fn().then(() => {
        vm.queryCorporateSummary(vm.businessGroupId)
      })
    })
  },
  methods: {
    clickUserCount(node) {
      console.log(node)
      this.$refs.viewDeptUserDlg.handleOpen(node)
    },
    // 通过 render-content 渲染节点内容
    renderContent(h, node) {
      return (
        <div class="renderTree">
          <div class="tree-card">
            <i class="el-icon-user icon"></i>
            <div class="content">
              <span class="flow1 name" title={node.name}>
                {node.name}
              </span>
              {node.userCount > 0 && (
                <span
                  style="flex-shrink: 0;"
                  class="primary-pointer"
                  onClick={() => this.clickUserCount(node)}
                >
                  ({node.userCount})
                </span>
              )}

              {node.userCount <= 0 && <span style="flex-shrink: 0;">({node.userCount})</span>}
            </div>
          </div>
        </div>
      )
    },
    collapse(list) {
      const _this = this
      list.forEach(function (child) {
        if (child.expand) {
          child.expand = false
        }
        child.children && _this.collapse(child.children)
      })
    },
    onExpand(e, data) {
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    businessGroupChg(val) {
      this.queryCorporateSummary(val)
    },

    queryCorporateSummary(businessGroupId) {
      const vm = this
      queryCorporateSummary(businessGroupId).then((res) => {
        const result = res.data
        vm.chartData = vm.fmtResult(result)[0]
        // 展开到分公司下的部门
        vm.toggleExpand(this.chartData, true, 0)
      })
    },
    toggleExpand(data, val, level = 0) {
      const _this = this
      if (Array.isArray(data)) {
        data.forEach(function (item) {
          _this.$set(item, 'expand', val)
          console.log(level)

          if (item.children && level < 2) {
            _this.toggleExpand(item.children, val, level + 1)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children && level < 2) {
          _this.toggleExpand(data.children, val, level + 1)
        }
      }
    },

    fmtResult(data) {
      const vm = this

      if (Array.isArray(data)) {
        return data.map((item) => {
          item.children = item.child || []
          item.value = item.name
          vm.fmtResult(item.child)
          return item
        })
      } else {
        return []
      }
    },
    queryBusinessGroupList() {
      const vm = this
      return new Promise((resolve) => {
        queryBusinessGroupList().then((res) => {
          const result = res.data
          if (result) {
            vm.bussinessGroupOptions = result
          } else {
            vm.bussinessGroupOptions = []
          }
          if (Array.isArray(result)) {
            const len = vm.bussinessGroupOptions.length
            if (len > 0) {
              vm.businessGroupId = vm.bussinessGroupOptions[0].id
            }
          }
          resolve()
        })
      })
    }
  }
}
</script>
<style lang="scss">
.tree {
  .horizontal .org-tree-node.is-leaf,
  .horizontal .org-tree-node.collapsed {
    padding-top: 6px;
    padding-bottom: 6px;
  }
}
</style>
<style scoped lang="scss">
.tree {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.tree ::v-deep .org-tree {
  margin: 0 auto;
}
.tree ::v-deep .tree-card {
  display: flex;
  align-items: center;
  width: 200px;
  font-size: 12px;
}
.tree ::v-deep .icon {
  flex-shrink: 0;
  font-size: 25px;
  margin-right: 10px;
}
.tree ::v-deep .content {
  display: flex;
  flex: 1;
  line-height: 20px;
}
.tree ::v-deep .name {
  margin-right: 5px;
  width: 140px;
  text-align: left;
}
.tree ::v-deep.flow1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree ::v-deep.org-tree-node-label-inner {
  padding: 10px 10px;
}
</style>
