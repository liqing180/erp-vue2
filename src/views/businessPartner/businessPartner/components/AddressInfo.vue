<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="$t('ui.address')"
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
        :key="cdsQc"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.label')}`" prop="labelList">
              <CommonMultipleSelect
                :ids="termForm.labelList"
                :labels="termForm.labelList"
                :showTitle="false"
                idKey="value"
                labelKey="label"
                :collapseTags="false"
                :options="dict.type.address_label.filter((i) => i.value !== 'Registered')"
                @change="labelListChange"
                :class="{ isRegistered: termForm.isRegistered }"
              />
              <!-- <el-input v-model="termForm.label" maxlength="200"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>

        <template v-if="cdsQc === '0'">
          <el-row>
            <el-col :span="24">
              <el-form-item :label="`${$t('ui.addressLine1')}`" prop="address1">
                <el-input v-model="termForm.address1" maxlength="500"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="`${$t('ui.addressLine2')}`">
                <el-input v-model="termForm.address2" maxlength="500"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="cdsQc === '1'">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('mapLang.locationMap')}`" prop="latLng">
                <MapPointSelect
                  :latLng="termForm.latLng"
                  :address="termForm.addressMap"
                  :dlgTitle="$t('mapLang.address')"
                  :showLatLng="true"
                  :splitCountry="true"
                  @change="addressChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="$t('mapLang.geofence')"
                prop="geofenceType"
                :rules="[
                  {
                    required: geofenceTypeRequired,
                    pattern: new RegExp(/^(?!(\s+$))/g),
                    message: $t('ui.reqMsg'),
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <MapDrawingPolygon
                  :geofenceType="termForm.geofenceType"
                  :latLngList="termForm.geofencePolygonLatLngList || []"
                  :circleLatLng="termForm.geofenceRadiusLatLng"
                  :circleRadius="termForm.geofenceRadius"
                  :markerText="termForm.addressMap"
                  :markerLatLng="termForm.latLng"
                  :dlgTitle="$t('mapLang.geofence')"
                  :disabled="comDisFrom"
                  @change="geofenceLatLngListChange"
                  :iconShow="!!termForm.latLng"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('bp.project')">
                <el-select
                  v-model="termForm.projectIdList"
                  placeholder=""
                  style="width: 100%"
                  filterable
                  clearable
                  @change="projectChange"
                >
                  <el-option
                    v-for="dict in projectList"
                    :key="dict.rowTimeId"
                    :label="dict.projectName"
                    :value="dict.rowTimeId"
                    :disabled="dict.isCanUpdate === '0'"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="cdsQc === '0'">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.locationPrecinct')}`">
                <el-input v-model="termForm.location" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.cityTown')}`" prop="city">
                <el-input v-model="termForm.city" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.provinceState')}`">
                <el-input v-model="termForm.province" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.postalCode')}`">
                <el-input v-model="termForm.postalCode" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.country')}`" prop="country">
                <CountrySelect
                  v-model="termForm.country"
                  class="form-wd"
                  @select="handleCountrySelect"
                />
              </el-form-item>
            </el-col>
            <!-- 2.0.1 修改：隐藏地址编号 -->
            <el-col :span="8" v-if="false">
              <el-form-item
                v-if="!termForm.businessAddressId"
                :label="`${$t('mapLang.addressCode')}`"
                :rules="[
                  {
                    required: termForm.isAutoAddressCode === '0',
                    pattern: new RegExp(/^(?!(\s+$))/g),
                    message: $t('ui.reqMsg').replace('$1', $t('mapLang.addressCode')),
                    trigger: ['blur', 'change']
                  }
                ]"
                prop="addressCode"
              >
                <!-- :disabled="!!termForm.userId" -->
                <div class="input-switch-box">
                  <div class="con-left">
                    <el-input
                      :disabled="termForm.isAutoAddressCode === '1'"
                      v-model="termForm.addressCode"
                      maxlength="50"
                    />
                  </div>
                  <div class="con-right">
                    <el-switch
                      v-model="termForm.isAutoAddressCode"
                      active-value="1"
                      inactive-value="0"
                      :disabled="$store.state.user.autoCode !== '2'"
                      @change="changeEmployeeNoSwitch('addressCode')"
                    ></el-switch>
                  </div>
                </div>
              </el-form-item>
              <el-form-item :label="`${$t('mapLang.addressCode')}`" prop="addressCode" v-else>
                <el-input disabled v-model="termForm.addressCode" maxlength="50" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="cdsQc === '1'">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.country')}`" prop="countryEn">
                <el-select
                  v-model="termForm.countryEn"
                  placeholder=""
                  clearable
                  @change="countryIdChange"
                  style="width: 100%"
                  filterable
                >
                  <el-option
                    v-for="dict in countryList"
                    :key="dict.en"
                    :label="dict.en"
                    :value="dict.en"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('mapLang.provinceState')" prop="provinceState">
                <el-select
                  v-model="termForm.provinceState"
                  :disabled="!termForm.countryEn"
                  :title="termForm.provinceState"
                  :loading="provinceStateLoading"
                  @change="provinceStateChange"
                  @visible-change="provinceStateVisible"
                  placeholder=""
                  clearable
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in provinceStateList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('mapLang.cityTown')" prop="cityTown">
                <el-select
                  v-model="termForm.cityTown"
                  :disabled="!termForm.countryEn || !termForm.provinceState"
                  :title="termForm.cityTown"
                  :loading="cityTownLoading"
                  @change="cityTownChange"
                  @visible-change="cityTownVisible"
                  placeholder=""
                  clearable
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in cityTownList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="`${$t('ui.addressLine1')}`" prop="address1">
                <el-input
                  v-model="termForm.address1"
                  class="w100"
                  placeholder=""
                  :maxlength="200"
                  :disabled="!termForm.latLng"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item :label="`${$t('ui.addressLine2')}`">
                <el-input v-model="termForm.address2" maxlength="500"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.postalCode')}`">
                <el-input v-model="termForm.postalCode" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.locationPrecinct')}`">
                <el-input v-model="termForm.location" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <!-- 2.0.1 修改：隐藏地址编号 -->
            <el-col :span="8" v-if="false">
              <el-form-item
                v-if="!termForm.businessAddressId"
                :label="`${$t('mapLang.addressCode')}`"
                :rules="[
                  {
                    required: termForm.isAutoAddressCode === '0',
                    pattern: new RegExp(/^(?!(\s+$))/g),
                    message: $t('ui.reqMsg').replace('$1', $t('mapLang.addressCode')),
                    trigger: ['blur', 'change']
                  }
                ]"
                prop="addressCode"
              >
                <!-- :disabled="!!termForm.userId" -->
                <div class="input-switch-box">
                  <div class="con-left">
                    <el-input
                      :disabled="termForm.isAutoAddressCode === '1'"
                      v-model="termForm.addressCode"
                      maxlength="50"
                    />
                  </div>
                  <div class="con-right">
                    <el-switch
                      v-model="termForm.isAutoAddressCode"
                      active-value="1"
                      inactive-value="0"
                      :disabled="$store.state.user.autoCode !== '2'"
                      @change="changeEmployeeNoSwitch('addressCode')"
                    ></el-switch>
                  </div>
                </div>
              </el-form-item>
              <el-form-item :label="`${$t('mapLang.addressCode')}`" prop="addressCode" v-else>
                <el-input disabled v-model="termForm.addressCode" maxlength="50" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

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
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.isActive')}`">
              <el-switch
                v-model="termForm.isActive"
                :disabled="comDisFrom"
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
              <template v-if="item.prop === 'isActive'">
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
import Sortable from 'sortablejs'
import CountrySelect from '@/components/select/countrySelect'
import {
  // getCountriesList,
  queryCitiesByStatesName,
  queryStatesByCountriesName
} from '@/api/countries'
import { queryCountryListBySelect } from '@/api/basic/basic.js'

import { checkInRange } from '@/api/businessPartner/businessPartner'

export default {
  dicts: ['address_label'],
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
    cdsQc: {
      type: String,
      default: '0'
    },
    countryItem: {
      type: Object,
      default: () => {}
    },
    projectList: {
      type: Array,
      default: () => []
    },
    geofenceTypeRequired: {
      type: [Boolean],
      default: false
    }
  },
  computed: {
    sysDockingSwitch() {
      return this.$store.getters.sysDockingSwitch
    }
  },
  data() {
    const vm = this
    return {
      tableKey: Date.now(),
      saveKey: '1',
      /* 表格表单部分 */
      termForm: {
        label: ''
      },
      termFormRules: {
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
            trigger: ['blur']
          }
        ],
        city: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        province: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        country: [
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
        ],
        provinceState: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('mapLang.provinceState')),
            trigger: ['change']
          }
        ]
      },
      isTermEdit: false,
      editIndex: undefined,
      /* 表格部分 */
      columns: [
        {
          prop: 'label',
          label: vm.$t('ui.label'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },

        {
          prop: 'address1',
          label: vm.$t('ui.addressLine1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'address2',
          label: vm.$t('ui.addressLine2'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'location',
          label: vm.$t('ui.locationPrecinct'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'city',
          label: vm.$t('ui.cityTown'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'province',
          label: vm.$t('ui.provinceState'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'postalCode',
          label: vm.$t('ui.postalCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
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
      countryList: [],
      provinceStateLoading: false,
      provinceStateList: [],
      cityTownLoading: false,
      cityTownList: [],
      btnLoading: false
    }
  },
  methods: {
    labelListChange(ids, labels) {
      if (!ids.includes('Registered') && this.termForm.isRegistered) {
        ids.unshift('Registered')
      }
      this.$set(this.termForm, 'labelList', ids)
      this.$set(this.termForm, 'label', ids.join(', '))
    },
    changeEmployeeNoSwitch(code) {
      this.$set(this.termForm, code, '')
      if (this.$refs.termForm) {
        this.$nextTick(() => {
          this.$refs.termForm.clearValidate(code)
        })
      }
    },
    handlerProjectListCascader() {
      this.projectListCascader = JSON.parse(JSON.stringify(this.projectList))
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
    addressChange(row) {
      if (row.addressData) {
        this.$set(this.termForm, 'country', row.addressData.country)
        this.$set(this.termForm, 'countryEn', row.addressData.country)
        this.$set(this.termForm, 'provinceState', row.addressData.province || row.addressData.city)
        this.$set(this.termForm, 'province', this.termForm.provinceState)
        this.$set(this.termForm, 'cityTown', row.addressData.city || row.addressData.province)
        this.$set(this.termForm, 'city', this.termForm.cityTown)
        this.$set(this.termForm, 'postalCode', row.addressData.postalCode)
      }
      // this.$set(this.termForm, 'address', row.address)
      // this.$set(this.termForm, 'address1', row.address)
      if (!this.termForm.address1) {
        this.$set(this.termForm, 'address1', row.address)
      }
      this.$set(this.termForm, 'addressMap', row.address)
      this.$set(this.termForm, 'validAddress', row.address)
      this.$set(this.termForm, 'latLng', row.latLng)
    },
    /* 国家相关操作 */
    getCountriesList() {
      if (this.cdsQc === '0') {
        /* getCountriesList().then((res) => {
          this.countryList = res.data || []
        }) */
      } else {
        queryCountryListBySelect().then((res) => {
          this.countryList = res.data || []
        })
      }
    },
    countryIdChange() {
      const list = this.countryList.filter((x) => x.en === this.termForm.countryEn)
      // console.log(list, '===')
      this.termForm.provinceState && this.$set(this.termForm, 'country', list[0].name)

      this.termForm.provinceState && this.$set(this.termForm, 'provinceState', '')
      this.termForm.cityTown && this.$set(this.termForm, 'cityTown', '')
      this.termForm.postalCode && this.$set(this.termForm, 'postalCode', '')
      this.termForm.latLng && this.$set(this.termForm, 'latLng', '')
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
      this.tableKey++
      this.$emit('change', list)
    },
    /* 表格表单部分 */
    handleCountrySelect(row) {
      if (row) {
        const { id, name } = row
        this.$set(this.termForm, 'country', name)
        this.$set(this.termForm, 'countryId', id)
      }
    },
    handleResetTerm() {
      this.isTermEdit = false
      this.editIndex = undefined
      this.termForm = {
        label: '',
        labelList: [],
        address1: '',
        address2: '',
        addressMap: '',
        city: '',
        province: '',
        isActive: '1',
        countryId: undefined,
        country: undefined,
        provinceState: undefined,
        cityTown: undefined,
        // isAutoAddressCode: this.$store.state.user.autoCode === '3' ? '0' : '1',
        isAutoAddressCode: '1',
        addressCode: undefined,
        latLng: undefined,
        geofenceType: undefined
      }
      if (this.cdsQc === '0') {
        this.$set(
          this.termForm,
          'countryId',
          this.countryItem ? this.countryItem.countryId : undefined
        )
        this.$set(this.termForm, 'country', this.countryItem ? this.countryItem.country : undefined)
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
      this.getCountriesList()
      this.visible = true
      this.handleResetTerm()
    },
    handleAddTerm() {
      const vm = this
      vm.isTermEdit = false

      vm.$refs.termForm.validate((valid) => {
        if (valid) {
          vm.btnLoading = true
          // setTimeout(() => {
          //   vm.btnLoading = false
          // }, 1000)
          /* vm.termForm.label = vm.termForm.label.trim()
          const isExistSameLabel = vm.tableList.find((item) => {
            return item.label === vm.termForm.label
          })
          if (isExistSameLabel) {
            vm.$modal.msgError(
              vm
                .$t('ui.alreadyExists')
                .replace('$1', `${this.$t('ui.label')} [${vm.termForm.label}]`)
            )
            vm.btnLoading = false
            return
          } */

          const params = JSON.parse(JSON.stringify(vm.termForm))
          params.address = params.address1
          params.rowTimeId = Date.now()
          params.isNewCustomerAddress = 1
          if (this.cdsQc === '1') {
            params.province = params.provinceState
            params.city = params.cityTown
            if (params.projectIdList) {
              params.projectIdList = params.projectIdList.split(',') || []
            } else {
              params.projectIdList = undefined
            }
            if (this.geofenceTypeRequired) {
              checkInRange(params)
                .then((res) => {
                  if (params.projectIdList && params.projectIdList.length > 0) {
                    params.projectIdList = (params.projectIdList || []).join(',') || ''
                  }
                  vm.tableList.push({
                    ...params
                  })
                  this.$emit('change', vm.tableList)
                  vm.visible = false
                  setTimeout(() => {
                    vm.btnLoading = false
                  }, 200)
                })
                .catch(() => {
                  setTimeout(() => {
                    vm.btnLoading = false
                  }, 200)
                })
            } else {
              if (params.projectIdList && params.projectIdList.length > 0) {
                params.projectIdList = (params.projectIdList || []).join(',') || ''
              }
              vm.tableList.push({
                ...params
              })
              this.$emit('change', vm.tableList)
              vm.visible = false
              setTimeout(() => {
                vm.btnLoading = false
              }, 200)
            }
          } else {
            vm.tableList.push({
              ...params
            })
            this.$emit('change', vm.tableList)
            vm.visible = false
            setTimeout(() => {
              vm.btnLoading = false
            }, 200)
          }

          // vm.initDraggable()
        }
      })
    },
    handleTermRowClick(dataRow) {
      const vm = this
      vm.isTermEdit = true
      vm.editIndex = vm.tableList.findIndex((item) => item.rowTimeId === dataRow.rowTimeId)
      const params = JSON.parse(JSON.stringify(dataRow))
      params.provinceState = params.province
      params.cityTown = params.city
      if (params.labelList && params.labelList.includes('Registered')) {
        params.isRegistered = true
      }
      vm.termForm = {
        ...params
      }
      this.getCountriesList()
      this.visible = true
    },
    handleEditTerm() {
      const vm = this

      vm.$refs.termForm.validate((valid) => {
        if (valid) {
          vm.btnLoading = true

          /* vm.termForm.label = vm.termForm.label.trim()
          const isExistSameLabel = vm.tableList.find((item) => {
            if (vm.termForm[this.rowIdKey] === item[this.rowIdKey]) {
              return false
            }
            return item.label === vm.termForm.label
          })
          if (isExistSameLabel) {
            vm.$modal.msgError(
              vm
                .$t('ui.alreadyExists')
                .replace('$1', `${this.$t('ui.label')} [${vm.termForm.label}]`)
            )
            vm.btnLoading = false
            return
          } */
          const params = JSON.parse(JSON.stringify(vm.termForm))
          params.address = params.address1
          if (this.cdsQc === '1') {
            params.provinceState = params.province
            params.cityTown = params.city
            if (params.projectIdList) {
              params.projectIdList = params.projectIdList.split(',') || []
            } else {
              params.projectIdList = undefined
            }
            if (this.geofenceTypeRequired) {
              checkInRange(params)
                .then((res) => {
                  if (params.projectIdList && params.projectIdList.length > 0) {
                    params.projectIdList = (params.projectIdList || []).join(',') || ''
                  }
                  vm.$set(vm.tableList, vm.editIndex, { ...params })
                  this.$emit('change', vm.tableList)
                  vm.visible = false
                  setTimeout(() => {
                    vm.btnLoading = false
                  }, 200)
                })
                .catch(() => {
                  setTimeout(() => {
                    vm.btnLoading = false
                  }, 200)
                })
            } else {
              if (params.projectIdList && params.projectIdList.length > 0) {
                params.projectIdList = (params.projectIdList || []).join(',') || ''
              }
              vm.$set(vm.tableList, vm.editIndex, { ...params })
              this.$emit('change', vm.tableList)
              vm.visible = false
              setTimeout(() => {
                vm.btnLoading = false
              }, 200)
            }
          } else {
            vm.$set(vm.tableList, vm.editIndex, { ...params })
            this.$emit('change', vm.tableList)
            vm.visible = false
            setTimeout(() => {
              vm.btnLoading = false
            }, 200)
          }
        }
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
          this.$emit('change', this.tableList, 'delete')
          this.selected = []
        })
        .catch(() => {})
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

<style lang="scss">
.isRegistered {
  .el-select__tags .el-tag:first-of-type .el-tag__close {
    display: none;
  }
}
</style>
