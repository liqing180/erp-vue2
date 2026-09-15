<template>
  <div class="small-bell" :class="{ active: unReadNum > 0 }" @click="handleBadgeClick">
    <i class="el-icon-message-solid" style="font-size: 20px"></i>
    <!-- {{ unReadNum }} -->
    <!-- <svg-icon icon-class="question" /> -->
    <el-drawer
      append-to-body
      :visible.sync="visible"
      direction="rtl"
      custom-class="msg-drawer"
      :before-close="handleClose"
      size="700px"
    >
      <div slot="title" class="el-dialog__title">
        <span>{{ $t('notification.notifications') }}</span>
        <div
          @click="openSetting"
          class="fr flexCen primary-pointer"
          style="margin-top: 0px; margin-right: 20px"
        >
          <svg-icon icon-class="system" style="font-size: 20px" />
          <span style="font-size: 14px">{{ $t('notification.setting') }}</span>
        </div>
      </div>
      <taskNotification @closeDrawer="closeDrawer" ref="taskNotification" />
    </el-drawer>

    <settingDlg ref="settingDlg" />
    <template v-if="showCustomerQuestionnaire">
      <previewQuestionnaireTemplateDlg
        :isCancel="true"
        ref="previewQuestionnaireTemplateDlg"
        @closed="showCustomerQuestionnaire = false"
      />
    </template>
  </div>
</template>

<script>
import webSocketClient from '@/utils/webSocketClient/webSocketClient'
import taskNotification from '@/layout/components/notifications/taskNotification/taskNotification.vue'
import settingDlg from './taskNotification/settingDlg.vue'
import {
  wsNotice,
  unread,
  queryMessageContent,
  queryMessageContentBatch
} from '@/api/notice/notice'
import { mapState } from 'vuex'
import SysNotifyClass from '@/layout/components/notifications/sysNotify/sysNotify.js'
import locale from '@/layout/components/notifications/taskNotification/locale.js'
import previewQuestionnaireTemplateDlg from '@/views/salesManagement/questionnaireTemplate/components/previewQuestionnaireTemplateDlg.vue'

import { queryCustomerQuestionnaireById } from '@/api/salesManagement/customerQuestionnaire'
export default {
  components: { taskNotification, settingDlg, previewQuestionnaireTemplateDlg },

  computed: {
    ...mapState({
      unReadNum: (state) => state.user.unReadNum,
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device
    })
  },
  watch: {
    'sidebar.opened': {
      handler(val) {
        this.setDlgLeft()
      },
      immediate: true
    },
    device: {
      handler(val) {
        this.setDlgLeft()
      },
      immediate: true
    }
  },
  props: {},
  inject: ['reload'],
  data() {
    return {
      WS: undefined,
      WSIsOk: false,
      visible: false,
      reconnectTime: Date.now(), // 上次重连发起时间
      RECONNECT_INTERVAL: 30000, // 发起重连的最小间隔时间
      MAX_RECONNECT_ATTEMPTS: 5, // 最大重连次数
      reconnectAttempts: 0, // 重连累计次数
      lastHeartbeatTime: null, // 最后一次接受消息时间
      timer1: null, // 心跳包定时器
      timer2: null, // 检测心跳定时器
      showCustomerQuestionnaire: false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },

  created() {
    SysNotifyClass.$reload = this.reload
    this.getUnReadMsg()
    this.unread()
    this.initEventBus()
  },
  beforeDestroy() {
    const vm = this
    vm.destroyEventBus()
    vm.WS.close()
    SysNotifyClass.closeNotifyAll()
    vm.closeSendInterval()
    vm.closeCheckInterval()
  },
  methods: {
    setDlgLeft() {
      let left = 0
      if (this.sidebar.opened) {
        left = 240
      } else {
        if (this.device === 'mobile') {
          left = 0
        } else {
          left = 54
        }
      }
      const dlgs = document.querySelectorAll('.my-notification-left') || []
      dlgs.forEach((item) => {
        item.style.setProperty('--msg-dlg-margin-left', left + 'px')
      })
    },
    initEventBus() {
      this.destroyEventBus()
      this.$EventBus.$on('taskNotificationOpenDlg', (params) => {
        if (params.type === 'customerQuestionnaire') {
          this.showCustomerQuestionnaire = true
          queryCustomerQuestionnaireById({
            customerQuestionnaireId: params.customerQuestionnaireId
          })
            .then((res) => {
              this.$refs.previewQuestionnaireTemplateDlg.handleOpen(res.data)
            })
            .catch(() => {})
        }
      })
    },
    destroyEventBus() {
      this.$EventBus.$off('taskNotificationOpenDlg')
    },
    openSetting() {
      this.$refs.settingDlg.handleUpdate()
    },
    handleClose(done) {
      done()
    },
    closeDrawer() {
      this.visible = false
    },
    handleBadgeClick() {
      this.visible = true
      this.unread()
      this.$nextTick(() => {
        this.$refs.taskNotification.init()
      })

      // this.$router.push('/user/sysMessage').catch(() => {})
    },
    getUnReadMsg() {
      console.log('webSocket 连接中')
      const vm = this
      const userId = this.$store.state.user.userId
      vm.WS = webSocketClient(wsNotice(userId), null, function () {
        // 不能用箭头函数
        try {
          const evt = arguments[0]
          if (evt.type === 'onclose') {
            vm.WSIsOk = false
            console.log('webSocket 被关闭')
            return
          }
          // console.log(evt)
          const { data } = evt

          const jsonData = JSON.parse(data)

          if ((jsonData.msg + '').toLowerCase() === 'ok') {
            if (vm.WSIsOk === false) {
              console.log('webSocket 连接成功')
            }
            vm.WSIsOk = true
            vm.reconnectAttempts = 0
            vm.lastHeartbeatTime = Date.now()
            if (jsonData.type + '' === '0') {
              vm.lastHeartbeatTime = Date.now()
            } else if (jsonData.type + '' === '3') {
              vm.unread()
              const idList = jsonData.ids.split(',')
              /* 已阅读, 关闭对应的全局弹窗 */
              idList.forEach((messageId) => {
                if (SysNotifyClass.notifyComponent[messageId]) {
                  SysNotifyClass.notifyComponent[messageId].close()
                  delete SysNotifyClass.notifyComponent[messageId]
                }
              })
            } else if (jsonData.type + '' === '101') {
              /* 监听 切换法人 刷新 刷新不同页签 */
              vm.$router.replace({ path: '/index' })
              location.reload()
            } else if (jsonData.type + '' === '5') {
              vm.unread()
              vm.showMsgBatch(jsonData)
            } else {
              vm.unread()
              if (jsonData.msgId) {
                vm.showMsg(jsonData)
              }
            }
          }
        } catch (e) {
          window.console.error(e)
        }
      })

      vm.closeSendInterval()
      vm.closeCheckInterval()
      vm.startSendInterval()
      vm.startCheckInterval()
    },
    unread() {
      const vm = this
      // this.num++

      // vm.$store.commit('setUnReadNum', this.num)
      unread().then((res) => {
        const { data } = res
        if (res.code === 200) {
          vm.$store.commit('setUnReadNum', data)
        } else {
          vm.$modal.msgError(data.msg)
        }
        // 模拟换行数据
        // const obj = {
        //   businessGroupId: '0',
        //   content:
        //     '产品主数据已更新, 请补充对应的本地语言信息.\n产品: [测试信息同步] - [010012]\n更新字段: 产品名称(测试信息同步233), 别名(), 描述(描述)',
        //   id: '14136642053799936',
        //   legalEntityId: '11322344332722176',
        //   sendTime: 175403139000,
        //   senderId: '99999',
        //   templateKey: 'Product_Master_BUSINESS_GROUP_UPDATE_PRODUCT',
        //   titleName: '产品主数据更新: 待完成本地化',
        //   titleNameZHCN: '产品主数据更新: 待完成本地化',
        //   type: 1
        // }
        // console.log(obj, '===')
        // SysNotifyClass.testMsgShow(obj)
      })
    },
    showMsg(jsonData) {
      queryMessageContent({ messageId: jsonData.msgId }).then((res) => {
        const data = res.data || {}
        SysNotifyClass.testMsgShow(data)
      })
    },
    showMsgBatch(jsonData) {
      const data = jsonData.data || {}
      const mList = data.list || []
      const messageIdList = mList.map((i) => i.messageId)

      if (messageIdList.length <= 0) return
      queryMessageContentBatch({ messageIdList }).then((res) => {
        const list = res.data || []
        let length = list.length
        const timer = setInterval(() => {
          if (length > 0) {
            const mItem = list[list.length - length]
            if (!SysNotifyClass.notifyComponent[mItem.messageId]) {
              SysNotifyClass.testMsgShow(mItem)
            }
            length--
          } else {
            clearInterval(timer)
          }
        }, 10)
      })
    },
    startSendInterval() {
      this.timer1 = setInterval(() => {
        this.WSIsOk && this.WS.send('ping')
      }, 50000)
    },
    closeSendInterval() {
      clearInterval(this.timer1)
    },
    startCheckInterval() {
      const vm = this
      vm.timer2 = setInterval(() => {
        if (vm.lastHeartbeatTime && Date.now() - vm.lastHeartbeatTime > 110000) {
          this.WSIsOk = false
          // 1分钟
          if (vm.reconnectTime && Date.now() - vm.reconnectTime > vm.RECONNECT_INTERVAL) {
            vm.reconnect()
          }
        }
      }, 10000)
    },
    closeCheckInterval() {
      clearInterval(this.timer2)
    },
    reconnect() {
      const vm = this
      vm.reconnectTime = Date.now()
      if (vm.reconnectAttempts < vm.MAX_RECONNECT_ATTEMPTS) {
        vm.reconnectAttempts++
        console.log(`WebSocket 尝试重新连接 （第 ${vm.reconnectAttempts} 次）`)
        vm.WS.close()
        setTimeout(() => {
          vm.getUnReadMsg()
        }, 1000)
      } else {
        console.log(`WebSocket 已达到最大重连次数 ${vm.MAX_RECONNECT_ATTEMPTS}，停止重连`)
      }
    }
  }
}
</script>
<style lang="scss">
.msg-drawer .el-drawer__header {
  margin-bottom: 0px;
}
.my-notification {
  width: 350px !important;
}
/*  */
.my-notification-center {
  width: 350px !important;
  position: fixed;
  /* top: 50%; */
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
}
.my-notification-left {
  width: 350px !important;
  /* css scss 动态变量 */
  --msg-dlg-margin-left: 240px;
  transform: translate(var(--msg-dlg-margin-left), 0);
  /* overflow: hidden; */
}
</style>
<style scoped lang="scss">
.small-bell {
  position: relative;
  &.active::after {
    position: absolute;
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #f56c6c;
    top: 12px;
    right: 2px;
  }
}
</style>
