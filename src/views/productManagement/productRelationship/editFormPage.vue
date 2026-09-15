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
            <FormCollapseItemTitle slot="title" :title="$t('menu.productInfo')">
            </FormCollapseItemTitle>
            <el-form
              ref="form1"
              :model="form"
              @submit.native.prevent
              label-width="180px"
              :disabled="true"
            >
              <el-row>
                <el-col :span="16">
                  <el-form-item :label="`${$t('PRODUCT.productCategory1')}`">
                    <ToolTipShowCategory :list="form.categoryNameList || []">
                      <el-input :value="form.categoryNameShowStr" disabled></el-input>
                    </ToolTipShowCategory>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.internalPartNo')}`">
                    <el-input
                      v-model="form.internalPartNo"
                      :title="form.internalPartNo"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item :label="`${$t('PRODUCT.productName')}`">
                    <el-input
                      v-model="form.productName"
                      :title="form.productName"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.uom1')}`">
                    <el-input
                      v-model="form.inventoryUom"
                      :title="showUomLabel(form.inventoryUom)"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.description')">
                    <el-tooltip
                      ref="tooltip"
                      :enterable="true"
                      class="item"
                      effect="light"
                      placement="top"
                      :manual="false"
                      :disabled="!form.description"
                    >
                      <div slot="content" class="desc-tooltip">
                        <div
                          v-if="form.description"
                          style="line-height: 20px; white-space: pre-wrap"
                        >
                          <div>{{ form.description }}</div>
                        </div>
                      </div>
                      <slot>
                        <div :class="{ 'tooltip-row': true }">
                          <MyInput
                            type="textarea"
                            v-model="form.description"
                            :autosize="{ minRows: 2, maxRows: 8 }"
                            resize="none"
                            show-word-limit
                            :maxlength="7000"
                            :disabled="true"
                          ></MyInput>
                        </div>
                      </slot>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
        <div class="form-card">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PRODUCT.supplierDetails')"
              :warning="collapseWarningForBasicInfo"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5" v-if="!comDisFrom">
                  <el-button @click="handleAdd" type="primary" icon="el-icon-plus" size="mini">{{
                    $t('uiBtn.add')
                  }}</el-button>
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
                          'supplierName',
                          // 'externalPartNo',
                          'productName',
                          'purchaseUom',
                          'uomCoefficient'
                        ].indexOf(item.prop) !== -1
                      "
                    >
                      <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                    </span>
                    <span v-else>{{ column.label }}</span>
                  </template>
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'supplierName'">
                      <span>{{ scope.row.businessPartnerName }}</span>
                    </template>

                    <template v-else-if="item.prop === 'label'">
                      <div v-if="id && scope.row.disabledLabel === '1'">{{ scope.row.label }}</div>
                      <SelectInput
                        v-else
                        style="width: 98%"
                        :value="scope.row.label"
                        :title="scope.row.label"
                        @clear="addressClear(scope.row)"
                        clearable
                        :disabled="
                          comDisFrom || !scope.row.businessPartnerId || !scope.row.productId
                        "
                        @click="openAddress(scope.$index, scope.row)"
                      />
                    </template>
                    <template v-else-if="item.prop === 'purchaseUom'">
                      <span
                        v-if="id && scope.row.disabledPurchaseUom === '1'"
                        :title="showUomLabel(scope.row[item.prop])"
                        >{{ scope.row[item.prop] }}</span
                      >
                      <el-select
                        style="width: 98%"
                        v-model="scope.row.purchaseUom"
                        :title="showUomLabel(scope.row[item.prop])"
                        placeholder=""
                        @change="purchaseUomChange(scope.row)"
                        v-else
                        :disabled="!scope.row.businessPartnerId || !scope.row.productId"
                        filterable
                      >
                        <el-option
                          v-for="item in filterUomList(scope.row, scope.$index)"
                          :key="item"
                          :label="item"
                          :value="item"
                        >
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="item.prop === 'productCode'">
                      <el-tooltip placement="top" effect="light">
                        <div slot="content">
                          <ul class="card">
                            <li
                              v-for="(item, index) in scope.row.ivtProducts"
                              :key="index"
                              class="item flow1"
                              :title="item.productName + ' - ' + item.internalPartNo"
                            >
                              {{ item.productName }} - {{ item.internalPartNo }}
                            </li>
                          </ul>
                        </div>
                        <div class="flow1">
                          {{
                            scope.row.ivtProducts &&
                            scope.row.ivtProducts.map((x) => x.internalPartNo).join(',')
                          }}
                        </div>
                      </el-tooltip>
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
                    <template v-else-if="item.prop === 'isDefault'">
                      <el-switch
                        v-model="scope.row.isDefault"
                        active-value="1"
                        inactive-value="0"
                        @change="isDefaultChange(scope.row, scope.$index)"
                        v-if="!comDisFrom"
                      ></el-switch>
                      <template v-else>
                        <el-tag v-if="scope.row.isDefault === '1'">{{ $t('ui.y') }}</el-tag>
                        <el-tag v-if="scope.row.isDefault === '0'" type="danger">{{
                          $t('ui.n')
                        }}</el-tag>
                      </template>
                    </template>
                    <template v-else-if="item.prop === 'moq'">
                      <el-input-number
                        style="width: 98%"
                        v-model="scope.row.moq"
                        controls-position="right"
                        :precision="scope.row.decimalNum"
                        v-thousandSplit="{ precision: scope.row.decimalNum }"
                        :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                        :max="999999"
                        :disabled="comDisFrom"
                      />
                    </template>
                    <template v-else-if="item.prop === 'uomCoefficient'">
                      <div style="display: flex; width: 98%">
                        <el-input-number
                          :key="scope.row.productId + scope.row.includeDecimal"
                          class="flex-1"
                          v-model="scope.row.uomCoefficient"
                          controls-position="right"
                          :precision="3"
                          v-thousandSplit="{ precision: 3 }"
                          :min="0.001"
                          :max="99999.999"
                          :disabled="
                            (!!id && scope.row.disabledUomCoefficient === '1') ||
                            scope.row.purchaseUom === scope.row.inventoryUom
                          "
                        />
                        <div class="unit" :title="showUomLabel(scope.row.inventoryUom)">
                          {{ scope.row.inventoryUom }}
                        </div>
                      </div>
                    </template>

                    <template v-else-if="item.prop === 'leadTime'">
                      <el-input-number
                        style="width: 98%"
                        v-model="scope.row.leadTime"
                        controls-position="right"
                        :precision="0"
                        v-thousandSplit="{ precision: 0 }"
                        :min="1"
                        :max="999999"
                        :disabled="comDisFrom"
                      />
                    </template>
                    <template v-else-if="item.prop === 'externalPartNo'">
                      <el-input
                        style="width: 98%"
                        :title="scope.row.externalPartNo"
                        v-model="scope.row.externalPartNo"
                        :maxlength="200"
                        :disabled="comDisFrom"
                      />
                    </template>
                    <template v-else-if="item.prop === 'remarks'">
                      <descriptionEditDlg
                        v-model="scope.row.remarks"
                        :maxlength="200"
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
                  v-if="!comDisFrom"
                >
                  <template slot-scope="scope">
                    <div class="flexCen">
                      <i
                        v-if="!scope.row.disDelete"
                        class="el-icon-delete pointer"
                        style="font-size: 20px; color: #f56c6c"
                        :title="$t('uiBtn.delete')"
                        @click="handleDelRow(scope.$index, scope.row)"
                      ></i>
                    </div>
                    <!-- <el-button
                      icon="el-icon-delete"
                      type="text"
                      size="mini"
                      style="color: #f56c6c"
                      @click="handleDelRow(scope.$index, scope.row)"
                      >{{ $t('uiBtn.delete') }}</el-button
                    > -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" v-if="false">
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
    <selectSupplierTable ref="selectSupplierTable" @onSuccess="onSelectSupplier" />
    <payToAddressDlg ref="payToAddressDlg" @update="updateAddress" />
  </FormPageLayout>
</template>

<script>
import { update, getById, getProductSheetList } from '@/api/productManagement/productRelationship'
import { queryAllUomListByLocalization } from '@/api/system/uom'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import Sortable from 'sortablejs'
import selectSupplierTable from '@/views/productManagement/productRelationship/selectSupplierTable'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import payToAddressDlg from './payToAddressDlg.vue'

export default {
  dicts: ['sys_user_sex'],
  mixins: [pageMixin],
  components: {
    selectSupplierTable,
    SystemOperationLogTable,
    payToAddressDlg
  },
  data() {
    const vm = this
    return {
      id: '',
      loading: false,
      saveKey: '5',
      rowIdKey: 'rowTimeId',
      activeNames: ['1', '2'],
      // 总条数
      total: 0,
      /* 表格部分 */
      columns: [],
      columns1: [
        {
          prop: 'supplierName',
          label: vm.$t('PRODUCT.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('PRODUCT.supplierCode'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'externalPartNo',
          label: vm.$t('PRODUCT.externalPartNo'),
          visible: true,
          minWidth: 160
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PRODUCT.purchaseUOM1'),
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
          prop: 'moq',
          label: vm.$t('PRODUCT.moq'),
          visible: true,
          minWidth: 160
        },
        {
          prop: 'leadTime',
          label: vm.$t('PRODUCT.deliveryTime'),
          visible: true,
          minWidth: 160
        },
        {
          prop: 'label',
          label: vm.$t('mapLang.addressName'),
          visible: true,
          minWidth: 160
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 120,
          tooltip: true
        },
        /* {
          prop: 'isDefault',
          label: vm.$t('ui.isDefault'),
          visible: true,
          minWidth: 120,
          tooltip: true
        }, */
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
      ],
      columns2: [
        {
          prop: 'supplierName',
          label: vm.$t('PRODUCT.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('PRODUCT.supplierCode'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },

        {
          prop: 'externalPartNo',
          label: vm.$t('PRODUCT.externalPartNo'),
          visible: true,
          minWidth: 160
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PRODUCT.purchaseUOM1'),
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
          prop: 'moq',
          label: vm.$t('PRODUCT.moq'),
          visible: true,
          minWidth: 160
        },
        {
          prop: 'leadTime',
          label: vm.$t('PRODUCT.deliveryTime'),
          visible: true,
          minWidth: 160
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 120,
          tooltip: true
        },
        /* {
          prop: 'isDefault',
          label: vm.$t('ui.isDefault'),
          visible: true,
          minWidth: 120,
          tooltip: true
        }, */
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
      ],
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined
      },
      collapseWarningForBasicInfo: false,
      supplierList: [],
      rowIndex: undefined,
      form: {},
      allUomList: []
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
      return this.checkPermi(['productManagement:productRelationship:edit'])
    },
    comDisFrom() {
      if (this.id) {
        return !this.editAuth
      }
      return false
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    sysDockingSwitch() {
      return this.$store.getters.sysDockingSwitch || this.$store.getters.sysDockingSwitchQC
    },
    // 法人对接
    isSystemDocking() {
      return this.$store.state.user.legalEntityInfo.isSystemDocking
    }
  },
  watch: {
    'legalEntityInfo.isSystemDocking': {
      handler: function (newVal) {
        if (this.sysDockingSwitch && this.isSystemDocking === '1') {
          this.columns = this.columns1
        } else {
          this.columns = this.columns2
        }
        this.$$initColumnVisible(this.saveKey, this.columns)
      }
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    if (this.sysDockingSwitch && this.isSystemDocking === '1') {
      this.columns = this.columns1
    } else {
      this.columns = this.columns2
    }
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.timeId = this.$route.query.timeId
    this.id = this.$route.query.id
    if (this.id) {
      this.handleUpdate()
    } else {
      // this.handleAdd()
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
    handleUpdate() {
      getById(this.id).then((res) => {
        this.form = res.data || {}
        const data = res.data || {}
        const list = data.childProductSheetList || []
        list.forEach((item) => {
          item.ivtProducts = [
            {
              productName: item.productName,
              internalPartNo: item.internalPartNo,
              productId: item.productId
            }
          ]
          if (item.purchaseUom) {
            item.disabledPurchaseUom = '1'
          }
          if (item.uomCoefficient) {
            item.disabledUomCoefficient = '1'
          }
          if (item.label) {
            item.disabledLabel = '1'
          }
          item.disDelete = true
          item.rowTimeId = item.id
        })

        this.tableList = list
      })
    },
    queryAllUomListByLocalization() {
      queryAllUomListByLocalization({ localization: this.legalEntityInfo.localization }).then(
        (res) => {
          this.allUomList = (res.data || []).map((x) => x.uomName)
        }
      )
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
    handleAdd() {
      if (this.loading) return
      this.loading = true
      // this.$refs.selectSupplierTable.handleAdd([...this.tableList])
      this.$refs.selectSupplierTable.handleAdd([])
      setTimeout(() => {
        this.loading = false
      }, 200)
    },

    onSelectSupplier(list) {
      const newList = []
      let timeStamp = new Date().getTime()
      list.forEach((row) => {
        if (row.rowTimeId) {
          newList.push(row)
        } else {
          timeStamp++
          const rowData = {
            businessPartnerId: row.businessPartnerId,
            businessPartnerName: row.businessPartnerName,
            businessPartnerNo: row.businessPartnerNo,
            productName: this.form.productName,
            productId: this.form.productId,
            internalPartNo: this.form.internalPartNo,
            inventoryUom: this.form.inventoryUom,
            includeDecimal: this.form.includeDecimal,
            decimalNum: this.form.decimalNum,
            purchaseUom: undefined,
            ivtProducts: [
              {
                productName: this.form.productName,
                internalPartNo: this.form.internalPartNo,
                productId: this.form.productId,
                chineseName: this.form.chineseName,
                includeDecimal: this.form.includeDecimal,
                productCategoryId: this.form.productCategoryId,
                productCategoryParentsId: this.form.productCategoryParentsId
              }
            ],
            isDefault: '0',
            isActive: '1',
            remarks: '',
            leadTime: undefined,
            externalPartNo: '',
            moq: undefined,
            rowTimeId: JSON.stringify(timeStamp)
          }
          this.getProductSheetList(rowData)
          newList.push(rowData)
        }
      })

      // this.tableList = newList
      console.log(newList)
      this.tableList.push(...newList)
      this.initDraggable()
    },
    openProductNameTable(index, data) {
      this.rowIndex = index
      this.$refs.selectProductNameTable.handleOpen(data)
    },

    filterUomList(row, index) {
      if (!!row.id && !row.disabledPurchaseUom) {
        return this.allUomList || []
      }
      const uomList = row.uomList || []
      if (row.productId && row.businessPartnerId) {
        const filterUomList = []
        this.tableList.forEach((item, z) => {
          if (
            row.productId === item.productId &&
            row.businessPartnerId === item.businessPartnerId &&
            index !== z &&
            item.purchaseUom
          ) {
            filterUomList.push(item.purchaseUom)
          }
        })
        return uomList.filter((uom) => !filterUomList.includes(uom))
      } else {
        return []
      }
    },
    purchaseUomChange(row) {
      if (row.purchaseUom === row.inventoryUom) {
        this.$set(row, 'uomCoefficient', 1)
      }
    },
    onSuccess(e) {
      const ivtProducts = e
      const productName = ivtProducts.map((x) => x.productName).join(',')
      this.$set(this.tableList[this.rowIndex], 'productName', productName)
      this.$set(this.tableList[this.rowIndex], 'ivtProducts', ivtProducts)
      const { inventoryUom, internalPartNo, productId, includeDecimal, decimalNum } = ivtProducts[0]
      this.$set(this.tableList[this.rowIndex], 'inventoryUom', inventoryUom)
      this.$set(this.tableList[this.rowIndex], 'purchaseUom', undefined)
      this.$set(this.tableList[this.rowIndex], 'isDefault', '0')
      this.$set(this.tableList[this.rowIndex], 'internalPartNo', internalPartNo)
      this.$set(this.tableList[this.rowIndex], 'productId', productId)
      this.$set(this.tableList[this.rowIndex], 'includeDecimal', includeDecimal)
      this.$set(this.tableList[this.rowIndex], 'decimalNum', decimalNum)

      this.getProductSheetList(this.tableList[this.rowIndex])
      this.addressClear(this.tableList[this.rowIndex])
    },
    productNameClear(row) {
      this.$set(row, 'productName', '')
      this.$set(row, 'ivtProducts', [])
      this.$set(row, 'uomList', [])
      this.$set(row, 'inventoryUom', undefined)
      this.$set(row, 'purchaseUom', undefined)
      this.$set(row, 'isDefault', '0')
      this.$set(row, 'internalPartNo', undefined)
      this.$set(row, 'productId', undefined)
      this.$set(row, 'includeDecimal', undefined)
      this.$set(row, 'decimalNum', undefined)
      this.addressClear(row)
    },
    addressClear(row) {
      this.$set(row, 'label', undefined)
      this.$set(row, 'businessAddressId', undefined)
      this.$set(row, 'bpAddressDataId', undefined)
      this.$set(row, 'addressCode', undefined)
    },
    openAddress(index, row) {
      this.rowIndex = index
      const { businessPartnerId, productId } = row
      const list =
        this.tableList.filter(
          (x, i) =>
            x.businessPartnerId === businessPartnerId &&
            x.productId === productId &&
            index !== i &&
            !!x.bpAddressDataId
        ) || []
      const alreadySelectBPAddressDataIdList = list.map((x) => x.bpAddressDataId) || []
      const param = { businessPartnerId, productId, alreadySelectBPAddressDataIdList }
      this.$refs.payToAddressDlg.handleOpen(param)
    },
    updateAddress(row) {
      this.$set(this.tableList[this.rowIndex], 'label', row.label)
      this.$set(this.tableList[this.rowIndex], 'businessAddressId', row.businessAddressId)
      this.$set(this.tableList[this.rowIndex], 'bpAddressDataId', row.bpAddressDataId)
      this.$set(this.tableList[this.rowIndex], 'addressCode', row.addressCode)
    },
    getProductSheetList(row) {
      const timer = Date.now()
      row.queryTime = timer
      if (row.productId && row.businessPartnerId) {
        getProductSheetList({
          productId: row.productId,
          businessPartnerId: row.businessPartnerId
        }).then((res) => {
          if (timer !== row.queryTime) return
          const filterList = (res.data || []).map((item) => item.purchaseUom)
          const uomList = this.allUomList.filter((x) => !filterList.includes(x))
          this.$set(row, 'uomList', [...uomList])
        })
      } else {
        this.$set(row, 'uomList', [])
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
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
      })
    },
    // 取消按钮
    cancel() {
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/productManagement/productRelationship' })
    },
    submitForm: function () {
      if (!this.id) {
        const supplierFlag = this.tableList.some((x) => !this.$resultOfBoolean(x.businessPartnerId))
        if (supplierFlag) {
          this.collapseWarningForBasicInfo = true
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.supplierName'))
          )
          return
        }

        const productIdFlag = this.tableList.some(
          (x) => !x.ivtProducts || x.ivtProducts.length <= 0
        )
        if (productIdFlag) {
          this.collapseWarningForBasicInfo = true
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
          )
          return
        }
      }
      /* const externalPartNo = this.tableList.some((x) => !(x.externalPartNo || '').trim())
      if (externalPartNo) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.externalPartNo'))
        )
        return
      } */

      const purchaseUom = this.tableList.some((x) => !this.$resultOfBoolean(x.purchaseUom))
      if (purchaseUom) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.purchaseUOM1'))
        )
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
        .confirm(this.$t('PRODUCT.productRelationshipConfirm'))
        .then(() => {
          this.form.childProductSheetList = this.tableList
          const params = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
          if (this.id) {
            return update(params)
          }
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('PRODUCT.productRelationshipSuccess'))
          this.cancel()
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
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
.card {
  max-width: 500px;
  max-height: 300px;
  overflow: hidden auto;
  .item {
    font-size: 14px;
    line-height: 20px;
    width: 100%;
  }
}
.flow1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: initial;
}

.card::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(127, 135, 146, 0.5);
}

.card::-webkit-scrollbar-track {
  width: 10px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
</style>
