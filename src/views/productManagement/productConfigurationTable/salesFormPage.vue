<template>
  <!-- formClass="form-page-btn--hide" -->
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" :disabled="tableList.length <= 0" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <div class="form-card">
          <el-collapse-item name="1">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('ui.basicInfo')"
              :warning="collapseWarningForBasicInfo"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5" v-if="!id">
                  <el-button
                    @click="handleAdd"
                    :disabled="tableList.length >= 50"
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    >{{ $t('uiBtn.add') }}</el-button
                  >
                </el-col>
              </el-row>
              <el-table
                border
                ref="tables"
                max-height="600px"
                :row-key="rowIdKey"
                :data="tableList"
                v-table-tab
              >
                <el-table-column
                  type="index"
                  key="index"
                  :label="$t('ui.sn')"
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
                  :min-width="item.minWidth"
                  :show-overflow-tooltip="item.tooltip"
                  :fixed="item.fixed"
                  :sortable="item.sortable"
                  :align="item.align || 'left'"
                  header-align="center"
                >
                  <template slot="header" slot-scope="{ column }">
                    <span
                      v-if="
                        [
                          'productName',
                          'salesName',
                          'salesPartNo',
                          'uom',
                          'amount',
                          'salesUom',
                          'uomCoefficient'
                        ].includes(item.prop)
                      "
                    >
                      <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                    </span>
                    <span v-else>{{ column.label }}</span>
                  </template>
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'productName'">
                      <span v-if="!!id">{{ scope.row.productName }}</span>
                      <SelectInput
                        v-else
                        style="width: 98%"
                        :value="scope.row.productName"
                        :title="scope.row.productName"
                        @clear="productNameClear(scope.row)"
                        clearable
                        :disabled="comDisFrom"
                        @click="openProductNameTable(scope.$index, scope.row)"
                      />
                    </template>
                    <template v-else-if="item.prop === 'isActive'">
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
                    <template v-else-if="item.prop === 'salesName'">
                      <el-input
                        style="width: 98%"
                        :title="scope.row.salesName"
                        v-model="scope.row.salesName"
                        :maxlength="200"
                        :clearable="true"
                        :disabled="comDisFrom || !scope.row.productId"
                      />
                    </template>
                    <template v-else-if="item.prop === 'salesPartNo'">
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
                          :disabled="comDisFrom"
                        />
                      </div>
                    </template>
                    <template v-else-if="item.prop === 'salesUom'">
                      <span v-if="id" :title="showUomLabel(scope.row[item.prop])">{{
                        scope.row[item.prop]
                      }}</span>
                      <el-select
                        style="width: 98%"
                        v-model="scope.row.salesUom"
                        :title="showUomLabel(scope.row[item.prop])"
                        placeholder=""
                        @change="salesUomChange(scope.row)"
                        filterable
                        :disabled="scope.row.isPhantom === '1'"
                        v-else
                      >
                        <el-option
                          v-for="item in scope.row.uomList || []"
                          :key="item"
                          :label="item"
                          :value="item"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop === 'isDefault'">
                      <el-switch
                        v-model="scope.row.isDefault"
                        active-value="1"
                        inactive-value="0"
                        @change="isDefaultChange(scope.row, scope.$index)"
                        v-if="!id"
                      ></el-switch>
                      <template v-else>
                        <el-tag v-if="scope.row.isDefault === '1'">{{ $t('ui.y') }}</el-tag>
                        <el-tag v-if="scope.row.isDefault === '0'" type="danger">{{
                          $t('ui.n')
                        }}</el-tag>
                      </template>
                    </template>
                    <template v-else-if="item.prop === 'uomCoefficient'">
                      <div style="display: flex; width: 98%">
                        <el-input-number
                          class="flex-1"
                          v-model="scope.row.uomCoefficient"
                          controls-position="right"
                          :precision="3"
                          v-thousandSplit="{ precision: 3 }"
                          :min="0.001"
                          :max="99999.999"
                          :disabled="!!id || scope.row.salesUom === scope.row.uom"
                        />
                        <span
                          class="unit flow1"
                          style="display: block; line-height: 28px"
                          :title="showUomLabel(scope.row.uom) || scope.row.uom"
                        >
                          {{ scope.row.uom }}
                        </span>
                      </div>
                    </template>
                    <template v-else-if="item.prop === 'uom'">
                      <el-select
                        style="width: 98%"
                        v-model="scope.row.uom"
                        :title="showUomLabel(scope.row[item.prop])"
                        placeholder=""
                        :disabled="comDisFrom || !scope.row.productId"
                        filterable
                      >
                        <el-option
                          v-for="item in scope.row.uomList || []"
                          :key="item"
                          :label="item"
                          :value="item"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop === 'amount'">
                      <el-input-number
                        v-model="scope.row.amount"
                        :precision="2"
                        v-thousandSplit="{ precision: 2 }"
                        :min="0"
                        :max="999999999999.99"
                        style="width: 98%"
                        controls-position="right"
                        :disabled="comDisFrom"
                      />
                    </template>
                    <template v-else>{{ scope.row[item.prop] }}</template>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('ui.action')"
                  key="action"
                  align="center"
                  min-width="120"
                  class-name="small-padding fixed-width"
                  fixed="right"
                  v-if="!id"
                >
                  <template slot-scope="scope">
                    <div class="flexCen">
                      <i
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
          </el-collapse-item>
        </div>

        <div class="form-card mt10" v-if="id">
          <el-collapse-item name="2">
            <FormCollapseItemTitle slot="title" :title="$t('ui.systemOperationLog')">
              <template v-if="form.operationLogForLast">
                <span
                  v-if="form.operationLogForLast.operatorBy"
                  class="info-item mr20"
                  :title="form.operationLogForLast.operatorBy"
                >
                  {{ $t('ui.operName') }} : {{ form.operationLogForLast.operatorBy }}
                </span>
                <span v-if="form.operationLogForLast.operatorTime" class="info-item">
                  {{ $t('ui.operTime') }} :
                  {{ parseTime(form.operationLogForLast.operatorTime) }}
                </span>
              </template>
            </FormCollapseItemTitle>
            <div class="pb20">
              <SystemOperationLogTable :tableList="form.operationLogList || []" />
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
    <selectProductNameTable ref="selectProductNameTable" @onSuccess="selectProduct" />
  </FormPageLayout>
</template>

<script>
import {
  saveSales,
  updateSales,
  getByIdSales
} from '@/api/productManagement/productConfigurationTable'
import { queryAllUomListByLocalization } from '@/api/system/uom'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import Sortable from 'sortablejs'
import selectProductNameTable from '@/views/productManagement/productConfigurationTable/selectProductNameTable'
import SystemOperationLogTable from '@/views/productManagement/productConfigurationTable/salesSystemOperationLogTable.vue'

export default {
  dicts: ['sys_user_sex'],
  mixins: [pageMixin],
  components: { selectProductNameTable, SystemOperationLogTable },
  data() {
    const vm = this
    return {
      id: '',
      loading: false,
      saveKey: '2',
      rowIdKey: 'id',
      activeNames: ['1', '2'],
      // 总条数
      total: 0,
      /* 表格部分 */
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          tooltip: true,
          minWidth: 160
        },
        {
          prop: 'salesName',
          label: vm.$t('PRODUCT.salesName'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'salesPartNo',
          label: vm.$t('PRODUCT.salesPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        // {
        //   prop: 'uom',
        //   label: vm.$t('PRODUCT.uom1'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: false
        // },
        // {
        //   prop: 'amount',
        //   label: vm.$t('PRODUCT.amount'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: false
        // },
        {
          prop: 'salesUom',
          label: vm.$t('PRODUCT.salesUom'),
          visible: true,
          minWidth: 160,
          fixedWidth: vm.id ? undefined : 200
        },
        {
          prop: 'uomCoefficient',
          label: vm.$t('PRODUCT.ratio'),
          visible: true,
          minWidth: 200
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 120,
          tooltip: true
        }
        /* {
          prop: 'isDefault',
          label: vm.$t('ui.isDefault'),
          visible: true,
          minWidth: 120,
          tooltip: true
        } */
      ],
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined
      },
      collapseWarningForBasicInfo: false,
      rowIndex: undefined,
      form: {},
      allUomList: []
    }
  },
  watch: {
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
        this.$nextTick((res) => {
          this.tableKey = Date.now()
        })
      }
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['productManagement:productConfigurationTable:edit'])
    },
    comDisFrom() {
      if (this.id) {
        return !this.editAuth
      }
      return false
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.timeId = this.$route.query.timeId
    this.id = this.$route.query.id
    if (this.id) {
      this.handleUpdate()
    } else {
      this.handleAdd()
    }
    this.queryAllUomListByLocalization()
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.id = this.$route.query.id
      if (this.id) {
        this.handleUpdate()
      }
      this.queryAllUomListByLocalization()
    }
  },
  methods: {
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'salesName':
            item.tooltip = vm.comDisFrom
            break
          case 'salesPartNo':
            item.tooltip = vm.comDisFrom
            break
        }
      })
    },
    handleAdd() {
      if (this.loading) return
      this.loading = true
      const timeStamp = new Date().getTime()
      const form = {
        productName: '',
        isActive: '1',
        salesPartNo: '',
        salesName: '',
        id: JSON.stringify(timeStamp)
      }
      this.tableList.push(JSON.parse(JSON.stringify(form)))
      setTimeout(() => {
        this.loading = false
      }, 50)
      // this.initDraggable()
    },
    handleUpdate() {
      getByIdSales(this.id).then((res) => {
        const data = res.data
        this.form = res.data
        this.tableList = [data] || []
      })
    },
    queryAllUomListByLocalization() {
      queryAllUomListByLocalization({ localization: this.legalEntityInfo.localization }).then(
        (res) => {
          this.allUomList = (res.data || []).map((x) => x.uomName)
        }
      )
    },
    getFieldExists(row) {
      const rowSalesPartNo = (row.salesPartNo || '').trim()
      if (!rowSalesPartNo) return false
      const exists = this.tableList.find(
        (item) => item.id !== row.id && (item.salesPartNo || '').trim() === rowSalesPartNo
      )
      return !!exists
    },
    isDefaultChange(row, index) {
      const { isDefault, internalPartNo } = row
      if (isDefault) {
        this.tableList.forEach((x, i) => {
          if (x.internalPartNo === internalPartNo && i !== index) {
            this.$set(x, 'isDefault', '0')
          }
        })
      }
    },
    productNameClear(row) {
      this.$set(row, 'productName', '')
      this.$set(row, 'salesName', '')
      this.$set(row, 'internalPartNo', '')
      this.$set(row, 'productId', '')
      this.$set(row, 'productMainId', '')
      this.$set(row, 'salesUom', undefined)
      this.$set(row, 'uom', undefined)
      this.$set(row, 'isDefault', '0')
      this.$set(row, 'uomList', [])
    },
    openProductNameTable(index, row) {
      // const filterIds = this.tableList
      //   .filter((item) => item.productId && item.productId !== row.productId)
      //   .map((item) => item.productId)
      this.rowIndex = index
      this.$refs.selectProductNameTable.handleOpen([])
    },
    selectProduct(row) {
      this.$set(this.tableList[this.rowIndex], 'productName', row.productName)
      this.$set(this.tableList[this.rowIndex], 'salesName', (row.productName || '').slice(0, 200))
      this.$set(this.tableList[this.rowIndex], 'internalPartNo', row.internalPartNo)
      this.$set(this.tableList[this.rowIndex], 'productId', row.productId)
      this.$set(this.tableList[this.rowIndex], 'productMainId', row.productMainId)
      // const uomList = this.allUomList.filter((x) => x !== row.inventoryUom)
      this.$set(this.tableList[this.rowIndex], 'uomList', this.allUomList || [])
      this.$set(this.tableList[this.rowIndex], 'uom', row.uom)
      this.$set(this.tableList[this.rowIndex], 'isPhantom', row.isPhantom)
      if (row.isPhantom === '1') {
        this.$set(this.tableList[this.rowIndex], 'salesUom', row.uom)
        this.$set(this.tableList[this.rowIndex], 'uomCoefficient', 1)
      } else {
        this.$set(this.tableList[this.rowIndex], 'salesUom', undefined)
        this.$set(this.tableList[this.rowIndex], 'uomCoefficient', undefined)
      }
      this.$set(this.tableList[this.rowIndex], 'isDefault', '0')
    },
    salesUomChange(row) {
      const { salesUom, uom } = row
      if (salesUom === uom) {
        this.$set(row, 'uomCoefficient', 1)
      }
    },
    initDraggable() {
      this.destroyDraggable()
      if (this.comDisFrom) {
        return
      }
      setTimeout(() => {
        const el = this.$refs.tables.$el.querySelectorAll(
          '.el-table__fixed-body-wrapper > table > tbody'
        )[0]
        this.sortableDom = Sortable.create(el, {
          handle: '.allowDrag',
          animation: 100,
          ghostClass: 'blue-background-class',
          onEnd: (evt) => {
            if (evt.oldIndex === evt.newIndex) return
            const targetRow = this.tableList.splice(evt.oldIndex, 1)[0]
            this.tableList.splice(evt.newIndex, 0, targetRow)
          }
        })
      }, 300)
    },
    destroyDraggable() {
      if (this.sortableDom) {
        this.sortableDom.destroy()
        this.sortableDom = undefined
      }
    },
    /* 行删除 */
    handleDelRow(index, row) {
      this.tableList.splice(index, 1)

      // this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
      // })
    },
    // 取消按钮
    cancel() {
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/productManagement/productConfigurationTable' })
    },
    submitForm: function () {
      this.$trimOfObj(this.tableList)
      if (!this.id) {
        const productIdFlag = this.tableList.some((x) => !x.productId)
        if (productIdFlag) {
          this.collapseWarningForBasicInfo = true
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
          )
          return
        }
      }
      const salesNameFlag = this.tableList.some((x) => !this.$resultOfBoolean(x.salesName))
      if (salesNameFlag) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.salesName')))
        return
      }
      const salesPartNoFlag = this.tableList.some((x) => !this.$resultOfBoolean(x.salesPartNo))
      if (salesPartNoFlag) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.salesPartNo'))
        )
        return
      }

      const salesUom = this.tableList.some((x) => !this.$resultOfBoolean(x.salesUom))
      if (salesUom) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.salesUom')))
        return
      }

      const uomCoefficient = this.tableList.some((x) => !this.$resultOfBoolean(x.uomCoefficient))
      if (uomCoefficient) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.ratio')))
        return
      }

      this.collapseWarningForBasicInfo = false

      this.$modal
        .confirm(this.$t('PRODUCT.productConfigurationTableSubmit'))
        .then(() => {
          const params = this.$trimOfObj(JSON.parse(JSON.stringify(this.tableList)))
          if (this.id) {
            return updateSales({
              childProductExpansionSalesList: params
            })
          } else {
            return saveSales(params)
          }
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('PRODUCT.productConfigurationTableSuccess'))
          this.cancel()
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss">
.unit {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 30px;
  max-width: 60px;
  padding: 0 8px;
  text-align: center;
  background-color: #f5f7fa;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
