<template>
  <el-popover trigger="hover" placement="top" :disabled="!showStr" :open-delay="400">
    <div class="desc-tooltip">
      <div class="desc-tooltip-item" v-for="(item, index) in rows" :key="index">
        <div class="item-title" :style="`width: ${titleWidth}px`">{{ item.label }} :</div>
        <div class="item-content">
          {{
            item.showLabel === 'isActive'
              ? comData[item.showLabel] === '1'
                ? $t('uiBtn.active')
                : $t('uiBtn.inactive')
              : comData[item.showLabel]
          }}
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
import getTextWidth from 'text-width'
export default {
  props: {
    mData: {
      type: [Object],
      default() {
        return {}
      }
    },
    rows: {
      type: [Array],
      default() {
        return []
      }
    },
    showStr: {
      type: [String],
      default: ''
    }
  },
  watch: {
    rows: {
      immediate: true,
      handler: function () {
        this.initFormLabelWidth()
      }
    }
  },
  computed: {
    comData() {
      return this.mData || {}
    }
  },
  data() {
    return {
      timeout: null,
      titleWidth: 120
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
    initFormLabelWidth() {
      const rows = this.rows || []
      const minWidth = 20
      let maxStr = ''
      rows.forEach((item) => {
        if (item.label.length > maxStr.length) {
          maxStr = item.label
        }
      })
      const maxLabelWidth = getTextWidth(maxStr, {
        family:
          'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif',
        size: 13,
        weight: 'bold'
      })
      const width = Math.max(maxLabelWidth, minWidth)
      this.titleWidth = width + 20
    }
  }
}
</script>
<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}

// 产品名悬浮 description 样式
.desc-tooltip {
  font-family: 'Microsoft YaHei';
  max-width: 800px;
  max-height: 400px;
  overflow-y: auto;
  .desc-tooltip-item {
    max-width: 800px;
    display: flex;
    flex-direction: row;
    line-height: 25px;
    flex-flow: nowrap;
    border-bottom: 1px solid #efefef;
    &:last-child {
      border-bottom: 1px solid #fff;
    }
    .item-title {
      font-size: 13px;
      text-align: right;
      font-weight: bold;
      color: #606266;
    }
    .item-content {
      font-size: 13px;
      padding-left: 6px;
      flex: 1;
      word-break: break-all;
      color: #606266;
      min-width: 100px;
    }
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
  width: 8px;
  height: 8px;
  background-color: initial;
}

.desc-tooltip::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.5);
}

.desc-tooltip::-webkit-scrollbar-track {
  width: 10px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
</style>
