<template>
  <div style="margin-bottom: 2px; margin-top: 10px">
    <div style="padding: 0 20px" class="flex">
      <div
        class="dashboard-card"
        style="width: 66%; padding: 6px; margin-right: 6px"
        :style="`height: ${isExpand ? 180 : 48}px;`"
      >
        <div class="card-title" style="padding: 0 20px">
          <el-button
            size="small"
            type="text"
            :icon="isExpand ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
            @click="$emit('changeIsExpand')"
            >{{ isExpand ? $t('ui.minimise') : $t('ui.expand') }}
          </el-button>
          <span class="ml20">{{ $t('DASHBOARD.taskCenter') }}</span>
          <div class="fr">
            <span style="font-size: 14px; margin-right: 4px">{{
              $t('DASHBOARD.reportSwitching')
            }}</span>
            <CommonSelectGroup
              style="width: 160px"
              :id="formData.reportId"
              :label="formData.reportName"
              idKey="reportId"
              labelKey="reportName"
              :options="reportUrlList"
              @change="reportUrlChange"
              :clearable="false"
            />
          </div>
        </div>
        <div v-if="isExpand" class="flexSa w100" style="height: 130px">
          <div class="flex fs-0" style="max-width: 20%">
            <div style="50%">
              <img class="card-img" src="./img/a.svg" />
            </div>
            <div style="50%">
              <div>{{ $t('DASHBOARD.open') }}</div>
              <div
                class="tab-num"
                :class="{ pointer: formData.openQty > 0 }"
                @click="numberClick('openQty', formData.openQty)"
              >
                {{ $numberStr(formData.openQty, 0) }}
              </div>
            </div>
          </div>
          <div class="flex fs-0" style="max-width: 20%">
            <div style="50%">
              <img class="card-img" src="./img/b.svg" />
            </div>
            <div style="50%">
              <div>{{ $t('DASHBOARD.overdue') }}</div>
              <div
                class="tab-num"
                :class="{ pointer: formData.overdueQty > 0 }"
                @click="numberClick('overdueQty', formData.overdueQty)"
              >
                {{ $numberStr(formData.overdueQty, 0) }}
              </div>
            </div>
          </div>
          <div class="flex fs-0" style="max-width: 20%">
            <div style="50%">
              <img class="card-img" src="./img/c.svg" />
            </div>
            <div style="50%">
              <div>{{ $t('DASHBOARD.processed') }}</div>
              <div
                class="tab-num"
                :class="{ pointer: formData.processedQty > 0 }"
                @click="numberClick('processedQty', formData.processedQty)"
              >
                {{ $numberStr(formData.processedQty, 0) }}
              </div>
            </div>
          </div>
          <div class="flex fs-0" style="max-width: 20%">
            <div style="50%">
              <img class="card-img" src="./img/d.svg" />
            </div>
            <div style="50%">
              <div>{{ $t('DASHBOARD.myInitiated') }}</div>
              <div
                class="tab-num"
                :class="{ pointer: formData.myInitiatedQty > 0 }"
                @click="numberClick('myInitiatedQty', formData.myInitiatedQty)"
              >
                {{ $numberStr(formData.myInitiatedQty, 0) }}
              </div>
            </div>
          </div>
          <div class="flex fs-0" style="max-width: 20%">
            <div style="50%">
              <img class="card-img" src="./img/e.svg" />
            </div>
            <div style="50%">
              <div>{{ $t('DASHBOARD.notifications') }}</div>
              <div class="tab-num" :class="{ pointer: formData.notificationsQty > 0 }">
                {{ $numberStr(formData.notificationsQty, 0) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="dashboard-card"
        style="width: 34%; padding: 6px 20px"
        :style="`height: ${isExpand ? 180 : 48}px;`"
      >
        <div class="card-title">
          {{ $t('DASHBOARD.todayTransactions') }}
          <el-select
            v-if="isExpand"
            class="fr"
            style="width: 140px"
            v-model="totalForm.todaysDataActive"
            size="mini"
            :clearable="false"
            @change="todaysDataActiveChange"
          >
            <el-option
              v-for="item in todaysDataOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div v-if="isExpand">
          <div
            class="flexSa"
            style="margin-top: 10px"
            v-for="(item, index) in comTodaysData"
            :key="'today' + index"
          >
            <div class="today-label">{{ item.label }}</div>
            <div class="flex-1">
              <el-progress
                :percentage="item.percentage"
                :stroke-width="16"
                :show-text="false"
              ></el-progress>
            </div>
            <div style="width: 60px; padding-left: 10px">{{ $numberStr(item.value) }}</div>
          </div>
        </div>

        <!-- <div class="full-card pointer" @click="toggleFullscreen">
          <svg-icon icon-class="board-full-out" class-name="full-icon" v-if="isShowFullScreen" />
          <svg-icon icon-class="board-full" class-name="full-icon" v-else />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isShowFullScreen: {
      type: Boolean,
      default: false
    },
    isExpand: {
      type: Boolean,
      default: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    reportUrlList: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: undefined
    },
    todaysDataOptions: {
      type: Array,
      default: () => []
    },
    comTodaysData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      popoverShow: {
        dropdown: false,
        cascader: false
      },

      totalForm: {}
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.totalForm = newValue || {}
      }
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  async created() {},
  methods: {
    reportUrlChange(row) {
      this.$emit('handleChangeUrl', row)
    },
    DropVisibleChange(value) {
      this.popoverShow.dropdown = value
      if (this.popoverShow.dropdown || this.popoverShow.cascader) {
        this.$emit('setMaskShow', true)
      } else {
        this.$emit('setMaskShow', false)
      }
    },
    // 区域更新
    toggleFullscreen() {
      this.$emit('toggleFullscreen')
    },
    todaysDataActiveChange() {
      this.$emit('handleChangeTodays')
      this.$cache.local.setJSON('dashboardTodaysId', this.totalForm.todaysDataActive)
    },
    numberClick(clickType, value) {
      if (!value) return
      switch (clickType) {
        case 'openQty':
          if (!this.checkPermi(['bpm:myTask:toDoTask:list'])) {
            this.$modal.msgError(this.$t('DASHBOARD.noAuthMsg'))
            return
          }
          this.$router
            .push({
              name: 'ToDoTask',
              query: {
                timeId: Date.now()
              },
              params: {
                isGetList: true
              }
            })
            .catch()
          break

        case 'overdueQty':
          if (!this.checkPermi(['bpm:myTask:toDoTask:list'])) {
            this.$modal.msgError(this.$t('DASHBOARD.noAuthMsg'))
            return
          }
          this.$router
            .push({
              name: 'ToDoTask',
              query: {
                timeId: Date.now()
              },
              params: {
                isGetList: true,
                isTimeOut: '1'
              }
            })
            .catch()
          break
        case 'processedQty':
          if (!this.checkPermi(['bpm:myTask:completedTask:list'])) {
            this.$modal.msgError(this.$t('DASHBOARD.noAuthMsg'))
            return
          }
          this.$router
            .push({
              name: 'CompletedTask',
              query: {
                timeId: Date.now()
              },
              params: {
                isGetList: true
              }
            })
            .catch()
          break
        case 'myInitiatedQty':
          if (!this.checkPermi(['bpm:processManagement:myInitiatedProcess:list'])) {
            this.$modal.msgError(this.$t('DASHBOARD.noAuthMsg'))
            return
          }
          this.$router
            .push({
              name: 'MyInitiatedProcess',
              query: {
                timeId: Date.now()
              },
              params: {
                isGetList: true
              }
            })
            .catch()
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
.dashboard-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.13) 0px 1px 3px 1px;
  // box-shadow: 0px 0px 1px 2px rgba(0, 0, 0, 0.08);
}
.card-title {
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  font-weight: 600;
  // font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
}
.card-img {
  width: 60px;
  height: 60px;
}

.tab-num {
  text-align: center;
  margin-top: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #1890ff;
  user-select: none;
}

.header {
  color: #5a5e66;
  height: 60px;
  line-height: 60px;
  padding: 20px 20px;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 2px 2px 1px 2px rgba(0, 0, 0, 0.08);

  /deep/ .el-cascader__tags {
    max-width: 130px;
    flex-wrap: nowrap;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  .title {
    font-size: 25px;
    text-align: center;
    font-weight: 700;
  }
  .header-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .left {
    display: flex;
    align-items: center;
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .full-card {
    display: flex;
    align-items: center;
  }
  .full-icon {
    font-size: 26px;
    // width: 30px;
    // height: 30px;
  }
}

.today-label {
  width: 110px;
  font-size: 12px;
  text-align: right;
  padding-right: 10px;
}
</style>
