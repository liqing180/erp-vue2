<template>
  <div class="pb20">
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane name="1">
          <span slot="label">
            <span>{{ $t('PURCHASE.productDetail') }}</span>
            <span v-show="tableList.length" class="ml5">({{ tableList.length }})</span>
          </span>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label">
            <span>{{ $t('PURCHASE.attachmentInfo') }}</span>
            <span v-show="curFileList.length" class="ml5">({{ curFileList.length }})</span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <div v-show="activeName === '1'">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" v-if="!comDisFrom">
          <el-button
            @click="handleAddBtn"
            :disabled="!businessPartnerId || !warehouseId"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            >{{ $t('uiBtn.add') }}</el-button
          >
        </el-col>
        <el-col :span="1.5" v-if="false">
          <el-button
            :disabled="selected.length <= 0"
            @click="handleDelete"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            >{{ $t('uiBtn.delete') }}</el-button
          >
        </el-col>
        <right-toolbar
          :showSearchBtn="false"
          :showRefreshBtn="false"
          :saveKey="saveKey"
          :savePath="savePath"
          :columns="configColumn"
          :columnsInit="columns"
        ></right-toolbar>
      </el-row>
      <el-table
        :key="'tableKey' + modifyHighlight"
        border
        ref="tables"
        v-loading="loading"
        :row-class-name="tableRowClassName"
        :cell-class-name="tableCellClassName"
        :data="tableList"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
        v-table-tab
      >
        <el-table-column
          v-if="false"
          type="selection"
          key="selection"
          align="center"
          width="55"
        ></el-table-column>
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
          :min-width="getMinWidth(item)"
          :show-overflow-tooltip="item.tooltip"
          :fixed="item.fixed"
          :sortable="item.sortable"
          :align="item.align || 'left'"
          header-align="center"
        >
          <template slot="header" slot-scope="{ column }">
            <span
              v-if="
                [
                  'uom',
                  'uomCoefficient',
                  'consignedQty',
                  'consignedCost',
                  'consignedAmount',
                  'leadTime',
                  'committedDate'
                ].includes(item.prop)
              "
            >
              <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
            </span>
            <span v-else>{{ column.label }}</span>
          </template>
          <template slot-scope="scope">
            <template v-if="item.prop === 'externalPartNo'">
              <template v-if="!comDisFrom && scope.row.disExternalPartNo !== '1'">
                <el-input
                  style="width: 98%"
                  :title="scope.row.externalPartNo"
                  v-model="scope.row.externalPartNo"
                  :maxlength="200"
                  @input="externalPartNoChange(scope.row)"
                />
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>

              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
            <template v-else-if="item.prop === 'consignedQty'">
              <template v-if="!comDisFrom">
                <el-input-number
                  v-thousandSplit="{ precision: scope.row.decimalNum }"
                  style="width: 98%"
                  v-model="scope.row.consignedQty"
                  controls-position="right"
                  :precision="scope.row.decimalNum"
                  :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                  :max="999999"
                  @change="consignedQtyChange(scope.row)"
                />
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>
              <template v-else>{{
                $numberStr(scope.row[item.prop], scope.row.decimalNum)
              }}</template>
            </template>

            <template v-else-if="item.prop === 'stockInQty'">
              <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
            </template>
            <template v-else-if="item.prop === 'qcFailedQty'">
              <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
            </template>

            <template v-else-if="item.prop === 'consignedCost'">
              <template v-if="!comDisFrom">
                <el-input-number
                  v-thousandSplit="{ precision: 2 }"
                  style="width: 98%"
                  v-model="scope.row.consignedCost"
                  controls-position="right"
                  :precision="2"
                  :min="0.01"
                  :max="999999999999.99"
                  @change="consignedCostChange(scope.row)"
                />
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>
              <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
            </template>

            <template v-else-if="item.prop === 'consignedAmount'">
              <template v-if="!comDisFrom">
                <el-input-number
                  v-thousandSplit="{ precision: 2 }"
                  style="width: 98%"
                  v-model="scope.row.consignedAmount"
                  controls-position="right"
                  :precision="2"
                  :min="0.01"
                  :max="999999999999.99"
                  @change="consignedAmountChange(scope.row)"
                />
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>
              <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
            </template>

            <template v-else-if="item.prop === 'lineTotal'">
              <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
            </template>

            <template v-else-if="item.prop === 'leadTime'">
              <template v-if="!comDisFrom">
                <el-input-number
                  v-thousandSplit="{ precision: 0 }"
                  style="width: 98%"
                  v-model="scope.row.leadTime"
                  controls-position="right"
                  :precision="0"
                  :min="1"
                  :max="999"
                  @change="leadTimeChange(scope.row)"
                />
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>

              <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
            </template>
            <template v-else-if="item.prop === 'warranty'">
              <template v-if="!comDisFrom">
                <el-input-number
                  v-thousandSplit="{ precision: 0 }"
                  style="width: 98%"
                  v-model="scope.row.warranty"
                  controls-position="right"
                  :precision="0"
                  :min="1"
                  :max="9999"
                  @change="warrantyChange(scope.row)"
                />
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>

              <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
            </template>
            <template v-else-if="item.prop === 'committedDate'">
              <template v-if="!comDisFrom">
                <el-date-picker
                  v-model="scope.row.committedDate"
                  :picker-options="timeDatePickerOptions"
                  @change="changeCommittedDate(scope.$index, scope.row)"
                  :format="fmtForYmd"
                  value-format="timestamp"
                  style="width: 98%"
                  placeholder=""
                  clearable
                ></el-date-picker>
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>

              <template v-else>{{ parseTime(scope.row[item.prop], fmtForYmd) }}</template>
            </template>
            <template v-else-if="item.prop === 'remarks'">
              <descriptionEditDlg
                v-model="scope.row.remarks"
                :maxlength="200"
                :disabled="comDisFrom"
              />
            </template>
            <template v-else-if="item.prop === 'uom'">
              <template v-if="!comDisFrom">
                <el-select
                  style="width: 98%"
                  v-model="scope.row.uom"
                  :title="showUomLabel(scope.row[item.prop])"
                  @change="purchaseUomChange(scope.row)"
                  placeholder=""
                  filterable
                >
                  <el-option
                    v-for="item in scope.row.uomDataList || []"
                    :key="item.uomName"
                    :label="item.uomName"
                    :value="item.uomName"
                  >
                  </el-option>
                </el-select>
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>

              <span v-else :title="showUomLabel(scope.row[item.prop])">{{
                scope.row[item.prop]
              }}</span>
            </template>
            <template v-else-if="item.prop === 'uomCoefficient'">
              <div class="flex" style="width: 98%">
                <el-input-number
                  class="flex-1"
                  :disabled="comDisFrom || scope.row.uom === scope.row.basicUom"
                  v-model="scope.row.uomCoefficient"
                  controls-position="right"
                  v-thousandSplit="{ precision: 0 }"
                  :precision="0"
                  :min="1"
                  :max="99999"
                  @change="uomCoefficientChange(scope.row)"
                />
                <span class="fs-0 ml10" :title="showUomLabel(scope.row.basicUom)">{{
                  scope.row.basicUom
                }}</span>
              </div>
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>
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
          v-if="!comDisFrom"
        >
          <template slot-scope="scope">
            <div class="flexCen">
              <i
                v-if="!comDisFrom"
                class="el-icon-delete pointer"
                style="font-size: 20px; color: #f56c6c"
                :title="$t('uiBtn.delete')"
                @click="handleDelRow(scope.$index, scope.row)"
              ></i>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-form ref="totalForm" class="mt20" :model="totalForm" :rules="{}" label-width="140px">
        <div class="flex">
          <div class="flex-1">
            <el-form-item
              :label="`${$t('ui.remarks')}`"
              prop="totalRemarks"
              :class="[isModified('totalRemarks')]"
            >
              <MyInput
                v-model="totalForm.totalRemarks"
                :maxlength="3000"
                type="textarea"
                :autosize="{ minRows: 10, maxRows: 10 }"
                :disabled="comDisFrom"
                show-word-limit
                resize="none"
              >
              </MyInput>
            </el-form-item>
          </div>
          <div style="width: 40%; max-width: 600px; margin-right: 0px">
            <el-form-item
              :label="`${$t('PURCHASE.subTotal')}`"
              prop="subTotal"
              :class="[isModified('subTotal')]"
            >
              <el-input :value="$numberStr(totalForm.subTotal, 2)" disabled></el-input>
            </el-form-item>
            <el-form-item
              :label="`${$t('PURCHASE.totalFreight')}`"
              prop="totalFreight"
              :class="[isModified('totalFreight')]"
            >
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                v-if="!comDisFrom"
                style="width: 100%"
                v-model="totalForm.totalFreight"
                controls-position="right"
                :precision="2"
                :min="0"
                :max="999999999999.99"
                @input="totalDiscountChange"
              />
              <el-input v-else :value="$numberStr(totalForm.totalFreight, 2)" disabled></el-input>
            </el-form-item>
            <el-form-item
              :label="`${$t('PURCHASE.taxAmount')}`"
              prop="totalTaxAmount"
              :class="[isModified('totalTaxAmount')]"
            >
              <el-input :value="$numberStr(totalForm.totalTaxAmount, 2)" disabled></el-input>
            </el-form-item>
            <!-- <el-form-item
              :label="`${$t('PURCHASE.totalDiscount')}`"
              prop="totalDiscount"
              :class="[isModified('totalDiscount')]"
            >
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                v-if="!comDisFrom"
                style="width: 100%"
                v-model="totalForm.totalDiscount"
                controls-position="right"
                :precision="2"
                :min="0"
                :max="999999999"
                @input="totalDiscountChange"
              />
              <el-input v-else :value="$numberStr(totalForm.totalDiscount, 2)" disabled></el-input>
            </el-form-item> -->
            <el-form-item
              :label="`${$t('PURCHASE.totalAmount')}`"
              prop="totalAmount"
              :class="[isModified('totalAmount')]"
            >
              <div class="input-switch-box">
                <div class="con-left">
                  <el-input :value="$numberStr(totalForm.totalAmount, 2)" disabled></el-input>
                </div>
                <!-- <div class="con-right" v-if="!comDisFrom">
                  <svg-icon
                    @click="handleCalculate"
                    icon-class="jisuanqi"
                    style="height: 36px; width: 36px; cursor: pointer"
                  />
                </div> -->
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div v-show="activeName === '2'">
      <myUpload
        ref="uploadRef"
        :disabled="comDisFrom"
        :modifyHighlight="modifyHighlight"
        :updateFileList="updateFileList"
        :fomType="'Purchase Order'"
        :limit="9"
      />
    </div>

    <selectProductTable
      :businessPartnerId="businessPartnerId"
      :warehouseId="warehouseId"
      ref="selectProductTable"
      @onSuccess="updateTable"
    />

    <popover-svc
      ref="pop1"
      trigger="hover"
      placement="top"
      :close-delay="0"
      :visible-arrow="true"
      popper-class="pop-warp"
      :offset="-30"
    >
      <div @mouseenter="mouseenterCur($event)" class="pop-box">
        <el-table :data="popoverData.purchaseRequisiteList || []" border>
          <el-table-column
            :label="$t('PURCHASE.PRNo')"
            width="160"
            align="center"
            prop="PRNo"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="primary-link" @click="navToPR(scope.row)">{{
                scope.row.purchaseRequisiteNo
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('PURCHASE.department')"
            width="160"
            align="center"
            prop="departmentName"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.departmentName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('ui.status')"
            width="160"
            align="center"
            prop="purchaseRequisiteStatusShowStr"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
      </div>
    </popover-svc>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from './components/selectProductTable.vue'
import { calculate } from '@/api/purchaseManagement/consignmentOrder'
import { Popover } from 'element-ui'
const popoverSvc = {
  extends: Popover,
  methods: {
    popBy(el) {
      // 先隐藏并销毁之前显示的
      this.close()
      this.doDestroy(true)
      this.$nextTick(() => {
        // 显示新的
        this.referenceElm = this.$refs.reference = el
        this.showPopper = true
        this.$emit('input', true)
      })
    },
    close() {
      this.showPopper = false
      this.$emit('input', false)
    }
  }
}
export default {
  mixins: [pageMixin],
  dicts: ['tax_type'],
  components: {
    selectProductTable,
    popoverSvc
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },

    comDisFrom: {
      type: Boolean,
      default: false
    },
    productList: {
      type: Array,
      default() {
        return []
      }
    },
    initCommonFileList: {
      type: Array,
      default() {
        return []
      }
    },
    countryId: {
      type: String,
      default: ''
    },
    businessPartnerId: {
      type: String,
      default: ''
    },
    warehouseId: {
      type: String,
      default: ''
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    basicUpdateProps: {
      type: Array,
      default() {
        return []
      }
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.totalForm = newValue || {}
      }
    },
    productList: {
      immediate: true,
      handler: function (selected) {
        this.tableList = JSON.parse(JSON.stringify(this.productList))

        this.changeTableList()
        this.removeUnrelatedAttachments([])
      }
    },
    initCommonFileList: {
      immediate: true,
      handler: function () {
        this.initFileList(this.initCommonFileList)
      }
    },
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '10',
      savePath: 'consignmentOrderTable',
      activeName: '1',
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          fixed: true,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
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
        //   label: vm.$t('PURCHASE.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'brand',
          label: vm.$t('PURCHASE.brand'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'externalPartNo',
          label: vm.$t('PURCHASE.externalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('ui.uom'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'uomCoefficient',
          label: vm.$t('PURCHASE.ratio'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },

        {
          prop: 'consignedQty',
          label: vm.$t('PURCHASE.consignedQty'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'stockInQty',
          label: vm.$t('PURCHASE.stockInQty'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qcFailedQty',
          label: vm.$t('PURCHASE.qcFailedQty'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },

        {
          prop: 'consignedCost',
          label: vm.$t('PURCHASE.consignedCost'),
          visible: true,
          minWidth: 180,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'consignedAmount',
          label: vm.$t('PURCHASE.consignedAmount'),
          visible: true,
          minWidth: 180,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('PURCHASE.lineTotal'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },

        /* {
          prop: 'leadTime',
          label: vm.$t('PURCHASE.leadTimeDays'),
          visible: true,
          minWidth: 140,
          tooltip: true
        }, */
        {
          prop: 'warranty',
          label: vm.$t('PURCHASE.warrantyDays'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        /*  {
          prop: 'committedDate',
          label: vm.$t('PURCHASE.committedDate'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }, */
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
      ],
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      totalForm: {},
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'productId',
      popoverData: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: []
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    stockInAuth() {
      return this.checkPermi(['purchaseManagement:consignmentOrder:stockIn']) && !this.isView
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    initFileList(FileList) {
      const maxAttempts = 10 // 最大尝试次数
      const interval = 200 // 每次尝试的间隔时间（毫秒）
      let attempts = 0
      const retry = () => {
        if (attempts < maxAttempts) {
          attempts++
          setTimeout(() => {
            if (this.$refs.uploadRef) {
              this.$refs.uploadRef.initFileList(FileList)
            } else {
              retry()
            }
          }, interval)
        } else {
          console.log('无法获取组件')
        }
      }
      retry()
    },
    getFileIds() {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return false
      }
      return myFileIds
    },
    updateFileList(list) {
      this.curFileList = list
    },
    /* 删除无关联文件, 新增新的合并文件 */
    removeUnrelatedAttachments(mergeFileList) {
      if (!this.$refs.uploadRef) return
      const list = this.$refs.uploadRef.getFileList()
      /* 所有关联单据的ID */
      const allLineIds = []
      this.tableList.forEach((item) => {
        if (item.documentId) {
          allLineIds.push(item.documentId)
        }
        const purchaseRequisiteList = item.purchaseRequisiteList || []
        purchaseRequisiteList.forEach((prItem) => {
          allLineIds.push(prItem.purchaseRequisiteId)
        })
      })
      // 获取有关联PR PQ PC的附件
      const fromList = list.filter((item) => item.fromId)
      // 获取失去关联的文件
      const delFiles = fromList.filter((item) => !allLineIds.includes(item.fromId))
      delFiles.forEach((item) => {
        this.$refs.uploadRef.delFile(item)
      })
      /* 新增新的文件 */
      const allFromIds = fromList.map((item) => item.fromId)
      mergeFileList.forEach((item) => {
        if (!allFromIds.includes(item.fromId)) {
          this.$refs.uploadRef.addFileForUnshift(item)
        }
      })
      /* const item = {
        createTime: 1685771623000,
        fromId: '1685771623000',
        fromType: 'PR',
        creator: '1',
        creatorName: 'admin',
        fileExtension: '.xlsx',
        fileName: 'RFQ_1684833480637 (1).xlsx',
        id: '9663179842912256',
        size: '4975',
        url: 'http://bts-erp.oss-cn-shenzhen.aliyuncs.com/bqt/20230603/ed8e90842fde488bb9d90658b25feb19.xlsx'
      } */
      // this.$refs.uploadRef.addFileForUnshift(item)
    },
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'externalPartNo':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'uom':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'uomCoefficient':
            item.fixedWidth = vm.comDisFrom ? 200 : 200
            break

          case 'consignedQty':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'consignedCost':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'consignedAmount':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'leadTime':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'warranty':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'committedDate':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'lineTotal':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    errorMessage(code) {
      this.$emit('scrollPageToTable')

      // this.tableList.forEach((item) => {
      //   if (!this.$resultOfBoolean(item[code])) {
      //     this.$set(item, code + 'Error', true)
      //   }
      // })
      let rowIndex
      this.tableList.forEach((item, index) => {
        if (code && !this.$resultOfBoolean(item[code])) {
          this.$set(item, 'ROW-ERROR', true)
          this.$set(item, code + 'Error', true)
          if (!this.$resultOfBoolean(rowIndex)) {
            rowIndex = index
          }
        } else {
          this.$set(item, 'ROW-ERROR', false)
          if (code) {
            this.$set(item, code + 'Error', false)
          } else {
            Object.keys(item).forEach((key) => {
              if (key.endsWith('Error')) {
                this.$set(item, key, false)
              }
            })
          }
        }
      })
      this.$nextTick(() => {
        this.scrollToErrorColumn()
      })
    },
    initList(list) {
      this.tableList = JSON.parse(JSON.stringify(list))
    },
    getList() {
      return this.tableList
    },
    externalPartNoChange(row) {
      this.$set(row, 'externalPartNoError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    consignedQtyChange(row) {
      this.$set(row, 'consignedQtyError', false)
      this.$set(row, 'ROW-ERROR', false)

      this.getLineTotal(row)
    },
    leadTimeChange(row) {
      this.$set(row, 'leadTimeError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    warrantyChange(row) {
      this.$set(row, 'warrantyError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    consignedCostChange(row) {
      this.$set(row, 'consignedCostError', false)
      this.$set(row, 'ROW-ERROR', false)

      this.getLineTotal(row)
    },
    consignedAmountChange(row) {
      this.$set(row, 'consignedAmountError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    uomCoefficientChange(row) {
      this.$set(row, 'uomCoefficientError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    purchaseUomChange(row) {
      this.$set(row, 'uomError', false)
      this.$set(row, 'ROW-ERROR', false)

      const selectItem = row.uomDataList.find((item) => item.uomName === row.uom)
      this.$set(row, 'uomCoefficient', selectItem.uomCoefficient)
      if (row.uom === row.basicUom) {
        this.$set(row, 'uomCoefficient', 1)
      }
      // this.getLineTotal(row)
    },
    getLineTotal(row) {
      this.$nextTick(() => {
        if (this.$resultOfBoolean(row.consignedQty) && this.$resultOfBoolean(row.consignedCost)) {
          const lineTotal = row.consignedQty * row.consignedCost
          this.$set(row, 'lineTotal', lineTotal)
        } else {
          this.$set(row, 'lineTotal', undefined)
        }
      })
      this.handleCalculate()
    },

    changeCommittedDate(index, row) {
      if (row) {
        this.$set(row, 'committedDateError', false)
        this.$set(row, 'ROW-ERROR', false)
      }
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.committedDate) {
          const oldCommittedDate = this.tableList.find(
            (item, index) => index > 0 && item.committedDate
          )
          if (oldCommittedDate) {
            const msg = this.parseTime(topRow.committedDate, this.fmtForYmd)
            this.$modal
              .confirm(this.$t('PURCHASE.committedDateConfirm').replace('$1', msg))
              .then(() => {
                this.$set(this.totalForm, 'committedDate', topRow.committedDate)
                this.tableList.forEach((row) => {
                  this.$set(row, 'committedDate', topRow.committedDate)
                })
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'committedDate', topRow.committedDate)
            })
          }
        }
      }
      // const committedDateList = this.tableList.map((item) => item.committedDate || 0)
      // const max = Math.max(0, ...committedDateList)
      // if (max > 0) {
      //   this.$set(this.totalForm, 'committedDate', max)
      // } else {
      //   if (this.tableList.length > 0) {
      //     this.$set(this.totalForm, 'committedDate', Date.now())
      //   } else {
      //     this.$set(this.totalForm, 'committedDate', undefined)
      //   }
      // }
      /* const max = this.tableList.find(
        item.committedDate
      ) */
    },
    handleAddBtn() {
      this.$refs.selectProductTable.handleAdd(this.tableList)
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        this.tableList = [...this.tableList, ...rows]
        this.changeTableList()
        this.$nextTick(() => {
          this.selected.forEach((row) => {
            this.tableList.forEach((item) => {
              if (row[this.rowIdKey] === item[this.rowIdKey]) {
                this.$refs.tables.toggleRowSelection(item, true)
              }
            })
          })
        })
        // this.initDraggable()
      }
    },
    changeTableList() {
      this.$emit('updateTable', this.tableList)
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 选中多个删除
    handleDelete() {
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          this.tableList = this.tableList.filter((row) => {
            if (this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])) {
              return false
            }
            return true
          })
          this.changeTableList()
          this.selected = []
          this.clearSuppliersList()
        })
        .catch(() => {})
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.removeUnrelatedAttachments([])
        this.changeCommittedDate()
      })
    },
    deleteRow(row) {
      const index = this.tableList.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (index !== -1) {
        this.tableList.splice(index, 1)
        this.removeUnrelatedAttachments([])
      }
    },

    // 表格全选
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selected.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selected.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[this.rowIdKey])
        vm.selected = vm.selected.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    // 行单个选择
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selected.length; i++) {
        if (vm.selected[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selected.splice(i, 1)
        }
      }
      vm.selected.push(row)
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        }
        if (row.updateType === '3') {
          color = 'cancel-row'
        }
      }
      const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'table-SelectedRow-bgcolor'
      }
      if (row['ROW-ERROR']) {
        color = 'required-row'
      }
      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (this.modifyHighlight) {
        if (row.updateType === '1') {
          if ((row.updateMsgList || []).find((item) => item.name === column.property)) {
            cellClass = 'edit-table-cell'
          }
        }
      }
      if (
        this.tableList.find((item) => !item[column.property] && item[column.property + 'Error'])
      ) {
        cellClass = 'is-required-table-cell'
      }
      return cellClass
    },

    totalDiscountChange() {
      this.handleCalculate()
    },
    handleCalculate() {
      const params = {
        ...this.totalForm,
        consignmentOrderDetailList: this.tableList
      }
      const timer = Date.now()
      this.queryTotalTime = timer
      calculate(params).then((res) => {
        if (this.queryTotalTime === timer) {
          const data = res.data || {}
          this.$set(this.totalForm, 'subTotal', data.subTotal)
          this.$set(this.totalForm, 'totalFreight', data.totalFreight)
          this.$set(this.totalForm, 'totalTaxAmount', data.totalTaxAmount)
          this.$set(this.totalForm, 'totalAmount', data.totalAmount)
        }
      })
    },

    showPop(e, obj) {
      this.$set(this.popoverData, 'purchaseRequisiteList', obj.purchaseRequisiteList || [])

      this.$set(this.popoverData, 'hide', false)
      this.$refs.pop1.popBy(e.target)
    },
    hidePop(e, obj) {
      if (this.popoverData) {
        this.popoverData.hide = true
      }
      setTimeout(() => {
        this.popoverData.hide && this.$refs.pop1.close()
      }, 300)
    },
    mouseenterCur() {
      if (this.popoverData) {
        this.popoverData.hide = false
      }
    },
    navToPR(row) {
      this.hidePop()
      this.$router.push({
        path: '/purchaseManagement/viewPurchaseRequisition',
        query: {
          id: row.purchaseRequisiteId,
          timeId: Date.now()
        }
      })
    },

    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-box {
  max-width: 600px;
  max-height: 60vh;
  overflow-y: auto;
  // padding: 12px;
  box-sizing: border-box;
  background-color: #333;
  div {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
