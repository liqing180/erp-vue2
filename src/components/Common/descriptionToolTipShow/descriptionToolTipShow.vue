<template>
  <!-- dark/light -->
  <div class="tooltip-row">
    <el-popover
      trigger="hover"
      placement="top"
      :disabled="!(showStr || '').trim()"
      :open-delay="400"
    >
      <div class="desc-tooltip">
        <div
          v-if="showStr"
          style="line-height: 20px; white-space: pre-wrap; word-break: break-word"
        >
          <div>{{ showStr }}</div>
        </div>
      </div>
      <slot slot="reference">
        <div :class="{ 'tooltip-row': true }">
          {{ showStr }}
        </div>
      </slot>
    </el-popover>
  </div>
</template>
<script>
export default {
  props: {
    showStr: {
      type: [String],
      default: ''
    }
  },
  data() {
    return {
      timeout: null
    }
  },
  beforeCreate() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}

// 产品名悬浮 description 样式
.desc-tooltip {
  max-width: 800px;
  max-height: 400px;
  overflow-y: auto;
  font-size: 12px;
  padding-right: 8px;

  .desc-title {
    color: chartreuse;
  }
  & > pre {
    white-space: pre-wrap;
    max-width: 800px;
    line-height: 24px;
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
  // background-color: rgba(255, 255, 255, 0.5);
  background: #c1c1c1;
}

.desc-tooltip::-webkit-scrollbar-track {
  width: 8px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
</style>
