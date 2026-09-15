<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PRODUCT.product')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :showMenu="false"
      v-show="showSearch"
      :interval="500"
    >
      <right-toolbar
        :saveKey="saveKey"
        :savePath="savePath"
        :showRefreshBtn="true"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </search-form>

    <div class="mt20" style="display: flex; align-items: flex-start" v-loading="loading">
      <div class="tree-box" :style="{ width: isCollapse ? '2px' : '300px' }">
        <el-input
          :placeholder="$t('menu.productCategory')"
          :class="{ 'tree-box-input': isCollapse }"
          v-model="filterText"
          @input="handleFilter"
          clearable
          style="padding: 10px"
        >
        </el-input>

        <div class="tree">
          <el-tree
            ref="tree"
            :data="filteredTreeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            node-key="id"
            @node-click="handleNodeClick"
            :default-expand-all="defaultExpandAll"
            :default-expanded-keys="defaultExpandedKeys"
            :key="timeStamp"
          >
            <span
              slot-scope="{ node, data }"
              :class="['flow1', data.id === queryParams.productCategoryId ? 'label-current' : '']"
              :title="node.label"
            >
              {{ node.label }}
            </span>
          </el-tree>
        </div>
        <div class="collapse-warp">
          <i
            :class="isCollapse === true ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"
            @click="isCollapse = !isCollapse"
          ></i>
        </div>
        <div class="menu-resize" :data-collapse="isCollapse" v-dragTree v-show="!isCollapse"></div>
      </div>
      <div class="w100" style="overflow: hidden">
        <el-table
          border
          ref="tables"
          :data="tableList"
          :max-height="tableMaxHeight"
          @sort-change="handleSortChange"
          @row-click="handleRowClick"
          :row-class-name="'pointer'"
          @select="handleSelectionChange"
          @select-all="handleSelectAll"
        >
          <el-table-column type="selection" width="55" :selectable="selectable" align="center" />
          <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in visibleColumn"
            :key="item.prop + item.colSortIndex"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="getMinWidth(item)"
            :show-overflow-tooltip="item.tooltip"
            :fixed="item.fixed"
            :sortable="item.sortable"
            :align="item.align || 'left'"
            header-align="center"
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'productName'">
                <commonProductAndPicture :row="scope.row" />
              </template>
              <template v-else-if="item.prop === 'picture'">
                <div v-if="scope.row.defaultImageUrl" style="line-height: 0; height: 30px">
                  <el-image
                    style="height: 100%"
                    :src="scope.row.defaultImageUrl"
                    :preview-src-list="[scope.row.defaultImageUrl]"
                  />
                </div>
              </template>
              <template v-else-if="item.prop === 'isActive'">
                <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
                <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                  $t('uiBtn.inactive')
                }}</el-tag>
              </template>
              <template v-else-if="item.prop === 'qtyOnHand'">
                <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

                <template v-else>{{
                  $numberStr(scope.row[item.prop], scope.row.decimalNum)
                }}</template>
              </template>
              <template v-else-if="item.prop === 'availableQty'">
                <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

                <template v-else>{{
                  $numberStr(scope.row[item.prop], scope.row.decimalNum)
                }}</template>
              </template>
              <template v-else-if="item.prop === 'reservedQty'">
                <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

                <template v-else>{{
                  $numberStr(scope.row[item.prop], scope.row.decimalNum)
                }}</template>
              </template>
              <template v-else-if="item.prop === 'inTransitQty'">
                <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

                <template v-else>{{
                  $numberStr(scope.row[item.prop], scope.row.decimalNum)
                }}</template>
              </template>
              <template v-else-if="item.prop === 'salesUom'">
                <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
              </template>
              <template v-else-if="item.prop === 'categoryNameShowStr'">
                <ToolTipShowCategory :list="scope.row.categoryNameList || []">
                  <div class="flow1">{{ scope.row[item.prop] }}</div>
                </ToolTipShowCategory>
              </template>
              <template v-else-if="item.prop === 'description'">
                <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
              </template>
              <template v-else-if="item.prop === 'remarks'">
                <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :selectedNum="selectList.length"
          :saveKey="saveKey"
          :savePath="savePath"
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="submit"
        >{{ $t('uiBtn.save') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryBusinessSelectProductCategoryTreeList } from '@/api/productManagement/productCategory'

import { queryProductListFromStockOutStrategy } from '@/api/system/systemSetting'

export default {
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      saveKey: '18',
      savePath: 'salesMTable',
      searchFormKey: Date.now(),
      loading: false,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'productId',
      tableList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList: [],
      visible: false,
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          padding: 70,
          tooltip: false,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   sortable: 'custom',
        //   tooltip: true
        // },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.productCategory'),
          visible: true,
          minWidth: 200
          // tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PRODUCT.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PRODUCT.availableQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'reservedQty',
          label: vm.$t('PRODUCT.reservedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'inTransitQty',
          label: vm.$t('PRODUCT.inTransitQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        }
        // {
        //   prop: 'picture',
        //   label: vm.$t('ui.picture'),
        //   visible: true,
        //   width: 120
        // }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        }
      ],
      treeList: [],
      defaultProps: {
        children: 'child',
        label: 'categoryName'
      },
      /* 已经选择的联系人Id(过滤) */
      alreadySelectIdList: [],
      isCollapse: false,
      filterText: undefined,
      filteredTreeData: [],
      defaultExpandAll: false,
      timeStamp: undefined,
      defaultExpandedKeys: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    // 处理输入框的过滤逻辑
    handleFilter() {
      if (!this.filterText) {
        this.filteredTreeData = JSON.parse(JSON.stringify(this.treeList)) // 重置为原始数据
      } else {
        this.filteredTreeData = this.filterTree(this.treeList, this.filterText.toLowerCase())
        this.defaultExpandAll = true
        this.timeStamp = Date.now()
      }
    },
    // 递归过滤树数据
    filterTree(tree, keyword) {
      const result = []
      tree.forEach((node) => {
        const lowerCaseLabel = node.categoryName.toLowerCase()
        let newNode = null
        const matchesByKeyword = keyword && lowerCaseLabel.includes(keyword)
        const matchesByCategoryId =
          this.queryParams &&
          this.queryParams.productCategoryId &&
          String(node.id) === String(this.queryParams.productCategoryId)

        if (matchesByKeyword || matchesByCategoryId) {
          result.push(node)
        } else {
          const filteredChildren = this.filterTree(node.child || [], keyword)
          if (filteredChildren.length > 0) {
            newNode = { ...node, child: filteredChildren }
          }
        }

        // 如果当前节点匹配，递归添加所有父级和子级
        if (newNode) {
          result.push(newNode)
        }
      })
      return result
    },
    handleAdd(alreadySelectIdList) {
      this.alreadySelectIdList = alreadySelectIdList || []
      // this.queryParams.productCategoryId = ''
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
      this.queryAllProductCategoryTreeList()
    },
    queryAllProductCategoryTreeList() {
      queryBusinessSelectProductCategoryTreeList().then((res) => {
        const list = res.data || []
        this.treeList = list
        if (this.defaultExpandedKeys.length === 0) {
          this.defaultExpandedKeys = this.treeList.length > 0 ? this.treeList.map((x) => x.id) : []
        }
        this.handleFilter()
      })
    },
    queryTable() {
      this.queryParams.isAsc = this.queryParams.orderByColumn = undefined
      this.$refs.tables.clearSort()
      this.queryParams.productCategoryId = ''
      this.$refs.tree && this.$refs.tree.setCurrentKey(null)
      this.getList()
    },
    getList() {
      const vm = this
      const param = this.queryParams
      param.alreadyProductIdList = this.alreadySelectIdList
      this.$trimOfObj(param)
      this.loading = true
      queryProductListFromStockOutStrategy(param)
        .then((response) => {
          this.loading = false
          this.total = response.total
          this.tableList = response.rows
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)

          this.$nextTick(() => {
            this.selectList.forEach((row) => {
              this.tableList.forEach((item) => {
                if (row[this.rowIdKey] === item[this.rowIdKey]) {
                  this.$refs.tables.toggleRowSelection(item, true)
                }
              })
            })
          })
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.condition = undefined
      if (this.filterText) {
        // this.filterText = undefined
        // this.handleFilter()
        this.defaultExpandAll = false
        this.defaultExpandedKeys = this.findParentIds(this.treeList, data.id)
        this.timeStamp = Date.now()
      }
      this.$set(this.queryParams, 'productCategoryId', data.id)

      this.getList()
    },
    findParentIds(tree, targetId) {
      // 定义递归函数
      function dfs(node, path) {
        // 将当前节点的 id 添加到路径中
        path.push(node.id)

        // 如果找到目标 id，返回路径
        if (node.id === targetId) {
          return path
        }

        // 如果有子节点，递归遍历
        if (node.child && node.child.length > 0) {
          for (const child of node.child) {
            const result = dfs(child, [...path]) // 递归调用，传入当前路径的副本
            if (result) {
              return result // 找到目标 id 后返回结果
            }
          }
        }

        // 如果未找到目标 id，返回 null
        return null
      }

      // 遍历树的每个根节点
      for (const root of tree) {
        const result = dfs(root, [])
        if (result) {
          return result // 找到目标 id 后返回结果
        }
      }

      // 如果未找到目标 id，返回空数组
      return []
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selectList.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selectList.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[this.rowIdKey])
        vm.selectList = vm.selectList.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selectList.length; i++) {
        if (vm.selectList[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selectList.splice(i, 1)
        }
      }
      vm.selectList.push(row)
    },
    handleRowClick(row, column) {
      if (column && column.property === 'picture') {
        return
      }
      const index = this.selectList.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      const isSelected = index > -1
      if (isSelected) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(row)
      }
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.filterText = this.queryParams.condition
      this.handleFilter()
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables.clearSort()
      this.getList()
    },
    closed() {
      this.isCollapse = false
      this.selectList = []
      this.tableList = []
      this.$refs.tables.clearSelection()
      this.$refs.tree.setCheckedKeys([])
    },
    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 500)
      this.$emit('onSuccess', this.selectList)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}

.tree-box {
  flex-shrink: 0;
  position: relative;
  max-height: 600px;
  margin-right: 20px;
  //  transition: width 0.28s;
  border: 1px solid #ccc;
}
.tree {
  min-height: 200px;
  max-height: 500px;
  overflow: hidden auto;
  border-radius: 5px;
}
.collapse-warp {
  position: absolute;
  top: 50%;
  right: -4px;
  z-index: 300;
  font-size: 16px;
  // background-color: #888;
  // right: 100%;
  // border: 1px solid #000;
  background-color: #fff;
  border-radius: 4px;
}
.tree::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: initial;
}

.tree::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(127, 135, 146, 0.5);
}

.tree::-webkit-scrollbar-track {
  width: 10px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
</style>
