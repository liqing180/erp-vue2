<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.supplier')"
    :visible.sync="visible"
    width="1100px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-tabs
      v-if="otherSuppliersAuth"
      v-model="activeName"
      size="mini"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        :label="$t('PURCHASE.availableSuppliers')"
        name="1"
        :disabled="availableSuppliersDisabled"
      ></el-tab-pane>
      <el-tab-pane :label="$t('PURCHASE.otherSuppliers')" name="2"></el-tab-pane>
    </el-tabs>
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :showMenu="false"
    >
      <right-toolbar
        :saveKey="saveKey"
        :savePath="savePath"
        :showRefreshBtn="true"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </search-form>

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
          <template slot="header" slot-scope="{ column }">
            <span v-if="['contactPersonName'].includes(item.prop)">
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
            <template v-else-if="item.prop === 'contactPersonName'">
              <CommonSelect
                v-if="selectIds.includes(scope.row[rowIdKey])"
                style="width: 98%"
                :id="scope.row.contactPersonId"
                :label="scope.row.contactPersonName"
                :title="scope.row.contactPersonName"
                idKey="contactPersonId"
                labelKey="contactPersonName"
                :options="scope.row.bpBusinessContactPersonList || []"
                @change="rowContactPersonChange($event, scope.row)"
              />
              <template v-else>{{ scope.row.contactPersonName }}</template>
            </template>
            <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :saveKey="saveKey"
        :savePath="savePath"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button
        type="primary"
        :loading="submitLoading"
        :disabled="selectList.length <= 0"
        @click="submit"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryRFQCanSelectVendorListForHaveSheet,
  queryRFQCanSelectVendorListForNoSheet,
  sendNewBusinessPartner,
  queryIngPQList
} from '@/api/purchaseManagement/requestForQuotation'
export default {
  dicts: [
    'bp_business_partner_status',
    'bp_supplier_type',
    'bp_supplier_group',
    'p_purchase_quotation_status'
  ],
  mixins: [pageMixin],
  props: {
    productIdList: {
      type: Array,
      default() {
        return []
      }
    },
    rfqId: String
  },
  data() {
    const vm = this
    return {
      submitLoading: false,
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
      rowIdKey: 'businessPartnerId',
      tableList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList: [],
      visible: false,
      columns: [
        {
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('PURCHASE.supplierCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'contactPersonName',
          label: vm.$t('PURCHASE.contactPerson'),
          visible: true,
          width: 200,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'businessPartnerStatus',
          propBy: 'businessPartnerStatusStr',
          label: vm.$t('ui.status'),
          minWidth: 170,
          sortable: 'custom',
          visible: true,
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'supplierType',
          propBy: 'supplierTypeStr',
          label: vm.$t('ui.supplierType'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'supplierGroup',
          propBy: 'supplierGroupStr',
          label: vm.$t('ui.supplierGroup'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.supplierSearch')}`,
          type: 'InputEle'
        }
        // {
        //   name: 'supplierGroupList',
        //   label: vm.$t('ui.supplierGroup'),
        //   // placeholder: vm.$t('ui.supplierGroup'),
        //   type: 'MultipleSelectEle',
        //   width: '200px',
        //   selectValue: 'dictValue',
        //   selectLabel: 'dictLabel',
        //   dict: 'bp_supplier_group',
        //   selectData: []
        // }
      ],
      /* 已经选择的联系人Id(过滤) */
      alreadySelectIdList: [],
      row: {},
      availableSuppliersDisabled: false
    }
  },
  computed: {
    otherSuppliersAuth() {
      return this.checkPermi(['requestForQuotation:pendInquiry:otherSuppliers'])
    },
    selectIds() {
      return this.selectList.map((item) => item[this.rowIdKey])
    }
  },
  watch: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    handleClick() {
      // this.$refs.searchForm.resetForm()
      this.queryTable()
    },
    handleAdd(alreadySelectIdList) {
      this.alreadySelectIdList = alreadySelectIdList || []
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList('create')
    },
    handleEnquiry(row) {
      this.row = row
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList('create')
    },
    queryTable() {
      this.queryParams.isAsc = this.queryParams.orderByColumn = undefined
      this.$refs.tables.clearSort()
      this.getList()
    },
    getList(type) {
      const vm = this
      const param = this.queryParams
      this.$trimOfObj(param)
      const { rfqId, productIdList } = this.row
      if (rfqId) {
        // param.alreadyBusinessPartnerIdList = businessPartnerIdList || []
        param.productIdList = productIdList || []
      } else {
        // param.alreadyBusinessPartnerIdList = this.alreadySelectIdList
        param.productIdList = this.productIdList
      }
      this.loading = true
      let queryFn
      if (this.activeName === '1') {
        queryFn = queryRFQCanSelectVendorListForHaveSheet
      } else {
        queryFn = queryRFQCanSelectVendorListForNoSheet
      }
      param.menuPerms = this.menuKey.RFQ

      queryFn(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.businessPartnerStatusStr = this.selectDictLabel(
              this.dict.type.bp_business_partner_status,
              item.businessPartnerStatus
            )
            item.supplierTypeStr = this.selectDictLabel(
              this.dict.type.bp_supplier_type,
              item.supplierType
            )
            item.supplierGroupStr = this.selectDictLabel(
              this.dict.type.bp_supplier_group,
              item.supplierGroup
            )
            if (!this.selectIds.includes(item[this.rowIdKey])) {
              const contactPersonList = item.bpBusinessContactPersonList || []
              contactPersonList.forEach((contactRow) => {
                if (contactRow.isPurchaseDefault === '1') {
                  this.rowContactPersonChange(contactRow, item, false)
                }
              })
            }
          })
          this.tableList = rows
          this.loading = false
          this.total = response.total

          if (
            this.activeName === '1' &&
            rows.length <= 0 &&
            !param.condition &&
            type === 'create'
          ) {
            this.availableSuppliersDisabled = true
            this.activeName = '2'
            this.getList()
            return
          } else if (this.activeName === '1') {
            this.availableSuppliersDisabled = false
          }

          this.$$getColumnContentMaxWidth(this.columns, this.tableList)

          this.$nextTick(() => {
            this.selectList.forEach((row) => {
              this.tableList.forEach((item) => {
                if (row[this.rowIdKey] === item[this.rowIdKey]) {
                  this.rowContactPersonChange(row, item, false)
                  this.$refs.tables.toggleRowSelection(item, true)
                }
              })
            })
          })
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
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
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm(isGetList = true) {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize, condition: '' }
      this.$refs.tables.clearSort()

      if (isGetList) {
        this.getList()
      }
    },
    closed() {
      this.selectList = []
      this.tableList = []
      this.activeName = '1'
      this.resetSearchForm(false)
      this.$nextTick(() => {
        this.searchFormKey = Date.now()
      })
    },
    rowContactPersonChange(value, row, isSetSelect = true) {
      const data = value || {}
      this.$set(row, 'businessContactPersonId', data.businessContactPersonId)
      this.$set(row, 'contactPersonId', data.contactPersonId)
      this.$set(row, 'contactPersonName', data.contactPersonName)
      this.$set(row, 'email', data.email)
      this.$set(row, 'mobileCode', data.mobileCode)
      this.$set(row, 'mobileNum', data.mobileNum)
      this.$set(row, 'mobilePhone', data.mobilePhone)
      if (isSetSelect) {
        this.selectList.forEach((selectItem) => {
          if (row[this.rowIdKey] === selectItem[this.rowIdKey]) {
            this.rowContactPersonChange(value, selectItem)
          }
        })
      }
    },
    canEditQuotation(row) {
      return (
        !!row.purchaseQuotationId && this.checkPermi(['purchaseManagement:purchaseQuotation:edit'])
      )
    },
    confirmExistingQuotations(quotations, suppliers) {
      const h = this.$createElement
      let cancelConfirmation
      const navigationCancelled = new Promise((resolve, reject) => {
        cancelConfirmation = reject
      })
      const showRows = []
      suppliers.forEach((supplier) => {
        const matches = quotations.filter(
          (quotation) => String(quotation.businessPartnerId) === String(supplier.businessPartnerId)
        )
        ;(matches.length ? matches : [{}]).forEach((quotation) => {
          showRows.push({ ...quotation, businessPartnerName: supplier.businessPartnerName })
        })
      })
      const message = h('div', [
        h('div', { class: 'rfq-existing-pq-warning' }, [
          h('i', { class: 'el-icon-warning', attrs: { 'aria-hidden': 'true' } }),
          h('span', this.$t('PURCHASE.existingQuotationWarning'))
        ]),
        h('div', { class: 'rfq-existing-pq-table-wrapper' }, [
          h('table', { class: 'rfq-existing-pq-table' }, [
            h('thead', [
              h('tr', [
                h('th', { attrs: { scope: 'col' } }, this.$t('PURCHASE.supplier')),
                h('th', { attrs: { scope: 'col' } }, this.$t('PURCHASE.quotationNo')),
                h('th', { attrs: { scope: 'col' } }, this.$t('ui.status'))
              ])
            ]),
            h(
              'tbody',
              showRows.map((row, index) =>
                h('tr', { key: index }, [
                  h('td', row.businessPartnerName),
                  h('td', [
                    this.canEditQuotation(row)
                      ? h('DocumentNoLink', {
                          props: {
                            showStr: row.purchaseQuotationNo,
                            moduleKey: 'purchaseQuotation'
                          },
                          on: {
                            click: () => {
                              this.$msgbox.close()
                              cancelConfirmation('cancel')
                              // 先关闭供应商弹窗，避免页面缓存后保留其遮罩。
                              this.visible = false
                              this.$nextTick(() => {
                                this.$router.push({
                                  path: '/purchaseManagement/editPurchaseQuotation',
                                  query: {
                                    id: row.purchaseQuotationId,
                                    timeId: Date.now(),
                                    backType: '2'
                                  }
                                })
                              })
                            }
                          }
                        })
                      : h('span', row.purchaseQuotationNo || '—')
                  ]),
                  h('td', [
                    h(
                      'el-tag',
                      {
                        props: {
                          size: 'mini',
                          type: !row.purchaseQuotationNo
                            ? 'info'
                            : String(row.purchaseQuotationStatus) === '1'
                            ? 'warning'
                            : ''
                        }
                      },
                      row.purchaseQuotationNo
                        ? this.selectDictLabel(
                            this.dict.type.p_purchase_quotation_status,
                            String(row.purchaseQuotationStatus)
                          )
                        : this.$t('PURCHASE.noExistingQuotation')
                    )
                  ])
                ])
              )
            )
          ])
        ])
      ])
      return Promise.race([
        this.$confirm(message, this.$t('PURCHASE.addQuotationConfirmTitle'), {
          customClass: 'rfq-existing-pq-confirm',
          confirmButtonText: this.$t('uiBtn.submit'),
          cancelButtonText: this.$t('ui.back'),
          closeOnClickModal: false
        }),
        navigationCancelled
      ])
    },
    submit() {
      if (this.submitLoading || !this.selectList.length) return
      const contactPersonNameReq = this.selectList.find((item) => {
        return !this.$resultOfBoolean(item.contactPersonName)
      })
      if (contactPersonNameReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.contactPerson'))
        )
        return
      }
      const { rfqId } = this.row

      const params = {
        rfqId: rfqId || this.rfqId,
        rfqVendorList: this.selectList
      }
      this.submitLoading = true
      queryIngPQList({
        rfqId: params.rfqId,
        businessPartnerIdList: params.rfqVendorList.map((item) => item.businessPartnerId)
      })
        .then((response) => {
          const quotations = response.data || []
          return quotations.length
            ? this.confirmExistingQuotations(quotations, params.rfqVendorList)
            : this.$modal.confirm(this.$t('ui.submitPageConfirm'))
        })
        .then(() => {
          this.submitLoading = true
          return sendNewBusinessPartner(params)
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
          this.$emit('onSuccess')
          this.visible = false
          setTimeout(() => {
            this.submitLoading = false
          }, 500)
        })
        .catch(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
.el-message-box.rfq-existing-pq-confirm {
  width: 700px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 48px);
  display: inline-flex;
  flex-direction: column;
  padding: 0;
  border-radius: 8px;
  color: #1b2d47;

  .el-message-box__header {
    padding: 24px 52px 20px 24px;
    border-bottom: 1px solid #ebeef5;
  }
  .el-message-box__title {
    color: inherit;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
  }
  .el-message-box__headerbtn {
    top: 24px;
    right: 24px;
  }
  .el-message-box__content {
    min-height: 0;
    padding: 20px 24px;
    overflow-y: auto;
    color: inherit;
  }
  .rfq-existing-pq-warning {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    margin-bottom: 16px;
    border: 1px solid #ffd18a;
    border-radius: 6px;
    background: #fff7e6;
    color: #714b17;
    line-height: 1.6;

    i {
      flex-shrink: 0;
      margin-top: 3px;
      color: #e6a23c;
      font-size: 18px;
    }
  }
  .rfq-existing-pq-table-wrapper {
    overflow: hidden;
    border: 1px solid #ebeef5;
    border-radius: 6px;
  }
  .rfq-existing-pq-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    text-align: left;

    th,
    td {
      padding: 12px 14px;
      overflow-wrap: anywhere;
      line-height: 1.5;
    }
    th {
      background: #f7f8fa;
      color: #606078;
    }
    td {
      border-top: 1px solid #ebeef5;
    }
    th:first-child {
      width: 36%;
    }
    th:last-child {
      width: 30%;
    }
    .el-tag {
      max-width: 100%;
      height: auto;
      white-space: normal;
      border-radius: 12px;
    }
  }
  .el-message-box__btns {
    padding: 10px 24px 20px;

    .el-button {
      padding: 11px 20px;
      border-radius: 6px;
    }
  }
}
</style>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}
</style>
