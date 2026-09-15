<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('SALES.expenseItem')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-row>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            @click="handleAddBtn"
            v-if="!comDisFrom"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            >{{ $t('uiBtn.add') }}</el-button
          >
        </el-col>
      </el-row>
    </el-row>
    <el-table border ref="tables" :data="tableList" :max-height="tableMaxHeight" v-table-tab>
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
        <template slot="header" slot-scope="{ column }">
          <span v-if="['expenseItemName', 'expenseProportionAmount'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'expenseItemName' && !scope.row.isTotal">
            <el-input
              v-if="!comDisFrom"
              style="width: 98%"
              :title="scope.row.expenseItemName"
              v-model="scope.row.expenseItemName"
              :maxlength="50"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'expenseItemType' && !scope.row.isTotal">
            <el-select
              v-if="!comDisFrom"
              style="width: 98%"
              v-model="scope.row.expenseItemType"
              placeholder=""
              @change="expenseItemTypeChange(scope.row)"
            >
              <el-option
                v-for="dict in typeDicts"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
            <template v-else>{{ selectDictLabel(typeDicts, scope.row.expenseItemType) }}</template>
          </template>
          <template v-else-if="item.prop === 'expenseProportionAmount'">
            <div style="height: 28px" v-if="scope.row.expenseItemType === '1'">
              <el-input-number
                v-thousandSplit="{ precision: 1 }"
                style="width: 98%"
                size="mini"
                v-model="scope.row.expenseProportionAmount"
                controls-position="right"
                :precision="1"
                :min="1"
                :max="100"
                @change="expenseItemAmountChange(scope.row, '1')"
                v-if="!comDisFrom"
              />
              <span v-else>{{ $numberStr(scope.row.expenseProportionAmount, 1) }}</span>
            </div>
            <div style="height: 28px" v-if="scope.row.expenseItemType === '2'">
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                style="width: 98%"
                size="mini"
                v-model="scope.row.expenseProportionAmount"
                controls-position="right"
                :precision="2"
                :min="0.01"
                :max="999999.99"
                @change="expenseItemAmountChange(scope.row, '2')"
                v-if="!comDisFrom"
              />
              <span v-else>{{ $numberStr(scope.row.expenseProportionAmount, 2) }}</span>
            </div>
          </template>
          <template v-else-if="item.prop === 'subTotal'">
            {{ $numberStr(formData.subTotalOnlyProduct, 2) }}
          </template>
          <template v-else-if="item.prop === 'expenseAmount'">
            {{ $numberStr(scope.row[item.prop], 2) }}
          </template>

          <template v-else-if="item.prop === 'description' && !scope.row.isTotal">
            <el-input
              v-if="!comDisFrom"
              style="width: 98%"
              :title="scope.row.description"
              v-model="scope.row.description"
              :maxlength="500"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
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
        :fixed="false"
        v-if="!comDisFrom"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              v-if="!scope.row.isTotal"
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.$index, scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" v-if="!comDisFrom" :loading="btnLoading" @click="submit"
        >{{ $t('uiBtn.save') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'

export default {
  directives: {
    // transferDom
  },
  mixins: [pageMixin],
  props: {
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    modifyHighlight: {
      type: Boolean,
      default: false
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
      saveKey: '1',
      savePath: 'salesSIable',
      loading: false,
      btnLoading: false,
      rowIdKey: 'productId',
      tableList: [],
      visible: false,
      columns: [
        {
          prop: 'expenseItemName',
          label: vm.$t('SALES.expenseItemName'),
          visible: true,
          fixedWidth: 200,
          sortable: 'custom',
          tooltip: true,
          fixed: true
        },
        {
          prop: 'expenseItemType',
          label: vm.$t('ui.type'),
          visible: true,
          fixedWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'expenseProportionAmount',
          label: vm.$t('SALES.expenseProportionAmount'),
          visible: true,
          fixedWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'subTotal',
          label: vm.$t('SALES.subTotal1'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'expenseAmount',
          label: vm.$t('SALES.expenseAmount'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          fixedWidth: 200,
          tooltip: true
        }
      ],
      typeDicts: [
        {
          label: vm.$t('SALES.expenseProportion6'),
          value: '1'
        },
        {
          label: vm.$t('SALES.amount6'),
          value: '2'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    handleAdd() {
      this.visible = true
      this.tableList = JSON.parse(JSON.stringify(this.formData.expenseItemList || []))
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },

    closed() {
      this.tableList = []
    },
    handleAddBtn() {
      this.tableList.push({
        expenseItemType: '1'
      })
    },
    expenseItemTypeChange(row) {
      this.$set(row, 'expenseProportionAmount', undefined)
      this.$set(row, 'expenseAmount', undefined)
    },
    expenseItemAmountChange(row, type) {
      if (type === '1') {
        if (
          row.expenseProportionAmount &&
          this.$resultOfBoolean(this.formData.subTotalOnlyProduct)
        ) {
          this.$set(
            row,
            'expenseAmount',
            (row.expenseProportionAmount * this.formData.subTotalOnlyProduct) / 100
          )
        } else {
          this.$set(row, 'expenseAmount', undefined)
        }
      }
      if (type === '2') {
        this.$set(row, 'expenseAmount', row.expenseProportionAmount)
      }
    },
    // 行删除
    handleDelRow(index, row) {
      this.tableList.splice(index, 1)
    },
    submit() {
      if (this.btnLoading) return
      const expenseItemNameReq = this.tableList.find((item) => {
        return !this.$resultOfBoolean(item.expenseItemName)
      })
      if (expenseItemNameReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.expenseItemName'))
        )
        return
      }
      const expenseProportionAmountReq = this.tableList.find((item) => {
        return !this.$resultOfBoolean(item.expenseProportionAmount)
      })
      if (expenseProportionAmountReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.expenseProportionAmount'))
        )
        return
      }
      this.handleBack()
      this.$set(this.formData, 'expenseItemList', this.tableList)

      this.$emit('submitSuccess', this.tableList)
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
  margin-right: 20px;
  //  transition: width 0.28s;
  .item-node {
    box-sizing: border-box;
    margin: 6px;
    border: 1px solid #f2f2f2;
    border-radius: 4px;
    &:hover {
      background: #f5f7fa;
    }
  }
  .item-node-radio {
    display: block;
    padding: 0 20px;
    height: 34px;
    line-height: 34px;
  }
  .nodeActive {
    border: 1px solid #0e6eff;
  }
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
