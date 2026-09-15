<template>
  <FormPageLayoutTabs>
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm" v-if="!comDisFrom"
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
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.zoneName')}`" prop="zoneName">
                      <el-input
                        v-model="form.zoneName"
                        :title="form.zoneName"
                        maxlength="100"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('organization.orderBoundary')"
                      prop="orderScopeGeofenceType"
                    >
                      <MapDrawingPolygon
                        :geofenceType="form.orderScopeGeofenceType"
                        :latLngList="form.orderScopeGeofencePolygonLatLngList || []"
                        :circleLatLng="form.orderScopeGeofenceRadiusLatLng"
                        :circleRadius="form.orderScopeGeofenceRadius"
                        :dlgTitle="$t('organization.orderBoundary')"
                        :disabled="comDisFrom"
                        @change="orderScopeLatLngListChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      v-if="!rowId"
                      :label="`${$t('organization.zoneCode')}`"
                      :rules="[
                        {
                          required: form.isAutoZoneCode === '0',
                          pattern: new RegExp(/^(?!(\s+$))/g),
                          message: $t('ui.reqMsg'),
                          trigger: ['blur', 'change']
                        }
                      ]"
                      prop="zoneCode"
                    >
                      <div class="input-switch-box">
                        <div class="con-left">
                          <el-input
                            :disabled="form.isAutoZoneCode === '1'"
                            v-model="form.zoneCode"
                            maxlength="50"
                          />
                        </div>
                        <div class="con-right">
                          <el-switch
                            v-model="form.isAutoZoneCode"
                            active-value="1"
                            inactive-value="0"
                            @change="changeEmployeeNoSwitch('zoneCode')"
                          ></el-switch>
                        </div>
                      </div>
                    </el-form-item>
                    <el-form-item :label="`${$t('organization.zoneCode')}`" prop="zoneCode" v-else>
                      <el-input disabled v-model="form.zoneCode" maxlength="50" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('organization.locationPinColour')" prop="colourCode">
                      <el-color-picker
                        v-model="form.colourCode"
                        :predefine="predefineColors"
                      ></el-color-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.description')">
                      <MyInput
                        type="textarea"
                        v-model="form.description"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="300"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')">
                      <MyInput
                        type="textarea"
                        v-model="form.remarks"
                        :autosize="{ minRows: 2, maxRows: 4 }"
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
                        v-model="form.isActive"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" v-if="rowId">
            <el-collapse-item name="3">
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
      </div>
    </template>
  </FormPageLayoutTabs>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/organization/lang/index.js'
import { saveZone, updateZone, queryZoneById } from '@/api/organization/zone'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  name: '',
  dicts: ['bom_status'],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    SystemOperationLogTable
  },
  data() {
    const vm = this
    return {
      saveKey: '2',
      activeNames: ['1', '2', '3'],
      rowId: '',
      timeId: '',
      form: {},
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList: [],
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        zoneName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        orderScopeGeofenceType: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
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
          prop: 'productType',
          label: vm.$t('PRODUCT.productClass'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
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
          tooltip: true
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('PRODUCT.qty1'),
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
        }
      ],
      tableList: [],
      fullId: undefined,
      parentId: undefined,
      predefineColors: ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']
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
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.rowId = this.propRowId
        if (this.rowId) {
          this.handleUpdate()
        }
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['organization:zone:edit'])
    },
    comDisFrom() {
      if (this.isView) {
        return true
      }
      if (!this.rowId) return false
      if (this.editAuth) {
        return false
      }
      return true
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.reset()
    this.$$initColumnVisible(this.saveKey, this.columns)
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  methods: {
    changeEmployeeNoSwitch(code) {
      this.form[code] = ''
      if (this.$refs.form1) {
        this.$nextTick(() => {
          this.$refs.form1.clearValidate(code)
        })
      }
    },
    orderScopeLatLngListChange(data) {
      this.$set(this.form, 'orderScopeGeofencePolygonLatLngList', data.latLngList)
      this.$set(this.form, 'orderScopeGeofenceRadiusLatLng', data.circleLatLng)
      this.$set(this.form, 'orderScopeGeofenceRadius', data.circleRadius)
      this.$set(this.form, 'orderScopeGeofenceType', data.geofenceType)
    },
    handleUpdate() {
      this.reset()
      queryZoneById(this.rowId).then((res) => {
        const data = res.data || {}
        this.form = data
      })
    },
    reset() {
      this.form = {
        zoneId: undefined,
        zoneName: undefined,
        zoneCode: undefined,
        isAutoZoneCode: '1',
        isActive: '1',
        description: '',
        colourCode: '#2DAAFE',
        remark: ''
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.activeNames = ['1', '2', '3']
      this.resetForm('form1')
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
    },
    // 取消按钮
    cancel() {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/organization/zone' })
    },
    async submitForm() {
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      if (!valid1) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      this.collapseWarningForBasicInfo = false
      const param = JSON.parse(JSON.stringify(this.form))

      this.$modal
        .confirm(this.$t('organization.zoneSubmit'))
        .then(() => {
          if (this.rowId) {
            return updateZone(param)
          }
          return saveZone(param)
        })
        .then(() => {
          this.$modal.msgSuccess(this.$t('organization.zoneSuccess').replace('$1', param.zoneName))
          this.cancel()
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.hideColor {
  .el-color-dropdown__link-btn {
    display: none;
  }
}
.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
    // margin-right: 10px;
  }
}

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
