<template>
  <el-popover trigger="hover" placement="top" :disabled="comDisPopover" :open-delay="400">
    <div class="desc-tooltip">
      <div style="height: 100%">
        <div>
          <div
            :style="`margin-top: ${index > 0 ? 8 : 0}px`"
            v-for="(item, index) in showList"
            :key="item.paymentTermDetailId"
          >
            <div :class="`stage-level-${item.level}`">
              <div class="flex">
                <div class="fs-0">
                  <span>{{ getPex(item) }}</span>
                </div>
                <div>
                  <span>{{ item.stageName }}</span>
                </div>
              </div>
            </div>
            <div
              :class="`stage-level-${item.level + 1}`"
              style="margin-top: 8px"
              v-if="item.stageDescription"
            >
              <div class="flex">
                <!-- <div class="fs-0">
                  <span>{{ '- ' }}</span>
                </div> -->
                <div>
                  <span>{{ item.stageDescription }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="paymentTermObj.remarks"
          style="line-height: 20px; white-space: pre-wrap; margin-top: 20px"
        >
          <div>{{ paymentTermObj.remarks }}</div>
        </div>
      </div>
    </div>

    <div slot="reference">
      <div v-if="$slots.default">
        <slot></slot>
      </div>
      <div v-else class="tooltip-row">
        <span>{{ showStr }}</span>
      </div>
    </div>
  </el-popover>
</template>
<script>
import pageMixin from '@/mixins/tableMinx'

export default {
  mixins: [pageMixin],
  props: {
    paymentTermObj: {
      type: [Object],
      default() {
        return {}
      }
    }
  },
  watch: {
    paymentTermObj: {
      immediate: true,
      handler(val) {
        if (val && val.paymentTermDetailList && val.paymentTermDetailList.length > 0) {
          this.showList = this.getAllList(val.paymentTermDetailList, 0, [])
        } else {
          this.showList = []
        }
      }
    }
  },
  data() {
    return {
      showList: []
    }
  },
  computed: {
    showType() {
      return '1'
    },
    comDisPopover() {
      const detailList = this.paymentTermObj.paymentTermDetailList || []
      if (detailList.length <= 0) {
        return true
      }
      return false
    }
  },
  created() {},
  methods: {
    getAllList(dataList, level, newList) {
      dataList.forEach((node, index) => {
        node.level = level + 1
        node.index = index
        newList.push(node)
        if (node.childList && node.childList.length > 0) {
          this.getAllList(node.childList, level + 1, newList)
        }
      })
      return newList
    },
    getPex(item) {
      if (item.level > 2) {
        return '- '
      }
      if (item.level === 1) {
        if (this.showList.length > 1) {
          return String.fromCharCode(97 + item.index) + ') '
        } else {
          return ''
        }
      }
      if (item.level === 2) {
        return this.convertToRoman(item.index + 1) + '. '
      }
    },
    convertToRoman(num) {
      // 检查输入是否在1-99范围内
      if (num < 1 || num > 99) {
        return ''
      }
      // 定义罗马数字与对系应数值的映射关
      const romanNumerals = [
        { value: 90, symbol: 'xc' },
        { value: 50, symbol: 'l' },
        { value: 40, symbol: 'xl' },
        { value: 10, symbol: 'x' },
        { value: 9, symbol: 'ix' },
        { value: 5, symbol: 'v' },
        { value: 4, symbol: 'iv' },
        { value: 1, symbol: 'i' }
      ]
      let result = ''
      // 从大到小匹配并构建罗马数字
      for (const { value, symbol } of romanNumerals) {
        while (num >= value) {
          result += symbol
          num -= value
        }
      }

      return result
    }
  }
}
</script>
<style lang="scss" scoped>
.stage-level-1 {
  padding-left: 0px;
  white-space: pre-wrap;
}
.stage-level-2 {
  padding-left: 20px;
  white-space: pre-wrap;
}
.stage-level-3 {
  padding-left: 40px;
  white-space: pre-wrap;
}
.stage-level-4 {
  padding-left: 60px;
  white-space: pre-wrap;
}
// 产品名悬浮 description 样式
.desc-tooltip {
  font-family: 'Microsoft YaHei';
  max-width: 820px;
  max-height: 400px;
  overflow-y: auto;
  font-size: 12px;
  padding-right: 8px;
  & > pre {
    white-space: pre-wrap;
    max-width: 600px;
    font-family: 'Microsoft YaHei';
    line-height: 20px;
  }
}
.tooltip-row {
  white-space: nowrap;
  min-width: 50px;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.desc-tooltip::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: initial;
}

.desc-tooltip::-webkit-scrollbar-thumb {
  border-radius: 4px;
  // background-color: rgba(0, 0, 0, 0.3);
  background: #c1c1c1;
}

.desc-tooltip::-webkit-scrollbar-track {
  width: 8px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
</style>
