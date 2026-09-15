<template>
  <div class="pb20">
    <el-form
      ref="form"
      :model="form"
      @submit.native.prevent
      :rules="rules"
      label-width="180px"
      :disabled="comDisFrom"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('SALES.projectName')}`" prop="projectId">
            <SelectInput
              clearable
              :value="form.projectName"
              @click="openProjectTable"
              @clear="projectClear"
              :disabled="!form.businessPartnerId || comDisFrom || !!form.salesQuotationMainId"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('SALES.projectCode')}`" prop="projectCode">
            <el-input :value="form.projectCode" :title="form.projectCode" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item :label="`${$t('ui.zone')}`" prop="zoneId">
            <el-input :value="form.zoneName" :title="form.zoneName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('SALES.projectContactPersonName')}`"
            prop="projectContactPersonList"
            :class="[isModified('projectContactPersonNames')]"
          >
            <el-select
              :disabled="!form.projectId"
              style="width: 100%"
              v-model="form.projectContactPersonList"
              placeholder=""
              @change="projectContactPersonChange"
              filterable
              clearable
              multiple
              collapse-tags
              value-key="businessContactPersonId"
              v-if="!comDisFrom"
            >
              <el-option
                v-for="item in canSelectProjectContactPersonList"
                :key="item.businessContactPersonId"
                :label="item.contactPersonName"
                :value="item"
              >
              </el-option>
            </el-select>

            <el-input
              :value="form.projectContactPersonNames"
              :title="form.projectContactPersonNames"
              v-else
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            :label="`${$t('SALES.deliveryAddress')}`"
            prop="bpBusinessAddressId"
            :class="[isModified('receiveAddress')]"
          >
            <CommonSelect
              v-if="!comDisFrom"
              :disabled="!form.projectId"
              :id="form.bpBusinessAddressId"
              :label="form.receiveAddress"
              :title="form.receiveAddress"
              idKey="businessAddressId"
              labelKey="receiveAddress"
              :options="canSelectProjectCustomerAddressList"
              @change="siteAddressChange"
            />

            <el-input :value="form.receiveAddress" :title="form.receiveAddress" v-else></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('SALES.projectContactPersonNo')}`">
            <el-input
              :value="(form.projectContactPersonList || []).map((x) => x.mobilePhone).join(', ')"
              :title="(form.projectContactPersonList || []).map((x) => x.mobilePhone).join(', ')"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('SALES.specialRequirement')}`"
            prop="specialRequirement"
            :class="[isModified('specialRequirement')]"
          >
            <el-select
              style="width: 100%"
              v-model="form.specialRequirement"
              placeholder=""
              @change="specialRequirementChange"
            >
              <el-option
                v-for="item in dict.type.sales_special_requirement"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="form.specialRequirement === '3'">
        <el-row>
          <el-col :span="8" v-if="false">
            <el-form-item prop="cubeSpacingNum">
              <span slot="label">
                <el-tooltip :content="$t('SALES.cubeSpacingNumTip')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t('SALES.cubeSpacingNum') }}
              </span>
              <el-input-number
                style="width: 100%"
                v-model="form.cubeSpacingNum"
                controls-position="right"
                :precision="0"
                v-thousandSplit="{ precision: 0 }"
                :min="0"
                :max="99"
                @change="inputNumberChange('cubeSpacingNum')"
              />
            </el-form-item>
          </el-col>

          <el-col :span="16" v-if="language === 'zh'">
            <el-form-item required>
              <span slot="label">
                <el-tooltip :content="$t('SALES.cubeSpacingNumTip')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t('SALES.cubeSpacingNum') }}
              </span>
              <div class="flex" style="font-size: 12px; color: #606266">
                <span class="fs-0 mr10">每</span>
                <el-form-item
                  :show-message="false"
                  prop="cubeSpacingNum"
                  :class="[isModified('cubeSpacingNum')]"
                >
                  <el-input-number
                    style="width: 100%"
                    v-model="form.cubeSpacingNum"
                    controls-position="right"
                    :precision="0"
                    v-thousandSplit="{ precision: 0 }"
                    :min="1"
                    :max="99"
                    @change="inputNumberChange('cubeSpacingNum')"
                  />
                </el-form-item>
                <span class="fs-0 ml10 mr10">车做</span>
                <el-form-item
                  :show-message="false"
                  prop="cubeDoNum"
                  :class="[isModified('cubeDoNum')]"
                >
                  <el-input-number
                    style="width: 100%"
                    v-model="form.cubeDoNum"
                    controls-position="right"
                    :precision="0"
                    v-thousandSplit="{ precision: 0 }"
                    :min="1"
                    :max="99"
                    @change="inputNumberChange('cubeDoNum')"
                  />
                </el-form-item>
                <span class="fs-0 ml10">个立方体</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="16" v-else>
            <el-form-item required>
              <span slot="label">
                <el-tooltip :content="$t('SALES.cubeSpacingNumTip')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t('SALES.cubeSpacingNum') }}
              </span>
              <div class="flex" style="font-size: 12px; color: #606266">
                <span class="fs-0 mr10">Perform</span>
                <el-form-item
                  :show-message="false"
                  prop="cubeDoNum"
                  :class="[isModified('cubeDoNum')]"
                >
                  <el-input-number
                    style="width: 100%"
                    v-model="form.cubeDoNum"
                    controls-position="right"
                    :precision="0"
                    v-thousandSplit="{ precision: 0 }"
                    :min="1"
                    :max="99"
                    @change="inputNumberChange('cubeDoNum')"
                  />
                </el-form-item>
                <span class="fs-0 ml10 mr10">Cube/s for Every</span>
                <el-form-item
                  :show-message="false"
                  prop="cubeSpacingNum"
                  :class="[isModified('cubeSpacingNum')]"
                >
                  <el-input-number
                    style="width: 100%"
                    v-model="form.cubeSpacingNum"
                    controls-position="right"
                    :precision="0"
                    v-thousandSplit="{ precision: 0 }"
                    :min="1"
                    :max="99"
                    @change="inputNumberChange('cubeSpacingNum')"
                  />
                </el-form-item>
                <span class="fs-0 ml10">Trucks</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>

    <selectProjectTable
      ref="selectProjectTable"
      :businessPartnerId="form.businessPartnerId"
      @update="updateProject"
    />
  </div>
</template>

<script>
import selectProjectTable from './selectProjectTable.vue'
export default {
  components: { selectProjectTable },
  dicts: ['sales_special_requirement'],
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
    },
    buttonAuthMsg: {
      type: Object,
      default() {
        return {}
      }
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    basicUpdateProps: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.form = newValue || {}
        const { canSelectProjectContactPersonList, canSelectProjectCustomerAddressList } = this.form
        if (canSelectProjectContactPersonList && canSelectProjectContactPersonList.length > 0) {
          this.canSelectProjectContactPersonList = (canSelectProjectContactPersonList || []).filter(
            (p) => p.isActive === '1'
          )
        }
        if (canSelectProjectCustomerAddressList && canSelectProjectCustomerAddressList.length > 0) {
          canSelectProjectCustomerAddressList &&
            canSelectProjectCustomerAddressList.forEach(
              (x) => (x.receiveAddress = this.siteAddressTitle([x]))
            )
          this.canSelectProjectCustomerAddressList = canSelectProjectCustomerAddressList || []
        }
      }
    }
  },
  data() {
    return {
      form: {},
      rules: {
        projectId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        projectCode: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        zoneId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        projectContactPersonList: [
          {
            required: true,
            type: 'array',
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        bpBusinessAddressId: [
          {
            required: false,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],

        specialRequirement: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        cubeSpacingNum: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        cubeDoNum: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      },
      canSelectProjectCustomerAddressList: [],
      canSelectProjectContactPersonList: []
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  methods: {
    clearValidate() {
      this.$refs.form && this.$refs.form.clearValidate()
    },
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    },
    specialRequirementChange() {
      if (this.form.specialRequirement !== '3') {
        this.$set(this.form, 'cubeSpacingNum', undefined)
        this.$set(this.form, 'cubeDoNum', undefined)
        this.$set(this.form, 'salesQuotationServiceList', [])
        this.$refs.form.validateField('cubeSpacingNum')
        this.$refs.form.validateField('cubeDoNum')
      }
      // if (this.form.specialRequirement !== '2') {
      // }
      this.$emit('specialRequirementChange')
    },
    inputNumberChange(code) {
      this.$refs.form.validateField(code)
    },
    openProjectTable() {
      this.$refs.selectProjectTable.handleOpen()
    },
    updateProject(row) {
      const {
        projectName,
        projectId,
        projectCode,
        projectAbbreviation,
        zoneId,
        zoneName,
        projectContactPersonList,
        customerAddressList,
        productMinVol,
        projectMaxVol
      } = row
      this.form.projectName = projectName
      this.form.projectId = projectId
      this.form.projectAbbreviation = projectAbbreviation
      this.form.projectCode = projectCode
      this.form.zoneId = zoneId
      this.form.zoneName = zoneName
      this.$set(this.form, 'productMinVol', productMinVol)
      this.$set(this.form, 'projectMaxVol', projectMaxVol)
      const list = (projectContactPersonList || []).filter((p) => p.isActive === '1')
      this.canSelectProjectContactPersonList = list
      this.$set(this.form, 'projectContactPersonList', list || [])
      if (list && list.length > 0) {
        this.projectContactPersonChange()
      }
      customerAddressList &&
        customerAddressList.forEach((x) => (x.receiveAddress = this.siteAddressTitle([x])))
      this.canSelectProjectCustomerAddressList = customerAddressList
      console.log(this.canSelectProjectCustomerAddressList)
      if (
        this.canSelectProjectCustomerAddressList &&
        this.canSelectProjectCustomerAddressList.length > 0
      ) {
        this.siteAddressChange(this.canSelectProjectCustomerAddressList[0])
      }
    },

    siteAddressTitle(e) {
      if (!e || e.length <= 0) return ''
      let location = ''
      e.forEach((x) => {
        const { country, provinceState, cityTown, address1, province, city } = x
        location +=
          address1 +
          '-' +
          (city || cityTown) +
          '-' +
          (province || provinceState) +
          '-' +
          country +
          ' / '
      })
      location = location.substring(0, location.length - 3)
      return location
    },
    projectClear() {
      this.form.projectName = undefined
      this.form.projectId = undefined
      this.form.projectAbbreviation = undefined
      this.form.projectCode = undefined
      this.form.zoneId = undefined
      this.form.zoneName = undefined
      this.form.projectContactPersonNames = undefined
      this.form.bpBusinessAddressId = undefined
      this.form.receiveAddress = undefined
      this.$set(this.form, 'productMinVol', undefined)
      this.$set(this.form, 'projectMaxVol', undefined)
      this.form.projectContactPersonList = []
      this.form.salesQuotationMixDesignList = []
      this.canSelectProjectCustomerAddressList = []
      this.canSelectProjectContactPersonList = []
    },
    siteAddressChange(row) {
      if (row) {
        this.form.bpBusinessAddressId = row.businessAddressId
        this.form.receiveAddressId = row.businessAddressId
        this.form.receiveAddress = row.receiveAddress
      } else {
        this.form.bpBusinessAddressId = undefined
        this.form.receiveAddressId = undefined
        this.form.receiveAddress = undefined
      }
    },
    projectContactPersonChange() {
      const projectContactPersonName = this.form.projectContactPersonList
        .map((item) => item.contactPersonName)
        .join(', ')
      const projectBusinessContactPersonIds = this.form.projectContactPersonList
        .map((item) => item.businessContactPersonId)
        .join(',')
      const projectContactPersonIds = this.form.projectContactPersonList
        .map((item) => item.contactPersonId)
        .join(',')
      this.$set(this.form, 'projectContactPersonNames', projectContactPersonName)
      this.$set(this.form, 'projectBusinessContactPersonIds', projectBusinessContactPersonIds)
      this.$set(this.form, 'projectContactPersonIds', projectContactPersonIds)
    },
    async submitForm() {
      const valid = await this.$refs.form.validate().catch((err) => {
        return err
      })
      return valid
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-box {
  max-width: 600px;
  max-height: 60vh;
  overflow-y: auto;
  // padding: 12px;
  box-sizing: border-box;
  background-color: #333;
  div {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
