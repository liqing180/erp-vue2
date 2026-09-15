<template>
  <FormPageLayoutTabs>
    <template v-slot:btn>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>

    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <div class="form-card" v-if="type !== 'salesAmount'">
          <el-collapse-item name="1">
            <FormCollapseItemTitle
              slot="title"
              :title="costProjectCode + ' ' + $t('PRODUCT.actualCost')"
            >
            </FormCollapseItemTitle>
            <!-- 一级 -->
            <actualCostTable
              ref="actualCostTable"
              :rowId="rowId"
              @handleUpdate="handleUpdate"
              v-show="activeName === 1"
            />
            <!-- 二级 -->
            <actualCostTableDetail ref="actualCostTableDetail" v-show="type === 'actualCost'" />
          </el-collapse-item>
        </div>
        <div
          :class="['form-card', type === 'salesAmount' ? '' : 'mt20']"
          v-if="type !== 'actualCost'"
        >
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="costProjectCode + ' ' + $t('PRODUCT.salesAmount')"
            >
            </FormCollapseItemTitle>
            <!-- 一级 -->
            <salesAmountTable
              ref="salesAmountTable"
              :rowId="rowId"
              @handleUpdate="handleUpdate"
              v-show="activeName === 1"
            />
            <!-- 二级 -->
            <salesAmountTableDetail ref="salesAmountTableDetail" v-show="type === 'salesAmount'" />
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayoutTabs>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'
import locale2 from '@/views/system/lang/index'
import actualCostTable from './components/actualCostTable.vue'
import actualCostTableDetail from './components/actualCostTableDetail.vue'
import salesAmountTable from './components/salesAmountTable.vue'
import salesAmountTableDetail from './components/salesAmountTableDetail.vue'

export default {
  name: 'ViewDetail',
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    actualCostTable,
    salesAmountTable,
    actualCostTableDetail,
    salesAmountTableDetail
  },
  data() {
    return {
      activeNames: ['1', '2'],
      rowId: '',
      timeId: '',
      activeName: 1,
      type: undefined,
      costProjectName: undefined,
      costProjectCode: undefined
    }
  },
  props: {},
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['projectManagement:project:edit'])
    },
    comDisFrom() {
      if (this.isView === '1') {
        return true
      }
      let dis = true
      if (this.rowId) {
        if (this.editAuth) {
          dis = false
        }
      } else {
        return !this.editAuth
      }
      return dis
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
    this.$i18n.mergeLocaleMessage('zh', locale2.zh)
    this.$i18n.mergeLocaleMessage('en', locale2.en)
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.costProjectName = this.$route.query.costProjectName
    this.costProjectCode = this.$route.query.costProjectCode

    this.init()
  },
  activated() {
    if (this.timeId !== this.$route.query.timeId) {
      this.timeId = this.$route.query.timeId
      this.rowId = this.$route.query.id
      this.costProjectName = this.$route.query.costProjectName
      this.costProjectCode = this.$route.query.costProjectCode

      this.init()
    }
  },
  methods: {
    init() {
      this.type = undefined
      this.activeName = 1
      this.$nextTick(() => {
        this.$refs.actualCostTable && this.$refs.actualCostTable.init()
        this.$refs.salesAmountTable && this.$refs.salesAmountTable.init()
      })
    },
    handleUpdate(row, type) {
      this.type = type
      this.activeName = 2
      if (this.type === 'actualCost') {
        this.$nextTick(() => {
          this.$refs.actualCostTableDetail.init(row.costProjectInventoryId)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.salesAmountTableDetail.init(row.costProjectSalesId)
        })
      }
    },
    // 取消按钮
    cancel(type) {
      if (this.activeName === 2) {
        this.init()
        return
      }
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/projectManagement/project' })
    }
  }
}
</script>
<style lang="scss" scoped>
.table {
  /deep/ .cell-class .cell .el-checkbox__inner {
    display: none;
    position: relative;
  }
}
.table {
  /deep/ .cell-class .cell:before {
    content: '';
    position: absolute;
  }
}
.unit {
  flex-shrink: 0;
  min-width: 30px;
  padding: 0 8px;
  text-align: center;
  background-color: #f5f7fa;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}
.border-line-solid {
  height: 1px;
  width: 100%;
  border-top: 1px solid #dcdfe6;
  // background-color: #dcdfe6;
  margin-bottom: 20px;
}
.border-line-dashed {
  height: 1px;
  width: 100%;
  border-top: 2px dashed #dcdfe6;
  // background-color: #dcdfe6;
  margin-bottom: 20px;
  border-spacing: 6px;
}
</style>
