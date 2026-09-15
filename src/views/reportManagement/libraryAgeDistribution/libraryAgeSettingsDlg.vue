<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('menu.libraryAgeSettings')"
    :visible.sync="visible"
    width="600px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleAddBtn"
          :loading="btnLoading"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-if="tableList.length < 10"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
    </el-row>
    <el-table
      border
      ref="tables"
      class="mt10"
      :data="tableList"
      @sort-change="handleSortChange"
      :max-height="tableMaxHeight"
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
        :min-width="getMinWidth(item)"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot="header" slot-scope="{ column }">
          <span v-if="['days'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'days'">
            <el-input-number
              style="width: 98%"
              v-model="scope.row.days"
              controls-position="right"
              :precision="0"
              v-thousandSplit="{ precision: 0 }"
              :min="1"
              :max="999"
            />
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="flexStart">
            <div class="flexCen flex-1">
              <i
                class="el-icon el-icon-delete pointer"
                style="font-size: 20px; color: #f56c6c"
                :title="$t('uiBtn.delete')"
                @click="handleDelRow(scope.$index, scope.row)"
              ></i>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button
        type="primary"
        :loading="submitLoading"
        :disabled="tableList.length <= 0"
        @click="submit"
        >{{ $t('uiBtn.save') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/inventoryManagement/lang/index'
import {
  queryStorageDurationSetting,
  saveStorageDurationSetting
} from '@/api/reportManagement/libraryAgeDistribution'

export default {
  dicts: ['i_stock_certificate_document_type', 'i_inventory_type'],
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      saveKey: '2',
      savePath: 'reportMTable',
      loading: false,
      // 总条数
      total: 0,
      tableList: [],
      rowIdKey: 'businessPartnerMainId',
      visible: false,
      columns: [
        {
          prop: 'days',
          label: vm.$t('PURCHASE.daysOfLibraryAge'),
          visible: true,
          minWidth: 180,
          fixedWidth: 140,
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      form: {
        productCategoryId: []
      },
      productCategoryList: [],
      currentIds: [],
      btnLoading: false,
      submitLoading: false
    }
  },
  computed: {},
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    async handleOpen(row) {
      this.tableList = []
      this.visible = true
      this.queryStorageDurationSetting()
    },
    handleAddBtn() {
      this.btnLoading = true
      this.tableList.push({ days: undefined })
      setTimeout(() => {
        this.btnLoading = false
      }, 200)
    },
    queryStorageDurationSetting() {
      queryStorageDurationSetting({}).then((res) => {
        const { storageDurationSettingList } = res.data
        this.tableList = storageDurationSettingList || []
      })
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    // 行删除
    handleDelRow(index, row) {
      this.tableList.splice(index, 1)
      // this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
      // })
    },
    closed() {},
    submit() {
      const days = this.tableList.some((x) => !this.$resultOfBoolean(x.days))
      if (days) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.daysOfLibraryAge'))
        )
        return
      }
      const repeat = {}
      const repeatList = this.tableList.filter((x) => {
        if (repeat[x.days]) {
          return true
        }
        repeat[x.days] = true
        return false
      })
      if (repeatList.length > 0) {
        this.$modal.msgError(
          this.$t('PURCHASE.daysOfLibraryAgeTip').replace('$1', repeatList[0].days)
        )
        return
      }
      this.submitLoading = true
      saveStorageDurationSetting({ storageDurationSettingList: this.tableList })
        .then((res) => {
          setTimeout(() => {
            this.submitLoading = false
          }, 1000)
          this.visible = false
          this.$emit('onSuccess')
        })
        .catch(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.right-title {
  flex: 1;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  span {
    display: inline-block;
    max-width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
