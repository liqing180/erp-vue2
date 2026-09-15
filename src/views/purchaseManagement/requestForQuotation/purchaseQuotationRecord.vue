<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <div class="flexSb">
        <el-col :span="1.5">
          <el-form :inline="true" @submit.native.prevent class="search-warp">
            <el-form-item style="flex-shrink: 0; margin-right: 100px">
              <span style="font-weight: bold; font-size: 16px">
                {{ $t('PURCHASE.purchaseQuotationRecord') }}
              </span>
            </el-form-item>
            <el-form-item :label="$t('PURCHASE.supplier')">
              <el-select
                size="small"
                v-model="queryParams.businessPartnerIdForSearchList"
                @change="bpChange"
                placeholder=""
                style="width: 200px"
                multiple
                collapse-tags
                clearable
                class="log-msg-ellipsis"
              >
                <el-option
                  v-for="dict in vendorList"
                  :key="dict.businessPartnerId"
                  :label="dict.businessPartnerName"
                  :value="dict.businessPartnerId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="1.5">
          <div class="flexStart">
            <div class="pointer">
              <el-checkbox v-model="queryParams.lastTime" @change="lastTimeChange">{{
                $t('PURCHASE.lastTime')
              }}</el-checkbox>
            </div>
            <right-toolbar
              :saveKey="saveKey"
              :savePath="savePath"
              @queryTable="queryTable"
              :columns="configColumn"
              :columnsInit="columns"
            ></right-toolbar>
          </div>
        </el-col>
      </div>
    </el-row>
    <el-table
      stripe
      ref="tables"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      max-height="500"
      style="cursor: pointer"
    >
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
          <el-switch
            v-if="item.prop === 'isActive'"
            v-model="scope.row[item.prop]"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template v-else-if="['businessPartnerName'].includes(item.prop)">
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="businessPartner"
              @click="nav(scope.row, item.prop)"
            />
          </template>
          <template v-else-if="['documentNo'].includes(item.prop)">
            <span
              :class="{ 'primary-link': documentTypeGetAuth(scope.row.priceType) }"
              @click="nav(scope.row, item.prop)"
              >{{ scope.row[item.prop] }}</span
            >
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            {{ $numberStr(scope.row.unitPrice, 2) }}
          </template>
          <template v-else-if="item.prop === 'purchaseQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseUom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="120"
        fixed="right"
        class-name="small-padding fixed-width"
        v-if="tableList.find((x) => x.pplIsCanUse === '1')"
      >
        <template slot-scope="scope" v-if="scope.row.pplIsCanUse === '1'">
          <div class="flexCen">
            <svg-icon
              icon-class="shopping"
              class="primary-pointer mr5"
              style="font-size: 24px"
              @click="handleNavCreatePO(scope.row)"
            />
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
  </div>
</template>

<script>
import { queryPPLList, querySearchListForPPL } from '@/api/purchaseManagement/requestForQuotation'
import pageMixin from '@/mixins/tableMinx'
export default {
  mixins: [pageMixin],
  dicts: ['p_price_type'],
  props: {
    productId: {
      type: String,
      default: ''
    },
    rfqDetailId: {
      type: String,
      default: ''
    },
    propTimeId: {
      type: [String, Number],
      default: ''
    },
    businessPartnerIdList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler(value) {
        this.$set(this.queryParams, 'businessPartnerIdForSearchList', [])
        this.getList()
        this.querySearchListForPPL()
      }
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  data() {
    const vm = this
    return {
      saveKey: '36',
      savePath: 'purchaseMTable',
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 用户表格数据
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined,
        lastTime: false
      },
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.purchaseQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          padding: 50,
          align: 'right'
        },
        {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.priceSource'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'receiveAddressName',
          label: vm.$t('PURCHASE.deliveryAddress'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'validity',
          label: vm.$t('PURCHASE.validityDays'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'priceType',
          propBy: 'priceTypeStr',
          label: vm.$t('PURCHASE.priceType'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
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
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }
      ],
      vendorList: [],
      // 请求的时间戳
      queryTime: undefined,
      checked: false
    }
  },
  computed: {
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
    POAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:list'])
    }
  },
  methods: {
    documentTypeGetAuth(documentType) {
      const auth = {
        1: this.PQAuth,
        2: true,
        3: this.POAuth
      }
      return auth[documentType]
    },
    handleNavCreatePO(row) {
      if (!this.checkPermi(['purchaseManagement:purchaseOrder:add'])) {
        this.$modal.msgError(this.$t('ui.notAuth'))
        return
      }
      const fromSrcPath = encodeURIComponent('/purchaseManagement/requestForQuotation')
      this.$router.push({
        path: '/purchaseManagement/addPurchaseOrder',
        query: {
          rfqId: this.rfqDetailId,
          pplId: row.purchasePriceId,
          timeId: Date.now(),
          fromSrcPath
        }
      })
    },
    querySearchListForPPL() {
      if (!this.productId) {
        this.vendorList = []
        return
      }
      const params = {}
      const { lastTime } = this.queryParams
      params.isLastTime = lastTime ? '1' : '0'
      params.productId = this.productId
      querySearchListForPPL(params).then((res) => {
        const data = res.data || {}
        this.vendorList = data.vendorList || []
      })
    },
    bpChange() {
      this.getList()
    },
    lastTimeChange() {
      this.getList()
      this.querySearchListForPPL()
    },
    getList() {
      if (!this.productId) {
        this.tableList = []
        this.loading = false
        return
      }
      this.loading = true
      const timer = Date.now()
      this.queryTime = timer
      const params = JSON.parse(JSON.stringify(this.queryParams))
      params.productId = this.productId
      params.isLastTime = params.lastTime ? '1' : '0'
      this.$trimOfObj(params)
      queryPPLList(params).then((response) => {
        if (timer !== this.queryTime) return
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.validity = this.parseTime(item.validity, this.fmtForYmd)
          item.priceTypeStr = this.selectDictLabel(this.dict.type.p_price_type, item.priceType)
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      /* if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/purchaseManagement/viewRequestForQuotation',
        query: {
          id: row.rfqId,
          rfqDetailId: row.rfqDetailId,
          timeId: Date.now()
        }
      }) */
    },
    nav(row, type) {
      if (type === 'businessPartnerName') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.businessPartnerId,
            timeId: Date.now()
          }
        })
      } else if (type === 'documentNo') {
        if (!this.documentTypeGetAuth(row.priceType)) return
        switch (row.priceType) {
          case '1': // PQ
            this.$router.push({
              path: '/purchaseManagement/editPurchaseQuotation',
              query: {
                id: row.documentId,
                timeId: Date.now(),
                backType: '2'
              }
            })
            break
          case '2': // PC
            this.$router.push({
              path: '/purchaseManagement/viewPurchaseContract',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '3': // PO
            this.$router.push({
              path: '/purchaseManagement/viewPurchaseOrder',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.search-warp {
  /deep/ .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
