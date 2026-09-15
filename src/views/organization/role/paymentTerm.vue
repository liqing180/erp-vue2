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
            <!-- <el-switch
              v-if="item.prop === 'isActive'"
              v-model="scope.row.isActive"
              active-value="1"
              inactive-value="0"
              :disabled="true"
            ></el-switch> -->
            <template v-if="item.prop === 'isActive'">
              <el-tag v-if="scope.row.isActive === '1'">{{ $t('ui.y') }}</el-tag>
              <el-tag v-if="scope.row.isActive === '0'" type="danger">{{ $t('ui.n') }}</el-tag>
            </template>
            <template v-else-if="item.prop === 'isDefault'">
              <el-tag v-if="scope.row.isDefault === '1'">{{ $t('ui.y') }}</el-tag>
              <el-tag v-if="scope.row.isDefault === '0'" type="danger">{{ $t('ui.n') }}</el-tag>
            </template>
            <template v-else-if="item.prop === 'paymentTermType'">
              <ToolTipPaymentTerm :paymentTermObj="scope.row.paymentTerm || {}">
                {{ selectDictLabel(dict.type.payment_term_type, scope.row[item.prop]) }}
              </ToolTipPaymentTerm>
            </template>
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
    </div>

    <div v-if="radioValue === '2'">
      <el-checkbox-group v-model="paymentTermBranchCompanyIdList" :disabled="!editAuth">
        <el-checkbox
          v-for="(item, index) in companyList"
          :key="index"
          :label="item.id"
          class="mt10"
          >{{ item.name }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
    <paymentTermTable ref="paymentTermTable" :alreadyIdList="curIdList" @onSuccess="updateTable" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import paymentTermTable from '@/views/organization/role/paymentTermTable'

export default {
  mixins: [pageMixin],
  dicts: ['dp_type_vendor', 'payment_term_type'],
  components: { paymentTermTable },
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
      saveKey: '4',
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
          prop: 'paymentTermNo',
          label: vm.$t('ui.paymentTermNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'paymentTermName',
          label: vm.$t('menu.paymentTerm'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'paymentTermType',
          label: vm.$t('ui.type'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },

        {
          prop: 'description',
          label: vm.$t('ui.description'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'isDefault',
          label: vm.$t('ui.isDefault'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      paymentTermBranchCompanyIdList: []
    }
  },
  computed: {
    curIdList() {
      return this.tableList.map((item) => item.paymentTermId)
    },
    editAuth() {
      if (this.comDisFrom) {
        return false
      }
      return this.checkPermi(['organization:role:paymentTerm:edit'])
    }
  },
  watch: {
    formData: {
      immediate: true,
      handler: function (newVal) {
        const { roleId, dpTypePaymentTerm, paymentTermList, paymentTermBranchCompanyIdList } =
          this.formData
        if (roleId) {
          this.radioValue = dpTypePaymentTerm || '0'
          this.tableList = paymentTermList || []
          this.paymentTermBranchCompanyIdList = paymentTermBranchCompanyIdList || []
        }
      }
    }
    // 'formData.dpTypePaymentTerm': {
    //   immediate: true,
    //   handler: function (newVal) {
    //     this.radioValue = newVal || '0'
    //   }
    // },
    // 'formData.paymentTermList': {
    //   immediate: true,
    //   handler: function (newVal) {
    //     this.tableList = newVal || []
    //   }
    // }
  },
  methods: {
    radioChange(e) {},
    handleAdd() {
      const tableList = JSON.parse(JSON.stringify(this.tableList))
      this.$refs.paymentTermTable.handleOpen(tableList)
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
        paymentTermBranchCompanyIdList:
          this.radioValue === '2' ? this.paymentTermBranchCompanyIdList : []
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
