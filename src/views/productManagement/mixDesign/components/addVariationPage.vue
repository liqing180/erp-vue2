<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="title"
    :visible.sync="open"
    width="1150px"
    append-to-body
    @closed="closed"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="200px" class="mr20">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('PRODUCT.variation')" prop="variation">
            <el-input
              v-if="form.variationId || form.variationType === '2'"
              disabled
              v-model="form.variationShowStr"
              :title="form.variationShowStr"
            />
            <template v-else>
              <CommonSelect
                :id="form.variation"
                :label="form.variationShowStr"
                idKey="value"
                labelKey="label"
                :options="variationTypes || []"
                @change="handleChange"
                :disabled="comDisFrom"
              />
            </template>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            v-if="!form.variationId"
            :label="`${$t('PRODUCT.variationCode')}`"
            :rules="[
              {
                required: form.isAutoVariationCode === '0',
                pattern: new RegExp(/^(?!(\s+$))/g),
                message: $t('ui.reqMsg').replace('$1', $t('PRODUCT.variationCode')),
                trigger: ['blur']
              }
            ]"
            prop="variationCode"
          >
            <!-- :disabled="!!form.userId" -->
            <div class="input-switch-box">
              <div class="con-left">
                <el-input
                  :disabled="form.isAutoVariationCode === '1'"
                  v-model="form.variationCode"
                  maxlength="50"
                />
              </div>
              <div class="con-right">
                <el-switch
                  v-model="form.isAutoVariationCode"
                  active-value="1"
                  inactive-value="0"
                  :disabled="$store.state.user.autoCode !== '2'"
                  @change="changeEmployeeNoSwitch('variationCode')"
                ></el-switch>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="`${$t('PRODUCT.variationCode')}`" prop="variationCode" v-else>
            <el-input disabled v-model="form.variationCode" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('ui.createdBy')">
            <el-input disabled v-model="form.createdBy" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('ui.createdTime')}`">
            <el-date-picker
              :value="form.createdTime"
              :format="fmtForYmdhms"
              :style="{ width: '100%' }"
              disabled
              placeholder=""
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('ui.modifiedBy')">
            <el-input disabled v-model="form.modifiedBy" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('ui.modifiedTime')}`">
            <el-date-picker
              :value="form.modifiedTime"
              :format="fmtForYmdhms"
              :style="{ width: '100%' }"
              disabled
              placeholder=""
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item :label="$t('ui.remarks')">
          <MyInput
            :disabled="comDisFrom"
            type="textarea"
            v-model="form.remarks"
            :autosize="{ minRows: 1, maxRows: 8 }"
            resize="none"
            show-word-limit
            :maxlength="300"
          ></MyInput>
        </el-form-item>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('ui.isActive')}`">
            <el-switch
              v-model="form.isActive"
              :disabled="comDisFrom"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="$t('PRODUCT.variationDetail')" name="1">
        <!-- <template slot="title">
          <svg-icon class-name="collapse-item-title-icon" icon-class="shopping" />
          {{ $t('PRODUCT.variationDetail') }}
        </template> -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAddMaterial"
              v-if="!comDisFrom"
              >{{ $t('PRODUCT.addMaterial') }}</el-button
            >
          </el-col>
        </el-row>
        <div>
          <el-table
            border
            :data="form.variationMaterialList"
            :max-height="600"
            ref="tables"
            v-table-tab
          >
            <el-table-column
              type="index"
              :label="$t('ui.sn')"
              width="60"
              fixed="left"
              align="center"
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
              :align="item.align || 'center'"
            >
              <template slot="header" slot-scope="{ column }">
                <span v-if="['productName', 'qty'].includes(item.prop)">
                  <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                </span>
                <span v-else>{{ column.label }}</span>
              </template>
              <template slot-scope="scope">
                <template v-if="item.prop === 'productName'">
                  <div class="flexSa" v-if="!comDisFrom">
                    <CommonSelect
                      style="width: 96%"
                      :id="scope.row.productId"
                      :label="scope.row.productName"
                      :title="scope.row.productName"
                      idKey="productId"
                      labelKey="productName"
                      :filterable="true"
                      :options="getCanSelectMaterialList(scope.row)"
                      @change="materialChange($event, scope.row)"
                    >
                      <!-- <template v-slot="{ item }">
                        <span class="select-left-text">{{ item.productName }}</span>
                        <span class="select-right-text">{{ item.internalPartNo }}</span>
                      </template> -->
                    </CommonSelect>
                  </div>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>

                <div v-else-if="item.prop === 'qty'">
                  <div class="flexSa" v-if="!comDisFrom && scope.row.internalPartNo">
                    <el-input-number
                      style="width: 96%"
                      v-model="scope.row.qty"
                      controls-position="right"
                      :precision="3"
                      v-thousandSplit="{ precision: 3 }"
                      :min="0.001"
                      :max="999999.999"
                      @blur="qtyChange(scope.row)"
                      @change="qtyChange(scope.row)"
                    />
                  </div>
                  <span v-else>{{ $numberStr(scope.row.qty, 3) }}</span>
                </div>
                <template v-else-if="item.prop === 'type'"
                  >{{ selectDictLabel(dict.type.mdm_material_type, scope.row.type) }}
                </template>

                <!-- <template v-else-if="item.prop === 'uom'"
                  >{{ selectDictLabel(dict.type.mdm_material_uom, scope.row.uom) }}
                </template> -->

                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('ui.action')"
              align="center"
              min-width="120"
              class-name="small-padding fixed-width"
              fixed="right"
              v-if="!comDisFrom"
            >
              <template slot-scope="scope">
                <div class="flexCen">
                  <i
                    class="el-icon el-icon-delete pointer"
                    style="font-size: 20px; color: #f56c6c"
                    :title="$t('uiBtn.delete')"
                    @click="handleDeleteMaterial(scope.row)"
                  ></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" @click="submitForm" :loading="submitLoading" v-if="!comDisFrom"
        >{{ formData.mixDesignStatus === '2' ? $t('uiBtn.submit') : $t('uiBtn.save') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryMixDesignCanAddMaterialList
  // modifyVariationInTheQuotation
} from '@/api/productManagement/mixDesign'

export default {
  dicts: ['mdm_material_type', 'mdm_material_uom'],
  components: {},
  props: {
    variationTypes: {
      type: Array,
      default: () => []
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {}
    },
    trialMix: {
      type: String,
      default: ''
    },
    curAddIndex: {
      type: Number,
      default: 1
    }
  },
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      btnLoading: false,
      submitLoading: false,
      maxNum: 999999999,
      open: false,
      title: '',
      form: {
        variationMaterialList: []
      },
      // 表单校验
      rules: {
        variation: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PRODUCT.variation')),
            trigger: ['change', 'blur']
          }
        ]
      },
      isDisabled: false,
      customColumns: [],
      isEdit: false,
      activeNames: '1',
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.productCode'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'type',
          label: vm.$t('PRODUCT.materialType'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('ui.uom'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('PRODUCT.qty'),
          visible: true,
          minWidth: 180,
          tooltip: true
        }
      ],
      materialList: [],
      editRowproductId: undefined
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  methods: {
    handleChange(row) {
      this.$set(this.form, 'variation', row.value)
      this.$set(this.form, 'variationShowStr', row.label)
    },
    queryMixDesignCanAddMaterialList() {
      queryMixDesignCanAddMaterialList({ zoneId: this.formData.zoneId }).then((response) => {
        this.materialList = response.data || []
      })
    },
    getCanSelectMaterialList(editRow) {
      const data = this.materialList || []
      return data.filter((item) => {
        if (item.productId === editRow.productId) {
          return true
        }
        if (this.form.variationMaterialList.find((row) => row.productId === item.productId)) {
          return false
        }
        return true
      })
    },
    handleAddMaterial() {
      const item = { timeId: Date.now() }
      this.form.variationMaterialList.push(item)
    },
    handleDeleteMaterial(row) {
      this.form.variationMaterialList.forEach((item, index) => {
        if (item.timeId === row.timeId) {
          this.form.variationMaterialList.splice(index, 1)
        }
      })
    },
    materialChange(item, row) {
      const ivtSpecifications = item.ivtSpecifications || {}
      this.$set(row, 'uom', item.uom)
      this.$set(row, 'productMainId', item.productMainId)
      this.$set(row, 'productId', item.productId)
      this.$set(row, 'internalPartNo', item.internalPartNo)
      this.$set(row, 'productName', item.productName)
      this.$set(row, 'type', ivtSpecifications.type)
      this.$set(row, 'minInMix', ivtSpecifications.minInMix || 0)
      const max = this.$resultOfBoolean(ivtSpecifications.maxInMix)
        ? ivtSpecifications.maxInMix
        : 999999
      this.$set(row, 'maxInMix', max)
      this.$set(row, 'qty', undefined)
      this.$set(row, 'alias', item.alias)
      this.$set(row, 'description', item.description)
      this.$set(row, 'partNo', item.partNo)
      this.$set(row, 'brand', item.brand)
      this.$set(row, 'productType', item.productType)
      this.$set(row, 'productCategoryId', item.productCategoryId)
      this.$set(row, 'productCategoryParentsId', item.productCategoryParentsId)
      this.$set(row, 'includeDecimal', item.includeDecimal)
    },
    qtyChange(row) {
      if (row.qty * 1 > row.maxInMix || row.qty * 1 < row.minInMix) {
        this.msgErrorShow(
          this.$t('PRODUCT.amountLimit')
            .replace('$1', row.productName)
            .replace('$2', row.minInMix)
            .replace('$3', row.maxInMix)
        )
      }
    },
    msgErrorShow(message) {
      const doms = document.getElementsByClassName('el-message')
      let canShow = true
      for (let i = 0; i < doms.length; i++) {
        if (message === doms[i].getElementsByClassName('el-message__content')[0].innerHTML) {
          canShow = false
        }
      }
      if (doms.length === 0 || canShow) {
        this.$modal.msgError(message)
      }
    },

    changeEmployeeNoSwitch(code) {
      this.form[code] = ''
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.clearValidate(code)
        })
      }
    },
    reset() {
      this.form = {
        variationId: undefined,
        variationCode: undefined,
        isAutoVariationCode: this.$store.state.user.autoCode === '3' ? '0' : '1',
        isActive: '1',
        remarks: '',
        variationMaterialList: [],
        createdBy: this.$store.state.user.name
      }
      this.activeNames = '1'
      this.resetForm('form')
    },
    handleAdd(initForm) {
      this.isEdit = false
      this.reset()

      this.$nextTick(() => {
        this.$set(this.form, 'variationType', this.trialMix)
        if (initForm) {
          initForm.variationMaterialList.forEach((item) => {
            delete item.variationMaterialId
            delete item.variationId
            delete item.createdTime
            delete item.modifiedBy
            delete item.modifiedTime
          })
          this.$set(this.form, 'variationType', initForm.variationType)
          this.$set(this.form, 'remarks', initForm.remarks)
          this.$set(this.form, 'variationMaterialList', initForm.variationMaterialList)
        }
        if (this.form.variationType === '2') {
          this.$set(this.form, 'variation', `trialMix-${this.curAddIndex}`)
          this.$set(
            this.form,
            'variationShowStr',
            `${this.$t('PRODUCT.trialMix1')} ${this.curAddIndex}`
          )
        }
      })

      this.isDisabled = false
      this.open = true
      this.title = this.$t('PRODUCT.addVariation')
      this.queryMixDesignCanAddMaterialList()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.isEdit = true
      this.reset()
      this.isDisabled = row.isDisabled ? row.isDisabled : false
      this.open = true
      if (this.comDisFrom) {
        this.title = this.$t('PRODUCT.viewVariation')
      } else {
        this.title = this.$t('PRODUCT.editVariation')
      }
      this.queryMixDesignCanAddMaterialList()
      this.form = { ...this.form, ...JSON.parse(JSON.stringify(row)) }
    },

    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.$emit('closed')
      this.reset()
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 500)
      this.$refs.form.validate((valid) => {
        if (valid) {
          const row = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
          if (row.variationMaterialList.length <= 0) {
            this.$modal.msgError(this.$t('PRODUCT.variationDetailReq'))
            return
          }

          const productNameReq = row.variationMaterialList.find((item) => !item.productName)
          if (productNameReq) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
            )
            return
          }

          const qtyReq = row.variationMaterialList.find((item) => !this.$resultOfBoolean(item.qty))
          if (qtyReq) {
            this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.qty')))
            return
          }

          const errItem = row.variationMaterialList.find((item) => {
            return item.qty * 1 > item.maxInMix || item.qty * 1 < item.minInMix
          })
          if (errItem) {
            this.msgErrorShow(
              this.$t('PRODUCT.amountLimit')
                .replace('$1', errItem.productName)
                .replace('$2', errItem.minInMix)
                .replace('$3', errItem.maxInMix)
            )
            return
          }
          if (this.isEdit) {
            this.$emit('editRow', row)
            this.open = false
            /* if (this.formData.mixDesignStatus === '2') {
              this.$modal
                .confirm(this.$t('ui.submitPageConfirm'))
                .then((response) => {
                  this.submitLoading = true
                  const params = {
                    mixDesignId: this.formData.mixDesignId,
                    variationList: [row]
                  }
                  return modifyVariationInTheQuotation(params)
                })
                .then((response) => {
                  console.log(response)
                  this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
                  this.submitLoading = false
                  this.open = false
                  const data = response.data || {}
                  const variationList = data.variationList || []
                  if (variationList[0]) {
                    this.$emit('editRow', variationList[0], false)
                  }
                })
                .catch(() => {
                  this.submitLoading = false
                })
            } else {
              this.$emit('editRow', row)
              this.open = false
            } */
          } else {
            row.timeId = Date.now()
            this.$emit('addRow', row)
            this.open = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.collapse-item-title-icon {
  margin-right: 4px;
}
.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
    margin-right: 10px;
  }
}
.dimension-mm {
  display: flex;
  .dimension-mm-input {
    flex: 1;
    padding: 0 10px;
  }
}
</style>
