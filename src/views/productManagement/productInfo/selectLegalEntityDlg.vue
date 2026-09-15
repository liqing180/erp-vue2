<template>
  <el-dialog
    v-dialogDrag
    :title="$t('organization.legalEntityName')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <search-form
      class="mt10"
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :showMenu="false"
      v-show="showSearch"
    >
      <right-toolbar
        :saveKey="saveKey"
        :showRefreshBtn="true"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </search-form>

    <el-table
      border
      ref="tables"
      class="mt10"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      @row-click="handleRowClick"
      :max-height="tableMaxHeight"
    >
      <el-table-column type="selection" width="55" align="center" :selectable="selectable" />
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
        :min-width="item.minWidth"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot="header" slot-scope="{ column }">
          <span v-if="['zoneName'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <el-switch
            v-if="item.prop === 'isActive'"
            v-model="scope.row.isActive"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template v-else-if="item.prop === 'isCompetitor'">
            <el-tag v-if="scope.row.isCompetitor === '1'">{{ $t('ui.y') }}</el-tag>
            <el-tag v-if="scope.row.isCompetitor === '0'" type="danger">{{ $t('ui.n') }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'localization'"
            >{{ selectDictLabel(dict.type.sys_localization, scope.row.localization) }}
          </template>
          <template v-else-if="item.prop === 'createdTime'">{{
            parseTime(scope.row.createdTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'modifiedTime'">{{
            parseTime(scope.row.modifiedTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'zoneName'">
            <el-select
              style="width: 100%"
              v-model="scope.row.selectZoneIdList"
              placeholder=""
              multiple
              clearable
              collapse-tags
              :disabled="!scope.row.zoneList || scope.row.zoneList.length <= 0"
              class="log-msg-ellipsis"
            >
              <el-option
                v-for="item in scope.row.zoneList"
                :key="item.zoneId"
                :label="item.zoneName"
                :value="item.zoneId"
              >
              </el-option>
            </el-select>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :saveKey="saveKey"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button
        type="primary"
        :loading="btnLoading"
        :disabled="comIds.length <= 0"
        @click="submit"
        >{{ $t('uiBtn.submit') }}</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryLegalEntityList } from '@/api/organization/corporate'
import { assignProductToLegalEntitys } from '@/api/productManagement/productInfo'
export default {
  mixins: [pageMixin],
  dicts: ['sys_localization'],
  props: {},
  components: {},
  data() {
    const vm = this
    return {
      saveKey: '3',
      searchFormKey: Date.now(),
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      visible: false,
      // 选中数组
      selectList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      btnLoading: false,
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${vm.$t('organization.legalEntityName')} / ${vm.$t(
            'organization.companyRegNo'
          )} `,
          type: 'InputEle'
        }
      ],
      columns: [],
      columns1: [
        {
          prop: 'businessGroupName',
          label: vm.$t('organization.businessGroup'),
          visible: true,
          minWidth: 200,
          // sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'legalEntityName',
          label: vm.$t('organization.legalEntityName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'companyRegNo',
          label: vm.$t('organization.companyRegNo'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'localization',
          label: vm.$t('ui.localization'),
          minWidth: 170,
          visible: true,
          tooltip: true
        }
      ],
      columns2: [
        {
          prop: 'businessGroupName',
          label: vm.$t('organization.businessGroup'),
          visible: true,
          minWidth: 200,
          // sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'legalEntityName',
          label: vm.$t('organization.legalEntityName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'companyRegNo',
          label: vm.$t('organization.companyRegNo'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'localization',
          label: vm.$t('ui.localization'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'zoneName',
          label: vm.$t('ui.zoneName'),
          minWidth: 220,
          visible: true,
          tooltip: true
        }
      ],
      rowIdKey: 'id',
      productMainIdList: []
    }
  },
  watch: {},
  computed: {
    comIds() {
      return this.selectList.map((item) => item[this.rowIdKey])
    },
    sysDockingSwitch() {
      return this.$store.getters.sysDockingSwitch || this.$store.getters.sysDockingSwitchQC
    }
  },
  created() {},
  methods: {
    handleOpen(assignToIds) {
      this.productMainIdList = assignToIds
      this.$set(this.queryParams, 'condition', '')
      if (this.sysDockingSwitch) {
        this.columns = this.columns2
      } else {
        this.columns = this.columns1
      }
      this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      this.$$initColumnVisible(this.saveKey, this.columns)
      this.visible = true
      this.getList()
    },
    getList() {
      const param = this.queryParams
      this.loading = true
      this.$trimOfObj(param)
      queryLegalEntityList(param)
        .then((response) => {
          this.tableList = response.data || []
          this.tableList.forEach((item) => {
            const ids = (item.zoneList || []).map((x) => x.zoneId) || []
            this.$set(item, 'selectZoneIdList', ids)
          })
          this.loading = false

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
        .catch(() => {
          this.loading = false
        })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = 'pointer'
      for (const item of this.comIds.values()) {
        if (item === row[this.rowIdKey]) {
          color = 'pointer table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable() {
      // return false // 禁用
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
    handleRowClick(row) {
      const index = this.selectList.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      const isSelected = index > -1
      if (isSelected) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(row)
      }
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    /** 排序触发事件 */
    // handleSortChange(column, prop, order) {
    //   this.queryParams.orderByColumn = column.prop
    //   this.queryParams.isAsc = column.order
    //   this.getList()
    // },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm(isGetList = true) {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables.clearSort()
      if (isGetList) {
        this.getList()
      }
    },
    closed() {
      this.resetSearchForm(false)
      this.selectList = []
    },
    submit() {
      const params = {
        productMainIdList: this.productMainIdList,
        legalEntityIdList: this.comIds
      }

      // 对接时需要判断，区域必选
      if (this.sysDockingSwitch) {
        const zoneIdReq = this.selectList.find((item) => {
          return !this.$resultOfBoolean(item.selectZoneIdList) && item.isSystemDocking === '1'
        })
        if (zoneIdReq) {
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.zoneName')))
          return
        }
        console.log(this.selectList, '====')
        params.legalEntityList = this.selectList || []
      }

      this.$modal
        .confirm(this.$t('ui.submitPageConfirm'))
        .then(() => {
          this.btnLoading = true
          return assignProductToLegalEntitys(params)
        })
        .then((response) => {
          const data = response.data || {}
          if (data.isFail && data.failureMsg) {
            this.$message({
              dangerouslyUseHTMLString: true,
              message: `<div style="line-height: 20px">${data.failureMsg}</div>`,
              type: 'error'
            })
          } else {
            this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
          }
          this.$emit('onSuccess')
          this.visible = false
          setTimeout(() => {
            this.btnLoading = false
          }, 500)
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    back() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
