<template>
  <transition name="dialog-fade">
    <div v-if="visible" class="import-failed-mask" @click.self="close">
      <div class="import-failed-dialog" role="dialog" aria-modal="true">
        <div class="dialog-header">
          <div class="header-title">
            <div class="flexStart">
              <div style="width: 40px; height: 30px">
                <svg-icon
                  class="fs-0"
                  icon-class="warning"
                  style="width: 28px; height: 28px; align-self: center"
                />
              </div>
              <span class="title-cn">{{ $t('SALES.importFailed') }}</span>
            </div>

            <div class="body-tip mt5" style="margin-left: 40px">
              {{ $t('SALES.reImport').replace('$1', form.errorCount) }}
            </div>
          </div>

          <div class="header-actions">
            <button class="close-btn" type="button" aria-label="close" @click="close">×</button>
          </div>
        </div>

        <div class="dialog-body">
          <div v-for="(group, groupIndex) in errorGroups" :key="groupIndex" class="error-group">
            <div class="group-title">{{ group.errorMsg }}</div>

            <div
              v-for="(item, itemIndex) in group.checkDetailList"
              :key="`${groupIndex}-${itemIndex}`"
              class="error-item"
            >
              <div class="item-header">
                <span class="item-code" v-if="item.internalPartNo">{{ item.internalPartNo }}</span>
                <span class="item-separator" v-if="item.internalPartNo && item.productName">—</span>
                <span class="item-name" v-if="item.productName">{{ item.productName }}</span>
              </div>

              <div class="item-desc">{{ item.errorMsg }}</div>
              <div class="item-meta">{{ item.snMsg }}</div>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <el-button type="primary" @click="close">{{ $t('uiBtn.close') }} </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ErrDialog',
  props: {},
  data() {
    return {
      visible: false,
      errorGroups: [
        {
          title: '缺少父级层级 (2) / Missing Parent Level (2)',
          items: [
            {
              code: 'WIR-004',
              name: '电脑桥架 / Cable Tray',
              description:
                '当前层级为 3，未找到层级 2 的父级。请补充层级 2，或调整当前行层级。\nCurrent level is 3, but the parent at level 2 was not found. Please add the level 2 parent or adjust the level of this row.',
              meta: '第 28 行 / Row 28'
            },
            {
              code: 'FIL-012',
              name: '滤芯组件 / Filter Element',
              description:
                '当前层级为 4，未找到层级 3 的父级。请补充层级 3，或调整当前行层级。\nCurrent level is 4, but the parent at level 3 was not found. Please add the level 3 parent or adjust the level of this row.',
              meta: '第 56 行 / Row 56'
            }
          ]
        },
        {
          title: '同一级下重复录入 (1) / Duplicate Entry Under the Same Parent (1)',
          items: [
            {
              code: 'MOT-005',
              name: '电机 Y132M-4 / Motor Y132M-4',
              description:
                '在同一级下重复录入，已在第 15 行出现相同的产品。\nThis product is duplicated under the same parent. The same product already appears in row 15.',
              meta: '第 42 行 / Row 42'
            }
          ]
        },
        {
          title: '层级超出允许范围 (1) / Level Exceeds Allowed Range (1)',
          items: [
            {
              code: 'GEA-099',
              name: '特殊配件 / Special Component',
              description:
                '当前层级为 8，超过系统允许的最大层级（7）。请调整层级。\nCurrent level is 8, which exceeds the maximum allowed level (7). Please adjust the level.',
              meta: '第 89 行 / Row 89'
            }
          ]
        },
        {
          title: '顶级节点属性校验失败 (2) / Top-level Node Attribute Validation Failed (2)',
          items: [
            {
              code: 'PRJ-001',
              name: '混凝土搅拌站项目 A / Concrete Mixing Station Project A',
              description:
                '层级 1 的节点必须满足：生产制造 = 是，用途包含 “销售”。\nTop-level nodes (level 1) must meet the following: Production Manufacturing = Yes, and Usage includes "Sales".\n当前行：Production Manufacturing = No, Usage = Procurement. This does not meet the top-level node criteria.',
              meta: '第 3 行 / Row 3'
            }
          ]
        }
      ],
      form: {}
    }
  },
  methods: {
    open(data = {}) {
      this.form = data
      this.errorGroups = data.checkList || []
      this.visible = true
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
$dialog-bg: #f2f3f5;
$panel-bg: #ffffff;
$header-bg: #edf3f8;
$header-border: #dfeaf3;
$primary-text: #1e2a3b;
$secondary-text: #5d697a;
$muted-text: #7d8894;
$warning: #f59f00;
$warning-bg: #fff4d6;
$light-blue: #e8f1ff;
$divider: #e5eaf1;
$primary-blue: #1f92ff;
$btn-blue: #0f7be8;
$btn-blue-dark: #0a69c8;

.import-failed-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.import-failed-dialog {
  width: 800px;
  max-height: 82vh;
  display: flex;
  flex-direction: column;
  // background: $dialog-bg;
  border: 1px solid $header-border;
  border-radius: 12px;
  box-shadow: 0 18px 40px rgba(21, 32, 56, 0.16);
  overflow: hidden;
  background: #fefefe;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px 14px;
  // border-bottom: 1px solid rgba(120, 137, 157, 0.28);
  background: rgba(255, 255, 255, 0.2);
}

.header-title {
  // display: flex;
  // align-items: center;
  // gap: 12px;
  color: $primary-text;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.2;
  letter-spacing: 0.2px;
}

.title-cn,
.title-en {
  font-weight: 700;
  line-height: 30px;
}

.title-bracket {
  color: #5e6c7d;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lang-btn {
  appearance: none;
  border: 1px solid #c8d7e8;
  background: #f9fafb;
  color: #2b425d;
  border-radius: 6px;
  padding: 7px 16px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    background: #edf5ff;
    border-color: #b9d8ff;
    color: #1a73d9;
    box-shadow: inset 0 0 0 1px rgba(26, 115, 217, 0.1);
  }
}

.close-btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #5b6b7d;
  font-size: 34px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 18px 18px;
  background: rgba(255, 255, 255, 0.06);

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 7px;
    background: rgba(123, 137, 149, 0.55);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.body-tip {
  // margin: 10px 0 18px;
  color: $secondary-text;
  font-size: 14px;
  // line-height: 1.8;
  font-weight: 500;
}

.error-group {
  background: rgba(255, 255, 255, 0.66);
  border: 1px solid $header-border;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.group-title {
  padding: 3px 15px;
  color: #1f2d3d;
  font-size: 14px;
  font-weight: 700;
  background: #e9ecf1;
}

.error-item {
  position: relative;
  padding: 5px 15px;
  background: rgba(255, 255, 255, 0.38);
  border-bottom: 1px solid $divider;

  &:last-child {
    border-bottom: none;
  }
}

.item-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 14px;
  font-weight: 700;
}

.item-code {
  color: #4c92ee;
}

.item-separator {
  margin: 0 6px;
  // color: #54729d;
}

.item-name {
  // color: #1056a8;
  font-weight: 700;
}

.item-desc {
  margin: 0;
  color: $primary-text;
  font-size: 14px;
  // line-height: 1.9;
  white-space: pre-line;
  word-break: break-word;
}

.item-meta {
  color: $muted-text;
  font-size: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 14px 20px 18px;
  background: rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(120, 137, 157, 0.28);
}

// .dialog-footer .el-button {
//   min-width: 100px;
//   height: 40px;
//   font-size: 16px;
//   border-radius: 8px;
//   background: linear-gradient(180deg, #1d8ef0 0%, #0b79dd 100%);
//   border-color: transparent;
//   box-shadow: 0 3px 10px rgba(22, 126, 214, 0.24);

//   &:hover,
//   &:focus {
//     background: linear-gradient(180deg, #2a97ff 0%, #147fe8 100%);
//     border-color: transparent;
//   }
// }

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.18s ease;
}

.dialog-fade-enter,
.dialog-fade-leave-to {
  opacity: 0;
}
</style>
