<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="$t('bp.contactPerson')"
      :visible.sync="visible"
      width="1140px"
      :modal="true"
      :close-on-click-modal="false"
      @closed="closed"
    >
      <el-form
        :model="termForm"
        :rules="termFormRules"
        label-width="160px"
        :disabled="comDisFrom"
        ref="termForm"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.contactPersonName')}`" prop="contactPersonName">
              <div class="flexStart">
                <el-form-item class="fs-0" style="width: 84px">
                  <el-select
                    v-model="termForm.title"
                    :disabled="comDisFrom"
                    placeholder=""
                    style="width: 100%"
                    clearable
                    filterable
                    @change="titleChange"
                  >
                    <el-option
                      v-for="dict in canSelectCptList"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-input
                  v-model="termForm.contactPersonName"
                  maxlength="200"
                  style="width: 100%"
                ></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.email')}`" prop="email">
              <el-input
                v-model.trim="termForm.email"
                :title="termForm.email"
                maxlength="500"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.position')}`">
              <el-autocomplete
                style="width: 100%"
                v-model="termForm.position"
                :fetch-suggestions="queryPositionSugg"
                placeholder
                clearable
                :maxlength="100"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.sex')}`" prop="sex">
              <CommonSelect
                :disabled="comDisFrom"
                :id="termForm.sex"
                :label="(susList.find((x) => x.dictValue === termForm.sex) || {}).dictLabel || ''"
                idKey="dictValue"
                labelKey="dictLabel"
                :options="canSelectSusList || []"
                @change="
                  ($event) => {
                    $set(termForm, 'sex', $event.dictValue)
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.mobilePhone')}`" prop="mobilePhone" ref="mobileNoRef">
              <MobilePhoneInput
                :mobileCode.sync="termForm.mobileCode"
                :mobileNum.sync="termForm.mobileNum"
                :mobileNo.sync="termForm.mobilePhone"
                :disabled="comDisFrom"
                @clearValidate="$refs.mobileNoRef.clearValidate()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('bp.other')}`">
              <el-input v-model="termForm.other" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" v-if="cdsQc === '1'">
            <el-form-item
              v-if="!termForm.businessContactPersonId"
              :label="`${$t('bp.contactPersonCode')}`"
              :rules="[
                {
                  required: termForm.isAutoContactPersonCode === '0',
                  pattern: new RegExp(/^(?!(\s+$))/g),
                  message: $t('ui.reqMsg'),
                  trigger: ['blur']
                }
              ]"
              prop="contactPersonCode"
            >
              <div class="input-switch-box">
                <div class="con-left">
                  <el-input
                    :disabled="termForm.isAutoContactPersonCode === '1'"
                    v-model="termForm.contactPersonCode"
                    maxlength="50"
                  />
                </div>
                <div class="con-right">
                  <el-switch
                    v-model="termForm.isAutoContactPersonCode"
                    active-value="1"
                    inactive-value="0"
                    @change="changeEmployeeNoSwitch('contactPersonCode')"
                  ></el-switch>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="`${$t('bp.contactPersonCode')}`" prop="contactPersonCode" v-else>
              <el-input disabled v-model="termForm.contactPersonCode" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.landline')}`">
              <MobilePhoneInput
                :mobileCode.sync="termForm.landlineCode"
                :mobileNum.sync="termForm.landlineNum"
                :mobileNo.sync="termForm.landline"
                :disabled="comDisFrom"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.extensionNumber')}`">
              <el-input v-model="termForm.extensionNumber" maxlength="50"></el-input>
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
                :maxlength="3000"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="8">
            <el-form-item :label="`${$t('ui.isDefault')}`">
              <el-switch
                v-model="termForm.isDefault"
                :disabled="comDisFrom"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col> -->
          <el-col :span="8" v-if="typeList.indexOf('1') !== -1">
            <el-form-item :label="`${$t('ui.defaultPurchasingContact')}`">
              <el-switch
                v-model="termForm.isPurchaseDefault"
                :disabled="comDisFrom"
                active-value="1"
                inactive-value="0"
                @change="handleIsPurchaseDefault"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="typeList.indexOf('0') !== -1">
            <el-form-item :label="`${$t('ui.defaultSalesContact')}`">
              <el-switch
                v-model="termForm.isSalesDefault"
                :disabled="comDisFrom"
                active-value="1"
                inactive-value="0"
                @change="handleIsSalesDefault"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.isActive')}`">
              <el-switch
                v-model="termForm.isActive"
                :disabled="
                  comDisFrom ||
                  termForm.isPurchaseDefault === '1' ||
                  termForm.isSalesDefault === '1'
                "
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <div style="text-align: center; margin-bottom: 10px"> -->
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
          <!-- <el-col :span="1.5">
            <el-button
              v-if="!comDisFrom"
              :disabled="selected.length <= 0"
              @click="handleDelete"
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              >{{ $t('uiBtn.delete') }}</el-button
            >
          </el-col> -->
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
          :cell-class-name="tableCellClassName"
          :data="tableList"
          @select="handleSelectionChange"
          @select-all="handleSelectAll"
          @row-dblclick="handleTermRowClick"
          style="cursor: pointer"
          :key="tableKey + modifyHighlight"
        >
          <!-- <el-table-column
            v-if="!comDisFrom"
            type="selection"
            key="selection"
            align="center"
            width="55"
          ></el-table-column> -->
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
            v-for="item in comVisibleColumn"
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
              <span v-if="item.prop === 'addressIdList'">
                {{ getAddressLabelList(scope.row[item.prop]).join(', ') }}
              </span>
              <template v-else-if="item.prop === 'title'">{{
                selectDictLabel(
                  dict.type.business_contact_person_title,
                  scope.row[item.prop] || ''
                ) || scope.row[item.prop]
              }}</template>
              <template v-else-if="item.prop === 'isDefault'">
                <el-tag v-if="scope.row.isDefault === '1'">{{ $t('ui.y') }}</el-tag>
                <el-tag v-if="scope.row.isDefault === '0'" type="danger">{{ $t('ui.n') }}</el-tag>
              </template>
              <template v-else-if="item.prop === 'isPurchaseDefault'">
                <el-tag v-if="scope.row.isPurchaseDefault === '1'">{{ $t('ui.y') }}</el-tag>
                <el-tag v-if="scope.row.isPurchaseDefault === '0'" type="danger">{{
                  $t('ui.n')
                }}</el-tag>
              </template>
              <template v-else-if="item.prop === 'isSalesDefault'">
                <el-tag v-if="scope.row.isSalesDefault === '1'">{{ $t('ui.y') }}</el-tag>
                <el-tag v-if="scope.row.isSalesDefault === '0'" type="danger">{{
                  $t('ui.n')
                }}</el-tag>
              </template>
              <template v-else-if="item.prop === 'isActive'">
                <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
                <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                  $t('uiBtn.inactive')
                }}</el-tag>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!comDisFrom"
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
import Sortable from 'sortablejs'

import { queryPositionList } from '@/api/businessPartner/businessPartner'
export default {
  dicts: ['business_contact_person_title', 'sys_user_sex'],
  mixins: [pageMixin],
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
    cdsQc: {
      type: String,
      default: '0'
    },
    countryMobileCode: {
      type: String,
      default: ''
    },
    typeList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    addressList: {
      handler(list) {
        // this.changeAddressList()
      }
    }
  },
  computed: {
    comAddressIdList() {
      return this.addressList.map((item) => item.rowTimeId)
    },
    canSelectCptList() {
      const { sex } = this.termForm
      let list = this.cptList
      if (!isNaN(sex)) {
        if (sex === '0') {
          list = list.filter((x) => ['Mr', 'Sir', 'Datuk', 'Dr', 'Hon'].indexOf(x.dictValue) !== -1)
        } else if (sex === '1') {
          list = list.filter(
            (x) => ['Mrs', 'Ms', 'Mdm', 'Dame', 'Datin', 'Dr', 'Hon'].indexOf(x.dictValue) !== -1
          )
        }
      }
      return list
    },
    canSelectSusList() {
      const { title } = this.termForm
      let list = this.susList
      if (title) {
        if (['Mr', 'Sir', 'Datuk'].indexOf(title) !== -1) {
          list = list.filter((x) => x.dictValue === '0')
        } else if (['Mrs', 'Ms', 'Mdm', 'Dame', 'Datin'].indexOf(title) !== -1) {
          list = list.filter((x) => x.dictValue === '1')
        }
      }
      return list
    },
    comVisibleColumn() {
      const arr = [...this.visibleColumn]
      if (this.typeList.indexOf('0') !== -1 && this.typeList.indexOf('1') !== -1) {
        return arr
      } else if (this.typeList.indexOf('0') === -1 && this.typeList.indexOf('1') === -1) {
        return arr.filter((item) => {
          const is = item.prop !== 'isPurchaseDefault' && item.prop !== 'isSalesDefault'
          return is
        })
      } else if (this.typeList.indexOf('0') === -1) {
        return arr.filter((item) => {
          const is = item.prop !== 'isSalesDefault'
          return is
        })
      } else if (this.typeList.indexOf('1') === -1) {
        return arr.filter((item) => {
          const is = item.prop !== 'isPurchaseDefault'
          return is
        })
      }
      return arr
    }
  },
  data() {
    const vm = this
    // const validatorPhoneNo = (rule, value, callback) => {
    //   if (!this.termForm.mobileCode || !this.termForm.mobileNum) {
    //     callback(this.$t('ui.reqMsg').replace('$1', this.$t('ui.mobilePhone')))
    //   } else {
    //     callback()
    //   }
    // }

    const validatorContactPersonName = (rule, value, callback) => {
      const { title, contactPersonName } = vm.termForm
      if (!title || !contactPersonName) {
        callback(vm.$t('ui.reqMsg').replace('$1', vm.$t('ui.contactPersonName')))
      } else {
        callback()
      }
    }

    return {
      tableKey: Date.now(),
      saveKey: '2',
      /* 表格表单部分 */
      positionList: [],
      termForm: {
        addressIdList: []
      },
      termFormRules: {
        addressIdList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        // title: [
        //   {
        //     required: true,
        //     // eslint-disable-next-line
        //     pattern: new RegExp(/^(?!(\s+$))/g),
        //     message: this.$t('ui.reqMsg'),
        //     trigger: ['change']
        //   }
        // ],
        contactPersonName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          },
          { validator: validatorContactPersonName, trigger: ['change', 'blur'] }
        ],
        sex: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            required: false,
            trigger: ['blur', 'change'],
            message: this.$t('ui.reqMsg')
          },
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ]
        // mobilePhone: [{ required: true, validator: validatorPhoneNo, trigger: 'change' }]
      },
      isTermEdit: false,
      editIndex: undefined,
      /* 表格部分 */
      columns: [
        {
          prop: 'title',
          label: vm.$t('ui.title'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },

        {
          prop: 'position',
          label: vm.$t('ui.position'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'contactPersonName',
          label: vm.$t('ui.contactPersonName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'addressIdList',
        //   label: vm.$t('ui.address'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'mobilePhone',
          label: vm.$t('ui.mobilePhone'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'email',
          label: vm.$t('ui.email'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'other',
          label: vm.$t('bp.other'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },

        // {
        //   prop: 'isDefault',
        //   label: vm.$t('ui.isDefault'),
        //   visible: true,
        //   minWidth: 140,
        //   tooltip: true
        // },
        {
          prop: 'isSalesDefault',
          label: vm.$t('ui.defaultSalesContact'),
          visible: true,
          minWidth: 150,
          tooltip: true
        },
        {
          prop: 'isPurchaseDefault',
          label: vm.$t('ui.defaultPurchasingContact'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
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
      btnLoading: false,
      // 称呼
      cptList: [],
      // 性别
      susList: []
    }
  },
  created() {
    this.queryPositionList()
  },
  methods: {
    handleIsPurchaseDefault(value) {
      if (value === '1') {
        this.$set(this.termForm, 'isActive', '1')
      }
    },
    handleIsSalesDefault(value) {
      if (value === '1') {
        this.$set(this.termForm, 'isActive', '1')
      }
    },
    titleChange() {
      const { title } = this.termForm
      if (['Mr', 'Sir', 'Datuk'].indexOf(title) !== -1) {
        this.$set(this.termForm, 'sex', '0')
      } else if (['Mrs', 'Ms', 'Mdm', 'Dame', 'Datin'].indexOf(title) !== -1) {
        this.$set(this.termForm, 'sex', '1')
      }
      if (this.termForm.contactPersonName) {
        this.$refs.termForm.validateField('contactPersonName')
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
    getAddressLabelList(ids) {
      if (ids && ids.length > 0) {
        return this.addressList
          .filter((item) => ids.includes(item.rowTimeId))
          .map((item) => item.label)
      }
      return []
    },
    getTableList() {
      return this.tableList
    },
    initList(list) {
      this.tableList = list
      this.tableKey++
      this.$emit('change', this.tableList)
    },
    /* 地址部分修改, 处理联系人地址关联 */
    changeAddressList() {
      const ids = this.termForm.addressIdList
      if (ids && ids.length > 0) {
        this.termForm.addressIdList = this.getNewIdList(ids)
      }
      this.tableList.forEach((item) => {
        const rowIds = item.addressIdList
        if (rowIds && rowIds.length > 0) {
          item.addressIdList = this.getNewIdList(rowIds)
        }
      })
    },
    getNewIdList(ids) {
      return ids.filter((item) => this.comAddressIdList.includes(item))
    },
    /* 表格表单部分 */
    reset() {
      this.tableList = []
      this.selected = []
      this.destroyDraggable()
      this.handleResetTerm()
    },

    handleResetTerm() {
      this.isTermEdit = false
      this.editIndex = undefined
      this.termForm = {
        addressIdList: [],
        title: '',
        contactPersonName: '',
        mobilePhone: '',
        mobileCode: this.countryMobileCode,
        mobileNum: '',
        email: '',
        isDefault: '0',
        isActive: '1',
        isAutoContactPersonCode: '1',
        contactPersonCode: undefined,
        sex: undefined,
        isPurchaseDefault: '0',
        isSalesDefault: '0'
      }

      // if (this.tableList.length <= 0) {
      //   this.$set(this.termForm, 'isDefault', '1')
      // }
      if (this.tableList.length <= 0) {
        if (this.typeList.indexOf('0') !== -1) {
          this.$set(this.termForm, 'isSalesDefault', '1')
        }
        if (this.typeList.indexOf('1') !== -1) {
          this.$set(this.termForm, 'isPurchaseDefault', '1')
        }
      }
      this.$nextTick(() => {
        this.$refs.termForm && this.$refs.termForm.clearValidate()
      })
    },
    closed() {
      this.handleResetTerm()
    },
    async getDictList() {
      const res = await this.getDicts('business_contact_person_title')
      this.cptList = res.data || []
      const res1 = await this.getDicts('sys_user_sex')
      this.susList = res1.data || []
    },
    handleAdd() {
      this.handleResetTerm()
      this.getDictList()
      this.visible = true
    },
    handleAddTerm() {
      const vm = this
      vm.isTermEdit = false
      this.getDictList()
      vm.$refs.termForm.validate((valid) => {
        if (valid) {
          vm.btnLoading = true
          setTimeout(() => {
            vm.btnLoading = false
          }, 1000)
          console.log(vm.termForm)
          let tip
          vm.tableList.forEach((x) => {
            const names = x.title + '' + x.contactPersonName
            const rowNames = vm.termForm.title + '' + vm.termForm.contactPersonName
            if (names === rowNames) {
              if (x.mobilePhone === vm.termForm.mobilePhone) {
                tip = this.$t('bp.alreadyExists')
                  .replace('$1', vm.termForm.contactPersonName)
                  .replace('$2', vm.termForm.mobilePhone)
              } else if (x.email === vm.termForm.email) {
                tip = this.$t('bp.alreadyExists')
                  .replace('$1', vm.termForm.contactPersonName)
                  .replace('$2', vm.termForm.email)
              }
            }
          })
          if (tip) {
            this.$modal
              .confirm(tip)
              .then(() => {
                this.addContactPersonName()
              })
              .catch(() => {})
          } else {
            this.addContactPersonName()
          }
        }
      })
    },
    addContactPersonName() {
      const vm = this
      const params = JSON.parse(JSON.stringify(vm.termForm))
      const row = {
        ...params,
        rowTimeId: Date.now(),
        isNewData: 1
      }
      if (row.isDefault === '1') {
        vm.tableList.forEach((item) => {
          this.$set(item, 'isDefault', '0')
        })
      }
      if (row.isPurchaseDefault === '1') {
        vm.tableList.forEach((item) => {
          this.$set(item, 'isPurchaseDefault', '0')
        })
      }
      if (row.isSalesDefault === '1') {
        vm.tableList.forEach((item) => {
          this.$set(item, 'isSalesDefault', '0')
        })
      }
      vm.tableList.push(row)
      this.$emit('change', vm.tableList)
      vm.visible = false
    },
    handleTermRowClick(dataRow) {
      const vm = this
      vm.isTermEdit = true
      vm.editIndex = vm.tableList.findIndex((item) => item.rowTimeId === dataRow.rowTimeId)
      const params = JSON.parse(JSON.stringify(dataRow))
      vm.termForm = {
        ...params
      }
      this.getDictList()
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
          console.log(vm.termForm)

          let tip
          vm.tableList.forEach((x) => {
            if (x.rowTimeId !== vm.termForm.rowTimeId) {
              const names = x.title + '' + x.contactPersonName
              const rowNames = vm.termForm.title + '' + vm.termForm.contactPersonName
              if (names === rowNames) {
                if (x.mobilePhone === vm.termForm.mobilePhone) {
                  tip = this.$t('bp.alreadyExists')
                    .replace('$1', vm.termForm.contactPersonName)
                    .replace('$2', vm.termForm.mobilePhone)
                } else if (x.email === vm.termForm.email) {
                  tip = this.$t('bp.alreadyExists')
                    .replace('$1', vm.termForm.contactPersonName)
                    .replace('$2', vm.termForm.email)
                }
              }
            }
          })

          if (tip) {
            this.$modal
              .confirm(tip)
              .then(() => {
                this.updateContactPersonName()
              })
              .catch(() => {})
          } else {
            this.updateContactPersonName()
          }
        }
      })
    },
    updateContactPersonName() {
      const vm = this
      const params = JSON.parse(JSON.stringify(vm.termForm))
      if (params.isDefault === '1') {
        vm.tableList.forEach((item) => {
          if (item.rowTimeId !== params.rowTimeId) {
            this.$set(item, 'isDefault', '0')
          }
        })
      }
      if (params.isPurchaseDefault === '1') {
        vm.tableList.forEach((item) => {
          if (item.rowTimeId !== params.rowTimeId) {
            this.$set(item, 'isPurchaseDefault', '0')
          }
        })
      }
      if (params.isSalesDefault === '1') {
        vm.tableList.forEach((item) => {
          if (item.rowTimeId !== params.rowTimeId) {
            this.$set(item, 'isSalesDefault', '0')
          }
        })
      }
      vm.$set(vm.tableList, vm.editIndex, { ...params })
      this.$emit('change', vm.tableList)
      vm.visible = false
    },
    queryPositionSugg(queryString, cb) {
      const vm = this
      const positionList = vm.positionList

      let results
      if (queryString) {
        results = positionList.filter(
          (umo) => umo.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      } else {
        results = positionList
      }
      cb(results)
    },
    queryPositionList() {
      queryPositionList().then((res) => {
        const list = res.data || []
        this.positionList = list.map((position) => {
          return { value: position }
        })
      })
    },

    /* 表格部分 */
    /* 选中多个删除 */
    handleDelete() {
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          this.tableList = this.tableList.filter((row) => {
            if (this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])) {
              return false
            }
            return true
          })

          this.selected = []
        })
        .catch(() => {})
    },
    /* 行删除 */
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.$emit('change', this.tableList, 'delete')

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
    },
    /* 表格全选 */
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selected.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selected.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[this.rowIdKey])
        vm.selected = vm.selected.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    /* 行单个选择 */
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selected.length; i++) {
        if (vm.selected[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selected.splice(i, 1)
        }
      }
      vm.selected.push(row)
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
    }
  }
}
</script>

<style></style>
