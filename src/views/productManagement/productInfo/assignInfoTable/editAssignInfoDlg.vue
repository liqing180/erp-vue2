<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="$t('PRODUCT.assignInfo')"
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
          <el-col :span="12">
            <el-form-item :label="`${$t('PRODUCT.extendedOrganization')}`">
              <el-input v-model="termForm.legalEntityNames" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.localization')}`">
              <el-input
                :value="selectDictLabel(sysLocalization, termForm.localization)"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="isSystemDocking !== '1'">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="`${$t('PRODUCT.productName')}`" prop="productName">
                <el-input v-model="termForm.productName" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="`${$t('PRODUCT.alias')}`">
                <el-input v-model="termForm.alias" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="`${$t('PRODUCT.brand')}`">
                <el-input v-model="termForm.brand" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="`${$t('ui.isActive')}`">
                <el-switch
                  v-model="termForm.isActive"
                  active-value="1"
                  inactive-value="0"
                ></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('ui.description')">
                <MyInput
                  type="textarea"
                  v-model="termForm.description"
                  :autosize="{ minRows: 2, maxRows: 8 }"
                  resize="none"
                  show-word-limit
                  :maxlength="7000"
                ></MyInput>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template
          v-if="isSystemDocking === '1' && JSON.stringify(termForm.ivtSpecifications) !== '{}'"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="`${$t('ui.zoneName')}`" prop="zoneIdList">
                <el-select
                  style="width: 100%"
                  v-model="termForm.zoneIdList"
                  placeholder=""
                  multiple
                  collapse-tags
                  class="log-msg-ellipsis"
                  v-default-select="[enterpriseIds]"
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
            <el-col :span="12">
              <el-form-item :label="`${$t('ui.type')}`">
                <el-input
                  :value="
                    termForm.ivtSpecifications && termForm.ivtSpecifications.type
                      ? selectDictLabel(
                          dict.type.mdm_material_type,
                          termForm.ivtSpecifications.type
                        )
                      : ''
                  "
                  disabled
                ></el-input>
                <!-- <el-select
                  style="width: 100%"
                  v-model="termForm.ivtSpecifications.type"
                  placeholder=""
                  clearable
                  disabled
                >
                  <el-option
                    v-for="item in dict.type.mdm_material_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select> -->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="`${$t('PRODUCT.productName')}`" prop="productName">
                <el-input v-model="termForm.productName" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="`${$t('PRODUCT.alias')}`">
                <el-input v-model="termForm.alias" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('PRODUCT.toleranceType')"
                prop="ivtSpecifications.toleranceType"
              >
                <el-select
                  style="width: 100%"
                  v-model="termForm.ivtSpecifications.toleranceType"
                  placeholder=""
                  clearable
                >
                  <el-option
                    v-for="item in dict.type.mdm_material_tolerance_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="`${$t('PRODUCT.brand')}`">
                <el-input v-model="termForm.brand" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('PRODUCT.overTolerance')"
                prop="ivtSpecifications.overTolerance"
              >
                <el-input-number
                  style="width: 100%"
                  v-model="termForm.ivtSpecifications.overTolerance"
                  controls-position="right"
                  :precision="4"
                  v-thousandSplit="{ precision: 4 }"
                  :min="0.0"
                  :max="9999.9999"
                  @change="inputNumberChange('ivtSpecifications.overTolerance')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('PRODUCT.underTolerance')"
                prop="ivtSpecifications.underTolerance"
              >
                <el-input-number
                  style="width: 100%"
                  v-model="termForm.ivtSpecifications.underTolerance"
                  controls-position="right"
                  :precision="4"
                  v-thousandSplit="{ precision: 4 }"
                  :min="0.0"
                  :max="9999.9999"
                  @change="inputNumberChange('ivtSpecifications.underTolerance')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('PRODUCT.specificGravity')"
                prop="ivtSpecifications.specificGravity"
              >
                <el-input-number
                  style="width: 100%"
                  v-model="termForm.ivtSpecifications.specificGravity"
                  controls-position="right"
                  :precision="4"
                  v-thousandSplit="{ precision: 4 }"
                  :min="0.0"
                  :max="999.9999"
                  @change="inputNumberChange('ivtSpecifications.specificGravity')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('PRODUCT.minInMixDesign')" prop="ivtSpecifications.minInMix">
                <el-input-number
                  style="width: 100%"
                  v-model="termForm.ivtSpecifications.minInMix"
                  controls-position="right"
                  :precision="4"
                  v-thousandSplit="{ precision: 4 }"
                  :min="0.0"
                  :max="termForm.ivtSpecifications.maxInMix || 999.9999"
                  @change="inputNumberChange('ivtSpecifications.minInMix')"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('PRODUCT.maxInMixDesign')" prop="ivtSpecifications.maxInMix">
                <el-input-number
                  style="width: 100%"
                  v-model="termForm.ivtSpecifications.maxInMix"
                  controls-position="right"
                  :precision="4"
                  v-thousandSplit="{ precision: 4 }"
                  :min="termForm.ivtSpecifications.minInMix || 0"
                  :max="999.9999"
                  @change="inputNumberChange('ivtSpecifications.maxInMix')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('PRODUCT.minMoisture')" prop="ivtSpecifications.minMoisture">
                <el-input-number
                  style="width: 100%"
                  v-model="termForm.ivtSpecifications.minMoisture"
                  controls-position="right"
                  :precision="4"
                  v-thousandSplit="{ precision: 4 }"
                  :min="0.0"
                  :max="termForm.ivtSpecifications.maxMoisture || 999.9999"
                  @change="inputNumberChange('ivtSpecifications.minMoisture')"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('PRODUCT.maxMoisture')" prop="ivtSpecifications.maxMoisture">
                <el-input-number
                  style="width: 100%"
                  v-model="termForm.ivtSpecifications.maxMoisture"
                  controls-position="right"
                  :precision="4"
                  v-thousandSplit="{ precision: 4 }"
                  :min="termForm.ivtSpecifications.minMoisture || 0.0"
                  :max="999.9999"
                  @change="inputNumberChange('ivtSpecifications.maxMoisture')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('PRODUCT.minTemperatureC')">
                <el-input-number
                  style="width: 100%"
                  v-model="termForm.ivtSpecifications.minTemperatureC"
                  controls-position="right"
                  :precision="2"
                  v-thousandSplit="{ precision: 2 }"
                  :min="-999.99"
                  :max="
                    $resultOfBoolean(termForm.ivtSpecifications.maxTemperatureC)
                      ? termForm.ivtSpecifications.maxTemperatureC
                      : 999.99
                  "
                  @change="inputNumberChange('ivtSpecifications.minTemperatureC')"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('PRODUCT.maxTemperatureC')">
                <el-input-number
                  style="width: 100%"
                  v-model="termForm.ivtSpecifications.maxTemperatureC"
                  controls-position="right"
                  :precision="2"
                  v-thousandSplit="{ precision: 2 }"
                  :min="
                    $resultOfBoolean(termForm.ivtSpecifications.minTemperatureC)
                      ? termForm.ivtSpecifications.minTemperatureC
                      : -999.99
                  "
                  :max="999.99"
                  @change="inputNumberChange('ivtSpecifications.maxTemperatureC')"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              v-if="['1', '2'].indexOf(termForm.ivtSpecifications.type) !== -1 && false"
            >
              <el-form-item
                :label="$t('PRODUCT.minFinenessModulus')"
                :rules="{
                  required: true,
                  message: $t('ui.reqMsg'),
                  trigger: ['blur']
                }"
                prop="ivtSpecifications.minFinenessModulus"
              >
                <el-input-number
                  style="width: 100%"
                  v-model="termForm.ivtSpecifications.minFinenessModulus"
                  controls-position="right"
                  :precision="2"
                  v-thousandSplit="{ precision: 2 }"
                  :min="0.01"
                  :max="termForm.ivtSpecifications.maxFinenessModulus || 9999.99"
                  @change="inputNumberChange('ivtSpecifications.minFinenessModulus')"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col
              :span="12"
              v-if="['1', '2'].indexOf(termForm.ivtSpecifications.type) !== -1 && false"
            >
              <el-form-item
                :label="`${$t('PRODUCT.maxFinenessModulus')}`"
                prop="ivtSpecifications.maxFinenessModulus"
                :rules="{
                  required: true,
                  message: $t('ui.reqMsg'),
                  trigger: ['blur']
                }"
              >
                <el-input-number
                  style="width: 100%"
                  v-model="termForm.ivtSpecifications.maxFinenessModulus"
                  controls-position="right"
                  :precision="2"
                  v-thousandSplit="{ precision: 2 }"
                  :min="termForm.ivtSpecifications.minFinenessModulus || 0.01"
                  :max="9999.99"
                  @change="inputNumberChange('ivtSpecifications.maxFinenessModulus')"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="`${$t('ui.isActive')}`">
                <el-switch
                  v-model="termForm.isActive"
                  active-value="1"
                  inactive-value="0"
                ></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('ui.remarks')">
                <MyInput
                  type="textarea"
                  v-model="termForm.ivtSpecifications.extendRemarks"
                  :autosize="{ minRows: 2, maxRows: 8 }"
                  resize="none"
                  show-word-limit
                  :maxlength="300"
                ></MyInput>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('ui.description')">
                <MyInput
                  type="textarea"
                  v-model="termForm.description"
                  :autosize="{ minRows: 2, maxRows: 8 }"
                  resize="none"
                  show-word-limit
                  :maxlength="7000"
                ></MyInput>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
      <!-- <div style="text-align: center; margin-bottom: 10px"> -->
      <div slot="footer" class="dialog-footer">
        <template>
          <el-button size="small" @click="visible = false">{{ $t('uiBtn.back') }}</el-button>
          <el-button type="primary" v-if="!comDisFrom" size="small" @click="handleEditTerm">{{
            $t('uiBtn.submit')
          }}</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateLegalEntityProduct } from '@/api/productManagement/productInfo'
import { queryAllZoneListByLegalEntityId } from '@/api/organization/zone'

export default {
  dicts: ['mdm_material_type', 'mdm_material_tolerance_type'],
  props: {
    sysLocalization: {
      type: [Array],
      default() {
        return []
      }
    },
    // 是否系统对接
    isSystemDocking: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      /* 表格表单部分 */
      termForm: {
        productName: '',
        alias: '',
        brand: '',
        isActive: '0',
        description: '',
        zoneIdList: [],
        ivtSpecifications: {
          type: undefined,
          toleranceType: undefined,
          overTolerance: undefined,
          underTolerance: undefined,
          specificGravity: undefined,
          minInMix: undefined,
          maxInMix: undefined,
          minMoisture: undefined,
          maxMoisture: undefined,
          minTemperatureC: undefined,
          maxTemperatureC: undefined,
          minFinenessModulus: undefined,
          maxFinenessModulus: undefined,
          extendRemarks: undefined
        }
      },
      termFormRules: {
        productName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        materialName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.materialName')),
            trigger: ['change', 'blur']
          }
        ],
        roleAlias: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.roleAlias')),
            trigger: ['change', 'blur']
          }
        ],
        roleKey: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.roleKey')),
            trigger: ['change', 'blur']
          }
        ],
        'ivtSpecifications.specificGravity': [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.specificGravity')),
            trigger: ['blur']
          }
        ],
        'ivtSpecifications.toleranceType': [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.toleranceType')),
            trigger: ['change', 'blur']
          }
        ],
        'ivtSpecifications.type': [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.type')),
            trigger: ['change', 'blur']
          }
        ],
        productionRate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.productionRate')),
            trigger: ['change', 'blur']
          }
        ],
        contactPersonName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.contactPerson')),
            trigger: ['change', 'blur']
          }
        ],
        'ivtSpecifications.overTolerance': [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.overTolerance')),
            trigger: ['blur']
          }
        ],
        'ivtSpecifications.underTolerance': [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.underTolerance')),
            trigger: ['blur']
          }
        ],
        zoneIdList: [
          {
            required: true,
            type: 'array',
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.underTolerance')),
            trigger: ['blur', 'change']
          }
        ]
      },
      visible: false,
      zoneList: [],
      enterpriseIds: []
    }
  },
  computed: {
    editAuth() {
      return this.checkPermi(['productManagement:productInfo:assignTo'])
    },
    comDisFrom() {
      return !this.editAuth
    }
  },
  methods: {
    inputNumberChange(code) {
      this.$refs.termForm.validateField(code)
    },
    reset() {
      this.handleResetTerm()
    },
    /* 表格表单部分 */
    handleResetTerm() {
      this.isTermEdit = false
      this.editIndex = undefined
      this.termForm = {
        productName: '',
        alias: '',
        brand: '',
        isActive: '0',
        description: '',
        zoneIdList: [],
        ivtSpecifications: {
          type: undefined,
          toleranceType: undefined,
          overTolerance: undefined,
          underTolerance: undefined,
          specificGravity: undefined,
          minInMix: undefined,
          maxInMix: undefined,
          minMoisture: undefined,
          maxMoisture: undefined,
          minTemperatureC: undefined,
          maxTemperatureC: undefined,
          minFinenessModulus: undefined,
          maxFinenessModulus: undefined,
          extendRemarks: undefined
        }
      }
      this.$nextTick(() => {
        this.$refs.termForm && this.$refs.termForm.clearValidate()
      })
    },
    closed() {
      this.handleResetTerm()
    },
    handleEdit(dataRow) {
      this.handleResetTerm()
      const vm = this

      vm.termForm = { ...dataRow }
      this.getAllZoneList()
      this.visible = true
    },
    getAllZoneList() {
      queryAllZoneListByLegalEntityId({ legalEntityId: this.termForm.legalEntityId }).then(
        (res) => {
          this.zoneList = res.data || []
          if (this.isSystemDocking === '1' && !!this.termForm.zoneIds) {
            const zoneIdList = this.termForm.zoneIds.split(',')
            this.enterpriseIds = JSON.parse(JSON.stringify(zoneIdList))
            this.zoneList.forEach((x) => {
              if (zoneIdList.indexOf(x.zoneId) !== -1) {
                this.$set(x, 'disabled', true)
              }
            })
            this.$set(this.termForm, 'zoneIdList', zoneIdList)
          }
        }
      )
    },

    async handleEditTerm() {
      const vm = this
      const valid3 = await this.$refs.termForm.validate().catch((err) => {
        return err
      })

      if (!valid3) {
        return
      }
      this.$modal
        .confirm(this.$t('ui.submitPageConfirm'))
        .then(() => {
          return updateLegalEntityProduct(vm.termForm)
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))

          this.$emit('update', response.data || {})
          this.visible = false
        })
        .catch(() => {})
    }
  }
}
</script>
