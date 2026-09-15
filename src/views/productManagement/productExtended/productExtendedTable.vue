<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PRODUCT.productList')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
  >
    <el-table border ref="tables" max-height="600px" :data="tableList" v-table-tab>
      <el-table-column
        type="index"
        key="index"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
        class-name="allowDrag"
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
        :min-width="item.minWidth"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot="header" slot-scope="{ column }">
          <span
            v-if="
              ['uom', 'defaultUom', 'purchaseUom', 'salesUom', 'inventoryUom'].includes(item.prop)
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'localization'">{{
            selectDictLabel(dict.type.sys_localization, scope.row.localization)
          }}</template>
          <template v-else-if="item.prop === 'minimumPackagingUnit'">
            <span
              style="color: #ff4949; font-size: 12px"
              v-if="
                scope.row.minimumPackagingUnitForNeed &&
                scope.row.minimumPackagingUnitForNeed === '1' &&
                !scope.row.minimumPackagingUnit
              "
            >
              {{ $t('ui.reqMsg') }}
            </span>
            <span v-else>{{ scope.row.minimumPackagingUnit }}</span>
          </template>
          <template v-else-if="item.prop === 'supplementaryPackagingUnit'">
            <span
              style="color: #ff4949; font-size: 12px"
              v-if="
                scope.row.supplementaryPackagingUnitForNeed &&
                scope.row.supplementaryPackagingUnitForNeed === '1' &&
                !scope.row.supplementaryPackagingUnit
              "
            >
              {{ $t('ui.reqMsg') }}
            </span>
            <span v-else>{{ scope.row.supplementaryPackagingUnit }}</span>
          </template>
          <template v-else-if="item.prop === 'packagingUnit'">
            <span
              style="color: #ff4949; font-size: 12px"
              v-if="
                scope.row.packagingUnitForNeed &&
                scope.row.packagingUnitForNeed === '1' &&
                !scope.row.packagingUnit
              "
            >
              {{ $t('ui.reqMsg') }}
            </span>
            <span v-else>{{ scope.row.packagingUnit }}</span>
          </template>
          <template v-else>
            <span v-if="scope.row[item.prop]">{{ scope.row[item.prop] }}</span>
            <span
              v-else-if="scope.row.productType === '1'"
              style="color: #ff4949; font-size: 12px"
              >{{ $t('ui.reqMsg') }}</span
            >
          </template>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryLegalEntityProductUomList } from '@/api/productManagement/productExtended'

export default {
  directives: {},
  mixins: [pageMixin],
  dicts: ['sys_localization'],
  props: {
    legalEntityIdList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '6',
      loading: false,
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      ids: [],
      visible: false,
      columns: [
        {
          prop: 'legalEntityName',
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
          prop: 'uom',
          label: vm.$t('PRODUCT.inventoryUOM1'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70
        }
        // {
        //   prop: 'defaultUom',
        //   label: vm.$t('PRODUCT.defaultUOM'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        // {
        //   prop: 'purchaseUom',
        //   label: vm.$t('PRODUCT.purchaseUOM'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        // {
        //   prop: 'salesUom',
        //   label: vm.$t('PRODUCT.salesUOM'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        // {
        //   prop: 'inventoryUom',
        //   label: vm.$t('PRODUCT.inventoryUOM'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        // {
        //   prop: 'minimumPackagingUnit',
        //   label: vm.$t('PRODUCT.minimumPackagingUnit'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        // {
        //   prop: 'supplementaryPackagingUnit',
        //   label: vm.$t('PRODUCT.supplementaryPackagingUnit'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        // {
        //   prop: 'packagingUnit',
        //   label: vm.$t('PRODUCT.packagingUnit'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // }
      ],
      productMainId: undefined
    }
  },
  computed: {},
  watch: {},
  created() {},
  updated() {},
  methods: {
    handleOpen(row) {
      this.productMainId = row.productMainId
      this.$$initColumnVisible(this.saveKey, this.columns)
      this.visible = true
      this.getList()
    },
    getList() {
      const vm = this
      const param = {}
      param.legalEntityIdList = this.legalEntityIdList
      param.productMainId = this.productMainId
      this.loading = true
      this.$trimOfObj(param)
      queryLegalEntityProductUomList(param)
        .then((response) => {
          this.loading = false
          this.tableList = response.data || []
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    handleBack() {
      const vm = this
      vm.visible = false
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
