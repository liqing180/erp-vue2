<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PRODUCT.productList')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @close="close"
  >
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :showMenu="false"
    >
      <right-toolbar
        :saveKey="saveKey"
        :showRefreshBtn="true"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </search-form>

    <div class="mt20" style="display: flex; align-items: flex-start" v-loading="loading">
      <div class="tree-box" :style="{ width: isCollapse ? '2px' : '300px' }" v-if="false">
        <div class="tree">
          <el-tree
            ref="tree"
            :data="treeList"
            :props="defaultProps"
            default-expand-all
            :expand-on-click-node="false"
            node-key="id"
            @node-click="handleNodeClick"
          >
            <span class="node-label flow1" slot-scope="{ node }" :title="node.label">
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

      <div class="" style="overflow: hidden; flex: 1">
        <el-table
          border
          ref="tables"
          :data="tableList"
          :max-height="tableMaxHeight"
          lazy
          row-key="projectTemplateContentId"
          :default-expand-all="true"
          :tree-props="{ children: 'childProjectTemplateContentList', hasChildren: 'hasChildren' }"
          @sort-change="handleSortChange"
          @row-click="handleRowClick"
          :row-class-name="'pointer'"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" :selectable="selectable" align="center" />
          <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
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
                <!-- <commonProductAndPicture :row="scope.row" /> -->
                <span>{{ scope.row[item.prop] }}</span>
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
              <template v-else-if="item.prop === 'inventoryUom'">
                <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
              </template>

              <template v-else-if="item.prop === 'purchaseUom'">
                <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
              </template>

              <template v-else-if="item.prop === 'salesUom'">
                <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
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
        <!-- <pagination
          :saveKey="saveKey"
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        /> -->
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <!-- <el-button type="primary" :loading="btnLoading" @click="addAll"
        >{{ $t('uiBtn.addAll') }}
      </el-button> -->
      <el-button type="primary" :disabled="ids.length <= 0" @click="submit"
        >{{ $t('uiBtn.save') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryProjectTemplateContentMsg } from '@/api/projectManagement/projectProduction'
import { queryBusinessSelectProductCategoryTreeList } from '@/api/productManagement/productCategory'

export default {
  directives: {
    // transferDom
  },
  mixins: [pageMixin],
  props: {
    projectTemplateId: {
      type: String,
      default: ''
    },
    outWarehouseId: {
      type: String,
      default: ''
    }
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '6',
      btnLoading: false,
      searchFormKey: Date.now(),
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      ids: [],
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
          // sortable: 'custom',
          padding: 70,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          // sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          // sortable: 'custom',
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
        //   // sortable: 'custom',
        //   tooltip: true
        // },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.inventoryUOM'),
          visible: true,
          minWidth: 200,
          // sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('PRODUCT.qty1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
        /* {
          prop: 'purchaseUom',
          label: vm.$t('PRODUCT.purUOM'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'salesUom',
          label: vm.$t('PRODUCT.salesUOM'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        } */
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
      isCollapse: false,
      alreadySelectIdList: []
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
    handleOpen(alreadySelectIdList = []) {
      this.selectList = alreadySelectIdList || []
      this.queryParams.productCategoryId = ''
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
      // this.queryBusinessSelectProductCategoryTreeList()
    },
    queryBusinessSelectProductCategoryTreeList() {
      queryBusinessSelectProductCategoryTreeList().then((res) => {
        this.treeList = res.data
      })
    },
    queryTable() {
      this.queryParams.productCategoryId = ''
      this.$refs.tree && this.$refs.tree.setCurrentKey(null)
      this.getList()
    },
    getList() {
      const vm = this
      const param = this.queryParams
      this.$trimOfObj(param)
      this.loading = true
      // param.alreadyProductIdList = this.alreadySelectIdList
      param.projectTemplateId = this.projectTemplateId
      param.warehouseId = this.outWarehouseId
      queryProjectTemplateContentMsg(param)
        .then((response) => {
          this.loading = false
          this.tableList = response.data || []
          this.tableList.forEach((x) => {
            x.isFirstFloor = '1'
          })
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)

          this.$nextTick(() => {
            this.selectList.forEach((row) => {
              this.tableList.forEach((item, index) => {
                if (row.productMainId === item.productMainId) {
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
      this.queryParams.productCategoryId = data.id
      this.getList()
    },
    selectable(row, rowIndex) {
      if (row.isFirstFloor !== '1') return false
      return true // 不禁用
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.productMainId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleRowClick(row, column) {
      if (column && column.property === 'picture') {
        return
      }
      if (row.isFirstFloor !== '1') return
      // this.$emit('onSuccess', [row])
      // this.visible = false
      const index = this.selectList.findIndex((item) => item.productMainId === row.productMainId)
      const isSelected = index > -1
      if (isSelected) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(row)
      }
      this.ids = this.selectList.map((item) => item.productMainId)
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables && this.$refs.tables.clearSort()
      this.getList()
    },
    close() {
      this.$refs.tables && this.$refs.tables.clearSelection()
      // this.$refs.tree.setCheckedKeys([])
    },

    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 2000)
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
}
.tree {
  min-height: 200px;
  max-height: 500px;
  overflow: hidden auto;
  border: 1px solid #ccc;
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
// .tree {
//   position: relative;
//   flex-shrink: 0;
//   width: 300px;
//   max-height: 600px;
//   margin-right: 20px;
//   overflow: hidden auto;
//   border: 1px solid #ccc;
//   border-radius: 5px;
// }
.flow1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
