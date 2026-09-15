<template>
  <div>
    <el-table
      border
      ref="tables"
      :data="tabList"
      @row-dblclick="handleEdit"
      style="cursor: pointer"
    >
      <el-table-column
        type="index"
        key="index"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
      >
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
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'localization'">{{
            selectDictLabel(dict.type.sys_localization, scope.row.localization)
          }}</template>
          <template v-else-if="item.prop === 'createdTime'">{{
            parseTime(scope.row.createdTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'modifiedTime'">{{
            parseTime(scope.row.modifiedTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
        fixed="right"
        v-if="editBtnShow"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-edit pointer"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.edit')"
              @click="handleEdit(scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <editAssignInfoDlg
      ref="editAssignInfoDlg"
      :sysLocalization="dict.type.sys_localization || []"
      :isSystemDocking="isSystemDocking"
      @update="updateRow"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import editAssignInfoDlg from './editAssignInfoDlg'
export default {
  dicts: ['sys_localization'],
  mixins: [pageMixin],
  components: { editAssignInfoDlg },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否系统对接
    isSystemDocking: {
      type: String,
      default: '0'
    }
  },
  watch: {
    list: {
      immediate: true,
      handler: function (value) {
        this.tabList = value || []
        this.changeTableList()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '1024',
      tabList: [],
      columns: [
        {
          prop: 'legalEntityNames',
          label: vm.$t('PRODUCT.extendedOrganization'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'localization',
          label: vm.$t('ui.localization'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
          visible: true,
          minWidth: 140,
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
          prop: 'createdBy',
          label: vm.$t('PRODUCT.assignBy'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('PRODUCT.assignDate'),
          visible: true,
          width: 160,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          width: 160,
          visible: true,
          tooltip: true
        }
      ]
    }
  },
  computed: {
    editBtnShow() {
      return this.checkPermi(['productManagement:productInfo:assignTo'])
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.tabList)
      })
    },
    handleEdit(row) {
      this.$refs.editAssignInfoDlg.handleEdit(row)
    },
    updateRow(row) {
      console.log(row)
      const editIndex = this.tabList.findIndex((item) => item.legalEntityId === row.legalEntityId)
      console.log('1111', editIndex)
      if (editIndex >= 0) {
        this.tabList.splice(editIndex, 1, row)
      }
      // this.changeTableList()
    }
  }
}
</script>

<style></style>
