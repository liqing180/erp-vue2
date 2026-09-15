<template>
  <div>
    <el-dialog
      v-dialogDrag
      v-dialogDragWidth
      :title="$t('uiBtn.add')"
      :visible.sync="visible"
      width="1140px"
      :modal="true"
      :close-on-click-modal="false"
      @closed="closed"
    >
      <el-form
        :model="termForm"
        :rules="termFormRules"
        label-width="180px"
        :disabled="comDisFrom"
        ref="termForm"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('organization.accountName')}`" prop="accountName">
              <el-autocomplete
                style="width: 100%"
                v-model="termForm.accountName"
                :fetch-suggestions="accountNameQuerySug"
                @select="accountNameChange"
                placeholder
                clearable
                :maxlength="200"
                :disabled="!!termForm.id"
                highlight-first-item
                select-when-unmatched
                ref="autocomplete"
                @blur="blurFn"
                @focus="focusFn"
                @clear="accountNameClear"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('organization.beneficiaryName')}`" prop="beneficiaryName">
              <el-input
                v-model="termForm.beneficiaryName"
                maxlength="200"
                :disabled="!!termForm.id"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="`${$t('organization.bankAccountNumber')}`"
              prop="bankAccountNumber"
            >
              <el-input
                v-model="termForm.bankAccountNumber"
                maxlength="200"
                :disabled="!!termForm.id"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('organization.bankName')}`" prop="bankName">
              <el-input
                v-model="termForm.bankName"
                maxlength="200"
                :disabled="!!termForm.id"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="`${$t('organization.accountCurrency')}`"
              prop="accountCurrencyCode"
            >
              <CommonSelect
                :id="termForm.accountCurrencyCode"
                :label="termForm.accountCurrency"
                :title="termForm.accountCurrency"
                idKey="currencyCode"
                labelKey="currency"
                :filterable="true"
                :clearable="false"
                :options="currencyOptions || []"
                @change="currencyChange"
                :disabled="!!termForm.id"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('organization.SWIFTCode')}`" prop="swiftCode">
              <el-input
                v-model="termForm.swiftCode"
                maxlength="200"
                :disabled="!!termForm.id"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('organization.bankCode')}`" prop="bankCode">
              <el-input
                v-model="termForm.bankCode"
                maxlength="200"
                :disabled="!!termForm.id"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('organization.branchCode')}`" prop="branchCode">
              <el-input
                v-model="termForm.branchCode"
                maxlength="200"
                :disabled="!!termForm.id"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('organization.businessRegNo')}`">
              <el-input
                :value="createForm.companyRegNo"
                :title="createForm.companyRegNo"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.addressLine1')}`" prop="address1">
              <el-input
                v-model="termForm.address1"
                maxlength="500"
                :disabled="!!termForm.id"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.addressLine2')}`">
              <el-input
                v-model="termForm.address2"
                maxlength="500"
                :disabled="!!termForm.id"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.provinceState')}`" prop="province">
              <el-input
                v-model="termForm.province"
                maxlength="200"
                :disabled="!!termForm.id"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.cityTown')}`" prop="city">
              <el-input
                v-model="termForm.city"
                maxlength="200"
                :disabled="!!termForm.id"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('organization.location')}`" prop="location">
              <el-input
                v-model="termForm.location"
                maxlength="200"
                :disabled="!!termForm.id"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.postalCode')}`">
              <el-input
                v-model="termForm.postalCode"
                maxlength="200"
                :disabled="!!termForm.id"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('organization.bankCountry')}`" prop="bankCountry">
              <CountrySelect
                v-model="termForm.bankCountry"
                class="form-wd"
                @select="handleCountrySelect"
                :disabled="!!termForm.id"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('ui.remarks')">
              <MyInput
                type="textarea"
                v-model="termForm.remarks"
                :autosize="{ minRows: 2, maxRows: 8 }"
                resize="none"
                show-word-limit
                :maxlength="500"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.isActive')}`">
              <el-switch
                v-model="termForm.isActive"
                :disabled="comDisFrom"
                :active-value="1"
                :inactive-value="0"
                @change="isActiveChange"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.isDefault')}`">
              <el-switch
                v-model="termForm.isDefault"
                :disabled="comDisFrom"
                :active-value="1"
                :inactive-value="0"
                @change="isDefaultChange"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <template>
          <el-button size="small" @click="visible = false">{{ $t('uiBtn.back') }}</el-button>

          <el-button
            type="primary"
            v-if="!comDisFrom"
            size="small"
            :loading="btnLoading"
            @click="handleEditTerm"
            >{{ $t('uiBtn.save') }}</el-button
          >
        </template>
      </div>
    </el-dialog>

    <div>
      <div class="pb20">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              v-if="!comDisFrom"
              @click="handleAdd"
              >{{ $t('uiBtn.add') }}</el-button
            >
          </el-col>
          <right-toolbar
            :showSearchBtn="false"
            :showRefreshBtn="false"
            :saveKey="saveKey"
            :columns="configColumn"
            :columnsInit="columns"
          ></right-toolbar>
        </el-row>
        <el-table
          border
          ref="tables"
          :row-key="rowIdKey"
          :row-class-name="tableRowClassName"
          :key="'table' + modifyHighlight"
          :cell-class-name="tableCellClassName"
          :data="comTableList"
          @row-dblclick="handleTermRowClick"
          style="cursor: pointer"
        >
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
              <template v-if="item.prop === 'isActive'">
                <el-tag v-if="scope.row.isActive === 1">{{ $t('uiBtn.active') }}</el-tag>
                <el-tag v-if="scope.row.isActive === 0" type="danger">{{
                  $t('uiBtn.inactive')
                }}</el-tag>
              </template>
              <template v-else-if="item.prop === 'isDefault'">
                <el-tag v-if="scope.row.isDefault === 1">{{ $t('ui.y') }}</el-tag>
                <el-tag v-if="scope.row.isDefault === 0" type="danger">{{ $t('ui.n') }}</el-tag>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
          <el-table-column
            v-if="false"
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
                  class="el-icon-edit pointer mr5"
                  style="font-size: 20px; color: #409eff"
                  :title="$t('uiBtn.edit')"
                  @click="handleTermRowClick(scope.row)"
                ></i>
                <i
                  class="el-icon-delete pointer"
                  style="font-size: 20px; color: #f56c6c"
                  :title="$t('uiBtn.delete')"
                  v-if="!(scope.row.labelList || []).includes('Registered')"
                  @click.stop="handleDelRow(scope.$index, scope.row)"
                ></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import CountrySelect from '@/components/select/countrySelect'
import { queryCitiesByStatesName, queryStatesByCountriesName } from '@/api/countries'
import { queryCurrencyListBySelect } from '@/api/basic/basic'

export default {
  dicts: [],
  mixins: [pageMixin],
  components: {
    CountrySelect
  },
  props: {
    comDisFrom: {
      type: [Boolean],
      default: false
    },
    modifyHighlight: {
      type: [Boolean],
      default: false
    },
    createForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    comTableList() {
      const list = this.tableList
      // 将isDefault === 1的项移动到最前面
      list.sort((a, b) => {
        if (a.isDefault === 1) {
          return -1
        }
        if (b.isDefault === 1) {
          return 1
        }
        return 0
      })
      return list
    }
  },
  watch: {
    'createForm.bankInfoList': {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.tableList = newValue || []
        this.tableList.forEach((x) => {
          if (x.id) {
            x.rowTimeId = x.id
          }
        })
        this.changeTableList()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '152',
      /* 表格表单部分 */
      termForm: {
        label: ''
      },
      termFormRules: {
        accountName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        beneficiaryName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        bankAccountNumber: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        bankCode: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        branchCode: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        accountCurrencyCode: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        bankName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        swiftCode: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        labelList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        address1: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        province: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        city: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        location: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        bankCountry: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        countryEn: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        geofenceType: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('mapLang.geofence')),
            trigger: ['change']
          }
        ],
        latLng: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('mapLang.locationMap')),
            trigger: ['change', 'blur']
          }
        ],
        cityTown: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('mapLang.cityTown')),
            trigger: ['change']
          }
        ]
      },
      isTermEdit: false,
      editIndex: undefined,
      /* 表格部分 */
      columns: [
        {
          prop: 'accountName',
          label: vm.$t('organization.accountName'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'beneficiaryName',
          label: vm.$t('organization.beneficiaryName'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'bankName',
          label: vm.$t('organization.bankName'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'bankAccountNumber',
          label: vm.$t('organization.bankAccountNumber'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'bankAddress',
          label: vm.$t('organization.bankAddress'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'accountCurrency',
          label: vm.$t('organization.accountCurrency'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'bankCountry',
          label: vm.$t('organization.bankCountry'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'isDefault',
          label: vm.$t('ui.isDefault'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'rowTimeId',
      visible: false,
      projectListCascader: [],
      provinceStateLoading: false,
      provinceStateList: [],
      cityTownLoading: false,
      cityTownList: [],
      btnLoading: false,
      accountList: [
        { value: vm.$t('organization.singaporeDollarAccount') },
        { value: vm.$t('organization.USDollarAccount') },
        { value: vm.$t('organization.chineseYuanAccount') }
      ],
      currencyOptions: []
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.queryCurrencyListBySelect()
  },
  methods: {
    queryCurrencyListBySelect() {
      queryCurrencyListBySelect().then((res) => {
        const list = res.data || []
        this.currencyOptions = list.map((item) => {
          item.label = `${item.currencyCode} (${item.currencyDesc})`
          return item
        })
      })
    },
    isActiveChange() {
      if (this.termForm.isActive !== 1) {
        this.termForm.isDefault = 0
      }
    },
    isDefaultChange() {
      if (this.termForm.isDefault === 1) {
        this.termForm.isActive = 1
      }
    },
    accountNameQuerySug(queryString, cb) {
      const list = this.accountList

      let results
      if (queryString) {
        results = list.filter(
          (umo) => umo.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      } else {
        results = list
      }
      cb(results)
    },
    accountNameChange(val) {
      this.termForm.accountName = val.value
    },
    blurFn() {
      this.mouseType = 'blur'
    },
    focusFn() {
      this.mouseType = 'focus'
    },
    accountNameClear() {
      if (this.mouseType === 'focus') {
        this.$refs.autocomplete.activated = true
      }
    },
    currencyChange(row) {
      this.$set(this.termForm, 'accountCurrencyId', row.id)
      this.$set(this.termForm, 'accountCurrency', row.currency)
      this.$set(this.termForm, 'accountCurrencyCode', row.currencyCode)
      this.$set(this.termForm, 'accountCurrencySymbol', row.currencySymbol)
    },
    changeEmployeeNoSwitch(code) {
      this.$set(this.termForm, code, '')
      if (this.$refs.termForm) {
        this.$nextTick(() => {
          this.$refs.termForm.clearValidate(code)
        })
      }
    },

    // 项目下拉变化
    projectChange(e) {},
    geofenceLatLngListChange(data) {
      // console.log(data, '===')
      this.$set(this.termForm, 'geofencePolygonLatLng', '')
      this.$set(this.termForm, 'geofencePolygonLatLngList', data.latLngList)
      this.$set(this.termForm, 'geofenceRadiusLatLng', data.circleLatLng)
      this.$set(this.termForm, 'geofenceRadius', data.circleRadius)
      this.$set(this.termForm, 'geofenceType', data.geofenceType)
    },

    /* 省份相关操作 */
    provinceStateVisible(value) {
      if (value) {
        this.provinceStateLoading = true
        queryStatesByCountriesName({ countriesName: this.termForm.countryEn })
          .then((res) => {
            this.provinceStateList = res.data || []
            this.provinceStateLoading = false
          })
          .catch(() => {
            this.provinceStateLoading = false
          })
      }
    },
    provinceStateChange() {
      this.termForm.cityTown && this.$set(this.termForm, 'cityTown', '')
      this.termForm.postalCode && this.$set(this.termForm, 'postalCode', '')
      this.termForm.latLng && this.$set(this.termForm, 'latLng', '')
      this.termForm.province = this.termForm.provinceState
    },
    /* 城市相关操作 */
    cityTownVisible(value) {
      if (value) {
        this.cityTownLoading = true
        queryCitiesByStatesName({ statesName: this.termForm.provinceState })
          .then((res) => {
            this.cityTownList = res.data || []
            this.cityTownLoading = false
          })
          .catch(() => {
            this.cityTownLoading = false
          })
      }
    },
    cityTownChange() {
      this.termForm.postalCode && this.$set(this.termForm, 'postalCode', '')
      this.termForm.latLng && this.$set(this.termForm, 'latLng', '')
      this.termForm.city = this.termForm.cityTown
    },
    /* 版本比对 */
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        }
        if (row.updateType === '3') {
          color = 'cancel-row'
        }
      }
      const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'table-SelectedRow-bgcolor'
      }

      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (this.modifyHighlight) {
        if (row.updateType === '1') {
          if ((row.updateMsgList || []).find((item) => item.name === column.property)) {
            cellClass = 'edit-table-cell'
          }
        }
      }

      return cellClass
    },

    reset() {
      this.tableList = []
      this.selected = []
      this.destroyDraggable()
      this.handleResetTerm()
    },
    getTableList() {
      return this.tableList
    },
    initList(list) {
      this.tableList = list
      console.log(this.tableList, '=====1031')
      this.$emit('change', list)
    },
    /* 表格表单部分 */
    handleCountrySelect(row) {
      if (row) {
        const { id, name, code } = row
        this.$set(this.termForm, 'bankCountry', name)
        this.$set(this.termForm, 'bankCountryId', id)
        this.$set(this.termForm, 'bankCountryCode', code)
      }
    },
    handleResetTerm() {
      this.isTermEdit = false
      this.editIndex = undefined
      this.termForm = {
        label: '',
        address1: '',
        address2: '',
        addressMap: '',
        city: '',
        province: '',
        isActive: 1,
        isDefault: 0,
        countryId: undefined,
        bankCountry: undefined,
        provinceState: undefined,
        cityTown: undefined,
        isAutoAddressCode: '1',
        addressCode: undefined,
        latLng: undefined,
        geofenceType: undefined
      }
      this.$nextTick(() => {
        this.$refs.termForm && this.$refs.termForm.clearValidate()
      })

      setTimeout(() => {
        this.$refs.termForm && this.$refs.termForm.clearValidate()
      }, 200)
    },
    closed() {
      this.btnLoading = false
      this.handleResetTerm()
    },
    handleAdd() {
      this.visible = true
      this.isTermEdit = false

      this.handleResetTerm()
    },
    handleTermRowClick(dataRow) {
      const vm = this
      vm.isTermEdit = true
      vm.editIndex = vm.tableList.findIndex((item) => item.rowTimeId === dataRow.rowTimeId)
      const params = JSON.parse(JSON.stringify(dataRow))
      params.provinceState = params.province
      params.cityTown = params.city

      vm.termForm = {
        ...params
      }
      this.visible = true
    },
    handleEditTerm() {
      const vm = this

      vm.$refs.termForm.validate((valid) => {
        if (valid) {
          vm.btnLoading = true

          const params = JSON.parse(JSON.stringify(vm.termForm))
          params.address = params.address1
          params.bankAddress = params.address1
          const { address2, province, city, location, postalCode, bankCountry } = params
          if (address2) {
            params.bankAddress += ',' + address2
          }
          if (province) {
            params.bankAddress += ',' + province
          }
          if (city) {
            params.bankAddress += ',' + city
          }
          if (location) {
            params.bankAddress += ',' + location
          }
          if (postalCode) {
            params.bankAddress += ',' + postalCode
          }
          if (bankCountry) {
            params.bankAddress += ',' + bankCountry
          }
          const list = vm.tableList.filter((item) => item.rowTimeId !== params.rowTimeId)
          const isDefault = list.find((item) => item.isDefault === 1)
          console.log(isDefault, '============884')
          if (!isDefault && params.isDefault !== 1) {
            const row = vm.tableList.filter((item) => item.rowTimeId === params.rowTimeId)[0]
            let content = vm.$t('organization.noDefaultBank')
            if (row && row.isDefault === 1) {
              content = vm.$t('organization.noDefaultBank1')
            }
            this.$modal
              .confirm(content)
              .then(() => {
                if (row.isDefault !== 1) {
                  params.isDefault = 1
                  params.isActive = 1
                }
                if (vm.isTermEdit) {
                  vm.$set(vm.tableList, vm.editIndex, { ...params })
                } else {
                  params.rowTimeId = Date.now()
                  vm.tableList.push({
                    ...params
                  })
                }

                this.$emit('change', vm.tableList)
                vm.visible = false
                vm.changeTableList()
                setTimeout(() => {
                  vm.btnLoading = false
                }, 200)
              })
              .catch(() => {
                if (!row || row.isDefault !== 1) {
                  if (vm.isTermEdit) {
                    vm.$set(vm.tableList, vm.editIndex, { ...params })
                  } else {
                    params.rowTimeId = Date.now()
                    vm.tableList.push({
                      ...params
                    })
                  }

                  this.$emit('change', vm.tableList)
                  vm.visible = false
                  vm.changeTableList()
                }

                setTimeout(() => {
                  vm.btnLoading = false
                }, 200)
              })
          } else if (isDefault && params.isDefault === 1) {
            // 列表中存在默认，并且当前添加的行是默认行
            this.$modal
              .confirm(vm.$t('organization.replaceDefaultConfirm'))
              .then(() => {
                vm.tableList.forEach((x) => (x.isDefault = 0))

                if (vm.isTermEdit) {
                  vm.$set(vm.tableList, vm.editIndex, { ...params })
                } else {
                  params.rowTimeId = Date.now()
                  vm.tableList.push({
                    ...params
                  })
                }

                this.$emit('change', vm.tableList)
                vm.visible = false
                vm.changeTableList()
                setTimeout(() => {
                  vm.btnLoading = false
                }, 200)
              })
              .catch(() => {
                params.isDefault = 0

                if (vm.isTermEdit) {
                  vm.$set(vm.tableList, vm.editIndex, { ...params })
                } else {
                  params.rowTimeId = Date.now()
                  vm.tableList.push({
                    ...params
                  })
                }

                this.$emit('change', vm.tableList)
                vm.visible = false
                vm.changeTableList()

                setTimeout(() => {
                  vm.btnLoading = false
                }, 200)
              })
          } else {
            if (vm.isTermEdit) {
              vm.$set(vm.tableList, vm.editIndex, { ...params })
            } else {
              params.rowTimeId = Date.now()
              vm.tableList.push({
                ...params
              })
            }
            this.$emit('change', vm.tableList)
            vm.visible = false
            vm.changeTableList()
            setTimeout(() => {
              vm.btnLoading = false
            }, 200)
          }
          console.log('==============805')
        }
      })
    },
    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },

    /* 行删除 */
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.$emit('change', this.tableList)
        setTimeout(() => {
          this.handleResetTerm()
        }, 20)
        const findIndex = this.selected.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        if (findIndex !== -1) {
          this.selected.splice(findIndex, 1)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.isRegistered {
  .el-select__tags .el-tag:first-of-type .el-tag__close {
    display: none;
  }
}
</style>
