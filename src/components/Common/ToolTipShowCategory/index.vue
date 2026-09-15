<template>
  <el-popover
    :disabled="!(list && list.length > 0)"
    trigger="hover"
    placement="top"
    :open-delay="100"
    @hide="hide"
  >
    <div class="pop-box">
      <el-scrollbar ref="scrollbarRef">
        <div class="pp-item-warp">
          <table>
            <tr>
              <td
                v-for="TdIndex in comMaxTd"
                :key="'Th' + TdIndex"
                style="padding: 4px 10px; font-size: 12px"
                :style="
                  TdIndex < comMaxTd
                    ? 'border-right: 1px solid #efefef;border-bottom: 1px solid #efefef'
                    : 'border-bottom: 1px solid #efefef'
                "
              >
                <span v-if="TdIndex < 7" style="font-weight: bold">{{
                  $t('productMsg.layer' + TdIndex)
                }}</span>
              </td>
            </tr>
            <tr v-for="(item, index) in comList" :key="index">
              <td
                v-for="TdIndex in comMaxTd"
                :key="'Td' + index + TdIndex"
                style="padding: 4px 10px"
                :style="TdIndex < comMaxTd ? 'border-right: 1px solid #efefef' : ''"
              >
                <!-- dashed -->
                <span class="childLabel">{{ item[TdIndex - 1] || '' }}</span>
                <span class="splitIconTd" v-if="TdIndex < item.length">
                  <i class="el-icon-arrow-right"></i>
                </span>
              </td>
            </tr>
          </table>
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
    }
  },
  computed: {
    comList() {
      // const list = this.list
      // const listNew = []
      // list.forEach((item) => {
      //   if (item) {
      //     const childList = item.split(';')
      //     listNew.push(childList)
      //   }
      // })
      // return listNew
      return this.list
    },
    comMaxTd() {
      let max = 0
      this.comList.forEach((item) => {
        if (item.length > max) {
          max = item.length
        }
      })
      return max
    },
    labelJoinStr() {
      return ''
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
          layer1: '一级分类',
          layer2: '二级分类',
          layer3: '三级分类',
          layer4: '四级分类',
          layer5: '五级分类',
          layer6: '六级分类'
        }
      },
      en: {
        productMsg: {
          layer1: 'First Layer',
          layer2: 'Second Layer',
          layer3: 'Third Layer',
          layer4: 'Fourth Layer',
          layer5: 'Fifth Layer',
          layer6: 'Sixth Layer'
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

.pp-item-warp {
  max-height: 360px;
}

.ellipsis-text {
  // max-width: 400px;
  max-width: 80vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.childLabel {
  // color: #1890ff;
  color: #606266;
  font-size: 12px;
  // font-weight: bold;
  vertical-align: baseline;
}
.splitIconTd {
  padding-left: 10px;
  float: right;
}
</style>
