<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button
        type="primary"
        v-if="!comDisFrom"
        size="mini"
        :disabled="submitLoading"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <div class="form-card">
          <el-collapse-item name="1">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('ui.basicInfo')"
              :warning="collapseWarningForBasicInfo"
            >
            </FormCollapseItemTitle>
            <el-form
              ref="createForm"
              :model="createForm"
              :rules="createRules"
              label-width="180px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.salesOrganization')}`" prop="departmentId">
                    <CommonSelect
                      :id="createForm.departmentId"
                      :label="createForm.departmentName"
                      :title="createForm.allSuperiorName"
                      idKey="departmentId"
                      labelKey="departmentName"
                      :options="deptOptions"
                      @change="departmentChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.createdBy')}`">
                    <el-input :value="createForm.createdBy" disabled class="form-wd"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.createdTime')}`">
                    <el-date-picker
                      :value="createForm.createdTime"
                      :editable="false"
                      disabled
                      type="date"
                      :format="fmtForYmdhms"
                      :style="{ width: '100%' }"
                      placeholder
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.reason')">
                    <MyInput
                      type="textarea"
                      v-model="createForm.remarks"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
        <div class="form-card mt10">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('SALES.productInfo')"
              :warning="collapseWarningForPriceList"
            >
            </FormCollapseItemTitle>
            <el-row :gutter="10" class="mb8" v-if="!comDisFrom">
              <el-col :span="1.5">
                <el-button type="primary" size="mini" @click="handleAddBtn">{{
                  $t('uiBtn.add')
                }}</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  icon="el-icon-upload2"
                  size="mini"
                  @click="handleImport"
                  v-hasPermi="['salesManagement:salesPriceStrategy:import']"
                  >{{ $t('uiBtn.import') }}</el-button
                >
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="priceTableList.length <= 0"
                  @click="handleSetPricingInBulk"
                  >{{ $t('SALES.setPricingInBulk') }}</el-button
                >
              </el-col>
              <right-toolbar
                :saveKey="saveKey"
                :showRefreshBtn="false"
                :columns="configColumn"
                :columnsInit="columns"
              ></right-toolbar>
            </el-row>
            <el-table
              border
              ref="tables"
              :key="'a' + tableKey"
              class="mb20"
              :data="priceTableList"
              v-table-tab
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
                <template slot="header" slot-scope="{ column }">
                  <span
                    v-if="['salesUom', 'salesPartNo', 'unitPrice', 'priceType'].includes(item.prop)"
                  >
                    <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                  </span>
                  <span v-else-if="['competitorPriceMax'].includes(item.prop)">
                    {{ column.label }}
                    <svg-icon icon-class="up1" />
                  </span>
                  <span v-else-if="['competitorPriceMin'].includes(item.prop)">
                    {{ column.label }}
                    <svg-icon icon-class="down1" />
                  </span>
                  <span v-else>{{ column.label }}</span>
                </template>
                <template slot-scope="scope">
                  <template v-if="item.prop === 'salesUom'">
                    <!-- <el-select
                      v-if="!comDisFrom && scope.row.isApproved !== '1'"
                      style="width: 98%"
                      v-model="scope.row.salesUom"
                      :title="showUomLabel(scope.row.salesUom)"
                      placeholder=""
                      @change="salesUomChange(scope.row)"
                    >
                      <el-option
                        v-for="item in scope.row.uomList || []"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select> -->
                    <span :title="showUomLabel(scope.row.salesUom)">{{
                      scope.row[item.prop]
                    }}</span>
                  </template>
                  <template v-else-if="item.prop === 'salesPartNo'">
                    <div v-if="!comDisFrom && scope.row.isApproved !== '1'">
                      <CommonSelect
                        :filterable="true"
                        style="width: 98%"
                        :id="scope.row.salesPartNo"
                        :label="scope.row.salesPartNo"
                        idKey="salesPartNo"
                        labelKey="salesPartNo"
                        :loading="scope.row.checklistItemLoading"
                        :options="scope.row.canSelectSalesPartNoOptions"
                        @visible-change="salesPartNoItemVisible($event, scope.row, scope.$index)"
                        @change="salesPartNoChange($event, scope.row)"
                      />
                    </div>
                    <template v-else>{{ scope.row[item.prop] }}</template>
                  </template>

                  <template v-else-if="item.prop === 'unitPrice'">
                    <el-input-number
                      v-thousandSplit="{ precision: 2 }"
                      v-if="!comDisFrom"
                      style="width: 98%"
                      v-model="scope.row.unitPrice"
                      controls-position="right"
                      :precision="2"
                      :min="0.01"
                      :max="999999999999.99"
                    />
                    <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
                  </template>

                  <template v-else-if="item.prop === 'remarks'">
                    <descriptionEditDlg
                      style="width: 100%"
                      v-model="scope.row.remarks"
                      :maxlength="200"
                      :disabled="comDisFrom"
                    />
                  </template>
                  <template v-else-if="item.prop === 'competitorPriceMax'">{{
                    $numberStr(scope.row[item.prop], 2)
                  }}</template>
                  <template v-else-if="item.prop === 'competitorPriceMin'">{{
                    $numberStr(scope.row[item.prop], 2)
                  }}</template>
                  <template v-else-if="item.prop === 'recommendedRetailPrice'">{{
                    $numberStr(scope.row[item.prop], 2)
                  }}</template>
                  <template v-else-if="item.prop === 'salesRetailPrice'">{{
                    $numberStr(scope.row[item.prop], 2)
                  }}</template>
                  <template v-else-if="item.prop === 'priceType'">
                    <!-- {{ selectDictLabel(dict.type.s_price_type, scope.row.priceType) }} -->

                    <el-select
                      v-if="!comDisFrom && scope.row.isApproved !== '1'"
                      style="width: 98%"
                      v-model="scope.row.priceType"
                      placeholder=""
                      @change="priceTypeChange($event, scope.row, scope.$index)"
                    >
                      <el-option
                        v-for="dict in priceTypeList || []"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      >
                      </el-option>
                    </el-select>

                    <span v-else>
                      {{ selectDictLabel(priceTypeList, scope.row.priceType) }}
                    </span>
                  </template>
                  <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!comDisFrom"
                :label="$t('ui.action')"
                key="action"
                align="center"
                width="100"
                class-name="small-padding fixed-width"
                fixed="right"
              >
                <template slot-scope="scope">
                  <div class="flexCen">
                    <i
                      class="el-icon el-icon-delete pointer"
                      style="font-size: 20px; color: #f56c6c"
                      :title="$t('uiBtn.delete')"
                      v-if="scope.row.isApproved !== '1'"
                      @click.stop="delCheckRow(scope.$index)"
                    ></i>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>

    <selectProductTable ref="selectProductTable" @onSuccess="updateTable" />
    <setPricingBulk ref="setPricingBulk" @onSuccess="setPricingInBulkSuccess" />
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="importSuccess" />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

import { queryUserDepartment } from '@/api/system/user'
import selectProductTable from './selectProductTable.vue'
import setPricingBulk from './setPricingBulk.vue'

import {
  saveSalesPriceList,
  queryProductSalesPriceList
} from '@/api/salesManagement/salesPriceStrategy'
export default {
  mixins: [pageMixin],
  dicts: ['s_sales_price_strategy_status', 's_price_type'],
  components: { selectProductTable, setPricingBulk },
  props: {
    propTimeId: {
      type: String,
      default: ''
    },
    propRowId: {
      type: String,
      default: ''
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vm = this
    return {
      tableKey: Date.now(),
      saveKey: '39',
      activeNames: [],
      timeId: '',
      submitLoading: false,
      createForm: {},
      collapseWarningForBasicInfo: false,
      createRules: {
        departmentId: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        salesUom: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },

      // 导入
      importOptions: {
        // 下载模板
        downFileUrl: '/sales/salesPriceStrategy/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/sales/salesPriceStrategy/checkImportData',
        // 提交导入
        importUrl: '/sales/salesPriceStrategy/importData',
        // 下载文件名
        fileName: 'Sales Price List'
      },

      priceTableList: [],
      salesPartNoOptions: [],
      collapseWarningForPriceList: false,

      buttonAuthMsg: {
        isCanApproved: '0',
        isCanWithdraw: '0',
        isCanUpdate: '0'
      },
      deptOptions: [],

      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'priceType',
          label: vm.$t('SALES.priceType'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'salesUom',
          label: vm.$t('SALES.pricingUnit'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'salesPartNo',
          label: vm.$t('SALES.salesPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },

        {
          prop: 'competitorPriceMax',
          label: vm.$t('SALES.competitorPricing'),
          visible: true,
          width: 160,
          tooltip: true
        },
        {
          prop: 'competitorPriceMin',
          label: vm.$t('SALES.competitorPricing'),
          visible: true,
          width: 160,
          tooltip: true
        },
        {
          prop: 'recommendedRetailPrice',
          label: vm.$t('SALES.recommendedRetailPrice'),
          visible: true,
          minWidth: 200,
          padding: 50,
          tooltip: true
        },
        {
          prop: 'salesRetailPrice',
          label: vm.$t('SALES.RRP'),
          visible: true,
          minWidth: 200,
          padding: 50,
          tooltip: true
        },

        {
          prop: 'unitPrice',
          label: vm.$t('SALES.discountedPrice'),
          visible: true,
          minWidth: 200,
          padding: 50,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
      ],
      priceTypeList: []
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.handleAdd()
      }
    },
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
        this.$nextTick((res) => {
          this.tableKey = Date.now()
        })
      }
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    addAuth() {
      return this.checkPermi(['salesManagement:salesPriceStrategy:add'])
    },
    comDisFrom() {
      return !this.addAuth
    }
  },

  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  activated() {},
  methods: {
    async handleAdd() {
      this.reset()
      this.queryUserDepartment()
      this.getDict()
    },
    getDict() {
      this.MyDictDataClass.getDictFn('s_price_type').then((res) => {
        console.log(res, '====523')
        this.priceTypeList = res || []
      })
    },
    reset() {
      this.createForm = {
        checklistTemplateName: undefined,
        remarks: undefined,
        createdBy: this.$store.state.user.nickName
      }
      this.priceTableList = []
      this.collapseWarningForBasicInfo = false
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('createForm')
    },

    queryUserDepartment() {
      queryUserDepartment({}).then((res) => {
        this.deptOptions = res.data || []
        this.deptOptions.forEach((item) => {
          if (item.isDefault === '1' && !this.createForm.departmentId) {
            this.$set(this.createForm, 'departmentId', item.departmentId)
            this.$set(this.createForm, 'departmentName', item.departmentName)
            this.$set(this.createForm, 'allSuperiorName', item.allSuperiorName)
          }
        })
      })
    },
    departmentChange(item) {
      this.$set(this.createForm, 'departmentId', item.departmentId)
      this.$set(this.createForm, 'departmentName', item.departmentName)
      this.$set(this.createForm, 'allSuperiorName', item.allSuperiorName)
    },

    handleSetPricingInBulk() {
      this.$refs.setPricingBulk.handleOpen()
    },
    setPricingInBulkSuccess(percentage) {
      this.priceTableList.forEach((item) => {
        if (item.salesRetailPrice) {
          item.unitPrice = this.$num((item.salesRetailPrice * percentage) / 100, 2)
        }
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
    },
    importSuccess(res) {
      const data = res.data || []
      const newList = []
      data.forEach((newRow) => {
        let isNew = true
        this.priceTableList.forEach((row, index) => {
          if (row.productId === newRow.productId) {
            if (row.salesPartNo === newRow.salesPartNo) {
              this.priceTableList.splice(index, 1, newRow)
              isNew = false
            } else {
              this.$set(row, 'salesUom', newRow.salesUom)
            }
          }
        })
        if (isNew) {
          newList.push(newRow)
        }
      })
      this.priceTableList.push(...newList)
      this.changeTableList()
    },

    handleAddBtn() {
      // const priceTableList = JSON.parse(JSON.stringify(this.priceTableList))
      this.$refs.selectProductTable.handleAdd()
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        rows.forEach((item) => {
          item.salesInquiryProductType = '1'
          // item.priceType = '2'
          item.priceType = undefined
          item.remarks = ''
          const findItem = this.priceTableList.find((row) => row.productId === item.productId)
          if (findItem) {
            this.$set(item, 'salesUom', findItem.salesUom)
            this.$set(item, 'queryTimeId', findItem.queryTimeId)
            this.$set(item, 'competitorPriceMax', findItem.competitorPriceMax)
            this.$set(item, 'competitorPriceMin', findItem.competitorPriceMin)
            this.$set(item, 'recommendedRetailPrice', findItem.recommendedRetailPrice)
            this.$set(item, 'salesRetailPrice', findItem.salesRetailPrice)
          }
        })
        this.priceTableList.push(...rows)
        this.changeTableList()
      }
    },
    delCheckRow(index) {
      this.priceTableList.splice(index, 1)
      this.changeTableList()
    },
    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.priceTableList)
      })
    },
    // 价格类型
    priceTypeChange(e, row, rowIndex) {
      this.$set(row, 'priceType', e)
      const { salesPartNo } = row
      if (e && !!salesPartNo) {
        this.priceTableList.forEach((item, index) => {
          if (row.productId === item.productId && rowIndex !== index) {
            if (item.priceType && item.priceType === e && salesPartNo === item.salesPartNo) {
              this.$set(row, 'salesPartNo', undefined)
            }
          }
        })
      }
      this.salesPartNoItemVisible(true, row)
    },
    salesPartNoItemVisible(visible, row, rowIndex) {
      if (visible) {
        // const salesPartNoSelectCount = {}
        // this.priceTableList.forEach((item, index) => {
        //   if (item.salesPartNo) {
        //     if (salesPartNoSelectCount[item.salesPartNo] === undefined) {
        //       salesPartNoSelectCount[item.salesPartNo] = 1
        //     } else {
        //       salesPartNoSelectCount[item.salesPartNo] += 1
        //     }
        //   }
        // })
        // const salesPartNoOptions = row.ivtProductExpansionSalesList || []
        // const list = salesPartNoOptions.filter((item) => {
        //   const num = salesPartNoSelectCount[item.salesPartNo] || 0
        //   return num <= 0 || item.salesPartNo === row.salesPartNo
        // })
        // this.$set(row, 'canSelectSalesPartNoOptions', list)

        const salesPartNoSelectCount = {}
        this.priceTableList.forEach((item, index) => {
          if (item.salesPartNo && item.priceType) {
            if (salesPartNoSelectCount[item.priceType + '-' + item.salesPartNo] === undefined) {
              salesPartNoSelectCount[item.priceType + '-' + item.salesPartNo] = 1
            } else {
              salesPartNoSelectCount[item.priceType + '-' + item.salesPartNo] += 1
            }
          }
        })
        const salesPartNoOptions = row.ivtProductExpansionSalesList || []
        const list = salesPartNoOptions.filter((item) => {
          const num = salesPartNoSelectCount[row.priceType + '-' + item.salesPartNo] || 0
          return num <= 0 || item.salesPartNo === row.salesPartNo
        })
        this.$set(row, 'canSelectSalesPartNoOptions', list)
      } else {
        this.$set(row, 'canSelectSalesPartNoOptions', [])
      }
    },
    salesPartNoChange(select, row) {
      this.$set(row, 'salesPartNo', select.salesPartNo)
      this.$set(row, 'salesPartId', select.salesPartId)
      this.$set(row, 'salesRetailPrice', select.salesRetailPrice)
    },
    salesUomChange(row) {
      const queryTimeId = Date.now()
      const salesUom = row.salesUom
      row.queryTimeId = queryTimeId

      this.priceTableList.forEach((item) => {
        if (item.productId === row.productId) {
          this.$set(item, 'salesUom', salesUom)
          this.$set(item, 'queryTimeId', queryTimeId)
        }
      })
      queryProductSalesPriceList([row]).then((res) => {
        const data = res.data || []
        const newRow = data[0]
        this.priceTableList.forEach((item) => {
          if (item.productId === row.productId && row.queryTimeId === queryTimeId) {
            this.$set(item, 'competitorPriceMax', newRow.competitorPriceMax)
            this.$set(item, 'competitorPriceMin', newRow.competitorPriceMin)
            this.$set(item, 'recommendedRetailPrice', newRow.recommendedRetailPrice)
            this.$set(item, 'salesRetailPrice', newRow.salesRetailPrice)
          }
        })
      })
    },

    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'salesUom':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
            break
          case 'salesPartNo':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
            break
          case 'unitPrice':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
            break
          case 'priceType':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 240
            break
        }
      })
    },

    update(param) {
      const vm = this
      vm.submitLoading = true
      saveSalesPriceList(param)
        .then((res) => {
          vm.$message.success(`${vm.$t('SALES.priceStrategySubmitSuccess')}`)
          this.cancel()
          vm.submitLoading = false
        })
        .catch(() => {
          vm.submitLoading = false
        })
    },
    // 取消按钮
    cancel() {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/salesManagement/salesPriceStrategy' })
    },
    submitForm() {
      const vm = this
      this.$refs.createForm.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (valid) {
          if (this.priceTableList.length <= 0) {
            this.$modal.msgError(this.$t('SALES.productIsEmpty'))
            this.collapseWarningForPriceList = true
            return
          }

          const priceTypeReq = this.priceTableList.find((item) => {
            return !this.$resultOfBoolean(item.priceType)
          })
          if (priceTypeReq) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.priceType'))
            )
            this.collapseWarningForPriceList = true
            return
          }

          const salesUomReq = this.priceTableList.find((item) => {
            return !this.$resultOfBoolean(item.salesUom)
          })
          if (salesUomReq) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesUom'))
            )
            this.collapseWarningForPriceList = true
            return
          }

          const salesPartNoReq = this.priceTableList.find((item) => {
            return !this.$resultOfBoolean(item.salesPartNo)
          })
          if (salesPartNoReq) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesPartNo'))
            )
            this.collapseWarningForPriceList = true
            return
          }

          const discountedPriceReq = this.priceTableList.find((item) => {
            return !this.$resultOfBoolean(item.unitPrice)
          })
          if (discountedPriceReq) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.discountedPrice'))
            )
            this.collapseWarningForPriceList = true
            return
          }
          this.collapseWarningForPriceList = false
          const confirm = vm
            .$t('SALES.priceStrategySubmitConfirm')
            .replace('$1', vm.createForm.checklistTemplateName)
          this.$modal.confirm(confirm).then(() => {
            const param = this.$trimOfObj(JSON.parse(JSON.stringify(vm.createForm)))

            param.salesPriceListList = this.priceTableList.map((x) => {
              const { ivtProduct, ...params } = x
              return {
                ...params
              }
            })
            vm.update(param)
          })
        } else {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
      })
    }
  }
}
</script>
