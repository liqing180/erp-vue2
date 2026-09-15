<template>
  <FormPageLayout>
    <template v-slot:btn>
      <!-- <el-button type="primary" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button> -->
      {{ form.roleName }}
    </template>
    <template v-slot:content>
      <div class="form-card">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane :label="$t('organization.accessPermissions')" name="0">
            <div class="tree-page">
              <el-input placeholder="" v-model="filterText" clearable> </el-input>
              <el-tree
                ref="tree"
                :data="fromData"
                show-checkbox
                :default-expand-all="false"
                :default-expanded-keys="fromData[0] && [fromData[0].id]"
                node-key="id"
                :check-strictly="true"
                empty-text="No Data"
                :render-content="powerRenderContent"
                :props="{
                  children: 'child',
                  label: 'name'
                }"
                class="tree"
                :filter-node-method="filterNode"
                style="font-size: 14px; padding-bottom: 20px"
              ></el-tree>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('organization.warehouse')" name="1">
            <div class="tree-page">
              <warehouse
                :radio="query.dpTypeWarehouse"
                :roleId="roleId"
                :form="form"
                ref="warehouse"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('organization.vendor')" name="2">
            <div style="min-height: calc(100vh - 260px); padding: 0 20px">
              <vendor :radio="query.dpTypeVendor" :roleId="roleId" :form="form" ref="vendor" />
            </div>
          </el-tab-pane>
        </el-tabs>
        <div style="text-align: center; padding-bottom: 20px">
          <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
          <el-button type="primary" @click="submitForm" v-if="activeName !== '2'"
            >{{ $t('uiBtn.submit') }}
          </el-button>
        </div>
      </div>
    </template>
  </FormPageLayout>
</template>

<script>
import locale from '@/views/organization/lang/index'
import {
  getAccessPermissions,
  getRole,
  getRoleDataPermissionsType,
  updateRoleAccessPermissions
} from '@/api/organization/role'
import warehouse from '@/views/organization/role/warehouse'
import vendor from '@/views/organization/role/vendor'

export default {
  name: 'AccessPermissions',
  props: {},
  components: {
    warehouse,
    vendor
  },
  data() {
    return {
      visible: false,
      activeName: '0',
      fromData: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      row: '',
      roleId: '',
      form: {},
      query: {},
      filterText: '',
      timeId: ''
    }
  },
  computed: {},
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

    this.getAccessPermissions()
    this.getRoleDataPermissionsType()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.roleId = this.$route.query.roleId
      this.timeId = this.$route.query.timeId
      this.getAccessPermissions()
      this.getRoleDataPermissionsType()
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      // return data.name.indexOf(value) !== -1
      const text = value.toUpperCase()
      return data.name.toUpperCase().indexOf(text) !== -1
    },
    handleClick() {
      if (this.activeName === '0') {
        this.getAccessPermissions()
        this.getRoleDataPermissionsType()
      } else if (this.activeName === '1') {
        this.$refs.warehouse && this.$refs.warehouse.init()
      } else if (this.activeName === '2') {
        this.$refs.vendor && this.$refs.vendor.init()
      }
    },
    getRoleDataPermissionsType() {
      getRoleDataPermissionsType(this.roleId).then((res) => {
        this.query = res.data
      })
    },
    getAccessPermissions() {
      getAccessPermissions(this.roleId).then((res) => {
        const fromData = res.userData || []
        // fromData.forEach((x) => {
        //   x.pid = 0
        //   x.children = this.findPid(x)
        // })
        this.fromData = JSON.parse(JSON.stringify(fromData))
        this.checkedKeys = res.checkedKeys || []

        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(res.checkedKeys)
        })
        if (this.checkedKeys.length > 0) {
          this.checkedKeys.forEach((x) => {
            this.getToLeftData(this.fromData, x)
          })
        }
        this.getRole()
      })
    },
    getRole() {
      getRole(this.roleId).then((res) => {
        this.form = res.data
      })
    },
    findPid(data) {
      if (data.children && data.children.length > 0) {
        data.children.forEach((k) => {
          k.pid = data.id
          k.children = this.findPid(k)
        })
        return data.children
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
          const result = this.getToLeftData(tree[i].children, value)
          if (result) {
            return result
          }
        }
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
      if (this.activeName === '0') {
        const ids = this.getDeptAllCheckedKeys()
        this.$modal
          .confirm(
            this.$t('organization.accessPermissionsConfirm').replace('$1', this.form.roleName)
          )
          .then(() => {
            return updateRoleAccessPermissions({ selectIdList: ids, roleId: this.roleId })
          })
          .then((response) => {
            this.$modal.msgSuccess(`${this.$t('organization.accessPermissionsSuccess')}`)
          })
      } else if (this.activeName === '1') {
        this.$refs.warehouse.submit()
      }
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
  height: calc(100vh - 260px);
  padding: 0 20px 20px;
  .tree {
    height: 100%;
    overflow: hidden auto;
  }
}
</style>
