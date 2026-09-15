<template>
  <popover-svc
    ref="pop1"
    trigger="hover"
    placement="top"
    :close-delay="0"
    :visible-arrow="true"
    popper-class="pop-warp"
    :offset="-30"
  >
    <div @mouseenter="mouseenterCur($event)" class="pop-box">
      <div class="pp-title ellipsis-text" v-if="params.popoverTitle">
        <span>{{ params.popoverTitle }}</span>
      </div>
      <el-scrollbar ref="scrollbarRef">
        <template v-if="params.single">
          <div class="pp-item-warp">
            <div
              v-for="(item, index) in params.list || []"
              :key="index"
              class="pp-item flow1"
              :class="params.itemClass"
            >
              <span class="ellipsis-text">{{ item[params.labelKey0] }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <el-table border ref="tables" :data="tableList">
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
                {{ scope.row[item.prop] }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-scrollbar>
    </div>
  </popover-svc>
</template>
<script>
import pageMixin from '@/mixins/tableMinx'
import { Popover } from 'element-ui'
const popoverSvc = {
  extends: Popover,
  methods: {
    popBy(el) {
      // 先隐藏并销毁之前显示的
      this.close()
      this.doDestroy(true)
      this.$nextTick(() => {
        // 显示新的
        this.referenceElm = this.$refs.reference = el
        this.showPopper = true
        this.$emit('input', true)
      })
    },
    close() {
      this.showPopper = false
      this.$emit('input', false)
    }
  }
}
export default {
  components: { popoverSvc },
  mixins: [pageMixin],
  props: {},
  computed: {},
  data() {
    return {
      saveKey: '8',
      timeout: null,
      popoverData: {},
      params: {
        popoverTitle: '',
        labelKey: '',
        itemClass: '',
        list: []
      },
      tableList: [],
      columns: [],
      columns0: [
        {
          prop: 'businessPartnerName',
          label: this.$t('PURCHASE.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'rfqNo',
          label: this.$t('PURCHASE.RFQNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'statusStr',
          label: this.$t('PURCHASE.statusRFQ'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'inquiryClerkBy',
          label: this.$t('PURCHASE.inquiryClerk'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      columns1: [
        {
          prop: 'businessPartnerName',
          label: this.$t('PURCHASE.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchaseQuotationNo',
          label: this.$t('PURCHASE.purchaseQuotationNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'statusStr',
          label: this.$t('PURCHASE.statusPQ'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'quoterBy',
          label: this.$t('PURCHASE.quoter'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ]
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
    showPop(e, params) {
      if (params.type === 'rfqDetailStatus') {
        this.columns = this.columns0
        this.tableList = params.list
      } else if (params.type === 'purchaseQuotationStatus') {
        this.columns = this.columns1
        this.tableList = params.list
      }
      this.params = params || {}
      this.$$initColumnVisible(this.saveKey, this.columns)
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)

      this.$set(this.popoverData, 'hide', false)
      this.$refs.pop1.popBy(e.target)
      if (this.$refs.scrollbarRef) {
        this.$refs.scrollbarRef.moveY = 0
      }
    },
    hidePop(e) {
      if (this.popoverData) {
        this.popoverData.hide = true
      }
      setTimeout(() => {
        this.popoverData.hide && this.$refs.pop1.close()
      }, 300)
    },
    mouseenterCur() {
      if (this.popoverData) {
        this.popoverData.hide = false
      }
    },
    clickItem(item) {
      this.$emit('clickItem', item)
    }
  }
}
</script>
<style lang="scss" scoped>
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
  max-height: 294px;
}
.pp-item {
  display: flex;
  align-items: center;
  padding: 1px 5px;
  line-height: 28px;
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
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.flow1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item {
  max-width: 150px;
}
</style>
