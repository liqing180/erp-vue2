<template>
  <div class="app-container report-card" v-loading="loading">
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :topShowCount="1"
      :showMenu="false"
      :isBtn="true"
      v-show="showSearch"
    />

    <div class="flex header">
      <ul class="tabs flexStart fs-0">
        <li
          class="tab"
          :class="{ 'tab-active': activeName === item.value }"
          :style="{ zIndex: tabs.length - index }"
          v-for="(item, index) in tabs"
          :key="index"
          @click="handleClick(item.value)"
        >
          <div class="flex">
            <span class="flow1">{{ item.label }}</span>
            <span class="fs-0" v-if="item.num">({{ item.num }})</span>
          </div>
          <div
            class="tag"
            :class="{ 'tag-active': activeName === item.value }"
            v-if="index !== tabs.length - 1"
          ></div>
          <div class="icon-right" v-if="index !== tabs.length - 1"></div>
        </li>
      </ul>
    </div>

    <ul class="box" v-if="tableList.length > 0">
      <li class="row" v-for="(item, index) in tableList" :key="index">
        <div class="desc flexSb">
          <div class="flexStart flow1">
            <div class="flexStart mr20 flow1">
              <div class="icon"></div>
              <div class="flow1" :title="item.businessPartnerName">
                {{ item.businessPartnerName }}
              </div>
            </div>
            <div class="flexStart mr20 flow1" v-if="item.salesInquiryNo">
              <div class="icon icon-1 fs-0"></div>
              <div class="flow1" :title="item.salesInquiryNo">
                <span
                  style="color: #0077ff; cursor: pointer"
                  @click="nav(item, 'salesInquiryNo')"
                  >{{ item.salesInquiryNo }}</span
                >
              </div>
            </div>
            <div class="flexStart mr20 flow1" v-if="item.serviceOrderNo">
              <div class="icon icon-1 fs-0"></div>
              <div class="flow1" :title="item.serviceOrderNo">
                <span
                  style="color: #0077ff; cursor: pointer"
                  @click="nav(item, 'serviceOrderNo')"
                  >{{ item.serviceOrderNo }}</span
                >
              </div>
            </div>
            <div class="flexStart mr20 flow1" v-if="item.salesQuotationNo">
              <div class="icon icon-1 fs-0"></div>
              <div class="flow1" :title="item.salesQuotationNo">
                <span
                  style="color: #0077ff; cursor: pointer"
                  @click="nav(item, 'salesQuotationNo')"
                  >{{ item.salesQuotationNo }}</span
                >
              </div>
            </div>
            <div class="flexStart flow1">
              <div class="icon icon-1 fs-0"></div>
              <div
                class="flow1"
                :title="
                  (item.salesOrderNo || '') +
                  '(' +
                  $t('PURCHASE.amount1') +
                  '：' +
                  item.currencySymbol +
                  ' ' +
                  $numberStr(item.totalAmount, 2) +
                  '；' +
                  $t('PURCHASE.orderType') +
                  '：' +
                  item.salesOrderTypeShowStr +
                  ')'
                "
              >
                <!-- <span>{{ $t('PURCHASE.salesOrderNo') }}：</span> -->
                <span
                  style="margin-right: 3px; color: #0077ff; cursor: pointer"
                  @click="nav(item, 'salesOrderNo')"
                  >{{ item.salesOrderNo }}</span
                >
                <span
                  >({{ $t('PURCHASE.amount1') }}：{{ item.currencySymbol }}
                  {{ $numberStr(item.totalAmount, 2) }} ；{{ $t('PURCHASE.orderType') }}：{{
                    item.salesOrderTypeShowStr
                  }})</span
                >
              </div>
            </div>
          </div>
          <div class="flexStart flow1">
            <div class="flexStart mr20 flow1" v-show="item.timeTakenShowStr">
              <div class="icon icon-3 fs-0"></div>
              <div
                class="flow1"
                style="font-weight: 700"
                :title="$t('PURCHASE.totalTime') + '：' + item.timeTakenShowStr"
              >
                {{ $t('PURCHASE.totalTime') }}：<span
                  :class="{ 'color-red': item.isTimeOut === '1' }"
                  >{{ item.timeTakenShowStr }}</span
                >
              </div>
            </div>
            <div class="flexStart flow1">
              <div class="icon icon-1 fs-0"></div>
              <div
                class="flow1"
                :title="$t('ui.status') + '：' + item.salesProcessViewStatusShowStr"
              >
                <span>{{ $t('ui.status') }}：</span>
                <span :class="'status-' + item.salesProcessViewStatus">{{
                  item.salesProcessViewStatusShowStr
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <ul class="card flexStart">
          <li class="item" v-for="(child, childIndex) in item.viewStageList" :key="childIndex">
            <div class="child-title">{{ moduleList[childIndex] }}</div>
            <div class="step-card">
              <ul class="flexCen">
                <li
                  class="flexCCen step-item flow1"
                  v-for="(son, sonIndex) in child.viewNodeList"
                  :key="sonIndex"
                >
                  <div class="flexStart" style="width: 100%">
                    <div
                      class="line flex-1"
                      :class="{
                        'line-active':
                          son.salesProcessViewNodeStatus !== '1' &&
                          son.salesProcessViewNodeStatus !== '5'
                      }"
                      :style="{ opacity: sonIndex === 0 ? '0' : '1' }"
                    ></div>
                    <div class="flexCCen fs-0" style="position: relative">
                      <img
                        src="./images/icon-8.png"
                        alt=""
                        class="step-icon"
                        v-if="son.salesProcessViewNodeStatus === '5'"
                      />
                      <img
                        src="./images/icon-5.png"
                        alt=""
                        class="step-icon"
                        v-else-if="son.salesProcessViewNodeStatus !== '1'"
                      />
                      <img src="./images/icon-6.png" alt="" class="step-icon" v-else />
                    </div>
                    <div
                      class="line flex-1"
                      :class="{
                        'line-active':
                          son.salesProcessViewNodeStatus !== '1' &&
                          son.salesProcessViewNodeStatus !== '5'
                      }"
                      :style="{ opacity: sonIndex === child.viewNodeList.length - 1 ? '0' : '1' }"
                    ></div>
                  </div>
                  <div
                    class="mt10 step-text flow1"
                    :class="{
                      'step-active':
                        son.salesProcessViewNodeStatus !== '1' &&
                        son.salesProcessViewNodeStatus !== '5'
                    }"
                    style="width: 100%"
                    :title="son.salesProcessViewNodeTypeShowStr"
                  >
                    {{ son.salesProcessViewNodeTypeShowStrAbbreviation }}
                  </div>
                </li>
              </ul>
              <div class="flexCen mt10">
                <div class="flexCen date flow1" v-if="child.timeTakenShowStr">
                  {{ $t('PURCHASE.timeTaken') }}：<span
                    class="flow1"
                    :class="{ 'color-red': child.isTimeOut === '1' }"
                    :title="child.timeTakenShowStr"
                    >{{ child.timeTakenShowStr }}</span
                  >
                </div>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>

    <el-empty :image-size="200" :description="$t('login.noData')" v-else></el-empty>

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
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import {
  queryCountList,
  querySalesProcessViewList,
  querySearchList
} from '@/api/salesReportManagement/salesProgressReport'
export default {
  name: 'SalesProgressReport',
  dicts: [],
  data() {
    const vm = this
    return {
      saveKey: '1',
      searchFormKey: Date.now(),
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      // 显示搜索条件
      showSearch: true,
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        businessGroupName: undefined
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('PURCHASE.salesOrderNo1')} / ${this.$t('ui.customerSearch')}`
        },
        {
          name: 'salesOrderTypeList',
          label: vm.$t('PURCHASE.orderType'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'salesOrderType',
          selectLabel: 'showStr',
          selectData: []
        },
        {
          name: 'isTimeOut',
          label: vm.$t('PURCHASE.isTimeout'),
          type: 'SelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('ui.y'), value: '1' },
            { label: this.$t('ui.n'), value: '0' }
          ]
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      createdInitTimer: '',
      tabs: [
        { label: this.$t('PURCHASE.all'), value: '0', num: undefined },
        { label: this.$t('PURCHASE.inquiry1'), value: '1', num: undefined },
        { label: this.$t('PURCHASE.inQuotation'), value: '2', num: undefined },
        { label: this.$t('PURCHASE.inTheOrder'), value: '3', num: undefined },
        { label: this.$t('PURCHASE.stockOut'), value: '4', num: undefined },
        { label: this.$t('PURCHASE.partialDelivery'), value: '5', num: undefined },
        { label: this.$t('PURCHASE.completed1'), value: '6', num: undefined }
      ],
      activeName: '0',
      moduleList: [
        this.$t('PURCHASE.inquiry1'),
        // this.$t('PURCHASE.enquiry'),
        this.$t('PURCHASE.inQuotation'),
        this.$t('PURCHASE.salesOrder'),
        this.$t('PURCHASE.delivery')
      ],
      timer: null,
      navLoading: false
    }
  },
  watch: {},
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.initQueryParams()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  deactivated() {
    this.clearTimer()
  },
  methods: {
    nav(row, type) {
      if (this.navLoading) return
      this.navLoading = true
      if (type === 'salesInquiryNo') {
        this.$router.push({
          path: '/salesManagement/viewSalesInquiry',
          query: {
            id: row.salesInquiryId,
            timeId: Date.now(),
            isView: '1'
          }
        })
      } else if (type === 'salesOrderNo') {
        this.$router.push({
          path: '/salesManagement/viewSalesOrder',
          query: {
            id: row.salesOrderId,
            timeId: Date.now()
          }
        })
      } else if (type === 'serviceOrderNo') {
        this.$router.push({
          path: '/salesManagement/viewServiceOrder',
          query: {
            id: row.serviceOrderId,
            timeId: Date.now()
          }
        })
      } else if (type === 'salesQuotationNo') {
        this.$router.push({
          path: '/salesManagement/viewSalesQuotation',
          query: {
            id: row.salesQuotationMainId,
            timeId: Date.now()
          }
        })
      }
      setTimeout(() => {
        this.navLoading = false
      }, 500)
    },
    handleClick(value) {
      if (this.activated === value) return
      this.activeName = value
      this.getList()
    },
    queryCountList() {
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      queryCountList(param).then((res) => {
        const { data } = res
        this.tabs.forEach((x) => (x.num = undefined))
        this.tabs.forEach((item, index) => {
          this.$set(item, 'num', data[item.value])
        })
      })
    },
    autoRefresh() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.timer = setInterval(() => {
        this.getList()
      }, 180 * 1000)
    },
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    },
    getList(query) {
      this.clearTimer()
      this.querySearchList()
      this.queryCountList()
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      param.labelType = this.activeName
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      this.loading = true
      querySalesProcessViewList(param)
        .then((response) => {
          const rows = response.rows || []
          this.tableList = rows
          this.loading = false
          this.total = response.total
          this.autoRefresh()
        })
        .catch(() => {
          this.tableList = []
          this.loading = false
        })
    },
    // 搜索下拉值
    querySearchList() {
      querySearchList({}).then((res) => {
        const { salesOrderTypeList } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'salesOrderTypeList') {
            this.$set(x, 'selectData', salesOrderTypeList)
          }
        })
      })
    },
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
      this.$set(this.queryParams, 'endDateCreatedTime', end)
      this.searchFormKey = Date.now()
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      this.initQueryParams()
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
.color-red {
  color: #f00;
}
.report-card {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 84px);
}
.status-1,
.status-3 {
  color: #333333;
}
.status-2 {
  color: #fa6400;
}
.status-4,
.status-5 {
  color: #4cca80;
}
.status-6 {
  color: #0077ff;
}
.header {
  padding: 10px 0;
  overflow: hidden;
  overflow-x: auto;
}
.header::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: initial;
}

.header::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(127, 135, 146, 0.5);
}

.header::-webkit-scrollbar-track {
  width: 10px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
.tabs {
  color: #fff;
  font-size: 16px;
  height: 34px;
  border-radius: 34px;
  background-color: #4cca80;
  overflow: hidden;

  .tab {
    position: relative;
    padding: 0 50px;
    // padding-left: 20px;
    padding-right: 30px;
    height: 34px;
    line-height: 34px;
    cursor: pointer;
  }
  .tab-active {
    background-color: #0077ff;
  }
  .tag {
    position: absolute;
    right: -14px;
    top: 0;
    width: 34px;
    height: 34px;
    background-color: #4cca80;
    transform: rotate(45deg);
  }
  .tag-active {
    background-color: #0077ff;
  }
  .icon-right {
    position: absolute;
    right: -30px;
    top: 0;
    width: 34px;
    height: 34px;
    background: url('./images/icon-7.png') center/30px no-repeat;
  }
}
.box {
  overflow: hidden;
  overflow: auto;
  flex: 1;
}
.row {
  min-width: 1200px;
  color: #333333;
  font-size: 12px;
  border: 1px solid #e6ebf4;
  border-radius: 8px;
  margin-top: 20px;
  .desc {
    padding: 15px 20px;
  }
  .icon {
    width: 17px;
    height: 17px;
    background: url('./images/icon-1.png') no-repeat left center;
    background-size: 14px;
  }
  .icon-1 {
    background-image: url('./images/icon-2.png');
  }
  .icon-3 {
    background-image: url('./images/icon-3.png');
  }
}
.card {
  .item {
    width: 20%;
    height: 160px;
  }
  .item:nth-child(2) {
    width: 25%;
  }
  .item:nth-child(4) {
    width: 35%;
  }
  // .item:nth-child(5) {
  //   width: 30%;
  // }
  .child-title {
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #f8f8f9;
  }
  .item:nth-child(2) {
    .child-title {
      background: #f9eae3;
    }
  }
  .item:nth-child(4) {
    .child-title {
      background: #ebf5ef;
    }
  }
  .date {
    color: #0077ff;
    font-size: 12px;
    height: 25px;
    background: #ffffff;
    border: 1px solid #0077ff;
    border-radius: 25px;
    padding: 0 10px;
  }
}
.step-card {
  padding: 20px 10px;
  .step-item {
    flex: 1;
    .line {
      width: 100%;
      height: 0px;
      border-top: 2px solid #93a5bb;
    }
    .line-active {
      border-top: 2px solid #0077ff;
    }
  }
  .step-icon {
    width: 26px;
    height: 26px;
    margin: 0 5px;
  }
  .step-text {
    color: #999;
    text-align: center;
  }
  .step-active {
    color: #0077ff;
  }
}
.item:nth-child(2) {
  .step-card {
    background-image: linear-gradient(180deg, #fa64001a 0%, #f9640100 62%);
  }
}

.item:nth-child(4) {
  .step-card {
    background-image: linear-gradient(180deg, #4cca801a 0%, #4cca8000 62%);
  }
}

.flow1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
