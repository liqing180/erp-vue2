<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('menu.profitMarginSettings')"
    :visible.sync="visible"
    width="1200px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-form ref="form" :model="form" @submit.native.prevent label-width="auto">
      <el-form-item :label="$t('PRODUCT.productCategory1')">
        <el-cascader
          :show-all-levels="false"
          placeholder=""
          size="small"
          v-model="form.productCategoryId"
          :options="productCategoryList"
          :props="{
            multiple: false,
            checkStrictly: true,
            value: 'id',
            label: 'categoryName'
          }"
          clearable
          :collapse-tags="true"
          @change="update"
          class="cascader"
          ref="cascader"
          popper-class="hide-cascader-scrollbar"
          style="width: 250px"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <el-table
      border
      ref="tables"
      class="mt10"
      :data="tableList"
      @sort-change="handleSortChange"
      :max-height="tableMaxHeight"
    >
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
          <span v-if="['profit'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'profit'">
            <el-input-number
              style="width: 98%"
              v-model="scope.row.profit"
              controls-position="right"
              :precision="2"
              :min="1"
              :max="1000"
            />
          </template>

          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="flexStart">
            <div class="flexCen flex-1">
              <i
                class="el-icon el-icon-delete pointer"
                style="font-size: 20px; color: #f56c6c"
                :title="$t('uiBtn.delete')"
                @click="handleDelRow(scope.$index, scope.row)"
              ></i>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('uiBtn.save') }} </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/inventoryManagement/lang/index'
import { queryAllProductCategoryTreeList } from '@/api/productManagement/productCategory'
import {
  queryProfitMarginSettings,
  updateProfitMarginSettings
} from '@/api/salesManagement/salesCost'

export default {
  dicts: ['i_stock_certificate_document_type', 'i_inventory_type'],
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      saveKey: '2',
      savePath: 'reportMTable',
      loading: false,
      // 总条数
      total: 0,
      tableList: [],
      rowIdKey: 'businessPartnerMainId',
      visible: false,
      columns: [
        {
          prop: 'categoryName1',
          label: vm.$t('PRODUCT.productCategory1'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'categoryName2',
          label: vm.$t('PRODUCT.productCategory1'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'categoryName3',
          label: vm.$t('PRODUCT.productCategory1'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'categoryName4',
          label: vm.$t('PRODUCT.productCategory1'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'categoryName5',
          label: vm.$t('PRODUCT.productCategory1'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'categoryName6',
          label: vm.$t('PRODUCT.productCategory1'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'profit',
          label: vm.$t('SALES.profitMargin'),
          visible: true,
          minWidth: 180,
          fixedWidth: 140,
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      form: {
        productCategoryId: []
      },
      productCategoryList: [],
      currentIds: []
    }
  },
  computed: {},
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    async handleOpen(row) {
      this.visible = true
      this.queryProfitMarginSettings()
    },
    queryProfitMarginSettings() {
      queryProfitMarginSettings({}).then((res) => {
        const { profitMarginSettingsList } = res.data
        this.tableList = profitMarginSettingsList
        this.queryAllProductCategoryTreeList()
      })
    },
    queryAllProductCategoryTreeList() {
      queryAllProductCategoryTreeList().then((res) => {
        this.productCategoryList = res.data
        const ids = this.tableList.map((x) => x.categoryId)
        this.disabledProductCategoryList(this.productCategoryList, ids)
      })
    },
    disabledProductCategoryList(data, ids = []) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          if (ids.indexOf(x.id) !== -1) {
            this.$set(x, 'disabled', true)
          } else {
            this.$set(x, 'disabled', false)
          }
          if (x.child && x.child.length > 0) {
            x.children = x.child
            this.disabledProductCategoryList(x.child, ids)
          } else {
            x.children = undefined
          }
        })
      }
    },
    update(e) {
      this.currentIds = e
      const nodes = this.$refs.cascader.getCheckedNodes()
      console.log(nodes)
      const params = {}
      params['categoryId' + nodes[0].level] = nodes[0].value
      params['categoryName' + nodes[0].level] = nodes[0].label
      params.categoryId = nodes[0].value
      params.categoryName = nodes[0].label
      if (nodes[0].parent) {
        this.handler(params, nodes[0].parent)
      }
      this.tableList.push(params)
      this.$refs.cascader.toggleDropDownVisible()
      this.form.productCategoryId = []
      const ids = this.tableList.map((x) => x.categoryId)
      this.disabledProductCategoryList(this.productCategoryList, ids)
      console.log(this.productCategoryList)
    },
    handler(params, parent) {
      params['categoryId' + parent.level] = parent.value
      params['categoryName' + parent.level] = parent.label
      if (parent.parent) {
        this.handler(params, parent.parent)
      }
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        const ids = this.tableList.map((x) => x.categoryId)
        this.disabledProductCategoryList(this.productCategoryList, ids)
      })
    },
    closed() {
      this.tableList = []
    },
    submit() {
      const profit = this.tableList.some((x) => !this.$resultOfBoolean(x.profit))
      if (profit) {
        this.collapseWarningForProductInfo = true
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.profitMargin'))
        )
        return
      }
      updateProfitMarginSettings({ profitMarginSettingsList: this.tableList }).then((res) => {
        console.log(res)
      })
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.right-title {
  flex: 1;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  span {
    display: inline-block;
    max-width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
