<template>
  <div class="pb20">
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane v-for="item in comTabs" :name="item.key" :key="'Tabs' + item.key">
          <span slot="label">
            <span>{{ item.label }}</span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <div v-show="activeName === '1'">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            :disabled="canSelectVariationTypes.length <= 0 || !formData.zoneId"
            size="mini"
            @click="handleAddStandard"
            v-if="!comDisFrom"
            >{{ $t('PRODUCT.addVariation') }}</el-button
          >
        </el-col>
      </el-row>
      <el-table
        border
        :data="standardTableList"
        :max-height="600"
        @row-dblclick="rowDblclick"
        ref="tables"
        style="cursor: pointer"
      >
        <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
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
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'isActive'">
              <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
              <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                $t('uiBtn.inactive')
              }}</el-tag>
            </template>
            <template v-else-if="item.prop === 'createdTime'">{{
              parseTime(scope.row.createdTime, fmtForYmdhms)
            }}</template>
            <template v-else-if="item.prop === 'modifiedTime'">{{
              parseTime(scope.row.modifiedTime, fmtForYmdhms)
            }}</template>
            <template v-else-if="item.prop === 'variation'"
              >{{
                scope.row.variationShowStr ||
                selectDictLabel(dict.type.mdm_variation, scope.row.variation)
              }}
            </template>

            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('ui.action')"
          key="action"
          align="center"
          width="140"
          class-name="small-padding fixed-width"
          fixed="right"
          v-if="!comDisFrom"
        >
          <template slot-scope="scope">
            <div class="flexStart" style="padding-left: 20px">
              <!-- <i
                class="el-icon-edit primary-pointer mr10"
                style="font-size: 20px"
                :title="$t('uiBtn.edit')"
                @click="rowDblclick(scope.row)"
              ></i> -->
              <i
                class="el-icon-document-add primary-pointer mr10"
                style="font-size: 20px"
                :title="$t('PRODUCT.createMixDesign')"
                v-if="scope.row.variationId && isShowCopy"
                @click="copyMinDesign(scope.row)"
              ></i>

              <i
                class="el-icon-document-copy primary-pointer mr10"
                style="font-size: 20px"
                :title="$t('PRODUCT.copyVariation')"
                v-if="!comDisFrom && canSelectVariationTypes.length > 0"
                @click="copyVariation(scope.row)"
              ></i>

              <i
                class="el-icon-delete pointer"
                style="font-size: 20px; color: #f56c6c"
                :title="$t('uiBtn.delete')"
                @click="handleDelRow(scope.$index, scope.row)"
                v-if="!scope.row.variationId"
              ></i>

              <svg-icon
                icon-class="pdf"
                class="primary-pointer"
                style="font-size: 20px"
                @click="handlePreviewPDF(scope.row)"
                v-if="!scope.row.pdfLoading"
              />
              <i
                v-if="scope.row.pdfLoading"
                class="el-icon el-icon-loading"
                style="font-size: 20px; color: #409eff"
              ></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-show="activeName === '2'">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            :disabled="!formData.zoneId"
            size="mini"
            @click="handleAddTrialMix"
            v-if="!comDisFrom"
            >{{ $t('PRODUCT.addVariation') }}</el-button
          >
        </el-col>
      </el-row>

      <el-table
        border
        :data="trialMixTableList"
        :max-height="600"
        @row-dblclick="rowDblclick"
        ref="tables"
        style="cursor: pointer"
      >
        <!-- <el-table-column v-if="!comDisFrom" type="selection" width="55" align="center" /> -->
        <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in columns2"
          :key="item.prop + item.colSortIndex"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :show-overflow-tooltip="item.tooltip"
          :fixed="item.fixed"
          :sortable="item.sortable"
          :align="item.align || 'left'"
        >
          <template slot="header" slot-scope="{ column }">
            <span v-if="['variation'].includes(item.prop)">
              <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
            </span>
            <span v-else>{{ column.label }}</span>
          </template>
          <template slot-scope="scope">
            <template v-if="item.prop === 'isActive'">
              <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
              <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                $t('uiBtn.inactive')
              }}</el-tag>
            </template>
            <template v-else-if="item.prop === 'createdTime'">{{
              parseTime(scope.row.createdTime, fmtForYmdhms)
            }}</template>
            <template v-else-if="item.prop === 'modifiedTime'">{{
              parseTime(scope.row.modifiedTime, fmtForYmdhms)
            }}</template>
            <template v-else-if="item.prop === 'variation'"
              >{{ scope.row.variationShowStr }}
            </template>
            <template v-else-if="item.prop === 'trialMixNo'"
              >{{
                scope.row.trialMixNo
                  ? `${scope.row.trialMixNo} - ${scope.row.qualityTestStatusShowStr}`
                  : ''
              }}
            </template>

            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('ui.action')"
          key="action"
          align="center"
          width="100"
          class-name="small-padding fixed-width"
          fixed="right"
          v-if="!comDisFrom"
        >
          <template slot-scope="scope">
            <div class="flexStart" style="padding-left: 20px">
              <i
                class="el-icon-edit primary-pointer mr10"
                style="font-size: 20px"
                :title="$t('uiBtn.edit')"
                @click="rowDblclick(scope.row)"
              ></i>
              <i
                class="el-icon-delete pointer"
                style="font-size: 20px; color: #f56c6c"
                :title="$t('uiBtn.delete')"
                @click="handleDelRow(scope.$index, scope.row)"
                v-if="!scope.row.variationId"
              ></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <addVariationPage
      :variationTypes="canSelectVariationTypes"
      ref="fromPageRef"
      @addRow="addRow"
      @editRow="editRow"
      @closed="closed"
      :comDisFrom="comDisFrom"
      :formData="formData"
      :trialMix="trialMix"
      :curAddIndex="trialMixTableList.length + 1"
    />
  </div>
</template>

<script>
// import { addVariationMsgFromMixDesign } from '@/api/productManagement/mixDesign'
import pageMixin from '@/mixins/tableMinx'
import addVariationPage from '@/views/productManagement/mixDesign/components/addVariationPage.vue'
// import { getToken } from '@/utils/auth'
import { preview } from '@/api/productManagement/mixDesign'

export default {
  dicts: ['mdm_variation'],
  mixins: [pageMixin],
  components: {
    addVariationPage
  },
  props: {
    comDisFrom: {
      type: Boolean,
      default: false
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  watch: {
    'formData.variationList': {
      immediate: true,
      handler: function () {
        this.tableList = this.formData.variationList
        this.changeTableList()
      }
    },
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '9',
      tableList: [],
      selectList: [],
      ids: [],
      multiple: true,
      columns: [
        {
          prop: 'variation',
          label: vm.$t('PRODUCT.variation'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: false
        },
        {
          prop: 'variationCode',
          label: vm.$t('PRODUCT.variationCode'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          width: 200,
          visible: true,
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
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
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
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      columns2: [
        {
          prop: 'variation',
          label: vm.$t('PRODUCT.variation'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: false
        },
        {
          prop: 'variationCode',
          label: vm.$t('PRODUCT.variationCode'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          width: 200,
          visible: true,
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
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
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
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      editRowVariation: undefined,
      trialMix: '1',
      activeName: '1'
    }
  },
  computed: {
    isShowCopy() {
      if (this.formData.mixDesignId) {
        return this.checkPermi(['productManagement:mixDesign:add'])
      }
      return false
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    standardTableList() {
      return this.tableList.filter((item) => item.variationType === '1')
    },
    trialMixTableList() {
      return this.tableList.filter((item) => item.variationType === '2')
    },
    comTabs() {
      const list = [
        {
          label: this.$t('PRODUCT.standard'),
          key: '1'
        },
        {
          label: this.$t('PRODUCT.trialMix1'),
          key: '2'
        }
      ]
      return list.filter((item) => item)
    },
    canSelectVariationTypes() {
      const data = this.dict.type.mdm_variation || []
      return data.filter((item) => {
        if (item.value === this.editRowVariation) {
          return true
        }
        if (this.standardTableList.find((row) => row.variation === item.value)) {
          return false
        }
        return true
      })
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleTabClick() {},
    copyMinDesign(row) {
      this.$router.push({
        path: '/productManagement/addMixDesign',
        query: {
          timeId: Date.now(),
          id: this.formData.mixDesignId,
          vId: row.variationId
        }
      })
    },
    copyVariation(row) {
      this.$refs.fromPageRef.handleAdd(JSON.parse(JSON.stringify(row)))
    },

    handlePreviewPDF(row) {
      // const token = getToken()
      const params = { ...this.formData, variationList: [row] }
      this.$set(row, 'pdfLoading', true)
      preview(params)
        .then((res) => {
          const findRow = this.tableList.find((item) => item.timeId === row.timeId)
          this.$set(findRow, 'pdfLoading', false)
          window.open(res.msg || '', 'print')
          /* const fileID = res.data || ''
          if (fileID) {
            const myUrl =
              process.env.VUE_APP_BASE_API +
              '/system/oss/filePreview/' +
              `${fileID}` +
              '?token=' +
              `${token}`
            window.open(myUrl, 'print')
          } */
        })
        .catch(() => {
          const findRow = this.tableList.find((item) => item.timeId === row.timeId)
          this.$set(findRow, 'pdfLoading', false)
        })
    },
    initColumnWidth() {
      /* const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
        }
      }) */
    },
    addRow(row) {
      this.tableList.push(row)
      // this.getRowPQMsg(row)
    },
    editRow(row, isGetMsg = true) {
      this.tableList.forEach((item, index) => {
        if (item.timeId === row.timeId) {
          this.tableList[index].queryTime = undefined
          this.tableList.splice(index, 1, row)
          if (isGetMsg) {
            // this.getRowPQMsg(row)
          }
        }
      })
    },
    /* getRowPQMsg(row) {
      const timer = Date.now()
      row.queryTime = timer
      addVariationMsgFromMixDesign({
        mixDesignId: this.formData.mixDesignId,
        variationList: [row]
      }).then((res) => {
        if (timer !== row.queryTime) return
        const data = res.data || {}
        const variationData = (data.variationList || [])[0] || {}
        const newChidList = variationData.variationMaterialList || []

        const changeRow = this.tableList.find((item) => item.timeId === row.timeId)
        if (changeRow) {
          const chidList = changeRow.variationMaterialList || []
          newChidList.forEach((child) => {
            const changeChild = chidList.find((p) => child.timeId + '' === p.timeId + '')
            if (changeChild) {
              this.$set(changeChild, 'purchaseQuotationNo', child.purchaseQuotationNo)
              this.$set(changeChild, 'dateQuoted', child.dateQuoted)
              this.$set(changeChild, 'purchaseUnitPrice', child.purchaseUnitPrice)
              this.$set(changeChild, 'referenceAmount', child.referenceAmount)
              this.$set(changeChild, 'unitCost', child.unitCost)
              this.$set(changeChild, 'totalCost', child.totalCost)
            }
          })

          this.tableList.forEach((item, index) => {
            if (item.timeId === changeRow.timeId) {
              this.tableList.splice(index, 1, changeRow)
            }
          })
        }
      })
    }, */
    closed() {
      this.editRowVariation = undefined
    },
    handleAddStandard() {
      this.trialMix = '1'
      this.$refs.fromPageRef.handleAdd()
    },
    handleAddTrialMix() {
      this.trialMix = '2'
      this.$refs.fromPageRef.handleAdd()
    },
    /** 修改按钮操作 */
    rowDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.trialMix = row.variationType
      this.editRowVariation = row.variation
      this.$refs.fromPageRef.handleUpdate(row)
    },
    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        const deleteIdex = this.tableList.findIndex((item) => item.timeId === row.timeId)
        this.tableList.splice(deleteIdex, 1)
      })
      this.$nextTick(() => {
        this.trialMixTableList.forEach((item, index) => {
          if (
            !item.variationId &&
            item.variationType === '2' &&
            item.variation &&
            item.variation.includes('trialMix-')
          ) {
            this.$set(item, 'variation', `trialMix-${index + 1}`)
            this.$set(item, 'variationShowStr', `${this.$t('PRODUCT.trialMix1')} ${index + 1}`)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-content {
  float: right;
  display: flex;
  justify-content: center;
  margin-right: 20px;
  // height: 40px;
  line-height: 28px;
  font-weight: 600;
  color: #606266;
  font-size: 12px;
}
</style>
