<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('organization.rolePermissions')"
    :visible.sync="dialogTableVisible"
    width="1200px"
    top="5vh"
    @close="close"
  >
    <ul class="card" v-loading="loading">
      <li class="item">
        <div class="title">{{ $t('organization.functionalPermissions') }}</div>
        <div class="child-card mt10">
          <el-tree
            ref="tree"
            :data="menus"
            :default-expand-all="false"
            node-key="id"
            :check-strictly="true"
            empty-text="No Data"
            :props="{
              children: 'children',
              label: 'customLabel'
            }"
            class="tree"
            style="font-size: 14px; padding-bottom: 20px"
          ></el-tree>
        </div>
      </li>
      <li class="item">
        <div class="title">{{ $t('organization.accessPermissions') }}</div>
        <div class="child-card mt10">
          <el-tree
            ref="tree"
            :data="userData"
            :default-expand-all="false"
            node-key="id"
            :check-strictly="true"
            empty-text="No Data"
            :props="{
              children: 'child',
              label: 'name'
            }"
            class="tree"
            style="font-size: 14px; padding-bottom: 20px"
          ></el-tree>
        </div>
      </li>
      <li class="item">
        <div class="title">{{ $t('organization.warehouse') }}</div>
        <ul class="child-card" style="padding: 0 10px">
          <li
            class="mt10 flow1"
            v-for="item in warehouseList"
            :key="item.warehouseId"
            :title="item.warehouseName"
          >
            {{ item.warehouseName }}
          </li>
        </ul>
      </li>
      <li class="item">
        <div class="title">{{ $t('organization.vendor') }}</div>
        <ul class="child-card" style="padding: 0 10px">
          <li
            class="mt10 flow1"
            v-for="item in supplierList"
            :key="item.businessPartnerId"
            :title="item.businessPartnerName"
          >
            {{ item.businessPartnerName }}
          </li>
        </ul>
      </li>
    </ul>
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="dialogTableVisible = false">{{ $t('uiBtn.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  queryResourceTreeList,
  getAccessPermissions,
  getRoleDpForWarehouse,
  queryAlreadyHaveVendorListNoPage
} from '@/api/organization/role'
import locale from '@/views/organization/lang/index'

export default {
  data() {
    return {
      dialogTableVisible: false,
      loading: false,
      roleIdList: [],
      // 已勾选功能权限
      checkedKeys: [],
      // 功能权限
      menus: [],
      // 数据权限
      userData: [],
      // 仓库列表
      warehouseList: [],
      // 供应商列表
      supplierList: []
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    close() {},
    open(ids) {
      const vm = this
      this.roleIdList = ids
      vm.dialogTableVisible = true
      this.getData()
    },
    getData() {
      const vm = this
      vm.loading = true
      const request1 = queryResourceTreeList({ roleIdList: this.roleIdList })
      const request2 = getAccessPermissions({ roleIdList: this.roleIdList })
      const request3 = getRoleDpForWarehouse({ roleIdList: this.roleIdList })
      const request4 = queryAlreadyHaveVendorListNoPage({ roleIdList: this.roleIdList })
      Promise.all([request1, request2, request3, request4])
        .then((res) => {
          this.checkedKeys = res[0] ? res[0].checkedKeys : []
          this.menus = res[0] ? res[0].menus : []
          this.menus.forEach((x) => {
            x.pid = 0
            x.customLabel = this.$t(`menu.${x.label}`)
            x.children = this.findPid(x)
          })
          this.menus = this.menus.filter((x) => this.checkedKeys.indexOf(x.id) !== -1)
          const filterList = (data) => {
            data.forEach((x, i) => {
              x.children = (x.children || []).filter((k) => this.checkedKeys.indexOf(k.id) !== -1)
              if (x.children && x.children.length > 0) {
                filterList(x.children)
              }
            })
          }

          filterList(this.menus)
          const res1 = res[1] || {}
          const userData = res1.userData || []
          const userCheckedKeys = res1.checkedKeys || []

          this.userData = this.findSelectedAndChildren(userData, userCheckedKeys)

          const res2 = res[2] || {}
          const warehouseIdList = res2.data ? res2.data.warehouseIdList : []
          const warehouseList = res2.data ? res2.data.warehouseList : []
          this.warehouseList = warehouseList.filter((item) =>
            warehouseIdList.includes(item.warehouseId)
          )
          this.supplierList = res[3].data || []
          vm.loading = false
        })
        .catch(() => {
          vm.loading = false
        })
    },
    findPid(data) {
      if (data.children && data.children.length > 0) {
        data.children.forEach((k) => {
          k.pid = data.id
          k.customLabel = this.$t(`menu.${k.label}`)
          k.children = this.findPid(k)
        })
        return data.children
      }
    },
    /* 云琪： 数据权限，筛选出选中层级及其所有子级，选中层级的父级直接不展示 */
    findSelectedAndChildren(data, selectedIds) {
      const result = []
      function findNodes(node, selectedIds) {
        if (selectedIds.includes(node.id)) {
          result.push(node)
          return
        }

        for (const child of node.child || []) {
          findNodes(child, selectedIds)
        }
      }

      for (const item of data) {
        findNodes(item, selectedIds)
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 260px);
  overflow: hidden;
  .item {
    display: flex;
    flex-direction: column;
    width: 24%;
    height: 100%;
    flex-shrink: 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px 20px;
    overflow: hidden;
  }
  .child-card {
    height: 100%;
    overflow: hidden auto;
  }
  .title {
    font-weight: 700;
    font-size: 14px;
  }
}

.tree {
  height: 100%;
  // overflow: hidden auto;
  /deep/ .el-tree-node__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.child-card::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: initial;
}

.child-card::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(127, 135, 146, 0.5);
}

.child-card::-webkit-scrollbar-track {
  width: 10px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
.flow1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
