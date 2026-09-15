<template>
  <FormPageLayoutTabs v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm" :disabled="tableList.length <= 0"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <div>
        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="1">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.basicInfo')"
                :warning="collapseWarningForBasicInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="form1"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.extendedOrganization')}`">
                      <el-input
                        v-model="form.legalEntityName"
                        :title="form.legalEntityName"
                        maxlength="200"
                        class="form-wd"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="legalEntityInfo.isSystemDocking === '1'">
                    <el-form-item :label="`${$t('ui.zoneName')}`" prop="zoneIdList">
                      <el-select
                        style="width: 100%"
                        v-model="form.zoneIdList"
                        :title="zoneNameShowStr"
                        placeholder=""
                        multiple
                        collapse-tags
                        class="log-msg-ellipsis"
                      >
                        <el-option
                          v-for="item in zoneList"
                          :key="item.zoneId"
                          :label="item.zoneName"
                          :value="item.zoneId"
                          :disabled="item.disabled"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('menu.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5">
                    <el-button
                      @click="handleBtnAdd"
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      :disabled="form.legalEntityIdList.length <= 0"
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
                  :cell-class-name="cellClassName"
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
                      <span v-if="['uom'].includes(item.prop)">
                        <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                      </span>
                      <span v-else>{{ column.label }}</span>
                    </template>
                    <template slot-scope="scope">
                      <template v-if="item.prop === 'uom'">
                        <el-select
                          style="width: 98%"
                          v-model="scope.row.uom"
                          :title="showUomLabel(scope.row[item.prop])"
                          placeholder=""
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
                      <template v-else-if="item.prop === 'localization'">{{
                        selectDictLabel(dict.type.sys_localization, scope.row.localization)
                      }}</template>
                      <template v-else-if="item.prop === 'description'">
                        <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
                      </template>
                      <template v-else>{{ scope.row[item.prop] }}</template>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column
                    :label="$t('ui.uom')"
                    key="uom"
                    align="center"
                    min-width="120"
                    class-name="small-padding fixed-width "
                    fixed="right"
                    prop="uom"
                  >
                    <template slot-scope="scope">
                      <div class="flexCen">
                        <i
                          class="el-icon-document pointer"
                          style="font-size: 20px; color: #409eff"
                          :title="$t('ui.uom')"
                          @click="handleUom(scope.row)"
                        ></i>
                      </div>
                    </template>
                  </el-table-column> -->
                  <el-table-column
                    :label="$t('ui.action')"
                    key="action"
                    align="center"
                    min-width="120"
                    class-name="small-padding fixed-width"
                    fixed="right"
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
        </el-collapse>
      </div>
    </template>
    <selectProductNameTable
      ref="selectProductNameTable"
      :legalEntityIdList="form.legalEntityIdList"
      @onSuccess="updateTable"
    />
    <productExtendedTable ref="productExtendedTable" :legalEntityIdList="form.legalEntityIdList" />
  </FormPageLayoutTabs>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'
import {
  queryLegalEntityList,
  queryErrorProductExtendedList,
  batchSubmitProductExtended
} from '@/api/productManagement/productExtended'
import { getAllZoneList } from '@/api/organization/zone'

import selectProductNameTable from './selectProductNameTable'
import productExtendedTable from './productExtendedTable'

export default {
  name: 'AddProductExtended',
  dicts: ['sys_localization'],
  mixins: [pageMixin],
  components: { FormPageLayoutTabs, selectProductNameTable, productExtendedTable },
  data() {
    const vm = this
    return {
      saveKey: '2',
      activeNames: ['1', '2'],
      rowIdKey: 'customId',
      rowId: '',
      timeId: '',
      form: {
        zoneIdList: []
      },
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        legalEntityIdList: [
          {
            required: true,
            type: 'array',
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        zoneIdList: [
          {
            required: true,
            type: 'array',
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'localization',
          label: vm.$t('ui.localization'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.inventoryUOM1'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
      ],
      tableList: [],
      extendedOrganizationList: [],
      submitLoading: false,
      zoneList: []
    }
  },
  props: {
    propTimeId: {
      type: String,
      default: ''
    },
    propRowId: {
      type: String,
      default: ''
    }
  },
  watch: {
    legalEntityInfo: {
      immediate: true,
      handler: function (value) {
        if (value && value.legalEntityId) {
          this.$set(this.form, 'legalEntityIdList', [value.legalEntityId])
          this.$set(this.form, 'legalEntityName', value.legalEntityName)
          if (value.isSystemDocking === '1') {
            this.getAllZoneList()
          }
        }
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },

    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
      // currency: row.currency,
      // currencyId: row.currencyId,
      // currencyCode: row.currencyCode,
    },
    zoneNameShowStr() {
      const { zoneIdList } = this.form
      if (!zoneIdList || zoneIdList.length <= 0) return ''
      if (!this.zoneList || this.zoneList.length <= 0) return ''
      return this.zoneList
        .filter((x) => zoneIdList.indexOf(x.zoneId) !== -1)
        .map((x) => x.zoneName)
        .join(', ')
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.reset()
    if (this.legalEntityInfo.legalEntityId) {
      this.$set(this.form, 'legalEntityName', this.legalEntityInfo.legalEntityName)
      this.$set(this.form, 'legalEntityIdList', [this.legalEntityInfo.legalEntityId])
    }
    if (this.legalEntityInfo.isSystemDocking === '1') {
      this.getAllZoneList()
    }
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    getAllZoneList() {
      getAllZoneList({}).then((res) => {
        this.zoneList = res.data || []
        const zoneIdList = this.zoneList.map((x) => x.zoneId)
        this.$set(this.form, 'zoneIdList', zoneIdList)
      })
    },

    reset() {
      this.form = {
        zoneIdList: [],
        legalEntityIdList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.activeNames = ['1', '2']
      this.resetForm('form1')
    },
    cellClassName({ row, column }) {
      let cellClass = ''
      if (row.isErr === '1' && column.property === 'uom' && row.productType === '1') {
        cellClass = 'is-err-table-cell'
      }
      return cellClass
    },
    nav(row) {
      const fromSrcPath = encodeURIComponent('/productManagement/addProductExtended')
      this.$router.push({
        path: '/productManagement/editExtendedProductInfo',
        query: {
          id: row.productId,
          timeId: Date.now(),
          fromSrcPath
        }
      })
    },
    extendedOrganizationChange() {
      this.tableList = []
    },
    handleBtnAdd() {
      // const alreadySelectIdList = this.tableList.map((item) => item.productId)
      // this.$refs.selectProductNameTable.handleOpen(alreadySelectIdList)
      const tableList = JSON.parse(JSON.stringify(this.tableList))
      this.$refs.selectProductNameTable.handleOpen(tableList)
    },
    updateTable(list) {
      const rows = JSON.parse(JSON.stringify(list))
      this.tableList.length = 0
      this.tableList.push(...rows)
      // this.tableList = list
      // if (list.length > 0) {
      //   const rows = JSON.parse(JSON.stringify(list))
      //   this.tableList.push(...rows)
      // }
      this.queryErrorProductExtendedList()
    },
    queryErrorProductExtendedList() {
      if (this.tableList.length <= 0) return
      const params = {
        legalEntityIdList: this.form.legalEntityIdList,
        productExtendedList: this.tableList
      }
      queryErrorProductExtendedList(params).then((res) => {
        const { productExtendedList } = res.data
        if (productExtendedList && productExtendedList.length > 0) {
          const ids = productExtendedList.map((x) => x.productMainId)
          this.tableList.forEach((x) => {
            const find = ids.indexOf(x.productMainId)
            if (find !== -1) {
              this.$set(x, 'uom', productExtendedList[find].uom)
              this.$set(x, 'uomList', productExtendedList[find].uomList)
            }
          })
        }
      })
    },
    queryLegalEntityList() {
      queryLegalEntityList({}).then((res) => {
        this.extendedOrganizationList = res.data || []
      })
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/productManagement/productExtended' })
    },
    handleUom(row) {
      this.$refs.productExtendedTable.handleOpen(row)
    },
    /* 行删除 */
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
      })
    },
    async submitForm() {
      const uom = this.tableList.some((x) => !x.uom)
      if (uom) {
        this.collapseWarningForProductInfo = true
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.inventoryUOM1'))
        )
        return
      }
      this.collapseWarningForProductInfo = false

      const param = {
        legalEntityIdList: this.form.legalEntityIdList,
        productExtendedList: this.tableList
      }
      if (this.legalEntityInfo.isSystemDocking === '1') {
        const valid3 = await this.$refs.form1.validate().catch((err) => {
          return err
        })

        if (!valid3) {
          return
        }

        param.zoneIdList = this.form.zoneIdList
      }
      this.$modal
        .confirm(this.$t('ui.submitPageConfirm'))
        .then(() => {
          this.submitLoading = true
          queryErrorProductExtendedList(param)
            .then((res) => {
              const { errorProductExtendedList } = res.data
              if (errorProductExtendedList && errorProductExtendedList.length > 0) {
                this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.unit')))
                this.submitLoading = false
              } else {
                batchSubmitProductExtended(param)
                  .then((res) => {
                    this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
                    this.cancel()
                    this.submitLoading = false
                  })
                  .catch(() => {
                    this.submitLoading = false
                  })
              }
            })
            .catch(() => {
              this.submitLoading = false
            })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
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
