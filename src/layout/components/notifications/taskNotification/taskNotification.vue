<!--
* <p>Title:dashbord</p>
* <p>Description: </p>
* <p>Copyright: Copyright (c) 2
* <p>Company: IMG LOGICS
* @author Song Jiang - Alter
* @version v1.0 2019-1-16
*-->
<template>
  <div class="notification">
    <div class="content">
      <div class="title">
        <el-row type="flex">
          <el-col>
            <el-tabs v-model="tabActiveName" type="card" @tab-click="handleClick">
              <el-tab-pane name="first">
                <span slot="label" class="flex">
                  {{ $t('notification.unreadNotifications') }}
                  <el-badge
                    v-if="unReadNum > 0"
                    class="ml5"
                    :value="unReadNum"
                    :max="99"
                  ></el-badge>
                </span>
              </el-tab-pane>
              <el-tab-pane :label="$t('notification.readNotifications')" name="second">
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col>
            <div>
              <div>
                <el-button
                  v-show="
                    tabActiveName === 'first' && checkPermi(['system:notifications:batchRead'])
                  "
                  :disabled="tableData.length <= 0 || table_loading"
                  type="primary"
                  size="mini"
                  class="fr"
                  @click="handleSetPageRead"
                >
                  <svg-icon icon-class="a-shanchuqingchu" style="font-size: 16px" />
                </el-button>
                <div class="fr" style="margin-right: 10px">
                  <el-select
                    v-model="queryParams.documentTypeList"
                    @change="changeFrom"
                    style="width: 200px"
                    clearable
                    size="small"
                    placeholder=""
                    multiple
                    collapse-tags
                    class="log-msg-ellipsis"
                  >
                    <el-option
                      v-for="dict in NotificationsTypeList"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-loading="table_loading" class="scoll-wrapper" :key="tableKey">
        <div
          v-if="tableData.length <= 0"
          style="text-align: center; color: #909399; font-size: 14px"
        >
          <el-divider></el-divider>
          <span>{{ $t('ui.noData') }}</span>
          <el-divider></el-divider>
          <!-- No Data / 暂无数据 -->
        </div>

        <el-collapse v-else v-model="activeName" accordion>
          <el-collapse-item
            v-for="(item, index) in tableData"
            :key="`${item.id}`"
            class="bg-wihte"
            :name="index"
          >
            <!-- @click.native="handleChange(item)" -->
            <template slot="title">
              <div class="read" :class="{ active: item.status === 1 }">
                <div class="ellipsis"><i class="read-status"></i>{{ item.titleName }}</div>
                <p>{{ parseTime(item.sendTime) }}</p>
              </div>
            </template>
            <div class="read-content">
              <!-- @click="$sysNotifyClass.testMsgShow(item)" -->
              <div class="content-content">
                <div
                  class="content-row"
                  v-for="row in $sysNotifyClass.createContent(item, false)"
                  :key="row.messageId"
                >
                  <template
                    v-if="
                      item.templateKey === 'Product_Master_BUSINESS_GROUP_UPDATE_PRODUCT' ||
                      item.templateKey === 'Emergency_Goods_Receipt_PROCUREMENT' ||
                      item.templateKey === 'PRE_DELIVERY_NOTICE_Sys_Created_FROM_PO' ||
                      item.templateKey === 'SALES_INQUIRY_Quoted' ||
                      item.templateKey === 'DELIVERY_ORDER_Created'
                    "
                  >
                    <div
                      class="text-content row-text"
                      style="line-height: 1.8"
                      v-html="formatText(row.value)"
                    ></div>
                  </template>
                  <template v-else>
                    <span class="row-label" v-if="row.label !== 'null'">{{ row.label }}</span>
                    <span class="row-label" v-if="row.label !== 'null' && row.value !== 'null'"
                      >:</span
                    >
                    <span v-if="row.value !== 'null'" class="row-text">{{ row.value }}</span>
                  </template>
                </div>
              </div>
              <div class="content-footer">
                <el-button
                  size="mini"
                  v-if="item.templateKey === 'DELIVERY_ORDER_Created'"
                  @click="handlePrintPDF(item, index)"
                  plain
                  >{{ $t('notification.printPDF') }}</el-button
                >
                <el-button
                  size="mini"
                  v-if="getShowResolve(item)"
                  @click="handleResolve(item)"
                  type="primary"
                  >{{ getResolveBtnText(item) }}</el-button
                >
                <el-button
                  size="mini"
                  v-if="tabActiveName === 'first'"
                  @click="handleLeftButton(item, index)"
                  plain
                  >{{ $t('notification.read') }}</el-button
                >
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <pagination
        :saveKey="saveKey"
        :savePath="savePath"
        v-show="total > 0"
        :pagerCount="5"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList('pagination')"
        small
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import locale from './locale'
import {
  queryMessage,
  markRead,
  queryTaskNotificationsType,
  pushAppNotifications
} from '@/api/notice/notice'
import pageMixin from '@/mixins/tableMinx'
import { getToken } from '@/utils/auth'
export default {
  mixins: [pageMixin],
  data() {
    return {
      saveKey: '1',
      savePath: 'Notification',
      tabActiveName: 'first',
      activeName: -1,
      table_loading: false,
      curPage: 1,
      pages: 2,
      total: 0,
      pageSize: 25,
      pageSizes: [10, 20, 50],
      tableData: [],
      tableKey: '0',
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        documentTypeList: []
      },
      NotificationsTypeList: [],
      // 请求的时间戳
      queryTime: undefined,
      text: '产品主数据已更新, 请补充对应的本地语言信息.\n 产品: [测试信息同步] - [010012]\n 更新字段: 测试信息同步231, , 描述'
    }
  },
  computed: {
    ...mapGetters(['fmtForYmdhms']),
    ...mapState({ unReadNum: (state) => state.user.unReadNum }),
    salesOrderAuth() {
      return this.checkPermi(['sales:salesOrder:list'])
    },
    orderManagementAuth() {
      return this.checkPermi(['dispatchManagement:orderManagement:list'])
    },
    salesOrderAllAuth() {
      return this.salesOrderAuth || this.orderManagementAuth
    },
    loadOrderAuth() {
      return this.checkPermi(['dispatchManagement:loadOrderDispatching:index'])
    },
    DOsWithExceptionsAuth() {
      return this.checkPermi(['dispatchManagement:DOsWithExceptions:list'])
    },
    truckAuth() {
      return this.checkPermi(['operation:truck:list'])
    },
    overviewAuth() {
      return this.checkPermi(['reportManagement:overviewDashboard:list'])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey, this.savePath)
    // this.init()
  },
  methods: {
    formatText(str) {
      return str.replace(/\n/g, '<br />')
    },
    getResolveBtnText() {
      return this.$t('notification.detail')
    },
    getShowResolve(item) {
      if (item.showResolve) {
        if (item.showType === '11-goto') {
          return this.truckAuth
        }
        return true
      }
      return false
    },
    init() {
      this.tabActiveName = 'first'
      this.tableData = []
      this.queryParams.pageNum = 1
      this.queryParams.documentTypeList = []
      this.getList('init')
    },
    handleClick() {
      this.tableData = []
      this.queryParams.pageNum = 1
      this.queryParams.documentTypeList = []
      this.getList('tab-click')
    },
    changeFrom() {
      this.getList('change-from')
    },
    async handleSetPageRead() {
      try {
        const ids = this.tableData
          .map((item) => {
            this.$set(item, 'status', 1)
            return item.id
          })
          .join(',')
        const res = await this.markRead(ids)
        if (res !== undefined) {
          this.getList('page-read')
          this.$store.commit('setUnReadNum', res)
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    handlePrintPDF(item) {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/sales/deliveryOrder/preview' +
        `/${item.documentId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    handleLeftButton(item) {
      this.handleRead(item)
    },
    async handleRead(item) {
      const { id, status } = item
      if (status === 1) return
      const res = await this.markRead(id + '')
      if (res !== undefined) {
        this.$set(item, 'status', 1)
        this.getList('row-read')
        this.$store.commit('setUnReadNum', res)
      }
    },
    async handleResolve(item) {
      /* const check = await this.$sysNotifyClass.checkZone(item.zoneId)
      if (!check) return */
      this.$sysNotifyClass.clickHandler(item, 'resolve', item.messageId)

      this.$emit('closeDrawer')
    },
    handleNotificationDriver(item) {
      // this.handleRead(item) 15, 20, 24 操作通知司机与跟踪按钮, 不算已读
      pushAppNotifications({
        truckId: item.truckId,
        taskNotificationsType: item.taskNotificationsType
      }).then((res) => {})
    },
    markRead(ids) {
      const vm = this

      const param = {
        ids
      }
      return new Promise((resolve) => {
        markRead(param)
          .then((res) => {
            if (res.code === 200) {
              const idList = ids.split(',')
              /* 已阅读, 关闭对应的全局弹窗 */
              idList.forEach((messageId) => {
                if (this.$sysNotifyClass.notifyComponent[messageId]) {
                  this.$sysNotifyClass.notifyComponent[messageId].close()
                  delete this.$sysNotifyClass.notifyComponent[messageId]
                }
                this.$sysNotifyClass.closeNotify(messageId)
              })
              resolve(res.data)
            } else {
              vm.$modal.msgError(res.message)
            }
          })
          .catch(() => {})
      })
    },
    getList(queryType) {
      const vm = this
      const timer = Date.now()
      this.queryTime = timer
      vm.table_loading = true

      if (queryType === 'row-read') {
        // this.activeName = 0
      } else {
        this.activeName = 0
      }

      this.queryParams.status = this.tabActiveName === 'first' ? 0 : 1
      queryTaskNotificationsType({ status: this.queryParams.status }).then((res) => {
        this.NotificationsTypeList = res.data || {}
      })
      queryMessage(this.queryParams)
        .then((response) => {
          if (timer !== this.queryTime) return
          vm.tableData = response.rows.map((item) => {
            delete item.messageContent.id
            item = Object.assign(item, item.messageContent)
            item.messageId = item.id
            // item.taskNotificationsType = 28

            item.showType = item.documentType
            item.showResolve = this.$sysNotifyClass.getShowResolve(item)

            return item
          })

          this.tableKey = Math.random()

          vm.total = response.total

          vm.table_loading = false
        })
        .catch(() => {
          /* vm.tableData = [
            {
              popupSettings: 'top-left',
              showType: '1',
              content: '111111111'
            }
          ] */
          vm.table_loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.text-content {
  /* 可选：移除 pre 标签默认的 monospace 字体和边距 */
  font-family: inherit;
  // white-space: pre-wrap; /* 让长文本自动换行（超出容器宽度时） */
  margin: 0;
  white-space: pre-line;
}
.bg-wihte /deep/.el-collapse-item__header {
  background: #fff;
  color: #000;
  font-weight: 500;
}
.bg-wihte /deep/.el-collapse-item__content {
  background: #f3f6f8;
  padding-bottom: 0px;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.notification {
  display: flex;
  flex-flow: row;
  height: calc(100vh - 80px);
  padding: 0 20px;
  margin-top: 20px;
  background: #fff;

  > .content {
    flex: 1;
    height: inherit;
    box-sizing: border-box;
    padding-bottom: 34px;

    .read-content {
      padding-bottom: 5px;
      .content-content {
        padding-top: 5px;
      }
      .content-row {
        // width: 480px;
        padding: 4px 10px;
        font-size: 14px;
        line-height: 16px;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      }
      .row-label {
        color: #444;
        font-weight: bold;
        margin-right: 4px;
      }
      .row-text {
        color: #666;
      }
      .content-footer {
        // margin-top: 10px;
        margin-right: 10px;
        text-align: right;
      }
      // text-indent: 40px;
      // padding: 10px 0 10px 10px;
    }
    > .title {
      height: 50px;
      // font-size: 1.17em;
      // line-height: 75px;
      // text-indent: 20px;
      // border-bottom: 1px solid #dcdfe6;
      // font-weight: bold;
    }
    > .scoll-wrapper {
      max-height: calc(100% - 100px);
      overflow: auto;
    }
    .read {
      display: flex;
      flex-flow: row;
      width: 100%;
      overflow: hidden;
      height: 100%;
      align-items: center;
      > div {
        flex: 1;
      }
      > p {
        width: 180px;
        font-size: 12px;
        margin: 0;
        padding: 0;
      }
      .read-status {
        display: inline-block;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: #f56c6c;
        margin: 0 10px;
      }
      &.active {
        // color: #ccc;
        .read-status {
          background: #ccc;
        }
      }
    }
  }
}
.bqt-Timer {
  color: #000 !important;
  position: relative;
  top: 1px;
  right: 2px;
}
</style>
