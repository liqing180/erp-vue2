<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="isCanAdd">
        <el-button @click="handleAddBtn" type="primary" icon="el-icon-plus" size="mini">{{
          $t('uiBtn.add')
        }}</el-button>
      </el-col>
      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="true"
        :saveKey="saveKey"
        :columns="configColumn"
        :columnsInit="columns"
        @queryTable="queryTable"
      ></right-toolbar>

      <search-form
        ref="searchForm"
        v-model="queryParams"
        :searchData="searchData"
        :handleQuery="handleSearchForm"
        :resetQuery="resetSearchForm"
        :showCustom="false"
        :topShowCount="4"
        :isProductCustomSearch="true"
      />

      <el-table
        border
        ref="tables"
        v-loading="loading"
        :data="tableList"
        tooltip-effect="light"
        :max-height="tableMaxHeight"
        @sort-change="handleSortChange"
        @row-dblclick="handleDblclick"
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
          <template slot-scope="scope">
            <template v-if="item.prop === 'documentNo'">
              <span
                :class="{ 'primary-link': documentTypeGetAuth(scope.row) }"
                @click="nav(scope.row, 'documentNo')"
                >{{ scope.row.documentNo }}</span
              >
            </template>
            <template v-else-if="item.prop === 'deliveryOrderNo'">
              <div
                @mouseenter="showPop($event, scope.row)"
                @mouseleave="hidePop($event, scope.row)"
              >
                <div class="primary ellipsis-text">{{ scope.row.deliveryOrderNo }}</div>
              </div>
            </template>
            <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('ui.action')"
          key="action"
          align="center"
          min-width="120"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="flexCen">
              <i
                class="el-icon-edit pointer mr5"
                style="font-size: 20px; color: #409eff"
                :title="$t('uiBtn.edit')"
                @click="handleEditRow(scope.row)"
                v-if="scope.row.isCanUpdate === '1'"
              ></i>
              <i
                class="el-icon-delete pointer"
                style="font-size: 20px; color: #f56c6c"
                :title="$t('uiBtn.delete')"
                v-if="scope.row.isCanDelete === '1'"
                @click.stop="handleDelRow(scope.$index, scope.row)"
              ></i>
              <span
                :title="$t('SALES.schedule')"
                v-if="scope.row.isCanGoToPreDeliveryNotice === '1'"
              >
                <svg-icon
                  icon-class="stockIn"
                  class="primary-pointer"
                  style="font-size: 20px"
                  @click="handleGoToPreDeliveryNotice(scope.row)"
                />
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :saveKey="saveKey"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>

    <addDlg ref="addDlg" @submitSuccess="submitSuccess" />
    <viewDlg ref="viewDlg" />

    <ToolTipShowListForFN ref="ToolTipShowList" @clickItem="documentClick" />
  </div>
</template>

<script>
import {
  queryDeliveryScheduleDetailList,
  queryDeliveryScheduleDetailListForSearch,
  deleteDeliveryScheduleDetail
} from '@/api/salesManagement/salesOrder'
import pageMixin from '@/mixins/tableMinx'
import addDlg from './addDlg'
import viewDlg from './viewDlg'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
export default {
  components: {
    addDlg,
    viewDlg,
    ToolTipShowListForFN
  },
  mixins: [pageMixin],
  props: {
    formData: {
      type: Object,
      default() {
        return {}
      }
    },
    buttonAuthMsg: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '2',
      loading: false,
      tableList: [],
      showAll: false,
      // 总条数
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        deliveryScheduleDetailStatusList: ['1', '2', '3', '4', '6']
      },
      searchData: [
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          width: '240px',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        },
        {
          name: 'deliveryScheduleDetailStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'delivery_schedule_detail_status',
          selectData: []
        },
        {
          name: 'productIdList',
          label: vm.$t('PRODUCT.productName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'productId',
          selectLabel: 'productName',
          selectData: []
        },
        {
          name: 'conditionNo',
          label: this.$t('SALES.docNo'),
          placeholder: `${vm.$t('SALES.docNo')} / ${vm.$t('SALES.deliveryOrderNo')}`,
          type: 'AutocompleteEle',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }

        /* {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('SALES.docNo')} / ${vm.$t('SALES.deliveryOrderNo')}`
        } */
      ],
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'salesPartNo',
          label: vm.$t('PRODUCT.salesPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'arrivalDate',
          propBy: 'arrivalDateStr',
          label: vm.$t('SALES.arrivalDate'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'shippedDate',
        //   propBy: 'shippedDateStr',
        //   label: vm.$t('SALES.PlannedShippingDate'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'plannedQtyForBasic',
          propBy: 'plannedQtyForBasicStr',
          label: vm.$t('SALES.plannedQTY'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'ackQtyForBasic',
          propBy: 'ackQtyForBasicStr',
          label: vm.$t('SALES.receivedQty'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'deliveryScheduleDetailStatusShowStr',
          label: vm.$t('ui.status'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'documentNo',
          label: vm.$t('SALES.docNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'deliveryOrderNo',
          label: vm.$t('SALES.deliveryOrderNo'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdTime',
          propBy: 'createdTimeStr',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }
      ],
      rowId: undefined
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    PRAuth() {
      return this.checkPermi(['purchaseManagement:purchaseRequisition:list'])
    },
    preDeliveryNoticeAuth() {
      return this.checkPermi(['salesManagement:preDeliveryNotice:list'])
    },
    deliveryOrderAuth() {
      return this.checkPermi(['salesManagement:deliveryOrder:list'])
    },
    isCanAdd() {
      return this.buttonAuthMsg.isCanSubmit === '1'
    }
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.rowId = this.$route.query.id
    this.timeId = this.$route.query.timeId
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.rowId = this.$route.query.id
    this.timeId = this.$route.query.timeId
    if (this.$route.query.timeId !== this.timeId) {
      this.tableList = []
    }
    this.getList()
  },
  methods: {
    handleGoToPreDeliveryNotice(row) {
      // isCanGoToPreDeliveryNotice
      this.$router.push({
        path: '/salesManagement/editPreDeliveryNotice',
        query: {
          id: row.preDeliveryNoticeId,
          timeId: Date.now(),
          backType: '2'
        }
      })
    },
    handleAddBtn() {
      this.$refs.addDlg.handleAdd(this.formData.salesOrderId, this.formData.expirationDate)
    },
    handleDblclick(row) {
      if (row.isCanUpdate === '1') {
        this.$refs.addDlg.handleEdit(row)
      } else {
        this.$refs.viewDlg.handleEdit(row)
      }
    },
    handleEditRow(row) {
      this.$refs.addDlg.handleEdit(row)
    },
    submitSuccess() {
      this.$emit('submitSuccess')
      this.getList()
    },

    handleDelRow(index, row) {
      let content
      if (row.deliveryScheduleDetailStatus !== '2' && row.deliveryScheduleDetailStatus !== '1') {
        content = this.$t('SALES.notCancelDeliverySchedule')
      } else {
        content = this.$t('SALES.cancelDeliverySchedule')
      }
      this.$modal
        .confirm(content || this.$t('ui.delConfirm'), {
          showConfirmButton:
            row.deliveryScheduleDetailStatus === '2' || row.deliveryScheduleDetailStatus === '1',
          type: 'warning'
        })
        .then(() => {
          this.loading = true
          return deleteDeliveryScheduleDetail(row)
          // this.tableList.splice(index, 1)
        })
        .then(() => {
          this.loading = false
          this.$modal.msgSuccess(this.$t('ui.deleteSuccess'))
          setTimeout(() => {
            this.$emit('submitSuccess')
          }, 500)
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    querySearchList() {
      const param = {}
      param.salesOrderId = this.rowId

      queryDeliveryScheduleDetailListForSearch(param).then((res) => {
        const data = res.data || {}
        const conditionForNoList = (data.conditionForNoList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.searchData.forEach((x, i) => {
          if (x.name === 'productIdList') {
            this.$set(this.searchData[i], 'selectData', data.productList || [])
          } else if (x.name === 'conditionNo') {
            this.$set(x, 'fuzzyData', conditionForNoList)
          }
        })
      })
    },
    getList() {
      if (!this.rowId) {
        this.total = 0
        this.tableList = []
        return
      }
      this.querySearchList()
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      params.salesOrderId = this.rowId
      queryDeliveryScheduleDetailList(params).then((response) => {
        const rows = response.rows || []
        // const rows = [{ createdTime: Date.now() }]
        rows.forEach((item) => {
          item.arrivalDateStr = this.parseTime(item.arrivalDate, this.fmtForYmd)
          item.shippedDateStr = this.parseTime(item.shippedDate, this.fmtForYmd)
          item.plannedQtyForBasicStr = this.$numberStr(item.plannedQtyForBasic, item.decimalNum)
          item.ackQtyForBasicStr = this.$numberStr(item.ackQtyForBasic, item.decimalNum)
          item.createdTimeStr = this.parseTime(item.createdTime, this.fmtForYmdhms)
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    /** 搜索 */
    handleSearchForm() {
      // const param = this.$trimOfObj(query)
      // this.queryParams = { ...param }
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      this.initQueryParams()
      // this.searchFormKey = Date.now()
      this.$refs.tables.clearSort()
      this.getList()
    },
    nav(row, type) {
      if (type === 'documentNo') {
        if (!this.documentTypeGetAuth(row)) {
          return
        }
        switch (row.documentType) {
          case '2':
            this.$router.push({
              path: '/purchaseManagement/viewPurchaseRequisition',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break

          case '14':
            this.$router.push({
              path: '/salesManagement/viewPreDeliveryNotice',
              query: {
                id: row.documentId,
                timeId: Date.now(),
                backType: '2'
              }
            })
            break
        }
      } else if (type === 'stockCertificateNo') {
        this.$router.push({
          path: '/inventoryManagement/viewStockCertificate',
          query: {
            id: row.stockCertificateId,
            timeId: Date.now()
          }
        })
      }
    },
    documentTypeGetAuth(row) {
      let auth = false
      switch (row.documentType) {
        case '2':
          auth = this.PRAuth
          break
        case '14':
          auth = this.preDeliveryNoticeAuth
          break
      }
      return auth
    },
    showPop(e, row) {
      const list = row.deliveryOrderList || []
      const params = {
        popoverTitle: this.$t('SALES.deliveryOrderNo'),
        labelKey: 'deliveryOrderNo',
        itemClass: this.deliveryOrderAuth ? 'primary-pointer' : '',
        list
      }
      if (list.length > 0 && this.$refs.ToolTipShowList) {
        this.$refs.ToolTipShowList.showPop(e, params)
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    documentClick(item) {
      if (!this.deliveryOrderAuth) return
      this.$router.push({
        path: '/salesManagement/viewDeliveryOrder',
        query: {
          id: item.deliveryOrderId,
          timeId: Date.now()
        }
      })
    }
  }
}
</script>

<style></style>
