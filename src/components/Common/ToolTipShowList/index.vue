<template>
  <el-popover
    :disabled="!(list && list.length > 0)"
    trigger="hover"
    placement="top"
    :open-delay="100"
    @hide="hide"
  >
    <div class="pop-box">
      <div class="pp-title ellipsis-text" v-if="popoverTitle">
        <span>{{ popoverTitle }}</span>
      </div>
      <el-scrollbar ref="scrollbarRef">
        <div class="pp-item-warp">
          <div v-for="(item, index) in comList" :key="index" class="pp-item ellipsis-text">
            <div class="flow1" :title="showLabel ? item[showLabel] : item">
              {{ showLabel ? item[showLabel] : item }}
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div slot="reference">
      <div v-if="$slots.default">
        <slot></slot>
      </div>
      <div v-else class="tooltip-row">
        <span>{{ labelJoinStr }}</span>
      </div>
    </div>
  </el-popover>
</template>
<script>
export default {
  props: {
    list: {
      type: [Array],
      default() {
        return []
      }
    },
    showLabel: {
      type: [String],
      default: ''
    },
    popoverTitle: {
      type: [String],
      default: ''
    }
  },
  computed: {
    comList() {
      return this.list || []
    },
    labelJoinStr() {
      const str = this.comList.map((item) => item[this.showLabel]).join(', ')
      return str
    }
  },
  data() {
    return {
      timeout: null
    }
  },
  beforeCreate() {
    const locale = {
      zh: {
        productMsg: {
          productName: '产品名称',
          productCode: '产品编码',
          description: '描述'
        }
      },
      en: {
        productMsg: {
          productName: 'Product Name',
          productCode: 'Internal Part No',
          description: 'Description'
        }
      }
    }
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    hide() {
      if (this.$refs.scrollbarRef) {
        this.$refs.scrollbarRef.moveY = 0
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tooltip-row {
  white-space: nowrap;
  min-width: 50px;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pop-box {
  border: 1px solid #efefef;
  border-radius: 4px;
}
.pp-title {
  padding: 1px 5px;
  line-height: 28px;
  vertical-align: middle;
  // color: #000000;
  text-align: left;
  font-weight: bold;
  border-bottom: 1px solid #efefef;
  font-size: 14px;
}
.pp-item-warp {
  max-height: 280px;
}
.pp-item {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 5px;
  height: 28px;
  vertical-align: middle;
  font-size: 12px;
  // color: #000000;
  text-align: left;
  border-bottom: 1px solid #efefef;
}
.pp-item:last-child {
  border-bottom: 0;
}
.ellipsis-text {
  // max-width: 400px;
  max-width: 80vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
