<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <div class="form-card form-card--p20">
        <div class="steps-box">
          <el-scrollbar ref="scrollContainer" class="scroll-container">
            <div>
              <stepProcess
                :node-content="taskSteps"
                :is-finish="Number(isProcessComplete) === 1"
              ></stepProcess>
            </div>
          </el-scrollbar>
        </div>
        <div class="history-list-box">
          <div class="history-list-a" :class="{ 'has-border showRight': isShowRight }">
            <span class="btn-lr-toggle" @click="toggleGraph">
              <i v-show="isShowRight" class="el-icon-d-arrow-right"></i>
              <i v-show="!isShowRight" class="el-icon-d-arrow-left"></i>
            </span>
            <div class="list-a-title">
              <strong>{{ $t('bpm.history') }}</strong>
            </div>
            <div class="list-a-content">
              <el-scrollbar ref="scrollbar" class="scroll-bar-box">
                <div style="height: 500px">
                  <el-collapse v-model="activeHistoryList" accordion>
                    <el-collapse-item
                      v-for="(item, index) in historyList"
                      :key="index"
                      class="msg-list"
                      :name="index"
                    >
                      <template slot="title">
                        <div class="list-title" :title="item.showText">
                          <div class="list-title-text ellipsis">
                            <i class="el-icon-user-solid" style="font-size: 16px"></i>
                            {{ item.showText }}
                          </div>
                          <div class="fs-0">{{ parseTime(item.handleTime, fmtForYmdhms) }}</div>
                        </div>
                      </template>
                      <div class="list-content">
                        <div>
                          <b>{{ $t('history.feedbackDetail') }}</b
                          >:
                          {{ item.handleComment }}
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                  <el-empty
                    v-if="historyList.length <= 0"
                    :image-size="200"
                    :description="$t('ui.noData')"
                  ></el-empty>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div :class="{ hideRight: !isShowRight }" class="history-list-b">
            <div class="history-b-title">
              <strong>{{ $t('history.completionChart') }}</strong>
            </div>
            <div class="history-b-chart">
              <el-progress
                :class="statusClass"
                type="circle"
                :percentage="processPercentage"
                :stroke-width="15"
              ></el-progress>
            </div>
            <div class="history-b-completion-status">
              <div class="ml10">
                <strong>{{ $t('history.completionStatus') }}</strong>
              </div>
              <div class="status-box">
                <div class="status-box-a">{{ $t('history.all') }}</div>
                <div class="status-box-b"><span class="color-sp c-sp1"></span></div>
              </div>
              <div class="status-box mgt15">
                <div class="status-box-a">{{ $t('history.completedWithinTimeframe') }}</div>
                <div class="status-box-b"><span class="color-sp c-sp2"></span></div>
              </div>
              <div class="status-box">
                <div class="status-box-a">{{ $t('history.completedOutsideOfTimeframe') }}</div>
                <div class="status-box-b"><span class="color-sp c-sp3"></span></div>
              </div>
              <div class="status-box mgt15">
                <div class="status-box-a">{{ $t('history.inProgressWithinTimeframe') }}</div>
                <div class="status-box-b"><span class="color-sp c-sp4"></span></div>
              </div>
              <div class="status-box">
                <div class="status-box-a">{{ $t('history.inProgressOutsideTimeframe') }}</div>
                <div class="status-box-b"><span class="color-sp c-sp5"></span></div>
              </div>
              <div class="status-box">
                <div class="status-box-a">{{ $t('history.cancellation') }}</div>
                <div class="status-box-b"><span class="color-sp c-sp6"></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </FormPageLayout>
</template>

<script>
import {
  getTaskDetailByInstanceId,
  getBizTaskHistoryShowByInstanceId,
  getProcessStatusByInstanceId
} from '@/api/bpm/bpm'
import stepProcess from './stepProcess.vue'
export default {
  components: {
    stepProcess
  },
  props: {
    instanceId: {
      type: String
    }
  },
  data() {
    return {
      isProcessComplete: 0,
      taskSteps: [],
      isShowRight: true,
      activeHistoryList: -1,
      historyList: [],
      processPercentage: 0,
      statusClass: []
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  created() {
    this.getTaskDetailByInstanceId()
    this.getBizTaskHistoryShowByInstanceId()
    this.getProcessStatusByInstanceId()
  },
  methods: {
    toggleGraph() {
      this.isShowRight = !this.isShowRight
    },
    back() {
      this.$emit('back')
    },
    // 查询Task Detail的步骤内容
    getTaskDetailByInstanceId() {
      const vm = this

      getTaskDetailByInstanceId(this.instanceId).then((res) => {
        const data = res.data || {}
        vm.isProcessComplete = data.complete
        vm.taskSteps = data.tasks
      })
    },
    // task detail 中的历史记录
    getBizTaskHistoryShowByInstanceId() {
      const vm = this
      vm.table_loading = true
      getBizTaskHistoryShowByInstanceId(this.instanceId).then((res) => {
        const data = res.data || []

        vm.historyList = data || []
        setTimeout(() => {
          this.$refs.scrollbar && this.$refs.scrollbar.update()
        }, 600)
        vm.table_loading = false
      })
    },
    getProcessStatusByInstanceId() {
      const vm = this
      getProcessStatusByInstanceId(this.instanceId).then((res) => {
        const data = res.data || {}
        vm.curProcessStatus = data.processStatus
        vm.processPercentage = data.processPercentage
        if (vm.processPercentage === 100) {
          vm.statusClass = []
          vm.statusClass.push('c-sp1')
        }
        switch (vm.curProcessStatus) {
          case 1:
            vm.statusClass = []
            vm.statusClass.push('c-sp4')
            break
          case 2:
            vm.statusClass = []
            vm.statusClass.push('c-sp5')
            break
          case 3:
            vm.statusClass = []
            vm.statusClass.push('c-sp2')
            break
          case 4:
            vm.statusClass = []
            vm.statusClass.push('c-sp3')
            break
          case 5:
            vm.statusClass = []
            vm.statusClass.push('c-sp6')
            break
        }
      })
    }
  }
}
</script>
<style lang="scss">
.history-list-box .el-collapse-item__header {
  font-size: 12px;
  height: 40px;
  line-height: 40px;
  .el-collapse-item__arrow {
    display: inline-block;
  }
  .el-collapse-item__arrow.el-icon-arrow-right {
    width: 23px;
    height: 23px;
    line-height: 23px;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    border-radius: 12.5px;
    color: #000;
    background-color: #fff;
    font-size: 18px;
    font-weight: 700;
    text-indent: 0;
  }
}
</style>
<style lang="scss" scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.history-list-box {
  padding-top: 20px;
  width: 100%;
  display: flex;
  border-top: 1px solid #dcdfe6;
  overflow: hidden;

  .history-list-a {
    vertical-align: top;
    display: inline-block;
    flex: 1;
    overflow: hidden;
    transition: width 0.28s;
    .list-title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      .list-title-text {
        flex-shrink: 100;
        padding-right: 20px;
      }
    }
    .list-content {
      padding-bottom: 10px;
    }
  }

  .list-a-title {
    line-height: 32px;
    text-indent: 10px;
  }

  .has-border {
    border-right: 1px solid #dcdfe6;
  }

  .btn-lr-toggle {
    display: block;
    float: right;
    cursor: pointer;
    text-align: center;
    font-size: 12px;
    width: 15px;
    height: 30px;
    line-height: 30px;
    background-color: #178fff;
    color: #ffffff;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .history-list-b {
    display: inline-block;
    width: 400px;
    height: 500px;
    transition: width 0.28s;
    overflow: hidden;
    &.hideRight {
      width: 0px;
      // display: none;
      opacity: 0;
      overflow: hidden;
    }
  }

  .history-b-title {
    line-height: 32px;
    text-indent: 10px;
  }

  .history-b-chart {
    height: 230px;
    text-align: center;
    line-height: 230px;

    .el-progress {
      vertical-align: middle;
    }
  }

  .history-b-completion-status {
    .mgt15 {
      margin-top: 15px;
    }

    .status-box {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      line-height: 32px;
      padding-left: 10px;
      padding-right: 10px;

      .status-box-a {
        display: inline-block;
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 400;
      }

      .status-box-b {
        display: inline-block;
        line-height: 32px;
        width: 100px;
        text-align: center;

        .color-sp {
          vertical-align: middle;
          display: inline-block;
          width: 20px;
          height: 20px;
        }

        .c-sp1 {
          background-color: #c29bfa;
        }

        .c-sp2 {
          background-color: #a1d46e;
        }

        .c-sp3 {
          background-color: #f76397;
        }

        .c-sp4 {
          background-color: #5dc2e3;
        }

        .c-sp5 {
          background-color: #f7c338;
        }

        .c-sp6 {
          background-color: #dddddd;
        }
      }
    }
  }
}
.list-a-content {
  height: 500px;
  overflow: hidden;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px;
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #8f8f8f;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }
}
/* .showRight.history-list-a {
  width: calc(100% - 400px);
} */
</style>
