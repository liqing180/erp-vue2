<template>
  <div class="time-picker">
    <!-- 小时滚轮 -->
    <div class="wheel-column" ref="hourWheel" @scroll.passive="onHourScroll">
      <div class="wheel-fill"></div>
      <div
        class="wheel-item"
        :class="{ active: selectedHour === h - 1 }"
        v-for="h in 24"
        :key="h"
        @click="clickHour(h - 1)"
      >
        {{ padZero(h - 1) }}
      </div>
      <div class="wheel-fill"></div>
    </div>

    <div class="colon">:</div>

    <!-- 分钟滚轮 -->
    <div class="wheel-column" ref="minWheel" @scroll.passive="onMinScroll">
      <div class="wheel-fill"></div>
      <div
        class="wheel-item"
        :class="{ active: selectedMinute === m - 1 }"
        v-for="m in 60"
        :key="m"
        @click="clickMin(m - 1)"
      >
        {{ padZero(m - 1) }}
      </div>
      <div class="wheel-fill"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimePicker',
  props: {
    curValue: {}, // 时间戳 或 空
    defaultTime: {} // hh:mm:ss 或 空
  },
  data() {
    return {
      selectedHour: 0,
      selectedMinute: 0,
      itemHeight: 30
    }
  },
  watch: {
    curValue() {
      this.showDefault()
    }
  },
  methods: {
    padZero(num) {
      return num < 10 ? '0' + num : num
    },
    showDefault() {
      if (this.curValue) {
        const cur = new Date(this.curValue)
        const hours = cur.getHours()
        this.clickHour(hours, false)
        const minutes = cur.getMinutes()
        this.clickMin(minutes, false)
      } else if (this.defaultTime) {
        const strList = this.defaultTime.split(':')
        this.clickHour(Number(strList[0]), false)
        this.clickMin(Number(strList[1]), false)
      }
    },
    clickHour(h, isUpdate = true) {
      this.selectedHour = h
      this.$refs.hourWheel.scrollTo({
        top: h * this.itemHeight
      })
      if (isUpdate) {
        this.handleTimePick2()
      }
    },
    clickMin(m, isUpdate = true) {
      this.selectedMinute = m
      this.$refs.minWheel.scrollTo({
        top: m * this.itemHeight
      })
      if (isUpdate) {
        this.handleTimePick2()
      }
    },
    // 滚动中
    onHourScroll() {
      clearTimeout(this.scrollTimer)
      this.scrollTimer = setTimeout(() => {
        this.autoSelectHour()
      }, 100) // 滚动停止 80ms 后吸附
    },

    onMinScroll() {
      clearTimeout(this.scrollTimer)
      this.scrollTimer = setTimeout(() => {
        this.autoSelectMin()
      }, 100)
    },
    // 自动选中
    autoSelectHour() {
      const el = this.$refs.hourWheel
      const index = Math.round(el.scrollTop / this.itemHeight)
      this.selectedHour = Math.max(0, Math.min(23, index))
      el.scrollTo({
        top: this.selectedHour * this.itemHeight,
        behavior: 'smooth'
      })
      this.handleTimePick2()
    },
    autoSelectMin() {
      const el = this.$refs.minWheel
      const index = Math.round(el.scrollTop / this.itemHeight)
      this.selectedMinute = Math.max(0, Math.min(59, index))
      el.scrollTo({
        top: this.selectedMinute * this.itemHeight,
        behavior: 'smooth'
      })
      this.handleTimePick2()
    },
    handleTimePick2() {
      if (
        (this.selectedHour || this.selectedHour === 0) &&
        (this.selectedMinute || this.selectedMinute === 0)
      ) {
        let date
        if (this.curValue) {
          date = new Date(this.curValue)
          date.setHours(this.selectedHour)
          date.setMinutes(this.selectedMinute)
          if (date.getTime() === this.curValue) return
          this.$emit('pick', date)
        }
      }
    }
  }
}
</script>

<style scoped>
.time-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 340px;
  /* background: #ffffff; */
  position: relative;
  overflow: hidden;
  border-left: 1px solid rgb(204, 204, 204);
}

.wheel-column {
  width: 70px;
  height: 340px;
  overflow-y: auto;
  /* scroll-snap-type: y proximity; */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.wheel-column::-webkit-scrollbar {
  display: none;
}

.wheel-fill {
  height: 155px;
  width: 100%;
}

.wheel-item {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
  color: #333;
  /* scroll-snap-align: center; */
  user-select: none;
  cursor: pointer;
}

.wheel-item.active {
  font-size: 14px;
  font-weight: bold;
  color: #1890ff;
}

.time-picker::before {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 4px;
  right: 4px;
  height: 30px;
  /* background: #f6f6f6; */
  z-index: -1;
  border-top: 1px solid rgb(204, 204, 204);
  border-bottom: 1px solid rgb(204, 204, 204);
}

.colon {
  font-size: 14px;
  font-weight: bold;
  margin: 0 3px;
  z-index: 1;
}
</style>
