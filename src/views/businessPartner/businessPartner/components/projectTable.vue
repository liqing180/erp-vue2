<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="$t('bp.project')"
      :visible.sync="visible"
      width="1140px"
      :modal="true"
      :close-on-click-modal="false"
      @closed="closed"
    >
      <el-form
        :model="termForm"
        :rules="termFormRules"
        label-width="140px"
        :disabled="comDisFrom"
        ref="termForm"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('bp.projectName')}`" prop="projectName">
              <el-input
                v-model="termForm.projectName"
                :title="termForm.projectName"
                maxlength="500"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('bp.projectAbbreviation')" prop="projectAbbreviation">
              <el-input
                v-model="termForm.projectAbbreviation"
                :title="termForm.projectAbbreviation"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              v-if="!termForm.projectId"
              :label="`${$t('bp.projectCode')}`"
              :rules="[
                {
                  required: termForm.isAutoProjectCode === '0',
                  pattern: new RegExp(/^(?!(\s+$))/g),
                  message: $t('ui.reqMsg'),
                  trigger: ['blur', 'cahnge']
                }
              ]"
              prop="projectCode"
            >
              <div class="input-switch-box">
                <div class="con-left">
                  <el-input
                    :disabled="termForm.isAutoProjectCode === '1'"
                    v-model="termForm.projectCode"
                    maxlength="50"
                  />
                </div>
                <div class="con-right">
                  <el-switch
                    v-model="termForm.isAutoProjectCode"
                    active-value="1"
                    inactive-value="0"
                    @change="changeEmployeeNoSwitch('projectCode')"
                  ></el-switch>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="`${$t('bp.projectCode')}`" prop="projectCode" v-else>
              <el-input disabled v-model="termForm.projectCode" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('bp.projectZone')" prop="zoneItem">
              <el-select
                v-model="termForm.zoneItem"
                value-key="zoneId"
                placeholder=""
                clearable
                style="width: 100%"
                filterable
                @change="zoneChange"
                v-if="!termForm.projectId"
              >
                <el-option
                  v-for="dict in (zoneList || []).filter((item) => item.isActive === '1')"
                  :key="dict.zoneId"
                  :label="dict.zoneName"
                  :value="dict"
                />
              </el-select>
              <el-input
                v-else
                :value="termForm.zoneName"
                :title="termForm.zoneName"
                maxlength="30"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item :label="$t('bp.projectAddress')" prop="siteAddress">
              <SelectInput
                :value="termForm.siteAddress"
                @clear="siteAddressChange"
                clearable
                :disabled="comDisFrom"
                :title="termForm.siteAddress"
                @click="siteAddressClick"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('bp.productMinVol')" prop="productMinVol">
              <el-input-number
                style="width: 100%"
                v-model="termForm.productMinVol"
                controls-position="right"
                :precision="2"
                v-thousandSplit="{ precision: 2 }"
                :min="1"
                :max="999999"
                @change="projectMaxVolChange('productMinVol', 'projectMaxVol')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('bp.projectMaxVol')" prop="projectMaxVol">
              <el-input-number
                style="width: 100%"
                v-model="termForm.projectMaxVol"
                controls-position="right"
                :precision="2"
                v-thousandSplit="{ precision: 2 }"
                :min="1"
                :max="9999999.99"
                @change="projectMaxVolChange('projectMaxVol', 'productMinVol')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="`${$t('bp.projectContactPersonName')}`"
              prop="projectContactPersonIdList"
            >
              <el-select
                v-model="termForm.projectContactPersonIdList"
                :title="
                  contactPersonList
                    .filter((item) =>
                      (termForm.projectContactPersonIdList || []).includes(item.rowTimeId)
                    )
                    .map((p) => p.contactPersonName)
                    .join(', ')
                "
                multiple
                collapse-tags
                placeholder=""
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in selectContactPersonList"
                  :key="dict.rowTimeId"
                  :label="dict.contactPersonName"
                  :value="dict.rowTimeId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('bp.noOfTrucks')" prop="truckCountLimit">
              <el-select
                v-model="termForm.truckCountLimit"
                placeholder=""
                clearable
                style="width: 100%"
                filterable
                :disabled="comDisFrom"
              >
                <el-option
                  v-for="item in dict.type.mdm_truck_count_limit || []"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('bp.restrictedVehicle')" prop="restrictedVehicle">
              <SelectInput
                :value="
                  (termForm.mdmProjectRestrictedVehicleList || [])
                    .map((item) => item.truckCode)
                    .join(', ')
                "
                @clear="restrictedVehicleClear"
                clearable
                :disabled="comDisFrom || !termForm.zoneId"
                :title="
                  (termForm.mdmProjectRestrictedVehicleList || [])
                    .map((item) => item.truckCode)
                    .join(', ')
                "
                @click="restrictedVehicleClick"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('bp.mixDesign')" prop="productNames">
              <SelectInput
                :value="(termForm.mixDesignList || []).map((item) => item.productName).join(', ')"
                :title="(termForm.mixDesignList || []).map((item) => item.productName).join(', ')"
                @clear="productTableClear"
                :clearable="!comDisFrom"
                :disabled="!termForm.zoneId"
                @click="openProductTable"
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
                :maxlength="300"
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
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item :label="`${$t('bp.credit')}`">
              <el-switch
                v-model="termForm.credit"
                :disabled="comDisFrom || !editCreditAuth"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <template v-if="isTermEdit">
          <el-button
            type="primary"
            v-if="!comDisFrom"
            size="small"
            :loading="btnLoading"
            @click="handleEditTerm"
            >{{ $t('uiBtn.save') }}</el-button
          >
          <el-button size="small" @click="visible = false">{{ $t('uiBtn.back') }}</el-button>
        </template>
        <template v-else-if="!comDisFrom">
          <el-button type="primary" size="small" :loading="btnLoading" @click="handleAddTerm">{{
            $t('uiBtn.add')
          }}</el-button>
          <el-button size="small" @click="handleResetTerm">{{ $t('uiBtn.reset') }}</el-button>
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
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              size="mini"
              :disabled="ids.length <= 0"
              @click="handleCredit('close')"
              v-if="!comDisFrom && editCreditAuth"
              >{{ $t('uiBtn.block') }}</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              size="mini"
              :disabled="ids.length <= 0"
              @click="handleCredit('open')"
              v-if="!comDisFrom && editCreditAuth"
              >{{ $t('uiBtn.release') }}</el-button
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
          :row-class-name="tableRowClassName"
          :cell-class-name="tableCellClassName"
          :row-key="rowIdKey"
          :data="tableList"
          @selection-change="handleSelectionChange"
          @row-dblclick="handleTermRowClick"
          style="cursor: pointer"
          :key="tableKey + modifyHighlight"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :selectable="selectable"
            v-if="!comDisFrom && editCreditAuth"
          />
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
            <template slot-scope="scope">
              <template v-if="item.prop === 'isDefault'">
                <el-tag v-if="scope.row.isDefault === '1'">{{ $t('ui.y') }}</el-tag>
                <el-tag v-if="scope.row.isDefault === '0'" type="danger">{{ $t('ui.n') }}</el-tag>
              </template>
              <template v-else-if="item.prop === 'isActive'">
                <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
                <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                  $t('uiBtn.inactive')
                }}</el-tag>
              </template>
              <template v-else-if="item.prop === 'credit'">
                <el-tag v-if="scope.row.credit === '1'">{{ $t('uiBtn.active') }}</el-tag>
                <el-tag v-if="scope.row.credit === '0'" type="danger">{{
                  $t('uiBtn.inactive')
                }}</el-tag>
              </template>
              <template v-else-if="item.prop === 'createdTime'">
                {{ parseTime(scope.row.createdTime, fmtForYmdhms) }}
              </template>
              <template v-else-if="item.prop === 'modifiedTime'">
                {{ parseTime(scope.row.modifiedTime, fmtForYmdhms) }}
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
          >
            <template slot-scope="scope">
              <div class="flexCen">
                <i
                  class="el-icon-edit pointer mr5"
                  style="font-size: 20px; color: #409eff"
                  :title="$t('uiBtn.edit')"
                  @click="handleTermRowClick(scope.row)"
                ></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 地址 -->
    <projectSelectAddress
      ref="projectSelectAddress"
      :addressList="addressList"
      :projectList="projectList"
      :comDisFrom="comDisFrom"
      @updateAddress="updateAddress"
    />

    <restrictedVehicleDlg
      ref="restrictedVehicleDlg"
      :zoneId="termForm.zoneId"
      :comDisFrom="comDisFrom"
      @onSuccess="updateRestrictedVehicle"
    />

    <!-- 配合比 -->
    <productDlg ref="productDlg" :zoneId="termForm.zoneId" @updateProductList="updateProductList" />

    <!-- 修改信用弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
      :title="$t('bp.submitEditCredit')"
      :visible.sync="creditDlgOpen"
      width="500px"
      append-to-body
      @closed="creditDlgReset"
    >
      <el-form
        ref="creditForm"
        :model="creditForm"
        :rules="creditRules"
        label-width="140px"
        class="mr20"
      >
        <el-form-item :label="`${$t('ui.remarks')}`" prop="creditRemarks">
          <MyInput
            type="textarea"
            v-model="creditForm.creditRemarks"
            :autosize="{ minRows: 1, maxRows: 8 }"
            resize="none"
            show-word-limit
            :maxlength="300"
          ></MyInput>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="creditDlgCancel">{{ $t('uiBtn.back') }}</el-button>
        <el-button type="primary" @click="creditDlgSave" :loading="creditBtnLoading"
          >{{ $t('uiBtn.save') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { getAllZoneList } from '@/api/organization/zone'
import projectSelectAddress from './projectSelectAddress.vue'
import productDlg from './productDlg.vue'
import restrictedVehicleDlg from './restrictedVehicleDlg.vue'

export default {
  dicts: ['business_contact_person_title', 'sys_user_sex', 'mdm_truck_count_limit'],
  mixins: [pageMixin],
  components: { projectSelectAddress, productDlg, restrictedVehicleDlg },
  props: {
    comDisFrom: {
      type: [Boolean],
      default: false
    },
    modifyHighlight: {
      type: [Boolean],
      default: false
    },
    addressList: {
      type: [Array],
      default() {
        return []
      }
    },
    contactPersonList: {
      type: [Array],
      default() {
        return []
      }
    },
    businessPartnerMainId: {
      type: [String],
      default: ''
    }
  },
  watch: {
    addressList: {
      handler(list) {}
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    comAddressIdList() {
      return this.addressList.map((item) => item.rowTimeId)
    },
    editCreditAuth() {
      return this.checkPermi(['businessPartner:businessPartner:editCredit'])
    },
    selectContactPersonList() {
      return this.contactPersonList.filter((x) => x.isActive === '1') || []
    }
  },
  data() {
    const vm = this
    const validatorPhoneNo = (rule, value, callback) => {
      if (!this.termForm.mobileCode || !this.termForm.mobileNum) {
        callback(this.$t('ui.reqMsg').replace('$1', this.$t('ui.mobilePhone')))
      } else {
        callback()
      }
    }
    const validatorProjectMaxVol = (rule, value, callback) => {
      if (vm.termForm.projectMaxVol || vm.termForm.productMinVol) {
        if (Number(vm.termForm.projectMaxVol) < Number(vm.termForm.productMinVol)) {
          callback(vm.$t('bp.validProjectMaxVol'))
        }
        callback()
      } else {
        callback()
      }
    }
    const validatorProductMinVol = (rule, value, callback) => {
      if (vm.termForm.projectMaxVol || vm.termForm.productMinVol) {
        if (Number(vm.termForm.productMinVol) > Number(vm.termForm.projectMaxVol)) {
          callback(vm.$t('bp.validProductMinVol'))
        }
        callback()
      } else {
        callback()
      }
    }
    return {
      tableKey: Date.now(),
      saveKey: '2',
      /* 表格表单部分 */
      // 选中数组
      ids: [],
      selectList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,

      positionList: [],
      termForm: {
        addressIdList: []
      },
      termFormRules: {
        mobilePhone: [{ required: true, validator: validatorPhoneNo, trigger: 'change' }],
        projectName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('bp.projectName')),
            trigger: ['change', 'blur']
          }
        ],
        zoneItem: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('bp.projectZone')),
            trigger: ['change', 'blur']
          }
        ],
        projectContactPersonIdList: [
          {
            required: true,
            type: 'array',
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('bp.projectContactPersonName')),
            trigger: ['change']
          }
        ],
        corporateAddress: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('bp.corporateAddress')),
            trigger: ['change', 'blur']
          }
        ],
        projectMaxVol: [{ required: false, validator: validatorProjectMaxVol, trigger: ['blur'] }],
        productMinVol: [{ required: false, validator: validatorProductMinVol, trigger: ['blur'] }],
        siteAddress: [
          {
            required: false,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('bp.siteAddress')),
            trigger: ['change', 'blur']
          }
        ],
        truckCountLimit: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('bp.noOfTrucks')),
            trigger: ['change', 'blur']
          }
        ]
      },
      isTermEdit: false,
      editIndex: undefined,
      /* 表格部分 */
      columns: [
        {
          prop: 'projectCode',
          label: vm.$t('bp.projectCode'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'projectName',
          label: vm.$t('bp.projectName'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'zoneName',
          label: vm.$t('bp.projectZone'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        {
          prop: 'siteAddress',
          label: vm.$t('bp.projectAddress'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'credit',
          label: vm.$t('bp.credit'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 180,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 180,
          visible: true,
          tooltip: true
        }
      ],
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'rowTimeId',
      visible: false,
      zoneList: [],
      truckCountLimitIsOpen: false,
      customerAddressList: [],
      projectList: [],
      btnLoading: false,
      creditDlgOpen: false,
      creditBtnLoading: false,
      creditEditType: '',
      creditForm: {
        creditRemarks: ''
      },
      creditRules: {
        creditRemarks: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.remarks')),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  created() {},
  methods: {
    selectable(row, rowIndex) {
      // return false // 禁用
      if (row.isCanUpdate === '0') return false
      return true // 不禁用
    },
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
      for (const item of this.ids.values()) {
        if (item === row.rowTimeId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    tableCellClassName({ row, column }) {
      if (
        this.modifyHighlight &&
        row.updateType === '1' &&
        (row.updateMsgList || []).find((item) => item.name === column.property)
      ) {
        return 'edit-table-cell'
      }
      return ''
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection)
      this.ids = selection.map((item) => item.rowTimeId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleCredit(type) {
      this.creditDlgOpen = true
      this.creditEditType = type
    },
    creditDlgReset() {
      this.creditForm = {
        creditRemarks: undefined
      }
      this.resetForm('creditForm')
    },
    creditDlgCancel() {
      this.creditDlgOpen = false
    },
    creditDlgSave() {
      if (this.creditBtnLoading) return
      this.creditBtnLoading = true
      setTimeout(() => {
        this.creditBtnLoading = false
      }, 1000)
      this.$refs.creditForm.validate((valid) => {
        if (valid) {
          const credit = this.creditEditType === 'close' ? '0' : '1'
          this.tableList.forEach((x) => {
            if (this.ids.indexOf(x.rowTimeId) !== -1) {
              x.creditRemarks = this.creditForm.creditRemarks
              x.credit = credit
            }
          })
          this.$emit('change', this.tableList)
          this.creditDlgCancel()
          this.$refs.tables.clearSelection()
        }
      })
    },

    updateAddress(e) {
      if (e && Object.prototype.toString.call(e) === '[object Object]') {
        const tableList = this.customerAddressList
        e.addressId = new Date().getTime()
        e.isNewCustomerAddress = 1
        this.$set(this.termForm, 'customerAddressList', [e])
        this.$set(this.termForm, 'siteAddress', this.siteAddressTitle([e]))
        tableList.push(e)
        this.$emit('updateAddressList', tableList)
      } else if (e && Object.prototype.toString.call(e) === '[object Array]') {
        this.$set(this.termForm, 'customerAddressList', e)
        this.$set(this.termForm, 'siteAddress', this.siteAddressTitle(e))
      }
    },
    siteAddressTitle(e) {
      if (!e || e.length <= 0) return ''
      let location = ''
      e.forEach((x) => {
        const { country, provinceState, cityTown, address1, province, city } = x
        location += address1 + '-' + (city || cityTown)
        if (province || provinceState) {
          location += `-${province || provinceState}`
        }
        location += `-${country} / `
      })
      location = location.substring(0, location.length - 3)
      return location
    },
    getAllZoneList() {
      getAllZoneList({}).then((res) => {
        this.zoneList = res.data || []
      })
    },
    siteAddressChange() {
      this.$set(this.termForm, 'customerAddressList', [])
      this.$set(this.termForm, 'siteAddress', '')
    },
    get_truck_count_limit_is_open() {
      this.getConfigKey('truck_count_limit_is_open').then((res) => {
        this.truckCountLimitIsOpen = res.msg === '1'
      })
    },
    zoneChange(item) {
      this.$set(this.termForm, 'zoneId', item.zoneId)
      this.$set(this.termForm, 'zoneName', item.zoneName)
      this.productTableClear()
      this.restrictedVehicleClear()
    },
    siteAddressClick() {
      if (this.comDisFrom) return
      this.$refs.projectSelectAddress.handleAdd(this.termForm)
    },
    restrictedVehicleClick() {
      if (this.comDisFrom) return
      this.$refs.restrictedVehicleDlg.handleAdd(this.termForm.mdmProjectRestrictedVehicleList || [])
    },
    restrictedVehicleClear() {
      this.$set(this.termForm, 'mdmProjectRestrictedVehicleList', [])
    },
    updateRestrictedVehicle(e = []) {
      this.$set(this.termForm, 'mdmProjectRestrictedVehicleList', e)
    },
    openProductTable() {
      if (this.comDisFrom) return
      this.$refs.productDlg.handleOpen(this.termForm.mixDesignList || [])
    },
    productTableClear() {
      this.$set(this.termForm, 'productNames', undefined)
      this.$set(this.termForm, 'mixDesignList', [])
    },
    updateProductList(list) {
      this.$set(this.termForm, 'mixDesignList', list || [])
      const productNames = this.termForm.mixDesignList.map((item) => item.productName).join(', ')
      this.$set(this.termForm, 'productNames', productNames)
    },
    inputNumberChange(code) {
      this.$refs.termForm.validateField(code)
    },
    projectMaxVolChange(code, code2) {
      this.$refs.termForm.validateField(code)
      if (code2 && this.termForm[code2]) {
        this.$refs.termForm.validateField(code2)
      }
    },
    changeEmployeeNoSwitch(code) {
      this.$set(this.termForm, code, '')
      if (this.$refs.termForm) {
        this.$nextTick(() => {
          this.$refs.termForm.clearValidate(code)
        })
      }
    },
    getTableList() {
      return this.tableList
    },
    initList(list) {
      this.tableList = list
      this.tableKey++
      this.$emit('change', this.tableList)
    },
    /* 表格表单部分 */
    reset() {
      this.tableList = []
      this.selected = []
      this.handleResetTerm()
    },

    handleResetTerm() {
      this.isTermEdit = false
      this.editIndex = undefined
      this.termForm = {
        zoneId: '',
        zoneName: '',
        zoneItem: undefined,
        projectName: '',
        projectCode: '',
        siteAddress: '',
        product: '',
        projectMaxVol: undefined,
        productMinVol: undefined,
        mixDesignList: [],
        customerAddressList: [],
        isAutoProjectCode: '1',
        isNeedTwoAck: '0',
        isWhatsappGroups: '0',
        whatsappGroupsList: [],
        truckCountLimit: '-1',
        isActive: '1',
        remarks: '',
        credit: '1',
        projectAbbreviation: '',
        createdBy: this.$store.state.user.name,
        projectContactPersonIdList: [],
        mdmProjectRestrictedVehicleList: []
      }
      this.$nextTick(() => {
        this.$refs.termForm && this.$refs.termForm.clearValidate()
      })
    },
    closed() {
      this.handleResetTerm()
    },
    handleAdd() {
      this.handleResetTerm()
      this.getAllZoneList()
      this.visible = true
    },
    handleAddTerm() {
      const vm = this
      vm.isTermEdit = false
      vm.$refs.termForm.validate((valid) => {
        if (valid) {
          vm.btnLoading = true
          setTimeout(() => {
            vm.btnLoading = false
          }, 1000)
          const params = JSON.parse(JSON.stringify(vm.termForm))

          const arr = this.contactPersonList.filter(
            (x) => (params.projectContactPersonIdList || []).indexOf(x.rowTimeId) !== -1
          )
          this.$set(params, 'projectContactPersonList', arr)

          // const ids = (params.projectContactPersonList || []).map((x) => x.rowTimeId)
          // this.$set(params, 'projectContactPersonIdList', ids)

          const row = {
            ...params,
            rowTimeId: Date.now() + '',
            isNewProject: 1
          }
          if (row.isDefault === '1') {
            vm.tableList.forEach((item) => {
              this.$set(item, 'isDefault', '0')
            })
          }
          vm.tableList.push(row)
          this.$emit('change', vm.tableList)
          vm.visible = false
        }
      })
    },
    handleTermRowClick(dataRow) {
      const vm = this
      vm.isTermEdit = true
      vm.editIndex = vm.tableList.findIndex((item) => item.rowTimeId === dataRow.rowTimeId)
      const params = JSON.parse(JSON.stringify(dataRow))
      // console.log(this.contactPersonList, '====')
      // const arr = (this.contactPersonList || []).filter(
      //   (x) => (params.projectContactPersonIdList || []).indexOf(x.rowTimeId) !== -1
      // )
      // this.$set(params, 'projectContactPersonList', arr)
      const ids = (params.projectContactPersonList || []).map((x) => x.rowTimeId)
      this.$set(params, 'projectContactPersonIdList', ids)
      this.$set(params, 'zoneItem', { zoneName: params.zoneName, zoneId: params.zoneId })

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
          setTimeout(() => {
            vm.btnLoading = false
          }, 1000)
          const params = JSON.parse(JSON.stringify(vm.termForm))
          const arr = this.contactPersonList.filter(
            (x) => (params.projectContactPersonIdList || []).indexOf(x.rowTimeId) !== -1
          )
          this.$set(params, 'projectContactPersonList', arr)
          if (params.isDefault === '1') {
            vm.tableList.forEach((item) => {
              if (item.rowTimeId !== params.rowTimeId) {
                this.$set(item, 'isDefault', '0')
              }
            })
          }
          vm.$set(vm.tableList, vm.editIndex, { ...params })
          this.$emit('change', vm.tableList)

          vm.visible = false
        }
      })
    }
  }
}
</script>

<style></style>
