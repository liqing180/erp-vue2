<template>
  <el-popover trigger="hover" placement="top" :disabled="comDisPopover" :open-delay="400">
    <div>
      <div class="desc-tooltip" style="width: 800px" v-if="showType === '1'">
        <el-table
          border
          ref="tables"
          :data="paymentTermObj.paymentTermDetailList"
          row-key="paymentTermDetailId"
          :tree-props="{ children: 'childList', hasChildren: 'hasChildren' }"
          default-expand-all
        >
          <el-table-column
            type="index"
            key="index"
            :label="$t('ui.stage')"
            width="60"
            fixed="left"
            align="center"
            class-name="allowDrag"
          >
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in visibleColumn"
            :key="item.prop + item.colSortIndex"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="getMinWidth(item)"
            :show-overflow-tooltip="item.tooltip"
            :fixed="item.fixed"
            :sortable="item.sortable"
            :align="item.align || 'left'"
            header-align="center"
          >
            <template slot-scope="scope">
              <el-tag
                v-if="item.prop === 'downPayment' || item.prop === 'goodsIssue'"
                :type="scope.row[item.prop] === '1' ? '' : 'info'"
                >{{ scope.row[item.prop] === '1' ? $t('uiBtn.yes') : $t('uiBtn.no') }}</el-tag
              >
              <template v-else-if="item.prop === 'days'">{{
                $numberStr(scope.row[item.prop], 0)
              }}</template>

              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="paymentTermObj.remarks"
          style="line-height: 20px; white-space: pre-wrap; margin-top: 20px"
        >
          <div>{{ paymentTermObj.remarks }}</div>
        </div>
      </div>
      <div slot="content" class="desc-tooltip" v-if="showType === '2'">
        <div v-if="paymentTermObj.description" style="line-height: 20px; white-space: pre-wrap">
          <div>{{ paymentTermObj.description }}</div>
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
          const list = this.getAllList(val.paymentTermDetailList, 0, [])
          console.log('2222', list)
          this.$$getColumnContentMaxWidth(this.columns, list)
          console.log('33333', this.columns)
        }
      }
    }
  },
  data() {
    const vm = this
    return {
      columns: [
        {
          prop: 'stageName',
          propBy: 'stageNameL',
          label: vm.$t('ui.stageName'),
          visible: true,
          minWidth: 120,
          maxWidth: 400,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'percentage',
          label: vm.$t('ui.paymentPercentage'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'days',
          label: vm.$t('ui.dueDays'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'downPayment',
          label: vm.$t('ui.downPayment'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'goodsIssue',
          label: vm.$t('ui.goodsIssue'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ]
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
  created() {
    this.$$initColumnVisible('undefined', this.columns)
  },
  methods: {
    getAllList(dataList, level, newList) {
      for (const node of dataList) {
        let str = ''
        for (let index = 0; index < level; index++) {
          str += 'AAAj'
        }
        node.stageNameL = str + node.stageName
        newList.push(node)
        if (node.childList && node.childList.length > 0) {
          this.getAllList(node.childList, level + 1, newList)
        }
      }
      return newList
    }
  }
}
</script>
<style lang="scss" scoped>
// 产品名悬浮 description 样式
.desc-tooltip {
  font-family: 'Microsoft YaHei';
  max-width: 800px;
  max-height: 400px;
  overflow-y: auto;
  font-size: 12px;
  .desc-title {
    color: chartreuse;
  }
  & > pre {
    white-space: pre-wrap;
    max-width: 800px;
    font-family: 'Microsoft YaHei';
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
