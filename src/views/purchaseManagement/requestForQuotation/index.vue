<template>
  <div class="app-container">
    <el-tabs
      ref="tabsRef"
      type="card"
      :key="'tabs_' + tabsKey"
      v-model="activeName"
      @tab-click="tabClickHandler"
    >
      <template v-for="(item, index) in tabs">
        <el-tab-pane
          size=""
          :key="index"
          :name="item.value"
          v-if="item.value === '0' || checkPermi([item.auth])"
        >
          <span slot="label">
            <div class="tabs-item-title">
              {{ item.name }}
              <el-badge
                :max="99"
                :key="item.value + badgeKey"
                class="tabs-item-badge"
                style="margin-left: 3px"
                :value="item.num"
              />
            </div>
          </span>
        </el-tab-pane>
      </template>
    </el-tabs>
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :topShowCount="1"
      @updateSearchData="updateSearchData"
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-if="enquiryAuth"
          >{{ $t('menu.enquiry') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleASLItems"
          v-if="ASLItemsAuth"
          >{{ $t('menu.ASLItems') }}</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          @click="handleMergeRFQs"
          v-if="mergeRFQsAuth"
          :disabled="selectList.length <= 0"
          >{{ $t('menu.mergeRFQs') }}</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleExportPDF"
          :loading="exportPDFLoading"
          v-if="exportPDFAuth"
          :disabled="ids.length <= 0"
          >{{ $t('menu.batchDownloadPDF') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-if="exportAuth"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>

      <right-toolbar
        ref="rightToolbar"
        :saveKey="activeName"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columnsInit="curColumns"
        :columns="configCurColumn"
        @autoRefresh="autoRefresh"
        :refreshTimeSaveKey="'1'"
      ></right-toolbar>
    </el-row>

    <el-table
      stripe
      ref="tables"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @select="handleSelectChange"
      @select-all="handleSelectAll"
      max-height="500"
      border=""
      tooltip-effect="light"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
        v-if="enquiryAuth || exportAuth || exportPDFAuth"
        :selectable="selectable"
      />
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in visibleCurColumns"
        :key="item.prop + item.colSortIndex + activeName"
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
          <el-switch
            v-if="item.prop === 'isActive'"
            v-model="scope.row[item.prop]"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template v-else-if="item.prop === 'businessPartnerName'">
            <div
              @mouseenter="showPop($event, scope.row, 'businessPartnerName')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text" :class="{ 'primary-link': BPAuth }">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'purchaseQuotationNo'">
            <div
              @mouseenter="showPop($event, scope.row, 'purchaseQuotationNo')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div
                class="ellipsis-text"
                :class="{
                  'primary-link': PQAuth
                }"
              >
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'documentNo'">
            <!-- <div v-if="activeName === '1'">
              <div
                class="ellipsis-text"
                :class="{ 'primary-link': documentTypeGetAuth(scope.row.documentType) }"
                @click="nav(scope.row, 'documentNo')"
              >
                {{ scope.row[item.prop] }}
              </div>
            </div> -->
            <!-- v-else -->
            <div
              @mouseenter="showPop($event, scope.row, 'documentNo')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text primary-link">{{ scope.row[item.prop] }}</div>
            </div>
          </template>
          <template v-else-if="item.prop === 'internalPartNo'">
            <div v-if="activeName === '1'">
              <div
                v-if="scope.row.isCustomProduct !== '1' && scope.row.isTemp !== '1'"
                class="ellipsis-text primary-link"
                @click="nav(scope.row, 'internalPartNo')"
              >
                {{ scope.row[item.prop] }}
              </div>
              <div v-else class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
            </div>
            <div
              v-else
              @mouseenter="showPop($event, scope.row, 'internalPartNo')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div
                :class="{
                  'primary-link': (scope.row.productList || []).find(
                    (x) => x.isCustomProduct !== '1'
                  )
                }"
                class="ellipsis-text"
              >
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'productName'">
            <div v-if="activeName === '1'">
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
            </div>
            <div
              v-else
              @mouseenter="showPop($event, scope.row, 'productName')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text">{{ scope.row[item.prop] }}</div>
            </div>
          </template>

          <template v-else-if="item.prop === 'purchaseQty'">
            <template>{{
              $numberStr(scope.row[item.prop], scope.row.decimalNum, scope.row.isAdhocEntry !== '1')
            }}</template>
          </template>
          <template v-else-if="item.prop === 'prBalanceBasicQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseUom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="190"
        fixed="right"
        class-name="small-padding fixed-width"
        v-if="isShowAction"
      >
        <!-- v-if="activeName === '0' || activeName === '4'" -->

        <template slot-scope="scope">
          <div class="flexCen">
            <div
              class="flexCen"
              v-if="
                (activeName === '0' || activeName === '3') &&
                scope.row.isCanGoToPO === '1' &&
                checkPermi(['purchaseManagement:requestForQuotation:createPO'])
              "
            >
              <!-- <span :title="$t('PURCHASE.createPO1')">
                <svg-icon
                  icon-class="shopping"
                  class="primary-pointer mr5"
                  style="font-size: 24px"
                  @click="handleNavCreatePO(scope.row)"
                />
              </span> -->
              <el-button type="text" @click="handleNavCreatePO(scope.row)">{{
                $t('PURCHASE.createPO')
              }}</el-button>
            </div>
            <div
              class="flexCen ml10"
              v-if="
                ['2', '3'].includes(activeName) && scope.row.isCanSendNewBusinessPartner === '1'
              "
            >
              <el-button type="text" @click="handleEnquiry(scope.row)">{{
                $t('PURCHASE.enquiry1')
              }}</el-button>
            </div>
            <div
              class="flexCen ml10"
              v-if="
                ['2'].includes(activeName) && PQAuth && quoteAuth && scope.row.isCanGoToPQ === '1'
              "
            >
              <el-button type="text" @click="handleQuote(scope.row)">{{
                $t('menu.quote')
              }}</el-button>
            </div>
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
    <!-- <div
      style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 20px"
      v-if="(curClickRow || {}).productId"
    >
      <purchaseQuotationRecord
        :propTimeId="curClickRowTimeId"
        :productId="(curClickRow || {}).productId"
        :rfqDetailId="(curClickRow || {}).rfqDetailId"
        :businessPartnerIdList="(curClickRow || {}).businessPartnerIdList"
      />
    </div> -->

    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <systemOperationLogTableDlg ref="systemOperationLogTableDlg" />

    <ToolTipShowListForFN ref="ToolTipShowList" @clickItem="clickItem" />

    <createdPOConfirm ref="createdPOConfirm" @onSuccess="createdPOConfirmSuccess" />

    <selectASLTable ref="selectASLTable" />
    <mergeRFQs ref="mergeRFQs" />

    <resendBPDlg ref="resendBPDlg" @onSuccess="getList" />
    <enterQuote ref="enterQuote" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import tableDataMixin from './tableDataMixin'
import locale from '@/views/purchaseManagement/lang/index'
import {
  queryCountList,
  querySearchList,
  queryRFQDetailList,
  // initRFQFromPR,
  queryCanSelectWarehouseListNoPage
} from '@/api/purchaseManagement/requestForQuotation'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'
// import purchaseQuotationRecord from '@/views/purchaseManagement/requestForQuotation/purchaseQuotationRecord.vue'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
import createdPOConfirm from '@/views/purchaseManagement/requestForQuotation/createdPOConfirm.vue'
import selectASLTable from './components/selectASLTable.vue'
import mergeRFQs from './components/mergeRFQs.vue'
import resendBPDlg from './components/resendBPDlg'
import enterQuote from './enterQuote'
// import { getToken } from '@/utils/auth'
export default {
  name: 'RequestForQuotation',
  mixins: [pageMixin, tableDataMixin],
  components: {
    systemOperationLogTableDlg,
    // purchaseQuotationRecord,
    ToolTipShowListForFN,
    createdPOConfirm,
    selectASLTable,
    mergeRFQs,
    resendBPDlg,
    enterQuote
  },
  data() {
    return {
      saveKey: '1',
      // 遮罩层
      loading: true,

      exportPDFLoading: false,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      selectList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined
      },
      statusDicts: [],
      statusDicts1: [],
      // 请求的时间戳
      queryTime: undefined,
      curClickRow: undefined,
      curClickRowTimeId: Date.now(),
      navTime: null,
      row: {}
    }
  },
  computed: {
    enquiryAuth() {
      let auth = false
      switch (this.activeName) {
        case '1':
          auth = this.checkPermi(['requestForQuotation:pendInquiry:enquiry'])
          break
      }
      return auth
    },
    ASLItemsAuth() {
      let auth = false
      switch (this.activeName) {
        case '1':
          auth = this.checkPermi(['requestForQuotation:pendInquiry:ASLItems'])
          break
      }
      return auth
    },
    mergeRFQsAuth() {
      let auth = false
      switch (this.activeName) {
        case '1':
          auth = this.checkPermi(['requestForQuotation:pendInquiry:mergeRFQs'])
          break
      }
      return auth
    },
    exportPDFAuth() {
      let auth = false
      if (this.activeName !== '1') {
        auth = this.checkPermi(['purchaseManagement:requestForQuotation:exportPDF'])
      }
      return auth
    },
    exportAuth() {
      let auth
      switch (this.activeName) {
        case '0':
          auth = this.checkPermi([
            'requestForQuotation:pendInquiry:export',
            'requestForQuotation:pendQuote:export',
            'requestForQuotation:quoted:export',
            'requestForQuotation:approved:export',
            'requestForQuotation:cancelled:export',
            'purchaseManagement:requestForQuotation:export',
            'purchaseManagement:open:export',
            'purchaseManagement:partiallyPurchased:export',
            'purchaseManagement:purchased:export'
          ])
          break
        case '1':
          auth = this.checkPermi(['requestForQuotation:pendInquiry:export'])
          break
        case '2':
          auth = this.checkPermi(['requestForQuotation:pendQuote:export'])
          break
        case '3':
          auth = this.checkPermi(['requestForQuotation:quoted:export'])
          break
        case '4':
          auth = this.checkPermi(['requestForQuotation:approved:export'])
          break
        case '5':
          auth = this.checkPermi(['requestForQuotation:cancelled:export'])
          break
        case '6':
          auth = this.checkPermi(['purchaseManagement:requestForQuotation:export'])
          break
        case '7':
          auth = this.checkPermi(['requestForQuotation:open:export'])
          break
        case '8':
          auth = this.checkPermi(['requestForQuotation:partiallyPurchased:export'])
          break
        case '9':
          auth = this.checkPermi(['requestForQuotation:purchased:export'])
          break
      }
      return auth
    },
    curColumns() {
      return this.columnsData[this.activeName] || []
    },
    configCurColumn() {
      let arr = [...this.curColumns]
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    visibleCurColumns() {
      let arr = this.curColumns.filter((column) => column.visible === true)
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    BPAuth() {
      return this.checkPermi(['businessPartner:businessPartner:list'])
    },
    PQAuth() {
      return this.checkPermi(['purchaseManagement:purchaseQuotation:list'])
    },
    quoteAuth() {
      return this.checkPermi(['requestForQuotation:pendQuote:quote'])
    },

    PRAuth() {
      return this.checkPermi(['purchaseManagement:purchaseRequisition:list'])
    },
    salesInquiryAuth() {
      return this.checkPermi(['salesManagement:salesInquiry:list'])
    },
    SQAuth() {
      return this.checkPermi(['salesManagement:salesQuotation:list'])
    },
    projectTemplateAuth() {
      return this.checkPermi(['projectManagement:projectTemplate:list'])
    },
    isShowAction() {
      const activeName = this.activeName
      return this.tableList.find((x) => {
        return (
          (['2', '3'].includes(activeName) && x.isCanGoToPO === '1') ||
          (['2', '3'].includes(activeName) && x.isCanSendNewBusinessPartner === '1') ||
          (['2'].includes(activeName) && this.PQAuth && this.quoteAuth && x.isCanGoToPQ === '1')
        )
      })
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  watch: {
    $route: {
      handler: function (route) {
        if (route.params.isGetList && route.name === 'RequestForQuotation') {
          this.activeName = '1'
          this.searchData = this.searchData1
          this.resetSearchForm(false)
          const params = route.params || {}
          // console.log('params', params)

          this.$set(this.queryParams, 'jumpToIds', params.ids)
          this.createdInitTimer = Date.now()
          this.getList()
        }
      },
      immediate: true
    }
  },
  async created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    // $$initColumnVisible 在 ./tableDataMixin.js 调用了
    const res = await this.MyDictDataClass.getDictFn('p_rfq_detail_status')
    const res1 = await this.MyDictDataClass.getDictFn('p_rfq_status')
    this.statusDicts = (res || []).map((item) => {
      return {
        label: item.dictLabel,
        value: item.dictValue
      }
    })
    this.statusDicts1 = (res1 || []).map((item) => {
      return {
        label: item.dictLabel,
        value: item.dictValue
      }
    })
    this.searchData0.forEach((item) => {
      if (item.name === 'rfqStatusList') {
        item.selectData = this.statusDicts1.filter((x) => x.value !== '8')
      }
    })
    this.searchData = this.searchData1
    if (this.createdInitTimer && Date.now() - (this.createdInitTimer || 0) < 2000) return
    this.createdInitTimer = Date.now()
    this.initQueryParams()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.clearSelection()
    this.getList()
  },
  methods: {
    handleEnquiry(row) {
      const item = JSON.parse(JSON.stringify(row))
      this.$refs.resendBPDlg.handleEnquiry(item)
    },
    handleQuote(row) {
      if (row.purchaseQuotationList && row.purchaseQuotationList.length === 1) {
        this.$router.push({
          path: '/purchaseManagement/editPurchaseQuotation',
          query: {
            id: row.purchaseQuotationList[0].purchaseQuotationId,
            timeId: Date.now(),
            backType: '2'
          }
        })
      } else if (row.purchaseQuotationList && row.purchaseQuotationList.length > 1) {
        const item = JSON.parse(JSON.stringify(row))
        this.$refs.enterQuote.open(item)
      }
    },
    handleNavCreatePO(row) {
      if (!this.checkPermi(['purchaseManagement:purchaseOrder:add'])) {
        this.$modal.msgError(this.$t('ui.notAuth'))
        return
      }
      const fromSrcPath = encodeURIComponent('/purchaseManagement/requestForQuotation')
      const purchaseQuotationList = row.purchaseQuotationList || []
      if (purchaseQuotationList.length === 1) {
        this.$router.push({
          path: '/purchaseManagement/addPurchaseOrder',
          query: {
            purchaseQuotationId: purchaseQuotationList[0].purchaseQuotationId,
            timeId: Date.now(),
            fromSrcPath
          }
        })
      } else if (purchaseQuotationList.length > 1) {
        this.$refs.createdPOConfirm.handleOpen(purchaseQuotationList)
      }
    },
    createdPOConfirmSuccess(purchaseQuotationId) {
      const fromSrcPath = encodeURIComponent('/purchaseManagement/requestForQuotation')
      this.$router.push({
        path: '/purchaseManagement/addPurchaseOrder',
        query: {
          purchaseQuotationId: purchaseQuotationId,
          timeId: Date.now(),
          fromSrcPath
        }
      })
    },
    documentTypeGetAuth(documentType) {
      const auth = {
        2: this.PRAuth,
        11: this.salesInquiryAuth,
        12: this.SQAuth,
        36: this.projectTemplateAuth,
        39: true
      }
      return auth[documentType]
    },
    showPop(e, row, type) {
      let list = []
      const { businessPartnerList, purchaseQuotationList, productList, documentList } = row
      if (type === 'businessPartnerName') {
        list = businessPartnerList.map((x) => {
          return {
            customName: x.businessPartnerName,
            customId: x.businessPartnerId,
            itemClass: this.BPAuth ? 'primary-pointer' : '',
            type
          }
        })
      } else if (type === 'purchaseQuotationNo') {
        list = purchaseQuotationList.map((x) => {
          return {
            customName: x.purchaseQuotationNo,
            customId: x.purchaseQuotationId,
            itemClass: this.PQAuth ? 'primary-pointer' : '',
            type
          }
        })
      } else if (type === 'internalPartNo') {
        list = productList.filter((x) => x.internalPartNo)
        list = list.map((x) => {
          return {
            customName:
              productList.length > 1
                ? (x.internalPartNo ? x.internalPartNo + ' - ' : '') + x.productName
                : x.internalPartNo,
            customId: x.productMainId,
            type,
            productType: x.productType,
            internalPartNo: x.internalPartNo,
            itemClass: x.isCustomProduct !== '1' ? 'primary-pointer' : ''
          }
        })
      } else if (type === 'documentNo') {
        list = documentList.map((x) => {
          return {
            customName: x.documentNo,
            customId: x.documentId,
            type,
            documentType: x.documentType,
            itemClass: this.documentTypeGetAuth(x.documentType) ? 'primary-pointer' : ''
          }
        })
      } else if (type === 'productName') {
        list = productList.map((x) => {
          return {
            customName: x.productName,
            customId: x.productMainId,
            type,
            productType: x.productType,
            internalPartNo: x.internalPartNo,
            itemClass: ''
          }
        })
      }

      const params = {
        labelKey: 'customName',
        list
      }
      if (list.length > 0 && this.$refs.ToolTipShowList) {
        this.$refs.ToolTipShowList.showPop(e, params)
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    clickItem(item) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      const { type, customId } = item
      if (type === 'businessPartnerName') {
        if (!this.BPAuth) return
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: customId,
            timeId: Date.now()
          }
        })
      } else if (type === 'purchaseQuotationNo') {
        if (!this.PQAuth) return
        this.$router.push({
          path: '/purchaseManagement/editPurchaseQuotation',
          query: {
            id: customId,
            timeId: Date.now(),
            backType: '2'
          }
        })
      } else if (type === 'internalPartNo') {
        if (item.internalPartNo === 'Adhoc Entry') {
          this.$router.push({
            path: '/productManagement/editProductInfo',
            query: {
              id: customId,
              timeId: Date.now(),
              back: '1'
            }
          })
        } else {
          if (item.isCustomProduct === '1') return
          this.$router.push({
            path: '/productManagement/viewExtendedProductInfo',
            query: {
              id: customId,
              timeId: Date.now()
            }
          })
        }
      } else if (type === 'documentNo') {
        if (!this.documentTypeGetAuth(item.documentType)) return
        if (item.documentType === '2') {
          this.$router.push({
            path: '/purchaseManagement/viewPurchaseRequisition',
            query: {
              id: customId,
              timeId: Date.now()
            }
          })
        }
        if (item.documentType === '11') {
          this.$router.push({
            path: '/salesManagement/viewSalesInquiry',
            query: {
              id: customId,
              timeId: Date.now()
            }
          })
        }
        if (item.documentType === '12') {
          this.$router.push({
            path: '/salesManagement/viewSalesQuotation',
            query: {
              id: customId,
              timeId: Date.now()
            }
          })
        }
        if (item.documentType === '36') {
          this.$router.push({
            path: '/projectManagement/viewProjectTemplate',
            query: {
              id: customId,
              timeId: Date.now()
            }
          })
        }

        if (item.documentType === '39') {
          this.$router.push({
            path: '/productManagement/viewMixDesign',
            query: {
              id: customId,
              timeId: Date.now()
            }
          })
        }
      }
    },
    nav(row, type) {
      if (type === 'businessPartnerName') {
        if (!this.BPAuth) return
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.businessPartnerId,
            timeId: Date.now()
          }
        })
      } else if (type === 'internalPartNo') {
        if (row.isAdhocEntry === '1') {
          this.$router.push({
            path: '/productManagement/editProductInfo',
            query: {
              id: row.productMainId,
              timeId: Date.now(),
              back: '1'
            }
          })
        } else {
          this.$router.push({
            path: '/productManagement/viewExtendedProductInfo',
            query: {
              id: row.productMainId,
              timeId: Date.now()
            }
          })
        }
      } else if (type === 'purchaseQuotationNo') {
        if (!this.PQAuth) return
        this.$router.push({
          path: '/purchaseManagement/editPurchaseQuotation',
          query: {
            id: row.purchaseQuotationId,
            timeId: Date.now(),
            backType: '2'
          }
        })
      } else if (type === 'documentNo') {
        if (!this.documentTypeGetAuth(row.documentType)) return
        if (row.documentType === '2') {
          this.$router.push({
            path: '/purchaseManagement/viewPurchaseRequisition',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }
        if (row.documentType === '11') {
          this.$router.push({
            path: '/salesManagement/viewSalesInquiry',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }
        if (row.documentType === '12') {
          this.$router.push({
            path: '/salesManagement/viewSalesQuotation',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }
        if (row.documentType === '36') {
          this.$router.push({
            path: '/projectManagement/viewProjectTemplate',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }

        if (row.documentType === '39') {
          this.$router.push({
            path: '/productManagement/viewMixDesign',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }
      }
    },
    initQueryParams(isResetDate = true) {
      const { pageSize, dateRange, startDateCreatedTime, endDateCreatedTime } = this.queryParams
      this.queryParams = {
        pageNum: 1,
        pageSize,
        dateRange,
        startDateCreatedTime,
        endDateCreatedTime
      }
      if (isResetDate) {
        const end = this.appointTime(Date.now(), '23:59:59')
        const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
        this.$set(this.queryParams, 'dateRange', [startTimer, end])
        this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
        this.$set(this.queryParams, 'endDateCreatedTime', end)
      }

      if (this.activeName === '1') {
        // this.searchData[1].selectId = 'conditionForPR'
        // this.queryParams.selectId = 'conditionForPR'
        this.searchData[1].selectId = 'conditionForDocumentNo'
        this.queryParams.selectId = 'conditionForDocumentNo'
      } else {
        this.searchData[1].selectId = 'conditionForRFQ'
        this.queryParams.selectId = 'conditionForRFQ'
      }
      this.searchData[1].inputVal = ''
    },
    tabClickHandler() {
      this.tableList = []
      if (this.activeName === '0') {
        this.searchData = this.searchData0
      } else if (this.activeName === '1') {
        this.searchData = this.searchData1
      } else if (this.activeName === '2' || this.activeName === '7') {
        this.searchData = this.searchData3
      } else if (this.activeName === '3') {
        this.searchData = this.searchData3
      } else if (this.activeName === '6') {
        this.searchData = this.searchData3
      } else if (this.activeName === '4') {
        this.searchData = this.searchData3
      } else {
        this.searchData = this.searchData2
      }
      this.curClickRow = undefined
      this.curClickRowTimeId = Date.now()
      this.clearSelection()
      this.initQueryParams(false)
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      let color = 'pointer'
      if (this.activeName === '1') {
        for (const item of this.ids.values()) {
          if (item === row.rfqDetailId) {
            color = 'pointer table-SelectedRow-bgcolor'
          }
        }
      } else {
        for (const item of this.ids.values()) {
          if (item === row.rfqId) {
            color = 'pointer table-SelectedRow-bgcolor'
          }
        }
      }

      return color
    },
    // eslint-disable-next-line no-unused-vars
    selectable(row, rowIndex) {
      if (row.adminFlag === 1) {
        return false // 禁用
      } else {
        return true // 不禁用
      }
    },
    autoRefresh() {
      this.getList({ noLoading: true })
    },
    queryCountList() {
      queryCountList({}).then((res) => {
        const data = res.data || {}
        this.tabs.forEach((item, index) => {
          this.$set(item, 'num', data[item.value])
        })
        // this.$set(this.tabs[0], 'num', '')
        // this.$set(this.tabs[1], 'num', data['0'])
        this.$nextTick(() => {
          this.badgeKey++
        })
      })
    },
    /** 查询用户列表 */
    getList(query) {
      this.$store.dispatch('getPurchaseTaskCount')
      const timer = Date.now()
      this.queryTime = timer
      this.queryCountList()
      this.querySearchList()
      this.loading = true
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        } else {
          this.tableList = []
        }
      }
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      let params = { ...this.queryParams }
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (params.departmentIdList && params.departmentIdList.length > 0) {
        params.departmentIdList = params.departmentIdList.map((x) => {
          return x[x.length - 1]
        })
      } else {
        params.departmentIdList = undefined
      }
      params = this.$trimOfObj(params)
      params.labelType = this.activeName
      queryRFQDetailList(params).then((response) => {
        if (timer !== this.queryTime) return
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          item.deliveryDate = this.parseTime(item.deliveryDate, this.fmtForYmd)
          item.rfqDetailStatusStr = this.selectDictLabel(this.statusDicts, item.rfqDetailStatus)
          item.rfqStatusStr = this.selectDictLabel(this.statusDicts1, item.rfqStatus)
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$nextTick(() => {
          if (this.activeName === '1') {
            this.selectList.forEach((row) => {
              this.tableList.forEach((item, index) => {
                if (row.rfqDetailId === item.rfqDetailId) {
                  this.$refs.tables.toggleRowSelection(item, true)
                }
              })
            })
          }
        })

        this.$$getColumnContentMaxWidth(this.curColumns, this.tableList)
      })
    },
    querySearchList() {
      querySearchList({ labelType: this.activeName }).then((res) => {
        const data = res.data || {}
        const vendorList = data.vendorList || []
        // const departmentList = data.departmentList || []
        const receiveDetailList = data.receiveAddressList || []
        const createdList = data.createdList || []

        this.conditionForRFQList = (data.conditionForRFQList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForPRList = (data.conditionForPRList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForPQList = (data.conditionForPQList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        const departmentList = data.branchCompanyList || []
        this.handle(departmentList)
        this.searchData.forEach((item) => {
          if (item.name === 'businessPartnerIdList') {
            this.$set(item, 'selectData', vendorList)
          } else if (item.name === 'departmentIdList') {
            this.$set(item, 'selectData', departmentList)
          } else if (item.name === 'receiveAddressNameList') {
            this.$set(item, 'selectData', receiveDetailList)
          } else if (item.name === 'createdIdList') {
            this.$set(item, 'selectData', createdList)
          }
        })

        this.setFuzzyData()
      })
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          x.value = x.branchCompanyId
          x.label = x.branchCompanyName
          if (x.departmentList && x.departmentList.length > 0) {
            x.children = x.departmentList.map((k) => {
              return {
                value: k.departmentId,
                label: k.departmentName
              }
            })
          }
        })
      }
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm(isGetList = true) {
      this.clearSelection()
      this.initQueryParams()

      this.$refs.tables.clearSort()
      if (isGetList) {
        this.getList()
      }
    },
    updateSearchData(e) {
      const item = this.searchData[e.index]
      if (item.name === 'selectAnInputName') {
        if (e.childType === 'all') {
          item.selectId = ''
          item.inputVal = ''
          this.setFuzzyData()
        } else if (e.childType === 'select') {
          item.selectId = e.value
          item.inputVal = ''
          this.setFuzzyData()
        } else {
          item.inputVal = e.value || ''
        }
      }
    },

    setFuzzyData() {
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          if (item.selectId === 'conditionForPQ') {
            this.$set(item, 'fuzzyData', this.conditionForPQList)
          } else if (item.selectId === 'conditionForPR') {
            this.$set(item, 'fuzzyData', this.conditionForPRList)
          } else if (item.selectId === 'conditionForRFQ') {
            this.$set(item, 'fuzzyData', this.conditionForRFQList)
          } else if (item.selectId === 'conditionForDocumentNo') {
            this.$set(item, 'fuzzyData', this.conditionForPRList)
          } else {
            this.$set(item, 'fuzzyData', [])
          }
        }
      })
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      /* 待询价页签采用支持分页勾选模式 */
      if (this.activeName === '1') {
        return
      }
      this.ids = selection.map((item) => item.rfqId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /* 各种情况清除选中 */
    clearSelection() {
      this.selectList = []
      this.ids = []
    },
    handleSelectChange(selection, row) {
      /* 待询价页签采用支持分页勾选模式,其他页签还是使用不分页勾选模式 */
      if (this.activeName !== '1') return
      const vm = this
      for (let i = 0; i < vm.selectList.length; i++) {
        if (vm.selectList[i].rfqDetailId === row.rfqDetailId) {
          vm.selectList.splice(i, 1)
          this.ids = vm.selectList.map((item) => item.rfqDetailId)
          return
        }
      }
      vm.selectList.push(row)
      this.ids = vm.selectList.map((item) => item.rfqDetailId)
    },
    handleSelectAll(selection) {
      if (this.activeName !== '1') return
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selectList.map((d) => d.rfqDetailId)
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item.rfqDetailId)) {
            vm.selectList.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item.rfqDetailId)
        vm.selectList = vm.selectList.filter((item) => !delArr.includes(item.rfqDetailId))
      }
      vm.ids = vm.selectList.map((item) => item.rfqDetailId)
    },
    handleRowClick(row, column) {
      if (column && column.property === 'picture') {
        return
      }
      if (this.activeName === '1') {
        this.curClickRow = row
        this.curClickRowTimeId = Date.now()

        let rowIdKey
        if (this.activeName === '1') {
          rowIdKey = 'rfqDetailId'
        } else {
          rowIdKey = 'rfqId'
        }
        const index = this.selectList.findIndex((item) => item[rowIdKey] === row[rowIdKey])
        const isSelected = index > -1
        if (isSelected) {
          this.selectList.splice(index, 1)
        } else {
          this.selectList.push(row)
        }
        this.ids = this.selectList.map((item) => item[rowIdKey])
        this.$refs.tables.toggleRowSelection(row, !isSelected)
      }
    },

    /** 新增按钮操作 */
    handleAdd() {
      if (this.ids.length > 0) {
        this.handleMergeRFQs()
        // initRFQFromPR({
        //   rfqDetailIdList: this.ids
        // }).then((res) => {
        //   this.$router.push({
        //     path: '/purchaseManagement/addRequestForQuotation',
        //     query: {
        //       timeId: Date.now(),
        //       rfqDetailIds: this.ids.join(',')
        //     }
        //   })
        // })
      } else {
        this.$router.push({
          path: '/purchaseManagement/addRequestForQuotation',
          query: {
            timeId: Date.now()
          }
        })
      }
    },
    handleASLItems() {
      this.$refs.selectASLTable.handleAdd()
    },
    handleMergeRFQs(row) {
      let selectList = []
      if (row) {
        selectList = [row]
      } else {
        selectList = [...this.selectList]
      }

      // this.$refs.mergeRFQs.handleAdd(selectList)
      let dropShipping
      let receiveAddressName
      let warehouseId
      let warehouseName
      if (selectList.some((x) => x.dropShipping === '1')) {
        dropShipping = '1'
      } else {
        dropShipping = '0'
      }

      let receiveAddressList = selectList
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
      receiveAddressList = Array.from(uniqueMap.values())
      if (dropShipping === '1') {
        if (receiveAddressList.length === 1) {
          receiveAddressName = receiveAddressList[0].value
        }

        this.$router.push({
          path: '/purchaseManagement/addRequestForQuotation',
          query: {
            timeId: Date.now(),
            rfqDetailIds: selectList.map((item) => item.rfqDetailId).join(','),
            isMergePrAddress: '1',
            dropShipping,
            receiveAddressName
          }
        })
      } else if (dropShipping === '0') {
        queryCanSelectWarehouseListNoPage({}).then((res) => {
          const warehouseList = res.data || []
          if (warehouseList.length === 1) {
            warehouseId = warehouseList[0].warehouseId
            warehouseName = warehouseList[0].warehouseName
          }
          this.$router.push({
            path: '/purchaseManagement/addRequestForQuotation',
            query: {
              timeId: Date.now(),
              rfqDetailIds: selectList.map((item) => item.rfqDetailId).join(','),
              isMergePrAddress: '1',
              dropShipping,
              warehouseId: warehouseId,
              warehouseName: warehouseName
            }
          })
        })
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      if (this.activeName === '7' || row.rfqStatus === '7') {
        this.$router.push({
          path: '/purchaseManagement/editRequestForQuotation',
          query: {
            id: row.rfqId,
            rfqDetailId: row.rfqDetailId,
            timeId: Date.now()
          }
        })
        return
      }
      if (this.enquiryAuth && this.activeName === '1') {
        this.handleMergeRFQs(row)
        // initRFQFromPR({
        //   rfqDetailIdList: [row.rfqDetailId]
        // }).then((res) => {
        //   this.$router.push({
        //     path: '/purchaseManagement/addRequestForQuotation',
        //     query: {
        //       timeId: Date.now(),
        //       rfqDetailIds: row.rfqDetailId
        //     }
        //   })
        // })
      } else {
        this.$router.push({
          path: '/purchaseManagement/viewRequestForQuotation',
          query: {
            id: row.rfqId,
            rfqDetailId: row.rfqDetailId,
            timeId: Date.now()
          }
        })
      }
    },

    /** 导出按钮操作 */
    /** 导出按钮操作 */
    openExport() {
      this.$refs.ExportDlgRef.open()
    },
    handleExport(data) {
      const vm = this
      const { exportType } = data
      let params = { ...this.queryParams }
      params = JSON.parse(JSON.stringify(params))
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      params = this.$trimOfObj(params)
      params.labelType = this.activeName
      params.exportType = exportType
      if (params.departmentIdList && params.departmentIdList.length > 0) {
        params.departmentIdList = params.departmentIdList.map((x) => {
          return x[x.length - 1]
        })
      } else {
        params.departmentIdList = undefined
      }
      if (exportType === 2) {
        if (this.activeName === '1') {
          params.exportIdList = vm.tableList.map((item) => item.rfqDetailId)
        } else {
          params.exportIdList = vm.tableList.map((item) => item.rfqId)
        }
        // params.exportIdList = vm.tableList.map((item) => item.rfqDetailId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }

      params.exportFields = this.getTablePropListForSort(this.visibleCurColumns)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/purchase/requestForQuotation/export',
        params,
        `${this.getFileNameDate('Request For Quotation')}.xlsx`
      )
        .then((res) => {
          vm.exportLoading = false
          vm.$refs.ExportDlgRef.hide()
          vm.$modal.msgSuccess(vm.$t('ui.exportSuccess'))
        })
        .catch(() => {
          vm.exportLoading = false
        })
    },
    handleExportPDF() {
      const vm = this
      this.exportPDFLoading = true
      this.$importOrExportDownFile(
        '/purchase/requestForQuotation/downloadPDF',
        {
          rfqIdList: this.ids
        },
        `${this.getFileNameDate('RFQ PDF')}.zip`
      )
        .then((res) => {
          vm.exportPDFLoading = false
          // vm.$refs.ExportDlgRef.hide()
          vm.$modal.msgSuccess(vm.$t('ui.exportSuccess'))
        })
        .catch(() => {
          vm.exportPDFLoading = false
        })
      /* const token = getToken()
      const rfqIdListStr = this.ids.join(',')
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/purchase/requestForQuotation/downloadPDF' +
        `/${rfqIdListStr}` +
        '?token=' +
        `${token}`
      window.location = myUrl */
    }
  }
}
</script>

<style lang="scss" scoped>
.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
    margin-right: 10px;
  }
}
.dept-select {
  /deep/ .vue-treeselect--disabled .vue-treeselect__control {
    background-color: #f5f7fa;
  }
  /deep/ .vue-treeselect__single-value {
    color: #c0c4cc;
  }
}
</style>
