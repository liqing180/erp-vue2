<template>
  <div class="top-right-btn">
    <el-row type="flex" align="middle">
      <!-- effect="dark" -->
      <el-tooltip
        class="item ml10"
        :content="$t('RightToolbar.refreshFrequency')"
        placement="top"
        v-if="refreshTimeSaveKey"
      >
        <!--  -->
        <!-- el-icon-alarm-clock el-icon-time -->
        <!-- <el-progress type="circle" :percentage="25"></el-progress> -->
        <el-dropdown trigger="click" @command="handleSetRefreshTime">
          <!-- <el-button size="mini" circle icon="el-icon-time"> </el-button> -->
          <div class="refreshTimeBtn pointer">
            <el-progress
              type="circle"
              :width="28"
              :stroke-width="1"
              :show-text="false"
              :percentage="comPercentage"
              v-if="refreshTimeSaveKey"
            ></el-progress>
            <i class="el-icon-time refreshTimeIcon"></i>
          </div>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item of timeOptions"
              :key="item.value"
              :disabled="autoRefreshTime === item.value"
              :command="item.value"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-tooltip>
      <el-tooltip
        v-if="showRefreshBtn"
        class="item"
        :content="$t('RightToolbar.refresh')"
        placement="top"
      >
        <el-button
          size="mini"
          style="margin-left: 10px"
          circle
          icon="el-icon-refresh"
          @click="refresh()"
        />
      </el-tooltip>
      <el-tooltip
        class="item"
        :content="$t('RightToolbar.setColumns')"
        placement="top"
        v-if="columns"
      >
        <el-button size="mini" circle icon="el-icon-menu" @click="showColumn()" />
      </el-tooltip>
    </el-row>
    <el-dialog
      :close-on-click-modal="true"
      width="700px"
      v-dialogDrag
      :title="title"
      :visible.sync="open"
      append-to-body
      @close="dialogClose"
    >
      <!-- <i class="el-icon-refresh-left"></i> -->
      <div slot="title">
        <span>{{ title }}</span>
        <div class="fr" style="margin-right: 60px">
          <el-button
            @click="resetColumnsCopy"
            type="primary"
            size="mini"
            icon="el-icon-refresh-left"
            :title="$t('uiBtn.reset')"
          ></el-button>
        </div>
      </div>
      <el-table
        ref="dragTable"
        border
        :data="columnsCopy"
        row-key="timeTemp"
        style="width: 100%"
        max-height="600"
      >
        <el-table-column
          :min-width="200"
          prop="label"
          :label="$t('RightToolbar.columnName')"
          show-overflow-tooltip
          class-name="allowDrag"
        >
        </el-table-column>
        <el-table-column
          prop="visible"
          :label="$t('RightToolbar.show')"
          align="center"
          :min-width="160"
          class-name="allowDrag"
        >
          <template slot-scope="scope">
            <div style="cursor: pointer" @click.self="visibleCellClick(scope.row)">
              <el-checkbox
                v-model="scope.row.visible"
                @change="visibleCellChange(scope.row)"
              ></el-checkbox>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="fixed"
          :label="$t('RightToolbar.fixed')"
          align="center"
          :min-width="160"
          class-name="allowDrag"
        >
          <template slot-scope="scope">
            <div style="cursor: pointer" @click.self="fixedCellClick(scope.row)">
              <el-checkbox
                v-model="scope.row.fixed"
                :disabled="disFixedMax && !scope.row.fixed"
                @change="fixedCellChange(scope.row)"
              ></el-checkbox>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { save } from '@/api/system/behaviour.js'
import locale from './locale.js'
import Sortable from 'sortablejs'
export default {
  name: 'RightToolbar',
  data() {
    return {
      // 弹出层标题
      title: this.$t('RightToolbar.setColumns'),
      // 是否显示弹出层
      open: false,
      columnsCopy: [],
      sortableDom: undefined,
      timeOptions: [
        // { label: '15s', value: '15' },
        // { label: '20s', value: '20' },
        // { label: '30s', value: '30' },
        // { label: '40s', value: '40' },
        { label: '1min', value: '60' },
        // { label: '2min', value: '120' },
        { label: '3min', value: '180' },
        { label: '5min', value: '300' }
      ],
      autoRefreshTime: '180',
      autoRefreshSecond: 0,
      timer: undefined
    }
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true
    },
    showSearchBtn: {
      type: Boolean,
      default: true
    },
    showRefreshBtn: {
      type: Boolean,
      default: true
    },

    columns: {
      type: Array
    },
    columnsInit: {
      type: Array,
      default() {
        return []
      }
    },
    saveKey: {
      type: String,
      default: ''
    },
    savePath: {
      type: String,
      default: ''
    },
    refreshTimeSaveKey: {
      type: String,
      default: ''
    }
  },

  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },

  created() {
    if (this.refreshTimeSaveKey) {
      this.autoRefreshTime = this.$$initRefreshTime(this.refreshTimeSaveKey)
      this.autoRefreshSetInterval()
    }
  },
  computed: {
    disFixedMax() {
      let count = 0
      this.columnsCopy.forEach((item) => {
        if (item.fixed) {
          count += 1
        }
      })
      return count >= 4
    },
    comPercentage() {
      return parseInt((this.autoRefreshSecond / this.autoRefreshTime) * 100)
    }
  },
  activated() {
    if (this.refreshTimeSaveKey) {
      this.autoRefreshTime = this.$$initRefreshTime(this.refreshTimeSaveKey)
      this.autoRefreshSetInterval()
    }
  },
  deactivated() {
    // 页面被缓存时调用
    this.clearTimer()
  },
  beforeDestroy() {
    // 页面销毁时调用
    this.clearTimer()
  },
  methods: {
    autoRefreshSetInterval() {
      if (this.timer) {
        this.clearTimer()
      }
      this.timer = setInterval(() => {
        this.autoRefreshSecond++
        if (this.autoRefreshSecond > this.autoRefreshTime) {
          this.autoRefreshSecond = 0
          this.$emit('autoRefresh')
        }
      }, 1 * 1000)
    },
    clearTimer() {
      this.autoRefreshSecond = 0
      clearInterval(this.timer)
      this.timer = null
    },
    handleSetRefreshTime(time) {
      this.autoRefreshTime = time
      this.$$refreshTimeSave(this.refreshTimeSaveKey, time)
      this.autoRefreshSecond = 0
      /* this.$message({
        message: this.$t('ui.layoutSizeSuccess'),
        type: 'success'
      }) */
    },
    $$initRefreshTime(saveKey) {
      const path = this.savePath || this.$route.name
      const vm = this
      const RefreshTimeData = vm.$cache.local.getJSON('autoRefreshTimeData') || {}

      if (RefreshTimeData && RefreshTimeData[`${path}${saveKey}`]) {
        return RefreshTimeData[`${path}${saveKey}`]
      } else {
        return '60'
      }
    },
    $$refreshTimeSave(saveKey, autoRefreshTime) {
      const vm = this
      const param = {
        activity: saveKey,
        data: null,
        autoRefreshTime: autoRefreshTime,
        path: this.savePath || this.$route.name // vm.$route.meta.srcPath
      }
      const RefreshTimeData = this.$cache.local.getJSON('autoRefreshTimeData') || {}
      RefreshTimeData[`${param.path}${param.activity}`] = autoRefreshTime
      this.$cache.local.setJSON('autoRefreshTimeData', RefreshTimeData)

      // vm.table_loading = true
      return save(param)
        .then((res) => {
          if (res.code === 200) {
            // let results = data.msg
          } else {
            vm.$modal.msgError(res.msg)
          }
        })
        .catch((err) => {
          window.console.error(err)
        })
    },
    // 搜索
    toggleSearch() {
      this.$emit('update:showSearch', !this.showSearch)
    },
    // 刷新
    refresh() {
      this.$emit('queryTable')
    },
    visibleCellClick(row) {
      this.$set(row, 'visible', !row.visible)
      this.visibleCellChange(row)
    },
    visibleCellChange(row) {
      if (!row.visible) {
        this.$set(row, 'fixed', false)
      }
    },
    fixedCellClick(row) {
      if (this.disFixedMax && !row.fixed) {
        return
      }
      this.$set(row, 'fixed', !row.fixed)
      this.fixedCellChange(row)
    },
    fixedCellChange(row) {
      if (row.fixed) {
        this.$set(row, 'visible', true)
      }
    },
    setDragTable() {
      this.destroyDraggable()
      const el = this.$refs.dragTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortableDom = Sortable.create(el, {
        handle: '.allowDrag',
        animation: 100,
        ghostClass: 'blue-background-class',
        onEnd: (evt) => {
          if (evt.oldIndex === evt.newIndex) return
          const targetRow = this.columnsCopy.splice(evt.oldIndex, 1)[0]
          this.columnsCopy.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
    destroyDraggable() {
      if (this.sortableDom) {
        this.sortableDom.destroy()
        this.sortableDom = undefined
      }
    },
    // 打开显隐列dialog
    showColumn() {
      this.open = true
      const timer = new Date().getTime()
      this.columnsCopy = this.columns.map((item, index) => {
        return {
          prop: item.prop,
          fixed: item.fixed,
          visible: item.visible,
          label: item.label,
          timeTemp: timer + index
        }
      })
      setTimeout(() => {
        this.setDragTable()
      }, 200)
    },
    resetColumnsCopy() {
      const timer = new Date().getTime()
      const list = JSON.parse(JSON.stringify(this.columnsInit))
      this.columnsCopy = list.map((item, index) => {
        return {
          prop: item.prop,
          fixed: item.initFixed,
          visible: item.initVisible,
          label: item.label,
          timeTemp: timer + index
        }
      })
      setTimeout(() => {
        this.setDragTable()
      }, 200)
    },

    dialogClose() {
      const hidePropList = []
      const fixedPropList = []
      const colSortData = {}
      this.columnsCopy.forEach((item, index) => {
        colSortData[item.prop] = index
        if (!item.visible) {
          hidePropList.push(item.prop)
        }
        if (item.fixed) {
          fixedPropList.push(item.prop)
        }
      })
      this.columns.forEach((item) => {
        this.$set(item, 'colSortIndex', colSortData[item.prop])
        if (hidePropList.includes(item.prop)) {
          this.$set(item, 'visible', false)
        } else {
          this.$set(item, 'visible', true)
        }
        if (fixedPropList.includes(item.prop)) {
          this.$set(item, 'fixed', true)
        } else {
          this.$set(item, 'fixed', false)
        }
      })
      this.$$tableCellVisibleSave(this.saveKey, hidePropList, fixedPropList, colSortData)
      this.$emit('onSuccess')
    },
    $$tableCellVisibleSave(saveKey, hidePropList, fixedPropList, cellSortObj) {
      const vm = this
      const param = {
        activity: saveKey,
        data: null,
        tableCellHide: JSON.stringify(hidePropList),
        tableCellFixed: JSON.stringify(fixedPropList),
        cellSortObj: JSON.stringify(cellSortObj),
        path: this.savePath || this.$route.name // vm.$route.meta.srcPath
      }
      const hideCell = this.$cache.local.getJSON('tableCellHideData') || {}
      const fixedCell = this.$cache.local.getJSON('tableCellFixedData') || {}
      const sortCell = this.$cache.local.getJSON('tableCellSortData') || {}

      hideCell[`${param.path}${param.activity}`] = hidePropList
      fixedCell[`${param.path}${param.activity}`] = fixedPropList
      sortCell[`${param.path}${param.activity}`] = cellSortObj
      this.$cache.local.setJSON('tableCellHideData', hideCell)
      this.$cache.local.setJSON('tableCellFixedData', fixedCell)
      this.$cache.local.setJSON('tableCellSortData', sortCell)

      // vm.table_loading = true
      return save(param)
        .then((res) => {
          if (res.code === 200) {
            // let results = data.msg
          } else {
            vm.$modal.msgError(res.msg)
          }
        })
        .catch((err) => {
          window.console.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.refreshTimeBtn {
  display: flex;
  width: 28px;
  height: 28px;
  overflow: hidden;
  // margin-bottom: -2px;
  position: relative;
}
.refreshTimeIcon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -7px);
}
.show-search-arrow {
  transition: transform 0.3s;
  font-weight: 300;
}
.is-show {
  transform: rotate(90deg);
}
.is-hide {
  transform: rotate(270deg);
}
::v-deep .el-transfer__button {
  border-radius: 50%;
  padding: 12px;
  display: block;
  margin-left: 0px;
}
::v-deep .el-transfer__button:first-child {
  margin-bottom: 10px;
}
</style>
