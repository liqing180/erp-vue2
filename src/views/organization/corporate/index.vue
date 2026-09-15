<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          v-hasPermi="['organization:corporate:organizationalStructure']"
          @click="handleOrganizationChart"
        >
          {{ $t('organization.organizationalStructure') }}
        </el-button>
      </el-col>

      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>
    <!-- @row-dblclick="handleRowDbclick" -->
    <el-table
      border
      ref="tables"
      class="mt10"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      row-key="vid"
      :default-expand-all="false"
      :tree-props="{ children: 'child', hasChildren: 'hasChildren' }"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
    >
      <!-- <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        v-for="item in visibleColumn"
        :key="item.prop + item.colSortIndex"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :min-width="item.minWidth"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-if="item.prop === 'isActive'"
            v-model="scope.row.isActive"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template v-else-if="item.prop === 'onlineStatus'">
            <el-tag v-if="scope.row.onlineStatus === '1'">{{ $t('ui.y') }}</el-tag>
            <el-tag v-if="scope.row.onlineStatus === '0'" type="danger">{{ $t('ui.n') }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'type'">{{
            selectDictLabel(dict.type.corporate_type, scope.row.type)
          }}</template>
          <template v-else-if="item.prop === 'createdTime'">{{
            parseTime(scope.row.createdTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'modifiedTime'">{{
            parseTime(scope.row.modifiedTime, fmtForYmdhms)
          }}</template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="flexStart" style="padding-left: 10px">
            <i
              class="el-icon-edit pointer mr5"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.edit')"
              v-if="editAuth && ['1', '2', '3'].includes(scope.row.type + '')"
              @click="editTblRow(scope.row, scope.$index)"
            ></i>
            <i
              class="el-icon-plus pointer"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.add')"
              v-if="addAuth && ['1', '2'].includes(scope.row.type + '')"
              @click="addTblRow(scope.row, scope.$index)"
            ></i>
          </div>
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
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryCorporateList, deleteDepartment } from '@/api/organization/corporate'
import UUID from '@/utils/UUID/uuid'
import locale from '@/views/organization/lang/index'
export default {
  name: 'Corporate',
  dicts: ['corporate_type'],
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      saveKey: '1',
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      ids: [],
      // 角色表格数据
      tableList: [],
      searchForm: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      // 列信息
      columns: [
        {
          prop: 'name',
          label: vm.$t('organization.corporate'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true,
          align: 'left'
        },
        {
          prop: 'type',
          label: vm.$t('organization.type'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 170,
          visible: true,
          tooltip: true
        }
      ]
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    deleteAuth() {
      return this.checkPermi(['organization:corporate:delete'])
    },
    addAuth() {
      return this.checkPermi(['organization:corporate:add'])
    },
    editAuth() {
      return this.checkPermi(['organization:corporate:edit'])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    getList() {
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      this.loading = true
      queryCorporateList(param)
        .then((response) => {
          if (response.rows && response.rows.length > 0) {
            this.tableList = this.setVidForList(response.rows)
          } else {
            this.tableList = []
          }
          this.total = response.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.id) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    handleCreateLegalEntity(row) {
      if (row) {
        this.$router.push({
          path: '/organization/addLegalEntity',
          query: { bgId: row.id, timeId: +new Date() }
        })
      } else {
        this.$router.push({ path: '/organization/addLegalEntity', query: { timeId: +new Date() } })
      }
    },
    handleOrganizationChart() {
      this.$router.push({ path: '/organization/corporateDetail', query: { timeId: +new Date() } })
    },
    editTblRow(row) {
      const vm = this
      const corporateType = row.type
      let query
      switch (corporateType) {
        case 1:
          vm.$router.push({
            path: '/organization/updateBusinessGroup',
            query: { id: row.id, type: corporateType, timeId: +new Date() }
          })
          break
        case 2:
          vm.$router.push({
            path: '/organization/updateLegalEntity',
            query: { id: row.id, type: corporateType, timeId: +new Date() }
          })
          break
        case 3:
          vm.$router.push({
            path: '/organization/editBranchCompany',
            query: { id: row.id, type: corporateType, timeId: +new Date() }
          })
          break
        case 5:
        case 6:
          query = {
            departmentId: row.id,
            timeId: +new Date(),
            view: '1'
          }
          vm.$router.push({ path: '/organization/editDepartment', query })
          break
        default:
      }
    },
    /**
     * list {Array} 将数值添加一个vid字段，这个字段在表格中是唯一的。
     */
    setVidForList(list) {
      const uuidObj = new UUID()
      const fn = function (ta) {
        const tmpList = ta.map((item) => {
          const uuid = uuidObj.getUUID()
          item.vid = uuid
          if (Array.isArray(item.child)) {
            fn(item.child)
          }
          return item
        })
        return tmpList
      }

      if (Array.isArray(list)) {
        const rs = fn(list)
        return rs
      } else {
        return list
      }
    },

    handleUpdate(row, column, event) {
      console.log(column, '===========325')
      if ((column && column.type === 'selection') || !column.property) {
        return
      }
      /* 展开收起的时候会触发行双击 */
      if (event && event.target && event.target.className === 'el-icon-arrow-right') {
        return
      }
      this.editTblRow(row)
    },

    addTblRow(row) {
      const vm = this
      const { type } = row
      let query
      switch (type) {
        case 1:
          vm.handleCreateLegalEntity(row)
          break
        case 2:
          query = {
            businessGroupId: vm.tableList[0].id,
            legalEntityId: row.id,
            superiorId: row.id,
            timeId: +new Date()
          }
          vm.$router.push({ path: '/organization/addBranchCompany', query })
          break
        case 3:
          query = {
            // businessGroupId: vm.tableList[0].id,
            // branchCompanyId: row.id,
            superiorId: row.id,
            branchCompany: row.name,
            timeId: +new Date()
          }
          vm.$router.push({ path: '/organization/addDepartment', query })
          break
        case 5:
        case 6:
          vm.goAddSonDepartment(row)
          break
        default:
      }
    },
    goAddSonDepartment(row) {
      // const idArr = this.treeFindPath(this.tableList, (data) => data.id === row.id)
      const query = {
        // businessGroupId: idArr[0],
        // legalEntityId: idArr[1],
        // superiorId: idArr[idArr.length - 1],
        superiorId: row.id,
        superiorDepartment: row.name,
        timeId: +new Date()
      }
      this.$router.push({ path: '/organization/addSonDepartment', query })
    },
    treeFindPath(tree, func, path = []) {
      if (!tree) return []
      for (const data of tree) {
        // 这里按照你的需求来存放最后返回的内容吧
        path.push(data.id)
        if (func(data)) return path
        if (data.child) {
          const findChildren = this.treeFindPath(data.child, func, path)
          if (findChildren.length) return findChildren
        }
        path.pop()
      }
      return []
    },
    handleDelRow(row) {
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          return deleteDepartment({ departmentId: row.id })
        })
        .then(() => {
          this.$message.success(`${this.$t('ui.deleteSuccess')}`)
          this.getList()
        })
    }
  }
}
</script>

<style scoped>
.searchWidth {
  width: 240px;
}
div.clearfix {
  height: 40px;
  line-height: 40px;
  margin-bottom: 16px;
  overflow: hidden;
}
.mgl10 {
  margin-left: 10px;
}
</style>
