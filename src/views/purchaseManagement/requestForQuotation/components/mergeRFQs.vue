<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.RFQProductList')"
    :visible.sync="visible"
    width="1100px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div style="color: #f9b74d">{{ $t('PURCHASE.mergeRFQsTips') }}</div>

    <el-form
      ref="form"
      :model="form"
      @submit.native.prevent
      :rules="rules"
      label-width="190px"
      class="mt20"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.dropShipping')}`" prop="dropShipping">
            <el-select
              v-model="form.dropShipping"
              placeholder=""
              style="width: 100%"
              clearable
              @change="dropShippingChange"
            >
              <el-option
                v-for="item in [
                  { label: $t('ui.y'), value: '1' },
                  { label: $t('ui.n'), value: '0' }
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item
            :label="`${$t('PURCHASE.deliveryAddress')}`"
            prop="receiveAddressName"
            v-if="form.dropShipping === '1'"
          >
            <el-autocomplete
              v-model="form.receiveAddressName"
              :fetch-suggestions="querySearch"
              placeholder=""
              @select="receiveAddressNameChange"
              :maxlength="200"
              style="width: 100%"
              clearable
            ></el-autocomplete>
          </el-form-item>

          <el-form-item :label="`${$t('PURCHASE.deliveryAddress')}`" prop="warehouseId" v-else>
            <el-select
              v-model="form.warehouseId"
              placeholder=""
              style="width: 100%"
              clearable
              @change="warehouseChange"
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.warehouseId"
                :label="item.warehouseName"
                :value="item.warehouseId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="mt10">
      <el-table
        border
        ref="tables"
        :data="tableList"
        :max-height="tableMaxHeight"
        v-loading="loading"
        @sort-change="handleSortChange"
        @row-click="handleRowClick"
        :row-class-name="'pointer'"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
      >
        <el-table-column type="selection" width="55" :selectable="selectable" align="center" />
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
          :min-width="getMinWidth(item)"
          :show-overflow-tooltip="item.tooltip"
          :fixed="item.fixed"
          :sortable="item.sortable"
          :align="item.align || 'left'"
          header-align="center"
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'productName'">
              <commonProductAndPicture :row="scope.row" />
            </template>
            <template v-else-if="item.prop === 'isActive'">
              <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
              <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                $t('uiBtn.inactive')
              }}</el-tag>
            </template>
            <template v-else-if="item.prop === 'dropShipping'">
              <el-tag v-if="scope.row.dropShipping === '1'">{{ $t('uiBtn.active') }}</el-tag>
              <el-tag v-if="scope.row.dropShipping === '0'" type="danger">{{
                $t('uiBtn.inactive')
              }}</el-tag>
            </template>
            <template v-else-if="item.prop === 'unitPrice'">
              {{ $numberStr(scope.row.unitPrice, 2) }}
            </template>
            <template v-else-if="item.prop === 'purchaseQty'">
              {{ $numberStr(scope.row.purchaseQty, scope.row.decimalNum) }}
            </template>
            <template v-else-if="item.prop === 'prBalanceBasicQty'">
              {{ $numberStr(scope.row.prBalanceBasicQty, scope.row.decimalNum) }}
            </template>
            <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" @click="submit" :disabled="selectList.length <= 0"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryCanSelectWarehouseListNoPage } from '@/api/purchaseManagement/requestForQuotation'

export default {
  dicts: ['bp_business_partner_status', 'bp_supplier_type', 'bp_supplier_group'],
  mixins: [pageMixin],
  props: {
    productIdList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '42',
      savePath: 'purchaseMTable',
      searchFormKey: Date.now(),
      activeName: '1',
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'rfqDetailId',
      tableList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList: [],
      visible: false,
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          padding: 70,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.purchaseQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'prBalanceBasicQty',
          label: vm.$t('PURCHASE.pendPurchaseQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.DocNo'),
          visible: true,
          minWidth: 160,
          tooltip: false
        },
        {
          prop: 'dropShipping',
          label: vm.$t('PURCHASE.dropShipping'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'receiveAddressName',
          label: vm.$t('PURCHASE.deliveryAddress'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'requestedBy',
          label: vm.$t('PURCHASE.consignee'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'requestedEmail',
          label: vm.$t('PURCHASE.requestedEmail'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'requestedMobilePhone',
          label: vm.$t('PURCHASE.requestedMobilePhone'),
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },

      /* 已经选择的联系人Id(过滤) */
      alreadySelectIdList: [],
      form: {
        warehouseId: undefined,
        warehouseName: undefined,
        receiveAddressName: undefined,
        dropShipping: '1'
      },
      rules: {
        dropShipping: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        receiveAddressName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        warehouseId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      receiveAddressList: [],
      warehouseList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    handleAdd(alreadySelectIdList = []) {
      this.tableList = JSON.parse(JSON.stringify(alreadySelectIdList))
      this.selectList = alreadySelectIdList
      if (this.tableList.some((x) => x.dropShipping === '1')) {
        this.form.dropShipping = '1'
      } else {
        this.form.dropShipping = '0'
      }
      // const receiveAddressList = alreadySelectIdList
      //   .map((x) => ({
      //     value: x.dropShipping === '1' ? x.receiveAddressName : x.salesReceiveAddress,
      //     id: x.receiveAddressId || undefined
      //   }))

      const receiveAddressList = alreadySelectIdList
        .filter((x) => x.dropReceiveAddress)
        .map((x) => ({
          value: x.dropReceiveAddress
        }))
      // 对 receiveAddressList 数组进行去重（基于 value 和 id）
      const uniqueMap = new Map()
      receiveAddressList.forEach((item) => {
        const key = `${item.value}`
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item)
        }
      })
      this.receiveAddressList = Array.from(uniqueMap.values())
      console.log(this.receiveAddressList, '======344')
      if (this.form.dropShipping === '1') {
        if (this.receiveAddressList.length === 1) {
          this.form.receiveAddressName = this.receiveAddressList[0].value
        }
      }
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.queryCanSelectWarehouseListNoPage()
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      this.visible = true
      this.$nextTick(() => {
        this.selectList.forEach((row) => {
          this.tableList.forEach((item) => {
            if (row[this.rowIdKey] === item[this.rowIdKey]) {
              this.$refs.tables.toggleRowSelection(item, true)
            }
          })
        })
      })
    },
    queryCanSelectWarehouseListNoPage() {
      queryCanSelectWarehouseListNoPage({}).then((res) => {
        this.warehouseList = res.data || []
        if (this.form.dropShipping === '0' && this.warehouseList.length === 1) {
          this.form.warehouseId = this.warehouseList[0].warehouseId
          this.warehouseChange()
        }
      })
    },
    dropShippingChange() {
      this.form.warehouseId = undefined
      this.form.warehouseName = undefined
      this.form.receiveAddressName = undefined
      if (this.form.dropShipping === '1') {
        if (this.receiveAddressList.length === 1) {
          this.form.receiveAddressName = this.receiveAddressList[0].value
          this.$nextTick(() => {
            this.$refs.form.clearValidate('receiveAddressName')
          })
        }
      } else {
        if (this.warehouseList.length === 1) {
          this.form.warehouseId = this.warehouseList[0].warehouseId
          this.warehouseChange()
        }
      }
    },
    querySearch(queryString, cb) {
      const vm = this
      const brandList = vm.receiveAddressList

      let results
      if (queryString) {
        results = brandList.filter(
          (umo) => umo.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      } else {
        results = brandList
      }
      cb(results)
    },
    receiveAddressNameChange(val) {
      this.form.receiveAddressName = val.value
    },
    warehouseChange() {
      if (this.form.warehouseId) {
        const warehouseName = this.warehouseList.find(
          (x) => x.warehouseId === this.form.warehouseId
        )?.warehouseName
        this.form.warehouseName = warehouseName
      } else {
        this.form.warehouseName = undefined
      }
    },
    selectable(row, rowIndex) {
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
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.selectList = []
      this.form = {
        warehouseId: undefined,
        warehouseName: undefined,
        receiveAddressName: undefined,
        dropShipping: '1'
      }
      this.resetForm('form')
    },
    async submit() {
      const valid1 = await this.$refs.form.validate().catch((err) => {
        return err
      })
      if (!valid1) {
        return
      }
      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 2000)
      this.$router.push({
        path: '/purchaseManagement/addRequestForQuotation',
        query: {
          timeId: Date.now(),
          rfqDetailIds: this.selectList.map((item) => item.rfqDetailId).join(','),
          isMergePrAddress: '1',
          dropShipping: this.form.dropShipping,
          warehouseId: this.form.warehouseId,
          warehouseName: this.form.warehouseName,
          receiveAddressName: this.form.receiveAddressName
        }
      })

      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}
.form {
  // padding-top: 5px;
  // padding-bottom: 5px;
  ::v-deep .el-form-item {
    margin-bottom: 0px !important;
  }
}
</style>
