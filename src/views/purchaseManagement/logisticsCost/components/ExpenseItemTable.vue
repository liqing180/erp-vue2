<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-button @click="handleAddBtn" type="primary" icon="el-icon-plus" size="mini">{{
          $t('uiBtn.add')
        }}</el-button>
      </el-col>
      <el-col :span="1.5" v-if="false">
        <el-button
          @click="handleRowAssign"
          :disabled="tableList.length <= 0 || !formData.documentType"
          type="primary"
          size="mini"
          >{{ $t('PURCHASE.selectFromDocuments') }}</el-button
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
      border
      ref="tables"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      :data="comTableList"
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
          <span v-if="!scope.row.isTotal">{{ scope.$index + 1 }}</span>
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
                'shippingAgentName',
                'currency',
                'logisticsDocumentExpenseItem',
                'logisticsDocumentExpenseNo',
                'amount'
              ].includes(item.prop)
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else-if="['refAmount'].includes(item.prop)">
            <span class="item-label">{{ column.label }}</span>
            <span class="ml5" v-if="legalEntityInfo.currencyCode">{{
              `(${legalEntityInfo.currencyCode})`
            }}</span>
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'logisticsDocumentExpenseItem' && !scope.row.isTotal">
            <el-input
              v-if="!comDisFrom"
              style="width: 98%"
              :title="scope.row.logisticsDocumentExpenseItem"
              v-model="scope.row.logisticsDocumentExpenseItem"
              :maxlength="50"
              @input="
                scope.row.logisticsDocumentExpenseItemError = false
                scope.row['ROW-ERROR'] = false
              "
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'shippingAgentName' && !scope.row.isTotal">
            <!-- <SelectInput
              clearable
              :value="scope.row.shippingAgentName"
              :title="scope.row.shippingAgentName"
              @click="openSupplierTable(scope.$index)"
              @clear="supplierClear(scope.row)"
              style="width: 98%"
              v-if="!comDisFrom"
            /> -->
            <CommonSelectAndList
              :id="scope.row.shippingAgentId"
              :label="scope.row.shippingAgentName"
              idKey="businessPartnerId"
              labelKey="businessPartnerName"
              filterable
              :options="businessPartnerOptions"
              :loading="businessPartnerOptionsLoading"
              @change="updateSupplier($event, scope.$index)"
              @handleOpen="openSupplierTable(scope.$index)"
              v-if="!comDisFrom"
            />
            <template v-else>
              <span :title="scope.row[item.prop]">{{ scope.row[item.prop] }}</span>
            </template>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>

          <template v-else-if="item.prop === 'currency' && !scope.row.isTotal">
            <CommonSelect
              :disabled="!scope.row.shippingAgentId"
              :id="scope.row.currencyCode"
              :label="scope.row.currency"
              :title="scope.row.currency"
              idKey="currencyCode"
              labelKey="currency"
              :filterable="true"
              :options="currencyOptions || []"
              @change="currencyChange($event, scope.row)"
              v-if="!comDisFrom"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>

          <template v-else-if="item.prop === 'logisticsDocumentExpenseNo' && !scope.row.isTotal">
            <el-input
              v-if="!comDisFrom"
              style="width: 98%"
              :title="scope.row.logisticsDocumentExpenseNo"
              v-model="scope.row.logisticsDocumentExpenseNo"
              :maxlength="50"
              @input="
                scope.row.logisticsDocumentExpenseNoError = false
                scope.row['ROW-ERROR'] = false
              "
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'amount'">
            <template v-if="!scope.row.isTotal">
              <template v-if="!comDisFrom">
                <div class="flexStart" style="width: 98%">
                  <el-input-number
                    v-thousandSplit="{ precision: 2 }"
                    v-model="scope.row.amount"
                    controls-position="right"
                    :precision="2"
                    :min="0.01"
                    :max="999999999.99"
                    @change="amountChange(scope.row)"
                    style="width: 100%"
                  />
                  <div class="ml5">{{ scope.row.currencyCode }}</div>
                </div>
              </template>
              <template v-else
                >{{ $numberStr(scope.row[item.prop], 2) }} {{ scope.row.currencyCode }}</template
              >
            </template>
            <template v-else>{{ $numberStr(comAmount, 2) }}</template>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'attachment'">
            <div v-if="!scope.row.isTotal">
              <myUploadTableIcon
                :key="scope.row.timeRowId + 'att'"
                :ref="scope.row.timeRowId + 'att'"
                :limit="3"
                :accept="['.jpg', '.jpeg', '.png', '.bmp', '.webp']"
                :disabled="comDisFrom"
                :updateFileList="
                  ($event) => {
                    updateFileList(scope.row, $event, 'attachment')
                  }
                "
              />
            </div>
          </template>
          <template v-else-if="item.prop === 'remarks' && !scope.row.isTotal">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="300"
              :disabled="comDisFrom"
            />
          </template>
          <template v-else-if="item.prop === 'refAmount'">
            <template v-if="!scope.row.isTotal">
              <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
            </template>
            <template v-else>{{ $numberStr(comRefAmount, 2) }}</template>
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
          <div class="flexCen" v-if="!scope.row.isTotal">
            <i
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.$index, scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <selectProductTableForPO
      :businessPartnerId="formData.shippingAgentId"
      :currencyId="formData.currencyId"
      :documentType="formData.documentType"
      :logisticsDocumentId="formData.logisticsDocumentId"
      ref="selectProductTableForPO"
      @onSuccess="updateTable"
    />
    <selectProductTableForPRO
      :businessPartnerId="formData.shippingAgentId"
      :currencyId="formData.currencyId"
      :documentType="formData.documentType"
      :logisticsDocumentId="formData.logisticsDocumentId"
      ref="selectProductTableForPRO"
      @onSuccess="updateTable"
    />
    <selectProductTableForSIC
      :businessPartnerId="formData.shippingAgentId"
      :currencyId="formData.currencyId"
      :documentType="formData.documentType"
      :logisticsDocumentId="formData.logisticsDocumentId"
      ref="selectProductTableForSIC"
      @onSuccess="updateTable"
    />
    <selectProductTableForSRO
      :businessPartnerId="formData.shippingAgentId"
      :currencyId="formData.currencyId"
      :documentType="formData.documentType"
      :logisticsDocumentId="formData.logisticsDocumentId"
      ref="selectProductTableForSRO"
      @onSuccess="updateTable"
    />
    <selectProductTableForTO
      :businessPartnerId="formData.shippingAgentId"
      :currencyId="formData.currencyId"
      :documentType="formData.documentType"
      :logisticsDocumentId="formData.logisticsDocumentId"
      ref="selectProductTableForTO"
      @onSuccess="updateTable"
    />

    <selectSupplierTable ref="selectSupplierTable" shippingAgent="1" @update="updateSupplier" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTableForPO from './selectProductTableForPO'
import selectProductTableForPRO from './selectProductTableForPRO'
import selectProductTableForSIC from './selectProductTableForSIC'
import selectProductTableForSRO from './selectProductTableForSRO'
import selectProductTableForTO from './selectProductTableForTO'
import {
  // calculateDocumentExpense,
  calculate
} from '@/api/purchaseManagement/logisticsCost'
import myUploadTableIcon from '@/components/Common/htz-image-upload/my-upload-table-icon.vue'
import selectSupplierTable from './selectSupplierTable.vue'
import {
  queryBusinessCanSelectVendorList,
  queryExchangeRateDesc
} from '@/api/purchaseManagement/purchaseOrder'

export default {
  mixins: [pageMixin],
  components: {
    selectProductTableForPO,
    selectProductTableForPRO,
    selectProductTableForSIC,
    selectProductTableForSRO,
    selectProductTableForTO,
    myUploadTableIcon,
    selectSupplierTable
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
    countryId: {
      type: String,
      default: ''
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    currencyOptions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    formData: {
      immediate: true,
      handler: function (newValue) {
        this.totalForm = newValue || {}
      }
    },
    'formData.logisticsDocumentExpenses': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.logisticsDocumentExpenses
        this.changeTableList()
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
      saveKey: '1',
      savePath: 'LCostTable',
      activeName: '1',
      columns: [
        {
          prop: 'shippingAgentName',
          label: vm.$t('PURCHASE.shippingAgent'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },

        {
          prop: 'logisticsDocumentExpenseItem',
          label: vm.$t('PURCHASE.expenseItem'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'logisticsDocumentExpenseNo',
          label: vm.$t('PURCHASE.documentNo2'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'amount',
          label: vm.$t('PURCHASE.amount'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right',
          padding: 80
        },
        {
          prop: 'exchangeRateDesc',
          label: vm.$t('menu.exchangeRate'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'refAmount',
          label: vm.$t('PURCHASE.referenceAmount1'),
          visible: true,
          width: 170,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'attachment',
          label: vm.$t('ui.attachment'),
          width: 130,
          visible: true,
          disEditVisible: true,
          tooltip: false
        }
      ],
      totalForm: {},
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'salesPartId',
      popoverData: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: [],
      index: undefined,
      businessPartnerOptions: [],
      businessPartnerOptionsLoading: false
    }
  },
  computed: {
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
      // currency: row.currency,
      // currencyId: row.currencyId,
      // currencyCode: row.currencyCode,
    },
    comTableList() {
      if (this.tableList.length > 1) {
        return [...this.tableList, { isTotal: '1' }]
      } else {
        return this.tableList
      }
    },
    comAmount() {
      let currencyCodeList = this.tableList.map((item) => item.currencyCode)
      currencyCodeList = [...new Set(currencyCodeList)]
      if (currencyCodeList.length > 1) {
        return ''
      }
      const amountList = this.tableList.map((item) => item.amount)
      let total = 0
      amountList.forEach((cost) => {
        if (cost) {
          total += cost || 0
        }
      })
      return total
    },
    comRefAmount() {
      const amountList = this.tableList.map((item) => item.refAmount)
      let total = 0
      amountList.forEach((cost) => {
        if (cost) {
          total += cost || 0
        }
      })
      return total
    }
  },
  created() {
    this.createdInitTimer = Date.now()
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.queryBusinessPartnerOptions()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.queryBusinessPartnerOptions()
  },
  methods: {
    queryBusinessPartnerOptions() {
      this.businessPartnerOptionsLoading = true
      queryBusinessCanSelectVendorList({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.logisticsCost,
        shippingAgent: '1'
      })
        .then((res) => {
          this.businessPartnerOptionsLoading = false
          this.businessPartnerOptions = res.rows || []
        })
        .catch(() => {
          this.businessPartnerOptionsLoading = false
        })
    },
    openSupplierTable(index) {
      this.index = index
      this.$refs.selectSupplierTable.handleOpen()
    },
    updateSupplier(row, index) {
      const index2 = this.$resultOfBoolean(index) ? index : this.index
      const data = this.tableList[index2]
      this.$set(data, 'shippingAgentNameError', false)
      this.$set(data, 'ROW-ERROR', false)
      this.$set(data, 'shippingAgentId', row.businessPartnerId)
      this.$set(data, 'shippingAgentName', row.businessPartnerName)
      this.$set(data, 'shippingAgentNo', row.businessPartnerNo)
      this.$set(data, 'shippingAgentAbbreviation', row.abbreviation)
      this.$set(data, 'countryId', row.countryId)
      this.$set(data, 'country', row.country)
      this.$set(data, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      const account = row.bpBusinessAccountSupplier || {}
      this.$set(data, 'currencyId', account.currencyId)
      this.$set(data, 'currencyCode', account.currencyCode)
      this.$set(data, 'currency', account.currency)
      this.$set(data, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(data, 'paymentMethodNameList', account.paymentMethodNameList || [])
      this.queryExchangeRateDesc(data)
      console.log(account, '=======================530')
      if (account.currencyCode && !account.currency) {
        const list = this.currencyOptions.filter((x) => x.currencyCode === account.currencyCode)
        if (list.length > 0) {
          const item = list[0]
          this.$set(data, 'currency', item.currency)
        }
      }
      const ContactPersonList = data.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.deliveryByChange(data, defaultContact)
        } else {
          this.deliveryByChange(data, ContactPersonList[0])
        }
      }

      this.$emit('calculateExpenseItem')
    },
    // 清空供应商
    supplierClear(row) {
      this.$set(row, 'shippingAgentId', undefined)
      this.$set(row, 'shippingAgentName', undefined)
      this.$set(row, 'shippingAgentNo', undefined)
      this.$set(row, 'shippingAgentAbbreviation', undefined)
      this.$set(row, 'countryId', undefined)
      this.$set(row, 'country', undefined)

      this.$set(row, 'currencyId', undefined)
      this.$set(row, 'currency', undefined)
      this.$set(row, 'currencyCode', undefined)
      this.$set(row, 'bpBusinessContactPersonList', undefined)
      this.$set(row, 'paymentMethodIdList', undefined)
      this.$set(row, 'paymentMethodNameList', undefined)
      this.$set(row, 'exchangeRateDesc', undefined)
      this.currencyClear(row)
      this.deliveryByClear(row)
      this.$emit('calculateExpenseItem')
    },
    deliveryByChange(data, row) {
      this.$set(data, 'bpBusinessContactPersonId', row.businessContactPersonId)
      this.$set(data, 'bpContactPersonId', row.contactPersonId)
      this.$set(data, 'bpContactPersonName', row.contactPersonName)
      this.$set(data, 'bpMobileNum', row.mobileNum)
      this.$set(data, 'bpMobileCode', row.mobileCode)
      this.$set(data, 'bpMobilePhone', row.mobilePhone)
      this.$set(data, 'bpEmail', row.email)
    },
    deliveryByClear(data) {
      this.$set(data, 'bpBusinessContactPersonId', undefined)
      this.$set(data, 'bpContactPersonId', undefined)
      this.$set(data, 'bpContactPersonName', undefined)
      this.$set(data, 'bpMobileNum', undefined)
      this.$set(data, 'bpMobileCode', undefined)
      this.$set(data, 'bpMobilePhone', undefined)
      this.$set(data, 'bpEmail', undefined)
    },
    currencyChange(row, data) {
      this.$set(data, 'currencyError', false)
      this.$set(data, 'ROW-ERROR', false)
      this.$set(data, 'currencyId', row.id)
      this.$set(data, 'currency', row.currency)
      this.$set(data, 'currencyCode', row.currencyCode)
      this.$emit('calculateExpenseItem')
      this.queryExchangeRateDesc(data)
    },
    queryExchangeRateDesc(row) {
      if (!row.currencyCode) {
        this.$set(row, 'exchangeRateDesc', undefined)
        return
      }
      queryExchangeRateDesc({ currencyCode: row.currencyCode }).then((res) => {
        const exchangeRateDesc = res.code === 200 ? res.msg : ''
        this.$set(row, 'exchangeRateDesc', exchangeRateDesc)
        this.changeTableList()
      })
    },
    currencyClear(row) {
      this.$set(row, 'currencyId', undefined)
      this.$set(row, 'currency', undefined)
      this.$set(row, 'currencyCode', undefined)
      this.$set(row, 'exchangeRateDesc', undefined)
    },
    initTableFileList() {
      const topRow = this.tableList[this.tableList.length - 1]
      if (!topRow) return
      const maxAttempts = 20 // 最大尝试次数
      const interval = 200 // 每次尝试的间隔时间（毫秒）
      let attempts = 0
      const retry = () => {
        if (attempts < maxAttempts) {
          attempts++
          setTimeout(() => {
            if (this.$refs[topRow.timeRowId + 'att']) {
              this.tableList.forEach((item) => {
                const refsList = this.$refs[item.timeRowId + 'att']
                refsList.forEach((ref) => {
                  ref.initFileList(item.commonFileList || [])
                })
              })
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
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'shippingAgentName':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'currency':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
            break
          case 'logisticsDocumentExpenseItem':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'logisticsDocumentExpenseNo':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
            break
          case 'amount':
            item.colMinWidth = vm.comDisFrom ? undefined : 160
            break
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    errorMessage(code) {
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
    handleAddBtn() {
      if (this.tableList.length > 0) {
        const row = this.tableList[0]
        const logisticsDocumentProducts = JSON.parse(
          JSON.stringify(row.logisticsDocumentProducts || [])
        )
        logisticsDocumentProducts.forEach((item) => {
          item.freightAllocation = undefined
        })
        const {
          shippingAgentId,
          shippingAgentName,
          shippingAgentNo,
          shippingAgentAbbreviation,
          countryId,
          country,
          bpBusinessContactPersonList,
          currencyId,
          currencyCode,
          currency,
          paymentMethodIdList,
          paymentMethodNameList,
          bpBusinessContactPersonId,
          bpContactPersonId,
          bpContactPersonName,
          bpMobileNum,
          bpMobileCode,
          bpMobilePhone,
          bpEmail,
          exchangeRateDesc
        } = this.tableList[this.tableList.length - 1]

        const params = {
          shippingAgentId,
          shippingAgentName,
          shippingAgentNo,
          shippingAgentAbbreviation,
          countryId,
          country,
          bpBusinessContactPersonList,
          currencyId,
          currencyCode,
          currency,
          paymentMethodIdList,
          paymentMethodNameList,
          bpBusinessContactPersonId,
          bpContactPersonId,
          bpContactPersonName,
          bpMobileNum,
          bpMobileCode,
          bpMobilePhone,
          bpEmail,
          exchangeRateDesc,
          timeRowId: Date.now(),
          logisticsDocumentProducts: logisticsDocumentProducts
        }

        this.tableList.push(params)
      } else {
        this.tableList.push({ timeRowId: Date.now(), logisticsDocumentProducts: [] })
      }
    },
    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.calculateOneDetail(this.tableList)
      })
    },
    amountChange(row) {
      this.$set(row, 'amountError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.calculateOneDetail([row])
    },
    calculateOneDetail(list) {
      const timer = Date.now()
      this.queryTimer = timer
      list.forEach((item) => {
        item.queryTime = timer
        // item.currencyId = this.formData.currencyId
        if (!item.amount) {
          this.$set(item, 'refAmount', undefined)
          item.logisticsDocumentProducts.forEach((child) => {
            this.$set(child, 'freightAllocation', undefined)
          })
        }
      })
      // if (list.length === 1 && !list[0].amount) {
      //   return
      // }

      calculate(this.totalForm).then((res) => {
        const { logisticsDocumentExpenses, logisticsDocumentProductList } = res
        const newList = logisticsDocumentExpenses || []
        if (this.queryTimer === timer) {
          this.$set(this.totalForm, 'logisticsDocumentProductList', logisticsDocumentProductList)
        }
        this.tableList.forEach((item) => {
          if (timer === item.queryTime) {
            const newItem = newList.find((p) => p.timeRowId + '' === item.timeRowId + '')
            if (newItem) {
              this.$set(item, 'refAmount', newItem.refAmount)
              // const logisticsDocumentProducts = newItem.logisticsDocumentProducts
              // this.$set(item, 'logisticsDocumentProducts', logisticsDocumentProducts)
              // this.$set(item, 'logisticsDocumentProducts', logisticsDocumentProductList)
            }
          }
        })
      })
    },

    handleRowAssign() {
      /*
        documentType 选项
        1: Purchase Order
        16: Purchase Return Order
        15: Sales Return Order
        23: Store Issue Chit
        22: Transfer Order
      */
      // const row = this.tableList[0]
      // const logisticsDocumentProducts = row.logisticsDocumentProducts || []
      // const tableList = JSON.parse(JSON.stringify(logisticsDocumentProducts))
      const { selectedProductList } = this.totalForm
      const tableList = JSON.parse(JSON.stringify(selectedProductList || []))

      const alreadySelectIdList = tableList
      // const alreadySelectIdList = logisticsDocumentProducts.map((item) => item.documentDetailId)

      switch (this.formData.documentType) {
        case '1':
          this.$refs.selectProductTableForPO.handleAdd(alreadySelectIdList)
          break
        case '16':
          this.$refs.selectProductTableForPRO.handleAdd(alreadySelectIdList)
          break
        case '15':
          this.$refs.selectProductTableForSRO.handleAdd(alreadySelectIdList)
          break
        case '23':
          this.$refs.selectProductTableForSIC.handleAdd(alreadySelectIdList)
          break
        case '22':
          this.$refs.selectProductTableForTO.handleAdd(alreadySelectIdList)
          break
      }
    },
    updateFileList(row, fileList, type) {
      this.$set(row, 'commonFileList', fileList)
      /* this.$nextTick(() => {
        this.$refs.tables.doLayout()
      }) */
    },

    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        rows.forEach((item) => {
          item.remarks = ''
        })
        this.$set(this.totalForm, 'selectedProductList', rows)
        this.$set(this.totalForm, 'logisticsDocumentProductList', rows)
        if (this.tableList.length > 0) {
          this.tableList.forEach((editItem) => {
            this.$set(editItem, 'logisticsDocumentProducts', rows)
          })

          this.calculateOneDetail(this.tableList)
        }
      } else {
        this.$set(this.totalForm, 'selectedProductList', [])
        this.$set(this.totalForm, 'logisticsDocumentProductList', [])
        if (this.tableList.length > 0) {
          this.tableList.forEach((editItem) => {
            this.$set(editItem, 'logisticsDocumentProducts', [])
          })
        }
      }
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
