<template>
  <div ref="main">
    <el-popover
      placement="bottom-start"
      :open-delay="0"
      width="200"
      title=""
      :visible-arrow="false"
      trigger="manual"
      v-model="timePickerVisible"
      popper-class="customDateTimePopper"
    >
      <div>
        <div>
          <transition name="el-zoom-in-top">
            <div class="el-time-panel el-popper">
              <div>
                <div class="el-time-spinner">
                  <el-scrollbar
                    class="el-time-spinner__wrapper"
                    wrap-style="max-height: inherit;overscroll-behavior: none;"
                    style="text-align: center"
                    noresize
                    tag="ul"
                    ref="hours"
                  >
                    <li
                      v-for="(row, hour) in dateOptions"
                      @click="handleClick('hours', { value: row.value, disabled: row.disabled })"
                      class="el-time-spinner__item"
                      :key="hour"
                      :class="{
                        activeRow: parseTime(row.value, fmtForMd) === monthDateStr,
                        disabled: row.disabled
                      }"
                    >
                      {{ parseTime(row.value, fmtForMd) }}
                    </li>
                  </el-scrollbar>
                  <el-scrollbar
                    class="el-time-spinner__wrapper"
                    wrap-style="max-height: inherit;overscroll-behavior: none;"
                    style="text-align: center"
                    noresize
                    tag="ul"
                    ref="minutes"
                  >
                    <li
                      v-for="(row, key) in timeOptions"
                      @click="handleClick('minutes', { value: row.value, disabled: row.disabled })"
                      :key="key"
                      class="el-time-spinner__item"
                      :class="{ activeRow: row.label === hoursMinutesStr, disabled: row.disabled }"
                    >
                      {{ row.label }}
                    </li>
                  </el-scrollbar>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div
        @click="open"
        slot="reference"
        class="el-input-number is-controls-right"
        :class="'el-input-number--' + size"
        style="width: 100%"
      >
        <el-input
          class="tree-view-item"
          readonly
          :disabled="disabled"
          :value="parseTime(value, fmtForYmdhm)"
          prefix-icon="el-icon-time"
        >
          <span slot="suffix" class="icon-box">
            <i class="el-input__icon el-icon-arrow-down" style="opacity: 1"></i>
            <i
              @click.stop="clear"
              v-if="value && clearable && !disabled"
              :class="{ 'tree-view-right': true }"
              class="el-input__icon el-icon-circle-close el-input__clear"
              :style="`right: ${controls ? rightPx : 0}px`"
            ></i>
          </span>
        </el-input>
        <!-- is-disabled 目前禁用状态不显示, 时间 加减分钟 -->
        <span
          v-show="!disabled && controls"
          class="el-input-number__decrease"
          @click.stop="minutesDecrease"
        >
          <i class="el-icon-arrow-down"></i>
        </span>
        <span
          v-show="!disabled && controls"
          class="el-input-number__increase"
          @click.stop="minutesIncrease"
        >
          <i class="el-icon-arrow-up"></i>
        </span>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'customDateTime',
  props: {
    value: {
      type: [String, Number]
    },
    // 间隔时间
    step: {
      type: [Number],
      default: 5
    },
    dateCount: {
      type: [Number],
      default: 7
    },
    disabled: {
      type: [Boolean],
      default() {
        return false
      }
    },
    clearable: {
      type: [Boolean],
      default() {
        return true
      }
    },
    controls: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timePickerVisible: false,
      val: [],
      dateOptions: [],
      currentTime: Date.parse(new Date()),
      props: {
        expandTrigger: 'hover'
        // lazy: true,
        // lazyLoad(node, resolve) {
        //   const index = vm.dateOptions.findIndex((x) => x.value === node.value)
        //   let nodes
        //   if (index === 0) {
        //     nodes = timeSlot(vm.step, 'disabled', vm.currentTime)
        //   } else {
        //     nodes = timeSlot(vm.step)
        //   }
        //   resolve(nodes)
        // }
      },
      timeOptions: [],
      minutes: undefined,
      right: {
        default: 40,
        medium: 36,
        small: 32,
        mini: 28
      }
    }
  },
  watch: {},
  created() {
    this.getMonthDay()
    this.timeOptions = this.timeSlot()
  },
  mounted() {
    document.addEventListener('click', this.bodyCloseMenus)
    this.$nextTick(() => {
      this.bindScrollEvent()
    })
  },
  computed: {
    size() {
      return this.$store.getters.size
    },
    rightPx() {
      return this.right[this.size] || this.right.default
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmdhm() {
      return this.$store.getters.fmtForYmdhm
    },
    fmtForMd() {
      return this.$store.getters.fmtForMd
    },
    monthDateStr() {
      if (this.value) {
        return this.parseTime(this.value, this.fmtForMd)
        // const date = date
        //   .getDate()('0' + key)
        //   .slice(-2)
      }
      return ''
    },
    hoursMinutesStr() {
      if (this.value) {
        return this.parseTime(this.value, 'HH:mm')
      }
      return ''
    }
  },
  methods: {
    clear() {
      this.$emit('input', undefined)
      this.close()
    },
    open() {
      if (this.timePickerVisible) return
      if (this.disabled) return
      this.timePickerVisible = true
      setTimeout(() => {
        this.adjustSpinners()
      }, 200)
    },
    close() {
      this.timePickerVisible = false
    },
    adjustSpinners() {
      this.adjustSpinner('hours', this.monthDateStr)
      this.adjustSpinner('minutes', this.hoursMinutesStr)
    },
    adjustCurrentSpinner(type) {
      this.adjustSpinner(type, this[type])
    },
    adjustSpinner(type) {
      const el = this.$refs[type].wrap
      let index = 0
      if (type === 'hours' && this.monthDateStr) {
        index = this.dateOptions.findIndex((row) => {
          return this.parseTime(row.value, this.fmtForMd) === this.monthDateStr
        })
      }
      if (type === 'minutes') {
        if (this.hoursMinutesStr) {
          index = this.timeOptions.findIndex((row) => {
            return row.label === this.hoursMinutesStr
          })
          if (index === -1) {
            let curTime = this.getHoursMinutesItem(this.value)
            curTime = this.parseTime(curTime, 'HH:mm')
            index = this.timeOptions.findIndex((row) => {
              return row.label === curTime
            })
          }
        } else {
          let curTime = this.getHoursMinutesItem()
          curTime = this.parseTime(curTime, 'HH:mm')
          index = this.timeOptions.findIndex((row) => {
            return row.label === curTime
          })
        }
      }
      if (el) {
        const num = Math.max(0, index * this.typeItemHeight(type))
        el.scrollTop = num
      }
    },
    /* 获取距离最近的一个时分 时间戳 */
    getHoursMinutesItem(timer) {
      // 24 * 60 = 1440
      const date = timer ? new Date(timer) : new Date()
      let hours = date.getHours()
      let Minute = hours * 60 + date.getMinutes()
      if (Minute % this.step > 0) {
        Minute = parseInt(Minute / this.step) * this.step + this.step
      }
      hours = parseInt(Minute / 60)
      Minute = Minute % 60
      date.setHours(hours)
      date.setMinutes(Minute)
      return date.getTime()
    },

    typeItemHeight(type) {
      return this.$refs[type].$el.querySelector('li').offsetHeight
    },
    scrollBarHeight(type) {
      return this.$refs[type].$el.offsetHeight
    },
    modifiedTime(dateTimer, hTimer) {
      const date = new Date(dateTimer)
      const hDate = new Date(hTimer)
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hDate.getHours(),
        hDate.getMinutes(),
        hDate.getSeconds()
      ).getTime()
    },
    modifyDateField(type, value) {
      switch (type) {
        case 'hours':
          this.$emit('input', this.modifiedTime(value, this.value || this.getHoursMinutesItem()))
          break
        case 'minutes':
          this.$emit('input', this.modifiedTime(this.value || Date.now(), value))
          break
      }
    },
    handleClick(type, { value, disabled }) {
      if (!disabled) {
        this.modifyDateField(type, value)
      }
    },
    /* 减少一分钟 */
    minutesDecrease() {
      let newTime = this.value
      if (this.value) {
        newTime -= 60000
      } else {
        newTime = Date.now()
      }
      this.modifyDateField('minutes', newTime)
    },
    /* 增加一分钟 */
    minutesIncrease() {
      let newTime = this.value
      if (this.value) {
        newTime += 60000
      } else {
        newTime = Date.now()
      }
      this.modifyDateField('minutes', newTime)
    },
    bindScrollEvent() {
      const bindFuntion = (type) => {
        this.$refs[type].wrap.onscroll = (e) => {
          // TODO: scroll is emitted when set scrollTop programatically
          // should find better solutions in the future!
          this.handleScroll(type, e)
        }
      }
      bindFuntion('hours')
      bindFuntion('minutes')
    },
    handleScroll(type) {},
    bodyCloseMenus(e) {
      const self = this
      if (this.$refs.main && !this.$refs.main.contains(e.target)) {
        if (self.timePickerVisible === true) {
          this.close()
        }
      }
    },

    getMonthDay() {
      this.dateOptions = []
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(startDate.getDate() + this.dateCount - 1)
      while (endDate.getTime() - startDate.getTime() >= 0) {
        this.dateOptions.push({
          value: startDate.getTime(),
          label: this.parseTime(startDate.getTime(), this.fmtForMd)
        })
        startDate.setDate(startDate.getDate() + 1)
      }
    },
    timeSlot(i) {
      const date = new Date()
      date.setHours(0)
      date.setSeconds(0)
      date.setUTCMinutes(0)
      const timeArr = []
      const slotNum = (24 * 60) / this.step // 算出多少个间隔
      for (let f = 0; f < slotNum; f++) {
        const time = new Date(Number(date.getTime()) + Number(this.step * 60 * 1000 * f)) // 获取：零点的时间 + 每次递增的时间

        timeArr.push({
          value: time.getTime(),
          label: this.parseTime(time, 'HH:mm')
        })
      }
      return timeArr
    },
    addZero(m) {
      return m < 10 ? '0' + m : m
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.bodyCloseMenus)
  }
}
</script>
<style lang="scss">
.customDateTimePopper {
  padding: 0 !important;
  border: 0 !important;
  margin-top: 4px !important;
}
</style>
<style lang="scss" scoped>
.activeRow {
  color: #1890ff !important;
  font-weight: bold;
}
.icon-box {
  position: relative;
  // margin-right: 30px;
}
.tree-view-right {
  display: none;
  position: absolute;
  right: 0;
  top: 0;
  background-color: inherit;
  line-height: 16px !important;
  height: 100%;
  background-color: #fff;
}
.tree-view-item:hover /deep/ .tree-view-right {
  display: inline;
}

.tree-view-item /deep/ .el-input__inner {
  padding-left: 30px !important;
  cursor: pointer;
}
.tree-view-item /deep/ .el-input__suffix {
  cursor: pointer;
}
.arrow-warp {
  position: relative;
  background-color: #333;
  height: 100%;
}
</style>
