<template>
  <div class="pb20">
    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleReQuote"
          :loading="btnLoading"
          :disabled="selectList.length <= 0"
          type="primary"
          size="mini"
          v-if="formData.mixDesignStatus === '2' && !comDisFrom"
          >{{ $t('menu.reQuote') }}</el-button
        >
      </el-col>
    </el-row> -->
    <el-table
      border
      :data="comTableList"
      :max-height="600"
      :tree-props="{
        children: 'variationMaterialList',
        hasChildren: 'hasChildren'
      }"
      :default-expand-all="true"
      row-key="rowTimeId"
      ref="tables"
      @selection-change="handleSelectionChange"
      class="hide-check-all"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.isChild" style="text-align: right">{{ scope.row.snStr }}</div>
          <div v-else>{{ scope.row.snStr }}</div>
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
      >
        <!-- <template slot="header" slot-scope="{ column }">
          <span v-if="[formData.mixDesignStatus === '2' ? 'unitCost' : ''].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template> -->
        <template slot-scope="scope">
          <template v-if="item.prop === 'productName'">
            <span v-if="scope.row.productName">{{ scope.row.productName }}</span>
            <span v-else>{{
              scope.row.variationShowStr ||
              selectDictLabel(dict.type.mdm_variation, scope.row.variation)
            }}</span>
          </template>
          <template v-else-if="item.prop === 'productType'">
            <!-- <span v-if="scope.row.productType === '1'">{{ $t('PRODUCT.product') }}</span> -->
            <!-- <span v-if="scope.row.productType === '2'">{{ $t('PRODUCT.service') }}</span> -->
            <span>{{ selectDictLabel(dict.type.product_type, scope.row.productType) }}</span>
          </template>
          <div v-else-if="item.prop === 'unitCost'">
            <div
              class="flexSa"
              v-if="!comDisFrom && scope.row.internalPartNo && !scope.row.referenceAmount"
            >
              <el-input-number
                style="width: 96%"
                v-model="scope.row.unitCost"
                controls-position="right"
                :precision="2"
                v-thousandSplit="{ precision: 2 }"
                :min="0.01"
                :max="999999999.99"
                @blur="unitCostChange(scope.row)"
              />
            </div>
            <span v-else>{{ $numberStr(scope.row.unitCost, 2) }}</span>
          </div>
          <template v-else-if="item.prop === 'qty'">
            <span v-if="scope.row.internalPartNo">
              {{ $numberStr(scope.row.qty, 3) }}
            </span>
          </template>
          <template v-else-if="item.prop === 'purchaseUnitPrice'">{{
            $numberStr(scope.row.purchaseUnitPrice, 2)
          }}</template>
          <template v-else-if="item.prop === 'referenceAmount'">{{
            $numberStr(scope.row.referenceAmount, 2)
          }}</template>
          <template v-else-if="item.prop === 'totalCost'">{{
            $numberStr(scope.row.totalCost, 2)
          }}</template>
          <template v-else-if="item.prop === 'dateQuoted'">{{
            parseTime(scope.row.dateQuoted, fmtForYmdhms)
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
    </el-table>

    <div style="display: flex; justify-content: flex-end" v-if="false">
      <el-form
        ref="totalFormRef"
        :model="totalForm"
        @submit.native.prevent
        :rules="rules"
        label-width="120px"
        class="mt20"
        style="width: 500px"
        :disabled="comDisFrom"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('PRODUCT.price')}`" prop="price">
              <el-input-number
                v-model="totalForm.price"
                :precision="2"
                type="number"
                class="form-wd"
                placeholder=""
                :min="0.01"
                :max="9999.99"
                style="width: 100%"
                controls-position="right"
                @change="inputNumberChange('price')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('PRODUCT.subTotal')}`" prop="subTotal">
              <el-input-number
                v-model="totalForm.subTotal"
                :precision="2"
                type="number"
                class="form-wd"
                placeholder=""
                style="width: 100%"
                controls-position="right"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="`${$t('PRODUCT.wastage')}`" prop="wastageRate">
              <el-input-number
                v-model="totalForm.wastageRate"
                :precision="0"
                type="number"
                class="form-wd"
                :min="1"
                :max="200"
                placeholder=""
                style="width: 100%"
                controls-position="right"
                @blur="calculateProjectTemplate"
                @change="inputNumberChange('wastageRate')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('PRODUCT.wastageAmount')}`">
              <el-input-number
                v-model="totalForm.wastageAmount"
                :precision="2"
                type="number"
                class="form-wd"
                placeholder=""
                style="width: 100%"
                controls-position="right"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('PRODUCT.admin')}`" prop="adminRate">
              <div style="display: flex">
                <el-input-number
                  v-model="totalForm.adminRate"
                  :precision="0"
                  type="number"
                  class="form-wd"
                  :min="1"
                  :max="500"
                  placeholder=""
                  style="width: 40%"
                  controls-position="right"
                  @blur="calculateProjectTemplate"
                  @change="inputNumberChange('adminRate')"
                />
                <span style="padding: 0 10px">%</span>
                <el-input-number
                  v-model="totalForm.adminAmount"
                  :precision="2"
                  type="number"
                  class="form-wd"
                  placeholder=""
                  style="width: 60%"
                  controls-position="right"
                  disabled
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('PRODUCT.markup')}`" prop="markupRate">
              <div style="display: flex">
                <el-input-number
                  v-model="totalForm.markupRate"
                  :precision="0"
                  type="number"
                  class="form-wd"
                  :min="1"
                  :max="500"
                  placeholder=""
                  style="width: 40%"
                  controls-position="right"
                  @blur="calculateProjectTemplate"
                  @change="inputNumberChange('markupRate')"
                />
                <span style="padding: 0 10px">%</span>
                <el-input-number
                  v-model="totalForm.markupAmount"
                  :precision="2"
                  type="number"
                  class="form-wd"
                  placeholder=""
                  style="width: 60%"
                  controls-position="right"
                  disabled
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('PRODUCT.otherCosts')}`" prop="otherCosts">
              <el-input-number
                v-model="totalForm.otherCosts"
                :precision="2"
                type="number"
                class="form-wd"
                placeholder=""
                :min="minNum"
                :max="999999999.99"
                style="width: 100%"
                controls-position="right"
                @blur="calculateProjectTemplate"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('PRODUCT.totalAmount')}`" prop="totalAmount">
              <div class="input-switch-box">
                <div class="con-left">
                  <el-input :value="$numberStr(totalForm.totalAmount, 2)" disabled></el-input>
                </div>
                <div class="con-right" v-if="!comDisFrom">
                  <svg-icon
                    @click="handleCalculate"
                    icon-class="jisuanqi"
                    style="height: 36px; width: 36px; cursor: pointer"
                  />
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
    </div>

    <addVariationPage
      ref="fromPageRef"
      @addRow="addRow"
      @editRow="editRow"
      @closed="closed"
      :comDisFrom="comDisFrom"
      :formData="formData"
    />
  </div>
</template>

<script>
import { reQuote } from '@/api/productManagement/mixDesign'
import pageMixin from '@/mixins/tableMinx'
import addVariationPage from '@/views/productManagement/mixDesign/components/addVariationPage.vue'
export default {
  dicts: ['mdm_variation', 'product_type'],
  mixins: [pageMixin],
  components: {
    addVariationPage
  },
  props: {
    comDisFrom: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.totalForm = newValue || { taxRate: undefined }
      }
    },
    'formData.variationList': {
      immediate: true,
      handler: function () {
        let timeId = Date.now()
        this.formData.variationList.forEach((item) => {
          timeId++
          this.$set(item, 'rowTimeId', timeId)
          const childList = item.variationMaterialList || []
          childList.forEach((child) => {
            timeId++
            child.parentTimeId = item.rowTimeId
            child.rowTimeId = timeId++
            this.$set(child, 'parentTimeId', item.rowTimeId)
            this.$set(child, 'rowTimeId', timeId)
          })
        })
        this.tableList = this.formData.variationList
        this.changeTableList()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '10',
      btnLoading: false,
      totalForm: {},
      tableList: [],
      selectList: [],
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          align: 'left'
        },
        {
          prop: 'productType',
          label: vm.$t('PRODUCT.productClass'),
          width: 150,
          visible: true,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.productCode'),
          visible: true,
          minWidth: 160,
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
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'uom',
          label: vm.$t('ui.uom'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        /* {
          prop: 'purchaseQuotationNo',
          label: vm.$t('PRODUCT.purchaseQuotationNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'dateQuoted',
          label: vm.$t('PRODUCT.dateQuoted'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchaseUnitPrice',
          label: vm.$t('PRODUCT.purchasePrice'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right'
        }, */
        {
          prop: 'qty',
          label: vm.$t('PRODUCT.qty'),
          visible: true,
          minWidth: 180,
          tooltip: true
        }
        /* {
          prop: 'referenceAmount',
          label: vm.$t('PRODUCT.referenceAmount'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'unitCost',
          label: vm.$t('PRODUCT.unitCost'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right'
        }, */
        /* {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          minWidth: 200,
          visible: true,
          tooltip: true
        }, */
        /* {
          prop: 'totalCost',
          label: vm.$t('PRODUCT.totalCost'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right'
        } */
      ],
      rules: {
        wastageRate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        adminRate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        markupRate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        price: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      },
      editRowVariation: undefined
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    minNum() {
      let num = 0
      const { subTotal, wastageAmount, adminAmount, markupAmount } = this.totalForm
      if (subTotal) {
        num -= subTotal
      }
      if (wastageAmount) {
        num -= wastageAmount
      }
      if (adminAmount) {
        num -= adminAmount
      }
      if (markupAmount) {
        num -= markupAmount
      }

      return num
    },
    comTableList() {
      const list1 = this.tableList.filter((item) => {
        return item.isActive === '1' && item.variationType === '1'
      })
      const list2 = this.tableList.filter((item) => {
        return item.isActive === '1' && item.variationType === '2'
      })
      list1.forEach((item, index) => {
        this.$set(item, 'snStr', index + 1)
        const childList = item.variationMaterialList || []
        childList.forEach((child, childIndex) => {
          this.$set(child, 'isChild', true)
          this.$set(child, 'snStr', this.getChildSn(childIndex))
        })
      })
      list2.forEach((item, index) => {
        this.$set(item, 'snStr', index + 1)
        const childList = item.variationMaterialList || []
        childList.forEach((child, childIndex) => {
          this.$set(child, 'isChild', true)
          this.$set(child, 'snStr', this.getChildSn(childIndex))
        })
      })

      return [...list1, ...list2]
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    getChildSn(index) {
      const strs = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        's',
        'y',
        'z'
      ]
      const remainder = index % 26
      const num = Math.floor(index / 26)
      // console.log(num, remainder, (num || '') + strs[remainder])
      return (num || '') + strs[remainder]
    },
    selectable(row, rowIndex) {
      if (!row.productName) {
        return false
      }
      return true // 不禁用
    },
    addRow(row) {
      this.tableList.push(row)
    },
    editRow(row) {
      this.tableList.forEach((item, index) => {
        if (item.timeId === row.timeId) {
          this.tableList.splice(index, 1, row)
        }
      })
    },
    closed() {
      this.editRowVariation = undefined
    },
    handleAdd() {
      this.$refs.fromPageRef.handleAdd()
    },
    /** 修改按钮操作 */
    rowDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.editRowVariation = row.variation
      this.$refs.fromPageRef.handleUpdate(row)
    },
    unitCostChange(row) {
      const parentRow = this.tableList.find((item) => item.rowTimeId === row.parentTimeId)
      this.calculateRow(parentRow)
      this.$nextTick(() => {
        this.setTotalForm()
      })
    },
    calculateRow(parentRow) {
      let rowTotalCost = 0
      const childList = parentRow.variationMaterialList || []
      childList.forEach((child) => {
        if (child.unitCost) {
          this.$set(child, 'totalCost', child.qty * child.unitCost)
        } else {
          this.$set(child, 'totalCost', undefined)
        }
        rowTotalCost += child.totalCost || 0
      })
      if (rowTotalCost) {
        this.$set(parentRow, 'unitCost', rowTotalCost)
        this.$set(parentRow, 'totalCost', rowTotalCost)
      } else {
        this.$set(parentRow, 'unitCost', undefined)
        this.$set(parentRow, 'totalCost', undefined)
      }
    },
    calculateAllRow() {
      this.tableList.forEach((row) => {
        this.calculateRow(row)
      })
      this.$nextTick(() => {
        this.setTotalForm()
      })
    },
    setTotalForm() {
      let maxRowtotalCost
      this.comTableList.forEach((item) => {
        if (item.totalCost) {
          if (!maxRowtotalCost) {
            maxRowtotalCost = item.totalCost
          } else if (item.totalCost > maxRowtotalCost) {
            maxRowtotalCost = item.totalCost
          }
        }
      })
      this.$set(this.totalForm, 'subTotal', maxRowtotalCost)
      const { wastageRate, adminRate, markupRate } = this.totalForm
      const subTotal = this.totalForm.subTotal || 0
      /* 耗损金额 */
      if (wastageRate && subTotal) {
        this.$set(this.totalForm, 'wastageAmount', (subTotal * wastageRate) / 100)
      } else {
        this.$set(this.totalForm, 'wastageAmount', undefined)
      }
      /* 管理费 */
      if (adminRate && subTotal) {
        let amount = (((this.totalForm.wastageAmount || 0) + subTotal) * adminRate) / 100
        amount = this.$num(amount, 2)
        this.$set(this.totalForm, 'adminAmount', amount)
      } else {
        this.$set(this.totalForm, 'adminAmount', undefined)
      }
      /* 加成 */
      if (markupRate && subTotal) {
        let amount =
          (((this.totalForm.wastageAmount || 0) + (this.totalForm.adminAmount || 0) + subTotal) *
            markupRate) /
          100
        amount = this.$num(amount, 2)
        this.$set(this.totalForm, 'markupAmount', amount)
      } else {
        this.$set(this.totalForm, 'markupAmount', undefined)
      }
      const total =
        (this.totalForm.wastageAmount || 0) +
        (this.totalForm.adminAmount || 0) +
        (this.totalForm.markupAmount || 0) +
        subTotal
      if (this.totalForm.otherCosts && (this.totalForm.otherCosts || 0) + total < 0) {
        this.$set(this.totalForm, 'otherCosts', -total)
      }
      if (subTotal) {
        this.$set(this.totalForm, 'totalAmount', total + (this.totalForm.otherCosts || 0))
      } else {
        this.$set(this.totalForm, 'totalAmount', undefined)
      }
    },
    inputNumberChange(code) {
      this.$refs.totalFormRef.validateField(code)
    },
    changeTableList() {
      this.calculateAllRow()
      this.$nextTick(() => {
        const list = []
        this.comTableList.forEach((item) => {
          const child = item.variationMaterialList || []
          list.push(...child)
        })
        this.$$getColumnContentMaxWidth(this.columns, list)
      })
    },
    calculateProjectTemplate() {
      this.setTotalForm()
    },
    handleCalculate() {
      this.setTotalForm()
    },
    handleReQuote() {
      const ids = this.selectList.map((item) => item.variationMaterialId)
      this.$modal
        .confirm(this.$t('PRODUCT.reQuoteSubmit'))
        .then(() => {
          this.btnLoading = true
          return reQuote({ mixDesignId: this.formData.mixDesignId, variationMaterialIdList: ids })
        })
        .then(() => {
          this.btnLoading = false
          this.selectList = []
          this.$refs.tables.clearSelection()
          this.$modal.msgSuccess(this.$t('PRODUCT.reQuoteSubmitSuccess'))
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    handleSelectionChange(selection) {
      this.selectList = [...selection]
    },
    submit() {
      return this.$refs.totalFormRef.validate()
    }
  }
}
</script>

<style lang="scss" scoped></style>
