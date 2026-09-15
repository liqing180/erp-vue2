<template>
  <div style="padding-bottom: 20px">
    <div>
      <el-radio-group v-model="radioValue" @change="radioChange" :disabled="!editAuth">
        <el-radio v-for="dict in dict.type.dp_type_vendor" :key="dict.value" :label="dict.value">
          {{ dict.label }}</el-radio
        >
      </el-radio-group>
    </div>

    <div v-if="radioValue === '1'">
      <el-row class="mt10" :gutter="10">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd()"
            v-if="radioValue === '1' && editAuth"
            >{{ $t('uiBtn.add') }}</el-button
          >
        </el-col>
        <right-toolbar
          :saveKey="saveKey"
          :showSearch.sync="showSearch"
          :showSearchBtn="false"
          :showRefreshBtn="false"
          @queryTable="queryTable"
          :columns="configColumn"
          :columnsInit="columns"
        ></right-toolbar>
      </el-row>

      <el-table
        border
        ref="tables"
        class="mt10"
        :row-class-name="tableRowClassName"
        v-loading="loading"
        :data="tableList"
        max-height="540"
        @sort-change="handleSortChange"
      >
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
            <template v-else-if="item.prop === 'businessPartnerStatus'"
              >{{
                selectDictLabel(
                  dict.type.bp_business_partner_status,
                  scope.row.businessPartnerStatus
                )
              }}
            </template>
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
          min-width="200"
          class-name="small-padding fixed-width"
          fixed="right"
          v-if="editAuth"
        >
          <template slot-scope="scope">
            <div class="flexCen">
              <i
                class="el-icon-delete pointer"
                style="font-size: 20px; color: #f56c6c"
                :title="$t('uiBtn.delete')"
                @click="handleDelete(scope.$index)"
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
    <div v-if="radioValue === '2'">
      <el-checkbox-group v-model="vendorBranchCompanyIdList" :disabled="!editAuth">
        <el-checkbox
          v-for="(item, index) in companyList"
          :key="index"
          :label="item.id"
          class="mt10"
          >{{ item.name }}</el-checkbox
        >
      </el-checkbox-group>
    </div>

    <vendorTable ref="vendorTable" :alreadyIdList="curIdList" @onSuccess="updateTable" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryAlreadyHaveVendorListNoPage } from '@/api/organization/role'
import vendorTable from '@/views/organization/role/vendorTable'

export default {
  mixins: [pageMixin],
  dicts: ['bp_business_partner_status', 'dp_type_vendor'],
  components: { vendorTable },
  props: {
    comDisFrom: Boolean,
    formData: {
      type: Object,
      default: () => {}
    },
    companyList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const vm = this
    return {
      radioValue: '0',
      saveKey: '2',
      searchFormKey: Date.now(),
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      ids: [],
      // 显示搜索条件
      showSearch: true,
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      columns: [
        {
          prop: 'businessPartnerNo',
          label: vm.$t('organization.businessPartnerNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('organization.businessPartnerName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('organization.country'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'businessPartnerStatus',
          label: vm.$t('ui.status'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('organization.currency'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'isCompetitor',
          label: vm.$t('organization.isCompetitor'),
          minWidth: 170,
          visible: true,
          tooltip: true
        }
      ],
      roleId: '',
      timeId: '',
      vendorBranchCompanyIdList: []
    }
  },
  computed: {
    curIdList() {
      return this.tableList.map((item) => item.businessPartnerId)
    },
    editAuth() {
      if (this.comDisFrom) {
        return false
      }
      return this.checkPermi(['organization:role:vendor:edit'])
    }
  },
  watch: {
    formData: {
      immediate: true,
      handler: function (newVal) {
        const { roleId, dpTypeVendor, vendorBranchCompanyIdList } = this.formData
        if (roleId) {
          this.radioValue = dpTypeVendor || '0'
          this.vendorBranchCompanyIdList = vendorBranchCompanyIdList || []
        }
      }
    }
  },
  created() {
    this.roleId = this.$route.query.roleId
    this.timeId = this.$route.query.timeId
    this.getList()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.roleId = this.$route.query.roleId
      this.getList()
    }
  },
  methods: {
    radioChange(e) {},
    handleAdd() {
      const tableList = JSON.parse(JSON.stringify(this.tableList))
      this.$refs.vendorTable.handleOpen(tableList)
    },
    getList() {
      if (this.roleId) {
        const param = this.queryParams
        this.$trimOfObj(param)
        param.roleId = this.roleId
        this.loading = true
        queryAlreadyHaveVendorListNoPage(param)
          .then((response) => {
            this.tableList = response.data || []
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    updateTable(list) {
      this.tableList = list
      // if (list.length > 0) {
      //   const rows = JSON.parse(JSON.stringify(list))
      //   this.tableList.push(...rows)
      // }
    },
    handleDelete(index) {
      this.tableList.splice(index, 1)
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.userId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    submitForm() {
      return {
        dpTypeVendor: this.radioValue,
        vendorIdList: this.radioValue === '1' ? this.curIdList : [],
        vendorBranchCompanyIdList: this.radioValue === '2' ? this.vendorBranchCompanyIdList : []
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
