<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="title"
    :visible.sync="open"
    width="1100px"
    append-to-body
    @closed="closed"
  >
    <el-table border :data="tableList" :max-height="600" ref="tables">
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
        <template slot-scope="scope">
          <template v-if="item.prop === 'type'"
            >{{ selectDictLabel(dict.type.mdm_mix_design_type, scope.row.type) }}
          </template>
          <template v-else-if="item.prop === 'density'"
            >{{ $numberStr(scope.row.density, 2) }}
          </template>
          <template v-else-if="item.prop === 'standardProduct'">
            <!-- <el-tag size="medium" v-if="scope.row.standardProduct === '1'">{{ $t('ui.y') }}</el-tag>
            <el-tag size="medium" v-if="scope.row.standardProduct === '0'" type="info">{{
              $t('ui.n')
            }}</el-tag> -->
            {{
              selectDictLabel(dict.type.mdm_mix_design_standard_product, scope.row.standardProduct)
            }}
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="mt20 mr20">
      <el-row>
        <el-form-item :label="$t('PRODUCT.addProductionLine1')" prop="plantNames">
          <SelectInput
            :value="form.plantNames"
            @clear="plantInputClear"
            clearable
            :disabled="false"
            @click="plantInputClick"
          />
        </el-form-item>
      </el-row>
    </el-form>
    <selectPlant
      ref="select"
      :zoneId="zoneId"
      :isInputSelect="true"
      @select="plantSelect"
      :type="type"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" @click="submitForm" :loading="btnLoading"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import selectPlant from './selectPlant'
import pageMixin from '@/mixins/tableMinx'
import { addProductionLineToMixDesign } from '@/api/productManagement/mixDesign'
export default {
  dicts: ['mdm_mix_design_type', 'mdm_mix_design_standard_product'],
  name: 'AuthUser',
  mixins: [pageMixin],
  components: { selectPlant },
  props: {},
  data() {
    const vm = this
    return {
      open: false,
      btnLoading: false,
      title: '',
      form: {
        plantNames: ''
      },
      rules: {
        plantNames: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PRODUCT.addProductionLine1')),
            trigger: ['change']
          }
        ]
      },
      // 列信息
      columns: [
        {
          prop: 'mixDesignCode',
          label: vm.$t('PRODUCT.mixDesignCode'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'mixDesignName',
          label: vm.$t('PRODUCT.mixDesignName'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'productCode',
          label: vm.$t('PRODUCT.productCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'strengthClassShowStr',
          label: vm.$t('PRODUCT.strengthClass'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'maxBatchLoadShowStr',
          label: vm.$t('PRODUCT.maxBatchLoad'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'type',
          label: vm.$t('ui.type'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        {
          prop: 'standardProduct',
          label: vm.$t('PRODUCT.standardProduct'),
          minWidth: 180,
          visible: true,
          tooltip: true
        },
        {
          prop: 'dischargeFormula',
          label: vm.$t('PRODUCT.dischargeFormula'),
          minWidth: 180,
          visible: true,
          tooltip: true
        },
        {
          prop: 'slump',
          label: vm.$t('PRODUCT.slump'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'slumpMin',
          label: vm.$t('PRODUCT.minAcceptableSlump'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'slumpMax',
          label: vm.$t('PRODUCT.maxAcceptableSlump'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'dcType',
          label: vm.$t('PRODUCT.dcType'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'exposureClass',
          label: vm.$t('PRODUCT.exposureClass'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'clClass',
          label: vm.$t('PRODUCT.clClass'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        {
          prop: 'cementType',
          label: vm.$t('PRODUCT.cementType'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'cementStrengthClass',
          label: vm.$t('PRODUCT.cementStrengthClass'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'nominalAggregateMax',
          label: vm.$t('PRODUCT.maxNominalAggregate'),
          minWidth: 210,
          visible: true,
          tooltip: true
        },
        {
          prop: 'specialProperties',
          label: vm.$t('PRODUCT.specialProperties'),
          minWidth: 180,
          visible: true,
          tooltip: true
        }
      ],
      // 用户表格数据
      tableList: [],
      plantList: [],
      type: '',
      zoneId: ''
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  created() {},
  methods: {
    handleOpen(list, type, zoneId) {
      this.open = true
      this.tableList = list
      this.type = type
      this.zoneId = zoneId
      this.title = this.$t('PRODUCT.assignProductionLine2')
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.plantList = []
      this.form.plantNames = ''
      this.resetForm('form')
    },
    // 返回按钮
    handleClose() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/system/role' })
    },
    /** 打开授权用户表弹窗 */
    plantInputClick() {
      this.$refs.select.show(this.plantList)
    },
    plantInputClear() {
      this.plantList = []
      this.form.plantNames = ''
    },
    plantSelect(rows) {
      this.plantList = rows
      this.form.plantNames = rows.map((item) => item.productionLineName).join(', ')
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const mixDesignIdList = this.tableList.map((item) => item.mixDesignId)
          const productionLineIdList = this.plantList.map((item) => item.productionLineId)
          this.$modal
            .confirm(this.$t('ui.submitPageConfirm2'))
            .then(() => {
              this.btnLoading = true
              return addProductionLineToMixDesign({
                mixDesignIdList,
                productionLineIdList
              })
            })
            .then((res) => {
              this.btnLoading = false
              this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
              if (res.code === 200) {
                this.cancel()
                this.$emit('onSuccess')
              }
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>
