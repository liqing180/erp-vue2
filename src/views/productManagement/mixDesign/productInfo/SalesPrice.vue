<template>
  <div class="pb20">
    <div>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" v-if="!comDisFrom">
          <el-button
            @click="handleAddSalesPartNo"
            :disabled="salesPartNoDataList.length >= 30"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            >{{ $t('uiBtn.add') }}</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="salesPartNoDataList" border :max-height="600" v-table-tab>
        <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('PRODUCT.salesPartNo')" min-width="200" align="left">
          <template slot="header" slot-scope="{ column }">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </template>
          <template slot-scope="scope">
            <div class="date-text-color" style="width: 100%">
              <span v-if="getFieldExists(scope.row)" class="err-msg">{{
                $t('PRODUCT.fieldExists')
              }}</span>
              <el-input
                style="width: 98%"
                :title="scope.row.salesPartNo"
                v-model="scope.row.salesPartNo"
                :maxlength="200"
                :clearable="true"
                v-if="!comDisFrom"
              />
              <span v-else>{{ scope.row.salesPartNo }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('PRODUCT.productName')" min-width="200" align="left">
          <template slot="header" slot-scope="{ column }">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </template>
          <template slot-scope="scope">
            <div class="date-text-color" style="width: 100%">
              <el-input
                style="width: 98%"
                :title="scope.row.productName"
                v-model="scope.row.productName"
                :maxlength="50"
                :clearable="true"
                v-if="!comDisFrom"
              />
              <span v-else>{{ scope.row.productName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="`${$t('PRODUCT.price')} (m³)`" min-width="200" align="left">
          <template slot="header" slot-scope="{ column }">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </template>
          <template slot-scope="scope">
            <div class="flexSa" v-if="!comDisFrom">
              <el-input-number
                style="width: 96%"
                v-model="scope.row.unitPrice"
                controls-position="right"
                :precision="2"
                v-thousandSplit="{ precision: 2 }"
                :min="0.01"
                :max="9999.99"
              />
            </div>
            <span v-else>{{ $numberStr(scope.row.unitPrice, 2) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ui.isActive')" min-width="200" align="left">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isActive"
              active-value="1"
              inactive-value="0"
              :disabled="comDisFrom"
              v-if="!comDisFrom"
            ></el-switch>
            <template v-else>
              <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
              <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                $t('uiBtn.inactive')
              }}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('ui.action')"
          key="action"
          align="center"
          min-width="120"
          class-name="small-padding fixed-width"
          fixed="right"
          v-if="!comDisFrom"
        >
          <template slot-scope="scope">
            <div class="flexCen">
              <i
                v-if="!scope.row.mixDesignSalesPriceId"
                class="el-icon-delete pointer"
                style="font-size: 20px; color: #f56c6c"
                :title="$t('uiBtn.delete')"
                @click="handleDelRow(scope.$index, scope.row)"
              ></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    comDisFrom: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  watch: {
    'formData.salesPriceList': {
      immediate: true,
      handler: function () {
        let timeId = Date.now()
        this.formData.salesPriceList.forEach((item) => {
          timeId++
          this.$set(item, 'rowTimeId', timeId)
        })
        this.salesPartNoDataList = this.formData.salesPriceList
      }
    }
  },
  data() {
    return {
      salesPartNoDataList: []
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  created() {},
  methods: {
    handleAddSalesPartNo() {
      if (this.loading) return
      this.loading = true
      const form = {
        salesPartNo: '',
        productName: '',
        unitPrice: undefined,
        isActive: '1',
        rowTimeId: Date.now()
      }
      this.salesPartNoDataList.push(JSON.parse(JSON.stringify(form)))
      setTimeout(() => {
        this.loading = false
      }, 50)
      // this.initDraggable()
    },
    /* 行删除 */
    handleDelRow(index, row) {
      this.salesPartNoDataList.splice(index, 1)
    },
    getFieldExists(row) {
      const rowSalesPartNo = (row.salesPartNo || '').trim()
      if (!rowSalesPartNo) return false
      const exists = this.salesPartNoDataList.find(
        (item) =>
          item.rowTimeId !== row.rowTimeId && (item.salesPartNo || '').trim() === rowSalesPartNo
      )
      return !!exists
    },
    selectable(row, rowIndex) {
      if (!row.productName) {
        return false
      }
      return true // 不禁用
    }
  }
}
</script>

<style lang="scss" scoped>
.date-text-color {
  .err-msg {
    white-space: nowrap;
    background-color: #f56c6c;
    border-radius: 6px;
    z-index: 10;
    color: #fff;
    font-size: 10px;
    line-height: 12px;
    padding: 2px 6px;
    position: absolute;
    bottom: 0px;
    right: 0px;
  }
}
</style>
