<template>
  <div v-if="!isEmpty" class="step-outline-box">
    <div v-for="(item, index) in contents" :key="index" class="step-inline-box">
      <div class="step-inline-header">
        <div
          v-if="!contentListEqOne"
          class="step-inline-line"
          :class="{
            bg1: Number(item.taskStatus) !== isCancelledValue,
            'pos-r': index === 0,
            bg2: Number(item.taskStatus) === isCancelledValue,
            'pos-l': index !== 0 ? isFinish : false
          }"
        ></div>
        <div
          class="step-inline-txt"
          :class="{
            bg1: Number(item.taskStatus) !== isCancelledValue,
            bg2: Number(item.taskStatus) === isCancelledValue
          }"
        ></div>
      </div>
      <div class="step-inline-desc">
        <dl class="step-box">
          <div class="step-item">
            <dt class="step-item-a">{{ $t('history.status') }}&nbsp;:&nbsp;</dt>
            <dd class="step-item-b">
              {{ selectDictLabel(dict.type.bpm_task_status, item.taskStatus) }}
            </dd>
          </div>
          <div class="step-item">
            <!-- 只有一个节点，3状态（取消状态）显示Handle By -->
            <dt v-if="index === 0" class="step-item-a">
              {{
                Number(item.taskStatus) === 3 ? $t('history.handledBy') : $t('history.initiator')
              }}&nbsp;:&nbsp;
            </dt>
            <dt v-else class="step-item-a">{{ $t('history.handledBy') }}&nbsp;:&nbsp;</dt>
            <dd class="step-item-b flow1" :title="item.handleUserName">
              {{ item.handleUserName }}
            </dd>
          </div>
          <div class="step-item">
            <dt class="step-item-a">{{ $t('history.date') }}&nbsp;:&nbsp;</dt>
            <dd class="step-item-b">
              {{ !item.handleTime ? '' : parseTime(item.handleTime, fmtForYmdhms) }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div v-if="!isFinish" class="step-inline-box">
      <div class="step-inline-header">
        <div class="step-inline-line bg2 pos-l"></div>
        <div class="step-inline-txt bg2"></div>
      </div>
      <div class="step-inline-desc txt-node-end">...</div>
    </div>
  </div>
</template>

<script>
export default {
  dicts: ['bpm_task_status'],
  props: {
    nodeContent: {
      type: [Array],
      default: () => {
        return []
      }
    },
    isDoneValue: {
      type: [Number],
      default: 2
    },
    isCancelledValue: {
      type: [Number],
      default: 3
    },
    isFinish: {
      type: [Boolean],
      default: false
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    BPM_TASK_STATUS() {
      return []
    },

    contents() {
      const vm = this
      let ta = []

      const len = vm.nodeContent.length

      if (len <= 0) {
        return ta
      } else {
        ta = vm.nodeContent
      }

      return ta
    },

    contentListEqOne() {
      const vm = this
      const len = vm.contents.length

      return len === 1
    },

    isEmpty() {
      const vm = this

      const len = vm.nodeContent.length
      if (len <= 0) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.step-outline-box {
  display: flex;
  white-space: nowrap;
  font-size: 12px;
}
.step-outline-box .step-inline-box {
  flex-basis: 230px;
  width: 230px;
  flex-shrink: 0;
}
.step-outline-box .step-inline-header {
  position: relative;
  left: 0;
  right: 0;
  height: 21px;
  line-height: 21px;
  vertical-align: middle;
  text-align: center;
}

.step-inline-header .step-inline-line {
  position: absolute;
  top: 9px;
  height: 2px;
  width: 100%;
  z-index: 80;
}
.step-inline-header .bg1 {
  background-color: #178fff;
}

.step-inline-header .bg2 {
  background-color: #c0c4cc;
}

.step-inline-header .pos-r {
  left: 50%;
  right: -50%;
}
.step-inline-header .pos-l {
  left: -50%;
  right: 50%;
}

.step-inline-header .step-inline-txt {
  display: inline-block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  overflow: hidden;
  border-radius: 50%;
  z-index: 81;
}

.step-inline-box .txt-node-end {
  text-align: center;
  color: #c0c4cc;
}
.flow1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.step-box {
  margin-top: 15px;
  padding: 5px;
  border-left: 1px solid #dcdfe6;
  width: 100%;

  .step-item {
    line-height: 20px;
    text-align: left;
    display: flex;

    .step-item-a {
      display: inline-block;
      font-weight: bold;
      width: 80px;
    }
    .step-item-b {
      width: 140px;
      display: inline-block;
      margin-inline-start: 0px;
    }
  }
}
</style>
