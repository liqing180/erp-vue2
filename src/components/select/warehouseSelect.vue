<!--
* <p>Title:warehouseSelect</p>
* <p>Description: </p>
* <p>Copyright: Copyright (c) 2
* <p>Company: IMG LOGICS
* @author Song Jiang - Alter
* @version v1.0 2017-1-17
*-->
<template>
  <div>
    <div class="el-select w100" @click="handleClick">
      <div class="el-input el-input--suffix el-input--medium" :class="{ 'is-disabled': disabled }">
        <input
          v-model="inputVal"
          type="text"
          readonly="readonly"
          autocomplete="off"
          placeholder
          class="el-input__inner"
          :disabled="disabled"
        />
        <span class="el-input__suffix">
          <span class="el-input__suffix-inner">
            <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
          </span>
        </span>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      v-transfer-dom
      :title="$t('warehouseSelect.title')"
      :visible.sync="visible"
      width="1140px"
      :modal="true"
      :close-on-click-modal="false"
      @opened="dlgOpened"
    >
      <el-tooltip
        :disabled="tipVisible"
        :content="
          $t('ui.searchWords').replace(
            '$1',
            `${$t('warehouseSelect.warehouseCode')} / ${$t('warehouseSelect.warehouseName')}`
          )
        "
        placement="bottom-start"
        effect="light"
      >
        <el-input
          v-model="condition"
          prefix-icon="el-icon-search"
          clearable
          class="dailog-search"
          size="small"
          :placeholder="$t('ui.search')"
          @input="handleSearch"
          @focus="tipVisible = true"
          @blur="tipVisible = false"
        >
        </el-input>
      </el-tooltip>
      <div class="clearfix">
        <el-table
          ref="purchaseTable"
          v-loading="table_loading"
          :data="tableData"
          stripe
          border
          class="w100"
          :max-height="tableMaxHeight"
          header-row-class-name="th-primary"
          highlight-current-row
          @row-click="handleRowClick"
          :row-class-name="'pointer'"
        >
          <el-table-column type="index" :label="$t('ui.sn')" :width="fitWidth" fixed="left">
            <template slot-scope="scope"
              ><span>{{ scope.$index + (curPage - 1) * pageSize + 1 }} </span></template
            >
          </el-table-column>
          <el-table-column
            prop="warehouseCode"
            :label="$t('warehouseSelect.warehouseCode')"
            min-width="150"
            fixed="left"
          ></el-table-column>
          <el-table-column
            prop="warehouseName"
            show-overflow-tooltip
            :label="$t('warehouseSelect.warehouseName')"
            min-width="200"
          ></el-table-column>
          <el-table-column
            prop="inventoryOrganizationName"
            :label="$t('warehouseSelect.inventoryOrganization')"
            min-width="200"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="warehouseType"
            :label="$t('warehouseSelect.warehouseType')"
            min-width="220"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ WAREHOUSE_TYPE[scope.row.warehouseType] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="isDefault"
            :label="$t('ui.default')"
            :min-width="100"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.isDefault === '1' ? '' : 'danger'">
                {{ scope.row.isDefault === '1' ? $t('ui.y') : $t('ui.n') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="active"
            :label="$t('ui.active')"
            :min-width="90"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.active === '1' ? '' : 'danger'">
                {{ scope.row.active === '1' ? $t('ui.y') : $t('ui.n') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouseAddress.label"
            :label="$t('warehouseSelect.label')"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-popover
                trigger="hover"
                :open-delay="500"
                placement="top"
                :disabled="
                  scope.row.warehouseAddress && Object.is(scope.row.warehouseAddress).length === 0
                "
              >
                <el-scrollbar class="scroll-bar-box" style="height: 210px">
                  <div class="addr-list-new">
                    <div class="itemTitle">{{ $t('warehouseSelect.label') }} : &nbsp;</div>
                    <div class="itemContent">
                      {{ scope.row.warehouseAddress && scope.row.warehouseAddress.label }}
                    </div>
                  </div>
                  <div class="addr-list-new">
                    <div class="itemTitle">{{ $t('warehouseSelect.address1') }} : &nbsp;</div>
                    <div class="itemContent">
                      {{ scope.row.warehouseAddress && scope.row.warehouseAddress.address1 }}
                    </div>
                  </div>
                  <div class="addr-list-new">
                    <div class="itemTitle">{{ $t('warehouseSelect.address2') }} : &nbsp;</div>
                    <div class="itemContent">
                      {{ scope.row.warehouseAddress && scope.row.warehouseAddress.address2 }}
                    </div>
                  </div>
                  <div class="addr-list-new">
                    <div class="itemTitle">{{ $t('warehouseSelect.location') }} : &nbsp;</div>
                    <div class="itemContent">
                      {{ scope.row.warehouseAddress && scope.row.warehouseAddress.location }}
                    </div>
                  </div>
                  <div class="addr-list-new">
                    <div class="itemTitle">{{ $t('warehouseSelect.city') }} : &nbsp;</div>
                    <div class="itemContent">
                      {{ scope.row.warehouseAddress && scope.row.warehouseAddress.city }}
                    </div>
                  </div>
                  <div class="addr-list-new">
                    <div class="itemTitle">{{ $t('warehouseSelect.province') }} : &nbsp;</div>
                    <div class="itemContent">
                      {{ scope.row.warehouseAddress && scope.row.warehouseAddress.province }}
                    </div>
                  </div>
                  <div class="addr-list-new">
                    <div class="itemTitle">{{ $t('warehouseSelect.postalCode') }} : &nbsp;</div>
                    <div class="itemContent">
                      {{ scope.row.warehouseAddress && scope.row.warehouseAddress.postalCode }}
                    </div>
                  </div>
                  <div class="addr-list-new">
                    <div class="itemTitle">{{ $t('warehouseSelect.country') }} : &nbsp;</div>
                    <div class="itemContent">
                      {{ scope.row.warehouseAddress && scope.row.warehouseAddress.country }}
                    </div>
                  </div>
                </el-scrollbar>
                <div slot="reference" class="name-wrapper">
                  <span
                    style="
                      display: inline-block;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      width: 100%;
                    "
                    >{{ scope.row.warehouseAddress && scope.row.warehouseAddress.label }}</span
                  >
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouseAddress.country"
            show-overflow-tooltip
            :label="$t('warehouseSelect.country')"
            min-width="120"
          ></el-table-column>
        </el-table>
        <el-pagination
          class="fr mt10"
          :current-page.sync="curPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          @size-change="handlePageSizeChangeAndSave"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="ghost" @click="visible = false">{{ $t('ui.back') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { orderBy } from 'lodash'
// eslint-disable-next-line no-unused-vars
import { mapGetters, mapState } from 'vuex'
import {
  queryWarehouseList,
  queryAdjustmentWarehouseList,
  queryFromWarehouseList,
  queryToWarehouseList,
  queryWarehouseListByGoodsReturnNotePO
} from '@/api/inventory/common'
import { queryWarehouseListBySic } from '@/api/inventory/sic'
// tableMinxs 改为 tableMinx
import pageMixin from '@/mixins/tableMinx'
import snWidthMinx from '@/mixins/snWidthMinx'
import behaviourMixin from '@/mixins/behaviourMixin.js'
import transferDom from '@/directives/transferDom'
import emitter from 'element-ui/src/mixins/emitter'

export default {
  directives: {
    transferDom
  },
  mixins: [pageMixin, emitter, snWidthMinx, behaviourMixin],
  props: {
    value: {
      required: true,
      type: String,
      default: ''
    },
    // isPrivate: Boolean,
    isAdjust: Boolean,
    isFrom: Boolean,
    isTo: Boolean,
    // SIC选择仓库
    isSic: {
      type: Boolean,
      default: false
    },
    // 退货单选择仓库
    isReturn: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    isShowName: {
      type: Boolean,
      default: false
    },
    // 弹窗选择仓库名字
    isWarehouseName: {
      type: Boolean,
      default: false
    },
    // 退货单: 选择收货单后，单上产品在仓库中没货,过滤该仓库
    goodsReceiveNoteId: {
      type: String,
      default: () => null
    },
    warehouseId: {
      type: String,
      default: null
    }, // 数据排除id
    activity: {
      type: [Number],
      default: 1
    },
    curPath: {
      type: [String],
      default: ''
    }
  },
  data() {
    return {
      tableMaxHeightResize: true,
      condition: '',
      visible: false,
      selected: '',
      selectedRow: {}
    }
  },
  computed: {
    inputVal() {
      if (!this.selected) {
        return ''
      }
      return this.isShowName ? this.selectedRow && this.selectedRow.warehouseName : this.selected
    },
    ...mapGetters(['dicts']),
    WAREHOUSE_TYPE() {
      return this.dicts.WAREHOUSE_TYPE
    }
  },

  watch: {
    value(selected) {
      this.selected = selected
    },
    // eslint-disable-next-line no-unused-vars
    selected(selected, oldVal) {
      this.$emit('input', selected)
      this.$emit('change', selected)
      if (selected === undefined) return
      this.dispatch('ElFormItem', 'el.form.blur', [this.selected])
    }
  },
  beforeCreate() {
    const locale = {
      zh: {
        warehouseSelect: {
          title: '仓库',
          warehouseCode: '仓库编号',
          city: '城市',
          warehouseName: '仓库名称',
          companyName: '公司名称',
          province: '省份/州',
          address1: '地址1',
          address2: '地址2',
          postalCode: '邮编',
          location: '位置/地区',
          country: '国家',
          label: '标签',
          inventoryOrganization: '库存组织',
          warehouseType: '仓库类型'
        }
      },
      en: {
        warehouseSelect: {
          title: 'Warehouse',
          warehouseCode: 'Warehouse Code',
          city: 'City/Town',
          warehouseName: 'Warehouse Name',
          companyName: 'Business Partner Name',
          province: 'Province/State',
          address1: 'Address Line1',
          address2: 'Address Line2',
          postalCode: 'Postal Code',
          location: 'Location/Precinct',
          country: 'Country',
          label: 'Label',
          inventoryOrganization: 'Inventory Organization',
          warehouseType: 'Warehouse Type'
        }
      }
    }
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  // created() {
  //   this.queryTableList()
  // },
  updated() {
    this.selected = this.value
  },
  methods: {
    dlgOpened() {
      const vm = this

      vm.$$query('selectCommonModule', Number(vm.activity) - 1, vm.curPath)
    },

    handlePageSizeChangeAndSave(pageSize) {
      const vm = this

      vm.handlePageSizeChange(pageSize)
      vm.$$pageSizeSave('selectCommonModule', Number(vm.activity) - 1, vm.curPath)
    },

    handleClick() {
      this.condition = ''
      this.selectedRow = {}
      if (this.disabled) return
      this.visible = true
      this.curPage = 1
      this.tableData = []
      // this.pageSize = 10
      // this.queryTableList()
    },
    handleRowClick(row) {
      this.selected = this.isShowName
        ? row.id
        : this.isWarehouseName
        ? row.warehouseName
        : row.warehouseCode
      this.visible = false
      this.$emit('select', row)
      this.selectedRow = row
    },
    queryTableList() {
      const vm = this

      const param = {
        condition: vm.condition,
        pageNow: vm.curPage,
        pageSize: vm.pageSize,
        warehouseId: vm.warehouseId,
        goodsReceiveNoteId: vm.goodsReceiveNoteId
      }
      vm.table_loading = true

      if (!param.warehouseId) {
        delete param.warehouseId
      }
      const fn = vm.isFrom
        ? queryFromWarehouseList
        : vm.isTo
        ? queryToWarehouseList
        : vm.isSic
        ? queryWarehouseListBySic
        : vm.isAdjust
        ? queryAdjustmentWarehouseList
        : vm.isReturn
        ? queryWarehouseListByGoodsReturnNotePO
        : queryWarehouseList
      fn(param)
        .then((res) => {
          const { data } = res
          vm.table_loading = false
          vm.pageSizeChange = false
          if (data.status === 200) {
            const results = data.msg || {}

            const { pageNum, pageSize, total, list = [] } = results
            vm.curPage = pageNum
            vm.totalPage = total
            vm.pageSize = pageSize
            vm.tableData = list
            if (vm.value && JSON.stringify(vm.selectedRow) === '{}') {
              const res = list.filter((item) => item.id === vm.value)
              vm.selectedRow = res[0]
            }
          } else {
            vm.$modal.msgError(data.message)
          }
        })
        .catch((err) => {
          vm.table_loading = false
          window.console.error(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.addr-list {
  display: flex;
  flex-direction: row;
  line-height: 25px;
  flex-flow: nowrap;

  .itemTitle {
    min-width: 180px;
    text-align: right;
    font-weight: bold;
  }

  .itemContent {
    width: 250px;
    word-break: break-all;
    text-indent: 5px;
  }
}
</style>
