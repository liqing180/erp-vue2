<template>
  <el-dialog
    key="reminderDlg"
    v-dialogDrag
    :title="$t('reminder.reminderTitle')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane name="first">
        <span slot="label">{{ $t('reminder.reminder') }}</span>
        <!-- <comnReminder v-if="isFirst" :row-data="rowData" :is-base-on-task="isBaseOnTask" @onSubmit="submitHandler" @onBack="backHandler"></comnReminder> -->
        <!-- // https://www.tapd.cn/53232180/bugtrace/bugs/view?bug_id=1153232180001006036 -->
        <comnReminder
          :row-data="rowData"
          :is-base-on-task="isBaseOnTask"
          @onSubmit="submitHandler"
          @onBack="backHandler"
          ref="first"
        ></comnReminder>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label">{{ $t('reminder.reminderHistory') }}</span>
        <comnReminderHistory
          ref="second"
          :row-data="rowData"
          :cur-path="curPath"
          class="reminder-box"
          @onBack="backHandler"
        ></comnReminderHistory>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import locale from './locale'
import comnReminder from './comnReminder.vue'
import comnReminderHistory from './comnReminderHistory.vue'
export default {
  directives: {},
  components: {
    comnReminder,
    comnReminderHistory
  },
  props: {
    isBaseOnTask: {
      type: [Boolean],
      default: false
    },
    curPath: {
      type: [String],
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      activeName: 'first',
      rowData: {}
    }
  },
  computed: {},
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    // handleClick(tab, event) {
    handleClick() {
      if (this.activeName === 'second') {
        this.$refs[this.activeName] && this.$refs[this.activeName].init()
      }
    },
    handleOpen(row) {
      const vm = this
      this.visible = true
      this.rowData = row
      vm.activeName = 'first'
      this.$nextTick(() => {
        this.$refs[this.activeName] && this.$refs[this.activeName].init()
      })
    },
    closed() {
      this.visible = false
    },
    submitHandler() {
      this.$emit('onSuccess')
      this.visible = false
    },
    backHandler() {
      this.visible = false
    }
  }
}
</script>

<style scope>
.reminder-box .sub-content {
  margin-top: -30px;
  padding: 0;
}
</style>
